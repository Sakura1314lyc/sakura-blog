---
title: "Transformer 核心：Self-Attention、位置编码与生成"
published: 2026-07-27
description: "从 Q/K/V 的矩阵计算到多头注意力、因果掩码、Encoder–Decoder 与 Decoder-only，完整解释 Transformer。"
tags: [AI学习路线, Transformer, Self-Attention, LLM]
category: AI·大模型
draft: false
lang: zh
permalink: transformer-core
---

## 注意力在做什么

给定序列表示 $X\in\mathbb R^{n\times d}$，线性投影得到：

$$Q=XW_Q,\quad K=XW_K,\quad V=XW_V$$

每个 query 与所有 key 做相似度，softmax 后加权 value：

$$\mathrm{Attention}(Q,K,V)=\mathrm{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}+M\right)V$$

除以 $\sqrt{d_k}$ 是为了避免维度增大导致点积过大、softmax 饱和。掩码 $M$ 把不可见位置加上负无穷：padding mask 排除补齐 token；causal mask 禁止生成位置看到未来。

```python
def attention(q, k, v, mask=None):
    scores = q @ k.transpose(-2, -1) / q.size(-1) ** 0.5
    if mask is not None:
        scores = scores.masked_fill(~mask, float("-inf"))
    return scores.softmax(dim=-1) @ v
```

## 多头注意力

单头只能在一个表示子空间中建立关系。多头把通道分组，独立计算注意力后拼接：

$$\mathrm{MHA}(X)=\mathrm{Concat}(head_1,\dots,head_h)W_O$$

头数增加不会自动增加总隐藏维度；通常 $d_{head}=d_{model}/h$。注意张量常变形成 `(batch, heads, seq, head_dim)`。

## 一个 Transformer Block

现代 block 由注意力、前馈网络、残差和归一化构成。Pre-Norm 形式：

$$x'=x+\mathrm{Attention}(\mathrm{LN}(x))$$
$$y=x'+\mathrm{FFN}(\mathrm{LN}(x'))$$

FFN 对每个位置独立地先升维再降维，常用 GELU、SwiGLU。注意力负责 token 间通信，FFN 负责逐位置非线性变换。残差保护信息和梯度。

## 位置信息

Self-Attention 本身对顺序不敏感，需要位置编码。原始 Transformer 使用正弦绝对位置；BERT 可学习绝对位置；LLaMA/Qwen 等常用 RoPE，把位置信息编码到 Q/K 的旋转中，使相对距离自然影响点积。长上下文扩展不仅是修改一个长度参数，还涉及位置缩放、训练分布、显存与注意力复杂度。

标准全注意力时间和显存随序列长度近似 $O(n^2)$。FlashAttention 通过分块和减少显存读写精确计算注意力，主要改善 IO 与显存，不是把数学结果换成近似。

## 三类架构

- **Encoder-only**：双向可见，擅长理解、分类、检索表征，BERT 是代表。
- **Decoder-only**：因果注意力，预测下一个 token，易扩展为通用生成模型，GPT/LLaMA/Qwen 属于此类。
- **Encoder–Decoder**：编码输入，解码器对历史输出做自注意力并对编码结果做交叉注意力，适合翻译、摘要等序列到序列任务，T5 是代表。

## 自回归生成与 KV Cache

语言模型学习：

$$P(x_{1:n})=\prod_{t=1}^{n}P(x_t|x_{<t})$$

推理每次生成一个 token。历史 K/V 不会改变，因此 KV Cache 保存它们，避免每一步重算整个前缀。代价是缓存随层数、序列长度、batch 和头维增长。

Greedy 每步选最大概率；temperature 调整分布尖锐度；top-k/top-p 截断低概率尾部；beam search 保留多个候选。开放式写作适合采样，数学基准通常使用确定性配置减少噪声。

## 本章检查点

手算 3 个 token 的单头注意力；写出 causal mask；说明 Q、K、V 各自扮演什么角色；比较三种架构的信息可见范围；解释 KV Cache 加速了什么、没有加速什么。

