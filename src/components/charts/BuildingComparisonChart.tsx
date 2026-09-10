import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { useEcoFlux } from '../../lib/dataStore';

export const BuildingComparisonChart: React.FC = () => {
  const { buildings } = useEcoFlux();

  const data = buildings.map(b => ({
    name: b.code,
    fullName: b.name,
    demand: b.currentDemandKw,
    solar: b.solarInstalledKw,
    occupancy: b.occupancyPct,
    status: b.status
  }));

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.08)" />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" kW" />

            <Tooltip
              contentStyle={{
                backgroundColor: '#091510',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px'
              }}
              formatter={(value: any, name: string) => [
                `${value} kW`,
                name === 'demand' ? 'Current Demand' : 'Solar Installed'
              ]}
            />

            <Bar dataKey="demand" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.status === 'warning' ? '#f43f5e' : entry.demand > 100 ? '#10b981' : '#34d399'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-emerald-500/10 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Optimal</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Anomaly / Warning</span>
          </span>
        </div>
        <span className="text-slate-400">8 Buildings Active</span>
      </div>
    </div>
  );
};
