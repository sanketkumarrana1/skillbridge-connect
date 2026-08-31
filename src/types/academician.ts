export interface FacultyPublication {
  id: string;
  title: string;
  journalOrConference: string;
  year: string;
  doiOrUrl?: string | undefined;
  citations?: number | undefined;
  authors?: string[] | undefined;
}

export interface FacultyStats {
  fdpCompleted: number;
  consultancyDelivered: number;
  researchGrantsCount: number;
  menteesGuided: number;
  industryProjectsMentored: number;
}

export interface FacultyProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | undefined;
  institution: string;
  department: string;
  designation: string;
  avatar?: string | undefined;
  areasOfExpertise: string[];
  technicalSkills: string[];
  researchInterests: string[];
  publications: FacultyPublication[];
  yearsOfExperience: number;
  industryExperience: string;
  links: {
    googleScholar?: string | undefined;
    linkedIn?: string | undefined;
    github?: string | undefined;
    orcid?: string | undefined;
    website?: string | undefined;
  };
  stats: FacultyStats;
}

