import axios from "axios";
import { Skills, AIInsights } from "../types";

function getMockInsights(): AIInsights {
    console.log("[aiService] Using mock insights (AI API failed)");
    return {
        strengths: [
            "Demonstrates consistent GitHub activity",
            "Works with multiple programming languages",
            "Has public projects showcasing practical skills",
        ],
        weaknesses: [
            "Limited evidence of testing practices",
            "Few collaborative or open-source contributions",
            "Project documentation could be improved",
        ],
        risks: [
            "Skill depth hard to verify from repos alone",
            "May rely on tutorials without original work",
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

export async function generateInsights(
    skills: Skills,
    score: number
): Promise<AIInsights> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.warn("[aiService] No GEMINI_API_KEY found in env");
        return getMockInsights();
    }

    try {
        console.log("[aiService] Calling Gemini API for insights...");

        const prompt = `You are an expert technical recruiter AI. Analyze the following candidate profile and return ONLY valid JSON (no markdown, no code fences).

Candidate skill scores (0-10):
- Frontend: ${skills.frontend}
- Backend: ${skills.backend}
- DSA: ${skills.dsa}
- System Design: ${skills.system}
- Testing: ${skills.testing}

Overall authenticity score: ${score}/100

Return this exact JSON structure:
{
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "risks": ["risk1", "risk2"],
  "questions": ["question1", "question2", "question3", "question4", "question5"]
}

Make strengths, weaknesses, and risks specific to the skill scores above. Generate 5 targeted technical interview questions based on their strongest areas.`;

        const { data } = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                },
            },
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        const rawText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        console.log("[aiService] Raw AI response received");

        // Parse JSON from AI response (strip markdown fences if present)
        const cleaned = rawText
            .replace(/```json\s*/gi, "")
            .replace(/```\s*/g, "")
            .trim();

        const parsed: AIInsights = JSON.parse(cleaned);

        // Validate shape
        if (
            Array.isArray(parsed.strengths) &&
            Array.isArray(parsed.weaknesses) &&
            Array.isArray(parsed.risks) &&
            Array.isArray(parsed.questions)
        ) {
            console.log("[aiService] Successfully parsed AI insights");
            return parsed;
        }

        console.warn("[aiService] AI response had unexpected shape, using mock");
        return getMockInsights();
    } catch (err: any) {
        console.warn(`[aiService] AI API error: ${err.message}`);
        return getMockInsights();
    }
}
