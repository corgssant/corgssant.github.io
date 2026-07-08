# CNO Pole Barns website

Eleventy static site. Source in `src/`, build output `_site/` (never edit).
`npm run build` to build, `npm run dev` to serve locally,
`npm run verify` after content changes (build first) - it enforces the honesty
and style rules below and fails on broken links / invalid JSON-LD.

Design spec (canonical): `docs/superpowers/specs/2026-07-07-cno-phase3-steel-revamp-design.md`.
Business facts: `docs/reference/cno-business-profile.md`. Real review quotes: `docs/reference/cno-reviews.md`.

## Honesty rules (hard - verify.py enforces most)

- "Locally owned", NEVER "family owned": Zosim Serban bought the 1970-founded
  business around 2023. Only tenure phrase allowed: "Building since 1970".
  Never imply continuous family/ownership since 1970. Never name "Ian".
- No street address anywhere (service-area business). No invented stats, prices,
  review counts, aggregate ratings, project locations, or dimensions.
- Steel line: CNO quotes, delivers, and erects Federal Steel Systems buildings.
  No claimed history of completed steel projects. FSS granted permission
  (2026-07-07) to use their photos so customers see what CNO can install: usable
  anywhere IF visibly credited ("Photo: Federal Steel Systems") and never
  presented as CNO's own completed work ("our work"/job-site framing).
- Portfolio and "our work" imagery: only photos from `src/_data/portfolio.json`
  (real CNO job sites, EXIF/GPS stripped). Never re-add raw photos from
  `images/projects/Photos/` without stripping EXIF (they contain customer GPS).
- Review quotes verbatim (light trims OK), first name + last initial, from Google.

## Voice

Michigan builder, not marketer. Short sentences, concrete specifics (sizes,
counties, "three crews"), contractions fine. Banned: em dashes (use hyphens),
exclamation marks, "unprecedented/seamless/nestled/state-of-the-art/results-driven",
"isn't just X, it's Y", "Whether you're A, B, or C" openers, rule-of-three prose,
"-ing" clause openers ("Offering..."), consecutive sentences starting identically.

## Design system ("field ledger")

All tokens/components in `src/css/style.css` - extend it, don't add per-page CSS
unless truly one-off. Post-frame content uses pine green (`.lab`), steel content
uses slate (`.lab.steel`, `.steelband`, `.st`, `.scard.steel-hi`). Sharp corners
(`--r:2px`) - no pills, no large radii. Fonts are self-hosted in `src/fonts/`
(Barlow Condensed = display, Source Serif 4 = body, Barlow = UI); don't add CDN fonts.
Key patterns: `.ohero` interior hero, `.artwrap`/`.article`/`.aside`+`.scard`,
`.blk.cta .box` CTA band, `.reveal`/`.stagger` scroll motion (main.js toggles `.in`).
Homepage `src/index.njk` is the canonical component reference.

## Structure

- `src/services/*.md` (11 post-frame, layout `service.njk`) - `src/steel-buildings/*.md`
  (7 steel, layout `steel.njk`) - `src/areas/*.md` (7, layout `area.njk`) -
  `src/blog/*.md` (layout `post.njk`)
- Page schema (Service/FAQ/Breadcrumb JSON-LD) lives in the layouts, driven by
  front matter (`faq`, `related`, `image`, `imageCredit`) - keep the
  `| dump | safe` JSON-encoding pattern.
- Contact form posts to formsubmit.co/zosim@cnopolebarns.com (needs one-time email
  activation on first submission).
- Deploys: push to `main` -> GitHub Actions -> staging https://corgssant.github.io.
  Work on a branch, merge to main when verified.
