import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Coins,
  ShieldCheck,
  Check,
  Trash2,
  Clock,
  Info
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    showToast,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Notification Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            System notices, coupon credit alerts, KYC approvals, and order executions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Notices
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === 'unread'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unread
            </button>
          </div>

          <button
            onClick={() => {
              markAllNotificationsRead();
              showToast('All notifications marked as read.', 'success');
            }}
            className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Check className="w-3.5 h-3.5 text-slate-500" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No Notifications</h3>
            <p className="text-xs text-slate-500 mt-1">
              You are all caught up! There are no unread system notifications.
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => markNotificationRead(item.id)}
                className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                  item.read ? 'hover:bg-slate-50/60 opacity-80' : 'bg-emerald-50/30 hover:bg-emerald-50/50'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {item.type === 'success' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                  {item.type === 'info' && (
                    <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
                      <Info className="w-4 h-4" />
                    </div>
                  )}
                  {item.type === 'warning' && (
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  )}
                  {item.type === 'alert' && (
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-xs ${item.read ? 'font-semibold text-slate-800' : 'font-bold text-slate-900'}`}>
                      {item.title}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-2" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
