export interface AdSlotProps {
  placementKey: string
  format: 'banner' | 'responsive' | 'interstitial' | 'rewarded_video'
  portalId: string
  className?: string
}

export interface AdProviderAdapter {
  name: string
  slug: string
  renderSlot(props: AdSlotProps): React.ReactNode
}

// Demo provider — clearly labelled mock for local development
export const demoAdProvider: AdProviderAdapter = {
  name: 'Demo Provider',
  slug: 'demo',
  renderSlot({ placementKey, format, className }) {
    return null // Rendered by DemoAdSlot component
  },
}

export function getAdProvider(slug: string): AdProviderAdapter {
  switch (slug) {
    case 'demo':
      return demoAdProvider
    // Add real providers here after account approval
    default:
      return demoAdProvider
  }
}
