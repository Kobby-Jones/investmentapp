import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Shield, Sliders, Save, Database, AlertTriangle } from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const { showToast, resetToDemoState } = useApp();

  const [platformName, setPlatformName] = useState('FINORA Digital Investment Platform');
  const [minDeposit, setMinDeposit] = useState(50);
  const [maxWithdrawal, setMaxWithdrawal] = useState(20000);
  const [defaultFee, setDefaultFee] = useState(0.25);
  const [kycTier2Required, setKycTier2Required] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Platform parameters updated and broadcast to worker nodes.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Platform Administration Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Global monetary limits, compliance thresholds, transaction fee tiers, and demo controls.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <form onSubmit={handleSave} className="space-y-5 text-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Global Platform Limits & Fees
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Minimum Deposit Limit (GH₵)
                </label>
                <input
                  type="number"
                  value={minDeposit}
                  onChange={(e) => setMinDeposit(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Maximum Daily Withdrawal (GH₵)
                </label>
                <input
                  type="number"
                  value={maxWithdrawal}
                  onChange={(e) => setMaxWithdrawal(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Default Platform Custody Fee (%)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={defaultFee}
                  onChange={(e) => setDefaultFee(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Settlement Clearing House
                </label>
                <input
                  type="text"
                  readOnly
                  value="GhIPSS (Ghana Interbank Payment and Settlement Systems)"
                  className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-50 text-slate-700 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Mandatory Tier 2 Verification for Redemptions
                </div>
                <div className="text-[11px] text-slate-500">
                  Require verified Ghana Card before allowing capital withdrawals over GH₵1,000.
                </div>
              </div>

              <input
                type="checkbox"
                checked={kycTier2Required}
                onChange={(e) => setKycTier2Required(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Parameters</span>
              </button>
            </div>
          </form>
        </div>

        {/* Demo & Academic State Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Demo State Management</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Academic demonstration tools to reset all mock databases and restore Kwame Mensah's initial portfolio benchmark.
            </p>

            <button
              onClick={resetToDemoState}
              className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Reset to Standard Demo State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
