import { Building, BatteryState, EnergyTelemetry, SolarTelemetry, OccupancyTelemetry, GreenBuildingScoreItem, AIRecommendation, BuildingDemandDistribution, FacilitySolarProfile, FacilityAtmosphericTelemetry } from '../types';

export const INITIAL_BUILDINGS: Building[] = [
  {
    id: 'b-01',
    code: 'ACAD',
    name: 'Academic Block',
    category: 'Academic',
    grossAreaSqft: 65000,
    designedOccupancy: 600,
    solarInstalledKw: 95.0,
    baseLoadKw: 78.4,
    currentDemandKw: 88.5,
    currentOccupancy: 495,
    occupancyPct: 82.5,
    currentGreenScore: 88,
    status: 'optimal',
    hvacStatus: 'active',
    temperatureC: 22.8
  },
  {
    id: 'b-02',
    code: 'CS-LAB',
    name: 'Computer Science Block',
    category: 'Academic',
    grossAreaSqft: 48000,
    designedOccupancy: 450,
    solarInstalledKw: 110.0,
    baseLoadKw: 124.6,
    currentDemandKw: 136.2,
    currentOccupancy: 410,
    occupancyPct: 91.1,
    currentGreenScore: 92,
    status: 'optimal',
    hvacStatus: 'active',
    temperatureC: 21.5
  },
  {
    id: 'b-03',
    code: 'LIB',
    name: 'Central Library',
    category: 'Academic',
    grossAreaSqft: 35000,
    designedOccupancy: 350,
    solarInstalledKw: 65.0,
    baseLoadKw: 42.1,
    currentDemandKw: 46.8,
    currentOccupancy: 260,
    occupancyPct: 74.3,
    currentGreenScore: 81,
    status: 'optimal',
    hvacStatus: 'eco',
    temperatureC: 23.0
  },
  {
    id: 'b-04',
    code: 'HOST-A',
    name: 'Hostel Block A',
    category: 'Hostel',
    grossAreaSqft: 52000,
    designedOccupancy: 380,
    solarInstalledKw: 45.0,
    baseLoadKw: 68.2,
    currentDemandKw: 71.4,
    currentOccupancy: 112,
    occupancyPct: 29.5,
    currentGreenScore: 67,
    status: 'warning',
    hvacStatus: 'alert',
    temperatureC: 24.2
  },
  {
    id: 'b-05',
    code: 'HOST-B',
    name: 'Hostel Block B',
    category: 'Hostel',
    grossAreaSqft: 54000,
    designedOccupancy: 400,
    solarInstalledKw: 50.0,
    baseLoadKw: 64.9,
    currentDemandKw: 52.0,
    currentOccupancy: 135,
    occupancyPct: 33.8,
    currentGreenScore: 74,
    status: 'normal',
    hvacStatus: 'eco',
    temperatureC: 23.5
  },
  {
    id: 'b-06',
    code: 'ADMIN',
    name: 'Administration Wing',
    category: 'Administrative',
    grossAreaSqft: 28000,
    designedOccupancy: 200,
    solarInstalledKw: 35.0,
    baseLoadKw: 36.5,
    currentDemandKw: 39.1,
    currentOccupancy: 148,
    occupancyPct: 74.0,
    currentGreenScore: 89,
    status: 'optimal',
    hvacStatus: 'eco',
    temperatureC: 22.4
  },
  {
    id: 'b-07',
    code: 'ADV-LAB',
    name: 'Laboratory Block',
    category: 'Laboratory',
    grossAreaSqft: 58000,
    designedOccupancy: 320,
    solarInstalledKw: 80.0,
    baseLoadKw: 112.3,
    currentDemandKw: 118.0,
    currentOccupancy: 245,
    occupancyPct: 76.6,
    currentGreenScore: 79,
    status: 'normal',
    hvacStatus: 'active',
    temperatureC: 21.0
  },
  {
    id: 'b-08',
    code: 'CAFE',
    name: 'Campus Dining Hub',
    category: 'Dining',
    grossAreaSqft: 22000,
    designedOccupancy: 500,
    solarInstalledKw: 40.0,
    baseLoadKw: 54.0,
    currentDemandKw: 61.2,
    currentOccupancy: 380,
    occupancyPct: 76.0,
    currentGreenScore: 84,
    status: 'optimal',
    hvacStatus: 'active',
    temperatureC: 23.8
  }
];

// Building Load Distribution Datasets for Today, Week, and Month filters
export const todayData: BuildingDemandDistribution[] = [
  { name: 'ACAD', fullName: 'Academic Block', demand: 88.5, solar: 95.0, occupancy: 82.5, status: 'optimal' },
  { name: 'CS-LAB', fullName: 'Computer Science Block', demand: 136.2, solar: 110.0, occupancy: 91.1, status: 'optimal' },
  { name: 'LIB', fullName: 'Central Library', demand: 46.8, solar: 65.0, occupancy: 74.3, status: 'optimal' },
  { name: 'HOST-A', fullName: 'Hostel Block A', demand: 71.4, solar: 45.0, occupancy: 29.5, status: 'warning' },
  { name: 'HOST-B', fullName: 'Hostel Block B', demand: 52.0, solar: 50.0, occupancy: 33.8, status: 'normal' },
  { name: 'ADMIN', fullName: 'Administration Wing', demand: 39.1, solar: 35.0, occupancy: 74.0, status: 'optimal' },
  { name: 'ADV-LAB', fullName: 'Laboratory Block', demand: 118.0, solar: 80.0, occupancy: 76.6, status: 'normal' },
  { name: 'CAFE', fullName: 'Campus Dining Hub', demand: 61.2, solar: 40.0, occupancy: 76.0, status: 'optimal' },
];

