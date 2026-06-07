---
title: 线段树从入门到精通
published: 2026-06-07
description: "全面讲解线段树的原理、实现与优化，包含单点修改、区间查询、懒惰标记等核心内容"
image: ""
tags: [算法, 线段树, 数据结构, 竞赛编程]
category: 算法
draft: false
lang: zh
comment: true
---

## 什么是线段树？

**线段树**（Segment Tree）是一种用于维护**区间信息**的二叉树形数据结构。它能在 $O(\log n)$ 的时间复杂度内完成**单点修改**和**区间查询**，在需要同时支持修改和查询的场景中非常高效。

每个节点代表一个区间，根节点覆盖整个数组，叶子节点对应单个元素。

:::tip[线段树 vs 前缀和]
前缀和能做到 $O(1)$ 区间查询，但修改是 $O(n)$；线段树的查询和修改都是 $O(\log n)$，适用于**动态**场景——数据会频繁变化。如果只有查询、没有修改，前缀和更优。
:::

---

## 线段树的结构

对于一个长度为 $n$ 的数组，线段树是一棵**完全二叉树**（用数组存储），通常需要 **$4n$** 的空间。

```
                     [0, 5] sum=42
                   /            \
            [0, 2] sum=15       [3, 5] sum=27
           /        \           /        \
      [0, 1]      [2, 2]   [3, 4]      [5, 5]
      sum=6       sum=9    sum=16      sum=11
     /    \               /     \
  [0,0]  [1,1]         [3,3]   [4,4]
  sum=1   sum=5         sum=7    sum=9
```

### 节点的三个要素

每个节点维护三个信息：

- **区间左端点** $l$，**右端点** $r$
- **节点值** $val$（区间和、最大值、最小值等）

在实际实现中，$l$ 和 $r$ 由递归参数传递，数组只存储节点值。

---

## 基础实现：区间求和

### 建树 `build`

从根节点开始，递归地将区间一分为二，直到叶子节点。

```cpp
const int N = 100010;
int a[N];       // 原始数组
int tree[N * 4]; // 线段树数组，大小 4N

// 建树：将 a[l..r] 的信息存储到节点 p
void build(int p, int l, int r) {
    if (l == r) {
        tree[p] = a[l];  // 叶子节点直接赋值
        return;
    }
    int mid = (l + r) / 2;
    build(p * 2, l, mid);           // 左儿子
    build(p * 2 + 1, mid + 1, r);   // 右儿子
    tree[p] = tree[p * 2] + tree[p * 2 + 1];  // push_up：合并子节点信息
}
```

**父子关系**（数组存储约定）：

- 父节点下标 $p$，左儿子 $2p$，右儿子 $2p + 1$
- 左儿子区间 $[l, mid]$，右儿子区间 $[mid + 1, r]$

### 单点修改 `update`

修改位置 $pos$ 的值为 $val$，递归找到叶子并一层层向上更新。

```cpp
// 将 a[pos] 改为 val
void update(int p, int l, int r, int pos, int val) {
    if (l == r) {
        tree[p] = val;  // 找到目标叶子
        return;
    }
    int mid = (l + r) / 2;
    if (pos <= mid)
        update(p * 2, l, mid, pos, val);
    else
        update(p * 2 + 1, mid + 1, r, pos, val);
    tree[p] = tree[p * 2] + tree[p * 2 + 1];  // 更新后重新合并
}
```

### 区间查询 `query`

查询区间 $[ql, qr]$ 的和。若当前节点区间完全被查询区间覆盖，直接返回；否则递归子区间。

```cpp
// 查询 a[ql..qr] 的区间和
int query(int p, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr)  // 当前区间完全被包含
        return tree[p];
    int mid = (l + r) / 2;
    int ans = 0;
    if (ql <= mid)   // 左儿子与查询区间有交集
        ans += query(p * 2, l, mid, ql, qr);
    if (qr > mid)    // 右儿子与查询区间有交集
        ans += query(p * 2 + 1, mid + 1, r, ql, qr);
    return ans;
}
```

---

## 懒惰标记（Lazy Propagation）

当需要对**整个区间**进行修改（如区间加、区间赋值）时，逐元素修改退化到 $O(n \log n)$。**懒惰标记**是解决这一问题的关键技术。

### 核心思想

「不下传就不计算」。当修改操作覆盖当前节点区间时：

