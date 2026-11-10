import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAuthUser } from '@/lib/auth/get-user'
import { safeRevalidateTag } from '@/lib/data/repository'
import { createPortalSchema } from '@/lib/validations/api-schemas'

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = user.isSuperAdmin ? createAdminClient() : await createClient()

    const { data: portals, error } = await supabase
      .from('portals')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: portals ?? [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = createPortalSchema.parse(body)

    const supabase = await createClient()

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from('portals')
      .select('id')
      .eq('slug', validated.slug)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Portal slug is already in use' }, { status: 409 })
    }

    const newPortal = {
      name: validated.name,
      slug: validated.slug,
      custom_domain: validated.customDomain || null,
      organization_id: 'org-1',
      is_published: false,
      is_active: true,
      theme_config: validated.themeConfig || {
        primary_color: '#6720ff',
        accent_color: '#0ea5e9',
        font_family: 'Inter',
        dark_mode: true,
      },
      layout_config: validated.layoutConfig || {
        hero_style: 'banner',
        show_categories: true,
        show_trending: true,
        show_leaderboard: true,
        show_search: true,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('portals').insert(newPortal).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    safeRevalidateTag('portals')
    return NextResponse.json({ data: data || newPortal, message: 'Portal created successfully' }, { status: 201 })
  } catch (err: any) {
    if (err.errors) {
      return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
