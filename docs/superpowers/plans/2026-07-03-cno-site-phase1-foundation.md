# CNO Pole Barns - Phase 1: Foundation & Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a live, SEO-ready CNO Pole Barns homepage on Eleventy + GitHub Pages, in the approved Cleean style, with honest copy and real reviews.

**Architecture:** Eleventy (11ty) static site. Content/data in `src/_data`, layouts in `src/_includes`, one design-system stylesheet, self-hosted Inter. SEO baked into the base layout (meta + JSON-LD LocalBusiness) so every future page inherits it. Deployed by a GitHub Actions workflow to GitHub Pages.

**Tech Stack:** Eleventy v3, Nunjucks, vanilla CSS, self-hosted Inter (woff2), GitHub Actions, GitHub Pages.

**Reference on disk (already in repo/scratch, read these before starting):**
- Approved homepage HTML/CSS: `.superpowers/brainstorm/24293-1783040046/content/cleean-cno-home-v2.html` (the exact approved markup, copy, and CSS to port).
- Existing scaffold design system: `src/css/style.css` (already Cleean-palette; reconcile, don't rewrite from zero).
- Real data: `docs/reference/cno-reviews.md`, `docs/reference/cno-business-profile.md`.
- Spec: `docs/superpowers/specs/2026-07-03-cno-redesign-design.md`.

## Global Constraints

Every task's requirements implicitly include this section. Copy values verbatim.

- **Positioning (honesty):** Business established 1970; Zosim Serban bought it ~2023; new ownership, mostly new crew. NEVER write "family-owned since 1970", "same family", "same crew", "55 years", or imply continuity. Ownership line is exactly "locally owned and operated" (no name appended). Do NOT mention "Ian" anywhere. No fabricated testimonials or invented stats.
- **Service-area business:** NO public street address anywhere (no "6575 Ridgewood Road"). Present towns/counties served instead.
- **Voice:** Plain Michigan-builder tone, customer-focused, humanized. No meta/SEO-speak (never mention Google, "pages", or SEO in visible copy). No em dashes anywhere - use hyphens.
- **NAP:** Phone `(248) 625-2334` (tel `+12486252334`). Email `zosim@cnopolebarns.com`. Hours Mon-Sat 8:30 AM - 7:00 PM, closed Sunday. Google Place ID `ChIJyZVuhV-XJIgR9-gYNSxuCZs`.
- **Colors:** `--dark #242c24`, `--body #4e574e`, `--soft #e3e9e3`, `--offwhite #f6f9f6`, `--white #fff`, `--green #47bb66` (accent fills only), `--green-deep #2f7d47` (green text/links, AA). Font: Inter, self-hosted.
- **Trust facts (all true):** A+ BBB Rated, Licensed & Insured, Certified Federal Steel Builder, Free Estimates.
- **SEO-first:** semantic HTML5, one H1 per page, JSON-LD, sitemap.xml, robots.txt, llms.txt, fast/responsive images, self-hosted fonts.
- **Build command:** `npx @11ty/eleventy` (outputs to `_site`). Dev: `npm run dev`.

**Testing model for a static site:** each task's "test" is (a) the build succeeds, and (b) `grep` assertions on the generated `_site` output - both positive (required content present) and *guardrail* (forbidden content absent: "Ian", "family-owned since 1970", "Ridgewood", em dash `—`). Guardrail greps that find a match are FAILURES.

---

### Task 1: Clean up scaffold and correct site data

**Files:**
- Delete: `about.html`, `services.html`, `contact.html`, `index.html` (legacy root prototypes, not part of the Eleventy build)
- Modify: `src/_data/site.json`

**Interfaces:**
- Produces: `site.*` data consumed by every template (name, phone, phoneTel, email, hours, url, serviceAreas[], counties[], trust[], social{}).

- [ ] **Step 1: Delete the four legacy root HTML files**

```bash
git rm about.html services.html contact.html index.html
```

- [ ] **Step 2: Write the corrected site data**

Replace `src/_data/site.json` with:

```json
{
  "name": "CNO Pole Barns",
  "tagline": "Michigan pole barns, garages, and steel buildings",
  "phone": "(248) 625-2334",
  "phoneTel": "+12486252334",
  "email": "zosim@cnopolebarns.com",
  "hours": "Mon-Sat: 8:30 AM - 7:00 PM",
  "hoursNote": "Closed Sunday",
  "url": "https://cnopolebarns.com",
  "placeId": "ChIJyZVuhV-XJIgR9-gYNSxuCZs",
  "owner": "Zosim Serban",
  "established": 1970,
  "trust": ["A+ BBB Rated", "Licensed & Insured", "Certified Federal Steel Builder", "Free Estimates"],
  "counties": ["Oakland", "Genesee", "Lapeer", "Macomb"],
  "serviceAreas": ["Clarkston", "Waterford", "White Lake", "Holly", "Fenton", "Flint", "Lapeer", "Metamora", "Auburn Hills", "Pontiac", "Troy", "Royal Oak", "Farmington Hills"],
  "social": {
    "google": "https://maps.app.goo.gl/SjmusABzvdwmsS8e9",
    "facebook": "",
    "instagram": ""
  }
}
```

- [ ] **Step 3: Build and assert**

Run: `npx @11ty/eleventy`
Expected: build succeeds. Then:
```bash
grep -q '"zosim@cnopolebarns.com"' src/_data/site.json && echo OK-email
grep -q 'Ridgewood' src/_data/site.json && echo "FAIL-address" || echo OK-no-address
```
Expected: `OK-email` and `OK-no-address`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove legacy root HTML and correct site data (honest NAP, service-area)"
```

---

### Task 2: Self-host Inter

**Files:**
- Create: `src/fonts/inter-latin.woff2` (variable, latin subset)
- Create: `src/css/fonts.css`
- Modify: `eleventy.config.js` (passthrough `src/fonts`)

**Interfaces:**
- Produces: an `Inter` `@font-face` available to `style.css`; `/fonts/` and `/css/fonts.css` served.

- [ ] **Step 1: Fetch the Inter latin woff2**

```bash
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
mkdir -p src/fonts
curl -s -A "$UA" 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap' -o /tmp/inter.css
FURL=$(grep -oE 'https://[^) ]+\.woff2' /tmp/inter.css | tail -1)
curl -s -A "$UA" "$FURL" -o src/fonts/inter-latin.woff2
ls -la src/fonts/inter-latin.woff2
```
Expected: a ~40-50 KB woff2 file.

- [ ] **Step 2: Create `src/css/fonts.css`**

```css
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('/fonts/inter-latin.woff2') format('woff2');
}
```

- [ ] **Step 3: Add font passthrough in `eleventy.config.js`**

Add near the other `addPassthroughCopy` calls:
```js
eleventyConfig.addPassthroughCopy("src/fonts");
```

- [ ] **Step 4: Build and assert**

Run: `npx @11ty/eleventy`
```bash
test -f _site/fonts/inter-latin.woff2 && echo OK-font
```
Expected: `OK-font`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: self-host Inter (latin subset)"
```

