---
title: 数据库核心原理与实战
published: 2026-09-08
description: "深入理解关系型数据库核心原理：索引、事务、SQL 优化、范式设计，以及 Redis 缓存实战"
image: ""
tags: [数据库, 计算机基础, SQL, Redis, 后端开发]
category: 计算机学习
draft: false
lang: zh
comment: true
---

## 为什么学数据库？

数据库是几乎所有应用的核心——数据在哪里，系统的瓶颈就在哪里。

- **面试高频**：索引原理、事务隔离级别、SQL 优化
- **性能瓶颈**：慢查询排查、索引设计、读写分离
- **数据安全**：事务保证、备份恢复、主从复制

本文以 MySQL（InnoDB）为主线，Redis 为辅。

---

## 数据库基础

### 关系型数据库核心概念

```
数据库 (Database)
  └── 表 (Table)
       ├── 行 (Row / Record)
       ├── 列 (Column / Field)
       ├── 主键 (Primary Key)
       ├── 外键 (Foreign Key)
       └── 索引 (Index)
```

### SQL 基础速查

```sql
-- DDL：定义结构
CREATE TABLE users (
    id       INT PRIMARY KEY AUTO_INCREMENT,
    name     VARCHAR(50)  NOT NULL,
    email    VARCHAR(100) UNIQUE,
    age      INT DEFAULT 0,
    created  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DML：操作数据
INSERT INTO users (name, email, age) VALUES ('Alice', 'alice@ex.com', 25);
UPDATE users SET age = 26 WHERE id = 1;
DELETE FROM users WHERE id = 1;

-- DQL：查询数据
SELECT name, age FROM users
WHERE age > 20
ORDER BY created DESC
LIMIT 10;
```

### JOIN 连接

```sql
-- INNER JOIN：只返回匹配的行
SELECT u.name, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN：保留左表所有行
SELECT u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;

-- 其他：RIGHT JOIN, FULL OUTER JOIN(MySQL 不支持，可用 UNION 模拟)
```

### 聚合与分组

```sql
-- 每个用户的订单总额
SELECT u.name,
       COUNT(o.id)   AS order_cnt,
       SUM(o.amount) AS total_spent,
       AVG(o.amount) AS avg_order,
       MAX(o.amount) AS max_order
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
HAVING total_spent > 100             -- HAVING 过滤分组后的结果
ORDER BY total_spent DESC;
```

:::tip[WHERE vs HAVING]

- `WHERE`：在分组**前**过滤行，不能使用聚合函数
- `HAVING`：在分组**后**过滤组，可以使用聚合函数
  :::

---

## 索引

索引是数据库性能的核心。好的索引让查询飞起来，差的索引让数据库瘫痪。

### B+Tree 索引

InnoDB 的默认索引结构。B+Tree 是一种平衡多路搜索树：

```
                     [30 | 60]              ← 内部节点（只存 key）
                    /    |    \
           [10|20]    [40|50]    [70|80]   ← 内部节点
           /  |  \    /  |  \    /  |  \
          D1  D2  D3  D4  D5  D6  D7  D8   ← 叶子节点（存 key + 数据指针）
           ↕   ↕   ↕                         叶子节点之间用双向链表连接
```

B+Tree 的特性：

- **所有数据存储在叶子节点**
- **内部节点只存储索引 key**，扇出更大，树更矮
- **叶子节点通过双向链表连接**，支持高效范围查询
- 树的高度通常只有 3-4 层（百万级数据）

### 聚集索引 vs 辅助索引

```
聚集索引（Clustered Index）           辅助索引（Secondary Index）
  = 主键索引                             = 非主键索引
  B+Tree 叶子存完整行数据                 B+Tree 叶子存主键值
                                        → 查询需要"回表"
```

```sql
-- 聚集索引：InnoDB 自动以主键建立
-- 辅助索引：手动创建
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_name_age ON users(name, age);  -- 联合索引
```

### 联合索引与最左前缀

这是索引中最容易出错的地方！

```sql
-- 联合索引 (a, b, c)
INDEX idx_abc (a, b, c)
```

这个索引相当于创建了三个索引：`(a)`, `(a, b)`, `(a, b, c)`。

```
能使用索引的查询：
  WHERE a = 1                    ✅ 用到了 (a)
  WHERE a = 1 AND b = 2          ✅ 用到了 (a, b)
  WHERE a = 1 AND b = 2 AND c = 3 ✅ 用到了 (a, b, c)
  WHERE a = 1 AND c = 3          ✅ 用到了 (a)，c 不生效
  WHERE a = 1 AND b > 2 AND c = 3 ✅ 用到了 (a, b)，c 不生效（范围查询断了）

不能使用索引的查询：
  WHERE b = 2                    ❌ 跳过了 a
  WHERE c = 3                    ❌ 跳过了 a, b
  WHERE b = 2 AND c = 3          ❌ 跳过了 a
```

:::warning[最左前缀法则]
联合索引从左到右匹配，**跳过左边的列，右边的列就无法使用索引**。中间使用了范围查询，后面的列也无法使用索引。
:::

### 索引优化建议

| 建议                       | 原因                                         |
| -------------------------- | -------------------------------------------- | ----- | ------------ |
| 选择性高的列建索引         | 选择性 $= \frac{distinct}{                   | total | }$，越高越好 |
| 避免在索引列上做函数运算   | `WHERE UPPER(name) = 'ALICE'` 不走索引       |
| 避免前导通配符             | `WHERE name LIKE '%alice'` 不走索引          |
| 覆盖索引避免回表           | `SELECT (idx中的列) FROM ...` 直接从索引获取 |
| 联合索引区分度高的列放前面 | 让索引更高效地缩小范围                       |

