import axios from "axios";
import type { Skills } from "../types";

type AnalysisSignals = {
    url: string;
    title: string;
    text: string;
    wordCount: number;
    linkCount: number;
    fetched: boolean;
};

const SKILL_KEYWORDS: Record<keyof Skills, string[]> = {
    frontend: [
        "react",
        "vue",
        "angular",
        "html",
        "css",
        "javascript",
        "typescript",
        "tailwind",
        "responsive",
        "ui",
    ],
    backend: [
        "node",
        "express",
        "api",
        "rest",
        "graphql",
        "database",
        "postgres",
        "mongodb",
        "python",
        "java",
        "redis",
        "microservice",
    ],
    dsa: [
        "algorithm",
        "data structure",
        "complexity",
        "binary tree",
        "graph",
        "dynamic programming",
        "leetcode",
        "optimization",
    ],
    system: [
        "scalable",
        "distributed",
        "architecture",
        "system design",
        "queue",
        "cache",
        "load balancer",
        "kubernetes",
        "docker",
        "observability",
    ],
    testing: [
        "test",
        "unit test",
        "integration test",
        "e2e",
        "jest",
        "vitest",
        "cypress",
        "playwright",
        "qa",
        "tdd",
    ],
};

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

function normalizeUrl(input: string): string {
    const trimmed = input.trim();
    const parsed = new URL(trimmed);
    if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Only http/https URLs are supported");
    }
    return parsed.toString();
}

function stripHtml(raw: string): string {
    return raw
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}

function extractTitle(raw: string): string {
    const match = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (!match?.[1]) {
        return "Untitled Profile";
    }
    return match[1].replace(/\s+/g, " ").trim();
}

function countOccurrences(text: string, needle: string): number {
    if (!needle) {
        return 0;
    }
    const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    const matches = text.match(regex);
    return matches ? matches.length : 0;
}

function scoreForKeywords(text: string, keywords: string[]): number {
    const totalHits = keywords.reduce((sum, keyword) => sum + countOccurrences(text, keyword), 0);
    const matchedKeywords = keywords.filter((keyword) => countOccurrences(text, keyword) > 0).length;
    const coverage = matchedKeywords / keywords.length;
    const depth = Math.min(1, totalHits / 20);
    const score = Math.round((coverage * 7 + depth * 3) * 10) / 10;
    return clamp(Math.round(score), 0, 10);
}

function deriveDisplayName(url: string, title: string): string {
    const cleanedTitle = title.split("|")[0].split("-")[0].trim();
    if (cleanedTitle.length >= 3 && cleanedTitle.toLowerCase() !== "home") {
        return cleanedTitle;
    }

    const parsed = new URL(url);
    const lastSegment = parsed.pathname.split("/").filter(Boolean).pop();
    if (lastSegment) {
        return decodeURIComponent(lastSegment).replace(/[-_]/g, " ");
    }
    return parsed.hostname.replace(/^www\./i, "");
}

function buildQuestions(topSkills: (keyof Skills)[]): string[] {
    const bank: Record<keyof Skills, string[]> = {
        frontend: [
            "How do you structure a large frontend codebase to stay maintainable?",
            "What tradeoffs do you consider when optimizing rendering performance?",
        ],
        backend: [
            "How would you design an API that remains backward compatible over time?",
            "How do you handle retries, timeouts, and idempotency in external API calls?",
        ],
        dsa: [
            "Which data structure would you choose for fast lookups with frequent updates, and why?",
            "How do you reason about time and space complexity before coding?",
        ],
        system: [
            "How would you scale this system from 1k to 1M daily users?",
            "What monitoring and alerting would you put in place for this architecture?",
        ],
        testing: [
            "How do you decide the right mix of unit, integration, and end-to-end tests?",
            "How would you prevent flaky tests in a CI pipeline?",
        ],
    };

    const selected: string[] = [];
    topSkills.forEach((skill) => {
        selected.push(...bank[skill]);
    });

    while (selected.length < 5) {
        selected.push("Walk through a recent technical decision and the alternatives you evaluated.");
    }

    return selected.slice(0, 5);
}

