import type { ProfileConfig } from "../types/config";

// 个人资料配置
export const profileConfig: ProfileConfig = {
  avatar: "assets/images/avatar.webp", // 相对于 /src 目录。如果以 '/' 开头，则相对于 /public 目录
  name: "Sakura",
  bio: "我们都是小怪兽,有一天会被正义的奥特曼杀死",
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
    {
      name: "Codeberg",
      icon: "simple-icons:codeberg",
      url: "https://codeberg.org",
    },
    {
      name: "Discord",
      icon: "fa7-brands:discord",
      url: "https://discord.gg/g6RbWUJJB",
    },
  ],
};