1. 更新当前节点的值
2. 在节点上打一个「懒标记」，表示「子树尚未更新」
3. 等下次需要访问子节点时，再将标记下传（`push_down`）

### 带懒标记的线段树

```cpp
using ll = long long;

ll tree[N * 4];  // 区间和
ll lazy[N * 4];  // 懒惰标记（区间加的增量）

// 将标记下传给子节点
void push_down(int p, int l, int r) {
    if (lazy[p] == 0) return;
    int mid = (l + r) / 2;
    int lc = p * 2, rc = p * 2 + 1;

    // 左儿子更新
    tree[lc] += lazy[p] * (mid - l + 1);  // 区间每个元素都加 lazy[p]
    lazy[lc] += lazy[p];

    // 右儿子更新
    tree[rc] += lazy[p] * (r - mid);
    lazy[rc] += lazy[p];

    lazy[p] = 0;  // 清除当前标记
}

// 区间加法：将 [ql, qr] 每个数加上 val
void update_range(int p, int l, int r, int ql, int qr, ll val) {
    if (ql <= l && r <= qr) {            // 完全覆盖
        tree[p] += val * (r - l + 1);    // 更新节点值
        lazy[p] += val;                  // 打标记
        return;
    }
    push_down(p, l, r);                  // 下传标记
    int mid = (l + r) / 2;
    if (ql <= mid)
        update_range(p * 2, l, mid, ql, qr, val);
    if (qr > mid)
        update_range(p * 2 + 1, mid + 1, r, ql, qr, val);
    tree[p] = tree[p * 2] + tree[p * 2 + 1];  // push_up
}

// 带懒标记的区间查询
ll query_range(int p, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr)
        return tree[p];
    push_down(p, l, r);  // 查询前先下传
    int mid = (l + r) / 2;
    ll ans = 0;
    if (ql <= mid)
        ans += query_range(p * 2, l, mid, ql, qr);
    if (qr > mid)
        ans += query_range(p * 2 + 1, mid + 1, r, ql, qr);
    return ans;
}
```

### 懒惰标记执行流程

```
区间 [2, 5] 全部 +3：

      [1, 5]          <- 不完整，继续递归
     /      \
  [1,2]    [3,5]      <- [3,5] 完全被覆盖！更新值 + 打标记
  /    \   /    \
...  ...  ...  ...    <- 子树 [3,4] 和 [5,5] 不会被访问到
```

:::tip[懒标记的妙处]
$n = 10^6$ 的区间加法，只需要修改 $\sim \log n$ 个节点。子树中的 $10^6$ 个元素「懒惰」地等待下次访问时才更新。
:::

---

## 多种节点信息维护

线段树不仅能维护区间和，还能维护更复杂的区间统计信息。

### 区间最大值

```cpp
// push_up 改为取 max
tree[p] = max(tree[p * 2], tree[p * 2 + 1]);

// 查询
int query_max(int p, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr) return tree[p];
    int mid = (l + r) / 2;
    int ans = INT_MIN;  // 注意初始值
    if (ql <= mid) ans = max(ans, query_max(p * 2, l, mid, ql, qr));
    if (qr > mid)  ans = max(ans, query_max(p * 2 + 1, mid + 1, r, ql, qr));
    return ans;
}
```

### 区间最大子段和

每个节点维护四个值：

- `sum`：区间总和
- `lmax`：最大前缀和
- `rmax`：最大后缀和
- `ma`：最大子段和

```cpp
struct Node {
    ll sum, lmax, rmax, ma;
} tree[N * 4];

Node push_up(Node L, Node R) {
    Node res;
    res.sum  = L.sum + R.sum;
    res.lmax = max(L.lmax, L.sum + R.lmax);
    res.rmax = max(R.rmax, R.sum + L.rmax);
    res.ma   = max({L.ma, R.ma, L.rmax + R.lmax});
    return res;
}
```

这是线段树**灵活性的极致体现**——只要合并操作满足**结合律**，线段树就能维护。

---

## 动态开点线段树

当值域很大（如 $[1, 10^9]$）但操作次数不多时，不可能开出 $4 \times 10^9$ 的数组。此时使用**动态开点**——需要节点时才创建。

