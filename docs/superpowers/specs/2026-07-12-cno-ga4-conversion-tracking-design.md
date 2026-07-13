# CNO Pole Barns - GA4 + Conversion Tracking

Design doc. Date: 2026-07-12. Status: approved for planning.

## Goal

Install Google Analytics 4 on cnopolebarns.com and track the actions that
represent leads (phone calls, form submits, email clicks) plus enough context
to know which pages, buttons, and build types produce them. Everything stays in
the repo (no Google Tag Manager, no third-party call-tracking service).

## Scope decisions (settled during brainstorming)

- **Tool:** GA4 directly via `gtag.js`, events defined in site code. No GTM.
- **Phone tracking:** click-to-call events only (free, no number swap, no
  CallRail). Measures call intent, not connected calls.
- **Consent banner:** none. US service-area business, no GDPR requirement, and a
  banner would cost conversions. GA4 uses cookieless pings where it can.
- **Add-ons approved (all four):** click attribution, lead detail
  (project type + town), estimate-CTA funnel, page-type slicing.

## Part 1 - What the owner does in Google (one-time)

I cannot create the account. Walkthrough for the owner:

1. Go to analytics.google.com, create a GA4 property named "CNO Pole Barns"
   (reporting time zone: Eastern; currency: USD).
2. Add a **Web data stream** for `https://cnopolebarns.com`.
3. Copy the **Measurement ID** (`G-XXXXXXXXXX`) and hand it to me (or paste it
   into `src/_data/site.json`).
4. In the data stream, keep **Enhanced Measurement ON** (auto-tracks scroll,
   outbound clicks, site search, file downloads, engaged sessions).
5. After the events first fire, mark **Key Events** (Admin -> Events, or
   Admin -> Key events): `phone_call_click`, `generate_lead`, `email_click`.
6. Register **custom dimensions** (Admin -> Custom definitions -> Create,
   event-scoped) so the extra detail shows in reports:
   - `link_location` (parameter `link_location`)
   - `page_type` (parameter `page_type`)
   - `project_type` (parameter `project_type`)
   - `town` (parameter `town`)
7. Optional later: link the property to Search Console and Google Business
   Profile; add an internal-traffic filter for the owner's home/office IP.

## Part 2 - Architecture

Three files change. All tracking logic lives in one new partial.

### 2a. `src/_data/site.json`
Add one field:
```json
"measurementId": ""
```
Blank until the real `G-XXXXXXXXXX` is supplied. When blank, no analytics code
renders at all, so local `npm run dev` and any build without an ID stay clean.

### 2b. `src/_includes/partials/analytics.njk` (new)
Renders only when `site.measurementId` is set. Included once, high in the
`<head>` of `base.njk`. Contains:

- The standard `gtag.js` loader and `dataLayer` / `gtag()` bootstrap.
- A **production guard**: analytics only initializes when
  `location.hostname === 'cnopolebarns.com'`. The GitHub Pages staging URL and
  `localhost` never send data, so no GA filter juggling is needed.
- A **DebugView switch**: `gtag('config', ID, { debug_mode: true })` when the URL
  contains `?ga_debug`, so we can verify events live without polluting reports.
- All event bindings (below), using delegated listeners on `document` so no
  other template needs editing.

### 2c. `src/_includes/layouts/base.njk`
Add `{% include "partials/analytics.njk" %}` early in `<head>` (right after the
initial `js`-class script). Because every page extends `base.njk`, this covers
the entire site, including `/thanks/`, in one place.

`src/thanks.njk` is **not** edited - the partial detects `/thanks/` at runtime.

## Part 3 - Events

`page_type` is derived client-side from `location.pathname`:
`/` -> home, `/services/` -> service, `/steel-buildings/` -> steel,
`/areas/` -> area, `/blog/` -> blog, everything else -> other.

`link_location` is derived from the clicked link's DOM ancestors with
`closest()`: `nav` -> nav, `footer` -> footer, `.ohero`/`header` -> hero,
`.cta` -> cta_band, otherwise -> body. No `data-*` attributes are added to
templates.

| Event | Trigger | Parameters | Key Event? |
|---|---|---|---|
| `phone_call_click` | click on `a[href^="tel:"]` | `link_location`, `page_type` | Yes (primary) |
| `email_click` | click on `a[href^="mailto:"]` | `link_location`, `page_type` | Yes (secondary) |
| `cta_click` | click on `a[href="/contact/"]` (estimate/quote buttons) | `link_location`, `page_type` | No (funnel step) |
| `form_start` | first `focusin` inside `form.form` (fires once) | `page_type` | No (funnel step) |
| `generate_lead` | load of `/thanks/` **when** a submit flag is present | `project_type`, `town`, `page_type=thanks` | Yes (primary) |

### Lead detail bridge (project type + town)
The form redirects to `/thanks/` on success via formsubmit's `_next`, which does
not pass field values back. To carry detail onto the conversion:

1. On `submit` of `form.form`, read the `project_type` and `town` field values
   and write them to `sessionStorage` (`cno_lead`). Do **not** preventDefault -
   the normal POST proceeds.
2. On `/thanks/` load, read `cno_lead` from `sessionStorage`. If present, fire
   `generate_lead` with those params, then clear the key.
3. If the flag is absent (someone visits `/thanks/` directly), do **not** fire.
   This ties every counted lead to a real submit on this site and avoids
   false positives.

### Automatic, no code (via GA4 Enhanced Measurement + defaults)
Traffic source/medium, device category, visitor geography (town/county), scroll
depth, engaged sessions, average engagement time, outbound-link clicks,
landing-page reports. Called out so we do not rebuild them.

## Part 4 - Funnels the data enables

- **Estimate funnel:** `cta_click` -> `form_start` -> `generate_lead` shows where
  people drop between wanting an estimate and sending one.
- **Page value:** conversions sliced by `page_type` answer "do area pages and the
  blog convert, or only pull traffic?"
- **Demand mix:** `generate_lead` by `project_type` shows the share of pole barns
  vs. garages vs. steel vs. roofing among leads.
- **Button/section value:** conversions by `link_location` show which blocks
  (hero, footer, CTA band, nav) earn calls.

## Part 5 - Privacy

No cookie-consent banner. If regulation or preference changes later, a
`gtag('consent', 'default', ...)` block can be added to the partial without
touching anything else.

## Part 6 - Verification (nothing is "done" until observed)

1. **Build gating:** with `measurementId` blank, confirm the built HTML contains
   no gtag code; set a test ID and confirm it renders. Confirm `npm run verify`
   still passes (no broken links, valid JSON-LD).
2. **Live check after deploy:** open `https://cnopolebarns.com/?ga_debug=1` and,
   watching GA4 DebugView / Realtime:
   - tap a phone link -> `phone_call_click` with correct `link_location`.
   - click a "Get a free estimate" button -> `cta_click`.
   - focus the form -> `form_start`.
   - submit a test request -> land on `/thanks/` -> `generate_lead` with the
     chosen `project_type` and `town`.
3. Confirm the custom dimensions populate in a Realtime/Exploration view.

## Files changed

- `src/_data/site.json` (add `measurementId`)
- `src/_includes/partials/analytics.njk` (new)
- `src/_includes/layouts/base.njk` (include the partial in `<head>`)

## Out of scope (future, if paid ads start)

- Google Tag Manager migration.
- Paid call tracking with dynamic number insertion (CallRail etc.).
- Google Ads conversion import (GA4 Key Events can be imported into Ads later
  without code changes).
