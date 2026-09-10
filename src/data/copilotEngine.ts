import { CopilotMessage, Building, BatteryState } from '../types';

export const SUGGESTED_PROMPTS = [
  "Which building uses the most energy?",
  "When will demand peak today?",
  "How can we reduce electricity usage?",
  "Is our battery being used efficiently?",
  "What is our solar contribution today?",
  "Which building needs attention?"
];

/**
 * Intelligent response generator for the Campus Energy Copilot
 */
export function generateCopilotResponse(
  query: string,
  buildings: Building[],
  battery: BatteryState,
  currentSolarKw: number = 318,
  totalDemandKw: number = 482
): CopilotMessage {
  const normalized = query.toLowerCase();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Which building uses the most energy?
  if (normalized.includes('most energy') || normalized.includes('highest consumption') || normalized.includes('highest demand')) {
    const highestBuilding = [...buildings].sort((a, b) => b.currentDemandKw - a.currentDemandKw)[0];
    const secondHighest = [...buildings].sort((a, b) => b.currentDemandKw - a.currentDemandKw)[1];

    return {
      id: `copilot-${Date.now()}`,
      sender: 'copilot',
      text: `**${highestBuilding.name}** currently accounts for the highest electricity demand on campus at **${highestBuilding.currentDemandKw} kW** (${Math.round((highestBuilding.currentDemandKw / totalDemandKw) * 100)}% of total campus load).\n\nThis is primarily driven by its server rooms and GPU research infrastructure operating at high baseline loads. The second highest consumer is **${secondHighest.name}** at **${secondHighest.currentDemandKw} kW**.`,
      timestamp,
      highlightStats: [
        { label: 'Top Consumer', value: `${highestBuilding.name} (${highestBuilding.currentDemandKw} kW)`, color: '#fb7185' },
        { label: 'Campus Share', value: `${Math.round((highestBuilding.currentDemandKw / totalDemandKw) * 100)}%`, color: '#f59e0b' },
        { label: 'Occupancy', value: `${highestBuilding.occupancyPct}%`, color: '#34d399' }
      ],
      actionRecommendation: {
        title: `Inspect ${highestBuilding.name} HVAC & Server Loads`,
        buttonText: 'View Building Telemetry',
        route: '/energy'
      }
    };
  }

  // 2. When will demand peak today?
  if (normalized.includes('peak') || normalized.includes('when will demand')) {
    return {
      id: `copilot-${Date.now()}`,
      sender: 'copilot',
      text: `Based on historical occupancy schedules and machine learning forecasting, campus demand will reach its **afternoon peak of 512 kW at approximately 2:00 PM – 2:30 PM today**.\n\nA secondary evening peak of **460 kW** is projected around **6:30 PM** as hostel occupancy increases. Our recommendation engine suggests pre-charging the battery system before 1:30 PM to shave the afternoon peak without triggering utility demand surcharges.`,
      timestamp,
      highlightStats: [
        { label: 'Predicted Peak', value: '512 kW', color: '#fb7185' },
        { label: 'Peak Window', value: '2:00 PM - 2:30 PM', color: '#38bdf8' },
        { label: 'Grid Buffer', value: '38 kW headroom', color: '#34d399' }
      ],
      actionRecommendation: {
        title: 'Review Demand Forecast Curve',
        buttonText: 'Open AI Predictions',
        route: '/predictions'
      }
    };
  }

  // 3. How can we reduce electricity usage?
  if (normalized.includes('reduce') || normalized.includes('save') || normalized.includes('efficiency') || normalized.includes('cost')) {
    return {
      id: `copilot-${Date.now()}`,
      sender: 'copilot',
      text: `Here are the 3 highest-ROI energy conservation opportunities identified across campus right now:\n\n1. **Throttle Academic Block HVAC during lunch recess (12:30 PM - 2:00 PM)**: Saves **145 kWh** ($26.10/day).\n2. **Hostel A Idle Load Shedding**: Resolving the hot water recirculation issue will reduce baseline draw by **95 kWh** ($17.10/day).\n3. **Daylight Harvesting in Central Library**: Dimming reading atrium fixtures by 40% will save **62 kWh** ($11.16/day).\n\nCombined potential savings: **$54.36 / day ($19,840 annually) + 120 kg CO₂ / day**.`,
      timestamp,
      highlightStats: [
        { label: 'Daily Savings', value: '$54.36 / day', color: '#4ade80' },
        { label: 'Annual Offset', value: '$19,840', color: '#22d3ee' },
        { label: 'CO₂ Avoided', value: '43.8 Tons / yr', color: '#10b981' }
      ],
      actionRecommendation: {
        title: 'Apply Automated AI Recommendations',
        buttonText: 'Execute Actions',
        route: '/recommendations'
      }
    };
  }

  // 4. Is our battery being used efficiently?
  if (normalized.includes('battery') || normalized.includes('bess') || normalized.includes('storage')) {
    const isCharging = battery.operatingMode === 'charging';
    return {
      id: `copilot-${Date.now()}`,
      sender: 'copilot',
      text: `Yes, the Central Battery Energy Storage System (BESS) is operating at **optimal efficiency (98.4% health)**.\n\nCurrently, the battery is **${battery.operatingMode.toUpperCase()} at ${Math.abs(battery.flowRateKw)} kW** with a state of charge of **${battery.stateOfChargePct}%** (${battery.currentStoredKwh} kWh stored out of ${battery.capacityKwh} kWh capacity).\n\n**AI Decision Logic:** ${battery.aiDecisionReason}\n\nEstimated emergency backup autonomy: **${battery.estimatedBackupHours} hours** under average campus load.`,
      timestamp,
      highlightStats: [
        { label: 'State of Charge', value: `${battery.stateOfChargePct}%`, color: '#34d399' },
        { label: 'Current Flow', value: `${isCharging ? '+' : '-'}${battery.flowRateKw} kW`, color: isCharging ? '#4ade80' : '#fbbf24' },
        { label: 'Cell Health', value: `${battery.cellHealthPct}%`, color: '#38bdf8' }
      ],
      actionRecommendation: {
        title: 'View Battery Telemetry & State of Charge',
        buttonText: 'Open Battery Hub',
        route: '/battery'
      }
    };
  }

  // 5. What is our solar contribution today?
  if (normalized.includes('solar') || normalized.includes('photovoltaic') || normalized.includes('renewable')) {
    const solarFraction = Math.round((currentSolarKw / totalDemandKw) * 100);
    return {
      id: `copilot-${Date.now()}`,
      sender: 'copilot',
      text: `Rooftop solar arrays across our 8 campus buildings are currently producing **${currentSolarKw} kW**, providing **${solarFraction}%** of total campus power needs.\n\nSolar production is **14% higher than yesterday** due to clear skies (ambient irradiance: 920 W/m² with only 6% cloud cover). Today's cumulative solar generation has already offset **1.8 tons of CO₂** and cut utility costs by **$482**.`,
      timestamp,
      highlightStats: [
        { label: 'Current Solar', value: `${currentSolarKw} kW`, color: '#facc15' },
        { label: 'Solar Contribution', value: `${solarFraction}% of demand`, color: '#4ade80' },
        { label: 'Efficiency', value: '95.6%', color: '#38bdf8' }
      ],
      actionRecommendation: {
        title: 'View Solar Arrays & Weather Correlator',
        buttonText: 'Open Solar Dashboard',
        route: '/solar'
      }
    };
  }

  // 6. Which building needs attention?
  if (normalized.includes('attention') || normalized.includes('issue') || normalized.includes('alert') || normalized.includes('problem') || normalized.includes('warning')) {
    const warningBuilding = buildings.find(b => b.status === 'warning' || b.status === 'alert') || buildings[3];
    return {
      id: `copilot-${Date.now()}`,
      sender: 'copilot',
      text: `⚠️ **${warningBuilding.name}** requires immediate attention.\n\n**Anomaly Detected:** Energy demand is currently **${warningBuilding.currentDemandKw} kW** while recorded student occupancy is only **${warningBuilding.occupancyPct}%** (112 / 380 occupants). This indicates a 24% load deviation from expected baseline.\n\n**Cause:** Suspected mechanical fault in the domestic hot water recirculation pump and common lounge AC units running on manual override during lecture hours.`,
      timestamp,
      highlightStats: [
        { label: 'Flagged Building', value: warningBuilding.name, color: '#fb7185' },
        { label: 'Load Anomaly', value: '+24% above baseline', color: '#f59e0b' },
        { label: 'Current Occupancy', value: `${warningBuilding.occupancyPct}%`, color: '#94a3b8' }
      ],
      actionRecommendation: {
        title: `Investigate ${warningBuilding.name} Heatmap`,
        buttonText: 'View Occupancy Anomaly',
        route: '/occupancy'
      }
    };
  }

  // Default Open-Ended Intelligent Response
  return {
    id: `copilot-${Date.now()}`,
    sender: 'copilot',
    text: `I've analyzed real-time telemetry across all 8 campus buildings, our 318 kW rooftop solar installations, and the 1.2 MWh central BESS.\n\nCampus net demand is steady at **${totalDemandKw} kW**, with renewables supplying **${Math.round((currentSolarKw / totalDemandKw) * 100)}%**. The overall Campus Green Building Score stands at **86 / 100 (Platinum Grade)**.\n\nFeel free to ask about individual building loads, battery charging strategies, demand forecasting, or run a what-if scenario.`,
    timestamp,
    highlightStats: [
      { label: 'Campus Demand', value: `${totalDemandKw} kW`, color: '#38bdf8' },
      { label: 'Solar Output', value: `${currentSolarKw} kW`, color: '#facc15' },
      { label: 'BESS Charge', value: `${battery.stateOfChargePct}%`, color: '#4ade80' }
    ],
    actionRecommendation: {
      title: 'Simulate Campus Energy Scenarios',
      buttonText: 'Open What-If Simulator',
      route: '/simulator'
    }
  };
}
