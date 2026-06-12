---
title: 数据结构实践期末复习
published: 2026-06-12
description: "系统总结数据结构课程28道编程题：线性表、字符串、矩阵、树与二叉树、图论、排序查找与数论，含完整代码与常见错误修正"
image: ""
tags: [数据结构, 期末复习, C++, 算法, 大学课程]
category: 日常学习
draft: false
lang: zh
comment: true
---

## 前言

本文汇总了数据结构课程的全部 28 道编程实践题，按**数据结构类型**重新组织为六大模块。每道题附核心代码（已修正原代码中的已知问题）和解题思路。

---

## 一、线性结构

### 1.1 约瑟夫问题

$n$ 个人围成一圈，从第 1 个人开始报数，报到 $m$ 的人出列。求最后剩下的人的编号。

**解法**：$O(n)$ 递推公式

$$
f(1) = 0,\quad f(i) = (f(i-1) + m) \bmod i
$$

最后答案 $= f(n) + 1$。

```cpp
int josephus(int n, int m) {
    int ans = 0;               // f(1) = 0
    for (int i = 2; i <= n; i++)
        ans = (ans + m) % i;   // f(i) = (f(i-1) + m) % i
    return ans + 1;            // 编号从 1 开始
}
```

### 1.2 波兰表达式求值

给定前缀表达式（如 `+ * 2 3 4`），求值。运算符支持 `+ - * /`。

**解法**：递归下降。读入一个 token，若是运算符则递归求两个操作数，否则转为数字返回。

```cpp
double evaluate() {
    string s;
    cin >> s;
    if (s == "+") return evaluate() + evaluate();
    if (s == "-") return evaluate() - evaluate();
    if (s == "*") return evaluate() * evaluate();
    if (s == "/") return evaluate() / evaluate();
    return atof(s.c_str());
}
```

### 1.3 表达式求值

读入形如 `12+34=` 的表达式，输出 `12+34=46`。

```cpp
string s;
getline(cin, s);
int plusPos = s.find('+');
int eqPos = s.find('=');
int a = stoi(s.substr(0, plusPos));
int b = stoi(s.substr(plusPos + 1, eqPos - plusPos - 1));
cout << a << "+" << b << "=" << a + b << endl;
```

### 1.4 合并有序队列

两个升序队列各 $n$ 个元素，合并为一个升序队列。

```cpp
vector<int> merge(const vector<int>& a, const vector<int>& b) {
    vector<int> res;
    int i = 0, j = 0;
    while (i < a.size() && j < b.size()) {
        if (a[i] <= b[j]) res.push_back(a[i++]);
        else              res.push_back(b[j++]);
    }
    while (i < a.size()) res.push_back(a[i++]);
    while (j < b.size()) res.push_back(b[j++]);
    return res;
}
```

### 1.5 进制转换

将十进制整数 $N$ 转为 $R$ 进制（$2 \le R \le 20$），负号保留。

:::caution[原代码 bug]
输入 $N = 0$ 时返回空串。修正：提前判断 $N = 0$ 返回 `"0"`。
:::

```cpp
string convert(int n, int R) {
    if (n == 0) return "0";        // 修正：处理 0
    bool neg = (n < 0);
    if (neg) n = -n;
    string res;
    while (n > 0) {
        int r = n % R;
        char digit = (r < 10) ? ('0' + r) : ('A' + r - 10);
        res = digit + res;
        n /= R;
    }
    if (neg) res = "-" + res;
    return res;
}
```

### 1.6 链表重排（Reorder List）

将链表 $L_0 \to L_1 \to \dots \to L_{n-1}$ 重排为 $L_0 \to L_{n-1} \to L_1 \to L_{n-2} \to \dots$。

**三步法**：找中点 → 反转后半段 → 交替合并。

