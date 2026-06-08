---
title: 计算机网络核心知识总结
published: 2026-06-08
description: "从 TCP/IP 到 HTTP/3：系统梳理计算机网络的核心概念，涵盖传输层、应用层协议和网络安全基础"
image: ""
tags: [计算机网络, 计算机基础, TCP/IP, HTTP]
category: 计算机学习
draft: false
lang: zh
comment: true
---

## 为什么学计算机网络？

无论你是后端开发、前端开发还是 SRE，网络知识都是「必修课」：

- **排查线上问题**（超时、502、连接被拒）
- **设计高性能服务**（连接池、长连接、CDN）
- **通过面试**（TCP 三次握手、HTTP 协议演进是必问题）

---

## OSI 七层与 TCP/IP 四层

```
OSI 七层              TCP/IP 四层          代表协议
══════════           ═══════════          ════════
应用层                应用层                HTTP, DNS, TLS
表示层                ☝                   ☝
会话层                ☝                   ☝
-------------------  ──────────────────
传输层                传输层                TCP, UDP
-------------------  ──────────────────
网络层                网络层                IP, ICMP
-------------------  ──────────────────
数据链路层            网络接口层             ARP, Ethernet
物理层                ☝                   ☝
```

面试和开发中最常打交道的是**传输层**和**应用层**。

---

## 传输层：TCP 与 UDP

### TCP（传输控制协议）

面向连接、可靠、基于字节流。所有要做「可靠传输」的场景（HTTP、数据库连接、SSH）都用 TCP。

#### 三次握手

```
Client                  Server
  | ----- SYN --------> |   ① 客户端：我要连接（SYN）
  | <-- SYN+ACK ------- |   ② 服务端：收到，我准备好了（SYN+ACK）
  | ----- ACK --------> |   ③ 客户端：好的（ACK）
  |                      |
  连接建立，开始传输数据
```

三次握手的关键原因：**防止旧的重复连接请求到达服务端**。如果只有两次握手，一个滞后的 SYN 包到达服务端，服务端会错误地认为建立了连接。

#### 四次挥手

```
Client                  Server
  | ----- FIN --------> |   ① 客户端：我没数据要发了
  | <----- ACK -------- |   ② 服务端：收到（但可能还有数据要发）
  | <----- FIN -------- |   ③ 服务端：我数据也发完了
  | ----- ACK --------> |   ④ 客户端：收到
  |                      |
  连接关闭
```

:::tip[TIME_WAIT 为什么要等 2MSL？]
挥手后客户端进入 `TIME_WAIT` 状态，等待 $2 \times MSL$（Maximum Segment Lifetime，通常 2 分钟）：

1. 确保最后的 ACK 能到达服务端（如果丢失，服务端会重传 FIN）
2. 让旧连接的所有报文在网络中消亡，避免影响新连接
   :::

#### 可靠传输机制

| 机制                    | 说明                                   |
| ----------------------- | -------------------------------------- |
| 序列号 + 确认应答 (ACK) | 每个字节有编号，接收方确认收到的序列号 |
| 超时重传 (RTO)          | 超过 RTO 未收到 ACK 则重传             |
| 滑动窗口                | 流量控制——接收方告知自己能接收多少字节 |
| 拥塞控制                | 慢启动、拥塞避免、快重传、快恢复       |

#### TCP 拥塞控制

```
发送窗口 = min(接收窗口, 拥塞窗口 cwnd)

慢启动：cwnd 从 1 开始，每收到一个 ACK，cwnd++
        ── 指数增长，直到达到慢启动阈值 ssthresh

拥塞避免：cwnd >= ssthresh 后，每个 RTT cwnd += 1
        ── 线性增长

快重传：收到 3 个重复 ACK → 立即重传丢失段
快恢复：快重传后将 cwnd 减半，直接从拥塞避免开始
```

### UDP（用户数据报协议）

无连接、不可靠、基于报文。适用于实时性要求高、允许少量丢包的场景。

**适用场景**：视频直播、语音通话、DNS 查询、游戏数据传输。

### TCP vs UDP

| 维度     | TCP                    | UDP                      |
| -------- | ---------------------- | ------------------------ |
| 连接     | 面向连接               | 无连接                   |
| 可靠性   | 可靠（确认+重传）      | 不可靠                   |
| 顺序     | 有序                   | 无序                     |
| 头部开销 | 20 字节                | 8 字节                   |
| 适用场景 | HTTP、数据库、文件传输 | DNS、直播、VPN、在线游戏 |

---

## 应用层协议

### HTTP 的演进

```
HTTP/1.0 (1996)
  └─ 每次请求新建 TCP 连接，效率低

HTTP/1.1 (1997)
  ├─ 持久连接（Connection: keep-alive）
  ├─ 管道化（有限支持）
  └─ 问题：队头阻塞（HOL Blocking）

HTTP/2 (2015)
  ├─ 二进制分帧
  ├─ 多路复用（在一个连接上并发多个请求）
  ├─ 头部压缩（HPACK）
  └─ 服务端推送

HTTP/3 (2022)
  ├─ 基于 QUIC（UDP）
  ├─ 0-RTT 握手
  └─ 彻底解决 TCP 队头阻塞
```

