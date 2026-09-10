import React, { useState } from 'react';
import { AreaChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { getForecastData } from '../../data/aiEngine';

export const ForecastChart: React.FC = () => {
  const [range, setRange] = useState<'24h' | '7d' | '30d'>('24h');
  const data = getForecastData(range);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-400 font-medium">EcoFlux ML Model v2.4 (XGBoost + LSTM)</span>
        <div className="flex items-center gap-1.5">
          {(['24h', '7d', '30d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                range === r
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-emerald-500/10 text-slate-300 hover:text-white hover:bg-emerald-500/20'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.08)" />
            <XAxis dataKey="timeLabel" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" kW" />

            <Tooltip
              contentStyle={{
                backgroundColor: '#091510',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px'
              }}
            />

            {/* Confidence Interval band */}
            <Area
              type="monotone"
              dataKey="confidenceHigh"
              stroke="transparent"
              fill="url(#confidenceBand)"
              name="Confidence Range (±6%)"
            />

            {/* Predicted Demand */}
            <Line
              type="monotone"
              dataKey="predictedDemandKw"
              stroke="#38bdf8"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#38bdf8' }}
              name="Predicted Demand"
            />

            {/* Actual Demand (where available) */}
            <Line
              type="monotone"
              dataKey="actualDemandKw"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#10b981' }}
              name="Actual Demand"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-emerald-500/10 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Actual Telemetry</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span>AI Prediction</span>
          </span>
        </div>
        <span className="text-sky-400 font-mono font-medium">96.8% Accuracy R²</span>
      </div>
    </div>
  );
};
