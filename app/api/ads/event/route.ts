import { NextResponse } from 'next/server'
import { adEventSchema } from '@/lib/validations/api-schemas'

// In-memory anti-fraud rate limit tracking per session
const recentEvents = new Map<string, number>()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = adEventSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid ad telemetry payload', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { placementId, eventType, sessionId, portalId, gameId, adProvider } = parsed.data
    const userAgent = request.headers.get('user-agent') || ''

    // Anti-fraud 1: Detect automated bot user agents
    const isBot = /bot|crawler|spider|crawling|headlesschrome/i.test(userAgent)
    if (isBot) {
      return NextResponse.json(
        { error: 'Event ignored: automated traffic detected', fraudFlag: true },
        { status: 403 }
      )
    }

    // Anti-fraud 2: Deduplication within session
    const dedupeKey = `${sessionId}_${placementId}_${eventType}`
    const now = Date.now()
    const lastSeen = recentEvents.get(dedupeKey)

    const minCooldownMs = eventType === 'click' ? 1000 : 5000 // 1s cooldown on clicks, 5s on impressions
    if (lastSeen && now - lastSeen < minCooldownMs) {
      return NextResponse.json(
        { message: 'Event throttled: frequency limit reached for current session', throttled: true },
        { status: 429 }
      )
    }

    recentEvents.set(dedupeKey, now)

    // Clean up cache periodically
    if (recentEvents.size > 10_000) {
      recentEvents.clear()
    }

    // Calculate estimated revenue rate for demo (real networks update via webhooks)
    const estimatedCpm = 2.50 // $2.50 CPM demo baseline
    const estimatedEcpmRevenue = eventType === 'impression' ? estimatedCpm / 1000 : eventType === 'click' ? 0.15 : 0

    return NextResponse.json({
      success: true,
      tracked: true,
      placementId,
      eventType,
      estimatedRevenue: estimatedEcpmRevenue,
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
