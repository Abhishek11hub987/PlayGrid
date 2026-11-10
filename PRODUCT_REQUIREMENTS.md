# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. Product Identification
- **Product Name:** PlayGrid
- **Tagline:** One platform. Multiple gaming portals. Unlimited possibilities.
- **Classification:** B2B2C Multi-Tenant Gaming Network & White-Label SaaS Platform

## 2. Executive Summary & Vision
PlayGrid operates as a dual-sided gaming infrastructure company:
1. **First-Party Gaming Network:** Aggregates and serves approved, performant HTML5 games directly to consumers without requiring client installs or app-store gatekeepers.
2. **Turnkey White-Label SaaS:** Empowers publishers, digital communities, and creators to launch customized, domain-mapped gaming portals with curated game collections, automated advertising monetization, and audience analytics.

## 3. Personas & Core User Roles
| Role | Access Level | Primary Objectives |
|---|---|---|
| **Super Admin** | Root Platform | Global oversight of all tenant organizations, games catalogue approvals, ad provider configurations, revenue auditing, and platform security. |
| **Publisher (Owner)** | Organization Tenant | Create and brand portals, map custom domains, curate game subsets, configure ad placement frequencies, view audited earnings, and withdraw verified balances. |
| **Publisher Staff** | Assigned Portal | Edit layout sections, reorder game lists, monitor engagement analytics without financial withdrawal access. |
| **Registered Player** | Player Account | Bookmark favorite games, save session histories, earn verifiable badges and compete on global leaderboards. |
| **Guest Player** | Anonymous Visitor | Instant zero-click gameplay without mandatory registration gates. |

## 4. Key Functional Modules
### 4.1 Public Portal Network
- **Game Discovery:** Search, taxonomy filters across 10 core genres (Action, Adventure, Arcade, Puzzle, Racing, Sports, Strategy, Multiplayer, Casual, Educational).
- **Responsive HTML5 Player:** Fullscreen canvas player with sound controls, restart hooks, and non-intrusive ad placement padding.
- **Server-Side Leaderboards:** Score submissions cryptographically hashed to prevent client tampering.

### 4.2 Publisher White-Label Engine
- **Tenant Isolation:** Multi-tenant architecture keyed on `organization_id` and `portal_id` with Supabase Row Level Security (RLS).
- **Visual Portal Builder:** Controlled presets (theme colors, typography tokens, layout blocks) with real-time desktop and mobile canvas preview.
- **Domain Routing:** Resolution via URL path (`playgrid.com/portal/:slug`) or custom CNAME (`games.publisher.com`).

### 4.3 Monetization & Advertising Engine
- **Independent Provider Adapter:** Abstract driver interface allowing instant swapping between Demo Provider, Google AdSense, Media.net, or custom DSPs.
- **Ethical Ad Placements:** 728x90 leaderboards, 160x600 skyscrapers, voluntary rewarded video. Strict prohibition of deceptive placement or accidental click triggers.
- **80/20 Demonstrative Revenue Split:** Net advertising revenue allocated 80% to tenant publishers and 20% to PlayGrid infrastructure. Verified vs unverified balance segregation.

### 4.4 Super Admin Management Console
- Centralized approval queue for developer-submitted game bundles (.zip).
- Publisher KYB/compliance approvals and anti-fraud suspension controls.
- Immutable audit trail recording actor identity, action type, resource targets, and timestamps.

