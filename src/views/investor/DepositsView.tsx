import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowDownLeft,
  Smartphone,
  Building2,
  CreditCard,
  CheckCircle2,
  Clock,
  Coins,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const DepositsView: React.FC = () => {
  const { user, recordDeposit, transactions } = useApp();

  const [method, setMethod] = useState<'momo' | 'bank' | 'card'>('momo');
  const [provider, setProvider] = useState<'MTN' | 'Telecel' | 'AT'>('MTN');
  const [amount, setAmount] = useState<number>(1000);
  const [phone, setPhone] = useState<string>('0244123456');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastDepositSuccess, setLastDepositSuccess] = useState<string | null>(null);

  const fee = method === 'momo' ? Math.min(amount * 0.0075, 10) : method === 'card' ? amount * 0.015 : 0;
  const netCredited = amount;

  const depositTransactions = transactions.filter((t) => t.type === 'deposit');

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 50) return;

    setIsProcessing(true);
    setLastDepositSuccess(null);

    try {
      const res = await recordDeposit(amount, `${method.toUpperCase()} (${provider})`);
      setIsProcessing(false);
      setLastDepositSuccess(res.reference);
      setAmount(1000);
    } catch (err) {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Deposit Cash Funds
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Credit your unallocated cash balance to subscribe to investment portfolios.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
          <Coins className="w-4 h-4 text-emerald-600" />
          <span>Current Cash Balance:</span>
          <span className="font-mono font-bold text-slate-900">
            GH₵{user.availableCashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deposit Form (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
            Select Deposit Channel
          </h2>

          <form onSubmit={handleDepositSubmit} className="space-y-5">
            {/* Payment Method Cards */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setMethod('momo')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  method === 'momo'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Smartphone className={`w-5 h-5 mb-2 ${method === 'momo' ? 'text-emerald-600' : 'text-slate-500'}`} />
                <div className="text-xs font-bold text-slate-900">Mobile Money</div>
                <div className="text-[10px] text-slate-500">MTN, Telecel, AT</div>
              </button>

              <button
                type="button"
                onClick={() => setMethod('bank')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  method === 'bank'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Building2 className={`w-5 h-5 mb-2 ${method === 'bank' ? 'text-emerald-600' : 'text-slate-500'}`} />
                <div className="text-xs font-bold text-slate-900">Bank Transfer</div>
                <div className="text-[10px] text-slate-500">ACH / Instant Pay</div>
              </button>

              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  method === 'card'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CreditCard className={`w-5 h-5 mb-2 ${method === 'card' ? 'text-emerald-600' : 'text-slate-500'}`} />
                <div className="text-xs font-bold text-slate-900">Debit Card</div>
                <div className="text-[10px] text-slate-500">Visa & Mastercard</div>
              </button>
            </div>

            {/* Provider selection for momo */}
            {method === 'momo' && (
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Select Mobile Network Operator
                </label>
                <div className="flex gap-3">
                  {(['MTN', 'Telecel', 'AT'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setProvider(p)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                        provider === p
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {p} Mobile Money
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Subscriber Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Amount input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Deposit Amount (GH₵)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono font-bold text-slate-500">
                  GH₵
                </span>
                <input
                  type="number"
                  min="50"
                  step="50"
                  required
                  value={amount || ''}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-14 pr-4 py-3 text-lg font-mono font-bold text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Amount presets */}
              <div className="flex gap-2 mt-2">
                {[200, 500, 1000, 2500, 5000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`px-3 py-1 rounded-md text-xs font-mono border transition-colors ${
                      amount === preset
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    GH₵{preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Fee summary box */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between items-center text-slate-600">
                <span>Gross Transfer Amount:</span>
                <span className="font-mono font-bold text-slate-900">GH₵{amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Channel Processing Fee:</span>
                <span className="font-mono text-slate-500">GH₵{fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200 font-bold text-slate-900">
                <span>Net Credited to Available Cash:</span>
                <span className="font-mono text-emerald-600">GH₵{netCredited.toFixed(2)}</span>
              </div>
            </div>

            {lastDepositSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Deposit Confirmed!</span> Reference:{' '}
                  <span className="font-mono">{lastDepositSuccess}</span>. Cash balance updated.
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>{isProcessing ? 'Processing Simulated Gateway...' : `Confirm Deposit of GH₵${amount}`}</span>
            </button>
          </form>
        </div>

        {/* Right Information card */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Funding Guidelines</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Deposited funds are held in fiduciary segregated settlement accounts before being deployed into chosen fund units.
            </p>
            <div className="pt-2 border-t border-slate-100 space-y-2 text-slate-500">
              <div className="flex items-center justify-between">
                <span>Instant MoMo Settlement</span>
                <span className="text-emerald-600 font-semibold">&lt; 60 seconds</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Bank ACH Clearing</span>
                <span>Same day</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Deposit Limits</span>
                <span>GH₵50,000 / day</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit History */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Deposit Ledger
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Method / Channel</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {depositTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{tx.date}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{tx.description}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{tx.reference}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                    +GH₵{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {tx.status}
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
