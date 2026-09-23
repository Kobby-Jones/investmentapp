import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Search,
  Check,
  AlertTriangle
} from 'lucide-react';

export const AdminCashFlowView: React.FC<{ initialMode?: 'deposits' | 'withdrawals' }> = ({
  initialMode = 'withdrawals',
}) => {
  const {
    withdrawalsQueue,
    depositsQueue,
    approveWithdrawal,
    rejectWithdrawal,
    approveDepositByAdmin,
    transactions,
  } = useApp();

  const [mode, setMode] = useState<'deposits' | 'withdrawals'>(initialMode);
  const [search, setSearch] = useState('');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const pendingWithdrawalsCount = withdrawalsQueue.filter((w) => w.status === 'Pending' || w.status === 'Under Review').length;
  const pendingDepositsCount = depositsQueue.filter((d) => d.status === 'PENDING').length;

  const filteredWithdrawals = withdrawalsQueue.filter((w) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const ref = w.reference || w.id;
    return (
      w.userName.toLowerCase().includes(q) ||
      ref.toLowerCase().includes(q) ||
      w.destination.toLowerCase().includes(q)
    );
  });

  const filteredDeposits = depositsQueue.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const ref = d.reference || d.id;
    return (
      d.userName.toLowerCase().includes(q) ||
      ref.toLowerCase().includes(q) ||
      d.provider.toLowerCase().includes(q)
    );
  });

  const handleApproveWth = async (id: string) => {
    setActionInProgress(id);
    try {
      await approveWithdrawal(id);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRejectWth = async (id: string) => {
    setActionInProgress(id);
    try {
      await rejectWithdrawal(id, 'Flagged by compliance risk engine');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleApproveDep = async (id: string) => {
    setActionInProgress(id);
    try {
      await approveDepositByAdmin(id);
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {mode === 'withdrawals' ? 'Withdrawal Liquidity Management' : 'Gross Deposits & Inflow Ledger'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit capital inflows and authorize outbound banking and mobile money disbursements.
          </p>
        </div>

        {/* Mode switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setMode('withdrawals')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
              mode === 'withdrawals'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
            <span>Withdrawals Queue ({pendingWithdrawalsCount})</span>
          </button>
          <button
            onClick={() => setMode('deposits')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
              mode === 'deposits'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
            <span>Deposits Queue ({pendingDepositsCount})</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference, investor name or account..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg shadow-2xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* WITHDRAWALS MODE */}
      {mode === 'withdrawals' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Pending Withdrawal Settlement Authorizations
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm account verification and authorize automated gateway disbursement.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Investor</th>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Destination Account</th>
                  <th className="py-3 px-4 text-right">Requested</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Authorization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No withdrawal requests found.
                    </td>
                  </tr>
                ) : (
                  filteredWithdrawals.map((wth) => (
                    <tr key={wth.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {wth.userName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {wth.reference || wth.id}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {wth.destination} ({wth.method})
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        GH₵{wth.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            wth.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : wth.status === 'Pending' || wth.status === 'Under Review'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {wth.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {wth.status === 'Pending' || wth.status === 'Under Review' ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              disabled={actionInProgress === wth.id}
                              onClick={() => handleApproveWth(wth.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold disabled:opacity-50"
                            >
                              {actionInProgress === wth.id ? 'Processing...' : 'Authorize'}
                            </button>
                            <button
                              disabled={actionInProgress === wth.id}
                              onClick={() => handleRejectWth(wth.id)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-xs font-semibold border border-rose-200 disabled:opacity-50"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-medium">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DEPOSITS MODE */}
      {mode === 'deposits' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Inbound Deposits Stream & Verification
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live collection stream from Firestore deposits collection. Approve incoming wire/mobile transfers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Investor</th>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Channel / Gateway</th>
                  <th className="py-3 px-4 text-right">Gross Inflow</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredDeposits.length === 0 ? (
                  transactions.filter((t) => t.type === 'deposit').map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">Standard Investor</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">{tx.reference}</td>
                      <td className="py-3.5 px-4 text-slate-700">{tx.description}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                        +GH₵{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-400 text-[11px]">
                        Cleared
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredDeposits.map((dep) => (
                    <tr key={dep.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {dep.userName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {dep.reference || dep.id}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {dep.provider} ({dep.method})
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                        +GH₵{dep.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            dep.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : dep.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {dep.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {dep.status === 'PENDING' ? (
                          <button
                            disabled={actionInProgress === dep.id}
                            onClick={() => handleApproveDep(dep.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold disabled:opacity-50"
                          >
                            {actionInProgress === dep.id ? 'Approving...' : 'Approve'}
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Cleared</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