export const weekData: BuildingDemandDistribution[] = [
  { name: 'ACAD', fullName: 'Academic Block', demand: 82.4, solar: 91.2, occupancy: 78.0, status: 'optimal' },
  { name: 'CS-LAB', fullName: 'Computer Science Block', demand: 124.8, solar: 104.5, occupancy: 86.4, status: 'optimal' },
  { name: 'LIB', fullName: 'Central Library', demand: 41.5, solar: 61.8, occupancy: 69.2, status: 'optimal' },
  { name: 'HOST-A', fullName: 'Hostel Block A', demand: 63.8, solar: 42.1, occupancy: 52.1, status: 'normal' },
  { name: 'HOST-B', fullName: 'Hostel Block B', demand: 56.4, solar: 48.0, occupancy: 49.6, status: 'normal' },
  { name: 'ADMIN', fullName: 'Administration Wing', demand: 35.6, solar: 33.4, occupancy: 71.2, status: 'optimal' },
  { name: 'ADV-LAB', fullName: 'Laboratory Block', demand: 109.5, solar: 76.2, occupancy: 72.8, status: 'normal' },
  { name: 'CAFE', fullName: 'Campus Dining Hub', demand: 57.3, solar: 38.5, occupancy: 64.5, status: 'normal' },
];

export const monthData: BuildingDemandDistribution[] = [
  { name: 'ACAD', fullName: 'Academic Block', demand: 76.8, solar: 88.0, occupancy: 75.4, status: 'optimal' },
  { name: 'CS-LAB', fullName: 'Computer Science Block', demand: 118.2, solar: 98.4, occupancy: 82.0, status: 'optimal' },
  { name: 'LIB', fullName: 'Central Library', demand: 39.0, solar: 58.2, occupancy: 65.0, status: 'optimal' },
  { name: 'HOST-A', fullName: 'Hostel Block A', demand: 58.5, solar: 40.5, occupancy: 58.4, status: 'normal' },
  { name: 'HOST-B', fullName: 'Hostel Block B', demand: 53.2, solar: 46.2, occupancy: 54.0, status: 'normal' },
  { name: 'ADMIN', fullName: 'Administration Wing', demand: 33.8, solar: 31.9, occupancy: 68.5, status: 'optimal' },
  { name: 'ADV-LAB', fullName: 'Laboratory Block', demand: 104.2, solar: 73.0, occupancy: 70.1, status: 'normal' },
  { name: 'CAFE', fullName: 'Campus Dining Hub', demand: 54.0, solar: 36.8, occupancy: 61.2, status: 'normal' },
];

export const INITIAL_BATTERY: BatteryState = {
  stateOfChargePct: 78.5,
  capacityKwh: 1200,
  currentStoredKwh: 942.0,
  flowRateKw: 84.5,
  operatingMode: 'charging',
  aiDecisionReason: 'Solar generation (318 kW) currently exceeds net campus base load (482 kW with 248 kW grid offset). Directing surplus solar to BESS storage.',
  cellHealthPct: 98.4,
  cellTempC: 24.2,
  estimatedBackupHours: 6.2,
  cyclesCompleted: 342,
  lastUpdated: 'Just now'
};

// 24-Hour Telemetry Profile
export const HOURLY_TELEMETRY: EnergyTelemetry[] = [
  { timestamp: '00:00', timeLabel: '12 AM', totalDemandKw: 280, hvacKw: 90, lightingKw: 60, equipmentKw: 130, gridDrawKw: 280, solarContributionKw: 0 },
  { timestamp: '02:00', timeLabel: '2 AM', totalDemandKw: 260, hvacKw: 85, lightingKw: 50, equipmentKw: 125, gridDrawKw: 260, solarContributionKw: 0 },
  { timestamp: '04:00', timeLabel: '4 AM', totalDemandKw: 255, hvacKw: 80, lightingKw: 45, equipmentKw: 130, gridDrawKw: 255, solarContributionKw: 0 },
  { timestamp: '06:00', timeLabel: '6 AM', totalDemandKw: 290, hvacKw: 95, lightingKw: 65, equipmentKw: 130, gridDrawKw: 285, solarContributionKw: 5 },
  { timestamp: '08:00', timeLabel: '8 AM', totalDemandKw: 380, hvacKw: 130, lightingKw: 100, equipmentKw: 150, gridDrawKw: 290, solarContributionKw: 90 },
  { timestamp: '10:00', timeLabel: '10 AM', totalDemandKw: 450, hvacKw: 160, lightingKw: 120, equipmentKw: 170, gridDrawKw: 210, solarContributionKw: 240 },
  { timestamp: '12:00', timeLabel: '12 PM', totalDemandKw: 490, hvacKw: 185, lightingKw: 125, equipmentKw: 180, gridDrawKw: 172, solarContributionKw: 318 },
  { timestamp: '14:00', timeLabel: '2 PM', totalDemandKw: 512, hvacKw: 195, lightingKw: 130, equipmentKw: 187, gridDrawKw: 222, solarContributionKw: 290 },
  { timestamp: '16:00', timeLabel: '4 PM', totalDemandKw: 470, hvacKw: 175, lightingKw: 120, equipmentKw: 175, gridDrawKw: 320, solarContributionKw: 150 },
  { timestamp: '18:00', timeLabel: '6 PM', totalDemandKw: 460, hvacKw: 160, lightingKw: 140, equipmentKw: 160, gridDrawKw: 425, solarContributionKw: 35 },
  { timestamp: '20:00', timeLabel: '8 PM', totalDemandKw: 395, hvacKw: 135, lightingKw: 120, equipmentKw: 140, gridDrawKw: 395, solarContributionKw: 0 },
  { timestamp: '22:00', timeLabel: '10 PM', totalDemandKw: 320, hvacKw: 110, lightingKw: 80, equipmentKw: 130, gridDrawKw: 320, solarContributionKw: 0 }
];

