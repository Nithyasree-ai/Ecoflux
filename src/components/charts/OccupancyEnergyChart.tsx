import React, { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import { useEcoFlux } from '../../lib/dataStore';
import { FACILITY_HEATMAPS } from '../../data/campusData';

interface OccupancyEnergyChartProps {
  selectedFacility?: string;
}

export const OccupancyEnergyChart: React.FC<OccupancyEnergyChartProps> = ({ selectedFacility: propFacility }) => {
  const context = useEcoFlux();
  const selectedFacility = propFacility !== undefined ? propFacility : context.selectedFacility;
  const setSelectedFacility = context.setSelectedFacility;
  const buildings = context.buildings;

  // Facility-level live points directly dependent on selectedFacility and buildings
  const facilityPoints = useMemo(() => {
    return buildings.map(b => {
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
  }, [selectedFacility, buildings]);

  const selectedPoint = useMemo(() => {
    if (selectedFacility === 'ALL') return null;
    return facilityPoints.find(f => f.code === selectedFacility) || null;
  }, [selectedFacility, facilityPoints]);

  // If a specific facility is selected, load its operating period trajectory points
  const operatingPoints = useMemo(() => {
    if (selectedFacility === 'ALL' || !FACILITY_HEATMAPS[selectedFacility]) {
      return [];
    }
    const matchingBuilding = buildings.find(b => b.code === selectedFacility);
    return FACILITY_HEATMAPS[selectedFacility].map((p) => {
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
        notes: p.notes
      };
    });
  }, [selectedFacility, buildings]);

  // Custom SVG shape for rendering all facility points with dynamic highlight on selected node
  const renderFacilityShape = (props: any) => {
    const { cx, cy, payload } = props;
    if (typeof cx !== 'number' || typeof cy !== 'number' || isNaN(cx) || isNaN(cy) || !payload) {
      return <g />;
    }

    const isSelected = selectedFacility !== 'ALL' && payload.code === selectedFacility;
    const isAnomaly = payload.status === 'warning' || payload.status === 'alert';
    const isAll = selectedFacility === 'ALL';

    if (isSelected) {
      const haloFill = isAnomaly ? 'rgba(244, 63, 94, 0.22)' : 'rgba(16, 185, 129, 0.22)';
      const strokeColor = isAnomaly ? '#f43f5e' : '#10b981';
      const coreColor = isAnomaly ? '#fb7185' : '#34d399';
      const labelText = `${payload.code}: ${payload.occupancy}% • ${payload.energy} kW`;
      const badgeWidth = Math.max(115, labelText.length * 6.5 + 16);

      return (
        <g key={`highlighted-node-${payload.code}`}>
          {/* Outer Pulsing Radar Ring */}
          <circle
            cx={cx}
            cy={cy}
            r={24}
            fill={haloFill}
            stroke={strokeColor}
            strokeWidth={1.8}
            strokeDasharray="3 3"
          />
          {/* Secondary Intense Glow Ring */}
          <circle
            cx={cx}
            cy={cy}
            r={14}
            fill={isAnomaly ? 'rgba(244, 63, 94, 0.45)' : 'rgba(16, 185, 129, 0.45)'}
            stroke={strokeColor}
            strokeWidth={2}
          />
          {/* Inner Solid Core */}
          <circle
            cx={cx}
            cy={cy}
            r={8}
            fill={coreColor}
            stroke="#ffffff"
            strokeWidth={2.5}
          />
          {/* Floating Callout Badge */}
          <g>
            <rect
              x={cx + 12}
              y={cy - 24}
              width={badgeWidth}
              height={20}
              rx={5}
              fill="#050e0a"
              stroke={strokeColor}
              strokeWidth={1.5}
            />
            <text
              x={cx + 18}
              y={cy - 10}
              fill="#ffffff"
              fontSize={10}
              fontFamily="monospace"
              fontWeight="bold"
            >
              {labelText}
            </text>
          </g>
        </g>
      );
    }

    // Non-selected point (de-emphasized when a facility is selected)
    const baseColor = isAnomaly ? '#f43f5e' : payload.occupancy > 75 ? '#10b981' : '#38bdf8';
    const opacity = isAll ? 0.95 : 0.28;
    const radius = isAll ? 7 : 5;

    return (
      <g key={`facility-node-${payload.code}`}>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill={baseColor}
          fillOpacity={opacity}
          stroke={isAnomaly ? '#fda4af' : '#ffffff'}
          strokeWidth={isAll ? 1.5 : 0.8}
          strokeOpacity={opacity}
        />
        {isAll && (
          <text
            x={cx}
            y={cy - 10}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize={9}
            fontFamily="monospace"
          >
            {payload.code}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-between" data-testid="occupancy-energy-correlation-chart">
      {/* Real-time Focus Header with Coordinate Readout */}
      <div className="p-3 mb-3 rounded-xl bg-[#07130e] border border-emerald-500/25 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${selectedPoint?.status === 'warning' ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
          <span className="text-slate-400">Plotted Facility:</span>
          <strong className="text-white text-sm font-bold">
            {selectedPoint ? `${selectedPoint.code} – ${selectedPoint.name}` : 'Campus Overview (All 8 Facilities)'}
          </strong>
        </div>

        {selectedPoint ? (
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <span>
              X (Occupancy): <strong className="text-cyan-300 text-sm">{selectedPoint.occupancy}%</strong>
            </span>
            <span>
              Y (Power Draw): <strong className={`text-sm ${selectedPoint.status === 'warning' ? 'text-rose-400' : 'text-emerald-400'}`}>{selectedPoint.energy} kW</strong>
            </span>
            <span>
              Energy/Capita: <strong className="text-white text-sm">{selectedPoint.energyPerPerson} kW</strong>
            </span>
            <button
              type="button"
              onClick={() => setSelectedFacility('ALL')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer ml-1"
            >
              Reset to All
            </button>
          </div>
        ) : (
          <span className="text-slate-400 text-xs">Click any facility card below to highlight and focus its coordinates</span>
        )}
      </div>

      {/* Main Scatter Graph */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            key={`scatter-chart-${selectedFacility}`}
            margin={{ top: 15, right: 25, left: -15, bottom: 5 }}
          >
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

            {/* Dynamic Crosshair Reference Lines for the Selected Facility */}
            {selectedPoint && (
              <>
                <ReferenceLine
                  x={selectedPoint.occupancy}
                  stroke={selectedPoint.status === 'warning' ? '#f43f5e' : '#34d399'}
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  label={{
                    value: `X: ${selectedPoint.occupancy}%`,
                    fill: selectedPoint.status === 'warning' ? '#f43f5e' : '#34d399',
                    position: 'top',
                    fontSize: 11,
                    fontWeight: 'bold'
                  }}
                />
                <ReferenceLine
                  y={selectedPoint.energy}
                  stroke={selectedPoint.status === 'warning' ? '#f43f5e' : '#34d399'}
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  label={{
                    value: `Y: ${selectedPoint.energy} kW`,
                    fill: selectedPoint.status === 'warning' ? '#f43f5e' : '#34d399',
                    position: 'right',
                    fontSize: 11,
                    fontWeight: 'bold'
                  }}
                />
              </>
            )}

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
            <ZAxis range={[120, 200]} />

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

                      {d.periodLabel && (
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

            {/* Diurnal trajectory nodes (when a specific facility is selected) */}
            {operatingPoints.length > 0 && (
              <Scatter
                key={`operating-scatter-${selectedFacility}`}
                name="Diurnal Trajectory"
                data={operatingPoints}
                shape="diamond"
                fill="#38bdf8"
                opacity={0.8}
              />
            )}

            {/* All 8 Facilities Scatter Series with Dynamic Shape Highlighting */}
            <Scatter
              key={`facilities-scatter-${selectedFacility}`}
              name="Facilities"
              data={facilityPoints}
              shape={renderFacilityShape}
              onClick={(entry) => {
                if (entry && entry.code) setSelectedFacility(entry.code);
              }}
              cursor="pointer"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Summary Readout */}
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
              <span>Diurnal Trajectory (6 Periods)</span>
            </span>
          )}
        </div>

        <div>
          {selectedPoint ? (
            <span className="font-mono text-slate-300">
              Active Focus: <strong className="text-white">{selectedPoint.name}</strong> • X: <strong className="text-cyan-300">{selectedPoint.occupancy}%</strong> • Y: <strong className={selectedPoint.status === 'warning' ? 'text-rose-400' : 'text-emerald-400'}>{selectedPoint.energy} kW</strong>
            </span>
          ) : (
            <span className={buildings.some(b => b.status === 'warning' || b.status === 'alert') ? 'text-rose-400 font-mono' : 'text-emerald-400 font-mono'}>
              {buildings.find(b => b.status === 'warning' || b.status === 'alert') 
                ? `1 Anomaly flagged: ${buildings.find(b => b.status === 'warning' || b.status === 'alert')?.name} (${buildings.find(b => b.status === 'warning' || b.status === 'alert')?.occupancyPct}% occ @ ${buildings.find(b => b.status === 'warning' || b.status === 'alert')?.currentDemandKw} kW)`
                : '✓ All 8 campus facilities operating within standard correlation envelope'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

