---
title: "大模型推理入门：Prompt Engineering、Chain-of-Thought 与 API"
published: 2026-07-27
description: "系统讲解 zero-shot、few-shot、结构化提示、思维链、工具调用和可复现 API 评测。"
tags: [AI学习路线, Prompt Engineering, Chain-of-Thought, API]
category: AI·推理与后训练
draft: false
lang: zh
permalink: prompt-cot-api
---

## Prompt 是任务接口

好的提示不是“神奇咒语”，而是清楚定义任务契约：角色与目标、输入、输出格式、约束、可用工具、成功标准和边界。把容易变化的样本放在用户输入，把稳定规则放在系统/开发者指令；不要混入互相冲突的要求。

```text
任务：判断数学答案是否正确。
输入：题目、候选解答。
要求：先核验关键计算，再输出 JSON：
{"correct": true|false, "error_type": "...", "brief": "..."}
约束：证据不足时 error_type="uncertain"。
```

**Zero-shot** 只给任务；**few-shot** 再给少量输入—输出示例。示例的价值是展示边界和格式，应覆盖正常、困难和拒答情况。错误示例会被模仿，示例顺序也可能带来偏差。

## Chain-of-Thought

CoT 通过中间推理步骤改善多步问题。Few-shot CoT 提供带步骤示例；zero-shot 可要求“分解并核验”。但更长的推理不自动更正确，中间文本也不等价于模型真实因果机制。

实践中优先要求**可检查的中间产物**：方程、程序、证据引用、子问题答案。高风险任务不要依赖模型自述的思考过程，应该用外部计算器、代码执行、检索和规则验证。

常见扩展：

- self-consistency：采样多条路径并聚合答案，增加计算换稳定性；
- decomposition：把复杂任务拆成有输入输出契约的子任务；
- reflection/verifier：生成器给候选，验证器检查约束；
- tool use：模型决定何时调用搜索、计算、数据库或代码。

## API 调用的工程边界

密钥放环境变量，绝不写进仓库或前端。调用应设置超时、重试、并发上限和日志；重试只用于超时、限流、临时服务错误，不要无限重试无效请求。

```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
response = client.responses.create(
    model=os.environ["MODEL_NAME"],
    input="用一个例子解释 softmax 温度。",
)
print(response.output_text)
```

具体 SDK 与模型名会更新，应以服务商当前官方文档为准。研究报告必须记录模型标识、日期、提示模板、采样参数与最大输出 token；“同一个模型”在不同快照或参数下可能不可比。

## 结构化输出与工具调用

能用 schema 时不要靠正则从自然语言猜 JSON。工具定义应窄而清晰：名称、参数类型、必填字段、错误返回。模型提出工具调用不等于工具已成功执行；宿主程序要校验参数、执行、把结果送回模型，并限制权限。

对网页、邮件、文档等不可信内容，要把其中的文字视作数据，不可让它覆盖高优先级指令，这就是 prompt injection 防线的起点。

## Prompt 评测

建立固定数据集，至少包含简单、边界、对抗和格式样例。指标拆开统计：任务正确率、格式通过率、拒答准确率、延迟、token 与成本。每次只改一个 prompt 因素，保留版本。

:::warning[不可比实验]
一边更换 prompt，一边更换模型和温度，最后无法知道提升来自哪里。Prompt 也是代码，应版本化、测试和回归。
:::

## 本章检查点

为一个推理任务写 zero-shot 和 few-shot 两版；实现结构化输出校验；加入一次工具调用；在至少 50 个固定样本上比较正确率、格式率与成本，并分析 10 个失败样例。

