'use strict';
const fs = require('fs');

// ── Escape HTML special chars ──────────────────────────────────────────────
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Raw: inject pre-escaped or trusted HTML strings without double-escaping
function raw(str) {
  return String(str ?? '');
}

// ── Load data files ────────────────────────────────────────────────────────
const hours   = JSON.parse(fs.readFileSync('_data/hours.json',   'utf8'));
const contact = JSON.parse(fs.readFileSync('_data/contact.json', 'utf8'));
const social  = JSON.parse(fs.readFileSync('_data/social.json',  'utf8'));
const hero    = JSON.parse(fs.readFileSync('_data/hero.json',    'utf8'));
const about   = JSON.parse(fs.readFileSync('_data/about.json',   'utf8'));
const drinks  = JSON.parse(fs.readFileSync('_data/drinks.json',  'utf8'));
const tribute = JSON.parse(fs.readFileSync('_data/tribute.json', 'utf8'));

// ── Build neon tags HTML ───────────────────────────────────────────────────
const neonTagsHTML = hero.neon_tags.map((tag, i) => {
  const colorClass = `neon-${tag.color}`;
  const html = `<span class="neon-tag ${colorClass}">${esc(tag.label)}</span>`;
  return i < hero.neon_tags.length - 1
    ? html + '\n      <span class="neon-dot">·</span>'
    : html;
}).join('\n      ');

// ── Build drinks strip items HTML ─────────────────────────────────────────
const delayClasses = ['', ' reveal-delay', ' reveal-delay2', ' reveal-delay'];
const drinkItemsHTML = drinks.items.map((item, i) => {
  return `    <div class="ds-item reveal${delayClasses[i] || ''}">
      <div class="ds-img-wrap"><img src="${esc(item.image)}" alt="${esc(item.alt)}" loading="lazy"/></div>
      <p>${esc(item.label)}</p>
    </div>`;
}).join('\n');

// ── Read template ──────────────────────────────────────────────────────────
let html = fs.readFileSync('index.template.html', 'utf8');

// ── Replace all placeholders ───────────────────────────────────────────────
html = html
  // Contact
  .replace(/{{EMAIL}}/g,         esc(contact.email))
  .replace(/{{ADDRESS_LINE1}}/g, esc(contact.address_line1))
  .replace(/{{ADDRESS_LINE2}}/g, esc(contact.address_line2))
  .replace(/{{ADDRESS_SHORT}}/g, esc(contact.address_short))
  .replace(/{{MAPS_EMBED_URL}}/g, raw(contact.maps_embed_url))

  // Social
  .replace(/{{INSTAGRAM_URL}}/g, esc(social.instagram))
  .replace(/{{FACEBOOK_URL}}/g,  esc(social.facebook))

  // Hero
  .replace(/{{HERO_EYEBROW}}/g,  esc(hero.eyebrow))
  .replace(/{{HERO_SUB}}/g,      esc(hero.sub))
  .replace(/{{NEON_TAGS}}/g,     neonTagsHTML)
  .replace(/{{CTA_PRIMARY}}/g,   esc(hero.cta_primary))
  .replace(/{{CTA_GHOST}}/g,     esc(hero.cta_ghost))

  // About
  .replace(/{{ABOUT_EYEBROW}}/g, esc(about.eyebrow))
  .replace(/{{ABOUT_HEADING}}/g, raw(about.heading))
  .replace(/{{ABOUT_BODY1}}/g,   raw(about.body1))
  .replace(/{{ABOUT_BODY2}}/g,   raw(about.body2))
  .replace(/{{ABOUT_TAGLINE}}/g, raw(about.tagline))

  // Drinks
  .replace(/{{DRINKS_EYEBROW}}/g, esc(drinks.eyebrow))
  .replace(/{{DRINKS_HEADING}}/g, esc(drinks.heading))
  .replace(/{{DRINKS_ITEMS}}/g,   drinkItemsHTML)

  // Hours
  .replace(/{{HOURS_MONDAY}}/g,    esc(hours.monday))
  .replace(/{{HOURS_TUESDAY}}/g,   esc(hours.tuesday))
  .replace(/{{HOURS_WEDNESDAY}}/g, esc(hours.wednesday))
  .replace(/{{HOURS_THURSDAY}}/g,  esc(hours.thursday))
  .replace(/{{HOURS_FRIDAY}}/g,    esc(hours.friday))
  .replace(/{{HOURS_SATURDAY}}/g,  esc(hours.saturday))
  .replace(/{{HOURS_SUNDAY}}/g,    esc(hours.sunday))

  // Tribute
  .replace(/{{TRIBUTE_EYEBROW}}/g, raw(tribute.eyebrow))
  .replace(/{{TRIBUTE_HEADING}}/g, raw(tribute.heading))
  .replace(/{{TRIBUTE_BODY}}/g,    raw(tribute.body))
  .replace(/{{TRIBUTE_QUOTE}}/g,   raw(tribute.quote))

  // Footer year (auto)
  .replace(/{{YEAR}}/g, String(new Date().getFullYear()));

// ── Write output ───────────────────────────────────────────────────────────
fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ index.html built successfully');
