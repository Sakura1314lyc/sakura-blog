---
title: 十大排序算法详解
published: 2026-06-21
description: "从 O(n²) 到 O(n)：冒泡、选择、插入、希尔、归并、快速、堆、计数、桶、基数排序的完整实现、复杂度对比与经典例题"
image: ""
tags: [算法, 排序, 数据结构, 竞赛编程]
category: 算法
draft: false
lang: zh
comment: true
---

## 总览

| 算法 | 最好 | 平均 | 最坏 | 空间 | 稳定 |
|:---|:---|:---|:---|:---|:---|
| 冒泡排序 | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | ✓ |
| 选择排序 | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | ✗ |
| 插入排序 | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | ✓ |
| 希尔排序 | $O(n\log n)$ | $O(n^{1.3})$ | $O(n^2)$ | $O(1)$ | ✗ |
| 归并排序 | $O(n\log n)$ | $O(n\log n)$ | $O(n\log n)$ | $O(n)$ | ✓ |
| 快速排序 | $O(n\log n)$ | $O(n\log n)$ | $O(n^2)$ | $O(\log n)$ | ✗ |
| 堆排序 | $O(n\log n)$ | $O(n\log n)$ | $O(n\log n)$ | $O(1)$ | ✗ |
| 计数排序 | — | $O(n+k)$ | $O(n+k)$ | $O(n+k)$ | ✓ |
| 桶排序 | — | $O(n)$ | $O(n^2)$ | $O(n)$ | 取决于桶内 |
| 基数排序 | — | $O(d \cdot n)$ | $O(d \cdot n)$ | $O(n+k)$ | ✓ |

> $k$ = 数据范围，$d$ = 数字位数

---

## 一、O(n²) 基础排序

### 1.1 冒泡排序

每轮将当前未排序区间内的最大值"冒"到最后。

```cpp
void bubbleSort(vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (nums[j] > nums[j + 1]) {
                swap(nums[j], nums[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break; // 提前终止，最好 O(n)
    }
}
```

- **最好**：已有序，$O(n)$
- **稳定**：相等元素不交换
- **优化**：设置 `swapped` 标志，一轮无交换则提前结束

### 1.2 选择排序

每次从未排序区间中选择最小元素，放到已排序区间的末尾。

```cpp
void selectionSort(vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (nums[j] < nums[minIdx]) minIdx = j;
        }
        swap(nums[i], nums[minIdx]);
    }
}
```

- **时间复杂度恒为 $O(n^2)$**，无法被优化
- **不稳定**：交换可能破坏相等元素的相对顺序

### 1.3 插入排序

将未排序元素逐个插入到已排序区间的正确位置。

```cpp
void insertionSort(vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        for (int j = i; j > 0; j--) {
            if (nums[j] < nums[j - 1]) swap(nums[j], nums[j - 1]);
            else break; // 找到位置，提前终止
        }
    }
}
```

- **最好** $O(n)$，数组有序时内循环全部 `break`
- **稳定**：等值元素不跨越
- 综合性能优于冒泡排序，小规模数据首选

> 插入排序是希尔排序的基础，也是归并排序小规模回退策略的常用选择。

---

## 二、O(n log n) 进阶排序

### 2.1 希尔排序

希尔排序是插入排序的改进：先对间隔为 $h$ 的元素做插入排序，逐步缩小 $h$ 直到 $h=1$。

**核心概念**：$h$ 有序数组——任意间隔为 $h$ 的元素对都是有序的。当 $h=1$ 时即对整个数组完成排序。

**增量序列**：不同序列对性能影响显著。

| 序列 | $h_k$ 递推 | 时间复杂度 |
|:---|:---|:---|
| Shell 原始 | $h_k = \lfloor n/2^k \rfloor$ | $O(n^2)$ 最坏 |
| Knuth | $h_k = 3h_{k-1}+1$ | $O(n^{1.5})$ |

```cpp
void shellSort(vector<int>& nums) {
    int n = nums.size();
    // Knuth 序列: 1, 4, 13, 40, ...
    int h = 1;
    while (h < n / 3) h = 3 * h + 1;

    while (h >= 1) {
        // 对每个 h 子序列做插入排序
        for (int i = h; i < n; i++) {
            for (int j = i; j >= h; j -= h) {
                if (nums[j] < nums[j - h]) swap(nums[j], nums[j - h]);
                else break;
            }
        }
        h /= 3;
    }
}
```

- **不稳定**：跨间隔交换破坏顺序
- 不需要额外空间，小规模数据实用性强

