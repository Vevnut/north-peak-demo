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
| `homes/*.html` | One page per home (`/homes/<name>`), **built** from `properties.js`: don't edit by hand |
| `site.js` | Rules shared by every page: approvals, booking buttons, badges |
| `scripts/build-homes.mjs` | Builds the home pages (and `sitemap.xml` once the real domain is set) |
| `properties.js` | **The one place each home is described**: details, status, booking link, photos |
| `scripts/check-properties.mjs` | Checks `properties.js` before you push |
| `img/logo-*.png` | Transparent logo files cut from the original logo |
| `img/homes/` | Renderings split out of each upcoming home's collage |
| `img/site/` | Hero, guide and construction photos and the favicon, converted from the old site's PNGs to sized JPEGs |
| `img/guide/` | Local guide photos (Wikimedia Commons, credited on the page) and ski area logos |
| `vercel.json` | Tells search engines not to index the demo; redirects old Lodgify page addresses |
| `robots.txt` | Tells search engines not to crawl the demo |

Mountain View A-Frame photos (and the few other `.jpg` photos in `index.html`) still load from the current Lodgify site and should be self-hosted before going live.

## Adding or updating a home

Everything about a home lives in `properties.js`. The homepage builds the Stay menu, the Our Homes tab and
panel, the footer list and the photo gallery from it, and `scripts/build-homes.mjs` builds the home's own page
(`/homes/<name>`, from its name), so nothing in `index.html` needs to change.

1. Put the photos in `img/homes/` (for example `img/homes/lakeside-1.jpg`, `-2.jpg`, ...). The first one is the cover.
2. Copy an existing entry in `properties.js`, give it a new `id`, and fill in the details and `photos.files`.
   Use `kind: "rendering"` until real photos exist; the gallery then labels them as renderings.
3. Set its `status`:
   - `"upcoming"`: shows "Coming soon" (or `opening.label` once `opening.approved` is `true`). Never shows a booking button.
   - `"text"`: open, booked by text message.
   - `"bookable"`: open, booked online. Needs `booking.url`, copied from the owner's Lodgify account.
   - `"hidden"`: kept in the file but not shown.
4. Run `node scripts/build-homes.mjs`, then `node scripts/check-properties.mjs`, and fix anything it reports.
   Renaming a home changes its page address; add a redirect from the old one in `vercel.json`.
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

## Search engines

The demo is hidden from search on purpose. The page already has its title, description, share-card tags
(Open Graph) and `LodgingBusiness` structured data built only from facts shown on the page. On launch day:

1. Remove `<meta name="robots" content="noindex, nofollow">` from `index.html`, the `X-Robots-Tag` header from
   `vercel.json`, and change `robots.txt` to `Allow: /`, once the real domain is connected (the canonical link below keeps the vercel.app copy out of results).
2. Add `<link rel="canonical">` and `og:url` with the real domain, and point `og:image` and the schema `image` at it.
   Then run `node scripts/build-homes.mjs`: the home pages pick up the same domain and it writes `sitemap.xml`.
   Submit that sitemap in Search Console.
3. Add the domain to Google Search Console and Bing Webmaster Tools, and update the Google Business Profile's
   website link.

`node scripts/check-properties.mjs --launch` lists each of these until it's done.

### Contact form and waitlist

The homepage has a contact form ("Send us a message"), and each upcoming home has an "Email me when it opens"
waitlist, on the homepage and on its own page. Both send to `NP_SITE.forms.endpoint` in `properties.js`: the address
of a form service set up with the owner's email (for example Formspree; free plans cover a small site). Until that is
set, previews show the forms but don't send anything, and the launched site hides them. Set `approved: true` once the
owner has tested it. A hidden field catches simple spam bots.
