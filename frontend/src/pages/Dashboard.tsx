import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import type { Candidate } from "../types/candidate";
import { getAuthSession } from "../lib/session";
import { API } from "../lib/api";

export default function Dashboard() {
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const session = getAuthSession();
    const isRecruiter = session?.role !== "candidate";

    useEffect(() => {
        let cancelled = false;

        async function loadCandidates() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API}/api/candidates`);
                if (!res.ok) {
                    throw new Error(`Failed to load candidates (${res.status})`);
                }
                const data = (await res.json()) as Candidate[];
                if (!cancelled) {
                    setCandidates(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load candidates");
                    setCandidates([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadCandidates();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white font-sans overflow-hidden">
            <Sidebar />

            <main className="flex-1 overflow-auto h-screen relative">
                {/* Slight background gradient for the main area */}
                <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />

                <div className="p-10 max-w-7xl mx-auto relative z-10">
                    {/* Top Navbar Area */}
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-white">
                                {isRecruiter ? "Recruiter Intelligence Dashboard" : "Candidate Intelligence Dashboard"}
                            </h2>
                            <p className="text-white/40 text-sm mt-1">Manage and track your analyzed candidates.</p>
                        </div>

                        {isRecruiter ? (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate("/compare")}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.05] border border-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                    </svg>
                                    Compare
                                </button>
                                <button
                                    onClick={() => navigate("/scan")}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all shadow-lg shadow-white/5 active:scale-95 cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Add Candidate
                                </button>
                            </div>
                        ) : null}
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="min-h-[40vh] flex items-center justify-center border border-white/[0.1] rounded-2xl bg-white/[0.02]">
                            <p className="text-white/60 text-sm">Loading candidates...</p>
                        </div>
                    ) : error ? (
                        <div className="min-h-[40vh] flex items-center justify-center border border-red-500/30 rounded-2xl bg-red-500/5">
                            <p className="text-red-300 text-sm">{error}</p>
                        </div>
                    ) : candidates.length === 0 ? (
                        <div className="min-h-[50vh] flex flex-col items-center justify-center border border-dashed border-white/[0.1] rounded-3xl bg-white/[0.02]">
                            <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">No candidates analyzed yet</h3>
                            <p className="text-white/40 text-sm mb-6 max-w-xs text-center">
                                Scan a GitHub profile to get deep insights into a candidate's skills and authenticity.
                            </p>
                            {isRecruiter ? (
                                <button
                                    onClick={() => navigate("/scan")}
                                    className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.05] border border-white/10 hover:bg-white/10 transition-colors text-white"
                                >
                                    Scan First Candidate
                                </button>
                            ) : null}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-white/[0.1] bg-white/[0.02] overflow-hidden pb-2">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[920px] text-sm">
                                    <thead className="bg-white/[0.03] text-white/60">
                                        <tr>
                                            <th className="text-left px-4 py-3 font-medium">Name</th>
                                            <th className="text-left px-4 py-3 font-medium">GitHub</th>
                                            <th className="text-left px-4 py-3 font-medium">Repos</th>
                                            <th className="text-left px-4 py-3 font-medium">Commits (30d)</th>
                                            <th className="text-left px-4 py-3 font-medium">Score</th>
                                            <th className="text-left px-4 py-3 font-medium">Level</th>
                                            <th className="text-left px-4 py-3 font-medium">View Report</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {candidates.map((candidate) => (
                                            <tr key={candidate.id} className="border-t border-white/[0.06] hover:bg-white/[0.03]">
                                                <td className="px-4 py-3 text-white">{candidate.name}</td>
                                                <td className="px-4 py-3 text-white/80">{candidate.githubMonitoring?.username ?? "-"}</td>
                                                <td className="px-4 py-3 text-white/80">{candidate.githubMonitoring?.repoCount ?? 0}</td>
                                                <td className="px-4 py-3 text-white/80">{candidate.githubMonitoring?.totalCommits ?? 0}</td>
                                                <td className="px-4 py-3 text-white">{candidate.score}</td>
                                                <td className="px-4 py-3 text-white/80">{candidate.authenticityLevel}</td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => navigate(`/candidate/${candidate.id}`)}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                                                    >
                                                        View Report
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
