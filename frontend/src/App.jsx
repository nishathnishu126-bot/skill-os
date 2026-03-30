import React, { useState } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, Github, Chrome, Zap, 
  Search, Bell, LayoutDashboard, BookOpen, Trophy, LogOut, 
  PlayCircle, CheckCircle2, Clock, Star, Flame, Target, Youtube, BookA
} from 'lucide-react';

// --- DASHBOARD COMPONENT ---
const Dashboard = ({ onLogout }) => {
  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo */}
          <div className="h-20 flex items-center px-8 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <Zap className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">SkillOs</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-medium transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors">
              <BookOpen className="w-5 h-5" />
              My Lectures
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors">
              <Target className="w-5 h-5" />
              Quests & Tasks
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors">
              <Trophy className="w-5 h-5" />
              Rewards
            </a>
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-50">
            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">Alex Student</p>
              <p className="text-xs text-slate-500 truncate">Level 12 Scholar</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-96 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search lectures, topics, or tasks..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-sm"
            />
          </div>
          
          <div className="flex items-center gap-6 ml-auto">
            {/* Gamification Stats */}
            <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-full">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                <Flame className="w-4 h-4" fill="currentColor" />
                <span>5 Day Streak</span>
              </div>
              <div className="w-px h-4 bg-slate-300"></div>
              <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-sm">
                <Star className="w-4 h-4" fill="currentColor" />
                <span>2,450 XP</span>
              </div>
            </div>
            
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Hero Banner */}
          <div className="relative bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-8 overflow-hidden shadow-lg shadow-indigo-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Alex! 👋</h1>
              <p className="text-indigo-200 max-w-xl">You have 3 pending lectures and 2 daily quests to complete today. Keep up the momentum to reach Level 13!</p>
              <button className="mt-6 px-6 py-2.5 bg-white text-indigo-900 font-semibold rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2">
                <PlayCircle className="w-5 h-5" />
                Resume Last Lecture
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Pending Lectures Column (Spans 2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Pending Lectures</h2>
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All</button>
              </div>

              <div className="space-y-4">
                {/* YouTube Lecture Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <div className="w-16 h-16 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <Youtube className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-red-500">YouTube</span>
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> 15 mins left</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Organic Chemistry: Alkynes</h3>
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-xs text-slate-500 text-right">75% Complete</p>
                  </div>
                  <button className="w-full sm:w-auto mt-4 sm:mt-0 px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors shrink-0">
                    Continue
                  </button>
                </div>

                {/* Udemy Lecture Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <div className="w-16 h-16 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <BookA className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Udemy</span>
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> 1.5 hours total</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">React 18 Masterclass: Hooks</h3>
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                    <p className="text-xs text-slate-500 text-right">10% Complete</p>
                  </div>
                  <button className="w-full sm:w-auto mt-4 sm:mt-0 px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors shrink-0">
                    Start
                  </button>
                </div>

                {/* Khan Academy Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5 items-start sm:items-center opacity-80">
                  <div className="w-16 h-16 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Zap className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Khan Academy</span>
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Not started</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Macroeconomics: Supply & Demand</h3>
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto mt-4 sm:mt-0 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shrink-0">
                    Start
                  </button>
                </div>
              </div>
            </div>

            {/* Daily Quests & Rewards Column */}
            <div className="space-y-6">
              
              {/* Daily Quests */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    Daily Quests
                  </h2>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">1/3 Done</span>
                </div>

                <div className="space-y-4">
                  {/* Quest 1 (Completed) */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 opacity-60">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" fill="currentColor" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 line-through">Login for 5 days in a row</h4>
                      <p className="text-xs font-semibold text-amber-500 mt-1">+50 XP Earned</p>
                    </div>
                  </div>

                  {/* Quest 2 */}
                  <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors group cursor-pointer">
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-indigo-500 shrink-0 mt-0.5 flex items-center justify-center"></div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Finish 1 Pending Lecture</h4>
                      <p className="text-xs font-semibold text-amber-500 mt-1 flex items-center gap-1">
                        <Star className="w-3 h-3" fill="currentColor" /> +100 XP
                      </p>
                    </div>
                  </div>

                  {/* Quest 3 */}
                  <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors group cursor-pointer">
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-indigo-500 shrink-0 mt-0.5 flex items-center justify-center"></div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Score 80%+ on a Practice Quiz</h4>
                      <p className="text-xs font-semibold text-amber-500 mt-1 flex items-center gap-1">
                        <Star className="w-3 h-3" fill="currentColor" /> +150 XP
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reward Progress */}
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-sm p-6 text-white relative overflow-hidden">
                <div className="absolute right-[-20px] top-[-20px] opacity-20 transform rotate-12">
                  <Trophy className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-1">Next Reward Unlock</h3>
                  <p className="text-orange-100 text-sm mb-4">Spotify Premium (1 Month)</p>
                  
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span>2,450 XP</span>
                    <span>3,000 XP</span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-3 mb-4">
                    <div className="bg-white h-3 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                  
                  <button className="w-full py-2 bg-white text-orange-600 font-bold rounded-lg shadow-sm hover:bg-orange-50 transition-colors text-sm">
                    View All Rewards
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- LOGIN COMPONENT (Your Original Code) ---
const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in with:', email, password);
    onLogin(); // Trigger the app state to switch to dashboard
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-slate-900">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 overflow-hidden flex-col justify-between p-12">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-40"></div>
        
        {/* Logo area */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap className="w-6 h-6 text-white" fill="currentColor" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">SkillOs</span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 mb-20">
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Upgrade your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              human potential.
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-md leading-relaxed">
            Join the ultimate operating system for lifelong learners. Track your progress, master new skills, and connect with elite professionals.
          </p>
          
          {/* Testimonial / Social Proof */}
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden`}>
                  <img 
                    src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                    alt="User avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-sm">
              <p className="text-white font-medium">Joined by 10,000+ users</p>
              <p className="text-slate-500">Including top tech talent</p>
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="relative z-10 text-sm text-slate-500 flex justify-between w-full">
          <span>©️ 2026 SkillOs Inc.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        {/* Mobile Logo (Visible only on mobile) */}
        <div className="absolute top-8 left-8 flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">SkillOs</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Welcome back</h2>
            <p className="text-slate-500">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer">
                  Remember for 30 days
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all active:scale-[0.98]"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                <Chrome className="w-5 h-5 text-slate-700" />
                Google
              </button>
              <button type="button" className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                <Github className="w-5 h-5 text-slate-700" />
                GitHub
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="mt-10 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign up for free
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP (Handles State between Login and Dashboard) ---
export default function App() {
  // We default to true here so you can immediately see the new Dashboard!
  // Setting it to false would show the login page initially.
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <>
      {isLoggedIn ? (
        <Dashboard onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
    </>
  );
}

