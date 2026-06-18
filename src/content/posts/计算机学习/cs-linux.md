---
title: Linux 基础指令学习指南
published: 2026-06-18
description: "从零掌握 Linux 常用命令：文件操作、权限管理、文本处理、进程管理、系统信息与网络，附实操示例与记忆技巧"
image: ""
tags: [Linux, 命令行, 开发工具, 计算机基础]
category: 计算机学习
draft: false
lang: zh
comment: true
---

## 为什么学 Linux 命令行？

Linux 是服务器端的绝对主流——绝大多数后端服务、云平台、嵌入式设备都运行在 Linux 上。而在 Linux 上，命令行是最高效的操作方式。

- **服务器管理**：SSH 上去就是命令行，没有图形界面
- **开发效率**：批量重命名、日志搜索、管道组合——鼠标点不出来的操作
- **面试必备**：`grep`/`awk`/`find`/`ps` 是后端岗位的高频考点
- **CI/CD**：Docker、GitHub Actions 里的脚本本质就是 shell 命令

> 本文所有命令在 Ubuntu/Debian 和 CentOS 下通用，在 macOS 终端中大部分也适用。

---

## 一、文件与目录操作

### 1.1 基础浏览

```bash
pwd                     # 显示当前所在目录的完整路径
ls                      # 列出当前目录下的文件和文件夹
ls -l                   # 详细列表（权限、大小、修改时间）
ls -la                  # 包括隐藏文件（以 . 开头的文件）
ls -lh                  # 人类可读的大小格式（如 1K, 234M）
cd /path/to/dir         # 切换目录
cd ..                   # 返回上一级目录
cd ~                    # 回到当前用户的家目录
cd -                    # 回到上一次所在的目录
```

### 1.2 创建与删除

```bash
touch file.txt          # 创建空文件（或更新已有文件的时间戳）
mkdir mydir             # 创建目录
mkdir -p a/b/c          # 递归创建多级目录（父目录不存在时自动创建）
rm file.txt             # 删除文件
rm -r mydir             # 递归删除目录及其内容
rm -rf mydir            # 强制递归删除（不提示确认！）
rmdir emptydir          # 仅删除空目录
```

:::warning[慎用 `rm -rf`]
`rm -rf` 没有回收站概念！删除后不可恢复。尤其要小心 `rm -rf /`（删根目录）和 `rm -rf *`（删当前目录全部）。建议删重要文件前先用 `ls` 确认路径。
:::

### 1.3 复制与移动

```bash
cp source.txt dest.txt          # 复制文件
cp -r sourcedir/ destdir/       # 递归复制目录
mv oldname.txt newname.txt      # 移动/重命名文件
mv file.txt /target/path/       # 移动文件到指定目录
```

`cp` 和 `mv` 都支持用 `-i` 参数在覆盖前询问确认。

### 1.4 查看文件内容

```bash
cat file.txt            # 一次性输出全部内容（适合小文件）
cat -n file.txt         # 带行号输出
less file.txt           # 分页浏览（按空格翻页，q 退出，/搜索）
head -n 20 file.txt     # 查看前 20 行（默认 10 行）
tail -n 20 file.txt     # 查看末尾 20 行
tail -f log.txt         # 实时追踪文件末尾新增内容（看日志必备）
```

### 1.5 查找文件

```bash
# find：按文件名/类型/时间查找
find . -name "*.cpp"            # 在当前目录及子目录中找所有 .cpp 文件
find . -type d -name "build"    # 找名为 build 的目录
find . -mtime -7                # 最近 7 天内修改过的文件
find . -size +10M               # 大于 10MB 的文件

# locate：基于索引数据库，比 find 快得多
locate stdio.h                  # 查找包含 stdio.h 的路径（需先 updatedb）
```

### 1.6 链接

```bash
ln -s /original/file.txt  link.txt    # 创建软链接（符号链接，类似快捷方式）
ln /original/file.txt     hardlink    # 创建硬链接（同一文件的不同入口）
```

