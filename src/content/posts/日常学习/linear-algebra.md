---
title: 线性代数期末复习笔记
published: 2026-06-09
description: "系统梳理线性代数六大核心模块：线性方程组、矩阵、行列式、向量空间、特征值与特征向量、实对称矩阵与实二次型"
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
- $\mathbf{x}$ 为 $n$ 维未知向量
- $\mathbf{b}$ 为 $m$ 维常数向量

**增广矩阵**：$\tilde{A} = [A \mid \mathbf{b}]$

### 1.2 高斯消元法

核心思想：通过**初等行变换**将增广矩阵化为**行阶梯形**（REF）或**简化行阶梯形**（RREF）。

**三种初等行变换**：
1. 交换两行：$R_i \leftrightarrow R_j$
2. 某行乘以非零常数：$kR_i$（$k \neq 0$）
3. 某行的 $k$ 倍加到另一行：$R_i + kR_j$

```
消元步骤：
┌─ 正向消元（化为行阶梯形）
│  1. 选主元（pivot）
│  2. 用主元消去下面的行
│  3. 重复直到最后一列
│
└─ 反向代换（化为简化行阶梯形）
   4. 从下往上回代消元
   5. 主元归一化为 1
```

### 1.3 解的存在性与唯一性

对于 $m \times n$ 方程组 $A\mathbf{x} = \mathbf{b}$：

$$
\text{rank}(A) = \text{rank}(\tilde{A}) \quad \Longleftrightarrow \quad \text{方程组有解}
$$

| 条件 | 解的情况 |
|------|---------|
| $\text{rank}(A) = \text{rank}(\tilde{A}) = n$ | 唯一解 |
| $\text{rank}(A) = \text{rank}(\tilde{A}) < n$ | 无穷多解（含 $n-r$ 个自由变量） |
| $\text{rank}(A) < \text{rank}(\tilde{A})$ | 无解 |

### 1.4 齐次线性方程组

当 $\mathbf{b} = \mathbf{0}$ 时，称为**齐次方程组** $A\mathbf{x} = \mathbf{0}$。

- 始终有**零解** $\mathbf{x} = \mathbf{0}$
- **有非零解** $\Longleftrightarrow$ $\text{rank}(A) < n$（即 $A$ 的列向量线性相关）
- 解集构成一个向量空间——**零空间**（核）$\text{Ker}(A)$
- 基础解系所含向量个数 $= n - \text{rank}(A)$

:::tip[解的结构]
非齐次方程组的通解 = 一个特解 + 对应齐次方程组的通解
:::

---

## 二、矩阵

### 2.1 矩阵运算

**加法**（同型矩阵）：$(A + B)_{ij} = a_{ij} + b_{ij}$

**数乘**：$(kA)_{ij} = k \cdot a_{ij}$

**乘法**（$m \times n$ 乘 $n \times p$）：$(AB)_{ij} = \sum_{k=1}^{n} a_{ik}\,b_{kj}$

**转置**：$(A^T)_{ij} = a_{ji}$

**运算律**：
- 结合律：$(AB)C = A(BC)$
- 分配律：$A(B + C) = AB + AC$
- $(AB)^T = B^T A^T$

:::warning[注意]
矩阵乘法**不满足交换律**：一般 $AB \neq BA$。也不满足消去律：$AB = AC$ 不能推出 $B = C$（除非 $A$ 可逆）。
:::

### 2.2 特殊矩阵

| 名称 | 定义 | 性质 |
|------|------|------|
| 零矩阵 $O$ | 所有元素为 $0$ | $A + O = A$ |
| 单位矩阵 $I$ | 主对角线为 $1$，其余为 $0$ | $AI = IA = A$ |
| 对角矩阵 | 非主对角线元素全为 $0$ | 幂运算简单 |
| 对称矩阵 | $A^T = A$ | 特征值全为实数 |
| 反对称矩阵 | $A^T = -A$ | 主对角线必为 $0$ |
| 正交矩阵 | $A^T A = AA^T = I$ | 列/行向量构成标准正交基 |

### 2.3 逆矩阵

方阵 $A$ **可逆** $\Longleftrightarrow$ 存在 $A^{-1}$ 使得 $AA^{-1} = A^{-1}A = I$

