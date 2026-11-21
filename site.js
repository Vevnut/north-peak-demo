/* North Peak Stays: rules shared by the homepage and the home pages.
 * Reads properties.js (load that first) and decides what each home shows: which button,
 * which badge, and whether pending owner approvals may show on this address.
 */
window.NP = (function(){
  var SITE = window.NP_SITE || {};
  var HOMES = (window.NP_PROPERTIES || []).filter(function(p){ return p.status !== 'hidden'; });
  var liveHost = (SITE.liveHosts || []).indexOf(location.hostname) > -1;
  // On the launched site only owner-approved links and dates show. Previews also show pending
  // ones so the demo stays complete; add ?as=live to a preview address to see the launch rules.
  var LIVE = liveHost || new URLSearchParams(location.search).get('as') === 'live';
  function ok(x){ return !!x && (x.approved === true || !LIVE); }
  var TEXT = SITE.text || {}, textOk = !!TEXT.number && ok(TEXT);
  function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function sized(u, w){ return /\/\/l\.icdbcdn\.com\//.test(u) ? u + '?w=' + w : u; }
  function plural(n, word){ return n + ' ' + word + (n === 1 ? '' : 's'); }
  function words(n){ return ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'][n] || String(n); }
  function isOpen(p){ return p.status === 'bookable' || p.status === 'text'; }
  // the home's own page, made by scripts/build-homes.mjs from its name
  function slug(p){ return p.name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function pageUrl(p){ return '/homes/' + slug(p); }
  // what the main button does, from the home's status and what the owner has approved;
  // plan = where "Contact Us" goes on this page
  function action(p, plan){
    plan = plan || '#plan';
    if (p.status === 'bookable' && p.booking && p.booking.url && ok(p.booking)) return { label: 'Book Now', href: p.booking.url, primary: true, online: true };
    if (isOpen(p) && textOk) return { label: 'Text to Book', href: 'sms:' + TEXT.number, primary: true };
    if (isOpen(p)) return { label: 'Contact Us', href: plan, primary: true };
    if (p.textAboutDates && textOk) return { label: 'Text us about dates', href: 'sms:' + TEXT.number, primary: false };
    return null;
  }
  function badge(p, act){
    if (!isOpen(p)) return '<span class="badge">' + esc(p.opening && ok(p.opening) ? p.opening.label : 'Coming soon') + '</span>';
    return '<span class="badge live">' + (act && act.online ? 'Now booking' : 'Open now') + '</span>';
  }
  function meta(p){
    var m = [];
    if (p.sleeps) m.push('Sleeps ' + p.sleeps);
    m.push(plural(p.bedrooms, 'bedroom'));
    if (p.beds) m.push(plural(p.beds, 'bed'));
    m.push(plural(p.baths, 'bath'));
    if (p.sqft) m.push(p.sqft.toLocaleString('en-US') + ' sq ft');
    return m.join(' · ');
  }
  return { SITE: SITE, HOMES: HOMES, liveHost: liveHost, LIVE: LIVE, ok: ok, TEXT: TEXT, textOk: textOk,
    esc: esc, sized: sized, plural: plural, words: words, isOpen: isOpen, slug: slug, pageUrl: pageUrl,
    action: action, badge: badge, meta: meta };
})();