```cpp
struct Node {
    int lc, rc;  // 左右儿子的节点编号
    ll sum;
} tree[N * 40];  // 根据操作次数估算
int tot = 0;      // 已分配的节点数

// 新建节点
int new_node() {
    tot++;
    tree[tot].lc = tree[tot].rc = tree[tot].sum = 0;
    return tot;
}

void update(int p, int l, int r, int pos, ll val) {
    if (l == r) {
        tree[p].sum += val;
        return;
    }
    int mid = (l + r) / 2;
    if (pos <= mid) {
        if (!tree[p].lc) tree[p].lc = new_node();  // 需要时创建
        update(tree[p].lc, l, mid, pos, val);
    } else {
        if (!tree[p].rc) tree[p].rc = new_node();
        update(tree[p].rc, mid + 1, r, pos, val);
    }
    tree[p].sum = tree[tree[p].lc].sum + tree[tree[p].rc].sum;
}
```

:::note
动态开点常用于**值域线段树**（权值线段树）、**线段树合并**等高级主题。
:::

---

## 常用技巧与优化

### 位运算优化

```cpp
// 使用位运算计算 mid，避免溢出
int mid = l + ((r - l) >> 1);

// 线段树节点编号使用堆式存储
#define lc (p << 1)       // p * 2
#define rc (p << 1 | 1)   // p * 2 + 1
```

### 标记永久化

对于某些问题，可以不下传标记，而在查询时「路过就计入」。这可以省去 `push_down` 的开销。

```cpp
// 区间赋值 + 区间查询最大值的标记永久化版本
void update(int p, int l, int r, int ql, int qr, int val) {
    if (ql <= l && r <= qr) {
        tag[p] = val;      // 永久标记
        tree[p] = val;     // 直接更新
        return;
    }
    int mid = (l + r) / 2;
    if (ql <= mid) update(lc, l, mid, ql, qr, val);
    if (qr > mid) update(rc, mid + 1, r, ql, qr, val);
    tree[p] = max(tree[lc], tree[rc]);  // 仍然需要 push_up
}

int query(int p, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr) return tree[p];
    int mid = (l + r) / 2;
    int ans = tag[p];  // 路过时计入标记值
    if (ql <= mid) ans = max(ans, query(lc, l, mid, ql, qr));
    if (qr > mid)  ans = max(ans, query(rc, mid + 1, r, ql, qr));
    return ans;
}
```

:::caution[标记永久化的限制]
标记永久化要求操作具有**交换律**和**幂等性**。区间加法不适合永久化（多次路过会重复加），区间赋值则适合。
:::

---

## 时间复杂度分析

| 操作                 | 时间复杂度  | 说明                |
| -------------------- | ----------- | ------------------- |
| 建树                 | $O(n)$      | 每个节点访问一次    |
| 单点修改             | $O(\log n)$ | 树高 $\log n$       |
| 区间修改（有懒标记） | $O(\log n)$ | 每层最多 $4$ 个节点 |
| 区间查询             | $O(\log n)$ | 同上                |

**空间复杂度**：$O(4n)$（堆式存储）或 $O(操作数 \times \log V)$（动态开点）。

---

## 练习题目推荐

| 题目                                                                                        | 难度   | 考察点                     |
| ------------------------------------------------------------------------------------------- | ------ | -------------------------- |
| [LC 307. Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/) | Medium | 单点修改 + 区间查询        |
| [洛谷 P3372 【模板】线段树 1](https://www.luogu.com.cn/problem/P3372)                       | 模板   | 区间加法 + 区间求和        |
| [洛谷 P3373 【模板】线段树 2](https://www.luogu.com.cn/problem/P3373)                       | 模板   | 区间乘 + 区间加 + 区间求和 |
| [LC 699. Falling Squares](https://leetcode.com/problems/falling-squares/)                   | Hard   | 区间最大值 + 区间赋值      |
| [SPOJ GSS1](https://www.spoj.com/problems/GSS1/)                                            | 经典   | 区间最大子段和             |

---

## 总结

1. 线段树是处理**区间修改与区间查询**的利器，复杂度均为 $O(\log n)$
2. **懒惰标记**是区间修改效率的保证，理解 `push_up` / `push_down` 的设计是关键
3. 节点信息可以是任何满足**结合律**的组合——和、最大值、最大子段和等
4. **动态开点**解决了值域过大的问题，也是主席树等高级数据结构的基础
5. 线段树的代码较长，建议**多写多背**，将模板当做肌肉记忆
