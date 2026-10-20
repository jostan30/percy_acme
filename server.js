// Tiny zero-dependency static server for pages/ and css/
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };

function start(port = 4000) {
  const server = http.createServer((req, res) => {
    let url = req.url.split('?')[0];
    if (url === '/') url = '/pages/index.html';
    const file = path.join(ROOT, url);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'text/plain' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

module.exports = { start };
if (require.main === module) start().then(() => console.log('http://localhost:4000'));
