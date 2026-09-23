import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  Shield,
  ChevronDown
} from 'lucide-react';

interface InvestorTopbarProps {
  onOpenMobileMenu: () => void;
}

export const InvestorTopbar: React.FC<InvestorTopbarProps> = ({ onOpenMobileMenu }) => {
  const {
    user,
    firebaseUser,
    signOutUser,
    notifications,
    setInvestorPage,
    setRole,
    setAdminPage,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [notifDropdown, setNotifDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile trigger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products, holdings, or transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Right: Role switcher, Notifications, and Profile */}
      <div className="flex items-center gap-3">
        {/* Switch to Admin Quick Button */}
        <button
          onClick={() => {
            setRole('admin');
            setAdminPage('overview');
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
        >
          <Shield className="w-3.5 h-3.5 text-slate-500" />
          <span>Admin Portal</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdown(!notifDropdown)}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
            )}
          </button>

          {notifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">
                  Notifications ({unreadNotifs.length} unread)
                </span>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 py-1">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                    }}
                    className={`py-2.5 px-2 rounded-lg cursor-pointer transition-colors ${
                      n.read ? 'hover:bg-slate-50 opacity-80' : 'bg-emerald-50/40 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900 leading-tight">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">{n.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setNotifDropdown(false);
                    setInvestorPage('notifications');
                  }}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  View all in Notification Center &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setUserDropdown(!userDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center overflow-hidden">
              {firebaseUser?.photoURL ? (
                <img src={firebaseUser.photoURL} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                user.fullName.split(' ').map((n) => n[0]).join('')
              )}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-slate-900 leading-tight">
                {user.fullName}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                {user.kycStatus === 'Verified' ? (
                  <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                    <CheckCircle className="w-3 h-3" /> KYC Verified
                  </span>
                ) : user.kycStatus === 'Under Review' ? (
                  <span className="text-amber-600 font-medium flex items-center gap-0.5">
                    <Clock className="w-3 h-3" /> Under Review
                  </span>
                ) : (
                  <span className="text-rose-600 font-medium flex items-center gap-0.5">
                    <AlertCircle className="w-3 h-3" /> Action Required
                  </span>
                )}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {userDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5">
              <div className="p-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">{user.fullName}</div>
                <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                {firebaseUser && (
                  <span className="inline-block mt-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Firebase Connected
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setInvestorPage('profile');
                  setUserDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Profile & Verification
              </button>
              <button
                onClick={() => {
                  setInvestorPage('settings');
                  setUserDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Account Settings
              </button>
              <button
                onClick={() => {
                  setRole('admin');
                  setAdminPage('overview');
                  setUserDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-emerald-700 hover:bg-emerald-50 rounded-lg font-medium"
              >
                Open Admin Portal
              </button>
              <div className="pt-1 mt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setUserDropdown(false);
                    signOutUser();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
