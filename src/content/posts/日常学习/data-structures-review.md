---
title: 数据结构实践期末复习
published: 2026-06-12
description: "系统总结数据结构课程28道编程题：线性表、字符串、矩阵、树与二叉树、图论、排序查找与数论，含完整可运行代码（含输入输出）与常见错误修正"
image: ""
tags: [数据结构, 期末复习, C++, 算法, 大学课程]
category: 日常学习
draft: false
lang: zh
comment: true
---

## 前言

本文汇总了数据结构课程的全部 28 道编程实践题，按**数据结构类型**重新组织为六大模块。每道题附**完整可运行代码**（含 `main()` 和输入输出），已修正原代码中已知的 bug。

---

## 一、线性结构

### 1.1 约瑟夫问题——1C

$n$ 个人围成一圈，从 $1$ 开始报数，报到 $m$ 的人出列。求最后剩下的人的编号。

**输入**：两个正整数 $n$ 和 $m$（$n \ge 2$，$m \ge 1$）。
**输出**：最后剩下的人的编号。

$$
f(1) = 0,\quad f(i) = (f(i-1) + m) \bmod i,\quad \text{答案} = f(n) + 1
$$

```cpp
#include <iostream>
using namespace std;

int josephus(int n, int m) {
    int end = 0;
    for (int i = 2; i <= n; i++)
        end = (end + m) % i;
    return end + 1;
}

int main() {
    int n, m;
    cin >> n >> m;
    cout << josephus(n, m) << endl;
    return 0;
}
```

### 1.2 找新朋友（欧拉函数筛法）——1A

求 $1$ 到 $n$ 中与 $n$ 互质的数的个数。多组测试，$n < 32768$。

**输入**：第一行组数 $CN$，接下来 $CN$ 行每行一个正整数 $n$。
**输出**：每组一行，输出 $\phi(n)$。

:::caution[原代码问题]
注释写的是「找出从 1 到 n 的质数的个数」，实际求的是欧拉函数 $\phi(n)$（与 $n$ 互质的数的个数）。代码逻辑正确，注释错误。
:::

```cpp
#include <iostream>
using namespace std;

const int N = 32778;
int phi[N + 10];

void euler_sieve() {
    for (int i = 0; i <= N; i++) phi[i] = i;
    for (int i = 2; i < N; i++) {
        if (phi[i] == i)               // i 是质数
            for (int j = i; j <= N; j += i)
                phi[j] = phi[j] / i * (i - 1);
    }
}

int main() {
    int T;
    cin >> T;
    euler_sieve();
    while (T--) {
        int n;
        cin >> n;
        cout << phi[n] << endl;
    }
    return 0;
}
```

### 1.3 互质（欧拉函数单值）——1B

求比 $n$ 小的且与 $n$ 互质的正整数个数。多组测试，$n \le 10^9$，$n = 0$ 结束。

**输入**：多行正整数 $n$，以 $0$ 结束。
**输出**：每行输出 $\phi(n)$。

```cpp
#include <iostream>
using namespace std;

int main() {
    long long n;
    while (cin >> n && n != 0) {
        long long res = n, tmp = n;
        for (long long i = 2; i * i <= tmp; i++) {
            if (tmp % i == 0) {
                res = res / i * (i - 1);
                while (tmp % i == 0) tmp /= i;
            }
        }
        if (tmp > 1) res = res / tmp * (tmp - 1);
        cout << res << endl;
    }
    return 0;
}
```

### 1.4 进制转换——1D

将十进制整数 $N$ 转为 $R$ 进制（$2 \le R \le 20$），负号保留。

**输入**：多组数据，每行 $N$ 和 $R$，空格分隔。
**输出**：转换后的 $R$ 进制字符串。

:::caution[原代码 bug]
输入 $N = 0$ 时 `while (n > 0)` 不执行，返回空串。已修正。
:::

