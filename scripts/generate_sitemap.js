const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://flyclim.com';

const routes = [
    '',
    '/about',
    '/solutions',
    '/team',
    '/pilot-program',
    '/contact',
    '/demo',
    '/privacy',
    '/terms'
];

const generateSitemap = () => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => `
    <url>
      <loc>${DOMAIN}${route}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>
      <priority>${route === '' ? '1.0' : '0.8'}</priority>
    </url>
  `).join('')}
</urlset>`;

    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('✅ Sitemap generated successfully!');
};

generateSitemap();