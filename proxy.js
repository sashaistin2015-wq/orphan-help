const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({ target: process.env.SUPABASE_URL, changeOrigin: true });
const server = http.createServer((req, res) => {
    req.headers['apikey'] = process.env.SUPABASE_KEY;
    req.headers['Authorization'] = `Bearer ${process.env.SUPABASE_KEY}`;
    proxy.web(req, res);
});
server.listen(process.env.PORT || 3000);