```cpp
#include <iostream>
#include <string>
using namespace std;

string convert(int n, int R) {
    if (n == 0) return "0";           // 修正：处理 0
    bool neg = (n < 0);
    if (neg) n = -n;
    string res;
    while (n > 0) {
        int r = n % R;
        char d = (r < 10) ? ('0' + r) : ('A' + r - 10);
        res = d + res;
        n /= R;
    }
    if (neg) res = "-" + res;
    return res;
}

int main() {
    int n, r;
    while (cin >> n >> r)
        cout << convert(n, r) << endl;
    return 0;
}
```

### 1.5 整数求和式的计算——1E

读入形如 `12+34=` 的表达式，输出 `12+34=46`。

**输入**：一行，一个求和式 `a+b=`。
**输出**：`a+b=结果`。

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    getline(cin, s);
    size_t addPos = s.find('+');
    size_t eqPos  = s.find('=');
    int a = stoi(s.substr(0, addPos));
    int b = stoi(s.substr(addPos + 1, eqPos - addPos - 1));
    cout << a << "+" << b << "=" << a + b << endl;
    return 0;
}
```

### 1.6 波兰表达式求值——1F

给定前缀表达式（运算符前置，空格分隔），求值。运算符 `+ - * /`，操作数为浮点数。

**输入**：一行波兰表达式。
**输出**：表达式值，保留 6 位小数。

```cpp
#include <iostream>
#include <cstdio>
#include <cstring>
using namespace std;

const int N = 100010;
char s[N];

double calc() {
    cin >> s;
    switch (s[0]) {
        case '+': return calc() + calc();
        case '-': return calc() - calc();
        case '*': return calc() * calc();
        case '/': return calc() / calc();
        default:  return atof(s);
    }
}

int main() {
    printf("%.6f\n", calc());
    return 0;
}
```

### 1.7 合并有序队列——1G

两个长度均为 $n$ 的升序队列，合并为一个升序队列。

**输入**：第一行 $n$，第二行 $n$ 个数（队列1），第三行 $n$ 个数（队列2）。
**输出**：合并后的 $2n$ 个数，空格分隔。

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n), b(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    for (int i = 0; i < n; i++) cin >> b[i];

    int i = 0, j = 0;
    vector<int> res;
    while (i < n && j < n) {
        if (a[i] <= b[j]) res.push_back(a[i++]);
        else              res.push_back(b[j++]);
    }
    while (i < n) res.push_back(a[i++]);
    while (j < n) res.push_back(b[j++]);

    for (int k = 0; k < 2 * n; k++)
        cout << res[k] << " ";
    cout << endl;
    return 0;
}
```

### 1.8 寻找未出现的最小正整数

$n$ 个整数，找出未出现的最小正整数。$O(n)$ 时间，$O(1)$ 额外空间。

**输入**：第一行 $n$，第二行 $n$ 个整数。
**输出**：未出现的最小正整数。

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

const int N = 10010;

int find(int a[], int n) {
    for (int i = 0; i < n; i++)
        while (a[i] > 0 && a[i] <= n && a[a[i] - 1] != a[i])
            swap(a[i], a[a[i] - 1]);
    for (int i = 0; i < n; i++)
        if (a[i] != i + 1) return i + 1;
    return n + 1;
}

int main() {
    int n, a[N];
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << find(a, n) << endl;
    return 0;
}
```

**另解（辅助数组法）**：时间 $O(n)$，空间 $O(n)$，更直观。

```cpp
#include <iostream>
#include <cstring>
using namespace std;

const int N = 100010;
int b[N];

int find(int a[], int n) {
    memset(b, 0, sizeof(b));
    for (int i = 0; i < n; i++)
        if (a[i] > 0 && a[i] <= n) b[a[i]] = a[i];
    for (int i = 1; i <= n; i++)
        if (b[i] == 0) return i;
    return n + 1;
}

int main() {
    int n, a[N];
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << find(a, n) << endl;
    return 0;
}
```

### 1.9 线性表设计（链表重排）

将链表 $L_0 \to L_1 \to \dots \to L_{n-1}$ 重排为 $L_0 \to L_{n-1} \to L_1 \to L_{n-2} \to \dots$。

**三步骤**：找中点 → 反转后半段 → 交替合并。

```cpp
#include <iostream>
using namespace std;

