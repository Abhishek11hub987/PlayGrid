import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requirePortalAccess } from '@/lib/auth/get-user'
import { safeRevalidateTag } from '@/lib/data/repository'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await requirePortalAccess(id)
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await request.json().catch(() => ({}))
    const publish = body.publish !== undefined ? Boolean(body.publish) : true

    const supabase = await createClient()

    const { error } = await supabase
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

    safeRevalidateTag('portals')
    return NextResponse.json({
      success: true,
      isPublished: publish,
      message: publish ? 'Portal published live' : 'Portal unpublished to draft',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
