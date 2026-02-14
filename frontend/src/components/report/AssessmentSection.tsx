import { useState } from "react";
import { API } from "../../lib/api";

interface MCQ {
    question: string;
    options: string[];
    answer: string;
}

interface HiringTest {
    codingRound: string[];
    mcqs: MCQ[];
    projectTask: string;
}

interface Props {
    candidateData?: {
        name: string;
        skills?: string[];
        score: number;
        strengths?: string[];
        weaknesses?: string[];
    };
}

const FALLBACK_TEST: HiringTest = {
    codingRound: [
        "Build a REST API with CRUD operations for a task management system.",
        "Implement a function that finds the longest substring without repeating characters.",
    ],
    mcqs: [
        { question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], answer: "O(log n)" },
        { question: "Which HTTP method is idempotent?", options: ["POST", "PATCH", "PUT", "None"], answer: "PUT" },
        { question: "What does ACID stand for in databases?", options: ["Atomicity, Consistency, Isolation, Durability", "Association, Consistency, Isolation, Durability", "Atomicity, Concurrency, Isolation, Durability", "Atomicity, Consistency, Integration, Durability"], answer: "Atomicity, Consistency, Isolation, Durability" },
        { question: "What is the purpose of an index in a database?", options: ["To enforce constraints", "To speed up query performance", "To normalize data", "To create backups"], answer: "To speed up query performance" },
        { question: "Which data structure uses LIFO ordering?", options: ["Queue", "Stack", "Linked List", "Tree"], answer: "Stack" },
    ],
    projectTask: "Build a mini full-stack URL shortener with analytics: REST API backend, simple frontend, and a dashboard showing click counts.",
};

export default function AssessmentSection({ candidateData }: Props) {
    const [showAssessment, setShowAssessment] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [test, setTest] = useState<HiringTest | null>(null);
    const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());

    const handleGenerate = async () => {
        setGenerating(true);
        setRevealedAnswers(new Set());

        try {
            const res = await fetch(`${API}/api/hiring-test`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    candidateData ?? { name: "Candidate", skills: [], score: 0, strengths: [], weaknesses: [] }
                ),
            });

            if (!res.ok) throw new Error("API error");

            const data = await res.json();
            console.log("[AssessmentSection] Generated test:", data);

            if (data.codingRound && data.mcqs && data.projectTask) {
                setTest(data as HiringTest);
            } else {
                setTest(FALLBACK_TEST);
            }
        } catch (err) {
            console.error("[AssessmentSection] API failed, using fallback:", err);
            setTest(FALLBACK_TEST);
        } finally {
            setGenerating(false);
            setShowAssessment(true);
        }
    };

    const toggleAnswer = (idx: number) => {
        setRevealedAnswers((prev) => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    };

    return (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                    AI Hiring Test Generator
                </h3>

                {!showAssessment && (
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:cursor-not-allowed bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-60"
                    >
                        {generating ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Generating...
                            </span>
                        ) : (
                            "Generate Hiring Test"
                        )}
                    </button>
                )}

                {showAssessment && (
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] border border-white/10 text-white/60 hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {generating ? "Regenerating..." : "Regenerate"}
                    </button>
                )}
            </div>

            {showAssessment && test && (
                <div className="space-y-6">
                    {/* Coding Round */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-2">
                            <span>💻</span> Coding Round
                        </p>
                        <div className="space-y-2">
                            {test.codingRound.map((task, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-purple-500/20 hover:bg-white/[0.04] transition-colors"
                                >
                                    <span className="shrink-0 w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-xs font-bold text-purple-400">
                                        {i + 1}
                                    </span>
                                    <p className="text-white/70 text-sm leading-relaxed pt-0.5">{task}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MCQs */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                            <span>🧠</span> Multiple Choice Questions
                        </p>
                        <div className="space-y-3">
                            {test.mcqs.map((mcq, i) => (
                                <div
                                    key={i}
                                    className="p-4 rounded-xl bg-white/[0.02] border border-cyan-500/20 hover:bg-white/[0.04] transition-colors"
                                >
                                    <p className="text-white/80 text-sm font-medium mb-3">
                                        <span className="text-cyan-400 mr-2">Q{i + 1}.</span>
                                        {mcq.question}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                                        {mcq.options.map((opt, j) => (
                                            <div
                                                key={j}
                                                className={`px-3 py-2 rounded-lg text-xs border transition-colors ${revealedAnswers.has(i) && opt === mcq.answer
                                                        ? "border-green-500/40 bg-green-500/10 text-green-300"
                                                        : "border-white/10 bg-white/[0.02] text-white/50"
                                                    }`}
                                            >
                                                <span className="text-white/30 mr-1.5 font-semibold">
                                                    {String.fromCharCode(65 + j)}.
                                                </span>
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => toggleAnswer(i)}
                                        className="text-xs text-cyan-400/60 hover:text-cyan-400 transition-colors cursor-pointer"
                                    >
                                        {revealedAnswers.has(i) ? "Hide Answer" : "Show Answer"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Project Task */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                            <span>🚀</span> Project Assignment
                        </p>
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-emerald-500/20">
                            <p className="text-white/70 text-sm leading-relaxed">{test.projectTask}</p>
                        </div>
                    </div>
                </div>
            )}

            {!showAssessment && !generating && (
                <p className="text-white/30 text-sm text-center py-8">
                    Generate a comprehensive hiring test with coding challenges, MCQs, and a project assignment tailored to this candidate.
                </p>
            )}
        </div>
    );
}
