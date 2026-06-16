---
title: 数据结构实践期末复习
published: 2026-06-12
description: "系统总结数据结构课程28道编程题：线性表、字符串、矩阵、树与二叉树、图论、排序查找与数论，每道题附完整题解与可运行代码"
image: ""
tags: [数据结构, 期末复习, C++, 算法, 大学课程]
category: 日常学习
draft: false
lang: zh
comment: true
---

## 前言

本文汇总了数据结构课程的全部 28 道编程实践题，按**数据结构类型**重新组织为六大模块。每题包含**题目描述、输入输出格式、题解思路与完整代码**。

---

## 一、线性结构

### 1.1 约瑟夫问题

> $n$ 个人围成一圈，从第 $1$ 人开始报数，报到 $m$ 的人出列，求最后剩下的人的编号。

**输入**：两个正整数 $n$ 和 $m$（$n \ge 2$，$m \ge 1$）。
**输出**：最后剩下的人的编号。

**题解**：经典约瑟夫环问题，$O(n)$ 递推求解。

设 $f(i)$ 表示 $i$ 个人、每次报 $m$ 个数时最后幸存者的编号（0-indexed）。当 $i=1$ 时，$f(1)=0$。当人数从 $i-1$ 变为 $i$ 时，新加入的人排在最前面，相当于所有人的编号向后偏移了 $m$。因此：

$$
f(i) = (f(i-1) + m) \bmod i,\quad \text{答案} = f(n) + 1
$$

```cpp
#include <iostream>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    int ans = 0;
    for (int i = 2; i <= n; i++)
        ans = (ans + m) % i;
    cout << ans + 1 << endl;
    return 0;
}
```

### 1.2 找新朋友

> $N$ 个会员编号 $1 \sim N$，会长编号 $N$。凡和 $N$ 有大于 $1$ 的公约数即为「老朋友」，其余为「新朋友」。求新朋友人数。多组测试，$N < 32768$。

**输入**：第一行组数 $CN$，接下来 $CN$ 行每行一个 $N$。
**输出**：每组一行，输出新朋友人数。

**题解**：「与 $N$ 互质的数的个数」就是欧拉函数 $\phi(N)$。

$\phi(N)$ 的值等于 $1 \sim N$ 中与 $N$ 互质的数的个数。因为数据范围 $N < 32768$ 且有多组测试，用**筛法** $O(N \log\log N)$ 预处理出 $1 \sim 32778$ 内所有数的 $\phi$ 值，查询时 $O(1)$ 输出。

筛法的核心：用 `phi[i] = i` 初始化，对每个质数 $i$，将其所有倍数 $j$ 的 $\phi$ 值乘以 $(1 - 1/i)$，即 `phi[j] = phi[j] / i * (i - 1)`。

```cpp
#include <iostream>
using namespace std;

const int N = 32778;
int phi[N + 10];

void euler_sieve() {
    for (int i = 0; i <= N; i++) phi[i] = i;
    for (int i = 2; i < N; i++)
        if (phi[i] == i)               // i 是质数
            for (int j = i; j <= N; j += i)
                phi[j] = phi[j] / i * (i - 1);
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

### 1.3 互质

> 给定正整数 $n$，求有多少个比 $n$ 小且与 $n$ 互质的正整数。多组测试，$n \le 10^9$，$n=0$ 结束。

**输入**：多行正整数 $n$，以 $0$ 结束。
**输出**：每行输出结果。

**题解**：本题仍求 $\phi(n)$，但 $n$ 上限达 $10^9$，无法筛法预处理。改用**质因数分解法**单次 $O(\sqrt{n})$ 计算。

对 $n$ 分解质因数，利用公式 $\phi(n) = n \cdot \prod (1 - \frac{1}{p_i})$，其中 $p_i$ 是 $n$ 的所有互异质因子。实现时用 `res = res / i * (i - 1)` 等价于 `res * (1 - 1/i)`，并注意最后可能剩一个大于 $\sqrt{n}$ 的质因子。

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

### 1.4 进制转换

> 将十进制整数 $N$ 转为 $R$ 进制（$2 \le R \le 20$），10 以上数字用 A、B、C…… 表示，负号保留。

**输入**：多组数据，每行 $N$ 和 $R$，空格分隔。
**输出**：转换后的字符串。

**题解**：短除法逐位取余。将 $n$ 的绝对值不断除以 $R$，余数序列倒序即为结果。注意特判 $N=0$（返回 `"0"`），以及负数标记符号单独处理。

```cpp
#include <iostream>
#include <string>
using namespace std;

