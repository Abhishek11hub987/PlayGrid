<div align="center">

# 🎮 PlayGrid

### Multi-Portal Browser Gaming Network & White-Label SaaS Platform

*One platform. Multiple white-label gaming portals. Built-in games, distributor ingestion & 80/20 monetization.*

[![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_RLS-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

[Features](#-three-core-surfaces) • [Architecture](#-architecture--data-flow) • [Game SDK & Distributors](#-distributor-ingestion--html5-game-sdk) • [Database Schema](#-database-schema-29-tables) • [Quick Start](#-quick-start)

</div>

---

## 🌟 About PlayGrid

**PlayGrid** is an end-to-end **multi-tenant HTML5 browser gaming infrastructure platform** built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

Instead of running a single standalone arcade website, PlayGrid acts as a complete **B2B2C Gaming Network Engine**:
- **Players** get instant, zero-download browser gameplay across desktop, tablet, and mobile with leaderboards, favorites, and achievements.
- **Publishers & Media Brands** can launch their own **white-label gaming portals** (`/portal/[slug]` or custom domain routing) with custom themes, curated game lineups, advertising placements, real-time analytics, and an automated **80/20 revenue split**.
- **Platform Operators (Super Admins)** govern the entire network from a centralized command center—ingesting games from commercial distributors (GameDistribution, GamePix, CrazyGames, Famobi), moderating publishers, tracking subscriptions, and auditing platform actions.

---

## 🧩 Three Core Surfaces

### 1. 🕹️ Public Gaming Network
| Feature | Details |
|---|---|
| **Instant Browser Play** | Zero-download HTML5 & Canvas games played directly inside a sandboxed player (`/play/[slug]`). |
| **8 Built-In Playable Games** | Ships with 8 complete self-hosted HTML5 mini-games in `public/games/*` ready to play offline or online. |
| **Game Discovery & Search** | Browse across 10 genres (`game_categories`), live search (`/search`), trending rankings, and game detail pages (`/game/[slug]`). |
| **Player Engagement** | Ranked leaderboards (`/leaderboards`), player profiles & achievements (`/profile`), bookmarks, and gameplay history. |
| **White-Label Storefronts** | Dynamic tenant portals served at `/portal/[slug]` or routed via custom domains using Next.js middleware (`middleware.ts`). |

### 2. 🏢 Publisher White-Label SaaS (`/dashboard`)
| Module | Route | Capabilities |
|---|---|---|
| **Command Center** | `/dashboard` | Network KPIs (visits, unique players, sessions, ad impressions, estimated revenue) and active portal cards. |
| **Portal Fleet Manager** | `/dashboard/portals` | Create (`/dashboard/portals/new`), manage, and publish white-label gaming portals. |
| **Visual Theme Builder** | `/dashboard/portals/[id]` | Customize theme presets, primary/accent colors, font presets, and homepage sections live. |
| **Game Catalog & Requests** | `/dashboard/games` | Browse approved network titles and add games to portals. |
| **Advertising Manager** | `/dashboard/advertising` | Configure leaderboard (`728×90`), sidebar (`160×600`), and interstitial ad placements with frequency caps. |
| **Audience Analytics** | `/dashboard/analytics` | Interactive Recharts visualizations for 7-day traffic/plays, device share, top games, and geo distribution. |
| **Revenue & Payouts** | `/dashboard/revenue` | Audited **80% Publisher / 20% Platform** revenue ledger segregating verified vs. estimated accrual earnings. |
| **Guided Onboarding** | `/dashboard/onboarding` | 6-step setup wizard from brand profile to portal launch preview. |
| **Team & Settings** | `/dashboard/team`, `/dashboard/settings` | Organization seat management and SaaS plan overview. |

### 3. 🛡️ Super Admin Central Command (`/admin`)
| Module | Route | Capabilities |
|---|---|---|
| **Admin Overview** | `/admin` | Platform-wide telemetry across publishers, active portals, approved games, players, and clearinghouse totals. |
| **Distributor Game Ingestion Studio** | `/admin/game-uploads` | Embed games via URL with one-click presets for **GameDistribution**, **GamePix**, **CrazyGames**, and **Famobi**, live card preview, in-page sandbox tester, or HTML5 ZIP tab. |
| **Global Game Catalog** | `/admin/games` | Filter, inspect, approve/reject, and manage game distribution status. |
| **Publisher Directory** | `/admin/publishers` | Review publisher registrations, manage organization status (`active`, `pending`, `suspended`). |
| **Portal Fleet & Categories** | `/admin/portals`, `/admin/categories` | Oversee tenant domains and organize global game genres. |
| **Monetization & SaaS Billing** | `/admin/advertising`, `/admin/revenue`, `/admin/subscriptions` | Manage DSP/ad provider adapters, 80/20 commission clearinghouse, and publisher SaaS tiers. |
| **Trust, Safety & Compliance** | `/admin/moderation`, `/admin/support`, `/admin/audit-logs`, `/admin/settings` | Moderation queue, support desk, immutable audit trail, and security policies. |

---

## 🏗️ Architecture & Data Flow

```
                     ┌──────────────────────────────────────┐
                     │          Incoming Request            │
                     │   playgrid.io  │  custom.domain.com  │
                     └──────────────────┬───────────────────┘
                                        │
                                        ▼
                     ┌──────────────────────────────────────┐
                     │        Next.js middleware.ts         │
                     │  Session Refresh & Tenant Host Check │
                     └──────────────────┬───────────────────┘
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                               ▼                               ▼
┌───────────────┐               ┌───────────────┐               ┌───────────────┐
│ Public Portal │               │ Publisher SaaS│               │  Super Admin  │
│  /, /games,   │               │ /dashboard/*  │               │   /admin/*    │
│ /play/[slug]  │               │ Portal Builder│               │ Ingestion &   │
│ /portal/[slug]│               │ & Analytics   │               │ Governance    │
└───────┬───────┘               └───────┬───────┘               └───────┬───────┘
        │                               │                               │
        └───────────────────────────────┼───────────────────────────────┘
                                        ▼
                     ┌──────────────────────────────────────┐
                     │       Repository Layer & REST API    │
                     │   lib/data/repository.ts + Zod APIs  │
                     └──────────────────┬───────────────────┘
                                        │
                         ┌──────────────┴──────────────┐
                         ▼                             ▼
            ┌────────────────────────┐    ┌────────────────────────┐
            │ Supabase (PostgreSQL)  │    │  Resilient Demo Cache  │
            │  29 Tables + Auth +    │    │    lib/data/mock-db    │
            │  Row-Level Security    │    │ (Auto-fallback if env  │
            │                        │    │  keys are unconfigured)│
            └────────────────────────┘    └────────────────────────┘
```

### Multi-Tenant & Resilience Design
- **Repository Pattern (`lib/data/repository.ts`)**: Server components query live Supabase PostgreSQL tables when configured, while gracefully falling back to structured fixtures (`lib/data/mock-db.ts`) if Supabase keys are not yet added—allowing contributors to run and preview the entire app right after `npm install`.
- **Server-Side Client Segregation**: Browser clients (`lib/supabase/client.ts`) only use `NEXT_PUBLIC_SUPABASE_ANON_KEY`, whereas administrative operations (`lib/supabase/admin.ts`) exclusively access `SUPABASE_SERVICE_ROLE_KEY` on the server.

---

## 🎮 Built-In Games & Distributor Ingestion

### Built-In Playable HTML5 Arcade (`public/games/`)
| Title | Slug | Folder |
|---|---|---|
| **Pixel Runner** | `pixel-runner` | `public/games/pixel-runner/index.html` |
| **2048 Classic** | `2048-classic` | `public/games/2048-classic/index.html` |
| **Flappy Bird** | `flappy-bird` | `public/games/flappy-bird/index.html` |
| **Space Blaster** | `space-blaster` | `public/games/space-blaster/index.html` |
| **Brick Breaker** | `brick-breaker` | `public/games/brick-breaker/index.html` |
| **Snake Retro** | `snake-retro` | `public/games/snake-retro/index.html` |
| **Tower Builder** | `tower-builder` | `public/games/tower-builder/index.html` |
| **Block Puzzle** | `block-puzzle` | `public/games/block-puzzle/index.html` |

### Distributor Ingestion Studio & HTML5 Game SDK
- **Distributor Support (`/admin/game-uploads`)**: Built-in templates for **GameDistribution (Azerion)**, **GamePix**, **CrazyGames**, **Famobi**, and custom HTML5 hosts. Added games are stored via `POST /api/games` and automatically linked to active portals (`portal_games`).
- **PlayGrid Client SDK (`public/sdk/playgrid-sdk.js`)**: Lightweight `postMessage` bridge exposed as `window.PlayGrid` for HTML5 games hosted in sandboxed iframes:

```html
<script src="/sdk/playgrid-sdk.js"></script>
<script>
  PlayGrid.init();

  // Submit scores to PlayGrid's anti-cheat validation endpoint
  PlayGrid.submitScore(1450, { level: 3 });

  // Request non-intrusive level transitions or optional rewarded ads
  PlayGrid.showInterstitial(() => resumeGame());
  PlayGrid.showRewardedAd(() => grantExtraLife());
</script>
```

---

## 💳 Publisher SaaS Plans & 80/20 Revenue Model

Defined in `supabase/seed.sql` and managed across `/dashboard/settings` and `/admin/subscriptions`:

| Plan | Monthly | Yearly | Max Portals | Team Seats | Games / Portal |
|---|---|---|---|---|---|
| **Free** | \$0 | \$0 | 1 | 1 | 50 |
| **Starter** | \$29 | \$290 | 3 | 3 | 100 |
| **Pro** | \$79 | \$790 | 10 | 10 | 500 |
| **Enterprise** | \$299 | \$2,990 | Unlimited (`999`) | Unlimited (`99`) | Unlimited (`9999`) |

- **Revenue Attribution**: Verified ad earnings follow an **80% Publisher / 20% Platform** commission split (`revenue_records`), tracked separately from unverified month-to-date accrual estimates.

---

## 🔒 Security Architecture

| Layer | Implementation | Location |
|---|---|---|
| **Iframe Sandboxing** | Enforces `sandbox="allow-scripts allow-same-origin allow-fullscreen"` (omits `allow-top-navigation` and `allow-popups-to-escape-sandbox`) | `components/portal/game-player.tsx` |
| **HTTP Security Headers** | Sets `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `Permissions-Policy` | `next.config.js` |
| **Anti-Cheat Validation** | Enforces minimum session length (`>= 2s`) and per-game maximum points-per-second velocity caps | `app/api/games/[slug]/score/route.ts` |
| **Input Validation** | Strict Zod schemas across API routes & forms | `lib/validations/api-schemas.ts` |
| **Database Isolation** | PostgreSQL Row-Level Security (RLS) policies + public approved-game read rules | `supabase/migrations/*.sql` |

---

## 🌐 API Endpoints (`app/api/`)

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/games` | Paginated, searchable, category-filterable approved games list |
| `POST` | `/api/games` | Ingest and publish a new distributor or HTML5 game & link to portals |
| `GET` | `/api/games/[slug]` | Fetch metadata and category details for a single game |
| `POST` | `/api/games/[slug]/play` | Record gameplay launch telemetry |
| `POST` | `/api/games/[slug]/score` | Validate and submit player scores with anti-cheat velocity checks |
| `GET` / `POST` | `/api/portals` | List or create multi-tenant white-label portals |
| `GET` / `PATCH` / `DELETE` | `/api/portals/[id]` | Retrieve, update theme/settings, or soft-delete a portal |
| `POST` | `/api/portals/[id]/publish` | Toggle live publication state for a portal |
| `POST` | `/api/ads/event` | Track ad placement impressions, clicks, and rewarded events |

---

## 🗄️ Database Schema (29 Tables)

Defined in [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql):

<details>
<summary><strong>Click to expand all 29 PostgreSQL tables grouped by domain</strong></summary>

* **Multi-Tenant SaaS & Identity (5):** `plans`, `profiles`, `organizations`, `organization_members`, `subscriptions`
* **Game Catalog & Permissions (3):** `game_categories`, `games`, `game_permissions`
* **White-Label Portals (5):** `portals`, `portal_domains`, `portal_themes`, `portal_sections`, `portal_games`
* **Player Telemetry & Progression (6):** `game_sessions`, `player_favorites`, `player_history`, `achievements`, `player_achievements`, `leaderboard_scores`
* **Advertising & Revenue Clearinghouse (6):** `ad_providers`, `ad_placements`, `ad_events`, `revenue_records`, `publisher_payouts`, `analytics_events`
* **Governance, Trust & Audit (4):** `support_tickets`, `moderation_reports`, `audit_logs`, `consent_records`

</details>

---

## 📂 Project Structure

```text
PlayGrid/
├── app/
│   ├── (auth)/              # Login & registration pages + OAuth callback
│   ├── (public)/            # Public gaming network, /games, /play/[slug], /leaderboards, /profile
│   ├── admin/               # Super Admin command center & Distributor Ingestion Studio
│   ├── api/                 # Next.js Route Handlers (games, score anti-cheat, portals, ad events)
│   ├── dashboard/           # Publisher white-label SaaS (portals, theme builder, analytics, revenue)
│   └── portal/[slug]/       # Multi-tenant storefront renderer
├── components/
│   ├── admin/               # Admin sidebar, overview, publisher & catalog managers
│   ├── ads/                 # Display ad placement components
│   ├── auth/                # React Hook Form + Zod auth forms
│   ├── dashboard/           # Publisher header, sidebar, Recharts analytics, portal builder
│   ├── portal/              # Sandboxed game player, game cards, filters, hero & footer
│   └── ui/                  # Reusable Radix + Tailwind UI primitives
├── lib/
│   ├── ads/                 # Provider-independent ad adapter
│   ├── analytics/           # Telemetry event utilities
│   ├── auth/                # Server auth helpers
│   ├── data/                # Repository abstraction & demo fallback fixtures
│   ├── supabase/            # Browser, server & admin Supabase clients
│   ├── tenant/              # Domain & slug tenant resolution
│   └── validations/         # Shared Zod API schemas
├── public/
│   ├── games/               # 8 self-hosted playable HTML5 mini-games
│   ├── sdk/                 # playgrid-sdk.js iframe communication bridge
│   └── thumbnails/          # SVG game artwork
├── scripts/                 # Database & thumbnail seed utilities (reads .env.local)
├── supabase/
│   ├── migrations/          # Schema, public-read RLS & auth signup trigger migrations
│   └── seed.sql             # Base SaaS plans, categories, ad providers & achievements
└── tests/                   # Node native test runner suite (business-logic.test.mjs)
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js 18+** (tested on Node.js 24)
- **npm**
- A **Supabase** project *(optional — demo fallback mode works automatically without database credentials)*

### 1. Clone & Install
```bash
git clone https://github.com/Abhishek11hub987/PlayGrid.git
cd PlayGrid
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your own Supabase keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_APP_URL=http://localhost:3005
NEXT_PUBLIC_APP_NAME=PlayGrid
```

> 🔐 **Security Note:** `.env.local` is ignored by Git (`.gitignore`). Never commit API keys or personal credentials to version control.

### 3. Apply Database Migrations & Seed *(Optional for Live Supabase)*
Run the SQL files in your Supabase Dashboard **SQL Editor** in order:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_enable_public_read_rls.sql`
3. `supabase/migrations/003_fix_signup_trigger.sql`
4. `supabase/seed.sql`

Then optionally run the seed scripts (which read credentials from `.env.local`):
```bash
node scripts/seed-supabase.js
node scripts/seed-dashboard-data.js
```

### 4. Run Locally
```bash
npm run dev
```
Open **[http://localhost:3005](http://localhost:3005)** in your browser.

---

## 🧪 Scripts & Testing

```bash
npm run dev       # Start Next.js development server on port 3005
npm run build     # Create optimized production build
npm run start     # Start production server on port 3005
npm run lint      # Run Next.js ESLint checks
npm run test      # Execute unit tests (node --test tests/*.test.mjs)
```

---

## 📚 Detailed Documentation

Additional engineering specifications included in the repository root:
- [`PRODUCT_REQUIREMENTS.md`](./PRODUCT_REQUIREMENTS.md) — Product scope & user personas
- [`SYSTEM_ARCHITECTURE.md`](./SYSTEM_ARCHITECTURE.md) — Multi-tenant technical design
- [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) — Relational database design & entity relationships
- [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) — Endpoint contracts & payloads
- [`MULTI_TENANT_SECURITY.md`](./MULTI_TENANT_SECURITY.md) — Isolation, RLS & iframe sandboxing model
- [`ADVERTISING_INTEGRATION.md`](./ADVERTISING_INTEGRATION.md) — Ad provider adapter architecture
- [`LICENSE_AND_GAME_DISTRIBUTION.md`](./LICENSE_AND_GAME_DISTRIBUTION.md) — Game rights & distributor compliance
- [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) — Production deployment checklist

---

## 📄 License

PlayGrid Platform © 2026. Individual game licenses and distributor embed agreements are governed separately per title.
