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

/** Modern, fully responsive overrides for the Offered Courses page */
export const cfxModern = `

.coc-wrap{overflow:visible;overflow-x:clip}
.coc-hero{padding:clamp(56px,9vw,104px) clamp(16px,4vw,32px) clamp(40px,6vw,64px)}
.coc-hero-h1{font-size:clamp(44px,9vw,104px)!important;letter-spacing:.02em!important}
.coc-hero-sub{font-size:clamp(15px,2vw,18px)!important;color:rgba(255,255,255,.6)!important;max-width:520px!important}
.coc-stats{display:grid!important;grid-template-columns:repeat(3,1fr);gap:10px;border:0!important;background:none!important;max-width:560px!important;overflow:visible!important;width:100%}
.coc-stat{border:1px solid rgba(255,255,255,.1)!important;border-radius:14px;background:linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.02));backdrop-filter:blur(8px);padding:16px 10px!important;min-width:0!important}
.coc-stat-n{font-size:clamp(26px,5vw,36px)!important}.coc-stat-l{font-size:11px!important;color:rgba(255,255,255,.5)!important}
.coc-body{padding:0 clamp(16px,3vw,32px) 80px!important}
.coc-section-label-text{font-size:14px!important;color:rgba(255,255,255,.45)!important}
.coc-toolbar{display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:26px}
.coc-toolbar .coc-pills{margin:0!important;flex:1 1 420px}
.coc-pills button{border-radius:999px!important;padding:9px 18px!important;font-size:13px!important}
.coc-search{flex:0 1 280px;min-width:200px;width:100%;max-width:100%;background:#0e0e16;border:1px solid rgba(255,255,255,.12);border-radius:999px;color:#fff;font:600 15px "Dosis",sans-serif;padding:11px 18px;outline:none;transition:.2s}
.coc-search:focus{border-color:#ffa500;box-shadow:0 0 0 3px rgba(255,165,0,.15)}
.coc-empty{color:rgba(255,255,255,.55);padding:30px 0}
.coc-grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,270px),1fr))!important;gap:clamp(12px,1.6vw,20px)!important}
.coc-card{border-radius:16px!important;background:linear-gradient(180deg,#13131c,#0d0d14)!important;border-color:rgba(255,255,255,.09)!important}
.cfx-tilt::after{border-radius:16px}
.coc-card-img-wrap{height:clamp(150px,16vw,184px)!important}
.coc-card-img{opacity:.9!important;filter:saturate(.9) brightness(.9)!important}
.coc-card-tag{top:12px!important;right:12px!important;font-size:10px!important;padding:4px 11px!important;border-radius:999px!important}
.coc-card-name{font-size:clamp(19px,2vw,22px)!important;line-height:1.2}
.coc-meta{display:flex;flex-wrap:wrap;gap:6px!important}
.coc-meta span{font-size:12px!important;font-weight:700;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.06);color:rgba(255,255,255,.7)!important;border:1px solid rgba(255,255,255,.07)}
.coc-meta span::before,.coc-meta span::after{display:none!important;content:none!important}
.coc-skill{border-radius:999px!important;font-size:11px!important}
.coc-price b{font-size:30px!important}
.coc-card-footer{gap:8px;padding:0 16px 16px!important;display:flex;border-top:0!important}
.coc-card-btn{border-radius:10px!important;border:1px solid rgba(255,255,255,.14)!important;font-size:12.5px!important;padding:12px 10px!important;flex:1}
.coc-card-btn{white-space:nowrap;letter-spacing:.05em!important}
.coc-card-btn.primary{background:#ffa500!important;border-color:#ffa500!important;color:#0a0a0f!important;flex:1.5}
.coc-card-btn.primary:hover{background:transparent!important;color:#ffa500!important}
.coc-feature{border-radius:18px!important;padding:clamp(22px,3vw,34px)!important;gap:22px!important}
.coc-feature h2{font-size:clamp(30px,4.6vw,44px)!important}
.coc-feature-price b{font-size:clamp(40px,6vw,56px)!important}
.coc-cta{padding-left:clamp(16px,4vw,32px)!important;padding-right:clamp(16px,4vw,32px)!important}
/* syllabus modal */
.coc-modal-back{position:fixed;inset:0;z-index:10002;display:grid;place-items:center;padding:16px;background:rgba(3,3,8,.75);backdrop-filter:blur(5px);animation:coc-fade .25s ease}
@keyframes coc-fade{from{opacity:0}to{opacity:1}}
.coc-modal{position:relative;width:min(480px,100%);max-height:calc(100vh - 32px);overflow:auto;background:#101018;border:1px solid rgba(255,255,255,.1);border-top:3px solid #ffa500;border-radius:14px;padding:clamp(22px,4vw,32px);box-shadow:0 30px 90px rgba(0,0,0,.7);animation:coc-pop .35s cubic-bezier(.2,.9,.3,1.15)}
@keyframes coc-pop{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:none}}
.coc-modal-x{position:absolute;top:10px;right:12px;width:30px;height:30px;border:0;background:none;color:rgba(255,255,255,.55);font:400 26px/1 sans-serif;cursor:pointer}.coc-modal-x:hover{color:#fff}
.coc-modal-eyebrow{font-size:11px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#ffa500;margin-bottom:8px}
.coc-modal h2{font-family:"Bebas Neue",sans-serif;font-weight:400;font-size:clamp(28px,5vw,36px);letter-spacing:.02em;line-height:1.05;margin:0 28px 6px 0}
.coc-modal-meta{color:rgba(255,255,255,.5)!important;font-size:14px!important;font-weight:600;margin:0 0 14px!important}
.coc-modal p{color:rgba(255,255,255,.72);font-size:16px;line-height:1.6;margin:0 0 18px}
.coc-modal-sub{font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:10px}
.coc-modal-skills{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:22px}
.coc-modal-skills span{font-size:12px;font-weight:700;padding:5px 12px;border-radius:999px;background:rgba(255,165,0,.1);border:1px solid rgba(255,165,0,.3);color:#ffb83d}
.coc-modal-act{display:flex;gap:10px;flex-wrap:wrap}
.coc-modal-act .coc-card-btn{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;flex:1 1 160px;text-transform:uppercase;font-weight:800;color:rgba(255,255,255,.8)}
.coc-modal-act .coc-card-btn.primary{color:#0a0a0f}
@media(max-width:700px){.coc-feature{flex-direction:column;align-items:flex-start!important}.coc-feature-price{align-items:flex-start!important;text-align:left!important}.coc-search{flex-basis:100%;max-width:none}.coc-stats{gap:8px}}
@media(max-width:420px){.coc-stat{padding:12px 6px!important}.coc-stat-l{letter-spacing:.06em!important;font-size:10px!important}.coc-card-footer{flex-wrap:wrap}.coc-card-btn{flex:1 1 100%}}
`;