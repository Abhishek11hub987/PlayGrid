# UI DESIGN SYSTEM SPECIFICATION

## 1. Aesthetic Foundations
PlayGrid implements a unified, high-contrast dark gaming visual identity:
- **Surface Palette:** Dark navy & charcoal (`#020617`, `#0f172a`, `#1e293b`).
- **Brand Accents:**
  - Primary Purple: `#6720ff` (glow highlights, primary buttons)
  - Electric Blue: `#0ea5e9` (badges, interactive status)
  - Neon Cyan: `#38bdf8` (gradients, text emphasis)
  - Signal Gold: `#f59e0b` (demo badges, ratings)
  - Signal Crimson: `#ef4444` (destructive actions, alerts)
- **Typography:** Inter & Geist font stacks with clear weight hierarchy (400, 500, 600, 700, 800).

## 2. Utility Classes & Component Styling
- **Glassmorphism:** `.glass-card` uses `backdrop-filter: blur(16px)` and subtle border highlights (`rgba(255,255,255,0.08)`).
- **Glow Effects:** `.text-glow` and `.animate-glow-pulse` provide arcade-style energy to hero titles and play buttons.
- **Card Hover Mechanics:** `.game-card` scales smoothly (`translateY(-4px) scale(1.02)`) with deep colored shadows.

## 3. Atomic Components & Variants
| Component | Variants | Default Size |
|---|---|---|
| `Button` | `default`, `outline`, `secondary`, `ghost`, `electric`, `glow`, `destructive` | `h-10 px-4 py-2` |
| `Badge` | `default` (purple), `secondary`, `success` (green), `warning` (gold), `destructive` (red), `outline` | `px-2.5 py-0.5 text-xs` |
| `Card` | `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | Rounded 12px |
| `Input` | High-contrast dark input with focused brand ring | `h-10 text-sm` |
| `Dialog` | Modal dialogs with dark overlay and smooth scale-in transitions | Max 32rem |

## 4. Layout Templates
- **Public Portal:** Header with sticky navigation, dynamic hero block, responsive game card grids (2 / 3 / 4 / 6 columns), and comprehensive legal footer.
- **Publisher Dashboard:** Collapsible sidebar navigation, top command bar with user profile dropdown, and data-dense card layouts.
- **Super Admin Dashboard:** Operations layout featuring gold-accented warnings, high-density tabular ledgers, and quick-action toolbars.

