import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Sliders,
  Bot,
  Zap,
  Sun,
  BatteryCharging,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  User,
  ShieldCheck
} from 'lucide-react';
import { useEcoFlux } from '../../lib/dataStore';
import { GlobalSearchModal } from './GlobalSearchModal';

interface DashboardHeaderProps {
  onMenuToggle: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuToggle }) => {
  const {
    user,
    totalDemandKw,
    solarKw,
    renewablePct,
    battery,
    notifications,
    markNotificationRead,
    clearAllNotifications
  } = useEcoFlux();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#050a08]/90 backdrop-blur-xl border-b border-emerald-500/15">
      {/* Real-time Campus Status Ticker Bar */}
      <div className="bg-[#07130e] border-b border-emerald-500/10 px-4 sm:px-6 py-1.5 flex items-center justify-between text-xs overflow-x-auto gap-4 scrollbar-none">
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            CAMPUS ENERGY STATUS:
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
            NORMAL
          </span>
        </div>

        <div className="flex items-center gap-6 shrink-0 text-slate-300 font-mono text-[11px]">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            Demand: <strong className="text-white">{totalDemandKw} kW</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            Solar: <strong className="text-white">{solarKw} kW ({renewablePct}%)</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
            BESS: <strong className="text-white">{battery.operatingMode.toUpperCase()} ({battery.stateOfChargePct}%)</strong>
          </span>
          <span className="hidden md:flex items-center gap-1.5 text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
            Predicted Peak: <strong className="text-slate-200">2:30 PM (512 kW)</strong>
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* Left Side: Mobile Menu toggle + Search / Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/5"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Interactive Search Bar Trigger (Opens Global Search Command Palette) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 text-xs text-slate-400 hover:text-slate-200 w-44 sm:w-64 transition-all group"
            title="Search campus facilities, pages, telemetry (Ctrl+K)"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
              <span className="truncate">Search buildings, telemetry...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded group-hover:text-emerald-300">
              <span className="text-[9px]">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right Side: Quick Action Chips + Notifications + Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Shortcuts */}
          <Link
            to="/simulator"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>What-If Simulator</span>
          </Link>

          <Link
            to="/copilot"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/20 transition-all"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Copilot</span>
          </Link>

          {/* Notifications Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 border border-white/5 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            {/* Notifications Drawer */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#091510] border border-emerald-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-500/15">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">Campus Alerts</h4>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-emerald-400 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="p-1 rounded-md text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1">
                  {notifications.map((item) => {
                    const iconMap = {
                      alert: <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />,
                      warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
                      success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
                      info: <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                    };

                    return (
                      <div
                        key={item.id}
                        onClick={() => markNotificationRead(item.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          item.isRead
                            ? 'bg-white/[0.02] border-white/5 opacity-70'
                            : 'bg-emerald-500/10 border-emerald-500/20 shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {iconMap[item.type]}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-semibold text-white truncate">{item.title}</span>
                              <span className="text-[10px] text-slate-500 font-mono shrink-0">{item.timeAgo}</span>
                            </div>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.message}</p>
                            {item.actionUrl && (
                              <Link
                                to={item.actionUrl}
                                onClick={() => setNotificationsOpen(false)}
                                className="inline-block text-[11px] text-emerald-400 font-semibold mt-1.5 hover:underline"
                              >
                                View Telemetry →
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Profile Shortcut */}
          <Link
            to="/profile"
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/30 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs">
              {user?.fullName?.charAt(0) || 'C'}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-200">{user?.fullName?.split(' ')[0] || 'Manager'}</span>
          </Link>

        </div>
      </div>

      {/* Global Command Palette Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};
