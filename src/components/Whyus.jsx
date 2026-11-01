import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CountUp } from "./v2/CoursesFx";

const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const ICONS = {
  globe: <Icon><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.7 3.9 5.7 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.7-3.9-9S9.4 5.7 12 3z" /></Icon>,
  trainer: <Icon><circle cx="9" cy="8" r="3.4" /><path d="M2.8 20c.4-3.6 3-5.6 6.2-5.6 1.4 0 2.6.3 3.6 1M16 17l2 2 4-4.2" /></Icon>,
  tools: <Icon><path d="M14.7 6.3a4 4 0 0 0 5 5L11 20a2.1 2.1 0 0 1-3-3l8.7-8.7z" transform="translate(-1.5 -1)" /><path d="M5 5l3.2 3.2M4 9l5-5" /></Icon>,
  cert: <Icon><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M7 8.5h10M7 12h5" /><circle cx="16.5" cy="18" r="2.4" /><path d="M15.2 20l-.7 2 2-.8 2 .8-.7-2" /></Icon>,
  clock: <Icon><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 2" /></Icon>,
  rocket: <Icon><path d="M12 15l-3-3a22 22 0 0 1 2.5-5A11 11 0 0 1 21 3c0 3-1 6.5-4 9.5a22 22 0 0 1-5 2.5z" /><path d="M9 12H4s.5-3 2-4c1.6-1 4 0 4 0M12 15v5s3-.5 4-2c1-1.600 0-4 0-4" /><circle cx="16" cy="8" r="1" /></Icon>,
};

const whyUsData = [
  { icon: "globe", title: "International Recognition", desc: "CodeBuild Academy is globally recognized, with alumni working at leading tech firms across 20+ countries." },
  { icon: "trainer", title: "Industry Expert Trainers", desc: "Learn from working professionals with 10+ years of real-world experience — not just academics." },
  { icon: "tools", title: "Hands-On Project Learning", desc: "Every course is built around live projects, giving you a portfolio that speaks louder than a certificate." },
  { icon: "cert", title: "Globally Accredited Certificates", desc: "Our certificates are recognized by employers worldwide, adding real weight to your resume." },
  { icon: "clock", title: "Flexible Schedules", desc: "Morning, evening, or weekend batches — we fit around your life, not the other way around." },
  { icon: "rocket", title: "Career Placement Support", desc: "From resume reviews to mock interviews and job referrals, we stand by you until you land the job." },
];

const stats = [
  { value: "1200+", label: "Students Trained" },
  { value: "95%", label: "Placement Rate" },
  { value: "3", label: "Countries Reached" },
  { value: "20+", label: "Courses Offered" },
];

