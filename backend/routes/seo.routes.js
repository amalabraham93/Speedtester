const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

const BASE_URL = 'https://speedtrack.com'; // Adjust to custom domain

router.get('/sitemap.xml', async (req, res) => {
    try {
        const staticPages = [
            '',
            '/login',
            '/register',
            '/dashboard',
            '/blog'
        ];

        const locations = [
            'india', 'usa', 'uk', 'uae', 'canada', 'australia', 'germany', 'france',
            'mumbai', 'delhi', 'bangalore', 'london', 'new-york', 'dubai'
        ];

        const blogs = await Blog.find().select('slug updatedAt');

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Static Pages
        staticPages.forEach(page => {
            xml += `
  <url>
    <loc>${BASE_URL}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`;
        });

        // Location Pages
        locations.forEach(loc => {
            xml += `
  <url>
    <loc>${BASE_URL}/speed-test/${loc}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
        });

        // Blog Posts
        blogs.forEach(blog => {
            xml += `
  <url>
    <loc>${BASE_URL}/blog/${blog.slug}</loc>
    <lastmod>${blog.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
        });

        xml += `
</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (err) {
        res.status(500).send('Error generating sitemap');
    }
});

router.get('/robots.txt', (req, res) => {
    const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /results/
Disallow: /dashboard/

Sitemap: ${BASE_URL}/sitemap.xml
`;
    res.header('Content-Type', 'text/plain');
    res.send(robots);
});

module.exports = router;
