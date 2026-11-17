# North Peak Stays: homepage design concept

A static, single-page redesign of [staynorthpeak.com](https://staynorthpeak.com), built as a demo for the property owner.
Live preview: https://north-peak-demo.vercel.app (labeled as a concept and hidden from search engines).

## How it deploys

The Vercel project `north-peak-demo` (team **bradleys-boat-care**) is connected to this repo:
pushing to `main` deploys to production automatically. There is no build step; Vercel serves the files as-is.

Commits must be authored by the Vercel team owner's git identity (already set in this repo's local git config),
or the Vercel team will block the deployment.

## What's here

| Path | What it is |
|---|---|
| `index.html` | The whole page: HTML, CSS and JavaScript |
| `properties.js` | **The one place each home is described**: details, status, booking link, photos |
| `scripts/check-properties.mjs` | Checks `properties.js` before you push |
| `img/logo-*.png` | Transparent logo files cut from the original logo |
| `img/homes/` | Renderings split out of each upcoming home's collage |
| `img/guide/` | Local guide photos (Wikimedia Commons, credited on the page) and ski area logos |
| `vercel.json` | Tells search engines not to index the demo; redirects old Lodgify page addresses |
| `robots.txt` | Tells search engines not to crawl the demo |

Mountain View A-Frame photos still load from the current Lodgify site and should be self-hosted before going live.

## Adding or updating a home

Everything about a home lives in `properties.js`. The page builds the Stay menu, the Our Homes tab and
panel, the footer list and the photo gallery from it, so nothing in `index.html` needs to change.

1. Put the photos in `img/homes/` (for example `img/homes/lakeside-1.jpg`, `-2.jpg`, ...). The first one is the cover.
2. Copy an existing entry in `properties.js`, give it a new `id`, and fill in the details and `photos.files`.
   Use `kind: "rendering"` until real photos exist; the gallery then labels them as renderings.
3. Set its `status`:
   - `"upcoming"`: shows "Coming soon" (or `opening.label` once `opening.approved` is `true`). Never shows a booking button.
   - `"text"`: open, booked by text message.
   - `"bookable"`: open, booked online. Needs `booking.url`, copied from the owner's Lodgify account.
   - `"hidden"`: kept in the file but not shown.
4. Run `node scripts/check-properties.mjs` and fix anything it reports.
5. Push to a branch, open the Vercel preview, and check the home both normally and with `?as=live` added to the address.

### Approvals

Booking links, the texting number and opening dates each carry `approved: true/false`. On the launched site
(`NP_SITE.liveHosts`) only approved ones show: an unapproved booking link falls back to Text to Book (if texting is
approved) or Contact Us, and an unapproved opening date shows as "Coming soon". Previews show everything so the demo
stays complete; adding `?as=live` to a preview address shows exactly what the launched site will show.

`node scripts/check-properties.mjs --launch` fails until every item it lists is approved and `liveHosts` is set.

### Date search

The Check-in / Check-out / Guests bar under the hero sends the chosen dates and guest count to a bookable home's
`booking.url` (as `arrival`, `departure` and `adults`, which Lodgify's checkout fills in). It uses only `"bookable"` homes
whose link may show (approved, or any on previews), caps guests at that home's `sleeps`, and is hidden when there are none.
With two or more such homes it adds a Home picker automatically.
