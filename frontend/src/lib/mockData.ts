import type { Candidate } from "../types/candidate";

export function getMockCandidate(): Candidate {
    return {
        id: "demo-" + Date.now(),
        name: "demo-user",
        profileUrl: "https://portfolio.example/demo-user",
        score: 62,
        authenticityLevel: "Medium",
        skills: {
            frontend: 7,
            backend: 5,
            dsa: 3,
            system: 2,
            testing: 4,
        },
        strengths: [
            "Strong frontend skills with modern frameworks",
            "Consistent GitHub commit history",
            "Multiple public repositories showcasing work",
        ],
        weaknesses: [
            "Limited backend and system design experience",
            "Few testing-related repos",
            "No evidence of DSA practice",
        ],
        risks: [
            "Depth of projects hard to verify from repos alone",
            "May rely heavily on boilerplate/starter templates",
        ],
        questions: [
            "Walk me through the architecture of your most complex project.",
            "How do you approach writing tests for your code?",
            "Describe a challenging bug you fixed and your debugging process.",
            "What design patterns have you used and why?",
            "How do you stay current with new technologies?",
        ],
    };
}