```cpp
ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *cur = head;
    while (cur) {
        ListNode* next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}

ListNode* findMiddle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}

ListNode* reorderList(ListNode* head) {
    if (!head || !head->next) return head;
    ListNode* mid = findMiddle(head);
    ListNode* second = reverseList(mid->next);
    mid->next = nullptr;
    // 交替合并
    ListNode *p1 = head, *p2 = second;
    while (p2) {
        ListNode *n1 = p1->next, *n2 = p2->next;
        p1->next = p2;
        p2->next = n1;
        p1 = n1; p2 = n2;
    }
    return head;
}
```

### 1.7 寻找未出现的最小正整数

$O(n)$ 时间、$O(1)$ 额外空间。

```cpp
int firstMissingPositive(vector<int>& a) {
    int n = a.size();
    for (int i = 0; i < n; i++)
        while (a[i] > 0 && a[i] <= n && a[a[i] - 1] != a[i])
            swap(a[i], a[a[i] - 1]);
    for (int i = 0; i < n; i++)
        if (a[i] != i + 1) return i + 1;
    return n + 1;
}
```

---

## 二、字符串

### 2.1 子串个数

长度为 $n$ 的字符串，所有连续子串个数（含位置重复）为：

$$
\text{子串数} = \frac{n(n+1)}{2} + 1
$$

（$+1$ 是空串；非空子串 $= n(n+1)/2$）

### 2.2 KMP 模式匹配

在文本串 $S$ 中找模式串 $P$ 首次出现的位置（1-indexed），未找到返回 $0$。

:::caution[原代码 bug]
原代码前缀数组计算用 1-based 索引，匹配循环用 0-based 索引，混用可能导致回溯错误。以下是**统一 0-based** 的修正版本。
:::

```cpp
// 求 next 数组（前缀函数）
vector<int> getNext(const string& p) {
    int m = p.size();
    vector<int> ne(m);
    for (int i = 1, j = 0; i < m; i++) {
        while (j > 0 && p[i] != p[j]) j = ne[j - 1];
        if (p[i] == p[j]) j++;
        ne[i] = j;
    }
    return ne;
}

int kmp(const string& s, const string& p) {
    if (p.empty()) return 1;
    auto ne = getNext(p);
    int n = s.size(), m = p.size();
    for (int i = 0, j = 0; i < n; i++) {
        while (j > 0 && s[i] != p[j]) j = ne[j - 1];
        if (s[i] == p[j]) j++;
        if (j == m) return i - m + 2;  // 1-indexed
    }
    return 0;
}
```

:::tip[KMP 核心思想]
`ne[i]` 表示 $P[0..i]$ 的最长相等前后缀长度。匹配失败时，模式串回退到 `ne[j-1]` 而非从头开始，文本串指针 `i` 不回退。这样整个匹配过程每个字符只被比较一次，总复杂度 $O(n+m)$。
:::

---

## 三、矩阵

### 3.1 主对角线求和

```cpp
int sum = 0;
for (int i = 0; i < n; i++)
    sum += matrix[i][i];
```

### 3.2 顺时针螺旋矩阵

:::caution[原代码问题]
使用 VLA `int matrix[n][n]` 不是标准 C++。改用 `vector<vector<int>>`。
:::

```cpp
vector<vector<int>> generateSpiral(int n) {
    vector<vector<int>> a(n, vector<int>(n));
    int top = 0, bottom = n - 1, left = 0, right = n - 1;
    int num = 1;
    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++) a[top][j] = num++;      // →
        top++;
        for (int i = top; i <= bottom; i++) a[i][right] = num++;    // ↓
        right--;
        for (int j = right; j >= left; j--) a[bottom][j] = num++;   // ←
        bottom--;
        for (int i = bottom; i >= top; i--) a[i][left] = num++;     // ↑
        left++;
    }
    return a;
}
```

---

## 四、树与二叉树

### 4.1 树的先根与后根遍历

给定若干对 `父节点 子节点`（大写字母），建立树后输出先根/后根遍历。

```cpp
vector<int> children[26];
bool hasParent[26];
bool exists[26];

void preorder(int u) {
    cout << char('A' + u) << " ";
    for (int v : children[u]) preorder(v);
}

void postorder(int u) {
    for (int v : children[u]) postorder(v);
    cout << char('A' + u) << " ";
}

// 建树后找根（exists && !hasParent），调用遍历
```

