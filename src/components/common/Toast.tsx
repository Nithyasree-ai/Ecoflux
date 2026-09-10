import React from 'react';
import { useEcoFlux } from '../../lib/dataStore';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useEcoFlux();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
          alert: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        };

        const borderStyles = {
          success: 'border-emerald-500/30 bg-[#091712]/95 shadow-[0_10px_30px_rgba(16,185,129,0.2)]',
          alert: 'border-rose-500/30 bg-[#17090b]/95 shadow-[0_10px_30px_rgba(244,63,94,0.2)]',
          warning: 'border-amber-500/30 bg-[#171409]/95 shadow-[0_10px_30px_rgba(245,158,11,0.2)]',
          info: 'border-cyan-500/30 bg-[#091417]/95 shadow-[0_10px_30px_rgba(6,182,212,0.2)]'
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl transition-all duration-300 transform translate-y-0 ${borderStyles}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white tracking-tight">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
