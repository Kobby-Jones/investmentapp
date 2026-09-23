import React from 'react';
import { useApp, InvestorPage } from '../../context/AppContext';
import {
  LayoutDashboard,
  Compass,
  Briefcase,
  History,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  Bell,
  UserCheck,
  Settings,
  LogOut,
  PlusCircle,
  X
} from 'lucide-react';

interface InvestorSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const InvestorSidebar: React.FC<InvestorSidebarProps> = ({
  mobileOpen,
  setMobileOpen,
}) => {
  const {
    investorPage,
    setInvestorPage,
    notifications,
    user,
    setRole,
    setPublicPage,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems: { id: InvestorPage; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'marketplace', label: 'Investments', icon: <Compass className="w-4 h-4" /> },
    { id: 'portfolio', label: 'Portfolio', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'transactions', label: 'Transactions', icon: <History className="w-4 h-4" /> },
    { id: 'deposits', label: 'Deposits', icon: <ArrowDownLeft className="w-4 h-4" /> },
    { id: 'withdrawals', label: 'Withdrawals', icon: <ArrowUpRight className="w-4 h-4" /> },
    { id: 'referrals', label: 'Referrals', icon: <Users className="w-4 h-4" /> },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      id: 'profile',
      label: 'Profile & KYC',
      icon: <UserCheck className="w-4 h-4" />,
      badge: user.kycStatus === 'Verified' ? undefined : user.kycStatus,
    },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSelect = (page: InvestorPage) => {
    setInvestorPage(page);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    setRole('public');
    setPublicPage('login');
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800">
      {/* Brand header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            F
          </div>
          <div>
            <div className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
              FINORA
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide">
              Portfolio Management
            </div>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation items */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Investor Portal
        </div>

        {navItems.map((item) => {
          const isActive = investorPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive
                      ? 'bg-emerald-700 text-emerald-100'
                      : typeof item.badge === 'number'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Available cash balance quick card */}
      <div className="p-3 mx-3 my-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
        <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
          Available Cash
        </div>
        <div className="text-lg font-bold font-mono text-white tabular-nums mt-0.5">
          GH₵{user.availableCashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        <button
          onClick={() => handleSelect('deposits')}
          className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Deposit Funds
        </button>
      </div>

      {/* User profile & Logout */}
      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center justify-between gap-2 px-2 py-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
              {user.fullName.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {user.fullName}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {user.email}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            className="text-slate-400 hover:text-rose-400 p-1 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
