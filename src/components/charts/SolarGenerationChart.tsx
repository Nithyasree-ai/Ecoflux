import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { HOURLY_SOLAR } from '../../data/campusData';

export const SolarGenerationChart: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={HOURLY_SOLAR} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#facc15" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#facc15" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.08)" />
            <XAxis dataKey="timeLabel" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" kW" />

            <Tooltip
              contentStyle={{
                backgroundColor: '#091510',
                border: '1px solid rgba(250, 204, 21, 0.3)',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px'
              }}
            />

            <Area
              type="monotone"
              dataKey="generationKw"
              name="Today's Solar"
              stroke="#facc15"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorSolar)"
            />
            <Area
              type="monotone"
              dataKey="historicalAvgKw"
              name="7-Day Benchmark"
              stroke="#34d399"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorHistorical)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-emerald-500/10 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Today's Generation</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-dashed" />
            <span>Historical Avg</span>
          </span>
        </div>
        <span className="text-amber-400 font-mono font-medium">+14% vs 7-day Avg</span>
      </div>
    </div>
  );
};
