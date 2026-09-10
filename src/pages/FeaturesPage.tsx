import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import {
  Zap,
  Sun,
  BatteryCharging,
  Users,
  TrendingUp,
  Sparkles,
  LayoutDashboard,
  Award,
  Sliders,
  Bot,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Energy Consumption',
      description: 'Store and display building-wise electricity usage with granular breakdown for HVAC, lighting, and research equipment.',
      metric: '8 Buildings Active',
      submetric: 'Sub-metered at 15-min intervals',
      path: '/energy',
      color: 'emerald'
    },
    {
      icon: Sun,
      title: 'Solar Generation',
      description: 'Show current and historical rooftop photovoltaic generation, weather correlation, and clean energy displacement.',
      metric: '318 kW Peak',
      submetric: '+14% above 7-day average',
      path: '/solar',
      color: 'amber'
    },
    {
      icon: BatteryCharging,
      title: 'Battery Monitoring',
      description: 'Calculate state of charge in real time and execute intelligent algorithms for solar surplus storage vs. peak demand shaving.',
      metric: '1.2 MWh BESS',
      submetric: '78.5% SoC • Active Charging',
      path: '/battery',
      color: 'cyan'
    },
    {
      icon: Users,
      title: 'Occupancy Monitoring',
      description: 'Correlate headcount and room utilization with power draw to isolate energy anomalies in unoccupied lecture halls and dormitories.',
      metric: '1,840 Occupants',
      submetric: '1 Idle load discrepancy flagged',
      path: '/occupancy',
      color: 'rose'
    },
    {
      icon: TrendingUp,
      title: 'AI Energy Prediction',
      description: 'Machine learning forecasting models predict future electricity demand and solar generation over 24h, 7d, and 30d horizons.',
      metric: '96.8% R² Fit',
      submetric: 'Predicted Peak: 2:30 PM (512 kW)',
      path: '/predictions',
      color: 'sky'
    },
    {
      icon: Sparkles,
      title: 'AI Recommendation Engine',
      description: 'Generate high-ROI energy conservation and renewable-dispatch recommendations with quantified kWh and dollar savings.',
      metric: '$54.36 / Day',
      submetric: '4 Active automated recommendations',
      path: '/recommendations',
      color: 'emerald'
    },
    {
      icon: LayoutDashboard,
      title: 'Smart Dashboard',
      description: 'Bring all campus telemetry, real-time alert tickers, key performance metrics, and interactive charts into one unified Bento UI.',
      metric: '6 Live Bento Views',
      submetric: 'Zero refresh telemetry sync',
      path: '/dashboard',
      color: 'emerald'
    },
    {
      icon: Award,
      title: 'Green Building Score',
      description: 'Calculate and gamify energy-efficiency ratings (0–100) with campus-wide leaderboards for academic, dining, and residential blocks.',
      metric: '86 / 100 Campus',
      submetric: 'Platinum Grade Accreditation',
      path: '/green-score',
      color: 'lime'
    },
    {
      icon: Sliders,
      title: 'What-If Simulator',
      description: 'Interactive thermodynamic scenario simulator allowing campus planners to adjust solar, BESS capacity, setpoints, and hours.',
      metric: 'Real-time Math',
      submetric: 'Live ROI & CO₂ tonnage impact',
      path: '/simulator',
      color: 'cyan'
    },
    {
      icon: Bot,
      title: 'AI Energy Copilot',
      description: 'Specialized conversational AI assistant equipped with direct campus telemetry context to answer facility queries and trigger actions.',
      metric: 'Instant Facility Q&A',
      submetric: 'Pre-trained on campus microgrid logic',
      path: '/copilot',
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050a08] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span>BENTO PLATFORM SUITE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ten Intelligent Modules, One Seamless Ecosystem
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Every feature in EcoFlux is purpose-built for campus microgrids, facility managers, and sustainability committees.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={feat.title}
                className="group relative p-6 rounded-2xl bg-[#0a1511]/90 border border-emerald-500/15 hover:border-emerald-500/40 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 group-hover:text-emerald-400 transition-colors">
                      Live Telemetry
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-500/10 flex items-center justify-between">
                  <div>
                    <span className="block text-sm font-bold font-mono text-white">{feat.metric}</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">{feat.submetric}</span>
                  </div>
                  <Link
                    to={feat.path}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Strip */}
        <div className="mt-20 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-950/60 to-[#07130e] border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white">Experience EcoFlux on Your Campus</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Deploy our single-project architecture with instant Supabase backend telemetry sync.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all shrink-0"
          >
            Launch Interactive Dashboard
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
};
