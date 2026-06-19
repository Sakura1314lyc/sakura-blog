---
title: 状压 DP 从入门到精通
published: 2026-06-19
description: "系统掌握状态压缩 DP 的核心思想：位运算基础、子集枚举、TSP 问题、轮廓线 DP 与插头 DP，含经典例题与完整代码"
image: ""
tags: [动态规划, DP, 状压DP, 状态压缩, 算法, 竞赛编程]
category: 动态规划
draft: false
lang: zh
comment: true
---

## 什么是状压 DP？

**状态压缩 DP**（Bitmask DP / State Compression DP）是一种将**集合信息压缩为二进制整数**来做动态规划的技巧。它的典型应用场景是：

> 问题的某一维状态需要表示「哪些元素已经被使用」「哪些位置被覆盖」等集合信息，但元素数量 $n$ 很小（通常 $n \le 20$）。

核心思想：**用一个整数的二进制位来表示某个元素是否在集合中**，从而将一个集合压缩成一个 `int`，使其可以作为 DP 数组的下标。

### 为什么 $n$ 必须很小？

$n$ 个元素的集合有 $2^n$ 个子集。当 $n=20$ 时，$2^{20} \approx 10^6$，已经是 DP 数组的极限；$n=24$ 时内存和时间都不可接受。所以状压 DP 的适用范围一般是 $n \le 20 \sim 22$。

---

## 一、位运算基础

状压 DP 大量使用位运算。以下是必须熟练掌握的操作：

### 基本操作

| 操作                            | 代码                          | 含义         |
| ------------------------------- | ----------------------------- | ------------ |
| 判断第 $i$ 位是否为 1           | `(mask >> i) & 1`             | 返回 0 或 1  |
| 将第 $i$ 位置为 1               | `mask \| (1 << i)`            | 加入元素 $i$ |
| 将第 $i$ 位置为 0               | `mask & ~(1 << i)`            | 移除元素 $i$ |
| 翻转第 $i$ 位                   | `mask ^ (1 << i)`             | 切换元素 $i$ |
| 判断 submask 是否是 mask 的子集 | `(mask & submask) == submask` | 常用         |
| 取最低位的 1                    | `mask & (-mask)`              | lowbit       |
| 去掉最低位的 1                  | `mask & (mask - 1)`           | 常用于枚举   |
| 统计 1 的个数                   | `__builtin_popcount(mask)`    | GCC 内建函数 |

### 子集枚举

一个非常重要的技巧是枚举一个集合的所有子集：

```cpp
// 枚举 mask 的所有非空子集
for (int sub = mask; sub; sub = (sub - 1) & mask) {
    // sub 是 mask 的一个子集
}
```

**时间复杂度**：对所有 $2^n$ 个 mask 分别枚举其所有子集的总复杂度为 $O(3^n)$——因为每个元素有三种状态（不在 mask 中、在 mask 中但不在 sub 中、同时在 mask 和 sub 中）。若只枚举单个 mask 的子集，复杂度为 $O(2^{|mask|})$。

### 例题引入

