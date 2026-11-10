import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const publish = body.publish !== undefined ? Boolean(body.publish) : true

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('portals')
      .update({
        is_published: publish,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      isPublished: publish,
      message: publish ? 'Portal published live' : 'Portal unpublished to draft',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
