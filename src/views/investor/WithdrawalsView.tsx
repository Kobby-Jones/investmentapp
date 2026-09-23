import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowUpRight,
  Smartphone,
  Building2,
  Clock,
  Coins,
  AlertCircle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const WithdrawalsView: React.FC = () => {
  const { user, requestWithdrawal, withdrawalsQueue } = useApp();

  const [destinationType, setDestinationType] = useState<'bank' | 'momo'>('bank');
  const [bankName, setBankName] = useState('Standard Chartered Bank Ghana');
  const [accountNumber, setAccountNumber] = useState('0100123456789');
  const [momoProvider, setMomoProvider] = useState('MTN MoMo');
  const [momoNumber, setMomoNumber] = useState('0244123456');
  const [amount, setAmount] = useState<number>(500);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const withdrawalFee = 5.00;
  const netPayout = Math.max(0, amount - withdrawalFee);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessRef(null);

    if (amount <= 0) {
      setErrorMsg('Please enter a valid withdrawal amount.');
      return;
    }
    if (amount > user.availableCashBalance) {
      setErrorMsg(`Withdrawal amount cannot exceed available cash (GH₵${user.availableCashBalance.toFixed(2)}).`);
      return;
    }
    if (amount < 20) {
      setErrorMsg('Minimum withdrawal amount is GH₵20.00.');
      return;
    }

    setIsSubmitting(true);
    const method = destinationType === 'bank' ? 'Bank Transfer' : 'Mobile Money';
    const dest =
      destinationType === 'bank'
        ? `${bankName} (Acct: ${accountNumber})`
        : `${momoProvider} (${momoNumber})`;

    try {
      const res = await requestWithdrawal(amount, method, dest);
      setIsSubmitting(false);

      if (res && res.success) {
        setSuccessRef(res.reference);
        setAmount(0);
      } else {
        setErrorMsg(res?.message || 'Withdrawal request failed.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'Withdrawal request failed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Request Capital Withdrawal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Disburse unallocated cash balances to your verified bank account or mobile wallet.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
          <Coins className="w-4 h-4 text-emerald-600" />
          <span>Available Cash to Withdraw:</span>
          <span className="font-mono font-bold text-slate-900">
            GH₵{user.availableCashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Withdrawal Form (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
            Withdrawal Request
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Destination Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Settlement Destination
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDestinationType('bank')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    destinationType === 'bank'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className={`w-5 h-5 mb-1.5 ${destinationType === 'bank' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <div className="text-xs font-bold text-slate-900">Commercial Bank Account</div>
                  <div className="text-[10px] text-slate-500">1–2 Business Days</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDestinationType('momo')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    destinationType === 'momo'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className={`w-5 h-5 mb-1.5 ${destinationType === 'momo' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <div className="text-xs font-bold text-slate-900">Mobile Money Wallet</div>
                  <div className="text-[10px] text-slate-500">Same-Day Processing</div>
                </button>
              </div>
            </div>

            {/* Destination inputs */}
            {destinationType === 'bank' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Provider
                  </label>
                  <select
                    value={momoProvider}
                    onChange={(e) => setMomoProvider(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="MTN MoMo">MTN Mobile Money</option>
                    <option value="Telecel Cash">Telecel Cash</option>
                    <option value="AT Money">AT Money</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Registered Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Amount Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Withdrawal Amount (GH₵)
                </label>
                <button
                  type="button"
                  onClick={() => setAmount(Math.floor(user.availableCashBalance))}
                  className="text-xs text-emerald-600 font-semibold hover:underline"
                >
                  Withdraw All Cash
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono font-bold text-slate-500">
                  GH₵
                </span>
                <input
                  type="number"
                  min="20"
                  max={user.availableCashBalance}
                  step="10"
                  required
                  value={amount || ''}
                  onChange={(e) => {
                    setAmount(parseFloat(e.target.value) || 0);
                    setErrorMsg('');
                  }}
                  className="w-full pl-14 pr-4 py-3 text-lg font-mono font-bold text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Breakdown */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between items-center text-slate-600">
                <span>Requested Gross Amount:</span>
                <span className="font-mono font-bold text-slate-900">GH₵{amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Settlement Processing Fee:</span>
                <span className="font-mono text-slate-500">GH₵{withdrawalFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200 font-bold text-slate-900">
                <span>Net Payout to Your Account:</span>
                <span className="font-mono text-emerald-600">GH₵{netPayout.toFixed(2)}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successRef && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Withdrawal Requested!</span> Reference:{' '}
                  <span className="font-mono">{successRef}</span>. Admin review dispatched.
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting Request...' : `Submit Withdrawal Request (GH₵${amount})`}</span>
            </button>
          </form>
        </div>

        {/* Right Info Box */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide">
              Withdrawal Policy
            </h3>
            <p className="text-slate-600 leading-relaxed">
              To protect investor funds, all withdrawal requests are authenticated against KYC limits and reviewed by compliance before bank transmission.
            </p>
            <div className="pt-2 border-t border-slate-100 space-y-2 text-slate-500">
              <div className="flex items-center justify-between">
                <span>Daily Limit</span>
                <span className="font-mono font-semibold text-slate-800">GH₵20,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Admin Review SLA</span>
                <span className="font-mono font-semibold text-slate-800">1–3 Business Days</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Direct MoMo Payout</span>
                <span className="font-mono font-semibold text-slate-800">&lt; 4 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Queue / History */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Withdrawal Request History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {withdrawalsQueue.map((wth) => (
                <tr key={wth.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{wth.requestDate || wth.requestedAt.split(' ')[0]}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-700">{wth.reference || wth.id}</td>
                  <td className="py-3 px-4 text-slate-800">{wth.destination}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    GH₵{wth.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        wth.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : wth.status === 'Under Review' || wth.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {wth.status}
                    </span>
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