### 2.2 归并排序

分治思想的典范：先递归排序左右两半，再合并两个有序数组。

> 快速排序是**前序遍历**（先排好 pivot，再递归），归并排序是**后序遍历**（先递归排好子数组，再合并）。

```cpp
void merge(vector<int>& nums, int left, int mid, int right) {
    vector<int> temp;
    int i = left, j = mid + 1;
    while (i <= mid && j <= right) {
        if (nums[i] <= nums[j]) temp.push_back(nums[i++]);
        else temp.push_back(nums[j++]);
    }
    while (i <= mid) temp.push_back(nums[i++]);
    while (j <= right) temp.push_back(nums[j++]);
    for (int k = 0; k < temp.size(); k++) nums[left + k] = temp[k];
}

void mergeSort(vector<int>& nums, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(nums, left, mid);
    mergeSort(nums, mid + 1, right);
    merge(nums, left, mid, right);
}
```

- **稳定**：合并时 `<=` 保证左半部分优先
- 唯一缺点是需要 $O(n)$ 额外空间
- 适合**链表排序**和**外部排序**

### 2.3 快速排序

Lomuto 分区法：选取 pivot（通常为最右元素），将小于 pivot 的放左边，大于的放右边。

> 运用了**二叉树前序遍历**的思想：在递归前将 pivot 放到正确位置。

```cpp
int partition(vector<int>& nums, int l, int r) {
    int pivot = nums[r];
    int i = l - 1;
    for (int j = l; j < r; j++) {
        if (nums[j] <= pivot) swap(nums[++i], nums[j]);
    }
    swap(nums[i + 1], nums[r]);
    return i + 1;
}

void quickSort(vector<int>& nums, int l, int r) {
    if (l >= r) return;
    int p = partition(nums, l, r);
    quickSort(nums, l, p - 1);
    quickSort(nums, p + 1, r);
}
```

- **不稳定**：Lomuto 划分打乱相等元素顺序
- 最坏 $O(n^2)$（每次 pivot 都是极值），可通过随机 pivot 或三数取中优化
- 实际应用中常比归并排序更快（常数小、缓存友好）

### 2.4 堆排序

利用二叉堆：建堆 + 反复删除堆顶。分为两步：

1. **原地建堆**：从最后一个非叶节点（`n/2 - 1`）向下沉（sink），$O(n)$
2. **排序**：反复将堆顶（最大值）与末尾交换，缩小堆，再 sink，$O(n\log n)$

```cpp
void maxHeapSink(vector<int>& heap, int node, int size) {
    while (true) {
        int left = node * 2 + 1, right = node * 2 + 2;
        int largest = node;
        if (left < size && heap[left] > heap[largest]) largest = left;
        if (right < size && heap[right] > heap[largest]) largest = right;
        if (largest == node) break;
        swap(heap[node], heap[largest]);
        node = largest;
    }
}

void heapSort(vector<int>& nums) {
    int n = nums.size();
    // 原地建大顶堆
    for (int i = n / 2 - 1; i >= 0; i--) maxHeapSink(nums, i, n);
    // 排序
    int heapSize = n;
    while (heapSize > 0) {
        swap(nums[0], nums[heapSize - 1]);
        heapSize--;
        maxHeapSink(nums, 0, heapSize);
    }
}
```

- **不稳定**
- $O(n \log n)$ 且**原地排序**
- 适合需要严格 $O(n \log n)$ 且限内存的场景（如 STL 的 `partial_sort`）

---

## 三、线性时间排序

这三种不基于比较，利用数据本身的特性。

### 3.1 计数排序

统计每种元素出现的次数，推算出每个元素在排序后的位置。

```cpp
void countingSort(vector<int>& nums) {
    int minVal = *min_element(nums.begin(), nums.end());
    int maxVal = *max_element(nums.begin(), nums.end());
    int offset = -minVal;
    vector<int> count(maxVal - minVal + 1, 0);

    for (int num : nums) count[num + offset]++;
    for (int i = 1; i < count.size(); i++) count[i] += count[i - 1];

    vector<int> sorted(nums.size());
    for (int i = nums.size() - 1; i >= 0; i--) {
        sorted[--count[nums[i] + offset]] = nums[i];
    }
    nums = sorted;
}
```

- **复杂度 $O(n+k)$**，$k = \max - \min$
- **稳定**（从后往前填保证）
- $k$ 不能太大，否则空间爆炸

### 3.2 桶排序

将元素分配到若干桶中，桶内排序后合并。

