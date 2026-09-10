import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Heart, ExternalLink, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-emerald-500/15 bg-[#040806] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <Zap className="w-5 h-5 text-black fill-black" />
              </div>
              <span className="font-bold text-xl tracking-wider text-white">
                ECO<span className="text-emerald-400">FLUX</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed text-sm">
              Smart Energy Management for Green Campuses. Unified telemetry, solar generation analytics, BESS storage dispatch, and AI predictive intelligence in one intelligent platform.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Campus Grid Status: 100% Operational (482 kW Live)</span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Platform Hubs</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Smart Dashboard</Link></li>
              <li><Link to="/energy" className="hover:text-emerald-400 transition-colors">Energy Consumption</Link></li>
              <li><Link to="/solar" className="hover:text-emerald-400 transition-colors">Solar Generation</Link></li>
              <li><Link to="/battery" className="hover:text-emerald-400 transition-colors">Battery Storage BESS</Link></li>
              <li><Link to="/occupancy" className="hover:text-emerald-400 transition-colors">Occupancy Correlator</Link></li>
              <li><Link to="/predictions" className="hover:text-emerald-400 transition-colors">AI Forecasts</Link></li>
            </ul>
          </div>

          {/* Col 3: AI & Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Intelligence & Insights</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/recommendations" className="hover:text-emerald-400 transition-colors">Recommendation Engine</Link></li>
              <li><Link to="/simulator" className="hover:text-emerald-400 transition-colors">What-If Simulator</Link></li>
              <li><Link to="/copilot" className="hover:text-emerald-400 transition-colors">AI Energy Copilot</Link></li>
              <li><Link to="/green-score" className="hover:text-emerald-400 transition-colors">Green Building Score</Link></li>
              <li><Link to="/reports" className="hover:text-emerald-400 transition-colors">Reports & Analytics</Link></li>
              <li><Link to="/settings" className="hover:text-emerald-400 transition-colors">Campus Settings</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} ECOFLUX Systems Inc. Built for Green Campus Sustainability & Hackathon Presentation.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Vercel + Supabase Unified Architecture</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
