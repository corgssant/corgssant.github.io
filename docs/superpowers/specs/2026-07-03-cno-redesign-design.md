# CNO Pole Barns - Website Redesign Design Spec

Date: 2026-07-03
Status: Draft for review
Owner: Vlad (on behalf of CNO Pole Barns / Zosim Serban)

## 1. Summary

Rebuild cnopolebarns.com as a fast, modern static site (Eleventy) that recreates the
"Cleean" template's look and section structure, adapted to CNO Pole Barns with real
photos and content. We are migrating off a compromised WordPress site (BizIQ) and will
host on GitHub Pages under a business-owned GitHub account, with the domain served via
Cloudflare/Namecheap DNS.

The approved visual direction is a faithful recreation of Cleean (Inter typeface, the
green palette below, clean rounded cards, generous section spacing), demonstrated and
signed off via the homepage preview.

## 2. Goals and success metrics

Priority order (confirmed with owner):

1. Get found. Rank in Google and be citable by AI search (ChatGPT, Perplexity, Google
   AI Overviews) for pole barn and related searches across southeast Michigan, town by
   town. This is the top priority.
2. Convert. Turn visitors into a phone call or a submitted estimate request.
3. Credibility. Look established and trustworthy so a homeowner choosing between builders
   picks CNO.

Success signals: organic impressions/clicks for "pole barn builder in <town> MI" style
queries, calls to (248) 625-2334, and estimate-form submissions to zosim@cnopolebarns.com.

## 3. Non-goals

- No WordPress. No dynamic server. No database.
- No e-commerce or online booking/payments.
- No account/login system for visitors.
- Registrar transfer and DNS cutover are tracked separately; the build does not depend on
  them and can ship to a temporary GitHub Pages URL first.

## 4. Audience and key journeys

Primary audiences: Michigan homeowners, farm/property owners, horse owners, and small
businesses in Oakland County and surrounding SE Michigan who need a pole barn, garage,
horse barn, barndominium, or similar structure.

Key journeys:
- Search "pole barn builder near me / in <town>" -> land on home or a town page -> call
  or request an estimate.
- Search a specific structure ("horse barn builder michigan") -> land on that service
  page -> request an estimate.
- Referral / word of mouth -> visit home -> browse portfolio and reviews -> call.

## 5. Tech stack and hosting

- Generator: Eleventy (11ty) v3, already scaffolded (src -> _site).
- Templating: Nunjucks + Markdown for content collections (services, areas, blog).
- Hosting: GitHub Pages, repo under a new business-owned GitHub account (not Vlad's Roya
  account). CNAME file for the custom domain.
- Domain/DNS: cnopolebarns.com. DNS via Cloudflare now (BizIQ-controlled) or Namecheap
  after registrar transfer. Preserve Google Workspace MX (smtp.google.com) on any DNS move.
- Forms: static-site form backend. Recommended: Web3Forms (free, no server, emails
  submissions to zosim@, spam honeypot + hCaptcha). Alternative: Formspree. Decision open.
- CMS (optional, phase 3): Decap CMS is already scaffolded at src/admin so the family can
  edit content without code. Keep but treat as later.
- Analytics: recommended Cloudflare Web Analytics (free, cookieless, no banner) or GA4 if
  preferred. Decision open.

## 6. Design system (Cleean-derived)

Colors (extracted from the Cleean template):
- --dark: #242c24 (headings, primary buttons, footer)
- --body: #4e574e (body text)
- --soft: #e3e9e3 (borders, hairlines)
- --offwhite: #f6f9f6 (alternating section background)
- --white: #ffffff
- --green: #47bb66 (bright accent; backgrounds, checks, highlights)
- --green-deep: #2f7d47 (accessible green for links/labels/text on light backgrounds)

Note: the bright #47bb66 fails contrast as text on white, so --green-deep is used for any
green text or links to meet WCAG AA. Bright green is reserved for fills/accents.

Typography:
- Inter, self-hosted (woff2, subsetted) for performance and privacy. Weights 400-800.
- Headings: tight letter-spacing (-0.02em), weight 700, text-wrap: balance.
- Body: ~16-18px, line-height ~1.6-1.7, measure near 65-75 characters.
- Uppercase eyebrow labels with letter-spacing, colored --green-deep.

