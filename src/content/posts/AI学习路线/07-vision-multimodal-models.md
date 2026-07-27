---
title: "视觉与多模态大模型：从 ViT 到 LLaVA 与 Qwen-VL"
published: 2026-07-27
description: "解释图像 patch、Vision Transformer、视觉投影器、跨模态对齐、多阶段训练和多模态评测。"
tags: [AI学习路线, ViT, LLaVA, Qwen-VL, 多模态]
category: AI·大模型
draft: false
lang: zh
permalink: vision-multimodal-models
---

## ViT：把图像变成 token

图像 $H\times W\times C$ 被切成 $P\times P$ patch，共 $N=HW/P^2$ 个。每个 patch 展平并线性投影到 $d$ 维，加位置编码后送入 Transformer Encoder：

$$z_0=[x_{class};x_p^1E;\dots;x_p^NE]+E_{pos}$$

分类可读取 `[CLS]`，也可池化全部 patch。patch 越小，细节越多，但注意力长度与计算量快速增加。与 CNN 相比，ViT 的局部归纳偏置较弱，通常更依赖数据和预训练；大规模预训练后迁移能力很强。

## 多模态模型的最小结构

典型视觉语言模型包含：

1. **视觉编码器**：ViT/CLIP ViT 把图像变成视觉 token；
2. **连接器**：线性层、MLP 或 resampler，把视觉维度映射到语言模型空间；
3. **语言模型**：根据视觉 token 与文本 token 生成答案。

LLaVA 的经典路线是“预训练视觉编码器 + 投影器 + LLM”。第一阶段用图文对齐训练连接器，第二阶段用视觉指令数据做监督微调。冻结哪些模块决定成本与可塑性。

## 对齐不只是维度匹配

投影器能让张量形状匹配，却不保证语义对齐。训练数据需要让“图像区域—文字概念—回答行为”对应。Caption 数据学习描述，VQA 学习问答，OCR/文档数据强化文字识别，视觉推理数据强化多步关系。

常见失败包括幻觉不存在的物体、忽略小字、空间关系错误、视频时间顺序混乱。应要求模型把答案绑定到可见证据，并用拒答样例训练“看不清时承认不确定”。

## Qwen-VL 系列应关注什么

阅读技术报告时不要只看排行榜，重点看：

- 原生分辨率与动态分辨率如何编码；
- 图像/视频 token 预算如何随输入增长；
- 位置编码如何同时表示二维空间和时间；
- 是否支持区域指代、OCR、文档与 GUI 操作；
- 稠密与 MoE 版本的激活参数和部署条件。

Qwen3-VL 报告进一步强调交错图文长上下文、空间—时间建模、ViT 多层特征和视频时间对齐。具体能力与部署要求应以对应 checkpoint 模型卡和官方仓库为准。

## 多模态数据与模板

处理器通常同时封装 tokenizer 和 image processor：

```python
from transformers import AutoProcessor

processor = AutoProcessor.from_pretrained(model_name)
messages = [{
    "role": "user",
    "content": [
        {"type": "image", "image": "diagram.png"},
        {"type": "text", "text": "逐步解释图中信息流"}
    ]
}]
```

图像缩放、裁剪和像素范围必须与预训练一致。批处理要正确处理不同图像数和不同 token 长度。训练标签通常把用户和视觉输入部分设为 `-100`，只对助手答案计算语言建模损失。

## 评测

MathVista 测视觉数学推理，MMMU 覆盖多学科，文档/OCR、图表、视频各有专门基准。多选题要规范答案抽取；开放题需要明确等价规则。还应建立人工错误分类：视觉感知错、OCR 错、知识错、推理错、格式错。

:::warning[数据污染]
公开 benchmark 的题目可能进入训练数据。高分不必然代表泛化，应加入自建、时间更新或扰动后的测试集。
:::

## 本章检查点

手算一张 `224×224` 图像在 patch size 16 下的 token 数；画出 LLaVA 数据流；用同一张图测试描述、OCR、空间和推理四类问题；对错误进行归因，不能笼统写“模型看错了”。

