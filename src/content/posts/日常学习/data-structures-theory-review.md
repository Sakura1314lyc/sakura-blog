---
title: 数据结构理论期末复习（常考知识点）
published: 2026-06-15
description: "基于历年真题整理的数据结构理论课常考知识点，涵盖时间复杂度、栈与队列、树与二叉树、图论、查找、排序与算法设计，每个知识点配一道真题例题"
image: ""
tags: [数据结构, 期末复习]
category: 日常学习
draft: false
lang: zh
comment: true
---

## 前言

本文基于**2024 春、2025 秋转专业、2025 正考**数据结构回忆版真题以及**理论课后半部分重点**PPT，提炼出期末考试的高频考点。每个知识点配一道真题风格的例题。

---

## 一、时间复杂度分析（简答题 5 分）

**核心考察**：循环嵌套的复杂度推导，单循环中步长呈指数/对数变化的复杂度。

### 例题（2025 转专业真题）

```cpp
int geti(int m) {
    for (int i = 1; i < m / 2;) {
        i = 2 * i;
    }
    return i;
}
```

**答案**：$O(\log m)$。循环变量 $i$ 每次翻倍（$i = 2i$），从 $1$ 增长到 $m/2$ 需要 $\log_2(m/2) = \log_2 m - 1$ 次迭代。

### 例题（2025 正考真题）

```cpp
void func(int n) {
    int m = 0;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= 2 * i; j++) m++;
}
```

**答案**：$O(n^2)$。内层循环执行 $\sum_{i=1}^n 2i = n(n+1)$ 次，量级为 $n^2$。

### 常考复杂度速记

| 代码模式                                   | 复杂度       |
| ------------------------------------------ | ------------ |
| `for(i=1;i<=n;i*=2)`                       | $O(\log n)$  |
| `for(i=n;i>=1;i/=2)`                       | $O(\log n)$  |
| 两层 `for(i=1;i<=n;i++) for(j=1;j<=n;j++)` | $O(n^2)$     |
| `for(i=1;i<=n;i++) for(j=1;j<=i;j++)`      | $O(n^2)$     |
| `for(i=1;i<=n;i*=2) for(j=1;j<=n;j++)`     | $O(n\log n)$ |

---

## 二、链表（必考：简答 5 分 + 算法设计 15 分）

链表是期末考试**高频考点**。双链表的插入/删除操作在 2024 和 2025 连续两年出现在**简答题**中，而基于链表的算法设计也经常作为压轴题。

### 2.1 单链表与双链表的结构体定义

```cpp
// 单链表节点
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// 双链表节点
struct Node {
    int val;
    Node* prior;  // 前驱指针
    Node* next;   // 后继指针
};
```

### 2.2 单链表基本操作（常考代码）

#### 头插法建立单链表

```cpp
ListNode* head = nullptr;
for (int i = 0; i < n; i++) {
    ListNode* node = new ListNode(val);
    node->next = head;
    head = node;
}
```

#### 尾插法建立单链表（保持输入顺序）

```cpp
ListNode *head = nullptr, *tail = nullptr;
for (int i = 0; i < n; i++) {
    ListNode* node = new ListNode(val);
    if (!head) head = tail = node;
    else { tail->next = node; tail = node; }
}
```

#### 单链表反转（经典三指针）

```cpp
ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *cur = head;
    while (cur) {
        ListNode* nxt = cur->next;  // 暂存下一个
        cur->next = prev;           // 反转指针
        prev = cur;                 // prev 前进
        cur = nxt;                  // cur 前进
    }
    return prev;  // 新头节点
}
```

#### 单链表中删除指定值的所有节点

```cpp
ListNode* removeElements(ListNode* head, int target) {
    ListNode dummy(0);                // 哑节点，统一处理头节点
    dummy.next = head;
    ListNode* p = &dummy;
    while (p->next) {
        if (p->next->val == target) {
            ListNode* del = p->next;
            p->next = p->next->next;  // 跨过被删节点
            delete del;
        } else {
            p = p->next;
        }
    }
    return dummy.next;
}
```