struct NODE {
    int data;
    NODE* next;
};

NODE* reverseList(NODE* head) {
    NODE *prev = nullptr, *cur = head;
    while (cur) {
        NODE* nxt = cur->next;
        cur->next = prev;
        prev = cur;
        cur = nxt;
    }
    return prev;
}

NODE* findMiddle(NODE* head) {
    NODE *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}

void rearrangeList(NODE* head) {
    if (!head || !head->next) return;
    NODE* mid = findMiddle(head);
    NODE* second = reverseList(mid->next);
    mid->next = nullptr;
    NODE* first = head;
    while (second) {
        NODE* t1 = first->next;
        NODE* t2 = second->next;
        first->next = second;
        second->next = t1;
        first = t1;
        second = t2;
    }
}

NODE* createNode(int data) {
    NODE* node = new NODE{data, nullptr};
    return node;
}

void printList(NODE* head) {
    for (NODE* p = head; p; p = p->next)
        cout << p->data << (p->next ? " -> " : " -> NULL\n");
}

int main() {
    int n;
    cout << "请输入链表节点数: ";
    cin >> n;
    if (n <= 0) { cout << "节点数必须 > 0\n"; return 0; }

    NODE *head = nullptr, *tail = nullptr;
    cout << "请输入链表节点值: ";
    for (int i = 0; i < n; i++) {
        int val; cin >> val;
        NODE* node = createNode(val);
        if (!head) head = tail = node;
        else { tail->next = node; tail = node; }
    }

    cout << "原始链表: "; printList(head);
    rearrangeList(head);
    cout << "重排后链表: "; printList(head);
    return 0;
}
```

---

## 二、字符串

### 2.1 子串个数——2A

**输入**：若干行，每行一个不含空格的字符串（长度 $\le 1000$）。
**输出**：每行输出该字符串的子串个数。

$$
\text{子串数} = \frac{n(n+1)}{2} + 1
$$

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    while (cin >> s) {
        int n = s.size();
        cout << n * (n + 1) / 2 + 1 << endl;
    }
    return 0;
}
```

### 2.2 KMP 模式匹配——2B

在文本串 $S$ 中找模式串 $P$ 首次出现的位置（1-indexed），未找到输出 $0$。

**输入**：第一行目标串 $S$，第二行模式串 $P$（$|S| < 1000$，$|P| < 100$）。
**输出**：$P$ 在 $S$ 中首次出现的位置（从 1 开始），未找到输出 $0$。

:::caution[原代码 bug]
前缀数组计算用 1-based，匹配循环用 0-based，索引混用。以下为**统一 1-based** 的修正版。
:::

```cpp
#include <iostream>
#include <cstring>
using namespace std;

const int N = 100010, M = 1010;
char s[N], p[M];
int ne[M];

int main() {
    cin >> s + 1 >> p + 1;               // 1-based 读入
    int m = strlen(s + 1), n = strlen(p + 1);

    // 求 next 数组
    for (int i = 2, j = 0; i <= n; i++) {
        while (j && p[i] != p[j + 1]) j = ne[j];
        if (p[i] == p[j + 1]) j++;
        ne[i] = j;
    }

    // KMP 匹配
    for (int i = 1, j = 0; i <= m; i++) {
        while (j && s[i] != p[j + 1]) j = ne[j];
        if (s[i] == p[j + 1]) j++;
        if (j == n) {
            cout << i - n + 1 << endl;   // 1-indexed 位置
            return 0;
        }
    }
    cout << 0 << endl;
    return 0;
}
```

**暴力匹配（更简单，本题数据可过）**：

```cpp
#include <iostream>
#include <cstring>
using namespace std;

const int N = 100010, M = 10010;
char s[N], p[M];

int main() {
    cin >> s >> p;
    int m = strlen(s), n = strlen(p);
    for (int i = 0; i <= m - n; i++) {
        bool ok = true;
        for (int j = 0; j < n; j++)
            if (s[i + j] != p[j]) { ok = false; break; }
        if (ok) { cout << i + 1 << endl; return 0; }
    }
    cout << 0 << endl;
    return 0;
}
```

---