---

### Task 3: Reconcile the design system to the approved preview

**Files:**
- Modify: `src/css/style.css`

**Interfaces:**
- Consumes: `Inter` from `fonts.css`.
- Produces: the class contract used by templates: `.wrap .lab .btn .btn-dark .btn-ghost nav.site .navrow .brand .nl .hero .hero-card .trust .vp .split .checks .svc .areas .founder .steps .tg .cta footer.site`.

- [ ] **Step 1: Port the approved CSS**

Open `.superpowers/brainstorm/24293-1783040046/content/cleean-cno-home-v2.html`, copy the entire contents of its `<style>` block, and make `src/css/style.css` match it. Prepend `@import url('/css/fonts.css');` as the first line. Key differences from the current scaffold to guarantee: `nav.site` uses `position:sticky; top:0;` (header pinned to the very top), and the token values match the Global Constraints palette exactly.

- [ ] **Step 2: Build and assert the class contract exists**

Run: `npx @11ty/eleventy`
```bash
for c in "nav.site" ".hero" ".trust" ".vp" ".svc" ".areas" ".founder" ".steps" ".tg" "footer.site"; do grep -q "$c" _site/css/style.css && echo "OK $c" || echo "MISSING $c"; done
grep -q 'top:0' _site/css/style.css && echo OK-nav-top
```
Expected: all `OK`, and `OK-nav-top`.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "style: reconcile design system to approved Cleean preview (nav pinned to top)"
```

---

### Task 4: SEO-ready base layout + LocalBusiness schema

**Files:**
- Modify: `src/_includes/layouts/base.njk`
- Create: `src/_includes/partials/schema-localbusiness.njk`

**Interfaces:**
- Consumes: `title`, `description`, `site.*`.
- Produces: `<head>` with title/meta/canonical/OG + JSON-LD `GeneralContractor`; every page using `layouts/base.njk` inherits it.

- [ ] **Step 1: Create the JSON-LD partial `src/_includes/partials/schema-localbusiness.njk`**

```njk
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "name": "{{ site.name }}",
  "url": "{{ site.url }}",
  "telephone": "{{ site.phone }}",
  "email": "{{ site.email }}",
  "priceRange": "$$",
  "areaServed": [
    {% for c in site.counties %}{ "@type": "AdministrativeArea", "name": "{{ c }} County, MI" }{% if not loop.last %},{% endif %}{% endfor %}
  ],
  "openingHours": "Mo-Sa 08:30-19:00",
  "sameAs": [ "{{ site.social.google }}" ],
  "additionalType": "https://schema.org/HomeAndConstructionBusiness"
}
</script>
```
Note: no `address` node - this is a service-area business.

- [ ] **Step 2: Rewrite `<head>` of `src/_includes/layouts/base.njk`**

Replace the `<head>` block with:
```njk
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }} | {{ site.name }}</title>
  <meta name="description" content="{{ description }}">
  <link rel="canonical" href="{{ site.url }}{{ page.url }}">
  <meta property="og:title" content="{{ title }} | {{ site.name }}">
  <meta property="og:description" content="{{ description }}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{{ site.url }}{{ page.url }}">
  <link rel="stylesheet" href="/css/style.css">
  {% include "partials/schema-localbusiness.njk" %}
  {% block head %}{% endblock %}
