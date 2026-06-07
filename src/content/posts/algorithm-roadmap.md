---
title: 算法学习路线图：从小白到竞赛选手
published: 2026-06-07
description: "一份系统的算法学习路线，涵盖语言基础、基础数据结构、核心算法、进阶专题和竞赛实战，帮助你在算法的道路上持续精进"
image: ""
tags: [算法, 学习路线, 数据结构, 竞赛编程, 方法论]
category: 算法
draft: false
lang: zh
comment: true
pinned: true
---

## 前言

算法是计算机科学的灵魂。无论你是准备**算法面试**、参加**编程竞赛**、还是单纯想写出更优雅的代码，掌握算法都是一条必经之路。

这份路线图将学习过程划分为**五个阶段**，每个阶段都给出了明确的目标、核心知识点和练习建议。

> 本文假设你至少掌握一门编程语言（C++ / Java / Python 均可，下文以 C++ 为例）。如果还没有，这是第零步。

---

## 第一阶段：语言基础与复杂度分析（2-3 周）

在学算法之前，你需要把工具（编程语言）用顺手。

### 必备知识

- **STL 容器**：`vector`、`stack`、`queue`、`set`、`map`、`unordered_set`、`unordered_map`、`priority_queue`、`deque`
- **STL 算法**：`sort`、`lower_bound`、`upper_bound`、`unique`、`next_permutation`、`reverse`
- **常用技巧**：lambda 表达式、结构体、运算符重载、文件读写
- **复杂度分析**：大 $O$ 记号，常见复杂度（$O(1)$、$O(\log n)$、$O(n)$、$O(n \log n)$、$O(n^2)$、$O(2^n)$）

```cpp
// STL 速查：排序 + 去重
vector<int> a = {3, 1, 4, 1, 5, 9, 2, 6};
sort(a.begin(), a.end());                              // 升序
auto it = unique(a.begin(), a.end());                  // 去重
a.erase(it, a.end());                                  // 删除重复
auto pos = lower_bound(a.begin(), a.end(), 4);         // 第一个 >= 4
```

### 复杂度速查表

| $n$ 的范围 | 可行复杂度 | 常见算法 |
|-----------|-----------|---------|
| $n \le 10$ | $O(n!)$ | 暴力枚举排列 |
| $n \le 20$ | $O(2^n)$ | 状态压缩 DP |
| $n \le 100$ | $O(n^3)$ | Floyd-Warshall |
| $n \le 5000$ | $O(n^2)$ | DP、插入排序选择排序 |
| $n \le 10^5$ | $O(n \log n)$ | 排序、二分、线段树 |
| $n \le 10^7$ | $O(n)$ | 前缀和、线性筛 |
| $n \le 10^9$ | $O(\log n)$ 或 $O(1)$ | 数学公式、二分 |

:::tip[经验法则]
1 秒 ≈ $10^8$ 次基本运算。当你设计算法时，用上面的对照表评估你的复杂度是否可以通过。
:::

### 推荐练习