## 三、矩阵

### 3.1 主对角线求和——2C

**输入**：第一行 $N$（$N < 100$），接下来 $N$ 行每行 $N$ 个整数。
**输出**：主对角线上元素之和。

```cpp
#include <iostream>
using namespace std;

const int N = 101;
int a[N][N];

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> a[i][j];
    int sum = 0;
    for (int i = 0; i < n; i++) sum += a[i][i];
    cout << sum << endl;
    return 0;
}
```

### 3.2 顺时针螺旋矩阵——2D

**输入**：一个正整数 $N$（$N < 100$）。
**输出**：$N \times N$ 的顺时针螺旋矩阵。

:::caution[原代码问题]
原代码用 VLA `int matrix[n][n]`（非标准 C++），已改为 `vector`。
:::

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<vector<int>> a(n, vector<int>(n));
    int top = 0, bottom = n - 1, left = 0, right = n - 1;
    int num = 1;

    while (num <= n * n) {
        for (int i = left; i <= right; i++) a[top][i] = num++;
        top++;
        for (int i = top; i <= bottom; i++) a[i][right] = num++;
        right--;
        for (int i = right; i >= left; i--) a[bottom][i] = num++;
        bottom--;
        for (int i = bottom; i >= top; i--) a[i][left] = num++;
        left++;
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
            cout << a[i][j] << " ";
        cout << endl;
    }
    return 0;
}
```

---

## 四、树与二叉树

### 4.1 树的先根遍历——2F

**输入**：若干行，每行 `父节点 子节点`（大写字母），EOF 结束。节点数 $< 26$。
**输出**：先根遍历序列，字母间空格分隔。

```cpp
#include <iostream>
#include <vector>
#include <cstring>
using namespace std;

const int MAXN = 26;
vector<int> tree[MAXN];
bool hasParent[MAXN];

void preorder(int u) {
    cout << char('A' + u) << " ";
    for (int v : tree[u]) preorder(v);
}

int main() {
    memset(hasParent, 0, sizeof(hasParent));
    char p, c;
    while (cin >> p >> c) {
        int u = p - 'A', v = c - 'A';
        tree[u].push_back(v);
        hasParent[v] = true;
    }
    int root = -1;
    for (int i = 0; i < MAXN; i++)
        if (!hasParent[i] && !tree[i].empty()) { root = i; break; }
    if (root != -1) { preorder(root); cout << endl; }
    return 0;
}
```

### 4.2 树的后根遍历——2G

**输入输出格式同 2F**，输出后根遍历序列。

```cpp
#include <iostream>
#include <vector>
#include <cstring>
using namespace std;

const int MAXN = 26;
vector<int> tree[MAXN];
bool hasParent[MAXN];

void postorder(int u) {
    for (int v : tree[u]) postorder(v);
    cout << char('A' + u) << " ";
}

int main() {
    memset(hasParent, 0, sizeof(hasParent));
    char p, c;
    while (cin >> p >> c) {
        int u = p - 'A', v = c - 'A';
        tree[u].push_back(v);
        hasParent[v] = true;
    }
    int root = -1;
    for (int i = 0; i < MAXN; i++)
        if (!hasParent[i] && !tree[i].empty()) { root = i; break; }
    if (root != -1) { postorder(root); cout << endl; }
    return 0;
}
```

### 4.3 汉诺塔——2E

**输入**：整数 $n$（$n < 64$），表示盘子数。
**输出**：每次移动的过程：`步数 盘子半径 从->到`。

```cpp
#include <iostream>
using namespace std;

int step = 1;

void hanoi(int n, char from, char to, char aux) {
    if (n == 1) {
        cout << step++ << " " << n << " " << from << "->" << to << endl;
        return;
    }
    hanoi(n - 1, from, aux, to);
    cout << step++ << " " << n << " " << from << "->" << to << endl;
    hanoi(n - 1, aux, to, from);
}

