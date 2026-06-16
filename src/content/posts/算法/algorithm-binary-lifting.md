---
title: 倍增法从原理到实战
published: 2026-06-18
description: "深入讲解倍增法的核心思想与两大经典应用：ST 表求解 RMQ 问题和树上倍增求 LCA，附完整代码模板"
image: ""
tags: [算法, 倍增法, RMQ, LCA, 竞赛编程]
category: 算法
draft: false
lang: zh
comment: true
---

## 什么是倍增法？

**倍增法**（Binary Lifting）是一种通过**预处理 $2^k$ 步的信息**来加速查询的算法思想。其核心是：

> 任何整数 $k$ 都可以拆成若干个 2 的幂之和。如果提前算好了「跳 $1, 2, 4, 8, \dots$ 步」的结果，那么任意步数的查询都可以通过**拼接若干个 2 的幂步**在 $O(\log n)$ 内完成。

### 一句话概括

预处理所有 $2^k$ 级别的答案，查询时拼凑出任意值。

### 通用框架

```
预处理: 对于 k = 1, 2, 3, …, log₂(n)
          f[i][k] = 由 f[i][k-1] 和 f[ i + 2^(k-1) ][k-1] 合并而来

查询:   将一个长度为 len 的区间拆成若干段 2 的幂
         或者在树上「跳若干步」
```

时间复杂度：预处理 $O(n\log n)$，单次查询 $O(\log n)$ 或 $O(1)$。

---

## 一、ST 表：区间最值查询（RMQ）

### 1.1 问题描述

给定一个长度为 $n$ 的数组 $a$，有 $q$ 次查询，每次询问区间 $[L, R]$ 内的最大值（或最小值）。要求查询 $O(1)$，预处理 $O(n\log n)$。

> 这是一个**静态**RMQ 问题——数组不会修改。如果有修改，需要用线段树。

### 1.2 ST 表的思想

**ST 表**（Sparse Table）是倍增法最经典的静态应用。

定义 $st[i][k]$ 表示**从下标 $i$ 开始，长度为 $2^k$ 的区间**内的最大值：

$$
st[i][k] = \max(\; a[i],\, a[i+1],\, \dots,\, a[i + 2^k - 1] \;)
$$

**预处理（递推）**：长度为 $2^k$ 的区间可以由两个长度为 $2^{k-1}$ 的区间拼成：

$$
st[i][k] = \max(\; st[i][k-1],\quad st[i + 2^{k-1}][k-1] \;)
$$

```
st[i][k] 覆盖: [i ................... i + 2^k - 1]
                = [i ..... i+2^(k-1)-1]  ∪  [i+2^(k-1) ..... i+2^k-1]
                  ←── st[i][k-1] ──→        ←── st[i+2^(k-1)][k-1] ──→
```

**查询**：对于任意 $[L, R]$，取 $k = \lfloor \log_2 (R-L+1) \rfloor$。这个区间可以由两段**重叠的**长度为 $2^k$ 的区间覆盖：

$$
ans = \max(\; st[L][k],\quad st[R - 2^k + 1][k] \;)
$$

两个区间的并集恰好覆盖 $[L, R]$。因为 $\max$ 满足**幂等性**（取两次 $\max$ 不影响结果），重叠不会造成问题。

```
查询 [L, R], 长度 len = R-L+1, k = ⌊log₂(len)⌋

     L ─────────────────────── R
        ├────── 2^k ──────┤          ← st[L][k]
                  ├────── 2^k ──────┤  ← st[R-2^k+1][k]
        └──────── 交集(重叠) ────────┘
```

:::tip[为什么重叠是允许的？]
$\max$ 和 $\min$ 都满足**幂等律**：$\max(x, x) = x$，同一个元素被重复计算不影响结果。但**区间和**不满足幂等律——重叠会导致重复累加，所以 ST 表不能做区间和查询。
:::

### 1.3 ST 表完整代码

