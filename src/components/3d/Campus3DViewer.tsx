import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useEcoFlux } from '../../lib/dataStore';
import { Building } from '../../types';
import { Info, Maximize2, Zap, Sun, BatteryCharging, Sparkles } from 'lucide-react';

interface Campus3DViewerProps {
  interactive?: boolean;
  height?: string;
  onSelectBuilding?: (building: Building) => void;
}

export const Campus3DViewer: React.FC<Campus3DViewerProps> = ({
  interactive = true,
  height = '500px',
  onSelectBuilding
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { buildings, solarKw, battery } = useEcoFlux();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(buildings[0]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050a08);
    scene.fog = new THREE.FogExp2(0x050a08, 0.015);

    const width = container.clientWidth || 800;
    const heightPx = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 1, 1000);
    camera.position.set(45, 38, 55);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0x103022, 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xa7f3d0, 2.2);
    dirLight.position.set(30, 50, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Subtle cyan accent light
    const cyanLight = new THREE.PointLight(0x06b6d4, 3, 60);
    cyanLight.position.set(-20, 15, -10);
    scene.add(cyanLight);

    // 3. Ground Grid
    const gridHelper = new THREE.GridHelper(80, 40, 0x10b981, 0x0f291e);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Circular ground disc
    const groundGeo = new THREE.CircleGeometry(42, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x08130f,
      roughness: 0.9,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    // 4. Central BESS Battery Storage Unit (Green Glowing Cube with pulse)
    const bessGroup = new THREE.Group();
    bessGroup.position.set(0, 0, 0);

    const bessGeo = new THREE.BoxGeometry(6, 4, 6);
    const bessMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x064e3b,
      emissiveIntensity: 0.6
    });
    const bessMesh = new THREE.Mesh(bessGeo, bessMat);
    bessMesh.position.y = 2;
    bessMesh.castShadow = true;
    bessGroup.add(bessMesh);

    // BESS Pulsing Ring
    const ringGeo = new THREE.RingGeometry(4, 4.4, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x34d399, side: THREE.DoubleSide });
    const bessRing = new THREE.Mesh(ringGeo, ringMat);
    bessRing.rotation.x = -Math.PI / 2;
    bessRing.position.y = 0.05;
    bessGroup.add(bessRing);

    scene.add(bessGroup);

    // 5. Build 8 Campus Buildings with 3D Geometries & Rooftop Solar Arrays
    const buildingMeshes: { mesh: THREE.Mesh; building: Building }[] = [];
    const buildingPositions = [
      { x: -18, z: -15, w: 10, d: 8, h: 12 }, // Academic Block
      { x: 18, z: -16, w: 12, d: 7, h: 14 }, // Computer Science Block
      { x: -22, z: 8, w: 9, d: 9, h: 9 },   // Library
      { x: 20, z: 12, w: 8, d: 11, h: 10 }, // Hostel A
      { x: 10, z: 22, w: 8, d: 10, h: 11 }, // Hostel B
      { x: -10, z: -24, w: 9, d: 6, h: 8 }, // Admin
      { x: -5, z: 20, w: 11, d: 8, h: 13 }, // Lab Block
      { x: -22, z: -4, w: 7, d: 7, h: 6 },  // Cafeteria
    ];

    buildings.forEach((b, idx) => {
      const pos = buildingPositions[idx] || { x: 0, z: 0, w: 8, d: 8, h: 10 };
      const buildingGroup = new THREE.Group();
      buildingGroup.position.set(pos.x, 0, pos.z);

      // Building Body
      const bGeo = new THREE.BoxGeometry(pos.w, pos.h, pos.d);
      const isWarning = b.status === 'warning';
      const bMat = new THREE.MeshStandardMaterial({
        color: isWarning ? 0x9f1239 : 0x0f261d,
        roughness: 0.3,
        metalness: 0.6,
        emissive: isWarning ? 0x4c0519 : 0x062117,
        emissiveIntensity: 0.5
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.y = pos.h / 2;
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      (bMesh as any).userData = { building: b };
      buildingGroup.add(bMesh);
      buildingMeshes.push({ mesh: bMesh, building: b });

      // Rooftop Solar Array (Blue/Cyan reflective panels)
      if (b.solarInstalledKw > 0) {
        const solarGeo = new THREE.BoxGeometry(pos.w * 0.82, 0.4, pos.d * 0.82);
        const solarMat = new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          roughness: 0.1,
          metalness: 0.9,
          emissive: 0x0369a1,
          emissiveIntensity: 0.7
        });
        const solarMesh = new THREE.Mesh(solarGeo, solarMat);
        solarMesh.position.y = pos.h + 0.2;
        buildingGroup.add(solarMesh);
      }

      // Windows glow lines
      const edgeGeo = new THREE.EdgesGeometry(bGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: isWarning ? 0xf43f5e : 0x10b981,
        transparent: true,
        opacity: 0.4
      });
      const wireframe = new THREE.LineSegments(edgeGeo, edgeMat);
      wireframe.position.y = pos.h / 2;
      buildingGroup.add(wireframe);

      scene.add(buildingGroup);
    });

    // 6. Glowing Energy Particles flowing: Solar -> Battery -> Buildings
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleProgress = new Float32Array(particleCount);
    const particleRoutes: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];

    // Create routes between building solar roofs and central BESS
    buildingPositions.forEach((pos) => {
      particleRoutes.push({
        start: new THREE.Vector3(pos.x, pos.h + 0.5, pos.z),
        end: new THREE.Vector3(0, 3, 0)
      });
    });

    for (let i = 0; i < particleCount; i++) {
      particleProgress[i] = Math.random();
      const route = particleRoutes[i % particleRoutes.length];
      const p = new THREE.Vector3().lerpVectors(route.start, route.end, particleProgress[i]);
      // Arc curvature
      p.y += Math.sin(particleProgress[i] * Math.PI) * 5;
      particlePositions[i * 3] = p.x;
      particlePositions[i * 3 + 1] = p.y;
      particlePositions[i * 3 + 2] = p.z;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x4ade80,
      size: 1.2,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 7. Raycasting for building selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      if (!interactive) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(buildingMeshes.map(b => b.mesh));

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const bData = (hit as any).userData?.building as Building;
        if (bData) {
          setSelectedBuilding(bData);
          if (onSelectBuilding) onSelectBuilding(bData);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // 8. Animation & Camera Orbit Loop
    let angle = 0;
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Slow orbital camera motion
      if (!isHovered) {
        angle += 0.0025;
        camera.position.x = Math.sin(angle) * 65;
        camera.position.z = Math.cos(angle) * 65;
        camera.lookAt(0, 4, 0);
      }

      // Pulse BESS ring
      const time = Date.now() * 0.003;
      bessRing.scale.set(1 + Math.sin(time) * 0.15, 1 + Math.sin(time) * 0.15, 1);

      // Animate flowing energy particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        particleProgress[i] += 0.008;
        if (particleProgress[i] > 1) particleProgress[i] = 0;

        const route = particleRoutes[i % particleRoutes.length];
        const prog = particleProgress[i];
        const p = new THREE.Vector3().lerpVectors(route.start, route.end, prog);
        p.y += Math.sin(prog * Math.PI) * 4;

        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [buildings, interactive, isHovered, onSelectBuilding]);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-emerald-500/20 bg-[#050a08]"
      style={{ height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Canvas Mounting Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Futuristic Header Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 pointer-events-none">
        <div className="flex items-center gap-2 bg-[#07130e]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-500/30 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white tracking-wide">3D CAMPUS TWIN</span>
          <span className="text-emerald-400 font-mono">LIVE TELEMETRY</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[#07130e]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-500/20 text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Flow: Solar → BESS → Buildings</span>
        </div>
      </div>

      {/* Selected Building Telemetry Card Overlay */}
      {selectedBuilding && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-10 bg-[#081510]/95 backdrop-blur-xl p-4 rounded-2xl border border-emerald-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  {selectedBuilding.code}
                </span>
                <span className="text-xs text-slate-400">{selectedBuilding.category}</span>
              </div>
              <h4 className="text-base font-bold text-white mt-1">{selectedBuilding.name}</h4>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-emerald-400 font-mono">{selectedBuilding.currentDemandKw}</span>
              <span className="text-xs text-slate-400 ml-1">kW</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-emerald-500/15 text-center text-xs">
            <div className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <span className="block text-slate-400 text-[10px]">Rooftop Solar</span>
              <span className="font-bold text-amber-300 font-mono">{selectedBuilding.solarInstalledKw} kW</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <span className="block text-slate-400 text-[10px]">Occupancy</span>
              <span className="font-bold text-emerald-400 font-mono">{selectedBuilding.occupancyPct}%</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <span className="block text-slate-400 text-[10px]">Green Score</span>
              <span className="font-bold text-cyan-400 font-mono">{selectedBuilding.currentGreenScore}/100</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Instructions */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
        <Info className="w-3.5 h-3.5 text-emerald-400" />
        <span>Click any building to inspect telemetry</span>
      </div>
    </div>
  );
};