### 4.2 汉诺塔

```cpp
int step = 1;
void hanoi(int n, char from, char to, char aux) {
    if (n == 1) {
        cout << step++ << " disk" << n << " " << from << " to " << to << endl;
        return;
    }
    hanoi(n - 1, from, aux, to);
    cout << step++ << " disk" << n << " " << from << " to " << to << endl;
    hanoi(n - 1, aux, to, from);
}
```

### 4.3 二叉链表存储的二叉树

给定带空节点标记（空格）的先序序列，建立二叉链表，输出先序 + 中序 + **后序**遍历。

:::caution[原代码 bug]
第三个遍历输出了两次中序，应为后序。已修正。
:::

```cpp
struct Node { char val; Node *left, *right; };
int idx;

Node* build(const string& pre) {
    if (idx >= pre.size() || pre[idx] == ' ') {
        idx++;
        return nullptr;
    }
    Node* root = new Node{pre[idx++], nullptr, nullptr};
    root->left = build(pre);
    root->right = build(pre);
    return root;
}

void inorder(Node* root) {
    if (!root) return;
    inorder(root->left);
    cout << root->val;
    inorder(root->right);
}

void postorder(Node* root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    cout << root->val;
}
```

### 4.4 哈夫曼树

$n$ 个叶子节点各有权值，求最小带权路径长度（WPL）。WPL = 所有合并产生的非叶子节点权值之和。

```cpp
int huffman(vector<int>& weights) {
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int w : weights) pq.push(w);
    int total = 0;
    while (pq.size() > 1) {
        int a = pq.top(); pq.pop();
        int b = pq.top(); pq.pop();
        total += a + b;
        pq.push(a + b);
    }
    return total;
}
```

:::tip[为什么 WPL = 所有合并的和？]
每次合并两个节点，新增的代价 = 两节点权值和。这个代价会被「加总」到所有包含这两个节点的更大合并中去。所有中间代价之和恰好等于每个叶子权值 × 其路径长度的总和。
:::

### 4.5 已知先序+后序求中序

给定二叉树的先序和后序遍历（节点值互异，为正整数），判断树是否唯一确定，并输出一种中序遍历。

**核心判定**：当先序的第 2 个节点（左子树根）等于后序的倒数第 2 个节点（右子树根）时，只有一个子树，树不唯一。

```cpp
vector<int> pre, post, inord;
bool unique = true;
unordered_map<int, int> pos;

void dfs(int l1, int r1, int l2, int r2) {
    if (l1 > r1) return;
    if (l1 == r1) { inord.push_back(pre[l1]); return; }
    int root = pre[l1];
    int lchild = pre[l1 + 1];          // 先序中左子树根
    int rchild = post[r2 - 1];         // 后序中右子树根
    if (lchild == rchild) {
        unique = false;
        // 当只有一个子树时，默认归为右子树
        dfs(l1 + 1, r1, l2, r2 - 1);
    } else {
        int leftSize = pos[lchild] - l2 + 1;
        dfs(l1 + 1, l1 + leftSize, l2, l2 + leftSize - 1);
        inord.push_back(root);
        dfs(l1 + leftSize + 1, r1, l2 + leftSize, r2 - 1);
    }
}
```

---

## 五、图论

### 5.1 Dijkstra 最短路径（堆优化版）

$O((V+E)\log V)$，适用于非负权图。

```cpp
using pii = pair<int, int>;
const int INF = 0x3f3f3f3f;

vector<int> dijkstra(int n, vector<vector<pii>>& adj, int start) {
    vector<int> dist(n + 1, INF);
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    dist[start] = 0;
    pq.push({0, start});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d != dist[u]) continue;        // 懒惰删除
        for (auto [v, w] : adj[u]) {
            if (dist[v] > dist[u] + w) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}
```

### 5.2 Dijkstra 最短路径（朴素版）

$O(V^2)$，适合稠密图。

