import React, { useState } from 'react';
import { useEcoFlux } from '../lib/dataStore';
import { BentoCard } from '../components/common/BentoCard';
import {
  Settings,
  Building,
  Zap,
  Bell,
  Cpu,
  Shield,
  Save,
  CheckCircle2,
  Sliders,
  Sun,
  BatteryCharging
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { campusSettings, updateCampusSettings } = useEcoFlux();

  const [activeTab, setActiveTab] = useState<'campus' | 'thresholds' | 'ai' | 'notifications'>('campus');
  
  const [formData, setFormData] = useState({
    campusName: campusSettings.campusName,
    campusCode: campusSettings.campusCode,
    peakDemandThresholdKw: campusSettings.peakDemandThresholdKw,
    solarSurplusThresholdKw: campusSettings.solarSurplusThresholdKw,
    batteryReserveMinPct: campusSettings.batteryReserveMinPct,
    aiAutoDispatchEnabled: campusSettings.aiAutoDispatchEnabled,
    emailAlertsEnabled: campusSettings.emailAlertsEnabled
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCampusSettings(formData);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-emerald-400" />
            <span>Campus Configuration & Controls</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage contractual grid thresholds, autonomous dispatch rules, and facility parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#091510] border border-emerald-500/15 max-w-xl">
        {[
          { id: 'campus', label: 'Campus Info', icon: Building },
          { id: 'thresholds', label: 'Energy Thresholds', icon: Zap },
          { id: 'ai', label: 'AI Dispatch', icon: Cpu },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-black shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#091510] border border-emerald-500/20 backdrop-blur-xl max-w-3xl">
        <form onSubmit={handleSave} className="space-y-6">
          
          {activeTab === 'campus' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white mb-4">Institution & Sub-Grid Credentials</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Institution Name
                </label>
                <input
                  type="text"
                  value={formData.campusName}
                  onChange={(e) => setFormData({ ...formData, campusName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-emerald-500/20 text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Campus Identifier Code
                </label>
                <input
                  type="text"
                  value={formData.campusCode}
                  onChange={(e) => setFormData({ ...formData, campusCode: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-emerald-500/20 text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Utility Provider Substation
                </label>
                <input
                  type="text"
                  defaultValue="Pacific Grid Interconnect #442 (13.8 kV Substation)"
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-slate-400 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          )}

          {activeTab === 'thresholds' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white mb-4">Utility Contract & Grid Surcharge Limits</h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Peak Demand Cap (kW Threshold)
                </label>
                <input
                  type="number"
                  value={formData.peakDemandThresholdKw}
                  onChange={(e) => setFormData({ ...formData, peakDemandThresholdKw: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-emerald-500/20 text-white text-sm focus:outline-none focus:border-emerald-400 font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Alerts trigger whenever gross campus draw approaches 95% of this cap.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Solar Surplus Ingestion Floor (kW)
                </label>
                <input
                  type="number"
                  value={formData.solarSurplusThresholdKw}
                  onChange={(e) => setFormData({ ...formData, solarSurplusThresholdKw: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-emerald-500/20 text-white text-sm focus:outline-none focus:border-emerald-400 font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Surplus generation above this floor automatically triggers central battery charging.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Minimum BESS Reserve Capacity (%)
                </label>
                <input
                  type="number"
                  min="10"
                  max="40"
                  value={formData.batteryReserveMinPct}
                  onChange={(e) => setFormData({ ...formData, batteryReserveMinPct: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-emerald-500/20 text-white text-sm focus:outline-none focus:border-emerald-400 font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Battery will never discharge below this percentage to maintain critical emergency buffer.</span>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white mb-4">Autonomous Microgrid Optimization</h3>
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-emerald-500/15">
                <div>
                  <span className="text-sm font-bold text-white block">Autonomous Battery Peak Shaving</span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Allow EcoFlux AI to automatically trigger battery discharge during forecasted 2:30 PM peak.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.aiAutoDispatchEnabled}
                  onChange={(e) => setFormData({ ...formData, aiAutoDispatchEnabled: e.target.checked })}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-emerald-500/15">
                <div>
                  <span className="text-sm font-bold text-white block">Automatic Recess HVAC Setpoint Throttle</span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Adjust lecture hall cooling when turnstiles detect occupancy drop below 20%.
                  </span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white mb-4">Alert Distribution Preferences</h3>
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-emerald-500/15">
                <div>
                  <span className="text-sm font-bold text-white block">Email Dispatch for Anomaly Spikes</span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Send instantaneous alerts to facility engineers whenever idle load exceeds 20% baseline.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.emailAlertsEnabled}
                  onChange={(e) => setFormData({ ...formData, emailAlertsEnabled: e.target.checked })}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-emerald-500/10 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Campus Configuration</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
