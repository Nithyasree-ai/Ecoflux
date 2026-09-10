import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Building, 
  BatteryState, 
  AIRecommendation, 
  GreenBuildingScoreItem, 
  NotificationItem, 
  UserProfile, 
  CopilotMessage,
  SimulationParams,
  SimulationResult 
} from '../types';
import { 
  INITIAL_BUILDINGS, 
  INITIAL_BATTERY, 
  INITIAL_RECOMMENDATIONS, 
  GREEN_BUILDING_SCORES, 
  INITIAL_NOTIFICATIONS 
} from '../data/campusData';
import { calculateSimulation } from '../data/aiEngine';
import { generateCopilotResponse } from '../data/copilotEngine';
import { supabase, isSupabaseConfigured, DEMO_USER } from './supabase';

interface ToastMessage {
  id: string;
  type: 'success' | 'alert' | 'info' | 'warning';
  title: string;
  description?: string;
}

interface CampusSettings {
  campusName: string;
  campusCode: string;
  peakDemandThresholdKw: number;
  solarSurplusThresholdKw: number;
  batteryReserveMinPct: number;
  aiAutoDispatchEnabled: boolean;
  emailAlertsEnabled: boolean;
}

interface EcoFluxContextType {
  // Auth
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, pass: string, inst?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  
  // Data
  buildings: Building[];
  battery: BatteryState;
  solarKw: number;
  totalDemandKw: number;
  renewablePct: number;
  campusGreenScore: number;
  recommendations: AIRecommendation[];
  greenScores: GreenBuildingScoreItem[];
  notifications: NotificationItem[];
  copilotMessages: CopilotMessage[];
  campusSettings: CampusSettings;

  // Actions
  applyRecommendation: (id: string) => void;
  dismissRecommendation: (id: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  sendCopilotQuery: (query: string) => void;
  updateCampusSettings: (newSettings: Partial<CampusSettings>) => void;
  setBatteryModeOverride: (mode: 'charging' | 'discharging' | 'idle') => void;
  runSimulationScenario: (params: SimulationParams) => SimulationResult;

  // UI
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'alert' | 'info' | 'warning', title: string, description?: string) => void;
  removeToast: (id: string) => void;
}

const EcoFluxContext = createContext<EcoFluxContextType | undefined>(undefined);

