# Sakuraの博客

个人博客，使用 [astro-koharu](https://github.com/cosZone/astro-koharu) 的完整主题框架。

- 线上地址：<https://sakura-two-xi.vercel.app>
- 文章目录：`src/content/blog`
- 站点设置：`config/site.yaml`
- 关于页面：`src/pages/about.md`

## 本地开发

需要 Node.js 24（最低 22.20）和 pnpm 10.28.2。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm lint
pnpm test
pnpm test:blog-migration
pnpm build
pnpm preview
```

## 主题迁移

基于 astro-koharu 7.7.4，上游提交 `329ce55513a8057708c93c11c5b8c096680ad83c`。
原有 34 篇文章完整迁移，仅转换 frontmatter 以适配新主题：
`published → date`、`category → categories`、`pinned → sticky`。
原始正文未改写，分类、标签、日期与置顶信息保留。

文章的新地址为 `/post/<原相对路径>`。迁移清单 `config/migrated-posts.json`
记录旧地址、目标地址和迁移时的正文摘要；Astro 静态跳转页和 Vercel 永久重定向兼容
`/posts/<原相对路径>/`。Giscus 继续使用旧文章路径匹配已有讨论。
以后新增文章不需要加入此迁移清单。

GitHub `main` 分支自动触发现有 Vercel 部署，以及 Pages 构建工作流。
更新时请保留锁文件，并使用冻结依赖安装。

## 验证记录

迁移后已通过生产构建、Astro 类型检查、站点配置/内容渲染/索引等单元测试，
以及 34 篇文章的存在性、旧链接跳转和正文一致性检查。
浏览器检查覆盖桌面、390px 和 320px 视口、浅深色切换、搜索、公式、流程图及原题库跳转。

上游 `test:migrate` 涉及 Unix 文件权限、符号链接、tar 路径和文件排序，
在当前 Windows 环境有未通过用例；不要将本次验证理解为整个上游测试套件全部通过。
`pnpm knip` 也会报告按配置关闭的编辑器/动态功能及部分测试入口，未据此移除主题模块。
编辑器、动态归档和第三方统计默认关闭，未部署额外的服务端编辑接口。

## 致谢与许可

主题基于 [astro-koharu](https://github.com/cosZone/astro-koharu)，灵感来自
[Shoka](https://github.com/amehime/hexo-theme-shoka)。
主题代码遵循 [AGPL-3.0](LICENSE)，修改后的站点源码在本仓库公开提供。
继承资源的原 Mizuki 许可保存在 `docs/legacy-mizuki/`。
文章版权归其作者所有；迁移主题不改变原文章的权利归属。