#### 单链表在指定位置插入节点

```cpp
// 在值为 x 的节点后面插入新节点 q
void insertAfter(ListNode* p, ListNode* q) {
    q->next = p->next;
    p->next = q;
}

// 在值为 x 的节点前面插入新节点 q（需要找到前驱）
void insertBefore(ListNode* head, ListNode* p, ListNode* q) {
    // 找 p 的前驱
    ListNode* prev = head;
    while (prev && prev->next != p) prev = prev->next;
    if (prev) {
        q->next = p;
        prev->next = q;
    }
}
```

#### 单链表删除指定节点

```cpp
// 删除 p 的后继节点
void deleteAfter(ListNode* p) {
    if (!p || !p->next) return;
    ListNode* del = p->next;
    p->next = p->next->next;
    delete del;
}

// 删除节点 p 本身（需要找前驱）
void deleteNode(ListNode* head, ListNode* p) {
    ListNode* prev = head;
    while (prev && prev->next != p) prev = prev->next;
    if (prev) {
        prev->next = p->next;
        delete p;
    }
}
```

### 2.3 双链表的插入与删除（简答题高频）

双链表的操作关键在于**同时维护前驱和后继两个指针**，操作顺序至关重要。

#### 双链表在节点 p 后面插入新节点 q

```
操作前:  ... ⇄ p ⇄ p->next ⇄ ...
操作后:  ... ⇄ p ⇄ q ⇄ p->next(原) ⇄ ...
```

```cpp
void insertAfter(Node* p, Node* q) {
    q->next = p->next;        // ① q 的后继 = p 原来的后继
    q->prior = p;             // ② q 的前驱 = p
    if (p->next)              // ③ 若 p 不是最后一个节点
        p->next->prior = q;   //    原后继的前驱指向 q
    p->next = q;              // ④ p 的后继指向 q
}
```

:::tip[操作顺序为什么重要]
先设置 q 的两个指针（①②），再修改周围节点指向 q（③④）。如果反过来先修改 `p->next = q`，就丢失了原后继的引用，无法再让原后继的前驱指向 q。
:::

#### 双链表在节点 p 前面插入新节点 q（2024 真题 / 2025 真题）

```
操作前:  ... ⇄ p->prior ⇄ p ⇄ ...
操作后:  ... ⇄ p->prior ⇄ q ⇄ p ⇄ ...
```

```cpp
void insertBefore(Node* p, Node* q) {
    q->prior = p->prior;      // ① q 的前驱 = p 原来的前驱
    q->next = p;              // ② q 的后继 = p
    if (p->prior)             // ③ 若 p 不是第一个节点
        p->prior->next = q;   //    原前驱的后继指向 q
    p->prior = q;             // ④ p 的前驱指向 q
}
```

**考试画图要求**：画出操作前后的节点连接关系，用序号标注操作步骤。四个指针的修改顺序必须准确。

#### 双链表删除节点 p

```cpp
void deleteNode(Node* p) {
    if (!p) return;
    if (p->prior)              // p 有前驱
        p->prior->next = p->next;
    if (p->next)               // p 有后继
        p->next->prior = p->prior;
    delete p;
}
```

只需修改两个指针——让 p 的前驱和后继互相连接，跨过 p 即可。不需要遍历找到前驱，这是双链表相比单链表的优势。

#### 双链表删除节点 p 的后继

```cpp
void deleteAfter(Node* p) {
    if (!p || !p->next) return;   // p 为空或无后继
    Node* del = p->next;
    p->next = del->next;          // p 跨过 del
    if (del->next)                // del 有后继
        del->next->prior = p;     // 后继的前驱回指 p
    delete del;
}
```

#### 双链表删除节点 p 的前驱

```cpp
void deleteBefore(Node* p) {
    if (!p || !p->prior) return;   // p 为空或无前驱
    Node* del = p->prior;
    p->prior = del->prior;         // p 跨过 del
    if (del->prior)                // del 有前驱
        del->prior->next = p;      // 前驱的后继回指 p
    delete del;
}
```

