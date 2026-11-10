# DEPLOYMENT & HOSTING GUIDE

## 1. Hosting Architecture
PlayGrid is designed for cost-effective hosting on standard free-tier infrastructure:
- **Web & Edge Compute:** Vercel (Hobby Tier) or Cloudflare Pages
- **Database & Auth:** Supabase (Free Tier: 500MB PostgreSQL, 50,000 MAU)
- **Object Storage:** Cloudflare R2 (10GB Free Storage) or Supabase Storage (1GB Free)
- **DNS & SSL:** Cloudflare DNS with automatic wildcard SSL for custom domains

---

## 2. Step-by-Step Deployment on Vercel / Cloudflare Pages

### Step 1: Database Setup on Supabase
1. Create a free project on [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste the contents of `supabase/migrations/001_initial_schema.sql` and run the script.
4. Paste the contents of `supabase/seed.sql` and run it to populate starter categories, plans, and achievements.

### Step 2: Deploy to Vercel
1. Push your repository to GitHub.
2. Link your repository in Vercel.
3. Configure the environment variables in project settings:
   - `NEXT_PUBLIC_APP_URL` = `https://your-domain.vercel.app`
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-key`
   - `SUPABASE_SERVICE_ROLE_KEY` = `your-service-role-key`
4. Click **Deploy**. Vercel will build and publish the 41 static and dynamic pages.

---

## 3. Custom Domain Configuration (CNAME Mapping)
To enable custom domains for publishers:
1. In Cloudflare or your DNS registrar, add a wildcard DNS record:
   - Type: `CNAME`
   - Name: `*`
   - Target: `cname.playgrid.io` (or your Vercel project CNAME)
2. In Vercel Project Domains, enable wildcard domain support.
3. Publishers point their subdomains (e.g. `games.publisher.com`) to your CNAME. PlayGrid middleware automatically resolves the portal by hostname.