string convert(int n, int R) {
    if (n == 0) return "0";
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

### 1.5 整数求和式的计算

> 读入形如 `12+34=` 的表达式，输出 `12+34=46`。

**输入**：一行，一个求和式 `a+b=`。
**输出**：`a+b=结果`。

**题解**：用 `string::find` 定位 `+` 和 `=` 的位置，用 `substr` 截取数字部分，`stoi` 转为整数后求和。也可以直接用 `cin >> a >> c >> b >> d` 逐个读取。

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

### 1.6 波兰表达式求值

> 给定前缀表达式（运算符前置），运算符 `+ - * /`，操作数为浮点数。求值。

**输入**：一行波兰表达式，空格分隔。
**输出**：表达式的值，保留 6 位小数。

**题解**：递归下降求值。每次读入一个 token：若是运算符，递归求左右两个操作数再运算；若是数字，直接转换为浮点数返回。这种「遇运算符则递归两次」的模式天然处理了运算符前置的嵌套结构。

```cpp
#include <iostream>
#include <cstdio>
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

### 1.7 合并有序队列

> 两个长度均为 $n$ 的升序队列，合并为一个升序队列。

**输入**：第一行 $n$，第二行 $n$ 个数（队列 1），第三行 $n$ 个数（队列 2）。
**输出**：一行 $2n$ 个数，空格分隔。

**题解**：经典二路归并（Merge 的合并步）。双指针 $i$、$j$ 分别指向两个队列头部，每次取较小者加入结果数组，对应指针前进。当某一队列遍历完毕，将另一队列剩余部分整体追加。

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
    while (i < n && j < n)
        a[i] <= b[j] ? res.push_back(a[i++]) : res.push_back(b[j++]);
    while (i < n) res.push_back(a[i++]);
    while (j < n) res.push_back(b[j++]);

    for (int k = 0; k < 2 * n; k++)
        cout << res[k] << " ";
    cout << endl;
    return 0;
}
```

### 1.8 寻找未出现的最小正整数

> $n$ 个整数，找出未出现的最小正整数。$O(n)$ 时间，$O(1)$ 额外空间。

**输入**：第一行 $n$，第二行 $n$ 个整数。
**输出**：未出现的最小正整数。

**题解**：原地哈希。我们希望每个值在 $[1, n]$ 范围内的数 $x$ 被放到下标 $x-1$ 的位置。遍历数组，对于满足 $1 \le a[i] \le n$ 且 $a[i]$ 不在正确位置上的元素，不断将其与目标位置交换，直到当前元素无法再换为止。交换完成后，第一个 $a[i] \neq i+1$ 的位置即为答案；若全部就位，答案为 $n+1$。

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

const int N = 10010;

int main() {
    int n, a[N];
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];

    for (int i = 0; i < n; i++)
        while (a[i] > 0 && a[i] <= n && a[a[i] - 1] != a[i])
            swap(a[i], a[a[i] - 1]);

    int ans = n + 1;
    for (int i = 0; i < n; i++)
        if (a[i] != i + 1) { ans = i + 1; break; }
    cout << ans << endl;
    return 0;
}
```

### 1.9 线性表设计（链表重排）

> 将链表 $L_0 \to L_1 \to \dots \to L_{n-1}$ 重排为 $L_0 \to L_{n-1} \to L_1 \to L_{n-2} \to \dots$

**输入**：链表节点数 $n$，以及 $n$ 个节点值。
**输出**：重排后的链表。

**题解**：三步走——① 快慢指针找中点；② 反转后半段链表；③ 交替合并前后两段。关键是找中点后将链表断开，后半段反转后逐个插入前半段。时间复杂度 $O(n)$，空间 $O(1)$。

```cpp
#include <iostream>
using namespace std;

