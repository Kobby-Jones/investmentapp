import React from 'react';
import { useApp, AdminPage } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Package,
  LineChart,
  ArrowDownLeft,
  ArrowUpRight,
  Briefcase,
  Percent,
  Share2,
  FileBarChart,
  ClipboardList,
  Settings,
  LogOut,
  User,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  mobileOpen,
  setMobileOpen,
}) => {
  const {
    adminPage,
    setAdminPage,
    setRole,
    setInvestorPage,
    kycQueue,
    withdrawalsQueue,
  } = useApp();

  const pendingKycCount = kycQueue.filter((k) => k.status === 'Pending' || k.status === 'Under Review').length;
  const pendingWthCount = withdrawalsQueue.filter((w) => w.status === 'Pending' || w.status === 'Under Review').length;

  const adminNav: { id: AdminPage; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    {
      id: 'kyc',
      label: 'KYC Verification',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: pendingKycCount > 0 ? pendingKycCount : undefined,
    },
    { id: 'products', label: 'Investment Products', icon: <Package className="w-4 h-4" /> },
    { id: 'investments', label: 'Investments', icon: <LineChart className="w-4 h-4" /> },
    { id: 'deposits', label: 'Deposits', icon: <ArrowDownLeft className="w-4 h-4" /> },
    {
      id: 'withdrawals',
      label: 'Withdrawals',
      icon: <ArrowUpRight className="w-4 h-4" />,
      badge: pendingWthCount > 0 ? pendingWthCount : undefined,
    },
    { id: 'reports', label: 'Reports & Analytics', icon: <FileBarChart className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit Logs', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'settings', label: 'Platform Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSelect = (page: AdminPage) => {
    setAdminPage(page);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300 border-r border-slate-800">
      {/* Brand header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            F
          </div>
          <div>
            <div className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
              FINORA
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                ADMIN
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide">
              Management Console
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
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Platform Administration
        </div>

        {adminNav.map((item) => {
          const isActive = adminPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-slate-800 text-emerald-400 font-semibold border-l-2 border-emerald-500'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-emerald-400' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono bg-amber-500/20 text-amber-300 font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Switch to Investor Mode pill */}
      <div className="p-3 mx-3 my-2 rounded-xl bg-slate-900 border border-slate-800">
        <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
          Switch Workspace
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
          View application as active retail investor Kwame Mensah.
        </p>
        <button
          onClick={() => {
            setRole('investor');
            setInvestorPage('dashboard');
          }}
          className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors"
        >
          <User className="w-3.5 h-3.5 text-emerald-400" />
          Investor Portal
        </button>
      </div>

      {/* Administrator Profile */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between gap-2 px-2 py-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">
              AD
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                Admin Console
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                compliance@finora.gh
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setRole('investor');
              setInvestorPage('dashboard');
            }}
            title="Return to Investor Dashboard"
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
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