- [洛谷 P1042 乒乓球](https://www.luogu.com.cn/problem/P1042) — 模拟
- [LC 1. Two Sum](https://leetcode.com/problems/two-sum/) — 哈希表入门

---

## 第二阶段：基础数据结构与入门算法（4-6 周）

这一阶段建立算法思维的**地基**。重点是理解每种数据结构的特性，能用纸笔画出它们的工作原理。

### 数据结构

#### 栈 (Stack) 与队列 (Queue)

LIFO vs FIFO。理解**单调栈**和**单调队列**能解决什么问题。

```cpp
// 单调栈模板：求每个元素右边第一个比它大的元素
vector<int> nextGreater(vector<int>& nums) {
    int n = nums.size();
    vector<int> ans(n, -1);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && nums[st.top()] < nums[i]) {
            ans[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    return ans;
}
```

#### 链表 (Linked List)

理解指针操作：反转链表、快慢指针、环检测。

#### 哈希表 (Hash Table)

理解哈希冲突的解决方式，能用 `unordered_map` 在 $O(1)$ 内完成查找。

#### 树与二叉树

前序/中序/后序/层序遍历，递归与非递归写法。

```cpp
// 二叉树中序遍历（Morris 遍历，O(1) 额外空间）
void morris_inorder(TreeNode* root) {
    TreeNode* cur = root;
    while (cur) {
        if (!cur->left) {
            visit(cur);
            cur = cur->right;
        } else {
            TreeNode* pre = cur->left;
            while (pre->right && pre->right != cur) pre = pre->right;
            if (!pre->right) {
                pre->right = cur;   // 建立线索
                cur = cur->left;
            } else {
                pre->right = nullptr;  // 删除线索
                visit(cur);
                cur = cur->right;
            }
        }
    }
}
```

#### 堆与优先队列

大根堆、小根堆、对顶堆求中位数。

### 核心算法

| 算法 | 关键点 | 典型题目 |
|------|--------|---------|
| **前缀和** | 预处理区间和 | LC 560. Subarray Sum Equals K |
| **差分** | 区间修改转单点 | LC 1109. Corporate Flight Bookings |
| **双指针** | 滑动窗口、快慢指针 | LC 3. Longest Substring Without Repeating |
| **二分查找** | 单调性 + 边界处理 | 见[[算法-二分查找]] |
| **快速幂** | $O(\log n)$ 求幂 | LC 50. Pow(x, n) |
| **高精度** | 大整数加减乘除 | 洛谷 P1601 |

### 阶段检查点

能够独立完成：
- LeetCode Easy 题目 20 道
- 理解并能手写单调栈、前缀和、二分查找

---

## 第三阶段：搜索、贪心与动态规划（6-8 周）

这是算法学习中的**第一道坎**——很多人在这里放弃。坚持住，你会看到全新的世界。

### 搜索

#### DFS（深度优先搜索）

回溯法的核心。理解**状态空间树**和**剪枝**。

```cpp
// 经典回溯：全排列
void dfs(vector<int>& nums, vector<bool>& used,
         vector<int>& path, vector<vector<int>>& ans) {
    if (path.size() == nums.size()) {
        ans.push_back(path);
        return;
    }
    for (int i = 0; i < nums.size(); i++) {
        if (used[i]) continue;
        used[i] = true;
        path.push_back(nums[i]);
        dfs(nums, used, path, ans);
        path.pop_back();     // 回溯
        used[i] = false;
    }
}
```

#### BFS（广度优先搜索）

最短路径（无权图）的首选。队列 + 距离数组。

#### 记忆化搜索

在 DFS 上加缓存，是理解 DP 的跳板。

### 贪心算法

**局部最优 → 全局最优**。关键点在于证明贪心选择的正确性。

经典题型：活动安排、区间覆盖、哈夫曼编码。

### 动态规划（DP）

DP 是算法竞赛和面试中**出镜率最高**的题型。核心公式：

$$
dp[状态] = \text{opt}(dp[子状态]) + \text{代价}
$$

#### DP 学习梯度

```
1. 斐波那契 / 爬楼梯（递推入门）
   ↓
2. 0-1 背包、完全背包（背包九讲）
   ↓
3. 最长公共子序列 LCS、最长上升子序列 LIS
   ↓
4. 区间 DP（石子合并）
   ↓
5. 树形 DP（树的最大独立集）
   ↓
6. 状态压缩 DP（TSP 旅行商问题）
   ↓
7. 数位 DP
   ↓
8. DP 优化（单调队列、斜率优化）
```

#### 背包问题速览

```cpp
// 0-1 背包（一维滚动数组）
for (int i = 0; i < n; i++)
    for (int j = W; j >= w[i]; j--)    // 倒序！
        dp[j] = max(dp[j], dp[j - w[i]] + v[i]);

// 完全背包（每种物品无限件）
for (int i = 0; i < n; i++)
    for (int j = w[i]; j <= W; j++)    // 正序！
        dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
```

:::tip[DP 学习心法]
1. **先确定状态定义**——这是最关键的一步
2. **画出状态转移的 DAG**——无后效性保证
3. **从暴力递归 → 记忆化 → 递推**——三步走策略
4. **多画表**——把 `dp` 数组打印出来，直观感受转移过程
:::

---

## 第四阶段：高阶数据结构与图论（8-10 周）

这是**从入门到竞赛**的分水岭。掌握这一阶段，你已经超越了 90% 的程序员。

### 高级数据结构

| 数据结构 | 核心用途 | 难度 |
|----------|---------|------|
| **树状数组** (BIT) | 单点修改 + 前缀查询，代码 ~15 行 | ⭐⭐ |
| **线段树** (Segment Tree) | 区间修改 + 区间查询，带懒标记 | ⭐⭐⭐ |
| **ST 表** | 区间最值静态查询，$O(1)$ 回答 | ⭐ |
| **并查集** (DSU) | 集合合并与查找，近乎 $O(1)$ | ⭐⭐ |
| **Trie 树** | 字符串高效存储与查找 | ⭐⭐ |
| **平衡树** (Treap / Splay) | 动态维护有序序列 | ⭐⭐⭐⭐ |
| **树链剖分** (HLD) | 将树上路径问题转化为线段树 | ⭐⭐⭐⭐ |

### 图论

#### 图的存储

```cpp
// 邻接表（最常用）
vector<pair<int, int>> G[N];  // G[u] = {(v, w), ...}

// 链式前向星（卡常用）
int head[N], to[M], nxt[M], w[M], cnt = 0;
void add(int u, int v, int wt) {
    to[++cnt] = v; w[cnt] = wt;
    nxt[cnt] = head[u]; head[u] = cnt;
}
```

#### 图论算法图谱

```
最短路径：
  ├── 单源无权图 BFS
  ├── 单源非负权 Dijkstra（堆优化 O(m log n)）
  ├── 单源负权 SPFA / Bellman-Ford
  └── 多源 Floyd-Warshall（O(n³)）

最小生成树：
  ├── Kruskal（并查集 + 边排序）
  └── Prim（类似 Dijkstra）

拓扑排序 + DAG：
  └── Kahn 算法 / DFS 后序遍历

强连通分量 SCC：
  └── Tarjan / Kosaraju

网络流：
  ├── 最大流 Dinic
  ├── 最小费用最大流
  └── 二分图匹配（匈牙利 / 最大流）
```

#### Dijkstra 模板

```cpp
// 堆优化 Dijkstra O(m log n)
vector<ll> dijkstra(int s, vector<vector<pair<int, int>>>& G) {
    int n = G.size();
    vector<ll> dist(n, 1e18);
    priority_queue<pair<ll, int>, vector<pair<ll, int>>, greater<>> pq;
    dist[s] = 0; pq.push({0, s});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d != dist[u]) continue;
        for (auto [v, w] : G[u]) {
            if (dist[v] > dist[u] + w) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}
```

---

## 第五阶段：数论、字符串与进阶专题（持续学习）

### 数论基础

| 内容 | 说明 |
|------|------|
| 质数筛 | 埃氏筛 $O(n \log \log n)$，欧拉筛 $O(n)$ |
| GCD / LCM | 欧几里得算法（辗转相除） |
| 模运算 | 费马小定理求逆元、快速幂 |
| 组合数 | 杨辉三角递推、阶乘逆元求 $C(n, k)$ |

```cpp
// 欧拉线性筛 O(n)
vector<int> primes;
bool isp[N];
void euler_sieve(int n) {
    for (int i = 2; i <= n; i++) {
        if (!isp[i]) primes.push_back(i);
        for (int p : primes) {
            if (i * p > n) break;
            isp[i * p] = true;
            if (i % p == 0) break;  // 每个数只被最小质因子筛掉
        }
    }
}
```

### 字符串算法

- **字符串哈希**：$O(1)$ 比较子串，结合二分可以做很多事情
- **KMP**：单模式串匹配，理解 next 数组
- **Trie + AC 自动机**：多模式串匹配
- **后缀数组 / 后缀自动机**：竞赛高阶

### 进阶专题（按需选学）

| 专题 | 适用场景 |
|------|---------|
| 计算几何 | 二维几何问题（凸包、扫描线） |
| 博弈论 | Nim 游戏、SG 函数 |
| 概率与期望 DP | 高斯消元解期望 |
| 离线算法 | 莫队、CDQ 分治、整体二分 |
| 主席树 | 静态区间第 k 小 |
| LCA 与树上差分 | 树上的区间问题 |

---

## 学习方法论

### 三阶段刷题法

```
┌─────────────────────────────────────────────┐
│  阶段一：学算法 → 看模板 → 做模板题             │
│  ├── 理解算法原理，手写核心代码                  │
│  └── 每学一个算法，立即做 3-5 道对应标签题        │
├─────────────────────────────────────────────┤
│  阶段二：刷专题 → 题单练习 → 总结归纳             │
│  ├── 按专题系统刷题（如 DP 50 题）               │
│  ├── 建立自己的代码模板库                        │
│  └── 每个专题结束写一篇总结                      │
├─────────────────────────────────────────────┤
│  阶段三：综合练习 → 模拟赛 → 反复复盘             │
│  ├── 参加 Codeforces / AtCoder 周赛            │
│  ├── 做随机题目，训练「识别算法」的能力            │
│  └── 对做错/不会的题目 3 天后再做一次             │
└─────────────────────────────────────────────┘
```

### 做题的黄金法则

1. **独立思考至少 20 分钟**，再看题解
2. **看懂 ≠ 会做**——关掉题解，自己重新写一遍
3. **复盘比刷题更重要**——做完后在题解区学习不同解法
4. **记录常见套路**——例如「看到最大值最小 → 二分答案」
5. **坚持每天一道**——比周末突击 20 道效果好得多

:::warning[常见误区]
- ❌ 只看不写：看完题解觉得自己会了，真正写时漏洞百出
- ❌ 盲目刷量：刷了 300 题但都是 Easy，不如精做 50 道 Hard
- ❌ 死磕一题：超过 1 小时没有思路，果断看题解
- ❌ 不复习：同样的题目下次还是不会——使用 Anki / 错题本
:::

### 工具与资源推荐

**Online Judge 平台**：
- [LeetCode](https://leetcode.com/) — 面试向，题解丰富
- [洛谷 Luogu](https://www.luogu.com.cn/) — 国内最大 OJ，分阶段题单
- [Codeforces](https://codeforces.com/) — 全球顶级竞赛平台，适合打比赛
- [AtCoder](https://atcoder.jp/) — 日本 AtCoder，题目质量极高
- [AcWing](https://www.acwing.com/) — 算法课程 + OJ 一体化

**参考书**：
- 《算法导论》CLRS — 大部头系统参考
- 《挑战程序设计竞赛》— 竞赛选手入门圣经
- 《算法竞赛入门经典》— 刘汝佳，国内经典
- OI Wiki ([oi-wiki.org](https://oi-wiki.org/)) — 最好的在线算法百科

---

## 里程碑与能力对照

| 完成阶段 | 你能够做到 |
|----------|-----------|
| 第一阶段 | 通过 LeetCode Easy 题目，理解基础 STL |
| 第二阶段 | 完成 LeetCode 面试高频题，能分析复杂度 |
| 第三阶段 | 做出大多数 LeetCode Medium，触及 Hard，对 DP 有自己的理解 |
| 第四阶段 | LeetCode 周赛稳定 2-3 题，Codeforces Div.2 能上分 |
| 第五阶段 | 全省/全国竞赛获奖水平，大厂算法面试无忧 |

---

## 结语

算法学习是一条**长坡厚雪**的道路。它不会让你立刻变强，但每理解一个新算法、每 AC 一道难题，你都在变得更好。

> 种一棵树最好的时间是十年前，其次是现在。

不需要等到所有基础知识都完美了才开始。打开 OJ，做一道题，挂一次 WA，调试 30 分钟，然后 AC——这才是真正的学习。

祝你早日成为自己心目中的算法高手 🚀