export const HOURLY_SOLAR: SolarTelemetry[] = [
  { timestamp: '06:00', timeLabel: '6 AM', generationKw: 8, historicalAvgKw: 6, irradianceWm2: 80, efficiencyPct: 91.0, cloudCoverPct: 5, ambientTempC: 22 },
  { timestamp: '08:00', timeLabel: '8 AM', generationKw: 92, historicalAvgKw: 84, irradianceWm2: 340, efficiencyPct: 93.5, cloudCoverPct: 8, ambientTempC: 24 },
  { timestamp: '10:00', timeLabel: '10 AM', generationKw: 245, historicalAvgKw: 228, irradianceWm2: 710, efficiencyPct: 94.8, cloudCoverPct: 12, ambientTempC: 27 },
  { timestamp: '12:00', timeLabel: '12 PM', generationKw: 318, historicalAvgKw: 295, irradianceWm2: 920, efficiencyPct: 95.6, cloudCoverPct: 6, ambientTempC: 29 },
  { timestamp: '14:00', timeLabel: '2 PM', generationKw: 292, historicalAvgKw: 275, irradianceWm2: 840, efficiencyPct: 94.2, cloudCoverPct: 10, ambientTempC: 30 },
  { timestamp: '16:00', timeLabel: '4 PM', generationKw: 155, historicalAvgKw: 142, irradianceWm2: 450, efficiencyPct: 93.0, cloudCoverPct: 15, ambientTempC: 28 },
  { timestamp: '18:00', timeLabel: '6 PM', generationKw: 36, historicalAvgKw: 30, irradianceWm2: 120, efficiencyPct: 90.5, cloudCoverPct: 10, ambientTempC: 26 },
  { timestamp: '19:00', timeLabel: '7 PM', generationKw: 0, historicalAvgKw: 0, irradianceWm2: 0, efficiencyPct: 0, cloudCoverPct: 10, ambientTempC: 25 }
];

