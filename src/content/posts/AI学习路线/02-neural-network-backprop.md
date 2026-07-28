---
title: "神经网络基础：前向传播、反向传播、损失与优化"
published: 2026-07-27
description: "从线性层到反向传播的数学推导，解释激活、损失、梯度下降、正则化与训练诊断。"
tags: [AI学习路线, 神经网络, 反向传播, 优化器]
category: AI·深度学习
draft: false
lang: zh
permalink: neural-network-backprop
---

## 神经网络在学习什么

监督学习给定样本 $(x_i,y_i)$，模型 $f_\theta$ 用参数 $\theta$ 把输入映射到预测，训练就是最小化经验风险：

$$
\theta^\*=\arg\min_\theta \frac1N\sum_{i=1}^N \mathcal L(f_\theta(x_i),y_i)
$$

单个线性层是 $z=Wx+b$。叠加线性层仍然是线性变换，因此层间需要 ReLU、GELU、Sigmoid 等非线性激活。多层感知机可写为：

$$h=\sigma(W_1x+b_1),\qquad \hat y=W_2h+b_2$$

前向传播计算 $\hat y$ 和损失；反向传播用链式法则从损失向前逐层求梯度。

## 反向传播推导

以均方误差 $L=\frac12\|\hat y-y\|^2$ 为例：

$$
\frac{\partial L}{\partial \hat y}=\hat y-y,\quad
\frac{\partial L}{\partial W_2}=\frac{\partial L}{\partial \hat y}h^\top
$$

梯度传回隐藏层：

$$
\frac{\partial L}{\partial h}=W_2^\top\frac{\partial L}{\partial \hat y},\quad
\frac{\partial L}{\partial z_1}=\frac{\partial L}{\partial h}\odot\sigma'(z_1)
$$

再得到 $\partial L/\partial W_1=(\partial L/\partial z_1)x^\top$。核心只有两件事：局部导数和上游梯度相乘；广播、转置与求和必须与张量形状匹配。

自动微分把运算记录成计算图，反向时应用向量—雅可比积，因此无需显式构造巨大的雅可比矩阵。

## 损失函数如何选

- 回归常用 MSE、MAE 或 Huber；MSE 对离群点敏感。
- 单标签分类用交叉熵。模型输出 logits，不要先手动 softmax 再传给 `CrossEntropyLoss`。
- 多标签分类用逐标签二元交叉熵 `BCEWithLogitsLoss`。

交叉熵把正确类别概率 $p_y$ 转成 $-\log p_y$；预测越自信且错误，惩罚越大。

### Softmax 与交叉熵为什么常放在一起

设 logits 为 $z$，softmax 概率为 $p_j=\exp(z_j)/\sum_k\exp(z_k)$，真实标签 one-hot 向量为 $y$。单样本交叉熵对 logit 的梯度有简洁形式：

$$\frac{\partial L}{\partial z_j}=p_j-y_j$$

这说明正确类概率不足时对应 logit 会被推高，错误类概率过高时会被压低。实现时使用 `cross_entropy(logits, target)`，框架会用数值稳定的 log-sum-exp；先算 softmax 再取对数既重复计算，也更容易数值下溢。

## 梯度下降与优化器

最基本更新为 $\theta\leftarrow\theta-\eta\nabla_\theta L$。学习率太大时震荡或发散，太小时收敛慢。SGD with momentum 累积方向，AdamW 按参数自适应缩放并把权重衰减与梯度更新解耦。AdamW 易用，但不意味着任何任务都优于 SGD。

```python
model = MLP()
optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=0.01)

for x, y in loader:
    optimizer.zero_grad(set_to_none=True)
    logits = model(x)
    loss = torch.nn.functional.cross_entropy(logits, y)
    loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    optimizer.step()
```

顺序很重要：清梯度 → 前向 → 损失 → 反向 → 更新。PyTorch 默认累积梯度。

## 为什么训练会失败

- **梯度消失/爆炸**：深层链式乘法使梯度趋近 0 或无限大。残差连接、归一化、合理初始化、梯度裁剪能缓解。
- **过拟合**：训练损失下降、验证损失上升。增加数据、数据增强、权重衰减、Dropout、早停。
- **欠拟合**：训练集也差。检查容量、优化时间、学习率和特征。
- **数据问题**：标签错位、标准化泄漏、类别不平衡往往比换模型更致命。

BatchNorm 在训练期使用当前批统计并更新移动统计，LayerNorm 则在单个样本的特征维度上归一化；它们不是可以随意互换的“稳定训练开关”。初始化也要和激活匹配：ReLU 网络常用 He/Kaiming 初始化，tanh 常考虑 Xavier 初始化。初始化、残差和归一化共同影响信号与梯度能否跨层传播。

诊断时同时看训练损失、验证损失、梯度范数、学习率和样本级预测。`loss=nan` 先查输入中的 NaN/Inf、除零、log/exp 溢出和过大学习率；损失完全不动先查参数是否进入优化器、是否误用 `no_grad`、标签是否恒定。

## 梯度检查

用有限差分验证某个参数：

$$
\frac{\partial L}{\partial \theta_j}\approx
\frac{L(\theta_j+\epsilon)-L(\theta_j-\epsilon)}{2\epsilon}
$$

在双精度、小网络、无随机层条件下比较数值梯度和自动微分。它很慢，只用于单元测试。

## 本章检查点

手写一个 NumPy 两层网络；逐项说明每个梯度形状；在一个小分类数据集上画训练/验证曲线；故意使用过大学习率并解释异常。能从曲线定位问题，比记住优化器名字更重要。

## 继续阅读

- [《动手学深度学习》线性神经网络与多层感知机](https://zh.d2l.ai/chapter_linear-networks/index.html)；
- [PyTorch Autograd 机制](https://docs.pytorch.org/docs/stable/notes/autograd.html)；
- [PyTorch `CrossEntropyLoss`](https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html)。
