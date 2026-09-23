import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InvestmentProduct } from '../../types';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Coins,
  ChevronRight
} from 'lucide-react';

export const InvestmentModal: React.FC = () => {
  const {
    investmentModalProduct,
    setInvestmentModalProduct,
    user,
    makeInvestment,
    setInvestorPage,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [amount, setAmount] = useState<number>(2500);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successRef, setSuccessRef] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!investmentModalProduct) return null;

  const product = investmentModalProduct;
  const applicableFee = Math.round(amount * 0.0025 * 100) / 100;
  const totalDeducted = amount; // Fee is absorbed or included in subscription

  const handleAmountNext = () => {
    setErrorMsg('');
    if (!amount || isNaN(amount)) {
      setErrorMsg('Please enter a valid investment amount.');
      return;
    }
    if (amount < product.minInvestment) {
      setErrorMsg(`Minimum investment requirement is GH₵${product.minInvestment.toFixed(2)}.`);
      return;
    }
    if (amount > user.availableCashBalance) {
      setErrorMsg(`Insufficient cash balance. You have GH₵${user.availableCashBalance.toFixed(2)} available.`);
      return;
    }
    setStep(2);
  };

  const handleConfirmInvestment = async () => {
    setIsSubmitting(true);
    try {
      const res = await makeInvestment(product.id, amount);
      setIsSubmitting(false);
      if (res && res.success) {
        setSuccessRef(res.reference);
        setStep(4);
      } else {
        setErrorMsg(res?.message || 'Investment failed');
        setStep(1);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'Error executing investment');
      setStep(1);
    }
  };

  const handleClose = () => {
    setInvestmentModalProduct(null);
    setStep(1);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Step {step} of 4
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {step === 1 && 'Select Amount'}
                {step === 2 && 'Review Investment'}
                {step === 3 && 'Confirmation'}
                {step === 4 && 'Complete'}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              Invest in {product.name}
            </h2>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* STEP 1: Select Amount */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-600">Available Cash Balance:</span>
                <span className="font-mono font-bold text-slate-900">
                  GH₵{user.availableCashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Investment Amount (GH₵)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono font-bold text-slate-500">
                    GH₵
                  </span>
                  <input
                    type="number"
                    min={product.minInvestment}
                    max={user.availableCashBalance}
                    step="100"
                    value={amount || ''}
                    onChange={(e) => {
                      setAmount(parseFloat(e.target.value) || 0);
                      setErrorMsg('');
                    }}
                    className="w-full pl-14 pr-4 py-3 text-lg font-mono font-bold text-slate-900 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                  <span>Minimum: GH₵{product.minInvestment.toFixed(2)}</span>
                  <span>Suggested holding: {product.horizon}</span>
                </div>
              </div>

              {/* Amount Quick Presets */}
              <div className="flex flex-wrap gap-2">
                {[500, 1000, 2500, 5000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAmount(preset);
                      setErrorMsg('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
                      amount === preset
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    GH₵{preset.toLocaleString()}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setAmount(Math.floor(user.availableCashBalance));
                    setErrorMsg('');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                >
                  Max Available
                </button>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={handleAmountNext}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Review Investment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Review Investment */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Investment Product:</span>
                  <span className="font-bold text-slate-900">{product.name}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Principal Subscription Amount:</span>
                  <span className="font-mono font-bold text-slate-900">
                    GH₵{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Subscription Custody Fee (0.25%):</span>
                  <span className="font-mono text-slate-600">
                    GH₵{applicableFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Est. Units Allocated (@ NAV 1.00):</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {amount.toLocaleString()} Units
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 font-bold text-sm">
                  <span className="text-slate-900">Total Deducted from Cash:</span>
                  <span className="font-mono text-emerald-700">
                    GH₵{totalDeducted.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Estimated Asset Allocation Breakdown */}
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Estimated Asset Class Allocation
                </div>
                <div className="space-y-1.5 text-xs">
                  {product.assetAllocation.map((item) => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-slate-600 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: item.color }} />
                        {item.label} ({item.percentage}%)
                      </span>
                      <span className="font-mono text-slate-800">
                        GH₵{((amount * item.percentage) / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Proceed to Confirm</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirm Investment */}
          {step === 3 && (
            <div className="space-y-5 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Confirm Subscription Order
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  You are allocating <span className="font-bold text-slate-900 font-mono">GH₵{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> from your available cash ledger into {product.name}.
                </p>
              </div>

              <div className="text-left p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Units will be issued at the current Net Asset Value.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Daily revaluation and quarterly audits will reflect in your Portfolio.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Past performance is simulated demo data and returns are not guaranteed.</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                  className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmInvestment}
                  disabled={isSubmitting}
                  className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs"
                >
                  {isSubmitting ? 'Recording Order...' : 'Confirm & Subscribe'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success Screen */}
          {step === 4 && (
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Investment Successfully Recorded
                </h3>
                <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                  Your investment of <span className="font-bold text-slate-900 font-mono">GH₵{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> has been added to your portfolio.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Transaction Reference:</span>
                  <span className="font-mono font-bold text-emerald-700">{successRef}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Product:</span>
                  <span className="font-semibold text-slate-800">{product.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Settled / Active
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    setInvestorPage('portfolio');
                  }}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  View in Portfolio
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
