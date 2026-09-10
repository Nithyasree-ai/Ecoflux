import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const RenewableMixDonut: React.FC = () => {
  const data = [
    { name: 'Solar PV Direct', value: 61, color: '#10b981' },
    { name: 'BESS Battery Discharge', value: 17, color: '#38bdf8' },
    { name: 'Utility Grid Backup', value: 22, color: '#475569' }
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-between">
      <div className="relative w-full h-56 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: '#091510',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px'
              }}
              formatter={(val: any) => [`${val}%`, 'Contribution']}
            />
            <Pie
              data={data}
              innerRadius={65}
              outerRadius={88}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-extrabold font-mono text-white tracking-tight">78%</span>
          <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Clean Energy</span>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full pt-3 border-t border-emerald-500/10 grid grid-cols-3 gap-2 text-center text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[11px] truncate max-w-[80px]">{item.name.split(' ')[0]}</span>
            </div>
            <span className="font-mono font-bold text-white mt-0.5">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
