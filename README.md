# North Peak Stays: homepage design concept

A static, single-page redesign of [staynorthpeak.com](https://staynorthpeak.com), built as a demo for the property owner.
Live preview: https://north-peak-demo.vercel.app (labeled as a concept and hidden from search engines).

## How it deploys

The Vercel project `north-peak-demo` (team **bradleys-boat-care**) is connected to this repo:
pushing to `main` deploys to production automatically. There is no build step; Vercel serves the files as-is.

Commits must be authored as **Graeme Bradley &lt;graemebradley24@gmail.com&gt;** (set in this repo's local git config),
or the Vercel team will block the deployment.

## What's here

| Path | What it is |
|---|---|
| `index.html` | The whole page: HTML, CSS and JavaScript |
| `img/logo-*.png` | Transparent logo files cut from the original logo |
| `img/homes/` | Renderings split out of each upcoming home's collage |
| `img/guide/` | Local guide photos (Wikimedia Commons, credited on the page) and ski area logos |
| `vercel.json`, `robots.txt` | Tell search engines not to index the demo |

Mountain View A-Frame photos still load from the current Lodgify site and should be self-hosted before going live.