**等价条件**（$n$ 阶方阵）：
- $\det(A) \neq 0$
- $\text{rank}(A) = n$
- $A$ 的列（行）向量线性无关
- $A\mathbf{x} = \mathbf{0}$ 只有零解
- $A$ 的初等行变换可化为 $I$

### 2.4 求逆矩阵的方法

**方法一：伴随矩阵法**

$$
A^{-1} = \frac{1}{\det(A)} \text{adj}(A)
$$

**方法二：初等变换法**

$$
[A \mid I] \xrightarrow{\text{初等行变换}} [I \mid A^{-1}]
$$

**运算律**：
- $(A^{-1})^{-1} = A$
- $(AB)^{-1} = B^{-1}A^{-1}$
- $(A^T)^{-1} = (A^{-1})^T$

### 2.5 分块矩阵

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

其中 $S = D - CA^{-1}B$ 为**舒尔补**（Schur Complement）。

常用结论：若分块为对角结构 $\begin{pmatrix} A & O \\ O & D \end{pmatrix}$，则其逆为 $\begin{pmatrix} A^{-1} & O \\ O & D^{-1} \end{pmatrix}$。

---

## 三、行列式及其应用

### 3.1 计算

**$n$ 阶行列式的定义**：

$$
\det(A) = \sum_{\sigma \in S_n} \text{sgn}(\sigma)\, a_{1\sigma(1)}a_{2\sigma(2)}\cdots a_{n\sigma(n)}
$$

（$S_n$ 为全体 $n$ 元排列，$\text{sgn}$ 为排列的符号）

**常用计算方法**：

| 方法 | 适用场景 |
|------|---------|
| 对角线法则 | 仅 2、3 阶 |
| 按行/列展开（Laplace） | 含较多零元素时 |
| 化为三角形行列式 | 先消元再乘主对角线 |
| 利用性质拆项 | 某行/列可拆为两项之和 |

### 3.2 行列式性质

1. $\det(A^T) = \det(A)$
2. 交换两行（列），行列式**变号**
3. 某行（列）乘以 $k$，行列式乘以 $k$
4. 某行（列）的 $k$ 倍加到另一行（列），行列式不变
5. 两行（列）成比例 → 行列式为 $0$
6. $\det(AB) = \det(A) \cdot \det(B)$
7. $\det(kA) = k^n \det(A)$（$A$ 为 $n$ 阶）
8. $\det(A^{-1}) = 1 / \det(A)$

### 3.3 余子式与代数余子式

元素 $a_{ij}$ 的**余子式** $M_{ij}$：划去第 $i$ 行和第 $j$ 列后剩余元素构成的行列式。

**代数余子式**：$A_{ij} = (-1)^{i+j} M_{ij}$

**按行展开**（Laplace 展开）：
$$
\det(A) = \sum_{j=1}^{n} a_{ij} A_{ij} \quad (\text{固定行 } i)
$$

**伴随矩阵**：$\text{adj}(A) = [A_{ji}]_{n \times n}$（注意下标 $ji$，代数余子式构成的矩阵再转置）

### 3.4 克莱姆法则（Cramer's Rule）

当 $\det(A) \neq 0$ 时，方程组 $A\mathbf{x} = \mathbf{b}$ 有唯一解：

$$
x_i = \frac{\det(A_i)}{\det(A)} \quad (i = 1, 2, \dots, n)
$$

其中 $A_i$ 是将 $A$ 的第 $i$ 列替换为 $\mathbf{b}$ 后的矩阵。

> 克莱姆法则具有理论价值，但在计算上不如高斯消元高效（复杂度为 $O(n!) \gg O(n^3)$）。

### 3.5 常见行列式公式

**范德蒙行列式**：

$$
\det\begin{pmatrix}
1      & x_1    & x_1^2 & \cdots & x_1^{n-1} \\
1      & x_2    & x_2^2 & \cdots & x_2^{n-1} \\
\vdots & \vdots & \vdots & \ddots & \vdots    \\
1      & x_n    & x_n^2 & \cdots & x_n^{n-1}
\end{pmatrix} = \prod_{1 \le i < j \le n} (x_j - x_i)
$$

---

## 四、向量空间

### 4.1 向量空间的定义

