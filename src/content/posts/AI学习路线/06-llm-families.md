---
title: "大语言模型家族：BERT、GPT、LLaMA 与 Qwen 怎么比较"
published: 2026-07-27
description: "从训练目标、架构、tokenizer、开放权重与部署角度比较四类典型语言模型。"
tags: [AI学习路线, BERT, GPT, LLaMA, Qwen]
category: AI·大模型
draft: false
lang: zh
permalink: llm-families
---

## 不要只按参数量比较

一个模型的能力由架构、训练 token、数据质量、训练目标、后训练、上下文长度、推理预算和工具系统共同决定。参数量只是容量代理；同参数模型可能因数据与后训练差异表现完全不同。

## BERT：双向理解

BERT 是 Encoder-only，通过 Masked Language Modeling 恢复被遮盖 token，从左右两侧学习上下文。它输出每个 token 的上下文化表示，适合分类、序列标注、抽取、向量表征。它不是天然的自由文本生成器。

微调 BERT 时，常把 `[CLS]` 表示接分类头；但向量检索通常需要专门的对比学习模型，而不是直接拿原始 BERT 平均池化。

## GPT：自回归生成范式

GPT 系列采用 Decoder-only 与下一个 token 预测。统一的文本接口让翻译、问答、代码等任务都能被表示成“给定前缀继续生成”。规模化预训练带来上下文学习；指令微调和偏好对齐让模型更会遵循用户意图。

“GPT”既指一条具体模型系列，也常被泛指生成式预训练 Transformer，阅读时要区分。

## LLaMA：高效开放权重基座

LLaMA 系列推动了高质量开放权重生态，常见设计包括 Decoder-only、RMSNorm、RoPE、SwiGLU、分组查询注意力等。开放权重不等于完全开源：训练数据、代码与许可证开放程度需分别检查。

Base 模型主要延续文本，不应直接当聊天助手；Instruct/Chat 模型经过指令与偏好后训练，必须使用对应聊天模板。

## Qwen：中文与多模态生态

Qwen 系列覆盖稠密/MoE、代码、数学、视觉语言等方向，对中英文和长上下文提供完整工具链。选择具体 checkpoint 时先看模型卡：Base 还是 Instruct、上下文上限、许可证、显存需求、推荐 Transformers/vLLM 版本。

不同代际 tokenizer 和模板可能不兼容。不能把旧模型 prompt 格式原样套到新模型，再据此判断能力。

模型系列名不能替代具体版本。实验报告应写完整仓库 ID、revision/commit、量化方式和推理后端。例如同属 Qwen 的 Base、Instruct、Thinking、Coder 或 VL checkpoint，训练目标和输入接口都可能不同；把它们放进同一张“参数量排行榜”会制造错误结论。

## Tokenizer 是模型的一部分

Tokenizer 把字符串映射为 token ID。BPE/Unigram 等方法在词表大小、稀有词、中文、代码上有不同切分。相同文本在不同模型中 token 数不同，直接影响上下文成本和训练长度。

检查特殊 token：BOS/EOS、padding、角色标记。生成不停常因 EOS 配置或模板错误；padding 方向也会影响批量生成。

## Dense 与 MoE

稠密模型每个 token 激活全部参数；Mixture-of-Experts 用路由器为每个 token 选择少数专家。MoE 可增加总容量而控制每 token 计算量，但总权重显存、通信、负载均衡和部署复杂度更高。“总参数”与“激活参数”必须分开报告。

## 选择模型的决策表

| 需求 | 优先考虑 |
|---|---|
| 分类/抽取、低延迟 | Encoder 或小型指令模型 |
| 通用生成与 Agent | Decoder-only Instruct |
| 训练算法研究 | 许可证合适的 Base 小模型 |
| 中文/数学/代码 | 对应领域 checkpoint，先做同配置基线 |
| 本地显存有限 | 1.5B–3B、4bit、LoRA |
| 生产部署 | 吞吐、延迟、KV Cache、许可、安全 |

## 本章检查点

任选 BERT、一个 LLaMA 系和一个 Qwen 系模型，记录训练目标、架构、参数量、词表、上下文、许可证、模板与显存；用相同 20 个样例和解码配置比较，而不是凭聊天印象下结论。

## 原始资料

- [BERT](https://arxiv.org/abs/1810.04805)；
- [GPT-3 与上下文学习](https://arxiv.org/abs/2005.14165)；
- [LLaMA](https://arxiv.org/abs/2302.13971)；
- [Qwen 官方组织与模型卡](https://huggingface.co/Qwen)。

论文解释设计动机，模型卡说明具体 checkpoint 的使用边界。涉及许可证、上下文上限和部署参数时，以所用版本的模型卡为准。
