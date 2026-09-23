import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Smartphone,
  Shield,
  Bell,
  Globe,
  Laptop,
  CheckCircle2,
  Save
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { showToast } = useApp();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [currency, setCurrency] = useState('GH₵');

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Security preferences updated successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Account Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure security protocols, two-factor authentication, alerts, and active login sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Security & Password */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Password & Authentication</span>
            </h2>

            <form onSubmit={handleSaveSecurity} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    defaultValue="••••••••••••"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Min 8 characters"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* 2FA Toggle */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Two-Factor Authentication (2FA)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Require OTP verification code via SMS or Authenticator App for every withdrawal and sign-in.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    showToast(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}.`, 'info');
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    twoFactorEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full transition-transform ${
                      twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Save Security Changes
                </button>
              </div>
            </form>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>Notification Preferences</span>
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between py-2 border-b border-slate-100 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-900">Email Trade Confirmations</div>
                  <div className="text-[11px] text-slate-500">Receive trade settlement receipts for every unit subscription.</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between py-2 border-b border-slate-100 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-900">SMS Cash Flow Alerts</div>
                  <div className="text-[11px] text-slate-500">Real-time SMS alerts on deposit arrivals and withdrawal disbursements.</div>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Info: Currency & Active Sessions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide">
              Currency & Region
            </h3>
            <p className="text-slate-600">
              Primary ledger currency and regional valuation benchmark.
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Display Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
              >
                <option value="GH₵">Ghanaian Cedi (GH₵) - Primary</option>
                <option value="USD">US Dollar (USD - Simulated Equiv)</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide">
              Active Authorized Sessions
            </h3>
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-2.5">
                <Laptop className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900">Chrome on macOS</div>
                  <div className="text-[10px] text-slate-500">Accra, Ghana · Active Now</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Smartphone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800">Mobile Safari (iOS)</div>
                  <div className="text-[10px] text-slate-500">Accra, Ghana · 2 hours ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
