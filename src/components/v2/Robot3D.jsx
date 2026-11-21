import React, { useEffect, useRef, useState } from "react";
import robotUrl from "./robot.glb"; // bundled by the build, so it works on any host without a public/ folder

const GLOW = new Set(["left_eye", "right_eye", "left_eye_glint", "right_eye_glint", "smile_0", "smile_1", "smile_2", "smile_3", "antenna_tip", "head_top_glow", "academy_underline", "code_left_a", "code_left_b", "code_slash", "code_right_a", "code_right_b", "ear_light_-1", "ear_light_1"]);
const HEAD = ["head_shell", "face_screen", "face_border", "face_screen_inner", "left_eye", "right_eye", "left_eye_glint", "right_eye_glint", "smile_0", "smile_1", "smile_2", "smile_3", "ear_pod_-1", "ear_dark_-1", "ear_light_-1", "ear_pod_1", "ear_dark_1", "ear_light_1", "antenna_stem", "antenna_tip", "head_top_accent", "head_top_glow"];
const FOREARM = ["right_elbow", "right_elbow_ring", "right_forearm", "right_wrist", "right_palm", "finger_0", "finger_tip_0", "finger_1", "finger_tip_1", "finger_2", "finger_tip_2", "finger_3", "finger_tip_3", "thumb"];
const UPPERARM = ["right_shoulder", "right_shoulder_cap", "right_upper_arm"];
const TAU = Math.PI * 2, clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/**
 * Real-time 3D mascot (three.js). The light WebP picture shows instantly; three.js and the model load in idle time
 * and the 3D robot fades in on a transparent canvas.
 *  - Drag left/right to spin it around (it eases back to face you)
 *  - Head follows the mouse pointer
 *  - Waves, blinks, floats and sways on its own; glowing platform, shadow and sparkles around it
 * Falls back to the picture if WebGL is not available.
 */