struct NODE { int data; NODE* next; };

NODE* reverse(NODE* head) {
    NODE *prev = nullptr, *cur = head;
    while (cur) {
        NODE* nxt = cur->next;
        cur->next = prev;
        prev = cur; cur = nxt;
    }
    return prev;
}

NODE* findMiddle(NODE* head) {
    NODE *slow = head, *fast = head;
    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
    return slow;
}

void rearrange(NODE* head) {
    if (!head || !head->next) return;
    NODE* mid = findMiddle(head);
    NODE* second = reverse(mid->next);
    mid->next = nullptr;
    NODE* first = head;
    while (second) {
        NODE *t1 = first->next, *t2 = second->next;
        first->next = second;
        second->next = t1;
        first = t1; second = t2;
    }
}

NODE* createNode(int data) { return new NODE{data, nullptr}; }

void printList(NODE* head) {
    for (NODE* p = head; p; p = p->next)
        cout << p->data << (p->next ? " -> " : " -> NULL\n");
}

int main() {
    int n; cin >> n;
    if (n <= 0) return 0;
    NODE *head = nullptr, *tail = nullptr;
    for (int i = 0; i < n; i++) {
        int val; cin >> val;
        NODE* node = createNode(val);
        if (!head) head = tail = node;
        else { tail->next = node; tail = node; }
    }
    cout << "原始链表: "; printList(head);
    rearrange(head);
    cout << "重排后链表: "; printList(head);
    return 0;
}
```

---

## 二、字符串

### 2.1 子串个数

> 给定若干字符串（长度 $\le 1000$），求每个字符串的子串个数（含空串）。

**输入**：多行，每行一个不含空格的字符串。
**输出**：每行输出该字符串的子串个数。

**题解**：长度为 $n$ 的字符串，以位置区分，共有 $\frac{n(n+1)}{2}$ 个非空连续子串，加上空串得 $\frac{n(n+1)}{2} + 1$。

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

### 2.2 KMP 模式匹配

> 在文本串 $S$ 中找模式串 $P$ 首次出现的位置（从 $1$ 开始计数），未找到输出 $0$。

**输入**：第一行目标串 $S$，第二行模式串 $P$（$|P| < 100$）。
**输出**：位置或 $0$。

**题解**：KMP 算法的核心是利用模式串自身的重复结构，构造 `next` 数组来记录「匹配失败时该回退到哪里」，避免暴力算法中 $i$ 指针的回溯。

`next[i]` 表示 $P[1..i]$ 的最长相等前后缀长度。匹配时，若 $S[i] \neq P[j+1]$，则 $j$ 回退到 `next[j]` 继续尝试；若匹配成功则 $j$ 前进。当 $j$ 等于模式串长度时匹配完成，起始位置为 $i - n + 1$。

时间复杂度 $O(|S|+|P|)$。本题数据量小，暴力也能过，但 KMP 是面试高频考点。

```cpp
#include <iostream>
#include <cstring>
using namespace std;

const int N = 100010, M = 1010;
char s[N], p[M];
int ne[M];

int main() {
    cin >> s + 1 >> p + 1;               // 1-indexed
    int m = strlen(s + 1), n = strlen(p + 1);

    for (int i = 2, j = 0; i <= n; i++) {
        while (j && p[i] != p[j + 1]) j = ne[j];
        if (p[i] == p[j + 1]) j++;
        ne[i] = j;
    }

    for (int i = 1, j = 0; i <= m; i++) {
        while (j && s[i] != p[j + 1]) j = ne[j];
        if (s[i] == p[j + 1]) j++;
        if (j == n) { cout << i - n + 1 << endl; return 0; }
    }
    cout << 0 << endl;
    return 0;
}
```

**暴力匹配**（更简单，本题数据可 AC）：

```cpp
#include <iostream>
#include <cstring>
using namespace std;

int main() {
    char s[100010], p[10010];
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

### 3.1 主对角线求和

> 给定 $N \times N$ 方阵，求主对角线元素之和。

**输入**：第一行 $N$（$N < 100$），接下来 $N$ 行每行 $N$ 个整数。
**输出**：对角线元素之和。

**题解**：主对角线满足行下标 $=$ 列下标，直接 `sum += a[i][i]` 即可。

```cpp
#include <iostream>
using namespace std;

int main() {
    int n, a[101][101];
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

### 3.2 顺时针螺旋矩阵

> 给定 $N$（$N < 100$），生成 $N \times N$ 顺时针螺旋矩阵。

**输入**：一个正整数 $N$。
**输出**：螺旋矩阵，每行空格分隔。

**题解**：模拟法。维护上下左右四个边界 `top`、`bottom`、`left`、`right`，按「向右 → 向下 → 向左 → 向上」的顺序依次填入数字，每填完一条边就将对应边界内缩一格，直到填满 $N^2$ 个数。

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n; cin >> n;
    vector<vector<int>> a(n, vector<int>(n));
    int top = 0, bottom = n - 1, left = 0, right = n - 1, num = 1;

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
        for (int j = 0; j < n; j++) cout << a[i][j] << " ";
        cout << endl;
    }
    return 0;
}
```

---

## 四、树与二叉树

### 4.1 树的先根遍历

> 给定若干对 `父节点 子节点`（大写字母，节点数 $< 26$），输出树的先根遍历。

**输入**：多行 `父 子`，EOF 结束。
**输出**：先根遍历序列，字母间空格分隔。

**题解**：用邻接表建树（`tree[u].push_back(v)`），同时标记哪些节点有父节点。遍历结束后，没有父节点且有孩子的节点即为根。先根遍历 = 先访问当前节点，再递归子节点。

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
    for (int i = 0; i < MAXN; i++)
        if (!hasParent[i] && !tree[i].empty()) { preorder(i); break; }
    cout << endl;
    return 0;
}
```

### 4.2 树的后根遍历

> 同 4.1，输出后根遍历序列。

**输入输出格式同 4.1**。

**题解**：后根遍历 = 先递归子节点，再访问当前节点。与先根遍历仅输出顺序不同。

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
    for (int i = 0; i < MAXN; i++)
        if (!hasParent[i] && !tree[i].empty()) { postorder(i); break; }
    cout << endl;
    return 0;
}
```

### 4.3 汉诺塔

> $n$ 个盘子从 A 柱移到 C 柱，B 柱辅助。大盘不能在小盘上方，求移动过程。

**输入**：整数 $n$（$n < 64$）。
**输出**：每次移动：`步数 盘子半径 从->到`。

**题解**：递归的经典案例。将 $n$ 个盘子从 A 移到 C 分解为三步：① 将上面 $n-1$ 个盘子从 A 借 C 移到 B；② 将最大的第 $n$ 个盘子从 A 直接移到 C；③ 将 B 上的 $n-1$ 个盘子借 A 移到 C。递归终止条件：$n = 1$ 时直接移动。

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
    int n; cin >> n;
    hanoi(n, 'A', 'C', 'B');
    return 0;
}
```

### 4.4 二叉链表存储的二叉树

> 给定带空节点标记（空格）的先序序列，输出先序、中序、后序三种遍历。

**输入**：一行字符串，空格表示空节点，长度 $\le 100$。
**输出**：三行，分别为先序、中序、后序遍历。

**题解**：递归建树。全局索引 `idx` 扫描字符串：当前字符非空格则创建节点并递归建左右子树；遇到空格则跳过并返回 `nullptr`。先序建树的递归结构天然对应了「根 → 左 → 右」的顺序——这正是先序序列的定义。

三种遍历仅区别访问 `cout` 的时机：先序在递归前，中序在左递归后，后序在右递归后。

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
    if (idx < len && S[idx] != ' ') root->left  = build(S, len);
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
    postorder(root); cout << endl;
    return 0;
}
```

