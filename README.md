# Sakuraの博客

个人博客，使用 [astro-koharu](https://github.com/cosZone/astro-koharu) 的完整主题框架。

- 线上地址：<https://sakuralyc-blog.vercel.app>
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
pnpm test:built-blog
pnpm preview
```

## 更换顶部封面

只需要替换 `public/img/site_header_1920.webp`，保持文件名不变即可。
首页、文章页和写作室预览共用这张原图，构建时自动生成适配不同屏幕的图片，
输出到 `dist/_astro`；无需手动保存 800、1200、1600 等尺寸，也无需提交构建产物。
运行 `pnpm build` 可在本地验证，推送 GitHub 后由现有 Vercel 部署自动更新。

## 侧栏与个人数据

友链、关于、歌单、写作室和追番入口已启用，导航在 `config/site.yaml` 的 `navigation` 中维护。

- 友链：修改 `friends.data`；目前没有添加任何主题作者的友链。
- 关于：直接修改 `src/pages/about.md`。
- 歌单：`bgm.audio` 使用 Sakura 提供的网易云歌单 `17612818949`。
  `bgm.enabled: false` 仅关闭全站悬浮播放器，不影响 `/music` 页播放。
  公共音乐接口、版权或登录限制可能影响播放，页面保留网易云原站链接。
- 追番：`bangumi.userId: '1214989'`，读取该账号的公开收藏。
  这个配置会自动添加「追番」导航，不需要再写一条 `/bangumi`。
- 写作室：`editor.enabled: true`。`/editor` 支持编辑、预览、浏览器本地草稿和下载 Markdown，
  不会直接修改仓库。写完后将下载的文件放入 `src/content/blog`，检查 frontmatter 中的 `draft`：
  正式发布时改为 `false`，再提交 GitHub。清理浏览器数据前请先下载草稿。

歌单和追番都只使用公开数据，不需要在仓库里存储密码、Cookie 或访问令牌。

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
Shoka 属性扩展与旧文章列表中的 LaTeX 花括号冲突，因此关闭 `enableShokaAttrs`；
正文保持不变，构建后已核对 34 篇文章中的 2,568 处公式，KaTeX 渲染错误为零。

上游 `test:migrate` 涉及 Unix 文件权限、符号链接、tar 路径和文件排序，
在当前 Windows 环境有未通过用例；不要将本次验证理解为整个上游测试套件全部通过。
`pnpm knip` 也会报告按配置关闭的动态功能及部分测试入口，未据此移除主题模块。
写作室已启用；动态归档和第三方统计仍关闭，未部署额外的服务端编辑接口。
写作室的链接元数据服务只在本地可用，线上仍可编辑和预览正文，但不自动抓取外链卡片信息。
`pnpm test:editor` 包含独立 CMS 的 POSIX 权限与符号链接测试，当前 Windows 环境这两项未通过；
浏览器写作室的编辑、草稿保存、预览和下载另行验收。

## 致谢与许可

主题基于 [astro-koharu](https://github.com/cosZone/astro-koharu)，灵感来自
[Shoka](https://github.com/amehime/hexo-theme-shoka)。
主题代码遵循 [AGPL-3.0](LICENSE)，修改后的站点源码在本仓库公开提供。
继承资源的原 Mizuki 许可保存在 `docs/legacy-mizuki/`。
文章版权归其作者所有；迁移主题不改变原文章的权利归属。
