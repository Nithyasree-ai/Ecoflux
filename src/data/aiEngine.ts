import { EnergyPredictionPoint, SimulationParams, SimulationResult, AIRecommendation, Building } from '../types';

/**
 * AI Energy Forecasting Engine
 * Produces 24h, 7d, and 30d demand and solar forecasts with confidence bounds
 */
export function getForecastData(range: '24h' | '7d' | '30d'): EnergyPredictionPoint[] {
  if (range === '24h') {
    const hours = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    const actuals = [280, 260, 255, 290, 380, 450, 490, 512, undefined, undefined, undefined, undefined];
    const predictedDemands = [278, 262, 258, 294, 385, 452, 488, 515, 475, 465, 400, 325];
    const predictedSolars = [0, 0, 0, 8, 92, 245, 318, 292, 155, 36, 0, 0];

    return hours.map((hour, idx) => {
      const predDemand = predictedDemands[idx];
      const predSolar = predictedSolars[idx];
      const actual = actuals[idx];
      return {
        timestamp: hour,
        timeLabel: hour,
        actualDemandKw: actual,
        predictedDemandKw: predDemand,
        predictedSolarKw: predSolar,
        netGapKw: Math.max(0, predDemand - predSolar),
        confidenceLow: Math.round(predDemand * 0.94),
        confidenceHigh: Math.round(predDemand * 1.06)
      };
    });
  }

  if (range === '7d') {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const demands = [490, 510, 525, 498, 480, 340, 310];
    const solars = [300, 315, 320, 290, 310, 330, 335];

    return days.map((day, idx) => {
      const predDemand = demands[idx];
      const predSolar = solars[idx];
      return {
        timestamp: day,
        timeLabel: day,
        actualDemandKw: idx < 4 ? Math.round(predDemand * (0.98 + (idx % 3) * 0.01)) : undefined,
        predictedDemandKw: predDemand,
        predictedSolarKw: predSolar,
        netGapKw: Math.max(0, predDemand - predSolar),
        confidenceLow: Math.round(predDemand * 0.93),
        confidenceHigh: Math.round(predDemand * 1.07)
      };
    });
  }

  // 30 Days Forecast
  return Array.from({ length: 15 }, (_, i) => {
    const dayNum = (i + 1) * 2;
    const isWeekend = dayNum % 7 === 0 || dayNum % 7 === 6;
    const baseDemand = isWeekend ? 320 : 495;
    const variance = (Math.sin(i) * 20);
    const predDemand = Math.round(baseDemand + variance);
    const predSolar = Math.round(310 + Math.cos(i) * 25);

    return {
      timestamp: `Day ${dayNum}`,
      timeLabel: `Day ${dayNum}`,
      actualDemandKw: i < 5 ? Math.round(predDemand * 0.99) : undefined,
      predictedDemandKw: predDemand,
      predictedSolarKw: predSolar,
      netGapKw: Math.max(0, predDemand - predSolar),
      confidenceLow: Math.round(predDemand * 0.91),
      confidenceHigh: Math.round(predDemand * 1.09)
    };
  });
}

/**
 * What-If Scenario Simulator Computation
 * Computes realistic economic and thermodynamic impacts of campus adjustments
 */
