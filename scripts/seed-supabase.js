const { createClient } = require('@supabase/supabase-js');

try {
  process.loadEnvFile('.env.local');
} catch {}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(url, key);

async function seed() {
  console.log('--- Seeding Supabase with Real Games ---');

  // 1. Fetch categories
  const { data: categories, error: catErr } = await supabase.from('game_categories').select('id, slug, name');
  if (catErr || !categories) {
    console.error('Error fetching categories:', catErr);
    return;
  }

  const catMap = {};
  categories.forEach(c => { catMap[c.slug] = c.id; });
  console.log('Available category slugs:', Object.keys(catMap));

  const arcadeId = catMap['arcade'];
  const actionId = catMap['action'];
  const puzzleId = catMap['puzzle'];
  const casualId = catMap['casual'];

  const games = [
    {
      title: 'Pixel Runner',
      slug: 'pixel-runner',
      description: 'Dodge deadly laser obstacles, leap over spikes, and collect glowing power coins in this fast-paced cyberpunk endless runner.',
      short_description: 'Fast-paced cyberpunk endless runner.',
      thumbnail_url: '/thumbnails/pixel-runner.svg',
      banner_url: '/thumbnails/pixel-runner.svg',
      category_id: arcadeId,
      developer: 'PlayGrid Studios',
      game_url: '/games/pixel-runner/index.html',
      game_type: 'iframe',
      technology: 'html5',
      orientation: 'landscape',
      supported_devices: ['desktop', 'tablet', 'mobile'],
      instructions: 'Time your jumps carefully to clear neon spikes and barrier blocks. Collect gold coins to multiply your score velocity.',
      controls: 'Space / Up Arrow / Tap screen to jump',
      tags: ['runner', 'cyberpunk', 'arcade', 'fast-paced'],
      approval_status: 'approved',
      is_active: true,
      is_featured: true,
      play_count: 1420,
      rating_average: 4.85,
      rating_count: 89,
      iframe_sandbox_allow: 'allow-scripts allow-same-origin allow-fullscreen'
    },
    {
      title: 'Space Blaster 3000',
      slug: 'space-blaster',
      description: 'Pilot an advanced starfighter against waves of alien invaders across distant galaxies. Upgrade shields, unleash laser barrages, and survive cosmic chaos.',
      short_description: 'Retro arcade space shooter.',
      thumbnail_url: '/thumbnails/space-blaster.svg',
      banner_url: '/thumbnails/space-blaster.svg',
      category_id: actionId,
      developer: 'RetroCore Games',
      game_url: '/games/space-blaster/index.html',
      game_type: 'iframe',
      technology: 'html5',
      orientation: 'portrait',
      supported_devices: ['desktop', 'tablet', 'mobile'],
      instructions: 'Navigate your starship to evade incoming enemy craft and debris. Your rapid-fire lasers fire automatically when piloting.',
      controls: 'Move Mouse / Drag Touch / Arrow keys to pilot',
      tags: ['space', 'shooter', 'action', 'retro'],
      approval_status: 'approved',
      is_active: true,
      is_featured: true,
      play_count: 2850,
      rating_average: 4.90,
      rating_count: 142,
      iframe_sandbox_allow: 'allow-scripts allow-same-origin allow-fullscreen'
    },
    {
      title: '2048 Classic',
      slug: '2048-classic',
      description: 'The legendary addictive sliding tile puzzle game. Merge matching numbers to reach 2048 and beyond with smooth animations and sound feedback.',
      short_description: 'The iconic sliding tile puzzle game.',
      thumbnail_url: '/thumbnails/2048-classic.svg',
      banner_url: '/thumbnails/2048-classic.svg',
      category_id: puzzleId,
      developer: 'PuzzleCraft Lab',
      game_url: '/games/2048-classic/index.html',
      game_type: 'iframe',
      technology: 'html5',
      orientation: 'both',
      supported_devices: ['desktop', 'tablet', 'mobile'],
      instructions: 'Slide tiles across the board. When two tiles with the same number touch, they merge into one with double value.',
      controls: 'Arrow Keys, WASD or Touch Swipe',
      tags: ['puzzle', 'numbers', 'math', 'classic'],
      approval_status: 'approved',
      is_active: true,
      is_featured: true,
      play_count: 4210,
      rating_average: 4.95,
      rating_count: 310,
      iframe_sandbox_allow: 'allow-scripts allow-same-origin allow-fullscreen'
    },
    {
      title: 'Tower Builder',
      slug: 'tower-builder',
      description: 'Test your timing and precision! Stack moving floor slabs to construct the tallest skyscraper in the city without losing balance.',
      short_description: 'Precision physics skyscraper stacker.',
      thumbnail_url: '/thumbnails/tower-builder.svg',
      banner_url: '/thumbnails/tower-builder.svg',
      category_id: casualId,
      developer: 'Zenith Interactive',
      game_url: '/games/tower-builder/index.html',
      game_type: 'iframe',
      technology: 'html5',
      orientation: 'portrait',
      supported_devices: ['desktop', 'tablet', 'mobile'],
      instructions: 'Tap or click when the moving block aligns over the tower. Overhanging edges will be sliced off, making the target smaller!',
      controls: 'Click / Tap Screen / Spacebar to place floor',
      tags: ['stack', 'physics', 'casual', 'skyscraper'],
      approval_status: 'approved',
      is_active: true,
      is_featured: true,
      play_count: 1890,
      rating_average: 4.80,
      rating_count: 95,
      iframe_sandbox_allow: 'allow-scripts allow-same-origin allow-fullscreen'
    },
    {
      title: 'Flappy Wings',
      slug: 'flappy-bird',
      description: 'Take flight through a perilous obstacle course of emerald pipes! Tap to maintain elevation, dodge barriers, and beat the global high score.',
      short_description: 'Addictive arcade pipe dodging flyer.',
      thumbnail_url: '/thumbnails/flappy-bird.svg',
      banner_url: '/thumbnails/flappy-bird.svg',
      category_id: arcadeId,
      developer: 'Winged Arcade',
      game_url: '/games/flappy-bird/index.html',
      game_type: 'iframe',
      technology: 'html5',
      orientation: 'portrait',
      supported_devices: ['desktop', 'tablet', 'mobile'],
      instructions: 'Each flap propels you upward against gravity. Maneuver through narrow pipe gaps without touching ground or obstacles.',
      controls: 'Tap / Click / Spacebar to Flap Wings',
      tags: ['flappy', 'arcade', 'flyer', 'challenging'],
      approval_status: 'approved',
      is_active: true,
      is_featured: false,
      play_count: 3120,
      rating_average: 4.75,
      rating_count: 220,
      iframe_sandbox_allow: 'allow-scripts allow-same-origin allow-fullscreen'
    },
    {
      title: 'Brick Breaker Galaxy',
      slug: 'brick-breaker',
      description: 'An electrified cosmic take on the timeless Breakout and Arkanoid classic. Control the photon paddle, shatter destructible bricks, and clear the galaxy.',
      short_description: 'Cosmic Arkanoid brick demolition.',
      thumbnail_url: '/thumbnails/brick-breaker.svg',
      banner_url: '/thumbnails/brick-breaker.svg',
      category_id: arcadeId,
      developer: 'Vortex Arcade',
      game_url: '/games/brick-breaker/index.html',
      game_type: 'iframe',
      technology: 'html5',
      orientation: 'landscape',
      supported_devices: ['desktop', 'tablet', 'mobile'],
      instructions: 'Bounce the quantum ball off your paddle into the brick formations. Angle bounces by striking with the edges of your paddle.',
      controls: 'Move Mouse / Touch Drag to guide paddle',
      tags: ['breakout', 'arkanoid', 'retro', 'arcade'],
      approval_status: 'approved',
      is_active: true,
      is_featured: false,
      play_count: 2340,
      rating_average: 4.82,
      rating_count: 110,
      iframe_sandbox_allow: 'allow-scripts allow-same-origin allow-fullscreen'
    },
    {
      title: 'Snake Retro X',
      slug: 'snake-retro',
      description: 'The beloved Nokia classic reimagined with glowing neon graphics, responsive directional controls, and exponential speed challenges.',
      short_description: 'Neon retro snake arcade.',
      thumbnail_url: '/thumbnails/snake-retro.svg',
      banner_url: '/thumbnails/snake-retro.svg',
      category_id: arcadeId,
      developer: 'ByteWave',
      game_url: '/games/snake-retro/index.html',
      game_type: 'iframe',
      technology: 'html5',
      orientation: 'both',
      supported_devices: ['desktop', 'tablet', 'mobile'],
      instructions: 'Guide the snake to consume glowing apples. Each bite extends length and increases movement speed. Never run into walls or your own tail!',
      controls: 'Arrow Keys or Swipe Gestures',
      tags: ['snake', 'retro', 'classic', 'arcade'],
      approval_status: 'approved',
      is_active: true,
      is_featured: false,
      play_count: 1980,
      rating_average: 4.78,
      rating_count: 85,
      iframe_sandbox_allow: 'allow-scripts allow-same-origin allow-fullscreen'
    },
    {
      title: 'Block Puzzle Master',
      slug: 'block-puzzle',
      description: 'Strategic tetromino placement and row destruction. Drop geometric shapes into a clean grid, clear full lines, and strive for monumental combos.',
      short_description: 'Tetris-style falling blocks puzzle.',
      thumbnail_url: '/thumbnails/block-puzzle.svg',
      banner_url: '/thumbnails/block-puzzle.svg',
      category_id: puzzleId,
      developer: 'BlockWorks',
      game_url: '/games/block-puzzle/index.html',
      game_type: 'iframe',
      technology: 'html5',
      orientation: 'both',
      supported_devices: ['desktop', 'tablet', 'mobile'],
      instructions: 'Position falling blocks horizontally, drop quickly, or rotate shapes to construct solid horizontal lines without empty gaps.',
      controls: 'Left/Right Arrow to move, Up Arrow/Space to rotate, Down Arrow to drop',
      tags: ['tetris', 'blocks', 'puzzle', 'strategy'],
      approval_status: 'approved',
      is_active: true,
      is_featured: false,
      play_count: 1670,
      rating_average: 4.80,
      rating_count: 92,
      iframe_sandbox_allow: 'allow-scripts allow-same-origin allow-fullscreen'
    }
  ];

  for (const game of games) {
    const { data: existing } = await supabase.from('games').select('id').eq('slug', game.slug).single();
    if (existing) {
      const { error: upErr } = await supabase.from('games').update(game).eq('id', existing.id);
      console.log(`Updated ${game.title}:`, upErr ? upErr.message : 'OK');
    } else {
      const { error: insErr } = await supabase.from('games').insert(game);
      console.log(`Inserted ${game.title}:`, insErr ? insErr.message : 'OK');
    }
  }

  console.log('Seeding finished successfully!');
}

seed().catch(console.error);

