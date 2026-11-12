/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Zero-dependency static server for Next.js static export (./out)
 * Works everywhere without requiring external global packages like serve.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '3000', 10);
const OUT_DIR = path.resolve(__dirname, '..', 'out');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json',
};

function resolvePath(reqUrl) {
  let cleanUrl = reqUrl.split('?')[0].split('#')[0];
  try {
    cleanUrl = decodeURIComponent(cleanUrl);
  } catch {}

  let fullPath = path.join(OUT_DIR, cleanUrl);

  // If path is a directory or points to root, look for index.html
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    const indexPath = path.join(fullPath, 'index.html');
    if (fs.existsSync(indexPath)) return indexPath;
  }

  // If file exists directly
  if (fs.existsSync(fullPath) && !fs.statSync(fullPath).isDirectory()) {
    return fullPath;
  }

  // Try appending .html
  if (fs.existsSync(fullPath + '.html')) {
    return fullPath + '.html';
  }

  // Try path/index.html
  const subIndex = path.join(fullPath, 'index.html');
  if (fs.existsSync(subIndex)) {
    return subIndex;
  }

  // 404 fallback
  const notFoundPath = path.join(OUT_DIR, '404.html');
  if (fs.existsSync(notFoundPath)) return notFoundPath;

  return null;
}

const server = http.createServer((req, res) => {
  const filePath = resolvePath(req.url);

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found - Build the site with "npm run build" first.');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  });

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

function startServer(portToTry) {
  server.listen(portToTry, () => {
    console.log(`\n▲ Weight-Space Programming Atlas local server running!`);
    console.log(`  > Local:   http://localhost:${portToTry}`);
    console.log(`  > Serving: ${OUT_DIR}\n`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`Port ${PORT} is in use, attempting port ${PORT + 1}...`);
    startServer(PORT + 1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

startServer(PORT);
