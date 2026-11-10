import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requirePortalAccess } from '@/lib/auth/get-user'
import { safeRevalidateTag } from '@/lib/data/repository'
import { updatePortalSchema } from '@/lib/validations/api-schemas'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await requirePortalAccess(id)
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const supabase = await createClient()
    const { data: portal, error } = await supabase
      .from('portals')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error || !portal) {
      return NextResponse.json({ error: 'Portal not found' }, { status: 404 })
    }

    return NextResponse.json({ data: portal })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await requirePortalAccess(id)
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await request.json()
    const validated = updatePortalSchema.parse(body)

    const supabase = await createClient()

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }
    if (validated.name !== undefined) updatePayload.name = validated.name
    if (validated.slug !== undefined) updatePayload.slug = validated.slug
    if (validated.customDomain !== undefined) updatePayload.custom_domain = validated.customDomain
    if (validated.themeConfig !== undefined) updatePayload.theme_config = validated.themeConfig
    if (validated.layoutConfig !== undefined) updatePayload.layout_config = validated.layoutConfig
    if (validated.isPublished !== undefined) updatePayload.is_published = validated.isPublished

    const { data, error } = await supabase
      .from('portals')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    safeRevalidateTag('portals')
    return NextResponse.json({ data, message: 'Portal updated successfully' })
  } catch (err: any) {
    if (err.errors) {
      return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await requirePortalAccess(id)
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const supabase = await createClient()

    // Soft delete
    const { error } = await supabase
      .from('portals')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    safeRevalidateTag('portals')
    return NextResponse.json({ success: true, message: 'Portal deleted' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