int main() {
    int n;
    cin >> n;
    hanoi(n, 'A', 'C', 'B');
    return 0;
}
```

### 4.4 二叉链表存储的二叉树——3A

给定带空节点标记（空格）的先序序列，输出先序、中序、**后序**遍历。

**输入**：一行字符串，空格表示空节点。长度 $\le 100$。
**输出**：三行，分别为先序、中序、后序遍历（每个字母后跟空格）。

:::caution[原代码 bug]
原代码第三个遍历调用了两次中序，应为后序。已修正。
:::

```cpp
#include <iostream>
#include <cstring>
using namespace std;

struct TreeNode {
    char val;
    TreeNode *left, *right;
    TreeNode(char v) : val(v), left(nullptr), right(nullptr) {}
};

int idx;
TreeNode* build(const char* S, int len) {
    if (idx >= len || S[idx] == '\0') return nullptr;
    TreeNode* root = new TreeNode(S[idx++]);
    if (idx < len && S[idx] != ' ') root->left = build(S, len);
    else idx++;
    if (idx < len && S[idx] != ' ') root->right = build(S, len);
    else idx++;
    return root;
}

void preorder(TreeNode* node) {
    if (!node) return;
    cout << node->val << " ";
    preorder(node->left);
    preorder(node->right);
}

void inorder(TreeNode* node) {
    if (!node) return;
    inorder(node->left);
    cout << node->val << " ";
    inorder(node->right);
}

void postorder(TreeNode* node) {
    if (!node) return;
    postorder(node->left);
    postorder(node->right);
    cout << node->val << " ";
}

int main() {
    char S[101];
    cin.getline(S, 101);
    TreeNode* root = build(S, strlen(S));
    preorder(root);  cout << endl;
    inorder(root);   cout << endl;
    postorder(root); cout << endl;  // 修正：原为第二个 inorder
    return 0;
}
```

### 4.5 哈夫曼树——3B

$n$ 个叶子节点各有权值，求 WPL（所有叶子的路径长度 × 权值之和）。

**输入**：多组数据，每组第一行 $n$，第二行 $n$ 个权值（$2 \le n \le 1000$）。
**输出**：每组一行 WPL。

```cpp
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    int n;
    while (cin >> n) {
        priority_queue<int, vector<int>, greater<int>> pq;
        for (int i = 0; i < n; i++) {
            int x; cin >> x;
            pq.push(x);
        }
        int ans = 0;
        while (pq.size() > 1) {
            int a = pq.top(); pq.pop();
            int b = pq.top(); pq.pop();
            ans += a + b;
            pq.push(a + b);
        }
        cout << ans << "\n";
    }
    return 0;
}
```

### 4.6 已知先序+后序求中序——3C

先序和后序能唯一确定二叉树吗？若唯一输出 `Yes` 和中序，否则输出 `No` 和任一种中序。

**输入**：第一行 $N$（$\le 30$），第二行先序序列，第三行后序序列。
**输出**：第一行 `Yes`/`No`，第二行中序序列。

:::caution[原代码注意]
OJ 要求树不唯一时将子树默认归为右支。
:::

```cpp
#include <cstdio>
#include <cstring>
#include <iostream>
using namespace std;

const int maxn = 40;
int pos1[maxn], pos2[maxn], a1[maxn], a2[maxn];
int L[maxn], R[maxn];
bool notonly = false;

void dfs(int l, int r) {
    if (l >= r) return;
    int root = a1[l];
    int lroot = a1[l + 1];
    int rroot = a2[pos2[root] - 1];
    if (lroot == rroot) {
        R[root] = rroot;
        notonly = true;
        dfs(l + 1, r);
        return;
    }
    int lsize = pos1[rroot] - pos1[lroot];
    L[root] = lroot; R[root] = rroot;
    dfs(l + 1, l + lsize);
    dfs(l + lsize + 1, r);
}

