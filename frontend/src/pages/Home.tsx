import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAuthSession } from "../lib/session";

/* ═══════════════════════════════════════
   LANDING PAGE COMPONENT
   ═══════════════════════════════════════ */
export default function Home() {
    const session = getAuthSession();

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden selection:bg-purple-500/30">
            <Navbar session={session} />
            <HeroSection />
            <ProblemSection />
            <ValueSection />
            <HowItWorksSection />
            <ProductPreviewSection />
            <PricingSection />
            <CTASection />
            <Footer />
        </div>
    );
}

/* ═══════════════════════════════════════
   1. NAVBAR
   ═══════════════════════════════════════ */
function Navbar({ session }: { session: any }) {
    const [scrolled, setScrolled] = useState(false);

    // Add scroll listener for glass effect
    React.useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-white/[0.06] py-4" : "bg-transparent py-6"
            }`}>
            <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white group-hover:text-white/90 transition-colors">
                        HireProof <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">AI</span>
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/60">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    </div>

                    {session ? (
                        <Link
                            to={session.role === "candidate" ? "/candidate/home" : "/recruiter/dashboard"}
                            className="px-5 py-2 text-sm font-semibold bg-white text-black rounded-lg hover:bg-gray-100 transition-all shadow-lg shadow-white/5"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/recruiter/login"
                                className="hidden sm:block text-sm font-medium text-white/70 hover:text-white transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/recruiter/login"
                                className="px-5 py-2 text-sm font-semibold bg-white text-black rounded-lg hover:bg-gray-100 transition-all shadow-lg shadow-white/5"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

/* ═══════════════════════════════════════
   2. HERO SECTION
   ═══════════════════════════════════════ */
function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] pointer-events-none">
                <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
                <div className="absolute top-[40%] left-[40%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: "1s" }} />
            </div>

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm mb-8 animate-fade-in-up">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-medium text-white/70 tracking-wide">AI-Powered Tech Hiring</span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <span className="block text-white drop-shadow-sm">Hire with Proof,</span>
                    <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 drop-shadow-2xl">
                        Not Resumes.
                    </span>
                </h1>

                {/* Subtext */}
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/50 leading-relaxed mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    Stop guessing. Analyze real GitHub activity, verify coding skills, and generate technical interviews instantly with AI.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                    <Link
                        to="/recruiter/login"
                        className="group relative w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-white text-[#0a0a0f] text-sm hover:bg-gray-100 transition-all hover:scale-[1.02] shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                    >
                        <span className="flex items-center justify-center gap-2">
                            Start Hiring
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </span>
                    </Link>
                    <Link
                        to="/candidate/login"
                        className="group w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-white/[0.05] border border-white/10 text-white text-sm hover:bg-white/[0.1] hover:border-white/20 transition-all hover:scale-[1.02]"
                    >
                        Login as Candidate
                    </Link>
                </div>

                {/* Social Proof */}
                <div className="mt-16 pt-10 border-t border-white/[0.06] animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                    <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-6">Trusted by modern engineering teams</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
                        {/* SVG Logos placeholders for realism */}
                        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-white/20"></div><span className="font-bold text-lg text-white">Acme Corp</span></div>
                        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-white/20"></div><span className="font-bold text-lg text-white">TechFlow</span></div>
                        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-white/20"></div><span className="font-bold text-lg text-white">DevScale</span></div>
                        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-white/20"></div><span className="font-bold text-lg text-white">CodeStream</span></div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   3. PROBLEM SECTION
   ═══════════════════════════════════════ */
function ProblemSection() {
    return (
        <section className="py-24 px-6 md:px-10 relative">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Hiring is <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Broken</span></h2>
                <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto">
                    Resumes are inflated. GitHub profiles are copied. You waste infinite hours interviewing candidates who can't code.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ProblemCard
                        icon="📄"
                        title="Inflated Resumes"
                        desc="64% of candidates exaggerate skills on their CV."
                    />
                    <ProblemCard
                        icon="🤖"
                        title="Bot Applications"
                        desc="Recruiters are flooded with AI-generated spam."
                    />
                    <ProblemCard
                        icon="📉"
                        title="Bad Hires"
                        desc="Replacement costs are 3x the employee's salary."
                    />
                </div>
            </div>
        </section>
    );
}

function ProblemCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors text-left">
            <div className="text-3xl mb-4">{icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
        </div>
    );
}

/* ═══════════════════════════════════════
   4. FEATURES / VALUE SECTION
   ═══════════════════════════════════════ */
function ValueSection() {
    return (
        <section id="features" className="py-24 px-6 md:px-10 bg-white/[0.02]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-sm font-bold uppercase tracking-widest text-purple-400">Why HireProof?</span>
                    <h2 className="mt-4 text-3xl md:text-5xl font-bold text-white">Verify Skills. Instantly.</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        title="Authenticity Score"
                        desc="Our AI analyzes commit history, code patterns, and repo ownership to detect real vs. fake work."
                        color="bg-emerald-500/10 text-emerald-400"
                    />
                    <FeatureCard
                        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
                        title="GitHub Behavior Analysis"
                        desc="Go beyond star counts. We measure code consistency, complexity, and contribution depth."
                        color="bg-purple-500/10 text-purple-400"
                    />
                    <FeatureCard
                        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" /></svg>}
                        title="Skill Radar Graph"
                        desc="Visualize strengths and weaknesses across Backend, Frontend, DevOps, and Algorithms."
                        color="bg-blue-500/10 text-blue-400"
                    />
                    <FeatureCard
                        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>}
                        title="AI Interview Questions"
                        desc="Generate tailored interview questions based on the candidate's actual project code."
                        color="bg-amber-500/10 text-amber-400"
                    />
                    <FeatureCard
                        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>}
                        title="Hiring Test Generator"
                        desc="Create relevant technical take-home assignments instantly."
                        color="bg-pink-500/10 text-pink-400"
                    />
                    <FeatureCard
                        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>}
                        title="Candidate Ranking"
                        desc="See who truly stands out with data-backed leaderboards."
                        color="bg-cyan-500/10 text-cyan-400"
                    />
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
    return (
        <div className="group p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${color}`}>
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
            <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
        </div>
    );
}

