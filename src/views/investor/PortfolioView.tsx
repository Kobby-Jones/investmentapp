import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PortfolioHolding } from '../../types';
import { MetricCard } from '../../components/common/MetricCard';
import { SimpleLineChart } from '../../components/common/SimpleLineChart';
import { DonutChart } from '../../components/common/DonutChart';
import {
  Briefcase,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ExternalLink,
  Info,
  X,
  Clock,
  Plus
} from 'lucide-react';

export const PortfolioView: React.FC = () => {
  const {
    totalPortfolioValue,
    totalInvested,
    totalReturn,
    totalReturnPercent,
    holdings,
    setInvestorPage,
    setSelectedProductId,
    activeHoldingDetail,
    setActiveHoldingDetail,
    user,
  } = useApp();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const filteredHoldings = holdings.filter((h) => {
    if (selectedCategoryFilter === 'all') return true;
    return h.category === selectedCategoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Portfolio Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive position ledger, capital gains, unit valuations, and sector allocation.
          </p>
        </div>

        <button
          onClick={() => setInvestorPage('marketplace')}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Position</span>
        </button>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Portfolio Value"
          value={`GH₵${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue={`Cash: GH₵${user.availableCashBalance.toFixed(2)}`}
          changePercent={totalReturnPercent}
          changeLabel="Mark-to-market NAV"
          isPositive={totalReturn >= 0}
          icon={<Briefcase className="w-4 h-4" />}
          variant="highlight"
        />

        <MetricCard
          label="Total Invested"
          value={`GH₵${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue={`${holdings.length} Subscribed Funds`}
          changeLabel="Principal basis"
          icon={<Wallet className="w-4 h-4" />}
        />

        <MetricCard
          label="Cumulative Gains/Losses"
          value={`${totalReturn >= 0 ? '+' : ''}GH₵${totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue="Unrealized net gains"
          changePercent={totalReturnPercent}
          changeLabel="Portfolio yield"
          isPositive={totalReturn >= 0}
          icon={<TrendingUp className="w-4 h-4" />}
        />

        <MetricCard
          label="Return Percentage"
          value={`${totalReturnPercent >= 0 ? '+' : ''}${totalReturnPercent.toFixed(2)}%`}
          subValue="Overall time-weighted"
          changePercent={totalReturnPercent}
          changeLabel="Total return rate"
          isPositive={totalReturnPercent >= 0}
          icon={<ArrowUpRight className="w-4 h-4" />}
        />
      </div>

      {/* Chart & Allocation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <SimpleLineChart
            currentValue={totalPortfolioValue}
            initialValue={totalInvested > 0 ? totalInvested : 12500}
            height={220}
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Asset Class Allocation
              </span>
              <span className="text-xs font-mono text-emerald-700">
                {holdings.length} Active Funds
              </span>
            </div>
            <DonutChart totalValue={totalPortfolioValue} size={180} thickness={24} />
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Valuations simulated daily using institutional pricing benchmark.
          </div>
        </div>
      </div>

      {/* Holdings Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Portfolio Holdings Ledger
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click on any row to inspect underlying positions and historical transaction audits.
            </p>
          </div>

          {/* Category filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            {[
              { id: 'all', label: 'All Holdings' },
              { id: 'money_market', label: 'Money Market' },
              { id: 'fixed_income', label: 'Fixed Income' },
              { id: 'balanced', label: 'Balanced' },
              { id: 'equity', label: 'Equity' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategoryFilter(tab.id)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedCategoryFilter === tab.id
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredHoldings.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No Holdings in this Category</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You do not have any active positions matching this filter. Explore the marketplace to allocate funds.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Asset / Fund</th>
                  <th className="py-3 px-4 text-right">Units</th>
                  <th className="py-3 px-4 text-right">Avg Cost</th>
                  <th className="py-3 px-4 text-right">Total Cost</th>
                  <th className="py-3 px-4 text-right">Current Value</th>
                  <th className="py-3 px-4 text-right">Gain / Loss</th>
                  <th className="py-3 px-4 text-right">Allocation</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredHoldings.map((holding) => {
                  const isPositive = holding.gainLoss >= 0;
                  const allocPercent = totalPortfolioValue > 0 ? (holding.currentValue / totalPortfolioValue) * 100 : 0;

                  return (
                    <tr
                      key={holding.id}
                      onClick={() => setActiveHoldingDetail(holding)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <div>
                            <div>{holding.productName}</div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Purchased: {holding.purchaseDate}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                        {holding.units.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-600">
                        GH₵{holding.averageCost.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                        GH₵{holding.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                        GH₵{holding.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold tabular-nums">
                        <span className={isPositive ? 'text-emerald-600' : 'text-rose-600'}>
                          {isPositive ? '+' : ''}
                          {holding.gainLossPercent.toFixed(2)}% <br />
                          <span className="text-[10px] font-normal">
                            ({isPositive ? '+' : ''}GH₵{holding.gainLoss.toFixed(2)})
                          </span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold tabular-nums text-slate-700">
                        {allocPercent.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveHoldingDetail(holding);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Individual Holding Inspection Modal */}
      {activeHoldingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setActiveHoldingDetail(null)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                  Holding Details
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {activeHoldingDetail.productName}
                </h3>
              </div>
              <button
                onClick={() => setActiveHoldingDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Total Units</div>
                  <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                    {activeHoldingDetail.units.toLocaleString()} Units
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Average Unit Cost</div>
                  <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                    GH₵{activeHoldingDetail.averageCost.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Total Cost Basis</div>
                  <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                    GH₵{activeHoldingDetail.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Current Market Valuation</div>
                  <div className="text-base font-bold font-mono text-emerald-600 mt-0.5">
                    GH₵{activeHoldingDetail.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Unrealized Capital Gain:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    +GH₵{activeHoldingDetail.gainLoss.toFixed(2)} ({activeHoldingDetail.gainLossPercent.toFixed(2)}%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Initial Subscription Date:</span>
                  <span className="font-mono text-slate-800">{activeHoldingDetail.purchaseDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Last Valuation Benchmark:</span>
                  <span className="font-mono text-slate-800">{activeHoldingDetail.lastValuationDate}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedProductId(activeHoldingDetail.productId);
                  setActiveHoldingDetail(null);
                  setInvestorPage('product-details');
                }}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors"
              >
                View Fund Strategy
              </button>
              <button
                onClick={() => setActiveHoldingDetail(null)}
                className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
