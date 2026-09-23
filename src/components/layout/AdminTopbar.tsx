import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  ShieldAlert,
  User,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface AdminTopbarProps {
  onOpenMobileMenu: () => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ onOpenMobileMenu }) => {
  const {
    setRole,
    setInvestorPage,
    kycQueue,
    withdrawalsQueue,
    firebaseUser,
    signOutUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const pendingKyc = kycQueue.filter((k) => k.status === 'Pending').length;
  const pendingWth = withdrawalsQueue.filter((w) => w.status === 'Pending').length;

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between gap-4 text-slate-200">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg border border-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search investors, KYC submissions, audit refs, transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:bg-slate-900 text-slate-100 placeholder:text-slate-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Compliance Attention Badge */}
        {(pendingKyc > 0 || pendingWth > 0) && (
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {pendingKyc} KYC & {pendingWth} Payouts Pending Review
            </span>
          </div>
        )}

        {/* Quick link to Investor Portal */}
        <button
          onClick={() => {
            setRole('investor');
            setInvestorPage('dashboard');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
        >
          <User className="w-3.5 h-3.5" />
          <span>View as Investor</span>
        </button>

        {/* Sign Out Button */}
        {firebaseUser && (
          <button
            onClick={signOutUser}
            className="px-2.5 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-xs transition-colors"
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
};
