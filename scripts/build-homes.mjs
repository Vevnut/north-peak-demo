// Builds one page per home (homes/<name>.html, served at /homes/<name>) from properties.js,
// the privacy policy (privacy.html, at /privacy), and sitemap.xml once index.html has its canonical link.
//
//   node scripts/build-homes.mjs          write the pages
//   node scripts/build-homes.mjs --check  only report pages that are out of date (used by check-properties)
//
// The pages reuse the homepage's styles (copied from index.html's <style> block) and follow its
// search-engine switches: while index.html says noindex, so do they; once it has a canonical link,
// they get one on the same domain. Re-run after changing properties.js or the homepage's styles.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function buildPages() {
  const sandbox = { window: {}, location: { hostname: '', search: '' }, URLSearchParams };
  vm.runInNewContext(readFileSync(path.join(root, 'properties.js'), 'utf8'), sandbox);
  vm.runInNewContext(readFileSync(path.join(root, 'site.js'), 'utf8'), sandbox);
  const NP = sandbox.window.NP;
  const index = readFileSync(path.join(root, 'index.html'), 'utf8').replace(/\r\n/g, '\n');
  const tags = index.replace(/<!--[\s\S]*?-->/g, '');   // launch-day notes in comments are not real tags

  const css = (index.match(/<style>([\s\S]*?)<\/style>/) || [])[1];
  if (!css) throw new Error('index.html has no <style> block');
  const themeScript = (index.match(/<script>\s*\/\* set the theme[\s\S]*?<\/script>/) || [''])[0];
  const fonts = (index.match(/<link href="https:\/\/fonts\.googleapis\.com\/css2[^>]*>/) || [''])[0];
  const noindex = /<meta name="robots" content="noindex/.test(tags);
  const canonical = (tags.match(/<link rel="canonical" href="(https:\/\/[^"/]+)\/?"/) || [])[1] || null;
  const shareOrigin = canonical || (tags.match(/<meta property="og:image" content="(https:\/\/[^"/]+)\//) || [])[1];

  const esc = NP.esc;
  const src = (u, w) => /^https?:/.test(u) ? NP.sized(u, w) : '/' + u;
  const abs = (u, w) => /^https?:/.test(u) ? NP.sized(u, w) : shareOrigin + '/' + u;
  const homes = NP.HOMES;
  const pages = {};

  for (const p of homes) {
    const slug = NP.slug(p), url = NP.pageUrl(p), rend = p.photos.kind === 'rendering';
    const open = NP.isOpen(p);
    const title = `${p.name} in Campton, NH | North Peak Stays`;
    const kind = /a-frame/i.test(p.name) ? 'A-frame' : /barn|cabin/i.test(p.name) ? 'cabin' : 'home';
    const desc = `${p.name}: a ${p.bedrooms}-bedroom ${kind} vacation rental in Campton, NH, in the White Mountains${p.sleeps ? `, sleeping ${p.sleeps}` : ''}. ${(p.features || []).filter(f => !/sq ft/.test(f)).slice(0, 3).join(', ')}.${open ? '' : ' Opening soon.'}`;
    const cover = p.photos.files[0];
    const coverAlt = p.photos.coverAlt || p.name + (rend ? ' rendering' : '');
    const others = homes.filter(o => o !== p);
    const facts = [
      p.sleeps && ['Sleeps', p.sleeps],
      ['Bedrooms', p.bedrooms],
      p.beds && ['Beds', p.beds],
      ['Baths', p.baths],
      p.sqft && ['Size', p.sqft.toLocaleString('en-US') + ' sq ft'],
    ].filter(Boolean);

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Accommodation',
          name: p.name,
          description: p.summary,
          ...(shareOrigin ? { image: p.photos.files.slice(0, 6).map(f => abs(f, 1600)) } : {}),
          numberOfBedrooms: p.bedrooms,
          numberOfBathroomsTotal: p.baths,
          ...(p.sleeps ? { occupancy: { '@type': 'QuantitativeValue', maxValue: p.sleeps } } : {}),
          ...(p.sqft ? { floorSize: { '@type': 'QuantitativeValue', value: p.sqft, unitCode: 'FTK' } } : {}),
          amenityFeature: (p.features || []).filter(f => !/sq ft/.test(f)).map(f => ({ '@type': 'LocationFeatureSpecification', name: f, value: true })),
          address: { '@type': 'PostalAddress', addressLocality: 'Campton', addressRegion: 'NH', addressCountry: 'US' },
          containedInPlace: { '@type': 'LodgingBusiness', name: 'North Peak Stays' },
          ...(canonical ? { url: canonical + url } : {}),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'North Peak Stays', ...(canonical ? { item: canonical + '/' } : {}) },
            { '@type': 'ListItem', position: 2, name: p.name, ...(canonical ? { item: canonical + url } : {}) },
          ],
        },
      ],
    };

    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- Built by scripts/build-homes.mjs from properties.js. Edit those, not this file. -->
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">\n' : ''}${canonical ? `<link rel="canonical" href="${canonical}${url}">\n<meta property="og:url" content="${canonical}${url}">\n` : ''}<meta property="og:type" content="website">
<meta property="og:site_name" content="North Peak Stays">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
${shareOrigin ? `<meta property="og:image" content="${esc(abs(cover, 1600))}">\n` : ''}<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
<link rel="icon" href="/img/site/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fonts}
${themeScript}
<style>${css}
/* ---------- home pages ---------- */
.hp .nav::before{display:none}
.hp .nav::after{opacity:1}
.hp-links{display:flex;align-items:center;gap:clamp(16px,2.4vw,32px);list-style:none}
.hp-links a{color:#eef2f4;text-decoration:none;font:600 .72rem var(--sans);letter-spacing:.2em;text-transform:uppercase;white-space:nowrap}
.hp-links a:hover{color:var(--gold)}
.hp-links a.nav-cta{background:var(--gold);color:var(--navy-deep);padding:.75rem 1.5rem;border-radius:999px}
.hp-main{padding:124px 0 90px}
.crumbs{font-size:.78rem;color:var(--muted);margin-bottom:26px}
.crumbs a{color:inherit}
.hp-top{display:grid;grid-template-columns:1.35fr 1fr;gap:clamp(28px,4vw,64px);align-items:start}
.hp-cover{position:relative;border-radius:var(--r);overflow:hidden;aspect-ratio:4/3;background:var(--sand)}
.hp-cover img{width:100%;height:100%;object-fit:cover}
.hp-cover .badge{position:absolute;left:18px;top:18px}
.hp-top h1{font-family:var(--serif);font-weight:500;font-size:clamp(2.4rem,4.4vw,3.6rem);line-height:1.02;color:var(--heading);margin:6px 0 16px}
.hp-top .meta{margin-bottom:20px}
.hp-top p{color:var(--muted);margin-bottom:22px}
.hp-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:1px;background:rgba(127,127,127,.2);border-radius:12px;overflow:hidden;margin:26px 0}
.hp-facts div{background:var(--surface);padding:14px 16px}
.hp-facts dt{font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}
.hp-facts dd{font-family:var(--serif);font-size:1.6rem;color:var(--heading)}
.hp-section{margin-top:80px}
.hp-section h2{font-family:var(--serif);font-weight:500;font-size:clamp(1.9rem,3vw,2.5rem);color:var(--heading);margin-bottom:8px}
.hp-section .note{color:var(--muted);font-size:.9rem;margin-bottom:22px}
.hp-photos{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;list-style:none}
.hp-photos a{display:block;aspect-ratio:4/3;border-radius:10px;overflow:hidden;background:var(--sand)}
.hp-photos img{width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease)}
.hp-photos a:hover img{transform:scale(1.04)}
.hp-others{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:22px;list-style:none}
.hp-others a{display:block;text-decoration:none;color:inherit}
.hp-others .hp-cover{aspect-ratio:3/2;margin-bottom:12px}
.hp-others h3{font-family:var(--serif);font-weight:500;font-size:1.5rem;color:var(--heading)}
.hp-others span{font-size:.85rem;color:var(--muted)}
.hp-foot{border-top:1px solid rgba(127,127,127,.2);padding:36px 0;font-size:.85rem;color:var(--muted)}
.hp-foot .wrap{display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap}
.hp-foot a{color:inherit}
@media (max-width:860px){.hp-top{grid-template-columns:1fr}.hp-links li.opt{display:none}.hp-main{padding-top:110px}}
@media (max-width:520px){.hp .logo-word{display:none}.hp-facts{grid-template-columns:repeat(2,1fr)}.hp-facts dd{font-size:1.35rem}}
@media (prefers-reduced-motion:reduce){.hp-photos a:hover img{transform:none}}
</style>
</head>
<body class="hp">
<div class="demo-tag" role="note">Design concept · not the official site</div>
<header class="nav solid">
  <div class="wrap">
    <a href="/" class="logo" aria-label="North Peak Stays home"><img class="logo-emblem" src="/img/logo-emblem.png" alt="" width="295" height="256"><img class="logo-word" src="/img/logo-wordmark.png" alt="North Peak, New Hampshire" width="616" height="142"></a>
    <ul class="hp-links">
      <li class="opt"><a href="/#homes">All homes</a></li>
      <li class="opt"><a href="/#experiences">Experiences</a></li>
      <li class="opt"><a href="/#plan">Plan your stay</a></li>
      <li><a class="nav-cta" href="/#homes" data-book>Book Now</a></li>
    </ul>
  </div>
