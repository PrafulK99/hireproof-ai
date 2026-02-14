import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { analyzeGithub } from "../services/githubService";
import { calculateScore } from "../services/scoringService";
import { generateInsights } from "../services/aiService";
import { generateId } from "../utils/id";
import { CandidateReport } from "../types";

const router = Router();

const DB_PATH = path.join(__dirname, "..", "data", "candidates.json");

function readCandidates(): CandidateReport[] {
    try {
        const raw = fs.readFileSync(DB_PATH, "utf-8");
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function saveCandidates(candidates: CandidateReport[]): void {
    fs.writeFileSync(DB_PATH, JSON.stringify(candidates, null, 2), "utf-8");
}

router.post("/analyze", async (req: Request, res: Response): Promise<void> => {
    try {
        const { githubUrl } = req.body;

        if (!githubUrl || typeof githubUrl !== "string") {
            res.status(400).json({ error: "Missing or invalid githubUrl" });
            return;
        }

        // Extract username from GitHub URL
        const match = githubUrl.match(/github\.com\/([a-zA-Z0-9_-]+)/);
        if (!match) {
            res.status(400).json({ error: "Invalid GitHub URL format" });
            return;
        }

        const username = match[1];
        console.log(`\n========== Analyzing: ${username} ==========`);

        // Step 1: Fetch GitHub data
        const signals = await analyzeGithub(username);

        // Step 2: Calculate scores
        const scoreResult = calculateScore(signals);

        // Step 3: Generate AI insights
        const insights = await generateInsights(scoreResult.skills, scoreResult.score);

        // Build the final report
        const report: CandidateReport = {
            id: generateId(),
            name: username,
            github: githubUrl,
            score: scoreResult.score,
            authenticityLevel: scoreResult.authenticityLevel,
            skills: scoreResult.skills,
            strengths: insights.strengths,
            weaknesses: insights.weaknesses,
            risks: insights.risks,
            questions: insights.questions,
        };

        // Save to JSON database
        const candidates = readCandidates();
        candidates.push(report);
        saveCandidates(candidates);
        console.log(`[analyze] Candidate saved to DB (total: ${candidates.length})`);

        res.json(report);
    } catch (err: any) {
        console.error(`[analyze] Fatal error: ${err.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
