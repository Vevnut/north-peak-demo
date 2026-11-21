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
  /* ---------- contact form and waitlist ---------- */
  var FORMS = SITE.forms || {};
  // previews always show the forms (without sending unless an endpoint is set); the launched site
  // shows them only once the owner has approved an endpoint
  var formsShow = FORMS.endpoint ? ok(FORMS) : !LIVE;
  function waitlistHtml(p){
    if (!formsShow || isOpen(p)) return '';
    return '<form class="np-form waitlist" data-form="waitlist" novalidate>' +
      '<input type="hidden" name="form" value="Waitlist"><input type="hidden" name="home" value="' + esc(p.name) + '">' +
      '<label>Email me when it opens <input type="email" name="email" autocomplete="email" placeholder="you@example.com" required></label>' +
      '<button class="btn btn-line" type="submit">Notify me</button>' +
      '<label class="trap" aria-hidden="true">Leave empty <input name="_gotcha" tabindex="-1" autocomplete="off"></label>' +
      '<p class="form-note">One email when bookings open. We never share your address. <a href="/privacy' + location.search + '">Privacy policy</a></p>' +
      '<p class="form-status" role="status" aria-live="polite"></p></form>';
  }
  function wireForm(f){
    var status = f.querySelector('.form-status'), btn = f.querySelector('[type=submit]');
    function say(msg, bad){ status.textContent = msg; status.classList.toggle('bad', !!bad); }
    f.addEventListener('submit', function(e){
      e.preventDefault();
      if (!f.checkValidity()){ f.reportValidity(); return; }
      var trap = f.querySelector('[name=_gotcha]');
      var done = f.dataset.form === 'waitlist' ? "You're on the list. We'll email you when it opens." : "Thanks! Your message is on its way, and we'll reply by email.";
      if (trap && trap.value){ f.reset(); say(done); return; }   // a bot filled the hidden field
      if (!FORMS.endpoint){ say('This is a design preview, so nothing was sent. On the launched site this goes straight to North Peak Stays.'); return; }
      btn.disabled = true; say('Sending…');
      fetch(FORMS.endpoint, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
        .then(function(r){ if (!r.ok) throw new Error(r.status); f.reset(); say(done); })
        .catch(function(){ say("Sorry, that didn't send. Please try again" + (textOk ? ', or text us at ' + TEXT.number.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3') : '') + '.', true); })
        .then(function(){ btn.disabled = false; });
    });
  }
  // what the main button does, from the home's status and what the owner has approved;
  // plan = where "Contact Us" goes on this page (the contact form when it shows)
  function action(p, plan){
    plan = plan || (formsShow ? '#ask' : '#plan');
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
  /* ---------- local guide (guide.js) ---------- */
  var GUIDE = window.NP_GUIDE || [];
  var I_FORK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true"><path d="M7 3v8M5 3v5a2 2 0 004 0V3M7 11v10M16 3c-2 1.5-2.5 4-2.5 7h2.5v11"/></svg>';
  function guideUrl(c){ return '/guide/' + c.slug; }
  // one spot card; base = '' on the homepage, '/' on pages in folders (so image paths still work)
  function spotHtml(s, base){
    base = base || '';
    var img = s.photo
      ? '<div class="spot-img' + (s.logo ? ' has-logo' : '') + '"><img class="ph" src="' + esc(base + s.photo) + '" alt="' + esc(s.photoAlt) + '" loading="lazy">' +
        (s.logo ? '<img class="spot-logo" src="' + esc(base + s.logo) + '" alt="' + esc(s.logoAlt) + '" loading="lazy">' : '') + '</div>'
      : '<div class="spot-img no-photo">' + I_FORK + '</div>';
    return '<li class="spot">' + img + '<div class="spot-body"><div class="spot-top"><h3>' + esc(s.name) + '</h3><span class="tag">' + esc(s.tag) + '</span></div>' +
      '<p>' + esc(s.text) + '</p><div class="spot-foot"><span>' + esc(s.where) + '</span><a href="' + esc(s.link.href) + '" target="_blank" rel="noopener">' + esc(s.link.label) + '</a></div></div></li>';
  }
  function creditHtml(s){
    var c = s.credit;
    return '<li>' + esc(c.place) + ': ' + esc(c.author) + ', <a href="' + esc(c.source) + '" target="_blank" rel="noopener">' + esc(c.license) + '</a></li>';
  }
  /* ---------- full-screen photo viewer (homepage galleries and home pages) ---------- */
  var lb = null, lbImg, lbStrip, cur = { g: null, i: 0 }, lastFocus = null, loadToken = 0;
  var reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function buildLb(){
  lb = document.createElement('div');
  lb.className = 'lb'; lb.id = 'lb'; lb.hidden = true;
  lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Photo gallery');
  lb.innerHTML =
    '<div class="lb-top"><div class="lb-title" id="lbTitle"></div><span class="lb-tag" id="lbTag"></span><div class="lb-count" id="lbCount" aria-live="polite"></div>' +
    '<button class="lb-btn" id="lbClose" type="button" aria-label="Close gallery"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
    '<div class="lb-stage" id="lbStage"><img class="lb-img" id="lbImg" alt="">' +
    '<button class="lb-btn lb-nav prev" id="lbPrev" type="button" aria-label="Previous photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
    '<button class="lb-btn lb-nav next" id="lbNext" type="button" aria-label="Next photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 5l7 7-7 7"/></svg></button></div>' +
    '<div class="lb-strip" id="lbStrip"></div>';
  document.body.appendChild(lb);
  lbImg = document.getElementById('lbImg'); lbStrip = document.getElementById('lbStrip');

  bindLb();
  }
  function openLightbox(g, i){
    if (!lb) buildLb();
    cur.g = g; lastFocus = document.activeElement;
    document.getElementById('lbTitle').textContent = g.title;
    document.getElementById('lbTag').textContent = g.tag;
    lbStrip.innerHTML = g.items.map(function(it, j){
      return '<button type="button" data-j="' + j + '" aria-label="Photo ' + (j + 1) + '"><img src="' + it.thumb + '" alt="" loading="lazy"></button>';
    }).join('');
    lbImg.removeAttribute('src');
    lb.hidden = false; document.body.style.overflow = 'hidden';
    requestAnimationFrame(function(){ lb.classList.add('open'); });
    showLb(i, true);
    document.getElementById('lbClose').focus();
  }
  function closeLb(){
    lb.classList.remove('open'); document.body.style.overflow = '';
    setTimeout(function(){ lb.hidden = true; }, 350);
    if (lastFocus) lastFocus.focus();
  }
  function showLb(i, instant){
    var g = cur.g, n = g.items.length;
    cur.i = (i + n) % n;
    var it = g.items[cur.i], token = ++loadToken;
    document.getElementById('lbCount').textContent = (cur.i + 1) + ' / ' + n;
    lbStrip.querySelectorAll('button').forEach(function(b, j){
      var on = j === cur.i; b.classList.toggle('on', on);
      if (on) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce || instant ? 'auto' : 'smooth' });
    });
    if (!instant) lbImg.classList.add('fading');
    var pre = new Image(); pre.src = it.full;
    (pre.decode ? pre.decode() : Promise.resolve()).catch(function(){}).then(function(){
      if (token !== loadToken) return;               // a newer photo was requested meanwhile
      lbImg.src = it.full;
      lbImg.alt = g.title + (g.tag ? ' rendering ' : ', photo ') + (cur.i + 1) + ' of ' + n;
      lbImg.classList.remove('fading');
    });
    [cur.i + 1, cur.i - 1].forEach(function(j){ new Image().src = g.items[(j + n) % n].full; });  // preload neighbours
  }
  function bindLb(){
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbPrev').addEventListener('click', function(){ showLb(cur.i - 1); });
  document.getElementById('lbNext').addEventListener('click', function(){ showLb(cur.i + 1); });
  lbStrip.addEventListener('click', function(e){ var b = e.target.closest('[data-j]'); if (b) showLb(+b.dataset.j); });
  document.getElementById('lbStage').addEventListener('click', function(e){ if (e.target.id === 'lbStage') closeLb(); });
  lb.addEventListener('keydown', function(e){
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowRight') showLb(cur.i + 1);
    else if (e.key === 'ArrowLeft') showLb(cur.i - 1);
    else if (e.key === 'Tab'){                         // keep focus inside the viewer
      var f = [].slice.call(lb.querySelectorAll('button')), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  });
  var sx = null;                                       // swipe left/right on touch screens
  lbImg.addEventListener('pointerdown', function(e){ sx = e.clientX; });
  lbImg.addEventListener('pointerup', function(e){
    if (sx === null) return; var dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 45) showLb(cur.i + (dx < 0 ? 1 : -1));
  });
  }
  return { SITE: SITE, HOMES: HOMES, liveHost: liveHost, LIVE: LIVE, ok: ok, TEXT: TEXT, textOk: textOk,
    esc: esc, sized: sized, plural: plural, words: words, isOpen: isOpen, slug: slug, pageUrl: pageUrl,
    action: action, badge: badge, meta: meta, formsShow: formsShow, waitlistHtml: waitlistHtml, wireForm: wireForm, openLightbox: openLightbox,
    GUIDE: GUIDE, guideUrl: guideUrl, spotHtml: spotHtml, creditHtml: creditHtml };
})();
