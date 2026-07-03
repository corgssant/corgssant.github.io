# CNO Pole Barns - Website Launch Strategy & Phased Plan

Date: 2026-07-03
Status: DRAFT - pending Vlad's review and the domain-control answer

## 1. Goal

Replace the old BizIQ WordPress site at cnopolebarns.com with the modern static
(Eleventy) rebuild. Get something real shipped ASAP, keep full continuity (no lost
content, no lost SEO, no lost email), and finish polish/extra pages after launch -
without doing any throwaway WordPress work.

## 2. Core strategy: decouple the launch from the BizIQ transfer

The old site and the domain transfer are separable. Only two things actually matter:

1. Who controls DNS for cnopolebarns.com - the ONLY true blocker to going live.
2. Whether the new build is good enough to be public - already ~75% there.

Decision: do NOT rebuild or re-host WordPress. Finish + stage the new static site now
(zero dependency on BizIQ), then do a ~5-minute DNS cutover the moment we get domain
control. Go static: near-zero attack surface, free hosting, trivial cutover.

Rejected alternative (Vlad's original option A): "transfer WP, keep it live, rebuild at
leisure." This means standing up and maintaining a WordPress install just to tear it
down. Extra cost, extra security exposure, throwaway work. The rebuild is close enough
that a bridge isn't needed.

## 3. Assets already in hand (content preservation is DONE)

Located in ~/cno-pole-barns/exports/ :
- sitebackup/ - full WordPress backup: 63MB dbbackup.sql + 109MB media/photos + theme.
- live-mirror/ - static HTML of every live page (home, about, contact, portfolio,
  all services, all local pages, a reviews-2 page full of Google reviews).
- notes/dns-snapshot.txt - full DNS capture from 2026-07-02.

Nothing will be lost at cutover. This is what removes the need to keep the old site up.

Housekeeping: assets live in ~/cno-pole-barns/ ; the build lives in
~/cno-pole-barns-website/. Pull exports/notes in as reference so it's one project.

## 4. The one blocker: domain control (critical path)

From notes/dns-snapshot.txt:
- Registrar: Wild West Domains (GoDaddy reseller). Registrant in Arizona = BizIQ
  controls the registration.
- DNS: Cloudflare (ivan/nia nameservers), proxied.
- Email: Google Workspace (MX -> smtp.google.com), independent of the website host.
- Domain expiry 2027-04-26 (no urgency there).

"Transfer from BizIQ" = get control of the domain: either access to the Cloudflare
account that runs DNS, or move the domain to our own registrar + our own Cloudflare.
Recommended host: Cloudflare Pages (DNS already on Cloudflare => cleanest cutover).

## 5. Cutover safety checklist

1. Email: never touch the MX record or the google-site-verification TXT, or email dies.
2. SEO: old URLs differ from new URLs -> 301 redirects required (map in section 7).
3. DNS: keep everything else; only repoint the site's A/CNAME to the new host.

## 6. Content gaps surfaced by the redirect mapping

Pages the old site had (and likely ranks for) that the new build does NOT yet have.
These are the punch list for a lossless launch:
- Reviews / testimonials page (old /reviews/ + /reviews-2/) - high value social proof.
- Crane rental service page (old /crane-rental/).
- Oakland Township MI local page (old /pole-barn-builders-in-oakland-township-mi/).
- West Bloomfield Township MI local page (old /pool-barn-builders-in-...-mi/).
- Terms & conditions page.
- Thank-you page (needed as the contact-form success page anyway).
- The 2 real old blog posts (Dec 2024 "top reasons to build a pole barn", Aug 2025
  "why pole barns make the best horse barns") - port the actual copy.

## 7. 301 redirect map (old URL -> new URL)

Core pages:
- /                                    -> /
- /about-us/                           -> /about/
- /contact-us/                         -> /contact/
- /portfolio/                          -> /portfolio/
- /blog/                               -> /blog/
- /reviews/  and  /reviews-2/          -> /reviews/   (new page - see gaps)
- /feedback/                           -> /contact/
- /thank-you/                          -> /thank-you/ (new success page)
- /terms-and-conditions/               -> /terms/     (new page)
- /category/pole-barn/                 -> /blog/

Services:
- /pole-buildings/                     -> /services/pole-barns/
- /pole-sheds/                         -> /services/pole-sheds/
- /barndominiums/                      -> /services/barndominiums/
- /custom-garages/                     -> /services/garages/
- /roofing-services/                   -> /services/roofing/
- /demolition-services/                -> /services/demolition/
- /boat-motorhome-storage-buildings/   -> /services/boat-rv-storage/
- /commercial-storage-and-warehouse/          -> /services/commercial-buildings/
- /commercial-storage-and-warehouse-builders/ -> /services/commercial-buildings/
- /shop-and-storage-builders/          -> /services/shop-storage/
- /siding-repair-in-rochester-hills-mi/-> /services/siding-repair/
- /crane-rental/                       -> /services/crane-rental/ (new) or /services/
- /barn-building/                      -> /services/pole-barns/

Local (SEO money pages):
- /pole-barn-builders-in-clarkston-mi/ -> /areas/clarkston/
- /pole-barn-builders-in-fenton-mi/    -> /areas/fenton/
- /pole-barn-builders-in-holly-mi/     -> /areas/holly/
- /pole-barn-builders-in-howell-mi/    -> /areas/howell/
- /pole-barn-builders-in-south-lyon-mi/-> /areas/south-lyon/
- /shop-and-storage-builders-in-rochester-hills-mi/ -> /areas/rochester-hills/
- /pole-barn-builders-in-oakland-township-mi/ -> /areas/oakland-township/ (new) or /areas/
- /pool-barn-builders-in-west-bloomfield-township-mi/ -> /areas/west-bloomfield/ (new) or /areas/

Blog posts:
- /2024/12/top-reasons-you-should-build-a-pole-barn-on-your-michigan-property/
      -> ported post (or /blog/what-is-a-pole-barn/ interim)
- /2025/08/why-pole-barns-make-the-best-horse-barns-.../
      -> ported post (or /blog/choosing-right-horse-barn/ interim)

AMP variants: every old page also has an /.../a/ AMP version; each redirects to the
same target as its canonical parent (AMP is deprecated).

Open SEO decision: the old local URLs (/pole-barn-builders-in-clarkston-mi/) are
keyword-rich. Option A = 301 to /areas/clarkston/ (clean, small ranking risk). Option B =
adopt the old slugs on the new site to preserve exact ranking. Recommend A unless those
pages are proven strong traffic drivers.

## 8. Phased plan (break up over a few days)

Day 1 (2026-07-03): Foundation + staging
- Resolve domain-control status (the blocker). [needs Vlad]
- Deploy current build to a staging host (Cloudflare Pages) -> live shareable URL.
- Quick audit of the homepage/services against "good enough to be public."
- Pull exports/notes into the project as reference.

Day 2: MVP polish (the shippable bar)
- Homepage hero + above-the-fold.
- Working contact form (Cloudflare Pages / Netlify Forms) + thank-you page.
- Mobile pass. Real photos from the 109MB media library. Phone + CTA on every page.
- Add the reviews/testimonials page (mine the mirror's Google reviews).

Day 3: SEO + preservation
- Generate the _redirects file from section 7.
- Meta titles/descriptions (recover from old Rank Math where useful), sitemap, robots.
- Fill remaining content gaps (crane rental, missing local pages, terms, port 2 posts).
- Analytics + Google Business.

Cutover: when domain control is in hand AND the MVP bar is cleared -> repoint DNS,
preserve MX/TXT, verify redirects and email.

Ongoing after launch: deeper service detail, project gallery, more blog posts,
testimonials, refinements.

## 9. Open decisions (need Vlad)

1. Domain control status - the timeline gate.
2. Host: Cloudflare Pages (recommended) vs Netlify.
3. Local-URL SEO: 301 to /areas/* (recommended) vs adopt old slugs.
4. Launch bar: how polished before we flip DNS vs iterate live.