Components and rules:
- Buttons: pill shape. Primary = --dark fill/white text. Secondary = outline. Accent =
  --green.
- Cards: white, 1px --soft border, radius ~18px, soft shadow on hover, subtle lift.
- Sections: ~100px vertical padding; alternate white and --offwhite backgrounds.
- Sticky, blurred translucent nav with logo + phone + "Get a Free Estimate".
- Checkmark feature lists, stat cards, numbered process steps (only where order is real).
- Layout via CSS grid/flex + gap. Mobile-first responsive with tested breakpoints.

## 7. Information architecture (sitemap)

- Home (/)
- About (/about/) - story since 1970, Zosim, team, values, service area map.
- Services index (/services/) and service detail pages (/services/<slug>/):
  Pole Barns, Custom Garages, Horse Barns, Barndominiums, Pole Sheds, Shop and Storage,
  Commercial Buildings, Boat and RV Storage, Roofing, Siding Repair, Demolition.
  (Confirm final list; old site also had "Barn Building" and "Crane Rental".)
- Service Areas index (/areas/) and town pages (/areas/<town>/):
  Clarkston, Waterford, Holly, Fenton, Howell, South Lyon, Rochester Hills,
  Oakland Township, West Bloomfield. (Confirm final town list; these are the SEO engine.)
- Portfolio (/portfolio/) - real jobsite photos, filterable by type later.
- Blog (/blog/) and posts (/blog/<slug>/) - guides that target informational search.
- Contact (/contact/) - estimate form, phone, address, hours, embedded map.
- Utility: 404, /thank-you/ (post-form), /privacy/, /terms/.

## 8. Page specifications

Homepage sections (approved preview), top to bottom:
1. Sticky nav: logo, links (Services, Our Work, About, Service Areas, Blog), phone,
   "Get a Free Estimate".
2. Hero: eyebrow (Family-Owned in Clarkston Since 1970), H1, subhead, primary CTA +
   click-to-call, star/rating line, hero photo with a "55+ years" stat card.
3. Trust strip: Google rating, Licensed & Insured, Family-Owned Since 1970, Free Estimates.
4. Value props (3): built for Michigan, honest pricing, one crew start to finish.
5. About split: photo + story teaser + checklist + link to About.
6. Services grid (4 featured cards) + "View all services".
7. Founder section: Zosim photo + quote (to confirm wording) + attribution.
8. Process (4 steps): Consult, Design, Build, Walkthrough.
9. Reviews: real Google reviews (placeholder until wired).
10. CTA band: "Ready to build?" + estimate CTA + phone.
11. Footer: brand blurb, services, company links, NAP, licensed/insured, social.

Service detail template: hero (title + subhead + photo), overview copy, what's included
(bulleted), gallery of relevant real photos, FAQs (with FAQ schema), related service
areas, estimate CTA. Each page targets "<service> builder michigan / <town>".

Service-area (town) template: hero naming the town, intro on serving that town, services
offered there, a few nearby project photos, town-relevant FAQs, NAP + estimate CTA.
Targets "pole barn builder in <town> MI". Preserve/redirect old town URLs.

Contact page: estimate form (name, phone, email, project type, town/ZIP, message),
click-to-call, address, hours, embedded Google map, and a clear response promise.

## 9. SEO and AI-search strategy (primary goal)

- Semantic HTML5, exactly one H1 per page, logical heading order, descriptive alt text.
- Per-page <title> and meta description templates driven by front matter.
- Canonical URLs; open graph + Twitter card tags; favicon set.
- Structured data (JSON-LD):
  - GeneralContractor / LocalBusiness on all pages (name, NAP, geo, hours, sameAs socials,
    priceRange, areaServed list of towns).
  - Service schema on each service page.
  - FAQPage schema wherever FAQs appear.
  - AggregateRating / Review from real Google reviews (once wired).
  - BreadcrumbList on inner pages; BlogPosting on posts.
- XML sitemap (all pages) + robots.txt pointing to it.
- Town pages + service pages form a clean internal-link mesh (home -> services/areas ->
  detail -> related), which both users and crawlers follow.
- Performance for Core Web Vitals: static HTML, self-hosted subset fonts, responsive
  images (WebP/AVIF with width variants) + lazy loading, minimal JS, no render-blocking.
