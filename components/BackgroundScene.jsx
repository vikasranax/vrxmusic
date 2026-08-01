'use client';
import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useStore } from '@/lib/store';

/* ================================================================
   3D SCENE BUILDERS
   ================================================================ */

function buildOcean(scene, camera, renderer) {
  camera.position.set(0, 3.5, 9);
  camera.lookAt(0, 0, 0);
  scene.background = new THREE.Color(0x04182a);
  scene.fog = new THREE.FogExp2(0x04182a, 0.032);

  const light = new THREE.DirectionalLight(0x4f8cff, 0.9);
  light.position.set(8, 12, 8);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x112244, 0.5));

  const geo = new THREE.PlaneGeometry(70, 50, 140, 100);
  geo.rotateX(-Math.PI / 2);
  const base = new Float32Array(geo.attributes.position.array);
  const mat = new THREE.MeshPhongMaterial({
    color: 0x155e75, shininess: 90, specular: 0x4f8cff,
    transparent: true, opacity: 0.95, flatShading: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  let t = 0, raf = 0;
  function frame() {
    t += 0.012;
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3], z = base[i * 3 + 2];
      const y = Math.sin(x * 0.25 + t) * 0.8 + Math.cos(z * 0.18 + t * 0.7) * 0.6 + Math.sin((x + z) * 0.12 + t * 1.1) * 0.35;
      pos.array[i * 3 + 1] = y;
    }
    pos.needsUpdate = true;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  frame();

  return () => { cancelAnimationFrame(raf); geo.dispose(); mat.dispose(); };
}

function buildRiver(scene, camera, renderer) {
  camera.position.set(0, 2.8, 8);
  camera.lookAt(0, -0.2, 0);
  scene.background = new THREE.Color(0x06222e);
  scene.fog = new THREE.FogExp2(0x06222e, 0.040);

  scene.add(new THREE.DirectionalLight(0x34e1d6, 0.7).position.set(5, 10, 5));
  scene.add(new THREE.AmbientLight(0x112233, 0.5));

  const geo = new THREE.PlaneGeometry(50, 40, 120, 80);
  geo.rotateX(-Math.PI / 2);
  const base = new Float32Array(geo.attributes.position.array);
  const mat = new THREE.MeshPhongMaterial({ color: 0x1f6f8b, shininess: 70, specular: 0x34e1d6, transparent: true, opacity: 0.92 });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  let t = 0, raf = 0;
  function frame() {
    t += 0.010;
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3], z = base[i * 3 + 2];
      const y = Math.sin(x * 0.3 + t) * 0.5 + Math.cos(z * 0.25 + t * 0.9) * 0.4 + Math.sin(z * 0.5 + t * 1.3) * 0.2;
      pos.array[i * 3 + 1] = y;
    }
    pos.needsUpdate = true;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  frame();

  return () => { cancelAnimationFrame(raf); geo.dispose(); mat.dispose(); };
}

function buildForest(scene, camera, renderer) {
  camera.position.set(0, 3, 10);
  camera.lookAt(0, 0.5, 0);
  scene.background = new THREE.Color(0x06180f);
  scene.fog = new THREE.FogExp2(0x06180f, 0.055);

  scene.add(new THREE.DirectionalLight(0x3f8f3f, 0.6).position.set(6, 10, 4));
  scene.add(new THREE.AmbientLight(0x0a1a0c, 0.7));

  // Ground
  const gGeo = new THREE.PlaneGeometry(80, 60, 64, 64);
  gGeo.rotateX(-Math.PI / 2);
  const gMat = new THREE.MeshLambertMaterial({ color: 0x1a4a2a });
  const ground = new THREE.Mesh(gGeo, gMat);
  scene.add(ground);

  // Trees (instanced cones)
  const tGeo = new THREE.ConeGeometry(0.35, 1.4, 7);
  const tMat = new THREE.MeshLambertMaterial({ color: 0x1f7a4d });
  const trees = new THREE.InstancedMesh(tGeo, tMat, 180);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 180; i++) {
    dummy.position.set((Math.random() - 0.5) * 50, 0.7, (Math.random() - 0.5) * 40 - 5);
    dummy.scale.setScalar(0.7 + Math.random() * 0.8);
    dummy.rotation.y = Math.random() * Math.PI;
    dummy.updateMatrix();
    trees.setMatrixAt(i, dummy.matrix);
  }
  scene.add(trees);

  // Fireflies
  const fGeo = new THREE.BufferGeometry();
  const fn = 120, fp = new Float32Array(fn * 3);
  for (let i = 0; i < fn; i++) { fp[i * 3] = (Math.random() - 0.5) * 50; fp[i * 3 + 1] = Math.random() * 6 + 0.5; fp[i * 3 + 2] = (Math.random() - 0.5) * 40; }
  fGeo.setAttribute('position', new THREE.BufferAttribute(fp, 3));
  const fMat = new THREE.PointsMaterial({ color: 0xccff66, size: 0.12, transparent: true, opacity: 0.85 });
  const fireflies = new THREE.Points(fGeo, fMat);
  scene.add(fireflies);

  let t = 0, raf = 0;
  function frame() {
    t += 0.005;
    const positions = fGeo.attributes.position.array;
    for (let i = 0; i < fn; i++) {
      positions[i * 3 + 1] += Math.sin(t + i) * 0.008;
      positions[i * 3] += Math.cos(t + i * 0.5) * 0.005;
    }
    fGeo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  frame();

  return () => { cancelAnimationFrame(raf); gGeo.dispose(); gMat.dispose(); tGeo.dispose(); tMat.dispose(); trees.dispose(); fGeo.dispose(); fMat.dispose(); };
}

