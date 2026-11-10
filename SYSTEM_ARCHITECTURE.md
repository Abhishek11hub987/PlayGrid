# SYSTEM ARCHITECTURE SPECIFICATION

## 1. Architectural Overview
PlayGrid is designed as a modular, edge-ready full-stack application built on Next.js 15 (App Router), TypeScript, Tailwind CSS, and PostgreSQL (Supabase).

```
                               ┌─────────────────────────────┐
                               │       Client Requests       │
                               └──────────────┬──────────────┘
                                              │
                         ┌────────────────────▼───────────────────┐
                         │      Next.js Edge Middleware           │
                         │ (Host & Path-based Tenant Resolution)  │
                         └────────────┬──────────────┬────────────┘
                                      │              │
                   ┌──────────────────▼──┐        ┌──▼───────────────────┐
                   │  Custom Domain Host │        │  Standard Path Host  │
                   │ (games.brand.com)   │        │  (playgrid.com)      │
                   └──────────┬──────────┘        └──┬───────────────────┘
                              │                      │
             ┌────────────────▼──────────────────────▼────────────────┐
             │                      App Router                        │
             │  ├── (public)/          [Player Experience]            │
             │  ├── portal/[slug]/     [White-Label Tenant Engine]    │
             │  ├── dashboard/         [Publisher SaaS Environment]   │
             │  └── admin/             [Super Admin Central Command]  │
             └────────────────┬──────────────────────┬────────────────┘
                              │                      │
            ┌─────────────────▼────────┐   ┌─────────▼────────────────┐
            │ Data Repository Adapter  │   │  Ad Provider Adapter     │
            │ (PostgreSQL RLS / Mock)  │   │  (Demo / AdSense / DSP)  │
            └─────────────────┬────────┘   └─────────┬────────────────┘
                              │                      │
            ┌─────────────────▼────────┐   ┌─────────▼────────────────┐
            │  Supabase PostgreSQL DB  │   │  HTML5 Game Containers   │
            │  (Row-Level Isolation)   │   │  (Strict Sandbox iframe) │
            └──────────────────────────┘   └──────────────────────────┘
```

## 2. Multi-Tenant Routing Engine
The platform dynamically routes incoming requests through two entry models:
1. **Path-Based Multi-Tenancy:**
   - URL: `https://playgrid.com/portal/[slug]`
   - Resolver: `resolvePortalBySlug(slug)` matches the portal slug against published tenant records.
2. **Custom Domain Multi-Tenancy:**
   - URL: `https://games.custompublisher.com`
   - Resolver: Host header inspected in edge middleware; domain looked up in `portal_domains` table. Verified custom domains map directly to the corresponding tenant portal context.

## 3. Data Access Layer & Provider Adapters
To guarantee resilience across free-tier and enterprise environments:
- **Repository Interface (`lib/data/repository.ts`):** Decouples UI pages from database drivers. Automatically selects live Supabase PostgreSQL when credentials exist or provides deterministic in-memory storage during local development.
- **Advertising Adapter (`lib/ads/provider-adapter.ts`):** Encapsulates ad network network tags behind an interface:
  - `DemoAdProvider`: Emits placeholder visual units, logs impressions locally, strictly avoids generating false impressions or artificial clicks.
  - `GoogleAdSenseProvider`: Connects to Google AdSense for Web Games API.
  - `CustomNetworkProvider`: Pre-bid / header-bidding connector.

## 4. Frontend Component Architecture
- **Design Tokens:** Tailwind CSS utility tokens with brand purple (`#6720ff`), electric blue (`#0ea5e9`), and dark charcoal surfaces (`#0b0f19`).
- **Interactive UI Primitives:** Radix UI primitive foundations (@radix-ui/react-dialog, dropdown-menu, tabs, avatar, separator).
- **Data Visualizations:** Recharts AreaCharts, BarCharts, and PieCharts for real-time telemetry.

## 5. Security & Isolation Boundaries
- **HTML5 iframe Sandboxing:** Games render inside `<iframe sandbox="allow-scripts allow-same-origin allow-fullscreen">` without top-level navigation access, camera/mic access, or payment access.
- **Content Security Policy (CSP):** Strict CSP headers configured in `next.config.js` preventing inline script injection from untrusted origins.
- **Server-Side Authorization:** Role verifications (`systemRole === 'super_admin'`) are executed strictly within server components and API handlers.

