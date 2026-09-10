import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FACILITY_SOLAR_PROFILES } from '../../data/campusData';
import { SolarTelemetry } from '../../types';

export interface SolarGenerationChartProps {
  facilityCode?: string;
  customData?: SolarTelemetry[];
  showLegend?: boolean;
}

export const SolarGenerationChart: React.FC<SolarGenerationChartProps> = ({
  facilityCode = 'ACAD',
  customData,
  showLegend = true
}) => {
  // Dynamically resolve facility profile and hourly curve based on selected facility
  const profile = FACILITY_SOLAR_PROFILES[facilityCode] || FACILITY_SOLAR_PROFILES['ACAD'];
  const chartData = customData || profile.hourly;

  return (
    <div className="w-full h-full flex flex-col justify-between" data-testid={`solar-chart-${facilityCode.toLowerCase()}`}>
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" kW" domain={[0, 'auto']} />

            <Tooltip
              contentStyle={{
                backgroundColor: '#091510',
                border: '1px solid rgba(250, 204, 21, 0.3)',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
              }}
              formatter={(value: any, name: string) => [
                `${Number(value).toFixed(1)} kW`,
                name === 'generationKw' ? `${profile.facilityCode} Solar Output` : '7-Day Benchmark'
              ]}
              labelFormatter={(label: string) => `${profile.facilityName} (${profile.facilityCode}) • ${label}`}
            />

            <Area
              key={`solar-${facilityCode}`}
              type="monotone"
              dataKey="generationKw"
              name="generationKw"
              stroke="#facc15"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorSolar)"
              animationDuration={600}
              animationEasing="ease-out"
              isAnimationActive={true}
            />
            <Area
              key={`hist-${facilityCode}`}
              type="monotone"
              dataKey="historicalAvgKw"
              name="historicalAvgKw"
              stroke="#34d399"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorHistorical)"
              animationDuration={600}
              animationEasing="ease-out"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {showLegend && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-emerald-500/10 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-slate-300">Today's Generation</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-dashed" />
              <span className="text-slate-300">Historical Avg</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
            <span className="text-slate-400">
              Peak: <strong className="text-amber-300 font-semibold">{profile.peakKw} kW</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              Day Total: <strong className="text-white font-semibold">{profile.todayGeneratedKwh} kWh</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-medium">
              +{profile.benchmarkDiffPct}% vs 7-day Avg
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
