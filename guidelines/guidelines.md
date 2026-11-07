PERMANENT PROJECT RULES: Intermarché Catering Site (single-brand, no white-label)

- Scope: one single site, one single brand (Intermarché), declined to simulate multiple PDV (points of sale / stores). No tenant switcher, no theming configurable by an external client — the Design System is fixed and imposed.
- PDV switcher (demo only): a selector in a discreet demo panel lets you simulate 2-3 different PDVs (name, address, hours, team, editorial content, enabled pickup/delivery methods) to prove the same design adapts to different content. This switcher exists for the demo only; a real visitor lands directly on their own PDV's site.
- Data: 100% mocked, typed, in separate files. No real network calls, no real payment. Discreet "Prototype" badge.
- Styling: Tailwind CSS only. Design tokens (colors, fonts, radius) centralized in a single theme file (not per tenant — one fixed theme for the whole site).
- Brand colors: institutional red (#E2001A as an approximation, to adjust if reference screenshots are provided), black (#000000), white background. Deliberately sober two-color-dominant palette, no other bright hues.
- Typography: bold modern sans-serif for headings, readable sans-serif for body text.
- Interface language: French. Code, comments, identifiers: English. French formats (date DD/MM/YYYY, €, decimal comma). VAT 5.5% food, 20% alcohol.
- Allergens: exactly the 14 EU regulatory allergens.
- Every list/page has a loading (skeleton), empty, and error state.
- Accessibility: WCAG AA contrast, visible focus, labelled inputs, keyboard navigation, touch targets >= 44px. Mobile-first.
- Small files, one component per file, reuse existing components.
- If ambiguous: pick the simplest option, do not invent features that weren't requested.
- Edits: change only what the current prompt asks for, never touch an unrelated part.
- Visual consistency: every new screen must reuse the exact design tokens and components already established on previously built screens (colors, typography, buttons, cards, spacing, icons, radius) — never introduce a new visual interpretation of the brand mid-project.
- Reference screenshots usage: when real-site screenshots (e.g. intermarche.com) are attached for visual guidance, use them strictly for visual style (colors, typography, spacing, component patterns, layout) — never copy their text content, links, menu items, or real-site features. All content must come from this project's own defined data and copy.
Reference link (for context only, may not be directly accessible): https://www.intermarche.com
Primary visual reference: the attached screenshots — use these as the source of truth for sizing and style.