// Dedicated Solar Profiles & Telemetry for Each Campus Facility
export const FACILITY_SOLAR_PROFILES: Record<string, FacilitySolarProfile> = {
  ACAD: {
    facilityCode: 'ACAD',
    facilityName: 'Academic Block',
    capacityKw: 95,
    pctOfTotal: 18,
    todayGeneratedKwh: 412,
    benchmarkDiffPct: 11.9,
    peakKw: 58.2,
    hourly: [
      { timestamp: '06:00', timeLabel: '6 AM', generationKw: 2.5, historicalAvgKw: 2.0, irradianceWm2: 80, efficiencyPct: 91.0, cloudCoverPct: 5, ambientTempC: 22 },
      { timestamp: '08:00', timeLabel: '8 AM', generationKw: 17.2, historicalAvgKw: 15.5, irradianceWm2: 340, efficiencyPct: 93.5, cloudCoverPct: 8, ambientTempC: 24 },
      { timestamp: '10:00', timeLabel: '10 AM', generationKw: 45.1, historicalAvgKw: 41.0, irradianceWm2: 710, efficiencyPct: 94.8, cloudCoverPct: 12, ambientTempC: 27 },
      { timestamp: '12:00', timeLabel: '12 PM', generationKw: 58.2, historicalAvgKw: 52.0, irradianceWm2: 920, efficiencyPct: 95.6, cloudCoverPct: 6, ambientTempC: 29 },
      { timestamp: '14:00', timeLabel: '2 PM', generationKw: 53.4, historicalAvgKw: 48.6, irradianceWm2: 840, efficiencyPct: 94.2, cloudCoverPct: 10, ambientTempC: 30 },
      { timestamp: '16:00', timeLabel: '4 PM', generationKw: 28.5, historicalAvgKw: 25.8, irradianceWm2: 450, efficiencyPct: 93.0, cloudCoverPct: 15, ambientTempC: 28 },
      { timestamp: '18:00', timeLabel: '6 PM', generationKw: 6.8, historicalAvgKw: 5.5, irradianceWm2: 120, efficiencyPct: 90.5, cloudCoverPct: 10, ambientTempC: 26 },
      { timestamp: '19:00', timeLabel: '7 PM', generationKw: 0, historicalAvgKw: 0, irradianceWm2: 0, efficiencyPct: 0, cloudCoverPct: 10, ambientTempC: 25 }
    ]
  },
  'CS-LAB': {
    facilityCode: 'CS-LAB',
    facilityName: 'Computer Science Block',
    capacityKw: 110,
    pctOfTotal: 21,
    todayGeneratedKwh: 495,
    benchmarkDiffPct: 12.5,
    peakKw: 69.5,
    hourly: [
      { timestamp: '06:00', timeLabel: '6 AM', generationKw: 3.1, historicalAvgKw: 2.6, irradianceWm2: 80, efficiencyPct: 91.0, cloudCoverPct: 5, ambientTempC: 22 },
      { timestamp: '08:00', timeLabel: '8 AM', generationKw: 20.5, historicalAvgKw: 18.2, irradianceWm2: 340, efficiencyPct: 93.5, cloudCoverPct: 8, ambientTempC: 24 },
      { timestamp: '10:00', timeLabel: '10 AM', generationKw: 54.2, historicalAvgKw: 48.5, irradianceWm2: 710, efficiencyPct: 94.8, cloudCoverPct: 12, ambientTempC: 27 },
      { timestamp: '12:00', timeLabel: '12 PM', generationKw: 69.5, historicalAvgKw: 61.8, irradianceWm2: 920, efficiencyPct: 95.6, cloudCoverPct: 6, ambientTempC: 29 },
      { timestamp: '14:00', timeLabel: '2 PM', generationKw: 63.8, historicalAvgKw: 57.0, irradianceWm2: 840, efficiencyPct: 94.2, cloudCoverPct: 10, ambientTempC: 30 },
      { timestamp: '16:00', timeLabel: '4 PM', generationKw: 34.0, historicalAvgKw: 30.5, irradianceWm2: 450, efficiencyPct: 93.0, cloudCoverPct: 15, ambientTempC: 28 },
      { timestamp: '18:00', timeLabel: '6 PM', generationKw: 8.2, historicalAvgKw: 6.8, irradianceWm2: 120, efficiencyPct: 90.5, cloudCoverPct: 10, ambientTempC: 26 },
      { timestamp: '19:00', timeLabel: '7 PM', generationKw: 0, historicalAvgKw: 0, irradianceWm2: 0, efficiencyPct: 0, cloudCoverPct: 10, ambientTempC: 25 }
    ]
  },
  LIB: {
    facilityCode: 'LIB',
    facilityName: 'Central Library',
    capacityKw: 65,
    pctOfTotal: 13,
    todayGeneratedKwh: 288,
    benchmarkDiffPct: 11.4,
    peakKw: 41.2,
    hourly: [
      { timestamp: '06:00', timeLabel: '6 AM', generationKw: 1.8, historicalAvgKw: 1.4, irradianceWm2: 80, efficiencyPct: 91.0, cloudCoverPct: 5, ambientTempC: 22 },
      { timestamp: '08:00', timeLabel: '8 AM', generationKw: 11.8, historicalAvgKw: 10.4, irradianceWm2: 340, efficiencyPct: 93.5, cloudCoverPct: 8, ambientTempC: 24 },
      { timestamp: '10:00', timeLabel: '10 AM', generationKw: 31.5, historicalAvgKw: 28.2, irradianceWm2: 710, efficiencyPct: 94.8, cloudCoverPct: 12, ambientTempC: 27 },
      { timestamp: '12:00', timeLabel: '12 PM', generationKw: 41.2, historicalAvgKw: 37.0, irradianceWm2: 920, efficiencyPct: 95.6, cloudCoverPct: 6, ambientTempC: 29 },
      { timestamp: '14:00', timeLabel: '2 PM', generationKw: 37.6, historicalAvgKw: 34.2, irradianceWm2: 840, efficiencyPct: 94.2, cloudCoverPct: 10, ambientTempC: 30 },
      { timestamp: '16:00', timeLabel: '4 PM', generationKw: 19.8, historicalAvgKw: 17.8, irradianceWm2: 450, efficiencyPct: 93.0, cloudCoverPct: 15, ambientTempC: 28 },
      { timestamp: '18:00', timeLabel: '6 PM', generationKw: 4.8, historicalAvgKw: 3.9, irradianceWm2: 120, efficiencyPct: 90.5, cloudCoverPct: 10, ambientTempC: 26 },
      { timestamp: '19:00', timeLabel: '7 PM', generationKw: 0, historicalAvgKw: 0, irradianceWm2: 0, efficiencyPct: 0, cloudCoverPct: 10, ambientTempC: 25 }
    ]
  },
  'HOST-A': {
    facilityCode: 'HOST-A',
    facilityName: 'Hostel Block A',
    capacityKw: 45,
    pctOfTotal: 9,
    todayGeneratedKwh: 196,
    benchmarkDiffPct: 13.1,
    peakKw: 28.4,
    hourly: [
      { timestamp: '06:00', timeLabel: '6 AM', generationKw: 1.2, historicalAvgKw: 0.9, irradianceWm2: 80, efficiencyPct: 91.0, cloudCoverPct: 5, ambientTempC: 22 },
      { timestamp: '08:00', timeLabel: '8 AM', generationKw: 8.1, historicalAvgKw: 7.0, irradianceWm2: 340, efficiencyPct: 93.5, cloudCoverPct: 8, ambientTempC: 24 },
      { timestamp: '10:00', timeLabel: '10 AM', generationKw: 21.6, historicalAvgKw: 19.2, irradianceWm2: 710, efficiencyPct: 94.8, cloudCoverPct: 12, ambientTempC: 27 },
      { timestamp: '12:00', timeLabel: '12 PM', generationKw: 28.4, historicalAvgKw: 25.1, irradianceWm2: 920, efficiencyPct: 95.6, cloudCoverPct: 6, ambientTempC: 29 },
      { timestamp: '14:00', timeLabel: '2 PM', generationKw: 26.0, historicalAvgKw: 23.2, irradianceWm2: 840, efficiencyPct: 94.2, cloudCoverPct: 10, ambientTempC: 30 },
      { timestamp: '16:00', timeLabel: '4 PM', generationKw: 13.8, historicalAvgKw: 12.1, irradianceWm2: 450, efficiencyPct: 93.0, cloudCoverPct: 15, ambientTempC: 28 },
      { timestamp: '18:00', timeLabel: '6 PM', generationKw: 3.2, historicalAvgKw: 2.6, irradianceWm2: 120, efficiencyPct: 90.5, cloudCoverPct: 10, ambientTempC: 26 },
      { timestamp: '19:00', timeLabel: '7 PM', generationKw: 0, historicalAvgKw: 0, irradianceWm2: 0, efficiencyPct: 0, cloudCoverPct: 10, ambientTempC: 25 }
    ]
  },
  'HOST-B': {
    facilityCode: 'HOST-B',
    facilityName: 'Hostel Block B',
    capacityKw: 50,
    pctOfTotal: 10,
    todayGeneratedKwh: 221,
    benchmarkDiffPct: 12.0,
    peakKw: 31.8,
    hourly: [
      { timestamp: '06:00', timeLabel: '6 AM', generationKw: 1.4, historicalAvgKw: 1.1, irradianceWm2: 80, efficiencyPct: 91.0, cloudCoverPct: 5, ambientTempC: 22 },
      { timestamp: '08:00', timeLabel: '8 AM', generationKw: 9.2, historicalAvgKw: 8.1, irradianceWm2: 340, efficiencyPct: 93.5, cloudCoverPct: 8, ambientTempC: 24 },
      { timestamp: '10:00', timeLabel: '10 AM', generationKw: 24.5, historicalAvgKw: 21.8, irradianceWm2: 710, efficiencyPct: 94.8, cloudCoverPct: 12, ambientTempC: 27 },
      { timestamp: '12:00', timeLabel: '12 PM', generationKw: 31.8, historicalAvgKw: 28.4, irradianceWm2: 920, efficiencyPct: 95.6, cloudCoverPct: 6, ambientTempC: 29 },
      { timestamp: '14:00', timeLabel: '2 PM', generationKw: 29.1, historicalAvgKw: 26.0, irradianceWm2: 840, efficiencyPct: 94.2, cloudCoverPct: 10, ambientTempC: 30 },
      { timestamp: '16:00', timeLabel: '4 PM', generationKw: 15.4, historicalAvgKw: 13.8, irradianceWm2: 450, efficiencyPct: 93.0, cloudCoverPct: 15, ambientTempC: 28 },
      { timestamp: '18:00', timeLabel: '6 PM', generationKw: 3.8, historicalAvgKw: 3.0, irradianceWm2: 120, efficiencyPct: 90.5, cloudCoverPct: 10, ambientTempC: 26 },
      { timestamp: '19:00', timeLabel: '7 PM', generationKw: 0, historicalAvgKw: 0, irradianceWm2: 0, efficiencyPct: 0, cloudCoverPct: 10, ambientTempC: 25 }
    ]
  },
  ADMIN: {
    facilityCode: 'ADMIN',
    facilityName: 'Administration Wing',
    capacityKw: 35,
    pctOfTotal: 7,
    todayGeneratedKwh: 154,
    benchmarkDiffPct: 11.9,
    peakKw: 22.6,
    hourly: [
      { timestamp: '06:00', timeLabel: '6 AM', generationKw: 0.9, historicalAvgKw: 0.7, irradianceWm2: 80, efficiencyPct: 91.0, cloudCoverPct: 5, ambientTempC: 22 },
      { timestamp: '08:00', timeLabel: '8 AM', generationKw: 6.4, historicalAvgKw: 5.6, irradianceWm2: 340, efficiencyPct: 93.5, cloudCoverPct: 8, ambientTempC: 24 },
      { timestamp: '10:00', timeLabel: '10 AM', generationKw: 17.2, historicalAvgKw: 15.4, irradianceWm2: 710, efficiencyPct: 94.8, cloudCoverPct: 12, ambientTempC: 27 },
      { timestamp: '12:00', timeLabel: '12 PM', generationKw: 22.6, historicalAvgKw: 20.2, irradianceWm2: 920, efficiencyPct: 95.6, cloudCoverPct: 6, ambientTempC: 29 },
      { timestamp: '14:00', timeLabel: '2 PM', generationKw: 20.4, historicalAvgKw: 18.5, irradianceWm2: 840, efficiencyPct: 94.2, cloudCoverPct: 10, ambientTempC: 30 },
      { timestamp: '16:00', timeLabel: '4 PM', generationKw: 10.8, historicalAvgKw: 9.6, irradianceWm2: 450, efficiencyPct: 93.0, cloudCoverPct: 15, ambientTempC: 28 },
      { timestamp: '18:00', timeLabel: '6 PM', generationKw: 2.6, historicalAvgKw: 2.1, irradianceWm2: 120, efficiencyPct: 90.5, cloudCoverPct: 10, ambientTempC: 26 },
      { timestamp: '19:00', timeLabel: '7 PM', generationKw: 0, historicalAvgKw: 0, irradianceWm2: 0, efficiencyPct: 0, cloudCoverPct: 10, ambientTempC: 25 }
    ]
  },
  'ADV-LAB': {
    facilityCode: 'ADV-LAB',
    facilityName: 'Laboratory Block',
    capacityKw: 80,
    pctOfTotal: 15,
    todayGeneratedKwh: 358,
    benchmarkDiffPct: 12.1,
    peakKw: 51.0,
    hourly: [
      { timestamp: '06:00', timeLabel: '6 AM', generationKw: 2.1, historicalAvgKw: 1.7, irradianceWm2: 80, efficiencyPct: 91.0, cloudCoverPct: 5, ambientTempC: 22 },
      { timestamp: '08:00', timeLabel: '8 AM', generationKw: 14.8, historicalAvgKw: 13.0, irradianceWm2: 340, efficiencyPct: 93.5, cloudCoverPct: 8, ambientTempC: 24 },
      { timestamp: '10:00', timeLabel: '10 AM', generationKw: 39.2, historicalAvgKw: 35.1, irradianceWm2: 710, efficiencyPct: 94.8, cloudCoverPct: 12, ambientTempC: 27 },
      { timestamp: '12:00', timeLabel: '12 PM', generationKw: 51.0, historicalAvgKw: 45.5, irradianceWm2: 920, efficiencyPct: 95.6, cloudCoverPct: 6, ambientTempC: 29 },
      { timestamp: '14:00', timeLabel: '2 PM', generationKw: 46.5, historicalAvgKw: 41.8, irradianceWm2: 840, efficiencyPct: 94.2, cloudCoverPct: 10, ambientTempC: 30 },
      { timestamp: '16:00', timeLabel: '4 PM', generationKw: 24.6, historicalAvgKw: 22.0, irradianceWm2: 450, efficiencyPct: 93.0, cloudCoverPct: 15, ambientTempC: 28 },
      { timestamp: '18:00', timeLabel: '6 PM', generationKw: 5.9, historicalAvgKw: 4.8, irradianceWm2: 120, efficiencyPct: 90.5, cloudCoverPct: 10, ambientTempC: 26 },
      { timestamp: '19:00', timeLabel: '7 PM', generationKw: 0, historicalAvgKw: 0, irradianceWm2: 0, efficiencyPct: 0, cloudCoverPct: 10, ambientTempC: 25 }
    ]
  },
  CAFE: {
    facilityCode: 'CAFE',
    facilityName: 'Campus Dining Hub',
    capacityKw: 40,
    pctOfTotal: 8,
    todayGeneratedKwh: 178,
    benchmarkDiffPct: 11.8,
    peakKw: 25.5,
    hourly: [
      { timestamp: '06:00', timeLabel: '6 AM', generationKw: 1.1, historicalAvgKw: 0.8, irradianceWm2: 80, efficiencyPct: 91.0, cloudCoverPct: 5, ambientTempC: 22 },
      { timestamp: '08:00', timeLabel: '8 AM', generationKw: 7.3, historicalAvgKw: 6.4, irradianceWm2: 340, efficiencyPct: 93.5, cloudCoverPct: 8, ambientTempC: 24 },
      { timestamp: '10:00', timeLabel: '10 AM', generationKw: 19.5, historicalAvgKw: 17.4, irradianceWm2: 710, efficiencyPct: 94.8, cloudCoverPct: 12, ambientTempC: 27 },
      { timestamp: '12:00', timeLabel: '12 PM', generationKw: 25.5, historicalAvgKw: 22.8, irradianceWm2: 920, efficiencyPct: 95.6, cloudCoverPct: 6, ambientTempC: 29 },
      { timestamp: '14:00', timeLabel: '2 PM', generationKw: 23.2, historicalAvgKw: 20.9, irradianceWm2: 840, efficiencyPct: 94.2, cloudCoverPct: 10, ambientTempC: 30 },
      { timestamp: '16:00', timeLabel: '4 PM', generationKw: 12.2, historicalAvgKw: 11.0, irradianceWm2: 450, efficiencyPct: 93.0, cloudCoverPct: 15, ambientTempC: 28 },
      { timestamp: '18:00', timeLabel: '6 PM', generationKw: 2.9, historicalAvgKw: 2.4, irradianceWm2: 120, efficiencyPct: 90.5, cloudCoverPct: 10, ambientTempC: 26 },
      { timestamp: '19:00', timeLabel: '7 PM', generationKw: 0, historicalAvgKw: 0, irradianceWm2: 0, efficiencyPct: 0, cloudCoverPct: 10, ambientTempC: 25 }
    ]
  }
};

