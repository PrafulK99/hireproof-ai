export interface GitHubSignals {
    repoCount: number;
    stars: number;
    languages: string[];
    activityScore: number;
    projectDepthScore: number;
}

export interface Skills {
    frontend: number;
    backend: number;
    dsa: number;
    system: number;
    testing: number;
}

export interface ScoreResult {
    score: number;
    authenticityLevel: "High" | "Medium" | "Low";
    skills: Skills;
}

export interface AIInsights {
    strengths: string[];
    weaknesses: string[];
    risks: string[];
    questions: string[];
}

export interface CandidateReport {
    id: string;
    name: string;
    github: string;
    score: number;
    authenticityLevel: "High" | "Medium" | "Low";
    skills: Skills;
    strengths: string[];
    weaknesses: string[];
    risks: string[];
    questions: string[];
}