### 2.4 循环链表

#### 循环单链表：判断是否到尾

```cpp
// 遍历循环单链表
void traverse(ListNode* head) {
    if (!head) return;
    ListNode* p = head;
    do {
        cout << p->val << " ";
        p = p->next;
    } while (p != head);  // 绕一圈回到头
}
```

#### 循环双链表：判断空表

```cpp
// 空表：head->next == head && head->prior == head
bool isEmpty(Node* head) {
    return head->next == head && head->prior == head;
}
```

### 2.5 链表常见考试题型总结

| 考点                            | 出现年份   | 题型                      |
| ------------------------------- | ---------- | ------------------------- |
| 双链表节点前插入（画图 + 代码） | 2024、2025 | 简答题 5 分               |
| 单链表反转                      | 常考       | 算法题 / 选择题           |
| 快慢指针找中间节点              | 间接考     | Floyd 判圈 / reorder list |
| 链表删除节点（单/双）           | 常考       | 代码填空                  |
| $O(m)$ 时间 $O(1)$ 空间遍历输出 | 2024       | 算法设计 15 分            |
| 头插法 vs 尾插法建表            | 常考       | 判断题 / 代码题           |

### 2.6 快慢指针技巧

```cpp
// 找中间节点
ListNode* findMiddle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;  // slow 停在中间(偶数个时停在后半段的开头)
}

// 判断链表是否有环（Floyd 判圈算法）
bool hasCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;   // 快慢指针相遇 = 有环
    }
    return false;
}

// 找环的入口
ListNode* detectCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {              // 相遇后
            ListNode* p = head;          // p 从头出发
            while (p != slow) {          // p 和 slow 同步走
                p = p->next;
                slow = slow->next;
            }
            return p;                    // 再次相遇点 = 环入口
        }
    }
    return nullptr;
}
```

### 2.7 单链表合并（有序）

```cpp
// 合并两个升序单链表，结果仍为升序
ListNode* mergeTwoLists(ListNode* a, ListNode* b) {
    ListNode dummy(0);
    ListNode* tail = &dummy;
    while (a && b) {
        if (a->val <= b->val) { tail->next = a; a = a->next; }
        else                   { tail->next = b; b = b->next; }
        tail = tail->next;
    }
    tail->next = a ? a : b;  // 接上剩余部分
    return dummy.next;
}
```

---

## 三、栈与队列（简答题 5-10 分）

### 2.1 合法出栈序列

**考点**：给定入栈顺序，判断某个序列是否合法、或枚举所有可能的出栈序列。

**判定方法**：在任意时刻，已入栈但未出栈的元素必须满足「后进先出」——若某元素 $x$ 已出栈，则所有在 $x$ 之前入栈且尚未出栈的元素必须按入栈的逆序排列。

**例题（2024 真题）**：入栈顺序 A、B、C、D，找出以 B 开头的所有合法出栈序列。

**答案**：合法出栈序列 5 种：B A D C、B C D A、B C A D、B D C A、B A C D。

### 2.2 中缀转后缀

**考点**：手工转换中缀表达式为后缀表达式，以及辅助栈的深度。

**规则**：

1. 操作数直接输出
2. 运算符与栈顶比较优先级：当前 $\le$ 栈顶时，弹出栈顶；再将当前压栈
3. 左括号直接入栈，右括号弹出直到遇到左括号

**例题（2025 真题）**：将 $(a + b * c / d) * e + f$ 转为后缀。问读到 `/` 时栈的内容。

**步骤**：

```
读 '(' : 栈 = (
读 'a' : 输出 a
读 '+' : 栈 = ( +
读 'b' : 输出 b
读 '*' : 栈 = ( + *
读 'c' : 输出 c
读 '/' : * 优先级 >= /，弹出 * → 输出 *；栈 = ( + ；再压入 / → 栈 = ( + /
```

