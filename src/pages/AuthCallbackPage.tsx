import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Sparkles } from 'lucide-react';
import { useEcoFlux } from '../lib/dataStore';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useEcoFlux();
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Connecting to campus IoT gateways...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(45);
      setStatusText('Synchronizing building sub-meters & 318 kW rooftop solar arrays...');
    }, 500);

    const timer2 = setTimeout(() => {
      setProgress(80);
      setStatusText('Validating 1.2 MWh BESS battery telemetry & AI prediction models...');
    }, 1100);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Campus grid synchronized. Launching Smart Dashboard...');
    }, 1700);

    const redirectTimer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }, 2100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(redirectTimer);
    };
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-[#050a08] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Radiant radial background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="text-center max-w-sm w-full space-y-6 relative z-10">
        
        {/* Animated Glowing Logo with particle pulse */}
        <div className="relative inline-block mx-auto">
          {/* Animated concentric pulse rings */}
          <div className="absolute inset-0 rounded-3xl bg-emerald-400/20 animate-ping opacity-50" />
          <div className="absolute -inset-4 rounded-3xl bg-emerald-500/10 blur-xl animate-pulse" />

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.5)] relative z-10 mx-auto">
            <Zap className="w-10 h-10 text-black fill-black animate-bounce" />
          </div>
        </div>

        {/* Brand & Sync Title */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-wider text-white">
            ECO<span className="text-emerald-400">FLUX</span>
          </h2>
          <p className="text-sm font-semibold text-emerald-300 mt-2 font-mono flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>Synchronizing campus energy…</span>
          </p>
        </div>

        {/* Progress Bar with Liquid Glow */}
        <div className="w-full bg-black/60 rounded-full h-2.5 p-0.5 border border-emerald-500/30 overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(52,211,153,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Telemetry Stage Log */}
        <p className="text-xs text-slate-400 font-mono transition-opacity">
          {statusText}
        </p>

      </div>
    </div>
  );
};