```cpp
vector<int> dijkstra_naive(int n, vector<vector<int>>& g, int start) {
    vector<int> dist(n + 1, INF);
    vector<bool> vis(n + 1);
    dist[start] = 0;
    for (int i = 1; i < n; i++) {      // n-1 次迭代
        int u = -1;
        for (int v = 1; v <= n; v++)   // 找最近的未访问点
            if (!vis[v] && (u == -1 || dist[v] < dist[u]))
                u = v;
        vis[u] = true;
        for (int v = 1; v <= n; v++)   // 松弛
            if (!vis[v] && g[u][v] != INF)
                dist[v] = min(dist[v], dist[u] + g[u][v]);
    }
    return dist;
}
```

### 5.3 Floyd-Warshall 全源最短路

$O(V^3)$。

```cpp
// d[i][j] 初始化为边权或 INF，d[i][i] = 0
for (int k = 1; k <= n; k++)
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            d[i][j] = min(d[i][j], d[i][k] + d[k][j]);
```

:::warning[注意]
最外层循环必须是 $k$（中间节点），内层是 $i$ 和 $j$。$k$ 层在外的本质是动态规划的「第 $k$ 阶段」——允许经过前 $k$ 个节点作为中间节点。
:::

### 5.4 Prim 最小生成树（堆优化版）

```cpp
int prim(int n, vector<vector<pii>>& adj) {
    vector<bool> inMST(n + 1, false);
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    pq.push({0, 1});
    int total = 0, cnt = 0;
    while (!pq.empty()) {
        auto [w, u] = pq.top(); pq.pop();
        if (inMST[u]) continue;
        inMST[u] = true;
        total += w;
        cnt++;
        for (auto [v, weight] : adj[u])
            if (!inMST[v]) pq.push({weight, v});
    }
    return (cnt == n) ? total : -1;   // -1 表示图不连通
}
```

### 5.5 关键路径（拓扑排序求最长路）

给定 DAG，每个任务有耗时，求开工到完工的最短时间（即最长路径长度）。

```cpp
int criticalPath(int n, vector<vector<pair<int, int>>>& adj,
                 vector<int>& indegree, vector<int>& duration) {
    vector<int> earliest(n, 0);
    queue<int> q;
    for (int i = 0; i < n; i++)
        if (indegree[i] == 0) {
            q.push(i);
            earliest[i] = duration[i];
        }
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (auto [v, w] : adj[u]) {
            earliest[v] = max(earliest[v], earliest[u] + w + duration[v]);
            if (--indegree[v] == 0) q.push(v);
        }
    }
    return *max_element(earliest.begin(), earliest.end());
}
```

### 5.6 机器人王国路径

树形结构，给定每个节点到父节点的距离，求指定叶子节点到根的总距离。

```cpp
// 向上追溯父节点
unordered_map<string, string> parent;
unordered_map<string, int> dist;

int getPathLength(const string& city) {
    int total = 0;
    string cur = city;
    while (parent.count(cur)) {
        total += dist[cur];
        cur = parent[cur];
    }
    return total;
}
```

---

## 六、排序、查找与数论

### 6.1 按各位数字之和排序

```cpp
int digitSum(int x) {
    int sum = 0;
    while (x > 0) { sum += x % 10; x /= 10; }
    return sum;
}

// 自定义比较器：先按数位和降序，再按数值降序
sort(a.begin(), a.end(), [](int x, int y) {
    int sx = digitSum(x), sy = digitSum(y);
    if (sx != sy) return sx > sy;
    return x > y;
});
```

### 6.2 奇偶数分别排序

```cpp
// 输入 10 个数：5 个奇数 + 5 个偶数
// 奇数降序，偶数升序
vector<int> odd, even;
for (int x : a) {
    if (x % 2) odd.push_back(x);
    else       even.push_back(x);
}
sort(odd.begin(), odd.end(), greater<int>());
sort(even.begin(), even.end());
```

### 6.3 寻找第二小的数