const css = `
.wy{position:relative;padding:110px 24px 100px;background:#08080e;overflow:hidden;font-family:"Dosis",sans-serif;color:#fff;isolation:isolate}
.wy-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.16;z-index:-2}
.wy::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(60% 50% at 85% 0%,rgba(255,165,0,.16),transparent 70%),radial-gradient(50% 40% at 0% 100%,rgba(255,165,0,.09),transparent 70%),linear-gradient(#08080e,rgba(8,8,14,.7) 40%,#08080e)}
.wy-in{max-width:1180px;margin:0 auto}
.wy-top{display:grid;grid-template-columns:1.2fr .8fr;gap:56px;align-items:end;margin-bottom:56px}
.wy-eyebrow{display:flex;align-items:center;gap:10px;font-size:12px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:#ffa500;margin-bottom:16px}
.wy-eyebrow::before{content:"";width:28px;height:2px;background:#ffa500}
.wy-title{font-family:"Bebas Neue",sans-serif;font-weight:400;font-size:clamp(46px,6.4vw,88px);line-height:.96;letter-spacing:.01em;margin:0 0 20px}
.wy-title span{color:#ffa500;background:linear-gradient(100deg,#ffa500,#ffe0a0 50%,#ffa500);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:wy-shine 5s linear infinite}
@keyframes wy-shine{to{background-position:-200% 0}}
.wy-sub{color:rgba(255,255,255,.62);font-size:18px;line-height:1.6;max-width:54ch;margin:0;font-weight:500}
.wy-stats{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.wy-stat{padding:20px 22px;border:1px solid rgba(255,255,255,.09);border-radius:10px;background:linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.015));backdrop-filter:blur(8px)}
.wy-stat b{display:block;font-family:"Bebas Neue",sans-serif;font-weight:400;font-size:46px;line-height:1;color:#ffa500;letter-spacing:.02em}
.wy-stat>span{font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.5)}
.wy-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.wy-card{position:relative;padding:32px 28px 30px;border-radius:12px;background:#0f0f17;border:1px solid rgba(255,255,255,.08);overflow:hidden;opacity:0;transform:translateY(28px);transition:opacity .6s ease,transform .6s cubic-bezier(.2,.8,.2,1),border-color .3s;--mx:50%;--my:50%}
.wy-card.in{opacity:1;transform:none}
.wy-card::before{content:"";position:absolute;inset:0;background:radial-gradient(380px circle at var(--mx) var(--my),rgba(255,165,0,.16),transparent 60%);opacity:0;transition:opacity .3s;pointer-events:none}
.wy-card:hover{border-color:rgba(255,165,0,.45);transform:translateY(-4px)}.wy-card:hover::before{opacity:1}
.wy-num{position:absolute;top:18px;right:22px;font-family:"Bebas Neue",sans-serif;font-size:44px;line-height:1;color:rgba(255,255,255,.06);letter-spacing:.04em}
.wy-ico{width:54px;height:54px;border-radius:12px;display:grid;place-items:center;color:#ffa500;background:rgba(255,165,0,.1);border:1px solid rgba(255,165,0,.3);margin-bottom:22px;transition:.3s}
.wy-card:hover .wy-ico{background:#ffa500;color:#0a0a0f;transform:rotate(-6deg) scale(1.06)}
.wy-card h3{font-size:22px;font-weight:700;line-height:1.25;margin:0 0 10px}
.wy-card p{margin:0;color:rgba(255,255,255,.6);font-size:16.5px;line-height:1.6}
.wy-card::after{content:"";position:absolute;left:28px;bottom:0;height:3px;width:0;background:#ffa500;transition:width .4s ease}.wy-card:hover::after{width:64px}
.wy-cta{margin-top:56px;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;padding:28px 34px;border-radius:12px;border:1px solid rgba(255,165,0,.4);background:linear-gradient(100deg,rgba(255,165,0,.14),rgba(255,165,0,.03))}
.wy-cta p{margin:0;font-family:"Bebas Neue",sans-serif;font-size:clamp(28px,3.6vw,40px);letter-spacing:.02em}
.wy-btn{display:inline-flex;align-items:center;gap:10px;background:#ffa500;color:#0a0a0f;border:2px solid #ffa500;font-weight:800;letter-spacing:.12em;text-transform:uppercase;font-size:14px;padding:15px 28px;border-radius:4px;text-decoration:none;transition:.2s}
.wy-btn:hover{background:transparent;color:#ffa500}.wy-btn svg{transition:transform .2s}.wy-btn:hover svg{transform:translateX(4px)}
@media(max-width:980px){.wy-top{grid-template-columns:1fr;gap:32px}.wy-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:620px){.wy{padding:72px 16px 64px}.wy-grid{grid-template-columns:1fr}.wy-stat b{font-size:38px}.wy-cta{padding:22px}}
@media(prefers-reduced-motion:reduce){.wy-title span{animation:none}.wy-card{opacity:1;transform:none;transition:none}}
`;

const WhyUs = () => {
  const [seen, setSeen] = useState([]);
  const refs = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { const i = +e.target.dataset.i; setSeen(p => p.includes(i) ? p : [...p, i]); io.unobserve(e.target); } }), { threshold: 0.15 });
    refs.current.forEach(el => el && io.observe(el)); return () => io.disconnect();
  }, []);
  const spot = (e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`); e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`); };

  return (
    <>
      <style>{css}</style>
      <section className="wy" aria-labelledby="wy-h">
        <video className="wy-bg" src="/media/bg-ambient-1.mp4" poster="/media/bg-ambient-1.jpg" autoPlay muted loop playsInline aria-hidden="true" />
        <div className="wy-in">
          <div className="wy-top">
            <div>
              <div className="wy-eyebrow">Why CodeBuild Academy</div>
              <h2 className="wy-title" id="wy-h">We Don't Just Train.<br />We <span>Build Careers.</span></h2>
              <p className="wy-sub">Join thousands of students who chose CodeBuild Academy to launch their international IT career — with real skills, real projects, and real results.</p>
            </div>
            <div className="wy-stats">
              {stats.map(s => (
                <div className="wy-stat" key={s.label}><b><CountUp value={s.value} /></b><span>{s.label}</span></div>))}
            </div>
          </div>

          <div className="wy-grid">
            {whyUsData.map((it, i) => (
              <article key={it.title} data-i={i} ref={el => (refs.current[i] = el)} onMouseMove={spot}
                className={`wy-card${seen.includes(i) ? " in" : ""}`} style={{ transitionDelay: `${(i % 3) * 90}ms` }}>
                <span className="wy-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div className="wy-ico">{ICONS[it.icon]}</div>
                <h3>{it.title}</h3>
                <p>{it.desc}</p>
              </article>))}
          </div>

          <div className="wy-cta">
            <p>Ready to start your IT journey?</p>
            <Link to="/offeredcourses" className="wy-btn">Enroll Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyUs;