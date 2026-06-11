---
title: 线性代数期末复习笔记
published: 2026-06-09
description: "系统梳理线性代数六大核心模块：线性方程组、矩阵、行列式、向量空间、特征值与特征向量、实对称矩阵与实二次型，含详尽推导与典型例题"
image: ""
tags: [线性代数, 数学, 期末复习, 大学数学]
category: 数学
draft: false
lang: zh
comment: true
---

## 一、线性方程组

### 1.1 基本概念

含 $m$ 个方程、$n$ 个未知量的线性方程组：

$$
\begin{cases}
a_{11}x_1 + a_{12}x_2 + \cdots + a_{1n}x_n = b_1 \\
a_{21}x_1 + a_{22}x_2 + \cdots + a_{2n}x_n = b_2 \\
\quad\vdots \\
a_{m1}x_1 + a_{m2}x_2 + \cdots + a_{mn}x_n = b_m
\end{cases}
$$

其**矩阵形式**为 $A\mathbf{x} = \mathbf{b}$，其中：
- $A$ 为 $m \times n$ **系数矩阵**
- $\mathbf{x}$ 为 $n$ 维未知列向量
- $\mathbf{b}$ 为 $m$ 维常数列向量

**增广矩阵**：$\tilde{A} = [A \mid \mathbf{b}]$，即在 $A$ 右侧拼接 $\mathbf{b}$ 作为新的一列。

**向量形式**：

$$
x_1\mathbf{a}_1 + x_2\mathbf{a}_2 + \cdots + x_n\mathbf{a}_n = \mathbf{b}
$$

其中 $\mathbf{a}_j$ 是 $A$ 的第 $j$ 个列向量。这种视角揭示了「求解线性方程组」与「用列向量线性表示 $\mathbf{b}$」的等价关系。

### 1.2 高斯消元法

核心思想：通过**初等行变换**将增广矩阵化为**行阶梯形**（Row Echelon Form, REF）或**简化行阶梯形**（Reduced Row Echelon Form, RREF）。

**三种初等行变换**：
1. $R_i \leftrightarrow R_j$ ——交换两行
2. $kR_i$（$k \neq 0$）——某行乘以非零常数
3. $R_i + kR_j$ ——某行的 $k$ 倍加到另一行

**三种初等行变换均不改变方程组的解集**——这是高斯消元合法性的理论保证。

```
消元步骤（两阶段）：
┌─ 正向消元（Forward Elimination → REF）
│  1. 选主元（pivot）：当前列中绝对值最大的非零元素（列主元法）
│  2. 交换行，使主元所在行移到当前处理位置
│  3. 用主元消去下面所有行中该列的系数
│  4. 移到下一列，重复直到最后一行
│
└─ 反向代换（Backward Substitution → RREF）
   5. 从最后一个主元开始，从下往上消去上方同列元素
   6. 每个主元归一化为 1（除以自己的值）
```

**具体例题**：解方程组

$$
\begin{cases}
x_1 + 2x_2 + x_3 = 4 \\
2x_1 + 5x_2 + 3x_3 = 10 \\
x_1 + 3x_2 + 2x_3 = 7
\end{cases}
$$

写出增广矩阵并消元：

$$
\tilde{A} = \begin{pmatrix}
1 & 2 & 1 & | & 4 \\
2 & 5 & 3 & | & 10 \\
1 & 3 & 2 & | & 7
\end{pmatrix}
\xrightarrow{R_2 - 2R_1}
\begin{pmatrix}
1 & 2 & 1 & | & 4 \\
0 & 1 & 1 & | & 2 \\
1 & 3 & 2 & | & 7
\end{pmatrix}
\xrightarrow{R_3 - R_1}
\begin{pmatrix}
1 & 2 & 1 & | & 4 \\
0 & 1 & 1 & | & 2 \\
0 & 1 & 1 & | & 3
\end{pmatrix}
$$

$$
\xrightarrow{R_3 - R_2}
\begin{pmatrix}
1 & 2 & 1 & | & 4 \\
0 & 1 & 1 & | & 2 \\
0 & 0 & 0 & | & 1
\end{pmatrix}
$$

第三行对应方程 $0 = 1$，**矛盾**，故方程组**无解**。

:::tip[主元的选取策略]
- **列主元消去法**：在每一列中选取绝对值最大的元素作为主元，通过行交换将其移到对角位置。这能有效减少舍入误差，是数值计算中的标准做法。
- **全主元消去法**：在剩余子矩阵中选取绝对值最大的元素，同时进行行交换和列交换。精度更高但开销更大，考试中极少要求。
:::

### 1.3 行阶梯形（REF）与简化行阶梯形（RREF）

**REF 的三个条件**：
1. 全零行在最下方
2. 每个非零行的第一个非零元（主元）在上一行主元的右侧
3. 主元下方全是零

**RREF** 在 REF 基础上增加：
4. 每个主元等于 $1$
5. 每个主元所在列的其他元素全为零

### 1.4 解的存在性与唯一性

对于 $m \times n$ 方程组 $A\mathbf{x} = \mathbf{b}$：

$$
\text{rank}(A) = \text{rank}(\tilde{A}) \quad \Longleftrightarrow \quad \text{方程组有解（相容）}
$$

| 条件 | 解的情况 | 几何解释 |
|------|---------|---------|
| $\text{rank}(A) = \text{rank}(\tilde{A}) = n$ | 唯一解 | 超平面交于一点 |
| $\text{rank}(A) = \text{rank}(\tilde{A}) < n$ | 无穷多解（含 $n-r$ 个自由变量） | 超平面交于一个 $n-r$ 维仿射子空间 |
| $\text{rank}(A) < \text{rank}(\tilde{A})$ | 无解（不相容） | 超平面无公共交点 |

### 1.5 齐次与非齐次线性方程组

**齐次方程组** $A\mathbf{x} = \mathbf{0}$：
- 始终有**零解** $\mathbf{x} = \mathbf{0}$（平凡解）
- **有非零解** $\Longleftrightarrow$ $\text{rank}(A) < n$（即 $A$ 的列向量线性相关）
- 解集构成一个向量空间——**零空间**（核）$\text{Ker}(A)$
- 基础解系所含向量个数 = 自由变量个数 = $n - \text{rank}(A)$

**解的结构定理**：

非齐次方程组的**通解** = 一个**特解** + 对应齐次方程组的**通解**

若 $\mathbf{x}_p$ 是 $A\mathbf{x} = \mathbf{b}$ 的任一个特解，$\mathbf{v}_1, \dots, \mathbf{v}_{n-r}$ 是齐次方程组的基础解系，则：

$$
\mathbf{x} = \mathbf{x}_p + c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + \cdots + c_{n-r}\mathbf{v}_{n-r}
$$

其中 $c_1, \dots, c_{n-r}$ 为任意常数。

### 1.6 初等矩阵与 LU 分解

**初等矩阵**：对单位矩阵 $I$ 做一次初等行变换得到的矩阵。左乘初等矩阵等价于对行做相应的初等变换。

三种初等矩阵：
- 交换矩阵 $E_{ij}$：$E_{ij}A$ 交换 $A$ 的第 $i$ 行和第 $j$ 行
- 倍乘矩阵 $E_i(k)$：$E_i(k)A$ 将 $A$ 的第 $i$ 行乘以 $k$
- 倍加矩阵 $E_{ij}(k)$：$E_{ij}(k)A$ 将 $A$ 的第 $j$ 行的 $k$ 倍加到第 $i$ 行

初等矩阵均可逆。任何可逆矩阵可以分解为初等矩阵的乘积。

**LU 分解**（方阵，无行交换时）：$A = LU$，其中 $L$ 为单位下三角矩阵，$U$ 为上三角矩阵。这是高斯消元的矩阵形式——$L$ 记录了消元过程中的乘数，$U$ 就是行阶梯形。

**求解 $A\mathbf{x} = \mathbf{b}$** 用 LU 分解分两步：
1. 前代：解 $L\mathbf{y} = \mathbf{b}$（$O(n^2)$）
2. 回代：解 $U\mathbf{x} = \mathbf{y}$（$O(n^2)$）

比每次对新 $\mathbf{b}$ 都做完整消元（$O(n^3)$）高效得多。

---

## 二、矩阵

### 2.1 矩阵运算

**加法**（同型矩阵）：$(A + B)_{ij} = a_{ij} + b_{ij}$

**数乘**：$(kA)_{ij} = k \cdot a_{ij}$

**乘法**（$m \times n$ 乘 $n \times p$）：$(AB)_{ij} = \sum_{k=1}^{n} a_{ik}\,b_{kj}$

**矩阵乘法的四种理解方式**：

1. **内积视角**：$(AB)_{ij}$ = $A$ 的第 $i$ 行与 $B$ 的第 $j$ 列的**点积**
2. **列组合视角**：$AB$ 的第 $j$ 列 = $A$ 的列向量的线性组合，组合系数为 $B$ 的第 $j$ 列
3. **行组合视角**：$AB$ 的第 $i$ 行 = $B$ 的行向量的线性组合，组合系数为 $A$ 的第 $i$ 行
4. **外积和视角**：$AB = \sum_{k=1}^{n} (\text{col}_kA)(\text{row}_kB)$

**转置**：$(A^T)_{ij} = a_{ji}$

**共轭转置**：$A^H = (\bar{A})^T$（实矩阵中即 $A^T$）

**运算律**：
- 结合律：$(AB)C = A(BC)$ ——矩阵乘法有结合律！
- 左右分配律：$A(B + C) = AB + AC$，$(A + B)C = AC + BC$
- $(AB)^T = B^T A^T$ ——注意顺序反转
- $k(AB) = (kA)B = A(kB)$

:::warning[矩阵乘法三大「不」]
1. **不交换**：一般 $AB \neq BA$。例如：$A = \begin{pmatrix}0&1\\0&0\end{pmatrix}, B = \begin{pmatrix}0&0\\1&0\end{pmatrix}$，则 $AB = \begin{pmatrix}1&0\\0&0\end{pmatrix}, BA = \begin{pmatrix}0&0\\0&1\end{pmatrix}$
2. **不消去**：$AB = AC \nRightarrow B = C$（$A$ 不可逆时可能成立）
3. **无零因子**：$AB = O \nRightarrow A = O$ 或 $B = O$（非零矩阵乘积可以是零矩阵）
:::

### 2.2 特殊矩阵

| 名称 | 定义 | 核心性质 |
|------|------|---------|
| 零矩阵 $O$ | $o_{ij} = 0$ | $A + O = O + A = A$ |
| 单位矩阵 $I$ | 主对角线为 $1$，其余为 $0$ | $AI = IA = A$ |
| 数量矩阵 $kI$ | 主对角线全为 $k$ | 与任何同阶矩阵可交换 |
| 对角矩阵 $\text{diag}(d_1,\dots,d_n)$ | 非主对角线全为 $0$ | 乘积 = 对角元逐元素乘 |
| 对称矩阵 | $A^T = A$ | 特征值全为实数 |
| 反对称矩阵 | $A^T = -A$ | 主对角线必为 $0$ |
| 正交矩阵 | $A^T A = AA^T = I$，即 $A^{-1} = A^T$ | 列/行向量构成标准正交基 |
| 幂等矩阵 | $A^2 = A$ | 投影矩阵，特征值只能为 $0$ 或 $1$ |
| 幂零矩阵 | 存在 $k$ 使 $A^k = O$ | 所有特征值均为 $0$ |
| 上/下三角矩阵 | 对角线下/上全为零 | 乘积仍为同类型三角矩阵 |

### 2.3 逆矩阵

方阵 $A$ **可逆**（非奇异）$\Longleftrightarrow$ 存在 $A^{-1}$ 使得 $AA^{-1} = A^{-1}A = I$。

