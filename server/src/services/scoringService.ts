import { GitHubSignals, ScoreResult, Skills } from "../types";

const FRONTEND_LANGS = ["JavaScript", "TypeScript", "HTML", "CSS", "Vue", "Svelte", "Dart"];
const BACKEND_LANGS = ["Python", "Java", "Go", "Ruby", "PHP", "C#", "Rust", "Kotlin", "Elixir"];
const DSA_LANGS = ["C", "C++", "Java", "Python"];
const SYSTEM_LANGS = ["Go", "Rust", "C", "C++", "Shell", "Dockerfile"];
const TESTING_INDICATORS = ["TypeScript", "JavaScript", "Python", "Java"];

function computeSkillScore(languages: string[], indicators: string[]): number {
    const matches = languages.filter((l) => indicators.includes(l)).length;
    return Math.min(10, Math.round((matches / Math.max(indicators.length, 1)) * 10));
}

export function calculateScore(signals: GitHubSignals): ScoreResult {
    console.log("[scoringService] Computing scores...");

    const skills: Skills = {
        frontend: computeSkillScore(signals.languages, FRONTEND_LANGS),
        backend: computeSkillScore(signals.languages, BACKEND_LANGS),
        dsa: computeSkillScore(signals.languages, DSA_LANGS),
        system: computeSkillScore(signals.languages, SYSTEM_LANGS),
        testing: computeSkillScore(signals.languages, TESTING_INDICATORS),
    };

    // Authenticity score formula
    let score =
        signals.repoCount * 2 +
        signals.activityScore * 3 +
        signals.projectDepthScore * 3 +
        signals.stars * 1;

    // Clamp 0–100
    score = Math.max(0, Math.min(100, score));

    const authenticityLevel: "High" | "Medium" | "Low" =
        score > 75 ? "High" : score > 45 ? "Medium" : "Low";

    console.log(`[scoringService] Score: ${score} (${authenticityLevel})`);

    return { score, authenticityLevel, skills };
}
