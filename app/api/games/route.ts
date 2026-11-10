import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createGameSchema } from '@/lib/validations/api-schemas'

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
    const body = await request.json()

    if (!body.title) {
      return NextResponse.json({ error: 'Game title is required.' }, { status: 400 })
    }

    const gameUrl = body.game_url || body.gameUrl
    if (!gameUrl) {
      return NextResponse.json({ error: 'Game Embed URL is required.' }, { status: 400 })
    }

    const thumbnailUrl = body.thumbnail_url || body.thumbnailUrl || 'https://picsum.photos/seed/' + encodeURIComponent(body.title) + '/600/450'
    const categoryId = body.category_id || body.categoryId

    const { repository } = await import('@/lib/data/repository')

    const createdGame = await repository.addGame({
      title: body.title,
      slug: body.slug,
      description: body.description || 'Exciting browser game with instant play.',
      short_description: body.short_description || body.shortDescription,
      game_url: gameUrl,
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
      approval_status: 'approved',
      is_active: true,
      is_featured: !!body.is_featured || !!body.isFeatured,
    })

    return NextResponse.json({
      success: true,
      data: createdGame,
      message: 'Game successfully added to catalog and active portals!',
    }, { status: 201 })
  } catch (err: any) {
    console.error('API /games POST error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}

