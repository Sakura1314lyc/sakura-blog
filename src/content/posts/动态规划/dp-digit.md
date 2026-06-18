---
title: 数位 DP 从入门到精通
published: 2026-06-19
description: "系统掌握数位 DP 的核心思想与通用模板：记忆化搜索写法、lead 前导零与 limit 紧贴上界处理，含经典例题与完整代码"
image: ""
tags: [动态规划, DP, 数位DP, 算法, 竞赛编程]
category: 动态规划
draft: false
lang: zh
comment: true
---

## 什么是数位 DP？

**数位 DP** 是一种在**数字的十进制（或 $k$ 进制）表示上**做动态规划的技巧。它的典型应用场景是：

> 统计区间 $[L, R]$ 内满足某种**数位性质**的数字的个数（或和、乘积等）。

数位 DP 的通用套路是 `f(R) - f(L-1)`，将「区间统计」转化为「前缀统计」：

$$
\text{count}[L, R] = f(R) - f(L-1)
$$

其中 $f(n)$ 表示 $[0, n]$（或 $[1, n]$）中满足条件的数字个数。

### 为什么用记忆化搜索而不是递推？

数位 DP 有两种写法：
1. **递推（填表）**：按数位从高到低 DP，但处理前导零和上限约束时状态转移非常复杂
2. **记忆化搜索（DFS + memo）**：逐位枚举数字，通过参数传递状态，代码直观且模板化

竞赛中**几乎全部使用记忆化搜索写法**。本文也以此为主线。

---

## 一、通用模板

### 1.1 核心思想

从**最高位到最低位**逐位枚举数字。DFS 的参数携带当前状态，记忆化时只缓存「不受限制」的状态。

关键参数：
- `pos`：当前处理到第几位（从高位向低位，`pos = 0` 表示个位）
- 状态参数：根据题目定义（如前一位数字、是否出现某模式等）
- `lead`：是否还在前导零阶段（即之前填的都是 0）
- `limit`：当前位是否受到 $n$ 的上界限制

### 1.2 为何「limit = false」才能记忆化？

当日志 `limit = true` 时，当前位的取值不能超过 $n$ 的对应位——这个状态依赖于 $n$，不同 $n$ 下的缓存不能复用。而当 `limit = false` 时，当前位可以取 $0 \sim 9$ 中的任意值，状态与 $n$ 无关，可以安全缓存。

**因此记忆化数组的维度不包括 `limit` 和 `lead`**（或只缓存 `lead = false` 的情况）。

### 1.3 模板代码

```cpp
#include <iostream>
#include <cstring>
#include <vector>
using namespace std;
using ll = long long;

// 将整数 n 的每一位拆出，高位在前
vector<int> digits;
void split(ll n) {
    digits.clear();
    while (n > 0) {
        digits.push_back(n % 10);
        n /= 10;
    }
    reverse(digits.begin(), digits.end());  // 高位在前
}

// 记忆化数组：dp[pos][...状态...]
// 维度和状态定义根据题目而定
ll dp[20][2];   // 示例：dp[pos][某状态]

// pos: 当前处理到第几位（从 0 开始，高位在前）
// 状态参数: 按题目定义
// lead: 是否还在前导零阶段
// limit: 当前位的取值是否受到 n 上限的约束
ll dfs(int pos, int state, bool lead, bool limit) {
    if (pos == digits.size()) {
        // 所有位都处理完毕，返回「这个数是否满足条件」
        return 1;  // 或 return state == target;
    }

    // 只有不受限制的状态才能被记忆化
    if (!limit && !lead && dp[pos][state] != -1)
        return dp[pos][state];

    int up = limit ? digits[pos] : 9;  // 当前位能取的最大值
    ll ans = 0;

    for (int d = 0; d <= up; d++) {
        bool nxt_lead = lead && (d == 0);     // 仍在前导零阶段
        bool nxt_limit = limit && (d == up);  // 仍受上界限制
        int nxt_state = state;                // 更新状态（按题而定）
        ans += dfs(pos + 1, nxt_state, nxt_lead, nxt_limit);
    }

    if (!limit && !lead)
        dp[pos][state] = ans;

    return ans;
}

ll solve(ll n) {
    if (n < 0) return 0;
    split(n);
    memset(dp, -1, sizeof(dp));
    return dfs(0, 0, true, true);
}

// 区间答案
ll query(ll L, ll R) {
    return solve(R) - solve(L - 1);
}
```

---

## 二、经典例题

### 2.1 数字计数：统计区间内某数字出现的次数