```cpp
set<int> s(a.begin(), a.end());   // 去重 + 自动排序
if (s.size() < 2) cout << "NO\n";
else cout << *next(s.begin()) << "\n";
```

### 6.4 欧拉函数

#### 单个值计算（$O(\sqrt{n})$）

```cpp
int phi(int n) {
    int res = n;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            res = res / i * (i - 1);
            while (n % i == 0) n /= i;
        }
    }
    if (n > 1) res = res / n * (n - 1);
    return res;
}
```

#### 筛法求 $1 \sim n$ 的欧拉函数（$O(n)$）

```cpp
vector<int> phi_sieve(int n) {
    vector<int> phi(n + 1);
    for (int i = 1; i <= n; i++) phi[i] = i;
    for (int i = 2; i <= n; i++) {
        if (phi[i] == i)          // i 是质数
            for (int j = i; j <= n; j += i)
                phi[j] = phi[j] / i * (i - 1);
    }
    return phi;
}
```

---

## 算法复杂度速查

| 算法            | 时间复杂度    | 空间     | 适用场景              |
| --------------- | ------------- | -------- | --------------------- |
| 约瑟夫递推      | $O(n)$        | $O(1)$   | 求最后幸存者          |
| KMP             | $O(n+m)$      | $O(m)$   | 单模式串匹配          |
| Dijkstra 堆优化 | $O(E\log V)$  | $O(V+E)$ | 稀疏图单源最短路      |
| Dijkstra 朴素   | $O(V^2)$      | $O(V^2)$ | 稠密图单源最短路      |
| Floyd           | $O(V^3)$      | $O(V^2)$ | 全源最短路 / 传递闭包 |
| Prim 堆优化     | $O(E\log V)$  | $O(V+E)$ | 稀疏图 MST            |
| 拓扑排序        | $O(V+E)$      | $O(V+E)$ | DAG 关键路径          |
| 哈夫曼树        | $O(n\log n)$  | $O(n)$   | 最优编码              |
| 欧拉函数（单）  | $O(\sqrt{n})$ | $O(1)$   | 求 $\phi(n)$          |
| 欧拉函数筛      | $O(n)$        | $O(n)$   | 批量求 $\phi(1..n)$   |

---

## 常见坑点汇总

| 编号 | 问题                           | 说明                                          |
| ---- | ------------------------------ | --------------------------------------------- |
| 1    | **进制转换 N=0**               | 原代码返回空串，必须特判返回 `"0"`            |
| 2    | **KMP 下标混用**               | 前缀数组和匹配循环必须统一 0-based 或 1-based |
| 3    | **二叉链表第三次遍历**         | 原代码调用两次中序，应为后序                  |
| 4    | **VLA 使用**                   | `int a[n][n]` 非标准 C++，用 `vector` 替代    |
| 5    | **`0x3f3f3f` vs `0x3f3f3f3f`** | 少写一个字节会导致 INF 变小                   |
| 6    | **Floyd 循环顺序**             | $k$ 必须在最外层，$i,j$ 顺序可以交换          |
| 7    | **优先级队列清空**             | 多测例题目注意重置（用局部变量）              |
| 8    | **尾随空格**                   | OJ 严格时注意不输出行末多余空格               |
| 9    | **编码问题**                   | 含中文的 cpp 文件用 UTF-8 保存，避免乱码      |
| 10   | **欧拉筛理解**                 | `phi[i]==i` 判断质数只在筛法初始化后有效      |

---

## 总结

1. **线性和串**是基础，约瑟夫递推、KMP 的前缀函数思想值得反复琢磨
2. **树的遍历**是万能框架——先序建树、中序和后序输出，递归三行搞定
3. **Dijkstra/Prim** 本质相同：都是「每次从候选集中选最小元素加入集合」
4. **Floyd** 虽然 $O(n^3)$，但代码极短，小数据首选
5. **欧拉函数** 在「与 N 互质的数」相关题目中反复出现
6. 代码中已修正的问题（进制转换 0、KMP 下标、遍历调用错误）考前再看一遍