- AI/LLM discoverability: factual, well-structured copy (NAP, service areas, services
  stated in text not just images), FAQ blocks with direct question/answer pairs, an
  llms.txt summarizing who/what/where, stable clean URLs.

## 10. Conversion and forms

- Primary CTA everywhere: "Get a Free Estimate" (to form) and click-to-call
  tel:+12486252334 in nav, hero, sections, and a sticky mobile call bar.
- Estimate form fields: name, phone, email, project type (select), town or ZIP, message.
  Submissions email zosim@cnopolebarns.com via the chosen form backend; redirect to
  /thank-you/. Include honeypot + captcha for spam.
- Trust signals near CTAs: Google rating, Licensed & Insured, Since 1970, Free Estimates.

## 11. Content integrity and data to confirm

Hard rule: no fabricated content ships. The current draft's invented testimonials
(Mike Thompson, Sarah Mitchell, Dave Richardson) and made-up stats (1,000+ projects,
100% satisfaction) are removed and replaced with verifiable material.

To confirm with owner:
- Real reviews: Google Business Profile URL / place ID to source reviews from (and whether
  to embed live or hand-curate). The old WordPress site had reviews pages we can also mine.
- Founder quote: exact wording from Zosim.
- NAP: confirm phone (248) 625-2334, address 6575 Ridgewood Road, Clarkston, MI 48346,
  and business hours are current.
- Email: use zosim@cnopolebarns.com (info@ license was deleted; add info@ as an alias so
  legacy mail still lands). Update src/_data/site.json.
- Verifiable trust facts to feature: since 1970 / 55+ years, family-owned, licensed and
  insured, free estimates. Avoid unverifiable counts.
- Final services list and service-area town list.

## 12. Assets and media

- Source: 394 unique original photos harvested from the WordPress backup
  (~/cno-pole-barns/exports/sitebackup/wp-content/uploads), plus the ~12 curated images
  already in src/images.
- Select best-in-class real jobsite photos for: home hero, each service page, portfolio
  grid, town pages, and about. Optimize to responsive WebP/AVIF with width variants.
- Logos: existing CNO logo set in src/images/logos (green, gold, black, light-bg variants).

## 13. URL migration and redirects

- Preserve SEO equity by mapping old WordPress URLs to new ones with 301s where the path
  changes. Old URLs are captured from the sitemap (e.g., /pole-barn-builders-in-fenton-mi/,
  /custom-garages/, /barndominiums/, /about-us/, /portfolio/, blog post URLs).
- GitHub Pages has no server redirects; implement redirects via per-URL HTML meta-refresh
  + canonical stub pages, or handle at the Cloudflare layer (preferred if we control it).
- Keep a redirect map document as part of the build.

## 14. Accessibility and performance

- WCAG AA color contrast (hence --green-deep for green text).
- Visible keyboard focus states; respect prefers-reduced-motion.
- Alt text on all images; labels on all form fields.
- Lighthouse targets: Performance, SEO, Accessibility, Best Practices all 95+.

## 15. Analytics

- Recommended: Cloudflare Web Analytics (cookieless, no consent banner needed) or GA4.
- Track: form submissions (thank-you page), click-to-call events. Decision open.

## 16. Build phases

- Phase 1 (build): recreate the full site in Cleean style with real content and photos,
  SEO foundation, working estimate form; deploy to a temporary GitHub Pages URL for review.
- Phase 2 (launch): create business GitHub account + repo, custom domain via CNAME, DNS
  cutover (after Cloudflare access or Namecheap transfer), 301 redirects live, preserve MX.
- Phase 3 (enhance): wire live Google reviews, enable Decap CMS for family editing, add
  analytics, expand blog/town pages for SEO.

## 17. Open decisions to resolve in review

1. Final services list (include Crane Rental? Barn Building as its own page?).
2. Final service-area town list (which towns, any to add/drop).
3. Form backend: Web3Forms (recommended) vs Formspree vs other.
4. Reviews source: Google Business Profile URL/place ID; live embed vs curated.
5. Analytics: Cloudflare Web Analytics (recommended) vs GA4 vs none.
6. Founder quote wording and any about-page copy the family wants.
7. Confirm NAP and hours.
8. Anything from the preview the owner wants changed (hero layout, color balance, section
   order, wording) - to be captured here before planning.
