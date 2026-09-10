import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Campus3DViewer } from '../components/3d/Campus3DViewer';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import {
  Zap,
  Sun,
  BatteryCharging,
  Users,
  TrendingUp,
  Sparkles,
  Sliders,
  Bot,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Activity,
  Layers,
  Leaf
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050a08] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden">
        {/* Radial ambient glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SMART ENERGY MANAGEMENT FOR GREEN CAMPUSES</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight">
              <span className="block text-white">Turn Campus Energy Into</span>
              <span className="text-gradient-emerald">Intelligent Action.</span>
            </h1>

            {/* Tagline / Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Monitor energy. Predict demand. Optimize renewables. Build a smarter, greener campus with unified 3D telemetry, intelligent battery storage, and AI-driven load orchestration.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-base shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all transform hover:-translate-y-0.5"
              >
                <Zap className="w-5 h-5 fill-black" />
                <span>Explore Dashboard</span>
              </Link>

              <Link
                to="/how-it-works"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0d1c15] hover:bg-[#12281e] text-slate-200 border border-emerald-500/25 font-semibold text-base transition-all"
              >
                <span>See How It Works</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>

              <Link
                to="/signup"
                className="hidden sm:flex items-center gap-1.5 px-5 py-3.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Get Started →</span>
              </Link>
            </div>

          </div>

          {/* 3D Interactive Futuristic Campus Canvas Visualizer */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="p-2 sm:p-3 rounded-3xl bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-transparent border border-emerald-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              <Campus3DViewer height="520px" interactive={true} />
            </div>

            {/* Energy Flow Indicator Banner */}
            <div className="mt-4 p-3 rounded-2xl bg-[#091510]/80 border border-emerald-500/20 backdrop-blur-md flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-2 text-amber-400 font-bold">
                <Sun className="w-4 h-4" /> 1. SOLAR ARRAYS (318 kW)
              </span>
              <span className="text-emerald-400 font-bold">➔</span>
              <span className="flex items-center gap-2 text-cyan-400 font-bold">
                <BatteryCharging className="w-4 h-4" /> 2. CENTRAL BESS (78% SoC)
              </span>
              <span className="text-emerald-400 font-bold">➔</span>
              <span className="flex items-center gap-2 text-emerald-400 font-bold">
                <Zap className="w-4 h-4" /> 3. 8 CAMPUS BUILDINGS
              </span>
              <span className="text-emerald-400 font-bold">➔</span>
              <span className="flex items-center gap-2 text-lime-400 font-bold">
                <Leaf className="w-4 h-4" /> 4. SAVINGS ($14.8K/mo)
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar below hero */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto">
            <div className="p-5 rounded-2xl bg-[#0a1511] border border-emerald-500/15 backdrop-blur-md text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono flex items-center justify-center gap-1">
                <AnimatedCounter end={24} duration={1000} suffix="/7" />
              </div>
              <span className="text-xs font-medium text-slate-400 mt-1 block">Continuous Grid Telemetry</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a1511] border border-emerald-500/15 backdrop-blur-md text-center">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono flex items-center justify-center gap-1">
                <AnimatedCounter end={96} duration={1000} decimals={1} suffix="%" />
              </div>
              <span className="text-xs font-medium text-slate-400 mt-1 block">AI Demand Prediction R²</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a1511] border border-emerald-500/15 backdrop-blur-md text-center">
              <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono flex items-center justify-center gap-1">
                <AnimatedCounter end={61} duration={1000} suffix="%" />
              </div>
              <span className="text-xs font-medium text-slate-400 mt-1 block">Solar Renewable Fraction</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a1511] border border-emerald-500/15 backdrop-blur-md text-center">
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400 font-mono flex items-center justify-center gap-1">
                <AnimatedCounter end={86} duration={1000} suffix="/100" />
              </div>
              <span className="text-xs font-medium text-slate-400 mt-1 block">Campus Green Score</span>
            </div>
          </div>

        </div>
      </section>

      {/* Storytelling Flow: PROBLEM -> DATA -> INTELLIGENCE -> ACTION -> IMPACT */}
      <section className="py-20 border-y border-emerald-500/15 bg-[#040907] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">CAMPUS TRANSFORMATION PIPELINE</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              From Fragmented Meters to Unified Campus Intelligence
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            
            {/* Step 1: PROBLEM */}
            <div className="p-6 rounded-2xl bg-[#0a1410] border border-rose-500/20 relative">
              <span className="text-[10px] font-mono font-bold uppercase text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                01 • PROBLEM
              </span>
              <h4 className="text-base font-bold text-white mt-3">Siloed & Wasteful</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Campus energy is uncoordinated. Academic halls chill empty rooms while hostel heating draws costly peak grid power.
              </p>
            </div>

            {/* Step 2: DATA */}
            <div className="p-6 rounded-2xl bg-[#0a1410] border border-cyan-500/20 relative">
              <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                02 • DATA
              </span>
              <h4 className="text-base font-bold text-white mt-3">Unified Telemetry</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                EcoFlux connects building meters, rooftop solar generation, BESS storage, and sensor occupancy in real time.
              </p>
            </div>

            {/* Step 3: INTELLIGENCE */}
            <div className="p-6 rounded-2xl bg-[#0a1410] border border-emerald-500/20 relative">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                03 • INTELLIGENCE
              </span>
              <h4 className="text-base font-bold text-white mt-3">AI Forecasting</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Machine learning models forecast 24-hour demand spikes, solar irradiance swings, and peak load windows.
              </p>
            </div>

            {/* Step 4: ACTION */}
            <div className="p-6 rounded-2xl bg-[#0a1410] border border-lime-500/20 relative">
              <span className="text-[10px] font-mono font-bold uppercase text-lime-400 px-2 py-0.5 rounded bg-lime-500/10 border border-lime-500/20">
                04 • ACTION
              </span>
              <h4 className="text-base font-bold text-white mt-3">Automated Dispatch</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                One-click or automated dispatch: pre-charge batteries on solar surplus, shed HVAC during recess, dim daylight zones.
              </p>
            </div>

            {/* Step 5: IMPACT */}
            <div className="p-6 rounded-2xl bg-[#0a1410] border border-emerald-400/40 relative shadow-[0_0_25px_rgba(16,185,129,0.15)]">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30">
                05 • IMPACT
              </span>
              <h4 className="text-base font-bold text-white mt-3">Zero Waste Campus</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                $14,820 monthly utility savings, 18.4 tons CO₂ avoided, and an elite Platinum Green Building accreditation.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Bento Preview Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">BENTO ARCHITECTURE</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Engineered for Modern Campus Facility Operations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Live Telemetry */}
          <div className="p-6 rounded-2xl bg-[#091510] border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Building-Wise Energy Tracking</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Monitor real-time sub-metering across lecture halls, computer science clusters, dining facilities, and student residences.
              </p>
            </div>
            <Link to="/energy" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-6">
              <span>View Energy Telemetry</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: What-If Simulator */}
          <div className="p-6 rounded-2xl bg-[#091510] border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-fit mb-4">
                <Sliders className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">What-If Scenario Simulator</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Model capital investments before spending. Test adding 50 kW solar, 200 kWh battery storage, or shifting schedule hours.
              </p>
            </div>
            <Link to="/simulator" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-6">
              <span>Launch Simulator</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: AI Copilot */}
          <div className="p-6 rounded-2xl bg-[#091510] border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-400 w-fit mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Specialized Energy Copilot</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Ask natural questions: "Which building uses the most energy?", "When will demand peak?", and receive immediate data cards.
              </p>
            </div>
            <Link to="/copilot" className="text-xs font-semibold text-lime-400 hover:text-lime-300 flex items-center gap-1 mt-6">
              <span>Ask Copilot</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* End Call to Action */}
      <section className="py-20 border-t border-emerald-500/15 bg-gradient-to-b from-[#050a08] to-[#081510] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <Zap className="w-6 h-6 fill-emerald-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Ready to make your campus smarter?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
            Join the forward-thinking universities turning telemetry into actionable savings and sustainability leadership.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-base shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all transform hover:-translate-y-0.5"
            >
              Enter EcoFlux Dashboard
            </Link>
            <Link
              to="/features"
              className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold text-base border border-white/10 transition-all"
            >
              Explore All Features
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
