import React, { useState } from 'react';
import { useApp, PublicPage } from '../../context/AppContext';
import { Menu, X, ArrowRight, Shield } from 'lucide-react';

export const HeaderPublic: React.FC = () => {
  const { publicPage, setPublicPage, setRole, setInvestorPage, firebaseUser, signInWithGoogle } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: PublicPage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'investments', label: 'Investments' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            setPublicPage('home');
          }}
          className="flex items-center gap-2 text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
            F
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            FINORA
          </span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => setPublicPage(item.id)}
              className={`transition-colors hover:text-slate-900 ${
                publicPage === item.id ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 pb-0.5' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions */}
        <div className="hidden md:flex items-center gap-3">
          {firebaseUser ? (
            <button
              onClick={() => {
                setRole('investor');
                setInvestorPage('dashboard');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs flex items-center gap-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={signInWithGoogle}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google Sign In</span>
              </button>
              <button
                onClick={() => setPublicPage('login')}
                className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => setPublicPage('register')}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
              >
                Create Account
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setPublicPage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-sm rounded-md ${
                  publicPage === item.id ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setPublicPage('login');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-center text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg"
            >
              Login
            </button>
            <button
              onClick={() => {
                setPublicPage('register');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-center text-xs font-semibold text-white bg-emerald-600 rounded-lg"
            >
              Create Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
