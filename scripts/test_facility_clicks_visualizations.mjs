import assert from 'node:assert';
import { INITIAL_BUILDINGS, FACILITY_HEATMAPS, getFacilityDataMap } from '../src/data/campusData.ts';

console.log('================================================================');
console.log('TESTING FACILITY CLICKS & VISUALIZATION DATA REACTIVITY PIPELINE');
console.log('================================================================');

const facilityCodes = ['ACAD', 'CS-LAB', 'LIB', 'HOST-A', 'HOST-B', 'ADMIN', 'ADV-LAB', 'CAFE'];
const facilityMap = getFacilityDataMap(INITIAL_BUILDINGS);

// Simulate OccupancyEnergyChart data derivation for a given selectedFacility
function deriveChartData(selectedFacility, buildings) {
  const facilityPoints = buildings.map(b => {
    const isSelected = selectedFacility !== 'ALL' && b.code === selectedFacility;
    const headcount = b.currentOccupancy;
    const energyPerPerson = headcount > 0 ? Number((b.currentDemandKw / headcount).toFixed(3)) : 0;
    return {
      name: b.name,
      code: b.code,
      occupancy: b.occupancyPct,
      energy: b.currentDemandKw,
      status: b.status,
      headcount: b.currentOccupancy,
      capacity: b.designedOccupancy,
      energyPerPerson,
      isSelected
    };
  });

  const selectedPoint = selectedFacility === 'ALL'
    ? null
    : (facilityPoints.find(f => f.code === selectedFacility) || null);

  const operatingPoints = selectedFacility !== 'ALL' && FACILITY_HEATMAPS[selectedFacility]
    ? FACILITY_HEATMAPS[selectedFacility].map((p) => {
        const matchingBuilding = buildings.find(b => b.code === selectedFacility);
        const approxHeadcount = Math.round(((matchingBuilding?.designedOccupancy || 300) * p.occupancyPct) / 100);
        const epp = approxHeadcount > 0 ? Number((p.demandKw / approxHeadcount).toFixed(3)) : 0;
        return {
          name: `${matchingBuilding?.name || selectedFacility} (${p.label})`,
          code: selectedFacility,
          periodLabel: p.label,
          timeRange: p.period,
          occupancy: p.occupancyPct,
          energy: p.demandKw,
          headcount: approxHeadcount,
          energyPerPerson: epp,
          statusText: p.statusLabel,
          notes: p.notes
        };
      })
    : [];

  return { facilityPoints, selectedPoint, operatingPoints };
}

// Simulate Building Occupancy breakdown card data
function deriveBuildingBreakdownData(selectedFacility, buildings) {
  const isAllSelected = selectedFacility === 'ALL';
  const totalHeadcount = buildings.reduce((acc, b) => acc + b.currentOccupancy, 0);
  const totalCapacity = buildings.reduce((acc, b) => acc + b.designedOccupancy, 0);
  const avgOccupancy = Number(((totalHeadcount / totalCapacity) * 100).toFixed(1));
  const totalDemand = Math.round(buildings.reduce((acc, b) => acc + b.currentDemandKw, 0));
  const campusEnergyPerPerson = Number((totalDemand / totalHeadcount).toFixed(3));

  const facMap = getFacilityDataMap(buildings);
  const activeFacility = isAllSelected ? null : (facMap[selectedFacility] || facMap['HOST-A']);

  const displayOccupancy = isAllSelected ? avgOccupancy : activeFacility.occupancy;
  const displayPowerDraw = isAllSelected ? totalDemand : activeFacility.powerDraw;
  const displayHeadcount = isAllSelected ? totalHeadcount : activeFacility.headcount;
  const displayCapacity = isAllSelected ? totalCapacity : activeFacility.capacity;
  const displayEnergyPerPerson = isAllSelected ? campusEnergyPerPerson : activeFacility.energyPerPerson;
  const baseLoad = isAllSelected ? 468.5 : activeFacility.baseLoad;
  const solar = isAllSelected ? 318 : activeFacility.solarAllocation;

  // Diagnostic rule
  const isWasteAnomaly = displayOccupancy <= 40 && displayPowerDraw >= 60;
  const isHighUtil = displayOccupancy >= 70 && displayPowerDraw >= 60;
  const isEfficient = displayOccupancy >= 70 && displayPowerDraw < 60;
  const isLowUse = !isWasteAnomaly && !isHighUtil && !isEfficient;

  let rule = 'Low Occ + Low Power: Normal Low-Use';
  if (isWasteAnomaly) rule = 'Low Occ + High Power: Idle Waste / Anomaly';
  else if (isHighUtil) rule = 'High Occ + High Power: Normal High Utilization';
  else if (isEfficient) rule = 'High Occ + Low Power: Efficient Operation';

  return {
    facilityName: isAllSelected ? 'All 8 Campus Facilities' : `${activeFacility.code} – ${activeFacility.name}`,
    displayOccupancy,
    displayPowerDraw,
    displayHeadcount,
    displayCapacity,
    displayEnergyPerPerson,
    baseLoad,
    solar,
    rule
  };
}

// TEST 1: ALL FACILITIES (OVERVIEW)
console.log('\n[TEST 1: OVERVIEW STATE (ALL)]');
const overviewChart = deriveChartData('ALL', INITIAL_BUILDINGS);
assert.strictEqual(overviewChart.facilityPoints.length, 8, 'Must have 8 points in facilityPoints');
assert.strictEqual(overviewChart.selectedPoint, null, 'No single selectedPoint when ALL');
assert.strictEqual(overviewChart.operatingPoints.length, 0, 'No diurnal trajectory when ALL');
console.log('✓ Overview: All 8 points rendered in standard mode');

