import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useEcoFlux } from '../lib/dataStore';
import { DEMO_USER } from '../lib/supabase';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('campus.manager@gvit.edu');
  const [password, setPassword] = useState('ecoflux2026');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useEcoFlux();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/auth/callback');
    } else {
      setErrorMsg(res.error || 'Invalid credentials.');
    }
  };

  const handleDemoFill = () => {
    setEmail(DEMO_USER.email);
    setPassword('demo-campus-key');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#050a08] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Background ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[450px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-5xl rounded-3xl bg-[#091510]/90 border border-emerald-500/20 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative z-10">
        
        {/* Left Pane: Branding & Statement */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-emerald-500/15 bg-gradient-to-b from-emerald-950/40 via-transparent to-black/60">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <Zap className="w-5 h-5 text-black fill-black" />
              </div>
              <span className="font-extrabold text-2xl tracking-wider text-white">
                ECO<span className="text-emerald-400">FLUX</span>
              </span>
            </Link>

            <div className="mt-12 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/25">
                CAMPUS ACCESS GATEWAY
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Your campus. Your energy. One intelligent view.
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Log in to coordinate rooftop solar arrays, manage central battery dispatch, and access live predictive energy analytics.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-emerald-500/15 space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full Supabase Database & Auth Integration</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Protected Facility Manager & Admin Roles</span>
            </div>
          </div>
        </div>

        {/* Right Pane: Login Card */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white">Sign In</h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter your credentials to access the EcoFlux campus hub.
            </p>
          </div>

          {/* Quick Demo Fill Button */}
          <button
            type="button"
            onClick={handleDemoFill}
            className="w-full mb-5 py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Use One-Click Demo Credentials (Campus Manager)</span>
          </button>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Campus Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@university.edu"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-emerald-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to registered campus email.')}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-emerald-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating with Supabase...</span>
              ) : (
                <>
                  <span>Log In to EcoFlux</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social login option */}
          <div className="mt-6 pt-6 border-t border-emerald-500/10">
            <button
              type="button"
              onClick={() => {
                login('google.user@university.edu', 'google-oauth');
                navigate('/auth/callback');
              }}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <span>Continue with University Google SSO</span>
            </button>

            <div className="text-center mt-4">
              <span className="text-xs text-slate-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-emerald-400 hover:underline font-semibold">
                  Create Account
                </Link>
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