### 慢查询分析

```sql
-- 开启慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;  -- 超过 1 秒记录

-- 使用 EXPLAIN 分析执行计划
EXPLAIN SELECT * FROM users WHERE email = 'alice@ex.com';

-- 关键字段：
-- type：访问类型（ALL < index < range < ref < eq_ref < const，越靠右越好）
-- key：实际使用的索引
-- rows：预估扫描行数
-- Extra：Using index(覆盖索引，好) / Using filesort(需优化) / Using temporary(需优化)
```

---

## 事务

事务是一组不可分割的操作——要么全部成功，要么全部失败。

### ACID

| 特性                   | 含义                 | 实现方式               |
| ---------------------- | -------------------- | ---------------------- |
| **A**tomicity 原子性   | 全部成功或全部失败   | undo log 回滚          |
| **C**onsistency 一致性 | 事务前后数据满足约束 | 由其他三个特性共同保证 |
| **I**solation 隔离性   | 事务之间互不干扰     | MVCC + 锁              |
| **D**urability 持久性  | 提交后数据不丢失     | redo log               |

### 隔离级别

```sql
-- 查看当前隔离级别
SELECT @@transaction_isolation;

-- 设置隔离级别
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

| 隔离级别                      | 脏读  | 不可重复读 | 幻读                 |
| ----------------------------- | ----- | ---------- | -------------------- |
| READ UNCOMMITTED              | ✅ 会 | ✅ 会      | ✅ 会                |
| READ COMMITTED                | ❌    | ✅ 会      | ✅ 会                |
| REPEATABLE READ (InnoDB 默认) | ❌    | ❌         | ❌ (MVCC + Gap Lock) |
| SERIALIZABLE                  | ❌    | ❌         | ❌                   |

### MVCC 原理

**多版本并发控制**是 InnoDB 实现高并发事务的核心：

- 每行数据有两个隐藏列：`trx_id`（最近修改的事务 ID）和 `roll_pointer`（指向 undo log）
- **ReadView** 决定了当前事务能看到哪个版本的数据
- **读不加锁，写不阻塞读**

```
行数据 → 当前版本 (trx_id=100)
  roll_pointer ↓
行数据 → 历史版本 (trx_id=90)    ← Repeatable Read 可能读这个
  roll_pointer ↓
行数据 → 更早版本 (trx_id=80)
```

---

## 范式与设计

### 三范式

| 范式 | 规则                                 | 反例                                          |
| ---- | ------------------------------------ | --------------------------------------------- |
| 1NF  | 列不可再分，原子性                   | 一列存多个电话号码                            |
| 2NF  | 非主键列完全依赖于主键（无部分依赖） | 联合主键 (学生, 课程)，「学生姓名」只依赖学生 |
| 3NF  | 非主键列不依赖于其他非主键列         | 「总价」=「单价」×「数量」，不应冗余存储      |

> **工程实践**：不必死守三范式。适当的冗余（如订单表冗余用户地址）能避免多表 JOIN、提升查询速度——这就是**反范式设计**。

---

## Redis 缓存

Redis 是内存键值数据库，常作为 MySQL 前的缓存层。

### 数据模型

```bash
# String
SET user:1:name "Alice"
GET user:1:name

# Hash
HSET user:1 name "Alice" age 25
HGETALL user:1

# List（双向链表）
LPUSH queue "task1" "task2"
RPOP queue

# Set（无序集合）
SADD tags:article1 "算法" "数据结构"
SINTER tags:article1 tags:article2  # 交集

# Sorted Set（有序集合，按 score 排序）
ZADD leaderboard 100 "Alice" 95 "Bob"
ZRANGE leaderboard 0 -1 WITHSCORES    # 排行
```

### 缓存策略

```
读：Cache-Aside 模式
  1. 先查 Redis
  2. 命中 → 直接返回
  3. 未命中 → 查 MySQL → 写入 Redis → 返回

写：Cache-Aside 模式
  1. 先更新 MySQL
  2. 再删除 Redis 缓存（不是更新！）
  // 为什么不更新？并发写可能导致 Redis 是旧值
```

### 常见问题

| 问题     | 现象                           | 解决方案                    |
| -------- | ------------------------------ | --------------------------- |
| 缓存穿透 | 查不存在的 key，每次都打到 DB  | 布隆过滤器 / 缓存空值       |
| 缓存击穿 | 热点 key 过期，大量请求打到 DB | 互斥锁 / 逻辑过期           |
| 缓存雪崩 | 大量 key 同时过期              | 过期时间加随机值 / 多级缓存 |

---

## 推荐资源

- **书籍**：《高性能 MySQL》《Redis 设计与实现》
- **在线资源**：MySQL 官方文档、Use The Index Luke（索引教程）
- **实践**：用 `EXPLAIN` 分析每个查询的索引使用情况

---

## 总结

1. B+Tree 索引是 MySQL 的基石，**最左前缀法则**必须刻在脑子里
2. `EXPLAIN` 是排查慢查询的第一工具——每个 DBA 的日常
3. InnoDB 的 MVCC 让读写不互斥，是高并发的核心保障
4. 事务隔离级别记住**默认 REPEATABLE READ**，以及幻读如何被 Gap Lock 解决
5. Redis 不是「放个缓存就行了」，缓存穿透/击穿/雪崩需要逐一应对
