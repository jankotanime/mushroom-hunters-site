const fs = require('fs');
const https = require('https');
const { createServer } = require('http');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./cerds/server.key'),
  cert: fs.readFileSync('./cerds/server.crt'),
};

app.prepare().then(() => {
  https.createServer(httpsOptions, (req, res) => {
    handle(req, res);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:3000');
  });
});

// ! dla działających zdjęć: export NODE_TLS_REJECT_UNAUTHORIZED=0