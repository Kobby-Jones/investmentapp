import React from 'react';
import { TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  changePercent?: number;
  changeLabel?: string;
  isPositive?: boolean;
  tooltip?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'highlight' | 'subtle';
  demoNotice?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  changePercent,
  changeLabel,
  isPositive,
  tooltip,
  icon,
  variant = 'default',
  demoNotice = true,
}) => {
  const isUp = isPositive !== undefined ? isPositive : (changePercent !== undefined && changePercent >= 0);

  return (
    <div
      className={`relative rounded-xl border p-5 transition-all duration-200 ${
        variant === 'highlight'
          ? 'bg-slate-900 text-white border-slate-800 shadow-md'
          : variant === 'subtle'
          ? 'bg-slate-50/80 border-slate-200/80 text-slate-900'
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs font-semibold tracking-wider uppercase ${
              variant === 'highlight' ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {label}
          </span>
          {tooltip && (
            <div className="group relative flex items-center">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block w-48 p-2 bg-slate-900 text-slate-100 text-[11px] rounded shadow-lg z-20 pointer-events-none">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        {icon && (
          <div
            className={`p-1.5 rounded-lg ${
              variant === 'highlight' ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-1">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight font-mono tabular-nums">
          {value}
        </span>
      </div>

      {(subValue || changePercent !== undefined || changeLabel) && (
        <div className="flex items-center gap-2 mt-2.5 text-xs">
          {changePercent !== undefined && (
            <span
              className={`inline-flex items-center font-mono font-semibold tabular-nums ${
                isUp ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isUp ? (
                <TrendingUp className="w-3.5 h-3.5 mr-1 stroke-[2.5]" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 mr-1 stroke-[2.5]" />
              )}
              {isUp ? '+' : ''}
              {changePercent.toFixed(2)}%
            </span>
          )}

          {changeLabel && (
            <span className={variant === 'highlight' ? 'text-slate-400' : 'text-slate-500'}>
              {changeLabel}
            </span>
          )}

          {subValue && (
            <span
              className={`ml-auto font-mono tabular-nums ${
                variant === 'highlight' ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {subValue}
            </span>
          )}
        </div>
      )}

      {demoNotice && (
        <div
          className={`mt-3 pt-2 border-t text-[10px] tracking-tight ${
            variant === 'highlight'
              ? 'border-slate-800 text-slate-400'
              : 'border-slate-100 text-slate-400'
          }`}
        >
          Simulated demo valuation
        </div>
      )}
    </div>
  );
};
