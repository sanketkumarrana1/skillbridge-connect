import type {
  Mentor,
  MentorshipRequest,
  MentorshipSession,
  PlacementHistoryItem,
} from "@/types/mentorship";

export const INITIAL_MENTORS: Mentor[] = [
  {
    id: "mentor-ind-01",
    name: "Priyanshu Dave",
    type: "industry",
    organization: "Razorpay",
    departmentOrTitle: "Principal Frontend Architect",
    expertise: ["Frontend Architecture", "React & TypeScript", "Distributed UI", "Career Guidance"],
    skills: ["React", "TypeScript", "Microfrontends", "Design Systems", "Web Performance"],
    experienceYears: 11,
    areasOfMentorship: [
      "Technical Portfolio Review",
      "System Architecture Mock Interviews",
      "Career Growth in Fintech",
    ],
    sessionDurationMinutes: 45,
    availability: [
      {
        dayOfWeek: "Tuesday",
        timeSlots: ["10:00 AM - 10:45 AM", "04:00 PM - 04:45 PM"],
      },
      {
        dayOfWeek: "Thursday",
        timeSlots: ["02:00 PM - 02:45 PM", "05:00 PM - 05:45 PM"],
      },
      {
        dayOfWeek: "Saturday",
        timeSlots: ["11:00 AM - 11:45 AM"],
      },
    ],
    bio: "Leading payments core UI at Razorpay. Passionate about helping campus engineers master real-world production web engineering and scalable architecture.",
    ratingSummary: {
      averageRating: 4.9,
      totalReviews: 28,
      helpfulCount: 27,
    },
    linkedInUrl: "https://linkedin.com/in/priyanshu-dave-razorpay",
  },
  {
    id: "mentor-ind-02",
    name: "Tanvi Joshi",
    type: "industry",
    organization: "Swiggy",
    departmentOrTitle: "Staff AI & Recommendation Scientist",
    expertise: ["Machine Learning", "Recommendation Engines", "PyTorch", "Graph Neural Networks"],
    skills: ["Python", "PyTorch", "FastAPI", "Vector Search", "MLOps"],
    experienceYears: 9,
    areasOfMentorship: [
      "Applied ML Project Guidance",
      "Transitioning from Academia to AI Labs",
      "Research Paper Translation to Code",
    ],
    sessionDurationMinutes: 45,
    availability: [
      {
        dayOfWeek: "Wednesday",
        timeSlots: ["03:00 PM - 03:45 PM", "04:00 PM - 04:45 PM"],
      },
      {
        dayOfWeek: "Friday",
        timeSlots: ["11:00 AM - 11:45 AM", "02:00 PM - 02:45 PM"],
      },
    ],
    bio: "Spearheading food recommendation algorithms at Swiggy. Experienced in mentoring students to publish benchmarkable applied AI projects.",
    ratingSummary: {
      averageRating: 4.8,
      totalReviews: 19,
      helpfulCount: 19,
    },
    linkedInUrl: "https://linkedin.com/in/tanvi-joshi-swiggy",
  },
  {
    id: "mentor-ind-03",
    name: "Arvind Menon",
    type: "industry",
    organization: "Zerodha",
    departmentOrTitle: "Head of Core Platform Engineering",
    expertise: ["High-Throughput Systems", "Go & PostgreSQL", "Low Latency", "Fintech Resiliency"],
    skills: ["Go", "PostgreSQL", "Kafka", "Docker", "Linux Kernel Tuning"],
    experienceYears: 14,
    areasOfMentorship: [
      "Backend Scalability Deep Dives",
      "Open Source Contributions",
      "Engineering Leadership",
    ],
    sessionDurationMinutes: 60,
    availability: [
      {
        dayOfWeek: "Monday",
        timeSlots: ["05:00 PM - 06:00 PM"],
      },
      {
        dayOfWeek: "Saturday",
        timeSlots: ["10:00 AM - 11:00 AM", "03:00 PM - 04:00 PM"],
      },
    ],
    bio: "Building zero-debt high-frequency trading infrastructure at Zerodha. Believer in simple architecture, deep algorithmic rigor, and FOSS.",
    ratingSummary: {
      averageRating: 5.0,
      totalReviews: 34,
      helpfulCount: 34,
    },
    linkedInUrl: "https://linkedin.com/in/arvind-menon-zerodha",
  },
  {
    id: "mentor-fac-01",
    name: "Dr. Rajesh Kulkarni",
    type: "faculty",
    organization: "National Institute of Technology Karnataka (NITK)",
    departmentOrTitle: "Professor & Head of Advanced Computing",
    expertise: ["Distributed Systems", "Cloud Computing", "AICTE Curriculum Modernization"],
    skills: ["Distributed Consensus", "Cloud Architecture", "Curriculum Design", "Grant Writing"],
    experienceYears: 18,
    areasOfMentorship: [
      "Academic Research Guidance",
      "Higher Studies & Master's Prep",
      "Final Year Capstone Project Review",
    ],
    sessionDurationMinutes: 30,
    availability: [
      {
        dayOfWeek: "Monday",
        timeSlots: ["02:00 PM - 02:30 PM", "02:30 PM - 03:00 PM"],
      },
      {
        dayOfWeek: "Wednesday",
        timeSlots: ["11:00 AM - 11:30 AM", "11:30 AM - 12:00 PM"],
      },
      {
        dayOfWeek: "Friday",
        timeSlots: ["03:00 PM - 03:30 PM", "03:30 PM - 04:00 PM"],
      },
    ],
    bio: "Senior IEEE Member and Head of Research at NITK. Dedicated to bridging theoretical computing principles with modern industry demand.",
    ratingSummary: {
      averageRating: 4.9,
      totalReviews: 42,
      helpfulCount: 41,
    },
    linkedInUrl: "https://scholar.google.com/citations?user=rajesh-kulkarni",
  },
  {
    id: "mentor-fac-02",
    name: "Dr. Ananya Sen",
    type: "faculty",
    organization: "Indian Institute of Technology (IIT) Bombay",
    departmentOrTitle: "Associate Professor, Department of Computer Science",
    expertise: ["Cybersecurity", "Applied Cryptography", "Zero Knowledge Proofs"],
    skills: ["Cryptography", "Network Security", "Rust", "Formal Verification"],
    experienceYears: 12,
    areasOfMentorship: [
      "Security Auditing Projects",
      "PhD & Research Admissions",
      "Competitive Coding Strategies",
    ],
    sessionDurationMinutes: 45,
    availability: [
      {
        dayOfWeek: "Tuesday",
        timeSlots: ["03:00 PM - 03:45 PM"],
      },
      {
        dayOfWeek: "Thursday",
        timeSlots: ["10:00 AM - 10:45 AM", "11:00 AM - 11:45 AM"],
      },
    ],
    bio: "Researcher in verifiable cryptography and blockchain security. Mentors aspiring researchers and security engineers across top Indian institutes.",
    ratingSummary: {
      averageRating: 4.8,
      totalReviews: 21,
      helpfulCount: 20,
    },
  },
  {
    id: "mentor-fac-03",
    name: "Prof. M. S. Swaminathan",
    type: "faculty",
    organization: "BITS Pilani",
    departmentOrTitle: "Professor of Practice & Incubator Lead",
    expertise: ["Hardware-Software Co-design", "Embedded Systems", "Student Startups"],
    skills: ["Embedded C", "RISC-V", "IoT Architecture", "Venture Building"],
    experienceYears: 22,
    areasOfMentorship: [
      "Hardware Prototype to Product",
      "Campus Startup Pitching",
      "Patent Filing & Intellectual Property",
    ],
    sessionDurationMinutes: 45,
    availability: [
      {
        dayOfWeek: "Wednesday",
        timeSlots: ["02:00 PM - 02:45 PM", "05:00 PM - 05:45 PM"],
      },
      {
        dayOfWeek: "Saturday",
        timeSlots: ["09:00 AM - 09:45 AM", "10:00 AM - 10:45 AM"],
      },
    ],
    bio: "Former Director of Embedded Systems at Texas Instruments, now guiding deep-tech campus startups and applied electronics research at BITS Pilani.",
    ratingSummary: {
      averageRating: 4.9,
      totalReviews: 31,
      helpfulCount: 30,
    },
  },
];

export const INITIAL_MENTORSHIP_REQUESTS: MentorshipRequest[] = [];

export const INITIAL_MENTORSHIP_SESSIONS: MentorshipSession[] = [];

export const INITIAL_PLACEMENT_HISTORY: PlacementHistoryItem[] = [];

