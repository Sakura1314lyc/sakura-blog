---
title: 树状数组完全解析
published: 2025-06-07
description: '从 lowbit 到进阶应用：全面掌握树状数组（Fenwick Tree）的原理、实现与常见变体'
image: ''
tags: [算法, 树状数组, 数据结构, 竞赛编程]
category: 算法
draft: false
lang: zh
comment: true
---

## 什么是树状数组？

**树状数组**（Fenwick Tree / Binary Indexed Tree, BIT）是一种能高效维护**前缀和**并支持**单点更新**的数据结构。相比线段树，它的代码量更少、常数更小，但功能覆盖范围略窄。

- **单点修改**：$O(\log n)$
- **前缀查询**：$O(\log n)$
- **空间复杂度**：$O(n)$
- **代码行数**：约 10 行

:::tip[命名由来]
中文「树状数组」源于它**用数组模拟树**的特性。英文名 Fenwick Tree 来自发明者 Peter Fenwick（1994年），Binary Indexed Tree 则描述了它利用**二进制位**组织区间的核心思想。
:::

---

## 核心概念：lowbit

**lowbit** 是树状数组的基石操作，表示一个数二进制表示中**最低位的 1 所代表的值**。

$$
\text{lowbit}(x) = x \mathrel{\&} (-x)
$$

**示例**：

| $x$ | 二进制 | lowbit(x) |
|-----|--------|-----------|
| 6 | $0110$ | $0010 = 2$ |
| 8 | $1000$ | $1000 = 8$ |
| 7 | $0111$ | $0001 = 1$ |
| 12 | $1100$ | $0100 = 4$ |

### 为什么是用 `x & -x`？

在计算机中，负数用补码表示：$-x = (\sim x) + 1$。将所有位取反并加 1 后，最低位的 1 得以保留，而比它更低的 0 都变成了 1。

```
 x  = 0110  (6)
~x  = 1001
-x  = 1010  (-6)
x & -x = 0010 = 2
```

---

## 树状数组的结构

树状数组用数组 `tree` 存储，`tree[i]` 维护的是原数组中一段特定区间的和：

$$
tree[i] = \sum_{j = i - \text{lowbit}(i) + 1}^{i} a[j]
$$

**直观理解**：`tree[i]` 管辖从 $i$ 往前数 $\text{lowbit}(i)$ 个元素的区间。

```
原数组 a:  [1] [2] [3] [4] [5] [6] [7] [8]
           1   5   3   7   2   4   6   8

tree[1] = a[1]                    (lowbit=1, 管1个)
tree[2] = a[1]+a[2]               (lowbit=2, 管2个)
tree[3] = a[3]                    (lowbit=1, 管1个)
tree[4] = a[1]+a[2]+a[3]+a[4]    (lowbit=4, 管4个)
tree[5] = a[5]                    (lowbit=1, 管1个)
tree[6] = a[5]+a[6]               (lowbit=2, 管2个)
tree[7] = a[7]                    (lowbit=1, 管1个)
tree[8] = a[1]+...+a[8]          (lowbit=8, 管8个)
```

画出管辖关系，形成了一棵**以 2 的幂为高度的树**：

```
        8 ─────────────
       /               \
      4 ───             |
     /     \            |
    2       |    6      |
   / \      |   / \     |
  1   |     3  5   |    7
      |            |
      a[1..8]全部覆盖
```

---

## 基础操作

### 单点修改 `add`

将位置 $pos$ 的值增加 $delta$，需要更新所有**管辖范围包含 $pos$** 的节点。

```cpp
int tree[N];  // 树状数组，1-indexed
int n;

int lowbit(int x) {
    return x & -x;
}

// a[pos] += delta
void add(int pos, int delta) {
    while (pos <= n) {
        tree[pos] += delta;
        pos += lowbit(pos);  // 向上跳到父节点
    }
}
```

**为什么 `pos += lowbit(pos)`？**

`pos` 的二进制加上其 `lowbit` 后，最低位的 1 进位了，恰好得到了**最小的比当前 pos 大的、管辖范围包含当前 pos 的节点**。

```
例如 n=8, pos=3 (011)
  3 + lowbit(3) = 3 + 1 = 4   → tree[4] 包含 a[3]
  4 + lowbit(4) = 4 + 4 = 8   → tree[8] 包含 a[3]
  8 + lowbit(8) = 8 + 8 = 16  → 超出 n，停止
```

### 前缀查询 `sum`

查询前 $pos$ 个元素的和 $a[1] + a[2] + \dots + a[pos]$。

```cpp
// 返回 a[1] + a[2] + ... + a[pos]
int sum(int pos) {
    int ans = 0;
    while (pos > 0) {
        ans += tree[pos];
        pos -= lowbit(pos);  // 跳到前一段区间的末尾
    }
    return ans;
}
```