非空集合 $V$ 定义了加法和数乘，且满足八条公理（加法交换律、结合律、存在零元、存在负元；数乘分配律、结合律；单位元 $1\mathbf{v} = \mathbf{v}$）。

### 4.2 线性相关与线性无关

向量组 $\{\mathbf{v}_1, \mathbf{v}_2, \dots, \mathbf{v}_k\}$：
- **线性相关**：存在不全为零的标量 $c_1, \dots, c_k$ 使得 $\sum c_i \mathbf{v}_i = \mathbf{0}$
- **线性无关**：仅当所有 $c_i = 0$ 时 $\sum c_i \mathbf{v}_i = \mathbf{0}$

**判别方法**：
- 将向量作为列向量构造成矩阵 $A$，则：
  - $\text{rank}(A) = k$（列满秩）$\Longleftrightarrow$ 向量组线性无关
  - $\text{rank}(A) < k$ $\Longleftrightarrow$ 向量组线性相关

:::tip[几何理解]
- 平面中：两个不共线的向量线性无关，三个向量必线性相关
- 空间中：三个不共面的向量线性无关，四个向量必线性相关
:::

### 4.3 秩（Rank）

矩阵的**秩** = 矩阵中线性无关的行（列）向量的最大个数。

**重要性质**：
- $\text{rank}(A) \le \min(m, n)$
- $\text{rank}(A) = \text{rank}(A^T)$
- $\text{rank}(AB) \le \min(\text{rank}(A), \text{rank}(B))$
- $\text{rank}(A + B) \le \text{rank}(A) + \text{rank}(B)$
- **秩-零化度定理**：$\text{rank}(A) + \dim\text{Ker}(A) = n$（$A$ 为 $m \times n$）

### 4.4 向量空间的基与维数

**基**：一组极大线性无关向量，能线性表示空间中任一向量。

**维数**：基中所含向量的个数，记为 $\dim V$。

**坐标**：向量 $\mathbf{v}$ 在基 $\{\mathbf{e}_1, \dots, \mathbf{e}_n\}$ 下的坐标 $(c_1, \dots, c_n)$，使得 $\mathbf{v} = \sum c_i \mathbf{e}_i$。

### 4.5 四个基本子空间

对于 $m \times n$ 矩阵 $A$：

| 子空间 | 符号 | 维数 | 所在空间 |
|--------|------|------|---------|
| 列空间 | $\text{Col}(A)$ | $\text{rank}(A) = r$ | $\mathbb{R}^m$ |
| 行空间 | $\text{Row}(A)$ | $\text{rank}(A) = r$ | $\mathbb{R}^n$ |
| 零空间（核） | $\text{Ker}(A)$ | $n - r$ | $\mathbb{R}^n$ |
| 左零空间 | $\text{Ker}(A^T)$ | $m - r$ | $\mathbb{R}^m$ |

正交关系：$\text{Row}(A) \perp \text{Ker}(A)$，$\text{Col}(A) \perp \text{Ker}(A^T)$。

### 4.6 内积空间

标准内积（点积）：$\langle \mathbf{u}, \mathbf{v} \rangle = \mathbf{u}^T \mathbf{v} = \sum u_i v_i$

**长度（范数）**：$\|\mathbf{v}\| = \sqrt{\langle \mathbf{v}, \mathbf{v} \rangle}$

**施密特正交化**（Gram-Schmidt）：从一组线性无关向量 $\{\mathbf{v}_1, \dots, \mathbf{v}_n\}$ 构造正交基 $\{\mathbf{u}_1, \dots, \mathbf{u}_n\}$：

$$
\mathbf{u}_1 = \mathbf{v}_1,\quad
\mathbf{u}_k = \mathbf{v}_k - \sum_{i=1}^{k-1}
\frac{\langle \mathbf{v}_k, \mathbf{u}_i \rangle}{\langle \mathbf{u}_i, \mathbf{u}_i \rangle} \mathbf{u}_i
$$

最后单位化：$\mathbf{e}_i = \mathbf{u}_i / \|\mathbf{u}_i\|$ 即得标准正交基。

---

## 五、特征值与特征向量

### 5.1 定义

