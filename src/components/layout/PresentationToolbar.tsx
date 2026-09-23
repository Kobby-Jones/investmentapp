import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FolderMinus,
  CheckCircle2,
  Shield,
  User,
  Globe
} from 'lucide-react';

export const PresentationToolbar: React.FC = () => {
  const {
    role,
    setRole,
    setPublicPage,
    setInvestorPage,
    setAdminPage,
    jumpToStep,
    resetToDemoState,
    setDemoEmptyState,
    firebaseUser,
    signInWithGoogle,
    signOutUser,
  } = useApp();

  const [expanded, setExpanded] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(4);

  const steps = [
    { num: 1, title: 'Landing Page' },
    { num: 2, title: 'Create Account' },
    { num: 3, title: 'Profile & KYC' },
    { num: 4, title: 'Investor Dashboard' },
    { num: 5, title: 'Explore Marketplace' },
    { num: 6, title: 'Product Details' },
    { num: 7, title: 'Investment Flow' },
    { num: 8, title: 'Portfolio Updated' },
    { num: 9, title: 'Performance Analytics' },
    { num: 10, title: 'Transaction History' },
    { num: 11, title: 'Request Withdrawal' },
    { num: 12, title: 'Referral Dashboard' },
    { num: 13, title: 'Admin Overview' },
    { num: 14, title: 'Platform Statistics' },
    { num: 15, title: 'User Management' },
    { num: 16, title: 'KYC Verification' },
    { num: 17, title: 'Manage Products' },
    { num: 18, title: 'Deposits & Withdrawals' },
    { num: 19, title: 'Financial Reports' },
    { num: 20, title: 'System Audit Logs' },
  ];

  const handleStepSelect = (stepNum: number) => {
    setActiveStep(stepNum);
    jumpToStep(stepNum);
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-100 text-xs z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        {/* Left: Project title & Role Pill Switchers */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>FINORA</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-normal border-l border-slate-700 pl-2">
              Academic Master's Prototype
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => {
                setRole('public');
                setPublicPage('home');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                role === 'public'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              Public Web
            </button>
            <button
              onClick={() => {
                setRole('investor');
                setInvestorPage('dashboard');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                role === 'investor'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              Investor Portal
            </button>
            <button
              onClick={() => {
                setRole('admin');
                setAdminPage('overview');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                role === 'admin'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Shield className="w-3 h-3" />
              Admin Portal
            </button>
          </div>
        </div>

        {/* Right: Presentation Guide trigger, Firebase status & presets */}
        <div className="flex items-center gap-2">
          {/* Firebase Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Firebase Connected</span>
          </div>

          {firebaseUser ? (
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              <span className="text-[10px] text-slate-300 max-w-[90px] truncate">{firebaseUser.displayName || firebaseUser.email}</span>
              <button
                onClick={signOutUser}
                className="text-[10px] text-rose-400 hover:text-rose-300 font-medium"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold transition-colors"
            >
              <User className="w-3 h-3" />
              <span>Google Login</span>
            </button>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-medium text-slate-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">20-Step Presentation Sequence</span>
            <span className="md:hidden">Steps</span>
            {expanded ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
          </button>

          <div className="hidden lg:flex items-center gap-1.5 border-l border-slate-800 pl-2">
            <button
              onClick={resetToDemoState}
              title="Reset all balances and positions to default demo state"
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
            >
              <RefreshCw className="w-3 h-3 text-slate-400" />
              Reset Demo
            </button>
            <button
              onClick={setDemoEmptyState}
              title="Show empty portfolio first-time user state"
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
            >
              <FolderMinus className="w-3 h-3 text-slate-400" />
              Empty State
            </button>
          </div>
        </div>
      </div>

      {/* Expanded 20-step presentation drawer */}
      {expanded && (
        <div className="border-t border-slate-800 bg-slate-950 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Master's Presentation Demonstration Sequence (Click any step to jump):
              </span>
              <button
                onClick={() => setExpanded(false)}
                className="text-slate-400 hover:text-white text-[11px]"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-1.5">
              {steps.map((s) => (
                <button
                  key={s.num}
                  onClick={() => handleStepSelect(s.num)}
                  className={`flex items-center gap-2 p-2 rounded-md text-left text-[11px] transition-all border ${
                    activeStep === s.num
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[9px] font-mono text-slate-400 shrink-0">
                    {s.num}
                  </span>
                  <span className="truncate">{s.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
