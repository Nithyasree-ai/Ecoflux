import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { HOURLY_TELEMETRY } from '../../data/campusData';

export const EnergyConsumptionChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  // Multi-range data simulation
  const data = timeRange === 'today'
    ? HOURLY_TELEMETRY
    : timeRange === 'week'
    ? [
        { timeLabel: 'Mon', totalDemandKw: 480, gridDrawKw: 240, solarContributionKw: 240 },
        { timeLabel: 'Tue', totalDemandKw: 512, gridDrawKw: 220, solarContributionKw: 292 },
        { timeLabel: 'Wed', totalDemandKw: 495, gridDrawKw: 180, solarContributionKw: 315 },
        { timeLabel: 'Thu', totalDemandKw: 530, gridDrawKw: 260, solarContributionKw: 270 },
        { timeLabel: 'Fri', totalDemandKw: 485, gridDrawKw: 200, solarContributionKw: 285 },
        { timeLabel: 'Sat', totalDemandKw: 320, gridDrawKw: 110, solarContributionKw: 210 },
        { timeLabel: 'Sun', totalDemandKw: 290, gridDrawKw: 90, solarContributionKw: 200 }
      ]
    : [
        { timeLabel: 'Wk 1', totalDemandKw: 490, gridDrawKw: 240, solarContributionKw: 250 },
        { timeLabel: 'Wk 2', totalDemandKw: 505, gridDrawKw: 225, solarContributionKw: 280 },
        { timeLabel: 'Wk 3', totalDemandKw: 480, gridDrawKw: 210, solarContributionKw: 270 },
        { timeLabel: 'Wk 4', totalDemandKw: 465, gridDrawKw: 185, solarContributionKw: 280 }
      ];

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Time Filters */}
      <div className="flex items-center justify-end gap-1.5 mb-3">
        {(['today', 'week', 'month'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setTimeRange(r)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              timeRange === r
                ? 'bg-emerald-500 text-black font-bold'
                : 'bg-emerald-500/10 text-slate-300 hover:text-white hover:bg-emerald-500/20'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.08)" />
            <XAxis dataKey="timeLabel" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" kW" />

            <Tooltip
              contentStyle={{
                backgroundColor: '#091510',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px'
              }}
            />

            <ReferenceLine y={500} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: 'Peak Cap 500kW', fill: '#f43f5e', fontSize: 10, position: 'top' }} />

            <Area
              type="monotone"
              dataKey="totalDemandKw"
              name="Total Campus Load"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorDemand)"
            />
            <Area
              type="monotone"
              dataKey="gridDrawKw"
              name="Grid Draw"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGrid)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Summary */}
      <div className="flex items-center justify-between pt-2 border-t border-emerald-500/10 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Total Demand</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Grid Draw</span>
          </span>
        </div>
        <span className="text-emerald-400 font-mono font-medium">Peak: 512 kW</span>
      </div>
    </div>
  );
};