void inorder(int now) {
    if (L[now]) inorder(L[now]);
    cout << now << " ";
    if (R[now]) inorder(R[now]);
    if (now == a1[1]) cout << endl;
}

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) { cin >> a1[i]; pos1[a1[i]] = i; }
    for (int i = 1; i <= n; i++) { cin >> a2[i]; pos2[a2[i]] = i; }
    dfs(1, n);
    cout << (notonly ? "No" : "Yes") << endl;
    inorder(a1[1]);
    return 0;
}
```

---

## 五、图论

### 5.1 Dijkstra 最短路径（堆优化）——3D

有向图，求 start 到 end 的最短路径。不可达输出 `STOP`。

**输入**：第一行 $N$ 和 $M$（$N,M < 100$），接下来 $M$ 行 `x y z`，最后一行 `start end`。
**输出**：最短路径长度或 `STOP`。

```cpp
#include <iostream>
#include <vector>
#include <cstring>
#include <queue>
using namespace std;

const int INF = 0x3f3f3f3f, MAXN = 100;

int main() {
    int n, m;
    cin >> n >> m;
    vector<pair<int, int>> adj[MAXN];
    for (int i = 0; i < m; i++) {
        int x, y, z; cin >> x >> y >> z;
        adj[x].push_back({y, z});
    }
    int start, end;
    cin >> start >> end;

    int dist[MAXN];
    bool vis[MAXN] = {false};
    memset(dist, 0x3f, sizeof(dist));
    dist[start] = 0;

    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    pq.push({0, start});

    while (!pq.empty()) {
        int u = pq.top().second; pq.pop();
        if (vis[u]) continue;
        vis[u] = true;
        for (auto [v, w] : adj[u])
            if (dist[v] > dist[u] + w) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
    }

    if (dist[end] == INF) cout << "STOP" << endl;
    else                  cout << dist[end] << endl;
    return 0;
}
```

### 5.2 Floyd 全源最短路——3D (另解)

代码更短，适合 $N \le 100$ 的小图。

```cpp
#include <iostream>
#include <cstring>
#include <algorithm>
using namespace std;

const int N = 210, INF = 1e9;
int d[N][N];

int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            d[i][j] = (i == j) ? 0 : INF;

    while (m--) {
        int a, b, w; cin >> a >> b >> w;
        d[a][b] = min(d[a][b], w);
    }

    for (int k = 1; k <= n; k++)
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= n; j++)
                d[i][j] = min(d[i][j], d[i][k] + d[k][j]);

    int s, e;
    cin >> s >> e;
    if (d[s][e] > INF / 2) cout << "STOP" << endl;
    else                   cout << d[s][e] << endl;
    return 0;
}
```

### 5.3 朴素 Dijkstra——4B

有向图，求顶点 $1$ 到目标顶点 $i$ 的最短路径长度。

**输入**：第一行 $n$ 和 $m$，接下来 $m$ 行 `a b c`，最后一行目标顶点 $i$。
**输出**：最短距离，不可达输出 $-1$。

```cpp
#include <iostream>
#include <cstring>
#include <algorithm>
using namespace std;

const int N = 510, INF = 0x3f3f3f3f;
int n, m, g[N][N], dist[N];
bool st[N];

int dijkstra(int target) {
    memset(dist, 0x3f, sizeof(dist));
    dist[1] = 0;
    for (int i = 0; i < n - 1; i++) {
        int t = -1;
        for (int j = 1; j <= n; j++)
            if (!st[j] && (t == -1 || dist[j] < dist[t])) t = j;
        st[t] = true;
        for (int j = 1; j <= n; j++)
            dist[j] = min(dist[j], dist[t] + g[t][j]);
    }
    return (dist[target] == INF) ? -1 : dist[target];
}

int main() {
    cin >> n >> m;
    memset(g, 0x3f, sizeof(g));
    while (m--) {
        int a, b, c; cin >> a >> b >> c;
        g[a][b] = min(g[a][b], c);
    }
    int target; cin >> target;
    cout << dijkstra(target) << endl;
    return 0;
}
```

### 5.4 Prim 最小生成树——3E

无向带权连通图，求最小生成树的总代价。

**输入**：第一行 $n$（$\le 50$），接下来 $n \times n$ 邻接矩阵（$0$ 表示无边）。
**输出**：MST 总代价。

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <cstring>
using namespace std;

typedef long long ll;
const int INF = 0x3f3f3f3f, N = 1e5 + 1;

vector<pair<int, int>> g[N];
int dist[N];
bool vis[N];

ll prim(int n) {
    for (int i = 1; i <= n; i++) dist[i] = INF, vis[i] = false;
    dist[1] = 0;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    pq.push({0, 1});
    ll ans = 0;
    int cnt = 0;
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (vis[u]) continue;
        vis[u] = true;
        ans += d;
        cnt++;
        for (auto [v, w] : g[u])
            if (!vis[v] && dist[v] > w) {
                dist[v] = w;
                pq.push({dist[v], v});
            }
    }
    return (cnt == n) ? ans : -1;
}

int main() {
    int n; cin >> n;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++) {
            int w; cin >> w;
            if (w != 0) g[i].push_back({j, w});
        }
    cout << prim(n);
    return 0;
}
```

