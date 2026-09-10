import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcoFlux } from '../../lib/dataStore';
import {
  Search,
  X,
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
  Building,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { buildings, solarKw, totalDemandKw, battery } = useEcoFlux();

  // Navigation pages list
  const pages = [
    { title: 'Smart Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Pages', description: 'Main campus overview, KPI cards & Bento charts' },
    { title: 'Energy Consumption', path: '/energy', icon: Zap, category: 'Pages', description: 'Building-wise sub-metering and load distribution' },
    { title: 'Solar Generation', path: '/solar', icon: Sun, category: 'Pages', description: '318 kW rooftop array production and weather feeds' },
    { title: 'Battery Monitoring', path: '/battery', icon: BatteryCharging, category: 'Pages', description: '1.2 MWh BESS liquid charge levels and autonomous dispatch' },
    { title: 'Occupancy Heatmap', path: '/occupancy', icon: Users, category: 'Pages', description: 'Live occupancy density and low-occupancy idle waste alerts' },
    { title: 'AI Energy Prediction', path: '/predictions', icon: TrendingUp, category: 'Pages', description: '24-hour demand forecasting and peak window analytics' },
    { title: 'AI Recommendations', path: '/recommendations', icon: Sparkles, category: 'Pages', description: 'Actionable microgrid optimization with instant savings' },
    { title: 'What-If Simulator', path: '/simulator', icon: Sliders, category: 'Pages', description: 'Test solar & battery sizing with dynamic scenario sliders' },
    { title: 'AI Energy Copilot', path: '/copilot', icon: Bot, category: 'Pages', description: 'Conversational assistant answering campus energy queries' },
    { title: 'Green Building Score', path: '/green-score', icon: Award, category: 'Pages', description: '0-100 gamified leaderboard and campus sustainability trophy' },
    { title: 'Reports & Analytics', path: '/reports', icon: FileText, category: 'Pages', description: 'Download CSV telemetry and printable PDF compliance audits' },
    { title: 'Settings', path: '/settings', icon: Settings, category: 'Pages', description: 'Configure campus thresholds and automated AI dispatch rules' },
    { title: 'Operator Profile', path: '/profile', icon: User, category: 'Pages', description: 'User permissions, institutional affiliation, and security audit log' },
  ];

  // Buildings list mapped to search results
  const buildingResults = buildings.map((b) => ({
    title: b.name,
    code: b.code,
    path: '/energy',
    icon: Building,
    category: 'Campus Buildings',
    badge: `${b.currentDemandKw} kW`,
    badgeSub: `${b.occupancyPct}% occupancy`,
    status: b.status,
    description: `${b.category} • ${b.grossAreaSqft.toLocaleString()} sqft • ${b.solarInstalledKw} kW Solar`
  }));

  // Quick telemetry alerts
  const telemetryResults = [
    { title: 'Total Campus Load', path: '/energy', icon: Zap, category: 'Live Telemetry', badge: `${totalDemandKw} kW`, description: 'Current aggregated demand across 8 buildings' },
    { title: 'Rooftop Solar Output', path: '/solar', icon: Sun, category: 'Live Telemetry', badge: `${solarKw} kW`, description: 'Peak generation window active (+14% vs yesterday)' },
    { title: 'BESS Battery Storage', path: '/battery', icon: BatteryCharging, category: 'Live Telemetry', badge: `${battery.stateOfChargePct}% SoC`, description: `${battery.currentStoredKwh} kWh stored • Charging mode` },
    { title: 'Hostel A Anomaly Alert', path: '/occupancy', icon: AlertTriangle, category: 'Live Telemetry', badge: '71.4 kW', description: 'High idle consumption despite 29.5% occupancy' },
  ];

  // Filter results
  const q = query.toLowerCase().trim();
  const filteredPages = q ? pages.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) : pages.slice(0, 5);
  const filteredBuildings = q ? buildingResults.filter(b => b.title.toLowerCase().includes(q) || b.code.toLowerCase().includes(q) || b.description.toLowerCase().includes(q)) : buildingResults.slice(0, 4);
  const filteredTelemetry = q ? telemetryResults.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) : telemetryResults.slice(0, 2);

  const allItems = [
    ...filteredBuildings,
    ...filteredPages,
    ...filteredTelemetry
  ];

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (allItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + allItems.length) % (allItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (allItems[selectedIndex]) {
          navigate(allItems[selectedIndex].path);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, allItems, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#091510] border border-emerald-500/30 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-2xl z-10 animate-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-emerald-500/15 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search campus buildings, telemetry, solar, battery, or tools..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-slate-400 border border-white/10 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results Stream */}
        <div className="max-h-[420px] overflow-y-auto p-3 space-y-4">
          {allItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-white">No campus records found</p>
              <p className="text-xs text-slate-400 mt-1">
                No matching buildings, telemetry channels, or modules for "{query}".
              </p>
            </div>
          ) : (
            <>
              {/* Campus Buildings Category */}
              {filteredBuildings.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Campus Facilities
                  </div>
                  <div className="space-y-1">
                    {filteredBuildings.map((b, idx) => {
                      const isSelected = selectedIndex === idx;
                      const isWarning = b.status === 'warning';
                      return (
                        <div
                          key={b.title}
                          onClick={() => {
                            navigate(b.path);
                            onClose();
                          }}
                          className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-emerald-500/20 border border-emerald-500/40'
                              : 'bg-white/[0.02] hover:bg-white/[0.05] border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`p-2 rounded-xl shrink-0 ${isWarning ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                              <b.icon className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-xs sm:text-sm truncate">{b.title}</span>
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400">
                                  {b.code}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 truncate block mt-0.5">{b.description}</span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className={`font-mono font-bold text-xs ${isWarning ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {b.badge}
                            </span>
                            <span className="block text-[10px] text-slate-500">{b.badgeSub}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation Pages Category */}
              {filteredPages.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Platform Hubs & Pages
                  </div>
                  <div className="space-y-1">
                    {filteredPages.map((p, idx) => {
                      const itemIndex = filteredBuildings.length + idx;
                      const isSelected = selectedIndex === itemIndex;
                      const IconComponent = p.icon;
                      return (
                        <div
                          key={p.title}
                          onClick={() => {
                            navigate(p.path);
                            onClose();
                          }}
                          className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-emerald-500/20 border border-emerald-500/40'
                              : 'bg-white/[0.02] hover:bg-white/[0.05] border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <span className="font-bold text-white text-xs sm:text-sm block">{p.title}</span>
                              <span className="text-[11px] text-slate-400 truncate block mt-0.5">{p.description}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 shrink-0">
                            <span>Open</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Live Telemetry Category */}
              {filteredTelemetry.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Live Telemetry Channels
                  </div>
                  <div className="space-y-1">
                    {filteredTelemetry.map((t, idx) => {
                      const itemIndex = filteredBuildings.length + filteredPages.length + idx;
                      const isSelected = selectedIndex === itemIndex;
                      const IconComponent = t.icon;
                      return (
                        <div
                          key={t.title}
                          onClick={() => {
                            navigate(t.path);
                            onClose();
                          }}
                          className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-emerald-500/20 border border-emerald-500/40'
                              : 'bg-white/[0.02] hover:bg-white/[0.05] border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <span className="font-bold text-white text-xs sm:text-sm block">{t.title}</span>
                              <span className="text-[11px] text-slate-400 truncate block mt-0.5">{t.description}</span>
                            </div>
                          </div>

                          <span className="font-mono font-bold text-xs text-amber-300 shrink-0">
                            {t.badge}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Key Hints */}
        <div className="p-3 border-t border-emerald-500/15 bg-black/40 flex items-center justify-between text-[11px] text-slate-400 font-mono px-4">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <span>EcoFlex Command Hub</span>
        </div>

      </div>
    </div>
  );
};
