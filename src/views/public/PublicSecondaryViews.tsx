import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  GraduationCap,
  HelpCircle,
  Mail,
  ArrowRight,
  Shield,
  Layers,
  Send,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export const PublicInvestmentsView: React.FC = () => {
  const { products, setRole, setInvestorPage, setSelectedProductId } = useApp();

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Marketplace Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-1">
          Diversified Fund Offerings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Structured for risk tolerance tiers from cash equivalents to equity capital growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] mb-2 font-mono text-slate-500">
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {prod.riskRating} Risk
                </span>
                <span>Min: GH₵{prod.minInvestment}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">{prod.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                {prod.description}
              </p>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-4 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Demo Yield:</span>
                  <span className="font-mono font-bold text-emerald-600">{prod.demoHistoricalReturn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Suggested Horizon:</span>
                  <span className="font-medium text-slate-800">{prod.horizon}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedProductId(prod.id);
                setRole('investor');
                setInvestorPage('product-details');
              }}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Inspect Strategy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PublicHowItWorksView: React.FC = () => {
  const { setRole, setInvestorPage } = useApp();

  const steps = [
    {
      num: '01',
      title: 'Sign Up & Verification',
      desc: 'Complete quick digital registration and upload Ghana Card or Passport. Tier 1 allows basic wallet funding; Tier 2 unlocks complete institutional subscription capacity.',
    },
    {
      num: '02',
      title: 'Fund Cash Ledger',
      desc: 'Seamlessly deposit Ghanaian Cedis through Mobile Money (MTN, Telecel, AT) or direct commercial bank ACH transfer. Deposited funds are placed into segregated custody.',
    },
    {
      num: '03',
      title: 'Select Investment Product',
      desc: 'Evaluate calibrated risk-return horizons. Subscribe fractional units at current Net Asset Value (NAV) with zero hidden transaction markups.',
    },
    {
      num: '04',
      title: 'Monitor & Rebalance',
      desc: 'Track daily asset revaluation, accrued dividend coupons, and capital appreciation. Redeem units or request disbursements to your bank account at any time.',
    },
  ];

  return (
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          How FINORA Works
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          An institutional-grade portfolio lifecycle engineered for clarity and capital security.
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((s) => (
          <div key={s.num} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-bold text-lg flex items-center justify-center shrink-0">
              {s.num}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{s.title}</h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => {
            setRole('investor');
            setInvestorPage('dashboard');
          }}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors shadow-xs"
        >
          Launch Interactive Investor Prototype &rarr;
        </button>
      </div>
    </div>
  );
};

export const PublicAboutView: React.FC = () => {
  return (
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 mb-4">
          <GraduationCap className="w-4 h-4 text-emerald-700" />
          <span>MSc Financial Management Capstone Project</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          About FINORA
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto">
          Digital Investment & Portfolio Management Architecture Prototype
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">Academic & Research Rationale</h2>
          <p>
            FINORA was conceived as a master's thesis artifact to investigate the efficacy of automated portfolio rebalancing, unified digital asset ledger custody, and retail investor behavioral transparency within developing African capital markets, specifically centered in Ghana.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 mb-2">Core Platform Pillars</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li><strong>Fractional Unitized Custody:</strong> Enabling investors to access treasury notes and sovereign bonds at fractional increments starting from GH₵100.</li>
            <li><strong>Dual-Role Architecture:</strong> Demonstrating both the retail investor lifecycle and the compliance administrator oversight workstation within a synchronized state engine.</li>
            <li><strong>Prudent Financial Design:</strong> Stripping away speculative gamification, adhering to strict tabular financial typography, and prioritizing risk literacy.</li>
          </ul>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
          <strong>Disclaimer:</strong> All figures, yields, and corporate entities depicted in FINORA are fictional data sets created exclusively for educational demonstration.
        </div>
      </div>
    </div>
  );
};

export const PublicFaqView: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does investing work on FINORA?',
      a: 'Investors create an account, fund their cash ledger via mobile money or bank transfer, and allocate capital to curated investment products. FINORA simulates fractional unit issuance at the current Net Asset Value (NAV).',
    },
    {
      q: 'What are the risks associated with investments?',
      a: 'Investments are subject to market risks and value fluctuations. Fixed-income securities carry interest rate and duration risk, while equity portfolios carry volatility and potential capital loss. FINORA does not guarantee returns.',
    },
    {
      q: 'Can I withdraw my investment at any time?',
      a: 'Withdrawal processing depends on the liquidity profile of the selected product. Money Market funds settle within T+1 business days, while fixed-term debt or balanced portfolios may require a holding notice to preserve asset liquidation pricing.',
    },
    {
      q: 'What fees apply to investor accounts?',
      a: 'Management fees (ranging from 0.75% to 1.75% annualized) are accrued into the daily unit NAV price. Nominal payment gateway transfer fees apply to mobile money cash deposits and redemptions.',
    },
    {
      q: 'How is portfolio performance calculated?',
      a: 'Performance is calculated using time-weighted and money-weighted rates of return, comparing the total current market value of holdings against initial invested cost and realized distributions.',
    },
    {
      q: 'What happens when an investment loses value?',
      a: 'If market prices of underlying portfolio securities decline, the portfolio unit NAV adjusts downward accordingly. Gains or losses remain unrealized until redemption units are settled.',
    },
  ];

  return (
    <div className="py-16 max-w-3xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Detailed explanations of investment mechanics, fund valuation, and risk protocols.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xs">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full text-left p-4 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-900"
            >
              <span>{f.q}</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openIdx === i ? 'rotate-180 text-emerald-600' : ''}`} />
            </button>
            {openIdx === i && (
              <div className="p-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const PublicContactView: React.FC = () => {
  const { showToast } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Inquiry recorded! The project team will respond shortly.', 'success');
  };

  return (
    <div className="py-16 max-w-xl mx-auto px-4 sm:px-6">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div className="text-center mb-6">
          <Mail className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Contact Project Lead
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Questions regarding the FINORA academic prototype or dissertation research.
          </p>
        </div>

        {submitted ? (
          <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 text-center space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
            <div className="font-bold text-sm">Message Transmitted</div>
            <p>Thank you for your inquiry. A confirmation receipt has been simulated to {email}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Message / Inquiries
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
