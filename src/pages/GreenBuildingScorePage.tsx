import React from 'react';
import { useEcoFlux } from '../lib/dataStore';
import { BentoCard } from '../components/common/BentoCard';
import { MetricBadge } from '../components/common/MetricBadge';
import {
  Award,
  Trophy,
  Medal,
  Leaf,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Sun,
  Users
} from 'lucide-react';

export const GreenBuildingScorePage: React.FC = () => {
  const { greenScores, campusGreenScore } = useEcoFlux();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Award className="w-7 h-7 text-lime-400" />
            <span>Green Building Efficiency Scores & Leaderboard</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gamified multi-criteria efficiency benchmark (0–100) comparing renewable utilization, peak shaving, and occupant alignment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-400 text-xs font-mono font-bold">
            ACCREDITATION: PLATINUM CAMPUS TIER
          </span>
        </div>
      </div>

      {/* Hero Campus Trophy Callout */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#10241b] to-[#07130e] border border-emerald-500/30 backdrop-blur-xl relative overflow-hidden shadow-[0_15px_45px_rgba(16,185,129,0.2)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black shadow-[0_0_35px_rgba(245,158,11,0.4)] shrink-0">
              <Trophy className="w-10 h-10 fill-black" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                🏆 CAMPUS-WIDE GREEN EFFICIENCY SCORE
              </span>
              <div className="flex items-baseline justify-center md:justify-start gap-2 mt-1">
                <span className="text-5xl sm:text-6xl font-black font-mono text-white tracking-tight">
                  {campusGreenScore}
                </span>
                <span className="text-2xl font-bold text-slate-400">/ 100</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 ml-2">
                  Platinum Grade
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-2">
                "Your campus is performing <strong>+4.2% better than last month</strong>, ranking in the top 5% of regional institutions."
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="p-3.5 rounded-2xl bg-black/50 border border-emerald-500/20 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Clean Energy</span>
              <span className="text-base font-bold font-mono text-emerald-400">78% Ratio</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/50 border border-emerald-500/20 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Rank</span>
              <span className="text-base font-bold font-mono text-amber-300">#1 Regional</span>
            </div>
          </div>

        </div>
      </div>

      {/* Buildings Leaderboard Table */}
      <div className="p-6 rounded-3xl bg-[#091510] border border-emerald-500/20 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Facility Efficiency Leaderboard</h3>
          <span className="text-xs text-slate-400">Ranked by composite efficiency index</span>
        </div>

        <div className="space-y-3">
          {greenScores.map((item) => {
            const badgeColors = {
              Platinum: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
              Gold: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
              Silver: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
              Bronze: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }[item.badge];

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-black/40 border border-emerald-500/10 hover:border-emerald-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left: Rank & Name */}
                <div className="flex items-center gap-4 min-w-[240px]">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                    item.rank === 1 ? 'bg-amber-400 text-black shadow-md' : 'bg-white/5 text-slate-300'
                  }`}>
                    #{item.rank}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{item.buildingName}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400">{item.category}</span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.2 rounded border ${badgeColors}`}>
                        {item.badge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle: Sub-score Breakdown Bars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 w-full text-xs font-mono">
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>HVAC Eff.</span>
                      <span className="text-white">{item.energyEfficiency}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${item.energyEfficiency}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Solar Ratio</span>
                      <span className="text-white">{item.renewableRatio}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: `${item.renewableRatio}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Occupancy Alignment</span>
                      <span className="text-white">{item.occupancyAlignment}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${item.occupancyAlignment}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Peak Shaving</span>
                      <span className="text-white">{item.peakShaving}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-400 h-full rounded-full" style={{ width: `${item.peakShaving}%` }} />
                    </div>
                  </div>
                </div>

                {/* Right: Score Pill & Trend */}
                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <div className="text-right">
                    <span className="text-xl font-bold font-mono text-emerald-400">{item.overallScore}</span>
                    <span className="text-xs text-slate-500 font-mono">/100</span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-1 rounded-lg border ${
                    item.monthlyChange >= 0
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {item.monthlyChange >= 0 ? `+${item.monthlyChange}` : item.monthlyChange}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