// Facility solar data keyed by facility code (structured hourly solar curves)
export const solarData: Record<string, SolarTelemetry[]> = {
  ACAD: FACILITY_SOLAR_PROFILES['ACAD'].hourly,
  'CS-LAB': FACILITY_SOLAR_PROFILES['CS-LAB'].hourly,
  LIB: FACILITY_SOLAR_PROFILES['LIB'].hourly,
  'HOST-A': FACILITY_SOLAR_PROFILES['HOST-A'].hourly,
  'HOST-B': FACILITY_SOLAR_PROFILES['HOST-B'].hourly,
  ADMIN: FACILITY_SOLAR_PROFILES['ADMIN'].hourly,
  'ADV-LAB': FACILITY_SOLAR_PROFILES['ADV-LAB'].hourly,
  CAFE: FACILITY_SOLAR_PROFILES['CAFE'].hourly
};

// Facility-specific Atmospheric & Inverter Telemetry
export const telemetryData: Record<string, FacilityAtmosphericTelemetry> = {
  ACAD: {
    ambientTemperature: '29.2°C',
    pvSurfaceTemperature: '41.8°C',
    solarArrayAzimuth: '180° Due South',
    tiltAngle: '22.5° Fixed',
    bessAbsorptionRate: '15.4 kW directed'
  },
  'CS-LAB': {
    ambientTemperature: '28.5°C',
    pvSurfaceTemperature: '43.2°C',
    solarArrayAzimuth: '175° South-Southeast',
    tiltAngle: '20.0° Optimized',
    bessAbsorptionRate: '18.2 kW directed'
  },
  LIB: {
    ambientTemperature: '29.0°C',
    pvSurfaceTemperature: '40.4°C',
    solarArrayAzimuth: '185° South-Southwest',
    tiltAngle: '22.0° Fixed',
    bessAbsorptionRate: '10.8 kW directed'
  },
  'HOST-A': {
    ambientTemperature: '30.1°C',
    pvSurfaceTemperature: '44.0°C',
    solarArrayAzimuth: '170° South-Southeast',
    tiltAngle: '25.0° High-Tilt',
    bessAbsorptionRate: '7.2 kW directed'
  },
  'HOST-B': {
    ambientTemperature: '29.8°C',
    pvSurfaceTemperature: '43.5°C',
    solarArrayAzimuth: '172° South-Southeast',
    tiltAngle: '24.5° Fixed',
    bessAbsorptionRate: '8.1 kW directed'
  },
  ADMIN: {
    ambientTemperature: '28.9°C',
    pvSurfaceTemperature: '39.8°C',
    solarArrayAzimuth: '180° Due South',
    tiltAngle: '21.0° Low-Profile',
    bessAbsorptionRate: '5.6 kW directed'
  },
  'ADV-LAB': {
    ambientTemperature: '27.9°C',
    pvSurfaceTemperature: '42.6°C',
    solarArrayAzimuth: '178° Due South',
    tiltAngle: '23.0° Fixed',
    bessAbsorptionRate: '13.0 kW directed'
  },
  CAFE: {
    ambientTemperature: '30.4°C',
    pvSurfaceTemperature: '44.8°C',
    solarArrayAzimuth: '182° South-Southwest',
    tiltAngle: '19.5° Low-Pitch',
    bessAbsorptionRate: '6.2 kW directed'
  }
};

