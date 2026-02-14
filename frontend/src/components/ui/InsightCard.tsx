interface InsightCardProps {
    title: string;
    items: string[];
    variant: "success" | "warning" | "danger";
}

const VARIANT_STYLES = {
    success: {
        border: "border-green-500/20",
        bg: "bg-green-500/5",
        dot: "bg-green-400",
        icon: "text-green-400",
        title: "text-green-400",
        badge: "bg-green-500/15 text-green-400",
    },
    warning: {
        border: "border-yellow-500/20",
        bg: "bg-yellow-500/5",
        dot: "bg-yellow-400",
        icon: "text-yellow-400",
        title: "text-yellow-400",
        badge: "bg-yellow-500/15 text-yellow-400",
    },
    danger: {
        border: "border-red-500/20",
        bg: "bg-red-500/5",
        dot: "bg-red-400",
        icon: "text-red-400",
        title: "text-red-400",
        badge: "bg-red-500/15 text-red-400",
    },
};

const VARIANT_ICONS = {
    success: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    warning: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
    ),
    danger: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 0v.008m0-.008h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

export default function InsightCard({ title, items, variant }: InsightCardProps) {
    const styles = VARIANT_STYLES[variant];

    if (!items || items.length === 0) return null;

    return (
        <div
            className={`bg-white/[0.03] backdrop-blur-xl border ${styles.border} rounded-2xl p-6 hover:bg-white/[0.05] transition-colors`}
        >
            <div className={`flex items-center gap-2 mb-4 ${styles.icon}`}>
                {VARIANT_ICONS[variant]}
                <h3 className={`text-lg font-semibold ${styles.title}`}>{title}</h3>
            </div>

            <ul className="space-y-3">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                        {variant === "danger" ? (
                            <span className={`shrink-0 mt-0.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${styles.badge}`}>
                                Risk
                            </span>
                        ) : (
                            <span className={`shrink-0 mt-2 w-2 h-2 rounded-full ${styles.dot}`} />
                        )}
                        <span className="text-white/70 text-sm leading-relaxed">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
