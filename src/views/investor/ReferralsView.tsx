import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Copy,
  Check,
  Gift,
  CheckCircle2,
  Clock,
  Share2
} from 'lucide-react';

export const ReferralsView: React.FC = () => {
  const { user, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  const referralCode = user.referralCode || 'KWAME8829';
  const referralLink = `https://finora.gh/ref/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast('Referral link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const referralList = [
    { name: 'Kofi Asante', date: '12 Sep 2026', status: 'Active Investor', reward: 50.00 },
    { name: 'Ama Serwaa', date: '04 Sep 2026', status: 'Active Investor', reward: 50.00 },
    { name: 'Yaw Boateng', date: '28 Aug 2026', status: 'Active Investor', reward: 50.00 },
    { name: 'Esi Mansa', date: '15 Aug 2026', status: 'Registered (Pending Deposit)', reward: 0.00 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Investor Referral Program
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Invite friends and family to FINORA. Earn GH₵50 cash reward when your referral completes KYC and funds their first investment.
        </p>
      </div>

      {/* Referral Link & Stats Box */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            Your Unique Referral Link
          </span>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-3">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-emerald-300 focus:outline-hidden"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Referral Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 text-center sm:text-left">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Total Referrals</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">4</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">KYC Verified</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">3</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Active Investors</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">3</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Total Earned</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">GH₵150.00</div>
          </div>
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Referred Investors Ledger
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Invited User</th>
                <th className="py-3 px-4">Registration Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Cash Reward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {referralList.map((ref, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{ref.name}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{ref.date}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        ref.status.includes('Active')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {ref.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                    {ref.reward > 0 ? `+GH₵${ref.reward.toFixed(2)}` : '—'}
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