**答案**：读到 `/` 时栈内容：`( + /`。后缀表达式：`a b c * d / + e * f +`

**栈深度**：该表达式中辅助栈最大深度为 $4$（`(` `+` `*` `/` 四者同时在栈时不会出现——最深为 `( + *` 或 `( + /`，深度为 $3$）。

---

## 四、树与二叉树（简答 10 分 + 应用 10 分 + 算法 15 分）

### 4.1 二叉树五条重要性质

| #   | 性质                                                                       |
| --- | -------------------------------------------------------------------------- |
| 1   | 第 $i$ 层最多 $2^{i-1}$ 个结点                                             |
| 2   | 深度 $k$ 的二叉树最多 $2^k-1$ 个结点                                       |
| 3   | **$n_0 = n_2 + 1$**（叶子数 = 度为 2 的结点数 + 1）                        |
| 4   | $n$ 个结点的完全二叉树深度 $\lceil \log_2(n+1) \rceil$                     |
| 5   | 完全二叉树编号：$i$ 的左孩子 $2i$，右孩子 $2i+1$，父 $\lfloor i/2 \rfloor$ |

**例题（2024 真题）**：$n = 114$ 个结点的完全二叉树，求 $n_0$、$n_1$、$n_2$。

**解**：完全二叉树 $n_1 = 0$ 或 $1$。

- $n_0 = n_2 + 1$，且 $n = n_0 + n_1 + n_2 = 2n_2 + 1 + n_1$
- $114 = 2n_2 + 1 + n_1$ → $2n_2 = 113 - n_1$
- $n_1 = 1$ 时 $n_2 = 56$，$n_0 = 57$ ✓
- $n_1 = 0$ 时 $n_2 = 56.5$ ✗

**答案**：$n_0=57$、$n_1=1$、$n_2=56$。

**例题（2025 转专业真题）**：完全二叉树第 9 层有 242 个结点，求总结点数、叶子数。

**解**：前 8 层满：$2^8-1=255$。第 9 层可能（最大 $2^8=256$），已有 242 个，缺 14 个。但第 9 层不满意味着第 10 层部分有孩子。第 9 层第 $242$ 个结点的父节点 $\lfloor 242/2 \rfloor = 121$，故前 121 个第 9 层结点有 $121 \times 2 = 242$ 个孩子在第 10 层。又因缺 14 个→最后一个有孩子的第 9 层结点编号 $=256-7=249$（第 9 层缺的 14 个从右往左，前 121 个和第 122-249 中的部分有孩子）。

总结点数 $=255+242+(249-121)\times 2 = 255+242+256 = 753$。
叶子数 $=n_0 =$ 第 10 层 256 个 + 第 9 层无孩子的 $(242-128) = 256+114 = 370$。

### 3.2 已知遍历序列构建二叉树

**必考题型**：给定中序 + 后序（或中序 + 先序），画出二叉树并写出另一种遍历。

**方法**：后序最后一个/先序第一个 = 根，在中序中定位根后划分左右子树，递归构造。

**例题（2025 真题）**：中序 `D B E A F C G`，后序 `D E B F G C A`，画树并求先序。

**解**：

- 后序最后一个 `A` 为根，中序 `A` 左边 `D B E` 为左子树，右边 `F C G` 为右子树
- 左子树 `{D,B,E}` 的后序为 `D E B`（后序的前 3 个），根为 `B`
- `B` 在中序中，左边 `D`、右边 `E` → `B` 的左子 `D`，右子 `E`
- 右子树 `{F,C,G}` 的后序为 `F G C`，根为 `C`
- `C` 在中序中，左边 `F`、右边 `G` → `C` 的左子 `F`，右子 `G`

**先序**：`A B D E C F G`

### 3.3 哈夫曼树与哈夫曼编码

**考点**：构建哈夫曼树、计算 WPL、平均编码长度、与等长编码比较。

