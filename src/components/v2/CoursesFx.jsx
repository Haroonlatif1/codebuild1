import React, { useEffect, useRef, useState } from "react";

const reduced = () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Network of glowing nodes that reacts to the mouse ── */
const Network = ({ host }) => {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, el = host.current; if (!cv || !el) return;
    const ctx = cv.getContext("2d"); let w, h, raf, vis = true, nodes = [];
    const mouse = { x: -999, y: -999 };
    const size = () => { const r = el.getBoundingClientRect(); const d = Math.min(window.devicePixelRatio || 1, 2); w = r.width; h = r.height; cv.width = w * d; cv.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      const n = w < 700 ? 26 : 58; nodes = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: 1 + Math.random() * 1.6 })); };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const a of nodes) {
        a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > w) a.vx *= -1; if (a.y < 0 || a.y > h) a.vy *= -1;
        const dx = a.x - mouse.x, dy = a.y - mouse.y, dm = Math.hypot(dx, dy);
        if (dm < 140) { a.x += dx / dm * 1.1; a.y += dy / dm * 1.1; }
      }
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) { ctx.strokeStyle = `rgba(255,165,0,${(1 - d / 120) * .28})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      for (const a of nodes) { ctx.fillStyle = "rgba(255,190,70,.85)"; ctx.shadowColor = "#ffa500"; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fill(); }
      ctx.shadowBlur = 0;
    };
    const loop = () => { if (vis) draw(); raf = requestAnimationFrame(loop); };
    size();
    if (reduced()) draw(); else loop();
    const mv = (e) => { const r = el.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const lv = () => { mouse.x = mouse.y = -999; };
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }); io.observe(el);
    window.addEventListener("resize", size); el.addEventListener("mousemove", mv); el.addEventListener("mouseleave", lv);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", size); el.removeEventListener("mousemove", mv); el.removeEventListener("mouseleave", lv); };
  }, [host]);
  return <canvas ref={ref} className="cfx-net" aria-hidden="true" />;
};

const FACES = ["</>", "{ }", "AI", "Py", "JS", "01"];
const Cube = ({ size, cls = "", glyphs = FACES }) => (
  <div className={`cfx-cube ${cls}`} style={{ "--s": `${size}px`, "--h": `${size / 2}px` }} aria-hidden="true">
    {["f", "b", "r", "l", "t", "d"].map((k, i) => <i key={k} className={`cfx-face cfx-${k}`}>{glyphs[i % glyphs.length]}</i>)}
  </div>
);

/** Interactive 3D hero background: network, perspective floor, cubes, rings. */
export const HeroScene = ({ hostRef }) => {
  const sc = useRef(null);
  useEffect(() => {
    const host = hostRef.current, sceneEl = sc.current; if (!host || !sceneEl || reduced()) return;
    let raf, tx = 0, ty = 0, cx = 0, cy = 0;
    const mv = (e) => { const r = host.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - .5) * 2; ty = ((e.clientY - r.top) / r.height - .5) * 2; };
    const lv = () => { tx = ty = 0; };
    const tick = () => { cx += (tx - cx) * .06; cy += (ty - cy) * .06; sceneEl.style.setProperty("--mx", cx.toFixed(3)); sceneEl.style.setProperty("--my", cy.toFixed(3)); raf = requestAnimationFrame(tick); };
    host.addEventListener("mousemove", mv); host.addEventListener("mouseleave", lv); tick();
    return () => { cancelAnimationFrame(raf); host.removeEventListener("mousemove", mv); host.removeEventListener("mouseleave", lv); };
  }, [hostRef]);
  return (
    <div className="cfx-scene" ref={sc} aria-hidden="true">
      <Network host={hostRef} />
      <div className="cfx-floor"><div /></div>
      <div className="cfx-stage cfx-left">
        <div className="cfx-ring r1" /><div className="cfx-ring r2" />
        <Cube size={110} cls="big" />
        <div className="cfx-orbit o1"><Cube size={34} glyphs={["Py"]} /></div>
        <div className="cfx-orbit o2"><Cube size={26} glyphs={["</>"]} /></div>
      </div>
      <div className="cfx-stage cfx-right">
        <div className="cfx-ring r1" /><div className="cfx-ring r2" />
        <Cube size={84} cls="big rev" glyphs={["AI", "{ }", "JS", "Py", "01", "</>"]} />
        <div className="cfx-orbit o1"><Cube size={30} glyphs={["JS"]} /></div>
        <div className="cfx-orbit o2"><Cube size={22} glyphs={["AI"]} /></div>
      </div>
    </div>
  );
};

/** Number that counts up when scrolled into view: "1000+", "95%" */
export const CountUp = ({ value }) => {
  const m = String(value).match(/^(\d+)(.*)$/); const target = m ? +m[1] : 0, suffix = m ? m[2] : "";
  const [n, setN] = useState(reduced() ? target : 0); const ref = useRef(null);
  useEffect(() => {
    if (!m || reduced()) return; const el = ref.current; let raf;
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect(); const t0 = performance.now(), D = 1600;
      const step = (t) => { const p = Math.min((t - t0) / D, 1); setN(Math.round(target * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); });
    io.observe(el); return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target]); // eslint-disable-line
  return <span ref={ref}>{m ? n.toLocaleString() : value}{suffix}</span>;
};

/** 3D tilt + moving glare wrapper for cards */
export const Tilt = ({ children }) => {
  const ref = useRef(null);
  const move = (e) => {
    if (reduced() || e.pointerType === "touch") return;
    const el = ref.current, r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${((.5 - py) * 12).toFixed(2)}deg`); el.style.setProperty("--ry", `${((px - .5) * 14).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`); el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
  };
  const leave = () => { const el = ref.current; el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); };
  return <div className="cfx-tilt" ref={ref} onPointerMove={move} onPointerLeave={leave}>{children}</div>;
};

