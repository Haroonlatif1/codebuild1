import React, { useEffect, useRef, useState } from "react";
import modelUrl from "./robot-character.glb"; // bundled by the build, so it works on any host without a public/ folder
// Model: "Robot character" by assetfactory (Sketchfab) – check its licence allows your use.

const FACE = -Math.PI / 2;   // turns the model so it faces the viewer
const TAU = Math.PI * 2, clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/**
 * Simple real-time 3D character (three.js). The light WebP picture shows instantly; three.js and the model load in
 * idle time and the 3D model fades in on a transparent canvas.
 *  - Idles with a gentle sway, bob and breathing; leans slightly toward the pointer
 *  - Drag left/right to spin it (it eases back to face you); tap or click for a quick spin
 * Falls back to the picture if WebGL is not available.
 */
const Robot3D = ({ fallbackSrc, alt }) => {
  const box = useRef(null), cv = useRef(null);
  const [ready, setReady] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [failed, setFailed] = useState(false);   // the picture is only used if 3D cannot run

  useEffect(() => {
    const el = box.current, canvas = cv.current; if (!el || !canvas) return;
    let disposed = false, started = false, raf = 0, idleId = 0, cleanup = () => {};
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const start = async () => {
      if (started || disposed) return; started = true;
      try {
        const THREE = await import("three");
        const [{ GLTFLoader }, { RoomEnvironment }] = await Promise.all([
          import("three/examples/jsm/loaders/GLTFLoader.js"),
          import("three/examples/jsm/environments/RoomEnvironment.js"),
        ]);
        if (disposed) return;
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
        renderer.setClearColor(0x000000, 0);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);

        const pmrem = new THREE.PMREMGenerator(renderer);
        const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04); scene.environment = envRT.texture;
        scene.add(new THREE.HemisphereLight(0xffffff, 0x1d2a55, 0.35));
        const key = new THREE.DirectionalLight(0xffffff, 1.3); key.position.set(3, 5, 6); scene.add(key);
        const rim = new THREE.DirectionalLight(0x7fd4ff, 1.2); rim.position.set(-4, 3, -5); scene.add(rim);

        const gltf = await new Promise((res, rej) => new GLTFLoader().load(modelUrl, res, undefined, rej));
        if (disposed) return;
        const root = gltf.scene, mats = [], texs = [];
        root.traverse(o => {
          if (!o.isMesh) return;
          const m = o.material; m.side = THREE.DoubleSide; m.envMapIntensity = 1.8;
          if (m.emissiveMap) m.emissiveIntensity = 4.4;               // the file's KHR_materials_emissive_strength
          [m.map, m.metalnessMap, m.emissiveMap, m.normalMap].forEach(t => { if (t) { t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); texs.push(t); } });
          mats.push(m);
        });
        // normalise: feet on y = 0, 4 units tall, centred, so the camera maths is independent of the file's units
        const holder = new THREE.Group(); holder.add(root); scene.add(holder);
        { const b0 = new THREE.Box3().setFromObject(root), k = 4 / (b0.max.y - b0.min.y), cc = b0.getCenter(new THREE.Vector3());
          root.position.set(-cc.x, -b0.min.y, -cc.z); holder.scale.setScalar(k); }
        holder.updateMatrixWorld(true);
        const bb = new THREE.Box3().setFromObject(holder), size = bb.getSize(new THREE.Vector3()), c = bb.getCenter(new THREE.Vector3());
        const floorY = bb.min.y, k0 = holder.scale.x;

        // soft contact shadow under the feet
        const cc2 = document.createElement("canvas"); cc2.width = cc2.height = 128; const g2 = cc2.getContext("2d");
        const gr = g2.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(0,0,0,.5)"); gr.addColorStop(0.6, "rgba(0,0,0,.22)"); gr.addColorStop(1, "rgba(0,0,0,0)");
        g2.fillStyle = gr; g2.fillRect(0, 0, 128, 128);
        const shadowTex = new THREE.CanvasTexture(cc2);
        const shadowGeo = new THREE.CircleGeometry(Math.max(size.x, size.z) * 0.85, 48), shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
        const shadow = new THREE.Mesh(shadowGeo, shadowMat); shadow.rotation.x = -Math.PI / 2; shadow.position.y = floorY + 0.005; scene.add(shadow);

        const camBase = new THREE.Vector3(), camTarget = new THREE.Vector3();
        const fit = () => {
          const w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.setSize(w, h, false);
          camera.aspect = w / h; const t = Math.tan((camera.fov * Math.PI) / 360);
          const dist = Math.max((size.y * 1.16) / 2 / t, (size.x * 1.5) / 2 / (t * camera.aspect)) + size.z / 2;
          camBase.set(c.x, c.y + size.y * 0.08, c.z + dist);
          camTarget.set(c.x, c.y - size.y * 0.02, c.z); camera.position.copy(camBase); camera.lookAt(camTarget); camera.updateProjectionMatrix();
        };
        fit(); const ro = new ResizeObserver(fit); ro.observe(el);

        // ── interaction: drag to spin, tap for a quick spin, lean toward the pointer ──
        let dragging = false, downX = 0, downT = 0, lastX = 0, spinT = -9, yaw = 0, yawVel = 0, idleW = 1, lookX = 0, lookY = 0, tLX = 0, tLY = 0;
        const down = (e) => { dragging = true; downX = lastX = e.clientX; downT = performance.now(); yawVel = 0; try { canvas.setPointerCapture(e.pointerId); } catch (_) {} setDragged(true); };
        const move = (e) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; yaw += dx * 0.012; yawVel = dx * 0.012; if (reduce) renderOnce(); };
        const up = (e) => { if (dragging && e && e.type === "pointerup" && Math.abs(e.clientX - downX) < 6 && performance.now() - downT < 350) { spinT = prev; if (reduce) renderOnce(); } dragging = false; };
        const look = (e) => { const r = el.getBoundingClientRect(); tLX = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.45), -1, 1); tLY = clamp((e.clientY - (r.top + r.height * 0.25)) / (window.innerHeight * 0.45), -1, 1); };
        canvas.style.touchAction = "pan-y";
        canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move);
        canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);
        if (!reduce) window.addEventListener("pointermove", look, { passive: true });

        // ── animation ──
        let visible = true, prev = 0, introStart = -1;
        const ease = (p) => 1 - Math.pow(1 - clamp(p, 0, 1), 3);
        const render = (t, dt) => {
          if (!dragging) {                                                      // inertia, then ease back to face the viewer
            yaw += yawVel; yawVel *= Math.pow(0.03, dt);
            const home = Math.round(yaw / TAU) * TAU; yaw += (home - yaw) * (1 - Math.exp(-1.8 * dt));
          }
          const away = Math.abs(yaw - Math.round(yaw / TAU) * TAU);
          idleW += ((dragging || away > 0.15 ? 0 : 1) - idleW) * (1 - Math.exp(-3 * dt));
          const intro = reduce ? 1 : introStart < 0 ? 0 : ease((t - introStart) / 1.2);
          const sp = ease((t - spinT) / 0.9), spinning = t - spinT < 0.9;
          lookX += (tLX - lookX) * (1 - Math.exp(-4 * dt)); lookY += (tLY - lookY) * (1 - Math.exp(-4 * dt));
          holder.scale.setScalar(k0 * (0.8 + 0.2 * intro));
          holder.rotation.y = FACE + yaw + Math.sin(t * 0.6) * 0.35 * idleW + (1 - intro) * -1.2 + (spinning ? sp * TAU : 0) + lookX * 0.25;
          holder.rotation.x = lookY * 0.04; holder.rotation.z = Math.sin(t * 0.9) * 0.012;
          holder.position.y = Math.sin(t * 1.4) * 0.05;                         // gentle bob
          root.scale.y = 1 + Math.sin(t * 1.9) * 0.004;                          // breathing
          shadow.scale.setScalar(1 - (Math.sin(t * 1.4) + 1) * 0.04);
          renderer.render(scene, camera);
        };
        const frame = (tms) => {
          raf = 0; if (disposed) return;
          const t = tms / 1000, dt = Math.min(0.05, Math.max(0.001, t - prev)); prev = t; if (introStart < 0) introStart = t;
          render(t, dt);
          if (visible && !document.hidden) raf = requestAnimationFrame(frame);
        };
        function renderOnce() { render(prev, 0.016); }
        render(0, 0.016); setReady(true);
        const kick = () => { if (!raf && !reduce && visible && !document.hidden) raf = requestAnimationFrame(frame); };
        const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); }); io.observe(el);
        document.addEventListener("visibilitychange", kick);
        if (!reduce) kick();

        cleanup = () => {
          cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); document.removeEventListener("visibilitychange", kick);
          window.removeEventListener("pointermove", look);
          canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move);
          canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up);
          root.traverse(o => o.isMesh && o.geometry.dispose()); mats.forEach(m => m.dispose()); texs.forEach(x => x.dispose());
          shadowGeo.dispose(); shadowMat.dispose(); shadowTex.dispose();
          envRT.dispose(); pmrem.dispose(); renderer.dispose(); renderer.forceContextLoss();
        };
      } catch (e) { console.warn("3D character unavailable, showing the picture instead:", e); setFailed(true); }
    };

    // load during idle time once the character is near the screen, so it never slows the first paint
    const io0 = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io0.disconnect();
      const ric = window.requestIdleCallback || ((f) => setTimeout(f, 400));
      idleId = ric(start, { timeout: 2500 });
    }, { rootMargin: "500px" });
    io0.observe(el);

    return () => { disposed = true; io0.disconnect(); if (idleId && window.cancelIdleCallback) window.cancelIdleCallback(idleId); cleanup(); };
  }, []);

  return (
    <div className={`r3d${ready ? " ready" : ""}`} ref={box}>
      {failed && <img src={fallbackSrc} alt={alt} width="640" height="691" decoding="async" style={{ opacity: 1 }} />}
      <canvas ref={cv} role="img" aria-label="Interactive 3D robot character. Drag to rotate." />
      {ready && !dragged && <span className="r3d-hint" aria-hidden="true">Drag to rotate</span>}
    </div>
  );
};
export default Robot3D;