function buildValley(scene, camera, renderer) {
  camera.position.set(0, 4, 11);
  camera.lookAt(0, 0, 0);
  scene.background = new THREE.Color(0x0a1a0c);
  scene.fog = new THREE.FogExp2(0x0a1a0c, 0.045);

  scene.add(new THREE.DirectionalLight(0x8fff8f, 0.5).position.set(4, 10, 6));
  scene.add(new THREE.AmbientLight(0x0f2a10, 0.6));

  const geo = new THREE.PlaneGeometry(70, 50, 100, 80);
  geo.rotateX(-Math.PI / 2.1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.array[i * 3], z = pos.array[i * 3 + 2];
    pos.array[i * 3 + 1] = Math.sin(x * 0.15) * Math.cos(z * 0.12) * 2.5 + Math.sin(x * 0.08 + z * 0.08) * 1.2;
  }
  pos.needsUpdate = true;
  const mat = new THREE.MeshLambertMaterial({ color: 0x3f8f3f, flatShading: true });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // Flowers / bright spots
  const pGeo = new THREE.BufferGeometry();
  const pn = 60, pp = new Float32Array(pn * 3);
  for (let i = 0; i < pn; i++) { pp[i * 3] = (Math.random() - 0.5) * 50; pp[i * 3 + 1] = Math.random() * 0.5 + 0.2; pp[i * 3 + 2] = (Math.random() - 0.5) * 40; }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xffdd88, size: 0.18, transparent: true, opacity: 0.9 });
  scene.add(new THREE.Points(pGeo, pMat));

  let raf = 0;
  function frame() {
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  frame();

  return () => { cancelAnimationFrame(raf); geo.dispose(); mat.dispose(); pGeo.dispose(); pMat.dispose(); };
}

function buildMountain(scene, camera, renderer) {
  camera.position.set(0, 4, 10);
  camera.lookAt(0, 1, 0);
  scene.background = new THREE.Color(0x0a1018);
  scene.fog = new THREE.FogExp2(0x0a1018, 0.038);

  scene.add(new THREE.DirectionalLight(0xcceeff, 0.8).position.set(5, 12, 8));
  scene.add(new THREE.AmbientLight(0x1a2028, 0.5));

  const geo = new THREE.PlaneGeometry(60, 40, 80, 60);
  geo.rotateX(-Math.PI / 2.2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.array[i * 3], z = pos.array[i * 3 + 2];
    const h = Math.abs(Math.sin(x * 0.2) * Math.cos(z * 0.15)) * 4 + Math.sin(x * 0.5 + z * 0.3) * 0.5;
    pos.array[i * 3 + 1] = h;
  }
  pos.needsUpdate = true;
  const mat = new THREE.MeshStandardMaterial({ color: 0x9fb3c8, flatShading: true, roughness: 0.9 });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // Snow particles
  const sGeo = new THREE.BufferGeometry();
  const sn = 300, sp = new Float32Array(sn * 3);
  for (let i = 0; i < sn; i++) { sp[i * 3] = (Math.random() - 0.5) * 60; sp[i * 3 + 1] = Math.random() * 20; sp[i * 3 + 2] = (Math.random() - 0.5) * 40; }
  sGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const sMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.7 });
  const snow = new THREE.Points(sGeo, sMat);
  scene.add(snow);

  let raf = 0;
  function frame() {
    const positions = sGeo.attributes.position.array;
    for (let i = 0; i < sn; i++) {
      positions[i * 3 + 1] -= 0.04;
      if (positions[i * 3 + 1] < 0) positions[i * 3 + 1] = 20;
    }
    sGeo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  frame();

  return () => { cancelAnimationFrame(raf); geo.dispose(); mat.dispose(); sGeo.dispose(); sMat.dispose(); };
}

