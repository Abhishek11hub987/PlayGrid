import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth/get-user'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('q')
    const sort = searchParams.get('sort') ?? 'popular'
    const limit = Math.min(Number(searchParams.get('limit') ?? 24), 50)
    const offset = Math.max(Number(searchParams.get('offset') ?? 0), 0)

    const supabase = await createClient()

    let query = supabase
      .from('games')
      .select('*, category:game_categories(*)')
      .eq('approval_status', 'approved')
      .eq('is_active', true)
      .is('deleted_at', null)

    if (category) {
      query = query.eq('category_id', category)
    }

    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    if (sort === 'newest') {
      query = query.order('created_at', { ascending: false })
    } else if (sort === 'rating') {
      query = query.order('rating_average', { ascending: false })
    } else {
      query = query.order('play_count', { ascending: false })
    }

    query = query.range(offset, offset + limit - 1)

    const { data: games, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: games ?? [],
      pagination: {
        limit,
        offset,
        total: count ?? games?.length ?? 0,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (!user.isSuperAdmin && user.systemRole !== 'publisher') {
      return NextResponse.json(
        { error: 'Forbidden: publisher or super admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()

    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json({ error: 'Game title is required.' }, { status: 400 })
    }

    const gameUrl = body.game_url || body.gameUrl
    if (!gameUrl || typeof gameUrl !== 'string') {
      return NextResponse.json({ error: 'Game Embed URL is required.' }, { status: 400 })
    }

    const trimmedUrl = gameUrl.trim()
    const isSafeUrl =
      trimmedUrl.startsWith('https://') ||
      trimmedUrl.startsWith('http://') ||
      trimmedUrl.startsWith('/games/')
    if (!isSafeUrl) {
      return NextResponse.json(
        { error: 'Game Embed URL must use https://, http://, or /games/ path.' },
        { status: 400 }
      )
    }

    const thumbnailUrl = body.thumbnail_url || body.thumbnailUrl || 'https://picsum.photos/seed/' + encodeURIComponent(body.title) + '/600/450'
    const categoryId = body.category_id || body.categoryId

    const { repository } = await import('@/lib/data/repository')

    const createdGame = await repository.addGame({
      title: body.title.trim(),
      slug: body.slug,
      description: body.description || 'Exciting browser game with instant play.',
      short_description: body.short_description || body.shortDescription,
      game_url: trimmedUrl,
      thumbnail_url: thumbnailUrl,
      category_id: categoryId,
      developer: body.developer || 'GameDistribution Partner',
      developer_url: body.developer_url || body.developerUrl,
      orientation: body.orientation || 'both',
      instructions: body.instructions || 'Follow in-game prompts and enjoy!',
      controls: body.controls || 'Mouse / Touch / Keyboard',
      tags: Array.isArray(body.tags)
        ? body.tags
        : typeof body.tags === 'string'
          ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
          : ['html5', 'arcade'],
      approval_status: user.isSuperAdmin ? 'approved' : 'pending',
      is_active: user.isSuperAdmin,
      is_featured: user.isSuperAdmin ? Boolean(body.is_featured || body.isFeatured) : false,
    })

    return NextResponse.json({
      success: true,
      data: createdGame,
      message: user.isSuperAdmin
        ? 'Game successfully added to catalog and active portals!'
        : 'Game submitted for Super Admin review!',
    }, { status: 201 })
  } catch (err: any) {
    console.error('API /games POST error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}

