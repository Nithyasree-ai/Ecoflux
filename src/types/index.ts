// TypeScript interfaces for ECOFLUX Smart Energy Management System

export type BuildingCategory = 'Academic' | 'Hostel' | 'Administrative' | 'Laboratory' | 'Dining';

export type BuildingStatus = 'optimal' | 'normal' | 'alert' | 'warning';

export interface Building {
  id: string;
  code: string;
  name: string;
  category: BuildingCategory;
  grossAreaSqft: number;
  designedOccupancy: number;
  solarInstalledKw: number;
  baseLoadKw: number;
  currentDemandKw: number;
  currentOccupancy: number;
  occupancyPct: number;
  currentGreenScore: number;
  status: BuildingStatus;
  hvacStatus: 'active' | 'eco' | 'standby' | 'alert';
  temperatureC: number;
}

export interface EnergyTelemetry {
  timestamp: string;
  timeLabel: string;
  totalDemandKw: number;
  hvacKw: number;
  lightingKw: number;
  equipmentKw: number;
  gridDrawKw: number;
  solarContributionKw: number;
}

export interface BuildingEnergyData {
  buildingId: string;
  buildingName: string;
  demandKw: number;
  dailyKwh: number;
  weeklyKwh: number;
  monthlyKwh: number;
  peakDemandKw: number;
  trendPct: number;
  occupancyPct: number;
  status: BuildingStatus;
}

export interface SolarTelemetry {
  timestamp: string;
  timeLabel: string;
  generationKw: number;
  historicalAvgKw: number;
  irradianceWm2: number;
  efficiencyPct: number;
  cloudCoverPct: number;
  ambientTempC: number;
}

export interface BatteryState {
  stateOfChargePct: number;
  capacityKwh: number;
  currentStoredKwh: number;
  flowRateKw: number; // Positive = charging, negative = discharging
  operatingMode: 'charging' | 'discharging' | 'idle';
  dispatchMode: 'CHARGE' | 'DISCHARGE' | 'AUTO';
  status: 'CHARGING' | 'DISCHARGING' | 'IDLE' | 'STANDBY';
  cellPackStatus: 'NORMAL' | 'WARNING' | 'CRITICAL';
  aiDecisionTitle: string;
  aiDecisionReason: string;
  cellHealthPct: number;
  cellTempC: number;
  estimatedBackupHours: number;
  cyclesCompleted: number;
  lastUpdated: string;
  protectionWarning?: string;
}

export interface BessCentralState {
  soc: number;
  storedEnergy: number;
  activeFlow: number;
  backupTime: number;
  packHealth: number;
  packTemperature: number;
  cellHealth: number;
  cycles: number;
  dispatchMode: 'CHARGE' | 'DISCHARGE' | 'AUTO';
  status: 'CHARGING' | 'DISCHARGING' | 'IDLE' | 'STANDBY';
  cellPackStatus: 'NORMAL' | 'WARNING' | 'CRITICAL';
  aiDecisionTitle: string;
  aiDecisionReason: string;
  capacityKwh: number;
  protectionWarning?: string;
}

export interface OccupancyTelemetry {
  buildingId: string;
  buildingName: string;
  headcount: number;
  capacity: number;
  occupancyPct: number;
  energyDemandKw: number;
  energyPerCapitaKw: number;
  anomalyDetected: boolean;
  anomalyReason?: string;
  status: 'optimal' | 'moderate' | 'high' | 'anomaly';
}

export interface HeatmapPeriod {
  period: string;
  label: string;
  occupancyPct: number;
  demandKw: number;
  status: 'anomaly' | 'high-utilization' | 'efficient' | 'low-use';
  statusLabel: string;
  notes: string;
}

export interface FacilityData {
  code: string;
  name: string;
  category: string;
  occupancy: number;
  capacity: number;
  headcount: number;
  powerDraw: number;
  baseLoad: number;
  greenScore: number;
  solarAllocation: number;
  temperature: number;
  energyPerPerson: number;
  historicalAverage: number;
  anomalyStatus: 'optimal' | 'normal' | 'warning' | 'alert';
  anomalyDetected: boolean;
  anomalyTitle?: string;
  anomalyDescription?: string;
  wastedEnergyCost?: number;
  heatmapSchedule: HeatmapPeriod[];
}

export interface EnergyPredictionPoint {
  timestamp: string;
  timeLabel: string;
  actualDemandKw?: number;
  predictedDemandKw: number;
  predictedSolarKw: number;
  netGapKw: number;
  confidenceLow: number;
  confidenceHigh: number;
}

export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low';
export type RecommendationCategory =
  | 'Energy Saving'
  | 'Solar Optimization'
  | 'Battery Optimization'
  | 'Peak Demand Alert'
  | 'Occupancy'
  | 'Renewable Energy';

export interface AIRecommendation {
  id: string;
  category: RecommendationCategory;
  title: string;
  description: string;
  reason: string;
  priority: RecommendationPriority;
  estimatedKwhSaving: number;
  estimatedDollarSaving: number;
  co2ReductionKg: number;
  status: 'active' | 'applied' | 'dismissed';
  createdAt: string;
}

export interface SimulationParams {
  solarCapacityAddKw: number;
  batteryCapacityAddKwh: number;
  occupancyShiftPct: number;
  hvacTempOffsetC: number;
  lightingEfficiencyPct: number;
  operatingHoursReductionHours: number;
}

export interface SimulationResult {
  currentDailyCostUsd: number;
  projectedDailyCostUsd: number;
  dailySavingsUsd: number;
  annualSavingsUsd: number;
  currentSolarPct: number;
  projectedSolarPct: number;
  co2ReductionTonsYear: number;
  batteryUtilizationPct: number;
  peakGridDemandKw: number;
  aiRecommendation: string;
}

export interface GreenBuildingScoreItem {
  id: string;
  buildingName: string;
  category: BuildingCategory;
  overallScore: number;
  energyEfficiency: number;
  renewableRatio: number;
  occupancyAlignment: number;
  peakShaving: number;
  rank: number;
  badge: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  monthlyChange: number;
}

export interface NotificationItem {
  id: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'Campus Administrator' | 'Energy Operations Lead' | 'Sustainability Officer' | 'Student Researcher';
  institution: string;
  campusCode: string;
  avatarUrl?: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  highlightStats?: { label: string; value: string; color?: string }[];
  actionRecommendation?: {
    title: string;
    buttonText: string;
    route?: string;
  };
}

export interface BuildingDemandDistribution {
  name: string;
  fullName: string;
  demand: number;
  solar?: number;
  occupancy?: number;
  status: BuildingStatus;
}

export interface FacilitySolarProfile {
  facilityCode: string;
  facilityName: string;
  capacityKw: number;
  pctOfTotal: number;
  todayGeneratedKwh: number;
  benchmarkDiffPct: number;
  peakKw: number;
  hourly: SolarTelemetry[];
}

export interface FacilityAtmosphericTelemetry {
  ambientTemperature: string;
  pvSurfaceTemperature: string;
  solarArrayAzimuth: string;
  tiltAngle: string;
  bessAbsorptionRate: string;
}