function buildGlacier(scene, camera, renderer) {
  camera.position.set(0, 3, 9);
  camera.lookAt(0, 0.5, 0);
  scene.background = new THREE.Color(0x081820);
  scene.fog = new THREE.FogExp2(0x081820, 0.045);

  scene.add(new THREE.DirectionalLight(0xaaddff, 0.9).position.set(4, 10, 6));
  scene.add(new THREE.AmbientLight(0x112228, 0.5));

  const geo = new THREE.PlaneGeometry(60, 40, 80, 60);
  geo.rotateX(-Math.PI / 2.15);
  const base = new Float32Array(geo.attributes.position.array);
  const mat = new THREE.MeshPhongMaterial({ color: 0x7fb7d6, shininess: 100, specular: 0xffffff, transparent: true, opacity: 0.9, flatShading: true });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  let t = 0, raf = 0;
  function frame() {
    t += 0.003;
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3], z = base[i * 3 + 2];
      pos.array[i * 3 + 1] = Math.sin(x * 0.2 + t) * 0.8 + Math.cos(z * 0.15 + t * 0.5) * 0.6;
    }
    pos.needsUpdate = true;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  frame();

  return () => { cancelAnimationFrame(raf); geo.dispose(); mat.dispose(); };
}

function buildRain(scene, camera, renderer) {
  camera.position.set(0, 3, 8);
  camera.lookAt(0, 0, 0);
  scene.background = new THREE.Color(0x050a14);
  scene.fog = new THREE.FogExp2(0x050a14, 0.060);

  scene.add(new THREE.AmbientLight(0x111122, 0.4));
  scene.add(new THREE.DirectionalLight(0x446688, 0.3).position.set(0, 10, 0));

  // Wet ground
  const gGeo = new THREE.PlaneGeometry(80, 60, 64, 64);
  gGeo.rotateX(-Math.PI / 2);
  const gMat = new THREE.MeshPhongMaterial({ color: 0x0a1525, shininess: 100, specular: 0x223344 });
  const ground = new THREE.Mesh(gGeo, gGeo);
  scene.add(ground);

  // Rain drops
  const count = 3000;
  const rGeo = new THREE.BufferGeometry();
  const rPos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    rPos[i * 3] = (Math.random() - 0.5) * 60;
    rPos[i * 3 + 1] = Math.random() * 30;
    rPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }
  rGeo.setAttribute('position', new THREE.BufferAttribute(rPos, 3));
  const rMat = new THREE.PointsMaterial({ color: 0x88aacc, size: 0.08, transparent: true, opacity: 0.5 });
  const rain = new THREE.Points(rGeo, rMat);
  scene.add(rain);

  let raf = 0;
  function frame() {
    const positions = rGeo.attributes.position.array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] -= 0.6;
      if (positions[i * 3 + 1] < 0) positions[i * 3 + 1] = 30;
    }
    rGeo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  frame();

  return () => { cancelAnimationFrame(raf); gGeo.dispose(); gMat.dispose(); rGeo.dispose(); rMat.dispose(); };
}

/* ================================================================
   IMAGE BACKGROUND + DEW DROPS
   ================================================================ */

function DewDrops() {
  const drops = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 6}s`,
    duration: `${3 + Math.random() * 5}s`,
    size: `${3 + Math.random() * 7}px`,
  })), []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      {drops.map((d) => (
        <div
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: d.left,
            top: '-10px',
            width: d.size,
            height: d.size,
            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 60%, transparent 100%)',
            boxShadow: '0 0 4px rgba(255,255,255,0.2)',
            animation: `dewDrop ${d.duration} ${d.delay} linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

function ImageBackground({ url }) {
  return (
    <>
      <div
        className="fixed inset-0 -z-0 h-[100dvh] w-screen"
        style={{
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(14px) brightness(0.45) saturate(1.2)',
          transform: 'scaleX(-1)',
        }}
      />
      <div
        className="fixed inset-0 -z-0 h-[100dvh] w-screen opacity-30"
        style={{
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(24px) brightness(0.35)',
        }}
      />
      <DewDrops />
    </>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function BackgroundScene() {
  const ref = useRef(null);
  const sceneId = useStore((s) => s.sceneId);
  const bgMode = useStore((s) => s.bgMode);
  const customBg = useStore((s) => s.customBg);

  useEffect(() => {
    if (bgMode === 'image') return;
    const mount = ref.current;
    if (!mount) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);

    let cleanup = () => {};
    switch (sceneId) {
      case 'ocean': cleanup = buildOcean(scene, camera, renderer); break;
      case 'river': cleanup = buildRiver(scene, camera, renderer); break;
      case 'forest': cleanup = buildForest(scene, camera, renderer); break;
      case 'valley': cleanup = buildValley(scene, camera, renderer); break;
      case 'mountain': cleanup = buildMountain(scene, camera, renderer); break;
      case 'glacier': cleanup = buildGlacier(scene, camera, renderer); break;
      case 'rain': cleanup = buildRain(scene, camera, renderer); break;
      default: cleanup = buildRiver(scene, camera, renderer);
    }

    function onResize() {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);

    if (reduce) cleanup();

    return () => {
      cleanup();
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [sceneId, bgMode, customBg]);

  if (bgMode === 'image' && customBg) {
    return <ImageBackground url={customBg} />;
  }

  return <div ref={ref} className="fixed inset-0 -z-0 h-[100dvh] w-screen" aria-hidden />;
}