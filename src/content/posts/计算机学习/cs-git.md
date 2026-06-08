---
title: Git 版本控制从入门到协作
published: 2026-06-08
description: "从零掌握 Git：涵盖基本操作、分支管理、远程协作、合并冲突处理，以及 Git 内部原理和实用技巧"
image: ""
tags: [Git, 版本控制, 开发工具, 计算机基础]
category: 计算机学习
draft: false
lang: zh
comment: true
---

## 为什么学 Git？

Git 是现代软件开发的协作基础设施。无论你是一个人写代码还是团队协作：

- **版本回溯**：回到任何历史版本
- **并行开发**：多人在不同分支上独立工作
- **代码审查**：Pull Request / Merge Request 是团队协作标准
- **CI/CD**：自动构建和部署依赖 Git 的触发机制

---

## Git 的四个工作区

```
工作目录          暂存区           本地仓库          远程仓库
(Working)  add→  (Staging)  commit→  (Local)  push→  (Remote)
                ← restore   ← checkout       ← fetch/pull
```

| 区域     | 说明                    | 对应命令                |
| -------- | ----------------------- | ----------------------- |
| 工作目录 | 磁盘上的实际文件        | `git status`            |
| 暂存区   | 准备提交的更改          | `git add`, `git reset`  |
| 本地仓库 | 提交历史的存储          | `git commit`, `git log` |
| 远程仓库 | 托管在 GitHub/GitLab 等 | `git push`, `git pull`  |

---

## 基础操作

### 首次配置

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
```

### 日常工作流

```bash
# 克隆仓库
git clone https://github.com/user/repo.git

# 查看状态
git status

# 添加变更到暂存区
git add file.cpp              # 添加单个文件
git add .                     # 添加所有变更

# 提交
git commit -m "feat: add binary search implementation"

# 推送到远程
git push origin main

# 拉取最新代码
git pull origin main
```

### 查看历史

```bash
git log                        # 完整历史
git log --oneline --graph      # 简洁图形式
git log -p file.cpp            # 查看特定文件的变更历史
git show abc123                # 查看某次提交的详细diff
git blame file.cpp             # 查看每行代码是谁改的
```

---

## 分支管理

分支是 Git 的灵魂，允许你**在不影响主线的情况下进行特性开发**。

### 分支模型（Git Flow 简化版）

```
main    ──●────●────────────●──────────●──  稳定发布
           \              /          /
feature-1   ●──●──●─────●          /      特性分支
                                 /
release                     ●──●          发布分支
```

### 分支命令

```bash
# 创建并切换到新分支
git checkout -b feature/login

# 查看所有分支
git branch -a

# 切换分支
git checkout main

# 将 feature/login 合并到 main
git checkout main
git merge feature/login

# 删除已合并的分支
git branch -d feature/login

# 强制删除未合并的分支
git branch -D feature/login
```

### Merge vs Rebase

```
Merge:                          Rebase:
  main ●──●──M                        main ●──●──●'──●'
         \ /    → 保留分支历史               \
  feature ●──●                                  ●──● → 线性历史
```

| 策略   | 优点               | 缺点                   |
| ------ | ------------------ | ---------------------- |
| Merge  | 保留完整历史、安全 | 分支图复杂             |
| Rebase | 线性历史、干净     | 改写历史，协作分支慎用 |

:::warning[Rebase 黄金法则]
**永远不要 rebase 已经 push 到远程的公共分支！** 它会改写历史，导致其他人的本地仓库与远程不一致。
:::

---

## 合并冲突

当两个分支修改了同一文件的同一区域时，合并会产生冲突。

### 冲突示例

```bash
$ git merge feature
Auto-merging main.cpp
CONFLICT (content): Merge conflict in main.cpp
Automatic merge failed; fix conflicts and then commit the result.
```

### 解决冲突

```cpp
// main.cpp 中的冲突标记：
int main() {
<<<<<<< HEAD
    cout << "Hello from main" << endl;     // 当前分支的版本
=======
    cout << "Hello from feature" << endl;  // 合并进来的版本
>>>>>>> feature
}
```

**操作步骤**：

```bash
# 1. 手动编辑冲突文件，保留正确的内容，删除冲突标记

# 2. 标记为已解决
git add main.cpp

# 3. 完成合并
git commit -m "merge: resolve conflict in main.cpp"

# 若想放弃合并
git merge --abort
```

### 减少冲突的技巧

- **小而频繁的提交**：冲突范围小，容易解决
- **及时 pull**：每天从 main 拉取最新代码
- **拆分大文件**：减小多人修改同一文件的概率
- **沟通**：改动大文件前跟同事说一声

---

## 常用进阶操作

### 撤销操作

```bash
# 撤销工作区修改（未 add）
git restore file.cpp
git checkout -- file.cpp    # 旧写法