</header>

<main class="hp-main">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">North Peak Stays</a> › <a href="/#homes">Our homes</a> › <span aria-current="page">${esc(p.name)}</span></nav>
    <div class="hp-top">
      <div class="hp-cover"><img src="${esc(src(cover, 1600))}" alt="${esc(coverAlt)}" fetchpriority="high"><span id="hpBadge">${open ? '<span class="badge live">Open now</span>' : '<span class="badge">Coming soon</span>'}</span></div>
      <div>
        <div class="eyebrow">Campton, New Hampshire</div>
        <h1>${esc(p.name).replace(/-/g, "&#8209;")}</h1>
        <div class="meta">${esc(NP.meta(p))}</div>
        <p>${esc(p.summary)}</p>
        <dl class="hp-facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <ul class="specs">${(p.features || []).map(f => `<li>${esc(f)}</li>`).join('')}</ul>
        <div class="actions" id="hpActions"><a class="btn btn-gold" href="/#plan">${open ? 'Contact Us' : 'Ask about opening dates'}</a></div>
      </div>
    </div>

    <section class="hp-section" aria-labelledby="photos">
      <h2 id="photos">${rend ? 'Renderings' : 'Photos'}</h2>
      <p class="note">${rend ? 'Architect renderings of the finished home. Photos will be added once it opens.' : `${p.photos.files.length} photos of the ${esc(p.name)}.`}</p>
      <ul class="hp-photos">
