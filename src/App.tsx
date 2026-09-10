import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EcoFluxProvider } from './lib/dataStore';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Protected Dashboard Layout & Pages
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { EnergyConsumptionPage } from './pages/EnergyConsumptionPage';
import { SolarGenerationPage } from './pages/SolarGenerationPage';
import { BatteryMonitoringPage } from './pages/BatteryMonitoringPage';
import { OccupancyMonitoringPage } from './pages/OccupancyMonitoringPage';
import { AIPredictionPage } from './pages/AIPredictionPage';
import { AIRecommendationsPage } from './pages/AIRecommendationsPage';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulatorPage';
import { AICopilotPage } from './pages/AICopilotPage';
import { GreenBuildingScorePage } from './pages/GreenBuildingScorePage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';

export const App: React.FC = () => {
  return (
    <EcoFluxProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Protected Application Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/energy" element={<EnergyConsumptionPage />} />
            <Route path="/solar" element={<SolarGenerationPage />} />
            <Route path="/battery" element={<BatteryMonitoringPage />} />
            <Route path="/occupancy" element={<OccupancyMonitoringPage />} />
            <Route path="/predictions" element={<AIPredictionPage />} />
            <Route path="/recommendations" element={<AIRecommendationsPage />} />
            <Route path="/simulator" element={<WhatIfSimulatorPage />} />
            <Route path="/copilot" element={<AICopilotPage />} />
            <Route path="/green-score" element={<GreenBuildingScorePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </EcoFluxProvider>
  );
};

export default App;
