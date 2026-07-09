# CNO Phase 3: Steel Line + Full Visual Revamp

Approved 2026-07-07 (mockup: claude.ai/code/artifact/86b9aab3, "v1-field-ledger").
Supersedes the Cleean visual system from Phases 1-2. Carries forward all honesty rules
and URL structure. Reference mockup source lives in the session scratchpad; the ported
Eleventy implementation (this phase) is canonical once committed.

## Positioning

- CNO is now a **certified Federal Steel Systems (FSS) dealer and installer**. Steel buildings
  are a **co-equal service line** next to post-frame.
- Brand name stays **CNO Pole Barns**; lockup/tagline broadens to
  **"Post-Frame & Steel Buildings"**. Domain stays cnopolebarns.com.
- Site thesis: "Two ways to build. We do both." Post-frame is coded **pine green**;
  steel is coded **slate steel-blue** (`--steel`). The color coding is sitewide and
  consistent: green eyebrows/accents on post-frame pages, slate on steel pages.

## Information architecture

Existing URLs unchanged. New:

- `/steel-buildings/` index: what PEMB is, when steel beats post-frame, FSS partnership
- `/steel-buildings/commercial/` (includes churches/community buildings)
- `/steel-buildings/industrial/`
- `/steel-buildings/aircraft-hangars/`
- `/steel-buildings/agricultural/`
- `/steel-buildings/arenas/`
- `/steel-buildings/mini-storage/`
- `/steel-buildings/express-line/`
- Rebuilds: `/about/`, `/contact/`, `/portfolio/`, `/blog/` (index)
- New blog post: steel building vs pole barn comparison (cornerstone, cross-linked)

Nav: Post-Frame (→ /services/), Steel Buildings (→ /steel-buildings/), Our Work,
Service Area (→ /areas/), About + phone + "Free estimate" button. Topbar: counties + hours.

## Design system ("field ledger")

Tokens (CSS custom properties, sharp corners, hairline rules):

- `--ink:#182619` `--pine:#2C5137` `--pine-deep:#1F3C28` `--moss:#55655A`
- `--paper:#F4F5EF` `--card:#FFF` `--line:#DBE1D3`
- `--gold:#C98A2A` (single accent; eyebrow ticks, numerals, buttons)
  `--gold-bright:#E0A33C`
- `--steel:#46586B` `--steel-tint:#EDF1F5` `--steel-line:#C9D3DD` (steel line ONLY)
- `--r:2px` radius everywhere. No pills, no large radii.

Type (self-hosted woff2, latin subsets, in `src/fonts/`):

- Display: **Barlow Condensed** 600/700, UPPERCASE headlines, line-height ~0.95
- Body: **Source Serif 4** 400/600 + 400 italic (reviews, editorial copy)
- UI: **Barlow** 400/500/600 (nav, buttons, labels, captions)
- Eyebrow pattern: 26px gold tick + letterspaced uppercase Barlow 12.5px
  (`.eb`, steel variant `.eb.steel`)

Components (see mockup/homepage for canon): sticky topbar+nav, full-bleed overlay hero,
dark trust strip with gold diamond separators, `.way` dual panels, `.svc` cards with
stroke-numbered labels, `.steelband` slate section with photo credit line, `.step`
outlined stroke numerals, `.wk` work tiles with label chips, `.rev` serif-italic quote
cards, `.hours-card` dark panel, pinstriped `.cta` band, dark footer. Scroll reveal
(`.rv`/`.in`, IntersectionObserver, respects prefers-reduced-motion; content visible
without JS).

## Voice (all copy)

Written like a Michigan builder talks. Rules:

- Short sentences. Concrete specifics beat adjectives (24'x30', one-day framing,
  three crews, A+ BBB, township permits).
- Use real names and real review details. "Zosim picks up. If he's on a roof, he
  calls back."
- Banned: em dashes (use hyphens), "unprecedented", "results-driven", "seamless",
  "nestled", rule-of-three constructions, "isn't just X, it's Y", negative
  parallelisms, "Whether you're A, B, or C" openers, exclamation marks in body copy.
- The FSS dealer copy (Website content.docx) is a FACT SOURCE ONLY (specs: 250'
  clear spans, 60' bays, ~5-week Express Line materials, insurance savings up to 30%,
  T-hangars, door types). Never reuse its sentences.
- Every page: definitional first paragraph (answers the page's core question in
  2-3 sentences - this is what AI search quotes), question-headed H2s where natural,
  FAQ section (3-5 real questions).

## Honesty rules (unchanged from Phase 2, plus steel)

- No false tenure/address claims. Approved phrasing: "Building since 1970" /
  "locally owned". No invented stats, review counts, or aggregate ratings.
- FSS manufacturer photos ONLY on steel pages/sections, always with visible credit
  ("Photo: Federal Steel Systems") and never presented as CNO projects. The homepage
  steel band carries: "Steel building photos courtesy of Federal Steel Systems. They
  show the building systems we install, not CNO projects."
- Portfolio/"our work" sections: CNO's own job-site photos only. Captions purely
  descriptive; never invent locations, dimensions, or dates not verifiable from
  reviews/references.
- Steel line claims: CNO quotes, delivers, and stands up FSS buildings. Do NOT claim a
  history of completed steel projects.
- Reviews quoted verbatim (light trims OK) with first name + last initial, attributed
  to Google.

## Images

- Steel (FSS, root drops) → `src/images/steel/` with SEO names, max 1600w, ~compressed
  JPEG/WebP. Credit metadata tracked in `src/_data/steelphotos.json`.
- `images/projects/Photos/` (real CNO job photos) → curate best ~25 into
  `src/images/projects/` with descriptive kebab names + `src/_data/portfolio.json`
  (src, alt, label, orientation). Skip blurry/duplicate/people-identifiable close-ups.
- All page images get width/height attrs, `loading="lazy"` below the fold, real alt text.
- Root-level photo drops and the raw Photos/ folder are NOT committed; git-ignore raw
  dumps. Only processed images under `src/images/` are committed.

## SEO / AIO

- Schema per page type (existing pattern): Service + FAQPage + BreadcrumbList on
  service/steel pages, LocalBusiness sitewide (update: add steel services + FSS
  certification, keep NAP/hours/areaServed).
- Steel pages target: "steel buildings michigan", "[type] steel building michigan",
  "pre-engineered metal building" + local modifiers. Comparison post targets
  "pole barn vs steel building".
- Update `llms.txt` (steel line, new pages), `sitemap.njk` picks up new pages
  automatically, verify.
- Internal link mesh: every steel page links to related post-frame page and vice versa
  ("Not sure which system? See ..."), area pages mention steel availability, blog
  comparison post linked from both indexes.

## Execution phases

- **A (Fable, this session):** fonts + style.css + base/nav/footer + index.njk +
  service.njk/area.njk/post.njk restyle. Commit = design canon.
- **B (Sonnet subagents, parallel, disjoint file scopes, no git commits by agents):**
  1. Image pipeline (steel + portfolio curation + data files)
  2. Steel section (8 pages + steel layout variant)
  3. About + Contact rebuilds
  4. Portfolio rebuild (needs #1)
  5. Blog index rebuild + comparison post
  6. SEO wiring (llms.txt, schema-localbusiness, meta sweep)
  7. Humanizer pass over existing 18 service/area pages (copy only)
- **C (verification):** eleventy build green, link check, honesty sweep, humanizer
  sweep, my visual QA on screenshots, then merge phase3 → main (staging deploy).
