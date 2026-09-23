import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle2,
  PieChart,
  Lock,
  ChevronDown,
  Layers,
  BarChart3,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    products,
    setRole,
    setInvestorPage,
    setSelectedProductId,
    setPublicPage,
  } = useApp();

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const stats = [
    { label: 'Simulated Investors', value: '2,500+' },
    { label: 'Simulated AUM', value: 'GH₵18.4M' },
    { label: 'Active Fund Products', value: '12' },
    { label: 'Platform Availability', value: '98.4%' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Create an Account',
      desc: 'Register in seconds with your name, verified email, and phone number to initialize your investor wallet.',
    },
    {
      num: '02',
      title: 'Complete Your Profile',
      desc: 'Verify your identity (KYC) with standard national identification and link your preferred settlement account.',
    },
    {
      num: '03',
      title: 'Choose an Investment',
      desc: 'Browse calibrated funds from liquid money market instruments to diversified equity growth portfolios.',
    },
    {
      num: '04',
      title: 'Track Your Portfolio',
      desc: 'Monitor dynamic daily Net Asset Value (NAV), coupon distributions, gains, and performance metrics in real-time.',
    },
  ];

  const educationalTopics = [
    {
      title: 'Understanding Investment Risk',
      description: 'Every financial asset bears inherent risk. Treasury notes carry low capital risk, whereas equities carry short-term price fluctuations in pursuit of inflation-beating real growth.',
      badge: 'Core Concept',
    },
    {
      title: 'The Power of Diversification',
      description: 'Spreading holdings across non-correlated asset classes—money markets, sovereign bonds, and equities—cushions portfolios against unexpected market downturns.',
      badge: 'Portfolio Construction',
    },
    {
      title: 'Portfolio Performance & NAV',
      description: 'Net Asset Value represents the fair market value of all underlying assets minus management fees, calculated daily to give investors precise transparency.',
      badge: 'Valuation & Accounting',
    },
    {
      title: 'Disciplined Long-Term Investing',
      description: 'Historical financial markets demonstrate that staying invested through economic cycles with systematic reinvestment yields superior compounding over time.',
      badge: 'Wealth Compounding',
    },
  ];

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
    <div className="bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              FINORA Digital Portfolio Management Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Invest Smarter. <br />
              <span className="text-emerald-700">Track Every Move.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Explore diversified investment products, build resilient multi-asset portfolios, monitor dynamic valuations, and manage all your institutional investments from one unified platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setRole('investor');
                  setInvestorPage('dashboard');
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 group"
              >
                <span>Start Investing</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setRole('investor');
                  setInvestorPage('marketplace');
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold border border-slate-300 rounded-xl text-sm transition-all shadow-xs"
              >
                Explore Investments
              </button>
            </div>
          </div>

          {/* Polished Visual Dashboard Preview */}
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-300 bg-white p-2 sm:p-4 shadow-xl">
            <div className="rounded-xl border border-slate-200 bg-slate-900 text-white p-4 sm:p-6 overflow-hidden">
              {/* Header preview row */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    FINORA Investor Console · Live Portfolio Session
                  </span>
                </div>
                <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
                  Valuation: GH₵13,284.50 (+6.28%)
                </div>
              </div>

              {/* Grid metrics in preview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/60">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Total Portfolio</div>
                  <div className="text-lg font-bold font-mono text-white mt-1">GH₵13,284.50</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">+6.28% return</div>
                </div>
                <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/60">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Invested Capital</div>
                  <div className="text-lg font-bold font-mono text-white mt-1">GH₵12,500.00</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">3 Active Funds</div>
                </div>
                <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/60">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Net Profit/Yield</div>
                  <div className="text-lg font-bold font-mono text-emerald-400 mt-1">+GH₵784.50</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Simulated demo</div>
                </div>
                <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/60">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Available Cash</div>
                  <div className="text-lg font-bold font-mono text-white mt-1">GH₵4,250.00</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Ready to deploy</div>
                </div>
              </div>

              {/* Chart simulation graphic */}
              <div className="h-32 bg-slate-950/60 rounded-lg p-3 border border-slate-800 flex items-end justify-between gap-1 sm:gap-2">
                {[30, 42, 40, 55, 62, 58, 70, 78, 74, 88, 92, 96, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-emerald-500/80 rounded-t-xs hover:bg-emerald-400 transition-all"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Platform Statistics Section */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="p-4">
                <div className="text-3xl sm:text-4xl font-bold font-mono text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1.5">
                  {stat.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Simulated Prototype Figure</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
              How FINORA Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              A structured, transparent pathway designed for both new and experienced investors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs relative"
              >
                <div className="text-2xl font-bold font-mono text-emerald-600 mb-3">
                  {step.num}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Products Preview */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Curated Asset Offerings
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
                Investment Products Preview
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                All performance figures represent simulated academic demonstration models.
              </p>
            </div>
            <button
              onClick={() => {
                setRole('investor');
                setInvestorPage('marketplace');
              }}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              Explore Full Marketplace &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-slate-50/70 border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2 font-mono text-slate-500">
                    <span>Risk: {prod.riskRating}</span>
                    <span>Min: GH₵{prod.minInvestment}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {prod.description}
                  </p>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 mb-4 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Horizon:</span>
                      <span className="font-medium text-slate-800">{prod.horizon}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Demo Performance:</span>
                      <span className="font-mono font-semibold text-emerald-600">
                        {prod.demoHistoricalReturn}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Management Fee:</span>
                      <span className="font-mono text-slate-700">{prod.managementFee}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedProductId(prod.id);
                    setRole('investor');
                    setInvestorPage('product-details');
                  }}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  View Details & Strategy
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Section */}
      <section className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Financial Literacy & Prudence
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Essential Financial Management Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {educationalTopics.map((topic) => (
              <div
                key={topic.title}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs"
              >
                <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-2 font-mono">
                  {topic.badge}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {topic.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Answers & Clarifications
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl border border-slate-200 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4.5 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-4 font-semibold text-sm text-slate-900"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        isOpen ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4.5 pt-1 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
