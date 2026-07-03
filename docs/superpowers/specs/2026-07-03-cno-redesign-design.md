# CNO Pole Barns - Website Redesign Design Spec

Date: 2026-07-03 (revised)
Status: Approved direction, copy locked "close enough", moving to implementation plan
Owner: Vlad (on behalf of CNO Pole Barns / Zosim Serban)

## 1. Summary

Rebuild cnopolebarns.com as a fast, modern static site (Eleventy) that recreates the
"Cleean" Framer template's look and section structure, adapted to CNO Pole Barns with real
photos, real reviews, and honest copy. We are migrating off a compromised WordPress site
(BizIQ) to GitHub Pages under a business-owned GitHub account, domain served via
Cloudflare/Namecheap DNS.

The approved visual direction is a faithful Cleean recreation (Inter typeface, the green
palette below, clean rounded cards, generous spacing), signed off via the homepage preview
published as an Artifact.

## 2. Goals and success metrics

Priority order (confirmed):
1. Get found. Rank in Google and be citable by AI search (ChatGPT, Perplexity, Google AI
   Overviews) for pole barn, steel building, garage, and related searches across southeast
   Michigan, town by town. Top priority.
2. Convert. Turn visitors into a phone call to (248) 625-2334 or a submitted estimate
   request emailed to zosim@cnopolebarns.com.
3. Credibility. Look established and trustworthy.

## 3. Positioning and honesty rules (important)

CNO Pole Barns was established in 1970 (the name comes from founders Charlie aNd Nancy
Overfield). Zosim Serban BOUGHT the business about three years ago (~2023). It is new
ownership and mostly a new crew.

Hard rules for all copy:
- Do NOT say "family-owned since 1970," "same family," "same crew for 55 years," or imply
  personnel/ownership continuity.
- Honest framing: an established Michigan business since 1970, under new local owner-operator
  Zosim for ~3 years, carrying forward the standards and community focus. "Since 1970"
  describes the business's track record only.
- Ownership line reads "locally owned and operated" (no name appended).
- Ian is no longer on the team: do NOT mention Ian anywhere, and do not feature the reviews
  that name Ian. Zosim is the primary and only contact.
- No fabricated testimonials or invented stats (removes the old fake testimonials and the
  "1,000+ projects / 100% satisfaction" numbers).
- Change-order honesty: pricing copy promises no hidden fees and no charge without the
  customer's approval, not a never-changing price.

## 4. Voice and copy

Write like a plain-spoken Michigan builder talking to a neighbor; run copy through the
humanizer checklist (no cliches, no forced rule-of-three, no em dashes, no hype words, no
meta/SEO-speak such as mentioning Google or "pages").

- Talk about the customer's project and property, never the website or search.
- Be specific: real builds and sizes (24x30 garage, 40x80x14 building, 60x80 barn + lean-to),
  real towns, real materials and timeframes.
- Use "neighbors in Oakland County / southeast Michigan," not "folks."
- Section headers default to two visible tiers (headline + short subhead); eyebrow labels
  only where they help scanning (they carry ~no SEO weight).
- Approved value props (from real review themes): "We answer the phone", "Fair, upfront
  pricing" ("We quote it straight. No hidden fees, and nothing hits your bill without your
  say-so."), "Crews that clean up".

## 5. Non-goals

No WordPress, no server, no database, no e-commerce/booking, no visitor accounts. The
registrar transfer and DNS cutover are tracked separately and do not block the build.

## 6. Tech stack and hosting

- Eleventy (11ty) v3, Nunjucks + Markdown collections (already scaffolded, src -> _site).
- Hosting: GitHub Pages, repo under a new business-owned GitHub account (not Vlad's Roya
  account). CNAME file for the custom domain.
- Domain/DNS: cnopolebarns.com. Preserve Google Workspace MX (smtp.google.com) on any DNS
  move. DNS via Cloudflare now (BizIQ-controlled) or Namecheap after transfer.
- Forms: static form backend. Recommended Web3Forms (free, emails to zosim@, spam
  protection). Alternative Formspree. Decision open.
- CMS (phase 3, optional): Decap CMS already scaffolded at src/admin.
- Analytics: recommended Cloudflare Web Analytics (cookieless). Decision open.

## 7. Design system (Cleean-derived)

Colors: --dark #242c24, --body #4e574e, --soft #e3e9e3, --offwhite #f6f9f6, --white #fff,
--green #47bb66 (accent fills only), --green-deep #2f7d47 (green text/links, meets AA).
Typography: Inter, self-hosted (subset woff2), weights 400-800; headings tight tracking,
text-wrap: balance. Components: pill buttons (dark primary), rounded cards (~18px, 1px
--soft border, hover lift), ~100px section padding alternating white/offwhite, sticky
blurred nav pinned to top (top:0), checkmark lists, numbered process steps.

## 8. Information architecture

- Home (/)
- About (/about/) - honest new-ownership story, service area.
- Services index (/services/) + detail pages (/services/<slug>/). Revised, search-friendly,
  Federal Steel-informed list (see section 9).
- Service Areas index (/areas/) + town pages (/areas/<town>/) - the SEO engine.
- Portfolio (/portfolio/) - real jobsite photos.
- Blog (/blog/) + posts - informational guides (also answer common review criticisms).
- Contact (/contact/) - estimate form, phone, hours, service area (no street address).
- Utility: 404, /thank-you/, /privacy/, /terms/.

## 9. Services (revised, Federal Steel-informed)

CNO is a certified Federal Steel Systems builder, so the site covers both post-frame (pole
barn) and engineered steel buildings, roughly doubling the search surface. Content and specs
adapted from federalsteelsystems.com plus the old WordPress copy.