export const INITIAL_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 'rec-01',
    category: 'Energy Saving',
    title: 'Reduce HVAC operation in Academic Block',
    description: 'Throttle chiller stage 2 in zones 3 & 4 during 12:30 PM - 2:00 PM lecture lunch interval.',
    reason: 'Occupancy drops below 20% in lecture wings during lunch recess while cooling capacity remains at 100%.',
    priority: 'high',
    estimatedKwhSaving: 145.0,
    estimatedDollarSaving: 26.10,
    co2ReductionKg: 87.0,
    status: 'active',
    createdAt: '15 mins ago'
  },
  {
    id: 'rec-02',
    category: 'Solar Optimization',
    title: 'Shift Lab Heavy Diagnostics to 12 PM - 3 PM',
    description: 'Reschedule autoclave sterilization and materials stress testing to run within peak solar surplus hours.',
    reason: 'Campus rooftop arrays generate a 318 kW surplus above base demand, allowing zero-marginal-cost operation.',
    priority: 'medium',
    estimatedKwhSaving: 220.0,
    estimatedDollarSaving: 39.60,
    co2ReductionKg: 132.0,
    status: 'active',
    createdAt: '42 mins ago'
  },
  {
    id: 'rec-03',
    category: 'Battery Optimization',
    title: 'Pre-Charge BESS for 5:30 PM Demand Peak',
    description: 'Maintain solar absorption charge until 950 kWh buffer is stored prior to student hostel return.',
    reason: 'Historical predictive models indicate a 24% campus demand spike from 5:30 PM to 8:30 PM.',
    priority: 'critical',
    estimatedKwhSaving: 310.0,
    estimatedDollarSaving: 55.80,
    co2ReductionKg: 186.0,
    status: 'active',
    createdAt: '1 hour ago'
  },
  {
    id: 'rec-04',
    category: 'Peak Demand Alert',
    title: 'Hostel A Energy Discrepancy Detected',
    description: 'Hostel Block A is drawing 71.4 kW while occupancy is recorded at only 29.5%.',
    reason: 'Power draw is 24% above historical baseline for midday student absence. Suspected water heater timer fault.',
    priority: 'high',
    estimatedKwhSaving: 95.0,
    estimatedDollarSaving: 17.10,
    co2ReductionKg: 57.0,
    status: 'active',
    createdAt: '2 hours ago'
  },
  {
    id: 'rec-05',
    category: 'Renewable Energy',
    title: 'Engage Smart Daylight Harvesting in Central Library',
    description: 'Dim perimeter LED fixtures by 40% along South and West reading atriums with high daylight penetration.',
    reason: 'Ambient solar lux exceeds 1,200 lux in perimeter zones, making full artificial lighting redundant.',
    priority: 'low',
    estimatedKwhSaving: 62.0,
    estimatedDollarSaving: 11.16,
    co2ReductionKg: 37.2,
    status: 'active',
    createdAt: '3 hours ago'
  }
];

