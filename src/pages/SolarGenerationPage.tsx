import React from 'react';
import { useEcoFlux } from '../lib/dataStore';
import { BentoCard } from '../components/common/BentoCard';
import { MetricBadge } from '../components/common/MetricBadge';
import { SolarGenerationChart } from '../components/charts/SolarGenerationChart';
import {
  Sun,
  CloudSun,
  Zap,
  TrendingUp,
  Thermometer,
  Compass,
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export const SolarGenerationPage: React.FC = () => {
  const { buildings, solarKw, totalDemandKw, renewablePct } = useEcoFlux();

  const totalSolarInstalled = buildings.reduce((acc, b) => acc + b.solarInstalledKw, 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Sun className="w-7 h-7 text-amber-400" />
            <span>Solar Generation & Photovoltaics</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Rooftop photovoltaic arrays, instantaneous inverter telemetry, irradiance correlation, and grid displacement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#091510] border border-amber-500/20 text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Campus Solar Capacity</span>
            <span className="text-xl font-bold font-mono text-amber-300">{totalSolarInstalled} kWp</span>
          </div>
        </div>
      </div>

      {/* Hero Animated Solar Panel Callout */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#121c15] to-[#07130e] border border-amber-500/30 backdrop-blur-xl relative overflow-hidden shadow-[0_10px_35px_rgba(245,158,11,0.15)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)] shrink-0">
              <Sun className="w-8 h-8 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                  CURRENT ROOFTOP SOLAR
                </span>
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +14% above yesterday
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                  {solarKw}
                </span>
                <span className="text-xl font-bold text-amber-400">kW</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
                Solar production is currently supplying <strong>{renewablePct}%</strong> of total campus demand. Peak generation window active through 2:00 PM.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
            <div className="p-3 rounded-xl bg-black/50 border border-amber-500/20 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Irradiance</span>
              <span className="text-sm font-bold font-mono text-amber-300">920 W/m²</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-amber-500/20 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Inverter Eff.</span>
              <span className="text-sm font-bold font-mono text-emerald-400">95.6%</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-amber-500/20 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 block uppercase">Cloud Cover</span>
              <span className="text-sm font-bold font-mono text-cyan-400">6% Clear</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <MetricBadge label="Daily Generated" value="2,480" unit="kWh" change={12.4} changeLabel="vs avg" icon={Zap} variant="amber" />
        <MetricBadge label="Weekly Generated" value="16,840" unit="kWh" change={8.1} changeLabel="vs last wk" icon={Sun} variant="amber" />
        <MetricBadge label="Monthly Generated" value="69,200" unit="kWh" change={15.0} changeLabel="projected" icon={Sun} variant="emerald" />
        <MetricBadge label="Solar Contribution" value={renewablePct} unit="%" subtext="of campus load" icon={Sun} variant="lime" />
        <MetricBadge label="CO₂ Avoided" value="1.84" unit="Tons" subtext="Today's offset" icon={Sun} variant="emerald" />
        <MetricBadge label="Direct Savings" value="$446.40" unit="/day" subtext="at $0.18/kWh" icon={Sun} variant="emerald" />
      </div>

      {/* Main Solar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BentoCard
          title="Solar Generation Timeline & Forecast"
          subtitle="Hourly PV production curve vs 7-day moving average"
          icon={<Sun className="w-4 h-4 text-amber-400" />}
          className="lg:col-span-2"
        >
          <SolarGenerationChart />
        </BentoCard>

        {/* Weather & PV Diagnostics Card */}
        <BentoCard
          title="Atmospheric & Inverter Telemetry"
          subtitle="Real-time rooftop sensor telemetry"
          icon={<CloudSun className="w-4 h-4 text-cyan-400" />}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-emerald-500/10">
              <span className="text-slate-300">Ambient Temperature</span>
              <span className="font-mono font-bold text-white">29.4°C</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-emerald-500/10">
              <span className="text-slate-300">PV Surface Temperature</span>
              <span className="font-mono font-bold text-amber-300">42.1°C</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-emerald-500/10">
              <span className="text-slate-300">Solar Array Azimuth</span>
              <span className="font-mono font-bold text-white">180° Due South</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-emerald-500/10">
              <span className="text-slate-300">Tilt Angle</span>
              <span className="font-mono font-bold text-white">22.5° Fixed</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-emerald-500/10">
              <span className="text-slate-300">BESS Absorption Rate</span>
              <span className="font-mono font-bold text-emerald-400">84.5 kW directed</span>
            </div>
          </div>
        </BentoCard>
      </div>

      {/* Building Rooftop Array Breakdown */}
      <div className="p-6 rounded-2xl bg-[#091510] border border-emerald-500/15 space-y-4">
        <h3 className="text-base font-bold text-white">Rooftop Solar Allocation by Facility</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {buildings.map((b) => (
            <div key={b.id} className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/10 flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-emerald-400 font-bold">{b.code}</span>
                <span className="block font-semibold text-white text-xs mt-0.5">{b.name}</span>
              </div>
              <div className="text-right">
                <span className="font-bold font-mono text-amber-300 text-sm">{b.solarInstalledKw} kW</span>
                <span className="block text-[10px] text-slate-500">{Math.round((b.solarInstalledKw / totalSolarInstalled) * 100)}% of total</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
