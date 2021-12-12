const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app
  .use(function(req, res, next) {
    res.header('test', 'testing');
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })
  .use(
    createProxyMiddleware("/socket.io/", {
      changeOrigin: true,
      target: "http://localhost:3001/",
      ws: true,
    })
  );
};