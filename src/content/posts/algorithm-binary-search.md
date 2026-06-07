---
title: 二分查找完全指南
published: 2026-06-07
description: "从原理到进阶：深入理解二分查找及其变体，掌握整数二分与浮点数二分的写法模板"
image: ""
tags: [算法, 二分查找, 数据结构, 竞赛编程]
category: 算法
draft: false
lang: zh
comment: true
---

## 什么是二分查找？

**二分查找**（Binary Search）是一种在**有序序列**中快速定位目标值的算法。它的核心思想是「折半排除」：每次将搜索范围缩小一半，直到找到目标或范围为空。

时间复杂度为 $O(\log n)$，空间复杂度为 $O(1)$。

:::tip[为什么是 $\log n$？]
每次比较后，搜索范围减半。从 $n$ 个元素中查找，最多需要 $\lceil \log_2 n \rceil$ 次比较。例如 $n = 10^6$ 时，最多仅需约 $20$ 次比较！
:::

---

## 经典二分查找

在一个**升序且无重复元素**的数组中查找目标值 `target`，返回其下标；若不存在，返回 $-1$。

### 算法步骤

1. 初始化左指针 $l = 0$，右指针 $r = n - 1$
2. 当 $l \le r$ 时：
   - 计算中间位置 $mid = \lfloor \frac{l + r}{2} \rfloor$
   - 若 $a[mid] = target$，返回 $mid$
   - 若 $a[mid] < target$，说明目标在右半部分，令 $l = mid + 1$
   - 若 $a[mid] > target$，说明目标在左半部分，令 $r = mid - 1$
3. 若循环结束仍未找到，返回 $-1$

### 代码实现

```cpp
// 在升序数组 a[0..n-1] 中查找 target，返回下标，不存在返回 -1
int binary_search(vector<int>& a, int target) {
    int l = 0, r = a.size() - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;  // 防止溢出
        if (a[mid] == target)
            return mid;
        else if (a[mid] < target)
            l = mid + 1;
        else
            r = mid - 1;
    }
    return -1;
}
```

> **注意**：使用 `mid = l + (r - l) / 2` 而非 `mid = (l + r) / 2`，是为了防止 $l + r$ 超出 `int` 范围导致溢出。

---

## 两种常用二分模板

在实际问题中，「是否存在」不如「第一个满足条件的位置」有用。下面给出两种通用模板。

### 模板一：查找左边界（第一个 $\ge target$）

寻找**第一个大于等于** `target` 的位置，即 C++ `std::lower_bound` 的行为。

```cpp
// 返回第一个 >= target 的下标，若全小于 target 则返回 n
int lower_bound(vector<int>& a, int target) {
    int l = 0, r = a.size();  // 注意：r 初始化为 n，而非 n-1
    while (l < r) {            // 注意：l < r，而非 l <= r
        int mid = l + (r - l) / 2;
        if (a[mid] >= target)
            r = mid;           // mid 可能为答案，保留在区间内
        else
            l = mid + 1;       // mid 一定不是答案
    }
    return l;  // l == r，即第一个 >= target 的位置
}
```

**模板要点**：

- 搜索区间 $[l, r)$ 是**左闭右开**的
- $r$ 初始化为 $n$（而非 $n-1$），因为答案可能是 $n$（表示不存在）
- 循环条件为 $l < r$，结束时 $l = r$
- $mid$ 不 +1，偏向左侧

### 模板二：查找右边界（最后一个 $\le target$）

寻找**最后一个小于等于** `target` 的位置。

```cpp
// 返回最后一个 <= target 的下标，若全大于 target 则返回 -1
int upper_bound_last(vector<int>& a, int target) {
    int l = -1, r = a.size() - 1;  // 注意：l 初始化为 -1
    while (l < r) {
        int mid = l + (r - l + 1) / 2;  // 向上取整，避免死循环
        if (a[mid] <= target)
            l = mid;               // mid 可能为答案
        else
            r = mid - 1;           // mid 一定不是答案
    }
    return l;  // l == r，即最后一个 <= target 的位置
}
```

**模板要点**：

- 搜索区间 $(l, r]$ 是**左开右闭**的
- $l$ 初始化为 $-1$（而非 $0$），因为答案可能是 $-1$（表示不存在）
- $mid$ 需要 **+1 向上取整**，当 $l$ 与 $r$ 相邻时避免死循环

:::warning[死循环警告]
在模板二中，`mid = l + (r - l) / 2` 是向下取整的。当 $l = 2, r = 3$ 时，$mid = 2$，若执行 $l = mid$，则区间不变，导致死循环。因此必须用 `mid = l + (r - l + 1) / 2` 向上取整。
:::

---

## 浮点数二分

浮点数二分不需要担心整数边界问题，直接按照精度要求来设定循环次数或误差范围。

### 示例：求平方根

