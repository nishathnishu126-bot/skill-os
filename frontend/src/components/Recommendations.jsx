import React, { useState } from "react";
import { Sparkles, ThumbsUp, ThumbsDown, Plus, Clock, Zap } from "lucide-react";
import { RECOMMENDATIONS } from "../mockData";
import { PlatformBadge, SectionHeader } from "./ui";

export default function Recommendations() {
  // dismissed tracks ids the user has hidden
  const [dismissed, setDismissed] = useState(new Set());
  const [saved, setSaved]         = useState(new Set());

  const visible = RECOMMENDATIONS.filter(r => !dismissed.has(r.id));

  function dismiss(id) { setDismissed(prev => new Set([...prev, id])); }
  function toggleSave(id) {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const scoreColor = s =>
    s >= 90 ? "text-green-600 bg-green-50" :
    s >= 80 ? "text-indigo-600 bg-indigo-50" :
              "text-amber-600 bg-amber-50";

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 mb-8 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-slate-900 mb-1">Personalised for you</p>
          <p className="text-sm text-slate-500">
            Recommendations are based on your watch history, completed resources, and learning goals.
            {/* TODO: replace with real ML model output */}
          </p>
        </div>
      </div>

      {visible.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-semibold">All caught up!</p>
          <p className="text-sm mt-1">Check back later for fresh recommendations.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map(rec => (
          <RecCard
            key={rec.id}
            rec={rec}
            isSaved={saved.has(rec.id)}
            onSave={() => toggleSave(rec.id)}
            onDismiss={() => dismiss(rec.id)}
            scoreColor={scoreColor(rec.matchScore)}
          />
        ))}
      </div>
    </div>
  );
}

function RecCard({ rec, isSaved, onSave, onDismiss, scoreColor }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <PlatformBadge platform={rec.platform} />
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scoreColor}`}>
          {rec.matchScore}% match
        </span>
      </div>

      <p className="font-semibold text-slate-900 text-sm leading-snug">{rec.title}</p>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" /> {rec.duration}
        </span>
        {rec.tags.map(t => (
          <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{t}</span>
        ))}
      </div>

      <p className="text-xs text-indigo-500 font-medium flex items-center gap-1">
        <Zap className="w-3 h-3" /> {rec.reason}
      </p>

      <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100">
        <button
          onClick={onSave}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isSaved
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          {isSaved ? "Saved" : "Save"}
        </button>
        <button
          onClick={onDismiss}
          className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-all"
          title="Not interested"
        >
          <ThumbsDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}