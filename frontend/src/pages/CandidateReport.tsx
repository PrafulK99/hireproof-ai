import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Candidate, Skills } from "../types/candidate";
import ScoreCircle from "../components/ui/ScoreCircle";
import RadarChart from "../components/ui/RadarChart";
import InsightCard from "../components/ui/InsightCard";

const SKILL_LABELS: Record<keyof Skills, string> = {
    frontend: "Frontend",
    backend: "Backend",
    dsa: "DSA",
    system: "System Design",
    testing: "Testing",
};

export default function CandidateReport() {
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [toast, setToast] = useState(false);
    const [shortlisted, setShortlisted] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("candidate");
            if (raw) {
                setCandidate(JSON.parse(raw));
            }
        } catch {
            setCandidate(null);
        }
    }, []);

    const handleShortlist = () => {
        setShortlisted(true);
        setToast(true);
        setTimeout(() => setToast(false), 3000);
    };

    // Empty state
    if (candidate === null) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">No candidate found</h2>
                    <p className="text-white/40 text-sm mb-8">Go back to scan a candidate first.</p>
                    <button
                        onClick={() => navigate("/scan")}
                        className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all cursor-pointer"
                    >
                        ← Go to Scan
                    </button>
                </div>
            </div>
        );
    }

    const maxSkill = Math.max(...Object.values(candidate.skills), 1);

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
            {/* Background gradient orbs */}
            <div className="absolute top-[-15%] left-[-5%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-[50%] left-[50%] w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none" />

            {/* Toast notification */}
            <div
                className={`fixed top-6 right-6 z-50 transition-all duration-500 ${toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                    }`}
            >
                <div className="flex items-center gap-3 px-5 py-3.5 bg-green-500/15 backdrop-blur-xl border border-green-500/30 rounded-xl shadow-2xl">
                    <svg className="w-5 h-5 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-300 text-sm font-medium">Candidate shortlisted</span>
                </div>
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/[0.06]">
                <button
                    onClick={() => navigate("/scan")}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    <span className="text-sm font-medium">Back</span>
                </button>

                <h1 className="text-xl font-bold text-white tracking-tight">
                    Hire<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Proof</span>{" "}
                    <span className="text-white/60 font-light">AI</span>
                </h1>

                <button
                    onClick={handleShortlist}
                    disabled={shortlisted}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:cursor-default ${shortlisted
                            ? "bg-green-500/15 border border-green-500/30 text-green-400"
                            : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 hover:shadow-lg hover:shadow-purple-500/25"
                        }`}
                >
                    {shortlisted ? "✓ Shortlisted" : "⚡ Shortlist Candidate"}
                </button>
            </header>

            {/* Content */}
            <main className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-10">
                {/* Candidate name */}
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        {candidate.name}
                    </h2>
                    <p className="text-white/40 text-sm mt-1">Candidate Analysis Report</p>
                </div>

                {/* Score Section */}
                <section className="flex justify-center">
                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-10 shadow-2xl shadow-black/30">
                        <ScoreCircle
                            score={candidate.score}
                            label={candidate.authenticityLevel}
                        />
                    </div>
                </section>

                {/* Skills Section: Radar + Breakdown */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Radar Chart */}
                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/20">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                            </svg>
                            Skill Radar
                        </h3>
                        <RadarChart skills={candidate.skills} />
                    </div>

                    {/* Skill Breakdown Bars */}
                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/20">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                            </svg>
                            Skill Breakdown
                        </h3>

                        <div className="space-y-5">
                            {(Object.keys(SKILL_LABELS) as (keyof Skills)[]).map((key) => {
                                const value = candidate.skills[key];
                                const percentage = (value / maxSkill) * 100;
                                return (
                                    <div key={key}>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-sm text-white/60 font-medium">{SKILL_LABELS[key]}</span>
                                            <span className="text-sm font-semibold text-white/80">{value}/10</span>
                                        </div>
                                        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-1000 ease-out"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Insights Section */}
                <section>
                    <h3 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                        </svg>
                        AI Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <InsightCard title="Strengths" items={candidate.strengths} variant="success" />
                        <InsightCard title="Weaknesses" items={candidate.weaknesses} variant="warning" />
                        <InsightCard title="Risk Flags" items={candidate.risks} variant="danger" />
                    </div>
                </section>

                {/* Interview Questions */}
                <section>
                    <h3 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                        </svg>
                        Interview Questions
                    </h3>
                    <div className="space-y-3">
                        {candidate.questions.map((q, i) => (
                            <div
                                key={i}
                                className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl p-5 flex items-start gap-4 hover:bg-white/[0.05] transition-colors"
                            >
                                <span className="shrink-0 w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">
                                    {i + 1}
                                </span>
                                <p className="text-white/70 text-sm leading-relaxed pt-1">{q}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative z-10 text-center py-8 border-t border-white/[0.06]">
                <p className="text-white/20 text-xs">Powered by GitHub API & Gemini AI</p>
            </footer>
        </div>
    );
}
