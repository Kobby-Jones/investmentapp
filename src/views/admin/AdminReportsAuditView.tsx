import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DonutChart } from '../../components/common/DonutChart';
import {
  FileBarChart,
  ClipboardList,
  Download,
  Search,
  BookOpen,
  TrendingUp,
  Coins,
  FileSpreadsheet,
  Plus
} from 'lucide-react';

export const AdminReportsAuditView: React.FC<{ initialTab?: 'reports' | 'ledger' | 'valuations' | 'audit' }> = ({
  initialTab = 'reports',
}) => {
  const { auditLogs, products, adminStats, ledgerEntries, valuations, applyProductValuation, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'reports' | 'ledger' | 'valuations' | 'audit'>(initialTab);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Valuation Adjustment Modal
  const [showValuationModal, setShowValuationModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [newReturn, setNewReturn] = useState<number>(18.5);
  const [changePercent, setChangePercent] = useState<number>(0.5);
  const [valuationReason, setValuationReason] = useState('Market Benchmark Rebalance & Yield Adjust');
  const [isSubmittingValuation, setIsSubmittingValuation] = useState(false);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((l) => {
      const cat = l.category || 'admin';
      const actor = l.actor || l.administrator;
      const details = l.details || l.entity;
      const ip = l.ipAddress || l.ipDevice;
      if (categoryFilter !== 'all' && cat !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          actor.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          details.toLowerCase().includes(q) ||
          ip.includes(q)
        );
      }
      return true;
    });
  }, [auditLogs, categoryFilter, search]);

  const filteredLedger = useMemo(() => {
    if (!search) return ledgerEntries;
    const q = search.toLowerCase();
    return ledgerEntries.filter(
      (entry) =>
        entry.reference.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.debitAccount.toLowerCase().includes(q) ||
        entry.creditAccount.toLowerCase().includes(q)
    );
  }, [ledgerEntries, search]);

  const handleExport = (name: string) => {
    showToast(`Export generated: ${name} (PDF/CSV ready).`, 'success');
  };

  const handleApplyValuation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingValuation(true);
    try {
      await applyProductValuation(selectedProductId, Number(newReturn), Number(changePercent), valuationReason);
      setShowValuationModal(false);
    } finally {
      setIsSubmittingValuation(false);
    }
  };

  const productSlices = products.map((p, idx) => ({
    label: p.name,
    percentage: Math.round(((p.simulatedAum || 0) / adminStats.totalAum) * 100) || (idx === 0 ? 30 : 20),
    color: ['#059669', '#0284C7', '#6366F1', '#F59E0B', '#EC4899'][idx % 5],
    amount: p.simulatedAum || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {activeTab === 'reports'
              ? 'Fiduciary Reports & Analytics'
              : activeTab === 'ledger'
              ? 'General Financial Ledger (Double-Entry)'
              : activeTab === 'valuations'
              ? 'Product Valuation Records & NAV'
              : 'Security & System Audit Logs'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional accounting reconciliations, immutable double-entry books, and SEC-compliant audit trail.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'reports'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileBarChart className="w-3.5 h-3.5" />
            <span>Reports</span>
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'ledger'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>General Ledger ({ledgerEntries.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('valuations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'valuations'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Valuations ({valuations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Management Fee Revenue
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
                GH₵234,800.00
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Accrued YTD from NAV fees</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Net Capital Inflow (MTD)
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                GH₵1,420,000.00
              </div>
              <div className="text-[10px] text-emerald-600 mt-0.5">+14.2% over target</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Average Portfolio Size
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                GH₵7,230.00
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Across active registered investors</div>
            </div>
          </div>

          {/* Allocation & Download Hub */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
                Total AUM Allocation by Investment Product
              </h2>
              <DonutChart slices={productSlices} totalValue={adminStats.totalAum} size={220} thickness={30} />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Export Compliance Dossiers
              </h2>
              <p className="text-xs text-slate-500">
                Generate formatted reports for SEC Ghana, internal auditors, and board review.
              </p>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleExport('SEC Monthly AUM Filing')}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="text-xs font-semibold text-slate-800">SEC Monthly AUM Filing</div>
                      <div className="text-[10px] text-slate-400">PDF & XLSX Package</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => handleExport('Client Trust Account Ledger')}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Client Trust Account Ledger</div>
                      <div className="text-[10px] text-slate-400">Stanbic Escrow Reconciliation</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => handleExport('Anti-Money Laundering (AML) Summary')}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="text-xs font-semibold text-slate-800">AML Risk Screening Summary</div>
                      <div className="text-[10px] text-slate-400">Ghana FIC Quarterly Report</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GENERAL LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Double-Entry Financial General Ledger
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time entries generated by the FinancialEngine during investor subscriptions, redemptions, and escrow holds.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search ledger reference or account..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Debit Account</th>
                    <th className="py-3 px-4">Credit Account</th>
                    <th className="py-3 px-4 text-right">Amount (GH₵)</th>
                    <th className="py-3 px-4">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-mono">
                  {filteredLedger.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No ledger records found.
                      </td>
                    </tr>
                  ) : (
                    filteredLedger.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                          {entry.timestamp}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          {entry.reference}
                        </td>
                        <td className="py-3.5 px-4 text-blue-700 whitespace-nowrap">
                          {entry.debitAccount}
                        </td>
                        <td className="py-3.5 px-4 text-purple-700 whitespace-nowrap">
                          {entry.creditAccount}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                          GH₵{entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                          {entry.description}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VALUATIONS */}
      {activeTab === 'valuations' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowValuationModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Record Valuation Adjustment</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Product Net Asset Value (NAV) Revaluations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mark-to-market performance recalculations registered in the Firestore database.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                    <th className="py-3 px-4">Effective Date</th>
                    <th className="py-3 px-4">Product ID</th>
                    <th className="py-3 px-4 text-right">Previous Return</th>
                    <th className="py-3 px-4 text-right">New Return</th>
                    <th className="py-3 px-4 text-right">Change</th>
                    <th className="py-3 px-4">Reason / Justification</th>
                    <th className="py-3 px-4">Officer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-mono">
                  {valuations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No product valuation adjustments recorded yet.
                      </td>
                    </tr>
                  ) : (
                    valuations.map((val) => (
                      <tr key={val.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                          {val.effectiveDate}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          {val.productId}
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-600 whitespace-nowrap">
                          {val.previousNav}%
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-emerald-600 whitespace-nowrap">
                          {val.newNav}%
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              val.changePercent >= 0
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {val.changePercent >= 0 ? `+${val.changePercent}%` : `${val.changePercent}%`}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 text-[11px]">
                          {val.reason}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                          {val.appliedBy}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit trail by actor, action, reference or IP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Event Categories</option>
              <option value="auth">Authentication</option>
              <option value="kyc">KYC Compliance</option>
              <option value="transaction">Transactions & Orders</option>
              <option value="product">Product Management</option>
              <option value="admin">Admin Actions</option>
            </select>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4 text-center">Category</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-mono">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {log.actor || log.administrator}
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {log.category || 'admin'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {log.ipAddress || log.ipDevice}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                        {log.details || log.entity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Valuation Modal */}
      {showValuationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Apply Product Valuation Adjustment
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Recalculate portfolio NAV and record an immutable entry into the valuations collection.
            </p>

            <form onSubmit={handleApplyValuation} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category}) - Current: {p.demoHistoricalReturn}%
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    New Return (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newReturn}
                    onChange={(e) => setNewReturn(parseFloat(e.target.value))}
                    className="w-full py-2 px-3 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Change (% pts)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={changePercent}
                    onChange={(e) => setChangePercent(parseFloat(e.target.value))}
                    className="w-full py-2 px-3 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Valuation Justification / Reason
                </label>
                <textarea
                  required
                  rows={2}
                  value={valuationReason}
                  onChange={(e) => setValuationReason(e.target.value)}
                  className="w-full py-2 px-3 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowValuationModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingValuation}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                >
                  {isSubmittingValuation ? 'Applying...' : 'Commit Valuation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
