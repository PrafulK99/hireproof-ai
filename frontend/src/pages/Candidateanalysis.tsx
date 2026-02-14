import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { getAuthSession } from "../lib/session";
import { API } from "../lib/api";
import { getMockCandidate } from "../lib/mockData";
import type { Candidate } from "../types/candidate";

const LOADING_STEPS = [
  "Fetching URL content...",
  "Extracting technical signals...",
  "Building plotted report...",
];

export default function CandidateAnalysis() {
  const navigate = useNavigate();
  const session = getAuthSession();
  
  // Analyze functionality state
  const [profileUrl, setProfileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const [dots, setDots] = useState("");

  // Loading dots animation
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, [loading]);

  // Loading steps animation
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  // NOTE: No session check here because AuthGuard in App.tsx handles it

  const isValidUrl = (value: string): boolean => {
    try {
      const parsed = new URL(value.trim());
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleAnalyze = async () => {
    setError("");

    if (!profileUrl.trim()) {
      setError("Please enter a valid URL.");
      return;
    }

    if (!isValidUrl(profileUrl)) {
      setError("Invalid URL. Use format: https://example.com/profile");
      return;
    }

    setLoading(true);
    setLoadingStep(0);

    try {
      const res = await fetch(`${API}/analyze`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // Add authorization header if your API requires it
          ...(session?.token && { "Authorization": `Bearer ${session.token}` })
        },
        body: JSON.stringify({ url: profileUrl.trim() }),
      });

      if (!res.ok) {
        // Check if it's an auth error
        if (res.status === 401 || res.status === 403) {
          console.log("[CandidateAnalysis] Auth error, redirecting to login");
          navigate("/candidate/login", { replace: true });
          return;
        }
        throw new Error("API returned error");
      }

      const candidate: Candidate = await res.json();
      localStorage.setItem("candidate", JSON.stringify(candidate));
      navigate(`/candidate/${candidate.id}`);
    } catch (err) {
      console.error("[CandidateAnalysis] API failed:", err);
      setError("URL analysis failed. Using demo data.");

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
    <div className="flex min-h-screen bg-[#0a0a0f] text-white">
      <Sidebar />
      <main className="flex-1 p-8 md:p-10">
        <h1 className="text-3xl font-bold">Analyze Profile</h1>
        <p className="text-white/50 mt-1">Generate AI-powered skill assessment and authenticity report.</p>

        <section className="mt-8 max-w-3xl">
          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2">Scan Your Profile</h2>
                <p className="text-white/40 text-sm">
                  Paste your portfolio, GitHub, or profile URL to generate an automated skill analysis report.
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                Profile URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-white/30"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10.59 13.41a1.996 1.996 0 0 1 0-2.82l3.17-3.17a2 2 0 0 1 2.83 2.83l-1.58 1.58a1 1 0 1 0 1.41 1.41L18 11.66a4 4 0 0 0-5.66-5.66l-3.17 3.17a4 4 0 0 0 0 5.66 1 1 0 0 0 1.42-1.42zm2.82-2.82a1 1 0 0 0-1.41-1.41l-5.66 5.66a4 4 0 0 0 5.66 5.66l3.17-3.17a4 4 0 0 0 0-5.66 1 1 0 1 0-1.41 1.41 2 2 0 0 1 0 2.83l-3.17 3.17a2 2 0 0 1-2.83-2.83z" />
                  </svg>
                </div>
                <input
                  type="url"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !loading && handleAnalyze()}
                  placeholder="https://github.com/yourusername or https://yourportfolio.com"
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                Resume Upload <span className="text-white/25 normal-case">(optional)</span>
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

            {loading && (
              <div className="mb-4 px-4 py-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
                {LOADING_STEPS.map((step, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2.5 text-sm transition-all duration-500 ${
                      i < loadingStep
                        ? "text-green-400"
                        : i === loadingStep
                          ? "text-emerald-300"
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
                      <div className="w-4 h-4 shrink-0 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="w-4 h-4 shrink-0 rounded-full border border-white/15" />
                    )}
                    <span>
                      {step}
                      {i === loadingStep && <span className="text-emerald-400">{dots}</span>}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer disabled:cursor-not-allowed bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-500 hover:to-cyan-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] disabled:opacity-60 disabled:hover:shadow-none"
            >
              {loading ? "Analyzing..." : "Analyze Profile"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}