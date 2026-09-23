import React, { useState } from 'react';

// Bar Chart (e.g. Investment Volume or Monthly Revenue)
interface BarItem {
  label: string;
  value: number;
  secondaryValue?: number;
}

interface VolumeBarChartProps {
  data?: BarItem[];
  prefix?: string;
  height?: number;
}

const DEFAULT_VOLUME_DATA: BarItem[] = [
  { label: 'Apr', value: 1240000 },
  { label: 'May', value: 1580000 },
  { label: 'Jun', value: 1820000 },
  { label: 'Jul', value: 2190000 },
  { label: 'Aug', value: 2450000 },
  { label: 'Sep', value: 2980000 },
];

export const VolumeBarChart: React.FC<VolumeBarChartProps> = ({
  data = DEFAULT_VOLUME_DATA,
  prefix = 'GH₵',
  height = 180,
}) => {
  const [hovered, setHovered] = useState<BarItem | null>(null);
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15;

  return (
    <div className="w-full">
      <div className="h-6 flex items-center justify-between text-xs text-slate-500 mb-2">
        <span>Monthly Allocation Volume</span>
        {hovered ? (
          <span className="font-mono font-semibold text-slate-900">
            {hovered.label}: {prefix}{(hovered.value / 1000000).toFixed(2)}M
          </span>
        ) : (
          <span className="font-mono text-slate-400">Hover bar for details</span>
        )}
      </div>

      <div className="flex items-end gap-3 w-full" style={{ height: `${height}px` }}>
        {data.map((item) => {
          const heightPercent = (item.value / maxVal) * 100;
          const isHov = hovered?.label === item.label;

          return (
            <div
              key={item.label}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              onMouseEnter={() => setHovered(item)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className={`w-full max-w-[42px] rounded-t-sm transition-all duration-200 ${
                  isHov ? 'bg-emerald-600 shadow-md' : 'bg-slate-800 hover:bg-slate-700'
                }`}
                style={{ height: `${heightPercent}%` }}
              />
              <span className="text-[11px] font-mono text-slate-500 mt-2">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Comparison Chart: Deposits vs Withdrawals
interface ComparisonItem {
  month: string;
  deposits: number;
  withdrawals: number;
}

const DEFAULT_COMPARISON_DATA: ComparisonItem[] = [
  { month: 'May', deposits: 420000, withdrawals: 110000 },
  { month: 'Jun', deposits: 510000, withdrawals: 145000 },
  { month: 'Jul', deposits: 630000, withdrawals: 180000 },
  { month: 'Aug', deposits: 710000, withdrawals: 195000 },
  { month: 'Sep', deposits: 890000, withdrawals: 215000 },
];

export const DepositsVsWithdrawalsChart: React.FC<{ data?: ComparisonItem[] }> = ({
  data = DEFAULT_COMPARISON_DATA,
}) => {
  const maxVal = Math.max(...data.map((d) => Math.max(d.deposits, d.withdrawals))) * 1.2;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-600 rounded-xs" />
            <span className="text-slate-600">Deposits (Inflows)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-xs" />
            <span className="text-slate-600">Withdrawals (Outflows)</span>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-4 h-44 w-full pt-4 border-b border-slate-200">
        {data.map((item) => {
          const depHeight = (item.deposits / maxVal) * 100;
          const wthHeight = (item.withdrawals / maxVal) * 100;

          return (
            <div key={item.month} className="flex-1 flex flex-col items-center h-full justify-end">
              <div className="flex items-end gap-1.5 w-full justify-center h-full">
                <div
                  title={`Deposits: GH₵${item.deposits.toLocaleString()}`}
                  className="w-4 sm:w-6 bg-emerald-600 rounded-t-sm hover:opacity-90 transition-opacity"
                  style={{ height: `${depHeight}%` }}
                />
                <div
                  title={`Withdrawals: GH₵${item.withdrawals.toLocaleString()}`}
                  className="w-4 sm:w-6 bg-rose-500 rounded-t-sm hover:opacity-90 transition-opacity"
                  style={{ height: `${wthHeight}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-slate-500 mt-2">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