### 4.5 哈夫曼树

> $n$ 个叶子节点各有权值，求所有叶子的带权路径长度（WPL）之和。多组数据。

**输入**：每组第一行 $n$（$2 \le n \le 1000$），第二行 $n$ 个权值。
**输出**：每组一行 WPL。

**题解**：WPL = 每次合并产生的非叶子节点权值之和。用小根堆（优先队列）模拟哈夫曼树的构建过程：每次取出最小的两个权值 $a$、$b$，累加 $a+b$ 到答案，将 $a+b$ 重新入堆。重复 $n-1$ 次直到堆中只剩一个元素。

这也是经典问题「合并果子」——总代价 = 所有合并代价之和。

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

### 4.6 已知先序+后序求中序

> 给定二叉树先序和后序遍历（节点值互异），判断树是否唯一确定，并输出一种中序。

**输入**：第一行 $N$（$\le 30$），第二行先序，第三行后序。
**输出**：第一行 `Yes`/`No`，第二行中序序列。

**题解**：核心判定：当某一子树的「左子树根」（先序第 2 个节点）等于「右子树根」（后序倒数第 2 个节点）时，说明该子树只有一个子节点，此时无法区分该子节点是左还是右，树不唯一。

对于唯一的情况，通过左子树的根节点在后序中的位置确定左子树大小，然后递归划分左右子树。OJ 实测要求不唯一时默认将子树归为右支。

```cpp
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
    int n; cin >> n;
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

### 5.1 Dijkstra 最短路径（堆优化）

> 有向图，求 start 到 end 的最短路径，不可达输出 `STOP`。

**输入**：第一行 $N$ 和 $M$（$N,M < 100$），接下来 $M$ 行 `x y z`，最后一行 `start end`。
**输出**：最短路径长度或 `STOP`。

**题解**：堆优化 Dijkstra。维护一个小根堆，每次取出距离起点最近的未访问节点，对其所有出边做松弛操作——若 `dist[v] > dist[u] + w`，则更新并加入堆。

关键细节：`if (d != dist[u]) continue` 实现「懒惰删除」——堆中可能存有过时的距离记录，跳过即可。

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
    int s, e; cin >> s >> e;

    int dist[MAXN]; bool vis[MAXN] = {false};
    memset(dist, 0x3f, sizeof(dist));
    dist[s] = 0;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    pq.push({0, s});

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
    if (dist[e] == INF) cout << "STOP" << endl;
    else                cout << dist[e] << endl;
    return 0;
}
```

### 5.2 Floyd 全源最短路

> 同 5.1，用 Floyd 算法求解。

**题解**：Floyd-Warshall 算法本质是动态规划。$d[i][j]$ 表示从 $i$ 到 $j$ 的最短距离。枚举中间节点 $k$，尝试用 $i \to k \to j$ 的路径更新 $d[i][j]$。$k$ 必须放在最外层——因为第 $k$ 轮迭代的意义是「允许经过前 $k$ 个节点」。

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

const int N = 210, INF = 1e9;

