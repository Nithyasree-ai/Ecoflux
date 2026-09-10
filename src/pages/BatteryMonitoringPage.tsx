import React from 'react';
import { useEcoFlux } from '../lib/dataStore';
import { BatteryVisualizer } from '../components/3d/BatteryVisualizer';
import { BentoCard } from '../components/common/BentoCard';
import { MetricBadge } from '../components/common/MetricBadge';
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
  AlertCircle
} from 'lucide-react';

export const BatteryMonitoringPage: React.FC = () => {
  const { battery, solarKw, totalDemandKw } = useEcoFlux();

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

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border transition-all ${
            battery.cellPackStatus === 'CRITICAL'
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
              : battery.cellPackStatus === 'WARNING'
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
              : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
          }`}>
            ● CELL PACK STATUS: {battery.cellPackStatus || 'NORMAL'}
          </span>
        </div>
      </div>

      {/* Large Animated Battery Visualizer with Liquid Fluid & Decision Logic */}
      <BatteryVisualizer expanded={true} />

      {/* KPI Row Connected to Central BESS State */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <MetricBadge
          label="State of Charge"
          value={battery.stateOfChargePct.toFixed(1)}
          unit="%"
          subtext={`Target: 95% (${battery.status})`}
          icon={BatteryCharging}
          variant="cyan"
        />
        <MetricBadge
          label="Stored Energy"
          value={battery.currentStoredKwh.toFixed(1)}
          unit="kWh"
          subtext={`of ${battery.capacityKwh} kWh total`}
          icon={Zap}
          variant="emerald"
        />
        <MetricBadge
          label="Active Flow"
          value={battery.flowRateKw > 0 ? `+${battery.flowRateKw}` : battery.flowRateKw}
          unit="kW"
          subtext={battery.status}
          icon={Zap}
          variant={battery.operatingMode === 'charging' ? 'emerald' : battery.operatingMode === 'discharging' ? 'amber' : 'cyan'}
        />
        <MetricBadge
          label="Emergency Backup"
          value={battery.estimatedBackupHours.toFixed(1)}
          unit="hrs"
          subtext="under base load"
          icon={Clock}
          variant="cyan"
        />
        <MetricBadge
          label="Pack Health (SOH)"
          value={battery.cellHealthPct}
          unit="%"
          subtext="Degradation: 0.12%/yr"
          icon={ShieldCheck}
          variant="emerald"
        />
        <MetricBadge
          label="Pack Temperature"
          value={battery.cellTempC.toFixed(1)}
          unit="°C"
          subtext="Liquid cooled"
          icon={Thermometer}
          variant="amber"
        />
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
              battery.operatingMode === 'charging'
                ? 'bg-emerald-500/15 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-black/40 border-emerald-500/15'
            } flex items-start gap-3`}>
              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${battery.operatingMode === 'charging' ? 'text-emerald-300' : 'text-emerald-400'}`} />
              <div>
                <span className="font-bold text-white block">Rule 1: Solar Surplus Ingestion</span>
                <p className="text-slate-400 mt-0.5">
                  IF (Solar Generation &gt; Demand OR Generation &gt; 250 kW) AND SoC &lt; 95% ➔ Engage Charging at max 90 kW rating to capture clean surplus.
                </p>
                <span className={`text-[10px] font-mono font-bold mt-1 inline-block ${
                  battery.operatingMode === 'charging' ? 'text-emerald-300 animate-pulse' : 'text-slate-500'
                }`}>
                  STATUS: {battery.operatingMode === 'charging' ? 'CONDITION ACTIVE (CHARGING +85 kW)' : 'STANDBY'}
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition-all ${
              battery.operatingMode === 'discharging'
                ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-black/40 border-emerald-500/15'
            } flex items-start gap-3`}>
              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${battery.operatingMode === 'discharging' ? 'text-amber-300' : 'text-amber-400'}`} />
              <div>
                <span className="font-bold text-white block">Rule 2: Peak Demand Shaving (5 PM - 8 PM)</span>
                <p className="text-slate-400 mt-0.5">
                  IF (Predicted Demand &gt; 480 kW AND Grid Tariff Peak Active) ➔ Discharge BESS at 85 kW to clip utility demand surcharge.
                </p>
                <span className={`text-[10px] font-mono font-bold mt-1 inline-block ${
                  battery.operatingMode === 'discharging' ? 'text-amber-300 animate-pulse' : 'text-slate-500'
                }`}>
                  STATUS: {battery.operatingMode === 'discharging' ? 'CONDITION ACTIVE (DISCHARGING -88 kW)' : 'ARMED FOR 5:30 PM DISPATCH'}
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition-all ${
              battery.stateOfChargePct <= 20
                ? 'bg-rose-500/15 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                : 'bg-black/40 border-emerald-500/15'
            } flex items-start gap-3`}>
              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${battery.stateOfChargePct <= 20 ? 'text-rose-400' : 'text-cyan-400'}`} />
              <div>
                <span className="font-bold text-white block">Rule 3: Critical Reserve Protection</span>
                <p className="text-slate-400 mt-0.5">
                  IF (SoC ≤ 20%) ➔ Force BESS Idle to maintain emergency reserve for Computer Science servers & biomedical cold storage.
                </p>
                <span className={`text-[10px] font-mono font-bold mt-1 inline-block ${
                  battery.stateOfChargePct <= 20 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'
                }`}>
                  STATUS: {battery.stateOfChargePct <= 20 ? 'ALERT: CRITICAL RESERVE LOCK ACTIVE' : `SAFE (${battery.stateOfChargePct.toFixed(1)}% SOC)`}
                </span>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Card 2: Technical Specifications */}
        <BentoCard
          title="BESS Architecture"
          subtitle="Hardware specs & cycle telemetry"
          icon={<Layers className="w-4 h-4 text-cyan-400" />}
        >
          <div className="space-y-3 text-xs">
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
              <span className="font-mono font-semibold text-white">{battery.cyclesCompleted} / 6,000</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-emerald-500/10">
              <span className="text-slate-400">Cooling Medium</span>
              <span className="font-mono font-semibold text-cyan-400">Closed Glycol Loop</span>
            </div>
          </div>
        </BentoCard>

      </div>

    </div>
  );
};
