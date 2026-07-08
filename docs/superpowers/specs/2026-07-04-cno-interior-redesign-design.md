# CNO Interior Page Redesign (article style + site-wide motion) - Design Spec

Date: 2026-07-04
Status: approved (v4 preview), ready to port
Supersedes the flat interior layout shipped on branch `phase2-services-areas` (not yet merged to main).

## 1. Context and goal

The Phase 2 service and area pages shipped in a flat, module-stacked layout. In review the owner found them too long and too "marketing landing page," and wanted them "more like blog pages": content-forward, with an image-forward hero, real motion, and better responsiveness, in the spirit of peer builders (mortonbuildings.com, dcbuilding.com, federalsteelsystems.com).

After four preview iterations, v4 is approved. This spec captures v4 and the plan to port it into the live Eleventy templates, plus a shared scroll-reveal motion system applied site-wide.

Approved preview: `service-page-preview-v4.html` (repo root). v1-v3 kept for reference and easy revert. These previews are untracked design artifacts; they will be removed once the port is verified.

## 2. The design (v4)

Service and area pages become a content-forward article:

- **Overlay hero.** Full-width photo, left-weighted dark scrim (linear-gradient rgba(16,24,17,.82) to .2, left to right), left-aligned text block (breadcrumb, eyebrow, h1, lead, two CTAs) vertically centered and aligned to the page container's left edge (same left edge as the nav brand and body copy). Photo settles from a slow scale on load. Height clamp(440px,62vh,660px).
  - **Thin-photo fallback.** If a page has no hero-worthy image, the hero renders as a solid dark band (brand `--dark`) with the same text, so pages without good photography still look intentional. This keeps the format robust across all 11 services regardless of photo quality.
- **Article body + sticky sidebar.** Grid `minmax(0,1fr) 330px`.
  - Article: markdown prose, a two-column feature checklist, one inline photo, FAQ accordion inline. Max-width ~720px, generous line-height.
  - Sidebar (sticky, top:98px): dark "Get a free estimate" card (estimate + call), "Why CNO" trust badges, "Related services" quick links. Stacks below the article under 960px.
- **Slim green CTA** band before the footer.
- **Nav:** standard solid sticky nav (dark text). The overlay hero is a dark photo, so the white nav reads fine over it; no per-page "dark hero" flag is needed for this format.

## 3. Motion system (site-wide)

Replace the dead `.fade-up` and counter code in `main.js` with a reveal system:

- CSS, inside `@media (prefers-reduced-motion: no-preference)`: `.reveal` (opacity + translateY), `.stagger > *` (staggered children via nth-child delays), `.riv img` (image zoom-settle), `.ohero.in .bg img` (hero settle). Reduced-motion users see no movement (elements are always visible outside this media query).
- JS: one IntersectionObserver adds `.in` when an element enters the viewport (threshold .12, rootMargin bottom -8%), then unobserves. Fallback adds `.in` to all if IntersectionObserver is missing. Keep the existing FAQ accordion, nav-scrolled, mobile-menu, smooth-scroll, and form handlers.
- Apply `.reveal`/`.stagger` hooks to the homepage sections and the two index pages so the whole site shares the motion.

## 4. Front-matter data model (service.njk / area.njk)

Service `.md` files already carry: `title`, `subtitle`, `description`, `category`, `image`, `order`, `features[]`, `gallery[]`, `faq[]`, `tags[]`. Mapping:

- `image` -> hero photo (fallback to solid dark band if missing).
- `category` -> hero eyebrow. `subtitle` -> hero lead.
- `features[]` -> feature checklist.
- inline body photo -> `gallery[0].src` if present, else omitted.
- `faq[]` -> FAQ accordion.
- related services -> auto-derived from `collections.services` (exclude current, cap 4), with optional `related[]` front-matter override.
- markdown body -> article prose.

Preserve the existing Service / FAQPage / Breadcrumb JSON-LD in the layout.

## 5. Scope and ordered plan (this effort)

1. Append an "interior pages v4" block to `src/css/style.css` (overlay hero + fallback, article layout, sticky sidebar, motion, responsive). Remove the obsolete flat interior CSS (`.phero`, `.svc-hero`, service `.split-img` bits) after the templates are switched.
2. Rewrite motion in `src/js/main.js`: replace the dead fade-up/counter with the reveal observer; keep FAQ, nav-scrolled, mobile menu, smooth scroll, form.
3. Rewrite `src/_includes/layouts/service.njk` to the v4 structure, front-matter driven, JSON-LD preserved.
4. Apply the matching treatment to `src/_includes/layouts/area.njk`. Area sidebar links to top services; area content stays location-specific and honest (no street address, no false tenure).
5. Add `.reveal`/`.stagger` hooks to `src/index.njk` and the `services.njk` / `areas.njk` indexes.
6. Build with Eleventy and verify service, area, home, and index pages render correctly (hero, sticky sidebar, motion, responsive, JSON-LD intact).

## 6. Honesty and copy guardrails (unchanged)

- "Building since 1970" is fine; never "family-owned since 1970," "founded by Zosim in 1970," "55 years," or a street address.
- Lead with the building and capability. Keep the owner (Zosim) acknowledgment to the About and home pages, not sprinkled across service and area pages.
- Borrowed peer terminology must stay accurate (post-frame, clear-span, permit-ready, code-compliant, snow load, straightforward pricing). No fabricated warranties or stats.

## 7. Deferred (not in this effort)

- De-AI copy pass, including the homepage headline "An old Michigan name, in new hands" (`src/index.njk`), after all pages exist.
- Per-service high-res photo plan. Only `michigan-farm.webp` (2835px) and `pole-building.jpg` (1900px) are truly high-res today; the thin-photo fallback covers the rest until photography improves.
- Rebuild About, Contact, Portfolio, and Blog in this language. These are still on the old scaffold and are the next phase.
- Original spec's "enhance" work: live Google reviews, Decap CMS, analytics.

## 8. Small open decisions (proposed defaults)

- Inline body image source: reuse `gallery[0].src`. (Alternative: a dedicated `bodyImage` field.)
- Related services: auto-derive the first 4 other services, allow a `related[]` override.
- Area pages use the same sidebar (estimate + call + trust) with "Related services" linking to the top services.

Unless changed, the port proceeds with these defaults.
