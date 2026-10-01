const http = require('http');
const httpProxy = require('http-proxy');

const PORT = Number(process.env.PORT) || 10000;

// 你的 Cloudflare Worker 源站
const TARGET = 'https://angao-yizhong-biaobaiqiang.0814-reboot.workers.dev';

// 创建反向代理
const proxy = httpProxy.createProxyServer({
  target: TARGET,
  changeOrigin: true,
  secure: true,
  xfwd: true,
  ws: true,
  proxyTimeout: 30000,
  timeout: 30000
});

// 普通 HTTP 请求
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  proxy.web(req, res, {}, (err) => {
    console.error('HTTP proxy error:', err.message);

    if (!res.headersSent) {
      res.writeHead(502, {
        'Content-Type': 'text/plain; charset=utf-8'
      });
    }

    res.end('Bad Gateway');
  });
});

// WebSocket
server.on('upgrade', (req, socket, head) => {
  console.log(`WebSocket upgrade: ${req.url}`);

  proxy.ws(req, socket, head, {}, (err) => {
    console.error('WebSocket proxy error:', err.message);

    try {
      socket.destroy();
    } catch (_) {}
  });
});

// 代理错误
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err.message);

  if (res && !res.headersSent) {
    res.writeHead(502, {
      'Content-Type': 'text/plain; charset=utf-8'
    });

    res.end('Bad Gateway');
  }
});

// 启动
server.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log('Angao Yizhong Reverse Proxy');
  console.log('=================================');
  console.log(`Listening on: 0.0.0.0:${PORT}`);
  console.log(`Target: ${TARGET}`);
});