/** Infinite skills ticker */
export const Ticker = ({ items }) => (
  <div className="cfx-ticker" aria-hidden="true"><div className="cfx-track">
    {[...items, ...items].map((t, i) => <span key={i}>{t}</span>)}
  </div></div>
);

export const cfxCss = `
.coc-hero{isolation:isolate}
.cfx-scene{position:absolute;inset:0;z-index:-1;perspective:1100px;overflow:hidden;--mx:0;--my:0}
.cfx-net{position:absolute;inset:0;width:100%;height:100%;opacity:.8}
.cfx-floor{position:absolute;left:-30%;right:-30%;bottom:-8%;height:62%;perspective:420px;-webkit-mask-image:linear-gradient(to top,#000 10%,transparent 95%);mask-image:linear-gradient(to top,#000 10%,transparent 95%)}
.cfx-floor>div{position:absolute;inset:0;transform:rotateX(68deg);transform-origin:50% 100%;background-image:linear-gradient(rgba(255,165,0,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,165,0,.35) 1px,transparent 1px);background-size:56px 56px;animation:cfx-floor 2.4s linear infinite}
@keyframes cfx-floor{to{background-position:0 56px}}
.cfx-stage{position:absolute;top:50%;width:0;height:0;transform-style:preserve-3d;transform:translate3d(calc(var(--mx)*-26px),calc(var(--my)*-18px - 40px),0) rotateX(calc(var(--my)*-14deg)) rotateY(calc(var(--mx)*18deg))}
.cfx-left{left:13%}.cfx-right{right:13%}
.cfx-cube{position:absolute;width:var(--s);height:var(--s);left:calc(var(--s)/-2);top:calc(var(--s)/-2);transform-style:preserve-3d;animation:cfx-spin 16s linear infinite}
.cfx-cube.rev{animation-direction:reverse;animation-duration:20s}
@keyframes cfx-spin{from{transform:rotateX(-20deg) rotateY(0)}to{transform:rotateX(340deg) rotateY(360deg)}}
.cfx-face{position:absolute;inset:0;display:grid;place-items:center;font:700 calc(var(--s)*.26)/1 "Bebas Neue","Dosis",monospace;font-style:normal;letter-spacing:.05em;color:#ffb83d;border:1.5px solid rgba(255,165,0,.75);background:linear-gradient(135deg,rgba(255,165,0,.2),rgba(255,165,0,.04));box-shadow:inset 0 0 22px rgba(255,165,0,.25),0 0 18px rgba(255,165,0,.15);text-shadow:0 0 12px rgba(255,165,0,.9);backface-visibility:visible}
.cfx-f{transform:translateZ(var(--h))}.cfx-b{transform:rotateY(180deg) translateZ(var(--h))}
.cfx-r{transform:rotateY(90deg) translateZ(var(--h))}.cfx-l{transform:rotateY(-90deg) translateZ(var(--h))}
.cfx-t{transform:rotateX(90deg) translateZ(var(--h))}.cfx-d{transform:rotateX(-90deg) translateZ(var(--h))}
.cfx-ring{position:absolute;border:1.5px solid rgba(255,165,0,.4);border-radius:50%;left:-120px;top:-120px;width:240px;height:240px;transform-style:preserve-3d;box-shadow:0 0 24px rgba(255,165,0,.15)}
.cfx-ring.r1{transform:rotateX(72deg);animation:cfx-ring 9s linear infinite}
.cfx-ring.r2{width:300px;height:300px;left:-150px;top:-150px;border-style:dashed;border-color:rgba(255,255,255,.18);transform:rotateX(72deg) rotateY(24deg);animation:cfx-ring 14s linear infinite reverse}
@keyframes cfx-ring{to{transform:rotateX(72deg) rotateZ(360deg)}}
.cfx-orbit{position:absolute;left:0;top:0;transform-style:preserve-3d}
.cfx-orbit .cfx-cube{left:calc(var(--s)/-2);top:calc(var(--s)/-2);animation-duration:7s}
.cfx-orbit.o1{animation:cfx-orb1 8s linear infinite}.cfx-orbit.o2{animation:cfx-orb2 12s linear infinite reverse}
@keyframes cfx-orb1{from{transform:rotateX(72deg) rotateZ(0) translateX(120px) rotateZ(0) rotateX(-72deg)}to{transform:rotateX(72deg) rotateZ(360deg) translateX(120px) rotateZ(-360deg) rotateX(-72deg)}}
@keyframes cfx-orb2{from{transform:rotateX(72deg) rotateY(24deg) rotateZ(0) translateX(150px) rotateZ(0) rotateY(-24deg) rotateX(-72deg)}to{transform:rotateX(72deg) rotateY(24deg) rotateZ(360deg) translateX(150px) rotateZ(-360deg) rotateY(-24deg) rotateX(-72deg)}}
@media(max-width:1000px){.cfx-left{left:2%;top:28%}.cfx-right{right:2%;top:28%}.cfx-stage{transform:scale(.55) translate3d(0,0,0)}.cfx-scene{opacity:.55}}
@media(max-width:560px){.cfx-right{display:none}.cfx-left{left:14%}}
/* tilt cards */
.cfx-tilt{position:relative;display:flex;--rx:0deg;--ry:0deg;--gx:50%;--gy:50%;transform:perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));transform-style:preserve-3d;transition:transform .25s ease-out;will-change:transform}
.cfx-tilt>.coc-card{flex:1;min-width:0}
.cfx-tilt::after{content:"";position:absolute;inset:0;border-radius:10px;pointer-events:none;opacity:0;transition:opacity .3s;background:radial-gradient(circle at var(--gx) var(--gy),rgba(255,255,255,.2),transparent 45%);mix-blend-mode:screen}
.cfx-tilt:hover::after{opacity:1}
.cfx-tilt:hover{z-index:3}
.cfx-tilt .coc-card-img-wrap{transition:transform .3s}
.cfx-tilt:hover .coc-card-img{transform:scale(1.08) translate(calc((var(--ry))*-.3),0)}
.coc-card-img{transition:transform .5s}
/* ticker */
.cfx-ticker{overflow:hidden;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06);background:rgba(255,165,0,.04);padding:14px 0;margin:0 0 54px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.cfx-track{display:flex;gap:44px;width:max-content;animation:cfx-marq 38s linear infinite}
.cfx-ticker:hover .cfx-track{animation-play-state:paused}
.cfx-track span{font:700 15px "Dosis",sans-serif;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.5);white-space:nowrap;display:flex;align-items:center;gap:44px}
.cfx-track span::after{content:"";width:6px;height:6px;background:#ffa500;transform:rotate(45deg)}
@keyframes cfx-marq{to{transform:translateX(-50%)}}
/* animated border on the featured offer */
@property --cfx-a{syntax:"<angle>";initial-value:0deg;inherits:false}
.coc-feature{position:relative;border-color:transparent!important;background:linear-gradient(#10100f,#10100f) padding-box,conic-gradient(from var(--cfx-a),#ffa500,rgba(255,165,0,.1) 30%,#ffd27a 55%,rgba(255,165,0,.1) 80%,#ffa500) border-box!important;border:2px solid transparent!important;animation:cfx-spinb 5s linear infinite}
@keyframes cfx-spinb{to{--cfx-a:360deg}}
.coc-feature-price span{animation:cfx-pulse 2s ease-in-out infinite}
@keyframes cfx-pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,165,0,.55)}50%{box-shadow:0 0 0 10px rgba(255,165,0,0)}}
.coc-hero-h1 em{background:linear-gradient(100deg,#ffa500,#ffe3a1,#ffa500);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;animation:cfx-shine 4s linear infinite}
@keyframes cfx-shine{to{background-position:-200% 0}}
@media(prefers-reduced-motion:reduce){.cfx-cube,.cfx-ring,.cfx-orbit,.cfx-floor>div,.cfx-track,.coc-feature,.coc-feature-price span,.coc-hero-h1 em{animation:none!important}.cfx-tilt{transform:none!important}}
`;
