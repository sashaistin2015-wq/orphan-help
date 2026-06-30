const { createProxyMiddleware } = require('http-proxy-middleware');

const SUPABASE_URL = 'https://plejzaehtlcesxszugcx.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZWp6YWVodGxjZXN4c3p1Z2N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MDkxNzcsImV4cCI6MjA5ODI4NTE3N30.xWlI0egd7wLjyCcv30_Gr95hVv4jShdrIAxo_IaKrNM';

const proxy = createProxyMiddleware({
  target: SUPABASE_URL,
  changeOrigin: true,
  pathRewrite: (path) => path.replace(/^\/supabase/, ''),
  on: {
    proxyReq: (proxyReq, req) => {
      // Всегда добавляем анонимный ключ
      proxyReq.setHeader('apikey', ANON_KEY);
      
      // Если клиент прислал свой токен – используем его, иначе подставляем дефолтный
      if (req.headers.authorization) {
        proxyReq.setHeader('Authorization', req.headers.authorization);
      } else {
        proxyReq.setHeader('Authorization', `Bearer ${ANON_KEY}`);
      }
      
      // Устанавливаем Content-Type, если его нет
      if (!proxyReq.getHeader('Content-Type')) {
        proxyReq.setHeader('Content-Type', 'application/json');
      }
    }
  }
});

module.exports = (req, res) => proxy(req, res);
