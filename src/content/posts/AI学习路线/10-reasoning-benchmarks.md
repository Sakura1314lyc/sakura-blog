---
title: "推理评测：GSM8K、MATH、MathVista、WeMath 与可信实验"
published: 2026-07-27
description: "讲清四类推理基准、答案抽取、pass@k、数据污染、显著性和错误分析。"
tags: [AI学习路线, GSM8K, MATH, MathVista, WeMath]
category: AI·推理与后训练
draft: false
lang: zh
permalink: reasoning-benchmarks
---

## 基准测量的不是同一种能力

- **GSM8K**：小学文字数学题，重点是多步算术与语义转换。
- **MATH**：竞赛风格题，覆盖代数、几何、数论等，答案形式更复杂。
- **MathVista**：图表、几何图、科学图像等视觉数学推理。
- **WeMath**：面向多模态数学理解的分层诊断，关注知识概念与视觉推理。

高分可能来自知识、推理、模板适配、采样预算或数据污染。不能把单一 accuracy 写成“通用智能”。

## 评测管线

固定模型、checkpoint、chat template、system prompt、生成长度、温度、top-p、停止词与精度。保存原始输出，答案抽取和评分分开执行，便于修复 scorer 而不用重新推理。

```text
sample_id → prompt → raw_response → extracted_answer
          → reference → correctness → error_type
```

数学等价不能只做字符串比较：`1/2`、`0.5`、`\frac{1}{2}` 应视任务规则判等；符号化工具也要设超时，避免执行不可信表达式。

## 指标

`accuracy = 正确题数 / 总题数`。当每题采样 $k$ 次时，`pass@k` 衡量至少一个候选正确的概率，但必须报告 $k$ 和采样参数。多数投票衡量 self-consistency，与 pass@k 不是同一指标。

若一题一共生成 $n$ 个候选，其中 $c$ 个正确，从中均匀抽取 $k$ 个时，常用无偏估计为：

$$\mathrm{pass@}k=1-\frac{\binom{n-c}{k}}{\binom{n}{k}}$$

只有在 $n\ge k$ 且保留了独立候选时这个估计才有意义。直接从同一组样本里挑最好的答案是 oracle 上界，不是用户一次请求能得到的准确率。

报告 bootstrap 置信区间或多次运行波动。两个模型差 0.3 分但置信区间高度重叠，不应宣称显著领先。

对固定题集比较两个模型时，最好按题目做 paired bootstrap，因为两者面对的是同一批样本。样本很少时置信区间会很宽；报告区间不能弥补数据集不代表目标场景的问题。

## 公平比较

统一题目、提示、输出预算和答案抽取。若一个模型使用工具、更多采样或更长 token，必须单独报告“质量—计算”曲线。模型 A 1 次生成与模型 B 64 次采样不是等成本对比。

区分：

- **Base vs Instruct**：模板与行为目标不同；
- **zero-shot vs few-shot**：上下文信息不同；
- **text-only vs vision**：MathVista 不能给文本模型泄漏人工描述；
- **公开测试 vs 私有测试**：污染风险不同。

## 错误分类

至少抽样 50 个错误，标记：

1. 题意/视觉感知错误；
2. 公式或知识缺失；
3. 规划错误；
4. 中间计算错误；
5. 正确推理但答案抽取失败；
6. 超长截断或格式违规。

如果改进只减少“格式错”，就不要声称推理能力提升。相反，scorer bug 也可能掩盖真实能力。

## 数据污染与过拟合

题目、解析和答案广泛公开，可能进入预训练或后训练。用近邻检索检查训练数据重合；对题目做数字替换、语序变换和对抗改写；建立时间更新或自建集合。公开 leaderboard 适合比较，私有诊断集更适合研究。

## 本章检查点

实现一个可保存原始响应的评测器；为 100 道题写单元测试覆盖分数、百分数和 LaTeX；报告 accuracy、置信区间、平均输出 token、延迟；给 20 个失败样例做分类。

## 基准原始资料

- [GSM8K](https://arxiv.org/abs/2110.14168)；
- [MATH](https://arxiv.org/abs/2103.03874)；
- [MathVista](https://arxiv.org/abs/2310.02255)；
- [WeMath](https://arxiv.org/abs/2407.01284)。
