import React from 'react';
import { useEcoFlux } from '../lib/dataStore';
import { BatteryVisualizer } from '../components/3d/BatteryVisualizer';
import { BentoCard } from '../components/common/BentoCard';
import { MetricBadge } from '../components/common/MetricBadge';
import { FACILITY_SOLAR_PROFILES } from '../data/campusData';
import {
  BatteryCharging,
  Zap,
  Sun,
  ShieldCheck,
  TrendingDown,
  Clock,
  Thermometer,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  Activity
} from 'lucide-react';

export const BatteryMonitoringPage: React.FC = () => {
  const {
    battery,
    bessState,
    solarKw,
    totalDemandKw,
    buildings,
    selectedFacility,
    setSelectedFacility
  } = useEcoFlux();

  // Facility list for campus correlation selector
  const facilityOptions = [
    { code: 'ALL', name: 'All Facilities (Campus Grid)', demand: totalDemandKw, solar: solarKw },
    { code: 'ACAD', name: 'Academic Block', demand: 92.4, solar: 58.2 },
    { code: 'CS-LAB', name: 'Computer Science Block', demand: 88.6, solar: 69.5 },
    { code: 'LIB', name: 'Central Library', demand: 48.2, solar: 31.0 },
    { code: 'HOST-A', name: 'Hostel Block A', demand: 68.4, solar: 39.0 },
    { code: 'HOST-B', name: 'Hostel Block B', demand: 52.0, solar: 32.5 },
    { code: 'ADMIN', name: 'Administration Wing', demand: 39.1, solar: 22.8 },
    { code: 'ADV-LAB', name: 'Laboratory Block', demand: 118.0, solar: 51.0 },
    { code: 'CAFE', name: 'Campus Dining Hub', demand: 61.2, solar: 26.0 }
  ];

  const activeOption = facilityOptions.find(f => f.code === selectedFacility) || facilityOptions[0];
  const activeBuilding = buildings.find(b => b.code === selectedFacility);
  const activeSolarProfile = selectedFacility !== 'ALL' ? FACILITY_SOLAR_PROFILES[selectedFacility] : null;

  const currentDemand = selectedFacility === 'ALL'
    ? totalDemandKw
    : (activeBuilding?.currentDemandKw || activeOption.demand);

  const currentSolar = selectedFacility === 'ALL'
    ? solarKw
    : (activeSolarProfile?.peakKw || activeOption.solar);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BatteryCharging className="w-7 h-7 text-cyan-400" />
            <span>Central Battery Storage System (BESS)</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            1.2 MWh lithium-iron-phosphate microgrid buffer, intelligent charge/discharge orchestration, and emergency autonomy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold border bg-cyan-950/40 text-cyan-300 border-cyan-500/30">
            HARDWARE: 1,200 kWh (STATIC)
          </span>
          <span className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border transition-all ${
            bessState.cellPackStatus === 'CRITICAL'
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
              : bessState.cellPackStatus === 'WARNING'
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
          }`}>
            ● CELL PACK: {bessState.cellPackStatus || 'NORMAL'}
          </span>
        </div>
      </div>

      {/* Campus Facility Context Correlation Selector */}
      <div className="p-4 rounded-2xl bg-[#091510]/80 border border-emerald-500/20 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Campus Facility Context & Correlation
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Select a facility to correlate building load & rooftop solar with central BESS dispatch
          </span>
        </div>

        {/* Facility Buttons Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" data-testid="facility-selector-bar">
          {facilityOptions.map(f => {
            const isSelected = f.code === selectedFacility;
            return (
              <button
                key={f.code}
                id={`bess-facility-${f.code.toLowerCase()}`}
                type="button"
                onClick={() => setSelectedFacility(f.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] ring-2 ring-emerald-300'
                    : 'bg-black/40 text-slate-300 border border-emerald-500/20 hover:border-emerald-500/40 hover:text-white'
                }`}
              >
                {f.code}
              </button>
            );
          })}
        </div>

        {/* Selected Facility Correlation Info */}
        <div className="mt-3 pt-3 border-t border-emerald-500/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Active Facility:</span>
            <strong className="text-white font-mono">{activeOption.name} ({activeOption.code})</strong>
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span className="text-slate-300">
              Demand: <strong className="text-emerald-400">{currentDemand} kW</strong>
            </span>
            <span className="text-slate-300">
              Solar Contribution: <strong className="text-amber-400">{currentSolar} kW</strong>
            </span>
            <span className="hidden md:inline text-[11px] text-cyan-400">
              BESS Architecture Specs: <strong>Fixed System Constants</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Large Animated Battery Visualizer with Liquid Fluid, Live Telemetry & Decision Logic */}
      <BatteryVisualizer expanded={true} facilityCode={selectedFacility} />

      {/* Live Telemetry KPI Row Connected to Central BESS State */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Activity className="w-4 h-4" />
            <span>BESS Live Telemetry (Dynamic Operating State)</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Derived from Central BESS State • Capacity: 1,200 kWh
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4" data-testid="bess-live-telemetry-grid">
          <MetricBadge
            label="State of Charge"
            value={bessState.soc.toFixed(1)}
            unit="%"
            subtext={`Target: 95% (${bessState.status})`}
            icon={BatteryCharging}
            variant="cyan"
          />
          <MetricBadge
            label="Stored Energy"
            value={bessState.storedEnergy.toFixed(1)}
            unit="kWh"
            subtext={`of ${bessState.capacityKwh} kWh total`}
            icon={Zap}
            variant="emerald"
          />
          <MetricBadge
            label="Active Flow"
            value={bessState.activeFlow > 0 ? `+${bessState.activeFlow}` : bessState.activeFlow}
            unit="kW"
            subtext={bessState.status}
            icon={Zap}
            variant={bessState.activeFlow > 0 ? 'emerald' : bessState.activeFlow < 0 ? 'amber' : 'cyan'}
          />
          <MetricBadge
            label="Emergency Backup"
            value={bessState.backupTime.toFixed(1)}
            unit="hrs"
            subtext="under base load"
            icon={Clock}
            variant="cyan"
          />
          <MetricBadge
            label="Pack Health (SOH)"
            value={bessState.packHealth}
            unit="%"
            subtext="Cell Health: 98.4%"
            icon={ShieldCheck}
            variant="emerald"
          />
          <MetricBadge
            label="Pack Temperature"
            value={bessState.packTemperature.toFixed(1)}
            unit="°C"
            subtext="Liquid cooled (Glycol)"
            icon={Thermometer}
            variant="amber"
          />
        </div>
      </div>

      {/* Multi-Dimensional Technical Bento Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Intelligent Decision Engine */}
        <BentoCard
          title="Autonomous Dispatch Logic"
          subtitle="Real-time multi-variable BESS decision pipeline"
          icon={<Sparkles className="w-4 h-4 text-emerald-400" />}
          className="lg:col-span-2"
        >
          <div className="space-y-4 text-xs">
            <div className={`p-4 rounded-xl border transition-all ${
              bessState.status === 'CHARGING'
                ? 'bg-emerald-500/15 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-black/40 border-emerald-500/15'
            } flex items-start gap-3`}>
              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${bessState.status === 'CHARGING' ? 'text-emerald-300' : 'text-emerald-400'}`} />
              <div>
                <span className="font-bold text-white block">Rule 1: Solar Surplus Ingestion</span>
                <p className="text-slate-400 mt-0.5">
                  IF (Solar Generation &gt; Demand OR Generation &gt; 250 kW) AND SoC &lt; 95% ➔ Engage Charging at max 90 kW rating to capture clean surplus.
                </p>
                <span className={`text-[10px] font-mono font-bold mt-1 inline-block ${
                  bessState.status === 'CHARGING' ? 'text-emerald-300 animate-pulse' : 'text-slate-500'
                }`}>
                  STATUS: {bessState.status === 'CHARGING' ? `CONDITION ACTIVE (CHARGING +${bessState.activeFlow} kW)` : 'STANDBY'}
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition-all ${
              bessState.status === 'DISCHARGING'
                ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-black/40 border-emerald-500/15'
            } flex items-start gap-3`}>
              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${bessState.status === 'DISCHARGING' ? 'text-amber-300' : 'text-amber-400'}`} />
              <div>
                <span className="font-bold text-white block">Rule 2: Peak Demand Shaving (5 PM - 8 PM)</span>
                <p className="text-slate-400 mt-0.5">
                  IF (Predicted Demand &gt; 480 kW AND Grid Tariff Peak Active) ➔ Discharge BESS at 85 kW to clip utility demand surcharge.
                </p>
                <span className={`text-[10px] font-mono font-bold mt-1 inline-block ${
                  bessState.status === 'DISCHARGING' ? 'text-amber-300 animate-pulse' : 'text-slate-500'
                }`}>
                  STATUS: {bessState.status === 'DISCHARGING' ? `CONDITION ACTIVE (DISCHARGING ${bessState.activeFlow} kW)` : 'ARMED FOR 5:30 PM DISPATCH'}
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition-all ${
              bessState.soc <= 20
                ? 'bg-rose-500/15 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                : 'bg-black/40 border-emerald-500/15'
            } flex items-start gap-3`}>
              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${bessState.soc <= 20 ? 'text-rose-400' : 'text-cyan-400'}`} />
              <div>
                <span className="font-bold text-white block">Rule 3: Critical Reserve Protection</span>
                <p className="text-slate-400 mt-0.5">
                  IF (SoC ≤ 20%) ➔ Force BESS Idle to maintain emergency reserve for Computer Science servers & biomedical cold storage.
                </p>
                <span className={`text-[10px] font-mono font-bold mt-1 inline-block ${
                  bessState.soc <= 20 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'
                }`}>
                  STATUS: {bessState.soc <= 20 ? 'ALERT: CRITICAL RESERVE LOCK ACTIVE' : `SAFE (${bessState.soc.toFixed(1)}% SOC)`}
                </span>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Card 2: Technical Specifications - STATIC HARDWARE SPECIFICATIONS */}
        <BentoCard
          title="BESS Architecture"
          subtitle="Static hardware specifications"
          icon={<Layers className="w-4 h-4 text-cyan-400" />}
        >
          <div className="space-y-3 text-xs" data-testid="bess-architecture-card">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-emerald-500/10">
              <span className="text-slate-400">Chemistry</span>
              <span className="font-mono font-semibold text-white">LiFePO4 (LFP)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-emerald-500/10">
              <span className="text-slate-400">Nameplate Capacity</span>
              <span className="font-mono font-semibold text-white">1,200 kWh</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-emerald-500/10">
              <span className="text-slate-400">Max Inverter C-Rate</span>
              <span className="font-mono font-semibold text-white">0.5C (250 kW)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-emerald-500/10">
              <span className="text-slate-400">Round-Trip Efficiency</span>
              <span className="font-mono font-semibold text-emerald-400">92.4%</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-emerald-500/10">
              <span className="text-slate-400">Lifetime Cycles</span>
              <span className="font-mono font-semibold text-white">342 / 6,000</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-emerald-500/10">
              <span className="text-slate-400">Cooling Medium</span>
              <span className="font-mono font-semibold text-cyan-400">Closed Glycol Loop</span>
            </div>
          </div>
          <div className="mt-3 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>System-level hardware constants. Fixed across all campus facilities.</span>
          </div>
        </BentoCard>

      </div>

    </div>
  );
};
