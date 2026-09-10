import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { useEcoFlux } from '../../lib/dataStore';

export const OccupancyEnergyChart: React.FC = () => {
  const { buildings } = useEcoFlux();

  const data = buildings.map(b => ({
    name: b.name,
    code: b.code,
    occupancy: b.occupancyPct,
    energy: b.currentDemandKw,
    status: b.status,
    headcount: b.currentOccupancy
  }));

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.08)" />
            <XAxis
              type="number"
              dataKey="occupancy"
              name="Occupancy"
              unit="%"
              stroke="#64748b"
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="energy"
              name="Demand"
              unit=" kW"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <ZAxis range={[120, 260]} />

            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ payload }) => {
                if (payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-[#091510] border border-emerald-500/30 p-3 rounded-xl shadow-xl text-xs space-y-1">
                      <div className="font-bold text-white flex items-center justify-between gap-3">
                        <span>{d.name}</span>
                        <span className="font-mono text-emerald-400">{d.code}</span>
                      </div>
                      <div className="text-slate-300">Occupancy: <span className="text-white font-mono">{d.occupancy}%</span> ({d.headcount} ppl)</div>
                      <div className="text-slate-300">Electricity Load: <span className="text-emerald-400 font-mono">{d.energy} kW</span></div>
                      {d.status === 'warning' && (
                        <div className="text-rose-400 text-[10px] font-semibold pt-1 border-t border-rose-500/20">
                          ⚠️ Anomaly: High kW during low occupancy
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            <Scatter name="Buildings" data={data}>
              {data.map((entry, index) => (
                <Cell
                  key={`scatter-cell-${index}`}
                  fill={entry.status === 'warning' ? '#f43f5e' : entry.occupancy > 70 ? '#10b981' : '#38bdf8'}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-emerald-500/10 text-xs text-slate-400">
        <span className="text-slate-400">Normal correlation: Upper-right quadrant</span>
        <span className="text-rose-400 font-mono">1 Anomaly flagged (HOST-A)</span>
      </div>
    </div>
  );
};
