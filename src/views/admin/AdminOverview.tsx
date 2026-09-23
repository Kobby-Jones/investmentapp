import React from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../../components/common/MetricCard';
import { VolumeBarChart, DepositsVsWithdrawalsChart } from '../../components/common/AdminCharts';
import {
  Users,
  ShieldCheck,
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const {
    adminStats,
    kycQueue,
    withdrawalsQueue,
    auditLogs,
    setAdminPage,
  } = useApp();

  const pendingKyc = kycQueue.filter((k) => k.status === 'Pending' || k.status === 'Under Review');
  const pendingWth = withdrawalsQueue.filter((w) => w.status === 'Pending' || w.status === 'Under Review');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Executive Overview
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-emerald-400 font-bold">
              SYS-AUDIT LIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time fiduciary oversight, asset custody metrics, KYC workflow, and liquidity status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminPage('kyc')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Review KYC ({pendingKyc.length})</span>
          </button>
        </div>
      </div>

      {/* Top 4 Admin Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Platform AUM"
          value={`GH₵${(adminStats.totalAum / 1000000).toFixed(2)}M`}
          subValue="+12.4% this month"
          changePercent={12.4}
          changeLabel="AUM Growth"
          isPositive={true}
          variant="highlight"
          icon={<TrendingUp className="w-4 h-4" />}
          tooltip="Aggregated mark-to-market valuation of all subscribed fund units."
        />

        <MetricCard
          label="Total Active Investors"
          value={adminStats.totalInvestors.toLocaleString()}
          subValue={`+${adminStats.pendingKycCount} in verification`}
          changePercent={7.8}
          changeLabel="New users MoM"
          isPositive={true}
          icon={<Users className="w-4 h-4" />}
        />

        <MetricCard
          label="Active Fund Products"
          value={adminStats.activeProductsCount.toString()}
          subValue="4 under review"
          changeLabel="Curated funds"
          icon={<Package className="w-4 h-4" />}
        />

        <MetricCard
          label="Platform Volume"
          value={`GH₵${(adminStats.platformVolume / 1000000).toFixed(1)}M`}
          subValue={`${adminStats.totalTransactionsCount.toLocaleString()} total orders`}
          changePercent={15.2}
          changeLabel="Total transactions"
          isPositive={true}
          icon={<ArrowUpRight className="w-4 h-4" />}
        />
      </div>

      {/* Action Attention Banner (if pending KYC or payouts) */}
      {(pendingKyc.length > 0 || pendingWth.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Compliance Action Required:</span> {pendingKyc.length} KYC submissions and {pendingWth.length} withdrawal disbursements require manual authorization.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setAdminPage('kyc')}
              className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-md font-semibold text-[11px]"
            >
              Open KYC Queue
            </button>
            <button
              onClick={() => setAdminPage('withdrawals')}
              className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-md font-semibold text-[11px]"
            >
              Review Withdrawals
            </button>
          </div>
        </div>
      )}

      {/* Visual Charts: Volume Trends & Deposits vs Withdrawals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Monthly Capital Inflow Trends
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Total monthly retail capital deployed into FINORA fund portfolios.
              </p>
            </div>
          </div>
          <VolumeBarChart />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Liquidity Flows: Deposits vs Withdrawals
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparison of Gross Cash Inflows against redemption settlements.
              </p>
            </div>
          </div>
          <DepositsVsWithdrawalsChart />
        </div>
      </div>

      {/* Recent System Audit Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Recent System & Administrative Audit Trail
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Immutable regulatory audit log of compliance actions and security triggers.
            </p>
          </div>

          <button
            onClick={() => setAdminPage('audit')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            All Audit Logs &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-mono">
              {auditLogs.slice(0, 6).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-slate-500 text-[11px]">{log.timestamp}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{log.actor || log.administrator}</td>
                  <td className="py-3 px-4 text-slate-800">{log.action}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {log.category || 'System'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">{log.ipAddress || log.ipDevice}</td>
                  <td className="py-3 px-4 text-slate-600 text-[11px] max-w-xs truncate">
                    {log.details || log.entity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
