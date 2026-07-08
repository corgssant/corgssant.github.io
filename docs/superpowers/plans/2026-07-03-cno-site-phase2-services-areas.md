# CNO Pole Barns - Phase 2: Services & Service-Areas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the 11 service pages, 7 service-area pages, both index pages, and both layouts in the approved Cleean design with HONEST copy, closing the Phase 1 launch gate (false "family-owned since 1970" / "founded by Zosim in 1970" / "55 years" / street-address content).

**Architecture:** Eleventy static site. Interior pages reuse the Phase 1 Cleean component classes plus a modest interior-CSS block. `service.njk` and `area.njk` layouts wrap markdown content (`src/services/*.md`, `src/areas/*.md`) selected by the `services`/`areas` collections. JSON-LD (Service/FAQ/Breadcrumb) is baked into the layouts. See spec: `docs/superpowers/specs/2026-07-03-cno-phase2-services-areas-design.md`.

**Tech Stack:** Eleventy v3, Nunjucks, vanilla CSS (extends Phase 1 style.css), self-hosted Inter.

## Global Constraints

Every task's requirements implicitly include this section. Copy values verbatim.

- **Honesty - FORBIDDEN in any output (built pages AND source):** "family owned"/"family-owned", "family-owned since 1970", "founded by Zosim ... 1970"/"founded in 1970 by Zosim", "since 1970" attached to ownership/experience/tenure, "55 years"/"55+"/"over 55"/"five decades"/"decades of"/"half a century", "generations"/"second-generation"/"third-generation", "same family", any street address ("Ridgewood", "6575"), "stop by our shop"/storefront language, "Ian". No em dashes (—) or en dashes (–). No invented stats (project counts, prices, dimensions-as-promises, warranties, credentials, crew numbers beyond "3 crews").
- **Honesty - ALLOWED (grounded facts only):** "established 1970" (founding DATE, factual, sparing); "locally owned and operated"; Zosim Serban is the current owner who took over about three years ago; "new crew, same idea";
  - Note on the year: the Phase-1 footer + homepage already use the APPROVED "building/built since 1970" (the business's operating history) and appear site-wide; that is honest and is NOT a guardrail failure. NEW Phase-2 content should still prefer "established 1970" over "since 1970". The guardrails target the DISHONEST phrasings (family-owned, founded-by-Zosim-in-1970, 55 years, decades, generations, street address), NOT the bare year "1970" or "since 1970". trust facts = A+ BBB Rated, Licensed & Insured, Certified Federal Steel Builder, Free Estimates; 3 crews; residential & commercial; service-area business (no address). Ground all copy in `docs/reference/cno-business-profile.md` + `docs/reference/cno-reviews.md`. When a specific is unknown, stay general and truthful. Never copy prose from the OLD `.md` files (they are the source of the lies).
- **NAP:** Phone `(248) 625-2334`, tel `+12486252334`. Counties served: Oakland, Genesee, Lapeer, Macomb. Towns: Clarkston, Waterford, White Lake, Holly, Fenton, Flint, Lapeer, Metamora, Auburn Hills, Pontiac, Troy, Royal Oak, Farmington Hills.
- **Design:** Reuse Phase 1 Cleean classes: `.wrap .head .lab .blk .vp .svc .split .checks .areas .steps .founder .tg .cta .btn-dark .btn-ghost`. Palette tokens already in `:root` (--dark #242c24, --body #4e574e, --soft #e3e9e3, --offwhite #f6f9f6, --white #fff, --green #47bb66, --green-deep #2f7d47). Font: Inter (self-hosted). NEVER use the old classes (`.service-hero .section .split-img .service-card .cta-banner .btn-primary .btn-outline .page-hero .fade-up`) or `var(--gold)` - they no longer exist in style.css.
- **Build:** `npx @11ty/eleventy` -> `_site`. Collections: `services` = `src/services/*.md`, `areas` = `src/areas/*.md`.

**Testing model (static site):** each task's "test" = (a) build succeeds, (b) positive greps (required honest content present) and (c) GUARDRAIL greps (every FORBIDDEN string above ABSENT). A guardrail grep that matches is a FAILURE. Layouts are fixed before content, so once a page's layout (Task 2/3) AND its content (Task 5-9) are honest, that page's BUILT html must be fully clean.

---

### Task 1: Interior-page CSS (Cleean style)

**Files:**
- Modify: `src/css/style.css` (append an interior-pages section; do NOT alter Phase 1 rules)

**Interfaces:**
- Produces classes consumed by Tasks 2-4: `.crumbs` (breadcrumb), `.phero` (interior page hero), `.svc-hero` (service/area hero band), `.flist`/`.flist li` (checkmark feature list), `.faq`/`.faq-q`/`.faq-a`/`.faq.open` (accordion), `.ggrid`/`.ggrid img` (gallery), `.detail` (prose column), `.sidecard` (contact/CTA aside).

- [ ] **Step 1: Append interior CSS**

Append to `src/css/style.css` a clearly-commented `/* interior pages (phase 2) */` block defining the classes above, in the existing Cleean visual language: use the `:root` tokens, Inter, border-radius and spacing consistent with Phase 1 components, `--green-deep` for links, `--soft` hairlines. The interior hero (`.phero`) is a simple left-aligned band (NOT a full-bleed background image): `.wrap` width, generous top/bottom padding, `h1` at the homepage hero scale, a `.lab` eyebrow, and a `.crumbs` breadcrumb line above the h1. `.flist` is a 2-col checkmark list (reuse `.checks` look). `.faq` items are bordered rows; `.faq-a` hidden by default, shown when the item has `.open`. `.ggrid` is a responsive image grid. Keep it lean (target under ~200 lines). No `var(--gold)`, no em dashes in comments.

- [ ] **Step 2: Build and assert the classes exist**

Run: `npx @11ty/eleventy`
```bash
for c in crumbs phero svc-hero flist faq ggrid detail; do grep -q "\.$c" _site/css/style.css && echo "OK .$c" || echo "MISSING .$c"; done
grep -q 'var(--gold)' _site/css/style.css && echo "FAIL-gold" || echo "OK-no-gold"
grep -q '—' _site/css/style.css && echo "FAIL-emdash" || echo "OK-no-emdash"
```
Expected: all `OK`, `OK-no-gold`, `OK-no-emdash`.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "style: interior-page components (breadcrumb, page hero, FAQ, gallery) in Cleean style"
```

---

### Task 2: Rebuild `service.njk` layout (Cleean + JSON-LD)

**Files:**
- Modify: `src/_includes/layouts/service.njk` (full rebuild)
- Create: `src/_includes/partials/schema-breadcrumb.njk` (shared, reused by Task 3)

**Interfaces:**
- Consumes frontmatter: `title`, `subtitle`, `description`, `category`, `image`, `features[]`, `gallery[]` (`{src,alt,caption}`), `faq[]` (`{q,a}`), `tags[]`, plus `site.*` and `collections.services`.
- Produces: `schema-breadcrumb.njk` partial taking `crumbs` (an array of `{name,url}`) - Task 3 reuses it.

- [ ] **Step 1: Create `src/_includes/partials/schema-breadcrumb.njk`**

A `BreadcrumbList` JSON-LD `<script>` that loops a `crumbs` variable (array of `{name, url}`) with `position` = loop.index and `item` = `{{ site.url }}{{ c.url }}`.

- [ ] **Step 2: Rebuild `service.njk`** using ONLY Cleean + interior classes. Structure:
  1. Interior `.phero` band: `.crumbs` breadcrumb (Home / Services / {{title}}), `.lab` = `{{ category }}`, `<h1>{{ title }}</h1>`, `{{ subtitle }}`, a `.btn-dark` to `/contact/` and a `.btn-ghost` `tel:` link.
  2. `.split`/`.checks` intro: `{{ content | safe }}` on one side, the `image` on the other, `features[]` as a `.flist`.
  3. `.ggrid` gallery when `gallery` present.
  4. `.faq` accordion when `faq` present (button toggles `.open`; wire in main.js Task 10 - for now render markup, closed by default).
  5. `.svc` "Other services" grid looping `collections.services` where `service.url != page.url` (title, subtitle, link).
  6. `.cta` band to `/contact/` + tel.
  7. JSON-LD: `Service` (name=title, provider=CNO, areaServed=the 4 counties, serviceType from `category`), include `partials/schema-breadcrumb.njk` with `crumbs` set to Home/Services/title, and a `FAQPage` script ONLY when `faq` present. NO address node.

Set `crumbs` via `{% set crumbs = [{name:"Home",url:"/"},{name:"Services",url:"/services/"},{name:title,url:page.url}] %}`.

- [ ] **Step 3: Build and assert (layout-level - content is still old until Tasks 5-7)**

Run: `npx @11ty/eleventy`
```bash
# the LAYOUT file itself must be honesty-clean:
grep -qiE 'family|1970|55|decade|Ridgewood|—|–' src/_includes/layouts/service.njk && echo "FAIL-layout-dirty" || echo "OK-layout-clean"
# a service page renders with new design + schema:
grep -q 'phero' _site/services/pole-barns/index.html && echo OK-newdesign
grep -q '"@type": "Service"' _site/services/pole-barns/index.html && echo OK-service-schema
grep -q 'BreadcrumbList' _site/services/pole-barns/index.html && echo OK-breadcrumb
grep -c 'streetAddress' _site/services/pole-barns/index.html   # expect 0
grep -q 'btn-primary\|var(--gold)\|service-hero' _site/services/pole-barns/index.html && echo "FAIL-olddesign" || echo OK-no-old
```
Expected: `OK-layout-clean`, `OK-newdesign`, `OK-service-schema`, `OK-breadcrumb`, streetAddress `0`, `OK-no-old`. (The page BODY prose may still contain old dishonest content from the .md until Task 5-7; that is expected and swept in Task 11.)

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: rebuild service layout in Cleean design with Service/FAQ/Breadcrumb JSON-LD"
```

---

### Task 3: Rebuild `area.njk` layout (Cleean + JSON-LD, remove baked-in lies)

**Files:**
- Modify: `src/_includes/layouts/area.njk` (full rebuild)

**Interfaces:**
- Consumes frontmatter: `title`, `description`, `city`, `state` (default "MI"), `county`, `image`, `subtitle`, `whyChoose[]` (`{title,text}`), plus `site.*`, `collections.services`, `collections.areas`.
- Reuses `partials/schema-breadcrumb.njk` from Task 2.

- [ ] **Step 1: Rebuild `area.njk`** using Cleean + interior classes. Structure:
  1. `.phero` band: `.crumbs` (Home / Service Areas / {{city}}), `.lab` = "Service Area", `<h1>Pole Barn Builders in {{ city }}, {{ state or "MI" }}</h1>`, `{{ subtitle }}`, `.btn-dark` /contact/ + `.btn-ghost` tel.
  2. `.split`/`.checks` intro: `{{ content | safe }}` + image; a `.flist` of the trust facts (A+ BBB Rated, Licensed & Insured, Certified Federal Steel Builder, Free Estimates). ABSOLUTELY NO "Family-Owned Since 1970"/"55+ Years"/"since 1970" (the old layout hardcoded these - they must be GONE).
  3. `.svc` grid: services offered, looping `collections.services` (limit is fine).
  4. `.steps` "Why {{city}} chooses CNO" looping `whyChoose[]` when present.
  5. `.areas` "We also serve" looping `collections.areas` where `area.url != page.url` (city tags -> area.url).
  6. `.cta` to /contact/ + tel.
  7. JSON-LD: `Service` with `areaServed` = `{ "@type":"City", "name":"{{ city }}, MI" }` and provider CNO; include `schema-breadcrumb.njk` with crumbs Home/Service Areas/city. NO address node.

- [ ] **Step 2: Build and assert (layout-level)**

Run: `npx @11ty/eleventy`
```bash
grep -qiE 'family|1970|55|decade|Ridgewood|—|–' src/_includes/layouts/area.njk && echo "FAIL-layout-dirty" || echo "OK-layout-clean"
grep -q 'phero' _site/areas/clarkston/index.html && echo OK-newdesign
grep -q 'BreadcrumbList' _site/areas/clarkston/index.html && echo OK-breadcrumb
grep -qi 'Family-Owned Since 1970\|55+ Years\|55 Years' _site/areas/clarkston/index.html && echo "FAIL-layout-lies" || echo OK-no-layout-lies
grep -c 'streetAddress' _site/areas/clarkston/index.html   # expect 0
```
Expected: `OK-layout-clean`, `OK-newdesign`, `OK-breadcrumb`, `OK-no-layout-lies`, streetAddress `0`. (Body prose from the .md may still be dishonest until Tasks 8-9.)

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: rebuild area layout in Cleean design, honest trust facts, Service/Breadcrumb JSON-LD"
```

---

### Task 4: Rebuild `/services/` and `/areas/` index pages (Cleean)

**Files:**
- Modify: `src/services/services.njk`, `src/areas/areas.njk`

**Interfaces:**
- Consumes: `collections.services`, `collections.areas`, `site.*`. Uses `layout: layouts/base.njk`.

- [ ] **Step 1: Rebuild `services.njk`** with `.phero` band (h1 "Our Services", honest subline), a `.svc` grid looping `collections.services` (image, title, subtitle, link to service.url), and a `.cta`. Remove all old classes and `var(--gold)`. Keep `permalink: /services/`.

- [ ] **Step 2: Rebuild `areas.njk`** with `.phero` band (h1 "Service Areas", subline listing the 4 counties via `site.counties`), an `.areas` tag list OR `.svc`-style grid looping `collections.areas` (city -> area.url), and a `.cta`. Keep `permalink: /areas/`.

- [ ] **Step 3: Build and assert**

Run: `npx @11ty/eleventy`
```bash
for p in services areas; do grep -q 'phero' _site/$p/index.html && echo "OK $p-newdesign" || echo "MISSING $p"; grep -q 'var(--gold)\|btn-primary\|page-hero' _site/$p/index.html && echo "FAIL $p-old" || echo "OK $p-no-old"; done
grep -q 'href="/services/pole-barns/"' _site/services/index.html && echo OK-links
```
Expected: `OK services-newdesign`, `OK areas-newdesign`, `OK ...-no-old`, `OK-links`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: rebuild services and areas index pages in Cleean design"
```

---

### Task 5: Rewrite service content - batch 1 (pole-barns, garages, horse-barns, pole-sheds)

**Files:**
- Modify: `src/services/pole-barns.md`, `src/services/garages.md`, `src/services/horse-barns.md`, `src/services/pole-sheds.md`

**Interfaces:** consumed by `service.njk` (Task 2). Keep frontmatter keys: `layout, title, subtitle, description, category, image, order, style` (drop `style` if unused by the new layout), `features[]`, `gallery[]`, `faq[]`, `tags[]`.

- [ ] **Step 1: Rewrite each file** keeping the frontmatter KEYS (update the `description` to an honest one under 160 chars - NO "family-owned since 1970"/"55 years"), keeping the good honest FAQ/features where accurate, and REWRITING the markdown body to honest prose grounded in the references. Every page: 2-4 short sections (what it is / built for Michigan / how CNO approaches it), each truthful and specific to that service. Use "established 1970" at most once and only as the business founding date; center Zosim as current owner + new crew; emphasize free estimates, licensed & insured, A+ BBB, the 4 counties. Do NOT reuse old prose. Example honest opener for pole-barns:

> CNO Pole Barns builds custom post-frame pole barns across southeast Michigan. The business was established in 1970 and today is locally owned and operated by Zosim Serban, who runs every job with his own crew. Whether you need agricultural storage, a workshop, or a multipurpose building, we design and build to your property and budget.

Note on "1970": Phase-2 content uses "established 1970" (founding DATE) and NEVER "since 1970"/"building since 1970" (which reads as tenure). The bare phrase "since 1970" is allowed ONLY on the Phase-1 homepage (`index.html`), which was already approved; the T11 site-wide sweep exempts it there and forbids it everywhere else.

- [ ] **Step 2: Build and run positive + guardrail greps on the 4 built pages**

Run: `npx @11ty/eleventy`
```bash
for s in pole-barns garages horse-barns pole-sheds; do
  f="_site/services/$s/index.html"
  grep -qiE 'family|founded (in |by ).*1970|55 (years|\+)|five decades|decades of|Ridgewood|—|–' "$f" && echo "FAIL $s" || echo "OK-clean $s"
  grep -qi '625-2334' "$f" && echo "OK-phone $s" || echo "MISSING-phone $s"
done
```
Expected: `OK-clean` + `OK-phone` for all 4. Any `FAIL` = fix before commit.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "content: honest rewrite of core service pages (pole barns, garages, horse barns, pole sheds)"
```

---

### Task 6: Rewrite service content - batch 2 (roofing, siding-repair, shop-storage, demolition)

**Files:** Modify `src/services/roofing.md`, `siding-repair.md`, `shop-storage.md`, `demolition.md`

- [ ] **Step 1:** Same content rules as Task 5, grounded per service (roofing = install/replace/repair, seen in reviews; siding/trim/soffit finish work; shop & storage buildings; demolition services - all in the profile's service list). Honest frontmatter `description` under 160 chars.
- [ ] **Step 2:** Build; run the same per-page guardrail+phone greps for `roofing siding-repair shop-storage demolition`. Expected all `OK-clean` + `OK-phone`.
- [ ] **Step 3:** Commit: `content: honest rewrite of service pages (roofing, siding repair, shop & storage, demolition)`

---

### Task 7: Rewrite service content - batch 3 (barndominiums, boat-rv-storage, commercial-buildings)

**Files:** Modify `src/services/barndominiums.md`, `boat-rv-storage.md`, `commercial-buildings.md`

- [ ] **Step 1:** Same rules, grounded (barndominiums/pole-barn houses; boat & RV / motorhome storage buildings; commercial & warehouse buildings, residential & commercial per profile). Honest `description` < 160 chars.
- [ ] **Step 2:** Build; run per-page guardrail+phone greps for `barndominiums boat-rv-storage commercial-buildings`. Expected all `OK-clean` + `OK-phone`.
- [ ] **Step 3:** Commit: `content: honest rewrite of service pages (barndominiums, boat & RV storage, commercial buildings)`

---

### Task 8: Rewrite area content - batch 1 (clarkston, fenton, holly, howell)

**Files:** Modify `src/areas/clarkston.md`, `fenton.md`, `holly.md`, `howell.md`

**Interfaces:** consumed by `area.njk` (Task 3). Frontmatter keys: `layout, title, description, city, state, county, image, subtitle, whyChoose[]`.

- [ ] **Step 1: Rewrite each** - keep the keys but make ALL values honest. CRITICAL: the current area files contain the worst violations (street address "6575 Ridgewood Road", "founded in 1970 by Zosim", "55+ years", "five decades", "second/third-generation clients", "our shop on Ridgewood Road"). NONE of that may survive. Honest local page = genuinely local (mention the town, township, real nearby roads/landmarks ONLY if factual and generic), the services offered there, the counties served, free on-site estimates, licensed & insured, A+ BBB - WITHOUT any address, ownership-continuity, or year-tenure claims. `subtitle` honest (e.g. "Custom pole barns, garages, and steel buildings for {{city}} and {{county}} County - locally owned, free estimates."). `whyChoose[]` reasons must be true (local knowledge of township permitting, built for Michigan weather, free estimates, one owner oversees the work - NOT "one family" / "five decades"). `description` < 160 chars, honest.
- [ ] **Step 2: Build; run guardrail greps on the 4 built area pages**

```bash
for a in clarkston fenton holly howell; do
  f="_site/areas/$a/index.html"
  grep -qiE 'family|founded (in |by ).*1970|55 (years|\+)|five decades|decades of|generation|Ridgewood|6575|—|–|stop by our' "$f" && echo "FAIL $a" || echo "OK-clean $a"
done
```
Expected: `OK-clean` for all 4.

- [ ] **Step 3:** Commit: `content: honest rewrite of area pages (Clarkston, Fenton, Holly, Howell) - removes address + false-tenure claims`

---

### Task 9: Rewrite area content - batch 2 (rochester-hills, south-lyon, waterford)

**Files:** Modify `src/areas/rochester-hills.md`, `south-lyon.md`, `waterford.md`

- [ ] **Step 1:** Same rules as Task 8, per town.
- [ ] **Step 2:** Build; run the same guardrail greps for `rochester-hills south-lyon waterford`. Expected `OK-clean` for all 3.
- [ ] **Step 3:** Commit: `content: honest rewrite of area pages (Rochester Hills, South Lyon, Waterford)`

---

### Task 10: Wire nav + footer links, update main.js for the new nav

**Files:** Modify `src/_includes/partials/nav.njk`, `src/_includes/partials/footer.njk`, `src/js/main.js`

**Interfaces:** consumed site-wide.

- [ ] **Step 1: nav.njk** - give the nav links real hrefs: Services -> `/services/`, Service Areas -> `/areas/`, About -> `/about/`, Our Work -> `/portfolio/`, Reviews -> `/#reviews` (homepage reviews anchor - add `id="reviews"` to the homepage reviews section in `src/index.njk` if missing). The CTA "Get a Free Estimate" -> `/contact/`. Keep the `nav.site` markup + classes.
- [ ] **Step 2: footer.njk** - give the footer Services + Company column links real hrefs (Services column -> the service pages; Company -> /about/, /portfolio/, /#reviews, /contact/). Keep honest (no address).
- [ ] **Step 3: main.js** - change the scroll-state selector from `.nav` to `nav.site`, keep the guard (`if (nav)`); remove the stale `var(--gold)` reference in the form handler (use a class or `--green` token); keep all other selector guards intact.
- [ ] **Step 4: Build + assert**

```bash
npx @11ty/eleventy
grep -q 'href="/services/"' _site/index.html && echo OK-nav-services
grep -q 'href="/areas/"' _site/index.html && echo OK-nav-areas
grep -q "querySelector('nav.site')\|querySelector(\"nav.site\")" src/js/main.js && echo OK-mainjs
grep -q 'gold' src/js/main.js && echo "FAIL-gold" || echo OK-no-gold
```
Expected: `OK-nav-services`, `OK-nav-areas`, `OK-mainjs`, `OK-no-gold`.

- [ ] **Step 5:** Commit: `feat: wire nav/footer links to real routes; update main.js for nav.site`

---

### Task 11: Sitemap curation + whole-site honesty sweep + link check

**Files:** Modify `src/404.njk` (add `eleventyExcludeFromCollections: true`); no other content changes expected (this task is the gate).

- [ ] **Step 1:** Add `eleventyExcludeFromCollections: true` to `src/404.njk` front matter so `/404.html` leaves the sitemap.
- [ ] **Step 2: Build; whole-site honesty sweep across ALL built pages**

```bash
npx @11ty/eleventy
# Phase-2 honesty gate: sweep the Phase-1-clean + Phase-2 surface, EXCLUDING the
# Phase-3-deferred pages that are still known-dishonest (about, portfolio, contact, blog).
SCOPE=$(find _site \( -name '*.html' -o -name '*.txt' -o -name '*.xml' \) \
  -not -path '*/about/*' -not -path '*/portfolio/*' -not -path '*/contact/*' -not -path '*/blog/*')
echo "=== forbidden strings across Phase-1+Phase-2 surface (each must be 0) ==="
for pat in 'family[ -]owned' '55 years' '55\+' 'five decades' 'decades of' 'founded in 1970' 'founded by Zosim' 'second-generation' 'third-generation' 'Ridgewood' '6575' '—' '–' '\bIan\b'; do
  n=$(grep -lIiE "$pat" $SCOPE 2>/dev/null | wc -l | tr -d ' ')
  echo "$n  <= $pat"
done
echo "=== KNOWN Phase-3 debt (report only, does NOT fail this task) ==="
grep -rlIiE 'family[ -]owned|since 1970|55 years|five decades|Ridgewood' _site/about _site/portfolio _site/contact _site/blog 2>/dev/null | wc -l | tr -d ' ' ; echo "^ deferred dishonest files (expected > 0; Phase 3 rewrites these)"
echo "=== 404 out of sitemap? ===" ; grep -q '/404.html' _site/sitemap.xml && echo "FAIL-404-in-sitemap" || echo OK-404-excluded
echo "=== internal links resolve (spot) ===" ; for u in /services/ /areas/ /services/pole-barns/ /areas/clarkston/; do test -f "_site${u}index.html" && echo "OK $u" || echo "MISSING $u"; done
```
Expected: every forbidden-string count in the Phase-1+Phase-2 SCOPE = `0`, since-1970-outside-homepage = `0`, `OK-404-excluded`, all links `OK`. The "Phase-3 debt" line is expected `> 0` (about/portfolio/contact/blog are deferred) and does NOT block this task. Any nonzero count in the SCOPE list = fix the offending Phase-2 file and re-run.

- [ ] **Step 3:** Commit: `chore: exclude 404 from sitemap; whole-site honesty sweep clean`

---

## Self-Review

- **Spec coverage:** interior CSS (T1), service layout+JSON-LD (T2), area layout+JSON-LD honest (T3), indexes (T4), 11 service content rewrites (T5-7), 7 area content rewrites (T8-9), nav/footer/main.js wiring (T10), sitemap curation + whole-site honesty sweep (T11). Deferred per spec: net-new pages (crane-rental, oakland-township, west-bloomfield), about-page rewrite, Phase 3 (portfolio/blog/contact/reviews/terms/redirects/img/host/DNS).
- **Honesty guardrails:** enforced per-page in T5-9 and site-wide in T11; layouts cleaned in T2-3 before content so built pages are fully clean once both are done.
- **Consistency:** interior classes defined in T1 are the ones used by T2-4; frontmatter keys preserved so layouts and content align; `schema-breadcrumb.njk` created in T2, reused in T3.
