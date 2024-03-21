const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/login', // Change this path to match your Django login URL
    createProxyMiddleware({
      target: 'http://localhost:8000/', // Change this to match your Django backend URL
      changeOrigin: true,
    })
  );
};
