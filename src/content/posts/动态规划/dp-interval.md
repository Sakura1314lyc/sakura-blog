---
title: 区间 DP 从入门到进阶
published: 2026-06-10
description: "全面掌握区间 DP：从石子合并到最优三角剖分，覆盖经典模型、优化技巧（四边形不等式）与题型分类"
image: ""
tags: [动态规划, DP, 区间DP, 算法, 竞赛编程]
category: 动态规划
draft: false
lang: zh
comment: true
---

## 什么是区间 DP？

**区间 DP** 是在**区间**上做动态规划。其核心特征可以概括为：

- **状态是区间**：$dp[l][r]$ 表示区间 $[l, r]$ 上的最优解
- **转移是合并**：大区间由两个（或多个）小区间合并而来
- **枚举分割点**：在 $l$ 和 $r$ 之间枚举分界点 $k$，将 $[l, r]$ 拆分为 $[l, k]$ 和 $[k+1, r]$

### 通用框架

```cpp
// 区间 DP 通用骨架
for (int len = 2; len <= n; len++)             // ① 枚举区间长度
    for (int l = 1; l + len - 1 <= n; l++) {   // ② 枚举左端点
        int r = l + len - 1;                   //    计算右端点
        for (int k = l; k < r; k++)            // ③ 枚举分割点
            dp[l][r] = opt(dp[l][r],            //    合并两个子区间
                           dp[l][k] + dp[k + 1][r] + cost(l, r));
    }
```

**时间复杂度**：$O(n^3)$（三重循环），空间 $O(n^2)$。

:::tip[为什么按长度枚举？]
区间 DP 要求**计算大区间时，所有子区间已求解**。按长度从小到大枚举，自然满足这个顺序。这是区间 DP 与线性 DP 最大的实现差异。
:::

---

## 一、石子合并 ——区间 DP 的「Hello World」

### 问题描述

$n$ 堆石子排成一排，第 $i$ 堆有 $a_i$ 个。每次合并**相邻两堆**，代价为两堆石子数之和。求将所有石子合并成一堆的**最小代价**。

### 状态与转移

- $dp[l][r]$：合并区间 $[l, r]$ 内所有石子所需的最小代价
- 枚举最后一次合并的位置 $k$：

$$
dp[l][r] = \min_{l \le k < r} \big( dp[l][k] + dp[k+1][r] \big) + \sum_{i=l}^{r} a_i
$$

其中 $\sum_{i=l}^{r} a_i$ 可以用**前缀和** $O(1)$ 计算。

### 代码实现

```cpp
// 石子合并（线性版本）
int solve(vector<int>& a) {
    int n = a.size();
    vector<int> pre(n + 1, 0);                 // 前缀和
    for (int i = 1; i <= n; i++)
        pre[i] = pre[i - 1] + a[i - 1];

    auto sum = [&](int l, int r) { return pre[r] - pre[l - 1]; };

    vector<vector<int>> dp(n + 2, vector<int>(n + 2, INT_MAX));
    for (int i = 1; i <= n; i++)
        dp[i][i] = 0;                          // 单堆不需要合并

    for (int len = 2; len <= n; len++)
        for (int l = 1; l + len - 1 <= n; l++) {
            int r = l + len - 1;
            for (int k = l; k < r; k++)
                dp[l][r] = min(dp[l][r],
                               dp[l][k] + dp[k + 1][r] + sum(l, r));
        }
    return dp[1][n];
}
```

### 环形石子合并

如果石子排成**环**，经典技巧：**破环成链**。将数组复制一份接在后面（长度变为 $2n$），然后分别求每个长度为 $n$ 的区间的答案，取最值。

```cpp
// 环形：复制数组
vector<int> a2(2 * n);
for (int i = 0; i < n; i++) {
    a2[i] = a2[i + n] = a[i];
}
// 对 a2 做区间 DP，答案 = min(dp[1][n], dp[2][n+1], ..., dp[n][2n-1])
int ans = INT_MAX;
for (int i = 1; i <= n; i++)
    ans = min(ans, dp[i][i + n - 1]);
```

### 实战例题

