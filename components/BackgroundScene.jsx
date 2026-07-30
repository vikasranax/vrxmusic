'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '@/lib/store';
import { SCENES } from '@/lib/scenes';

export default function BackgroundScene() {
  const ref = useRef(null);
  const sceneId = useStore((s) => s.sceneId);
  const sceneRef = useRef(sceneId);
  sceneRef.current = sceneId;

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mount = ref.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    const scene = new THREE.Scene();
    const start = SCENES[sceneRef.current] || SCENES.river;
    scene.background = new THREE.Color(start.fog);
    scene.fog = new THREE.FogExp2(start.fog, start.density);

    const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 100);
    camera.position.set(0, 2.1, 6.2);
    camera.lookAt(0, 0.2, -3);

    const SEG_X = 128, SEG_Y = 64;
    const geo = new THREE.PlaneGeometry(46, 26, SEG_X, SEG_Y);
    geo.rotateX(-Math.PI / 2.12);
    const base = new Float32Array(geo.attributes.position.array);
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(start.wire), wireframe: true, transparent: true, opacity: 0.55 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = -1.3;
    scene.add(mesh);

    const dust = new THREE.BufferGeometry();
    const dn = 220, dp = new Float32Array(dn * 3);
    for (let i = 0; i < dn; i++) { dp[i * 3] = (Math.random() - .5) * 40; dp[i * 3 + 1] = Math.random() * 8; dp[i * 3 + 2] = -Math.random() * 30; }
    dust.setAttribute('position', new THREE.BufferAttribute(dp, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0x2a4a5a, size: 0.04, transparent: true, opacity: 0.5 });
    scene.add(new THREE.Points(dust, dustMat));

    const pos = geo.attributes.position;
    const cur = { amp: start.amp, speed: start.speed, density: start.density, wire: new THREE.Color(start.wire), fog: new THREE.Color(start.fog) };
    let t = 0, raf = 0;

    function size() {
      const w = mount.clientWidth || window.innerWidth, h = mount.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    size();
    window.addEventListener('resize', size);

    function frame() {
      const tgt = SCENES[sceneRef.current] || SCENES.river;
      cur.amp += (tgt.amp - cur.amp) * 0.03;
      cur.speed += (tgt.speed - cur.speed) * 0.03;
      cur.density += (tgt.density - cur.density) * 0.03;
      cur.wire.lerp(new THREE.Color(tgt.wire), 0.03);
      cur.fog.lerp(new THREE.Color(tgt.fog), 0.03);
      mat.color.copy(cur.wire);
      scene.fog.color.copy(cur.fog); scene.background.copy(cur.fog);
      scene.fog.density = cur.density;

      t += 0.0045 * (cur.speed / 0.5);
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3], z = base[i * 3 + 2];
        const y =
          Math.sin(x * 0.45 + t) * 0.45 * cur.amp +
          Math.cos(z * 0.40 + t * 0.8) * 0.40 * cur.amp +
          Math.sin((x + z) * 0.28 + t * 1.3) * 0.25 * cur.amp;
        pos.array[i * 3 + 1] = y;
      }
      pos.needsUpdate = true;
      renderer.render(scene, camera);
      if (!reduce) raf = requestAnimationFrame(frame);
    }
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
      geo.dispose(); mat.dispose(); dust.dispose(); dustMat.dispose(); renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={ref} className="fixed inset-0 -z-0 h-screen w-screen" aria-hidden />;
}