</head>
```
Keep the existing `<body>`/nav/footer/script structure. Remove the two external Google Fonts `<link>` tags (Inter is now self-hosted via style.css).

- [ ] **Step 3: Build and assert**

Run: `npx @11ty/eleventy`
```bash
grep -q 'GeneralContractor' _site/index.html && echo OK-schema
grep -q 'ChIJyZVuhV' _site/index.html || echo "note: placeId is in schema only if added; areaServed present:"; grep -q 'Oakland County, MI' _site/index.html && echo OK-area
grep -q 'canonical' _site/index.html && echo OK-canonical
grep -c 'streetAddress' _site/index.html
```
Expected: `OK-schema`, `OK-area`, `OK-canonical`, and streetAddress count `0`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: SEO base layout with meta, canonical, OG, and LocalBusiness JSON-LD"
```

---

### Task 5: Honest nav and service-area footer

**Files:**
- Modify: `src/_includes/partials/nav.njk`
- Modify: `src/_includes/partials/footer.njk`

**Interfaces:**
- Consumes: `site.name`, `site.phone`, `site.phoneTel`, `site.counties`, `site.hours`.

- [ ] **Step 1: Port nav and footer markup**

From the approved preview file, port the `<nav class="site">` and `<footer class="site">` blocks into `nav.njk` and `footer.njk`, replacing hard-coded values with `{{ site.* }}` (phone -> `{{ site.phone }}`, tel links -> `tel:{{ site.phoneTel }}`, counties line -> `{% for c in site.counties %}{{ c }}{% if not loop.last %}, {% endif %}{% endfor %} counties`). The footer contact column shows phone, "Serving Oakland, Genesee, Lapeer & Macomb counties", and hours - NO street address.

- [ ] **Step 2: Build and run guardrail asserts**

