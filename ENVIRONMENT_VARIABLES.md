# ENVIRONMENT VARIABLES SPECIFICATION

| Variable | Scope | Required | Description |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Public / Client | Yes | The canonical URL of the application (e.g. `http://localhost:3000` or `https://playgrid.io`). |
| `NEXT_PUBLIC_APP_NAME` | Public / Client | No | Platform branding name (Default: `PlayGrid`). |
| `NEXT_PUBLIC_SUPABASE_URL` | Public / Client | Optional in Dev | Supabase project URL (`https://your-project.supabase.co`). When omitted or placeholder, local demo repository activates automatically. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public / Client | Optional in Dev | Supabase public anonymous client API key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-Side Only | Optional in Dev | **NEVER EXPOSE TO CLIENT.** Secret service-role key used exclusively by server components for administrative queries. |
| `SUPER_ADMIN_USER_ID` | Server-Side Only | No | UUID assigned to the master super-admin account upon live production migration. |
| `GOOGLE_ADSENSE_PUBLISHER_ID` | Server-Side / Client | No | Google AdSense publisher ID (e.g. `pub-XXXXXXXXXXXXXXXX`) activated upon account approval. |
| `MEDIA_NET_SITE_ID` | Server-Side Only | No | Media.net header bidding site identifier. |

---

## Example `.env.local`
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=PlayGrid

NEXT_PUBLIC_SUPABASE_URL=https://placeholder-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-anon-key
SUPABASE_SERVICE_ROLE_KEY=placeholder-service-key

SUPER_ADMIN_USER_ID=user-super-admin
```

