import type { CareerInterest, TargetRole } from "@/types";

export const CAREER_INTERESTS: CareerInterest[] = [
  {
    id: "software-dev",
    name: "Software Development",
    description: "Building scalable web, mobile, and desktop applications.",
    icon: "Code2",
    popularRoles: ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
  },
  {
    id: "data-analytics",
    name: "Data & Analytics",
    description: "Data modeling, business intelligence, and analytical data engineering.",
    icon: "BarChart3",
    popularRoles: ["Data Analyst", "Data Engineer", "Business Intelligence Engineer"],
  },
  {
    id: "ai-ml",
    name: "Artificial Intelligence & ML",
    description: "Machine learning algorithms, deep learning, NLP, and Generative AI systems.",
    icon: "Sparkles",
    popularRoles: ["AI Engineer", "ML Engineer", "Data Scientist", "Research Engineer"],
  },
  {
    id: "cloud-computing",
    name: "Cloud Computing",
    description: "Designing, provisioning, and maintaining resilient cloud infrastructures.",
    icon: "Cloud",
    popularRoles: ["Cloud Engineer", "Cloud Architect", "Solutions Architect"],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity & InfoSec",
    description:
      "Securing applications, network perimeters, penetration testing, and SOC analysis.",
    icon: "ShieldAlert",
    popularRoles: [
      "Cybersecurity Analyst",
      "Security Engineer",
      "SOC Analyst",
      "Penetration Tester",
    ],
  },
  {
    id: "devops-platform",
    name: "DevOps & Platform Engineering",
    description: "CI/CD pipelines, container orchestration, site reliability, and automation.",
    icon: "Cpu",
    popularRoles: ["DevOps Engineer", "Site Reliability Engineer (SRE)", "Platform Engineer"],
  },
  {
    id: "networking-infra",
    name: "Networking & Systems Infrastructure",
    description:
      "Enterprise network design, routing, protocol analysis, and systems administration.",
    icon: "Network",
    popularRoles: ["Network Engineer", "Systems Administrator", "Infrastructure Engineer"],
  },
  {
    id: "database-engineering",
    name: "Database Engineering",
    description:
      "RDBMS/NoSQL architecture, query optimization, high-throughput caching, and storage.",
    icon: "Database",
    popularRoles: ["Database Administrator", "Database Engineer", "Data Architect"],
  },
  {
    id: "ui-ux-design",
    name: "UI / UX & Product Design",
    description: "User research, interaction design, prototyping, and design system governance.",
    icon: "Palette",
    popularRoles: ["UI Designer", "UX Designer", "Product Designer", "Design Systems Engineer"],
  },
  {
    id: "product-management",
    name: "Product & Technical Management",
    description:
      "Product strategy, requirement prioritization, agile delivery, and technical roadmaps.",
    icon: "Compass",
    popularRoles: ["Technical Product Manager", "Associate Product Manager", "Scrum Master"],
  },
  {
    id: "quality-engineering",
    name: "Quality Engineering & Testing",
    description:
      "Automated test harnesses, performance testing, security audits, and QA reliability.",
    icon: "CheckCircle2",
    popularRoles: ["QA Engineer", "Automation Test Engineer", "SDET"],
  },
  {
    id: "embedded-iot",
    name: "Embedded Systems & IoT",
    description: "Microcontrollers, RTOS, firmware engineering, sensor arrays, and IoT hardware.",
    icon: "Radio",
    popularRoles: ["Embedded Systems Engineer", "IoT Engineer", "Firmware Engineer"],
  },
  {
    id: "systems-research",
    name: "Systems Software & Research",
    description: "Compilers, operating systems kernels, distributed consensus, and academic R&D.",
    icon: "FlaskConical",
    popularRoles: ["Systems Software Engineer", "Research Scientist", "Compiler Engineer"],
  },
  {
    id: "technical-consulting",
    name: "Technical Consulting & Solutions",
    description:
      "Client advisory, enterprise architecture, technology evaluation, and implementation.",
    icon: "Briefcase",
    popularRoles: ["Technical Consultant", "Solutions Architect", "Customer Success Engineer"],
  },
];