```cpp
#include <iostream>
#include <cmath>
using namespace std;

const int N = 100010, K = 20;  // K = ⌈log₂(N)⌉
int st[N][K];                  // st[i][k]: 从 i 开始、长度 2^k 的区间最大值
int lg[N];                     // lg[i] = ⌊log₂(i)⌋, 预处理加速

int main() {
    int n, q;
    cin >> n >> q;

    // 读入 + 初始化 k=0
    for (int i = 1; i <= n; i++) {
        cin >> st[i][0];       // st[i][0] = a[i]
    }

    // 预处理 log 值
    lg[1] = 0;
    for (int i = 2; i <= n; i++)
        lg[i] = lg[i / 2] + 1;

    // 倍增预处理：k 从小到大
    for (int k = 1; k < K; k++)
        for (int i = 1; i + (1 << k) - 1 <= n; i++)
            st[i][k] = max(st[i][k - 1],
                           st[i + (1 << (k - 1))][k - 1]);

    // 查询
    while (q--) {
        int L, R;
        cin >> L >> R;
        int k = lg[R - L + 1];                 // k = ⌊log₂(len)⌋
        int ans = max(st[L][k], st[R - (1 << k) + 1][k]);
        cout << ans << '\n';
    }
    return 0;
}
```

### 1.4 ST 表改成区间最小值

只需将代码中所有 `max` 替换为 `min`：

```cpp
st[i][k] = min(st[i][k - 1], st[i + (1 << (k - 1))][k - 1]);
// 查询
int ans = min(st[L][k], st[R - (1 << k) + 1][k]);
```

### 1.5 ST 表复杂度和适用条件

| 维度 | 说明 |
|------|------|
| 预处理 | $O(n\log n)$ |
| 单次查询 | $O(1)$ |
| 空间 | $O(n\log n)$ |
| 适用运算 | $\max$, $\min$, $\gcd$, $\text{lcm}$ 等满足**幂等律**的运算 |
| 不适用 | 区间和（需用前缀和）等不满足幂等律的运算 |
| 是否支持修改 | ❌ 纯静态。有修改需用线段树（$O(n\log n)$ 预处理 + $O(\log n)$ 修改/查询） |

