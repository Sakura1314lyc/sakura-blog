---
title: "LLM 后训练全景：SFT、DPO、PPO、GRPO、OPD 与 R1-like"
published: 2026-07-27
description: "统一比较监督微调、偏好优化、强化学习和 on-policy distillation 的数据、目标、稳定性与适用场景。"
tags: [AI学习路线, SFT, DPO, PPO, GRPO, OPD]
category: AI·推理与后训练
draft: false
lang: zh
permalink: llm-post-training
---

## 后训练在改变什么

预训练让模型学习 $P(\text{token}|\text{context})$；后训练把能力塑造成可用行为：遵循指令、偏好、安全、推理和工具使用。算法差异可用三问辨别：数据由谁生成？监督信号是答案、偏好、奖励还是教师分布？训练数据是否来自当前策略（on-policy）？

## SFT：模仿高质量答案

监督微调在指令—回答对上最小化答案 token 的负对数似然：

$$\mathcal L_{SFT}=-\sum_t m_t\log\pi_\theta(y_t|x,y_{<t})$$

$m_t$ 通常屏蔽 system/user token，只训练 assistant。SFT 稳定、便宜、适合教格式和领域知识；局限是学习数据分布，遇到自身生成的错误状态时未必会恢复。少量高质量、多样且经过验证的数据通常胜过大量噪声。

## DPO：直接学习偏好

数据为同一 prompt 下 chosen/rejected 回答。DPO 让策略相对参考模型提高 chosen 的对数概率差：

$$
\mathcal L_{DPO}=-\log\sigma\left(\beta[
\log\frac{\pi_\theta(y^+|x)}{\pi_{ref}(y^+|x)}
-\log\frac{\pi_\theta(y^-|x)}{\pi_{ref}(y^-|x)}]\right)
$$

它不需要在线 rollout 或显式 reward model，工程简单；但依赖偏好数据覆盖，属于离线方法。`β` 控制偏离参考策略的强度。

## PPO：带价值函数的在线 RL

PPO 从当前策略采样回答，用奖励模型/规则奖励打分，估计 advantage，并通过截断概率比限制更新：

$$J_{\mathrm{clip}}(\theta)=\mathbb E_t\left[\min\left(r_t(\theta)A_t,\mathrm{clip}(r_t(\theta),1-\epsilon,1+\epsilon)A_t\right)\right]$$

其中 $r_t(\theta)=\pi_\theta(a_t|s_t)/\pi_{\mathrm{old}}(a_t|s_t)$。策略最大化 $J_{\mathrm{clip}}$；若写成训练 loss，则最小化它的负值。RLHF 中通常还训练 value/critic，并对参考模型加 KL 约束。PPO 通用但系统复杂：策略、参考、奖励、价值模型和 rollout 都占资源。

## GRPO：组内相对优势

GRPO 对同一问题采样一组回答，用组内奖励均值和标准差构造相对 advantage，省去独立 critic。数学、代码等有可验证奖励的任务尤其适合：

$$A_i=\frac{r_i-\mathrm{mean}(r)}{\mathrm{std}(r)+\epsilon}$$

如果一组奖励全相同，学习信号接近零；组大小、采样多样性、奖励尺度和 KL 都很关键。奖励函数有漏洞时，模型会 reward hacking。

## OPD：On-Policy Distillation

OPD 让**学生当前策略**生成轨迹，再由教师对这些状态提供密集的 token 分布监督。它同时缓解固定离线蒸馏的分布偏移，并比稀疏终局奖励提供更密集信号。代价是在线教师推理昂贵；教师一致性、tokenizer/模板和温度都会影响目标。

不要把 OPD 与 DPO 混淆：DPO 学成对偏好；OPD 学教师在学生访问状态上的分布。

“on-policy”描述的是训练状态来自当前学生策略，不代表教师也在采样动作。标准 OPD 往往需要训练期间持续查询教师；离线近似可以预计算教师信号，但一旦学生分布继续变化就可能重新产生偏移。2026 年的 Lightning OPD 表明，在其设定中教师一致性是离线方案能接近标准 OPD 的关键条件；这是一项具体方法的结论，不应泛化成所有蒸馏任务都可免费离线化。

## R1-like 训练链路

一个常见、而非唯一的路线：

1. 预训练 Base；
2. 少量高质量长思维链做 cold-start SFT；
3. 用可验证奖励进行大规模 RL，提升探索与正确率；
4. 拒绝采样并筛选高质量轨迹；
5. 再 SFT/RL，兼顾通用能力、可读性和安全。

DeepSeek-R1 的核心启发是可验证任务上的强化学习能诱发推理行为，但复现结论时必须区分模型、数据、奖励与算力规模。

## 如何选择

| 目标 | 首选起点 |
|---|---|
| 教格式、领域回答 | SFT |
| 已有 chosen/rejected | DPO |
| 任意奖励、成熟 RL 基础设施 | PPO |
| 数学/代码可验证奖励 | GRPO |
| 有强教师、需密集 on-policy 信号 | OPD |

实际系统常组合，而非互斥。先做 SFT 基线，再增加一种算法；否则无法判断复杂度是否值得。

## 本章检查点

对五种方法分别写出数据来源、模型副本、损失、on/off-policy、主要成本与失败模式；解释为何 SFT 可能记忆、RL 可能泛化；设计一个不会只奖励答案格式的数学奖励函数。

## 原始资料

- [Direct Preference Optimization（DPO）](https://arxiv.org/abs/2305.18290)；
- [Proximal Policy Optimization（PPO）](https://arxiv.org/abs/1707.06347)；
- [DeepSeek-R1 与 GRPO/R1-like 路线](https://arxiv.org/abs/2501.12948)；
- [SFT Memorizes, RL Generalizes](https://arxiv.org/abs/2501.17161)；
- [Lightning OPD](https://arxiv.org/abs/2604.13010)。
