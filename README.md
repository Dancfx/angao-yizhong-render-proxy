# 安国一中表白墙 Render 反向代理

这个项目用于把请求转发到固定的 Cloudflare Worker：

`https://angao-yizhong-biaobaiqiang.0814-reboot.workers.dev`

支持：
- 普通 HTTP/HTTPS 请求
- WebSocket `/api/chat`
- Render 自定义域名

## Render 设置

- Environment: Node
- Build Command: `npm install`
- Start Command: `npm start`
- Instance Type: Free

Render 会自动提供 `PORT`，程序监听 `0.0.0.0`。

## 可选环境变量

`TARGET_ORIGIN`

默认已经设置为你的 Worker 地址。如果以后 Worker 地址改变，可以在 Render 的 Environment Variables 中修改。

## 注意

这个程序只代理固定的上游地址，不接受用户通过 URL 指定任意目标，因此不是开放代理。
