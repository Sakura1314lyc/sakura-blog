import type { ProfileConfig } from "../types/config";

// 个人资料配置
export const profileConfig: ProfileConfig = {
  avatar: "assets/images/avatar.webp", // 相对于 /src 目录。如果以 '/' 开头，则相对于 /public 目录
  name: "Sakura",
  bio: "把难懂的 AI，写成可以一步步学会的知识。",
  typewriter: {
    enable: true, // 启用个人简介打字机效果
    speed: 100, // 打字速度（毫秒）
  },
  links: [
    {
      name: "Bilibili",
      icon: "fa7-brands:bilibili",
      url: "https://space.bilibili.com/198170603",
    },
    {
      name: "Gitee",
      icon: "mdi:git",
      url: "https://gitee.com/Sakuralyc",
    },
    {
      name: "GitHub",
      icon: "fa7-brands:github",
      url: "https://github.com/Sakura1314lyc",
    },
  ],
};
