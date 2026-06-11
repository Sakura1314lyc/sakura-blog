---
title: 背包 DP 完全指南
published: 2026-06-10
description: "系统讲解背包问题的九种变体：0-1 背包、完全背包、多重背包、分组背包、混合背包、二维费用背包、依赖背包、方案数背包与求具体方案，附完整模板代码"
image: ""
tags: [动态规划, DP, 背包问题, 算法, 竞赛编程]
category: 动态规划
draft: false
lang: zh
comment: true
---

## 什么是背包问题？

有 $n$ 件物品和一个容量为 $W$ 的背包。第 $i$ 件物品有重量 $w_i$ 和价值 $v_i$。问**如何选择物品放入背包，使得总重量不超过 $W$ 且总价值最大**。

这个看似简单的问题模型，能推导出**九种经典变体**，覆盖了动态规划的许多核心思想。

---

## 一、0-1 背包

每个物品**要么选、要么不选**——这是背包问题的根基。

### 状态定义

$dp[i][j]$：考虑前 $i$ 件物品，背包容量为 $j$ 时能达到的最大价值。

### 状态转移

$$
dp[i][j] = \max(dp[i-1][j],\quad dp[i-1][j - w_i] + v_i)
$$

- 不选第 $i$ 件：继承前 $i-1$ 件的结果
- 选第 $i$ 件：从容量 $j - w_i$ 的状态转移过来，加上 $v_i$

### 二维 DP 代码

```cpp
// dp[i][j]: 前 i 件物品，容量 j 的最大价值
for (int i = 1; i <= n; i++) {
    for (int j = 0; j <= W; j++) {
        dp[i][j] = dp[i - 1][j];                    // 不选
        if (j >= w[i])
            dp[i][j] = max(dp[i][j], dp[i - 1][j - w[i]] + v[i]); // 选
    }
}
// 答案: dp[n][W]
```

### 滚动数组优化（一维 DP）

观察转移式，$dp[i][\cdot]$ 仅依赖 $dp[i-1][\cdot]$。我们**逆序**遍历容量即可省略第一维：

```cpp
for (int i = 1; i <= n; i++)
    for (int j = W; j >= w[i]; j--)       // 逆序！
        dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
// 答案: dp[W]
```

:::warning[为什么必须逆序？]
$dp[i][j]$ 依赖于 $dp[i-1][j-w_i]$——必须是上一轮的旧值。如果正序，$dp[j-w_i]$ 可能已经被本轮更新过，变成了「第 $i$ 件物品可以被反复选取」——那就变成了完全背包。
:::

### 实战例题

