import React, { ReactNode } from 'react';

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'emerald' | 'cyan' | 'lime' | 'amber' | 'rose' | 'none';
  onClick?: () => void;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className = '',
  glowColor = 'emerald',
  onClick,
  title,
  subtitle,
  action,
  icon
}) => {
  const glowBorderClass = {
    emerald: 'hover:border-emerald-500/40 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.25)]',
    cyan: 'hover:border-cyan-500/40 hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.25)]',
    lime: 'hover:border-lime-500/40 hover:shadow-[0_0_25px_-5px_rgba(74,222,128,0.25)]',
    amber: 'hover:border-amber-500/40 hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.25)]',
    rose: 'hover:border-rose-500/40 hover:shadow-[0_0_25px_-5px_rgba(244,63,94,0.25)]',
    none: ''
  }[glowColor];

  return (
    <div
      onClick={onClick}
      className={`relative group bg-[#0a1410]/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl p-5 md:p-6 transition-all duration-300 ${glowBorderClass} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Subtle top reflection line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent pointer-events-none" />

      {(title || icon || action) && (
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-500/10">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                {icon}
              </div>
            )}
            <div>
              {title && <h3 className="font-semibold text-slate-100 text-sm md:text-base tracking-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      {children}
    </div>
  );
};