### HTTP 请求结构

```
POST /api/users HTTP/1.1          ← 请求行
Host: example.com                 ← 请求头
Content-Type: application/json
Authorization: Bearer xxx

{"name": "Alice"}                 ← 请求体（GET 请求通常为空）
```

### 常见状态码

| 状态码  | 含义                  | 示例                 |
| ------- | --------------------- | -------------------- |
| 200     | OK                    | 请求成功             |
| 301     | 永久重定向            | 旧域名 → 新域名      |
| 302     | 临时重定向            | 登录后跳转           |
| 304     | Not Modified          | 缓存有效             |
| 400     | Bad Request           | 请求参数错误         |
| 401     | Unauthorized          | 未认证               |
| 403     | Forbidden             | 无权限               |
| 404     | Not Found             | 资源不存在           |
| **500** | Internal Server Error | 服务端错误           |
| 502     | Bad Gateway           | 网关错误（上游挂了） |
| 504     | Gateway Timeout       | 网关超时（上游超时） |

:::tip[502 vs 504]
这是面试常问的「线上故障排查」问题：

- **502**：Nginx 收到了不正常的响应（后端进程挂了/崩溃）
- **504**：Nginx 等了太久没有收到响应（后端处理超时/死循环）
  :::

### HTTPS 与 TLS 握手

HTTPS = HTTP + TLS（Transport Layer Security）。

```
TLS 1.3 握手（1-RTT）：            TLS 1.2 握手（2-RTT）：
Client → Server: ClientHello      Client → Server: ClientHello
          + 密钥分享                         ← ServerHello + Certificate
Server → Client: ServerHello                  → ClientKeyExchange
          + Certificate             双方计算会话密钥
          + 加密的 Finished             ← Finished（加密验证）
Client → Server: 加密的 Finished          → Finished

  ≈ 1 RTT 即可加密通信              ≈ 2 RTT
```

---

## DNS：域名系统

DNS 将域名解析为 IP 地址，是互联网的「电话簿」。

### 解析过程

```
浏览器 → 系统 hosts → 本地 DNS 缓存
  → DNS 递归解析器
    → 根域名服务器     (*. → 找 .com 的 NS)
    → 顶级域名服务器   (example.com. → 找授权 NS)
    → 权威 DNS 服务器  (返回 example.com 的 A 记录)
```

### 常见记录类型

| 类型  | 作用        | 示例                             |
| ----- | ----------- | -------------------------------- |
| A     | 域名 → IPv4 | `example.com → 93.184.216.34`    |
| AAAA  | 域名 → IPv6 | `example.com → 2606:2800:...`    |
| CNAME | 域名别名    | `www.example.com → example.com`  |
| MX    | 邮件服务器  | `example.com → mail.example.com` |
| TXT   | 文本信息    | SPF、域名验证                    |

---

## CDN 与网络优化

### CDN 原理

**内容分发网络**通过在全球部署边缘节点，使用户从最近的节点获取内容。

```
用户在中国访问 example.com
  → DNS 智能解析返回最近的 CDN 节点 IP
  → 请求到达 CDN 边缘节点
    → 命中缓存：直接返回
    → 未命中：回源到源站，缓存后返回
```

### 网络优化清单

| 优化项                                 | 效果                    |
| -------------------------------------- | ----------------------- |
| DNS 预解析 `<link rel="dns-prefetch">` | 减少 DNS 延迟           |
| TCP 连接复用（HTTP/2、Keep-Alive）     | 减少握手开销            |
| CDN 静态资源                           | 降低延迟 + 减轻源站压力 |
| Gzip / Brotli 压缩                     | 减少传输数据量          |
| TLS 会话复用                           | 减少握手 RTT            |

---

## 推荐资源

- **书籍**：《计算机网络：自顶向下方法》（Kurose & Ross）
- **实践**：用 Wireshark 抓包分析 TCP 握手和 HTTP 请求
- **面试**：《图解 HTTP》《图解 TCP/IP》
- **工具**：`curl -v`, `tcpdump`, `dig`, `nslookup`

---

## 总结

1. TCP 的可靠性来自**确认重传 + 窗口控制 + 拥塞控制**三位一体
2. HTTP/2 核心是多路复用，HTTP/3 进一步用 QUIC 解决了队头阻塞
3. HTTPS = HTTP + TLS，TLS 1.3 比 1.2 少一个 RTT
4. DNS 查询是递归+迭代的混合过程，CDN 依赖 DNS 智能解析
5. 网络问题的排查思路：**检查连通性 → 检查 DNS → 检查端口监听 → 抓包分析**
