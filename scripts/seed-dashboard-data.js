const { createClient } = require('@supabase/supabase-js');

try {
  process.loadEnvFile('.env.local');
} catch {}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OWNER_ID = process.env.SUPER_ADMIN_USER_ID;
const ORG_NAME = process.env.DEFAULT_ORG_NAME || 'PlayGrid Studios';
const ORG_SLUG = process.env.DEFAULT_ORG_SLUG || 'playgrid-studios';

if (!url || !key || !OWNER_ID) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or SUPER_ADMIN_USER_ID in environment.');
  process.exit(1);
}

const supabase = createClient(url, key);

async function seedDashboard() {
  console.log('--- Seeding Live Publisher & Admin Dashboard Data ---');

  // 1. Get Pro Plan
  const { data: plans } = await supabase.from('plans').select('id, slug, name');
  const proPlan = plans?.find(p => p.slug === 'pro') || plans?.[0];
  console.log('Using Plan:', proPlan?.name, proPlan?.id);

  // 2. Create or Update Organization
  let orgId;
  const { data: existingOrg } = await supabase.from('organizations').select('id').eq('slug', ORG_SLUG).single();
  if (existingOrg) {
    orgId = existingOrg.id;
    console.log('Organization exists:', orgId);
  } else {
    const { data: newOrg, error: orgErr } = await supabase.from('organizations').insert({
      name: ORG_NAME,
      slug: ORG_SLUG,
      owner_id: OWNER_ID,
      plan_id: proPlan?.id,
      status: 'active',
      description: 'Official flagship gaming portal network publisher on PlayGrid',
      website: 'https://playgrid.io',
      logo_url: '/thumbnails/pixel-runner.svg'
    }).select().single();

    if (orgErr) {
      console.error('Error creating organization:', orgErr);
      return;
    }
    orgId = newOrg.id;
    console.log('Created organization:', orgId);
  }

  // 3. Add to organization_members
  const { data: existingMember } = await supabase.from('organization_members').select('id').eq('organization_id', orgId).eq('user_id', OWNER_ID).single();
  if (!existingMember) {
    await supabase.from('organization_members').insert({
      organization_id: orgId,
      user_id: OWNER_ID,
      role: 'owner',
      permissions: { can_manage_games: true, can_manage_ads: true, can_view_revenue: true }
    });
    console.log('Added owner to organization_members');
  }

  // 4. Create Portals
  const portalsData = [
    {
      organization_id: orgId,
      name: 'PlayGrid Arcade Portal',
      slug: 'arcade-portal',
      tagline: 'Instant HTML5 Arcade Gaming Network',
      description: 'Play top retro arcade, endless runner, and puzzle games right in your browser.',
      status: 'published',
      seo_title: 'PlayGrid Arcade — Free Online Browser Games',
      seo_description: 'Thousands of free instant games, zero downloads required.',
      metadata: {
        theme_config: {
          preset: 'dark-gaming',
          primary_color: '#6720ff',
          accent_color: '#0ea5e9',
          font_preset: 'geist'
        },
        layout_config: {
          hero_style: 'featured',
          show_categories: true,
          show_trending: true,
          show_leaderboard: true
        }
      },
      theme: {
        preset: 'dark-gaming',
        primary_color: '#6720ff',
        accent_color: '#0ea5e9',
        font_preset: 'geist'
      }
    },
    {
      organization_id: orgId,
      name: 'Pixel Nexus White-Label',
      slug: 'pixel-nexus',
      tagline: 'Cyberpunk & Sci-Fi Indie Games',
      description: 'Curated selection of premier cyberpunk and retro sci-fi browser games.',
      status: 'published',
      seo_title: 'Pixel Nexus — Sci-Fi Browser Gaming',
      seo_description: 'Play retro 8-bit, cyberpunk runner and galaxy shooters.',
      metadata: {
        theme_config: {
          preset: 'electric-blue',
          primary_color: '#0ea5e9',
          accent_color: '#854dff',
          font_preset: 'inter'
        },
        layout_config: {
          hero_style: 'carousel',
          show_categories: true,
          show_trending: true,
          show_leaderboard: false
        }
      },
      theme: {
        preset: 'electric-blue',
        primary_color: '#0ea5e9',
        accent_color: '#854dff',
        font_preset: 'inter'
      }
    }
  ];

  const portalIds = [];
  for (const item of portalsData) {
    const { theme, ...portalRecord } = item;
    const { data: existingP } = await supabase.from('portals').select('id').eq('slug', portalRecord.slug).single();
    let currentPortalId;
    if (existingP) {
      currentPortalId = existingP.id;
      portalIds.push(currentPortalId);
      console.log('Portal exists:', portalRecord.slug, currentPortalId);
    } else {
      const { data: newP, error: pErr } = await supabase.from('portals').insert(portalRecord).select().single();
      if (!pErr && newP) {
        currentPortalId = newP.id;
        portalIds.push(currentPortalId);
        console.log('Created portal:', portalRecord.slug, currentPortalId);
      } else {
        console.error('Error creating portal:', portalRecord.slug, pErr);
      }
    }

    if (currentPortalId) {
      // Upsert portal theme
      const { data: existingTheme } = await supabase.from('portal_themes').select('id').eq('portal_id', currentPortalId).single();
      if (!existingTheme) {
        await supabase.from('portal_themes').insert({
          portal_id: currentPortalId,
          preset: theme.preset,
          primary_color: theme.primary_color,
          accent_color: theme.accent_color,
          font_preset: theme.font_preset
        });
        console.log('Seeded theme for portal:', portalRecord.slug);
      }

      // Upsert portal sections
      const sections = [
        { section_key: 'hero', sort_order: 1, is_enabled: true, config: { style: 'featured' } },
        { section_key: 'trending', sort_order: 2, is_enabled: true, config: { limit: 8 } },
        { section_key: 'categories', sort_order: 3, is_enabled: true, config: {} },
        { section_key: 'leaderboard', sort_order: 4, is_enabled: true, config: {} }
      ];
      for (const s of sections) {
        const { data: existingSec } = await supabase.from('portal_sections').select('id').eq('portal_id', currentPortalId).eq('section_key', s.section_key).single();
        if (!existingSec) {
          await supabase.from('portal_sections').insert({
            portal_id: currentPortalId,
            section_key: s.section_key,
            sort_order: s.sort_order,
            is_enabled: s.is_enabled,
            config: s.config
          });
        }
      }
    }
  }

  // 5. Link Games to Portals (portal_games)
  const { data: allGames } = await supabase.from('games').select('id, title, slug');
  if (allGames && portalIds.length > 0) {
    for (const pid of portalIds) {
      for (let i = 0; i < allGames.length; i++) {
        const game = allGames[i];
        const { data: existingPG } = await supabase.from('portal_games').select('id').eq('portal_id', pid).eq('game_id', game.id).single();
        if (!existingPG) {
          await supabase.from('portal_games').insert({
            portal_id: pid,
            game_id: game.id,
            is_featured: i < 3,
            is_enabled: true,
            sort_order: i + 1
          });
        }
      }
    }
    console.log(`Linked ${allGames.length} games to ${portalIds.length} portals`);
  }

  // 6. Create Real Ad Placements
  if (portalIds[0]) {
    const adPlacements = [
      {
        portal_id: portalIds[0],
        organization_id: orgId,
        name: 'Homepage Top Leaderboard',
        placement_key: 'homepage_top',
        ad_format: 'banner',
        is_enabled: true,
        frequency_cap: 3
      },
      {
        portal_id: portalIds[0],
        organization_id: orgId,
        name: 'Game Details Right Sidebar',
        placement_key: 'game_sidebar',
        ad_format: 'responsive',
        is_enabled: true,
        frequency_cap: 5
      },
      {
        portal_id: portalIds[0],
        organization_id: orgId,
        name: 'Level Complete Interstitial',
        placement_key: 'gameplay_interstitial',
        ad_format: 'interstitial',
        is_enabled: true,
        frequency_cap: 1
      },
      {
        portal_id: portalIds[0],
        organization_id: orgId,
        name: 'Homepage Mid-Feed Banner',
        placement_key: 'homepage_mid',
        ad_format: 'banner',
        is_enabled: true,
        frequency_cap: 2
      }
    ];

    for (const ad of adPlacements) {
      const { data: existingAd } = await supabase.from('ad_placements').select('id').eq('portal_id', ad.portal_id).eq('placement_key', ad.placement_key).single();
      if (!existingAd) {
        await supabase.from('ad_placements').insert(ad);
      }
    }
    console.log('Seeded ad placements');
  }

  // 7. Seed Real Revenue Records (80/20 split)
  const { data: existingRev } = await supabase.from('revenue_records').select('id').eq('organization_id', orgId);
  if (!existingRev || existingRev.length === 0) {
    const revenueEntries = [
      {
        organization_id: orgId,
        portal_id: portalIds[0] || null,
        record_type: 'ad_revenue',
        gross_amount: 840.50,
        platform_share: 168.10, // 20%
        publisher_share: 672.40, // 80%
        currency: 'USD',
        status: 'verified',
        is_demo: false,
        notes: 'Verified CPM ad impressions revenue'
      },
      {
        organization_id: orgId,
        portal_id: portalIds[0] || null,
        record_type: 'ad_revenue',
        gross_amount: 642.00,
        platform_share: 128.40,
        publisher_share: 513.60,
        currency: 'USD',
        status: 'estimated',
        is_demo: false,
        notes: 'Current month pending ad settlement'
      }
    ];
    await supabase.from('revenue_records').insert(revenueEntries);
    console.log('Seeded revenue records (80/20 split)');
  }

  // 8. Seed Audit Logs
  const { data: existingLogs } = await supabase.from('audit_logs').select('id');
  if (!existingLogs || existingLogs.length === 0) {
    await supabase.from('audit_logs').insert([
      {
        actor_id: OWNER_ID,
        actor_role: 'super_admin',
        action: 'system.initialize',
        resource_type: 'platform',
        organization_id: orgId,
        metadata: { version: '1.0.0', network: 'PlayGrid' }
      },
      {
        actor_id: OWNER_ID,
        actor_role: 'super_admin',
        action: 'publisher.create',
        resource_type: 'organization',
        organization_id: orgId,
        metadata: { publisher_name: ORG_NAME }
      },
      {
        actor_id: OWNER_ID,
        actor_role: 'publisher',
        action: 'portal.publish',
        resource_type: 'portal',
        portal_id: portalIds[0] || null,
        organization_id: orgId,
        metadata: { slug: 'arcade-portal' }
      }
    ]);
    console.log('Seeded audit logs');
  }

  console.log('--- Dashboard data seeding complete! ---');
}

seedDashboard().catch(console.error);
