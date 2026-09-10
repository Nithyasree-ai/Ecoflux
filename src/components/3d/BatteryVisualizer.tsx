import React from 'react';
import { useEcoFlux } from '../../lib/dataStore';
import { Battery, Zap, Shield, Clock, Thermometer, RefreshCw, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';

export const BatteryVisualizer: React.FC<{ expanded?: boolean }> = ({ expanded = false }) => {
  const { battery, solarKw, totalDemandKw, setBatteryModeOverride } = useEcoFlux();

  const isCharging = battery.operatingMode === 'charging';
  const isDischarging = battery.operatingMode === 'discharging';
  const chargePct = Math.min(100, Math.max(0, battery.stateOfChargePct));

  return (
    <div className="bg-[#091510]/90 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
        
        {/* Visual Battery Graphic */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex flex-col items-center">
            
            {/* Battery Terminal Tip */}
            <div className="w-14 h-3 bg-emerald-400/80 rounded-t-md border-t border-x border-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.5)]" />

            {/* Battery Outer Casing */}
            <div className="w-36 h-64 sm:w-44 sm:h-72 rounded-2xl border-2 border-emerald-500/40 bg-[#050e0a] p-2 relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              
              {/* Internal Glass Fill Tube */}
              <div className="w-full h-full rounded-xl relative overflow-hidden bg-black/40 flex flex-col justify-end">
                
                {/* Liquid Charge Fill with CSS Animation */}
                <div
                  className="w-full transition-all duration-1000 ease-out relative"
                  style={{
                    height: `${chargePct}%`,
                    background: isCharging
                      ? 'linear-gradient(180deg, #34d399 0%, #10b981 40%, #047857 100%)'
                      : isDischarging
                      ? 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 40%, #b45309 100%)'
                      : 'linear-gradient(180deg, #06b6d4 0%, #0891b2 100%)',
                    boxShadow: '0 0 25px rgba(52,211,153,0.6)'
                  }}
                >
                  {/* Wave surface shimmer */}
                  <div className="absolute -top-3 inset-x-0 h-6 bg-white/25 rounded-full blur-[1px] animate-pulse" />

                  {/* Flowing Energy Particles */}
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
                </div>

                {/* State of Charge Overlay text in battery center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    {isCharging ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-400 animate-bounce" />
                    ) : isDischarging ? (
                      <ArrowDownRight className="w-4 h-4 text-amber-400 animate-bounce" />
                    ) : (
                      <Zap className="w-4 h-4 text-cyan-400" />
                    )}
                    <span className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                      {battery.stateOfChargePct.toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest mt-1">
                    {battery.currentStoredKwh} / {battery.capacityKwh} kWh
                  </span>
                </div>

              </div>

              {/* Measurement lines */}
              <div className="absolute left-3 top-6 bottom-6 flex flex-col justify-between pointer-events-none opacity-30 text-[9px] font-mono text-white">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
              </div>
            </div>

            {/* Mode Tag */}
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  isCharging
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : isDischarging
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                }`}
              >
                ● {battery.operatingMode.toUpperCase()} ({battery.flowRateKw > 0 ? `+${battery.flowRateKw}` : battery.flowRateKw} kW)
              </span>
            </div>

          </div>
        </div>

        {/* Intelligence Decision & Metrics Card */}
        <div className="flex-1 max-w-xl space-y-4">
          
          {/* AI Decision Panel */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI BATTERY DISPATCH DECISION</span>
            </div>
            <h4 className="text-lg font-bold text-white mt-1 capitalize">
              {battery.operatingMode === 'charging' ? '⚡ Active Solar Surplus Absorption' : '🔋 Peak Demand Load Shaving'}
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {battery.aiDecisionReason}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/15">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Backup Time</span>
              </div>
              <span className="text-base font-bold font-mono text-white mt-1 block">
                {battery.estimatedBackupHours} hrs
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/15">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cell Health</span>
              </div>
              <span className="text-base font-bold font-mono text-white mt-1 block">
                {battery.cellHealthPct}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/15">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                <span>Temp</span>
              </div>
              <span className="text-base font-bold font-mono text-white mt-1 block">
                {battery.cellTempC}°C
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/15">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                <span>Cycles</span>
              </div>
              <span className="text-base font-bold font-mono text-white mt-1 block">
                {battery.cyclesCompleted}
              </span>
            </div>
          </div>

          {/* Operator Mode Override Controls */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-400 block mb-2">Operator Dispatch Mode</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setBatteryModeOverride('charging')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isCharging
                    ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20'
                }`}
              >
                Charge (Solar Surplus)
              </button>

              <button
                onClick={() => setBatteryModeOverride('discharging')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isDischarging
                    ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20'
                }`}
              >
                Discharge (Peak Shave)
              </button>

              <button
                onClick={() => setBatteryModeOverride('idle')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  battery.operatingMode === 'idle'
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20'
                }`}
              >
                Standby / Auto
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
