---
title: 树形 DP 从入门到精通
published: 2026-06-11
description: "系统掌握树形 DP 的四大模型：树上选点、树上背包、换根 DP 与基环树 DP，含经典例题与完整模板代码"
image: ""
tags: [动态规划, DP, 树形DP, 算法, 竞赛编程]
category: 动态规划
draft: false
lang: zh
comment: true
---

## 什么是树形 DP？

**树形 DP** 是在**树结构**上进行的动态规划。它的核心特征可以用一句话概括：

> 在树上做 DFS，从叶子出发向根合并（或从根出发向叶子传递），用子树的最优解推导当前节点的最优解。

树天然具有**递归结构**——每个子树都是一棵更小的树。这恰好契合 DP 的**最优子结构**性质。

---

## 前置知识：树的存储与遍历

```cpp
const int N = 100010;
vector<int> G[N];          // 邻接表存树
int parent[N];             // 父节点（防止走回头路）

// 从根出发的 DFS（最常用的树形 DP 框架）
void dfs(int u, int fa) {
    for (int v : G[u]) {
        if (v == fa) continue;  // 不走父节点
        dfs(v, u);               // 先处理子树
        // 合并子节点 v 的结果到 u
    }
}
```

:::tip[树的根是谁？]
无根树：任选一个节点作为根（通常选 $1$）。有根树：题目给定根节点。两种写法一致——DFS 时带着 `fa` 参数避免走回头路即可。
:::

---

## 模型一：树上选点问题

### 1.1 最大独立集（没有上司的舞会）

$n$ 个节点，每个节点有权值 $w_u$。选出若干节点，使得**没有两个相邻节点同时被选**，最大化权值和。

**状态定义**：
- $dp[u][0]$：不选 $u$ 时，$u$ 的子树中的最大权值和
- $dp[u][1]$：选 $u$ 时，$u$ 的子树中的最大权值和

**状态转移**：

$$
\begin{aligned}
dp[u][0] &= \sum_{v \in \text{children}(u)} \max(dp[v][0], dp[v][1]) \\
dp[u][1] &= w_u + \sum_{v \in \text{children}(u)} dp[v][0]
\end{aligned}
$$

解释：
- 不选 $u$：每个子节点可选可不选，取 $\max$
- 选 $u$：所有子节点**都不能选**，只能取 $dp[v][0]$

```cpp
using ll = long long;
ll dp[N][2];
int w[N];

void dfs(int u, int fa) {
    dp[u][0] = 0;
    dp[u][1] = w[u];                 // 选 u，至少有权值 w[u]
    for (int v : G[u]) {
        if (v == fa) continue;
        dfs(v, u);
        dp[u][0] += max(dp[v][0], dp[v][1]);
        dp[u][1] += dp[v][0];
    }
}
// 答案：max(dp[root][0], dp[root][1])
```

### 1.2 最小点覆盖

选出最少的节点，使得每条边的两端至少有一个节点被选中。

**状态定义**：
- $dp[u][0]$：$u$ 未被覆盖时，子树的最小代价
- $dp[u][1]$：$u$ 被覆盖时，子树的最小代价

$$
\begin{aligned}
dp[u][0] &= \sum_{v} dp[v][1] \qquad &\text{(u 未选，则所有子节点必须选)} \\
dp[u][1] &= 1 + \sum_{v} \min(dp[v][0], dp[v][1]) \quad &\text{(u 选了，子节点随意)}
\end{aligned}
$$

```cpp
void dfs(int u, int fa) {
    dp[u][0] = 0;
    dp[u][1] = 1;
    for (int v : G[u]) {
        if (v == fa) continue;
        dfs(v, u);
        dp[u][0] += dp[v][1];
        dp[u][1] += min(dp[v][0], dp[v][1]);
    }
}
```

### 1.3 最小支配集

选出最少的节点，使得每个节点要么自己被选、要么有一个邻居被选（被「支配」）。

**三状态模型**：
- $dp[u][0]$：$u$ 被自己覆盖（$u$ 被选）
- $dp[u][1]$：$u$ 被子节点覆盖（$u$ 本身没选，但至少一个子节点选了）
- $dp[u][2]$：$u$ 被父节点覆盖（$u$ 没选，子节点可选可不选，依赖父节点来覆盖 $u$）

$$
\begin{aligned}
dp[u][0] &= 1 + \sum_{v} \min(dp[v][0], dp[v][1], dp[v][2]) \\
dp[u][1] &= \min_{v}\left( dp[v][0] + \sum_{w \neq v} \min(dp[w][0], dp[w][1]) \right) \\
dp[u][2] &= \sum_{v} \min(dp[v][0], dp[v][1])
\end{aligned}
$$

