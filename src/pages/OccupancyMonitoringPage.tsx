import React, { useState } from 'react';
import { useEcoFlux } from '../lib/dataStore';
import { BentoCard } from '../components/common/BentoCard';
import { MetricBadge } from '../components/common/MetricBadge';
import { OccupancyEnergyChart } from '../components/charts/OccupancyEnergyChart';
import {
  Users,
  AlertTriangle,
  Zap,
  Building,
  CheckCircle2,
  TrendingUp,
  Sliders,
  ChevronRight,
  Flame,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const OccupancyMonitoringPage: React.FC = () => {
  const { buildings, applyRecommendation } = useEcoFlux();
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(buildings[3].id); // Default to Hostel A anomaly

  const totalHeadcount = buildings.reduce((acc, b) => acc + b.currentOccupancy, 0);
  const totalCapacity = buildings.reduce((acc, b) => acc + b.designedOccupancy, 0);
  const avgOccupancy = Math.round((totalHeadcount / totalCapacity) * 100);

  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId) || buildings[0];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-rose-400" />
            <span>Building Occupancy & Heatmap Correlator</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time headcount density vs. power draw to detect energy waste during low student occupancy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#091510] border border-rose-500/20 text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Active Campus Occupants</span>
            <span className="text-xl font-bold font-mono text-white">
              {totalHeadcount.toLocaleString()} <span className="text-xs text-slate-400">/ {totalCapacity.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Critical Anomaly Highlight Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/60 via-[#170c0f] to-[#0a1511] border border-rose-500/40 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_10px_30px_rgba(244,63,94,0.15)]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/40">
                CRITICAL IDLE ENERGY DISCREPANCY
              </span>
              <span className="text-xs text-rose-300 font-mono font-bold">Hostel Block A</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              High energy consumption (71.4 kW) detected despite low student occupancy (29.5%)
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed max-w-2xl">
              Power draw is 24% above historical baseline during midday classes. Suspected hot water circulation pump running unthrottled and common lounge air conditioners left on manual override.
            </p>
          </div>
        </div>

        <button
          onClick={() => applyRecommendation('rec-04')}
          className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all shrink-0 self-end md:self-center flex items-center gap-1.5"
        >
          <span>Apply Load Shedding</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <MetricBadge label="Average Occupancy" value={avgOccupancy} unit="%" subtext="Across all 8 zones" icon={Users} variant="cyan" />
        <MetricBadge label="Energy / Person" value="0.26" unit="kW/cap" subtext="Optimal benchmark: 0.28" icon={Zap} variant="emerald" />
        <MetricBadge label="Anomalous Zones" value="1" unit="facility" subtext="Hostel Block A flagged" icon={AlertTriangle} variant="rose" />
        <MetricBadge label="Recess Idle Waste" value="$17.10" unit="/day" subtext="Mitigable with scheduling" icon={Flame} variant="amber" />
      </div>

      {/* Main Scatter Correlation Chart */}
      <BentoCard
        title="Live Occupancy vs. Electricity Demand Correlation"
        subtitle="Scatter distribution mapping real-time kW draw against headcount %"
        icon={<Users className="w-4 h-4 text-emerald-400" />}
      >
        <OccupancyEnergyChart />
      </BentoCard>

      {/* Building Occupancy Heatmap Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Campus Facility Utilization Grid</h3>
          <span className="text-xs text-slate-400">Click any card to inspect facility telemetry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {buildings.map((b) => {
            const isAnomaly = b.status === 'warning';
            const isSelected = b.id === selectedBuildingId;
            return (
              <div
                key={b.id}
                onClick={() => setSelectedBuildingId(b.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0f241a] border-emerald-400 ring-1 ring-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                    : isAnomaly
                    ? 'bg-[#150a0d] border-rose-500/30 hover:border-rose-500/50'
                    : 'bg-[#091510] border-emerald-500/15 hover:border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-emerald-400">{b.code}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      isAnomaly
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {isAnomaly ? 'Anomaly' : `${b.occupancyPct}% Occupied`}
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm">{b.name}</h4>
                <span className="text-xs text-slate-400 mt-0.5 block">{b.category}</span>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>Headcount</span>
                    <span className="text-white font-bold">{b.currentOccupancy} / {b.designedOccupancy}</span>
                  </div>
                  <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full rounded-full ${
                        isAnomaly ? 'bg-rose-500' : b.occupancyPct > 80 ? 'bg-emerald-400' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${b.occupancyPct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Power Draw</span>
                  <span className={`font-bold ${isAnomaly ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {b.currentDemandKw} kW
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