三步：**分配 → 桶内排序 → 合并**

```cpp
void bucketSort(vector<int>& nums) {
    int n = nums.size();
    if (n <= 1) return;
    int bucketNum = max(2, (int)sqrt(n));
    double range = (*max_element(nums.begin(),nums.end()) 
                   - *min_element(nums.begin(),nums.end()) + 1.0) / bucketNum;

    vector<vector<int>> buckets(bucketNum);
    for (int num : nums) {
        int idx = (num - *min_element(nums.begin(),nums.end())) / range;
        if (idx >= bucketNum) idx = bucketNum - 1;
        buckets[idx].push_back(num);
    }

    nums.clear();
    for (auto& bucket : buckets) {
        sort(bucket.begin(), bucket.end()); // 可用任意排序
        nums.insert(nums.end(), bucket.begin(), bucket.end());
    }
}
```

- 均匀分布时期望 $O(n)$
- 桶内排序可用插入排序（小桶快）或递归桶排序

### 3.3 基数排序

计数排序的扩展：对元素的每一位（十进制位）依次做计数排序。因为计数排序稳定，低位排序后高位不会打乱。

**LSD（低位优先）**：从个位向高位逐位排序，最常用。

```cpp
void radixSort(vector<int>& nums) {
    int offset = -*min_element(nums.begin(), nums.end());
    for (int& x : nums) x += offset; // 转非负

    int maxVal = *max_element(nums.begin(), nums.end());
    int maxLen = 0;
    while (maxVal) { maxVal /= 10; maxLen++; }

    for (int k = 0; k < maxLen; k++) {
        vector<int> count(10, 0);
        for (int x : nums) count[(x / (int)pow(10,k)) % 10]++;
        for (int i = 1; i < 10; i++) count[i] += count[i - 1];
        vector<int> sorted(nums.size());
        for (int i = nums.size() - 1; i >= 0; i--)
            sorted[--count[(nums[i]/(int)pow(10,k))%10]] = nums[i];
        nums = sorted;
    }

    for (int& x : nums) x -= offset; // 还原
}
```

- $O(d \cdot n)$，$d$ = 位数
- **稳定**
- 可换基底（如 256 针对字节）

---

## 四、算法选择指南

| 场景 | 推荐算法 |
|:---|:---|
| $n \le 50$ | 插入排序 |
| $n$ 较大，需稳定 | 归并排序 |
| $n$ 较大，不要求稳定 | 快速排序（随机 pivot） |
| 需严格 $O(n\log n)$ 且原地 | 堆排序 |
| 整数，范围 $k$ 小 | 计数排序 |
| 浮点数，均匀分布 | 桶排序 |
| 整数，位数少 | 基数排序 |
| 链表 | 归并排序 |

---

## 五、习题推荐

| 题目 | 难度 | 考点 |
|:---|:---|:---|
| [洛谷 P1177 排序](https://www.luogu.com.cn/problem/P1177) | 普及− | 快排/归并模板 |
| [洛谷 P1908 逆序对](https://www.luogu.com.cn/problem/P1908) | 普及+/提高 | 归并排序统计逆序对 |
| [洛谷 P1923 求第 k 小的数](https://www.luogu.com.cn/problem/P1923) | 普及− | 快速选择 |
| [洛谷 P1116 车厢重组](https://www.luogu.com.cn/problem/P1116) | 普及− | 冒泡排序交换次数 |
| [洛谷 P1093 奖学金](https://www.luogu.com.cn/problem/P1093) | 普及− | 多关键字排序 |
| [洛谷 P1309 瑞士轮](https://www.luogu.com.cn/problem/P1309) | 普及+/提高 | 归并思想 |
| [洛谷 P1966 火柴排队](https://www.luogu.com.cn/problem/P1966) | 提高+/省选 | 逆序对 + 离散化 |
| [洛谷 P2824 排序](https://www.luogu.com.cn/problem/P2824) | 提高+/省选 | 二分 + 线段树排序 |
| [Codeforces 1608C](https://codeforces.com/problemset/problem/1608/C) | 提高 | 拓扑排序思想 |
| [AtCoder ABC241D](https://atcoder.jp/contests/abc241/tasks/abc241_d) | 普及+/提高 | set 模拟插入排序 |
| [AtCoder ABC261F](https://atcoder.jp/contests/abc261/tasks/abc261_f) | 提高 | 归并排序 + 逆序对 |
| [USACO Sort](https://usaco.org/index.php?page=viewproblem2&cpid=1037) | 提高 | 冒泡排序优化分析 |
