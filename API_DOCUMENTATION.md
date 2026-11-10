# API & SERVER ACTIONS DOCUMENTATION

## 1. Authentication Endpoints
PlayGrid uses Supabase Authentication integrated with Next.js App Router cookies.

### `POST /auth/callback`
Exchanges authentication code for user session JWT.
- **Query Params:** `code` (string), `next` (redirect destination)
- **Response:** 302 Redirect to authenticated dashboard or origin.

---

## 2. Server Actions & Services

### `getAuthUser(): Promise<AuthUser | null>`
- **Location:** `lib/auth/get-user.ts`
- **Description:** Verifies caller session via HTTP-only cookie. Resolves user profile and computes `isSuperAdmin` securely server-side.
- **Return Type:**
  ```typescript
  {
    id: string
    email?: string
    profile: Profile | null
    systemRole: 'super_admin' | 'publisher' | 'player'
    isSuperAdmin: boolean
  }
  ```

### `trackEvent(payload: TrackEventPayload): Promise<void>`
- **Location:** `lib/analytics/events.ts`
- **Description:** Asynchronously records engagement telemetry (portal views, game impressions, session duration).
- **Parameters:**
  ```typescript
  {
    event_type: 'portal_view' | 'game_start' | 'game_complete' | 'ad_impression' | 'ad_click'
    portal_id?: string
    game_id?: string
    user_id?: string
    session_token: string
    device_type?: 'desktop' | 'tablet' | 'mobile'
  }
  ```

---

## 3. Repository Interfaces

### `repository.getGames(options)`
- **Location:** `lib/data/repository.ts`
- **Parameters:**
  - `categorySlug` (string, optional)
  - `search` (string, optional)
  - `sort` ('popular' | 'recent' | 'rating', optional)
  - `status` ('approved' | 'pending' | 'rejected', optional)
  - `limit` (number, default 50)
  - `offset` (number, default 0)
- **Returns:** `{ data: Game[], count: number }`

### `repository.getPortalBySlug(slug)`
- **Parameters:** `slug` (string)
- **Returns:** `Portal | null` joined with theme and active section configs.

### `repository.getRevenueRecords(organizationId)`
- **Parameters:** `organizationId` (string, optional)
- **Returns:** `RevenueRecord[]` with 80/20 platform and publisher splits.

