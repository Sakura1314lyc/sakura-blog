---
title: "结课实战二：OpenClaw、Hermes、Codex 与 Claude Code Agent 工作台"
published: 2026-07-27
description: "从安全安装、模型配置到 Skill、MCP、轨迹与测试，完成可对比的四类 Agent 实战。"
tags: [AI学习路线, OpenClaw, Hermes, Codex, Claude Code]
category: AI·科研实战
draft: false
lang: zh
permalink: agent-systems-lab
---

## 实战目标

不是“把四个工具都装上”就结束，而是用同一任务集比较 Harness。最终要完成：

- 至少运行 OpenClaw、Hermes、Codex；Claude Code 可接课程指定模型/兼容服务；
- 配置一个自定义 Skill；
- 连接一个 MCP 服务；
- 执行 20 个任务并分析轨迹；
- 给出权限、安全、成功率、成本和适用场景对比。

产品命令与兼容模型变化快，安装时只使用各自当前官方仓库/文档。不要从随机博客复制 `curl | shell` 后直接授予整个主目录权限；先核验域名与脚本，再用隔离环境。

## 安全工作区

创建专用测试目录和最小权限凭证。禁止使用生产邮箱、主云账号、真实支付工具和包含隐私的浏览器配置。高风险工具先用 mock。

```text
agent-lab/
├─ workspace/       # Agent 允许访问
├─ fixtures/        # 固定输入
├─ expected/        # 期望结果/判分器
├─ skills/          # 自定义 Skill
├─ traces/          # 轨迹
└─ report/          # 指标与分析
```

API key 放本地秘密存储/环境变量，`.gitignore` 排除 `.env`、日志中的 token 和配置凭证。

运行前先做一次“权限清点”：允许读取哪些路径、允许连接哪些域名、哪些工具可写、哪些动作必须确认、日志会保存什么。实验结束后撤销临时密钥并检查轨迹中是否意外记录了秘密。沙箱能降低影响范围，但不能代替最小权限和人工确认。

## 统一任务集

设计四类各 5 个任务：

1. **代码**：定位 bug、加小功能、运行测试；
2. **研究**：检索三篇论文并做证据表；
3. **文件**：从混乱目录生成只读清单；
4. **工具编排**：读取数据、计算、生成报告。

每个任务写成功条件、允许工具、最大步数和禁止动作。所有系统使用相近模型等级和预算；无法统一时如实记录。

## 系统观察点

### OpenClaw

关注工作区、bootstrap 文件、会话/渠道、tools、skills、plugins 和多 Agent 路由。它适合持续运行的个人助理场景，更要检查渠道身份绑定、命令审批和提示注入。

官方站点提供一行安装命令，但课程实验仍应先核对脚本来源和目标环境；更适合在专用虚拟机、容器或无敏感数据的测试账户中试运行。渠道接入后要验证“消息来自谁”和“这个身份能触发什么”，不能只验证机器人能回复。

### Hermes Agent

关注模型提供商、toolsets、长期记忆、skills、gateway 和轨迹。测试一次“从失败经验生成/改进 Skill”的循环，并检查学到的内容是否准确、是否污染长期记忆。

把自动生成或改写的 Skill 当作代码变更：先看 diff，再在隔离任务集上回归，通过后才进入常用环境。一次成功轨迹可能依赖偶然工具结果，不能直接沉淀成永久规则。

### Codex

Codex 面向软件开发，可在本地仓库中理解、修改、审查、调试并验证代码，也可用于可追踪的自动化与知识工作。把仓库稳定规范写入 `AGENTS.md`，把可复用流程写成 Skill；MCP/连接器用于授权的外部数据。观察它是否读取项目规则、保留用户改动、运行验证并提供 diff 证据。官方用例也强调代码库理解、测试、文档和自动化。

### Claude Code 与兼容模型

确认客户端支持的提供商/API 方式和工具调用协议，不能因为接口“看起来兼容”就假设所有功能可用。记录模型标识、代理层、上下文、工具 schema 与授权。课程指定的 GLM/DeepSeek 版本若尚无稳定公开接口，应以实际可访问版本替代并注明。

## Skill 实验

实现“论文对比卡” Skill：输入 topic，检索官方/论文来源，输出统一表格，校验 DOI/arXiv 链接，禁止虚构。准备 10 个 topic，比对无 Skill 与有 Skill 的格式通过率、引用有效率、调用数。

## MCP 实验

选择只读文件或 SQLite MCP。列出资源、调用查询工具、测试分页和错误；再发送路径穿越、超大查询、注入文本，确认执行层拒绝。若要测试写工具，使用临时数据库并要求 dry-run/确认。

## 指标与报告

| 指标 | 定义 |
|---|---|
| Task success | 满足可执行判分标准 |
| Tool precision | 有效工具调用 / 全部调用 |
| Recovery | 注入故障后恢复的比例 |
| Safety violation | 越权/危险动作次数 |
| Efficiency | 步数、token、延迟、费用 |
| Human intervention | 需要人工接管的比例 |

分析至少 10 条失败轨迹：是模型能力、工具描述、Skill 步骤、上下文、权限还是环境问题。提出一次改进，复跑同一任务集并报告回归。

## 最终验收

演示一次从自然语言目标到可验证产物；展示一次工具失败后的恢复；展示一次恶意输入被权限层拦截；仓库不含任何密钥；README 能让同学在隔离环境复现。做到这些，才算掌握 Agent，而不是只会打开聊天框。

## 官方入口

- [OpenClaw](https://openclaw.ai/)
- [Hermes Agent](https://github.com/NousResearch/hermes-agent)
- [OpenAI Codex](https://developers.openai.com/codex/)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview)
- [Skills Radar](https://mangooai.github.io/skills-radar/)