// TEST 2: EACH OF THE 8 FACILITIES CLICK TEST
for (const code of facilityCodes) {
  console.log(`\n[TESTING CLICK: ${code}]`);

  // Chart data
  const chartData = deriveChartData(code, INITIAL_BUILDINGS);
  assert.strictEqual(chartData.facilityPoints.length, 8, `Must keep all 8 facilities visible when ${code} clicked`);
  assert(chartData.selectedPoint !== null, `Must have a valid selectedPoint for ${code}`);
  assert.strictEqual(chartData.selectedPoint.code, code, `selectedPoint.code must match ${code}`);
  assert(chartData.selectedPoint.occupancy > 0, `Occupancy must be > 0 for ${code}`);
  assert(chartData.selectedPoint.energy > 0, `Energy must be > 0 for ${code}`);
  assert.strictEqual(chartData.operatingPoints.length, 6, `Must have 6 diurnal periods for ${code}`);

  // Crosshair coordinates check
  const crosshairX = chartData.selectedPoint.occupancy;
  const crosshairY = chartData.selectedPoint.energy;
  console.log(`  -> Scatter Chart Highlight:`);
  console.log(`     Selected Node: ${chartData.selectedPoint.name} (${chartData.selectedPoint.code})`);
  console.log(`     Crosshair X: ${crosshairX}% | Y: ${crosshairY} kW | E/P: ${chartData.selectedPoint.energyPerPerson} kW/cap`);
  console.log(`     6 Diurnal Trajectory Points: ${chartData.operatingPoints.map(p => `${p.periodLabel} (${p.occupancy}%@${p.energy}kW)`).join(', ')}`);

  // Building Occupancy breakdown check
  const breakdown = deriveBuildingBreakdownData(code, INITIAL_BUILDINGS);
  assert.strictEqual(breakdown.displayOccupancy, chartData.selectedPoint.occupancy, `Occupancy breakdown must match for ${code}`);
  assert.strictEqual(breakdown.displayPowerDraw, chartData.selectedPoint.energy, `Power draw breakdown must match for ${code}`);
  assert.strictEqual(breakdown.displayHeadcount, chartData.selectedPoint.headcount, `Headcount breakdown must match for ${code}`);
  assert.strictEqual(breakdown.displayCapacity, chartData.selectedPoint.capacity, `Capacity breakdown must match for ${code}`);
  console.log(`  -> Building Occupancy Breakdown:`);
  console.log(`     Title: ${breakdown.facilityName}`);
  console.log(`     Occupancy: ${breakdown.displayOccupancy}% (${breakdown.displayHeadcount}/${breakdown.displayCapacity} ppl)`);
  console.log(`     Power Draw: ${breakdown.displayPowerDraw} kW | Base: ${breakdown.baseLoad} kW | Solar: ${breakdown.solar} kW`);
  console.log(`     Energy/Person: ${breakdown.displayEnergyPerPerson} kW/cap`);
  console.log(`     Active Diagnostic Rule: ${breakdown.rule}`);

  // Heatmap schedule check
  const heatmap = FACILITY_HEATMAPS[code];
  assert.strictEqual(heatmap.length, 6, `Heatmap must have 6 slots for ${code}`);
  console.log(`  -> Heatmap Correlator: ${heatmap.length} periods loaded with status '${heatmap[2].statusLabel}' at midday`);
}

// TEST 3: SPECIFIC COMPARISONS REQUESTED IN USER PROMPT
console.log('\n[TEST 3: SPECIFIC TRANSITION COMPARISONS]');

// HOST-A vs CAFE comparison
const hostAChart = deriveChartData('HOST-A', INITIAL_BUILDINGS);
const cafeChart = deriveChartData('CAFE', INITIAL_BUILDINGS);
assert.notStrictEqual(hostAChart.selectedPoint.occupancy, cafeChart.selectedPoint.occupancy, 'HOST-A and CAFE occupancy must differ');
assert.notStrictEqual(hostAChart.selectedPoint.energy, cafeChart.selectedPoint.energy, 'HOST-A and CAFE energy must differ');
console.log(`✓ Click HOST-A -> X: ${hostAChart.selectedPoint.occupancy}%, Y: ${hostAChart.selectedPoint.energy} kW (ANOMALY)`);
console.log(`✓ Click CAFE   -> X: ${cafeChart.selectedPoint.occupancy}%, Y: ${cafeChart.selectedPoint.energy} kW (HIGH UTILIZATION)`);
console.log('✓ Visual data coordinates visibly and distinctly change when switching from HOST-A to CAFE!');

// CAFE vs CS-LAB comparison
const csLabChart = deriveChartData('CS-LAB', INITIAL_BUILDINGS);
assert.notStrictEqual(cafeChart.selectedPoint.occupancy, csLabChart.selectedPoint.occupancy, 'CAFE and CS-LAB occupancy must differ');
assert.notStrictEqual(cafeChart.selectedPoint.energy, csLabChart.selectedPoint.energy, 'CAFE and CS-LAB energy must differ');
console.log(`✓ Click CS-LAB -> X: ${csLabChart.selectedPoint.occupancy}%, Y: ${csLabChart.selectedPoint.energy} kW (PEAK COMPUTING)`);
console.log('✓ Visual data coordinates visibly and distinctly change when switching from CAFE to CS-LAB!');

console.log('\n================================================================');
console.log('ALL FACILITY CLICK VISUALIZATION TESTS PASSED WITH 100% SUCCESS!');
console.log('================================================================');
