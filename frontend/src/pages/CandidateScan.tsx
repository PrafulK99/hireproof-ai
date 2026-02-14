import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../lib/api";
import { getMockCandidate } from "../lib/mockData";
import type { Candidate } from "../types/candidate";

const LOADING_STEPS = [
    "Analyzing GitHub profile...",
    "Calculating authenticity score...",
    "Generating AI insights...",
];

export default function CandidateScan() {
    const navigate = useNavigate();
    const [githubUrl, setGithubUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [error, setError] = useState("");
    const [dots, setDots] = useState("");

    // Animated dots
    useEffect(() => {
        if (!loading) return;
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 400);
        return () => clearInterval(interval);
    }, [loading]);

    // Step through loading messages
    useEffect(() => {
        if (!loading) return;
        const interval = setInterval(() => {
            setLoadingStep((prev) =>
                prev < LOADING_STEPS.length - 1 ? prev + 1 : prev
            );
        }, 2000);
        return () => clearInterval(interval);
    }, [loading]);

    const isValidUrl = (url: string) =>
        /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/.test(url.trim());

    const handleAnalyze = async () => {
        setError("");

        if (!githubUrl.trim()) {
            setError("Please enter a GitHub profile URL.");
            return;
        }

        if (!isValidUrl(githubUrl)) {
            setError("Invalid GitHub URL. Use format: https://github.com/username");
            return;
        }

        setLoading(true);
        setLoadingStep(0);

        try {
            const res = await fetch(`${API}/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ githubUrl: githubUrl.trim() }),
            });

            if (!res.ok) throw new Error("API returned error");

            const candidate: Candidate = await res.json();
            localStorage.setItem("candidate", JSON.stringify(candidate));
            navigate(`/candidate/${candidate.id}`);
        } catch (err) {
            console.error("[CandidateScan] API failed:", err);
            setError("GitHub analysis failed. Using demo data.");

            const mock = getMockCandidate();
            localStorage.setItem("candidate", JSON.stringify(mock));

            setTimeout(() => {
                navigate(`/candidate/${mock.id}`);
            }, 1500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background gradient orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-lg z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Hire<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Proof</span>{" "}
                        <span className="text-white/60 font-light">AI</span>
                    </h1>
                    <p className="text-white/40 text-sm mt-1">
                        AI-powered candidate intelligence
                    </p>
                </div>

                {/* Glass card */}
                <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/40">
                    <h2 className="text-xl font-semibold text-white mb-1">
                        Scan Candidate
                    </h2>
                    <p className="text-white/40 text-sm mb-6">
                        Paste a GitHub profile to analyze skills, authenticity, and generate
                        interview questions.
                    </p>

                    {/* GitHub URL Input */}
                    <div className="mb-4">
                        <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                            GitHub Profile URL
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-white/30"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </div>
                            <input
                                type="url"
                                value={githubUrl}
                                onChange={(e) => setGithubUrl(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && !loading && handleAnalyze()}
                                placeholder="https://github.com/username"
                                disabled={loading}
                                className="w-full pl-11 pr-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Resume upload (optional) */}
                    <div className="mb-6">
                        <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                            Resume Upload{" "}
                            <span className="text-white/25 normal-case">(optional)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                disabled={loading}
                                className="w-full py-2.5 px-4 bg-white/[0.05] border border-white/[0.1] border-dashed rounded-xl text-white/40 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-white/10 file:text-white/60 hover:file:bg-white/15 file:cursor-pointer cursor-pointer transition-all disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2">
                            <svg
                                className="w-4 h-4 mt-0.5 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                                />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Loading state */}
                    {loading && (
                        <div className="mb-4 px-4 py-4 bg-purple-500/5 border border-purple-500/15 rounded-xl">
                            {LOADING_STEPS.map((step, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-2.5 text-sm transition-all duration-500 ${i < loadingStep
                                            ? "text-green-400"
                                            : i === loadingStep
                                                ? "text-purple-300"
                                                : "text-white/20"
                                        } ${i > 0 ? "mt-2" : ""}`}
                                >
                                    {i < loadingStep ? (
                                        <svg
                                            className="w-4 h-4 shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2.5}
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.5 12.75l6 6 9-13.5"
                                            />
                                        </svg>
                                    ) : i === loadingStep ? (
                                        <div className="w-4 h-4 shrink-0 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <div className="w-4 h-4 shrink-0 rounded-full border border-white/15" />
                                    )}
                                    <span>
                                        {step}
                                        {i === loadingStep && (
                                            <span className="text-purple-400">{dots}</span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CTA Button */}
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] disabled:opacity-60 disabled:hover:shadow-none"
                    >
                        {loading ? "Analyzing..." : "🔍  Analyze Candidate"}
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-white/20 text-xs mt-6">
                    Powered by GitHub API & Gemini AI
                </p>
            </div>
        </div>
    );
}
