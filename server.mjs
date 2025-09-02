import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME = new Map(Object.entries({
  html: 'text/html; charset=utf-8',
  css: 'text/css; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
  json: 'application/json; charset=utf-8',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  ico: 'image/x-icon',
}));

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === '/') pathname = '/index.html';
  if (pathname === '/health' && req.method === 'GET') {
    return send(res, 200, JSON.stringify({ status: 'ok' }), { 'Content-Type': MIME.get('json') });
  }

  const filePath = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (!filePath.startsWith(PUBLIC_DIR)) return send(res, 403, 'Forbidden', { 'Content-Type': 'text/plain; charset=utf-8' });

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return send(res, 404, 'Not Found', { 'Content-Type': 'text/plain; charset=utf-8' });
    const ext = path.extname(filePath).slice(1).toLowerCase();
    const type = MIME.get(ext) || 'application/octet-stream';
    const stream = fs.createReadStream(filePath);
    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': ext === 'html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    });
    stream.pipe(res);
  });
}

const server = http.createServer(serveStatic);
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

