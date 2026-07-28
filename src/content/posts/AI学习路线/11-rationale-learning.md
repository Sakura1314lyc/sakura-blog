---
title: "Rationale Learning：可解释选择、图泛化与联邦自解释 GNN"
published: 2026-07-27
description: "从 selector–predictor 范式讲到 DARE、C2R、FedGR，以及解释忠实性、捷径和联邦学习。"
tags: [AI学习路线, Rationale Learning, GNN, 联邦学习, 可信学习]
category: AI·推理与后训练
draft: false
lang: zh
permalink: rationale-learning
---

## 什么是 rationale

Rationale 是输入中足以支持预测的稀疏子集：文本中的 token 片段，或图中的节点/边子图。典型结构由 selector $g$ 产生二值/软掩码 $z$，predictor $f$ 只基于 $x\odot z$ 预测：

$$z=g(x),\qquad \hat y=f(x\odot z)$$

目标同时追求预测正确、解释稀疏和连续：

$$\mathcal L=\mathcal L_{\mathrm{task}}+\lambda_1\lVert z\rVert_1+\lambda_2\sum_t\lvert z_t-z_{t-1}\rvert$$

“看起来合理”不等于“忠实”。**plausibility** 衡量是否符合人类标注，**faithfulness** 衡量模型预测是否真的依赖该子集。可用 sufficiency（只保留 rationale 是否仍能预测）和 comprehensiveness（删除后性能是否下降）检查。

## DARE：利用 non-rationale

传统 selector–predictor 忽略未选部分。DARE 把输入表示解耦为 rationale 与 non-rationale，并最小化两者互信息，让选择的证据更完整、非证据与任务信息更独立。阅读时抓住三个变量：如何采样掩码、如何估计互信息、稀疏约束怎样避免“全选”。

互信息估计通常只是可优化下界/上界，结果依赖估计器，不应把损失下降直接等同于完全独立。

## 图 Rationale

图分类中 rationale 是与标签相关的子图，例如分子中的官能团。难点是离散选择不可微，常用连续门控、Gumbel-Softmax 或概率采样；还要保证选出子图结构合理。

C2R 把**分类模块**与**rationalization 模块**协同训练：分类侧构造多环境、学习稳健图表示；解释侧分离 rationale/non-rationale，并通过表示对齐/蒸馏增强稀疏子图的学习信号。它针对的是分布外泛化：模型应依赖跨环境稳定的因果相关子结构，而非环境特有捷径。

更具体地说，C2R 的分类模块假设可获得多个环境，并用环境条件生成网络扩充训练分布；rationalization 模块用 separator 分出 rationale 与 non-rationale，并让后者与标签去相关。随后用知识蒸馏对齐分类表示和 rationale 子图表示，再根据 non-rationale 表示推断环境，形成协同循环。这里的“因果相关”是方法希望逼近的稳定结构，不应在没有干预证据时直接宣称已识别真实因果图。

## 捷径与反事实增强

捷径是与标签相关但非因果、换环境就失效的特征。检测方法：改变背景而保持核心证据，观察预测是否稳定。反事实增强把 rationale 与不同 non-rationale 重组，打破伪相关。

但增强必须保持标签语义。随意交换分子子图可能产生无效分子；生成的反事实若不真实，会引入新捷径。

## 联邦学习 + Rationale

联邦学习让多个客户端本地训练，只聚合更新：

$$\theta^{t+1}=\sum_k\frac{n_k}{\sum_jn_j}\theta_k^{t+1}$$

数据不离开客户端不等于绝对隐私；梯度可能泄漏信息，还需安全聚合、差分隐私等机制。Non-IID 客户端使各地捷径不同，模型聚合后可能更不稳。

FedGR 在联邦图学习中加入两个 anti-shortcut augmenter，在客户端生成与本地捷径冲突的样本，学习更稳定的 rationale，再聚合模型。论文中的 difference-aware augmenter 利用全局模型与本地模型的差异，complement-aware augmenter 则围绕 rationale/non-rationale 互补信息构造训练信号。它没有让原始数据离开客户端，但也没有因此自动提供差分隐私保证。评测要同时看预测性能、解释质量、客户端差异与通信成本。

## 本章检查点

精读 DARE、C2R、FedGR，画出各自的数据流；用同一张表比较 selector、predictor、环境、增强、损失和评测；设计一个合成图数据，使 motif 决定标签、背景与标签在训练集伪相关，再测试分布外准确率。

## 原始资料

- [DARE（NeurIPS 2022）](https://proceedings.neurips.cc/paper_files/paper/2022/hash/a9a67d9309a28372dde3de2a1c837390-Abstract-Conference.html)
- [C2R](https://arxiv.org/abs/2403.06239)
- [FedGR（ICML 2024 / PMLR）](https://proceedings.mlr.press/v235/yue24b.html)
