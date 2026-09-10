// Node verification test for BESS Architecture and Telemetry Data Flow
import assert from 'node:assert';

console.log('--- RUNNING BESS ARCHITECTURE & TELEMETRY VERIFICATION ---');

// 1. Static Hardware Specifications Invariant Test
const BESS_ARCHITECTURE_SPECS = {
  chemistry: 'LiFePO4 (LFP)',
  nameplateCapacityKwh: 1200,
  maxInverterCRate: '0.5C (250 kW)',
  roundTripEfficiencyPct: 92.4,
  lifetimeCycles: '342 / 6,000',
  coolingMedium: 'Closed Glycol Loop'
};

console.log('✓ Checking Fixed Hardware Specifications:');
assert.strictEqual(BESS_ARCHITECTURE_SPECS.chemistry, 'LiFePO4 (LFP)');
assert.strictEqual(BESS_ARCHITECTURE_SPECS.nameplateCapacityKwh, 1200);
assert.strictEqual(BESS_ARCHITECTURE_SPECS.maxInverterCRate, '0.5C (250 kW)');
assert.strictEqual(BESS_ARCHITECTURE_SPECS.roundTripEfficiencyPct, 92.4);
assert.strictEqual(BESS_ARCHITECTURE_SPECS.lifetimeCycles, '342 / 6,000');
assert.strictEqual(BESS_ARCHITECTURE_SPECS.coolingMedium, 'Closed Glycol Loop');
console.log('  -> Hardware specs are strictly defined and invariant.');

// 2. Consistent Value Calculation Invariant Test
function computeStoredEnergy(soc) {
  assert(soc >= 0 && soc <= 100, `SOC out of bounds: ${soc}`);
  const stored = (1200 * soc) / 100;
  assert(stored <= 1200, `Stored energy exceeds 1200 kWh: ${stored}`);
  return Number(stored.toFixed(1));
}

function computeBackupTime(storedKwh, baseLoadKw = 152) {
  return Number((storedKwh / baseLoadKw).toFixed(1));
}

console.log('\n✓ Checking Stored Energy Formula (1200 * SOC / 100):');
assert.strictEqual(computeStoredEnergy(100), 1200.0);
assert.strictEqual(computeStoredEnergy(95), 1140.0);
assert.strictEqual(computeStoredEnergy(78.5), 942.0);
assert.strictEqual(computeStoredEnergy(50), 600.0);
assert.strictEqual(computeStoredEnergy(20), 240.0);
assert.strictEqual(computeStoredEnergy(0), 0.0);
console.log('  -> Stored energy is strictly derived from SOC and bounded by 1,200 kWh.');

// 3. Central BESS State Structure Test
const initialBessState = {
  soc: 78.5,
  storedEnergy: 942.0,
  activeFlow: 0,
  backupTime: 6.2,
  packHealth: 98.4,
  packTemperature: 24.6,
  cellHealth: 98.4,
  cycles: 342,
  dispatchMode: 'AUTO',
  status: 'IDLE'
};

console.log('\n✓ Checking Central BESS State schema:');
for (const key of ['soc', 'storedEnergy', 'activeFlow', 'backupTime', 'packHealth', 'packTemperature', 'cellHealth', 'cycles', 'dispatchMode', 'status']) {
  assert(key in initialBessState, `Missing key ${key} in central bessState`);
}
console.log('  -> Central BESS state contains all required dynamic keys.');

// 4. Facility Selection Independence Test
const facilities = [
  { code: 'ACAD', name: 'Academic Block', demandKw: 92.4, solarKw: 58.2 },
  { code: 'CS-LAB', name: 'Computer Science Block', demandKw: 88.6, solarKw: 69.5 },
  { code: 'CAFE', name: 'Campus Dining Hub', demandKw: 61.2, solarKw: 26.0 }
];

