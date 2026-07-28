---
title: "PyTorch 工程入门：DataLoader、模型、优化器、GPU 与 Hugging Face"
published: 2026-07-27
description: "从 Dataset/DataLoader 到混合精度、显存优化和 Transformers 标准工作流，搭建可复现训练工程。"
tags: [AI学习路线, PyTorch, Hugging Face, GPU]
category: AI·深度学习
draft: false
lang: zh
permalink: pytorch-huggingface-gpu
---

## PyTorch 的四个层次

`Tensor` 存数据并记录梯度；`nn.Module` 组织参数与前向；`Dataset/DataLoader` 提供批数据；优化器读取参数梯度并更新。训练工程还需要配置、日志、checkpoint 和评测。

```python
class Classifier(torch.nn.Module):
    def __init__(self, d_in, n_class):
        super().__init__()
        self.net = torch.nn.Sequential(
            torch.nn.Linear(d_in, 256),
            torch.nn.GELU(),
            torch.nn.Dropout(0.1),
            torch.nn.Linear(256, n_class),
        )
    def forward(self, x):
        return self.net(x)
```

`model.train()` 开启 Dropout 并更新 BatchNorm 统计；`model.eval()` 切到推理行为，但不会关闭梯度。评测还要使用 `torch.inference_mode()`。

## Dataset 与 DataLoader

Dataset 的 `__getitem__` 返回单样本；DataLoader 负责打乱、分批、多进程读取和 `collate_fn`。变长序列需 padding，并同时返回 mask。训练集可 shuffle，验证/测试集不可因 shuffle 改变样本—结果对应。

```python
loader = DataLoader(
    dataset, batch_size=32, shuffle=True,
    num_workers=4, pin_memory=True,
    persistent_workers=True
)
```

Windows 多进程入口要放进 `if __name__ == "__main__":`。数据增强只用于训练集；用全数据计算标准化统计会造成泄漏。

## 正确使用 GPU

模型和参与运算的张量必须在同一设备：

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
for batch in loader:
    x = batch["x"].to(device, non_blocking=True)
```

GPU 利用率低可能是数据加载慢、batch 太小或 CPU 预处理重；显存不足可减小 batch、梯度累积、混合精度、梯度检查点、缩短序列或用 LoRA。

混合精度在适合的算子上用 FP16/BF16：

```python
with torch.autocast("cuda", dtype=torch.bfloat16):
    loss = model(**batch).loss
loss.backward()
```

BF16 动态范围更大，在支持 BF16 的 GPU 上通常比 FP16 更稳；不支持时不能强行使用。FP16 训练通常还需要 `GradScaler` 防止小梯度下溢，BF16 通常不需要。不要把标签、索引等整数张量转成浮点，也不要假定混合精度下每个算子都会降精度。

## Hugging Face Transformers

典型流程是 tokenizer → model → batch → generate/forward。聊天模型必须使用它训练时的 chat template，否则角色标记不匹配会显著影响效果。

```python
from transformers import AutoTokenizer, AutoModelForCausalLM

name = "Qwen/Qwen2.5-1.5B-Instruct"
tok = AutoTokenizer.from_pretrained(name)
model = AutoModelForCausalLM.from_pretrained(
    name, torch_dtype="auto", device_map="auto"
)
messages = [{"role": "user", "content": "解释梯度下降"}]
text = tok.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
inputs = tok(text, return_tensors="pt").to(model.device)
out = model.generate(**inputs, max_new_tokens=256, do_sample=False)
print(tok.decode(out[0][inputs.input_ids.shape[1]:], skip_special_tokens=True))
```

这里的 `device_map="auto"` 是推理示例；训练时应由 Trainer、Accelerate、FSDP/DeepSpeed 或明确的单设备逻辑管理模型放置。`max_new_tokens` 控制输出长度；`temperature/top_p` 只在采样时有意义；做可比评测时固定生成配置。

## Checkpoint 与可复现

训练 checkpoint 至少保存模型、优化器、学习率调度器、step、随机状态和配置。只保存权重无法无缝恢复训练。日志同时记录 loss、学习率、梯度范数、吞吐、显存和验证指标。

## 本章检查点

构建一个可从命令行传配置的训练项目；支持训练/验证、断点恢复、混合精度；用 100 个样本过拟合以验证管线；再用 Hugging Face 完成一次批量生成并只解码新增 token。

## 工程自检清单

- 开始长训练前，能否让 32–100 个样本明显过拟合？
- 保存和恢复后，step、学习率和优化器动量是否连续？
- 验证时是否同时使用 `model.eval()` 与 `inference_mode()`？
- token/s 与显存峰值是否记录，数据等待是否成为瓶颈？
- 评测是否保存样本 ID、原始输出和生成配置？

## 官方资料

- [PyTorch DataLoader](https://docs.pytorch.org/docs/stable/data.html)；
- [PyTorch Automatic Mixed Precision](https://docs.pytorch.org/docs/stable/amp.html)；
- [Hugging Face Transformers 文档](https://huggingface.co/docs/transformers/index)；
- [Hugging Face Chat Templates](https://huggingface.co/docs/transformers/chat_templating)。
