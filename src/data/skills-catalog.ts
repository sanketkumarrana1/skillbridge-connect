import type { SkillCategory, SkillDefinition } from "@/types";

export const SKILL_CATEGORIES: SkillCategory[] = [
  "Programming Languages",
  "Web & Frontend",
  "Backend & APIs",
  "Databases & Storage",
  "Data & Analytics",
  "AI & Machine Learning",
  "Cloud Computing",
  "DevOps & Platform",
  "Cybersecurity",
  "Computer Science Fundamentals",
  "Software Engineering Practices",
  "UI / UX & Product Design",
  "Emerging & Specialized Technologies",
];

export const SKILLS_LIBRARY: SkillDefinition[] = [
  // ================= PROGRAMMING LANGUAGES =================
  {
    id: "lang-c",
    name: "C",
    category: "Programming Languages",
    aliases: ["ANSI C", "C Programming"],
    relatedSkills: ["C++", "Data Structures", "Pointers", "Memory Management"],
    description: "Foundational procedural language for low-level systems and embedded computing.",
    tags: ["systems", "embedded", "core"],
  },
  {
    id: "lang-cpp",
    name: "C++",
    category: "Programming Languages",
    aliases: ["CPP", "Modern C++", "C++17", "C++20"],
    relatedSkills: ["C", "Object-Oriented Programming", "Data Structures", "Algorithms", "STL"],
    description:
      "High-performance object-oriented language for systems, game engines, and competitive programming.",
    tags: ["systems", "competitive-programming", "performance"],
  },
  {
    id: "lang-csharp",
    name: "C#",
    category: "Programming Languages",
    aliases: ["CSharp", ".NET C#"],
    relatedSkills: [".NET", "ASP.NET", "Unity", "OOP"],
    description:
      "Modern, object-oriented language developed by Microsoft for enterprise and game development.",
    tags: ["enterprise", "backend", "game-dev"],
  },
  {
    id: "lang-java",
    name: "Java",
    category: "Programming Languages",
    aliases: ["Core Java", "Java 17", "Java 21"],
    relatedSkills: ["Spring Boot", "OOP", "Data Structures", "JVM", "REST APIs"],
    description:
      "Robust enterprise object-oriented programming language powering scalable backend systems.",
    tags: ["enterprise", "backend", "core"],
  },
  {
    id: "lang-python",
    name: "Python",
    category: "Programming Languages",
    aliases: ["Python 3", "Py"],
    relatedSkills: ["Pandas", "NumPy", "Django", "FastAPI", "Machine Learning", "PyTorch"],
    description:
      "High-level versatile language widely utilized in web backends, data science, AI, and scripting.",
    tags: ["versatile", "ai", "data-science", "backend"],
  },
  {
    id: "lang-javascript",
    name: "JavaScript",
    category: "Programming Languages",
    aliases: ["JS", "ES6+", "ECMAScript"],
    relatedSkills: ["TypeScript", "React", "Node.js", "HTML", "CSS"],
    description:
      "Core language of the modern web powering interactive browser applications and server runtimes.",
    tags: ["web", "frontend", "fullstack"],
  },
  {
    id: "lang-typescript",
    name: "TypeScript",
    category: "Programming Languages",
    aliases: ["TS"],
    relatedSkills: ["JavaScript", "React", "Next.js", "Node.js", "Express"],
    description:
      "Typed superset of JavaScript enhancing code correctness and developer tooling in large codebases.",
    tags: ["web", "frontend", "backend", "types"],
  },
  {
    id: "lang-go",
    name: "Go",
    category: "Programming Languages",
    aliases: ["Golang"],
    relatedSkills: ["Microservices", "Docker", "Kubernetes", "REST APIs", "Concurrency"],
    description:
      "Statically typed compiled language designed at Google for concurrent cloud infrastructure.",
    tags: ["cloud", "concurrency", "backend"],
  },
  {
    id: "lang-rust",
    name: "Rust",
    category: "Programming Languages",
    aliases: ["Rustlang"],
    relatedSkills: ["C++", "Memory Safety", "Systems Programming", "WebAssembly"],
    description:
      "Systems programming language focused on memory safety, concurrency, and zero-cost abstractions.",
    tags: ["systems", "safety", "performance"],
  },
  {
    id: "lang-kotlin",
    name: "Kotlin",
    category: "Programming Languages",
    aliases: ["Android Kotlin"],
    relatedSkills: ["Java", "Android Jetpack", "Mobile App Development", "Coroutines"],
    description: "Modern expressive JVM language officially recommended for Android development.",
    tags: ["mobile", "android", "jvm"],
  },
  {
    id: "lang-swift",
    name: "Swift",
    category: "Programming Languages",
    aliases: ["Apple Swift", "SwiftUI"],
    relatedSkills: ["iOS Development", "SwiftUI", "Xcode"],
    description:
      "Powerful and intuitive language developed by Apple for iOS, iPadOS, macOS, and watchOS.",
    tags: ["mobile", "ios", "apple"],
  },
  {
    id: "lang-php",
    name: "PHP",
    category: "Programming Languages",
    aliases: ["PHP 8", "Modern PHP"],
    relatedSkills: ["Laravel", "MySQL", "REST APIs", "WordPress"],
    description: "Widely used server-side scripting language tailored for web backend development.",
    tags: ["web", "backend"],
  },
  {
    id: "lang-ruby",
    name: "Ruby",
    category: "Programming Languages",
    aliases: ["Ruby on Rails"],
    relatedSkills: ["Rails", "REST APIs", "OOP"],
    description:
      "Dynamic, open source programming language with a focus on simplicity and productivity.",
    tags: ["web", "backend"],
  },
  {
    id: "lang-dart",
    name: "Dart",
    category: "Programming Languages",
    aliases: ["Flutter Dart"],
    relatedSkills: ["Flutter", "Mobile Development", "OOP"],
    description: "Client-optimized language for fast apps on any platform, powering Flutter.",
    tags: ["mobile", "frontend", "flutter"],
  },
  {
    id: "lang-r",
    name: "R",
    category: "Programming Languages",
    aliases: ["R Language"],
    relatedSkills: ["Statistics", "Data Visualization", "Data Analysis", "ggplot2"],
    description: "Language and environment for statistical computing, data analysis, and graphics.",
    tags: ["data-science", "statistics"],
  },
  {
    id: "lang-sql",
    name: "SQL",
    category: "Programming Languages",
    aliases: ["Structured Query Language", "Postgres SQL", "MySQL"],
    relatedSkills: ["PostgreSQL", "MySQL", "Database Design", "Query Optimization"],
    description: "Standard language for storing, querying, and manipulating relational databases.",
    tags: ["databases", "data", "backend"],
  },
  {
    id: "lang-bash",
    name: "Shell / Bash",
    category: "Programming Languages",
    aliases: ["Bash Scripting", "Shell Scripting", "Zsh"],
    relatedSkills: ["Linux", "DevOps", "CI/CD", "Automation"],
    description:
      "Command-line shell and scripting language for automating operating system workflows.",
    tags: ["devops", "linux", "automation"],
  },

  // ================= WEB & FRONTEND =================
  {
    id: "web-html",
    name: "HTML",
    category: "Web & Frontend",
    aliases: ["HTML5", "Semantic HTML"],
    relatedSkills: ["CSS", "JavaScript", "Web Accessibility"],
    description: "Standard markup language for document structure and web application semantics.",
    tags: ["web", "frontend", "basics"],
  },
  {
    id: "web-css",
    name: "CSS",
    category: "Web & Frontend",
    aliases: ["CSS3", "Modern CSS"],
    relatedSkills: ["HTML", "Tailwind CSS", "Responsive Design", "Flexbox", "Grid"],
    description:
      "Style sheet language used to describe the presentation and layout of web documents.",
    tags: ["web", "frontend", "ui"],
  },
  {
    id: "web-react",
    name: "React",
    category: "Web & Frontend",
    aliases: ["React.js", "ReactJS"],
    relatedSkills: ["JavaScript", "TypeScript", "Next.js", "Redux", "Tailwind CSS", "HTML"],
    description:
      "Declarative, component-based JavaScript library for building high-performance user interfaces.",
    tags: ["frontend", "framework", "popular"],
  },
  {
    id: "web-nextjs",
    name: "Next.js",
    category: "Web & Frontend",
    aliases: ["NextJS", "Next 14", "Next 15"],
    relatedSkills: ["React", "TypeScript", "SSR", "Server Components", "Tailwind CSS"],
    description:
      "The React framework for the web supporting Server-Side Rendering (SSR) and App Router.",
    tags: ["frontend", "fullstack", "ssr"],
  },
  {
    id: "web-angular",
    name: "Angular",
    category: "Web & Frontend",
    aliases: ["AngularJS", "Angular 17"],
    relatedSkills: ["TypeScript", "RxJS", "HTML", "CSS", "REST APIs"],
    description:
      "Comprehensive platform and framework for building scalable enterprise web applications.",
    tags: ["frontend", "enterprise"],
  },
  {
    id: "web-vue",
    name: "Vue.js",
    category: "Web & Frontend",
    aliases: ["Vue", "Vue 3", "Nuxt"],
    relatedSkills: ["JavaScript", "TypeScript", "HTML", "CSS", "Vite"],
    description:
      "Approachable, performant, and versatile framework for building web user interfaces.",
    tags: ["frontend", "framework"],
  },
  {
    id: "web-tailwind",
    name: "Tailwind CSS",
    category: "Web & Frontend",
    aliases: ["Tailwind", "Utility-First CSS"],
    relatedSkills: ["CSS", "React", "Next.js", "HTML"],
    description: "Utility-first CSS framework for rapid modern UI development.",
    tags: ["frontend", "css", "styling"],
  },
  {
    id: "web-redux",
    name: "Redux / Toolkit",
    category: "Web & Frontend",
    aliases: ["Redux Toolkit", "RTK"],
    relatedSkills: ["React", "TypeScript", "State Management"],
    description: "Predictable state container for JavaScript apps with centralized global state.",
    tags: ["frontend", "state-management"],
  },
  {
    id: "web-tanstack-query",
    name: "React Query",
    category: "Web & Frontend",
    aliases: ["TanStack Query"],
    relatedSkills: ["React", "TypeScript", "REST APIs", "Async State"],
    description:
      "Powerful asynchronous state management and caching library for TS/JS applications.",
    tags: ["frontend", "caching", "apis"],
  },
  {
    id: "web-a11y",
    name: "Web Accessibility (a11y)",
    category: "Web & Frontend",
    aliases: ["WCAG", "ARIA"],
    relatedSkills: ["HTML", "CSS", "UI / UX & Product Design"],
    description:
      "Designing and coding websites to ensure equal access and usability for users with disabilities.",
    tags: ["frontend", "standards", "compliance"],
  },
  {
    id: "web-perf",
    name: "Web Performance & Core Vitals",
    category: "Web & Frontend",
    aliases: ["LCP", "CWV", "Bundle Optimization"],
    relatedSkills: ["JavaScript", "React", "Next.js", "Vite"],
    description:
      "Techniques and audits to maximize load speed, minimize bundle sizes, and optimize interaction latency.",
    tags: ["frontend", "performance", "optimization"],
  },

  // ================= BACKEND & APIS =================
  {
    id: "be-nodejs",
    name: "Node.js",
    category: "Backend & APIs",
    aliases: ["Node", "NodeJS"],
    relatedSkills: ["JavaScript", "TypeScript", "Express", "REST APIs", "npm"],
    description: "Asynchronous event-driven JavaScript runtime built on Chrome's V8 engine.",
    tags: ["backend", "runtime", "javascript"],
  },
  {
    id: "be-express",
    name: "Express.js",
    category: "Backend & APIs",
    aliases: ["Express", "ExpressJS"],
    relatedSkills: ["Node.js", "TypeScript", "REST APIs", "Middleware"],
    description: "Fast, unopinionated, minimalist web framework for Node.js backends.",
    tags: ["backend", "api", "node"],
  },
  {
    id: "be-nestjs",
    name: "NestJS",
    category: "Backend & APIs",
    aliases: ["Nest"],
    relatedSkills: ["TypeScript", "Node.js", "Dependency Injection", "Microservices"],
    description:
      "Progressive Node.js framework for building efficient, reliable, and scalable enterprise server apps.",
    tags: ["backend", "enterprise", "typescript"],
  },
  {
    id: "be-spring-boot",
    name: "Spring Boot",
    category: "Backend & APIs",
    aliases: ["Spring", "Java Spring"],
    relatedSkills: ["Java", "Microservices", "REST APIs", "JPA", "Hibernate"],
    description:
      "Enterprise Java framework making it easy to create stand-alone, production-grade Spring-based apps.",
    tags: ["backend", "enterprise", "java"],
  },
  {
    id: "be-django",
    name: "Django",
    category: "Backend & APIs",
    aliases: ["Django REST Framework", "DRF"],
    relatedSkills: ["Python", "PostgreSQL", "REST APIs", "ORM"],
    description:
      "High-level Python web framework that encourages rapid development and clean, pragmatic design.",
    tags: ["backend", "python", "fullstack"],
  },
  {
    id: "be-fastapi",
    name: "FastAPI",
    category: "Backend & APIs",
    aliases: ["Fast API"],
    relatedSkills: ["Python", "Pydantic", "REST APIs", "Asyncio", "OpenAPI"],
    description:
      "Modern, high-performance web framework for building APIs with Python based on standard type hints.",
    tags: ["backend", "python", "high-performance"],
  },
  {
    id: "be-rest-apis",
    name: "REST APIs",
    category: "Backend & APIs",
    aliases: ["RESTful APIs", "API Design"],
    relatedSkills: ["Node.js", "Express", "FastAPI", "JSON", "HTTP Status Codes"],
    description:
      "Architectural style for building networked software applications utilizing HTTP methods.",
    tags: ["backend", "architecture", "standards"],
  },
  {
    id: "be-graphql",
    name: "GraphQL",
    category: "Backend & APIs",
    aliases: ["Apollo GraphQL"],
    relatedSkills: ["Node.js", "TypeScript", "REST APIs", "API Design"],
    description:
      "Query language for APIs and a runtime for fulfilling those queries with existing data.",
    tags: ["backend", "api", "query"],
  },
  {
    id: "be-microservices",
    name: "Microservices Architecture",
    category: "Backend & APIs",
    aliases: ["Microservices", "Distributed Systems"],
    relatedSkills: ["Docker", "Kubernetes", "REST APIs", "Kafka", "Message Queues"],
    description:
      "Software architectural style structuring an application as a collection of loosely coupled services.",
    tags: ["architecture", "backend", "enterprise"],
  },
  {
    id: "be-auth",
    name: "Authentication & JWT",
    category: "Backend & APIs",
    aliases: ["OAuth2", "JWT", "Session Auth"],
    relatedSkills: ["REST APIs", "Node.js", "Cybersecurity", "OWASP"],
    description:
      "Mechanisms to verify identity and authorize access control via tokens and standard protocols.",
    tags: ["security", "backend", "identity"],
  },
  {
    id: "be-websockets",
    name: "WebSockets & Real-Time",
    category: "Backend & APIs",
    aliases: ["Socket.io", "Realtime Sync"],
    relatedSkills: ["Node.js", "React", "Redis"],
    description:
      "Full-duplex communication channels over a single TCP connection for real-time collaboration.",
    tags: ["backend", "realtime", "networking"],
  },

  // ================= DATABASES & STORAGE =================
  {
    id: "db-postgresql",
    name: "PostgreSQL",
    category: "Databases & Storage",
    aliases: ["Postgres", "PG"],
    relatedSkills: ["SQL", "Database Design", "Query Optimization", "Prisma"],
    description:
      "Powerful, open source object-relational database system with strong reliability and feature completeness.",
    tags: ["rdbms", "sql", "popular"],
  },
  {
    id: "db-mysql",
    name: "MySQL",
    category: "Databases & Storage",
    aliases: ["MariaDB"],
    relatedSkills: ["SQL", "Database Design", "PHP", "Node.js"],
    description: "Popular open-source relational database management system.",
    tags: ["rdbms", "sql"],
  },
  {
    id: "db-mongodb",
    name: "MongoDB",
    category: "Databases & Storage",
    aliases: ["Mongo", "Mongoose"],
    relatedSkills: ["Node.js", "NoSQL", "JSON", "Express"],
    description: "Document-based distributed database designed for modern apps and cloud scaling.",
    tags: ["nosql", "documents"],
  },
  {
    id: "db-redis",
    name: "Redis",
    category: "Databases & Storage",
    aliases: ["Redis Cache"],
    relatedSkills: ["Caching", "Message Queues", "Node.js", "WebSockets"],
    description:
      "In-memory data structure store used as a database, cache, message broker, and streaming engine.",
    tags: ["caching", "in-memory", "nosql"],
  },
  {
    id: "db-design",
    name: "Database Design & Normalization",
    category: "Databases & Storage",
    aliases: ["ER Diagrams", "Schema Design", "1NF 2NF 3NF"],
    relatedSkills: ["PostgreSQL", "SQL", "DBMS", "Data Modeling"],
    description:
      "Designing optimal database schemas, relationships, indexing strategies, and normalization tiers.",
    tags: ["fundamentals", "databases", "architecture"],
  },
  {
    id: "db-query-opt",
    name: "Query Optimization & Indexing",
    category: "Databases & Storage",
    aliases: ["EXPLAIN ANALYZE", "B-Tree Indexing"],
    relatedSkills: ["SQL", "PostgreSQL", "MySQL", "Database Design"],
    description:
      "Analyzing query execution plans and designing indexes to accelerate database retrieval speeds.",
    tags: ["performance", "sql", "optimization"],
  },

  // ================= DATA & ANALYTICS =================
  {
    id: "data-pandas",
    name: "Pandas",
    category: "Data & Analytics",
    aliases: ["Python Pandas"],
    relatedSkills: ["Python", "NumPy", "Data Cleaning", "Data Analysis"],
    description:
      "Fast, powerful, and flexible open source data analysis and manipulation tool for Python.",
    tags: ["python", "data", "analytics"],
  },
  {
    id: "data-numpy",
    name: "NumPy",
    category: "Data & Analytics",
    aliases: ["Numerical Python"],
    relatedSkills: ["Python", "Pandas", "Linear Algebra", "Machine Learning"],
    description:
      "Fundamental package for scientific computing in Python with multi-dimensional array support.",
    tags: ["python", "math", "data"],
  },
  {
    id: "data-powerbi",
    name: "Power BI",
    category: "Data & Analytics",
    aliases: ["Microsoft Power BI", "DAX"],
    relatedSkills: ["Excel", "SQL", "Data Visualization", "Business Analytics"],
    description:
      "Interactive data visualization and business intelligence tool developed by Microsoft.",
    tags: ["bi", "visualization", "enterprise"],
  },
  {
    id: "data-tableau",
    name: "Tableau",
    category: "Data & Analytics",
    aliases: ["Tableau Desktop"],
    relatedSkills: ["Data Visualization", "SQL", "Business Analytics"],
    description: "Visual analytics platform transforming the way we use data to solve problems.",
    tags: ["visualization", "bi"],
  },
  {
    id: "data-excel",
    name: "Excel / Advanced Spreadsheets",
    category: "Data & Analytics",
    aliases: ["Microsoft Excel", "Pivot Tables", "VLOOKUP"],
    relatedSkills: ["Data Analysis", "Statistics", "Power BI"],
    description:
      "Spreadsheet tool for calculations, pivot modeling, statistical formulas, and summary reports.",
    tags: ["basics", "analytics", "business"],
  },
  {
    id: "data-etl",
    name: "ETL & Data Pipelines",
    category: "Data & Analytics",
    aliases: ["Extract Transform Load", "Airflow"],
    relatedSkills: ["SQL", "Python", "Data Engineer", "Spark"],
    description:
      "Extracting, transforming, and loading structured and semi-structured data between systems.",
    tags: ["data-engineering", "pipelines"],
  },

  // ================= AI & MACHINE LEARNING =================
  {
    id: "ai-ml-fundamentals",
    name: "Machine Learning Fundamentals",
    category: "AI & Machine Learning",
    aliases: ["Supervised Learning", "Unsupervised Learning", "ML"],
    relatedSkills: ["Python", "Scikit-learn", "Statistics", "Deep Learning"],
    description:
      "Foundational predictive modeling, classification, regression, and clustering algorithms.",
    tags: ["ai", "core", "algorithms"],
  },
  {
    id: "ai-pytorch",
    name: "PyTorch",
    category: "AI & Machine Learning",
    aliases: ["Torch"],
    relatedSkills: ["Python", "Deep Learning", "TensorFlow", "Neural Networks"],
    description:
      "Leading open source deep learning framework optimized for research prototyping to production.",
    tags: ["deep-learning", "ai", "framework"],
  },
  {
    id: "ai-tensorflow",
    name: "TensorFlow / Keras",
    category: "AI & Machine Learning",
    aliases: ["TF", "Keras"],
    relatedSkills: ["Python", "Deep Learning", "PyTorch"],
    description:
      "End-to-end open source platform for machine learning and neural network training.",
    tags: ["deep-learning", "ai"],
  },
  {
    id: "ai-scikit",
    name: "Scikit-learn",
    category: "AI & Machine Learning",
    aliases: ["sklearn"],
    relatedSkills: ["Python", "Pandas", "Machine Learning", "NumPy"],
    description:
      "Simple and efficient tools for predictive data analysis and classical machine learning in Python.",
    tags: ["python", "ml"],
  },
  {
    id: "ai-genai",
    name: "Generative AI & LLMs",
    category: "AI & Machine Learning",
    aliases: ["Large Language Models", "GPT", "Gemini", "Claude"],
    relatedSkills: ["Prompt Engineering", "Python", "LangChain", "RAG"],
    description:
      "Architectures, fine-tuning, retrieval-augmented generation (RAG), and agentic workflows.",
    tags: ["ai", "emerging", "llms"],
  },
  {
    id: "ai-prompt-eng",
    name: "Prompt Engineering & RAG",
    category: "AI & Machine Learning",
    aliases: ["Retrieval Augmented Generation", "Prompt Design"],
    relatedSkills: ["Generative AI & LLMs", "Python", "Vector Databases"],
    description:
      "Optimizing instructions and grounding LLMs with context retrieval systems for reliable outputs.",
    tags: ["ai", "practical", "genai"],
  },
  {
    id: "ai-nlp",
    name: "Natural Language Processing (NLP)",
    category: "AI & Machine Learning",
    aliases: ["Text Mining", "Transformers", "BERT"],
    relatedSkills: ["Python", "PyTorch", "Generative AI & LLMs"],
    description:
      "Techniques allowing computational systems to process, interpret, and generate human language.",
    tags: ["ai", "nlp"],
  },
  {
    id: "ai-cv",
    name: "Computer Vision",
    category: "AI & Machine Learning",
    aliases: ["OpenCV", "CNNs", "Object Detection"],
    relatedSkills: ["Python", "PyTorch", "Deep Learning"],
    description: "Algorithms enabling computers to interpret digital images and visual telemetry.",
    tags: ["ai", "vision"],
  },

  // ================= CLOUD COMPUTING =================
  {
    id: "cloud-aws",
    name: "Amazon Web Services (AWS)",
    category: "Cloud Computing",
    aliases: ["AWS", "Amazon Cloud"],
    relatedSkills: ["EC2", "S3", "Lambda", "IAM", "Cloud Architecture", "Docker"],
    description:
      "Comprehensive cloud platform offering compute, storage, databases, and managed AI services.",
    tags: ["cloud", "popular", "enterprise"],
  },
  {
    id: "cloud-gcp",
    name: "Google Cloud Platform (GCP)",
    category: "Cloud Computing",
    aliases: ["GCP", "Google Cloud"],
    relatedSkills: ["BigQuery", "Compute Engine", "Cloud Run", "Kubernetes"],
    description:
      "Suite of cloud computing services running on the same infrastructure Google uses internally.",
    tags: ["cloud", "data"],
  },
  {
    id: "cloud-azure",
    name: "Microsoft Azure",
    category: "Cloud Computing",
    aliases: ["Azure Cloud"],
    relatedSkills: [".NET", "Cloud Architecture", "Active Directory", "Docker"],
    description:
      "Cloud computing service created by Microsoft for building, testing, and managing apps.",
    tags: ["cloud", "enterprise"],
  },
  {
    id: "cloud-docker",
    name: "Docker",
    category: "Cloud Computing",
    aliases: ["Containers", "Dockerfile"],
    relatedSkills: ["Kubernetes", "Linux", "CI/CD", "DevOps"],
    description:
      "Platform for developing, shipping, and running applications in lightweight isolated containers.",
    tags: ["containers", "devops", "essential"],
  },
  {
    id: "cloud-kubernetes",
    name: "Kubernetes",
    category: "Cloud Computing",
    aliases: ["K8s", "Container Orchestration"],
    relatedSkills: ["Docker", "Cloud Computing", "DevOps", "Helm"],
    description:
      "Automated container orchestration system for deploying, scaling, and managing cloud apps.",
    tags: ["orchestration", "devops", "cloud"],
  },
  {
    id: "cloud-terraform",
    name: "Terraform & IaC",
    category: "Cloud Computing",
    aliases: ["Infrastructure as Code", "HCL"],
    relatedSkills: ["AWS", "DevOps", "Cloud Architecture"],
    description:
      "Infrastructure as Code tool that lets you build, change, and version cloud resources safely.",
    tags: ["devops", "cloud", "iac"],
  },

  // ================= DEVOPS & PLATFORM =================
  {
    id: "devops-git",
    name: "Git & Version Control",
    category: "DevOps & Platform",
    aliases: ["Git", "GitHub", "GitLab"],
    relatedSkills: ["GitHub Actions", "CI/CD", "Code Review"],
    description:
      "Distributed version control system for tracking changes in source code during software development.",
    tags: ["essential", "collaboration", "version-control"],
  },
  {
    id: "devops-cicd",
    name: "CI/CD & GitHub Actions",
    category: "DevOps & Platform",
    aliases: ["Continuous Integration", "Continuous Deployment", "Workflows"],
    relatedSkills: ["Git & Version Control", "Docker", "Test Automation"],
    description:
      "Automating test runs, artifact compilation, container builds, and production deployments.",
    tags: ["devops", "automation", "pipelines"],
  },
  {
    id: "devops-linux",
    name: "Linux Systems Administration",
    category: "DevOps & Platform",
    aliases: ["Ubuntu", "CentOS", "Linux CLI"],
    relatedSkills: ["Shell / Bash", "Networking", "DevOps"],
    description:
      "Configuring permissions, services, processes, and network sockets in Unix/Linux environments.",
    tags: ["systems", "infrastructure", "core"],
  },
  {
    id: "devops-monitoring",
    name: "Monitoring & Observability",
    category: "DevOps & Platform",
    aliases: ["Prometheus", "Grafana", "Datadog", "OpenTelemetry"],
    relatedSkills: ["DevOps", "Linux", "Kubernetes"],
    description:
      "Collecting system metrics, structured logs, and distributed traces to maintain high uptime.",
    tags: ["devops", "reliability", "metrics"],
  },

  // ================= CYBERSECURITY =================
  {
    id: "sec-network",
    name: "Network Security",
    category: "Cybersecurity",
    aliases: ["Firewalls", "VPNs", "Packet Analysis", "Wireshark"],
    relatedSkills: ["Computer Networks", "Cybersecurity", "Linux"],
    description:
      "Protecting the integrity, confidentiality, and accessibility of computer networks and data.",
    tags: ["security", "networking"],
  },
  {
    id: "sec-app-sec",
    name: "Application Security & OWASP",
    category: "Cybersecurity",
    aliases: ["OWASP Top 10", "AppSec", "Secure Coding"],
    relatedSkills: ["Authentication & JWT", "Cybersecurity", "Web Development"],
    description:
      "Practices to prevent vulnerabilities like SQL injection, XSS, and CSRF in software applications.",
    tags: ["security", "web", "standards"],
  },
  {
    id: "sec-ethical-hacking",
    name: "Ethical Hacking & Penetration Testing",
    category: "Cybersecurity",
    aliases: ["Pen Testing", "Kali Linux", "Burp Suite"],
    relatedSkills: ["Network Security", "Application Security", "Linux"],
    description:
      "Authorized simulated cyberattacks against computer systems to check for exploitable flaws.",
    tags: ["security", "practical"],
  },
  {
    id: "sec-crypto",
    name: "Cryptography & PKI",
    category: "Cybersecurity",
    aliases: ["Public Key Crypto", "TLS/SSL", "AES", "RSA"],
    relatedSkills: ["Computer Science Fundamentals", "Security"],
    description:
      "Mathematical techniques for secure communication, hashing, digital signatures, and encryption.",
    tags: ["security", "math", "core"],
  },

  // ================= COMPUTER SCIENCE FUNDAMENTALS =================
  {
    id: "cs-dsa",
    name: "Data Structures & Algorithms",
    category: "Computer Science Fundamentals",
    aliases: ["DSA", "LeetCode", "Data Structures", "Algorithms"],
    relatedSkills: ["C++", "Java", "Python", "Problem Solving"],
    description:
      "Trees, graphs, dynamic programming, sorting, and algorithmic complexity analysis (Big-O).",
    tags: ["core", "fundamentals", "essential"],
  },
  {
    id: "cs-oop",
    name: "Object-Oriented Programming (OOP)",
    category: "Computer Science Fundamentals",
    aliases: ["OOP", "Classes", "Inheritance", "Polymorphism", "Encapsulation"],
    relatedSkills: ["Java", "C++", "Python", "Design Patterns"],
    description: "Programming paradigm based on the concept of objects containing data and code.",
    tags: ["core", "architecture"],
  },
  {
    id: "cs-os",
    name: "Operating Systems",
    category: "Computer Science Fundamentals",
    aliases: ["OS", "Process Scheduling", "Memory Management", "Concurrency"],
    relatedSkills: ["C", "Linux Systems Administration", "Computer Architecture"],
    description: "Processes, threads, deadlock handling, virtual memory, paging, and system calls.",
    tags: ["core", "systems"],
  },
  {
    id: "cs-networks",
    name: "Computer Networks",
    category: "Computer Science Fundamentals",
    aliases: ["TCP/IP", "OSI Model", "DNS", "HTTP/HTTPS"],
    relatedSkills: ["Network Security", "Web Development", "WebSockets"],
    description:
      "Protocol layers, IP addressing, TCP congestion control, routing, and DNS resolution.",
    tags: ["core", "networking"],
  },
  {
    id: "cs-dbms",
    name: "DBMS Fundamentals",
    category: "Computer Science Fundamentals",
    aliases: ["ACID Properties", "Transaction Management", "Concurrency Control"],
    relatedSkills: ["SQL", "PostgreSQL", "Database Design"],
    description:
      "Transaction processing, ACID guarantees, lock mechanisms, and recovery algorithms.",
    tags: ["core", "databases"],
  },
  {
    id: "cs-sys-design",
    name: "System Design & Distributed Systems",
    category: "Computer Science Fundamentals",
    aliases: ["High Level Design", "HLD", "Scalability", "CAP Theorem"],
    relatedSkills: ["Microservices Architecture", "Redis", "Cloud Architecture"],
    description:
      "Designing distributed architectures handling millions of requests with load balancing and sharding.",
    tags: ["architecture", "scaling", "advanced"],
  },

  // ================= SOFTWARE ENGINEERING PRACTICES =================
  {
    id: "se-agile",
    name: "Agile & Scrum Methodologies",
    category: "Software Engineering Practices",
    aliases: ["Sprint Planning", "Jira", "Standups"],
    relatedSkills: ["Git & Version Control", "Software Engineering"],
    description:
      "Iterative software development framework emphasizing rapid feedback and team collaboration.",
    tags: ["process", "management"],
  },
  {
    id: "se-testing",
    name: "Unit & Integration Testing",
    category: "Software Engineering Practices",
    aliases: ["Jest", "PyTest", "JUnit", "TDD"],
    relatedSkills: ["JavaScript", "Python", "CI/CD & GitHub Actions"],
    description:
      "Writing automated test suites ensuring individual modules and integrated systems function properly.",
    tags: ["testing", "quality", "essential"],
  },
  {
    id: "se-design-patterns",
    name: "Design Patterns & Clean Code",
    category: "Software Engineering Practices",
    aliases: ["SOLID Principles", "Factory Pattern", "Singleton", "Clean Architecture"],
    relatedSkills: ["Object-Oriented Programming (OOP)", "Software Architecture"],
    description:
      "Reusable solutions to common software design problems adhering to SOLID principles.",
    tags: ["code-quality", "architecture"],
  },
  {
    id: "se-code-review",
    name: "Code Review & Collaborative Development",
    category: "Software Engineering Practices",
    aliases: ["Pull Requests", "PR Reviews"],
    relatedSkills: ["Git & Version Control", "Clean Code"],
    description:
      "Reviewing peer code for correctness, performance, security, and adherence to team guidelines.",
    tags: ["collaboration", "quality"],
  },

  // ================= UI / UX & PRODUCT DESIGN =================
  {
    id: "design-figma",
    name: "Figma",
    category: "UI / UX & Product Design",
    aliases: ["Figma Prototyping", "Auto Layout"],
    relatedSkills: ["UI / UX & Product Design", "Design Systems", "Prototyping"],
    description:
      "Industry-standard collaborative interface design, wireframing, and interactive prototyping tool.",
    tags: ["design", "ui", "prototyping", "popular"],
  },
  {
    id: "design-user-research",
    name: "User Research & Usability Testing",
    category: "UI / UX & Product Design",
    aliases: ["User Interviews", "Usability Audits"],
    relatedSkills: ["Figma", "UI / UX & Product Design"],
    description:
      "Conducting user interviews, gathering qualitative insights, and testing interactive task completion.",
    tags: ["ux", "research"],
  },
  {
    id: "design-systems",
    name: "Design Systems & Component Libraries",
    category: "UI / UX & Product Design",
    aliases: ["Design Tokens", "Component Sets"],
    relatedSkills: ["Figma", "Tailwind CSS", "React"],
    description:
      "Standardizing reusable components, typography scales, color tokens, and design guidelines.",
    tags: ["design", "ui", "systems"],
  },

  // ================= EMERGING & SPECIALIZED TECHNOLOGIES =================
  {
    id: "emg-blockchain",
    name: "Blockchain & Web3",
    category: "Emerging & Specialized Technologies",
    aliases: ["Solidity", "Smart Contracts", "Ethereum"],
    relatedSkills: ["Cryptography & PKI", "Distributed Systems"],
    description:
      "Decentralized ledgers, cryptographic smart contracts, and Web3 application protocols.",
    tags: ["emerging", "blockchain"],
  },
  {
    id: "emg-embedded",
    name: "Embedded Systems & Microcontrollers",
    category: "Emerging & Specialized Technologies",
    aliases: ["Arduino", "ESP32", "STM32", "ARM"],
    relatedSkills: ["C", "C++", "IoT & Hardware Prototyping"],
    description:
      "Programming microcontrollers, GPIO peripherals, and real-time hardware interfaces.",
    tags: ["hardware", "embedded"],
  },
  {
    id: "emg-iot",
    name: "IoT & Hardware Prototyping",
    category: "Emerging & Specialized Technologies",
    aliases: ["Internet of Things", "MQTT", "Raspberry Pi"],
    relatedSkills: ["Python", "Embedded Systems & Microcontrollers"],
    description: "Building networked sensor telemetry arrays and smart hardware devices.",
    tags: ["hardware", "iot"],
  },
  {
    id: "emg-game-dev",
    name: "Game Development",
    category: "Emerging & Specialized Technologies",
    aliases: ["Unity", "Unreal Engine", "Godot"],
    relatedSkills: ["C#", "C++", "Computer Graphics"],
    description:
      "Building 2D and 3D interactive real-time game experiences and physics simulations.",
    tags: ["games", "graphics"],
  },
];
