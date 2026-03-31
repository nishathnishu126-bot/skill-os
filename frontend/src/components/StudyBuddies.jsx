import React, { useState } from "react";
import { Users, MessageCircle, Target, Zap, BookOpen, BarChart2 } from "lucide-react";

import { Avatar, SectionHeader } from "./ui";
import { useState, useEffect } from "react";
import { api } from "../api";

const [resources, setResources] = useState([]);
useEffect(() => { api.resources().then(setResources); }, []);

const INTERACTION_MODES = [
  { icon: <BookOpen className="w-4 h-4" />, label: "Mutual teaching",    desc: "Take turns explaining concepts to each other" },
  { icon: <Users className="w-4 h-4" />,    label: "Collaborative",      desc: "Work through problems together in real time"  },
  { icon: <MessageCircle className="w-4 h-4" />, label: "Discussion",    desc: "Debate ideas, quiz each other, review notes"  },
];

export default function StudyBuddies() {
  const [requested, setRequested] = useState(new Set());

  function sendRequest(id) {
    setRequested(prev => new Set([...prev, id]));
  }

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">

      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center shrink-0">
          <Users className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-slate-900 mb-1">Study buddy matching</p>
          <p className="text-sm text-slate-500">
            72.8% of students report better effort levels when learning with a peer.
            Matches are based on shared goals, skill level, and pace.
            {/* TODO: replace static list with /api/v1/buddies/match response */}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shrink-0">
          <Zap className="w-4 h-4" /> {BUDDY_MATCHES.length} matches found
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: buddy list */}
        <div className="lg:col-span-2 space-y-4">
          <SectionHeader title="Top matches for you" />
          {BUDDY_MATCHES.map(buddy => (
            <BuddyCard
              key={buddy.id}
              buddy={buddy}
              requested={requested.has(buddy.id)}
              onRequest={() => sendRequest(buddy.id)}
            />
          ))}
        </div>

        {/* Right: interaction modes info */}
        <div className="space-y-4">
          <SectionHeader title="Interaction modes" />
          {INTERACTION_MODES.map(m => (
            <div key={m.label} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2 text-indigo-600">
                {m.icon}
                <p className="font-semibold text-sm text-slate-900">{m.label}</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
            </div>
          ))}

          {/* Stat callout */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white">
            <BarChart2 className="w-6 h-6 mb-3 opacity-80" />
            <p className="text-2xl font-bold mb-1">+30%</p>
            <p className="text-sm opacity-80">average improvement in course completion when studying with a peer.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

function BuddyCard({ buddy, requested, onRequest }) {
  const scoreColor =
    buddy.compatScore >= 90 ? "bg-green-50 text-green-700" :
    buddy.compatScore >= 80 ? "bg-indigo-50 text-indigo-700" :
                              "bg-amber-50 text-amber-700";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-5 hover:shadow-sm transition-shadow">

      {/* Avatar + online dot */}
      <div className="relative shrink-0">
        <Avatar initials={buddy.initials} colorKey={buddy.avatarColor} size="lg" />
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
          buddy.status === "online" ? "bg-green-500" : "bg-slate-300"
        }`} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-bold text-slate-900 text-sm">{buddy.name}</p>
          {buddy.cohort === "same" && (
            <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Same cohort</span>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-2">{buddy.goal} · {buddy.hoursPerWeek}h/week · {buddy.skillLevel}</p>
        <div className="flex gap-1 flex-wrap">
          {buddy.commonTags.map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{t}</span>
          ))}
        </div>
      </div>

      {/* Score + action */}
      <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${scoreColor}`}>
          {buddy.compatScore}% match
        </span>
        <button
          onClick={onRequest}
          disabled={requested}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            requested
              ? "bg-green-50 text-green-700 cursor-default"
              : "bg-slate-900 text-white hover:bg-slate-700"
          }`}
        >
          {requested ? "Requested ✓" : "Connect"}
        </button>
      </div>
    </div>
  );
}