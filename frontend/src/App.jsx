import React, { useState } from "react";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Github, Chrome, Zap,
  Search, Bell, LayoutDashboard, BookOpen, Trophy, LogOut,
  PlayCircle, CheckCircle2, Clock, Star, Flame, Target,
  Youtube, BookA, Sparkles, Layers, Users,
} from "lucide-react";

import { CURRENT_USER, MY_RESOURCES, HEATMAP_DATA } from "./mockData";
import MyLearning      from "./components/MyLearning";
import Recommendations from "./components/Recommendations";
import Flashcards      from "./components/Flashcards";
import StudyBuddies    from "./components/StudyBuddies";

// ─────────────────────────────────────────────
//  NAV CONFIG
// ─────────────────────────────────────────────
const NAV = [
  { id: "dashboard",       label: "Dashboard",     Icon: LayoutDashboard },
  { id: "my-learning",     label: "My learning",   Icon: BookOpen        },
  { id: "recommendations", label: "Recommended",   Icon: Sparkles        },
  { id: "flashcards",      label: "Flashcards",    Icon: Layers          },
  { id: "buddies",         label: "Study buddies", Icon: Users           },
  { id: "rewards",         label: "Rewards",       Icon: Trophy          },
];

// ─────────────────────────────────────────────
//  LAYOUT SHELL (sidebar + topbar)
// ─────────────────────────────────────────────
function Shell({ page, setPage, onLogout, children }) {
  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow">
                <Zap className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <span className="text-lg font-bold tracking-tight">Skill<span className="text-indigo-600">OS</span></span>
            </div>
          </div>

          <nav className="p-3 space-y-0.5">
            {NAV.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setPage(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  page === id
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {id === "flashcards" && (
                  <span className="ml-auto text-[10px] font-bold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">4</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 mb-2">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">
              {CURRENT_USER.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{CURRENT_USER.name}</p>
              <p className="text-xs text-slate-500">Level {CURRENT_USER.level} · {CURRENT_USER.streak}d streak</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-base font-bold text-slate-900 capitalize">
            {NAV.find(n => n.id === page)?.label ?? "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-full text-xs">
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <Flame className="w-3.5 h-3.5" fill="currentColor" /> {CURRENT_USER.streak}d
              </span>
              <span className="w-px h-3 bg-slate-300" />
              <span className="flex items-center gap-1 text-indigo-600 font-bold">
                <Star className="w-3.5 h-3.5" fill="currentColor" /> {CURRENT_USER.xp.toLocaleString()} XP
              </span>
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
//  DASHBOARD
// ─────────────────────────────────────────────
function Dashboard({ setPage }) {
  const inProgress = MY_RESOURCES.filter(r => r.status === "in-progress");
  const xpPct = Math.round((CURRENT_USER.xp / CURRENT_USER.xpToNext) * 100);

  const platformTotals = inProgress.reduce((acc, r) => {
    acc[r.platform] = acc[r.platform] ? Math.round((acc[r.platform] + r.progress) / 2) : r.progress;
    return acc;
  }, {});

  const platformColors = {
    YouTube: "#E24B4A", Udemy: "#7C3AED", Coursera: "#2563EB",
    freeCodeCamp: "#16A34A", Medium: "#64748B",
  };

  return (
    <div className="p-6 max-w-6xl mx-auto w-full space-y-6">

      {/* Welcome */}
      <div className="relative bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-7 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <h1 className="text-2xl font-bold text-white mb-1">Good morning, {CURRENT_USER.name.split(" ")[0]}! 👋</h1>
        <p className="text-indigo-200 text-sm mb-5 max-w-md">You have 4 flashcards due and 3 courses in progress.</p>
        {/* XP bar */}
        <div className="max-w-xs">
          <div className="flex justify-between text-xs text-indigo-300 mb-1">
            <span>Level {CURRENT_USER.level}</span>
            <span>{CURRENT_USER.xp} / {CURRENT_USER.xpToNext} XP</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${xpPct}%` }} />
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Hours this week", value: "8.4",           sub: "+2.1 vs last week" },
          { label: "Courses active",  value: inProgress.length, sub: "across 3 platforms" },
          { label: "Cards mastered",  value: "63",            sub: "4 due today" },
          { label: "Streak",          value: `${CURRENT_USER.streak}d`, sub: "best: 18 days" },
        ].map(m => (
          <div key={m.label} className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-2xl font-bold text-slate-900">{m.value}</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{m.label}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Activity heatmap */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm font-bold text-slate-900 mb-4">Activity — last 12 weeks</p>
          <div
            className="grid gap-[3px]"
            style={{ gridTemplateColumns: `repeat(${Math.ceil(HEATMAP_DATA.length / 7)}, 1fr)` }}
          >
            {HEATMAP_DATA.map((v, i) => (
              <div
                key={i}
                className="aspect-square rounded-[2px]"
                style={{
                  background: v === 0 ? "#F1F5F9"
                    : v === 1 ? "#C7D2FE"
                    : v === 2 ? "#818CF8"
                    : "#4338CA",
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-400">
            <span>Less</span>
            {["#F1F5F9","#C7D2FE","#818CF8","#4338CA"].map(c => (
              <span key={c} className="w-3 h-3 rounded-[2px] inline-block" style={{ background: c }} />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* Platform progress */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm font-bold text-slate-900 mb-4">Platform progress</p>
          <div className="space-y-3">
            {Object.entries(platformTotals).map(([platform, pct]) => (
              <div key={platform}>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span className="font-medium">{platform}</span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${pct}%`, background: platformColors[platform] ?? "#6366F1" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "My learning",   page: "my-learning",     Icon: BookOpen,    color: "bg-blue-50   text-blue-700"   },
          { label: "Recommended",   page: "recommendations", Icon: Sparkles,    color: "bg-purple-50 text-purple-700" },
          { label: "Flashcards",    page: "flashcards",      Icon: Layers,      color: "bg-indigo-50 text-indigo-700" },
          { label: "Study buddies", page: "buddies",         Icon: Users,       color: "bg-green-50  text-green-700"  },
        ].map(({ label, page, Icon, color }) => (
          <button
            key={page}
            onClick={() => setPage(page)}
            className={`flex flex-col items-center gap-2 p-5 rounded-2xl border border-slate-200 hover:shadow-sm transition-all ${color}`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-semibold">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  REWARDS (placeholder)
// ─────────────────────────────────────────────
function Rewards() {
  const xpPct = Math.round((CURRENT_USER.xp / CURRENT_USER.xpToNext) * 100);
  return (
    <div className="p-8 max-w-3xl mx-auto w-full">
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-8 text-white mb-6">
        <Trophy className="w-10 h-10 mb-4 opacity-90" />
        <h2 className="text-2xl font-bold mb-1">Next reward unlock</h2>
        <p className="text-orange-100 mb-5">Spotify Premium (1 month)</p>
        <div className="flex justify-between text-sm font-bold mb-2">
          <span>{CURRENT_USER.xp.toLocaleString()} XP</span>
          <span>{CURRENT_USER.xpToNext.toLocaleString()} XP</span>
        </div>
        <div className="w-full bg-black/20 rounded-full h-3">
          <div className="bg-white h-3 rounded-full transition-all" style={{ width: `${xpPct}%` }} />
        </div>
        <p className="text-xs text-orange-100 mt-2">{CURRENT_USER.xpToNext - CURRENT_USER.xp} XP to go</p>
      </div>
      <p className="text-center text-sm text-slate-400">More reward tiers coming soon…</p>
    </div>
  );
}

// ─────────────────────────────────────────────
//  LOGIN
// ─────────────────────────────────────────────
function Login({ onLogin }) {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail]   = useState("");
  const [pw, setPw]         = useState("");

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-slate-900">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-40" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">SkillOS</span>
        </div>

        <div className="relative z-10 mb-20">
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">
            Upgrade your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              human potential.
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-md leading-relaxed">
            The unified operating system for self-directed learners. Track, learn, and grow — across every platform.
          </p>
        </div>

        <div className="relative z-10 text-sm text-slate-500 flex justify-between w-full">
          <span>© 2026 SkillOS</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500">Sign in to continue your learning journey.</p>
          </div>

          <form onSubmit={e => { e.preventDefault(); onLogin(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPw ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98]"
            >
              Sign in <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-xs"><span className="px-3 bg-white text-slate-400">or continue with</span></div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[{ Icon: Chrome, label: "Google" }, { Icon: Github, label: "GitHub" }].map(({ Icon, label }) => (
              <button key={label} type="button" className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            No account?{" "}
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Sign up for free</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(true); // set false to see login page
  const [page, setPage]         = useState("dashboard");

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  const pageEl = {
    "dashboard":       <Dashboard setPage={setPage} />,
    "my-learning":     <MyLearning />,
    "recommendations": <Recommendations />,
    "flashcards":      <Flashcards />,
    "buddies":         <StudyBuddies />,
    "rewards":         <Rewards />,
  }[page] ?? <Dashboard setPage={setPage} />;

  return (
    <Shell page={page} setPage={setPage} onLogout={() => setLoggedIn(false)}>
      {pageEl}
    </Shell>
  );
}