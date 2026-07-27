---
title: "结课实战一：用 SFT、OPD / GRPO 微调 Qwen 推理模型"
published: 2026-07-27
description: "一份可执行的数学推理后训练实验手册，覆盖数据、LoRA、SFT、OPD/GRPO、评测、消融和报告。"
tags: [AI学习路线, Qwen, LoRA, SFT, OPD, GRPO]
category: AI·科研实战
draft: false
lang: zh
permalink: reasoning-finetune-lab
---

## 研究问题

在固定基座、数据和评测下比较：

1. SFT 是否提升 GSM8K/MATH 正确率？是否只是学会输出格式？
2. OPD 或 GRPO 在 SFT 基础上是否继续提升？
3. 提升是否能迁移到未训练题型？

主实验建议 `Qwen 1.5B/3B Base + LoRA/QLoRA`。先用 GSM8K 建闭环，再加 MATH；多模态可把同样框架迁移到 MathVista/WeMath。

## 实验矩阵

| 组 | 初始化 | 训练 | 作用 |
|---|---|---|---|
| A | Base | 无 | 必须基线 |
| B | Base | SFT | 模仿推理轨迹 |
| C | B | OPD | 教师在学生轨迹上密集指导 |
| D | B | GRPO | 可验证奖励在线优化 |

算力不足时 A/B 必做；C 为大纲重点。D 跑不动时实现损失与最小 toy run，并明确写成“原理验证”，不能假装完整实验。

## 数据

把原始 train 再划出 validation；官方 test 只做最终报告。每条数据保留 `id/question/answer/final_answer/source`。SFT 答案需经过规则或人工验证，避免蒸馏错误。

Chat template 后，只对 assistant token 计算 loss。先打印 5 条 tokenized 样本，确认角色、EOS、label mask 和截断。

```json
{"messages":[
  {"role":"user","content":"题目……"},
  {"role":"assistant","content":"推导……\n最终答案：42"}
]}
```

## SFT 配置

建议从 rank 16/32 LoRA、学习率 `1e-4` 左右、1–3 epoch 起步；具体值由验证集决定。记录 effective batch：

$$B_{eff}=B_{device}\times grad\_accum\times GPU\_count$$

观察训练/验证 loss、梯度范数、吞吐和正确率。若 loss 降而准确率不升，检查答案抽取、数据质量和训练目标；若训练集暴涨、验证集不变，优先怀疑记忆。

可复用 LLaMA-Factory 或 TRL，重点是保存完整配置与数据版本，不是重写 Trainer。

## OPD 最小流程

1. 学生从当前策略对问题生成 rollout；
2. 教师读取同一上下文，对每个学生 token 给 logits/log-prob；
3. 最小化教师与学生分布的 KL/交叉熵；
4. 控制学生对 SFT/reference 的漂移。

在线教师成本高，可缓存，但缓存会逐渐变成 off-policy。教师与学生 tokenizer 不同会使逐 token 蒸馏困难。使用 verl/EasyOPD 类框架时仍要验证 rollout、教师一致性和 mask。

## GRPO 最小流程

同一题采样 $G$ 个回答，抽取答案，规则奖励正确性与格式，再做组内标准化。奖励必须防 hacking：不能只检查答案字符串是否出现在输出中；对无法解析的答案给明确惩罚，并记录各奖励分量。

## 评测与消融

统一 greedy 与 sampling 两套配置；报告 accuracy、pass@k、输出长度、格式率、吞吐和显存。至少做：

- LoRA rank 或数据量；
- 有/无推理过程；
- SFT vs SFT+OPD/GRPO；
- 训练域 vs 未见题型。

多种子运行，给置信区间。随机抽取错误并分类为理解、规划、计算、格式或截断。

## 交付清单

- 一条命令复现 A/B，C/D 有独立脚本；
- 环境、硬件、耗时、数据许可证；
- 配置、日志、checkpoint/adapter；
- 主结果、消融、失败样例；
- 结论明确区分 SFT 模仿与 on-policy 学习；
- 局限与下一步。

:::tip[成功标准]
最重要的不是追平论文数字，而是形成可审计证据链：哪一步改变了什么，以及你如何知道。
:::

