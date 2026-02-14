export interface Skills {
    frontend: number;
    backend: number;
    dsa: number;
    system: number;
    testing: number;
}

export interface Candidate {
    id: string;
    name: string;
    profileUrl: string;
    score: number;
    authenticityLevel: "High" | "Medium" | "Low";
    skills: Skills;
    strengths: string[];
    weaknesses: string[];
    risks: string[];
    questions: string[];
}
