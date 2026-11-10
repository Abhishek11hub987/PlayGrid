import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { safeRevalidateTag } from '@/lib/data/repository'
import { gamePlayEventSchema } from '@/lib/validations/api-schemas'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json().catch(() => ({}))
    const validated = gamePlayEventSchema.safeParse(body)

    const supabase = await createClient()

    // 1. Fetch game by slug
    const { data: game, error: gameErr } = await supabase
      .from('games')
      .select('id, play_count')
      .eq('slug', slug)
      .single()

    if (gameErr || !game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    // 2. Increment play count
    const newPlayCount = (game.play_count || 0) + 1
    await supabase
      .from('games')
      .update({ play_count: newPlayCount, updated_at: new Date().toISOString() })
      .eq('id', game.id)

    safeRevalidateTag('games')

    // 3. Record gameplay session telemetry
    const sessionRecord = {
      game_id: game.id,
      portal_id: validated.success ? validated.data.portalId : null,
      device_type: validated.success ? validated.data.deviceType : 'desktop',
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      playCount: newPlayCount,
      sessionId: `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
