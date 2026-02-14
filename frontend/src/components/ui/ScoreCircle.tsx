interface ScoreCircleProps {
    score: number;
    label: string;
}

export default function ScoreCircle({ score, label }: ScoreCircleProps) {
    const radius = 80;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = (score / 100) * circumference;
    const offset = circumference - progress;

    const color =
        score >= 70
            ? { ring: "#22c55e", glow: "rgba(34,197,94,0.25)", text: "text-green-400" }
            : score >= 40
                ? { ring: "#eab308", glow: "rgba(234,179,8,0.25)", text: "text-yellow-400" }
                : { ring: "#ef4444", glow: "rgba(239,68,68,0.25)", text: "text-red-400" };

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative" style={{ width: radius * 2, height: radius * 2 }}>
                {/* Glow */}
                <div
                    className="absolute inset-0 rounded-full blur-2xl opacity-40"
                    style={{ backgroundColor: color.glow }}
                />

                <svg
                    width={radius * 2}
                    height={radius * 2}
                    className="relative z-10 -rotate-90"
                >
                    {/* Background circle */}
                    <circle
                        cx={radius}
                        cy={radius}
                        r={normalizedRadius}
                        fill="transparent"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth={stroke}
                    />
                    {/* Progress circle */}
                    <circle
                        cx={radius}
                        cy={radius}
                        r={normalizedRadius}
                        fill="transparent"
                        stroke={color.ring}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <span className="text-xs font-medium uppercase tracking-widest text-white/40">
                        Authenticity
                    </span>
                    <span className={`text-5xl font-bold ${color.text}`}>
                        {score}
                    </span>
                </div>
            </div>

            <span
                className={`text-sm font-semibold px-4 py-1 rounded-full border ${score >= 70
                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                        : score >= 40
                            ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                            : "border-red-500/30 bg-red-500/10 text-red-400"
                    }`}
            >
                {label} Authenticity
            </span>
        </div>
    );
}