### 5.5 关键路径（拓扑排序求最长路）——4C

DAG，每个子任务有耗时，求 A 到 Z 的最短完成时间（即最长路径）。

**输入**：第一行 $N$ 和 $M$（$N < 26$），接下来 $M$ 行 `起点 终点 天数`。
**输出**：最少天数。

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <cstring>
using namespace std;

const int MAXN = 26;

struct Edge { int to, w; };
vector<Edge> graph[MAXN];
int indeg[MAXN], earliest[MAXN];

int calc(int n) {
    memset(indeg, 0, sizeof(indeg));
    memset(earliest, -1, sizeof(earliest));
    for (int i = 0; i < MAXN; i++)
        for (auto& e : graph[i]) indeg[e.to]++;
    earliest[0] = 0;  // 'A' - 'A'
    queue<int> q;
    q.push(0);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (auto& e : graph[u]) {
            int v = e.to;
            earliest[v] = max(earliest[v], earliest[u] + e.w);
            if (--indeg[v] == 0) q.push(v);
        }
    }
    return earliest['Z' - 'A'];
}

int main() {
    int N, M; cin >> N >> M;
    while (M--) {
        char u, v; int w;
        cin >> u >> v >> w;
        graph[u - 'A'].push_back({v - 'A', w});
    }
    cout << calc(N) << endl;
    return 0;
}
```

### 5.6 机器人王国路径——4A

树状结构，每个节点到父节点有距离，求指定卫星城到首都的总距离。

**输入**：第一行 $N$（$\le 10$，层数），接下来 $2^{N+1}-2$ 行 `父城市 子城市 距离`，最后一行目标城市名。
**输出**：目标城市到首都的总距离。

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

struct City { string name, parent; int dist; };

int findCity(vector<City>& cities, const string& name) {
    for (int i = 0; i < cities.size(); i++)
        if (cities[i].name == name) return i;
    return -1;
}

int main() {
    int N;
    cin >> N;
    int n = (1 << (N + 1)) - 2;

    vector<City> cities(n);
    for (int i = 0; i < n; i++) {
        string from, to;
        int d;
        cin >> from >> to >> d;
        cities[i] = {to, from, d};
    }

    string target;
    cin >> target;

    int total = 0;
    while (true) {
        int idx = findCity(cities, target);
        if (idx == -1) break;
        total += cities[idx].dist;
        target = cities[idx].parent;
    }
    cout << total << endl;
    return 0;
}
```

---

## 六、排序、查找与数论

### 6.1 寻找第二小的数——4D

$n$ 个整数中第二小的数（相同值视为一个）。不存在输出 `NO`。

**输入**：第一行组数 $C$，每组第一行 $n$（$2 \le n \le 10$），第二行 $n$ 个数。
**输出**：每组一行，第二小的数或 `NO`。

```cpp
#include <iostream>
#include <set>
#include <vector>
using namespace std;

int main() {
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        set<int> s;
        for (int i = 0; i < n; i++) {
            int x; cin >> x;
            s.insert(x);
        }
        vector<int> v(s.begin(), s.end());
        if (v.size() < 2) cout << "NO" << endl;
        else              cout << v[1] << endl;
    }
    return 0;
}
```

### 6.2 按各位数字之和排序——4E

按十进制各位数字之和从大到小排序；和相同按数值从大到小。