**例题（2025 真题风格）**：字符频率 $a:15, b:7, c:25, d:10, e:20, f:5, g:18$。构建哈夫曼树，求编码，计算平均编码长度和节省的比特。

**构建**（从小到大合并）：

```
f(5)+b(7)=12, a(15)+d(10)=25, 12+g(18)=30,
c(25)+e(20)=45, 30+25=55, 45+55=100
```

**编码**（左 0 右 1）：

| 字符 | a   | b    | c   | d   | e   | f    | g   |
| ---- | --- | ---- | --- | --- | --- | ---- | --- |
| 编码 | 101 | 0001 | 11  | 100 | 01  | 0000 | 001 |

**WPL** $= 15\times 3 + 7\times 4 + 25\times 2 + 10\times 3 + 20\times 2 + 5\times 4 + 18\times 3 = 45+28+50+30+40+20+54 = 267$

**平均编码长度** $= 267/100 = 2.67$ 比特/字符。

**等长编码**：$n=7$ 个字符，需 $\lceil \log_2 7 \rceil = 3$ 比特/字符，总长 $= 300$。

**节省**：$300 - 267 = 33$ 比特，节省比例 $\approx 11\%$。

### 3.4 树、森林与二叉树的转换

**森林 → 二叉树**规则：

1. 每棵树各自转为二叉树（左孩子右兄弟）
2. 第一棵树的根作为总根，后续树的根依次作为前一棵树的右孩子

**例题（2025 真题）**：将给定森林转化为二叉树。

**解**：先将每棵树用「左孩子右兄弟」变成二叉树，再用右指针串联各树的根。

### 3.5 二叉搜索树（BST）与 ASL

**例题（2025 真题）**：按顺序 `45, 24, 53, 12, 37, 93, 8, 26, 48, 76` 构建 BST，分别计算等概率下的 $ASL_{成功}$ 和 $ASL_{失败}$。

**构建 BST**：

```
        45
       /  \
     24    53
    / \    / \
  12  37  48  93
 /   /       /
8   26      76
```

**ASL 成功**：各结点深度（根深度 = 1）
$1+2+2+3+3+3+3+4+4+4 = 29$，$\text{ASL}_{成功} = 29/10 = 2.9$。

**ASL 失败**：BST 共有 11 个空指针位置（失败结点），分布在深度 $3$、$4$、$5$ 三层。近似计算 $\text{ASL}_{失败} = (3\times 4 + 4\times 5 + 5\times 2)/11 \approx 3.82$。

---

## 四、图论（选择题 5 分 + 应用题 10 分）

### 4.1 邻接矩阵与图的遍历

**例题（2025 真题）**：已知无向图的邻接矩阵（下三角压缩存储在一维数组中），画出图并画出 DFS 树和 BFS 树。

**解**：先将下三角还原为邻接矩阵，画出图。DFS 树 = 从起点出发按深度优先遍历生成的生成树（树边 + 回边）。BFS 树 = 按广度优先遍历生成的生成树。

### 4.2 Dijkstra 最短路径（必考）

**例题（2025/2024 真题）**：给定有向图，用 Dijkstra 算法求源点到各点的最短路径。写出每一步的 `dist[]` 和路径。

**步骤模板**：

```
初始: S = {源点}, dist[源点]=0, 其余=∞
第1步: 选未访问中 dist 最小的 u, 加入 S
       用 u 松弛所有邻居: dist[v] = min(dist[v], dist[u] + w(u,v))
重复直到所有节点入 S
```

**手写格式**：每一步画一个表格，列出 `S` 集合、各点的 `dist` 值和前驱节点。

### 4.3 最小生成树（Prim / Kruskal）

**例题（2025 转专业真题）**：给定无向连通图，求最小生成树，写出步骤。

**Prim 步骤**（与 Dijkstra 极其相似）：

```
初始: 任选起点入 MST, 集合 S = {起点}
重复: 选一条连接 S 内和 S 外的最小权边，将 S 外的节点加入 S
直到所有节点入 S
```

