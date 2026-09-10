import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { useEcoFlux } from '../../lib/dataStore';
import { todayData, weekData, monthData } from '../../data/campusData';
import { BuildingDemandDistribution } from '../../types';

export type TimeFilterPeriod = 'today' | 'week' | 'month';

interface BuildingComparisonChartProps {
  initialRange?: TimeFilterPeriod;
  selectedRange?: TimeFilterPeriod;
  onRangeChange?: (range: TimeFilterPeriod) => void;
  showFilterControls?: boolean;
}

export const BuildingComparisonChart: React.FC<BuildingComparisonChartProps> = ({
  initialRange = 'today',
  selectedRange,
  onRangeChange,
  showFilterControls = true
}) => {
  const { buildings } = useEcoFlux();
  const [internalRange, setInternalRange] = useState<TimeFilterPeriod>(initialRange);

  // Use controlled selectedRange if provided by parent, otherwise use internal state
  const timeRange = selectedRange !== undefined ? selectedRange : internalRange;

  const handleRangeChange = (range: TimeFilterPeriod) => {
    setInternalRange(range);
    onRangeChange?.(range);
  };

  // Dynamically resolve dataset based on selected period: TODAY, WEEK, or MONTH
  const currentData: BuildingDemandDistribution[] = useMemo(() => {
    switch (timeRange) {
      case 'today':
        // If live buildings exist in store, use real-time demand, otherwise fallback to todayData
        if (buildings && buildings.length > 0) {
          return buildings.map(b => ({
            name: b.code,
            fullName: b.name,
            demand: b.currentDemandKw,
            solar: b.solarInstalledKw,
            occupancy: b.occupancyPct,
            status: b.status
          }));
        }
        return todayData;
      case 'week':
        return weekData;
      case 'month':
        return monthData;
      default:
        return todayData;
    }
  }, [timeRange, buildings]);

  // Aggregate statistics for the active dataset
  const totalKw = useMemo(() => currentData.reduce((sum, item) => sum + item.demand, 0), [currentData]);
  const avgKw = useMemo(() => (currentData.length ? (totalKw / currentData.length).toFixed(1) : '0.0'), [currentData, totalKw]);
  const peakItem = useMemo(() => {
    if (!currentData.length) return { name: '-', demand: 0 };
    return currentData.reduce((prev, curr) => (curr.demand > prev.demand ? curr : prev), currentData[0]);
  }, [currentData]);

  return (
    <div className="w-full h-full flex flex-col justify-between" data-testid="building-load-distribution-card">
      {/* Time Filters Toolbar */}
      {showFilterControls && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              {timeRange === 'today' ? "Today's Load" : timeRange === 'week' ? "7-Day Average" : "30-Day Average"}
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              {timeRange === 'today'
                ? "• Real-time campus telemetry (kW)"
                : timeRange === 'week'
                ? "• 7-day rolling aggregated average (kW)"
                : "• 30-day baseline aggregated average (kW)"}
            </span>
          </div>

          {/* TODAY / WEEK / MONTH Buttons */}
          <div
            className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-emerald-500/20"
            role="tablist"
            aria-label="Time period selection"
          >
            {(['today', 'week', 'month'] as const).map((r) => {
              const isActive = timeRange === r;
              return (
                <button
                  key={r}
                  id={`btn-load-filter-${r}`}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleRangeChange(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-black font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-emerald-500/15'
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic Bar Chart with auto-adjusting Y-axis and smooth period transition */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={currentData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.08)" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              unit=" kW"
              domain={[0, 'auto']}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#091510',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
              }}
              formatter={(value: any) => [
                `${Number(value).toFixed(1)} kW`,
                timeRange === 'today' ? "Current Demand" : timeRange === 'week' ? "7-Day Avg Demand" : "30-Day Avg Demand"
              ]}
              labelFormatter={(label: string) => {
                const item = currentData.find(d => d.name === label);
                return item ? `${item.fullName} (${label})` : label;
              }}
            />

            <Bar
              key={timeRange}
              dataKey="demand"
              radius={[6, 6, 0, 0]}
              animationDuration={600}
              animationEasing="ease-out"
              isAnimationActive={true}
            >
              {currentData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}-${index}`}
                  fill={
                    entry.status === 'warning'
                      ? '#f43f5e'
                      : entry.demand > 115
                      ? '#10b981'
                      : entry.demand > 60
                      ? '#34d399'
                      : '#6ee7b7'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Dynamic Summary & Legend Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-emerald-500/10 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Heavy (&gt;115 kW)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
            <span>Moderate</span>
          </span>
          {currentData.some(d => d.status === 'warning') && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span>HVAC Alert</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 font-mono text-[11px]">
          <span className="text-slate-400">
            Avg: <span className="text-white font-semibold">{avgKw} kW</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-medium">
            Peak: {peakItem.name} ({peakItem.demand} kW)
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-400 font-medium">
            Total: {totalKw.toFixed(1)} kW
          </span>
        </div>
      </div>
    </div>
  );
};
