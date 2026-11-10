# MULTI-TENANT SECURITY & ISOLATION MODEL

## 1. Tenant Boundary Enforcement
PlayGrid isolates tenant organizations across three distinct application layers:

### Layer 1: Edge Routing & Resolution
- Inbound requests identify tenant context via URL path (`/portal/:slug`) or CNAME host header (`custom.domain.com`).
- The edge middleware strictly validates that the requested custom domain belongs to a published, verified portal.
- Manipulating the URL path cannot grant a publisher access to another publisher's management dashboard.

### Layer 2: Database Row Level Security (RLS)
- Every table containing publisher-owned resources (`portals`, `portal_themes`, `portal_games`, `ad_placements`, `revenue_records`) contains an `organization_id` foreign key.
- Supabase PostgreSQL RLS policies guarantee that even if an attacker crafts custom SQL queries or API calls with a valid auth JWT, queries return only records where:
  ```sql
  organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
  )
  ```

### Layer 3: Server-Side Authorization Guards
- Role checks (`super_admin`, `publisher_owner`, `staff`) are executed exclusively within server components and API route handlers (`lib/auth/get-user.ts`).
- Super-admin privileges are never derived from client-submitted tokens, local storage values, or untrusted headers.

---

## 2. HTML5 Game Sandboxing
Third-party browser games are treated as untrusted third-party code.
Each game executes within an HTML5 `<iframe>` with minimal sandbox permissions:
```html
<iframe
  src="/games/pixel-runner/index.html"
  sandbox="allow-scripts allow-same-origin allow-fullscreen"
  allow="fullscreen"
/>
```
Prohibited capabilities:
- `allow-top-navigation`: Games cannot redirect the player away from PlayGrid.
- `allow-popups`: Games cannot open unwanted advertising tabs.
- `allow-modals`: Games cannot trigger arbitrary browser alerts.
- `allow-forms`: Games cannot submit external credential forms.

---

## 3. Content Security Policy (CSP)
Strict CSP directives enforced in `next.config.js`:
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https: blob:;
frame-src 'self' https:;
connect-src 'self' https://*.supabase.co wss://*.supabase.co;
font-src 'self' data:;
```

