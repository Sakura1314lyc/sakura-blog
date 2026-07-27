import type { AnnouncementConfig } from "../types/config";

// 公告栏配置
export const announcementConfig: AnnouncementConfig = {
	title: "", // 公告标题，填空使用i18n字符串Key.announcement
	content: "从 0 到 1 的 AI 学习专题已经上线：先看学习地图，再按阶段阅读。",
	closable: true, // 允许用户关闭公告
	link: {
		enable: true, // 启用链接
		text: "打开学习地图",
		url: "/ai-roadmap/",
		external: false, // 内部链接
	},
};
