// scripts/generate-sitemap.js
import fs from 'fs';
import path from 'path';

const BASE = 'https://williamsjullin.com';
const LOCALES = ['fr','en','de','es','pt','ru','zh'];

const routes = {
  home: l => (l==='fr'? '/': `/${l}`),
  story: l => (l==='fr'? '/mon-histoire': `/${l}/${({en:'my-story',de:'meine-geschichte',es:'mi-historia',pt:'minha-historia',ru:'moja-istoria',zh:'我的故事'})[l]||'my-story'}`),
  blog:  l => (l==='fr'? '/blog': `/${l}/blog`),
  contact: l => (l==='fr'? '/contact': `/${l}/${({en:'contact',de:'kontakt',es:'contacto',pt:'contato',ru:'kontakt',zh:'联系'})[l]||'contact'}`),
  media: l => (l==='fr'? '/media': `/${l}/${({en:'media',de:'medien',es:'medios',pt:'midia',ru:'media',zh:'媒体'})[l]||'media'}`),
  investors: l => (l==='fr'? '/investors': `/${l}/${({en:'investors',de:'investoren',es:'inversores',pt:'investidores',ru:'investory',zh:'投资者'})[l]||'investors'}`)
};

// Billets (idéalement provenant d'une source)
// Mets ici les slugs existants :
const posts = [
  'visa-guide-2024',
  'banking-digital-nomades-solutions'
];

const lastmod = new Date().toISOString().split('T')[0];

function urlWithAlternates(pathByLocale){
  const entries = LOCALES.map(l=>({l, loc: `${BASE}${pathByLocale(l)}`}));
  const xdefault = `${BASE}${pathByLocale('en')}`;
  return `
  <url>
    ${entries.map(e=>`<loc>${e.loc}</loc>`).slice(0,1)}
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    ${entries.map(e=>`<xhtml:link rel="alternate" hreflang="${e.l}" href="${e.loc}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${xdefault}"/>
  </url>`;
}

let body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

// Pages
for (const key of Object.keys(routes)){
  body += urlWithAlternates(routes[key]);
}

// Billets
for (const slug of posts){
  body += urlWithAlternates(l => (l==='fr'? `/blog/${slug}` : `/${l}/blog/${slug}`));
}

body += `\n</urlset>`;

const out = path.join(process.cwd(), 'public', 'sitemap.xml');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, body);
console.log('✅ sitemap.xml généré');