${p.photos.files.map((f, i) => `        <li><a href="${esc(src(f, 2000))}" target="_blank" rel="noopener"><img src="${esc(src(f, 640))}" alt="${esc(i ? `${p.name} ${rend ? 'rendering' : 'photo'} ${i + 1}` : coverAlt)}" loading="lazy"></a></li>`).join('\n')}
      </ul>
    </section>

    <section class="hp-section" aria-labelledby="more">
      <h2 id="more">More homes at North Peak</h2>
      <p class="note">All in Campton, New Hampshire, in the White Mountains.</p>
      <ul class="hp-others">
${others.map(o => `        <li><a href="${NP.pageUrl(o)}"><div class="hp-cover"><img src="${esc(src(o.photos.files[0], 800))}" alt="${esc(o.photos.coverAlt || o.name)}" loading="lazy"></div><h3>${esc(o.name)}</h3><span>${esc(NP.meta(o))}</span></a></li>`).join('\n')}
      </ul>
    </section>
  </div>
</main>

<footer class="hp-foot">
  <div class="wrap">
    <span>© 2026 North Peak Stays · 151 Pinnacle Road, Campton, NH 03223</span>
    <span><a href="/">Home</a> · <a href="/#experiences">Experiences</a> · <a href="/#reviews">Reviews</a> · <a href="/#plan">Plan your stay</a> · <a href="/privacy">Privacy</a></span>
  </div>
</footer>