export const GREEN_BUILDING_SCORES: GreenBuildingScoreItem[] = [
  {
    id: 'g-01',
    buildingName: 'Computer Science Block',
    category: 'Academic',
    overallScore: 92,
    energyEfficiency: 95,
    renewableRatio: 91,
    occupancyAlignment: 89,
    peakShaving: 93,
    rank: 1,
    badge: 'Platinum',
    monthlyChange: +3
  },
  {
    id: 'g-02',
    buildingName: 'Administration Wing',
    category: 'Administrative',
    overallScore: 89,
    energyEfficiency: 91,
    renewableRatio: 88,
    occupancyAlignment: 90,
    peakShaving: 87,
    rank: 2,
    badge: 'Platinum',
    monthlyChange: +1
  },
  {
    id: 'g-03',
    buildingName: 'Academic Block',
    category: 'Academic',
    overallScore: 88,
    energyEfficiency: 86,
    renewableRatio: 90,
    occupancyAlignment: 92,
    peakShaving: 84,
    rank: 3,
    badge: 'Gold',
    monthlyChange: +4
  },
  {
    id: 'g-04',
    buildingName: 'Campus Dining Hub',
    category: 'Dining',
    overallScore: 84,
    energyEfficiency: 83,
    renewableRatio: 82,
    occupancyAlignment: 88,
    peakShaving: 83,
    rank: 4,
    badge: 'Gold',
    monthlyChange: 0
  },
  {
    id: 'g-05',
    buildingName: 'Central Library',
    category: 'Academic',
    overallScore: 81,
    energyEfficiency: 85,
    renewableRatio: 78,
    occupancyAlignment: 80,
    peakShaving: 81,
    rank: 5,
    badge: 'Gold',
    monthlyChange: -2
  },
  {
    id: 'g-06',
    buildingName: 'Laboratory Block',
    category: 'Laboratory',
    overallScore: 79,
    energyEfficiency: 76,
    renewableRatio: 84,
    occupancyAlignment: 78,
    peakShaving: 78,
    rank: 6,
    badge: 'Silver',
    monthlyChange: +2
  },
  {
    id: 'g-07',
    buildingName: 'Hostel Block B',
    category: 'Hostel',
    overallScore: 74,
    energyEfficiency: 72,
    renewableRatio: 75,
    occupancyAlignment: 77,
    peakShaving: 72,
    rank: 7,
    badge: 'Silver',
    monthlyChange: -1
  },
  {
    id: 'g-08',
    buildingName: 'Hostel Block A',
    category: 'Hostel',
    overallScore: 67,
    energyEfficiency: 62,
    renewableRatio: 69,
    occupancyAlignment: 64,
    peakShaving: 73,
    rank: 8,
    badge: 'Bronze',
    monthlyChange: -5
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'n-1',
    type: 'alert' as const,
    title: 'High Idle Demand Alert',
    message: 'Hostel A power draw is 24% higher than expected based on current 29.5% occupancy.',
    timeAgo: '10m ago',
    isRead: false,
    actionUrl: '/occupancy'
  },
  {
    id: 'n-2',
    type: 'success' as const,
    title: 'Solar Surplus Threshold Reached',
    message: 'Campus solar generation passed 310 kW. Central BESS is actively charging at 84.5 kW.',
    timeAgo: '25m ago',
    isRead: false,
    actionUrl: '/battery'
  },
  {
    id: 'n-3',
    type: 'info' as const,
    title: 'Peak Demand Forecast',
    message: 'AI models predict campus peak demand of 528 kW at 2:30 PM today.',
    timeAgo: '1h ago',
    isRead: true,
    actionUrl: '/predictions'
  },
  {
    id: 'n-4',
    type: 'warning' as const,
    title: 'HVAC Duty Cycle Alert',
    message: 'Laboratory clean room HVAC runtime exceeded standard benchmark by 1.4 hours.',
    timeAgo: '3h ago',
    isRead: true,
    actionUrl: '/energy'
  }
];