**输入**：第一行 $n$（$\le 1000$），第二行 $n$ 个正整数（$\le 10^8$）。
**输出**：排序后的序列，空格分隔。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int digitSum(int x) {
    int s = 0;
    while (x) { s += x % 10; x /= 10; }
    return s;
}

bool cmp(int a, int b) {
    int sa = digitSum(a), sb = digitSum(b);
    if (sa != sb) return sa > sb;
    return a > b;
}

int main() {
    int n; cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    sort(a.begin(), a.end(), cmp);
    for (int i = 0; i < n; i++) {
        if (i) cout << " ";
        cout << a[i];
    }
    cout << endl;
    return 0;
}
```

### 6.3 奇偶数分别排序——4F

10 个正整数（5 奇 5 偶），奇数降序、偶数升序排序。

**输入**：一行 10 个正整数。
**输出**：先降序奇数，再升序偶数，空格分隔。

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    int odd[5], even[5];
    int oi = 0, ei = 0;
    for (int i = 0; i < 10; i++) {
        int x; cin >> x;
        if (x % 2) odd[oi++] = x;
        else       even[ei++] = x;
    }
    sort(odd, odd + 5, greater<int>());
    sort(even, even + 5);
    for (int i = 0; i < 5; i++) cout << odd[i] << " ";
    for (int i = 0; i < 5; i++) cout << even[i] << " ";
    cout << endl;
    return 0;
}
```

---

## 算法复杂度速查

| 算法 | 时间复杂度 | 空间 | 适用场景 |
|------|-----------|------|---------|
| 约瑟夫递推 | $O(n)$ | $O(1)$ | 求最后幸存者 |
| KMP | $O(n+m)$ | $O(m)$ | 单模式串匹配 |
| Dijkstra 堆优化 | $O(E\log V)$ | $O(V+E)$ | 稀疏图单源最短路 |
| Dijkstra 朴素 | $O(V^2)$ | $O(V^2)$ | 稠密图单源最短路 |
| Floyd | $O(V^3)$ | $O(V^2)$ | 全源最短路 |
| Prim 堆优化 | $O(E\log V)$ | $O(V+E)$ | 稀疏图 MST |
| Prim 朴素 | $O(V^2)$ | $O(V^2)$ | 稠密图 MST |
| 拓扑排序 | $O(V+E)$ | $O(V+E)$ | DAG 关键路径 |
| 哈夫曼树 | $O(n\log n)$ | $O(n)$ | 最优编码 |
| 欧拉函数（单） | $O(\sqrt{n})$ | $O(1)$ | 求 $\phi(n)$ |
| 欧拉函数筛 | $O(n)$ | $O(n)$ | 批量求 $\phi(1..n)$ |

---

## 常见坑点汇总

| # | 问题 | 说明 |
|---|------|------|
| 1 | 进制转换 N=0 | 必须特判，返回 `"0"` |
| 2 | KMP 下标混用 | 前缀数组和匹配循环必须统一索引方式 |
| 3 | 二叉链表第三次遍历 | 原代码调两次中序，已改为后序 |
| 4 | VLA | `int a[n][n]` 非标准 C++，用 `vector` |
| 5 | INF 值 | `0x3f3f3f` 少一个 `3f`，应为 `0x3f3f3f3f` |
| 6 | Floyd 循环顺序 | $k$ 必须最外层 |
| 7 | 多测例重置 | 优先队列/邻接表/标记数组注意每组清零 |
| 8 | 尾随空格 | 严格 OJ 注意行末不加多余空格 |

---

## 总结

1. **线性和串**是基础——约瑟夫 $O(n)$ 递推、KMP 的前缀函数思想值得反复琢磨
2. **树的遍历**是万能框架——先序建树、中序和后序输出，递归三行搞定
3. **Dijkstra / Prim** 本质相同——都是「每次从候选集中选最小元素加入集合」
4. **Floyd** 虽然 $O(n^3)$，但代码极短，小数据首选
5. **欧拉函数** 在「与 N 互质的数」相关题目中反复出现（1A、1B）
6. 代码中已修正的问题（进制转换 0、KMP 下标、二叉链表后序遍历）考前再看一遍