Run: `npx @11ty/eleventy`
```bash
grep -qi 'Ridgewood' _site/index.html && echo "FAIL-address" || echo OK-no-address
grep -qiE '\bIan\b' _site/index.html && echo "FAIL-ian" || echo OK-no-ian
grep -qi 'family-owned since 1970' _site/index.html && echo "FAIL-family" || echo OK-no-family
grep -q '625-2334' _site/index.html && echo OK-phone
```
Expected: `OK-no-address`, `OK-no-ian`, `OK-no-family`, `OK-phone`.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: honest nav and service-area footer (no street address)"
```

---

### Task 6: Homepage with approved copy and real reviews

**Files:**
- Create: `src/_data/reviews.json`
- Modify: `src/index.njk`

**Interfaces:**
- Consumes: `site.*`, `reviews` (featured array).
- Produces: the rendered homepage.

- [ ] **Step 1: Create `src/_data/reviews.json` with the featured (Ian-free) reviews**

```json
{
  "featured": [
    { "name": "Bogdan Nemtanu", "project": "Roof replacement", "stars": 5, "text": "Zosim walked me through every step and gave fair, transparent pricing. The crew was professional and left the work area spotless. The final result looks fantastic." },
    { "name": "Reimund Bongartz", "project": "24x30 garage", "stars": 5, "text": "Zosim was on top of the project from start to finish. The structure was up in one day and the roof shingled the next morning. There were no surprises on the financials." },
    { "name": "Tomek Bohaczek", "project": "Barn demo & rebuild", "stars": 5, "text": "Zosim and his crew exceeded our expectations. They demolished the old barn and built our new one, worked through the winter weather, and got it done. Highly recommend." }
  ]
}
```

- [ ] **Step 2: Build `src/index.njk` from the approved preview**

Port the `<body>` sections of the approved preview (`cleean-cno-home-v2.html`) into `src/index.njk` with `layout: layouts/base.njk` front matter (`title: "Michigan pole barns, garages, and steel buildings"`, and a `description` under 160 chars using the honest tagline). Replace hard-coded phone/counties with `{{ site.* }}`. Replace the three hard-coded review cards with a loop over `reviews.featured`:
```njk
{% for r in reviews.featured %}
<div class="t"><div class="stars">★★★★★</div><blockquote>"{{ r.text }}"</blockquote><div class="who">{{ r.name }}<span>{{ r.project }} · Google review</span></div></div>
{% endfor %}
```
Keep the owner quote block, but leave the `ph-note` line in an HTML comment (it is a to-confirm marker, not for visitors).

- [ ] **Step 3: Build and run positive + guardrail asserts**

Run: `npx @11ty/eleventy`
```bash
for s in "We answer the phone" "say-so" "We build more than barns" "Where we build" "What our customers say" "Bogdan Nemtanu"; do grep -q "$s" _site/index.html && echo "OK: $s" || echo "MISSING: $s"; done
grep -qiE '\bIan\b' _site/index.html && echo "FAIL-ian" || echo OK-no-ian
grep -q '—' _site/index.html && echo "FAIL-emdash" || echo OK-no-emdash
```
Expected: all `OK`, `OK-no-ian`, `OK-no-emdash`.

- [ ] **Step 4: Visual check**

Run `npm run dev`, open `http://localhost:8080`, confirm the page matches the approved preview (header pinned to top, hero, trust strip, value props, about, services, service areas, owner, process, reviews, CTA, footer). Stop the server.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: homepage with approved copy and real reviews"
```

---

### Task 7: sitemap.xml, robots.txt, llms.txt, 404

**Files:**
- Create: `src/sitemap.njk`, `src/robots.njk`, `src/llms.txt.njk`, `src/404.njk`

**Interfaces:**
- Consumes: `collections.all`, `site.*`.

- [ ] **Step 1: Create `src/sitemap.njk`**

```njk
---
permalink: /sitemap.xml
eleventyExcludeFromCollections: true
---
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{% for page in collections.all %}
  <url><loc>{{ site.url }}{{ page.url }}</loc></url>
{% endfor %}
</urlset>
```

- [ ] **Step 2: Create `src/robots.njk`**

```njk
---
permalink: /robots.txt
eleventyExcludeFromCollections: true
---
User-agent: *
Allow: /
Sitemap: {{ site.url }}/sitemap.xml
```

- [ ] **Step 3: Create `src/llms.txt.njk`**

```njk
---
permalink: /llms.txt
eleventyExcludeFromCollections: true
---
# CNO Pole Barns
{{ site.name }} builds pole barns, custom garages, horse barns, barndominiums, and engineered steel buildings across southeast Michigan. Established 1970, locally owned and operated, A+ BBB rated, and a certified Federal Steel Systems builder.

