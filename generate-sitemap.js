const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

const sitemap = new SitemapStream({ hostname: 'https://littlepawsplace.com' });

const writeStream = createWriteStream('./public/sitemap.xml');

sitemap.pipe(writeStream);

[
  '/',
  '/view-pups',
  '/add-dog',
  '/profile',
  '/chat-with-bully',
  '/coming-soon'
].forEach(route => sitemap.write({ url: route }));

sitemap.end();

streamToPromise(sitemap).then(() => console.log('✅ Sitemap generated.'));
