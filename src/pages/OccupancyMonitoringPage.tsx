import React from 'react';
import { useEcoFlux } from '../lib/dataStore';
import { BentoCard } from '../components/common/BentoCard';
import { MetricBadge } from '../components/common/MetricBadge';
import { OccupancyEnergyChart } from '../components/charts/OccupancyEnergyChart';
import { getFacilityDataMap, FACILITY_HEATMAPS } from '../data/campusData';
import {
  Users,
  AlertTriangle,
  Zap,
  Building2,
  CheckCircle2,
  TrendingUp,
  Sliders,
  ChevronRight,
  Flame,
  ArrowRight,
  ShieldCheck,
  Activity,
  Clock,
  Thermometer,
  Sun,
  Layers
} from 'lucide-react';

export const OccupancyMonitoringPage: React.FC = () => {
  const { buildings, selectedFacility, setSelectedFacility, applyRecommendation, recommendations } = useEcoFlux();

  // Centralized dynamic facility map (connected directly to live buildings state)
  const facilityMap = getFacilityDataMap(buildings);
  const facilityList = Object.values(facilityMap);

  // Campus aggregates
  const totalHeadcount = buildings.reduce((acc, b) => acc + b.currentOccupancy, 0);
  const totalCapacity = buildings.reduce((acc, b) => acc + b.designedOccupancy, 0);
  const avgOccupancy = Number(((totalHeadcount / totalCapacity) * 100).toFixed(1));
  const totalDemand = Math.round(buildings.reduce((acc, b) => acc + b.currentDemandKw, 0));
  const campusEnergyPerPerson = Number((totalDemand / totalHeadcount).toFixed(3));
  const anomalyCount = buildings.filter(b => b.status === 'warning' || b.status === 'alert').length;

  // Active facility resolution
  const isAllSelected = selectedFacility === 'ALL';
  const activeFacility = isAllSelected ? null : (facilityMap[selectedFacility] || facilityMap['HOST-A']);

  // Selected or aggregated metrics for summary cards
  const displayOccupancy = isAllSelected ? avgOccupancy : activeFacility!.occupancy;
  const displayPowerDraw = isAllSelected ? totalDemand : activeFacility!.powerDraw;
  const displayHeadcount = isAllSelected ? totalHeadcount : activeFacility!.headcount;
  const displayCapacity = isAllSelected ? totalCapacity : activeFacility!.capacity;
  const displayEnergyPerPerson = isAllSelected ? campusEnergyPerPerson : activeFacility!.energyPerPerson;

  // Active heatmap schedule
  const activeHeatmapSchedule = isAllSelected
    ? FACILITY_HEATMAPS['ALL']
    : (FACILITY_HEATMAPS[selectedFacility] || FACILITY_HEATMAPS['ACAD']);

  // Anomaly evaluation for the active view
  const isFacilityAnomalous = !isAllSelected && (activeFacility?.anomalyDetected || activeFacility?.anomalyStatus === 'warning' || activeFacility?.anomalyStatus === 'alert');
  const hostABuilding = buildings.find(b => b.code === 'HOST-A');
  const isHostAAnomalous = hostABuilding?.status === 'warning' || hostABuilding?.status === 'alert';

  // Active AI recommendation for selected facility
  const facilityRec = recommendations.find(r => 
    !isAllSelected && activeFacility && (
      r.title.toLowerCase().includes(activeFacility.name.toLowerCase()) || 
      r.title.toLowerCase().includes(activeFacility.code.toLowerCase()) ||
      r.description.toLowerCase().includes(activeFacility.name.toLowerCase()) ||
      r.description.toLowerCase().includes(activeFacility.code.toLowerCase())
    )
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-rose-400" />
            <span>Building Occupancy & Heatmap Correlator</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time headcount density vs. power draw to detect energy waste during low student occupancy.
          </p>
        </div>

        {/* Active Facility & Campus Headcount Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-[#091510] border border-emerald-500/20 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-300">
              Active Facility: <strong className="text-white">{isAllSelected ? 'ALL FACILITIES' : `${activeFacility?.code} (${activeFacility?.name})`}</strong>
            </span>
            {!isAllSelected && (
              <button
                type="button"
                onClick={() => setSelectedFacility('ALL')}
                className="ml-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          <div className="p-3 rounded-2xl bg-[#091510] border border-rose-500/20 text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              {isAllSelected ? 'Campus Occupants' : `${activeFacility?.code} Occupants`}
            </span>
            <span className="text-xl font-bold font-mono text-white">
              {displayHeadcount.toLocaleString()} <span className="text-xs text-slate-400">/ {displayCapacity.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Anomaly Banner */}
      {isAllSelected ? (
        // Campus Overview Anomaly Banner
        isHostAAnomalous ? (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/60 via-[#170c0f] to-[#0a1511] border border-rose-500/40 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_10px_30px_rgba(244,63,94,0.15)]" data-testid="anomaly-banner-overview">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/40">
                    CRITICAL IDLE ENERGY DISCREPANCY
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedFacility('HOST-A')}
                    className="text-xs text-rose-300 font-mono font-bold hover:underline cursor-pointer"
                  >
                    Hostel Block A (Click to Inspect)
                  </button>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  High energy consumption ({hostABuilding?.currentDemandKw} kW) detected despite low student occupancy ({hostABuilding?.occupancyPct}%)
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed max-w-2xl">
                  Power draw is 24% above historical baseline during midday classes. Suspected hot water circulation pump running unthrottled and common lounge air conditioners left on manual override.
                </p>
              </div>
            </div>

            <button
              id="btn-apply-load-shedding"
              type="button"
              onClick={() => applyRecommendation('rec-04')}
              className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all shrink-0 self-end md:self-center flex items-center gap-1.5 cursor-pointer"
            >
              <span>Apply Load Shedding</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#0a1711] to-[#08120e] border border-emerald-500/30 backdrop-blur-xl flex items-center justify-between gap-4 shadow-[0_10px_30px_rgba(16,185,129,0.15)]" data-testid="anomaly-banner-overview">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
                  CAMPUS CORRELATION: OPTIMAL
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  All 8 campus facilities operating within standard occupancy-energy correlation thresholds
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Hostel Block A load shedding active (54.0 kW). No active energy anomalies flagged across campus.
                </p>
              </div>
            </div>
          </div>
        )
      ) : isFacilityAnomalous ? (
        // Anomalous Facility Selected (e.g., Hostel Block A)
        <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/60 via-[#170c0f] to-[#0a1511] border border-rose-500/40 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_10px_30px_rgba(244,63,94,0.15)]" data-testid="anomaly-banner-selected">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/40">
                  CRITICAL ANOMALY: {activeFacility?.code}
                </span>
                <span className="text-xs text-rose-300 font-mono font-bold">Wasted Energy: $17.10/day</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                High power draw ({activeFacility?.powerDraw} kW) vs low occupancy ({activeFacility?.occupancy}%)
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed max-w-2xl">
                Base load: {activeFacility?.baseLoad} kW | Current draw: {activeFacility?.powerDraw} kW (+24% deviation). Suspected hot water circulation pump running unthrottled and common lounge AC units on manual override during lecture hours.
              </p>
            </div>
          </div>

          <button
            id="btn-apply-load-shedding-specific"
            type="button"
            onClick={() => applyRecommendation(facilityRec?.id || 'rec-04')}
            className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all shrink-0 self-end md:self-center flex items-center gap-1.5 cursor-pointer"
          >
            <span>Apply Load Shedding</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // Normal / Optimal Facility Selected
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#0a1711] to-[#08120e] border border-emerald-500/30 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_10px_30px_rgba(16,185,129,0.15)]" data-testid={`facility-status-banner-${selectedFacility.toLowerCase()}`}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
                  NORMAL CORRELATION: {activeFacility?.code}
                </span>
                <span className="text-xs text-emerald-300 font-mono font-bold">Green Score: {activeFacility?.greenScore}/100</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Normal correlation – power draw ({activeFacility?.powerDraw} kW) is consistent with occupancy ({activeFacility?.occupancy}%)
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed max-w-2xl">
                Base load: {activeFacility?.baseLoad} kW | Per capita draw: {activeFacility?.energyPerPerson.toFixed(3)} kW/cap. Electricity consumption matches operational schedule with no idle waste detected.
              </p>
            </div>
          </div>

          {facilityRec && facilityRec.status === 'active' ? (
            <button
              type="button"
              onClick={() => applyRecommendation(facilityRec.id)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all shrink-0 self-end md:self-center flex items-center gap-1.5 cursor-pointer"
            >
              <span>{facilityRec.title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 self-end md:self-center">
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
                ✓ ENVELOPE VERIFIED
              </span>
            </div>
          )}
        </div>
      )}

      {/* KPI Top Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4" data-testid="occupancy-kpi-row">
        <MetricBadge
          label={isAllSelected ? "Average Occupancy" : `${activeFacility?.code} Occupancy Rate`}
          value={displayOccupancy}
          unit="%"
          subtext={isAllSelected ? "Across all 8 zones" : `${displayHeadcount} / ${displayCapacity} occupants`}
          icon={Users}
          variant="cyan"
        />
        <MetricBadge
          label={isAllSelected ? "Total Power Draw" : `${activeFacility?.code} Power Draw`}
          value={displayPowerDraw}
          unit="kW"
          subtext={isAllSelected ? "Campus-wide demand" : `Base load: ${activeFacility?.baseLoad} kW`}
          icon={Zap}
          variant={isFacilityAnomalous ? "rose" : "emerald"}
        />
        <MetricBadge
          label={isAllSelected ? "Campus Energy / Person" : `${activeFacility?.code} Energy / Person`}
          value={displayEnergyPerPerson.toFixed(3)}
          unit="kW/cap"
          subtext={displayEnergyPerPerson > 0.4 ? "Exceeds optimal benchmark" : "Optimal benchmark: 0.28"}
          icon={Zap}
          variant={displayEnergyPerPerson > 0.4 ? "rose" : "emerald"}
        />
        <MetricBadge
          label={isAllSelected ? "Anomalous Zones" : `${activeFacility?.code} Status`}
          value={isAllSelected ? `${anomalyCount}` : isFacilityAnomalous ? "ANOMALY" : "OPTIMAL"}
          unit={isAllSelected ? "facility" : ""}
          subtext={isAllSelected ? (anomalyCount > 0 ? "Hostel Block A flagged" : "All zones optimal") : isFacilityAnomalous ? "+24% idle discrepancy" : "Within target envelope"}
          icon={AlertTriangle}
          variant={isAllSelected ? (anomalyCount > 0 ? "rose" : "emerald") : isFacilityAnomalous ? "rose" : "emerald"}
        />
      </div>

      {/* Main Scatter Correlation Chart */}
      <BentoCard
        title="Live Occupancy vs. Electricity Demand Correlation"
        subtitle="Scatter distribution mapping real-time kW draw against headcount %"
        icon={<Users className="w-4 h-4 text-emerald-400" />}
      >
        <OccupancyEnergyChart
          selectedFacility={selectedFacility}
          key={`occupancy-scatter-${selectedFacility}`}
        />
      </BentoCard>

      {/* Building Occupancy Deep-Dive & Heatmap Correlator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Building Occupancy Visualization Card */}
        <BentoCard
          title="Building Occupancy Breakdown"
          subtitle={isAllSelected ? "Campus-wide occupancy distribution" : `Detailed occupancy for ${activeFacility?.name}`}
          icon={<Building2 className="w-4 h-4 text-cyan-400" />}
          className="lg:col-span-1"
        >
          <div
            key={`building-occupancy-breakdown-${selectedFacility}`}
            className="space-y-4 text-xs animate-in fade-in duration-200"
            data-testid="building-occupancy-breakdown"
          >
            <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/15">
              <span className="text-slate-400 text-[11px] block">Selected Facility</span>
              <strong className="text-white text-base block mt-0.5 font-mono">
                {isAllSelected ? 'All 8 Campus Facilities' : `${activeFacility?.code} – ${activeFacility?.name}`}
              </strong>
              <span className="text-[11px] text-cyan-400 font-mono mt-0.5 block">
                Category: {isAllSelected ? 'Multi-Disciplinary Campus' : activeFacility?.category}
              </span>
            </div>

            {/* Occupancy Progress Indicator */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/15 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Live Occupancy Rate</span>
                <strong className={isFacilityAnomalous ? 'text-rose-400 text-sm' : 'text-emerald-400 text-sm'}>
                  {displayOccupancy}%
                </strong>
              </div>

              <div className="w-full bg-black/60 h-3 rounded-full overflow-hidden border border-white/10 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isFacilityAnomalous
                      ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                      : displayOccupancy > 80
                      ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]'
                      : 'bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, displayOccupancy))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>Headcount: <strong className="text-white">{displayHeadcount}</strong></span>
                <span>Max Capacity: <strong className="text-white">{displayCapacity}</strong></span>
              </div>
            </div>

            {/* Dynamic Telemetry Metric Pairs */}
            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/10">
                <span className="text-[10px] text-slate-400 block">Power Draw</span>
                <strong className={isFacilityAnomalous ? 'text-rose-400 text-sm' : 'text-emerald-400 text-sm'}>
                  {displayPowerDraw} kW
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/10">
                <span className="text-[10px] text-slate-400 block">Energy / Person</span>
                <strong className="text-cyan-300 text-sm">
                  {displayEnergyPerPerson.toFixed(3)} <span className="text-[9px] text-slate-400">kW/cap</span>
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/10">
                <span className="text-[10px] text-slate-400 block">Base Load</span>
                <strong className="text-slate-200 text-sm">
                  {isAllSelected ? '468.5 kW' : `${activeFacility?.baseLoad} kW`}
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/10">
                <span className="text-[10px] text-slate-400 block">Solar Rooftop</span>
                <strong className="text-amber-300 text-sm">
                  {isAllSelected ? '318 kW' : `${activeFacility?.solarAllocation} kW`}
                </strong>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Heatmap Correlator Card */}
        <BentoCard
          title="Building Occupancy & Heatmap Correlator"
          subtitle={isAllSelected ? "Operating period matrix across campus" : `Diurnal correlation schedule for ${activeFacility?.name}`}
          icon={<Activity className="w-4 h-4 text-emerald-400" />}
          className="lg:col-span-2"
        >
          <div
            key={`heatmap-correlator-container-${selectedFacility}`}
            className="space-y-3 animate-in fade-in duration-200"
            data-testid="heatmap-correlator-container"
          >
            {/* 6 Operating Period Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeHeatmapSchedule.map((period, idx) => {
                const isPeriodAnomaly = period.status === 'anomaly';
                const isHighUtil = period.status === 'high-utilization';
                const isEfficient = period.status === 'efficient';

                return (
                  <div
                    key={`heatmap-slot-${selectedFacility}-${idx}`}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isPeriodAnomaly
                        ? 'bg-rose-950/30 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                        : isHighUtil
                        ? 'bg-cyan-950/20 border-cyan-500/30'
                        : isEfficient
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-black/40 border-emerald-500/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {period.period}
                      </span>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        isPeriodAnomaly
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                          : isHighUtil
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : isEfficient
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-700/30 text-slate-400 border-slate-600/40'
                      }`}>
                        {period.statusLabel}
                      </span>
                    </div>

                    <h5 className="font-bold text-white text-xs">{period.label}</h5>

                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between font-mono text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Occupancy</span>
                        <strong className="text-white">{period.occupancyPct}%</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Power Draw</span>
                        <strong className={isPeriodAnomaly ? 'text-rose-400' : 'text-emerald-400'}>
                          {period.demandKw} kW
                        </strong>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 mt-2 leading-relaxed line-clamp-2">
                      {period.notes}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Heatmap Correlation Legend & Dynamic Diagnostic Rule Matching */}
            <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Correlation Diagnostic Rules:</span>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${
                  displayOccupancy <= 40 && displayPowerDraw >= 60
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                    : 'text-rose-400/80'
                }`}>
                  <span className={`w-2 h-2 rounded-full bg-rose-500 ${displayOccupancy <= 40 && displayPowerDraw >= 60 ? 'animate-ping' : ''}`} />
                  <span>Low Occ + High Power: Idle Waste / Anomaly</span>
                </span>
                <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${
                  displayOccupancy >= 70 && displayPowerDraw >= 60
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-cyan-400/80'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>High Occ + High Power: Normal High Utilization</span>
                </span>
                <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${
                  displayOccupancy >= 70 && displayPowerDraw < 60
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-emerald-400/80'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>High Occ + Low Power: Efficient Operation</span>
                </span>
                <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${
                  displayOccupancy < 70 && displayPowerDraw < 60 && !(displayOccupancy <= 40 && displayPowerDraw >= 60)
                    ? 'bg-slate-700/30 text-slate-200 border border-slate-600/40 font-bold'
                    : 'text-slate-400/80'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  <span>Low Occ + Low Power: Normal Low-Use</span>
                </span>
              </div>
            </div>
          </div>
        </BentoCard>

      </div>

      {/* Campus Facility Utilization Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Campus Facility Utilization Grid</span>
              <span className="text-xs font-mono font-normal text-slate-400">(8 Facilities)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any facility card below to update all live charts, occupancy breakdowns, heatmaps, and telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-select-facility-all"
              type="button"
              onClick={() => setSelectedFacility('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                isAllSelected
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] ring-2 ring-emerald-300'
                  : 'bg-black/40 text-slate-300 border border-emerald-500/20 hover:border-emerald-500/40 hover:text-white'
              }`}
            >
              All Facilities (Overview)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="facility-utilization-grid">
          {buildings.map((b) => {
            const isAnomaly = b.status === 'warning' || b.status === 'alert';
            const isSelected = selectedFacility === b.code;
            const energyPerPerson = b.currentOccupancy > 0 ? (b.currentDemandKw / b.currentOccupancy).toFixed(3) : '0';

            return (
              <div
                key={b.id}
                id={`facility-card-${b.code.toLowerCase()}`}
                onClick={() => setSelectedFacility(b.code)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#0f241a] border-emerald-400 ring-2 ring-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                    : isAnomaly
                    ? 'bg-[#150a0d] border-rose-500/30 hover:border-rose-500/60'
                    : 'bg-[#091510] border-emerald-500/15 hover:border-emerald-500/40 hover:bg-[#0c1a14]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-emerald-400">{b.code}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      isAnomaly
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {isAnomaly ? 'Anomaly' : `${b.occupancyPct}% Occupied`}
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm">{b.name}</h4>
                <span className="text-xs text-slate-400 mt-0.5 block">{b.category}</span>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>Headcount</span>
                    <span className="text-white font-bold">{b.currentOccupancy} / {b.designedOccupancy}</span>
                  </div>
                  <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isAnomaly ? 'bg-rose-500' : b.occupancyPct > 80 ? 'bg-emerald-400' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${b.occupancyPct}%` }}
                    />
                  </div>
                </div>

                {/* Telemetry row */}
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Power Draw</span>
                  <span className={`font-bold ${isAnomaly ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {b.currentDemandKw} kW
                  </span>
                </div>

                {/* Energy Per Person sub-row */}
                <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Energy / Cap</span>
                  <span className="text-slate-300">{energyPerPerson} kW</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