**等价条件**（$n$ 阶方阵，以下条件全部等价）：
1. $\det(A) \neq 0$（行列式非零）
2. $\text{rank}(A) = n$（满秩）
3. $A$ 的列（行）向量组线性无关
4. $A\mathbf{x} = \mathbf{0}$ 只有零解
5. $A\mathbf{x} = \mathbf{b}$ 对任意 $\mathbf{b}$ 有唯一解
6. $A$ 的初等行变换可化为 $I$
7. $A$ 的特征值全不为 $0$
8. $0$ 不是 $A$ 的特征值
9. $A$ 可以表示为初等矩阵的乘积

### 2.4 求逆矩阵的方法

**方法一：伴随矩阵法**

$$
A^{-1} = \frac{1}{\det(A)} \text{adj}(A)
$$

其中伴随矩阵 $\text{adj}(A) = [A_{ji}]$ 是各元素代数余子式构成的矩阵的转置。

此法适合 $2 \times 2$ 和 $3 \times 3$ 的矩阵（高阶计算量过大）。

**方法二：初等变换法（Gauss-Jordan）**

$$
[A \mid I] \xrightarrow{\text{初等行变换}} [I \mid A^{-1}]
$$

若左边不能化为 $I$（即出现全零行），则 $A$ 不可逆。

**方法三：分块矩阵法**

对角分块矩阵：$\begin{pmatrix} A & O \\ O & D \end{pmatrix}^{-1} = \begin{pmatrix} A^{-1} & O \\ O & D^{-1} \end{pmatrix}$

三角分块矩阵：若 $A, D$ 可逆，则

$$
\begin{pmatrix} A & B \\ O & D \end{pmatrix}^{-1} = \begin{pmatrix} A^{-1} & -A^{-1}BD^{-1} \\ O & D^{-1} \end{pmatrix}
$$

**运算律**：
- $(A^{-1})^{-1} = A$
- $(AB)^{-1} = B^{-1}A^{-1}$（注意顺序反转）
- $(A^T)^{-1} = (A^{-1})^T$
- $(kA)^{-1} = \frac{1}{k}A^{-1} \quad (k \neq 0)$

### 2.5 矩阵方程

常见形式及解法：

| 方程形式 | 解法（$A,B$ 可逆时） |
|----------|---------------------|
| $AX = B$ | $X = A^{-1}B$ |
| $XA = B$ | $X = BA^{-1}$ |
| $AXB = C$ | $X = A^{-1}CB^{-1}$ |

### 2.6 分块矩阵运算

**分块乘法**：若分块方式使乘法合法（左矩阵的列划分 = 右矩阵的行划分），则分块乘法规则与普通矩阵乘法相同：

$$
\begin{pmatrix} A & B \\ C & D \end{pmatrix}
\begin{pmatrix} E & F \\ G & H \end{pmatrix}
= \begin{pmatrix} AE + BG & AF + BH \\ CE + DG & CF + DH \end{pmatrix}
$$

对于分块 $2 \times 2$ 矩阵的逆：

$$
\begin{pmatrix}
A & B \\
C & D
\end{pmatrix}^{-1} =
\begin{pmatrix}
A^{-1} + A^{-1}BS^{-1}CA^{-1} & -A^{-1}BS^{-1} \\
-S^{-1}CA^{-1} & S^{-1}
\end{pmatrix}
$$

其中 $S = D - CA^{-1}B$ 称为**舒尔补**（Schur Complement），必须可逆。

---

## 三、行列式及其应用

### 3.1 行列式的本质理解

行列式 $\det(A)$ 的本质是**线性变换 $A$ 对体积的缩放因子**——它将单位超立方体映射为一个平行多面体，行列式就是这个平行多面体的**有向体积**。

从这一理解可直接导出：
- $\det(A) = 0$ $\Longleftrightarrow$ $A$ 将空间「压扁」到更低维度（体积变为 $0$）
- $\det(AB) = \det(A)\det(B)$：两次缩放因子相乘
- $\det(A^{-1}) = 1/\det(A)$：逆变换的缩放因子是原缩放因子的倒数

### 3.2 行列式的定义

**$n$ 阶行列式的排列定义**：

$$
\det(A) = \sum_{\sigma \in S_n} \text{sgn}(\sigma)\, a_{1\sigma(1)}a_{2\sigma(2)}\cdots a_{n\sigma(n)}
$$

（$S_n$ 是全体 $n$ 元排列构成的对称群，共 $n!$ 项）

**递推定义**（按第一行展开）：

$$
\det(A) = \sum_{j=1}^{n} (-1)^{1+j} a_{1j} \det(M_{1j})
$$

两种定义等价。实际计算中几乎只用性质法和展开法，排列定义用于理论证明。

### 3.3 行列式的核心计算

**常用计算方法一览**：

| 方法 | 适用场景 | 复杂度 |
|------|---------|--------|
| 对角线法则 | 仅 2、3 阶 | $O(1)$ |
| 按行/列展开（Laplace） | 某行/列含大量零元素 | $O(n!)$ 蛮力 |
| 化为三角形行列式 | 通用方法，首选 | $O(n^3)$ |
| 拆项 + 性质 | 某行/列可拆为两项之和 | 依题而定 |
| 递推法 | 三对角、循环行列式 | $O(n)$ |
| 数学归纳法 | 有规律的大规模行列式 | — |

**降阶递推法示例——三对角行列式**：

记 $D_n = \det\begin{pmatrix} a & b & & \\ c & a & b & \\ & \ddots & \ddots & \ddots \\ & & c & a \end{pmatrix}_{n \times n}$

按第一行展开可得递推式：
$$
D_n = a D_{n-1} - bc D_{n-2} \quad (n \ge 3)
$$

这是一个二阶常系数线性递推，用特征根法可解出通项。

### 3.4 行列式的八大性质