> [洛谷 P1896 互不侵犯](https://www.luogu.com.cn/problem/P1896)：在 $N \times N$ 的棋盘上放置 $K$ 个国王，国王能攻击相邻 8 个格子，求互不攻击的方案数。$N \le 9$。

每一行的放置情况可以压缩为一个 $N$ 位二进制数。$N \le 9$ 意味着每行只有 $2^9 = 512$ 种状态，完全可以枚举。

---

## 二、经典模型一：排列/选数型状压 DP

### 模型描述

有 $n$ 个元素（$n \le 20$），需要以某种顺序处理它们，且当前能选哪些元素取决于已经选了哪些元素。此时：

- $dp[mask]$：已经选了集合 $mask$ 时的最优值/方案数

### 例题：TSP（旅行商问题）

> $n$ 个城市，城市 $i$ 到城市 $j$ 的距离为 $dist[i][j]$。从城市 $0$ 出发，访问每个城市恰好一次后回到起点，求最短路径。$n \le 20$。

**状态定义**：

$dp[mask][i]$：已经访问过的城市集合为 $mask$，当前在城市 $i$ 的最短距离。

**状态转移**：

$$
dp[mask \cup \{j\}][j] = \min(dp[mask \cup \{j\}][j],\; dp[mask][i] + dist[i][j])
$$

其中 $j \notin mask$（即第 $j$ 位为 0）。

**复杂度**：$O(n^2 \cdot 2^n)$。$n=20$ 时约为 $4 \times 10^8$，需要卡常或用更好的算法，但 $n \le 15$ 时很轻松。

### TSP 模板代码

```cpp
#include <iostream>
#include <cstring>
#include <algorithm>
using namespace std;

const int INF = 0x3f3f3f3f;
int dist[20][20];
int dp[1 << 20][20];

int tsp(int n) {
    memset(dp, 0x3f, sizeof(dp));
    dp[1][0] = 0;  // 从城市 0 出发，只访问了 0

    for (int mask = 1; mask < (1 << n); mask++) {
        for (int i = 0; i < n; i++) {
            if (!(mask & (1 << i))) continue;  // i 必须在 mask 中
            if (dp[mask][i] == INF) continue;

            for (int j = 0; j < n; j++) {
                if (mask & (1 << j)) continue;  // j 不能在 mask 中
                int nxt = mask | (1 << j);
                dp[nxt][j] = min(dp[nxt][j], dp[mask][i] + dist[i][j]);
            }
        }
    }

    // 回到起点
    int ans = INF;
    int full = (1 << n) - 1;
    for (int i = 1; i < n; i++) {
        ans = min(ans, dp[full][i] + dist[i][0]);
    }
    return ans;
}

int main() {
    int n; cin >> n;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> dist[i][j];
    cout << tsp(n) << endl;
    return 0;
}
```

### 例题：洛谷 P1171 售货员的难题

[洛谷 P1171](https://www.luogu.com.cn/problem/P1171)：$n \le 20$，标准的 TSP 问题，用上述模板即可解决。

### 例题：AtCoder ABC180E Traveling Salesman among Aerial Cities

[ABC180E](https://atcoder.jp/contests/abc180/tasks/abc180_e)：三维空间中的 TSP，距离计算方式略有变化，但 DP 部分完全一致。

---

## 三、经典模型二：覆盖型状压 DP

### 模型描述

给定一个 $n \times m$ 的网格（$n, m$ 中较小者 $\le 10$），需要用某种骨牌（如 $1 \times 2$ 多米诺）覆盖。将**较小维度作为列**，用二进制表示当前列（或行）的覆盖情况。

### 例题：骨牌覆盖

> 用 $1 \times 2$ 的骨牌覆盖 $n \times m$ 的棋盘，求方案数。$n, m \le 10$。

**状态定义**：

$dp[col][mask]$：填到第 $col$ 列，第 $col$ 列的填充状态为 $mask$ 的方案数。

$mask$ 的每一位表示该列中对应行的格子是否已被前一列的横向骨牌占据。

**转移**：枚举当前列放置骨牌的方式，确保与上一列的状态兼容。

```cpp
using ll = long long;
const int MAXN = 12;
ll dp[MAXN][1 << MAXN];
int n, m;

// dfs 生成当前列的所有可行转移
// col: 当前列号, i: 当前行号, cur: 当前列状态, nxt: 下一列的被覆盖状态
void dfs(int col, int i, int cur, int nxt) {
    if (i == n) {
        dp[col + 1][nxt] += dp[col][cur];
        return;
    }
    // 当前位置已被上一列的横骨牌覆盖
    if (cur & (1 << i)) {
        dfs(col, i + 1, cur, nxt);
        return;
    }
    // 横着放：占当前列和下一列的同一行
    dfs(col, i + 1, cur, nxt | (1 << i));
    // 竖着放：占当前列的两行（前提是下一行也未被覆盖）
    if (i + 1 < n && !(cur & (1 << (i + 1)))) {
        dfs(col, i + 2, cur, nxt);
    }
}

ll solve() {
    memset(dp, 0, sizeof(dp));
    dp[0][0] = 1;
    for (int col = 0; col < m; col++) {
        for (int mask = 0; mask < (1 << n); mask++) {
            if (dp[col][mask] == 0) continue;
            dfs(col, 0, mask, 0);
        }
    }
    return dp[m][0];  // 最后一列不能被下一列的骨牌覆盖
}
```

### 例题：洛谷 P1896 互不侵犯

回到之前提到的互不侵犯问题，这也是一种「行状态压缩」：

```cpp
#include <iostream>
#include <vector>
using namespace std;
using ll = long long;

int n, k;
ll dp[10][1 << 9][100];  // dp[row][state][cnt]
vector<int> valid_states;
vector<int> popcount;

// 判断一行自身的国王是否互不攻击
bool check(int s) {
    return (s & (s << 1)) == 0;  // 无相邻国王
}

void init() {
    for (int s = 0; s < (1 << n); s++) {
        if (check(s)) {
            valid_states.push_back(s);
            popcount.push_back(__builtin_popcount(s));
        }
    }
}

ll solve() {
    init();
    dp[0][0][0] = 1;
    int total = valid_states.size();

    for (int i = 1; i <= n; i++) {
        for (int a = 0; a < total; a++) {
            int s1 = valid_states[a];
            for (int b = 0; b < total; b++) {
                int s2 = valid_states[b];
                // 检查上下行是否有相邻国王（含对角线）
                if (s1 & s2) continue;
                if ((s1 << 1) & s2) continue;
                if ((s1 >> 1) & s2) continue;

                int cnt = popcount[a];
                for (int c = cnt; c <= k; c++) {
                    dp[i][a][c] += dp[i - 1][b][c - cnt];
                }
            }
        }
    }

    ll ans = 0;
    for (int a = 0; a < total; a++)
        ans += dp[n][a][k];
    return ans;
}

int main() {
    cin >> n >> k;
    cout << solve() << endl;
    return 0;
}
```

---

## 四、经典模型三：轮廓线 DP

### 模型描述

轮廓线 DP 是状压 DP 的进阶形态。当处理网格 DP 时，不按「整行/整列」压缩，而是按**处理顺序的轮廓线**来压缩状态。一条轮廓线贯穿 $m$ 个格子，状态只需 $m$ 位，且逐格转移只需检查相邻几格，因此复杂度从按列 DP 枚举相邻列状态的 $O(m \cdot 4^n)$ 降到了 $O(nm \cdot 2^m)$。

### 例题：铺砖问题（轮廓线法）

> $n \times m$ 的棋盘用 $1 \times 2$ 骨牌铺满，求方案数。$n, m \le 10$，但使用轮廓线方法可以使处理更简洁。

轮廓线上的第 $i$ 个格子（从当前处理位置起向右走过 $m$ 个格子）的值为 1 表示该格已被覆盖，0 表示未被覆盖。

**转移时的三种情况**：

1. 当前格已被覆盖：跳过
2. 当前格未被覆盖：竖着放骨牌（占当前格和下方一格）
3. 当前格未被覆盖且右边一格也未被覆盖：横着放骨牌

```cpp
using ll = long long;
int n, m;
// dp 可以滚动：只需上一格的状态
ll dp[2][1 << 12];

ll solve() {
    int cur = 0;
    memset(dp, 0, sizeof(dp));
    dp[cur][0] = 1;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cur ^= 1;
            memset(dp[cur], 0, sizeof(dp[cur]));

            for (int mask = 0; mask < (1 << m); mask++) {
                if (dp[cur ^ 1][mask] == 0) continue;

                if (mask & (1 << j)) {
                    // 当前格已被覆盖，清除此位
                    int nxt = mask ^ (1 << j);
                    dp[cur][nxt] += dp[cur ^ 1][mask];
                } else {
                    // 竖放
                    dp[cur][mask | (1 << j)] += dp[cur ^ 1][mask];
                    // 横放：需要右边也未被覆盖且 j 不是行尾
                    if (j + 1 < m && !(mask & (1 << (j + 1)))) {
                        dp[cur][mask | (1 << (j + 1))] += dp[cur ^ 1][mask];
                    }
                }
            }
        }
    }
    return dp[cur][0];
}
```

### 例题：洛谷 P5056 插头 DP

[洛谷 P5056](https://www.luogu.com.cn/problem/P5056)：用一条回路覆盖所有空格子的方案数——这是插头 DP 的模板题。插头 DP 是轮廓线 DP 的高阶版本，用**括号表示法**维护轮廓线上插头的连通性关系。

---

## 五、经典模型四：集合划分型状压 DP

### 模型描述

将集合分成若干组，每组满足特定条件，求最小组数或最大分数。核心思想是：**先预处理所有合法分组，再在合法分组上用子集枚举转移**。

### 例题：洛谷 P2836 合影效果

> $n$ 个人，知道他们互相是否认识。要将所有人分成若干组，每组内必须两两认识（形成团），求最少组数。$n \le 15$。

**解法**：

1. 预处理 `valid[mask]`：判断集合 $mask$ 是否是一个合法的组（内部两两认识）。
2. $dp[mask]$：将集合 $mask$ 分成合法组的最少组数。
3. 转移：枚举 $mask$ 的子集 $sub$，若 `valid[sub]` 为真，则：

$$
dp[mask] = \min(dp[mask],\; dp[mask \setminus sub] + 1)
$$

```cpp
const int INF = 0x3f3f3f3f;
int dp[1 << 15];
bool valid[1 << 15];
int acquaintance[15][15];  // 认识矩阵

void precompute(int n) {
    for (int mask = 1; mask < (1 << n); mask++) {
        valid[mask] = true;
        for (int i = 0; i < n; i++) {
            if (!(mask & (1 << i))) continue;
            for (int j = i + 1; j < n; j++) {
                if (!(mask & (1 << j))) continue;
                if (!acquaintance[i][j]) {
                    valid[mask] = false;
                    break;
                }
            }
            if (!valid[mask]) break;
        }
    }
}

int solve(int n) {
    precompute(n);
    memset(dp, 0x3f, sizeof(dp));
    dp[0] = 0;

    for (int mask = 1; mask < (1 << n); mask++) {
        if (valid[mask]) {
            dp[mask] = 1;  // 整个集合本身合法
            continue;
        }
        // 枚举 mask 的真子集
        for (int sub = mask; sub; sub = (sub - 1) & mask) {
            if (valid[sub]) {
                dp[mask] = min(dp[mask], dp[mask ^ sub] + 1);
            }
        }
    }
    return dp[(1 << n) - 1];
}
```

### 优化：子集枚举 + 固定最低位

枚举所有子集的复杂度是 $O(3^n)$。可以通过固定最低位来优化常数：让 `sub` 始终包含 `mask` 的最低位的 1，这样每个子集只被枚举一次。

```cpp
int lo = mask & (-mask);  // 最低位的 1
for (int sub = mask; sub; sub = (sub - 1) & mask) {
    if (!(sub & lo)) continue;  // 必须包含最低位
    // ...
}
```

---

## 六、经典模型五：期望型状压 DP

### 模型描述

当 DP 的每一步带有随机性时，可以将「已发生的事件集合」作为状态，建立期望方程。这类问题通常从目标状态倒推（因为目标状态的期望值已知）。

### 例题：收集物品的期望次数

> 有 $n$ 种物品，每次随机获得一种（每种等概率 $1/n$）。求集齐所有物品的期望次数。$n \le 20$。

**状态定义**：$dp[mask]$ 表示已经收集到集合 $mask$ 后，到集齐所有物品还需的期望次数。

目标状态 $dp[(1 \ll n)-1] = 0$（已集齐，不需要再抽）。从后往前推：

$$
dp[mask] = 1 + \frac{|mask|}{n} \cdot dp[mask] + \frac{1}{n}\sum_{j \notin mask} dp[mask \cup \{j\}]
$$

移项整理得：

$$
dp[mask] = \frac{n + \sum_{j \notin mask} dp[mask \cup \{j\}]}{n - |mask|}
$$

```cpp
double dp[1 << 20];

double solve(int n) {
    int full = (1 << n) - 1;
    dp[full] = 0;
    for (int mask = full - 1; mask >= 0; mask--) {
        int cnt = __builtin_popcount(mask);
        double sum = n;  // 每次抽取的代价（1 次 * n）
        for (int j = 0; j < n; j++) {
            if (!(mask & (1 << j))) {
                sum += dp[mask | (1 << j)];
            }
        }
        dp[mask] = sum / (n - cnt);
    }
    return dp[0];
}
```

**要点**：

- 期望 DP 中如果转移方程两边出现了同一个 $dp[mask]$（自环），需要移项求解，而不是简单递推。
- 状态转移图是 DAG（按 $|mask|$ 递增方向），倒推时按 $|mask|$ 递减顺序即可。
- 更复杂的期望 DP（如转移图非 DAG）可能需要高斯消元。

---

## 七、常见优化技巧

### 7.1 滚动数组

对于 `dp[row][mask]` 形式的 DP，`row` 维度可以滚动：`dp[cur][mask]` 和 `dp[cur^1][mask]`，减少内存开销。

### 7.2 预处理合法状态

例如在互不侵犯中，预先筛出所有满足「自身不相邻」的状态，DP 时只在这些状态间转移，能大幅降低常数。

```cpp
vector<int> valid;
for (int s = 0; s < (1 << m); s++)
    if (check(s)) valid.push_back(s);

// DP 时遍历 valid 而非所有 [0, 2^m)
for (int a : valid)
    for (int b : valid)
        if (compatible(a, b))
            dp[i][a] += dp[i - 1][b];
```

### 7.3 子集 DP 的 SOS（Sum Over Subsets）

对于某些「对所有子集求和」的需求，有 $O(n \cdot 2^n)$ 的 SOS DP，比 $O(3^n)$ 的子集枚举快得多：

```cpp
// 对每个 mask，计算所有子集的 sum
for (int i = 0; i < n; i++)
    for (int mask = 0; mask < (1 << n); mask++)
        if (mask & (1 << i))
            f[mask] += f[mask ^ (1 << i)];
```

### 7.4 使用 `__builtin_ctz` 快速定位最低位

```cpp
int lo = __builtin_ctz(mask);  // 最低位 1 的位置（0-indexed）
int nxt = mask ^ (1 << lo);     // 去掉最低位的 1
```

---

## 八、习题推荐

按难度递进：

| 题目                                                                 | 难度          | 考点               |
| -------------------------------------------------------------------- | ------------- | ------------------ |
| [洛谷 P1896 互不侵犯](https://www.luogu.com.cn/problem/P1896)        | 普及+/提高    | 行状态压缩，预处理 |
| [洛谷 P1171 售货员的难题](https://www.luogu.com.cn/problem/P1171)    | 提高+/省选    | TSP 模板           |
| [洛谷 P2704 炮兵阵地](https://www.luogu.com.cn/problem/P2704)        | 提高+/省选    | 多行状态压缩       |
| [洛谷 P1879 Corn Fields G](https://www.luogu.com.cn/problem/P1879)   | 普及+/提高    | 网格覆盖状压       |
| [洛谷 P2836 合影效果](https://www.luogu.com.cn/problem/P2836)        | 提高+/省选    | 集合划分           |
| [洛谷 P4363 一双木棋](https://www.luogu.com.cn/problem/P4363)        | 省选/NOI−     | 轮廓线 + 博弈      |
| [洛谷 P5056 插头DP](https://www.luogu.com.cn/problem/P5056)          | NOI/NOI+/CTSC | 插头 DP 模板       |
| [AtCoder ABC180E](https://atcoder.jp/contests/abc180/tasks/abc180_e) | 普及+/提高    | TSP 变体           |
| [Codeforces 11D](https://codeforces.com/problemset/problem/11/D)     | 提高+/省选    | 状压统计简单环     |
| [Codeforces 16E](https://codeforces.com/problemset/problem/16/E)     | 提高+/省选    | 概率 + 状压 DP     |

---

## 九、总结

### 什么时候想到状压 DP？

1. **数据范围暗号**：某个维度 $n \le 20$（或 $m \le 10$），而其他维度可能很大。
2. **集合信息不可排序**：需要记录「哪些元素用过了」，而不仅仅是一个数量。
3. **棋盘类问题**：行或列很少（$\le 10$），可以对行/列进行状态压缩。

### 解题步骤

1. 确定被压缩的对象（选中的元素集合 / 行的覆盖状态 / 轮廓线）
2. 设计 `dp[mask]` 或 `dp[mask][i]` 的含义
3. 写出转移方程（枚举下一个元素 / 枚举合法行 / 枚举子集）
4. 预处理合法状态，减少无效转移
5. 注意初值和边界（$dp[0]$ 通常为初始状态）

状压 DP 的核心在于「用二进制表示集合」，一旦习惯这种思路，许多 $n \le 20$ 的 NP 难题都能在 $O(2^n)$ 或 $O(n \cdot 2^n)$ 内得到精确解。
