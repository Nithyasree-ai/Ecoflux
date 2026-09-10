import React, { useState } from 'react';
import { useEcoFlux } from '../lib/dataStore';
import { BentoCard } from '../components/common/BentoCard';
import { MetricBadge } from '../components/common/MetricBadge';
import { SolarGenerationChart } from '../components/charts/SolarGenerationChart';
import { FACILITY_SOLAR_PROFILES, telemetryData } from '../data/campusData';
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
  const { buildings, solarKw, totalDemandKw, renewablePct, selectedFacility: globalFacility, setSelectedFacility } = useEcoFlux();

  // Selected facility state - defaults to ACAD if ALL is selected at campus level
  const selectedFacility = globalFacility === 'ALL' ? 'ACAD' : globalFacility;

  // Active facility profile, telemetry, and structured facility list
  const activeFacility = FACILITY_SOLAR_PROFILES[selectedFacility] || FACILITY_SOLAR_PROFILES['ACAD'];
  const activeTelemetry = telemetryData[selectedFacility] || telemetryData['ACAD'];
  const facilityList = Object.values(FACILITY_SOLAR_PROFILES);
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

      {/* Main Solar Chart Connected to Selected Facility */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BentoCard
          title={`${activeFacility.facilityCode} Solar Generation Timeline & Forecast`}
          subtitle={`${activeFacility.facilityName} rooftop solar generation`}
          icon={<Sun className="w-4 h-4 text-amber-400" />}
          className="lg:col-span-2"
          action={
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                {activeFacility.capacityKw} kW Allocated ({activeFacility.pctOfTotal}%)
              </span>
            </div>
          }
        >
          <SolarGenerationChart facilityCode={selectedFacility} />
        </BentoCard>

        {/* Weather & PV Diagnostics Card Connected to Selected Facility */}
        <BentoCard
          title="Atmospheric & Inverter Telemetry"
          subtitle={`${activeFacility.facilityCode} – ${activeFacility.facilityName} • Real-time rooftop sensor telemetry`}
          icon={<CloudSun className="w-4 h-4 text-cyan-400" />}
          action={
            <span className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Live Sensor Feed
            </span>
          }
        >
          <div className="space-y-3.5 text-xs" data-testid={`telemetry-panel-${selectedFacility.toLowerCase()}`}>
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-emerald-500/10 transition-all hover:border-cyan-500/30">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">Ambient Temperature</span>
              </div>
              <span className="font-mono font-bold text-white text-sm">
                {activeTelemetry.ambientTemperature}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-emerald-500/10 transition-all hover:border-amber-500/30">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300">PV Surface Temperature</span>
              </div>
              <span className="font-mono font-bold text-amber-300 text-sm">
                {activeTelemetry.pvSurfaceTemperature}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-emerald-500/10 transition-all hover:border-emerald-500/30">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">Solar Array Azimuth</span>
              </div>
              <span className="font-mono font-bold text-white text-sm">
                {activeTelemetry.solarArrayAzimuth}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-emerald-500/10 transition-all hover:border-cyan-500/30">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300">Tilt Angle</span>
              </div>
              <span className="font-mono font-bold text-white text-sm">
                {activeTelemetry.tiltAngle}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-emerald-500/10 transition-all hover:border-emerald-400/40">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">BESS Absorption Rate</span>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {activeTelemetry.bessAbsorptionRate}
              </span>
            </div>
          </div>
        </BentoCard>
      </div>

      {/* Building Rooftop Array Breakdown - Interactive Selection */}
      <div className="p-6 rounded-2xl bg-[#091510] border border-emerald-500/15 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white">Rooftop Solar Allocation by Facility</h3>
            <p className="text-xs text-slate-400 mt-0.5">Click any facility below to inspect its dedicated solar generation curve and hourly telemetry.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Active Facility:</span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {activeFacility.facilityCode} – {activeFacility.facilityName}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {facilityList.map((f) => {
            const isSelected = f.facilityCode === selectedFacility;
            return (
              <button
                key={f.facilityCode}
                id={`solar-facility-btn-${f.facilityCode.toLowerCase()}`}
                type="button"
                onClick={() => setSelectedFacility(f.facilityCode)}
                className={`p-3.5 rounded-xl text-left transition-all duration-200 cursor-pointer border flex items-center justify-between group ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                    : 'bg-black/40 border-emerald-500/10 hover:border-amber-400/50 hover:bg-black/60'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`font-mono text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-emerald-400'}`}>
                      {f.facilityCode}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </div>
                  <span className={`block font-semibold text-xs mt-0.5 transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-amber-200'}`}>
                    {f.facilityName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold font-mono text-amber-300 text-sm block">
                    {f.capacityKw} kW
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {f.pctOfTotal}% of total
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
