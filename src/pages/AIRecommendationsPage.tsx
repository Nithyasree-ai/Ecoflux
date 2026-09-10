import React, { useState } from 'react';
import { useEcoFlux } from '../lib/dataStore';
import { BentoCard } from '../components/common/BentoCard';
import { MetricBadge } from '../components/common/MetricBadge';
import { RecommendationCategory } from '../types';
import {
  Sparkles,
  Zap,
  Sun,
  BatteryCharging,
  Users,
  AlertTriangle,
  Leaf,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export const AIRecommendationsPage: React.FC = () => {
  const { recommendations, applyRecommendation, dismissRecommendation } = useEcoFlux();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'applied'>('all');

  const categories: ('All' | RecommendationCategory)[] = [
    'All',
    'Energy Saving',
    'Solar Optimization',
    'Battery Optimization',
    'Peak Demand Alert',
    'Occupancy',
    'Renewable Energy'
  ];

  const filteredRecs = recommendations.filter((r) => {
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
    return matchesCat && matchesStatus;
  });

  const totalPotentialDailySavings = recommendations
    .filter((r) => r.status === 'active')
    .reduce((acc, r) => acc + r.estimatedDollarSaving, 0);

  const totalPotentialKwhSavings = recommendations
    .filter((r) => r.status === 'active')
    .reduce((acc, r) => acc + r.estimatedKwhSaving, 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-emerald-400" />
            <span>AI Prescriptive Recommendation Engine</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time rule-based and machine learning insights to optimize solar dispatch, battery storage, and building loads.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-[#091510] border border-emerald-500/20 text-right">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Active Queue Potential Savings</span>
          <span className="text-xl font-bold font-mono text-emerald-400">
            ${totalPotentialDailySavings.toFixed(2)} <span className="text-xs text-slate-400">/ day</span>
          </span>
        </div>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricBadge
          label="Active Recommendations"
          value={recommendations.filter(r => r.status === 'active').length}
          subtext="Actionable right now"
          icon={Sparkles}
          variant="emerald"
        />
        <MetricBadge
          label="Potential Daily Energy Saved"
          value={totalPotentialKwhSavings}
          unit="kWh"
          subtext="Equivalent to 12.4% grid offset"
          icon={Zap}
          variant="lime"
        />
        <MetricBadge
          label="Annualized Cost Offset"
          value={`$${Math.round(totalPotentialDailySavings * 365).toLocaleString()}`}
          subtext="At $0.18/kWh grid rate"
          icon={Leaf}
          variant="cyan"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#091510] border border-emerald-500/15">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-black shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'active', 'applied'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono uppercase font-semibold transition-all ${
                selectedStatus === st
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRecs.map((rec) => {
          const isApplied = rec.status === 'applied';
          const isCritical = rec.priority === 'critical';
          const isHigh = rec.priority === 'high';

          const iconMap: Record<RecommendationCategory, any> = {
            'Energy Saving': Zap,
            'Solar Optimization': Sun,
            'Battery Optimization': BatteryCharging,
            'Peak Demand Alert': AlertTriangle,
            'Occupancy': Users,
            'Renewable Energy': Leaf
          };

          const IconComp = iconMap[rec.category] || Sparkles;

          return (
            <div
              key={rec.id}
              className={`p-6 rounded-3xl border backdrop-blur-xl transition-all flex flex-col justify-between ${
                isApplied
                  ? 'bg-[#060e0a]/50 border-emerald-500/10 opacity-75'
                  : isCritical
                  ? 'bg-[#150a0d] border-rose-500/30 hover:border-rose-500/50'
                  : 'bg-[#091510] border-emerald-500/20 hover:border-emerald-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
              }`}
            >
              <div>
                {/* Card Top Pill Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase">{rec.category}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-bold ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : isHigh
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {rec.priority} priority
                    </span>
                    {isApplied && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        APPLIED
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mt-1">{rec.title}</h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{rec.description}</p>

                {/* Reason Panel */}
                <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-400">
                  <strong className="text-slate-300">Why this matters: </strong>
                  {rec.reason}
                </div>
              </div>

              {/* Bottom Metrics & Actions */}
              <div className="mt-5 pt-4 border-t border-emerald-500/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase">Est. Saving</span>
                    <span className="font-bold text-emerald-400 text-sm">${rec.estimatedDollarSaving}/day</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase">Clean Energy</span>
                    <span className="font-bold text-white text-sm">{rec.estimatedKwhSaving} kWh</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase">CO₂ Cut</span>
                    <span className="font-bold text-cyan-400 text-sm">{rec.co2ReductionKg} kg</span>
                  </div>
                </div>

                {/* Action Buttons */}
                {!isApplied ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dismissRecommendation(rec.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Dismiss"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => applyRecommendation(rec.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-1.5"
                    >
                      <span>Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Active in Campus Controller</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
