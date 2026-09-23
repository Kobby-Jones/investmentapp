import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-lg text-xs transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-emerald-950 border-emerald-800 text-emerald-100'
                : toast.type === 'error'
                ? 'bg-rose-950 border-rose-800 text-rose-100'
                : toast.type === 'warning'
                ? 'bg-amber-950 border-amber-800 text-amber-100'
                : 'bg-slate-900 border-slate-800 text-slate-100'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400" />}
            </div>

            <div className="flex-1 font-medium leading-relaxed">{toast.message}</div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
