# Mermaid 显示 SVG 样式文本的排查记录

## 当前结论

截图中 `#mermaid-…{font-family…}`、`@keyframes` 是 Mermaid 生成的 SVG 内部样式，不是正常的 Mermaid 图表源码。
其中 `.error-icon`、`.error-text` 是成功图表也会包含的通用样式，不能据此认定发生了语法错误。

已复现并修复一个能够产生同类内容的工具栏缺陷：**图表已渲染、但没有 `data-diagram` 时，源码按钮会把 SVG 的
`textContent` 当成 Mermaid 原文。** 这证实了代码缺口，没有证实截图设备为何丢失原文或是否点击了源码按钮。
本地普通加载没有出现截图故障，暂时不能把它定性为 Firefox 内核问题。

另外，真实渲染失败的原始 UI 是英文技术异常，工具栏仍把 `data-processed="true"` 当作成功。这是独立确认的问题。

## 为什么会出现整段 CSS

Mermaid 生成的 SVG 包含 `<style>` 元素。DOM 的 `textContent` 会拼接所有子节点的文本，包括 `<style>`，
因此 `pre.textContent` 在渲染后会变成「样式代码＋图表标签」，而不再是原始图表定义。
见 [MDN 对 textContent 的说明](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) 和
[Mermaid 11.12.2 的 SVG 样式生成源码](https://github.com/mermaid-js/mermaid/blob/mermaid%4011.12.2/packages/mermaid/src/mermaidAPI.ts)。

修复前 `MermaidToolbar` 使用 `data-diagram || pre.textContent` 读取源码。一旦 `data-diagram` 缺失，就会拿到 SVG CSS。
点击源码按钮时，又通过 `code.textContent` 把这段内容展示出来。浏览器此时按要求显示普通文本，并不需要发生 SVG
渲染引擎错误。

[VS Code issue #323522](https://github.com/microsoft/vscode/issues/323522) 有类似的 CSS/SVG 被误当成 Mermaid
源码的报告。它发生在其他平台，只能作为机制旁证，不能替代本项目的设备复现。

## 各个方向的验证结果

| 方向 | 证据及当前判断 |
| --- | --- |
| 源码与 SVG 输出混淆 | 已复现：克隆一个成功渲染的图表，移除原文属性，再经过真实工具栏扫描和挂载，旧版源码视图会显示 `#mermaid-…{…}`。已增加保护。 |
| 源码切换与主题重绘冲突 | 旧版会保存一次 `innerHTML`，移除 SVG 显示源码，再恢复旧快照；主题刷新也会写同一节点。已改成独立源码区域，验证刷新后的 SVG 保留，源码视图不被覆盖。它尚未被证明是手机截图的触发条件。 |
| 重复初始化 | astro-mermaid 没有图表级 in-flight 标记，可能重复排队。但抽取 2.1.0 初始化函数进行模拟时，两次调用都传入缓存的正确原文；Mermaid 公共 `render` 也自带串行队列。没有证据表明它直接导致 CSS 泄露。 |
| 旧版插件更换源码属性名 | 已排除：官方 1.2.0 和 2.1.0 都使用 `data-diagram`，并在渲染前保存。 |
| 图表语法错误 | 用无效定义触发当前插件的真实失败分支，出现 `Error rendering diagram:`，与截图的纯 CSS 内容不同。已改善这个分支的读者提示。截图文章的原始 Mermaid 定义未提供，无法单独验证它。 |
| 网络阻断或加载缓慢 | 阻断 Mermaid 动态导入，原先没有明确失败状态。新增 15 秒加载延迟说明；恢复请求并点击刷新后，图表恢复。网络失败本身不会把原文变成 CSS。 |
| 手机浏览器、扩展或页面缓存 | 仍未确认：需要截图设备、Firefox 版本、文章链接及触发步骤。手机尺寸测试不能替代真机。 |

重复初始化及版本判断依据：
[astro-mermaid 2.1.0](https://github.com/joesaby/astro-mermaid/blob/v2.1.0/astro-mermaid-integration.js)、
[astro-mermaid 1.2.0](https://github.com/joesaby/astro-mermaid/blob/v1.2.0/astro-mermaid-integration.js)、
[Mermaid 的渲染队列](https://github.com/mermaid-js/mermaid/blob/mermaid%4011.12.2/packages/mermaid/src/mermaid.ts)。

## 本次修改

- 显式区分加载中、渲染成功、失败和加载延迟。失败时显示「图表暂时无法显示」及「刷新重试」。
- 保留插件原始错误内容和控制台诊断，读者界面隐藏技术异常；失败时禁止全屏、缩放操作。
- 原文仍可用时允许查看和复制。原文缺失时禁用源码按钮；不把 SVG、CSS 或错误提示当作源码。
- 源码视图使用独立 React 区域，保留 SVG 原位供主题重绘，避免恢复过期 SVG 快照。
- 原文缺失时只引导刷新，不提示不可用的查看、复制操作。补齐中、英、日、韩文案。

没有替换 Mermaid 渲染器或升级依赖；对于尚未复现的手机触发条件，没有加入浏览器特判。
这些读者提示依赖现有 ContentEnhancer 工具栏挂载，`enhanceCodeBlock` 关闭时不会显示。

## 验证和复现入口

固定入口为仓库自带的 `/post/markdown-features`，包含流程图、时序图、饼图。

```sh
pnpm dev
pnpm test:diagram
pnpm test:diagram:browser
```

浏览器脚本需要本机已安装 Playwright 对应浏览器，默认测试 Firefox 和 Chromium。
要验证生产构建和 WebKit：

```sh
pnpm build
pnpm preview --host 127.0.0.1 --port 4323
DIAGRAM_TEST_ORIGIN=http://127.0.0.1:4323 DIAGRAM_TEST_BROWSERS=firefox,chromium,webkit pnpm test:diagram:browser
```

本次验证结果：

- `pnpm lint`：通过。
- `pnpm check`：430 个文件，0 errors、0 warnings、0 hints。
- `pnpm test:diagram`：11 项通过。
- `pnpm build`：通过；有现有大体积 chunk 提示。
- 开发模式：自动化 Firefox、Chromium 的 1440px 和 390px 视口通过。
- 生产预览：自动化 Firefox、Chromium、WebKit 的 1440px 和 390px 视口通过。
- 本机安装的 Firefox 应用：用临时 profile 和 WebDriver BiDi 验证普通渲染、源码/主题切换、实际失败提示，
  1440px 和 390px 均通过，并检查了错误提示截图。
- 导入阻断：开发和生产模式均确认延迟提示及刷新恢复。
- Astra 独立静态 review 的文案问题已修复，收尾复核未发现新增重要问题。

源码缺失用例是有意构造的回归状态；没有把它宣称为用户手机的完整复现。
尚未验证真实手机、截图中的 DAC 文章、线上部署或生产用户状态。

若要继续收敛原始触发条件，需要确认：设备系统与 Firefox 版本、实际文章链接、刷新是否恢复，
以及出问题前是否切过主题、点过源码、经站内跳转进入。出问题时检查 `pre.mermaid` 是否仍有 `data-diagram`，
并区分实际 `<svg>`、纯 CSS 文本、`.mermaid-source` 和插件错误节点，可以判断是哪条路径产生内容。