Proposed primary pages (final list pending owner confirmation):
Pole Barns; Steel & Metal Buildings; Custom Garages & Workshops; Horse Barns & Riding
Arenas; Barndominiums; Agricultural & Farm Buildings; Commercial & Industrial Buildings;
Storage Buildings & Mini-Storage (incl. boat/RV); Metal Roofing & Re-Roofs; Pole Sheds.
Specialty (if offered): Aircraft Hangars; Clear-Span Buildings.
Non-building services: Demolition; Crane Rental (confirm); Design, Engineering & Permit-Ready
Drawings (lean on Federal Steel's stamped drawings).

Homepage features four: Pole Barns, Garages & Workshops, Horse Barns, Steel Buildings.

## 10. Service areas (from the Google Business Profile)

Counties: Oakland, Genesee, Lapeer, Macomb. Towns for local landing pages: Clarkston,
Waterford, White Lake, Holly, Fenton, Flint, Lapeer, Metamora, Auburn Hills, Pontiac, Troy,
Royal Oak, Farmington Hills, Franklin (and more from the profile). Each town page targets
"pole barn / steel building / garage builder in <town> MI".

## 11. SEO and AI-search strategy (primary goal)

- Semantic HTML5, one H1 per page, logical headings, descriptive alt text.
- Per-page title/meta description from front matter; canonical, open graph, Twitter tags.
- JSON-LD: GeneralContractor/LocalBusiness on all pages using the real profile data
  (name, phone (248) 625-2334, Google Place ID ChIJyZVuhV-XJIgR9-gYNSxuCZs, hours Mon-Sat
  8:30a-7p, areaServed the towns/counties, sameAs socials, priceRange). Note: SERVICE-AREA
  business - use areaServed, NOT a street address. Service schema per service page; FAQPage
  schema on FAQ blocks; AggregateRating/Review from the real Google reviews; BreadcrumbList;
  BlogPosting on posts.
- XML sitemap + robots.txt; llms.txt summarizing who/what/where (services, towns, contact).
- Internal link mesh (home -> services/areas -> detail -> related).
- Performance for Core Web Vitals: static HTML, self-hosted subset fonts, responsive
  WebP/AVIF with width variants + lazy loading, minimal JS.
- FAQ content preempts the two recurring review criticisms: timeline/weather delays and
  change-order costs.

## 12. Conversion and forms

- "Get a Free Estimate" (form) and click-to-call tel:+12486252334 in nav, hero, sections,
  and a sticky mobile call bar.
- Estimate form: name, phone, email, project type, town/ZIP, message -> emails zosim@ via
  the chosen backend -> /thank-you/. Honeypot + captcha.
- Trust near CTAs: A+ BBB, Licensed & Insured, Certified Federal Steel Builder, Free
  Estimates.

## 13. Reviews and trust

- Source: Google Takeout export in docs/reference/ (cno-reviews.md). 34 total, ~4.2 average,
  26 five-star. Feature current-era (2023-2026) 5-star reviews that do NOT name Ian
  (Bogdan Nemtanu, Reimund Bongartz, Tomek Bohaczek, Heather Bowers, Karl Michael Alas,
  robert aldridge, etc.). Verify the live rating/count before quoting an exact number.
- Do not publish negative reviews. A+ BBB rating is a confirmed, featured trust signal.
- Later option: wire live Google reviews via Places API (needs an API key).

## 14. Assets and media

- 394 unique originals from the WordPress backup (~/cno-pole-barns/exports/sitebackup/
  wp-content/uploads) PLUS 42 project photos in the Google Takeout export
  (docs/reference/google-business-profile-export/). Optimize to responsive WebP/AVIF.
- Existing CNO logo set in src/images/logos. Federal Steel certified-builder badge.

## 15. Contact and NAP

- Name: CNO Pole Barns. Phone: (248) 625-2334. Email: zosim@cnopolebarns.com (info@ license
  deleted; add info@ as an alias). Hours: Mon-Sat 8:30 AM - 7:00 PM, closed Sunday.
- No public street address (service-area business); present towns/counties served.

## 16. URL migration and redirects

Map old WordPress URLs to new ones with 301s where paths change (old URLs captured from the
sitemap: /pole-barn-builders-in-fenton-mi/, /custom-garages/, /barndominiums/, /about-us/,
/portfolio/, blog posts, etc.). GitHub Pages has no server redirects; implement via canonical
stub pages with meta-refresh, or at the Cloudflare layer if we control it. Keep a redirect map.

## 17. Accessibility and performance

WCAG AA contrast (hence --green-deep for green text); visible focus states; respect
prefers-reduced-motion; alt text and form labels. Lighthouse targets 95+ across the board.

## 18. Build phases

- Phase 1 (build): recreate the full site in Cleean style with real content, photos, reviews,
  SEO foundation, and a working estimate form; deploy to a temporary GitHub Pages URL for review.
- Phase 2 (launch): business GitHub account + repo, custom domain via CNAME, DNS cutover
  (after Cloudflare access or Namecheap transfer), 301 redirects live, MX preserved.
- Phase 3 (enhance): live Google reviews, Decap CMS for family editing, analytics.

## 19. Open decisions

1. Final services list (confirm Crane Rental, Aircraft Hangars, Clear-Span, and whether all
   steel-side types are offered). Owner to confirm.
2. Form backend: Web3Forms (recommended) vs Formspree.
3. Analytics: Cloudflare Web Analytics (recommended) vs GA4 vs none.
4. Owner quote: exact wording from Zosim.
5. Verify the live Google review count/rating before publishing a number.
6. Reference: docs/reference/ holds cno-reviews.md, cno-business-profile.md, and the raw
   Google Takeout export.
