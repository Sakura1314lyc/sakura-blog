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
    title: "GoOJ",
    description:
      "A full-stack Online Judge platform built with Go and vanilla JavaScript. Features problem management, code submission & judging engine, user authentication, and a responsive web-based frontend.",
    image: "",
    category: "web",
    techStack: ["Go", "JavaScript", "CSS", "HTML"],
    status: "in-progress",
    sourceCode: "https://github.com/Sakura1314lyc/golang-oj",
    startDate: "2026-04-18",
    featured: true,
    tags: ["Online Judge", "Full Stack", "Backend", "Frontend"],
    showImage: false,
  },
  {
    id: "im-system",
    title: "IM System",
    description:
      "基于 Go 语言的实时即时通信系统，支持 WebSocket 双向通信、用户管理、消息持久化存储、Docker 容器化部署，附带 Web 客户端界面。",
    image: "",
    category: "web",
    techStack: ["Go", "JavaScript", "WebSocket", "Docker", "CSS", "HTML"],
    status: "in-progress",
    sourceCode: "https://github.com/Sakura1314lyc/IM-system",
    startDate: "2026-03-25",
    featured: true,
    tags: ["IM", "WebSocket", "Backend", "Docker"],
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