| # | 性质 |
|---|------|
| 1 | $\det(A^T) = \det(A)$ |
| 2 | 交换两行（列），行列式**变号** |
| 3 | 某行（列）乘以 $k$，行列式乘以 $k$ |
| 4 | 某行的 $k$ 倍加到另一行，行列式**不变** |
| 5 | 两行（列）成比例 $\implies \det = 0$（特例：两行相同 $\implies \det = 0$） |
| 6 | $\det(AB) = \det(A) \cdot \det(B)$ |
| 7 | $\det(kA) = k^n \det(A)$（$A$ 为 $n$ 阶） |
| 8 | $\det(A^{-1}) = 1 / \det(A)$（当 $A$ 可逆时） |

### 3.5 余子式、代数余子式与伴随矩阵

元素 $a_{ij}$ 的**余子式** $M_{ij}$：划去第 $i$ 行和第 $j$ 列后剩余元素构成的 $(n-1)$ 阶行列式。

**代数余子式**：$A_{ij} = (-1)^{i+j} M_{ij}$

符号矩阵 $\begin{pmatrix}+&-&+\\-&+&-\\+&-&+\end{pmatrix}$（棋盘格规律）。

**按行展开**（Laplace 展开）：

$$
\det(A) = \sum_{j=1}^{n} a_{ij} A_{ij} \quad (\text{固定行 } i)
$$

**异行展开为零**：$\sum_{j=1}^{n} a_{ik} A_{jk} = 0$（$i \neq j$），即不同行的元素与另一行代数余子式乘积之和为零。

**伴随矩阵**：$\text{adj}(A) = [A_{ji}]_{n \times n}$

核心关系：$A \cdot \text{adj}(A) = \text{adj}(A) \cdot A = \det(A) \cdot I$

### 3.6 克莱姆法则（Cramer's Rule）

当 $\det(A) \neq 0$ 时：

$$
x_i = \frac{\det(A_i)}{\det(A)} \quad (i = 1, 2, \dots, n)
$$

其中 $A_i$ 是将 $A$ 的第 $i$ 列替换为 $\mathbf{b}$ 后得到的矩阵。

> 克莱姆法则的理论价值高于计算价值——其时间复杂度 $O((n+1)!)$ 远超高斯消元的 $O(n^3)$。

### 3.7 三大特殊行列式公式

**范德蒙行列式**：

$$
\det V(x_1, \dots, x_n) = \prod_{1 \le i < j \le n} (x_j - x_i)
$$

结论：范德蒙行列式非零 $\Longleftrightarrow$ 所有 $x_i$ 互异。

**柯西行列式**：

$$
\det \begin{pmatrix} \frac{1}{x_i + y_j} \end{pmatrix}_{n \times n}
= \frac{\prod_{i<j}(x_j - x_i)(y_j - y_i)}{\prod_{i,j}(x_i + y_j)}
$$

**循环行列式**：利用 $n$ 次单位根 $\omega = e^{2\pi i/n}$ 可将循环矩阵对角化，行列式 $= \prod_{k=0}^{n-1} f(\omega^k)$，其中 $f$ 为循环矩阵第一行对应的多项式。

---

## 四、向量空间

### 4.1 向量空间的定义与例子

非空集合 $V$ 定义了向量加法 "$+$" 和数乘 "$\,\cdot\,$"，满足以下八条公理即构成**向量空间**（线性空间）：

| 公理 | 内容 |
|------|------|
| 加法交换律 | $\mathbf{u} + \mathbf{v} = \mathbf{v} + \mathbf{u}$ |
| 加法结合律 | $(\mathbf{u} + \mathbf{v}) + \mathbf{w} = \mathbf{u} + (\mathbf{v} + \mathbf{w})$ |
| 存在零元 | $\exists \mathbf{0} \in V,\; \forall \mathbf{v},\; \mathbf{v} + \mathbf{0} = \mathbf{v}$ |
| 存在负元 | $\forall \mathbf{v},\; \exists -\mathbf{v},\; \mathbf{v} + (-\mathbf{v}) = \mathbf{0}$ |
| 数乘结合律 | $a(b\mathbf{v}) = (ab)\mathbf{v}$ |
| 数乘分配律 1 | $a(\mathbf{u} + \mathbf{v}) = a\mathbf{u} + a\mathbf{v}$ |
| 数乘分配律 2 | $(a + b)\mathbf{v} = a\mathbf{v} + b\mathbf{v}$ |
| 单位元 | $1\mathbf{v} = \mathbf{v}$ |

常见向量空间：$\mathbb{R}^n$、全体 $m \times n$ 实矩阵 $M_{m \times n}(\mathbb{R})$、次数 $\le n$ 的多项式空间 $P_n$、$[a,b]$ 上全体连续函数 $C[a,b]$。

### 4.2 子空间及其判定

$W \subseteq V$ 是 $V$ 的**子空间**，当且仅当满足三个条件：
1. $\mathbf{0} \in W$（含零元）
2. $\mathbf{u}, \mathbf{v} \in W \implies \mathbf{u} + \mathbf{v} \in W$（加法封闭）
3. $\mathbf{v} \in W, c \in \mathbb{R} \implies c\mathbf{v} \in W$（数乘封闭）

**两个子空间的交 $W_1 \cap W_2$**：仍是子空间。

**两个子空间的和 $W_1 + W_2$**：$= \{\mathbf{w}_1 + \mathbf{w}_2 \mid \mathbf{w}_1 \in W_1, \mathbf{w}_2 \in W_2\}$，仍是子空间。

**维数公式**：
$$
\dim(W_1 + W_2) = \dim(W_1) + \dim(W_2) - \dim(W_1 \cap W_2)
$$

**直和**：若 $W_1 \cap W_2 = \{\mathbf{0}\}$，则称 $W_1 + W_2$ 为**直和**，记作 $W_1 \oplus W_2$，此时 $\dim(W_1 \oplus W_2) = \dim(W_1) + \dim(W_2)$。

### 4.3 线性相关与线性无关

向量组 $\{\mathbf{v}_1, \dots, \mathbf{v}_k\}$：
- **线性相关**：存在不全为零的 $c_1, \dots, c_k$ 使得 $\sum_{i=1}^{k} c_i \mathbf{v}_i = \mathbf{0}$
- **线性无关**：$\sum c_i \mathbf{v}_i = \mathbf{0} \implies c_1 = c_2 = \cdots = c_k = 0$

