import { Building, BatteryState, EnergyTelemetry, SolarTelemetry, OccupancyTelemetry, GreenBuildingScoreItem, AIRecommendation } from '../types';

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