export const EcoFluxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ecoflux_auth_user');
    return saved ? JSON.parse(saved) : DEMO_USER; // Default logged in as Campus Manager for immediate review
  });

  // Core Data state
  const [buildings, setBuildings] = useState<Building[]>(() => {
    const saved = localStorage.getItem('ecoflux_buildings');
    return saved ? JSON.parse(saved) : INITIAL_BUILDINGS;
  });

  const [battery, setBattery] = useState<BatteryState>(() => {
    const saved = localStorage.getItem('ecoflux_battery');
    return saved ? JSON.parse(saved) : INITIAL_BATTERY;
  });

  const [solarKw] = useState<number>(318);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(() => {
    const saved = localStorage.getItem('ecoflux_recommendations');
    return saved ? JSON.parse(saved) : INITIAL_RECOMMENDATIONS;
  });

  const [greenScores] = useState<GreenBuildingScoreItem[]>(GREEN_BUILDING_SCORES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('ecoflux_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [campusSettings, setCampusSettings] = useState<CampusSettings>(() => {
    const saved = localStorage.getItem('ecoflux_settings');
    return saved ? JSON.parse(saved) : {
      campusName: 'Green Valley Institute of Technology',
      campusCode: 'GVIT-CAMPUS-01',
      peakDemandThresholdKw: 500,
      solarSurplusThresholdKw: 280,
      batteryReserveMinPct: 20,
      aiAutoDispatchEnabled: true,
      emailAlertsEnabled: true
    };
  });

  // Copilot Messages
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: 'init-1',
      sender: 'copilot',
      text: '👋 Hello! I am your **EcoFlux Campus Energy Copilot**.\n\nI continuously monitor telemetry from all 8 buildings, rooftop solar arrays, and the 1.2 MWh central battery system. Ask me anything about demand peaks, efficiency anomalies, or recommended actions!',
      timestamp: '12:00 PM',
      highlightStats: [
        { label: 'Campus Demand', value: '482 kW', color: '#38bdf8' },
        { label: 'Solar Output', value: '318 kW', color: '#facc15' },
        { label: 'Clean Power', value: '61%', color: '#4ade80' }
      ]
    }
  ]);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'alert' | 'info' | 'warning', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ecoflux_buildings', JSON.stringify(buildings));
  }, [buildings]);

  useEffect(() => {
    localStorage.setItem('ecoflux_battery', JSON.stringify(battery));
  }, [battery]);

  useEffect(() => {
    localStorage.setItem('ecoflux_recommendations', JSON.stringify(recommendations));
  }, [recommendations]);

  useEffect(() => {
    localStorage.setItem('ecoflux_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ecoflux_settings', JSON.stringify(campusSettings));
  }, [campusSettings]);

  // Derived metrics
  const totalDemandKw = Math.round(buildings.reduce((acc, b) => acc + b.currentDemandKw, 0));
  const renewablePct = Math.min(99, Math.round((solarKw / totalDemandKw) * 100));
  const campusGreenScore = 86; // Overall weighted campus score

  // Auth Handlers
  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
        if (data.user) {
          const loggedInUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || 'Campus Administrator',
            role: 'Campus Administrator',
            institution: campusSettings.campusName,
            campusCode: campusSettings.campusCode
          };
          setUser(loggedInUser);
          localStorage.setItem('ecoflux_auth_user', JSON.stringify(loggedInUser));
          addToast('success', 'Logged In', `Welcome back, ${loggedInUser.fullName}`);
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Authentication failed' };
      }
    }

    // Seamless instant fallback (supports demo login)
    const mockUser: UserProfile = {
      ...DEMO_USER,
      email: email || DEMO_USER.email
    };
    setUser(mockUser);
    localStorage.setItem('ecoflux_auth_user', JSON.stringify(mockUser));
    addToast('success', 'Logged In Successfully', `Welcome to EcoFlux, ${mockUser.fullName}`);
    return { success: true };
  };

  const signup = async (name: string, email: string, pass: string, inst?: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: { full_name: name, institution: inst || campusSettings.campusName }
          }
        });
        if (error) throw error;
        if (data.user) {
          const newUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: name,
            role: 'Campus Administrator',
            institution: inst || campusSettings.campusName,
            campusCode: campusSettings.campusCode
          };
          setUser(newUser);
          localStorage.setItem('ecoflux_auth_user', JSON.stringify(newUser));
          addToast('success', 'Account Created', `Welcome to EcoFlux, ${name}!`);
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Registration failed' };
      }
    }

    // Offline / Demo Signup
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      fullName: name,
      role: 'Campus Administrator',
      institution: inst || 'Green Valley Institute of Technology',
      campusCode: 'GVIT-CAMPUS-01'
    };
    setUser(newUser);
    localStorage.setItem('ecoflux_auth_user', JSON.stringify(newUser));
    addToast('success', 'Account Created', `Welcome to EcoFlux, ${name}!`);
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('ecoflux_auth_user');
    addToast('info', 'Logged Out', 'You have been signed out of EcoFlux.');
  };

  // Actions
  const applyRecommendation = (id: string) => {
    const target = recommendations.find(r => r.id === id);
    if (!target) return;

    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, status: 'applied' as const } : r));

    // If Hostel A load shedding
    if (target.id.includes('HOST-A') || target.id === 'rec-04') {
      setBuildings(prev => prev.map(b => b.code === 'HOST-A' ? { ...b, currentDemandKw: 54.0, status: 'optimal' } : b));
    }
    // If Academic HVAC throttling
    if (target.id === 'rec-01') {
      setBuildings(prev => prev.map(b => b.code === 'ACAD' ? { ...b, currentDemandKw: 76.0, hvacStatus: 'eco' } : b));
    }

    addToast('success', 'Action Applied', `${target.title} executed. Estimated saving: $${target.estimatedDollarSaving}/day.`);
  };

  const dismissRecommendation = (id: string) => {
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, status: 'dismissed' as const } : r));
    addToast('info', 'Recommendation Dismissed', 'Insight removed from active dashboard queue.');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    addToast('info', 'Notifications Cleared', 'All alerts marked as read.');
  };

  const sendCopilotQuery = (queryText: string) => {
    const userMsg: CopilotMessage = {
      id: `usr-msg-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCopilotMessages(prev => [...prev, userMsg]);

    // Simulate AI response with realistic delay
    setTimeout(() => {
      const aiReply = generateCopilotResponse(queryText, buildings, battery, solarKw, totalDemandKw);
      setCopilotMessages(prev => [...prev, aiReply]);
    }, 650);
  };

  const updateCampusSettings = (newSettings: Partial<CampusSettings>) => {
    setCampusSettings(prev => ({ ...prev, ...newSettings }));
    addToast('success', 'Settings Saved', 'Campus configuration parameters successfully updated.');
  };

  const setBatteryModeOverride = (mode: 'charging' | 'discharging' | 'idle') => {
    setBattery(prev => ({
      ...prev,
      operatingMode: mode,
      flowRateKw: mode === 'charging' ? 84.5 : mode === 'discharging' ? -92.0 : 0,
      aiDecisionReason: `Manual override engaged by Campus Operator: Mode set to ${mode.toUpperCase()}.`
    }));
    addToast('info', 'Battery Dispatch Updated', `BESS operating state switched to ${mode.toUpperCase()}.`);
  };

  const runSimulationScenario = (params: SimulationParams): SimulationResult => {
    return calculateSimulation(params);
  };

  return (
    <EcoFluxContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        signup,
        logout,
        buildings,
        battery,
        solarKw,
        totalDemandKw,
        renewablePct,
        campusGreenScore,
        recommendations,
        greenScores,
        notifications,
        copilotMessages,
        campusSettings,
        applyRecommendation,
        dismissRecommendation,
        markNotificationRead,
        clearAllNotifications,
        sendCopilotQuery,
        updateCampusSettings,
        setBatteryModeOverride,
        runSimulationScenario,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </EcoFluxContext.Provider>
  );
};

export const useEcoFlux = () => {
  const context = useContext(EcoFluxContext);
  if (!context) {
    throw new Error('useEcoFlux must be used within an EcoFluxProvider');
  }
  return context;
};
