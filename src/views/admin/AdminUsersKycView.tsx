import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { KycQueueItem } from '../../types';
import {
  Users,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  AlertTriangle,
  X,
  FileText
} from 'lucide-react';

export const AdminUsersKycView: React.FC<{ initialTab?: 'users' | 'kyc' }> = ({ initialTab = 'users' }) => {
  const {
    adminUsers,
    kycQueue,
    approveKyc,
    rejectKyc,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'kyc'>(initialTab);
  const [search, setSearch] = useState('');
  const [kycStatusFilter, setKycStatusFilter] = useState('all');
  const [selectedKycItem, setSelectedKycItem] = useState<KycQueueItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredUsers = useMemo(() => {
    return adminUsers.filter((u) => {
      const name = u.fullName || u.name || '';
      if (kycStatusFilter !== 'all' && u.kycStatus !== kycStatusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      }
      return true;
    });
  }, [adminUsers, kycStatusFilter, search]);

  const handleApprove = (id: string, name: string) => {
    approveKyc(id);
    setSelectedKycItem(null);
  };

  const handleReject = (id: string, name: string) => {
    rejectKyc(id, rejectionReason || 'Document unreadable / mismatched information.');
    setSelectedKycItem(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {activeTab === 'users' ? 'User Directory' : 'KYC Compliance Verification'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit registered retail investor accounts, tier classifications, and government identity verifications.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'users'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All Users ({adminUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('kyc')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'kyc'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>KYC Verification Queue ({kycQueue.filter((k) => k.status === 'Pending').length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search investors by legal name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500 bg-slate-50 text-slate-900"
              />
            </div>

            <select
              value={kycStatusFilter}
              onChange={(e) => setKycStatusFilter(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden"
            >
              <option value="all">All KYC Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Under Review">Under Review</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Investor</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4 text-center">KYC Status</th>
                    <th className="py-3 px-4 text-right">Invested Basis</th>
                    <th className="py-3 px-4 text-right">Current Valuation</th>
                    <th className="py-3 px-4 text-center">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredUsers.map((u) => {
                    const displayName = u.fullName || u.name || 'User';
                    const initials = displayName.split(' ').map((n: string) => n[0]).join('');
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                              {initials}
                            </div>
                            <div>
                              <div>{displayName}</div>
                              <span className="text-[10px] text-slate-400 font-mono">ID: {u.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-800">{u.email}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.phone}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                              u.kycStatus === 'Verified'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : u.kycStatus === 'Under Review'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {u.kycStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                          GH₵{u.totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                          GH₵{u.portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-500">
                          {u.registrationDate || u.registeredDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KYC COMPLIANCE QUEUE */}
      {activeTab === 'kyc' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Pending Identity Verification Queue
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify government documents before granting unrestricted portfolio privileges.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Document Type</th>
                    <th className="py-3 px-4">ID Number</th>
                    <th className="py-3 px-4">Submitted Date</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {kycQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {item.userName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {item.idType}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-800">
                        {item.idNumber}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {item.submittedDate || item.submittedAt}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            item.status === 'Verified'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedKycItem(item)}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors"
                        >
                          Review & Decide
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* KYC Inspection & Decision Modal */}
      {selectedKycItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setSelectedKycItem(null)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                  KYC Verification
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedKycItem.userName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedKycItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Document Type:</span>
                  <span className="font-semibold text-slate-900">{selectedKycItem.idType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Document Number:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedKycItem.idNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Submitted Timestamp:</span>
                  <span className="font-mono text-slate-700">{selectedKycItem.submittedDate}</span>
                </div>
              </div>

              {/* Simulated ID Document Display */}
              <div className="p-5 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 text-center">
                <FileText className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="font-bold text-slate-800 text-xs">
                  {selectedKycItem.idType} Document Scan
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  SHA-256 Checksum: 8f4a2b91c... verified with NIA DB
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Rejection Notes (Optional if approving)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Image blurry, address discrepancy..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleReject(selectedKycItem.id, selectedKycItem.userName)}
                className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Document</span>
              </button>

              <button
                onClick={() => handleApprove(selectedKycItem.id, selectedKycItem.userName)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Verify</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
