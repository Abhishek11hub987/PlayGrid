# ADVERTISING ARCHITECTURE & INTEGRATION GUIDE

## 1. Ethical Advertising Philosophy
PlayGrid operates with a strict player-first advertising code of conduct:
- **No Deceptive Placement:** Ads are never disguised as game controls, start buttons, or interactive gameplay elements.
- **No Accidental Clicks:** Guaranteed minimum padding separates advertising units from canvas touch/click surfaces.
- **No Pop-unders or Forced Redirections:** iframes render with sandbox attributes that prohibit top-level window redirection.
- **Transparent Mocking:** Local development and staging environments utilize clearly labeled `⚠️ DEMO AD SLOT` placeholders. Real advertising impressions, clicks, or revenues are never fabricated.

## 2. Supported Ad Formats & Specifications
| Format Key | Dimensions | Supported Placement Locations | User Experience Rule |
|---|---|---|---|
| `banner_leaderboard` | 728×90 (desktop) / 320×50 (mobile) | Above gameplay player, homepage mid-page | Fixed height, zero layout shift (CLS) |
| `display_skyscraper` | 160×600 or 300×250 | Right sidebar of game detail & gameplay | Sticky only on viewports ≥ 1280px |
| `interstitial` | Responsive Fullscreen | Between game stages or upon level failure | Frequency capped: Max 1 per 5 minutes |
| `rewarded_video` | Fullscreen Video Player | Voluntary player revive / bonus coins | Must require explicit opt-in click |

## 3. Provider Adapter Architecture
Monetization partners integrate through the unified `AdProviderAdapter` interface in `lib/ads/provider-adapter.ts`:

```typescript
export interface AdProviderAdapter {
  name: string
  slug: string
  renderSlot(props: AdSlotProps): React.ReactNode
}
```

### Transitioning from Demo to Google AdSense / Live DSP
1. **Google AdSense for Web Games:**
   - Register account on Google AdSense.
   - Verify ownership of publisher root domain.
   - Insert publisher client script into `app/layout.tsx`.
   - Update `lib/ads/provider-adapter.ts` to render `ins.adsbygoogle` tags with your `data-ad-client` and `data-ad-slot`.
2. **Consent Management (GDPR / CCPA):**
   - Ensure a IAB TCF v2.2 compliant CMP banner is active prior to loading personalized ad tags.