> 求 $[L, R]$ 中，数字 $k$（$0 \le k \le 9$）出现的总次数。例如 $[1, 22]$ 中数字 $2$ 出现 $6$ 次（$2, 12, 20, 21, 22$ 计数其中 $2$ 的个数）。

**状态设计**：$dp[pos][cnt]$ 表示当前处理到第 $pos$ 位、且已经统计了 $cnt$ 个目标数字 $k$ 时，剩余位能贡献的答案。

```cpp
#include <iostream>
#include <cstring>
#include <vector>
#include <algorithm>
using namespace std;
using ll = long long;

vector<int> digits;
ll dp[20][20];  // dp[pos][cnt]：已统计 cnt 个目标数字
int target;      // 要统计的数字 0~9

ll dfs(int pos, int cnt, bool lead, bool limit) {
    if (pos == digits.size()) return cnt;

    if (!limit && !lead && dp[pos][cnt] != -1)
        return dp[pos][cnt];

    int up = limit ? digits[pos] : 9;
    ll ans = 0;
    for (int d = 0; d <= up; d++) {
        bool nxt_lead = lead && (d == 0);
        int nxt_cnt = cnt;
        if (!nxt_lead && d == target)  // 非前导零且匹配目标
            nxt_cnt++;
        ans += dfs(pos + 1, nxt_cnt, nxt_lead, limit && (d == up));
    }

    if (!limit && !lead)
        dp[pos][cnt] = ans;
    return ans;
}

ll solve(ll n, int k) {
    if (n < 0) return 0;
    target = k;
    digits.clear();
    while (n > 0) { digits.push_back(n % 10); n /= 10; }
    reverse(digits.begin(), digits.end());
    memset(dp, -1, sizeof(dp));
    return dfs(0, 0, true, true);
}

int main() {
    ll L, R;
    cin >> L >> R;
    for (int k = 0; k <= 9; k++) {
        cout << solve(R, k) - solve(L - 1, k);
        if (k < 9) cout << " ";
    }
    cout << endl;
    return 0;
}
```