/* ═══════════════════════════════════════
   5. HOW IT WORKS
   ═══════════════════════════════════════ */
function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-24 px-6 md:px-10 relative overflow-hidden">
            {/* Gradient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
                    <p className="text-white/40">Three simple steps to smarter hiring.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StepCard
                        step="1"
                        title="Paste GitHub URL"
                        desc="Enter the candidate's GitHub username or repository link."
                    />
                    <div className="hidden md:block absolute top-[60%] left-[30%] w-24 border-t border-dashed border-white/20"></div>
                    <StepCard
                        step="2"
                        title="AI Analysis"
                        desc="Our AI scans thousands of commits, PRs, and repos in seconds."
                    />
                    <div className="hidden md:block absolute top-[60%] right-[30%] w-24 border-t border-dashed border-white/20"></div>
                    <StepCard
                        step="3"
                        title="Detailed Report"
                        desc="Get a comprehensive report with authenticity scores and interview prep."
                    />
                </div>
            </div>
        </section>
    );
}

function StepCard({ step, title, desc }: { step: string, title: string, desc: string }) {
    return (
        <div className="relative flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-xl shadow-black/20">
                {step}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">{desc}</p>
        </div>
    );
}

/* ═══════════════════════════════════════
   6. PREVIEW SECTION
   ═══════════════════════════════════════ */
function ProductPreviewSection() {
    return (
        <section className="py-24 px-6 md:px-10">
            <div className="max-w-6xl mx-auto">
                <div className="relative rounded-2xl border border-white/10 bg-[#0f1115] shadow-2xl shadow-purple-500/10 overflow-hidden">
                    {/* Fake Window Controls */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                        <div className="ml-4 px-3 py-1 rounded bg-black/20 text-[10px] text-white/30 font-mono">hireproof.ai/report/alex-dev</div>
                    </div>

                    {/* Mock Dashboard Content */}
                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-90">
                        {/* Sidebar */}
                        <div className="hidden md:block col-span-1 space-y-4">
                            <div className="h-32 rounded-xl bg-white/[0.05] border border-white/[0.05] animate-pulse"></div>
                            <div className="h-16 rounded-xl bg-white/[0.05] border border-white/[0.05]"></div>
                            <div className="h-16 rounded-xl bg-white/[0.05] border border-white/[0.05]"></div>
                        </div>
                        {/* Main Content */}
                        <div className="col-span-2 space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="w-48 h-8 rounded bg-white/[0.1]"></div>
                                <div className="w-24 h-8 rounded bg-emerald-500/20"></div>
                            </div>
                            <div className="h-64 rounded-xl bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent border border-white/10 p-6 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-32 h-32 rounded-full border-4 border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-4xl font-bold text-white">92</span>
                                    </div>
                                    <p className="text-emerald-400 font-mono text-sm uppercase tracking-widest">High Authenticity</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-24 rounded-xl bg-white/[0.05]"></div>
                                <div className="h-24 rounded-xl bg-white/[0.05]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                        <Link
                            to="/recruiter/login"
                            className="px-8 py-3 rounded-full bg-white text-black font-semibold shadow-xl hover:scale-105 transition-transform"
                        >
                            View Live Demo
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   7. PRICING SECTION
   ═══════════════════════════════════════ */
function PricingSection() {
    return (
        <section id="pricing" className="py-24 px-6 md:px-10">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Simple Pricing</h2>
                    <p className="text-white/40">Start for free. Scale when you hire.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PriceCard
                        title="Starter"
                        price="Free"
                        desc="5 Candidate Scans / mo"
                        features={["Basic Authenticity Score", "GitHub Profile Analysis", "Community Support"]}
                    />
                    <PriceCard
                        title="Pro"
                        price="₹999"
                        period="/mo"
                        desc="Unlimited Scans"
                        highlight
                        features={["Advanced Behavior Analysis", "AI Interview Questions", "Hiring Test Generator", "Priority Support"]}
                    />
                    <PriceCard
                        title="Enterprise"
                        price="Custom"
                        desc="For large teams"
                        features={["ATS Integration", "Custom Risk Models", "Dedicated Account Manager", "SSO & Audit Logs"]}
                    />
                </div>
            </div>
        </section>
    );
}

function PriceCard({ title, price, period, desc, highlight, features }: { title: string, price: string, period?: string, desc: string, highlight?: boolean, features: string[] }) {
    return (
        <div className={`flex flex-col p-8 rounded-3xl border transition-all duration-300 ${highlight
                ? "bg-gradient-to-b from-purple-500/10 to-blue-500/5 border-purple-500/30 shadow-2xl shadow-purple-500/10 scale-105 z-10"
                : "bg-white/[0.02] border-white/[0.08] hover:border-white/[0.15]"
            }`}>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-white">{price}</span>
                {period && <span className="text-white/40">{period}</span>}
            </div>
            <p className="text-sm text-white/40 mb-8">{desc}</p>

            <div className="flex-1 space-y-4 mb-8">
                {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                        <svg className={`w-4 h-4 ${highlight ? "text-purple-400" : "text-white/30"}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {f}
                    </div>
                ))}
            </div>

            <Link
                to="/recruiter/login"
                className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition-all ${highlight
                        ? "bg-white text-black hover:bg-gray-100 shadow-lg shadow-purple-500/20"
                        : "bg-white/[0.08] text-white hover:bg-white/[0.12]"
                    }`}
            >
                {highlight ? "Get Started" : "Contact Sales"}
            </Link>
        </div>
    );
}

/* ═══════════════════════════════════════
   8. CTA SECTION
   ═══════════════════════════════════════ */
function CTASection() {
    return (
        <section className="py-24 px-6 md:px-10">
            <div className="max-w-4xl mx-auto relative rounded-3xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-white/10 p-12 md:p-20 text-center overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

                <h2 className="relative z-10 text-3xl md:text-5xl font-bold text-white mb-6">Ready to hire better?</h2>
                <p className="relative z-10 text-lg text-white/50 mb-10 max-w-xl mx-auto">
                    Join forward-thinking recruiters who value real skills over embellished resumes.
                </p>
                <Link
                    to="/recruiter/login"
                    className="relative z-10 inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-white text-black hover:bg-gray-100 transition-all shadow-xl hover:scale-105"
                >
                    Start Hiring for Free
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </Link>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   9. FOOTER
   ═══════════════════════════════════════ */
function Footer() {
    return (
        <footer className="border-t border-white/[0.06] bg-[#050508] py-12 px-6 md:px-10">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div>
                    <span className="text-lg font-bold text-white block mb-4">HireProof AI</span>
                    <p className="text-white/30 text-sm">The new standard for technical hiring.</p>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Product</h4>
                    <ul className="space-y-2 text-sm text-white/40">
                        <li><a href="#" className="hover:text-white">Features</a></li>
                        <li><a href="#" className="hover:text-white">Pricing</a></li>
                        <li><a href="#" className="hover:text-white">API</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm text-white/40">
                        <li><a href="#" className="hover:text-white">About</a></li>
                        <li><a href="#" className="hover:text-white">Blog</a></li>
                        <li><a href="#" className="hover:text-white">Careers</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-white/40">
                        <li><a href="#" className="hover:text-white">Privacy</a></li>
                        <li><a href="#" className="hover:text-white">Terms</a></li>
                        <li><a href="#" className="hover:text-white">Security</a></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto pt-8 border-t border-white/[0.06] text-center text-white/20 text-xs">
                © 2026 HireProof AI. All rights reserved.
            </div>
        </footer>
    );
}
