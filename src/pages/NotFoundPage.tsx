import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, AlertTriangle, ArrowLeft, Home, LayoutDashboard } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050a08] text-slate-100 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full p-8 rounded-3xl bg-[#091510]/95 border border-emerald-500/20 backdrop-blur-2xl shadow-2xl relative z-10 space-y-6">
        
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(244,63,94,0.3)]">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
            ERROR 404 • DISCONNECTED NODE
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-3">Telemetry Feed Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            The campus route or telemetry node you requested does not exist on the current microgrid network.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Campus Dashboard</span>
          </Link>

          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