> 📝 **练习**：[洛谷 P2602 数字计数](https://www.luogu.com.cn/problem/P2602)

### 2.2 不要 62：数位 DP 的入门经典

> 求 $[L, R]$ 中**不包含 4** 且**不包含连续 62** 的数字个数。

**状态设计**：$dp[pos][last]$ 表示当前位是第 $pos$ 位，上一位填的是 $last$。

```cpp
#include <iostream>
#include <cstring>
#include <vector>
#include <algorithm>
using namespace std;

vector<int> digits;
int dp[10][10];  // dp[pos][last]：pos 位，上一位是 last

int dfs(int pos, int last, bool lead, bool limit) {
    if (pos == digits.size()) return 1;  // 成功走到末尾

    if (!limit && !lead && dp[pos][last] != -1)
        return dp[pos][last];

    int up = limit ? digits[pos] : 9;
    int ans = 0;
    for (int d = 0; d <= up; d++) {
        if (d == 4) continue;                      // 不含 4
        if (last == 6 && d == 2) continue;         // 不含 62
        bool nxt_lead = lead && (d == 0);
        ans += dfs(pos + 1, d, nxt_lead, limit && (d == up));
    }

    if (!limit && !lead)
        dp[pos][last] = ans;
    return ans;
}

int solve(int n) {
    if (n < 0) return 0;
    digits.clear();
    while (n > 0) { digits.push_back(n % 10); n /= 10; }
    reverse(digits.begin(), digits.end());
    memset(dp, -1, sizeof(dp));
    return dfs(0, 0, true, true);
}

int main() {
    int L, R;
    while (cin >> L >> R && (L || R))
        cout << solve(R) - solve(L - 1) << endl;
    return 0;
}
```

> 📝 **练习**：[HDU 2089 不要 62](https://acm.hdu.edu.cn/showproblem.php?pid=2089)

### 2.3 Windy 数：相邻数位差 $\ge 2$

> 不含前导零的正整数中，相邻两个数字之差的绝对值 $\ge 2$ 的数称为 Windy 数。求 $[L, R]$ 中 Windy 数的个数。

**状态设计**：$dp[pos][last]$。注意 `last` 的初始值需要是「不影响第一位选择」的特殊值（如 $-2$，这样第一位选任何数都满足 $|d - (-2)| \ge 2$）。

```cpp
#include <iostream>
#include <cstring>
#include <vector>
#include <algorithm>
using namespace std;

vector<int> digits;
int dp[12][12];  // dp[pos][last]

int dfs(int pos, int last, bool lead, bool limit) {
    if (pos == digits.size()) return 1;

    if (!limit && !lead && dp[pos][last] != -1)
        return dp[pos][last];

    int up = limit ? digits[pos] : 9;
    int ans = 0;
    for (int d = 0; d <= up; d++) {
        if (!lead && abs(d - last) < 2) continue;  // 不满足差 ≥ 2
        bool nxt_lead = lead && (d == 0);
        int nxt_last = nxt_lead ? -2 : d;          // 前导零时 last 用 -2 占位
        ans += dfs(pos + 1, nxt_last, nxt_lead, limit && (d == up));
    }

    if (!limit && !lead)
        dp[pos][last] = ans;
    return ans;
}

int solve(int n) {
    if (n < 0) return 0;
    digits.clear();
    while (n > 0) { digits.push_back(n % 10); n /= 10; }
    reverse(digits.begin(), digits.end());
    memset(dp, -1, sizeof(dp));
    return dfs(0, -2, true, true);  // last 初始为 -2，确保第一位可以选任何数
}
```

> 📝 **练习**：[洛谷 P2657 Windy 数](https://www.luogu.com.cn/problem/P2657)

### 2.4 数字和能被某数整除

> 求 $[L, R]$ 中各位数字之和 $\bmod m = 0$ 的数的个数。

**状态设计**：$dp[pos][sum]$，其中 `sum` 是当前各位数字之和 $\bmod m$。

```cpp
int m;
int dp[20][100];  // dp[pos][sum % m], m ≤ 100

int dfs(int pos, int sum, bool lead, bool limit) {
    if (pos == digits.size())
        return (sum == 0) ? 1 : 0;        // sum % m == 0

    if (!limit && !lead && dp[pos][sum] != -1)
        return dp[pos][sum];

    int up = limit ? digits[pos] : 9;
    int ans = 0;
    for (int d = 0; d <= up; d++) {
        bool nxt_lead = lead && (d == 0);
        int nxt_sum = (sum + d) % m;
        ans += dfs(pos + 1, nxt_sum, nxt_lead, limit && (d == up));
    }

    if (!limit && !lead)
        dp[pos][sum] = ans;
    return ans;
}
```

### 2.5 数字本身能被某数整除

> 求 $[L, R]$ 中能被 $m$ 整除的数的个数。

**状态设计**：$dp[pos][rem]$，`rem` 是当前前缀数 $\bmod m$ 的余数。

```cpp
int m;
int dp[20][100];  // dp[pos][rem], rem = 前缀数 % m

int dfs(int pos, int rem, bool lead, bool limit) {
    if (pos == digits.size())
        return (rem == 0 && !lead) ? 1 : 0;  // 能被整除且非全零

    if (!limit && !lead && dp[pos][rem] != -1)
        return dp[pos][rem];

    int up = limit ? digits[pos] : 9;
    int ans = 0;
    for (int d = 0; d <= up; d++) {
        bool nxt_lead = lead && (d == 0);
        int nxt_rem = nxt_lead ? 0 : (rem * 10 + d) % m;
        ans += dfs(pos + 1, nxt_rem, nxt_lead, limit && (d == up));
    }

    if (!limit && !lead)
        dp[pos][rem] = ans;
    return ans;
}
```

### 2.6 同时考虑数字和与整除（综合题）

> 求 $[L, R]$ 中能被 $m$ 整除且各位数字之和也能被 $m$ 整除的数的个数。

**状态设计**：$dp[pos][rem][sum]$，二维状态。

```cpp
int m;
int dp[20][100][100];  // dp[pos][rem][sum]

int dfs(int pos, int rem, int sum, bool lead, bool limit) {
    if (pos == digits.size())
        return (rem == 0 && sum == 0 && !lead) ? 1 : 0;

    if (!limit && !lead && dp[pos][rem][sum] != -1)
        return dp[pos][rem][sum];

    int up = limit ? digits[pos] : 9;
    int ans = 0;
    for (int d = 0; d <= up; d++) {
        bool nxt_lead = lead && (d == 0);
        int nxt_rem  = nxt_lead ? 0 : (rem * 10 + d) % m;
        int nxt_sum  = nxt_lead ? 0 : (sum + d) % m;
        ans += dfs(pos + 1, nxt_rem, nxt_sum, nxt_lead, limit && (d == up));
    }

    if (!limit && !lead)
        dp[pos][rem][sum] = ans;
    return ans;
}
```

> 📝 **练习**：[洛谷 P6218 取模问题](https://www.luogu.com.cn/problem/P6218)

---

## 三、$k$ 进制数位 DP

数位 DP 不仅限于十进制。将 `up = 9` 改为 `up = k-1`，`% 10` 和 `/ 10` 改为 `% k` 和 `/ k` 即可。

**例题**：求 $[L, R]$ 的二进制表示中 $1$ 的个数之和。

```cpp
vector<int> digits;  // 存二进制位
ll dp[70][70];       // dp[pos][cnt]：已统计 cnt 个 1

ll dfs(int pos, int cnt, bool lead, bool limit) {
    if (pos == digits.size()) return cnt;

    if (!limit && !lead && dp[pos][cnt] != -1)
        return dp[pos][cnt];

    int up = limit ? digits[pos] : 1;  // 二进制：0 或 1
    ll ans = 0;
    for (int d = 0; d <= up; d++) {
        bool nxt_lead = lead && (d == 0);
        int nxt_cnt = cnt + (d == 1 ? 1 : 0);
        ans += dfs(pos + 1, nxt_cnt, nxt_lead, limit && (d == up));
    }

    if (!limit && !lead)
        dp[pos][cnt] = ans;
    return ans;
}
```

---

## 四、常见题型与状态设计总结

| 题型 | 状态参数 | 典型题目 |
|------|---------|---------|
| 统计某数字出现次数 | `cnt`：已出现的次数 | 洛谷 P2602 |
| 禁止特定数字/模式 | `last`：上一位填了什么 | HDU 2089（不要 62） |
| 相邻数位差约束 | `last`：上一位填了什么 | 洛谷 P2657（Windy 数） |
| 数字和约束 | `sum`：当前数字和 $\bmod m$ | 洛谷 P6218 |
| 整除约束 | `rem`：当前前缀 $\bmod m$ | 洛谷 P6218 |
| 同时约束和与整除 | `rem` + `sum` 双状态 | 综合题 |
| 二进制下的统计 | 同上，改 $k=2$ | 二进制 1 的个数 |

### 状态设计的通用思路

```
问自己三个问题：
1. 走完所有位后，我需要知道什么信息来判定「这个数是否合法」？
   → 把这些信息放进 DFS 的参数中
2. 当前位填了 d 后，这些信息如何变化？
   → 写出状态转移
3. 哪些状态可以缓存（即与 limit 和 lead 无关时）？
   → 把它们放入 dp 数组的维度
```

---

## 五、$f(R) - f(L-1)$ 的边界处理

```cpp
ll query(ll L, ll R) {
    return solve(R) - solve(L - 1);
}
```

如果 $L = 0$，`solve(-1)` 会出问题。在 `solve` 函数开头加判断：

```cpp
ll solve(ll n) {
    if (n < 0) return 0;  // 处理 L=0 的情况
    // ...
}
```

另外，部分题目定义「不含前导零的正整数」，此时 `solve(0) = 0`，`solve(R) - solve(L-1)` 仍正确（$L \ge 1$）。

---

## 六、练习推荐

| 题目 | 考点 | 难度 | 链接 |
|------|------|------|------|
| HDU 2089 | 不要 62（禁止模式） | 入门 | [acm.hdu.edu.cn](https://acm.hdu.edu.cn/showproblem.php?pid=2089) |
| 洛谷 P2602 | 数字计数 | 入门 | [luogu.com.cn/problem/P2602](https://www.luogu.com.cn/problem/P2602) |
| 洛谷 P2657 | Windy 数（相邻差） | 中等 | [luogu.com.cn/problem/P2657](https://www.luogu.com.cn/problem/P2657) |
| 洛谷 P4127 | 同类分布（整除+数字和） | 中等 | [luogu.com.cn/problem/P4127](https://www.luogu.com.cn/problem/P4127) |
| 洛谷 P6218 | 取模统计 | 中等 | [luogu.com.cn/problem/P6218](https://www.luogu.com.cn/problem/P6218) |
| 洛谷 P4317 | 二进制下 1 的个数 | 中等 | [luogu.com.cn/problem/P4317](https://www.luogu.com.cn/problem/P4317) |
| 洛谷 P4999 | 数字和之和 | 简单 | [luogu.com.cn/problem/P4999](https://www.luogu.com.cn/problem/P4999) |

---

## 总结

1. 数位 DP 的万能公式：**逐个枚举数位 + 记忆化搜索 + `f(R) - f(L-1)`**
2. 记忆化的前提：`!limit && !lead`——不受限制、不在前导零阶段，状态才与 $n$ 无关
3. 状态设计的核心：问自己「走完所有位后需要知道什么来判断合法性」
4. **`lead` 的存在至关重要**——它决定了当前填的 $0$ 是「真正的 $0$」还是「占位的前导零」，影响状态转移和最终判定
5. 模板背熟后，90% 的数位 DP 题只需要修改状态参数和转移逻辑