<script src="/properties.js"></script>
<script src="/site.js"></script>
<script>
(function(){
  /* the button and badge follow the same approval rules as the homepage (site.js) */
  var NP = window.NP, p = NP.HOMES.filter(function(h){ return NP.slug(h) === ${JSON.stringify(slug)}; })[0];
  if (NP.liveHost){ var t = document.querySelector('.demo-tag'); if (t) t.remove(); }
  var q = location.search;
  if (q) document.querySelectorAll('a[href^="/"]').forEach(function(a){ var h = a.getAttribute('href'), i = h.indexOf('#'); a.setAttribute('href', i < 0 ? h + q : h.slice(0, i) + q + h.slice(i)); });
  if (!p) return;
  var act = NP.action(p, '/' + q + (NP.formsShow ? '#ask' : '#plan'));
  document.getElementById('hpBadge').innerHTML = NP.badge(p, act);
  document.getElementById('hpActions').innerHTML = act ? '<a class="' + (act.primary ? 'btn btn-gold' : 'link') + '" href="' + NP.esc(act.href) + '">' + act.label + '</a>' : '';
  document.getElementById('hpActions').insertAdjacentHTML('afterend', NP.waitlistHtml(p));
  document.querySelectorAll('[data-form]').forEach(NP.wireForm);
  if (act && act.online) document.querySelector('[data-book]').setAttribute('href', act.href);
})();
</script>
</body>
</html>
`;
    pages[`homes/${slug}.html`] = html;
  }

  // ---------- privacy policy (/privacy): same frame as a home page, its own head and content ----------
  const base = Object.values(pages)[0];
  const cut = (s, a, b) => { const i = s.indexOf(a), j = s.indexOf(b, i); if (i < 0 || j < 0) throw new Error('privacy template: ' + a); return [s.slice(0, i), s.slice(j)]; };
  const pv = NP.SITE.privacy || {};
  const lodgifyPrivacy = 'https://www.lodgify.com/privacy/';
  let privacy = base;
  let [pre, post] = cut(privacy, '<title>', '<link rel="icon"');
  privacy = pre + `<title>Privacy Policy | North Peak Stays</title>
<meta name="description" content="How the North Peak Stays website handles the information you share through its contact form, waitlist and booking links.">
${noindex ? '<meta name="robots" content="noindex, nofollow">\n' : ''}${canonical ? `<link rel="canonical" href="${canonical}/privacy">\n` : ''}` + post;
  [pre, post] = cut(privacy, '<main class="hp-main">', '</main>');
  privacy = pre + `<main class="hp-main">
  <div class="wrap legal-page">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">North Peak Stays</a> › <span aria-current="page">Privacy policy</span></nav>
    <h1>Privacy policy</h1>
    <p class="note">Last updated ${esc(pv.updated || '')}</p>
    <p>This page explains what information the North Peak Stays website collects, why, and what we do with it. North Peak Stays is based at 151 Pinnacle Road, Campton, NH 03223.</p>

    <h2>What we collect</h2>
    <ul>
      <li><strong>When you send us a message:</strong> your name and email, and if you choose to add them, your phone number, travel dates, the home you're asking about and your message.</li>
      <li><strong>When you join a waitlist:</strong> your email and the home you want to hear about.</li>
      <li><strong>Your theme choice:</strong> if you switch between light and dark, that choice is saved in your own browser. It is not sent to us.</li>
    </ul>
    <p>We don't use advertising or tracking cookies.</p>

    <h2>How we use it</h2>
    <p>We use your details only to reply to your message, or to send you one email when the home you asked about opens for booking. We don't add you to marketing lists, and we never sell or rent your information.</p>

    <h2>Booking</h2>
    <p>When you book, you complete your reservation and payment on Lodgify's secure checkout. Lodgify handles those details under <a href="${lodgifyPrivacy}" target="_blank" rel="noopener">its own privacy policy</a>, and we receive the reservation details we need to host your stay.</p>

    <h2>Services that help run this website</h2>
    <ul>
      <li><strong>A form delivery service</strong> passes messages and waitlist sign-ups from this website to our email.</li>
      <li><strong>Vercel</strong> hosts the website. Like any web host, it keeps basic technical logs, such as IP address and browser type, to keep the site running and secure.</li>
      <li><strong>Google</strong> provides the website's fonts and map, so it receives your IP address when those load.</li>
      <li><strong>Lodgify</strong> provides the booking checkout.</li>
    </ul>
    <p>We share information with these services only so they can do these jobs.</p>

    <h2>How long we keep it</h2>
    <p>We keep messages for as long as we need them to answer you and look after your stay. We delete waitlist emails after we've sent the opening announcement, or sooner if you ask.</p>

    <h2>Your choices</h2>
    <p>You can ask us to show you, correct or delete the information you've sent us, and you can ask to leave a waitlist at any time. Contact us using the details below.</p>

    <h2>Children</h2>
    <p>This website is meant for adults planning a trip. We don't knowingly collect information from children under 13.</p>

    <h2>Changes</h2>
    <p>If we change how we handle information, we'll update this page and the date at the top.</p>

    <h2>Contact us</h2>
    <p>North Peak Stays, 151 Pinnacle Road, Campton, NH 03223. Phone or text <a href="tel:+16178160401">+1 617 816 0401</a>.</p>
  </div>