Service area: {{ site.counties | join(", ") }} counties, including {{ site.serviceAreas | join(", ") }}.
Contact: {{ site.phone }}, {{ site.email }}. Hours: {{ site.hours }} ({{ site.hoursNote }}).
Free estimates. Website: {{ site.url }}
```

- [ ] **Step 4: Create `src/404.njk`**

```njk
---
layout: layouts/base.njk
title: Page not found
description: That page could not be found. Call us at (248) 625-2334 or head back home.
permalink: /404.html
---
<section class="blk"><div class="wrap" style="text-align:center">
  <h1>We could not find that page</h1>
  <p>Try the <a href="/">homepage</a>, or call us at <a href="tel:{{ site.phoneTel }}">{{ site.phone }}</a>.</p>
</div></section>
```

- [ ] **Step 5: Build and assert**

Run: `npx @11ty/eleventy`
```bash
for f in sitemap.xml robots.txt llms.txt 404.html; do test -f "_site/$f" && echo "OK $f" || echo "MISSING $f"; done
grep -q 'Federal Steel' _site/llms.txt && echo OK-llms
```
Expected: all `OK`, `OK-llms`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: sitemap, robots, llms.txt, and 404"
```

---

### Task 8: GitHub Pages deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `src/CNAME` (custom domain; passthrough)
- Modify: `eleventy.config.js` (passthrough `src/CNAME`)

**Interfaces:**
- Produces: an automated build + deploy to GitHub Pages on push to the default branch.

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx @11ty/eleventy
      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Create `src/CNAME`**

```
cnopolebarns.com
```
Note: this only takes effect after DNS is pointed (Phase 3). Harmless before then.

- [ ] **Step 3: Add CNAME passthrough in `eleventy.config.js`**

```js
eleventyConfig.addPassthroughCopy("src/CNAME");
```

- [ ] **Step 4: Verify locally, then commit**

Run: `npx @11ty/eleventy` then `test -f _site/CNAME && echo OK-cname`
Expected: `OK-cname`. Then:
```bash
git add -A && git commit -m "ci: GitHub Pages deploy workflow and CNAME"
```

Note: the actual deploy happens after the repo is created under the business GitHub account and Pages is enabled (Settings -> Pages -> Source: GitHub Actions). That account setup is a manual, out-of-band step tracked in Phase 3.

---

## Self-Review

- **Spec coverage (Phase 1 scope):** design system (Task 3), self-hosted fonts (Task 2), honest site data/NAP/service-area (Tasks 1,5), SEO base + JSON-LD (Task 4), homepage with approved copy + real reviews (Task 6), sitemap/robots/llms.txt/404 (Task 7), deploy (Task 8). Service pages, town pages, portfolio, blog, contact form, redirects, image pipeline, and DNS cutover are intentionally deferred to Phase 2/3.
- **Guardrails:** honesty rules enforced by grep asserts in Tasks 1, 5, 6 (no Ian, no "family-owned since 1970", no street address, no em dash).
- **Type/name consistency:** the CSS class contract in Task 3 matches the classes used by nav/footer (Task 5) and homepage (Task 6); `site.*` and `reviews.featured` shapes are defined in Tasks 1 and 6 and consumed consistently.

## Phases 2 and 3 (to be written as their own plans when we get there)

- **Phase 2 - Services & Service Areas:** service layout + index + the confirmed service pages (content adapted from Federal Steel + old WordPress copy), town layout + index + town landing pages, with Service/FAQ/Breadcrumb JSON-LD and the internal-link mesh.
- **Phase 3 - Portfolio, Blog, Contact & Launch:** portfolio gallery (optimized real photos via eleventy-img), blog + posts (guides that also answer the common timeline/pricing questions), contact page + Web3Forms estimate form + thank-you, 301 redirect map from old WordPress URLs, final Lighthouse/perf pass, business GitHub account + repo, and DNS cutover preserving the Google Workspace MX.