$dp[u][1]$ 需要枚举「是哪个子节点覆盖了 $u$」，直接做是 $O(n^2)$。但可以**前缀后缀最值**优化到 $O(n)$：预处理出全部子节点的 $\min$ 和，然后对每个子节点单独减去自己的贡献再加上 $dp[v][0]$。

```cpp
void dfs(int u, int fa) {
    dp[u][0] = 1;
    dp[u][1] = INT_MAX;
    dp[u][2] = 0;

    for (int v : G[u]) {
        if (v == fa) continue;
        dfs(v, u);
        dp[u][0] += min({dp[v][0], dp[v][1], dp[v][2]});
        dp[u][2] += min(dp[v][0], dp[v][1]);
    }

    // 计算 dp[u][1]：枚举子节点中至少一个选 dp[v][0]
    for (int v : G[u]) {
        if (v == fa) continue;
        int sum = dp[u][2] - min(dp[v][0], dp[v][1]) + dp[v][0];
        dp[u][1] = min(dp[u][1], sum);
    }
}
```

### 三种模型的对比

| 问题 | 状态数 | 核心约束 | 答案 |
|------|--------|---------|------|
| 最大独立集 | 2 | 相邻不能同时选 | $\max(dp[root][0], dp[root][1])$ |
| 最小点覆盖 | 2 | 每条边至少一端选 | $\min(dp[root][0], dp[root][1])$ |
| 最小支配集 | 3 | 每个点被自己/子/父覆盖 | $\min(dp[root][0], dp[root][1])$ |

注意支配集的答案**不包含** $dp[root][2]$，因为根节点没有父节点来覆盖它。

### 实战例题

