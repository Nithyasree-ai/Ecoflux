import React, { useState } from 'react';
import { useEcoFlux } from '../lib/dataStore';
import { BentoCard } from '../components/common/BentoCard';
import { MetricBadge } from '../components/common/MetricBadge';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  Sparkles,
  Zap,
  Sun,
  BatteryCharging,
  Leaf
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { buildings, totalDemandKw, solarKw, battery, recommendations, addToast } = useEcoFlux();
  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Custom'>('Daily');
  const [isGenerating, setIsGenerating] = useState(false);

  // CSV Export logic
  const handleExportCsv = () => {
    const headers = ['Building Code', 'Building Name', 'Category', 'Demand (kW)', 'Base Load (kW)', 'Solar Installed (kW)', 'Occupancy (%)', 'Green Score', 'Status'];
    const rows = buildings.map(b => [
      b.code,
      `"${b.name}"`,
      b.category,
      b.currentDemandKw,
      b.baseLoadKw,
      b.solarInstalledKw,
      b.occupancyPct,
      b.currentGreenScore,
      b.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecoflux_campus_report_${timeframe.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'CSV Export Complete', 'Campus telemetry data downloaded successfully.');
  };

  const handleExportPdf = () => {
    window.print();
    addToast('info', 'Print / PDF Dialog Opened', 'Select "Save as PDF" in your browser print destination.');
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      addToast('success', 'Report Generated', `Consolidated ${timeframe} Campus Sustainability Audit ready.`);
    }, 600);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-emerald-400" />
            <span>Reports & Facility Analytics</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Generate formal audits, regulatory disclosures, carbon reduction certificates, and telemetry exports.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Export PDF Audit</span>
          </button>
        </div>
      </div>

      {/* Filter & Generation Controls */}
      <div className="p-5 rounded-3xl bg-[#091510] border border-emerald-500/20 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 uppercase font-semibold">Audit Period:</span>
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
            {(['Daily', 'Weekly', 'Monthly', 'Custom'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeframe === t
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isGenerating ? 'Compiling Telemetry...' : 'Refresh Report Compilation'}</span>
        </button>
      </div>

      {/* Printable Report Summary Document Preview */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#08130e] border border-emerald-500/20 backdrop-blur-2xl shadow-xl space-y-8 print:p-0 print:border-none print:bg-white print:text-black">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-500/15 print:border-slate-300">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              OFFICIAL ENERGY & CARBON REPORT • {timeframe.toUpperCase()} AUDIT
            </span>
            <h2 className="text-2xl font-black text-white print:text-black mt-1">
              Green Valley Institute of Technology
            </h2>
            <span className="text-xs text-slate-400 print:text-slate-600">Campus Code: GVIT-CAMPUS-01 • Generated: {new Date().toLocaleDateString()}</span>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
              VERIFIED PLATINUM GRADE
            </span>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/15 print:border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Gross Consumption</span>
            <span className="text-xl font-bold font-mono text-white print:text-black mt-1 block">9,840 kWh</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">-4.8% vs benchmark</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/15 print:border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Solar Generation</span>
            <span className="text-xl font-bold font-mono text-amber-400 print:text-amber-600 mt-1 block">2,480 kWh</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">+14% vs historical</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/15 print:border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Clean Energy Fraction</span>
            <span className="text-xl font-bold font-mono text-emerald-400 print:text-emerald-700 mt-1 block">78% Ratio</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Zero curtailment</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/15 print:border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">CO₂ Abatement</span>
            <span className="text-xl font-bold font-mono text-cyan-400 print:text-cyan-700 mt-1 block">1.84 Tons</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">$446.40 saved today</span>
          </div>
        </div>

        {/* Building Telemetry Table Breakdown */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white print:text-black">Building-Wise Energy & Carbon Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050e09] print:bg-slate-100 text-slate-400 print:text-slate-700 uppercase font-mono border-b border-emerald-500/10">
                <tr>
                  <th className="p-3">Facility</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Demand (kW)</th>
                  <th className="p-3">Solar (kW)</th>
                  <th className="p-3">Occupancy</th>
                  <th className="p-3">Efficiency</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10 print:divide-slate-200 text-slate-300 print:text-slate-800 font-mono">
                {buildings.map((b) => (
                  <tr key={b.id}>
                    <td className="p-3 font-sans font-semibold text-white print:text-black">{b.name}</td>
                    <td className="p-3 text-slate-400">{b.category}</td>
                    <td className="p-3 text-emerald-400 font-bold">{b.currentDemandKw} kW</td>
                    <td className="p-3 text-amber-400">{b.solarInstalledKw} kW</td>
                    <td className="p-3">{b.occupancyPct}% ({b.currentOccupancy} ppl)</td>
                    <td className="p-3 font-bold text-cyan-400">{b.currentGreenScore}/100</td>
                    <td className="p-3 uppercase text-[10px]">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Sign-Off Section */}
        <div className="pt-6 border-t border-emerald-500/15 print:border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-slate-400 print:text-slate-600">
          <div>
            <span>Audited & Certified by: </span>
            <strong className="text-white print:text-black">Dr. Elena Rostova (Campus Energy Director)</strong>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>ISO 50001 Energy Management Standard Compliant</span>
          </div>
        </div>

      </div>

    </div>
  );
};
