---
title: "经典深度学习架构：CNN、ResNet、RNN、GCN、GAT 与 GIN"
published: 2026-07-27
description: "用统一的信息聚合视角理解卷积、残差网络、循环网络和三类图神经网络。"
tags: [AI学习路线, CNN, ResNet, RNN, GNN]
category: AI·深度学习
draft: false
lang: zh
permalink: deep-learning-architectures
---

## 统一视角：如何交换信息

不同架构的关键区别，是“哪些位置能互相看到、如何共享参数”。CNN 在局部网格聚合，RNN 沿时间递归，GNN 沿图的边聚合，Transformer 则让 token 全局注意。

## CNN 与 ResNet

二维卷积用同一个核在图像上滑动，具备局部连接和参数共享。输入 $(N,C_{in},H,W)$，卷积核 $(C_{out},C_{in},K_h,K_w)$；输出空间尺寸：

$$H_{out}=\left\lfloor\frac{H+2P-D(K-1)-1}{S}+1\right\rfloor$$

浅层学习边缘，深层组合成纹理和语义。池化或步幅卷积扩大感受野、降低分辨率。卷积天然具有平移等变性，但不是自动对旋转、尺度变化不变。

网络加深后，优化可能退化。ResNet 学习残差：

$$y=F(x)+x$$

恒等捷径为梯度提供直接通道。如果通道或分辨率变化，用投影捷径匹配形状。残差思想后来也成为 Transformer 的基础组件。

## RNN、LSTM 与序列

基础 RNN：

$$h_t=\tanh(W_xx_t+W_hh_{t-1}+b)$$

同一参数跨时间共享，隐藏状态压缩历史。但长序列反向传播会出现梯度消失/爆炸。LSTM 用输入门、遗忘门、输出门控制记忆单元，使信息更容易长期保留。RNN 适合流式和小模型场景，但训练难并行；长程建模通常由 Transformer 接管。

## 图神经网络的消息传递

一层 GNN 可概括为：

$$m_v^{(k)}=\mathrm{AGG}\{h_u^{(k)}:u\in\mathcal N(v)\},\quad
h_v^{(k+1)}=\mathrm{UPDATE}(h_v^{(k)},m_v^{(k)})$$

- **GCN** 使用归一化邻接矩阵做加权平均：$H'=\sigma(\tilde D^{-1/2}\tilde A\tilde D^{-1/2}HW)$。
- **GAT** 学习邻居注意力权重，让不同邻居贡献不同。
- **GIN** 使用求和聚合与 MLP，理论上能达到 Weisfeiler–Lehman 图同构测试对应的区分能力。

图任务分节点分类、边预测和图分类。图分类还需要 readout，把节点表示聚合成图表示。

## GNN 的典型问题

层数增加会让相邻节点表示趋同，称为过平滑；远距离信息被压缩到固定维度会过挤压；异配图中相连节点类别不同，简单平滑可能有害。还要防止把测试节点的标签或未来边泄漏到训练图。

## 何时选哪种架构

| 数据结构 | 首选基线 | 关键归纳偏置 |
|---|---|---|
| 图像网格 | CNN / ResNet | 局部、平移等变 |
| 时间序列 | RNN / 1D CNN / Transformer | 顺序与时间依赖 |
| 关系网络、分子 | GCN / GAT / GIN | 邻接关系 |
| 长文本与跨模态 | Transformer | 全局内容寻址 |

不要因为模型“更新”就跳过强基线。小数据上 ResNet、LSTM、GCN 可能更稳定、更便宜、更易解释。

## 本章检查点

用 PyTorch 分别打印四类模型每层张量形状；计算 CNN 的感受野；解释残差相加为何要求形状一致；在一个小图上手算一层 GCN；比较 mean 与 sum 聚合会丢失什么信息。