[洛谷 P1775 石子合并（弱化版）](https://www.luogu.com.cn/problem/P1775)：$n \le 300$，标准 $O(n^3)$。
[洛谷 P1880 石子合并](https://www.luogu.com.cn/problem/P1880)：$n \le 100$，环形版本。

---

## 二、矩阵连乘问题

### 问题描述

给定 $n$ 个矩阵 $A_1 \times A_2 \times \cdots \times A_n$，第 $i$ 个矩阵的维度为 $p_{i-1} \times p_i$。通过加括号改变乘法顺序，求**最少的标量乘法次数**。

### 状态转移

$$
dp[l][r] = \min_{l \le k < r} \big( dp[l][k] + dp[k+1][r] + p_{l-1} \cdot p_k \cdot p_r \big)
$$

其中 $p_{l-1} \cdot p_k \cdot p_r$ 是合并两个子区间的矩阵乘法代价。

```cpp
for (int len = 2; len <= n; len++)
    for (int l = 1; l + len - 1 <= n; l++) {
        int r = l + len - 1;
        dp[l][r] = INT_MAX;
        for (int k = l; k < r; k++)
            dp[l][r] = min(dp[l][r],
                           dp[l][k] + dp[k + 1][r] + p[l - 1] * p[k] * p[r]);
    }
```

---

## 三、最优三角剖分

### 问题描述

凸 $n$ 边形的每个顶点有权值，将多边形用互不相交的对角线剖分为 $n-2$ 个三角形，最小化所有三角形顶点权值乘积之和。

### 状态转移

将多边形顶点编号为 $1$ 到 $n$，$dp[l][r]$ 表示将多边形顶点 $l$ 到 $r$ 之间的部分（以边 $lr$ 为底边）剖分的最小代价：

$$
dp[l][r] = \min_{l < k < r} \bigg( dp[l][k] + dp[k][r] + w_l \cdot w_k \cdot w_r \bigg)
$$

```cpp
for (int len = 2; len <= n; len++)
    for (int l = 1; l + len - 1 <= n; l++) {
        int r = l + len - 1;
        dp[l][r] = INT_MAX;
        for (int k = l + 1; k < r; k++)
            dp[l][r] = min(dp[l][r],
                           dp[l][k] + dp[k][r] + w[l] * w[k] * w[r]);
    }
```

注意与石子合并的区别：分割点 $k$ 的区间是 $(l, r)$（开区间），且 $k$ 同时属于两边。

### 实战例题

[LC 1039. Minimum Score Triangulation of Polygon](https://leetcode.com/problems/minimum-score-triangulation-of-polygon/)。

---

## 四、回文相关问题

### 最长回文子序列

$dp[l][r]$：区间 $[l, r]$ 内最长回文子序列的长度。

$$
dp[l][r] = \begin{cases}
dp[l+1][r-1] + 2 & \text{if } s[l] = s[r] \\
\max(dp[l+1][r], dp[l][r-1]) & \text{if } s[l] \neq s[r]
\end{cases}
$$

```cpp
for (int i = 1; i <= n; i++) dp[i][i] = 1;       // 单字符回文长度为 1
for (int len = 2; len <= n; len++)
    for (int l = 1; l + len - 1 <= n; l++) {
        int r = l + len - 1;
        if (s[l] == s[r])
            dp[l][r] = dp[l + 1][r - 1] + 2;
        else
            dp[l][r] = max(dp[l + 1][r], dp[l][r - 1]);
    }
```

### 最少插入次数构造回文

$dp[l][r]$：使区间 $[l, r]$ 变成回文串**最少需要插入的字符数**。

$$
dp[l][r] = \begin{cases}
dp[l+1][r-1] & \text{if } s[l] = s[r] \\
\min(dp[l+1][r], dp[l][r-1]) + 1 & \text{if } s[l] \neq s[r]
\end{cases}
$$

### 戳气球

$dp[l][r]$：戳破区间 $(l, r)$ 内所有气球（不含 $l$ 和 $r$）能获得的最大硬币数。

$$
dp[l][r] = \max_{l < k < r} \big( dp[l][k] + dp[k][r] + nums[l] \cdot nums[k] \cdot nums[r] \big)
$$

这是区间 DP 的经典「开区间」模型——$l$ 和 $r$ 是边界，不被戳破。

```cpp
// LC 312. Burst Balloons
int maxCoins(vector<int>& nums) {
    int n = nums.size();
    vector<int> val(n + 2, 1);                 // 两端补齐虚拟气球
    for (int i = 0; i < n; i++) val[i + 1] = nums[i];
    vector<vector<int>> dp(n + 2, vector<int>(n + 2, 0));
    for (int len = 3; len <= n + 2; len++)     // len 从 3 开始(至少包含一个气球)
        for (int l = 0; l + len - 1 <= n + 1; l++) {
            int r = l + len - 1;
            for (int k = l + 1; k < r; k++)    // k 是最后一个被戳破的
                dp[l][r] = max(dp[l][r],
                               dp[l][k] + dp[k][r] + val[l] * val[k] * val[r]);
        }
    return dp[0][n + 1];
}
```

---

## 五、括号序列

### 最长合法括号子序列

$dp[l][r]$：区间 $[l, r]$ 内最长合法括号子序列的长度。

```cpp
if ((s[l] == '(' && s[r] == ')') || (s[l] == '[' && s[r] == ']'))
    dp[l][r] = dp[l + 1][r - 1] + 2;
for (int k = l; k < r; k++)
    dp[l][r] = max(dp[l][r], dp[l][k] + dp[k + 1][r]);
```

### 最少添加括号

[洛谷 P2308 添加括号](https://www.luogu.com.cn/problem/P2308)：结合了矩阵连乘的结构，同时还要求输出方案。

---

## 六、四边形不等式优化

当区间 DP 的代价函数 $cost(l, r)$ 满足**四边形不等式**时，可以将复杂度从 $O(n^3)$ 优化到 $O(n^2)$。

### 四边形不等式

对于任意 $a \le b \le c \le d$：

$$
cost(a, c) + cost(b, d) \le cost(a, d) + cost(b, c)
$$

直观理解：「交叉」和 $\le$「包含」和。

### 决策单调性

若 $cost$ 满足四边形不等式，则最优分割点 $k_{opt}[l][r]$ 满足：

$$
k_{opt}[l][r-1] \le k_{opt}[l][r] \le k_{opt}[l+1][r]
$$

这意味着我们不需要枚举所有 $k$，只需在 $[k_{opt}[l][r-1], k_{opt}[l+1][r]]$ 这个小区间内搜索。

### 优化后代码

```cpp
// 用 opt[l][r] 记录最优分割点
vector<vector<int>> opt(n + 2, vector<int>(n + 2));

for (int i = 1; i <= n; i++) {
    dp[i][i] = 0;
    opt[i][i] = i;                             // 初始化
}

for (int len = 2; len <= n; len++)
    for (int l = 1; l + len - 1 <= n; l++) {
        int r = l + len - 1;
        int kl = opt[l][r - 1];                // 搜索下界
        int kr = opt[l + 1][r];                // 搜索上界
        dp[l][r] = INT_MAX;
        for (int k = kl; k <= kr; k++) {
            int val = dp[l][k] + dp[k + 1][r] + sum(l, r);
            if (val < dp[l][r]) {
                dp[l][r] = val;
                opt[l][r] = k;
            }
        }
    }
```

### 常见适用场景

石子合并问题的 $cost(l, r) = \sum_{i=l}^{r} a_i$ 满足四边形不等式（事实上 $cost =$ 前缀和时恒满足）。

:::note[优化条件]
并非所有区间 DP 都能用四边形不等式优化。需要满足：
1. $cost$ 满足四边形不等式
2. $cost$ 满足**区间包含单调性**（区间越大，代价越大）
:::

---

## 七、区间 DP 的两种转移模型

区间 DP 普遍可以归为两类：

### 模型一：分裂型（divide and merge）

大区间由两个小区间**分裂合并**而来。枚举分割点 $k$：

$$
dp[l][r] = \mathop{\text{opt}}_{l \le k < r} \big( dp[l][k] + dp[k+1][r] + \text{cost} \big)
$$

**代表题目**：石子合并、矩阵连乘、最优三角剖分（$k$ 同时属于两边）。

### 模型二：扩边型（expand from edges）

大区间由小区间向**两边各扩展一个元素**（或一边）得来：

$$
dp[l][r] = \mathop{\text{opt}}\begin{cases}
dp[l+1][r] + \text{cost from }l\\
dp[l][r-1] + \text{cost from }r\\
dp[l+1][r-1] + \text{cost from both}
\end{cases}
$$

**代表题目**：最长回文子序列、括号序列。

这种模型的循环方式也可以用区间长度，但转移中**不需要枚举 $k$**，时间复杂度 $O(n^2)$。

:::tip[如何判断用哪种模型？]
- 问题问「合并」「拆分」→ 分裂型，枚举 $k$
- 问题问「添加」「删除」「匹配两端字符」→ 扩边型，$O(n^2)$
- 戳气球表面是分裂型，但 $k$ 是**最后**被戳破的→特殊变体
:::

---

## 题型分类速查

| 题型 | 代表题目 | 转移要点 | 复杂度 |
|------|---------|---------|--------|
| 石子合并 | 洛谷 P1775 / P1880 | $dp[l][k] + dp[k+1][r] + \text{sum}(l,r)$ | $O(n^3)$ 或 $O(n^2)$ |
| 矩阵连乘 | UVA 348 | $p_{l-1} \cdot p_k \cdot p_r$ | $O(n^3)$ |
| 最优三角剖分 | LC 1039 | $k$ 同时属于两边，$w_l w_k w_r$ | $O(n^3)$ |
| 回文相关问题 | LC 516 / LC 1312 | 扩边型，无需枚举 $k$ | $O(n^2)$ |
| 戳气球 | LC 312 | 开区间模型，最后戳破 $k$ | $O(n^3)$ |
| 括号序列 | 洛谷 P2308 | 扩边 + 分裂混合 | $O(n^3)$ |
| 消除游戏 | LC 546 | 区间 DP + 额外维度（右边连续同色个数） | $O(n^4)$ ~ $O(n^3)$ |

---

## 练习题目推荐

| 题目 | 难度 | 题型 | 推荐原因 |
|------|------|------|---------|
| [洛谷 P1775 石子合并（弱化版）](https://www.luogu.com.cn/problem/P1775) | 入门 | 分裂型 | 区间 DP 第一题 |
| [洛谷 P1880 石子合并](https://www.luogu.com.cn/problem/P1880) | 入门 | 环形 + 分裂型 | 破环成链 |
| [LC 516. Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/) | 中等 | 扩边型 | 回文 DP 经典 |
| [LC 312. Burst Balloons](https://leetcode.com/problems/burst-balloons/) | 困难 | 开区间分裂 | 区间 DP 思维体操 |
| [LC 1039. Minimum Score Triangulation](https://leetcode.com/problems/minimum-score-triangulation-of-polygon/) | 中等 | 分裂型 | 最优三角剖分 |
| [洛谷 P2308 添加括号](https://www.luogu.com.cn/problem/P2308) | 中等 | 分裂型 + 输出方案 | 中缀表达式 |
| [洛谷 P4767 邮局](https://www.luogu.com.cn/problem/P4767) | 困难 | 分裂型 + 四边形不等式 | 决策单调性进阶 |
| [LC 546. Remove Boxes](https://leetcode.com/problems/remove-boxes/) | 困难 | 多维区间 DP | 思维难度极高 |

---

## 总结

1. 区间 DP 的**灵魂**是「区间长度从小到大」的枚举顺序，保证子问题先被求解
2. 核心是识别**分裂型还是扩边型**——这决定了是否需要枚举分割点 $k$
3. 环形问题用**破环成链**（数组复制一倍），是最常用的区间 DP 技巧
4. **四边形不等式优化**能将部分分裂型区间 DP 从 $O(n^3)$ 降到 $O(n^2)$
5. **画出区间图**：想象一个长度为 $n$ 的线段，$dp[l][r]$ 在线段上的位置感能大幅减少下标错误