export function calculateSimulation(params: SimulationParams): SimulationResult {
  // Baseline campus values
  const BASE_DAILY_DEMAND_KWH = 9800; // ~408 kW average across 24 hours
  const BASE_SOLAR_DAILY_KWH = 2400; // ~300 kW peak * ~8 sun hours curve
  const BASE_GRID_TARIFF = 0.18; // $0.18 per kWh
  const CO2_FACTOR_KG_PER_KWH = 0.42;

  // 1. Solar additional capacity (+kW)
  const additionalSolarDailyKwh = params.solarCapacityAddKw * 4.8; // average daily capacity factor

  // 2. Battery capacity addition (+kWh) allows storing midday surplus and avoiding peak tariff
  const batteryPeakShavingKwh = Math.min(params.batteryCapacityAddKwh * 0.85, 1200);

  // 3. Occupancy shift (% optimization)
  const occupancyDemandAdjustmentFactor = 1 - (params.occupancyShiftPct * 0.0035);

  // 4. HVAC Temperature Setpoint Adjustment (each 1°C offset saves ~6% of HVAC load; HVAC is ~38% of total)
  const hvacSavingsFactor = (params.hvacTempOffsetC * 0.06) * 0.38;

  // 5. Lighting Efficiency & Daylight harvesting (lighting is ~22% of total)
  const lightingSavingsFactor = (params.lightingEfficiencyPct / 100) * 0.25 * 0.22;

  // 6. Operating Hours reduction
  const operatingHoursFactor = (params.operatingHoursReductionHours * 0.02);

  // Total efficiency reduction
  const totalEfficiencyRatio = Math.max(0.65, occupancyDemandAdjustmentFactor - hvacSavingsFactor - lightingSavingsFactor - operatingHoursFactor);

  const adjustedDailyDemandKwh = BASE_DAILY_DEMAND_KWH * totalEfficiencyRatio;
  const totalSolarDailyKwh = BASE_SOLAR_DAILY_KWH + additionalSolarDailyKwh;

  const directSolarUsedKwh = Math.min(adjustedDailyDemandKwh * 0.65, totalSolarDailyKwh);
  const batteryStoredSolarKwh = Math.min(totalSolarDailyKwh - directSolarUsedKwh, batteryPeakShavingKwh);
  const totalCleanKwhUsed = directSolarUsedKwh + batteryStoredSolarKwh;

  const remainingGridKwh = Math.max(0, adjustedDailyDemandKwh - totalCleanKwhUsed);

  // Cost calculation
  const currentDailyCostUsd = Math.round((BASE_DAILY_DEMAND_KWH - BASE_SOLAR_DAILY_KWH) * BASE_GRID_TARIFF);
  const projectedDailyCostUsd = Math.round(remainingGridKwh * BASE_GRID_TARIFF);
  const dailySavingsUsd = Math.max(0, currentDailyCostUsd - projectedDailyCostUsd);
  const annualSavingsUsd = dailySavingsUsd * 365;

  const currentSolarPct = Math.round((BASE_SOLAR_DAILY_KWH / BASE_DAILY_DEMAND_KWH) * 100);
  const projectedSolarPct = Math.min(96, Math.round((totalCleanKwhUsed / adjustedDailyDemandKwh) * 100));

  const cleanEnergyDeltaAnnualKwh = (totalCleanKwhUsed - BASE_SOLAR_DAILY_KWH) * 365;
  const co2ReductionTonsYear = Number(((cleanEnergyDeltaAnnualKwh * CO2_FACTOR_KG_PER_KWH) / 1000).toFixed(1));

  const batteryUtilizationPct = Math.min(98, Math.round(65 + (params.batteryCapacityAddKwh > 0 ? 15 : 0) + (params.solarCapacityAddKw > 40 ? 12 : 0)));
  const peakGridDemandKw = Math.round(Math.max(160, 512 * totalEfficiencyRatio - (params.batteryCapacityAddKwh > 0 ? 90 : 0)));

  // Generate automated intelligent recommendation
  let aiRecommendation = '';
  if (params.solarCapacityAddKw >= 50 && params.batteryCapacityAddKwh >= 150) {
    aiRecommendation = `Optimal microgrid balance detected. Adding ${params.solarCapacityAddKw} kW solar alongside ${params.batteryCapacityAddKwh} kWh BESS reduces campus grid reliance to ${(100 - projectedSolarPct)}% and yields $${annualSavingsUsd.toLocaleString()} annual operating savings.`;
  } else if (params.solarCapacityAddKw > 80 && params.batteryCapacityAddKwh < 50) {
    aiRecommendation = `Solar curtailment warning: You are generating significant surplus (${params.solarCapacityAddKw} kW) without matching battery capacity. Consider raising battery storage by at least 150 kWh to capture midday peaks.`;
  } else if (params.hvacTempOffsetC >= 1.5) {
    aiRecommendation = `Smart thermal management yields immediate impact: A +${params.hvacTempOffsetC}°C HVAC setpoint adjustment saves $${Math.round(dailySavingsUsd * 30)}/month with negligible occupant comfort disruption.`;
  } else {
    aiRecommendation = `Conservative scenario yields $${dailySavingsUsd}/day savings with a ${projectedSolarPct}% renewable fraction. Increasing solar capacity above 40 kW will unlock rapid ROI.`;
  }

  return {
    currentDailyCostUsd,
    projectedDailyCostUsd,
    dailySavingsUsd,
    annualSavingsUsd,
    currentSolarPct,
    projectedSolarPct,
    co2ReductionTonsYear,
    batteryUtilizationPct,
    peakGridDemandKw,
    aiRecommendation
  };
}

