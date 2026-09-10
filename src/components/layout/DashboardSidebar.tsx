import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  Sun,
  BatteryCharging,
  Users,
  TrendingUp,
  Sparkles,
  Sliders,
  Bot,
  Award,
  FileText,
  Settings,
  User,
  LogOut,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { useEcoFlux } from '../../lib/dataStore';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout, recommendations, notifications } = useEcoFlux();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const activeRecsCount = recommendations.filter(r => r.status === 'active').length;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Energy Consumption', path: '/energy', icon: Zap },
    { name: 'Solar Generation', path: '/solar', icon: Sun },
    { name: 'Battery Monitoring', path: '/battery', icon: BatteryCharging },
    { name: 'Occupancy Heatmap', path: '/occupancy', icon: Users, badge: '1 alert', badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
    { name: 'AI Prediction', path: '/predictions', icon: TrendingUp },
    { name: 'Recommendations', path: '/recommendations', icon: Sparkles, badge: activeRecsCount > 0 ? `${activeRecsCount}` : undefined, badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { name: 'What-If Simulator', path: '/simulator', icon: Sliders },
    { name: 'AI Energy Copilot', path: '/copilot', icon: Bot, badge: 'AI', badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    { name: 'Green Building Score', path: '/green-score', icon: Award },
    { name: 'Reports & Analytics', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#07110d] border-r border-emerald-500/15 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between h-16 px-5 border-b border-emerald-500/15">
            <NavLink to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Zap className="w-4 h-4 text-black fill-black" />
              </div>
              <span className="font-extrabold text-lg tracking-wider text-white">
                ECO<span className="text-emerald-400">FLEX</span>
              </span>
            </NavLink>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)]">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Campus Telemetry
            </div>

            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${item.badgeColor || 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Profile & Sign Out */}
        <div className="p-3 border-t border-emerald-500/15 bg-[#050b08]/70">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 mb-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-xs shrink-0">
                {user?.fullName?.charAt(0) || 'C'}
              </div>
              <div className="truncate">
                <span className="block text-xs font-semibold text-white truncate">{user?.fullName || 'Campus Manager'}</span>
                <span className="block text-[10px] text-slate-400 truncate">{user?.role || 'Administrator'}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>GVIT-01 Grid Sync</span>
            </span>
            <span>v2.4 Pro</span>
          </div>
        </div>
      </aside>
    </>
  );
};
