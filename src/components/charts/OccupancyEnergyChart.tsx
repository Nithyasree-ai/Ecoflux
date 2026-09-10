import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine, ReferenceArea } from 'recharts';
import { useEcoFlux } from '../../lib/dataStore';
import { FACILITY_HEATMAPS } from '../../data/campusData';

export const OccupancyEnergyChart: React.FC = () => {
  const { buildings, selectedFacility, setSelectedFacility } = useEcoFlux();

  // Facility-level live points
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
      isSelected,
      isFacilityPoint: true
    };
  });

  // If a specific facility is selected, load its operating period trajectory points
  const operatingPoints = selectedFacility !== 'ALL' && FACILITY_HEATMAPS[selectedFacility]
    ? FACILITY_HEATMAPS[selectedFacility].map((p, idx) => {
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
          status: p.status === 'anomaly' ? 'warning' : p.status === 'high-utilization' ? 'optimal' : 'normal',
          statusText: p.statusLabel,
          headcount: approxHeadcount,
          capacity: matchingBuilding?.designedOccupancy || 300,
          energyPerPerson: epp,
          notes: p.notes,
          isSelected: false,
          isOperatingPeriod: true
        };
      })
    : [];

  const selectedBuildingData = facilityPoints.find(f => f.code === selectedFacility);

  return (
    <div className="w-full h-full flex flex-col justify-between" data-testid="occupancy-energy-correlation-chart">
      {/* Chart Subtitle Indicator Bar */}
      <div className="flex items-center justify-between pb-2 text-xs font-mono">
        <span className="text-slate-400">
          Mode: <strong className={selectedFacility === 'ALL' ? 'text-cyan-400' : 'text-emerald-400'}>
            {selectedFacility === 'ALL' ? 'Campus Overview (All 8 Facilities)' : `${selectedFacility} Focus & Operating Trajectory`}
          </strong>
        </span>
        {selectedFacility !== 'ALL' && (
          <button
            type="button"
            onClick={() => setSelectedFacility('ALL')}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
          >
            ← Reset to All Facilities
          </button>
        )}
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 15, right: 20, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.08)" />

            {/* Waste Anomaly Zone Shading (Low occupancy <= 40%, High power >= 60 kW) */}
            <ReferenceArea
              x1={0}
              x2={40}
              y1={60}
              y2={150}
              fill="rgba(244, 63, 94, 0.05)"
              stroke="rgba(244, 63, 94, 0.2)"
              strokeDasharray="4 4"
            />

            <XAxis
              type="number"
              dataKey="occupancy"
              name="Occupancy"
              unit="%"
              stroke="#64748b"
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="energy"
              name="Power Draw"
              unit=" kW"
              stroke="#64748b"
              domain={[0, 150]}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <ZAxis range={[120, 320]} />

            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ payload }) => {
                if (payload && payload.length) {
                  const d = payload[0].payload;
                  const isAnomaly = d.status === 'warning' || d.statusText?.toLowerCase().includes('anomaly');

                  return (
                    <div className="bg-[#050e0a]/95 border border-emerald-500/30 p-3.5 rounded-xl shadow-2xl text-xs space-y-1.5 backdrop-blur-md min-w-[220px]">
                      <div className="font-bold text-white flex items-center justify-between gap-3 border-b border-white/10 pb-1">
                        <span>{d.name}</span>
                        <span className="font-mono text-emerald-400 font-bold">{d.code}</span>
                      </div>

                      {d.isOperatingPeriod && (
                        <div className="text-[11px] font-mono text-cyan-300">
                          Period: {d.periodLabel} ({d.timeRange})
                        </div>
                      )}

                      <div className="text-slate-300 flex justify-between">
                        <span>Occupancy:</span>
                        <strong className="text-white font-mono">{d.occupancy}%</strong>
                      </div>

                      <div className="text-slate-300 flex justify-between">
                        <span>Power Draw:</span>
                        <strong className={isAnomaly ? 'text-rose-400 font-mono' : 'text-emerald-400 font-mono'}>
                          {d.energy} kW
                        </strong>
                      </div>

                      <div className="text-slate-300 flex justify-between">
                        <span>Headcount:</span>
                        <span className="text-white font-mono">{d.headcount} / {d.capacity} ppl</span>
                      </div>

                      <div className="text-slate-300 flex justify-between">
                        <span>Energy / Person:</span>
                        <strong className="text-cyan-300 font-mono">{d.energyPerPerson} kW/cap</strong>
                      </div>

                      <div className="pt-1.5 border-t border-white/10 flex items-center justify-between">
                        <span className="text-slate-400 text-[10px]">Status:</span>
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          isAnomaly
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {d.statusText || (isAnomaly ? 'Anomaly' : 'Optimal')}
                        </span>
                      </div>

                      {d.notes && (
                        <p className="text-[10px] text-slate-400 italic pt-1 border-t border-white/5 leading-tight">
                          {d.notes}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Operating period trajectory nodes (when a specific facility is selected) */}
            {operatingPoints.length > 0 && (
              <Scatter
                name="Operating Periods"
                data={operatingPoints}
                shape="diamond"
              >
                {operatingPoints.map((entry, idx) => (
                  <Cell
                    key={`period-cell-${idx}`}
                    fill={entry.status === 'warning' ? '#f43f5e' : entry.occupancy > 70 ? '#38bdf8' : '#10b981'}
                    opacity={0.8}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                ))}
              </Scatter>
            )}

            {/* Main Facility Nodes */}
            <Scatter
              name="Facilities"
              data={facilityPoints}
              onClick={(entry) => {
                if (entry && entry.code) setSelectedFacility(entry.code);
              }}
              cursor="pointer"
            >
              {facilityPoints.map((entry, index) => {
                const isSelected = selectedFacility !== 'ALL' && entry.code === selectedFacility;
                const isAnomaly = entry.status === 'warning';
                const opacity = selectedFacility === 'ALL' || isSelected ? 1 : 0.25;

                let fill = isAnomaly ? '#f43f5e' : entry.occupancy > 70 ? '#10b981' : '#38bdf8';
                if (isSelected) {
                  fill = isAnomaly ? '#fb7185' : '#34d399';
                }

                return (
                  <Cell
                    key={`facility-cell-${index}`}
                    fill={fill}
                    opacity={opacity}
                    stroke={isSelected ? '#ffffff' : isAnomaly ? '#fda4af' : 'transparent'}
                    strokeWidth={isSelected ? 3 : isAnomaly ? 1.5 : 0}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Telemetry Readout */}
      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-emerald-500/10 text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span>Optimal</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
            <span>Normal</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span>Anomaly</span>
          </span>
          {selectedFacility !== 'ALL' && (
            <span className="flex items-center gap-1 text-cyan-300">
              <span className="w-2.5 h-2.5 rotate-45 bg-cyan-400 inline-block" />
              <span>Operating Schedule</span>
            </span>
          )}
        </div>

        <div>
          {selectedBuildingData ? (
            <span className="font-mono text-slate-300">
              {selectedBuildingData.name}: <strong className="text-white">{selectedBuildingData.occupancy}%</strong> @ <strong className={selectedBuildingData.status === 'warning' ? 'text-rose-400' : 'text-emerald-400'}>{selectedBuildingData.energy} kW</strong> ({selectedBuildingData.energyPerPerson} kW/cap)
            </span>
          ) : (
            <span className="text-rose-400 font-mono">1 Anomaly flagged: Hostel Block A (29.5% occ @ 71.4 kW)</span>
          )}
        </div>
      </div>
    </div>
  );
};
