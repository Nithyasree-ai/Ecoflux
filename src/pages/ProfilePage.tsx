import React from 'react';
import { useEcoFlux } from '../lib/dataStore';
import { BentoCard } from '../components/common/BentoCard';
import {
  User,
  Shield,
  Building,
  Mail,
  Key,
  Clock,
  CheckCircle2,
  Lock,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, logout, campusSettings } = useEcoFlux();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <User className="w-7 h-7 text-emerald-400" />
            <span>Campus Operator Profile</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Account credentials, authorization tier, and microgrid security audit logs.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* User Info Bento Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-[#091510] border border-emerald-500/20 backdrop-blur-xl flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 p-1 shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4">
            <div className="w-full h-full rounded-[22px] bg-[#07130e] flex items-center justify-center font-bold text-3xl text-emerald-400">
              {user?.fullName?.charAt(0) || 'C'}
            </div>
          </div>

          <h2 className="text-xl font-bold text-white">{user?.fullName || 'Campus Administrator'}</h2>
          <span className="text-xs font-mono text-emerald-400 font-semibold mt-0.5">{user?.role}</span>
          <span className="text-xs text-slate-400 mt-2">{user?.institution || campusSettings.campusName}</span>

          <div className="w-full mt-6 pt-6 border-t border-emerald-500/10 space-y-2.5 text-xs text-left">
            <div className="flex items-center justify-between text-slate-400">
              <span>Email:</span>
              <span className="text-white font-mono">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Campus Code:</span>
              <span className="text-white font-mono">{user?.campusCode || campusSettings.campusCode}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Access Level:</span>
              <span className="text-emerald-400 font-semibold">Tier-1 Full Dispatch</span>
            </div>
          </div>
        </div>

        {/* Security & Activity Logs (Spans 2 columns) */}
        <div className="md:col-span-2 space-y-5">
          <div className="p-6 rounded-3xl bg-[#091510] border border-emerald-500/20 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Security & Microgrid Audit Trail</span>
              </h3>
              <span className="text-xs text-slate-400">Past 24 Hours</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Automated BESS Charge Command Executed</span>
                    <span className="text-slate-400 text-[11px]">Directing +84.5 kW rooftop solar surplus into central storage pack.</span>
                  </div>
                </div>
                <span className="text-slate-500 font-mono text-[10px] shrink-0">15m ago</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Operator Authentication Via Supabase</span>
                    <span className="text-slate-400 text-[11px]">Session initiated from authenticated campus gateway subnet.</span>
                  </div>
                </div>
                <span className="text-slate-500 font-mono text-[10px] shrink-0">42m ago</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">What-If Scenario Simulation Generated</span>
                    <span className="text-slate-400 text-[11px]">Model run: +50 kW solar, +200 kWh BESS, +1.5°C HVAC setpoint.</span>
                  </div>
                </div>
                <span className="text-slate-500 font-mono text-[10px] shrink-0">1h ago</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">AI Model Inference Retrained</span>
                    <span className="text-slate-400 text-[11px]">EcoFlux-XGB-v2.4 updated with yesterday's solar & occupancy telemetry.</span>
                  </div>
                </div>
                <span className="text-slate-500 font-mono text-[10px] shrink-0">4h ago</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