### 4.4 图论概念速查

| 概念       | 考试问法                                          |
| ---------- | ------------------------------------------------- |
| 连通分量   | 无向图中极大连通子图的个数                        |
| 强连通分量 | 有向图中任意两点互相可达的极大子图                |
| 生成树     | 包含所有顶点的极小连通子图（$n$ 个点 $n-1$ 条边） |
| 关键路径   | DAG 中从源点到汇点的最长路径（决定工期）          |

---

## 五、查找（应用题 10 分）

### 5.1 哈希表与 ASL

**必考**：给定哈希函数和冲突解决策略（线性探测/链地址法等），画哈希表并计算 $ASL_{成功}$ 和 $ASL_{失败}$。

**例题（2025 真题风格）**：关键字 $19, 14, 23, 1, 68, 20, 84, 27, 55, 11$，哈希函数 $H(key) = key \bmod 13$，线性探测法。求 $ASL_{成功}$ 和 $ASL_{失败}$。

**建表**（表长 13）：

| 0   | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  | 12  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     | 1   | 27  | 68  | 55  |     | 19  | 20  | 84  |     | 23  | 11  | 14  |

（逐个插入：19→6，14→1，23→10，1→1→2（冲突1次），68→3，20→7，84→6→7→8（冲突2次），27→1→2→3→4（冲突3次），55→3→4→5（冲突2次），11→11）

**ASL 成功**：$(1+1+1+2+1+1+3+4+3+1)/10 = 18/10 = 1.8$。

**ASL 失败**：对哈希表每个位置，计算查找失败所需的比较次数（从该位置出发直到遇到空位）。位置 0→1 次，位置 1→6 次（1,27,68,55,空），…… 平均约 $3.5$ 次。

### 5.2 装填因子

$$
\alpha = \frac{\text{关键字个数}}{\text{哈希表长度}}
$$

上例中 $\alpha = 10/13 \approx 0.77$。$\alpha$ 越大，冲突概率越高。

---

## 六、排序（简答题 5 分 + 应用题混合）

### 6.1 希尔排序

**考点**：给定增量序列，写出每趟排序结果。

**例题（2024 真题）**：对序列做希尔排序，$d = 5, 3, 1$。写出每趟结果。

**方法**：对距离为 $d$ 的元素构成的子序列做直接插入排序。$d=5$ 时分为 5 组各自排序，$d=3$ 时重新分组，最后 $d=1$ 全序列插入排序。

| 增量  | 操作                                            |
| ----- | ----------------------------------------------- |
| $d=5$ | 下标 (0,5), (1,6), (2,7), (3,8), (4,9) 分别排序 |
| $d=3$ | 下标 (0,3,6,9), (1,4,7), (2,5,8) 分别排序       |
| $d=1$ | 全序列插入排序                                  |

### 6.2 排序算法特性速查

| 算法     | 平均时间     | 最坏时间     | 空间        | 稳定性     | 考试要点              |
| -------- | ------------ | ------------ | ----------- | ---------- | --------------------- |
| 直接插入 | $O(n^2)$     | $O(n^2)$     | $O(1)$      | 稳定       | 基本有序时接近 $O(n)$ |
| 希尔排序 | —            | —            | $O(1)$      | **不稳定** | 依赖增量序列          |
| 冒泡排序 | $O(n^2)$     | $O(n^2)$     | $O(1)$      | 稳定       | 简单                  |
| 快速排序 | $O(n\log n)$ | $O(n^2)$     | $O(\log n)$ | **不稳定** | 最坏情况 = 有序/逆序  |
| 简单选择 | $O(n^2)$     | $O(n^2)$     | $O(1)$      | **不稳定** | —                     |
| 堆排序   | $O(n\log n)$ | $O(n\log n)$ | $O(1)$      | **不稳定** | 建堆 $O(n)$           |
| 归并排序 | $O(n\log n)$ | $O(n\log n)$ | $O(n)$      | 稳定       | 空间 $O(n)$           |
| 基数排序 | $O(d(n+r))$  | —            | $O(n+r)$    | 稳定       | 不需要比较            |