` + post;
  [pre, post] = cut(privacy, '<script>\n(function(){\n  /* the button and badge', '</script>');
  privacy = pre + `<script>
(function(){
  var NP = window.NP;
  if (NP.liveHost){ var t = document.querySelector('.demo-tag'); if (t) t.remove(); }
  var q = location.search;
  if (q) document.querySelectorAll('a[href^="/"]').forEach(function(a){ var h = a.getAttribute('href'), i = h.indexOf('#'); a.setAttribute('href', i < 0 ? h + q : h.slice(0, i) + q + h.slice(i)); });
})();
` + post;
  privacy = privacy.replace('</style>', `.legal-page{max-width:760px}
.legal-page h1{font-family:var(--serif);font-weight:500;font-size:clamp(2.4rem,4.4vw,3.4rem);color:var(--heading);margin:4px 0 6px}
.legal-page h2{font-family:var(--serif);font-weight:500;font-size:1.7rem;color:var(--heading);margin:38px 0 10px}
.legal-page p,.legal-page li{color:var(--ink);line-height:1.7}
.legal-page p+p,.legal-page ul+p,.legal-page p+ul{margin-top:12px}
.legal-page ul{padding-left:20px;display:grid;gap:8px}
.legal-page a{color:var(--heading)}
.legal-page .note{color:var(--muted);font-size:.9rem;margin-bottom:24px}
</style>`);
  pages['privacy.html'] = privacy;

  if (canonical) {
    const urls = ['/', ...homes.map(p => NP.pageUrl(p)), '/privacy'];
    pages['sitemap.xml'] = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${canonical}${u}</loc></url>`).join('\n')}\n</urlset>\n`;
  }
  return pages;
}

// files on disk that no longer match what buildPages() would write (or should not exist)
export function stalePages() {
  const pages = buildPages(), out = [];
  for (const [f, html] of Object.entries(pages)) {
    const p = path.join(root, f);
    if (!existsSync(p) || readFileSync(p, 'utf8').replace(/\r\n/g, '\n') !== html) out.push(f);
  }
  const dir = path.join(root, 'homes');
  if (existsSync(dir)) for (const f of readdirSync(dir)) if (!pages['homes/' + f]) out.push('homes/' + f + ' (no longer a home)');
  return out;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--check')) {
    const s = stalePages();
    console.log(s.length ? 'Out of date:\n  ' + s.join('\n  ') : 'Home pages are up to date.');
    process.exit(s.length ? 1 : 0);
  }
  const pages = buildPages();
  mkdirSync(path.join(root, 'homes'), { recursive: true });
  for (const f of readdirSync(path.join(root, 'homes'))) if (!pages['homes/' + f]) unlinkSync(path.join(root, 'homes', f));
  if (!pages['sitemap.xml'] && existsSync(path.join(root, 'sitemap.xml'))) unlinkSync(path.join(root, 'sitemap.xml'));
  for (const [f, html] of Object.entries(pages)) writeFileSync(path.join(root, f), html);
  console.log('Wrote ' + Object.keys(pages).join(', '));
}