int main() {
    int n, m, d[N][N];
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
    int s, e; cin >> s >> e;
    if (d[s][e] > INF / 2) cout << "STOP" << endl;
    else                   cout << d[s][e] << endl;
    return 0;
}
```

### 5.3 朴素 Dijkstra

> 有向图，求顶点 1 到目标顶点 $i$ 的最短路径。

**输入**：第一行 $n$ 和 $m$，接下来 $m$ 行 `a b c`，最后一行目标顶点 $i$。
**输出**：最短距离，不可达输出 $-1$。

**题解**：朴素 Dijkstra 适用于稠密图（$n < 100$）。每次从未访问节点中选距离最小的，标记已访问，再用它松弛所有邻居。时间复杂度 $O(n^2)$，空间 $O(n^2)$。相比于堆优化版，代码更简短且无需邻接表。

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

### 5.4 Prim 最小生成树

> 无向带权连通图，求最小生成树的总代价。

**输入**：第一行 $n$（$\le 50$），接下来 $n \times n$ 邻接矩阵（$0$ 表示无边）。
**输出**：MST 总代价。

**题解**：堆优化 Prim。算法与 Dijkstra 极其相似——Prim 每次选**离生成树集合最近的节点**（即边权最小的未访问节点），加入后更新邻居到集合的距离。本质上两个算法都在执行「每次将最小的候选元素加入集合」的过程。

区别在于：Dijkstra 的 `dist[v]` 表示从源点到 $v$ 的最短距离（$dist[v] = dist[u] + w$），而 Prim 的 `dist[v]` 表示从生成树集合到 $v$ 的最小边权（$dist[v] = w$）。若所有边权非负，Prim 必然得到 MST。

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <cstring>
using namespace std;

typedef long long ll;
const int INF = 0x3f3f3f3f;

int main() {
    int n; cin >> n;
    vector<pair<int, int>> g[5001];
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++) {
            int w; cin >> w;
            if (w != 0) g[i].push_back({j, w});
        }

    int dist[5001]; bool vis[5001] = {false};
    memset(dist, 0x3f, sizeof(dist));
    dist[1] = 0;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    pq.push({0, 1});
    ll ans = 0; int cnt = 0;

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (vis[u]) continue;
        vis[u] = true; ans += d; cnt++;
        for (auto [v, w] : g[u])
            if (!vis[v] && dist[v] > w) {
                dist[v] = w;
                pq.push({dist[v], v});
            }
    }
    cout << (cnt == n ? ans : -1);
    return 0;
}
```

### 5.5 关键路径（拓扑排序求最长路）

> DAG 中的子任务有先后依赖和耗时，求 A 到 Z 的最短完成时间（即最长路径）。

**输入**：第一行 $N$ 和 $M$（$N < 26$），接下来 $M$ 行 `起点 终点 天数`。
**输出**：工程最少天数。

**题解**：对 DAG 做拓扑排序，同时计算每个节点的最早开始时间 `earliest[v]`。对于每一条边 $u \to v$（权重 $w$），$v$ 的最早开始时间 = $\max(v$ 当前值, $u$ 的最早开始时间 $+ w)$。

排序过程中，每个节点入队时它的所有前驱已经处理完毕，可以放心取 $\max$。最终 Z 的 `earliest` 值即为答案。

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <cstring>
using namespace std;

const int MAXN = 26;