> 📝 **练习**：[洛谷 P3865 ST 表模板](https://www.luogu.com.cn/problem/P3865) | [洛谷 P2880 平衡阵容](https://www.luogu.com.cn/problem/P2880)（区间最大最小差值）

---

## 二、树上倍增求 LCA

### 2.1 什么是 LCA？

**最近公共祖先**（Lowest Common Ancestor）：在有根树中，两个节点 $u$ 和 $v$ 的深度最大的公共祖先节点。

```
        1(根)
       /  \
      2    3
     / \   / \
    4   5 6   7
           \
            8

LCA(4, 5) = 2
LCA(4, 8) = 1
LCA(6, 8) = 6
```

**暴力做法**：先将较深的节点向上跳到与另一个节点同深度，然后两个节点一起向上跳直到相遇。每次只跳一步 → $O(n)$ 单次查询，太慢。

**倍增优化**：预处理每个节点向上跳 $2^k$ 步到达的祖先，查询时按 $2$ 的幂次跳跃 → $O(\log n)$ 单次查询。

### 2.2 核心定义

- $fa[u][k]$：节点 $u$ 向上跳 $2^k$ 步到达的祖先节点
- $depth[u]$：节点 $u$ 在树中的深度（根节点深度为 0 或 1）

**递推公式**（倍增的精髓）：

$$
fa[u][k] = fa[\, fa[u][k-1] \,][k-1]
$$

「从 $u$ 向上跳 $2^k$ 步」=「从 $u$ 先向上跳 $2^{k-1}$ 步到达某个中间节点，再从那个中间节点向上跳 $2^{k-1}$ 步」。

```
   fa[u][k]           ← 从 u 跳 2^k 步到达的祖先
      ↑
      | 跳 2^(k-1) 步
      |
   fa[u][k-1]         ← 中间节点
      ↑
      | 跳 2^(k-1) 步
      |
      u
```

### 2.3 LCA 查询（三步走）

**Step 1**：将 $u$ 和 $v$ 中较深的节点向上跳，使两者**同深度**。

```cpp
if (depth[u] < depth[v]) swap(u, v);   // 保证 u 是较深的
int diff = depth[u] - depth[v];
for (int k = 0; k < K; k++)
    if (diff >> k & 1)                 // diff 二进制第 k 位为 1
        u = fa[u][k];                  // 跳 2^k 步
```

**Step 2**：若此时 $u = v$，则 $u$（或 $v$）就是 LCA。直接返回。

```cpp
if (u == v) return u;
```

**Step 3**：$u$ 和 $v$ 从高位到低位一起向上跳，**跳到 LCA 的正下方一层**。

```cpp
for (int k = K - 1; k >= 0; k--)
    if (fa[u][k] != fa[v][k]) {        // 不同则跳
        u = fa[u][k];
        v = fa[v][k];
    }
return fa[u][0];                       // 父节点即 LCA
```

:::tip[为什么要从高位到低位？]
这是倍增法的经典技巧。对于一个需要跳 $d$ 步的目标，我们从大到小枚举 $2^k$：如果跳 $2^k$ 步不会「跳过目标」，就跳；否则不跳。这保证最终恰好到达目标——类似用若干张 32、16、8、4、2、1 元的纸币凑出任意金额。
:::

**Step 3 的直觉解释**：我们想让 $u$ 和 $v$ 一起跳到「LCA 的正下方一层」——即再跳一步就相遇。从最高位开始尝试：如果 $u$ 和 $v$ 各自跳 $2^k$ 步后到达了**不同的**节点，说明 LCA 还在更上面，可以放心跳；如果到达了**相同的**节点，说明跳过头了（已经跳到了 LCA 或以上），不跳。

### 2.4 LCA 完整代码

```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

const int N = 500010, K = 20;  // K = ⌈log₂(N)⌉, N ≤ 5×10⁵
vector<int> g[N];
int fa[N][K], depth[N];

// DFS 预处理 fa 和 depth（也可用 BFS，避免递归栈溢出）
void dfs(int u, int parent) {
    fa[u][0] = parent;
    for (int v : g[u]) {
        if (v == parent) continue;
        depth[v] = depth[u] + 1;
        dfs(v, u);
    }
}

// BFS 预处理（推荐：无递归栈溢出风险）
void bfs(int root) {
    queue<int> q;
    q.push(root);
    depth[root] = 1;           // 根深度设为 1
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : g[u]) {
            if (depth[v]) continue;   // 已访问过（即父节点）
            depth[v] = depth[u] + 1;
            fa[v][0] = u;
            q.push(v);
        }
    }
}

int lca(int u, int v) {
    if (depth[u] < depth[v]) swap(u, v);

    // 1. 将 u 跳到与 v 同深度
    int diff = depth[u] - depth[v];
    for (int k = 0; k < K; k++)
        if (diff >> k & 1)
            u = fa[u][k];

    if (u == v) return u;

    // 2. 一起向上跳
    for (int k = K - 1; k >= 0; k--)
        if (fa[u][k] != fa[v][k]) {
            u = fa[u][k];
            v = fa[v][k];
        }

    return fa[u][0];
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, q, root;
    cin >> n >> q >> root;

    for (int i = 1; i < n; i++) {
        int u, v;
        cin >> u >> v;
        g[u].push_back(v);
        g[v].push_back(u);
    }

    bfs(root);  // 或 dfs(root, 0)

    // 倍增预处理 fa 数组
    for (int k = 1; k < K; k++)
        for (int i = 1; i <= n; i++)
            fa[i][k] = fa[fa[i][k - 1]][k - 1];

    while (q--) {
        int u, v;
        cin >> u >> v;
        cout << lca(u, v) << '\n';
    }
    return 0;
}
```

### 2.5 LCA 的两种 DFS 预处理方式对比

| 方式 | 优点 | 缺点 |
|------|------|------|
| **DFS** | 代码更短，递归直观 | $n \ge 5\times 10^5$ 时可能栈溢出 |
| **BFS** | 无栈溢出风险 | 代码略长 |

用 DFS 时需要手动开大栈空间（或直接写 BFS）。竞赛中一般 $n \le 5\times 10^5$ 用 BFS 更安全。

### 2.6 LCA 的应用

LCA 是树上问题的「万能钥匙」——很多树上查询都可以归约为求 LCA：

**（1）树上两点之间的距离**：

$$
\text{dist}(u, v) = \text{depth}[u] + \text{depth}[v] - 2 \times \text{depth}[\text{LCA}(u, v)]
$$

```cpp
int dist(int u, int v) {
    int p = lca(u, v);
    return depth[u] + depth[v] - 2 * depth[p];
}
```

**（2）树上路径是否经过某节点**：节点 $x$ 在 $u \to v$ 的简单路径上当且仅当 $x$ 是 $u$ 和 $v$ 的 LCA 的祖先且 $x$ 是 $u$ 或 $v$ 的祖先。$x$ 是 $y$ 的祖先等价于 $\text{LCA}(x, y) = x$。

**（3）树上差分**：将链 $u \to v$ 上每个节点加 $w$ → 树上差分转化为 $diff[u] += w,\; diff[v] += w,\; diff[lca] -= w,\; diff[fa[lca]] -= w$。

### 2.7 LCA 复杂度

| 维度 | 说明 |
|------|------|
| 预处理 | $O(n\log n)$ |
| 单次查询 | $O(\log n)$ |
| 空间 | $O(n\log n)$ |
| 与 Tarjan 离线 LCA 的比较 | Tarjan $O(n + q)$ 但离线（必须提前知道所有查询）；倍增 $O((n+q)\log n)$ 但在线 |

> 📝 **练习**：[洛谷 P3379 LCA 模板](https://www.luogu.com.cn/problem/P3379) | [洛谷 P3884 二叉树问题](https://www.luogu.com.cn/problem/P3884)（LCA + 距离）

---

## 三、倍增法的通用思想总结

倍增法不局限于 ST 表和 LCA。只要一个问题满足「跳 $2^k$ 步的信息可以由跳 $2^{k-1}$ 步的信息递推」，就可以用倍增。

### 3.1 倍增的通用模板

```
初始化: 计算 f[i][0] （跳 1 步 / 长度为 1 区间的答案）

递推: for k = 1 to maxK:
         for each i:
              f[i][k] = merge(f[i][k-1], f[ i + 2^(k-1) ][k-1])

查询: 将目标步数 / 区间长度分解为若干个 2^k 的幂次之和
        从高到低枚举 k，每次尝试跳 2^k 步
```

### 3.2 其他典型应用

| 问题 | 倍增对象 | 合并方式 |
|------|---------|---------|
| ST 表 | 区间 $[i, i+2^k-1]$ 的最值 | $\max$/$\min$/$\gcd$ |
| LCA | 向上跳 $2^k$ 步的祖先 | $fa[fa[i][k-1]][k-1]$ |
| 快速幂 | $a^{2^k} \bmod p$ | $(a^{2^{k-1}})^2 \bmod p$ |
| 矩阵快速幂 | $M^{2^k}$ | $M^{2^k} = M^{2^{k-1}} \times M^{2^{k-1}}$ |
| 后缀数组 | 长度为 $2^k$ 的子串排名 | 双关键字排序 |

### 3.3 何时使用倍增？

- 问题涉及**区间**或**跳跃**操作
- 查询频繁，需要比暴力更快的响应
- 数据**静态**（或有修改但不频繁）——修改频繁用线段树

### 3.4 练习推荐

| 题目 | 类型 | 链接 |
|------|------|------|
| 洛谷 P3865 | ST 表模板 | [luogu.com.cn/problem/P3865](https://www.luogu.com.cn/problem/P3865) |
| 洛谷 P2880 | RMQ（区间极差） | [luogu.com.cn/problem/P2880](https://www.luogu.com.cn/problem/P2880) |
| 洛谷 P3379 | LCA 模板 | [luogu.com.cn/problem/P3379](https://www.luogu.com.cn/problem/P3379) |
| 洛谷 P3884 | LCA + 树上距离 | [luogu.com.cn/problem/P3884](https://www.luogu.com.cn/problem/P3884) |
| Codeforces 1328D | 倍增 + 贪心 | [codeforces.com/problemset/problem/1328/D](https://codeforces.com/problemset/problem/1328/D) |

---

## 四、总结

1. 倍增的本质：**将任意步数拆成若干 2 的幂之和**，预处理所有 $2^k$ 级的信息
2. **ST 表**：区间最值 RMQ，预处理 $O(n\log n)$，查询 $O(1)$。关键是一个区间用两个**重叠的** $2^k$ 长区间覆盖——重叠不碍事因为 $\max$/$\min$ 满足幂等律
3. **树上倍增求 LCA**：$fa[u][k] = fa[fa[u][k-1]][k-1]$ 是递推公式；查询时先跳到同深度，再从高到低一起跳
4. 倍增法适用于**静态数据**的快速查询；数据有修改时改用线段树或树链剖分
