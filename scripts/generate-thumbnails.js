const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'thumbnails');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const games = [
  {
    slug: 'pixel-runner',
    title: 'Pixel Runner',
    subtitle: 'CYBER ENDLESS RUNNER',
    accent: '#854dff',
    bg1: '#140633',
    bg2: '#3d1399',
    icon: `<rect x="160" y="110" width="40" height="50" rx="6" fill="#0ea5e9"/>
           <rect x="180" y="120" width="16" height="10" rx="2" fill="#fff"/>
           <polygon points="120,200 135,170 150,200" fill="#ef4444"/>
           <polygon points="210,200 225,170 240,200" fill="#ef4444"/>
           <line x1="0" y1="200" x2="400" y2="200" stroke="#854dff" stroke-width="4"/>`
  },
  {
    slug: 'space-blaster',
    title: 'Space Blaster',
    subtitle: 'RETRO GALAXY SHOOTER',
    accent: '#0ea5e9',
    bg1: '#050b1a',
    bg2: '#0c2340',
    icon: `<polygon points="200,90 225,150 175,150" fill="#38bdf8"/>
           <rect x="196" y="145" width="8" height="20" fill="#f59e0b"/>
           <circle cx="160" cy="80" r="12" fill="#ef4444"/>
           <circle cx="240" cy="80" r="12" fill="#ef4444"/>
           <line x1="200" y1="90" x2="200" y2="40" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6,4"/>`
  },
  {
    slug: 'snake-retro',
    title: 'Snake Retro X',
    subtitle: 'NEON ARCADE SLITHER',
    accent: '#22c55e',
    bg1: '#061a12',
    bg2: '#0d3826',
    icon: `<rect x="160" y="110" width="22" height="22" rx="4" fill="#4ade80"/>
           <rect x="184" y="110" width="22" height="22" rx="4" fill="#22c55e"/>
           <rect x="208" y="110" width="22" height="22" rx="4" fill="#22c55e"/>
           <rect x="208" y="134" width="22" height="22" rx="4" fill="#16a34a"/>
           <circle cx="140" cy="150" r="10" fill="#ef4444"/>`
  },
  {
    slug: 'block-puzzle',
    title: 'Block Puzzle',
    subtitle: 'TETROMINO CHALLENGE',
    accent: '#3b82f6',
    bg1: '#0a1026',
    bg2: '#162b66',
    icon: `<rect x="160" y="100" width="26" height="26" rx="4" fill="#38bdf8" stroke="#fff" stroke-width="1"/>
           <rect x="188" y="100" width="26" height="26" rx="4" fill="#38bdf8" stroke="#fff" stroke-width="1"/>
           <rect x="216" y="100" width="26" height="26" rx="4" fill="#38bdf8" stroke="#fff" stroke-width="1"/>
           <rect x="188" y="128" width="26" height="26" rx="4" fill="#38bdf8" stroke="#fff" stroke-width="1"/>`
  },
  {
    slug: '2048-classic',
    title: '2048 Classic',
    subtitle: 'NUMBER MERGE PUZZLE',
    accent: '#f59e0b',
    bg1: '#1b132e',
    bg2: '#3a2066',
    icon: `<rect x="140" y="90" width="55" height="55" rx="8" fill="#f59e0b"/>
           <text x="167" y="126" font-family="sans-serif" font-size="20" font-weight="900" fill="#fff" text-anchor="middle">1024</text>
           <rect x="205" y="90" width="55" height="55" rx="8" fill="#e11d48"/>
           <text x="232" y="126" font-family="sans-serif" font-size="20" font-weight="900" fill="#fff" text-anchor="middle">2048</text>`
  },
  {
    slug: 'tower-builder',
    title: 'Tower Builder',
    subtitle: 'STACK PHYSICS ARCADE',
    accent: '#ec4899',
    bg1: '#1c0b2b',
    bg2: '#45166b',
    icon: `<rect x="140" y="150" width="120" height="22" rx="4" fill="#854dff"/>
           <rect x="150" y="126" width="100" height="22" rx="4" fill="#0ea5e9"/>
           <rect x="165" y="102" width="70" height="22" rx="4" fill="#ec4899"/>
           <rect x="175" y="78" width="50" height="22" rx="4" fill="#fbbf24"/>`
  },
  {
    slug: 'flappy-bird',
    title: 'Flappy Wings',
    subtitle: 'SKY FLIGHT ADVENTURE',
    accent: '#06b6d4',
    bg1: '#091c33',
    bg2: '#133e70',
    icon: `<rect x="130" y="50" width="36" height="60" fill="#10b981"/>
           <rect x="130" y="150" width="36" height="60" fill="#10b981"/>
           <circle cx="210" cy="130" r="16" fill="#f59e0b"/>
           <circle cx="216" cy="126" r="4" fill="#fff"/>
           <circle cx="217" cy="126" r="2" fill="#000"/>
           <polygon points="224,128 234,132 224,136" fill="#ef4444"/>`
  },
  {
    slug: 'brick-breaker',
    title: 'Brick Breaker',
    subtitle: 'COSMIC ARKANOID',
    accent: '#a855f7',
    bg1: '#130924',
    bg2: '#2f1257',
    icon: `<rect x="130" y="70" width="30" height="12" rx="2" fill="#ef4444"/>
           <rect x="165" y="70" width="30" height="12" rx="2" fill="#f97316"/>
           <rect x="200" y="70" width="30" height="12" rx="2" fill="#eab308"/>
           <rect x="235" y="70" width="30" height="12" rx="2" fill="#10b981"/>
           <rect x="170" y="170" width="60" height="10" rx="5" fill="#38bdf8"/>
           <circle cx="200" cy="140" r="6" fill="#fff"/>`
  }
];

games.forEach(g => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <defs>
    <linearGradient id="bg_${g.slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${g.bg1}"/>
      <stop offset="100%" stop-color="${g.bg2}"/>
    </linearGradient>
    <radialGradient id="glow_${g.slug}" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${g.accent}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${g.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="400" height="300" fill="url(#bg_${g.slug})"/>
  <rect width="400" height="300" fill="url(#glow_${g.slug})"/>

  <!-- Grid lines -->
  <g stroke="rgba(255,255,255,0.05)" stroke-width="1">
    <line x1="0" y1="75" x2="400" y2="75"/>
    <line x1="0" y1="150" x2="400" y2="150"/>
    <line x1="0" y1="225" x2="400" y2="225"/>
    <line x1="100" y1="0" x2="100" y2="300"/>
    <line x1="200" y1="0" x2="200" y2="300"/>
    <line x1="300" y1="0" x2="300" y2="300"/>
  </g>

  <!-- Game Icon Artwork -->
  <g>${g.icon}</g>

  <!-- Bottom vignette -->
  <rect y="210" width="400" height="90" fill="rgba(8,5,18,0.85)"/>
  <line x1="0" y1="210" x2="400" y2="210" stroke="${g.accent}" stroke-width="2"/>

  <!-- Typography -->
  <text x="20" y="248" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" fill="#ffffff">${g.title}</text>
  <text x="20" y="272" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="${g.accent}" letter-spacing="1">${g.subtitle}</text>
</svg>`;

  fs.writeFileSync(path.join(outDir, `${g.slug}.svg`), svg);
  console.log(`Generated thumbnail: ${g.slug}.svg`);
});