**高频考点**：

- 哪些排序**不稳定**：希尔、快排、选择、堆排（记：**希快选堆**）
- 哪些排序**与初始排列无关**的复杂度：简单选择、堆排序、归并排序
- **快速排序最坏情况**：已经有序或逆序时退化 $O(n^2)$

---

## 七、算法设计题（30 分）

### 7.1 二叉树相关算法

**例题 1（2025 真题）**：写出二叉树先序遍历的代码。

```cpp
void preorderTraversal(TreeNode* root) {
    if (!root) return;
    cout << root->val << " ";
    preorderTraversal(root->left);
    preorderTraversal(root->right);
}
```

**例题 2（2025 真题）**：求二叉树中值为 $c$ 的节点的祖先个数。

```cpp
int findAncestors(TreeNode* root, char c) {
    if (!root) return -1;                     // 未找到
    if (root->val == c) return 0;             // 找到目标，祖先数为 0
    int left = findAncestors(root->left, c);
    if (left >= 0) return left + 1;           // 在左子树找到
    int right = findAncestors(root->right, c);
    if (right >= 0) return right + 1;         // 在右子树找到
    return -1;                                 // 两棵子树都没找到
}
```

**例题 3（2025 真题）**：求二叉树的宽度（节点数最多的那一层的节点数）。

```cpp
#include <queue>
int widthOfBinaryTree(TreeNode* root) {
    if (!root) return 0;
    queue<TreeNode*> q;
    q.push(root);
    int maxWidth = 0;
    while (!q.empty()) {
        int sz = q.size();
        maxWidth = max(maxWidth, sz);
        for (int i = 0; i < sz; i++) {
            TreeNode* node = q.front(); q.pop();
            if (node->left)  q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
    return maxWidth;
}
```

**例题 4（2025 转专业真题）**：输出二叉树的所有叶子结点。

```cpp
void printLeaves(TreeNode* root) {
    if (!root) return;
    if (!root->left && !root->right)
        cout << root->val << " ";
    printLeaves(root->left);
    printLeaves(root->right);
}
```

### 7.2 逆序对问题

**例题（2025 真题）**：求数组 $A$ 中满足 $i < j$ 且 $A[i] > A[j]$ 的 $(i,j)$ 对个数。要求 $O(n\log n)$。

**思路**：归并排序过程中统计。当合并两个有序子数组时，若 `left[i] > right[j]`，则 `left[i]` 到 `left[mid]` 的所有元素都与 `right[j]` 构成逆序对，逆序对个数增加 `mid - i + 1`。

```cpp
int merge(vector<int>& A, int L, int M, int R) {
    vector<int> tmp(R - L + 1);
    int i = L, j = M + 1, k = 0, cnt = 0;
    while (i <= M && j <= R) {
        if (A[i] <= A[j]) tmp[k++] = A[i++];
        else {
            cnt += M - i + 1;                 // 关键
            tmp[k++] = A[j++];
        }
    }
    while (i <= M) tmp[k++] = A[i++];
    while (j <= R) tmp[k++] = A[j++];
    for (int p = 0; p < k; p++) A[L + p] = tmp[p];
    return cnt;
}

int countInversions(vector<int>& A, int L, int R) {
    if (L >= R) return 0;
    int M = (L + R) / 2;
    return countInversions(A, L, M) + countInversions(A, M + 1, R) + merge(A, L, M, R);
}
```

### 7.3 双链表插入

**例题（2024/2025 均考）**：在双链表的节点 `p` 前插入新节点 `q`。

```cpp
struct Node {
    int val;
    Node *prior, *next;
};

// 在 p 前插入 q
q->prior = p->prior;
q->next = p;
p->prior->next = q;   // 若 p 非头节点
p->prior = q;
```

### 7.4 胜者树（Winner Tree）

**例题（2024 真题）**：给定一串数字，构造胜者树。修改一个节点的值后，如何更新？