| 区别 | 软链接 | 硬链接 |
|------|--------|--------|
| 跨文件系统 | ✅ | ❌ |
| 指向目录 | ✅ | ❌ |
| 源删除后 | 链接失效 | 数据仍在 |

---

## 二、权限管理

### 2.1 理解权限

```bash
$ ls -l
-rwxr-xr-x  1 user group  4096 Jun 18 10:00 script.sh
```

权限字符串 `-rwxr-xr-x` 分为四段：

```
  -    rwx    r-x    r-x
  │     │      │      │
  │     │      │      └── 其他用户权限 (r=读, x=执行)
  │     │      └── 所属组权限
  │     └── 文件所有者权限 (r=读, w=写, x=执行)
  └── 文件类型 (-=普通文件, d=目录, l=软链接)
```

### 2.2 修改权限

```bash
# 数字法（推荐，精确且快速）
chmod 755 script.sh     # rwxr-xr-x（所有者全权限，其他人读+执行）
chmod 644 file.txt      # rw-r--r--（所有者读写，其他人只读）
chmod 777 file.txt      # rwxrwxrwx（所有人全权限——非常不安全！）

# 符号法
chmod u+x script.sh     # 给所有者(u)加执行权限(+x)
chmod g-w file.txt      # 去掉所属组(g)的写权限(-w)
chmod o=r file.txt      # 设置其他人(o)仅读权限
chmod a+r file.txt      # 所有人(a)加读权限
```

**常用数字对应**：

| 数字 | 权限 | 含义 |
|------|------|------|
| 7 | rwx | 读+写+执行 |
| 6 | rw- | 读+写 |
| 5 | r-x | 读+执行 |
| 4 | r-- | 只读 |
| 0 | --- | 无权限 |

### 2.3 修改所有者

```bash
chown user:group file.txt       # 同时修改所有者和所属组
chown -R user:group dir/        # 递归修改目录下所有文件
sudo chown root:root file.txt   # 需要管理员权限
```

---

## 三、文本处理（命令行最强大的部分）

### 3.1 grep：文本搜索

```bash
grep "error" log.txt                # 搜索包含 error 的行
grep -i "error" log.txt             # 忽略大小写
grep -n "error" log.txt             # 显示行号
grep -r "TODO" src/                 # 递归搜索目录下所有文件
grep -v "debug" log.txt             # 排除匹配的行（反选）
grep -c "error" log.txt             # 统计匹配行数
grep -A 3 "error" log.txt           # 显示匹配行及其后 3 行
grep -B 2 "error" log.txt           # 显示匹配行及其前 2 行
grep -E "error|warning" log.txt     # 扩展正则（匹配 error 或 warning）
```

### 3.2 管道与重定向

管道是 Linux 命令行的灵魂——将一个命令的输出作为另一个命令的输入。

```bash
# |  管道：前一个命令的输出 → 后一个命令的输入
ls -l | grep ".txt"                 # 列出文件 → 筛选 .txt
cat log.txt | grep "ERROR" | wc -l # 查看日志 → 筛选 ERROR → 计数

# >  重定向输出（覆盖）
echo "hello" > file.txt             # 将输出写入文件（覆盖已有内容）

# >> 重定向输出（追加）
echo "world" >> file.txt            # 将输出追加到文件末尾

# <  重定向输入
sort < unsorted.txt                 # 从文件读取输入

# 2> 重定向错误输出
gcc program.c 2> errors.txt        # 编译错误信息写入文件
```

### 3.3 组合实战：一行命令完成日志分析

```bash
# 统计访问量最高的 10 个 IP
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# 管线分解:
# cat → 读日志
# awk '{print $1}' → 提取第一列（IP 地址）
# sort → 排序（uniq 要求输入有序）
# uniq -c → 去重并统计出现次数
# sort -rn → 按数字降序排列
# head -10 → 取前 10 名
```

### 3.4 sed：流编辑器

