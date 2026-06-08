// Skill data configuration file
// Used to manage data for the skill display page

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string; // Iconify icon name
  category: "frontend" | "backend" | "database" | "tools" | "other";
  level: "beginner" | "intermediate" | "advanced" | "expert";
  experience: {
    years: number;
    months: number;
  };
  projects?: string[]; // Related project IDs
  certifications?: string[];
  color?: string; // Skill card theme color
}

export const skillsData: Skill[] = [
  // Backend Skills
  {
    id: "cpp",
    name: "C++",
    description:
      "Core language for Competitive Programming (ACM/ICPC) and algorithm implementation. Focused on extreme execution efficiency.",
    icon: "logos:c-plusplus",
    category: "backend",
    level: "advanced",
    experience: { years: 1, months: 10 },
    projects: ["acm-training-library"],
    color: "#00599C",
  },
  {
    id: "go",
    name: "Go",
    description:
      "Primary language for backend development and system design. Utilized for high-concurrency architecture and engineering refinement.",
    icon: "logos:go",
    category: "backend",
    level: "intermediate",
    experience: { years: 0, months: 10 },
    projects: ["personal-blog-system"],
    color: "#00ADD8",
  },

  // Database Skills
  {
    id: "mysql",
    name: "MySQL",
    description:
      "Relational database management. Solid understanding of data modeling, querying, and indexing.",
    icon: "logos:mysql-icon",
    category: "database",
    level: "intermediate",
    experience: { years: 1, months: 2 },
    color: "#4479A1",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    description:
      "Advanced open-source relational database, actively used for robust data persistence in modern full-stack deployments.",
    icon: "logos:postgresql",
    category: "database",
    level: "intermediate",
    experience: { years: 0, months: 6 },
    projects: ["personal-blog-system"],
    color: "#336791",
  },

  // Tools
  {
    id: "linux",
    name: "Linux",
    description:
      "Essential environment for server deployment and development. Comfortable with CLI and shell scripting.",
    icon: "logos:linux-tux",
    category: "tools",
    level: "intermediate",
    experience: { years: 1, months: 6 },
    color: "#FCC624",
  },
  {
    id: "docker",
    name: "Docker",
    description:
      "Containerization platform used to streamline application deployment, such as isolating backend and database services.",
    icon: "logos:docker-icon",
    category: "tools",
    level: "intermediate",
    experience: { years: 0, months: 8 },
    projects: ["personal-blog-system"],
    color: "#2496ED",
  },
  {
    id: "vscode",
    name: "VS Code",
    description:
      "Highly customized primary development environment, equipped with a comprehensive library of personal code snippets.",
    icon: "logos:visual-studio-code",
    category: "tools",
    level: "advanced",
    experience: { years: 1, months: 10 },
    color: "#007ACC",
  },
  {
    id: "git",
    name: "Git",
    description:
      "Distributed version control system for source code management and maintaining project history.",
    icon: "logos:git-icon",
    category: "tools",
    level: "intermediate",
    experience: { years: 1, months: 6 },
    color: "#F05032",
  },

  // Other (Algorithms & Core Concepts)
  {
    id: "data-structures",
    name: "Data Structures",
    description:
      "Deep proficiency in core and advanced data structures, including Segment Trees, Disjoint Set Unions (DSU), and Graph representations.",
    icon: "carbon:data-structured",
    category: "other",
    level: "advanced",
    experience: { years: 2, months: 0 },
    color: "#005571",
  },
  {
    id: "constructive-algorithms",
    name: "Constructive Algorithms",
    description:
      "Specialized in Constructive Algorithms and Mathematical Logic. Focused on achieving high ratings on platforms like Codeforces.",
    icon: "carbon:function-math",
    category: "other",
    level: "advanced",
    experience: { years: 1, months: 8 },
    color: "#E10098",
  },
];
