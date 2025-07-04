const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// if (!MONGODB_URI) {
//   throw new Error('MONGODB_URI is required');
// }
const MONGODB_URI = "mongodb+srv://davide:!!!Sasha2015!!!Eliana2019!!!@flyclimweb.qj1barl.mongodb.net/?retryWrites=true&w=majority&appName=flyclimWeb&ssl=true"
const DOMAIN = 'https://www.flyclim.com';

// Static routes that are always included
const staticRoutes = [
  '',
  '/about',
  '/solutions',
  '/team',
  '/pilot-program',
  '/contact',
  '/demo',
  '/privacy',
  '/terms',
  '/app'
];

async function generateSitemap() {
  let client;
  try {
    // Connect to MongoDB
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db('flyclim');

    // Fetch all published posts
    const posts = await db.collection('posts')
      .find({ status: 'published' })
      .toArray();

    // Generate URLs for all content
    const urls = [
      // Static routes
      ...staticRoutes.map(route => ({
        loc: `${DOMAIN}${route}`,
        lastmod: new Date().toISOString(),
        changefreq: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? '1.0' : '0.8'
      })),

      // Dynamic blog posts
      ...posts.filter(post => post.type === 'blog').map(post => ({
        loc: `${DOMAIN}/blog/${post.slug}`,
        lastmod: new Date(post.updatedAt || post.publishedAt).toISOString(),
        changefreq: 'weekly',
        priority: '0.7'
      })),

      // Dynamic news articles
      ...posts.filter(post => post.type === 'news').map(post => ({
        loc: `${DOMAIN}/news/${post.slug}`,
        lastmod: new Date(post.updatedAt || post.publishedAt).toISOString(),
        changefreq: 'weekly',
        priority: '0.7'
      }))
    ];

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Ensure public directory exists
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write sitemap file
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('✅ Sitemap generated successfully!');

    // Generate robots.txt if it doesn't exist
    const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# Sitemap
Sitemap: ${DOMAIN}/sitemap.xml`;

    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
    console.log('✅ robots.txt generated successfully!');

  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

generateSitemap();