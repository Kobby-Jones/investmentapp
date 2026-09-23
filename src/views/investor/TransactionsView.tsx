import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TransactionType, TransactionStatus } from '../../types';
import {
  History,
  Search,
  Filter,
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Percent,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const { transactions, showToast } = useApp();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const match =
          tx.title.toLowerCase().includes(q) ||
          tx.description.toLowerCase().includes(q) ||
          tx.reference.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [transactions, typeFilter, statusFilter, search]);

  const handleExportStatement = () => {
    showToast('Simulated financial statement exported (PDF/CSV ready).', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Transaction History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete audit trail of capital inflows, product subscriptions, yields, and settlements.
          </p>
        </div>

        <button
          onClick={handleExportStatement}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Statement</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by reference, product, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500 bg-slate-50 text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Transaction Types</option>
              <option value="deposit">Deposits</option>
              <option value="investment">Investments</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="dividend">Dividends / Yield</option>
              <option value="fee">Custody & Fees</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <History className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No Transactions Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              No transactions match your current search filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTransactions.map((tx) => {
                  const isCredit = tx.type === 'deposit' || tx.type === 'dividend';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="capitalize font-semibold text-slate-700">
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{tx.title}</div>
                        <div className="text-[11px] text-slate-500">{tx.description}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {tx.reference}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums whitespace-nowrap">
                        <span className={isCredit ? 'text-emerald-600' : 'text-slate-900'}>
                          {isCredit ? '+' : '-'}GH₵{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
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
        )}
      </div>
    </div>
  );
};