int main() {
    int N, M; cin >> N >> M;
    vector<pair<int, int>> graph[MAXN];  // {to, weight}
    int indeg[MAXN] = {0};

    while (M--) {
        char u, v; int w;
        cin >> u >> v >> w;
        graph[u - 'A'].push_back({v - 'A', w});
        indeg[v - 'A']++;
    }

    int earliest[MAXN];
    memset(earliest, -1, sizeof(earliest));
    earliest[0] = 0;  // 'A'

    queue<int> q; q.push(0);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (auto [v, w] : graph[u]) {
            earliest[v] = max(earliest[v], earliest[u] + w);
            if (--indeg[v] == 0) q.push(v);
        }
    }
    cout << earliest['Z' - 'A'] << endl;
    return 0;
}
```

### 5.6 机器人王国路径

> $N$ 层树状卫星城，每个城市到父城市有距离，求指定卫星城到首都的总距离。

**输入**：第一行 $N$（$\le 10$），接下来 $2^{N+1}-2$ 行 `父城市 子城市 距离`，最后一行目标城市名。
**输出**：目标城市到首都的距离。

**题解**：输入给出了每个城市的父节点和到父节点的距离。从目标城市出发，不断向上追溯父节点累加距离，直到找不到父节点（即到达首都）为止。时间复杂度 $O(n)$。

本题本质上是一个自底向上的树遍历问题，与「求树中某节点的深度」等价。

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

struct City { string name, parent; int dist; };

int main() {
    int N; cin >> N;
    int n = (1 << (N + 1)) - 2;
    vector<City> cities(n);
    for (int i = 0; i < n; i++) {
        string from, to; int d;
        cin >> from >> to >> d;
        cities[i] = {to, from, d};
    }
    string target; cin >> target;

    int total = 0;
    while (true) {
        int idx = -1;
        for (int i = 0; i < n; i++)
            if (cities[i].name == target) { idx = i; break; }
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

### 6.1 寻找第二小的数

> $n$ 个整数中第二小的数（相同值算一个）。不存在输出 `NO`。

**输入**：第一行组数 $C$，每组第一行 $n$（$2 \le n \le 10$），第二行 $n$ 个数。
**输出**：每组一行，第二小的数或 `NO`。

**题解**：用 `set<int>` 去重并自动排序。若去重后元素数 $< 2$ 说明不存在第二小的数，输出 `NO`；否则取第二个元素（`vector` 的下标 `[1]`）。

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
        for (int i = 0; i < n; i++) { int x; cin >> x; s.insert(x); }
        vector<int> v(s.begin(), s.end());
        cout << (v.size() < 2 ? "NO" : to_string(v[1])) << endl;
    }
    return 0;
}
```

### 6.2 按各位数字之和排序

> 按十进制各位数字之和从大到小排序；和相同则按数值从大到小。

**输入**：第一行 $n$（$\le 1000$），第二行 $n$ 个正整数（$\le 10^8$）。
**输出**：排序后的序列。

**题解**：自定义比较器 `cmp`。先计算两个数的各位数字之和，若不等则按和降序；若相等则按数值降序。使用 `sort` 的第三个参数传入比较器。

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

### 6.3 奇偶数分别排序

> 10 个正整数（5 奇 5 偶），奇数降序、偶数升序。

**输入**：一行 10 个正整数。
**输出**：先降序奇数，再升序偶数。

**题解**：读入时按奇偶分到两个数组。奇数数组用 `greater<int>()` 降序排列，偶数数组用默认比较器升序排列，最后先输出奇数再输出偶数。

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    int odd[5], even[5], oi = 0, ei = 0;
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
| 拓扑排序 | $O(V+E)$ | $O(V+E)$ | DAG 关键路径 |
| 哈夫曼树 | $O(n\log n)$ | $O(n)$ | 最优编码 |
| 欧拉函数（单） | $O(\sqrt{n})$ | $O(1)$ | 求单值 $\phi(n)$ |
| 欧拉函数筛 | $O(n)$ | $O(n)$ | 批量求 $\phi(1..n)$ |

---

## 总结

1. **线性结构**是基础——约瑟夫 $O(n)$ 递推、二路归并、原地哈希都是手写代码的基本功
2. **字符串的 KMP** 用 `next` 数组避免匹配时的指针回溯，是面试必考
3. **树的遍历**是万能框架——先序建树、三种遍历的区别仅在于 `cout` 的位置
4. **Dijkstra / Prim** 本质相同——都是「每次从候选集中选最小元素加入集合」
5. **Floyd** 虽 $O(n^3)$，但代码极短，三层循环搞定全源最短路
6. **欧拉函数** 在 1A、1B 中反复出现，掌握筛法和单值法两种写法