**判别方法**：将这些向量作为**列向量**构造成矩阵 $A$，则：
- $\text{rank}(A) = k$（列满秩）$\Longleftrightarrow$ 线性无关
- $\text{rank}(A) < k$ $\Longleftrightarrow$ 线性相关

**常用结论**：
- 若向量个数 $>$ 维数，则必线性相关
- 线性无关向量组的任何非空子集也线性无关
- 含零向量的向量组必线性相关

:::tip[几何直观]
- $\mathbb{R}^2$：两个不共线的向量线性无关，三个向量必线性相关
- $\mathbb{R}^3$：三个不共面的向量线性无关，四个向量必线性相关
:::

### 4.4 秩的定义、计算与性质

矩阵的**秩** = 矩阵中线性无关的行（列）向量的最大个数 = 行阶梯形中主元的个数。

**求秩方法**：矩阵 $\xrightarrow{\text{初等行变换}}$ 行阶梯形，数非零行的个数。

**秩不等式汇总**：

| 性质 | 公式 |
|------|------|
| 上界 | $\text{rank}(A) \le \min(m, n)$ |
| 行秩 = 列秩 | $\text{rank}(A) = \text{rank}(A^T)$ |
| 乘积的秩 | $\text{rank}(AB) \le \min(\text{rank}(A), \text{rank}(B))$ |
| 和的秩 | $\text{rank}(A + B) \le \text{rank}(A) + \text{rank}(B)$ |
| 西尔维斯特不等式 | $\text{rank}(A) + \text{rank}(B) - n \le \text{rank}(AB)$ |
| 秩-零化度定理 | $\text{rank}(A) + \dim\text{Ker}(A) = n$ |
| Frobenius 不等式 | $\text{rank}(AB) + \text{rank}(BC) \le \text{rank}(ABC) + \text{rank}(B)$ |

### 4.5 基、维数与坐标变换

**基**：向量空间 $V$ 的一组极大线性无关向量集。任何向量均可被基唯一线性表示。

**维数**：基中所含向量的个数，记为 $\dim V$。

**坐标**：向量 $\mathbf{v}$ 在基 $B = \{\mathbf{e}_1, \dots, \mathbf{e}_n\}$ 下的坐标 $[\mathbf{v}]_B = (c_1, \dots, c_n)^T$，满足：

$$
\mathbf{v} = c_1\mathbf{e}_1 + c_2\mathbf{e}_2 + \cdots + c_n\mathbf{e}_n
$$

**基变换与过渡矩阵**：设 $V$ 有两组基 $B = \{\mathbf{e}_i\}$ 和 $B' = \{\mathbf{e}'_j\}$，存在唯一的**过渡矩阵** $P$（$n \times n$ 可逆），使得：

$$
(\mathbf{e}'_1, \dots, \mathbf{e}'_n) = (\mathbf{e}_1, \dots, \mathbf{e}_n)P
$$

$P$ 的第 $j$ 列是新基向量 $\mathbf{e}'_j$ 在旧基下的坐标。

**坐标变换公式**：

