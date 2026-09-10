import React, { useState } from 'react';
import { BentoCard } from '../components/common/BentoCard';
import { MetricBadge } from '../components/common/MetricBadge';
import { ForecastChart } from '../components/charts/ForecastChart';
import {
  TrendingUp,
  Sun,
  Clock,
  Zap,
  Sparkles,
  AlertCircle,
  Brain,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AIPredictionPage: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Brain className="w-7 h-7 text-sky-400" />
            <span>AI Energy & Solar Prediction Engine</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Machine learning forecasting (Next 24 Hours, 7 Days, 30 Days) trained on historical weather and class schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold">
            MODEL: EcoFlux-XGB-v2.4 (96.8% R²)
          </span>
        </div>
      </div>

      {/* 4 Core Forecast Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <MetricBadge
          label="Predicted Peak Demand"
          value="512"
          unit="kW"
          subtext="Contractual limit: 500 kW"
          icon={Zap}
          variant="rose"
        />
        <MetricBadge
          label="Predicted Peak Time"
          value="2:30 PM"
          subtext="Window: 2:00 PM – 3:30 PM"
          icon={Clock}
          variant="amber"
        />
        <MetricBadge
          label="Peak Solar Yield"
          value="318"
          unit="kW"
          subtext="Peak window 11:30 AM – 1:30 PM"
          icon={Sun}
          variant="emerald"
        />
        <MetricBadge
          label="Max Net Energy Gap"
          value="194"
          unit="kW"
          subtext="Supplied by BESS + Grid"
          icon={TrendingUp}
          variant="cyan"
        />
      </div>

      {/* Main Forecast Chart Card */}
      <BentoCard
        title="Predictive Demand & Solar Trajectory"
        subtitle="Ensemble forecast comparing historical telemetry against projected load curves"
        icon={<TrendingUp className="w-4 h-4 text-sky-400" />}
      >
        <ForecastChart />
      </BentoCard>

      {/* Model Interpretability & Plain English Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: What the AI Predicts */}
        <div className="p-6 rounded-2xl bg-[#091510] border border-emerald-500/15 space-y-4">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>EXECUTIVE ENERGY FORECAST SUMMARY</span>
          </div>

          <h3 className="text-lg font-bold text-white">
            Demand will peak at 2:30 PM today, but solar will cover 61% of peak load.
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            Our forecasting models combine classroom timetable data with ambient temperature and satellite irradiance feeds. Between 1:30 PM and 3:00 PM, simultaneous lecture dismissals and laboratory equipment testing will drive gross campus demand to <strong>512 kW</strong>.
          </p>

          <p className="text-xs text-slate-300 leading-relaxed">
            However, rooftop solar output is projected to deliver <strong>318 kW</strong>, leaving an effective net demand of only 194 kW. By triggering a minor 30 kW BESS discharge during the peak interval, grid demand will remain well below the 500 kW contractual threshold.
          </p>

          <div className="pt-2">
            <Link
              to="/recommendations"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              <span>View Recommended Counter-Actions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 2: Feature Weights (Plain English) */}
        <div className="p-6 rounded-2xl bg-[#091510] border border-emerald-500/15 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>PRIMARY PREDICTIVE DRIVERS</span>
          </div>

          <h3 className="text-lg font-bold text-white">Factors Driving Tomorrow's Forecast</h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Timetable & Student Headcount (Academic Schedule)</span>
                <span className="font-mono text-emerald-400 font-bold">42% weight</span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Ambient Temperature & Cooling Degree Hours</span>
                <span className="font-mono text-cyan-400 font-bold">28% weight</span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Solar Irradiance & Clear-Sky Index</span>
                <span className="font-mono text-amber-400 font-bold">20% weight</span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '20%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Historical Baseline & Day of Week Cycle</span>
                <span className="font-mono text-purple-400 font-bold">10% weight</span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
