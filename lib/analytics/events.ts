'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { generateSessionToken, getDeviceType } from '@/lib/utils'

export type EventType =
  | 'portal_view'
  | 'game_impression'
  | 'game_open'
  | 'game_start'
  | 'game_complete'
  | 'game_exit'
  | 'favorite_added'
  | 'search_performed'
  | 'ad_impression'
  | 'ad_click'

interface TrackEventPayload {
  event_type: EventType
  portal_id?: string
  game_id?: string
  user_id?: string
  session_token: string
  device_type?: string
  country_code?: string
  referrer?: string
  metadata?: Record<string, unknown>
}

export async function trackEvent(payload: TrackEventPayload) {
  try {
    const supabase = createAdminClient()
    await supabase.from('analytics_events').insert({
      ...payload,
      metadata: payload.metadata ?? {},
    })
  } catch {
    // Analytics failures should not break the user experience
  }
}
