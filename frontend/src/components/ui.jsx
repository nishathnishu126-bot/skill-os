// Shared, reusable UI primitives
// --------------------------------------------------

export const PLATFORM_META = {
  YouTube:      { bg: "bg-red-50",     text: "text-red-600",    dot: "bg-red-500"    },
  Udemy:        { bg: "bg-purple-50",  text: "text-purple-600", dot: "bg-purple-500" },
  Coursera:     { bg: "bg-blue-50",    text: "text-blue-600",   dot: "bg-blue-500"   },
  freeCodeCamp: { bg: "bg-green-50",   text: "text-green-700",  dot: "bg-green-500"  },
  Medium:       { bg: "bg-slate-100",  text: "text-slate-600",  dot: "bg-slate-400"  },
};

export const AVATAR_COLORS = {
  purple: "bg-purple-100 text-purple-700",
  amber:  "bg-amber-100  text-amber-700",
  coral:  "bg-red-100    text-red-700",
  teal:   "bg-teal-100   text-teal-700",
  blue:   "bg-blue-100   text-blue-700",
};

export function PlatformBadge({ platform }) {
  const m = PLATFORM_META[platform] ?? PLATFORM_META.Medium;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${m.bg} ${m.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {platform}
    </span>
  );
}

export function ProgressBar({ value, color = "bg-indigo-600", height = "h-1.5" }) {
  return (
    <div className={`w-full bg-slate-100 rounded-full ${height} overflow-hidden`}>
      <div className={`${color} ${height} rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function Avatar({ initials, colorKey = "blue", size = "md" }) {
  const cls = AVATAR_COLORS[colorKey] ?? AVATAR_COLORS.blue;
  const sz = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-12 h-12 text-base" : "w-10 h-10 text-sm";
  return (
    <div className={`${sz} rounded-full ${cls} flex items-center justify-center font-bold shrink-0`}>
      {initials}
    </div>
  );
}

export function SectionHeader({ title, action, actionLabel = "View all" }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {action && (
        <button onClick={action} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <p className="font-semibold text-slate-700 mb-1">{title}</p>
      <p className="text-sm text-slate-400">{sub}</p>
    </div>
  );
}