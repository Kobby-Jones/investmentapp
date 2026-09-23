import React, { useState } from 'react';

export interface DonutSlice {
  label: string;
  percentage: number;
  color: string;
  amount?: number;
}

interface DonutChartProps {
  slices?: DonutSlice[];
  totalValue?: number;
  size?: number;
  thickness?: number;
}

const DEFAULT_SLICES: DonutSlice[] = [
  { label: 'Money Market', percentage: 30, color: '#059669', amount: 3985.35 },
  { label: 'Fixed Income', percentage: 35, color: '#0284C7', amount: 4649.58 },
  { label: 'Balanced', percentage: 20, color: '#6366F1', amount: 2656.90 },
  { label: 'Equity', percentage: 15, color: '#F59E0B', amount: 1992.67 },
];

export const DonutChart: React.FC<DonutChartProps> = ({
  slices = DEFAULT_SLICES,
  totalValue = 13284.50,
  size = 200,
  thickness = 28,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const radius = size / 2;
  const innerRadius = radius - thickness;
  const circumference = 2 * Math.PI * ((radius + innerRadius) / 2);

  // Calculate SVG stroke dashes
  let accumulatedPercent = 0;
  const slicesWithOffsets = slices.map((slice) => {
    const strokeDasharray = `${(slice.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += slice.percentage;
    return {
      ...slice,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeSlice = hoveredIndex !== null ? slices[hoveredIndex] : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
      {/* SVG Circle */}
      <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Base track */}
          <circle
            cx={radius}
            cy={radius}
            r={(radius + innerRadius) / 2}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={thickness}
          />
          {slicesWithOffsets.map((slice, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <circle
                key={slice.label}
                cx={radius}
                cy={radius}
                r={(radius + innerRadius) / 2}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? thickness + 4 : thickness}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                strokeLinecap="butt"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
          {activeSlice ? (
            <>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-500 truncate max-w-[120px]">
                {activeSlice.label}
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                {activeSlice.percentage}%
              </span>
              {activeSlice.amount !== undefined && (
                <span className="text-[10px] font-mono text-slate-600 tabular-nums">
                  GH₵{activeSlice.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              )}
            </>
          ) : (
            <>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-500">
                Total AUM
              </span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                GH₵{totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">
                100% Allocated
              </span>
            </>
          )}
        </div>
      </div>

      {/* Clean Legend */}
      <div className="flex-1 w-full space-y-2">
        {slices.map((slice, i) => {
          const isHovered = hoveredIndex === i;
          return (
            <div
              key={slice.label}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer text-xs ${
                isHovered ? 'bg-slate-100 font-semibold' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-slate-700">{slice.label}</span>
              </div>
              <div className="flex items-center gap-3">
                {slice.amount !== undefined && (
                  <span className="text-slate-500 font-mono tabular-nums hidden sm:inline">
                    GH₵{slice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                )}
                <span className="font-mono font-bold text-slate-900 tabular-nums w-10 text-right">
                  {slice.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