[洛谷 P1048 采药](https://www.luogu.com.cn/problem/P1048)：经典 0-1 背包，$n \le 100, W \le 1000$。

---

## 二、完全背包

每件物品**可以选无限次**。

### 状态转移

$$
dp[i][j] = \max(dp[i-1][j],\quad dp[i][j - w_i] + v_i)
$$

注意区别：第二项是 $dp[i][j-w_i]$（当前行），而非 $dp[i-1][j-w_i]$（上一行）。

### 一维优化：正序遍历

```cpp
for (int i = 1; i <= n; i++)
    for (int j = w[i]; j <= W; j++)       // 正序！
        dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
```

正序遍历意味着同一个物品可以被**重复放入**：$dp[j-w_i]$ 已经包含了可能放入过第 $i$ 件物品的状态。

### 实战例题

[洛谷 P1616 疯狂的采药](https://www.luogu.com.cn/problem/P1616)：完全背包裸题。

---

## 三、多重背包

第 $i$ 件物品有 $c_i$ 件，即**有限次选取**（$0 \le k \le c_i$）。

### 朴素转移

$$
dp[j] = \max_{0 \le k \le \min(c_i, \lfloor j/w_i \rfloor)} \big(dp[j - k \cdot w_i] + k \cdot v_i\big)
$$

```cpp
for (int i = 1; i <= n; i++)
    for (int j = W; j >= w[i]; j--)
        for (int k = 1; k <= c[i] && k * w[i] <= j; k++)
            dp[j] = max(dp[j], dp[j - k * w[i]] + k * v[i]);
```

时间复杂度 $O(W \sum c_i)$，当 $c_i$ 很大时不可接受。

### 二进制拆分优化

将 $c_i$ 拆分为 $1, 2, 4, \dots, 2^{m-1}, c_i - (2^m - 1)$ 共 $\lceil\log_2(c_i+1)\rceil$ 组，每组的重量和价值等比例放大。这样就转化为 $O(\sum \log c_i)$ 件物品的**0-1 背包**。

```cpp
struct Item { int w, v; };
vector<Item> items;

for (int i = 1; i <= n; i++) {
    int cnt = c[i];
    for (int k = 1; k <= cnt; k <<= 1) {
        items.push_back({w[i] * k, v[i] * k});
        cnt -= k;
    }
    if (cnt > 0)
        items.push_back({w[i] * cnt, v[i] * cnt});
}

// 对 items 做标准 0-1 背包
for (auto& it : items)
    for (int j = W; j >= it.w; j--)
        dp[j] = max(dp[j], dp[j - it.w] + it.v);
```

时间复杂度 $O(W \sum \log c_i)$。

### 单调队列优化

更进一步，多重背包可以优化到 $O(nW)$。使用**模 $w_i$ 的余数**分组，每组内用单调队列维护滑动窗口最大值。代码较长但思想深刻。

```cpp
for (int i = 1; i <= n; i++) {
    for (int r = 0; r < w[i]; r++) {          // 按余数分组
        deque<pair<int, int>> dq;              // {value, index}
        for (int k = 0; k * w[i] + r <= W; k++) {
            int j = k * w[i] + r;
            int val = dp[j] - k * v[i];        // 偏移量"拉平"
            while (!dq.empty() && dq.back().first <= val)
                dq.pop_back();
            dq.push_back({val, k});
            while (!dq.empty() && k - dq.front().second > c[i])
                dq.pop_front();                // 超出数量限制
            dp[j] = max(dp[j], dq.front().first + k * v[i]);
        }
    }
}
```

### 实战例题

[洛谷 P1776 宝物筛选](https://www.luogu.com.cn/problem/P1776)：多重背包模板，推荐用二进制拆分。

---

## 四、分组背包

物品划分为 $g$ 组，**每组最多选一件**。

### 转移思路

```cpp
for (int g = 1; g <= G; g++)                 // 枚举组
    for (int j = W; j >= 0; j--)             // 容量逆序
        for (auto& it : group[g])            // 枚举组内物品
            if (j >= it.w)
                dp[j] = max(dp[j], dp[j - it.w] + it.v);
```

**关键**：容量循环和物品循环的嵌套顺序不能交换！容量在外（逆序）、物品在内，保证「每组最多选一个」。

### 实战例题

[洛谷 P1757 通天之分组背包](https://www.luogu.com.cn/problem/P1757)。

---

## 五、二维费用背包

每件物品除了重量 $w_i$ 外，还消耗另一种资源 $m_i$（如体积），背包有两个容量上限 $W$ 和 $M$。

```cpp
for (int i = 1; i <= n; i++)
    for (int j = W; j >= w[i]; j--)         // 容量一逆序
        for (int k = M; k >= m[i]; k--)     // 容量二逆序
            dp[j][k] = max(dp[j][k], dp[j - w[i]][k - m[i]] + v[i]);
```

---

## 六、混合背包

题目中同时出现 0-1、完全和多重背包物品。

```cpp
for (int i = 1; i <= n; i++) {
    if (type[i] == "01") {
        for (int j = W; j >= w[i]; j--)
            dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
    }
    else if (type[i] == "complete") {
        for (int j = w[i]; j <= W; j++)
            dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
    }
    else { // multiple, 先用二进制拆分再按 0-1 处理
        // ...
    }
}
```

核心：对每种物品按各自类型独立转移，共用一个 `dp` 数组。

### 实战例题

[洛谷 P1833 樱花](https://www.luogu.com.cn/problem/P1833)。

---

## 七、依赖背包

物品之间存在依赖关系——选 B 必须先选 A。常见形式是**树形依赖**（如选课先修）。

将依赖关系建树，对每个子树做背包后合并。

```cpp
// dfs 返回以 u 为根的子树在不同容量下的最大价值
vector<int> dfs(int u) {
    vector<int> dp_u( W + 1, 0);
    // 必须选 u 本身（初始化先计入 u 的重量和价值）
    for (int j = w[u]; j <= W; j++)
        dp_u[j] = v[u];
    // 合并每个子节点的背包
    for (int v : children[u]) {
        auto dp_v = dfs(v);
        for (int j = W; j >= 0; j--)              // 逆序
            for (int k = 0; k <= j - w[u]; k++)   // 分配给子树 v 的容量
                dp_u[j] = max(dp_u[j], dp_u[j - k] + dp_v[k]);
    }
    return dp_u;
}
```

### 实战例题

[洛谷 P1064 金明的预算方案](https://www.luogu.com.cn/problem/P1064)（简化版依赖）。

---

## 八、求方案数

将「最大价值」改为「刚好装满的方案数」：

```cpp
dp[0] = 1;                              // 空背包有一种方案
for (int i = 1; i <= n; i++)
    for (int j = W; j >= w[i]; j--)
        dp[j] = (dp[j] + dp[j - w[i]]) % MOD;
```

如果要求「恰好装满」，初始化改为 `dp[0] = 1`，其余为 $0$。

---

## 九、输出具体方案

从最优解回推选择了哪些物品：

```cpp
// 假设有二维 dp 数组（0-1 背包）
int j = W;
vector<int> chosen;
for (int i = n; i >= 1; i--) {
    if (j >= w[i] && dp[i][j] == dp[i - 1][j - w[i]] + v[i]) {
        chosen.push_back(i);            // 选了第 i 件
        j -= w[i];
    }
}
reverse(chosen.begin(), chosen.end());
```

:::tip[为什么从后往前推？]
因为正向推会遇到「两个选择都能达到最优」的歧义，逆向推配合「已确定的剩余容量」能唯一回溯。
:::

---

## 九种背包变体总览

| 变体 | 核心特征 | 循环方向 | 复杂度 |
|------|---------|---------|--------|
| 0-1 背包 | 每件选 0 或 1 次 | 容量逆序 | $O(nW)$ |
| 完全背包 | 每件可选无限次 | 容量正序 | $O(nW)$ |
| 多重背包 | 每件有数量上限 | 二进制拆分后逆序 | $O(W \sum \log c_i)$ |
| 分组背包 | 每组最多选一件 | 容量逆序（分组外套） | $O(GW)$ |
| 二维费用 | 物品消耗两种资源 | 双维度逆序 | $O(nWM)$ |
| 混合背包 | 不同类型混合 | 按类型分别处理 | — |
| 依赖背包 | 选 B 必须先选 A | 树形 DP 合并 | $O(nW^2)$ 或 $O(nW)$ |
| 方案数 | 求装满的方案数 | 同 0-1/完全 | $O(nW)$ |
| 输出方案 | 回溯选择 | 二维数组记录 | $O(nW)$ 预处理 + $O(n)$ 回溯 |

---

## 初始化问题

| 要求 | 初始化 | 答案位置 |
|------|--------|---------|
| **恰好装满** | `dp[0] = 0`，其他为 `-∞` | `dp[W]` |
| **不超过容量** | `dp[0..W] = 0` | `dp[W]` |

**为什么恰好装满用 `-∞`？**

$-\infty$ 表示「不可行状态」。只有 $j = 0$（空背包）天然可行。如果最终 $dp[W] = -\infty$，说明不存在恰好装满的方案。

---

## 常见错误速查

| 错误 | 后果 |
|------|------|
| 0-1 背包用正序循环 | 变成完全背包，物品被重复选 |
| 完全背包用逆序循环 | 退化为 0-1 背包 |
| 分组背包把容量循环放最内层 | 每组可能选了多件 |
| 多重背包忘记二进制拆分 | 朴素 $O(nW\max c_i)$ 可能 TLE |
| `dp` 数组未初始化 | 结果不可预测 |

---

## 练习题目推荐

| 题目 | 题型 | 推荐原因 |
|------|------|---------|
| [洛谷 P1048 采药](https://www.luogu.com.cn/problem/P1048) | 0-1 背包 | 入门 |
| [洛谷 P1616 疯狂的采药](https://www.luogu.com.cn/problem/P1616) | 完全背包 | 入门 |
| [LC 416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/) | 0-1 背包 | 恰好装满 |
| [洛谷 P1776 宝物筛选](https://www.luogu.com.cn/problem/P1776) | 多重背包 | 二进制拆分 |
| [洛谷 P1757 通天之分组背包](https://www.luogu.com.cn/problem/P1757) | 分组背包 | 格式标准 |
| [洛谷 P1064 金明的预算方案](https://www.luogu.com.cn/problem/P1064) | 依赖背包 | 经典真题 |
| [LC 494. Target Sum](https://leetcode.com/problems/target-sum/) | 方案数 | 01 背包变种 |
| [洛谷 P1833 樱花](https://www.luogu.com.cn/problem/P1833) | 混合背包 | 综合应用 |

---

## 总结

1. 背包问题的本质是**有限资源下的最优决策**，核心公式：选 or 不选
2. **0-1 逆序、完全正序**——两条循环方向是区分所有变体的钥匙
3. **二进制拆分**将多重背包降为 $O(\log c)$，是竞赛必备技巧
4. **初始化决定语义**：恰好装满 vs 不超过，$-∞$ 标记不可行状态
5. 熟练写出 8 行模板后，大部分背包题只需要**识别变体 → 套模板 → 微小调整**