const Robot3D = ({ fallbackSrc, alt }) => {
  const box = useRef(null), cv = useRef(null);
  const [ready, setReady] = useState(false);
  const [dragged, setDragged] = useState(false);

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
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);

        // soft studio reflections make the white plastic look glossy and properly 3D
        const pmrem = new THREE.PMREMGenerator(renderer);
        const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04); scene.environment = envRT.texture;
        scene.add(new THREE.HemisphereLight(0xffffff, 0x1d2a55, 0.3));
        const key = new THREE.DirectionalLight(0xffffff, 0.85); key.position.set(3, 5, 6); scene.add(key);
        const rim = new THREE.DirectionalLight(0x7fd4ff, 0.9); rim.position.set(-4, 3, -5); scene.add(rim);
        const blue = new THREE.PointLight(0x2f9bff, 1.0, 14); blue.position.set(-3.2, 1.5, 3); scene.add(blue);
        const orange = new THREE.PointLight(0xffa500, 0.7, 14); orange.position.set(3.4, 0.5, 2.5); scene.add(orange);

        const gltf = await new Promise((res, rej) => new GLTFLoader().load(robotUrl, res, undefined, rej));
        if (disposed) return;
        const root = gltf.scene; root.updateMatrixWorld(true);
        const mats = [];
        root.traverse(o => {
          if (!o.isMesh) return;
          if (GLOW.has(o.name)) o.material = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false });
          else {
            o.geometry.computeVertexNormals();
            o.material = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.12, roughness: 0.34, envMapIntensity: 0.5 });
            if (o.name === "face_screen" || o.name === "face_screen_inner") { o.material.color.setScalar(0.4); o.material.roughness = 0.12; }
          }
          mats.push(o.material);
        });

        // the model is a flat list of parts, so build the joints around the right pivot points
        const get = (n) => root.getObjectByName(n);
        const ctr = (n) => new THREE.Box3().setFromObject(get(n)).getCenter(new THREE.Vector3());
        const group = (names, pivot, parent = root) => {
          const g = new THREE.Group(); g.position.copy(pivot); root.add(g); root.updateMatrixWorld(true);
          names.forEach(n => { const m = get(n); if (m) g.attach(m); });
          if (parent !== root) parent.attach(g);
          root.updateMatrixWorld(true); return g;
        };
        const armG = group(UPPERARM, ctr("right_shoulder"));
        const waveG = group(FOREARM, ctr("right_elbow"), armG);
        const neckP = new THREE.Box3().setFromObject(get("neck")).getCenter(new THREE.Vector3());
        const eyeL = group(["left_eye", "left_eye_glint"], ctr("left_eye"));
        const eyeR = group(["right_eye", "right_eye_glint"], ctr("right_eye"));
        const headG = group(HEAD, neckP);
        headG.attach(eyeL); headG.attach(eyeR);

        // Z-up model → Y-up world, then frame it
        const holder = new THREE.Group(); holder.rotation.x = -Math.PI / 2; holder.add(root); scene.add(holder);
        holder.updateMatrixWorld(true);
        const bb = new THREE.Box3().setFromObject(holder), size = bb.getSize(new THREE.Vector3()), c = bb.getCenter(new THREE.Vector3());
        const baseZ = root.position.z, floorY = bb.min.y;

        // glowing platform, ring arcs and soft shadow under the feet
        const radial = (stops) => { const cc = document.createElement("canvas"); cc.width = cc.height = 128; const g = cc.getContext("2d"); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); stops.forEach(([o, col]) => gr.addColorStop(o, col)); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(cc); t.encoding = THREE.sRGBEncoding; return t; };
        const extras = [];
        const flat = (geo, mat, y) => { const m = new THREE.Mesh(geo, mat); m.rotation.x = -Math.PI / 2; m.position.set(0, y, 0); scene.add(m); extras.push(geo, mat); return m; };
        const shadowTex = radial([[0, "rgba(0,0,0,.55)"], [0.6, "rgba(0,0,0,.25)"], [1, "rgba(0,0,0,0)"]]);
        const glowTex = radial([[0, "rgba(70,170,255,.55)"], [0.55, "rgba(60,150,255,.22)"], [1, "rgba(60,150,255,0)"]]);
        const shadow = flat(new THREE.CircleGeometry(1.9, 48), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }), floorY + 0.005);
        flat(new THREE.CircleGeometry(2.3, 48), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), floorY + 0.01);
        const ringMat = (col, o) => new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
        const ring1 = flat(new THREE.RingGeometry(1.55, 1.63, 72, 1, 0, Math.PI * 1.35), ringMat(0x49b6ff, 0.9), floorY + 0.02);
        const ring2 = flat(new THREE.RingGeometry(1.85, 1.9, 72, 1, 0, Math.PI * 0.9), ringMat(0xffa500, 0.8), floorY + 0.02);

        // drifting sparkles
        const N = 42, pos = new Float32Array(N * 3), seed = Array.from({ length: N }, () => Math.random());
        for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 5.2; pos[i * 3 + 1] = floorY + Math.random() * size.y; pos[i * 3 + 2] = (Math.random() - 0.5) * 3; }
        const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        const pm = new THREE.PointsMaterial({ size: 0.075, color: 0x8fdcff, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending });
        scene.add(new THREE.Points(pg, pm)); extras.push(pg, pm, shadowTex, glowTex);

        const fit = () => {
          const w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.setSize(w, h, false);
          camera.aspect = w / h; const t = Math.tan((camera.fov * Math.PI) / 360);
          const dist = Math.max((size.y * 1.24) / 2 / t, (size.x * 1.12) / 2 / (t * camera.aspect)) + size.z / 2;
          camera.position.set(c.x, c.y + size.y * 0.16, c.z + dist);   // look slightly down so the platform and depth read clearly
          camera.lookAt(c.x, c.y - size.y * 0.03, c.z); camera.updateProjectionMatrix();
        };
        fit(); const ro = new ResizeObserver(fit); ro.observe(el);

        // ── interaction: drag to spin, head follows the pointer ──
        let dragging = false, lastX = 0, yaw = 0, yawVel = 0, idleW = 1, lookX = 0, lookY = 0, tLX = 0, tLY = 0;
        const down = (e) => { dragging = true; lastX = e.clientX; yawVel = 0; try { canvas.setPointerCapture(e.pointerId); } catch (_) {} setDragged(true); };
        const move = (e) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; yaw += dx * 0.012; yawVel = dx * 0.012; if (reduce) renderOnce(); };
        const up = () => { dragging = false; };
        const look = (e) => { const r = el.getBoundingClientRect(); tLX = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.45), -1, 1); tLY = clamp((e.clientY - (r.top + r.height * 0.25)) / (window.innerHeight * 0.45), -1, 1); };
        canvas.style.touchAction = "pan-y";
        canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move);
        canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);
        if (!reduce) window.addEventListener("pointermove", look, { passive: true });

        // ── animation ──
        let visible = true, nextBlink = 1.5, blinkT = -1, prev = 0;
        const pArr = pg.attributes.position;
        const render = (t, dt) => {
          if (!dragging) {                                                      // inertia, then ease back to face the viewer
            yaw += yawVel; yawVel *= Math.pow(0.03, dt);
            const home = Math.round(yaw / TAU) * TAU; yaw += (home - yaw) * (1 - Math.exp(-1.8 * dt));
          }
          const away = Math.abs(yaw - Math.round(yaw / TAU) * TAU);
          idleW += ((dragging || away > 0.15 ? 0 : 1) - idleW) * (1 - Math.exp(-3 * dt));
          root.rotation.z = yaw + Math.sin(t * 0.6) * 0.45 * idleW;             // slow turntable sway so the depth is visible
          root.position.z = baseZ + Math.sin(t * 1.5) * 0.11;                   // floating
          const lift = (Math.sin(t * 1.5) + 1) / 2; shadow.scale.setScalar(1 - lift * 0.14); shadow.material.opacity = 1 - lift * 0.3;
          ring1.rotation.z = t * 0.9; ring2.rotation.z = -t * 0.6;
          armG.rotation.y = Math.sin(t * 1.1) * 0.05;
          waveG.rotation.y = Math.sin(t * 6.2) * 0.4 + 0.08;                    // waving
          lookX += (tLX - lookX) * (1 - Math.exp(-4 * dt)); lookY += (tLY - lookY) * (1 - Math.exp(-4 * dt));
          headG.rotation.z = Math.sin(t * 0.9) * 0.07 + lookX * 0.5;            // gentle head movement + follows the pointer
          headG.rotation.x = Math.sin(t * 1.3 + 1) * 0.03 + lookY * 0.22;
          if (blinkT < 0 && t > nextBlink) blinkT = t;                          // automatic blinking
          let s = 1; if (blinkT >= 0) { const p = (t - blinkT) / 0.18; if (p >= 1) { blinkT = -1; nextBlink = t + 2.4 + Math.random() * 2.8; } else s = 1 - Math.sin(Math.PI * p) * 0.9; }
          eyeL.scale.z = eyeR.scale.z = s;
          for (let i = 0; i < N; i++) {                                          // sparkles
            let y = pArr.getY(i) + dt * (0.25 + seed[i] * 0.3); if (y > floorY + size.y) y = floorY;
            pArr.setY(i, y); pArr.setX(i, pArr.getX(i) + Math.sin(t + seed[i] * 6) * dt * 0.12);
          }
          pArr.needsUpdate = true;
          renderer.render(scene, camera);
        };
        const frame = (tms) => {
          raf = 0; if (disposed) return;
          const t = tms / 1000, dt = Math.min(0.05, Math.max(0.001, t - prev)); prev = t;
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
          root.traverse(o => o.isMesh && o.geometry.dispose()); mats.forEach(m => m.dispose()); extras.forEach(x => x.dispose && x.dispose());
          envRT.dispose(); pmrem.dispose(); renderer.dispose(); renderer.forceContextLoss();
        };
      } catch (e) { console.warn("3D mascot unavailable, showing the picture instead:", e); }
    };

    // load during idle time once the mascot is near the screen, so it never slows the first paint
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
      <img src={fallbackSrc} alt={alt} width="640" height="691" loading="lazy" decoding="async" />
      <canvas ref={cv} role="img" aria-label="Interactive 3D CodeBuild Academy robot. Drag to rotate." />
      {ready && !dragged && <span className="r3d-hint" aria-hidden="true">Drag to rotate</span>}
    </div>
  );
};
export default Robot3D;