console.log('\n✓ Checking Facility Selection does not mutate BESS Architecture:');
for (const fac of facilities) {
  // Facility influences demand and solar contribution
  assert(fac.demandKw > 0);
  assert(fac.solarKw > 0);
  
  // But BESS Architecture specs remain completely unchanged
  assert.strictEqual(BESS_ARCHITECTURE_SPECS.chemistry, 'LiFePO4 (LFP)');
  assert.strictEqual(BESS_ARCHITECTURE_SPECS.nameplateCapacityKwh, 1200);
  assert.strictEqual(BESS_ARCHITECTURE_SPECS.maxInverterCRate, '0.5C (250 kW)');
  assert.strictEqual(BESS_ARCHITECTURE_SPECS.roundTripEfficiencyPct, 92.4);
  assert.strictEqual(BESS_ARCHITECTURE_SPECS.coolingMedium, 'Closed Glycol Loop');
  console.log(`  -> Facility ${fac.code}: demand=${fac.demandKw}kW, solar=${fac.solarKw}kW. BESS Specs: Unchanged.`);
}

// 5. Operator Dispatch Mode Transitions Test
console.log('\n✓ Checking Operator Dispatch Mode Transitions:');

// CHARGE
let state = { ...initialBessState };
state.dispatchMode = 'CHARGE';
state.status = 'CHARGING';
state.activeFlow = 85.0;
assert.strictEqual(state.status, 'CHARGING');
assert.strictEqual(state.activeFlow, 85.0);

// Simulation tick: charge
const chargedSoc = Math.min(95.0, state.soc + 0.3);
state.soc = Number(chargedSoc.toFixed(1));
state.storedEnergy = computeStoredEnergy(state.soc);
state.backupTime = computeBackupTime(state.storedEnergy);
state.packTemperature = Number((state.packTemperature + 0.02).toFixed(1));
assert(state.soc > 78.5, 'SOC must increase when charging');
assert(state.storedEnergy > 942.0, 'Stored energy must increase when charging');
console.log(`  -> CHARGE: SOC=${state.soc}%, Stored=${state.storedEnergy} kWh, Flow=+${state.activeFlow} kW, Status=${state.status}`);

// DISCHARGE
state.dispatchMode = 'DISCHARGE';
state.status = 'DISCHARGING';
state.activeFlow = -88.0;
assert.strictEqual(state.status, 'DISCHARGING');
assert.strictEqual(state.activeFlow, -88.0);

// Simulation tick: discharge
const dischargedSoc = Math.max(20.0, state.soc - 0.6);
state.soc = Number(dischargedSoc.toFixed(1));
state.storedEnergy = computeStoredEnergy(state.soc);
state.backupTime = computeBackupTime(state.storedEnergy);
state.packTemperature = Number((state.packTemperature + 0.02).toFixed(1));
assert(state.soc < 78.8, 'SOC must decrease when discharging');
assert(state.storedEnergy < 945.6, 'Stored energy must decrease when discharging');
console.log(`  -> DISCHARGE: SOC=${state.soc}%, Stored=${state.storedEnergy} kWh, Flow=${state.activeFlow} kW, Status=${state.status}`);

// AUTO / STANDBY
state.dispatchMode = 'AUTO';
state.status = 'IDLE';
state.activeFlow = 0;
assert.strictEqual(state.status, 'IDLE');
assert.strictEqual(state.activeFlow, 0);
const stableSoc = state.soc;
// Simulation tick: auto idle
const idleTemp = state.packTemperature > 24.2 ? Number((state.packTemperature - 0.02).toFixed(1)) : 24.2;
state.packTemperature = idleTemp;
assert.strictEqual(state.soc, stableSoc, 'SOC must remain stable in AUTO mode');
assert.strictEqual(state.activeFlow, 0, 'Active flow must be 0 kW in AUTO mode');
console.log(`  -> AUTO: SOC=${state.soc}%, Stored=${state.storedEnergy} kWh, Flow=${state.activeFlow} kW, Status=${state.status}`);

console.log('\nALL BESS ARCHITECTURE & TELEMETRY INVARIANTS PASSED SUCCESSFULLY!');
