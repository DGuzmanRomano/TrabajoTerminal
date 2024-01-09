const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // This is the path that will be proxied
    createProxyMiddleware({
      target: 'http://34.125.183.229:3001', // Your Node.js server address
      changeOrigin: true,
    })
  );
};