**为什么 `pos -= lowbit(pos)`？**

每次减去 `lowbit` 相当于**切掉末尾的一段 1**，恰好跳过当前节点管辖的区间长度。

```
例如 pos=7 (111)
  7 - lowbit(7) = 7 - 1 = 6   → tree[7] = a[7]
  6 - lowbit(6) = 6 - 2 = 4   → tree[6] = a[5]+a[6]
  4 - lowbit(4) = 4 - 4 = 0   → tree[4] = a[1]+a[2]+a[3]+a[4]
  停止。总和 = a[1..7]
```

### 区间查询

```cpp
// 查询 a[l..r] 的区间和
int range_sum(int l, int r) {
    return sum(r) - sum(l - 1);
}
```

---

## 完整代码模板

```cpp
struct Fenwick {
    vector<int> tree;
    int n;

    Fenwick(int _n) : n(_n) {
        tree.assign(n + 1, 0);
    }

    void add(int pos, int delta) {
        for (; pos <= n; pos += pos & -pos)
            tree[pos] += delta;
    }

    int sum(int pos) {
        int ans = 0;
        for (; pos > 0; pos -= pos & -pos)
            ans += tree[pos];
        return ans;
    }

    int range_sum(int l, int r) {
        return sum(r) - sum(l - 1);
    }
};
```

仅 **20 行代码**！与线段树动辄 60–80 行相比，树状数组的简洁性优势明显。

---

## 建树方法

### 方法一：逐个添加（$O(n \log n)$）

```cpp
Fenwick bit(n);
for (int i = 1; i <= n; i++)
    bit.add(i, a[i]);
```

### 方法二：线性建树（$O(n)$）

利用前缀和思想，每个节点直接计算其管辖范围的和。

```cpp
vector<int> tree(n + 1);
// 先复制原数组（可选，视写法而定）
for (int i = 1; i <= n; i++) {
    tree[i] += a[i];
    int j = i + (i & -i);
    if (j <= n) tree[j] += tree[i];  // 推算父节点
}
```

或者更简单的做法——通过前缀和数组：

```cpp
vector<int> pre(n + 1);
for (int i = 1; i <= n; i++) pre[i] = pre[i - 1] + a[i];
for (int i = 1; i <= n; i++)
    tree[i] = pre[i] - pre[i - (i & -i)];  // tree[i] 管辖的区间
```

---

## 进阶变体

### 区间修改 + 单点查询（差分树状数组）

利用**差分数组**将「区间加」转化为两个「单点加」，查询时求前缀和即可还原单点值。

```cpp
// 原数组 a，差分数组 d[i] = a[i] - a[i-1]
// 区间 [l, r] 全部 +val：
//   add(l, val)
//   add(r + 1, -val)
// 查询 a[pos]：
//   sum(pos)

Fenwick bit(n);

// 区间加
void range_add(int l, int r, int val) {
    bit.add(l, val);
    bit.add(r + 1, -val);
}

// 单点查询
int point_query(int pos) {
    return bit.sum(pos);
}
```

**原理**：差分数组 $d[i] = a[i] - a[i-1]$，那么 $a[x] = \sum_{i=1}^x d[i]$——差分的前缀和就是原数组。

### 区间修改 + 区间查询

这个需要**两个树状数组**，是树状数组中最复杂的应用。

**推导**：

设差分数组 $d[i]$，那么：
$$
a[x] = \sum_{i=1}^{x} d[i]
$$

前缀和：
$$
\begin{aligned}
\sum_{i=1}^{x} a[i] &= \sum_{i=1}^{x} \sum_{j=1}^{i} d[j] \\
&= \sum_{i=1}^{x} d[i] \cdot (x - i + 1) \\
&= (x + 1)\sum_{i=1}^{x} d[i] - \sum_{i=1}^{x} i \cdot d[i]
\end{aligned}
$$

因此需要维护两个值：$\sum d[i]$ 和 $\sum i \cdot d[i]$。

```cpp
struct FenwickRange {
    BIT t1, t2;  // t1 维护 d[i]，t2 维护 i*d[i]
    int n;

    FenwickRange(int _n) : n(_n), t1(_n), t2(_n) {}

    // 区间 [l, r] 全部 +val
    void range_add(int l, int r, int val) {
        t1.add(l, val);
        t1.add(r + 1, -val);
        t2.add(l, l * val);
        t2.add(r + 1, (r + 1) * -val);
    }

    // 区间 [l, r] 的和
    int range_sum(int l, int r) {
        return prefix_sum(r) - prefix_sum(l - 1);
    }

private:
    int prefix_sum(int x) {
        return (x + 1) * t1.sum(x) - t2.sum(x);
    }
};
```

### 二维树状数组

