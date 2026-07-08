# CNO Phase 2 - Services & Service-Areas (Design)

Date: 2026-07-03
Status: AUTONOMOUS DRAFT - Vlad stepped away and said "go subagent driven, just keep going."
Built on branch `phase2-services-areas` (main stays at clean Phase 1). Nothing deploys.
Every decision below marked [DECIDED] was made without Vlad; review the branch diff when back.

## Goal

Rebuild the Services and Service-Area page system in the approved Cleean design with
HONEST content, replacing the pre-existing scaffold pages that are (a) visually broken
(old CSS classes were removed in Phase 1) and (b) full of false claims. This closes the
#1 launch gate from the Phase 1 final review.

## Why this is needed (the launch gate)

The 11 service pages, 7 area pages, both index pages, and BOTH layouts (`service.njk`,
`area.njk`) currently contain false/again-misleading copy and address leaks, e.g.:
- `area.njk` layout hardcodes "Family-Owned Since 1970" + "55+ Years" into ALL 7 area pages.
- `clarkston.md`: "6575 Ridgewood Road" (x2), "founded in 1970 by Zosim Serban",
  "55+ years", "five decades", "second/third-generation clients".
- `pole-barns.md`: "Family-owned since 1970 with 55+ years", "Founded by Zosim Serban".
These are FALSE: CNO was established Feb 1970 by the
Overfield family; Zosim Serban ACQUIRED it ~2023 (CNO = Charlie and Nancy Overfield, per a family review).
The pages also use the old `var(--gold)`
design that no longer exists in style.css.

## Honesty rules (hard constraints - enforced by grep guardrails on every built page)

FORBIDDEN anywhere in Phase 2 output:
- "family-owned since 1970", "family owned/-owned", "founded by Zosim ... 1970",
  "since 1970" attached to ownership/experience, "55 years"/"55+"/"five decades"/
  "half a century"/"decades of", "generations"/"second/third-generation", "same family".
- Any street address ("Ridgewood", "6575"), any storefront/"stop by our shop" language.
- Invented specifics: fake project counts, prices, dimensions-as-promises, warranties,
  credentials, or crew claims beyond the confirmed facts below. No em dashes / en dashes.

ALLOWED (grounded in docs/reference/*):
- "established 1970" as the business's founding DATE, used sparingly and factually.
- "locally owned and operated"; Zosim Serban as current owner who took over ~3 years ago;
  "new crew, same idea" (matches the approved homepage).
- Trust facts: A+ BBB Rated, Licensed & Insured, Certified Federal Steel Builder,
  Free Estimates. 3 crews. Residential & commercial. Service-area business.
- NAP: (248) 625-2334 / tel:+12486252334. Counties: Oakland, Genesee, Lapeer, Macomb.
- The real services and the real 5-star reviewers (Bogdan, Reimund, Tomek, Heather,
  Joseph, Samantha, Alex, Karl, robert). Michigan climate facts (snow load, freeze-thaw).
- Content must be grounded in docs/reference/cno-business-profile.md +
  docs/reference/cno-reviews.md. When a specific is unknown, stay general and truthful.

## Design approach [DECIDED]

Reuse the approved Cleean component classes (`.wrap .head .blk .vp .svc .split .checks
.areas .steps .founder .tg .cta .btn-dark .btn-ghost .lab`) from the Phase 1 homepage so
interior pages match the approved look. Add a MODEST set of interior-page components to
style.css in the same visual language: an interior page-hero, breadcrumb, FAQ accordion,
and a simple gallery grid. No new color tokens, no new fonts, no third-party CSS.

Rationale: extends an already-approved design rather than inventing a new one (lower risk),
and keeps the whole site visually consistent.

## Page inventory (all pre-existing; rewrite in place)

- Layouts (rebuild, Cleean + honest): `src/_includes/layouts/service.njk`, `.../area.njk`
- Indexes (rebuild, Cleean): `src/services/services.njk` (/services/), `src/areas/areas.njk` (/areas/)
- 11 service `.md` (rewrite copy + frontmatter honestly): barndominiums, boat-rv-storage,
  commercial-buildings, demolition, garages, horse-barns, pole-barns, pole-sheds, roofing,
  shop-storage, siding-repair
- 7 area `.md` (rewrite copy + frontmatter honestly): clarkston, fenton, holly, howell,
  rochester-hills, south-lyon, waterford

Keep existing frontmatter keys the layouts consume (title, subtitle, description, image,
category, features, gallery, faq, tags for services; title, description, city, state,
county, image, subtitle, whyChoose for areas). Keep the GOOD honest FAQ content (timelines
"vary", permit help, size ranges); rewrite only the dishonest parts.

## SEO [DECIDED]

- Service pages: Service + BreadcrumbList + FAQPage JSON-LD (FAQ only when faq present).
- Area pages: Service (areaServed = the city/county) + BreadcrumbList JSON-LD. NO address node.
- Internal-link mesh: service<->service (Other Services), service<->area (areas list),
  area<->area (nearby areas), all pages link to /contact/ and tel:. Home already links out
  after nav wiring below.
- Sitemap curation: add `eleventyExcludeFromCollections: true` to 404.njk; keep /admin out
  of the sitemap. Service/area pages are honest now, so they belong in the sitemap.

## Also in scope (resolves Phase 1 tracked items) [DECIDED]

- Wire nav + footer links: nav Services->/services/, Service Areas->/areas/, About->/about/
  (about is Phase 3; link but note), Reviews->home #reviews or /reviews/ (Phase 3) - use
  in-page/# where the target does not exist yet, real routes where it does. Footer service +
  company columns get real hrefs.
- Update `src/js/main.js` to target `nav.site` (not the removed `.nav`) and drop the stale
  `var(--gold)` reference, so the sticky-nav scroll state + smooth-scroll offset work with
  the new markup. Keep all selector guards.

## Explicitly DEFERRED (flagged for Vlad; NOT built autonomously)

- Net-new pages: crane-rental (service), oakland-township + west-bloomfield (areas) -
  net-new content; confirm they are still offered/wanted first.
- Phase 3: portfolio, blog posts, contact page + Web3Forms form + thank-you, reviews page,
  terms page, 301 `_redirects`, eleventy-img photo optimization, host decision
  (Cloudflare vs GitHub Pages), DNS cutover.
- About page rewrite: `about.njk` is also dishonest but is a Phase-3 "core page"; left for
  its own pass (flagged). Nav "About" link points to it but it still needs its own rewrite.

## Testing model (same as Phase 1)

Per task: build succeeds (`npx @11ty/eleventy`) + positive greps (required honest content
present) + guardrail greps (every forbidden string above ABSENT from the built pages).
A guardrail hit = failure. Execute via subagent-driven-development on this branch.
