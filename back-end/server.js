const https = require('https');
const path = require('path');
const fs = require('fs');

const app = require('./app');

const port = 8765;

const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'Local.key')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'Local.crt'))
}, app);

sslServer.listen(port, () => {
    console.log(`secure server listening on port ${port}`);
});