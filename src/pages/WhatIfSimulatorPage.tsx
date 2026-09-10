import React, { useState } from 'react';
import { useEcoFlux } from '../lib/dataStore';
import { BentoCard } from '../components/common/BentoCard';
import { SimulationParams, SimulationResult } from '../types';
import {
  Sliders,
  Sun,
  BatteryCharging,
  Users,
  Thermometer,
  Lightbulb,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingDown,
  DollarSign,
  Leaf,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export const WhatIfSimulatorPage: React.FC = () => {
  const { runSimulationScenario } = useEcoFlux();

  // Scenario Input Parameters
  const [params, setParams] = useState<SimulationParams>({
    solarCapacityAddKw: 50,
    batteryCapacityAddKwh: 200,
    occupancyShiftPct: 15,
    hvacTempOffsetC: 1.5,
    lightingEfficiencyPct: 35,
    operatingHoursReductionHours: 1
  });

  const [result, setResult] = useState<SimulationResult>(() => runSimulationScenario(params));
  const [isSimulating, setIsSimulating] = useState(false);

  const handleParamChange = (field: keyof SimulationParams, value: number) => {
    const updated = { ...params, [field]: value };
    setParams(updated);
    // Instant reactive recalculation
    setResult(runSimulationScenario(updated));
  };

  const handleReset = () => {
    const defaultParams: SimulationParams = {
      solarCapacityAddKw: 0,
      batteryCapacityAddKwh: 0,
      occupancyShiftPct: 0,
      hvacTempOffsetC: 0,
      lightingEfficiencyPct: 0,
      operatingHoursReductionHours: 0
    };
    setParams(defaultParams);
    setResult(runSimulationScenario(defaultParams));
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setResult(runSimulationScenario(params));
      setIsSimulating(false);
    }, 400);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Sliders className="w-7 h-7 text-cyan-400" />
            <span>Campus What-If Scenario Simulator</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            "What happens if...?" Simulate capital investments, battery sizing, and operational adjustments in real time.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Baseline</span>
        </button>
      </div>

      {/* Main Grid: Parameters on Left, Real-Time Projected Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Variables & Sliders (7 columns) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-3xl bg-[#091510] border border-emerald-500/20 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Microgrid & Facility Variables</span>
              </h3>
              <span className="text-xs text-slate-400">Move sliders to evaluate</span>
            </div>

            {/* Slider 1: Additional Solar Capacity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Additional Solar Capacity</span>
                </span>
                <span className="font-mono font-bold text-amber-300 text-sm">+{params.solarCapacityAddKw} kW</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={params.solarCapacityAddKw}
                onChange={(e) => handleParamChange('solarCapacityAddKw', Number(e.target.value))}
                className="w-full accent-amber-400 bg-black/40 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 kW (Baseline 318 kW)</span>
                <span>+100 kW</span>
                <span>+200 kW</span>
              </div>
            </div>

            {/* Slider 2: Additional Battery Capacity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <BatteryCharging className="w-4 h-4 text-cyan-400" />
                  <span>Additional Battery Storage (BESS)</span>
                </span>
                <span className="font-mono font-bold text-cyan-300 text-sm">+{params.batteryCapacityAddKwh} kWh</span>
              </div>
              <input
                type="range"
                min="0"
                max="600"
                step="25"
                value={params.batteryCapacityAddKwh}
                onChange={(e) => handleParamChange('batteryCapacityAddKwh', Number(e.target.value))}
                className="w-full accent-cyan-400 bg-black/40 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 kWh (Baseline 1,200 kWh)</span>
                <span>+300 kWh</span>
                <span>+600 kWh</span>
              </div>
            </div>

            {/* Slider 3: Occupancy Schedule Optimization */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Class Schedule & Occupancy Consolidation</span>
                </span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{params.occupancyShiftPct}% efficiency</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={params.occupancyShiftPct}
                onChange={(e) => handleParamChange('occupancyShiftPct', Number(e.target.value))}
                className="w-full accent-emerald-400 bg-black/40 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0% (Standard)</span>
                <span>15% Cluster Shift</span>
                <span>30% Aggressive</span>
              </div>
            </div>

            {/* Slider 4: HVAC Setpoint Adjustment */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-purple-400" />
                  <span>HVAC Eco Setpoint Adjustment</span>
                </span>
                <span className="font-mono font-bold text-purple-300 text-sm">+{params.hvacTempOffsetC}°C</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="0.5"
                value={params.hvacTempOffsetC}
                onChange={(e) => handleParamChange('hvacTempOffsetC', Number(e.target.value))}
                className="w-full accent-purple-400 bg-black/40 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0°C (Default 21°C)</span>
                <span>+1.5°C Eco</span>
                <span>+3°C Max Savings</span>
              </div>
            </div>

            {/* Slider 5: Daylight Harvesting & LED Dimming */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <span>Daylight Harvesting & Lighting Dimming</span>
                </span>
                <span className="font-mono font-bold text-yellow-300 text-sm">{params.lightingEfficiencyPct}% Dimmed</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={params.lightingEfficiencyPct}
                onChange={(e) => handleParamChange('lightingEfficiencyPct', Number(e.target.value))}
                className="w-full accent-yellow-400 bg-black/40 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0% Fixed</span>
                <span>30% Sensor Dimming</span>
                <span>60% Full Harvesting</span>
              </div>
            </div>

            {/* Slider 6: Operating Hours Reduction */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>Admin & Non-Critical Operating Hours</span>
                </span>
                <span className="font-mono font-bold text-sky-300 text-sm">-{params.operatingHoursReductionHours} hrs/day</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={params.operatingHoursReductionHours}
                onChange={(e) => handleParamChange('operatingHoursReductionHours', Number(e.target.value))}
                className="w-full accent-sky-400 bg-black/40 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 hrs</span>
                <span>-1 hr</span>
                <span>-3 hrs</span>
              </div>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSimulating ? 'Running Thermodynamic Model...' : 'Run Simulation Analysis'}</span>
            </button>
          </div>
        </div>

        {/* Right: Real-time Projected Outputs (5 columns) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* AI Generated Recommendation Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0a1c14] to-[#07130e] border border-emerald-500/30 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400 font-bold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>SIMULATED SCENARIO EVALUATION</span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              "{result.aiRecommendation}"
            </p>
          </div>

          {/* Before vs After Comparison Card */}
          <div className="p-6 rounded-3xl bg-[#091510] border border-emerald-500/20 backdrop-blur-xl space-y-5">
            <h3 className="text-base font-bold text-white">Before vs. After Comparison</h3>

            {/* Daily Energy Cost */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Daily Utility Grid Cost</span>
                <span className="font-mono text-emerald-400 font-bold">
                  ${result.currentDailyCostUsd} ➔ ${result.projectedDailyCostUsd}
                </span>
              </div>
              <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden p-0.5 border border-white/5 flex gap-1">
                <div
                  className="bg-slate-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (result.projectedDailyCostUsd / result.currentDailyCostUsd) * 100)}%` }}
                />
              </div>
            </div>

            {/* Clean Energy Fraction */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Renewable Solar Fraction</span>
                <span className="font-mono text-amber-300 font-bold">
                  {result.currentSolarPct}% ➔ {result.projectedSolarPct}%
                </span>
              </div>
              <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden p-0.5 border border-white/5 flex gap-1">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${result.projectedSolarPct}%` }}
                />
              </div>
            </div>

            {/* Financial & Environmental ROI Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-500/10">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/15">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Annual Net Savings</span>
                <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
                  ${result.annualSavingsUsd.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">${result.dailySavingsUsd}/day reduction</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/15">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">CO₂ Cut Per Year</span>
                <span className="text-xl font-bold font-mono text-cyan-400 mt-1 block">
                  {result.co2ReductionTonsYear} <span className="text-xs">Tons</span>
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Decarbonization credit</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/15 flex items-center justify-between text-xs">
              <span className="text-slate-400">Peak Grid Demand Cap:</span>
              <span className="font-mono font-bold text-white text-sm">{result.peakGridDemandKw} kW</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
