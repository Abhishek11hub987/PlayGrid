import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    const { data: game, error } = await supabase
      .from('games')
      .select('*, category:game_categories(*)')
      .eq('slug', slug)
      .eq('approval_status', 'approved')
      .eq('is_active', true)
      .is('deleted_at', null)
      .single()

    if (error || !game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    return NextResponse.json({ data: game })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