将一维树状数组扩展到二维，每个维度独立做 `lowbit` 跳转。

```cpp
struct Fenwick2D {
    vector<vector<int>> tree;
    int n, m;

    Fenwick2D(int _n, int _m) : n(_n), m(_m) {
        tree.assign(n + 1, vector<int>(m + 1, 0));
    }

    void add(int x, int y, int delta) {
        for (int i = x; i <= n; i += i & -i)
            for (int j = y; j <= m; j += j & -j)
                tree[i][j] += delta;
    }

    // 查询 (1,1) 到 (x,y) 的子矩阵和
    int sum(int x, int y) {
        int ans = 0;
        for (int i = x; i > 0; i -= i & -i)
            for (int j = y; j > 0; j -= j & -j)
                ans += tree[i][j];
        return ans;
    }

    // 查询子矩阵 (x1,y1) 到 (x2,y2)
    int range_sum(int x1, int y1, int x2, int y2) {
        return sum(x2, y2) - sum(x1 - 1, y2)
             - sum(x2, y1 - 1) + sum(x1 - 1, y1 - 1);
    }
};
```

---

## 树状数组 vs 线段树

| 维度 | 树状数组 | 线段树 |
|------|----------|--------|
| 代码量 | ~15 行 | ~60 行 |
| 常数 | 极小 | 较大 |
| 空间 | $O(n)$ | $O(4n)$ |
| 功能范围 | 前缀和可推导的操作 | 任意区间信息 |
| 区间修改 | 需要差分技巧 | 有懒标记原生支持 |
| 不可减信息维护 | ❌（如最大值） | ✅ |
| 动态开点 | 不可行 | 可行 |
| 最值查询 | 仅前缀最大/最小 | 任意区间最大/最小 |

:::tip[选择建议]
- **先考虑树状数组**：代码短、常数小、不易出错
- **需要区间最大/最小值** 且无法转化为前缀 → 用线段树
- **需要复杂的区间合并信息**（如区间众数）→ 用线段树
- **需要动态开点或线段树合并** → 用线段树
- **数组不可差分**（如 xor 可逆但 max 不可逆）→ 注意 BIT 的局限
:::

---

## 树状数组求逆序对

这是树状数组的经典应用之一：离散化后用 BIT 统计。

```cpp
// 返回 a 中的逆序对数
long long count_inversions(vector<int>& a) {
    int n = a.size();

    // 离散化
    vector<int> sorted = a;
    sort(sorted.begin(), sorted.end());
    sorted.erase(unique(sorted.begin(), sorted.end()), sorted.end());
    for (int& x : a) x = lower_bound(sorted.begin(), sorted.end(), x) - sorted.begin() + 1;

    // 统计：对每个元素，查询有多少比它大的已经在前面出现了
    Fenwick bit(sorted.size());
    long long ans = 0;
    for (int i = 0; i < n; i++) {
        ans += i - bit.sum(a[i]);  // 前面出现过的总数 - 小于等于它的 = 大于它的
        bit.add(a[i], 1);
    }
    return ans;
}
```

---

## 常见错误

:::caution[常见错误]
1. **忘记 1-indexed**：树状数组的下标必须从 $1$ 开始，$0$ 会导致 `lowbit(0) = 0` 死循环
2. **数组越界**：`add` 时 `pos <= n`；若 $n$ 估算小了会 RE
3. **忘记离散化**：值域 $> 10^6$ 时不能直接开数组，先离散化
4. **区间修改忘记处理差分**：直接 `add(l, val)` 然后 `add(r+1, -val)`，不是 `add(l..r, val)`
:::

---

## 练习题目推荐

| 题目 | 难度 | 考察点 |
|------|------|--------|
| [LC 307. Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/) | Medium | BIT 基础 |
| [洛谷 P3374 【模板】树状数组 1](https://www.luogu.com.cn/problem/P3374) | 模板 | 单点修改 + 前缀和 |
| [洛谷 P3368 【模板】树状数组 2](https://www.luogu.com.cn/problem/P3368) | 模板 | 区间修改 + 单点查询 |
| [LC 315. Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/) | Hard | BIT 求逆序 |
| [洛谷 P1908 逆序对](https://www.luogu.com.cn/problem/P1908) | 经典 | BIT 求逆序对 |

---

## 总结

1. **`lowbit(x) = x & -x`** 是树状数组的灵魂，理解了它就理解了 BIT
2. 树状数组以 **15 行代码** 实现了线段树 60 行的核心功能，是竞赛编程的必备模板
3. **单点修改 + 区间查询** 是基本形态；**差分**可以让它支持区间修改
4. 树状数组的局限性：不能维护**不可减**的区间信息（如区间最值）
5. 优先使用树状数组，当它不够用时再考虑线段树