若 $A\mathbf{v} = \lambda \mathbf{v}$，其中 $\mathbf{v} \neq \mathbf{0}$，则称：
- $\lambda$ 为 $A$ 的**特征值**
- $\mathbf{v}$ 为 $A$ 对应于 $\lambda$ 的**特征向量**

### 5.2 特征值与特征向量的求法

**步骤**：
1. 解特征方程：$\det(A - \lambda I) = 0$，得到特征值 $\lambda_1, \lambda_2, \dots, \lambda_n$
2. 对每个 $\lambda_i$，解齐次方程组 $(A - \lambda_i I)\mathbf{v} = \mathbf{0}$，得到特征向量

**特征多项式**：$p_A(\lambda) = \det(A - \lambda I) = (-\lambda)^n + \text{tr}(A)(-\lambda)^{n-1} + \cdots + \det(A)$

### 5.3 重要性质

1. $\sum_{i=1}^{n} \lambda_i = \text{tr}(A)$（迹 = 主对角线元素和）
2. $\prod_{i=1}^{n} \lambda_i = \det(A)$
3. 若 $\lambda$ 是 $A$ 的特征值，则：
   - $A^k$ 有特征值 $\lambda^k$
   - $A^{-1}$ 有特征值 $1/\lambda$（$A$ 可逆时）
   - $A + cI$ 有特征值 $\lambda + c$
4. 不同特征值对应的特征向量**线性无关**
5. 相似矩阵有相同的特征值

### 5.4 对角化

若 $A$ 有 $n$ 个线性无关的特征向量，则 $A$ **可对角化**：

$$
A = PDP^{-1}
$$

其中 $P$ 的列为特征向量，$D$ 为对角矩阵（对角线为特征值）。

**对角化的充要条件**：
- $A$ 有 $n$ 个线性无关的特征向量
- 几何重数 = 代数重数（对每个特征值）

:::tip[对角化的用途]
计算 $A^k$ 变得简单：$A^k = PD^k P^{-1}$，$D^k = \text{diag}(\lambda_1^k, \dots, \lambda_n^k)$。

这是求解常系数线性微分方程组、做 PageRank 幂迭代等应用的基础。
:::

### 5.5 代数重数与几何重数

- **代数重数**：特征值 $\lambda_i$ 在特征多项式中的重根次数
- **几何重数**：$\lambda_i$ 对应的特征空间的维数 $= \dim\text{Ker}(A - \lambda_i I) = n - \text{rank}(A - \lambda_i I)$

**关键关系**：$1 \le \text{几何重数} \le \text{代数重数}$

---

## 六、实对称矩阵与实二次型

### 6.1 实对称矩阵的对角化

**实对称矩阵**：$A \in \mathbb{R}^{n \times n}$，且 $A^T = A$。

**谱定理**：任何实对称矩阵 $A$ 都有**正交对角化**：

$$
A = Q\Lambda Q^T
$$

其中 $Q$ 为**正交矩阵**（$Q^T Q = I$），$\Lambda = \text{diag}(\lambda_1, \dots, \lambda_n)$。

**核心性质**：
- 特征值**全为实数**
- 不同特征值对应的特征向量**正交**
- 几何重数 = 代数重数，**一定可以对角化**

### 6.2 实二次型

$n$ 元**实二次型**：

$$
f(x_1, x_2, \dots, x_n) = \mathbf{x}^T A \mathbf{x} = \sum_{i=1}^{n} \sum_{j=1}^{n} a_{ij}x_i x_j
$$

其中 $A$ 为**实对称矩阵**（取法唯一）。

### 6.3 化二次型为标准形

通过**正交变换** $\mathbf{x} = Q\mathbf{y}$（$Q$ 为正交矩阵），将二次型化为**标准形**：

$$
f = \mathbf{y}^T \Lambda \mathbf{y} = \lambda_1 y_1^2 + \lambda_2 y_2^2 + \cdots + \lambda_n y_n^2
$$

其中 $\lambda_i$ 为 $A$ 的特征值，$Q$ 的列为对应的标准正交特征向量。

**步骤**：
1. 写出二次型的矩阵 $A$（对称矩阵）
2. 求 $A$ 的特征值 $\lambda_1, \dots, \lambda_n$
3. 求每个特征值的特征向量
4. 施密特正交化 + 单位化（不同特征值对应的特征向量已经正交）
5. 构造正交矩阵 $Q = [\mathbf{q}_1 \cdots \mathbf{q}_n]$
6. 作正交变换 $\mathbf{x} = Q\mathbf{y}$，得到标准形

