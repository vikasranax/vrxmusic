'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import * as storeModule from '@/lib/store';
import { getChannel } from '@/lib/playlistData';

const useStore =
  storeModule.useStore ||
  storeModule.default?.useStore ||
  storeModule.default;

// ---------- IMAGE ----------
function ImageBackground({ url }) {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center blur-md scale-110"
      style={{ backgroundImage: `url(${url})` }}
    />
  );
}

// ---------- BUS (realistic AI scene) ----------
function BusBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#1a1208]">
      {/* Realistic AI bus photo (public/bus.jpg) with slow cinematic drift */}
      <div
        className="absolute inset-0 bus-kenburns bg-cover bg-center"
        style={{ backgroundImage: "url('/bus.jpg')" }}
      />
      {/* Gradient veil so foreground UI stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.25))',
        }}
      />
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .bus-kenburns { animation: busKenBurns 36s ease-in-out infinite; }
        }
        @keyframes busKenBurns {
          0%   { transform: scale(1.05) translate(0, 0); }
          50%  { transform: scale(1.15) translate(-1.5%, -1%); }
          100% { transform: scale(1.05) translate(0, 0); }
        }
      `}</style>
    </div>
  );
}

// ---------- ALKA (animated SVG) ----------
function AlkaBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <svg viewBox="0 0 800 600" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1208" />
            <stop offset="100%" stopColor="#6d4c1b" />
          </linearGradient>
          <linearGradient id="spotGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#goldGrad)" />
        <g className="spotlight">
          <polygon points="400,-50 220,600 580,600" fill="url(#spotGrad)" />
        </g>
        <g transform="translate(400, 430)">
          <path d="M -45 170 C -45 60, 45 60, 45 170 Z" fill="#120c05" />
          <circle cx="0" cy="25" r="34" fill="#120c05" />
          <circle cx="-26" cy="4" r="15" fill="#120c05" />
          <path d="M 5 70 L 40 35 L 52 8" stroke="#120c05" strokeWidth="14" fill="none" strokeLinecap="round" />
          <circle cx="56" cy="0" r="11" fill="#3a3a3a" />
          <rect x="52" y="2" width="7" height="16" fill="#1f1f1f" />
        </g>
        <text x="220" y="320" fill="#ffd54f" fontSize="42" className="note n1">♪</text>
        <text x="600" y="260" fill="#ffd54f" fontSize="58" className="note n2">♫</text>
        <text x="300" y="160" fill="#ffd54f" fontSize="48" className="note n3">♩</text>
        <text x="520" y="420" fill="#ffd54f" fontSize="36" className="note n4">♬</text>
        <style>{`
          @keyframes sway { 0%,100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
          .spotlight { transform-origin: 400px -50px; animation: sway 5s ease-in-out infinite; }
          @keyframes floatUp { 0% { transform: translateY(0) rotate(0deg); opacity: 0.9; } 100% { transform: translateY(-220px) rotate(18deg); opacity: 0; } }
          .note { animation: floatUp 4s linear infinite; }
          .n2 { animation-delay: 1s; } .n3 { animation-delay: 2s; } .n4 { animation-delay: 3s; }
        `}</style>
      </svg>
    </div>
  );
}

// ---------- WATER SCENE CONFIGS (this is what makes them different) ----------
const WATER = {
  river:   { water: 0x0d5c66, bg: 0x03171d, fog: [12, 34], amp: 0.35, freq: 0.55, speed: 1.8, rough: 0.25, metal: 0.2, extras: 'banks' },
  ocean:   { water: 0x0a3d7a, bg: 0x010a16, fog: [16, 60], amp: 1.15, freq: 0.22, speed: 0.7, rough: 0.35, metal: 0.3, extras: 'moon' },
  glacier: { water: 0x6fb3c7, bg: 0x0b1a24, fog: [10, 42], amp: 0.5,  freq: 0.35, speed: 0.4, rough: 0.15, metal: 0.1, extras: 'ice' },
};
const OTHER_BG = { forest: 0x030a06, mountain: 0x0a0d14, rain: 0x05070c };

// ---------- SHARED WAVE BUILDER ----------
function waveBuilder(scene, cfg, reducedMotion) {
  const disposables = []; const meshes = []; const updates = [];

  const geometry = new THREE.PlaneGeometry(26, 26, 80, 80);
  const material = new THREE.MeshStandardMaterial({
    color: cfg.water, side: THREE.DoubleSide, flatShading: true,
    metalness: cfg.metal, roughness: cfg.rough,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane); meshes.push(plane); disposables.push(geometry, material);

  if (cfg.extras === 'banks') {
    // RIVER: green banks + rocks + teal glow
    const bankGeo = new THREE.BoxGeometry(5, 1.4, 26);
    const bankMat = new THREE.MeshStandardMaterial({ color: 0x143826, flatShading: true, roughness: 0.95 });
    [-13, 13].forEach((x) => {
      const bank = new THREE.Mesh(bankGeo, bankMat);
      bank.position.set(x, -0.1, 0);
      scene.add(bank); meshes.push(bank);
    });
    disposables.push(bankGeo, bankMat);

    const rockGeo = new THREE.DodecahedronGeometry(0.5, 0);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x2a4a44, flatShading: true });
    for (let i = 0; i < 10; i++) {
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.position.set((i % 2 === 0 ? -1 : 1) * (9.5 + Math.random() * 2), -0.2, (Math.random() - 0.5) * 22);
      rock.scale.setScalar(0.5 + Math.random());
      scene.add(rock); meshes.push(rock);
    }
    disposables.push(rockGeo, rockMat);

    const glow = new THREE.PointLight(0x2dd4bf, 1.4, 40);
    glow.position.set(0, 4, 0);
    scene.add(glow); meshes.push(glow);
  }

  if (cfg.extras === 'moon') {
    // OCEAN: moon + cold moonlight
    const moonGeo = new THREE.SphereGeometry(2.2, 24, 24);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xf4f7ff });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(-9, 11, -20);
    scene.add(moon); meshes.push(moon); disposables.push(moonGeo, moonMat);

    const moonLight = new THREE.DirectionalLight(0x9db4ff, 1.6);
    moonLight.position.set(-9, 11, -20);
    scene.add(moonLight); meshes.push(moonLight);
  }

  if (cfg.extras === 'ice') {
    // GLACIER: bobbing flat-shaded icebergs + cold light
    const iceGeo = new THREE.IcosahedronGeometry(1, 0);
    const iceMat = new THREE.MeshStandardMaterial({
      color: 0xdfeffb, flatShading: true, roughness: 0.35, metalness: 0.05,
      emissive: 0x1a3a4a, emissiveIntensity: 0.35,
    });
    for (let i = 0; i < 12; i++) {
      const berg = new THREE.Mesh(iceGeo, iceMat);
      const s = 0.6 + Math.random() * 1.8;
      berg.scale.set(s, s * (0.7 + Math.random() * 0.8), s);
      const baseY = -0.3 + Math.random() * 0.2;
      berg.position.set((Math.random() - 0.5) * 22, baseY, -2 - Math.random() * 16);
      berg.rotation.y = Math.random() * Math.PI;
      scene.add(berg); meshes.push(berg);
      const phase = Math.random() * Math.PI * 2;
      updates.push((et) => {
        berg.position.y = baseY + Math.sin(et * 0.6 + phase) * 0.12;
        berg.rotation.y += 0.0015;
      });
    }
    disposables.push(iceGeo, iceMat);

    const cold = new THREE.PointLight(0xbfe8ff, 1.2, 45);
    cold.position.set(0, 6, -6);
    scene.add(cold); meshes.push(cold);
  }

  let frameId;
  const clock = new THREE.Clock();
  if (!reducedMotion) {
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const et = clock.getElapsedTime();
      const t = et * cfg.speed;
      const p = geometry.attributes.position.array;
      for (let i = 0; i < p.length; i += 3) {
        p[i + 2] =
          Math.sin(p[i] * cfg.freq + t) * cfg.amp +
          Math.cos(p[i + 1] * cfg.freq * 0.9 + t * 0.8) * cfg.amp;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
      for (let u = 0; u < updates.length; u++) updates[u](et);
    };
    animate();
  }

  return {
    cleanup: () => {
      if (frameId) cancelAnimationFrame(frameId);
      meshes.forEach((m) => scene.remove(m));
      disposables.forEach((d) => d.dispose && d.dispose());
    },
  };
}

// ---------- FOREST ----------
function forestBuilder(scene, reducedMotion) {
  const disposables = []; const meshes = [];

  const groundGeo = new THREE.PlaneGeometry(40, 40);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x0a1a10, roughness: 0.9 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2; ground.position.y = -2;
  scene.add(ground); meshes.push(ground); disposables.push(groundGeo, groundMat);

  const treeGeo = new THREE.ConeGeometry(1, 4, 8);
  const treeMat = new THREE.MeshStandardMaterial({ color: 0x1b4d2e, flatShading: true });
  const trees = new THREE.InstancedMesh(treeGeo, treeMat, 180);
  const m = new THREE.Matrix4();
  for (let i = 0; i < 180; i++) {
    const s = 0.5 + Math.random();
    m.makeScale(s, s, s);
    m.setPosition((Math.random() - 0.5) * 40, -2 + s * 2, (Math.random() - 0.5) * 40);
    trees.setMatrixAt(i, m);
  }
  scene.add(trees); meshes.push(trees); disposables.push(treeGeo, treeMat);

  const flyGeo = new THREE.BufferGeometry();
  const fp = new Float32Array(120 * 3);
  for (let i = 0; i < fp.length; i += 3) {
    fp[i] = (Math.random() - 0.5) * 30;
    fp[i + 1] = Math.random() * 5;
    fp[i + 2] = (Math.random() - 0.5) * 30;
  }
  flyGeo.setAttribute('position', new THREE.BufferAttribute(fp, 3));
  const flyMat = new THREE.PointsMaterial({ color: 0xccff66, size: 0.18, transparent: true, opacity: 0.9 });
  const flies = new THREE.Points(flyGeo, flyMat);
  scene.add(flies); meshes.push(flies); disposables.push(flyGeo, flyMat);

  let frameId; const clock = new THREE.Clock();
  if (!reducedMotion) {
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const p = flyGeo.attributes.position.array;
      for (let i = 0; i < p.length; i += 3) {
        p[i] += Math.cos(t * 2 + i) * 0.006;
        p[i + 1] += Math.sin(t * 2 + i) * 0.006;
      }
      flyGeo.attributes.position.needsUpdate = true;
    };
    animate();
  }
  return {
    cleanup: () => {
      if (frameId) cancelAnimationFrame(frameId);
      meshes.forEach((x) => scene.remove(x));
      disposables.forEach((d) => d.dispose && d.dispose());
    },
  };
}

// ---------- MOUNTAIN ----------
function mountainBuilder(scene, reducedMotion) {
  const disposables = []; const meshes = [];

  const groundGeo = new THREE.PlaneGeometry(50, 50);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x1c2230, roughness: 0.95 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2; ground.position.y = -2;
  scene.add(ground); meshes.push(ground); disposables.push(groundGeo, groundMat);

  const peakGeo = new THREE.ConeGeometry(4, 10, 4);
  const peakMat = new THREE.MeshStandardMaterial({ color: 0x66738c, flatShading: true });
  for (let i = 0; i < 10; i++) {
    const peak = new THREE.Mesh(peakGeo, peakMat);
    peak.position.set((Math.random() - 0.5) * 34, Math.random() * 3, -6 - Math.random() * 14);
    peak.rotation.y = Math.random() * Math.PI;
    scene.add(peak); meshes.push(peak);
  }
  disposables.push(peakGeo, peakMat);

  const snowGeo = new THREE.BufferGeometry();
  const sp = new Float32Array(300 * 3);
  for (let i = 0; i < sp.length; i += 3) {
    sp[i] = (Math.random() - 0.5) * 40;
    sp[i + 1] = Math.random() * 20;
    sp[i + 2] = (Math.random() - 0.5) * 40;
  }
  snowGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const snowMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.16, transparent: true, opacity: 0.85 });
  const snow = new THREE.Points(snowGeo, snowMat);
  scene.add(snow); meshes.push(snow); disposables.push(snowGeo, snowMat);

  let frameId;
  if (!reducedMotion) {
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const p = snowGeo.attributes.position.array;
      for (let i = 0; i < p.length; i += 3) {
        p[i + 1] -= 0.05;
        if (p[i + 1] < -2) p[i + 1] = 20;
      }
      snowGeo.attributes.position.needsUpdate = true;
    };
    animate();
  }
  return {
    cleanup: () => {
      if (frameId) cancelAnimationFrame(frameId);
      meshes.forEach((x) => scene.remove(x));
      disposables.forEach((d) => d.dispose && d.dispose());
    },
  };
}

// ---------- RAIN ----------
function rainBuilder(scene, reducedMotion) {
  const disposables = []; const meshes = [];

  const groundGeo = new THREE.PlaneGeometry(40, 40);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x10151c, metalness: 0.8, roughness: 0.25 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2; ground.position.y = -2;
  scene.add(ground); meshes.push(ground); disposables.push(groundGeo, groundMat);

  const rainGeo = new THREE.BufferGeometry();
  const rp = new Float32Array(3000 * 3);
  for (let i = 0; i < rp.length; i += 3) {
    rp[i] = (Math.random() - 0.5) * 40;
    rp[i + 1] = Math.random() * 20;
    rp[i + 2] = (Math.random() - 0.5) * 40;
  }
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rp, 3));
  const rainMat = new THREE.PointsMaterial({ color: 0x9fc3ff, size: 0.06, transparent: true, opacity: 0.7 });
  const rain = new THREE.Points(rainGeo, rainMat);
  scene.add(rain); meshes.push(rain); disposables.push(rainGeo, rainMat);

  let frameId;
  if (!reducedMotion) {
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const p = rainGeo.attributes.position.array;
      for (let i = 0; i < p.length; i += 3) {
        p[i + 1] -= 0.25;
        if (p[i + 1] < -2) p[i + 1] = 20;
      }
      rainGeo.attributes.position.needsUpdate = true;
    };
    animate();
  }
  return {
    cleanup: () => {
      if (frameId) cancelAnimationFrame(frameId);
      meshes.forEach((x) => scene.remove(x));
      disposables.forEach((d) => d.dispose && d.dispose());
    },
  };
}

// ---------- THREE CANVAS ----------
function ThreeCanvas({ sceneId }) {
  const mountRef = useRef(null);
  const reduced = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const wcfg = WATER[sceneId];
    const scene = new THREE.Scene();
    const bg = new THREE.Color(wcfg ? wcfg.bg : (OTHER_BG[sceneId] || 0x04070c));
    scene.background = bg;
    const fogDist = wcfg ? wcfg.fog : [14, 45];
    scene.fog = new THREE.Fog(bg, fogDist[0], fogDist[1]);

    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xbfd8ff, 0x0a0f14, 1.0);
    const dir = new THREE.DirectionalLight(0xffffff, 1.6);
    dir.position.set(6, 10, 4);
    scene.add(hemi, dir);

    let builderCleanup;
    switch (sceneId) {
      case 'river':
      case 'ocean':
      case 'glacier':
        builderCleanup = waveBuilder(scene, WATER[sceneId], reduced).cleanup; break;
      case 'forest':   builderCleanup = forestBuilder(scene, reduced).cleanup; break;
      case 'mountain': builderCleanup = mountainBuilder(scene, reduced).cleanup; break;
      case 'rain':     builderCleanup = rainBuilder(scene, reduced).cleanup; break;
      default:         builderCleanup = waveBuilder(scene, WATER.river, reduced).cleanup; break;
    }

    let frameId;
    const loop = () => { frameId = requestAnimationFrame(loop); renderer.render(scene, camera); };
    loop();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameId);
      builderCleanup && builderCleanup();
      scene.remove(hemi, dir);
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [sceneId, reduced]);

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
}

// ---------- MAIN ----------
export default function BackgroundScene() {
  const { sceneId, bgMode, customBg, currentChannelId } = useStore();
  const channel = useMemo(
    () => (currentChannelId ? getChannel(currentChannelId) : null),
    [currentChannelId]
  );

  if (bgMode === 'image' && customBg) return <ImageBackground url={customBg} />;
  if (channel && channel.bg) return <ImageBackground url={channel.bg} />;
  if (sceneId === 'bus') return <BusBackground />;
  if (sceneId === 'alka') return <AlkaBackground />;
  return <ThreeCanvas sceneId={sceneId} />;
}