**胜者树**：完全二叉树，叶子存选手，内部节点存两个子节点的最小值的索引。类似淘汰赛，每层胜者向上晋级。根节点存储全局最小值。

**更新步骤**：从被修改的叶子节点出发，沿路径向上重新比较兄弟节点，更新每层的胜者，直到根。复杂度 $O(\log n)$。

```cpp
// 判断两棵胜者树是否相似
bool similarTree(TreeNode* t1, TreeNode* t2) {
    if (!t1 && !t2) return true;             // 都为空
    if (!t1 || !t2) return false;            // 一空一非空
    return similarTree(t1->left, t2->left)
        && similarTree(t1->right, t2->right);
}
```

### 7.5 汉诺塔变体

**例题（2025 转专业真题）**：A 柱上有有序排列的盘子，借助 B 柱，如何实现有序放到 C 柱。

**思路**：标准汉诺塔。如果 A 柱上的盘子是**从小到大**（小的在上），移动到 C 后仍要求有序，就是标准汉诺塔问题——递归将 $n-1$ 个移到 B，最大移到 C，再将 $n-1$ 个从 B 移到 C。

### 7.6 链表算法设计（时空复杂度要求）

**例题（2024 真题）**：链表结构为 `head -> ... -> 0 -> ...`，$0$ 之前有任意个节点，要求输出 $0$ 前面的 $n$ 个节点的值。$O(m)$ 时间（$m$ 为 0 之前的节点数），$O(1)$ 空间。

**思路**：先遍历一趟找到 $0$ 的位置（计数量 $m$），然后从头再次遍历，输出前 $m$ 个节点的值。两趟都是 $O(m)$，只用了几个指针变量。

```cpp
struct Node { int key, id; Node* next; };

void printBeforeZero(Node* head) {
    // 找 0 的位置
    Node* p = head, *zero = nullptr;
    while (p) {
        if (p->key == 0) { zero = p; break; }
        p = p->next;
    }
    // 输出 0 之前的数据
    p = head;
    while (p != zero) {
        cout << p->id << " ";
        p = p->next;
    }
}
```

---

## 考点分值分布（根据历年真题）

| 大类           | 典型分值 | 主要题型                                                                |
| -------------- | -------- | ----------------------------------------------------------------------- |
| 时间复杂度     | 5 分     | 简答（分析给定代码）                                                    |
| 栈/队列/双链表 | 5 分     | 简答（出栈序列、中缀转后缀、链表插入）                                  |
| 树与二叉树     | 25-35 分 | 简答（性质、构建）+ 应用（哈夫曼/BST）+ 算法设计（遍历/宽度/祖先/叶子） |
| 图             | 10-20 分 | 简答（邻接矩阵/遍历树）+ 应用（Dijkstra/MST）                           |
| 查找           | 10 分    | 应用（哈希表 + ASL）                                                    |
| 排序           | 5-10 分  | 简答（希尔过程/特性）+ 选择（性质判断）                                 |
| 算法设计       | 15 分    | 二叉树算法 / 逆序对 / 胜者树 / 链表                                     |
| 综合           | 5-10 分  | 概念判断题                                                              |

---

## 总结

1. **二叉树性质** $n_0 = n_2 + 1$ 是理论考试的第一公式，完全二叉树 $n_1 \in \{0,1\}$
2. **中序+后序构建二叉树**是每年的必考题，掌握「后序最后一个 = 根 → 划分中序 → 递归」
3. **Dijkstra 手写过程**要会画每步的表格（S 集合、dist、前驱）
4. **哈希表 ASL** 成功/失败都要会算，线性探测是默认方法
5. **排序特性**不稳定四兄弟（希快选堆）、快排最坏退化、堆排建堆 $O(n)$
6. **算法设计**的二叉树三件套：遍历、宽度（层序 BFS）、祖先（递归带返回值）
7. **归并求逆序对** $O(n\log n)$ 是算法设计的经典模板