```bash
sed 's/old/new/' file.txt          # 替换每行第一个 old 为 new
sed 's/old/new/g' file.txt         # 替换每行所有 old 为 new（g=global）
sed '3,5d' file.txt                # 删除第 3 到第 5 行
sed -i 's/old/new/g' file.txt      # 就地修改文件（-i = in-place）
```

### 3.5 awk：列数据处理

```bash
awk '{print $1, $3}' data.txt          # 打印第 1 和第 3 列（默认空格分隔）
awk -F: '{print $1}' /etc/passwd       # 用 : 作为分隔符
awk '$3 > 100 {print $1, $3}' data.txt # 第 3 列大于 100 的行
awk '{sum += $2} END {print sum}' data.txt  # 第 2 列求和
```

| `$0` | `$1` | `$2` | ... | `$NF` |
|------|------|------|-----|-------|
| 整行 | 第1列 | 第2列 | ... | 最后一列 |

### 3.6 其他文本工具

```bash
sort file.txt                       # 按行排序
sort -n file.txt                    # 按数字排序
sort -r file.txt                    # 降序
uniq file.txt                       # 去重（相邻重复行合并）
wc -l file.txt                      # 统计行数（-w 单词数，-c 字节数）
diff file1.txt file2.txt            # 比较两个文件的差异
tr 'a-z' 'A-Z' < input.txt          # 小写转大写
cut -d',' -f2 data.csv              # 提取 CSV 第 2 列
```

---

## 四、进程管理

```bash
ps aux                              # 列出所有进程的详细信息
ps aux | grep nginx                 # 查找 nginx 进程
top                                 # 实时进程监控（按 q 退出，按 P 按 CPU 排序，按 M 按内存排序）
htop                                # top 的增强版（更友好的界面，需额外安装）
kill 1234                           # 终止 PID 为 1234 的进程（发送 SIGTERM）
kill -9 1234                        # 强制终止（发送 SIGKILL，进程无法忽略）
pkill -f "python server.py"         # 按进程名终止
jobs                                # 查看当前终端中的后台任务
fg %1                               # 将后台任务 1 调到前台
bg %1                               # 将暂停的任务放到后台继续执行
Ctrl+Z                              # 暂停当前前台任务
command &                           # 让命令在后台运行
nohup long_running_command &        # 后台运行，关闭终端后继续
```

---

## 五、系统信息与资源

```bash
df -h                               # 磁盘空间使用情况（-h = 人类可读）
du -sh *                            # 当前目录下每个文件/目录的大小
du -sh .                            # 当前目录总大小
free -h                             # 内存使用情况
uptime                              # 系统运行时间 + 负载
uname -a                            # 系统内核版本等信息
lsb_release -a                      # 发行版版本信息（Ubuntu/Debian）
cat /etc/os-release                 # 通用发行版信息
lscpu                               # CPU 信息
lsblk                               # 块设备（磁盘分区）信息
```

---

## 六、网络相关

```bash
ping baidu.com                      # 测试网络连通性（Ctrl+C 停止）
curl https://api.example.com        # 发送 HTTP 请求，输出响应体
curl -I https://example.com         # 只获取响应头
curl -X POST -d '{"k":"v"}' url     # POST 请求
wget https://example.com/file.zip   # 下载文件
wget -c url                         # 断点续传
ss -tlnp                            # 查看所有监听的 TCP 端口
netstat -tlnp                       # 同上（旧命令，部分系统可能没有 ss）
ip addr                             # 查看 IP 地址（替代旧命令 ifconfig）
scp file.txt user@host:/path/       # 远程复制文件（基于 SSH）
rsync -avz src/ user@host:dst/      # 同步目录（增量，比 scp 更高效）
```

---

## 七、用户与权限

```bash
whoami                              # 当前登录用户名
id                                  # 查看当前用户的 UID、GID 和所属组
sudo command                        # 以 root 身份执行一条命令
sudo su -                           # 切换到 root 用户
useradd -m newuser                  # 创建新用户并创建家目录
passwd newuser                      # 修改用户密码
usermod -aG docker newuser          # 将用户加入 docker 组
```

