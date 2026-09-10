// Verification test for Campus Facility Utilization Grid, Building Occupancy, Live Occupancy vs Electricity Demand, and Heatmap Correlator
import assert from 'node:assert';
import { INITIAL_BUILDINGS, FACILITY_HEATMAPS, getFacilityDataMap } from '../src/data/campusData.ts';

console.log('--- RUNNING OCCUPANCY & HEATMAP CORRELATOR INTERACTIVITY VERIFICATION ---');

const facilityCodes = ['ACAD', 'CS-LAB', 'LIB', 'HOST-A', 'HOST-B', 'ADMIN', 'ADV-LAB', 'CAFE'];

// 1. Verify 8 Facilities Exist in Central Dataset
console.log('✓ Checking All 8 Facilities Exist:');
assert.strictEqual(INITIAL_BUILDINGS.length, 8);
const initialMap = getFacilityDataMap(INITIAL_BUILDINGS);
for (const code of facilityCodes) {
  assert(code in initialMap, `Missing facility code: ${code}`);
  const fac = initialMap[code];
  assert(fac.name, `Facility ${code} missing name`);
  assert(fac.capacity > 0, `Facility ${code} capacity must be > 0`);
  assert(fac.headcount >= 0, `Facility ${code} headcount must be >= 0`);
  assert(fac.occupancy >= 0 && fac.occupancy <= 100, `Facility ${code} occupancy out of bounds`);
  assert(fac.powerDraw > 0, `Facility ${code} power draw must be > 0`);
  assert(fac.baseLoad > 0, `Facility ${code} base load must be > 0`);
  assert(fac.energyPerPerson > 0, `Facility ${code} energyPerPerson must be > 0`);
  console.log(`  -> ${code} (${fac.name}): Occ=${fac.occupancy}%, Headcount=${fac.headcount}/${fac.capacity}, Draw=${fac.powerDraw} kW, E/P=${fac.energyPerPerson} kW/cap`);
}

// 2. Verify Energy / Person formula: powerDraw / headcount
console.log('\n✓ Checking Dynamic Energy/Person Formula (powerDraw / headcount):');
for (const code of facilityCodes) {
  const fac = initialMap[code];
  const expectedEpp = fac.headcount > 0 ? Number((fac.powerDraw / fac.headcount).toFixed(3)) : 0;
  assert.strictEqual(fac.energyPerPerson, expectedEpp, `Mismatch in energyPerPerson for ${code}`);
}
console.log('  -> Energy/person calculation is strictly correct and safe.');

// 3. Verify Heatmap Schedules exist for all facilities + ALL
console.log('\n✓ Checking Heatmap Correlator Schedules:');
assert('ALL' in FACILITY_HEATMAPS, 'Missing ALL heatmap schedule');
for (const code of facilityCodes) {
  assert(code in FACILITY_HEATMAPS, `Missing heatmap schedule for ${code}`);
  const periods = FACILITY_HEATMAPS[code];
  assert.strictEqual(periods.length, 6, `Expected 6 operating periods for ${code}`);
  for (const p of periods) {
    assert(p.period, `Period missing in ${code}`);
    assert(p.label, `Label missing in ${code}`);
    assert(p.occupancyPct >= 0 && p.occupancyPct <= 100, `Period occupancy out of bounds in ${code}`);
    assert(p.demandKw > 0, `Period demand must be > 0 in ${code}`);
    assert(['anomaly', 'high-utilization', 'efficient', 'low-use'].includes(p.status), `Invalid status in ${code}: ${p.status}`);
  }
}
console.log('  -> All 8 facilities + ALL have dedicated 6-period correlation heatmaps.');

// 4. Verify Anomaly Status Differentiation
console.log('\n✓ Checking Anomaly Differentiation:');
const hostA = initialMap['HOST-A'];
assert.strictEqual(hostA.anomalyStatus, 'warning');
assert.strictEqual(hostA.anomalyDetected, true);
assert(hostA.wastedEnergyCost > 0);
console.log(`  -> HOST-A correctly flagged as ANOMALY: ${hostA.anomalyTitle}`);

const acad = initialMap['ACAD'];
assert.strictEqual(acad.anomalyDetected, false);
assert.strictEqual(acad.wastedEnergyCost, 0);
console.log(`  -> ACAD correctly evaluated as OPTIMAL: ${acad.anomalyTitle}`);

// 5. Verify Load Shedding Simulation (rec-04)
console.log('\n✓ Checking Load Shedding updates HOST-A dynamically:');
const updatedBuildings = INITIAL_BUILDINGS.map(b => 
  b.code === 'HOST-A' ? { ...b, currentDemandKw: 54.0, status: 'optimal' } : b
);
const updatedMap = getFacilityDataMap(updatedBuildings);
const updatedHostA = updatedMap['HOST-A'];
assert.strictEqual(updatedHostA.powerDraw, 54.0);
assert.strictEqual(updatedHostA.anomalyStatus, 'optimal');
assert.strictEqual(updatedHostA.anomalyDetected, false);
console.log(`  -> After load shedding: HOST-A draw=${updatedHostA.powerDraw} kW, status=${updatedHostA.anomalyStatus}`);

// 6. Verify Facility Switching Distinctness
console.log('\n✓ Checking Facility Data Distinctness:');
const seenDraws = new Set();
for (const code of facilityCodes) {
  const fac = initialMap[code];
  seenDraws.add(fac.powerDraw);
}
assert(seenDraws.size >= 7, 'Facilities must have distinctly different power draws');
console.log(`  -> Distinct power draw values verified across facilities (${seenDraws.size} unique values).`);

console.log('\nALL OCCUPANCY & HEATMAP CORRELATOR INVARIANTS PASSED SUCCESSFULLY!');
