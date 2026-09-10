import React from 'react';
import { Link } from 'react-router-dom';
import { useEcoFlux } from '../lib/dataStore';
import { MetricBadge } from '../components/common/MetricBadge';
import { BentoCard } from '../components/common/BentoCard';
import { EnergyConsumptionChart } from '../components/charts/EnergyConsumptionChart';
import { SolarGenerationChart } from '../components/charts/SolarGenerationChart';
import { ForecastChart } from '../components/charts/ForecastChart';
import { BuildingComparisonChart } from '../components/charts/BuildingComparisonChart';
import { OccupancyEnergyChart } from '../components/charts/OccupancyEnergyChart';
import { RenewableMixDonut } from '../components/charts/RenewableMixDonut';
import {
  Zap,
  Sun,
  BatteryCharging,
  Users,
  Leaf,
  DollarSign,
  TrendingUp,
  Sparkles,
  Sliders,
  Bot,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Activity
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    user,
    totalDemandKw,
    solarKw,
    renewablePct,
    battery,
    buildings,
    recommendations,
    applyRecommendation
  } = useEcoFlux();

  const totalOccupancy = buildings.reduce((acc, b) => acc + b.currentOccupancy, 0);
  const activeRec = recommendations.find((r) => r.status === 'active');

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Good evening, {user?.fullName?.split(' ')[0] || 'Campus Manager'} 👋</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Here's how your campus is performing today. Telemetry synchronized across 8 facilities.
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/copilot"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>Ask Energy Copilot</span>
          </Link>
          <Link
            to="/simulator"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
          >
            <Sliders className="w-4 h-4" />
            <span>Run What-If Scenario</span>
          </Link>
        </div>
      </div>

      {/* Main KPI Bento Row (6 Animated Metric Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <MetricBadge
          label="Total Demand"
          value={totalDemandKw}
          unit="kW"
          change={-4.2}
          changeLabel="vs peak"
          icon={Zap}
          variant="emerald"
        />
        <MetricBadge
          label="Solar Generated"
          value={solarKw}
          unit="kW"
          change={14.0}
          changeLabel="vs yesterday"
          icon={Sun}
          variant="amber"
        />
        <MetricBadge
          label="Battery Level"
          value={battery.stateOfChargePct.toFixed(1)}
          unit="%"
          subtext={`${battery.currentStoredKwh} kWh • Charging`}
          icon={BatteryCharging}
          variant="cyan"
        />
        <MetricBadge
          label="Current Occupancy"
          value={totalOccupancy.toLocaleString()}
          unit="ppl"
          change={8.5}
          changeLabel="vs morning"
          icon={Users}
          variant="lime"
        />
        <MetricBadge
          label="Renewable Mix"
          value={renewablePct}
          unit="%"
          change={5.0}
          changeLabel="clean power"
          icon={Leaf}
          variant="emerald"
        />
        <MetricBadge
          label="Estimated Savings"
          value="$14,820"
          unit="/mo"
          subtext="18.4 Tons CO₂ offset"
          icon={DollarSign}
          variant="emerald"
        />
      </div>

      {/* Active AI Recommendation Immediate Action Strip (if any active) */}
      {activeRec && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-[#0a1b14] to-[#07130e] border border-emerald-500/30 shadow-[0_4px_20px_rgba(16,185,129,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  AI RECOMMENDATION ({activeRec.category})
                </span>
                <span className="text-xs text-amber-400 font-semibold font-mono">
                  Saves ${activeRec.estimatedDollarSaving}/day
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1">{activeRec.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5">{activeRec.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <Link
              to="/recommendations"
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5"
            >
              View All
            </Link>
            <button
              onClick={() => applyRecommendation(activeRec.id)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
            >
              Execute Action
            </button>
          </div>
        </div>
      )}

      {/* Main 6 Bento Visualization Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        
        {/* Chart 1: Campus Energy Consumption (Spans 2 columns on lg) */}
        <BentoCard
          title="Campus Electricity Demand"
          subtitle="Continuous sub-metering vs 500 kW contractual threshold"
          icon={<Zap className="w-4 h-4 text-emerald-400" />}
          className="lg:col-span-2"
          action={
            <Link to="/energy" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
              <span>Deep Dive</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <EnergyConsumptionChart />
        </BentoCard>

        {/* Chart 6: Renewable Energy Contribution Donut */}
        <BentoCard
          title="Renewable Generation Mix"
          subtitle="Clean energy percentage supplying campus load"
          icon={<Leaf className="w-4 h-4 text-emerald-400" />}
          action={
            <Link to="/solar" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
              <span>Solar Arrays</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <RenewableMixDonut />
        </BentoCard>

        {/* Chart 2: Solar Generation */}
        <BentoCard
          title="Solar Generation Curve"
          subtitle="Rooftop array output (318 kW) vs 7-day baseline"
          icon={<Sun className="w-4 h-4 text-amber-400" />}
          action={
            <Link to="/solar" className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1">
              <span>Inspect Array</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <SolarGenerationChart />
        </BentoCard>

        {/* Chart 3: Demand Forecast (AI Prediction) */}
        <BentoCard
          title="AI Energy Demand Forecast"
          subtitle="Predicted peak 512 kW at 2:30 PM with ±6% confidence"
          icon={<TrendingUp className="w-4 h-4 text-sky-400" />}
          action={
            <Link to="/predictions" className="text-xs font-semibold text-sky-400 hover:underline flex items-center gap-1">
              <span>ML Models</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <ForecastChart />
        </BentoCard>

        {/* Chart 5: Occupancy vs Energy Correlation */}
        <BentoCard
          title="Occupancy vs Energy Correlator"
          subtitle="Detection of abnormal power draw during low occupancy"
          icon={<Users className="w-4 h-4 text-rose-400" />}
          action={
            <Link to="/occupancy" className="text-xs font-semibold text-rose-400 hover:underline flex items-center gap-1">
              <span>Heatmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <OccupancyEnergyChart />
        </BentoCard>

        {/* Chart 4: Building Energy Comparison (Spans across bottom 3 columns) */}
        <BentoCard
          title="Building-by-Building Load Distribution"
          subtitle="Instantaneous consumption across all 8 campus facilities"
          icon={<Activity className="w-4 h-4 text-emerald-400" />}
          className="lg:col-span-3"
          action={
            <Link to="/energy" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
              <span>Building Logs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <BuildingComparisonChart />
        </BentoCard>

      </div>
    </div>
  );
};
