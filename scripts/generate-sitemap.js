import fs from 'fs';
import path from 'path';

const baseUrl = 'https://williamsjullin.com';
const languages = ['fr', 'en', 'de', 'es'];
const pages = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: 'mon-histoire', priority: '0.9', changefreq: 'weekly' },
  { path: 'blog', priority: '0.9', changefreq: 'weekly' },
  { path: 'contact', priority: '0.8', changefreq: 'monthly' },
  { path: 'media', priority: '0.7', changefreq: 'monthly' },
  { path: 'investors', priority: '0.6', changefreq: 'monthly' }
];

const generateSitemap = () => {
  const lastmod = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  pages.forEach(page => {
    languages.forEach(lang => {
      const url = page.path === '' 
        ? `${baseUrl}/${lang === 'fr' ? '' : lang}`
        : `${baseUrl}/${lang === 'fr' ? '' : lang + '/'}${page.path}`;
      
      sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
`;

      // Ajouter hreflang pour chaque langue
      languages.forEach(hrefLang => {
        const hrefUrl = page.path === '' 
          ? `${baseUrl}/${hrefLang === 'fr' ? '' : hrefLang}`
          : `${baseUrl}/${hrefLang === 'fr' ? '' : hrefLang + '/'}${page.path}`;
        
        sitemap += `    <xhtml:link rel="alternate" hreflang="${hrefLang}" href="${hrefUrl}" />
`;
      });

      sitemap += `  </url>
`;
    });
  });

  sitemap += `</urlset>`;

  // Écrire le fichier
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('✅ Sitemap généré avec succès');
};

generateSitemap();