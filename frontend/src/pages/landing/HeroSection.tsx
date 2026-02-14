import React from "react";

const trustPoints = [
  "Analyzes real GitHub activity",
  "No resume bias",
  "Designed for recruiters & candidates",
] as const;

const HeroSection: React.FC = () => {
  return (
    <section className="relative isolate overflow-hidden border-t border-slate-200/70 bg-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_48%),radial-gradient(circle_at_85%_18%,_rgba(15,23,42,0.08),_transparent_38%)]" />

      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Eliminate Fake Skills. Hire from Proven Work.
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
          HireProof AI analyzes real GitHub contributions and project history to measure authenticity, skill depth, and consistency, so hiring teams can make better decisions with confidence.
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col items-center justify-center gap-3 sm:mx-auto sm:w-auto sm:max-w-none sm:flex-row">
          <button
            type="button"
            className="w-full rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 sm:w-auto"
          >
            Login as Recruiter
          </button>

          <button
            type="button"
            className="w-full rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 sm:w-auto"
          >
            Login as Candidate
          </button>
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-2 sm:gap-3">
          {trustPoints.map((point) => (
            <span
              key={point}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
            >
              {point}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
