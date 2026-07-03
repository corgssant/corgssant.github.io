# Reference material (source data for the website)

This folder holds raw source data we pull from while building the CNO Pole Barns site.
It is NOT part of the published site - it is background reference.

## What's here

- `google-business-profile-export/` - raw, unmodified Google Takeout export of the
  CNO Google Business Profile (downloaded 2026-07-03). Left as-is so we always have
  the original.
- `cno-reviews.md` - **all 34 Google reviews** pulled out of the export, organized by
  era and rating, with a curated "highlight on the website" shortlist at the top.
- `cno-business-profile.md` - the business facts from the profile (phone, hours,
  service area, categories, description, service keywords) ready to drop into the site
  and structured data.

## Where the real data lives inside the export

The Takeout account contains **two** businesses. Only the first is relevant:

- `.../account-.../location-2487453015452586617/` -> **CNO Pole Barns** (use this)
- `.../account-.../location-17754664489438865874/` -> "Runit App", an unrelated
  software company on the same Google account. **Ignore for this website.**

Inside the CNO location folder:

- `reviews.json` - 20 newer reviews (2020-2026, current Zosim/Ian ownership era)
- `reviews-ABHRLXVO-...json` - 14 older reviews (2015-2020, founder Charlie/Nancy era)
- `data.json` - full business profile (name, phone, hours, categories, service area, description)
- `media-*.jpeg` - 19 profile/gallery photos (project photos usable in the site gallery)
- `localPost-*/` - 23 Google Posts with their own photos (past promos/updates + more project photos)
- `additionalData.json`, `BusinessCalls.json`, etc. - low value, ignore for now

## Photos worth using

19 top-level `media-*.jpeg` files plus 23 local-post images = 42 project photos total.
The larger files (1-3.6 MB) are full-resolution build photos and are the best candidates
for the homepage/gallery. They'll need compressing/resizing before going on the site.
See `cno-business-profile.md` for the shortlist.
