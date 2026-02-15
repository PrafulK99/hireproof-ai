import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function RecruiterActions() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [shortlisted, setShortlisted] = useState(false);
    const [toast, setToast] = useState("");

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    };

    return (
        <>
            {/* Toast */}
            <div
                className={`fixed top-6 right-6 z-50 transition-all duration-500 ${toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                    }`}
            >
                <div className="flex items-center gap-3 px-5 py-3.5 bg-purple-500/15 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl">
                    <svg className="w-5 h-5 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-purple-300 text-sm font-medium">{toast}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/20">
                <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    Recruiter Actions
                </h3>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => {
                            setShortlisted(true);
                            showToast("Candidate shortlisted successfully!");
                        }}
                        disabled={shortlisted}
                        className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:cursor-default ${shortlisted
                            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                            : "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-500 hover:to-green-500 hover:shadow-lg hover:shadow-emerald-500/25"
                            }`}
                    >
                        {shortlisted ? "✓ Shortlisted" : "⭐ Shortlist Candidate"}
                    </button>

                    <button
                        onClick={() => navigate("/compare", { state: { candidateId: id } })}
                        className="px-6 py-3 rounded-xl text-sm font-semibold border border-white/[0.1] text-white/70 hover:bg-white/[0.05] hover:text-white transition-all cursor-pointer"
                    >
                        ⚖️ Compare
                    </button>

                    <button
                        onClick={() => showToast("Report exported successfully!")}
                        className="px-6 py-3 rounded-xl text-sm font-semibold border border-white/[0.1] text-white/70 hover:bg-white/[0.05] hover:text-white transition-all cursor-pointer"
                    >
                        📄 Export Report
                    </button>
                </div>
            </div>
        </>
    );
}