export const TARGET_ROLES: TargetRole[] = [
  // Software Development
  {
    id: "role-frontend-dev",
    title: "Frontend Developer",
    category: "Software Development",
    description:
      "Crafts responsive, performant user interfaces, single-page applications, and interactive web tools.",
    recommendedSkills: [
      "React",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Next.js",
      "Git",
    ],
    demandLevel: "very_high",
  },
  {
    id: "role-backend-dev",
    title: "Backend Developer",
    category: "Software Development",
    description:
      "Engineers robust server-side APIs, business logic, authentication services, and microservices.",
    recommendedSkills: [
      "Node.js",
      "Python",
      "Java",
      "PostgreSQL",
      "REST APIs",
      "Express",
      "Docker",
      "Git",
    ],
    demandLevel: "very_high",
  },
  {
    id: "role-fullstack-dev",
    title: "Full Stack Developer",
    category: "Software Development",
    description:
      "Bridges client-side UI and server architectures end-to-end with database integration.",
    recommendedSkills: [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "REST APIs",
      "Tailwind CSS",
      "Git",
      "Docker",
    ],
    demandLevel: "very_high",
  },
  {
    id: "role-software-engineer",
    title: "Software Engineer",
    category: "Software Development",
    description:
      "Designs, writes, and tests core software systems applying computer science fundamentals and design patterns.",
    recommendedSkills: [
      "Data Structures",
      "Algorithms",
      "C++",
      "Java",
      "Python",
      "Git",
      "System Design",
      "OOP",
    ],
    demandLevel: "very_high",
  },
  {
    id: "role-mobile-dev",
    title: "Mobile App Developer",
    category: "Software Development",
    description: "Builds native and cross-platform mobile apps for iOS and Android devices.",
    recommendedSkills: ["Flutter", "React Native", "Kotlin", "Swift", "Dart", "REST APIs", "Git"],
    demandLevel: "high",
  },
  {
    id: "role-android-dev",
    title: "Android Developer",
    category: "Software Development",
    description:
      "Specializes in native Android application development using Kotlin/Java and Android Jetpack.",
    recommendedSkills: ["Kotlin", "Java", "Android Jetpack", "REST APIs", "Git", "OOP"],
    demandLevel: "high",
  },
  {
    id: "role-ios-dev",
    title: "iOS Developer",
    category: "Software Development",
    description:
      "Specializes in native iOS and macOS application development with Swift and SwiftUI.",
    recommendedSkills: ["Swift", "SwiftUI", "Xcode", "REST APIs", "Git", "iOS SDK"],
    demandLevel: "high",
  },

  // Data & Analytics
  {
    id: "role-data-analyst",
    title: "Data Analyst",
    category: "Data & Analytics",
    description:
      "Extracts insights from raw data, builds dashboards, and drives data-informed business decisions.",
    recommendedSkills: [
      "SQL",
      "Excel",
      "Python",
      "Pandas",
      "Power BI",
      "Tableau",
      "Statistics",
      "Data Visualization",
    ],
    demandLevel: "very_high",
  },
  {
    id: "role-data-engineer",
    title: "Data Engineer",
    category: "Data & Analytics",
    description:
      "Constructs scalable data pipelines, ETL workflows, data lakes, and distributed storage systems.",
    recommendedSkills: ["Python", "SQL", "Spark", "PostgreSQL", "AWS", "ETL", "Kafka", "Docker"],
    demandLevel: "very_high",
  },
  {
    id: "role-data-scientist",
    title: "Data Scientist",
    category: "Data & Analytics",
    description:
      "Applies statistical modeling, exploratory data analysis, and predictive algorithms to solve complex problems.",
    recommendedSkills: [
      "Python",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "SQL",
      "Statistics",
      "Machine Learning",
    ],
    demandLevel: "very_high",
  },

  // AI / ML
  {
    id: "role-ai-engineer",
    title: "AI Engineer",
    category: "Artificial Intelligence & ML",
    description:
      "Integrates generative AI models, LLMs, prompt engineering, and agentic workflows into production apps.",
    recommendedSkills: [
      "Python",
      "Generative AI",
      "LLMs",
      "Prompt Engineering",
      "PyTorch",
      "REST APIs",
      "LangChain",
    ],
    demandLevel: "very_high",
  },
  {
    id: "role-ml-engineer",
    title: "Machine Learning Engineer",
    category: "Artificial Intelligence & ML",
    description:
      "Develops, fine-tunes, trains, and operationalizes machine learning models for production inference.",
    recommendedSkills: [
      "Python",
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "MLOps",
      "Deep Learning",
      "Docker",
    ],
    demandLevel: "very_high",
  },
  {
    id: "role-research-engineer",
    title: "Research Engineer",
    category: "Artificial Intelligence & ML",
    description:
      "Explores novel algorithms, architectures, and mathematical models for breakthrough technologies.",
    recommendedSkills: ["Python", "PyTorch", "C++", "Algorithms", "Mathematics", "Deep Learning"],
    demandLevel: "high",
  },

  // Cloud & DevOps
  {
    id: "role-cloud-engineer",
    title: "Cloud Engineer",
    category: "Cloud Computing",
    description:
      "Provisions, architectures, and oversees cloud environments on AWS, Google Cloud, or Azure.",
    recommendedSkills: [
      "AWS",
      "Terraform",
      "Docker",
      "Linux",
      "Cloud Architecture",
      "Kubernetes",
      "Git",
    ],
    demandLevel: "very_high",
  },
  {
    id: "role-devops-engineer",
    title: "DevOps Engineer",
    category: "DevOps & Platform Engineering",
    description:
      "Automates software delivery with CI/CD pipelines, container orchestration, and telemetry.",
    recommendedSkills: [
      "Docker",
      "Kubernetes",
      "CI/CD",
      "GitHub Actions",
      "Linux",
      "Git",
      "Terraform",
      "Bash",
    ],
    demandLevel: "very_high",
  },
  {
    id: "role-sre",
    title: "Site Reliability Engineer (SRE)",
    category: "DevOps & Platform Engineering",
    description:
      "Applies software engineering principles to operations, uptime, latency, and incident response.",
    recommendedSkills: [
      "Linux",
      "Python",
      "Kubernetes",
      "Monitoring",
      "Logging",
      "Cloud Architecture",
      "Docker",
    ],
    demandLevel: "high",
  },

  // Cybersecurity
  {
    id: "role-cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    category: "Cybersecurity & InfoSec",
    description:
      "Monitors network traffic, evaluates vulnerabilities, and defends organizations against security breaches.",
    recommendedSkills: [
      "Network Security",
      "Application Security",
      "SIEM",
      "SOC",
      "Linux",
      "Ethical Hacking",
    ],
    demandLevel: "very_high",
  },
  {
    id: "role-security-engineer",
    title: "Security Engineer",
    category: "Cybersecurity & InfoSec",
    description:
      "Designs secure architectures, implements cryptographic protocols, and conducts code audits.",
    recommendedSkills: [
      "Application Security",
      "Cryptography",
      "OWASP",
      "Penetration Testing",
      "Python",
      "Linux",
    ],
    demandLevel: "high",
  },

  // Quality & Testing
  {
    id: "role-qa-engineer",
    title: "QA / Test Automation Engineer",
    category: "Quality Engineering & Testing",
    description:
      "Designs test plans, writes automated regression suites, and verifies product stability.",
    recommendedSkills: [
      "Test Automation",
      "Unit Testing",
      "Selenium",
      "JavaScript",
      "Python",
      "Git",
      "CI/CD",
    ],
    demandLevel: "high",
  },

  // UI / UX & Design
  {
    id: "role-ui-ux-designer",
    title: "UI / UX Designer",
    category: "UI / UX & Product Design",
    description:
      "Creates wireframes, user journey maps, high-fidelity prototypes, and design systems.",
    recommendedSkills: [
      "Figma",
      "User Research",
      "Wireframing",
      "Prototyping",
      "Design Systems",
      "Visual Design",
    ],
    demandLevel: "high",
  },
  {
    id: "role-product-designer",
    title: "Product Designer",
    category: "UI / UX & Product Design",
    description:
      "Owns the end-to-end product experience combining user research, interaction design, and metrics.",
    recommendedSkills: [
      "Figma",
      "User Research",
      "Interaction Design",
      "Prototyping",
      "Design Systems",
    ],
    demandLevel: "high",
  },

  // Embedded & IoT
  {
    id: "role-embedded-engineer",
    title: "Embedded Systems Engineer",
    category: "Embedded Systems & IoT",
    description:
      "Programs microcontrollers, firmware, and low-level drivers interfacing with physical hardware.",
    recommendedSkills: ["C", "C++", "Microcontrollers", "RTOS", "Computer Architecture", "Linux"],
    demandLevel: "high",
  },
  {
    id: "role-iot-engineer",
    title: "IoT Solutions Engineer",
    category: "Embedded Systems & IoT",
    description:
      "Connects smart devices, sensor networks, and edge computing nodes with cloud telemetry.",
    recommendedSkills: [
      "C++",
      "Python",
      "MQTT",
      "Arduino",
      "Raspberry Pi",
      "AWS IoT",
      "Embedded Systems",
    ],
    demandLevel: "high",
  },

  // Database & Solutions
  {
    id: "role-database-engineer",
    title: "Database Engineer",
    category: "Database Engineering",
    description:
      "Designs schema models, tunes query execution plans, and handles distributed database replication.",
    recommendedSkills: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Database Design",
      "Query Optimization",
      "Redis",
    ],
    demandLevel: "high",
  },
  {
    id: "role-solutions-architect",
    title: "Solutions Architect",
    category: "Technical Consulting & Solutions",
    description:
      "Translates business requirements into enterprise technology architectures and cloud solutions.",
    recommendedSkills: [
      "Cloud Architecture",
      "System Design",
      "AWS",
      "Security",
      "Microservices",
      "REST APIs",
    ],
    demandLevel: "high",
  },
];
