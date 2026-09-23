import React, { useState, useMemo } from 'react';

interface ChartPoint {
  date: string;
  value: number;
}

interface SimpleLineChartProps {
  currentValue?: number;
  initialValue?: number;
  height?: number;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  currentValue = 13284.50,
  initialValue = 12500.00,
  height = 240,
}) => {
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('6M');
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);

  // Generate realistic dataset corresponding to timeframe
  const data: ChartPoint[] = useMemo(() => {
    const pointsCount = timeframe === '1M' ? 15 : timeframe === '3M' ? 24 : timeframe === '6M' ? 30 : timeframe === '1Y' ? 36 : 48;
    const result: ChartPoint[] = [];
    const base = initialValue;
    const target = currentValue;
    const diff = target - base;

    const startDate = new Date();
    const daysBack = timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : timeframe === '6M' ? 180 : timeframe === '1Y' ? 365 : 600;
    startDate.setDate(startDate.getDate() - daysBack);

    for (let i = 0; i < pointsCount; i++) {
      const progress = i / (pointsCount - 1);
      // add realistic market variation / slight micro-swings
      const sineWave = Math.sin(progress * Math.PI * 3.5) * (diff * 0.08);
      const val = base + (diff * progress) + sineWave;
      const pointDate = new Date(startDate.getTime() + (progress * daysBack * 86400000));
      
      result.push({
        date: pointDate.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: timeframe === 'ALL' ? '2-digit' : undefined }),
        value: i === pointsCount - 1 ? target : Math.round(val * 100) / 100,
      });
    }

    return result;
  }, [timeframe, currentValue, initialValue]);

  const minVal = useMemo(() => Math.min(...data.map((d) => d.value)) * 0.985, [data]);
  const maxVal = useMemo(() => Math.max(...data.map((d) => d.value)) * 1.015, [data]);
  const range = maxVal - minVal || 1;

  const width = 640;
  const paddingX = 20;
  const paddingY = 24;

  const pointsString = useMemo(() => {
    return data
      .map((d, i) => {
        const x = paddingX + (i / (data.length - 1)) * (width - 2 * paddingX);
        const y = height - paddingY - ((d.value - minVal) / range) * (height - 2 * paddingY);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [data, minVal, range, height, width, paddingX, paddingY]);

  const areaString = useMemo(() => {
    if (!pointsString) return '';
    const firstX = paddingX;
    const lastX = width - paddingX;
    const bottomY = height - paddingY;
    return `${firstX},${bottomY} ${pointsString} ${lastX},${bottomY}`;
  }, [pointsString, height, paddingX, paddingY, width]);

  return (
    <div className="w-full">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Valuation Trajectory
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              GH₵{hoveredPoint ? hoveredPoint.value.toLocaleString(undefined, { minimumFractionDigits: 2 }) : currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {hoveredPoint ? `Recorded on ${hoveredPoint.date}` : `Latest NAV Update`}
            </span>
          </div>
        </div>

        {/* Timeframe selector tabs */}
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/80">
          {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => {
                setTimeframe(tf);
                setHoveredPoint(null);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                timeframe === tf
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full overflow-visible"
          style={{ height: `${height}px` }}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="#f1f5f9"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height / 2}
            x2={width - paddingX}
            y2={height / 2}
            stroke="#f1f5f9"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#e2e8f0"
          />

          {/* Area fill */}
          <polygon points={areaString} fill="url(#chartGradient)" />

          {/* Line stroke */}
          <polyline
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsString}
          />

          {/* Interactive hover points */}
          {data.map((d, i) => {
            const x = paddingX + (i / (data.length - 1)) * (width - 2 * paddingX);
            const y = height - paddingY - ((d.value - minVal) / range) * (height - 2 * paddingY);
            const isHovered = hoveredPoint && hoveredPoint.date === d.date;

            return (
              <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(d)}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 3}
                  className={`transition-all ${
                    isHovered
                      ? 'fill-emerald-600 stroke-white stroke-2'
                      : 'fill-transparent hover:fill-emerald-500'
                  }`}
                />
                {/* Invisible hit target */}
                <rect
                  x={x - 8}
                  y={0}
                  width={16}
                  height={height}
                  fill="transparent"
                />
              </g>
            );
          })}
        </svg>

        {/* Date stamps along horizontal axis */}
        <div className="flex justify-between items-center px-4 mt-2 text-[11px] font-mono text-slate-500">
          <span>{data[0]?.date}</span>
          <span>{data[Math.floor(data.length / 2)]?.date}</span>
          <span>{data[data.length - 1]?.date}</span>
        </div>
      </div>
    </div>
  );
};
