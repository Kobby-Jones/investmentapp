import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, AlertTriangle, GraduationCap } from 'lucide-react';

export const FooterPublic: React.FC = () => {
  const { setPublicPage, setRole, setInvestorPage, setAdminPage } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      {/* Risk & Prototype Notice Banner */}
      <div className="bg-slate-950 border-b border-slate-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Academic Master's Degree Prototype</span>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-3xl mt-0.5">
                FINORA is a simulated educational prototype developed for a Master of Science in Financial Management capstone demonstration. All investor profiles, securities, asset values, transactions, and rates of return are fictional demonstration data. FINORA is not a licensed depository institution or broker-dealer.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setRole('investor');
                setInvestorPage('dashboard');
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-md font-semibold text-[11px]"
            >
              Open Investor Portal &rarr;
            </button>
            <button
              onClick={() => {
                setRole('admin');
                setAdminPage('overview');
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md font-semibold text-[11px]"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                F
              </div>
              <span className="text-base font-bold text-white tracking-tight">FINORA</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-4">
              Digital Investment & Portfolio Management. Providing unified digital asset allocation, automated portfolio tracking, and institutional-grade fund custody simulations.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>Accra, Ghana</span>
              <span>·</span>
              <span>Financial Management Project</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setPublicPage('investments')} className="hover:text-white transition-colors">
                  Investment Products
                </button>
              </li>
              <li>
                <button onClick={() => setPublicPage('how-it-works')} className="hover:text-white transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => { setRole('investor'); setInvestorPage('marketplace'); }} className="hover:text-white transition-colors">
                  Marketplace Demo
                </button>
              </li>
              <li>
                <button onClick={() => { setRole('admin'); setAdminPage('overview'); }} className="hover:text-white transition-colors">
                  Admin Console
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Education</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setPublicPage('about')} className="hover:text-white transition-colors">
                  About Project
                </button>
              </li>
              <li>
                <button onClick={() => setPublicPage('faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => setPublicPage('home')} className="hover:text-white transition-colors">
                  Risk Assessment
                </button>
              </li>
              <li>
                <button onClick={() => setPublicPage('home')} className="hover:text-white transition-colors">
                  Asset Diversification
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Legal & Risk</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setPublicPage('faq')} className="hover:text-white transition-colors">
                  Risk Disclosure
                </button>
              </li>
              <li>
                <button onClick={() => setPublicPage('faq')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => setPublicPage('faq')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setPublicPage('contact')} className="hover:text-white transition-colors">
                  Contact Academic Lead
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom disclosure */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} FINORA Digital Investment & Portfolio Management. Academic Demonstration Prototype.
          </div>
          <div className="flex items-center gap-4">
            <span>No Guaranteed Returns</span>
            <span>·</span>
            <span>Subject to Capital Loss</span>
            <span>·</span>
            <span>Simulated Currency: GH₵ (Ghanaian Cedi)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
