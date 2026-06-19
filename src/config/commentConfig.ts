import type { CommentConfig } from "../types/config";
import { SITE_LANG } from "./siteConfig";

// 评论系统配置
export const commentConfig: CommentConfig = {
  enable: true, // 启用评论功能。当设置为 false 时，评论组件将不会显示在文章区域。
  system: "giscus", // 评论系统选择: "twikoo" | "giscus"
  twikoo: {
    envId: "https://twikoo.vercel.app",
    lang: SITE_LANG,
  },
  giscus: {
    repo: "Sakura1314lyc/sakura-blog",
    repoId: "R_kgDOSzOeqw",
    category: "Announcements",
    categoryId: "DIC_kwDOSzOeq84C_cvP",
    mapping: "pathname",
    strict: "0",
    reactionsEnabled: "1",
    emitMetadata: "0",
    inputPosition: "bottom", // 注意：你生成的代码里这里是 bottom，如果想输入框在上面可以改回 top
    theme: "preferred_color_scheme",
    lang: "zh-CN", // 如果你原本代码写的是 SITE_LANG 变量，也可以保留 SITE_LANG
    loading: "lazy",
  },
};
