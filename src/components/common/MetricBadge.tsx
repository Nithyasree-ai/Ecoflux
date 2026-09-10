import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricBadgeProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number; // e.g., +12 or -5
  changeLabel?: string;
  icon?: LucideIcon;
  variant?: 'emerald' | 'cyan' | 'lime' | 'amber' | 'rose';
  subtext?: string;
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({
  label,
  value,
  unit,
  change,
  changeLabel = 'vs yesterday',
  icon: Icon,
  variant = 'emerald',
  subtext
}) => {
  const variantStyles = {
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'group-hover:border-emerald-500/40',
      changePositive: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      changeNegative: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      text: 'text-cyan-400',
      glow: 'group-hover:border-cyan-500/40',
      changePositive: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      changeNegative: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    },
    lime: {
      bg: 'bg-lime-500/10',
      border: 'border-lime-500/20',
      text: 'text-lime-400',
      glow: 'group-hover:border-lime-500/40',
      changePositive: 'text-lime-400 bg-lime-500/10 border-lime-500/20',
      changeNegative: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      glow: 'group-hover:border-amber-500/40',
      changePositive: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      changeNegative: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-400',
      glow: 'group-hover:border-rose-500/40',
      changePositive: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      changeNegative: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    }
  }[variant];

  const isPositive = change !== undefined && change >= 0;

  return (
    <div className={`p-5 rounded-2xl bg-[#0a1410]/80 border border-emerald-500/15 backdrop-blur-md transition-all duration-300 ${variantStyles.glow}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className={`p-2 rounded-xl ${variantStyles.bg} ${variantStyles.border} border ${variantStyles.text}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-sans">{value}</span>
        {unit && <span className="text-sm font-semibold text-slate-400">{unit}</span>}
      </div>

      {(change !== undefined || subtext) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs">
          {change !== undefined && (
            <span
              className={`px-1.5 py-0.5 rounded-md font-medium border ${
                isPositive ? variantStyles.changePositive : variantStyles.changeNegative
              }`}
            >
              {isPositive ? '+' : ''}{change}%
            </span>
          )}
          <span className="text-slate-400 truncate">{subtext || changeLabel}</span>
        </div>
      )}
    </div>
  );
};