---

## 八、压缩与打包

```bash
tar -czf archive.tar.gz dir/        # 打包并 gzip 压缩
tar -xzf archive.tar.gz             # 解压 .tar.gz
tar -cjf archive.tar.bz2 dir/       # 打包并 bzip2 压缩（更高压缩比）
tar -xjf archive.tar.bz2            # 解压 .tar.bz2
zip -r archive.zip dir/             # 打包为 zip 格式
unzip archive.zip                   # 解压 zip
gzip file.txt                       # 压缩单个文件 → file.txt.gz
gunzip file.txt.gz                  # 解压 .gz
```

| 常见后缀 | 解压命令 |
|----------|---------|
| `.tar.gz` / `.tgz` | `tar -xzf` |
| `.tar.bz2` | `tar -xjf` |
| `.tar.xz` | `tar -xJf` |
| `.zip` | `unzip` |
| `.gz` | `gunzip` |
| `.7z` | `7z x`（需安装 p7zip） |

---

## 九、包管理

```bash
# Debian / Ubuntu (apt)
sudo apt update                     # 更新软件包索引
sudo apt upgrade                    # 升级所有可升级的软件包
sudo apt install nginx              # 安装
sudo apt remove nginx               # 卸载（保留配置文件）
sudo apt purge nginx                # 彻底卸载（含配置文件）
apt search keyword                  # 搜索软件包

# Red Hat / CentOS / Fedora (dnf/yum)
sudo dnf install nginx              # 安装
sudo dnf remove nginx               # 卸载
sudo dnf update                     # 升级所有包

# macOS (Homebrew)
brew install wget                   # 安装
brew uninstall wget                 # 卸载
brew update                         # 更新 Homebrew 自身
```

---

## 十、常用快捷键

| 快捷键 | 作用 |
|--------|------|
| `Ctrl+C` | 终止当前正在运行的前台命令 |
| `Ctrl+D` | 发送 EOF（退出终端、退出 python 交互等） |
| `Ctrl+Z` | 暂停当前命令，放到后台 |
| `Ctrl+R` | 搜索历史命令 |
| `Ctrl+A` | 光标跳到行首 |
| `Ctrl+E` | 光标跳到行尾 |
| `Ctrl+U` | 删除光标之前的内容 |
| `Ctrl+K` | 删除光标之后的内容 |
| `Ctrl+L` | 清屏（等同 `clear` 命令） |
| `!!` | 重复上一条命令 |
| `!$` | 上一条命令的最后一个参数 |
| `Tab` | 自动补全文件名/命令名 |

---

## 十一、常用组合模板

```bash
# 实时监控日志
tail -f /var/log/nginx/access.log | grep "ERROR"

# 杀死占用某个端口的进程
sudo lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9

# 查找大文件（找出磁盘空间杀手）
du -sh /* 2>/dev/null | sort -rh | head -10

# 批量重命名文件（所有 .jpg 改为 .webp）
for f in *.jpg; do mv "$f" "${f%.jpg}.webp"; done

# 统计代码行数
find . -name "*.cpp" -o -name "*.h" | xargs wc -l

# 查看历史命令中最常用的 10 条
history | awk '{print $2}' | sort | uniq -c | sort -rn | head -10
```

---

## 总结

1. **文件操作是根基**：`ls`/`cd`/`cp`/`mv`/`rm` 是日常使用频率最高的命令
2. **权限管理是安全底线**：`chmod` 的数字 755/644 要刻在脑子里，`chmod 777` 永远不要用于生产环境
3. **管道 + grep + awk** 的组合是 Linux 命令行的杀手锏——学会这三个，日志分析、数据处理效率翻倍
4. **快捷键**（`Ctrl+R` 搜索历史、`Ctrl+A/E` 跳行首尾）是提速的关键
5. 遇到不认识的命令，用 `man command` 或 `command --help` 查看文档
