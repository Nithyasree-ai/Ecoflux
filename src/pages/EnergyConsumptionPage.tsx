import React, { useState } from 'react';
import { useEcoFlux } from '../lib/dataStore';
import { BentoCard } from '../components/common/BentoCard';
import { EnergyConsumptionChart } from '../components/charts/EnergyConsumptionChart';
import { BuildingComparisonChart } from '../components/charts/BuildingComparisonChart';
import {
  Zap,
  Filter,
  Search,
  Building as BuildingIcon,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ChevronDown,
  X,
  RotateCcw
} from 'lucide-react';

export const EnergyConsumptionPage: React.FC = () => {
  const { buildings, totalDemandKw } = useEcoFlux();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredBuildings = buildings.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Zap className="w-7 h-7 text-emerald-400" />
            <span>Campus Energy Consumption</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Building-wise electricity sub-metering, HVAC load splitting, and peak anomaly surveillance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#091510] border border-emerald-500/20 text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Active Load</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{totalDemandKw} kW</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BentoCard
          title="24-Hour Campus Demand Profile"
          subtitle="Hourly load disaggregation with contractual peak threshold"
          icon={<Zap className="w-4 h-4 text-emerald-400" />}
        >
          <EnergyConsumptionChart />
        </BentoCard>

        <BentoCard
          title="Building Load Distribution"
          subtitle="Real-time kW comparison across the 8 campus facilities"
          icon={<BuildingIcon className="w-4 h-4 text-cyan-400" />}
        >
          <BuildingComparisonChart />
        </BentoCard>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#091510] border border-emerald-500/15 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by building name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/40 border border-emerald-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-black/50 border border-emerald-500/20 text-slate-200 py-1.5 px-2.5 rounded-xl text-xs focus:outline-none focus:border-emerald-400"
            >
              <option value="All">All Categories</option>
              <option value="Academic">Academic</option>
              <option value="Hostel">Hostel</option>
              <option value="Administrative">Administrative</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Dining">Dining</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/50 border border-emerald-500/20 text-slate-200 py-1.5 px-2.5 rounded-xl text-xs focus:outline-none focus:border-emerald-400"
            >
              <option value="All">All Statuses</option>
              <option value="optimal">Optimal</option>
              <option value="normal">Normal</option>
              <option value="warning">Warning / Anomaly</option>
            </select>
          </div>

        </div>

        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredBuildings.length} of {buildings.length} facilities
        </span>
      </div>

      {/* Buildings Table */}
      <div className="rounded-2xl bg-[#091510]/90 border border-emerald-500/15 overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#060e0a] text-slate-400 uppercase tracking-wider font-mono border-b border-emerald-500/10">
              <tr>
                <th className="p-4">Building</th>
                <th className="p-4">Category</th>
                <th className="p-4">Current kW</th>
                <th className="p-4">Base Load</th>
                <th className="p-4">Occupancy</th>
                <th className="p-4">HVAC State</th>
                <th className="p-4">Green Score</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10 text-slate-300">
              {filteredBuildings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    <BuildingIcon className="w-10 h-10 text-slate-600 mx-auto mb-3 opacity-60" />
                    <p className="text-sm font-semibold text-white">No campus facilities found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      No buildings match "{searchQuery}" under current filters.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                        setStatusFilter('All');
                      }}
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/25 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Filters & Search</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredBuildings.map((b) => {
                  const isWarning = b.status === 'warning';
                  return (
                  <tr key={b.id} className="hover:bg-emerald-500/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400">
                          {b.code}
                        </span>
                        <div>
                          <span className="font-bold text-white block">{b.name}</span>
                          <span className="text-[10px] text-slate-500">{b.grossAreaSqft.toLocaleString()} sqft</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="text-slate-300 font-medium">{b.category}</span>
                    </td>

                    <td className="p-4">
                      <span className="text-sm font-bold font-mono text-emerald-400">
                        {b.currentDemandKw} kW
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-mono text-slate-400">{b.baseLoadKw} kW</span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{b.occupancyPct}%</span>
                        <span className="text-[10px] text-slate-500">({b.currentOccupancy} ppl)</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                        b.hvacStatus === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : b.hvacStatus === 'eco'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {b.hvacStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-mono font-bold text-cyan-400">{b.currentGreenScore} / 100</span>
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        isWarning
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {isWarning ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        <span>{b.status}</span>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
