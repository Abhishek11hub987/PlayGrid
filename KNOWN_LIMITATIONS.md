# KNOWN LIMITATIONS & PENDING INTEGRATIONS

## 1. Current MVP Implementation Boundaries

### 1.1 Live Payment Gateway (Demonstration Stage)
- **Status:** Plan selection, subscription quotas, and revenue calculation tables are fully modeled and functional.
- **Limitation:** Direct credit card charging via Stripe / Lemonsqueezy is currently mocked to facilitate free-tier evaluation without requiring merchant account keys.
- **Path to Production:** Integrate Stripe Elements and webhook listener in `app/api/webhooks/stripe/route.ts`.

### 1.2 Automated Real-Time Banking Payouts
- **Status:** Revenue records calculate gross revenue, 20% platform commission, and 80% publisher net earnings with verified/unverified state transitions.
- **Limitation:** Disbursem*nt requests are recorded in the database ledger for administrative review rather than directly triggering automated bank wire transfers.
- **Path to Production:** Connect Stripe Connect Custom or Wise Payouts API.

### 1.3 Ad Networks & Live Ad Exchange Tags
- **Status:** Independent provider adapter with real layout units and frequency capping. The local environment uses high-visibility demo banners (`⚠️ DEMO AD SLOT`).
- **Limitation:** Live Google AdSense, Media.net, or AppLovin tags require individual publisher website review and domain whitelisting by the respective networks.
- **Path to Production:** Input valid network publisher IDs in `.env.local` to switch adapter from `demo` to `google-adsense`.

### 1.4 Automated Custom Domain SSL Provisioning
- **Status:** Middleware resolves custom domains mapped in `portal_domains` table.
- **Limitation:** Wildcard SSL certificates require configuration at the DNS host (e.g. Cloudflare / Vercel Enterprise). On local development, subdomains are simulated via path routing (`/portal/:slug`).
- **Path to Production:** Integrate Cloudflare for SaaS custom hostnames API (`/zones/:id/custom_hostnames`).