export async function analyzeUrl(urlInput: string): Promise<{
    profileUrl: string;
    name: string;
    score: number;
    authenticityLevel: "High" | "Medium" | "Low";
    skills: Skills;
    strengths: string[];
    weaknesses: string[];
    risks: string[];
    questions: string[];
}> {
    const profileUrl = normalizeUrl(urlInput);
    let signals: AnalysisSignals;

    try {
        const { data } = await axios.get<string>(profileUrl, {
            timeout: 7000,
            headers: {
                "User-Agent": "HireProof-Automation/1.0",
                Accept: "text/html,application/xhtml+xml",
            },
            responseType: "text",
            maxContentLength: 1_000_000,
        });

        const html = typeof data === "string" ? data : String(data);
        const text = stripHtml(html);
        const wordCount = text.split(/\s+/).filter(Boolean).length;
        const linkCount = (html.match(/<a\b/gi) || []).length;

        signals = {
            url: profileUrl,
            title: extractTitle(html),
            text,
            wordCount,
            linkCount,
            fetched: true,
        };
    } catch {
        const fallbackText = profileUrl.toLowerCase();
        signals = {
            url: profileUrl,
            title: "Profile",
            text: fallbackText,
            wordCount: fallbackText.split(/\W+/).filter(Boolean).length,
            linkCount: 0,
            fetched: false,
        };
    }

    const skills: Skills = {
        frontend: scoreForKeywords(signals.text, SKILL_KEYWORDS.frontend),
        backend: scoreForKeywords(signals.text, SKILL_KEYWORDS.backend),
        dsa: scoreForKeywords(signals.text, SKILL_KEYWORDS.dsa),
        system: scoreForKeywords(signals.text, SKILL_KEYWORDS.system),
        testing: scoreForKeywords(signals.text, SKILL_KEYWORDS.testing),
    };

    const averageSkill =
        (skills.frontend + skills.backend + skills.dsa + skills.system + skills.testing) / 5;
    const signalBonus = clamp(
        Math.round((Math.min(signals.wordCount, 4000) / 4000) * 12 + Math.min(signals.linkCount, 20) * 0.4),
        0,
        20
    );
    const score = clamp(Math.round(averageSkill * 8 + signalBonus), 0, 100);
    const authenticityLevel: "High" | "Medium" | "Low" =
        score > 75 ? "High" : score > 45 ? "Medium" : "Low";

    const sortedSkills = (Object.entries(skills) as [keyof Skills, number][])
        .sort((a, b) => b[1] - a[1])
        .map(([name]) => name);
    const topSkills = sortedSkills.slice(0, 2);
    const lowSkills = sortedSkills.slice(-2);

    const strengths = [
        `${topSkills[0]} signal is strong based on detected technical terms.`,
        `${topSkills[1]} appears consistently across analyzed content.`,
        signals.wordCount > 500
            ? "Profile has enough technical content for evidence-based evaluation."
            : "Profile is concise and focused on key technical highlights.",
    ];

    const weaknesses = [
        `${lowSkills[0]} evidence is limited in the analyzed URL content.`,
        `${lowSkills[1]} indicators are weaker than other technical areas.`,
        "Adding explicit project outcomes and metrics would improve confidence.",
    ];

    const risks: string[] = [];
    if (!signals.fetched) {
        risks.push("Could not fully crawl URL content; analysis used URL fallback signals.");
    }
    if (signals.wordCount < 120) {
        risks.push("Very low content depth can reduce confidence in score accuracy.");
    }
    if (skills.testing <= 2) {
        risks.push("Minimal testing signals detected.");
    }
    if (risks.length === 0) {
        risks.push("No major risk flags detected from available URL evidence.");
    }

    return {
        profileUrl,
        name: deriveDisplayName(profileUrl, signals.title),
        score,
        authenticityLevel,
        skills,
        strengths,
        weaknesses,
        risks,
        questions: buildQuestions(topSkills),
    };
}