$$
[\mathbf{v}]_{B'} = P^{-1} [\mathbf{v}]_B
$$

即：**旧坐标 = 过渡矩阵 × 新坐标**，反过来需要求逆。

### 4.6 四个基本子空间

对于 $m \times n$ 实矩阵 $A$：

| 子空间 | 定义 | 维数 | 所在空间 |
|--------|------|------|---------|
| 列空间 $\text{Col}(A)$ | $A$ 列向量张成的空间 | $\text{rank}(A) = r$ | $\mathbb{R}^m$ |
| 行空间 $\text{Row}(A)$ | $A$ 行向量张成的空间 | $r$ | $\mathbb{R}^n$ |
| 零空间 $\text{Ker}(A)$ | $\{\mathbf{x} \mid A\mathbf{x} = \mathbf{0}\}$ | $n - r$ | $\mathbb{R}^n$ |
| 左零空间 $\text{Ker}(A^T)$ | $\{\mathbf{y} \mid A^T\mathbf{y} = \mathbf{0}\}$ | $m - r$ | $\mathbb{R}^m$ |

**正交关系**（在标准内积下）：
- $\text{Row}(A) \perp \text{Ker}(A)$：行空间与零空间正交
- $\text{Col}(A) \perp \text{Ker}(A^T)$：列空间与左零空间正交

这一关系是**最小二乘法**和**广义逆矩阵**的理论基础。

### 4.7 内积空间与正交性

**标准内积**（点积）：$\langle \mathbf{u}, \mathbf{v} \rangle = \mathbf{u}^T \mathbf{v} = \sum_{i} u_i v_i$

**诱导范数**（长度）：$\|\mathbf{v}\| = \sqrt{\langle \mathbf{v}, \mathbf{v} \rangle}$

**柯西-施瓦茨不等式**：$|\langle \mathbf{u}, \mathbf{v} \rangle| \le \|\mathbf{u}\| \cdot \|\mathbf{v}\|$

**正交**：$\langle \mathbf{u}, \mathbf{v} \rangle = 0$

**施密特正交化**（Gram-Schmidt Process）：将线性无关向量组 $\{\mathbf{v}_1, \dots, \mathbf{v}_n\}$ 转化为正交向量组 $\{\mathbf{u}_1, \dots, \mathbf{u}_n\}$：

$$
\mathbf{u}_1 = \mathbf{v}_1
$$

$$
\mathbf{u}_k = \mathbf{v}_k - \sum_{i=1}^{k-1}
\frac{\langle \mathbf{v}_k, \mathbf{u}_i \rangle}{\langle \mathbf{u}_i, \mathbf{u}_i \rangle} \mathbf{u}_i \quad (k = 2, \dots, n)
$$

最后单位化 $\mathbf{q}_i = \frac{\mathbf{u}_i}{\|\mathbf{u}_i\|}$，即得**标准正交基**。

**施密特正交化的矩阵形式——QR 分解**：
$$
A = QR
$$
其中 $A$ 为列满秩矩阵，$Q$ 的列是标准正交基（$Q^TQ = I$），$R$ 是上三角矩阵且对角线为正。

---

## 五、特征值与特征向量

### 5.1 定义与几何意义

若 $A\mathbf{v} = \lambda \mathbf{v}$，其中 $\mathbf{v} \neq \mathbf{0}$：
- $\lambda$ 为 $A$ 的**特征值**（eigenvalue）
- $\mathbf{v}$ 为对应的**特征向量**（eigenvector）

**几何意义**：特征向量是那些经过线性变换 $A$ 后**方向不变**（或反向）的向量，仅被缩放 $\lambda$ 倍。

### 5.2 特征值与特征向量的标准求法

**步骤**：
1. 解**特征方程**：$\det(A - \lambda I) = 0$，得到所有特征值 $\lambda_1, \dots, \lambda_n$
2. 对每个特征值 $\lambda_i$，解齐次方程组 $(A - \lambda_i I)\mathbf{v} = \mathbf{0}$，其所有非零解即为 $\lambda_i$ 对应的特征向量

**特征多项式**：

$$
p_A(\lambda) = \det(A - \lambda I) = (-\lambda)^n + \text{tr}(A)(-\lambda)^{n-1} + \cdots + \det(A)
$$

展开式中，$(-\lambda)^{n-1}$ 的系数为 $\text{tr}(A)$，常数项为 $\det(A)$。

### 5.3 特征值的核心性质

1. **迹 = 特征值和**：$\text{tr}(A) = \sum_{i=1}^{n} a_{ii} = \sum_{i=1}^{n} \lambda_i$
2. **行列式 = 特征值积**：$\det(A) = \prod_{i=1}^{n} \lambda_i$
3. 若 $\lambda$ 是 $A$ 的特征值：
   - $\lambda^k$ 是 $A^k$ 的特征值
   - $\lambda^{-1}$ 是 $A^{-1}$ 的特征值（$A$ 可逆时）
   - $\lambda + c$ 是 $A + cI$ 的特征值
   - $f(\lambda)$ 是 $f(A)$ 的特征值（对任意多项式 $f$）
4. **不同特征值对应的特征向量必线性无关**
5. **相似矩阵有相同的特征多项式，因而有相同的特征值**（但特征向量不同）

### 5.4 相似与对角化

$A$ 与 $B$ **相似**：存在可逆矩阵 $P$ 使得 $B = P^{-1}AP$。

若 $A$ 有 $n$ 个线性无关的特征向量，则 $A$ **可对角化**：

$$
A = PDP^{-1}, \quad D = \text{diag}(\lambda_1, \dots, \lambda_n)
$$

其中 $P$ 的 $n$ 个列向量是 $A$ 的 $n$ 个线性无关的特征向量，$D$ 的对角线为对应的特征值。

**对角化的判定**：

| 判定条件 | 结论 |
|----------|------|
| $A$ 有 $n$ 个互异特征值 | 一定可对角化 |
| 对每个特征值 $\lambda$，几何重数 = 代数重数 | 可对角化 |
| 存在特征值几何重数 < 代数重数 | **不可对角化** |
| $A$ 是实对称矩阵 | 一定可正交对角化 |

:::tip[对角化的威力：快速计算 $A^k$]
$$
A^k = PD^kP^{-1} = P\begin{pmatrix} \lambda_1^k & & \\ & \ddots & \\ & & \lambda_n^k \end{pmatrix}P^{-1}
$$

求解线性递推（如斐波那契数列）、马尔可夫链的稳态分布、微分方程组均依赖于此。
:::

### 5.5 代数重数与几何重数

- **代数重数** $m_a(\lambda)$：$\lambda$ 作为特征多项式根的重数
- **几何重数** $m_g(\lambda)$：特征空间 $\text{Ker}(A - \lambda I)$ 的维数 $= n - \text{rank}(A - \lambda I)$

**始终成立**：$1 \le m_g(\lambda) \le m_a(\lambda)$

对角化的等价条件：对每个特征值，$m_g(\lambda) = m_a(\lambda)$。

### 5.6 凯莱-哈密顿定理（Cayley-Hamilton）

每个方阵 $A$ 满足其自身的特征多项式：

$$
p_A(A) = 0
$$

**推论**：
- $A^n$ 可由 $I, A, \dots, A^{n-1}$ 线性表示
- 可用来求 $A^{-1}$：若 $\det(A) \neq 0$，则 $A^{-1} = -\frac{1}{\det(A)}(A^{n-1} + c_1A^{n-2} + \cdots + c_{n-1}I)$
- 是推导 Jordan 标准形的理论基础

### 5.7 Jordan 标准形（简介）

若 $A$ 不可对角化，存在可逆矩阵 $P$ 使 $A = PJP^{-1}$，其中 $J$ 为**Jordan 标准形**：

$$
J = \text{diag}(J_{n_1}(\lambda_1), \dots, J_{n_k}(\lambda_k)),
\quad
J_m(\lambda) = \begin{pmatrix}
\lambda & 1 & & \\
& \lambda & \ddots & \\
& & \ddots & 1 \\
& & & \lambda
\end{pmatrix}_{m \times m}
$$

每个 Jordan 块对应一个特征值。块的个数 = 该特征值的几何重数；所有块的大小之和 = 该特征值的代数重数。

---

## 六、实对称矩阵与实二次型

### 6.1 实对称矩阵的谱分解

**实对称矩阵**：$A \in \mathbb{R}^{n \times n}$，且 $A^T = A$。

**谱定理**（Spectral Theorem）：任何实对称矩阵 $A$ 都可以**正交对角化**：

$$
A = Q\Lambda Q^T = \sum_{i=1}^{n} \lambda_i \mathbf{q}_i \mathbf{q}_i^T
$$

其中：
- $Q$ 为**正交矩阵**（$Q^T Q = QQ^T = I$），列 $\mathbf{q}_i$ 是 $A$ 的标准正交特征向量
- $\Lambda = \text{diag}(\lambda_1, \dots, \lambda_n)$，$\lambda_i$ 为对应特征值

后者称为 $A$ 的**谱分解**——将 $A$ 分解为秩为 $1$ 的投影矩阵 $\mathbf{q}_i\mathbf{q}_i^T$ 的加权和。

**实对称矩阵的三大黄金性质**：
1. **所有特征值均为实数**
2. **不同特征值对应的特征向量自动正交**（无需施密特正交化）
3. **几何重数 = 代数重数，一定可对角化**

### 6.2 实二次型的定义与矩阵表示

$n$ 元**实二次型**是一个齐次二次多项式：

$$
f(x_1, \dots, x_n) = \sum_{i=1}^{n}\sum_{j=1}^{n} a_{ij} x_i x_j = \mathbf{x}^T A \mathbf{x}
$$

其中 $A$ 为**实对称矩阵**。给定一个二次型表达式，其对称矩阵是**唯一**的：

若表达式中有 $\alpha x_i x_j$ 项（$i \neq j$），则令 $a_{ij} = a_{ji} = \frac{\alpha}{2}$。

:::tip[写出二次型矩阵的法则]
- 平方项 $x_i^2$ 的系数 $\to$ $a_{ii}$
- 交叉项 $x_i x_j$（$i \neq j$）的系数的一半 $\to$ $a_{ij} = a_{ji}$

例如：$f = 2x_1^2 + 6x_1x_2 - 3x_2^2$，对应矩阵 $A = \begin{pmatrix} 2 & 3 \\ 3 & -3 \end{pmatrix}$
:::

### 6.3 化二次型为标准形（三种方法）

#### 方法一：正交变换法（最重要，考试重点）

通过**正交变换** $\mathbf{x} = Q\mathbf{y}$（$Q^T Q = I$），将二次型化为**标准形**：

$$
f = \mathbf{y}^T \Lambda \mathbf{y} = \lambda_1 y_1^2 + \lambda_2 y_2^2 + \cdots + \lambda_n y_n^2
$$

（注意：系数是 $A$ 的**特征值**，不是别的值）

**标准六步走**：

1. 写出二次型的对称矩阵 $A$
2. 求 $A$ 的特征值 $\lambda_1, \dots, \lambda_n$
3. 对每个特征值求特征向量
4. 同一特征值内的特征向量需要施密特正交化（不同特征值间自动正交）
5. 所有特征向量单位化
6. 构造正交矩阵 $Q = [\mathbf{q}_1 \cdots \mathbf{q}_n]$，作变换 $\mathbf{x} = Q\mathbf{y}$

#### 方法二：配方法（适合手算）

通过反复配方将二次型化为平方和。例如 $f = x_1^2 + 4x_1x_2 + 3x_2^2$：

$$
\begin{aligned}
f &= (x_1^2 + 4x_1x_2 + 4x_2^2) - x_2^2 \\
  &= (x_1 + 2x_2)^2 - x_2^2
\end{aligned}
$$

令 $y_1 = x_1 + 2x_2,\, y_2 = x_2$，则 $f = y_1^2 - y_2^2$。

:::note[正交变换 vs 配方法]
正交变换保持几何形状（旋转/反射），是**保距变换**。配方法的变换可能是更一般的可逆线性变换，不保持距离但更简单快速。
:::

#### 方法三：合同变换法

对 $\begin{pmatrix} A \\ I \end{pmatrix}$ 进行合同变换（同时行列操作），最终将 $A$ 化为对角矩阵。

### 6.4 惯性定理（Sylvester's Law of Inertia）

**惯性定理**：实二次型在**任何可逆线性变换**下，标准形中的**正项个数 $p$**（正惯性指数）和**负项个数 $q$**（负惯性指数）是**不变量**。

- $p$ = 正特征值的个数
- $q$ = 负特征值的个数
- $p + q = \text{rank}(A)$（零特征值的个数 $= n - \text{rank}(A)$）

$A$ 的可逆 $\Longleftrightarrow$ 无零特征值 $\Longleftrightarrow$ $p + q = n$。

**合同标准形**：任何实对称矩阵合同于唯一的标准形 $\text{diag}(I_p, -I_q, O_{n-p-q})$。

### 6.5 正定性理论

| 类型 | 等价条件（任一条即判定） |
|------|-------------------------|
| **正定** | ① 所有特征值 $> 0$ ② 所有顺序主子式 $> 0$ ③ 对任意 $\mathbf{x} \neq \mathbf{0}$，$f(\mathbf{x}) > 0$ |
| **半正定** | ① 所有特征值 $\ge 0$ ② 所有主子式 $\ge 0$ ③ $f(\mathbf{x}) \ge 0$ |
| **负定** | ① 所有特征值 $< 0$ ② $(-1)^k \Delta_k > 0$（顺序主子式正负交替） |
| **半负定** | ① 所有特征值 $\le 0$ |
| **不定** | ① 既有正特征值又有负特征值 ② 存在 $\mathbf{x}, \mathbf{y}$ 使 $f(\mathbf{x}) > 0, f(\mathbf{y}) < 0$ |

**顺序主子式** $\Delta_k$：取 $A$ 的前 $k$ 行前 $k$ 列构成的行列式。

对于正定性，**所有顺序主子式 $> 0$** 是经典的希尔维斯特判据。

### 6.6 矩阵的合同

$A$ 与 $B$ **合同**：存在可逆矩阵 $C$ 使得 $B = C^T A C$。

合同关系是等价关系（自反、对称、传递）。合同保持：
- ✅ 对称性
- ✅ 惯性指数 $(p, q)$
- ✅ 秩

合同**不保持**：
- ❌ 特征值
- ❌ 行列式

**合同与相似的关系**：对于实对称矩阵，若 $C$ 是正交矩阵（$C^{-1} = C^T$），则合同等价于相似。正交对角化就是找一个矩阵 $Q$，使得 $A$ 既合同于 $\Lambda$ 又相似于 $\Lambda$。

---

## 概念关系图

```
线性方程组 ──→ 高斯消元 ──→ LU 分解
    │              │
    │ 解的结构      秩的概念
    │              │
    ├──→ 矩阵 ◄───→ 逆矩阵 ◄── 行列式
    │      │                      │
    │      ├── 特征值/向量        克莱姆法则
    │      │      │
    │      │   对角化
    │      │      │
    └──→ 向量空间 ──┴── 正交对角化 ──→ 二次型
           │                    │
        基/维数              正定性
           │
        内积 → 正交化 → 标准正交基 → QR 分解
```

---

## 公式速查表

| 公式 | 适用场景 |
|------|---------|
| $\text{rank}(A) + \dim\text{Ker}(A) = n$ | 秩-零化度定理 |
| $\det(AB) = \det(A)\det(B)$ | 行列式乘法 |
| $\det(cA) = c^n \det(A)$ | $A$ 为 $n$ 阶 |
| $A^{-1} = \text{adj}(A) / \det(A)$ | 伴随矩阵求逆 |
| $\det(A - \lambda I) = 0$ | 特征方程 |
| $\text{tr}(A) = \sum \lambda_i$ | 迹 = 特征值和 |
| $\det(A) = \prod \lambda_i$ | 行列式 = 特征值积 |
| $A^k = PD^k P^{-1}$ | 对角化求幂 |
| $A = Q\Lambda Q^T = \sum \lambda_i\mathbf{q}_i\mathbf{q}_i^T$ | 实对称矩阵谱分解 |
| $f(\mathbf{x}) = \mathbf{x}^T A\mathbf{x}$ | 二次型表示 |
| $\dim(W_1 + W_2) = \dim(W_1) + \dim(W_2) - \dim(W_1 \cap W_2)$ | 维数公式 |
| $A \cdot \text{adj}(A) = \det(A)I$ | 伴随矩阵关系 |

---

## 常见题型与解题模板

### 题型一：求解线性方程组

**模板**：

1. 写出增广矩阵 $\tilde{A} = [A \mid \mathbf{b}]$
2. 初等行变换 → 行阶梯形（REF）
3. 比较 $\text{rank}(A)$ 与 $\text{rank}(\tilde{A})$ 判断解的存在性
4. 若有解，继续化简至 RREF
5. 用自由变量表示通解：$\mathbf{x} = \mathbf{x}_p + c_1\mathbf{v}_1 + \cdots + c_{n-r}\mathbf{v}_{n-r}$

**关键**：$\text{rank}(A) \neq \text{rank}(\tilde{A})$ 则**立即停手，写「无解」**。

### 题型二：求逆矩阵

**模板**：$[A \mid I] \xrightarrow{\text{仅用初等行变换}} [I \mid A^{-1}]$

若左侧无法化为 $I$（出现全零行），则 $A$ 不可逆。此时 $\det(A) = 0$ 且 $\text{rank}(A) < n$。

### 题型三：行列式计算

**标准流程**：
1. 观察结构：是否有行/列相加为定值？是否有大量零元素？是否有规律？
2. 首选化为上三角：利用性质化简，提取公因子
3. 复杂行列式降阶：按含零元素最多的行/列展开，建立递推式
4. 特殊结构直接用公式：范德蒙、三对角、循环等

**重点掌握**：三对角行列式的递推法（考试高频）。

### 题型四：线性相关/无关的判定

**模板**：
1. 将向量作为**列向量**构造矩阵 $A$
2. 对 $A$ 做初等行变换 → 行阶梯形
3. 非零行个数 $=$ 秩 $r$
4. $r = k$ → 线性无关；$r < k$ → 线性相关
5. 若相关，解 $A\mathbf{c} = \mathbf{0}$ 找出一组非平凡关系式

### 题型五：特征值与特征向量 + 对角化

**标准流程**：
1. 解 $\det(A - \lambda I) = 0$，得到特征值（可能会合并因式分解）
2. 对每个 $\lambda_i$，解 $(A - \lambda_i I)\mathbf{v} = \mathbf{0}$，得到一组基础解系
3. 若特征向量总数为 $n$，则 $A$ 可对角化：$A = PDP^{-1}$，其中 $P$ 列为特征向量，$D$ 对角线为对应特征值
4. 若 $P$ 不可逆（特征向量数不足 $n$），则 $A$ 不可对角化

### 题型六：二次型化标准形 + 判定正定性

**使用正交变换的标准流程**：
1. 写出对称矩阵 $A$
2. 求特征值
3. 求特征向量（不同特征值间自动正交，同特征值内需施密特正交化）
4. 单位化
5. 构造正交矩阵 $Q$，得标准形：$f = \lambda_1 y_1^2 + \cdots + \lambda_n y_n^2$
6. 由特征值符号判定正定性

:::tip[考试时间分配建议]
- 线性方程组求解：8-12 分钟
- 行列式计算：5-10 分钟
- 特征值 + 对角化：12-18 分钟
- 二次型化标准形（完整）：15-20 分钟
- 概念判断题：每题 1-3 分钟
:::

---

## 结语

线性代数是一门**结构很美的学科**。从高斯消元解方程出发，一路走到向量空间、特征分解、二次型——每个概念都不是孤立的，而是对同一个数学对象（线性变换）从不同角度进行的观察。

**复习策略**：
1. **计算题要多动笔**：行列式化简、高斯消元、特征值求解——这些是考试拿分的基础分
2. **概念间建立联系**：秩 ↔ 行列式 ↔ 线性相关 ↔ 零空间维数 ↔ 特征值零 → 比死记硬背效率高得多
3. **几何直觉是利器**：行列式 = 体积缩放，特征向量 = 方向不变的向量，正定二次型 = 碗形超曲面
4. **定理会证、性质会用**：证明题从定义出发（如证明子空间：检验封闭性），性质题用等价条件

祝考试顺利 🎯
