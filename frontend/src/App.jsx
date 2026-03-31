import React, { useState, useEffect } from "react";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Zap,
  Bell, LayoutDashboard, BookOpen, Trophy, LogOut,
  Star, Flame, Sparkles, Layers, Users, User,
} from "lucide-react";

import { api } from "./api";
import MyLearning      from "./components/MyLearning";
import Recommendations from "./components/Recommendations";
import Flashcards      from "./components/Flashcards";
import StudyBuddies    from "./components/StudyBuddies";

const NAV = [
  { id: "dashboard",       label: "Dashboard",     Icon: LayoutDashboard },
  { id: "my-learning",     label: "My learning",   Icon: BookOpen        },
  { id: "recommendations", label: "Recommended",   Icon: Sparkles        },
  { id: "flashcards",      label: "Flashcards",    Icon: Layers          },
  { id: "buddies",         label: "Study buddies", Icon: Users           },
  { id: "rewards",         label: "Rewards",       Icon: Trophy          },
];

// ── Shell ──────────────────────────────────────────────────────
function Shell({ page, setPage, onLogout, user, children }) {
  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow">
                <Zap className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Skill<span className="text-indigo-600">OS</span>
              </span>
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
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 mb-2">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name ?? "—"}</p>
              <p className="text-xs text-slate-500">
                Level {user?.level ?? 1} · {user?.streak ?? 0}d streak
              </p>
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

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-base font-bold text-slate-900 capitalize">
            {NAV.find(n => n.id === page)?.label ?? "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-full text-xs">
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <Flame className="w-3.5 h-3.5" fill="currentColor" />
                {user?.streak ?? 0}d
              </span>
              <span className="w-px h-3 bg-slate-300" />
              <span className="flex items-center gap-1 text-indigo-600 font-bold">
                <Star className="w-3.5 h-3.5" fill="currentColor" />
                {(user?.xp ?? 0).toLocaleString()} XP
              </span>
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────
function Dashboard({ setPage, user }) {
  const [resources, setResources] = useState([]);
  const [heatmap, setHeatmap]     = useState({});

  useEffect(() => {
    api.resources().then(setResources).catch(console.error);
    api.heatmap().then(setHeatmap).catch(console.error);
  }, []);

  const inProgress = resources.filter(r => r.status === "in-progress");
  const xpPct = user
    ? Math.round((user.xp / (user.xp_to_next || 3000)) * 100)
    : 0;

  const platformTotals = inProgress.reduce((acc, r) => {
    acc[r.platform] = acc[r.platform]
      ? Math.round((acc[r.platform] + r.progress) / 2)
      : r.progress;
    return acc;
  }, {});

  const platformColors = {
    YouTube: "#E24B4A", Udemy: "#7C3AED", Coursera: "#2563EB",
    freeCodeCamp: "#16A34A", Medium: "#64748B",
  };

  const heatmapCells = Array.from({ length: 84 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (83 - i));
    const key = d.toISOString().slice(0, 10);
    const mins = heatmap[key] ?? 0;
    return mins === 0 ? 0 : mins < 20 ? 1 : mins < 45 ? 2 : 3;
  });

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
      <div className="relative bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-7 overflow-hidden">
        <h1 className="text-2xl font-bold text-white mb-1">
          Good morning, {firstName}! 👋
        </h1>
        <p className="text-indigo-200 text-sm mb-5 max-w-md">
          {inProgress.length} course{inProgress.length !== 1 ? "s" : ""} in progress.
        </p>
        <div className="max-w-xs">
          <div className="flex justify-between text-xs text-indigo-300 mb-1">
            <span>Level {user?.level ?? 1}</span>
            <span>{user?.xp ?? 0} / {user?.xp_to_next ?? 3000} XP</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${xpPct}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Courses active",  value: inProgress.length,    sub: "in progress" },
          { label: "Completed",       value: resources.filter(r => r.status === "completed").length, sub: "resources" },
          { label: "Streak",          value: `${user?.streak ?? 0}d`, sub: "keep it up!" },
          { label: "Level",           value: user?.level ?? 1,       sub: "current level" },
        ].map(m => (
          <div key={m.label} className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-2xl font-bold text-slate-900">{m.value}</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{m.label}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm font-bold text-slate-900 mb-4">Activity — last 12 weeks</p>
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
            {heatmapCells.map((v, i) => (
              <div key={i} className="aspect-square rounded-[2px]" style={{
                background: v === 0 ? "#F1F5F9" : v === 1 ? "#C7D2FE" : v === 2 ? "#818CF8" : "#4338CA",
              }} />
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

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm font-bold text-slate-900 mb-4">Platform progress</p>
          {Object.keys(platformTotals).length === 0 ? (
            <p className="text-xs text-slate-400">No resources yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(platformTotals).map(([platform, pct]) => (
                <div key={platform}>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span className="font-medium">{platform}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all"
                      style={{ width: `${pct}%`, background: platformColors[platform] ?? "#6366F1" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "My learning",   page: "my-learning",     Icon: BookOpen,  color: "bg-blue-50 text-blue-700"     },
          { label: "Recommended",   page: "recommendations", Icon: Sparkles,  color: "bg-purple-50 text-purple-700" },
          { label: "Flashcards",    page: "flashcards",      Icon: Layers,    color: "bg-indigo-50 text-indigo-700" },
          { label: "Study buddies", page: "buddies",         Icon: Users,     color: "bg-green-50 text-green-700"   },
        ].map(({ label, page, Icon, color }) => (
          <button key={page} onClick={() => setPage(page)}
            className={`flex flex-col items-center gap-2 p-5 rounded-2xl border border-slate-200 hover:shadow-sm transition-all ${color}`}>
            <Icon className="w-6 h-6" />
            <span className="text-xs font-semibold">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Rewards ────────────────────────────────────────────────────
function Rewards({ user }) {
  const xpPct = user
    ? Math.round((user.xp / (user.xp_to_next || 3000)) * 100)
    : 0;

  return (
    <div className="p-8 max-w-3xl mx-auto w-full">
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-8 text-white mb-6">
        <Trophy className="w-10 h-10 mb-4 opacity-90" />
        <h2 className="text-2xl font-bold mb-1">Next reward unlock</h2>
        <p className="text-orange-100 mb-5">Spotify Premium (1 month)</p>
        <div className="flex justify-between text-sm font-bold mb-2">
          <span>{(user?.xp ?? 0).toLocaleString()} XP</span>
          <span>{(user?.xp_to_next ?? 3000).toLocaleString()} XP</span>
        </div>
        <div className="w-full bg-black/20 rounded-full h-3">
          <div className="bg-white h-3 rounded-full transition-all" style={{ width: `${xpPct}%` }} />
        </div>
        <p className="text-xs text-orange-100 mt-2">
          {(user?.xp_to_next ?? 3000) - (user?.xp ?? 0)} XP to go
        </p>
      </div>
      <p className="text-center text-sm text-slate-400">More reward tiers coming soon…</p>
    </div>
  );
}

// ── Shared Auth Layout ─────────────────────────────────────────
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-slate-900">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden flex-col justify-between p-12">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
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
            The unified operating system for self-directed learners.
          </p>
        </div>
        <div className="relative z-10 text-sm text-slate-500">
          <span>© 2026 SkillOS</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

// ── Login ──────────────────────────────────────────────────────
function Login({ onLogin, onGoRegister }) {
  const [showPw, setShowPw]   = useState(false);
  const [email, setEmail]     = useState("");
  const [pw, setPw]           = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login(email, pw);
      localStorage.setItem("skillos_token", data.access_token);
      onLogin();
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
        <p className="text-slate-500">Sign in to continue your learning journey.</p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
              type={showPw ? "text" : "password"} value={pw}
              onChange={e => setPw(e.target.value)} required placeholder="••••••••"
              className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            <button type="button" onClick={() => setShowPw(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-60">
          {loading ? "Signing in…" : <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        No account?{" "}
        <button onClick={onGoRegister}
          className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
          Create one for free
        </button>
      </p>
    </AuthLayout>
  );
}

// ── Register ───────────────────────────────────────────────────
function Register({ onLogin, onGoLogin }) {
  const [showPw, setShowPw]     = useState(false);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [pw, setPw]             = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (pw !== pwConfirm) {
      setError("Passwords do not match.");
      return;
    }
    if (pw.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const data = await api.register(name, email, pw);
      localStorage.setItem("skillos_token", data.access_token);
      onLogin();
    } catch (err) {
      const msg = err.message ?? "";
      if (msg.includes("already registered")) {
        setError("That email is already registered. Try signing in.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h2>
        <p className="text-slate-500">Start your learning journey today — it's free.</p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text" value={name} onChange={e => setName(e.target.value)} required
              placeholder="Jane Smith"
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
        </div>

        {/* Email */}
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

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPw ? "text" : "password"} value={pw}
              onChange={e => setPw(e.target.value)} required placeholder="Min. 6 characters"
              className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            <button type="button" onClick={() => setShowPw(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPw ? "text" : "password"} value={pwConfirm}
              onChange={e => setPwConfirm(e.target.value)} required placeholder="Re-enter password"
              className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                pwConfirm && pw !== pwConfirm
                  ? "border-red-300 focus:ring-red-300"
                  : "border-slate-200"
              }`}
            />
          </div>
          {pwConfirm && pw !== pwConfirm && (
            <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-60 mt-2">
          {loading ? "Creating account…" : <><span>Create account</span><ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <button onClick={onGoLogin}
          className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
          Sign in
        </button>
      </p>
    </AuthLayout>
  );
}

// ── Root App ───────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("skillos_token"));
  const [authPage, setAuthPage] = useState("login"); // "login" | "register"
  const [user, setUser]         = useState(null);
  const [page, setPage]         = useState("dashboard");

  useEffect(() => {
    if (loggedIn) {
      api.me().then(setUser).catch(() => {
        localStorage.removeItem("skillos_token");
        setLoggedIn(false);
      });
    }
  }, [loggedIn]);

  function handleLogin() {
    setLoggedIn(true);
    setAuthPage("login");
  }

  function handleLogout() {
    localStorage.removeItem("skillos_token");
    setLoggedIn(false);
    setUser(null);
    setPage("dashboard");
  }

  if (!loggedIn) {
    return authPage === "register"
      ? <Register onLogin={handleLogin} onGoLogin={() => setAuthPage("login")} />
      : <Login    onLogin={handleLogin} onGoRegister={() => setAuthPage("register")} />;
  }

  const pageEl = {
    "dashboard":       <Dashboard setPage={setPage} user={user} />,
    "my-learning":     <MyLearning />,
    "recommendations": <Recommendations />,
    "flashcards":      <Flashcards />,
    "buddies":         <StudyBuddies />,
    "rewards":         <Rewards user={user} />,
  }[page] ?? <Dashboard setPage={setPage} user={user} />;

  return (
    <Shell page={page} setPage={setPage} onLogout={handleLogout} user={user}>
      {pageEl}
    </Shell>
  );
}