[洛谷 P1352 没有上司的舞会](https://www.luogu.com.cn/problem/P1352)：最大独立集。

---

## 模型二：树上背包

在树上做背包问题。最典型的是**选课问题**：选 $u$ 必须先选父节点，求选恰好 $m$ 门课的最大收益。

### 状态定义

$dp[u][j]$：在以 $u$ 为根的子树中选恰好 $j$ 个节点（必须包含 $u$ 自身）的最大价值。

### 转移

枚举子节点 $v$，将 $v$ 子树的答案合并到 $u$：

```cpp
void dfs(int u, int fa) {
    dp[u][1] = w[u];               // 只选 u 自己
    sz[u] = 1;                      // 当前已合并的子树大小
    for (int v : G[u]) {
        if (v == fa) continue;
        dfs(v, u);
        for (int j = sz[u]; j >= 1; j--)          // 逆序枚举 u 已选节点数
            for (int k = 0; k <= sz[v] && j + k <= m; k++) // 枚举分配给 v 的节点数
                dp[u][j + k] = max(dp[u][j + k], dp[u][j] + dp[v][k]);
        sz[u] += sz[v];
    }
}
```

时间复杂度：朴素的 $O(nm^2)$ 双重循环，但根据子树大小的**均摊分析**，实际复杂度为 $O(nm)$——这是树上背包的重要性质。

:::tip[理解复杂度]
每个点对 $(u, v)$ 只会在它们的 LCA 处被合并一次，因此总共 $O(n^2)$ 次合并。上限 $m$ 时剪枝为 $O(nm)$。
:::

### 实战例题

[洛谷 P2014 选课](https://www.luogu.com.cn/problem/P2014)：$n \le 300, m \le 300$。
[洛谷 P1273 有线电视网](https://www.luogu.com.cn/problem/P1273)：分组背包 + 树上背包。

---

## 模型三：树的直径

### 树的直径定义

树中**最远两点的距离**（路径上的边权或边数）。

### 求法一：两次 DFS（仅适用于无负边权）

```cpp
// 第一次 DFS：找离任意一点最远的点 p
// 第二次 DFS：找离 p 最远的点 q
// 直径 = p 到 q 的距离
pair<int, int> dfs_farthest(int u, int fa, int dist) {
    auto best = make_pair(dist, u);
    for (auto [v, w] : G[u]) {
        if (v == fa) continue;
        best = max(best, dfs_farthest(v, u, dist + w));
    }
    return best;
}
// 用法：auto [_, p] = dfs_farthest(1, 0, 0);
//       auto [diam, _] = dfs_farthest(p, 0, 0);
```

### 求法二：树形 DP（适用于任意边权）

$dp[u]$：从 $u$ 出发向子树延伸的**最长路径**长度。

对每个节点 $u$，直径可以「拐弯」在 $u$ 处：

$$
\text{diameter} = \max_{u} \left( \text{max1\_child}[u] + \text{max2\_child}[u] \right)
$$

取所有节点的子节点最长链的前两大值之和的最大值。

```cpp
ll diam = 0;

ll dfs(int u, int fa) {
    ll mx1 = 0, mx2 = 0;  // 子节点中最长的两条链
    for (auto [v, w] : G[u]) {
        if (v == fa) continue;
        ll len = dfs(v, u) + w;
        if (len > mx1) mx2 = mx1, mx1 = len;
        else if (len > mx2) mx2 = len;
    }
    diam = max(diam, mx1 + mx2);
    return mx1;  // 返回向下的最长链
}
```

---

## 模型四：树上路径问题

$dp[u]$ 通常表示从 $u$ 出发向下的最优路径，答案在合并子节点时用「两条路径合并」的方式更新。

### 4.1 树的最大路径和

```cpp
ll ans = -INF;

ll dfs(int u, int fa) {
    ll mx = w[u];               // 至少包含 u 自己
    ans = max(ans, mx);
    for (int v : G[u]) {
        if (v == fa) continue;
        ll child = dfs(v, u);
        ans = max(ans, mx + child);   // 合并两条链
        mx = max(mx, child + w[u]);   // 更新最优单链
    }
    return mx;
}
```

### 4.2 树上点对（长度为 K 的路径数）

求树中路径长度恰好为 $K$ 的点对数量。

$dp[u][d]$：在 $u$ 的子树中，与 $u$ 距离为 $d$ 的节点个数。

```cpp
int dp[N][505];  // K <= 500

void dfs(int u, int fa) {
    dp[u][0] = 1;
    for (int v : G[u]) {
        if (v == fa) continue;
        dfs(v, u);
        // 统计经过 u 的路径（一端在已处理的子树，一端在 v 子树）
        for (int d1 = 0; d1 < K; d1++)
            if (dp[u][d1]) {
                int d2 = K - 1 - d1;
                if (d2 >= 0) ans += dp[u][d1] * dp[v][d2];
            }
        // 合并 v 子树的结果
        for (int d = 0; d < K; d++)
            dp[u][d + 1] += dp[v][d];
    }
}
```

这是**点分治**的前置知识——如果 $K$ 很大（$K \le 10^5$），就需要点分治降复杂度。

---

## 模型五：换根 DP（Rerooting / 二次扫描）

当问题需要**每个节点作为根的答案**时，做 $n$ 次 DFS 会超时（$O(n^2)$）。**换根 DP** 用两次 DFS 在 $O(n)$ 内求出所有根的结果。

### 核心思想

1. **第一次 DFS**（自底向上）：任选 $1$ 为根，求出每个节点在**子树内**的答案 $dp_1[u]$
2. **第二次 DFS**（自顶向下）：从根出发，将父节点的「子树外答案」传递给子节点，求出**全树**的答案 $dp_2[u]$

### 经典例题：树中每个节点到其他所有节点的距离之和

```cpp
// 第一次 DFS：求子树大小和子树内距离和
ll sz[N], sum[N];   // sz: 子树大小, sum: 子树内所有节点到 u 的距离和

void dfs1(int u, int fa) {
    sz[u] = 1;
    sum[u] = 0;
    for (int v : G[u]) {
        if (v == fa) continue;
        dfs1(v, u);
        sz[u] += sz[v];
        sum[u] += sum[v] + sz[v];   // 从 v 进入 u 都要多走一步
    }
}

// 第二次 DFS：换根
ll ans[N];

void dfs2(int u, int fa) {
    ans[u] = sum[u];
    for (int v : G[u]) {
        if (v == fa) continue;
        // 「拔起」根从 u 换到 v
        ll su = sum[u], sv = sum[v];
        ll szu = sz[u], szv = sz[v];

        // 把 v 从 u 的子树中分离
        sum[u] -= sum[v] + sz[v];
        sz[u] -= sz[v];
        // 把 u 变成 v 的子树
        sum[v] += sum[u] + sz[u];
        sz[v] += sz[u];

        dfs2(v, u);

        // 恢复现场（若需要继续使用原值）
        sum[u] = su; sum[v] = sv;
        sz[u] = szu; sz[v] = szv;
    }
}
```

### 换根 DP 的通用步骤

```
1. dfs1(root):  计算子树信息（向上汇聚）
2. dfs2(root):  将外部信息推给子节点（向下传播）
   ├── 暂存当前状态
   ├── 计算「从 u 的视角切掉子树 v」后的状态
   ├── 将该状态作为「v 的外部」传入 dfs2(v)
   └── 恢复原状态
```

### 实战例题

[洛谷 P3478 STA-Station](https://www.luogu.com.cn/problem/P3478)：换根求深度和最大。
[LC 834. Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree/)：同上。

---

## 模型六：基环树 DP

**基环树**（Pseudotree）：$n$ 个点、$n$ 条边的连通图。恰好含一个环，其余部分为树。

### 处理方法：断环成链

1. 在环上找一条边 $(u, v)$，把它断开
2. 以 $u$ 为根、强制**不选 $v$**，做一次树形 DP
3. 以 $u$ 为根、强制**选 $v$**，做一次树形 DP
4. 答案取两次的 $\max$

### 典型例题：基环树最大独立集

```cpp
// 先拓扑排序找环，再断环 DP
// 伪代码骨架：
int r1, r2;  // 环上一条边的两端
ll ans = 0;

// 第一种：强制不选 r2
dfs(r1, 0, r2);   // 传入 forbidden 参数
ans = max(ans, max(dp[r1][0], dp[r1][1]));

// 第二种：强制选 r2（等价于 r2 不在时 r1 可以不选但也可以选）
// 实际操作：不传递 forbidden，以 r1 为根正常 DP
// 实际常用：两次 DP，一次断 u→v，一次断 v→u，分别取答案合并
```

### 实战例题

[洛谷 P1453 城市环路](https://www.luogu.com.cn/problem/P1453)：基环树最大独立集。
[洛谷 P2607 骑士](https://www.luogu.com.cn/problem/P2607)：多棵基环树的森林最大独立集。

---

## 题型与模型速查

| 模型 | 核心特征 | 关键技巧 | 复杂度 |
|------|---------|---------|--------|
| 树上选点（独立集/覆盖/支配） | 2-3 状态互斥决策 | 分类讨论选/不选 | $O(n)$ |
| 树上背包 | 选 $u$ 必须先选父节点 | 合并子树时逆序枚举容量 | $O(nm)$ |
| 树的直径 | 最远两点距离 | 两次 DFS 或 DP 取最长两链 | $O(n)$ |
| 树上路径 | 点对计数/路径最值 | 合并子节点时用两条单链拼接 | $O(n)$ 或 $O(nK)$ |
| 换根 DP | 求每个节点为根的答案 | **两次 DFS**：先汇聚再传播 | $O(n)$ |
| 基环树 DP | $n$ 点 $n$ 边，含一个环 | **断环**成树，枚举环上第一边的状态 | $O(n)$ |

---

## 调试技巧

:::tip[树形 DP 调试方法]
1. **小样例手工验算**：画出 $n=5$ 的树，手动 DFS 一遍验证 DP 值
2. **打印子树信息**：每次 `dfs` 返回前 `printf("u=%d dp0=%d dp1=%d\n", u, dp[u][0], dp[u][1])`
3. **检查 fa 参数**：忘了 `if (v == fa) continue` 是树形 DP 最常见的错误——会导致无限递归
4. **初始化时机**：所有 $dp[u][*]$ 应该在枚举子节点**之前**赋初值，而非在整个函数开始时
5. **换根恢复现场**：`dfs2` 的递归返回后，状态必须恢复到调用前的样子，否则其他子节点的计算会出错
:::

---

## 练习题目推荐

| 题目 | 模型 | 难度 | 推荐原因 |
|------|------|------|---------|
| [洛谷 P1352 没有上司的舞会](https://www.luogu.com.cn/problem/P1352) | 最大独立集 | 入门 | 树形 DP 第一题 |
| [洛谷 P2014 选课](https://www.luogu.com.cn/problem/P2014) | 树上背包 | 中等 | 经典树上背包 |
| [洛谷 P3478 STA-Station](https://www.luogu.com.cn/problem/P3478) | 换根 DP | 中等 | 换根模板 |
| [LC 834. Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree/) | 换根 DP | 困难 | 换根拓展 |
| [洛谷 P1453 城市环路](https://www.luogu.com.cn/problem/P1453) | 基环树 | 中等 | 基环树入门 |
| [洛谷 P1273 有线电视网](https://www.luogu.com.cn/problem/P1273) | 树上背包 | 中等 | 分组+树上背包 |
| [洛谷 P2607 骑士](https://www.luogu.com.cn/problem/P2607) | 基环树森林 | 困难 | 综合应用 |
| [洛谷 P2279 消防局的设立](https://www.luogu.com.cn/problem/P2279) | 支配集 | 困难 | 贪心 + 树形 DP |

---

## 总结

1. 树形 DP 的根是 **DFS + 后序遍历**——先算子树，再合并到根
2. **状态数**取决于节点「被覆盖」的来源——自己/子节点/父节点，2 或 3 个状态
3. **树上背包**看起来 $O(n^3)$，实际均摊 $O(nm)$，逆序枚举是细节关键
4. **换根 DP** 的两次 DFS 模板是：「向上汇聚」+「向下传播信息并恢复现场」
5. 基环树先**拓扑找环**再**断环**——断开环上一条边，分两种情况各跑一次 DP
