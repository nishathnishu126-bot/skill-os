import React, { useState } from "react";
import { Search, Filter, ExternalLink, CheckCircle2, Clock, BookOpen } from "lucide-react";
import { PlatformBadge, ProgressBar, SectionHeader } from "./ui";
import { useState, useEffect } from "react";
import { api } from "../api";

const [resources, setResources] = useState([]);
useEffect(() => { api.resources().then(setResources); }, []);

const STATUS_TABS = ["all", "in-progress", "completed"];

const STATUS_COLORS = {
  completed:   "bg-green-50 text-green-700",
  "in-progress": "bg-indigo-50 text-indigo-700",
};

export default function MyLearning() {
  const [search, setSearch]     = useState("");
  const [platform, setPlatform] = useState("All");
  const [status, setStatus]     = useState("all");

  const platforms = ["All", ...Array.from(new Set(MY_RESOURCES.map(r => r.platform)))];

  const filtered = MY_RESOURCES.filter(r => {
    const matchSearch   = r.title.toLowerCase().includes(search.toLowerCase());
    const matchPlatform = platform === "All" || r.platform === platform;
    const matchStatus   = status === "all" || r.status === status;
    return matchSearch && matchPlatform && matchStatus;
  });

  const totalHours = 23;   // TODO: derive from real data
  const completed  = MY_RESOURCES.filter(r => r.status === "completed").length;
  const inProgress = MY_RESOURCES.filter(r => r.status === "in-progress").length;

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total resources", value: MY_RESOURCES.length, icon: <BookOpen className="w-5 h-5 text-indigo-500" /> },
          { label: "In progress",     value: inProgress,          icon: <Clock className="w-5 h-5 text-amber-500" /> },
          { label: "Completed",       value: completed,           icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search resources…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>
        <select
          value={platform}
          onChange={e => setPlatform(e.target.value)}
          className="text-sm px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          {platforms.map(p => <option key={p}>{p}</option>)}
        </select>
        {/* Status tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {STATUS_TABS.map(t => (
            <button
              key={t}
              onClick={() => setStatus(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                status === t ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Resource list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400 text-sm">No resources match your filters.</div>
        )}
        {filtered.map(r => (
          <ResourceRow key={r.id} resource={r} />
        ))}
      </div>

      {/* Add button */}
      <button className="mt-6 w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-semibold text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all">
        + Add resource manually
      </button>
    </div>
  );
}

function ResourceRow({ resource: r }) {
  const progressColor = {
    red:    "bg-red-500",
    purple: "bg-purple-500",
    blue:   "bg-blue-500",
    green:  "bg-green-500",
    gray:   "bg-slate-400",
  }[r.platformColor] ?? "bg-indigo-500";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition-shadow group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <PlatformBadge platform={r.platform} />
          {r.status === "completed" && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-50 text-green-700">
              Completed
            </span>
          )}
        </div>
        <p className="font-semibold text-slate-900 text-sm leading-snug mb-1 truncate">{r.title}</p>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar value={r.progress} color={progressColor} />
          </div>
          <span className="text-xs text-slate-500 shrink-0">{r.progress}%</span>
          <span className="text-xs text-slate-400 shrink-0 hidden sm:block">{r.duration}</span>
        </div>
        <div className="flex gap-1 mt-2 flex-wrap">
          {r.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
      <a
        href={r.url}
        className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors"
      >
        {r.progress === 0 ? "Start" : r.status === "completed" ? "Review" : "Continue"}
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}