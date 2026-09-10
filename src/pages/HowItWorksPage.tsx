import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import {
  Database,
  Activity,
  Cpu,
  TrendingUp,
  Sparkles,
  Zap,
  Leaf,
  Sun,
  BatteryCharging,
  Users,
  ArrowDown,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const pipelineSteps = [
    {
      step: '01',
      title: 'DATA HARVESTING',
      icon: Database,
      tagline: 'Continuous Campus Telemetry Ingestion',
      description: 'IoT sub-meters across academic, research, and residence halls stream electricity demand at 15-minute intervals. Solar inverters stream DC/AC wattage and irradiance, while access turnstiles and Wi-Fi beacons quantify live occupant density.',
      inputs: ['Building Sub-Meters (kW)', 'Rooftop Inverters (318 kW)', 'BESS State of Charge (78%)', 'Wi-Fi/Turnstile Occupancy (1,840)'],
      color: 'cyan'
    },
    {
      step: '02',
      title: 'ENERGY MONITORING',
      icon: Activity,
      tagline: 'Real-Time Telemetry Normalization',
      description: 'EcoFlux normalizes raw streams, categorizing loads into HVAC chillers, interior lighting, and critical equipment. It compares active draw against historical baseline envelopes to identify spikes and power quality fluctuations.',
      inputs: ['Load Disaggregation', 'Power Factor Verification (0.96)', 'HVAC Stage Telemetry', 'Grid Draw Calculations'],
      color: 'emerald'
    },
    {
      step: '03',
      title: 'AI ANALYSIS',
      icon: Cpu,
      tagline: 'Multivariate Correlation & Anomaly Detection',
      description: 'The machine learning engine correlates human presence with instantaneous power consumption. It automatically flags spatial discrepancies such as full HVAC cooling in vacant lecture halls or abnormal dorm heater cycling.',
      inputs: ['Occupancy-Energy Correlation', 'Idle Power Anomaly Flagging', 'Weather & Cloud Cover Correlator', 'Degradation Monitoring'],
      color: 'purple'
    },
    {
      step: '04',
      title: 'PREDICTION',
      icon: TrendingUp,
      tagline: '24-Hour & 7-Day Forecasting',
      description: 'Ensemble XGBoost + LSTM models simulate prospective campus demand against anticipated solar irradiance, determining the exact hour, magnitude, and duration of incoming utility peak tariffs.',
      inputs: ['Peak Load Timing (2:30 PM)', 'Solar Curve Prediction', 'Grid Headroom Safety Margin', 'Weather Radar Integration'],
      color: 'sky'
    },
    {
      step: '05',
      title: 'RECOMMENDATION',
      icon: Sparkles,
      tagline: 'Prescriptive Energy Strategy Generation',
      description: 'Rather than passive dashboards, EcoFlux evaluates hundreds of microgrid dispatch permutations to formulate prioritized recommendations with quantified dollar and CO₂ payoffs.',
      inputs: ['Load Shifting Schedules', 'Pre-Cooling Windows', 'BESS Pre-Charge Thresholds', 'Daylight Harvesting Targets'],
      color: 'amber'
    },
    {
      step: '06',
      title: 'ACTION',
      icon: Zap,
      tagline: 'Automated or Operator-Approved Execution',
      description: 'Facility managers execute recommendations with one click, or allow the EcoFlux autonomous controller to dynamically throttle chiller stages, switch battery modes, or dim atrium fixtures.',
      inputs: ['Direct BESS Dispatch', 'BACnet/Modbus Gateway Commands', 'HVAC Setpoint Adjustments', 'Operator Audit Logs'],
      color: 'lime'
    },
    {
      step: '07',
      title: 'ENERGY SAVINGS',
      icon: Leaf,
      tagline: 'Measurable ROI & Decarbonization',
      description: 'Utility bills drop, peak demand penalties are completely eliminated, solar curtailment drops to zero, and the campus achieves verified green building credentials.',
      inputs: ['$14,820 / Month Saved', '18.4 Tons CO₂ Offset', '78% Clean Energy Fraction', 'Platinum Green Accreditation'],
      color: 'emerald'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050a08] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span>END-TO-END INTELLIGENCE ARCHITECTURE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            How EcoFlux Turns Campus Data Into Energy Savings
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            EcoFlux combines electricity, solar, battery, and occupancy feeds to autonomously orchestrate campus energy.
          </p>
        </div>

        {/* 4 Core Ingestion Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <div className="p-5 rounded-2xl bg-[#0a1511] border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Zap className="w-4 h-4" /></div>
              <h4 className="font-bold text-white text-sm">Electricity Data</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sub-metered telemetry across all 8 campus facilities covering lighting, HVAC, and power sockets.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a1511] border border-amber-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><Sun className="w-4 h-4" /></div>
              <h4 className="font-bold text-white text-sm">Solar Generation</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rooftop array capacity of 318 kW with real-time irradiance, inverter efficiency, and temperature.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a1511] border border-cyan-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400"><BatteryCharging className="w-4 h-4" /></div>
              <h4 className="font-bold text-white text-sm">Battery BESS</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              1.2 MWh central storage system with dynamic charge/discharge dispatch and 98.4% cell health.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a1511] border border-purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400"><Users className="w-4 h-4" /></div>
              <h4 className="font-bold text-white text-sm">Occupancy Feeds</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time headcount density per building to prevent over-cooling empty facilities.
            </p>
          </div>
        </div>

        {/* The 7-Step Interactive Pipeline Flow */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Interactive 7-Stage Process Flow</h3>
            <span className="text-xs text-slate-400">Click any step to inspect technical details</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-3">
            {pipelineSteps.map((s, idx) => {
              const IconComp = s.icon;
              const isSelected = activeStep === idx;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#0e221a] border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                      : 'bg-[#08130f] border-emerald-500/15 hover:border-emerald-500/30 hover:bg-[#0b1b15]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{s.step}</span>
                    <IconComp className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                  </div>
                  <h4 className="font-bold text-xs text-white uppercase tracking-tight truncate">{s.title}</h4>
                </button>
              );
            })}
          </div>

          {/* Active Step Deep Dive Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0a1511] border border-emerald-500/30 backdrop-blur-xl transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-emerald-500/15">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  STAGE {pipelineSteps[activeStep].step} OF 07
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {pipelineSteps[activeStep].title} — {pipelineSteps[activeStep].tagline}
                </h3>
              </div>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs self-start md:self-auto hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
              >
                <span>View in Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-sm text-slate-300 mt-6 leading-relaxed max-w-4xl">
              {pipelineSteps[activeStep].description}
            </p>

            <div className="mt-6 pt-6 border-t border-emerald-500/10">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                Telemetry Inputs & Logic Verified:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {pipelineSteps[activeStep].inputs.map((inp) => (
                  <div key={inp} className="flex items-center gap-2 p-3 rounded-xl bg-black/40 border border-emerald-500/15 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{inp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};
