import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { getAuthSession } from "../lib/session";
import { API } from "../lib/api";
import type { Candidate } from "../types/candidate";

export default function Dashboard() {
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const session = getAuthSession();
    const isRecruiter = session?.role !== "candidate";

    // New UI States
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

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

                if (!user?.id) {
                    if (!cancelled) {
                        setCandidates([]);
                        setLoading(false);
                    }
                    return;
                }

                // Fetch candidates from Supabase
                const { data, error: fetchError } = await supabase
                    .from("candidates")
                    .select("*")
                    .eq("created_by", user.id)
                    .order("created_at", { ascending: false });

                if (fetchError) {
                    throw new Error(fetchError.message);
                }

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

    const getGithubUsername = (url: string): string => {
        try {
            const parts = new URL(url).pathname.split("/").filter(Boolean);
            return parts[0] || "-";
        } catch {
            return "-";
        }
    };

    const levelColor = (level: string) => {
        switch (level) {
            case "High":
                return "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20";
            case "Medium":
                return "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20";
            default:
                return "text-red-400 bg-red-500/10 border border-red-500/20";
        }
    };

    // Derived Stats
    const stats = useMemo(() => {
        const total = candidates.length;
        const avgScore = total > 0 ? Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / total) : 0;
        const highConf = candidates.filter(c => c.authenticity_level === "High").length;
        const tests = Math.floor(total * 0.8); // Mock metric for now
        return { total, avgScore, highConf, tests };
    }, [candidates]);

    // Filtered Candidates
    const filteredCandidates = useMemo(() => {
        return candidates.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.github_url.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === "All" || c.authenticity_level === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [candidates, searchTerm, filterStatus]);

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white font-sans overflow-hidden">
            <Sidebar />

            <main className="flex-1 overflow-auto h-screen relative bg-[#0a0a0f]">
                {/* Background Atmosphere */}
                <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-purple-900/10 via-[#0a0a0f]/50 to-[#0a0a0f] pointer-events-none" />

                <div className="p-8 max-w-7xl mx-auto relative z-10 space-y-8">

                    {/* Header */}
                    <header className="sticky top-0 z-20 flex items-center justify-between backdrop-blur-md bg-[#0a0a0f]/80 py-4 -mx-8 px-8 border-b border-white/5">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                                {isRecruiter ? "Recruiter Dashboard" : "My Dashboard"}
                            </h1>
                            <p className="text-white/40 text-sm">Analyze and compare developer skills.</p>
                        </div>
                        {isRecruiter && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate("/compare")}
                                    className="px-4 py-2 bg-white/[0.05] border border-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-all hover:border-white/20 active:scale-95"
                                >
                                    Compare
                                </button>
                                <button
                                    onClick={() => navigate("/scan")}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all shadow-lg shadow-white/5 active:scale-95"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Scan Candidate
                                </button>
                            </div>
                        )}
                    </header>

                    {/* Stats Grid */}
                    {candidates.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                label="Total Candidates"
                                value={stats.total}
                                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
                            />
                            <StatCard
                                label="Avg Authenticity"
                                value={stats.avgScore + "%"}
                                icon={<svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
                            />
                            <StatCard
                                label="High Confidence"
                                value={stats.highConf}
                                icon={<svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            />
                            <StatCard
                                label="Tests Generated"
                                value={stats.tests}
                                icon={<svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
                            />
                        </div>
                    )}

                    {/* Filter Bar */}
                    {candidates.length > 0 && (
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/[0.02] p-4 rounded-xl border border-white/5">
                            <div className="relative w-full sm:w-96">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by name or GitHub..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <span className="text-white/40 text-xs uppercase font-bold tracking-wider">Filter:</span>
                                {["All", "High", "Medium", "Low"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === status
                                                ? "bg-white text-black"
                                                : "bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.1]"
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Main Content Area */}
                    {loading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState message={error} />
                    ) : candidates.length === 0 ? (
                        <EmptyState isRecruiter={isRecruiter} onAction={() => navigate("/scan")} />
                    ) : (
                        <div className="bg-[#0f1115] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                                            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-white/40">Candidate</th>
                                            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-white/40">GitHub</th>
                                            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-white/40">Score</th>
                                            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-white/40">Authenticity</th>
                                            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-white/40">Scanned</th>
                                            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-white/40 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.04]">
                                        {filteredCandidates.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="p-12 text-center text-white/30">
                                                    No candidates match your search.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredCandidates.map((c) => (
                                                <tr key={c.id} className="group hover:bg-white/[0.02] transition-colors">
                                                    <td className="p-4">
                                                        <div className="font-semibold text-white group-hover:text-purple-300 transition-colors">{c.name}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <a
                                                            href={c.github_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-white/60 hover:text-blue-400 text-sm flex items-center gap-1.5 transition-colors"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                                            {getGithubUsername(c.github_url)}
                                                        </a>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-16 h-2 rounded-full bg-white/10 overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${c.score > 70 ? "bg-emerald-500" : c.score > 40 ? "bg-amber-500" : "bg-red-500"}`}
                                                                    style={{ width: `${c.score}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm font-mono text-white/80">{c.score}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${levelColor(c.authenticity_level)}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${c.authenticity_level === "High" ? "bg-emerald-400" : c.authenticity_level === "Medium" ? "bg-yellow-400" : "bg-red-400"} animate-pulse`}></span>
                                                            {c.authenticity_level}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-white/40 text-sm">
                                                        {new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button
                                                            onClick={() => navigate(`/candidate/${c.report_id}`)}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-white/[0.05] border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
                                                        >
                                                            View Report
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
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

/* ═══════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════ */

function StatCard({ label, value, icon }: { label: string, value: string | number, icon: any }) {
    return (
        <div className="p-5 rounded-2xl bg-[#0f1115] border border-white/[0.08] hover:border-white/[0.15] transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="text-white/40 text-sm font-medium">{label}</div>
                <div className="p-2 rounded-lg bg-white/[0.03] text-white/50 group-hover:text-white group-hover:bg-white/[0.08] transition-colors">{icon}</div>
            </div>
            <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
        </div>
    );
}

function EmptyState({ isRecruiter, onAction }: { isRecruiter: boolean, onAction: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6 ring-1 ring-white/10">
                <svg className="w-8 h-8 text-white/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No candidates found</h3>
            <p className="text-white/40 text-sm max-w-sm text-center mb-8">
                Get started by scanning a GitHub profile. We'll analyze their skills, authenticity, and hiring fit in seconds.
            </p>
            {isRecruiter && (
                <button
                    onClick={onAction}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg shadow-white/5 active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Scan First Candidate
                </button>
            )}
        </div>
    );
}

function LoadingState() {
    return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-white/[0.01]">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-white/40 text-sm animate-pulse">Loading candidate data...</p>
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="min-h-[20vh] flex flex-col items-center justify-center border border-red-500/20 rounded-2xl bg-red-500/5 p-8 text-center">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
            </div>
            <p className="text-red-400 font-medium mb-1">Failed to load data</p>
            <p className="text-red-400/60 text-sm">{message}</p>
        </div>
    );
}