/**
 * Dynamic Recommendation Generator
 * Analyzes active telemetry to yield immediate actionable energy management insights
 */
export function evaluateRealtimeRecommendations(buildings: Building[], solarKw: number, demandKw: number, batteryPct: number): AIRecommendation[] {
  const recs: AIRecommendation[] = [];

  // Check 1: Idle energy vs low occupancy
  const lowOccupancyHighEnergy = buildings.find(b => b.occupancyPct < 35 && b.currentDemandKw > b.baseLoadKw * 0.95);
  if (lowOccupancyHighEnergy) {
    recs.push({
      id: `dyn-rec-occ-${lowOccupancyHighEnergy.code}`,
      category: 'Occupancy',
      title: `Unusual Load Detected in ${lowOccupancyHighEnergy.name}`,
      description: `${lowOccupancyHighEnergy.name} is consuming ${lowOccupancyHighEnergy.currentDemandKw} kW while occupancy is only ${lowOccupancyHighEnergy.occupancyPct}%.`,
      reason: 'High consumption during low occupancy indicates non-essential equipment, laboratory ventilation or lighting left on.',
      priority: 'high',
      estimatedKwhSaving: Math.round(lowOccupancyHighEnergy.currentDemandKw * 0.25 * 6),
      estimatedDollarSaving: Math.round(lowOccupancyHighEnergy.currentDemandKw * 0.25 * 6 * 0.18),
      co2ReductionKg: Math.round(lowOccupancyHighEnergy.currentDemandKw * 0.25 * 6 * 0.42),
      status: 'active',
      createdAt: 'Just now'
    });
  }

  // Check 2: Solar surplus absorption
  if (solarKw > 280 && batteryPct < 85) {
    recs.push({
      id: 'dyn-rec-solar-bess',
      category: 'Solar Optimization',
      title: 'Maximize Rooftop Solar Absorption into BESS',
      description: `Rooftop generation is strong at ${solarKw} kW. Charge battery at full 90 kW rating to buffer for evening peak.`,
      reason: 'Directing solar into storage prevents grid export losses and reduces expensive 6:00 PM peak tariff draw.',
      priority: 'medium',
      estimatedKwhSaving: 240,
      estimatedDollarSaving: 43.20,
      co2ReductionKg: 100.8,
      status: 'active',
      createdAt: '5 mins ago'
    });
  }

  // Check 3: Peak demand mitigation
  if (demandKw > 475) {
    recs.push({
      id: 'dyn-rec-peak',
      category: 'Peak Demand Alert',
      title: 'Peak Demand Load Shedding Recommended',
      description: `Campus demand has reached ${demandKw} kW, approaching the 500 kW contractual threshold.`,
      reason: 'Surpassing peak threshold incurs demand surcharges. Throttle non-critical HVAC chillers in Admin & Library.',
      priority: 'critical',
      estimatedKwhSaving: 180,
      estimatedDollarSaving: 32.40,
      co2ReductionKg: 75.6,
      status: 'active',
      createdAt: '12 mins ago'
    });
  }

  return recs;
}