# 撤销暂存区（已 add 未 commit）
git reset HEAD file.cpp
git restore --staged file.cpp  # 新写法

# 撤销最近的 commit（保留修改）
git reset --soft HEAD~1

# 撤销最近的 commit（丢弃修改）
git reset --hard HEAD~1

# 创建新 commit 来撤销旧 commit（安全，适合已 push 的）
git revert abc123
```

### stash：临时保存

```bash
# 保存当前修改到 stash
git stash
git stash save "WIP: working on login"

# 查看 stash 列表
git stash list

# 恢复最近的 stash
git stash pop

# 恢复但不删除 stash
git stash apply

# 删除 stash
git stash drop stash@{0}
```

### Cherry-pick：挑选提交

```bash
# 将特定 commit 应用到当前分支
git cherry-pick abc123

# 挑选一系列 commit
git cherry-pick abc123..def456
```

### 交互式 Rebase

```bash
# 修改最近的 3 个 commit
git rebase -i HEAD~3

# 编辑器中将显示：
# pick abc123 first commit
# pick def456 second commit
# pick 789abc third commit
#
# 将 pick 改为：
#   squash(s) → 合并到前一个 commit
#   reword(r) → 修改 commit message
#   edit(e)   → 停下来修改内容
#   drop(d)   → 删除这个 commit
```

---

## Git 内部原理速览

### 一切皆对象

Git 本质上是一个**内容寻址的文件系统**。所有数据以对象的形式存储在 `.git/objects/` 中：

| 对象类型   | 内容                                     |
| ---------- | ---------------------------------------- |
| **blob**   | 文件内容（不含文件名）                   |
| **tree**   | 目录结构，记录文件名→blob 映射           |
| **commit** | 一次提交：指向 tree + 父 commit + 元数据 |
| **tag**    | 标签：指向某个 commit                    |

```
commit abc123
  ├─ tree: def456
  │    ├─ blob: 789abc  (main.cpp)
  │    └─ blob: 111aaa  (utils.cpp)
  └─ parent: xyz789
```

### HEAD 与引用

```bash
# HEAD 指向当前分支的最新 commit
cat .git/HEAD
# ref: refs/heads/main

# 分支实际上是一个指向 commit 的指针
cat .git/refs/heads/main
# abc123def456...

# 切换到特定 commit（detached HEAD 状态）
git checkout abc123
```

---

## Commit Message 规范

遵循 **Conventional Commits** 规范，让你的提交历史一目了然：

```
<type>(<scope>): <subject>

<body>
```

常用 type：

| Type       | 说明                         |
| ---------- | ---------------------------- |
| `feat`     | 新功能                       |
| `fix`      | 修复 bug                     |
| `docs`     | 文档变更                     |
| `style`    | 格式变更（不影响代码逻辑）   |
| `refactor` | 重构（不增加功能也不修 bug） |
| `perf`     | 性能优化                     |
| `test`     | 添加测试                     |
| `chore`    | 构建/工具变更                |

```
# 好的 commit message：
feat(auth): add JWT token refresh mechanism
fix(api): handle null pointer in user service
refactor(db): extract connection pool to singleton
```

---

## 团队协作规范

### Code Review 流程

```
1. 从 main 创建 feature 分支
2. 开发 + 自测 + commit
3. 推送并创建 Pull Request
4. Reviewers 审查代码
5. 根据反馈修改
6. 通过后 squash merge 到 main
```

### .gitignore 模板

```gitignore
# 依赖
node_modules/
vendor/

# 构建产物
dist/
build/
*.o
*.exe

# 环境文件
.env
.env.local

# IDE
.vscode/
.idea/
*.swp

# 系统文件
.DS_Store
Thumbs.db
```

---

## 推荐资源

- **交互学习**：[Learn Git Branching](https://learngitbranching.js.org/) — 可视化 Git 操作
- **官方文档**：[Pro Git](https://git-scm.com/book/) — 免费在线全书
- **速查**：Git Cheat Sheet
- **实践**：参与 GitHub 上的开源项目

---

## 总结

1. Git 分为四个工作区：工作目录 → 暂存区 → 本地仓库 → 远程仓库
2. 分支 = 指针，合并有 merge 和 rebase 两种策略
3. `git reflog` 是你的后悔药——几乎所有「误操作」都可以恢复
4. 冲突不可怕，理解冲突标记的结构后手动解决即可
5. 好的 commit message 和分支规范是团队协作的基础