### 6.4 正定性

| 类型 | 判别条件（等价） |
|------|----------------|
| **正定** | 所有特征值 $> 0$；或所有顺序主子式 $> 0$ |
| **半正定** | 所有特征值 $\ge 0$；或所有主子式 $\ge 0$ |
| **负定** | 所有特征值 $< 0$；或 $(-1)^k$ × 顺序主子式 $> 0$ |
| **半负定** | 所有特征值 $\le 0$ |
| **不定** | 既有正特征值又有负特征值 |

**惯性定理**：实二次型在任意可逆线性变换下的标准形中，正项个数（正惯性指数）和负项个数（负惯性指数）保持不变。

**希尔维斯特惯性定理**：记正惯性指数为 $p$，负惯性指数为 $q$，则 $p + q = \text{rank}(A)$。

### 6.5 二次型的合同

$A$ 与 $B$ **合同**：存在可逆矩阵 $C$ 使得 $B = C^T A C$。

合同保持**对称性**和**惯性指数**，但不保持特征值。

**合同标准形**：任何实对称矩阵合同于对角矩阵 $\text{diag}(I_p, -I_q, O)$，其中 $(p, q)$ 为惯性指数。

---

## 公式速查表

| 公式 | 备注 |
|------|------|
| $\det(AB) = \det(A)\det(B)$ | 行列式乘法 |
| $\det(cA) = c^n \det(A)$ | 数乘行列式 |
| $A^{-1} = \text{adj}(A) / \det(A)$ | 伴随矩阵求逆 |
| $\det(A - \lambda I) = 0$ | 特征方程 |
| $\sum \lambda_i = \text{tr}(A)$ | 特征值和 = 迹 |
| $\prod \lambda_i = \det(A)$ | 特征值积 = 行列式 |
| $\text{rank}(A) + \dim\text{Ker}(A) = n$ | 秩-零化度定理 |
| $A^k = PD^kP^{-1}$ | 利用对角化求幂 |
| $f(\mathbf{x}) = \mathbf{x}^T A\mathbf{x}$ | 二次型表示 |
| $A = Q\Lambda Q^T$ | 实对称矩阵正交对角化 |

---

## 常见题型与解题思路

:::tip[题型一：求解线性方程组]
增广矩阵 $\to$ 行阶梯形 $\to$ 判断解的情况 $\to$ 回代求解。若有无穷多解，用自由变量表示通解。
:::

:::tip[题型二：求逆矩阵]
$[A \mid I] \to$ 初等行变换 $\to$ $[I \mid A^{-1}]$。若 $A$ 不能化为 $I$，则 $A$ 不可逆。
:::

:::tip[题型三：行列式计算]
先尝试利用性质化简（提取公因子、化为三角形），复杂行列式按行展开递推。$n$ 阶常见题型：三对角行列式、范德蒙行列式。
:::

:::tip[题型四：判定向量组线性相关/无关]
构造矩阵 $A$，比较 $\text{rank}(A)$ 与向量个数 $k$：相等则无关，小于则相关。
:::

:::tip[题型五：特征值与特征向量]
解 $\det(A - \lambda I) = 0$ 得 $\lambda$，对每个 $\lambda$ 解 $(A - \lambda I)\mathbf{v} = \mathbf{0}$ 得特征向量。
:::

:::tip[题型六：化二次型为标准形]
求矩阵 $A$ 的特征值 $\to$ 特征向量 $\to$ 正交化 + 单位化 $\to$ 构造正交矩阵 $Q \to$ 作变换 $\mathbf{x} = Q\mathbf{y}$。
:::

---

## 结语

线性代数是一门**结构很美**的学科。从解方程出发，一路走到矩阵分解、特征空间、二次型——这些概念不是孤立的，而是层层递进。

复习时建议：**多动手算**——行列式计算、高斯消元、特征值求解，这些基本功是考试拿分的关键。概念之间建立联系（秩 ↔ 行列式 ↔ 线性相关 ↔ 零空间维数），比孤立背诵效率高得多。

祝考试顺利 🎯