```cpp
// 求 x 的平方根，误差 < 1e-8
double sqrt_binary(double x) {
    double l = 0, r = max(1.0, x);  // 处理 x < 1 的情况
    for (int i = 0; i < 100; i++) { // 迭代 100 次精度足够
        double mid = (l + r) / 2;
        if (mid * mid <= x)
            l = mid;
        else
            r = mid;
    }
    return l;
}
```

> 迭代 $100$ 次后，区间长度缩小到原来的 $2^{-100} \approx 10^{-30}$，精度远超一般需求。你也可以用 `while (r - l > 1e-8)` 来控制精度。

---

## STL 中的二分

C++ 标准库提供了三个二分查找函数，均作用于**有序序列**：

| 函数            | 返回值 | 行为                |
| --------------- | ------ | ------------------- |
| `binary_search` | `bool` | 是否存在            |
| `lower_bound`   | 迭代器 | 第一个 $\ge target$ |
| `upper_bound`   | 迭代器 | 第一个 $> target$   |

```cpp
vector<int> a = {1, 3, 5, 5, 7, 9};

bool exists = binary_search(a.begin(), a.end(), 5);    // true
auto lb = lower_bound(a.begin(), a.end(), 5);          // 指向第一个 5（下标 2）
auto ub = upper_bound(a.begin(), a.end(), 5);          // 指向 7（下标 4）
int  cnt = ub - lb;                                    // 5 的个数 = 2
```

---

## 经典应用：二分答案

二分答案是一类重要的问题类型——当问题满足**单调性**时，我们可以二分枚举答案，再验证这个答案是否可行。

### 一般步骤

1. **确定答案范围**：找到最小可能值 $L$ 和最大可能值 $R$
2. **二分枚举**：令 $mid = \frac{L + R}{2}$
3. **验证可行性**：写一个 `check(mid)` 函数判断 $mid$ 是否可行
4. **调整范围**：根据 $check(mid)$ 的结果调整 $L$ 或 $R$
5. **输出答案**：循环结束后 $L$（或 $R$）即为最优解

### 示例：砍树问题

> 有 $n$ 棵树，第 $i$ 棵高度为 $h_i$。伐木工需要至少 $M$ 米的木材。锯子设定一个高度 $H$，所有高于 $H$ 的部分都会被砍下。求能获得至少 $M$ 米木材的最大 $H$。

```cpp
using ll = long long;

bool check(ll H, vector<ll>& h, ll M) {
    ll total = 0;
    for (ll x : h) {
        if (x > H) total += x - H;
        if (total >= M) return true;  // 提前终止优化
    }
    return total >= M;
}

ll solve(vector<ll>& h, ll M) {
    ll l = 0, r = *max_element(h.begin(), h.end());
    while (l < r) {
        ll mid = l + (r - l + 1) / 2;  // 模板二：找最大可行值
        if (check(mid, h, M))
            l = mid;   // mid 可行，尝试更高的高度
        else
            r = mid - 1;
    }
    return l;
}
```

---

## 常见错误与调试技巧

:::caution[常见错误]

1. **忘记数组必须有序**：二分查找的前提是序列有序，否则结果不可预测
2. **循环条件写错**：$l \le r$ vs $l < r$ 取决于区间定义
3. **$mid$ 计算溢出**：务必使用 `l + (r - l) / 2`
4. **模板二死循环**：$mid$ 必须向上取整
5. **返回值边界**：
   - `lower_bound` 的返回值是 $[0, n]$，$n$ 表示不存在
   - 模板二的返回值是 $[-1, n-1]$，$-1$ 表示不存在
     :::

### 调试方法

```cpp
// 调试打印版二分
int binary_search_debug(vector<int>& a, int target) {
    int l = 0, r = a.size() - 1;
    int iter = 0;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        printf("iter=%d: l=%d, r=%d, mid=%d, a[mid]=%d\n",
               ++iter, l, r, mid, a[mid]);
        if (a[mid] == target) return mid;
        else if (a[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    return -1;
}
```

---

## 练习题目推荐

按照难度递增：

| 题目                                                                                                                          | 难度   | 类型         |
| ----------------------------------------------------------------------------------------------------------------------------- | ------ | ------------ |
| [LC 704. Binary Search](https://leetcode.com/problems/binary-search/)                                                         | Easy   | 经典二分     |
| [LC 35. Search Insert Position](https://leetcode.com/problems/search-insert-position/)                                        | Easy   | lower_bound  |
| [LC 34. Find First and Last Position](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) | Medium | 双边界二分   |
| [LC 875. Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)                                             | Medium | 二分答案     |
| [LC 410. Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/)                                     | Hard   | 二分答案进阶 |

---

## 总结

1. 二分的本质是**在单调性中快速定位边界**
2. 整数二分需要清晰的**区间定义**和正确的**边界更新**
3. 浮点数二分更简单，迭代固定次数即可
4. **二分答案**是最重要的应用场景，关键在于写出正确的 $check$ 函数
5. 多写多练，形成肌肉记忆——二分是最容易「一看就会，一写就错」的算法
