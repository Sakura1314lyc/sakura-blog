import type { PioConfig } from "../types/config";

// Pio 看板娘配置
export const pioConfig: PioConfig = {
  enable: false, // 毛玻璃卡片布局默认关闭悬浮看板娘，避免遮挡阅读与卡片操作；可按需开启
  models: ["/pio/models/NOIR/noir.model3.json"], // 默认模型路径
  position: "left", // 模型位置
  width: 280, // 默认宽度
  height: 250, // 默认高度
  mode: "draggable", // 默认为可拖拽模式
  hiddenOnMobile: true, // 默认在移动设备上隐藏
  hideAboutMenu: false, // 隐藏内置 About 菜单按钮
  dialog: {
    welcome: "Welcome to Mizuki Website!", // 欢迎词
    touch: [
      "What are you doing?",
      "Stop touching me!",
      "Whoa!",
      "HENTAI!",
      "Don't bully me like that!",
    ], // 触摸提示
    home: "Click here to go back to homepage!", // 首页提示
    skin: ["Want to see my new outfit?", "The new outfit looks great~"], // 换装提示
    close: "QWQ See you next time~", // 关闭提示
    link: "https://sakura-two-xi.vercel.app/", // 关于链接
  },
};
