// Checks properties.js (the list of homes) before you push.
//
//   node scripts/check-properties.mjs           everyday check: errors fail, pending approvals are listed
//   node scripts/check-properties.mjs --launch  launch check: pending approvals also fail
//
// No dependencies; needs Node 18+.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const launch = process.argv.includes('--launch');
const errors = [];
const pending = [];

const sandbox = { window: {} };
vm.runInNewContext(readFileSync(path.join(root, 'properties.js'), 'utf8'), sandbox, { filename: 'properties.js' });
const site = sandbox.window.NP_SITE;
const homes = sandbox.window.NP_PROPERTIES;

if (!site) errors.push('NP_SITE is missing');
if (!Array.isArray(homes) || !homes.length) errors.push('NP_PROPERTIES must be a non-empty list');

const STATUSES = ['bookable', 'text', 'upcoming', 'hidden'];
const bookingHosts = (site && site.bookingHosts) || [];
const seen = new Set();

for (const [i, p] of (homes || []).entries()) {
  const who = p && p.id ? `"${p.id}"` : `home #${i + 1}`;
  const err = msg => errors.push(`${who}: ${msg}`);

  if (!p.id || !/^[a-z0-9-]+$/.test(p.id)) err('id must be lowercase letters, numbers and dashes');
  else if (seen.has(p.id)) err('id is used twice');
  seen.add(p.id);
  if (!p.name) err('name is missing');
  if (!STATUSES.includes(p.status)) err(`status must be one of ${STATUSES.join(', ')}`);
  for (const k of ['bedrooms', 'baths']) if (!Number.isInteger(p[k]) || p[k] < 1) err(`${k} must be a whole number`);
  for (const k of ['beds', 'sleeps', 'sqft']) if (p[k] != null && (!Number.isInteger(p[k]) || p[k] < 1)) err(`${k} must be a whole number or null`);
  if (!p.summary) err('summary is missing');

  const ph = p.photos;
  if (!ph || !['photo', 'rendering'].includes(ph.kind)) err('photos.kind must be "photo" or "rendering"');
  if (!ph || !Array.isArray(ph.files) || !ph.files.length) err('photos.files needs at least one image');
  for (const f of (ph && ph.files) || []) {
    if (/^https?:/.test(f)) {
      if (!f.startsWith('https://')) err(`photo must use https: ${f}`);
    } else if (!existsSync(path.join(root, f))) err(`photo file not found: ${f}`);
  }

  if (p.status === 'bookable') {
    const url = p.booking && p.booking.url;
    if (!url) err('a "bookable" home needs booking.url');
    else {
      let host = '';
      try { host = new URL(url).hostname; } catch { err(`booking.url is not a valid URL: ${url}`); }
      if (host && !url.startsWith('https://')) err('booking.url must use https');
      if (host && !bookingHosts.includes(host)) err(`booking.url host ${host} is not in NP_SITE.bookingHosts`);
    }
    if (p.booking && p.booking.approved !== true) pending.push(`${who}: booking link not yet approved by the owner`);
  }
  if (p.status === 'upcoming' && p.booking && p.booking.url) err('an "upcoming" home must not have a booking link');
  if (p.status === 'upcoming' && p.opening && p.opening.approved !== true) pending.push(`${who}: opening date "${p.opening.label}" not yet approved`);
  if (p.status !== 'hidden' && p.detailsUrl && /staynorthpeak\.com/.test(p.detailsUrl)) {
    pending.push(`${who}: detailsUrl points at the old Lodgify site, which stops working once the domain moves (hidden on the live site)`);
  }
}

const usesText = (homes || []).some(p => p.status === 'text' || p.textAboutDates || (p.status === 'bookable' && !(p.booking && p.booking.approved)));
if (usesText && !(site && site.text && site.text.approved === true)) pending.push('NP_SITE.text: texting number not yet approved for bookings');
if (!site || !Array.isArray(site.liveHosts) || !site.liveHosts.length) pending.push('NP_SITE.liveHosts is empty (set it to the real domain on launch day)');

// the page itself must not carry its own booking links: properties.js is the one place for them
const html = readFileSync(path.join(root, 'index.html'), 'utf8');
if (/checkout\.lodgify\.com/.test(html)) errors.push('index.html has a hard-coded Lodgify checkout link; move it into properties.js');

const shown = (homes || []).filter(p => p.status !== 'hidden').length;
console.log(`Checked ${(homes || []).length} homes (${shown} shown).`);
if (pending.length) {
  console.log(`\n${launch ? 'Not ready for launch' : 'Waiting on the owner'} (${pending.length}):`);
  for (const m of pending) console.log('  - ' + m);
}
if (errors.length) {
  console.log(`\nErrors (${errors.length}):`);
  for (const m of errors) console.log('  - ' + m);
}
const failed = errors.length > 0 || (launch && pending.length > 0);
console.log(failed ? '\nFAILED' : '\nOK');
process.exit(failed ? 1 : 0);
