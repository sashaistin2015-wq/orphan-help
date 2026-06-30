const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  target: process.env.SUPABASE_URL,
  changeOrigin: true
});

// Добавляем ключ ко всем запросам
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('apikey', process.env.SUPABASE_KEY);
  proxyReq.setHeader('Authorization', `Bearer ${process.env.SUPABASE_KEY}`);
  // Убираем лишние заголовки, которые могут мешать
  proxyReq.removeHeader('host');
});

const server = http.createServer((req, res) => {
  // Удаляем префикс, если он есть (на всякий случай)
  proxy.web(req, res);
});

server.listen(process.env.PORT || 3000);
