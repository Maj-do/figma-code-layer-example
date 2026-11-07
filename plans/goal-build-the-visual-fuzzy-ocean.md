# Plan: Intermarché Catering Home Page

## Context
Build the visual foundation and home page for an online catering ordering site modeled after intermarche.com. Clean slate (App.tsx is empty, index.css has only `@import 'tailwindcss'`). The 10 reference screenshots confirm the brand palette, layout patterns, and component styles.

## Visual Language (from reference images)
- **Primary red**: `#e2001a`
- **Background**: white `#ffffff`, light gray sections `#f5f5f5`
- **Dark text**: `#1a1a1a`
- **Footer**: near-black `#1c1c1c`
- **Typography**: Inter or system sans-serif, clean functional
- **Header**: white, logo left, store info, centered search bar, icons right
- **Hero**: large left banner (~60%), right grid of 2 smaller promos, far-right column of 3 service shortcuts
- **Product cards**: white, image top, brand/label text, bold price, red add-to-cart circle button
- **Service icons**: outlined icon + label, white card, subtle border

## Files to Create/Modify

### `src/index.css`
Add CSS custom properties (design tokens) after `@import 'tailwindcss'`:
```css
:root {
  --itm-red: #e2001a;
  --itm-red-dark: #b8001a;
  --itm-text: #1a1a1a;
  --itm-gray: #f5f5f5;
  --itm-border: #e0e0e0;
}
```
Add Inter font via Google Fonts `@import` before the tailwind import.

### `src/data/stores.ts` (new)
Two PDV objects with name, address, hours, phone, and `methods: string[]`.

### `src/data/products.ts` (new)
6+ featured products (name, price, badge, category) and 6 categories.

### `src/App.tsx`
Root component holding `activeStore` state (index 0 or 1). Renders all sections in order, passes store down as props. Includes `<DemoPanel>`.

### Components (all new under `src/components/`)
- `Header.tsx` — logo ("Intermarché" in red), store name + address, search input, account/cart icons
- `Hero.tsx` — large catering banner left, 2 promo cards right, 3 service shortcut links far right (matching ref layout)
- `FulfillmentMethods.tsx` — only renders methods enabled for active PDV; icon cards for "Retrait en magasin", "Drive", "Livraison à domicile"
- `Categories.tsx` — horizontal scroll / grid of 6 category chips/cards (Entrées, Plats, Desserts, Fromages, Boissons, Plateaux)
- `FeaturedProducts.tsx` — 4-column grid of product cards, each with image placeholder, name, price, red add button
- `ExpertiseBanner.tsx` — full-width dark red / image banner "Découvrez notre équipe et savoir-faire", CTA button
- `Footer.tsx` — 3 link columns (Accès direct, Services, Aide) + Intermarché logo + social icons; legal strip below
- `DemoPanel.tsx` — discreet floating panel bottom-left; toggle button opens panel with store switcher + viewport size selector (mobile 375px / tablet 768px / desktop full)

## Implementation Notes
- No router needed; this is a single-page home.
- Viewport preview in DemoPanel uses CSS `max-width` on a wrapper div + `overflow: hidden` to simulate viewport widths.
- All images are CSS background gradients or colored placeholder divs (no external image URLs).
- Tailwind v4 utility classes used throughout; tokens wired via CSS custom properties + `var()` in className-based inline styles where Tailwind can't express them.

## Verification
After implementation: open the preview panel and confirm:
1. Header shows store name + address for active PDV
2. Demo panel switches between the two stores and updates fulfillment badges
3. FulfillmentMethods shows 3 cards for Toulouse, 2 for Bordeaux
4. Product grid and categories render without overflow
5. Footer renders at the bottom with correct link columns
