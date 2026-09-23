import React from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../../components/common/MetricCard';
import { SimpleLineChart } from '../../components/common/SimpleLineChart';
import { DonutChart } from '../../components/common/DonutChart';
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Briefcase,
  Compass,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus
} from 'lucide-react';

export const InvestorDashboard: React.FC = () => {
  const {
    totalPortfolioValue,
    totalInvested,
    totalReturn,
    totalReturnPercent,
    holdings,
    transactions,
    user,
    setInvestorPage,
    setSelectedProductId,
    setActiveHoldingDetail,
  } = useApp();

  const activeHoldings = holdings;
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Portfolio Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Welcome back, {user.fullName}. Here is your simulated portfolio valuation and performance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setInvestorPage('deposits')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Deposit Cash</span>
          </button>
          <button
            onClick={() => setInvestorPage('marketplace')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-slate-500" />
            <span>Marketplace</span>
          </button>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Portfolio Value"
          value={`GH₵${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue={`Cash: GH₵${user.availableCashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          changePercent={totalReturnPercent}
          changeLabel="Total cumulative gain"
          isPositive={totalReturn >= 0}
          icon={<Briefcase className="w-4 h-4" />}
          variant="highlight"
          tooltip="Sum of all currently active fund valuations based on latest Net Asset Value (NAV)."
        />

        <MetricCard
          label="Total Invested"
          value={`GH₵${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue={`${holdings.length} Active Positions`}
          changeLabel="Principal allocation"
          icon={<Wallet className="w-4 h-4" />}
          tooltip="Net cash principal invested across all active portfolio positions."
        />

        <MetricCard
          label="Total Return"
          value={`${totalReturn >= 0 ? '+' : ''}GH₵${totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue="Unrealized + Dividends"
          changePercent={totalReturnPercent}
          changeLabel="Gain relative to cost"
          isPositive={totalReturn >= 0}
          icon={<TrendingUp className="w-4 h-4" />}
          tooltip="Absolute difference between current portfolio market value and total invested cost."
        />

        <MetricCard
          label="Return %"
          value={`${totalReturnPercent >= 0 ? '+' : ''}${totalReturnPercent.toFixed(2)}%`}
          subValue="Annualized: +8.4%"
          changePercent={totalReturnPercent}
          changeLabel="Time-weighted"
          isPositive={totalReturnPercent >= 0}
          icon={<ArrowUpRight className="w-4 h-4" />}
          tooltip="Percentage return on invested capital across portfolio duration."
        />
      </div>

      {/* Charts Section: Line Chart & Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Performance Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <SimpleLineChart
            currentValue={totalPortfolioValue}
            initialValue={totalInvested > 0 ? totalInvested : 12500}
            height={220}
          />
        </div>

        {/* Asset Allocation Donut Chart (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Asset Allocation
              </span>
              <span className="text-xs text-emerald-700 font-mono font-medium">
                Diversified
              </span>
            </div>
            <DonutChart totalValue={totalPortfolioValue} size={180} thickness={24} />
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Target weighting rebalanced quarterly</span>
            <button
              onClick={() => setInvestorPage('portfolio')}
              className="font-medium text-emerald-700 hover:underline"
            >
              Details &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Active Investments Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Active Investments
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Current holdings and performance based on daily mark-to-market valuation
            </p>
          </div>

          <button
            onClick={() => setInvestorPage('portfolio')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            View Full Portfolio &rarr;
          </button>
        </div>

        {activeHoldings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No Active Investments</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You do not have any active investment positions yet. Explore our curated marketplace to subscribe to your first fund.
            </p>
            <button
              onClick={() => setInvestorPage('marketplace')}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4 text-right">Amount Invested</th>
                  <th className="py-3 px-4 text-right">Current Value</th>
                  <th className="py-3 px-4 text-right">Return</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {activeHoldings.map((h) => {
                  const isPositive = h.gainLoss >= 0;
                  return (
                    <tr
                      key={h.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => setActiveHoldingDetail(h)}
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <div>
                          <div>{h.productName}</div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Purchased {h.purchaseDate}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                        GH₵{h.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                        GH₵{h.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums">
                        <span className={isPositive ? 'text-emerald-600' : 'text-rose-600'}>
                          {isPositive ? '+' : ''}
                          {h.gainLossPercent.toFixed(1)}% (GH₵{h.gainLoss.toFixed(2)})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProductId(h.productId);
                            setInvestorPage('product-details');
                          }}
                          className="text-xs font-semibold text-slate-600 hover:text-emerald-700 underline"
                        >
                          View
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

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Recent Transactions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ledger of deposits, investment subscriptions, dividends, and withdrawals
            </p>
          </div>

          <button
            onClick={() => setInvestorPage('transactions')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            All Transactions &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Transaction</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {recentTransactions.map((tx) => {
                const isCredit = tx.type === 'deposit' || tx.type === 'dividend';
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {tx.date}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{tx.title}</div>
                      <div className="text-[11px] text-slate-500">{tx.description}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      {tx.reference}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                      <span className={isCredit ? 'text-emerald-600' : 'text-slate-900'}>
                        {isCredit ? '+' : '-'}GH₵{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          tx.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : tx.status === 'Processing' || tx.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
