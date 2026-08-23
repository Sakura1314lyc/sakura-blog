// Project data configuration file
// Used to manage data for the project display page

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "web" | "mobile" | "desktop" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	visitUrl?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
	showImage?: boolean;
}

export const projectsData: Project[] = [
	{
		id: "golang-oj",
		title: "ark-OJ",
		description:
			"Go + React 构建的在线判题平台，包含多语言沙箱判题、题库与比赛、排行榜、JWT 鉴权，以及 Codeforces、LeetCode、洛谷、AtCoder 题目爬虫。",
		image: "",
		category: "web",
		techStack: ["Go", "React", "MySQL", "GORM", "Tailwind CSS"],
		status: "in-progress",
		sourceCode: "https://github.com/Sakura1314lyc/golang-oj",
		startDate: "2026-04-18",
		featured: true,
		tags: ["Online Judge", "沙箱判题", "全栈", "题目爬虫"],
		showImage: false,
	},
	{
		id: "im-system",
		title: "Lchat",
		description:
			"Go 驱动的实时聊天系统，覆盖私聊、群聊、动态、离线消息与多端接入，并以独立用户形态接入可配置的 OpenAI-compatible AI Agent。",
		image: "",
		category: "web",
		techStack: ["Go", "WebSocket", "SQLite", "Redis", "LLM"],
		status: "in-progress",
		sourceCode: "https://github.com/Sakura1314lyc/IM-system",
		startDate: "2026-03-25",
		featured: true,
		tags: ["即时通信", "AI Agent", "WebSocket", "Docker"],
		showImage: false,
	},
	{
		id: "astrbot-plugin-vocadaily",
		title: "AstrBot 每日术曲",
		description:
			"面向 AstrBot 的每日术力口推荐插件：从 B 站搜索、筛选并下载完整视频，支持曲库同步、定时群推送、缓存清理与 ffmpeg 音视频合并。",
		image: "",
		category: "other",
		techStack: ["Python", "AstrBot", "yt-dlp", "ffmpeg", "SQLite"],
		status: "in-progress",
		sourceCode: "https://github.com/Sakura1314lyc/astrbot-plugin-vocadaily",
		startDate: "2026-06-20",
		featured: true,
		tags: ["聊天机器人", "VOCALOID", "Bilibili", "定时任务"],
		showImage: false,
	},
	{
		id: "sakura-blog",
		title: "Mizuki Sakura Blog",
		description:
			"当前博客的开源实现：基于 Astro、Svelte 与 Tailwind CSS 的静态站点，集成文章检索、相册、项目展示、多语言和 Vercel 自动部署。",
		image: "",
		category: "web",
		techStack: ["Astro", "Svelte", "TypeScript", "Tailwind CSS"],
		status: "in-progress",
		visitUrl: "https://sakura-two-xi.vercel.app/",
		sourceCode: "https://github.com/Sakura1314lyc/sakura-blog",
		startDate: "2026-06-07",
		featured: true,
		tags: ["个人博客", "静态站点", "Vercel", "GitOps"],
		showImage: false,
	},
	{
		id: "sakura-prj",
		title: "Sakura Grid Simulator",
		description:
			"Unity 2D 网格模拟原型，支持多单位生成、键盘逐格移动、单位切换，以及边界、障碍物和单位重叠三类碰撞校验。",
		image: "",
		category: "desktop",
		techStack: ["C#", "Unity", "2D", "Grid System"],
		status: "in-progress",
		sourceCode: "https://github.com/Sakura1314lyc/sakura-prj",
		startDate: "2026-03-05",
		tags: ["游戏开发", "网格模拟", "碰撞检测"],
		showImage: false,
	},
	{
		id: "sakura1314lyc-github-io",
		title: "Sakura Blog Legacy",
		description:
			"早期个人博客的静态站点归档，保留文章、分类、标签、时间线、Live2D 组件与完整前端资源，并提供可直接访问的历史版本。",
		image: "",
		category: "web",
		techStack: ["HTML", "CSS", "JavaScript", "Live2D"],
		status: "completed",
		visitUrl: "https://sakura1314lyc-github-io.vercel.app/",
		sourceCode: "https://github.com/Sakura1314lyc/Sakura1314lyc.github.io",
		startDate: "2026-03-09",
		endDate: "2026-06-02",
		tags: ["个人博客", "静态站点", "历史归档"],
		showImage: false,
	},
	{
		id: "sakura1314lyc-profile",
		title: "GitHub Profile",
		description:
			"个人 GitHub 主页配置仓库，集中展示学习方向、技术栈与项目入口，当前关注 LLM 后训练、深度学习、Go 后端和算法竞赛。",
		image: "",
		category: "other",
		techStack: ["Markdown", "GitHub Actions", "LLM", "Go", "C++"],
		status: "in-progress",
		visitUrl: "https://github.com/Sakura1314lyc",
		sourceCode: "https://github.com/Sakura1314lyc/Sakura1314lyc",
		startDate: "2026-06-09",
		tags: ["Profile", "学习路线", "技术栈"],
		showImage: false,
	},
];

// Get project statistics
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter((p) => p.status === "completed").length;
	const inProgress = projectsData.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
};

// Get projects by category
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return projectsData;
	}
	return projectsData.filter((p) => p.category === category);
};

// Get featured projects
export const getFeaturedProjects = () => {
	return projectsData.filter((p) => p.featured);
};

// Get all tech stacks
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => {
		project.techStack.forEach((tech) => {
			techSet.add(tech);
		});
	});
	return Array.from(techSet).sort();
};
