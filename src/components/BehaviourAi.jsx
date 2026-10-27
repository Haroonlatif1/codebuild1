import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════════════
   BEHAVIOUR AI  —  CodeBuild Academy
   ✦ Zero API calls — pure hardcoded sales message pool
   ✦ Desktop: fixed bottom-left toast
   ✦ Mobile (≤768px): fixed top bar, below navbar (top: 72px)
   ✦ Fires every 12s
   ✦ Block persists in localStorage
════════════════════════════════════════════════════════════════════ */

const DISMISS_MS  = 5500;
const INTERVAL_MS = 12000;
const NAVBAR_H    = 72; // matches --cbn-height in NavigationBar

const PAGE_NAMES = {
  "/":                         "Home",
  "/offeredcourses":           "Courses",
  "/aboutus":                  "About Us",
  "/contactus":                "Contact Us",
  "/Certificate-verification": "Certificate Verification",
  "/privacy-policy":           "Privacy Policy",
  "/daily-challenge":          "Daily Challenge",
};

/* ─── SALES MESSAGE POOL ─────────────────────────────────────────── */
const SALES = {
  "/": [
    { icon:"🔥", prediction:"You're exploring — your career change starts NOW.",       msg:"500+ students enrolled this month. Don't miss your batch — seats fill fast!",           cta:"Secure My Seat",   href:"/" },
    { icon:"⚡", prediction:"You're one click away from changing your career.",         msg:"Every week you wait is a week behind. Your future self will thank you today.",           cta:"Enroll Now",       href:"/" },
    { icon:"💼", prediction:"You're thinking about it — stop thinking, start doing.",   msg:"Our graduates earn 3x more within 6 months. This course pays for itself.",              cta:"Start Today",      href:"/" },
    { icon:"🎯", prediction:"You're deciding between options — this one wins.",         msg:"95% placement rate. Real jobs, real salaries. Not promises — proven results.",           cta:"See Courses",      href:"/offeredcourses" },
    { icon:"🌍", prediction:"You want a career that works anywhere in the world.",      msg:"Our alumni work in Canada, Kuwait, UK & beyond. Your global career is one course away.", cta:"Explore Courses",  href:"/offeredcourses" },
  ],
  "/offeredcourses": [
    { icon:"⏰", prediction:"You're comparing courses — hesitation costs you time.",    msg:"Every course here has 100% job assistance. Pick one and own your future today.",         cta:"Enroll Now",       href:"/" },
    { icon:"🚀", prediction:"You found what you want — just go for it.",               msg:"Python Bootcamp students land jobs in 60 days average. Your countdown starts now.",      cta:"Enroll Now",       href:"/" },
    { icon:"💡", prediction:"You're weighing options — they're ALL worth it.",          msg:"Each skill you gain is permanent. No one can take your knowledge away from you.",        cta:"Choose a Course",  href:"/offeredcourses" },
    { icon:"🎓", prediction:"You're about to invest in the best version of yourself.", msg:"6 months of learning vs 6 years of wondering 'what if'. Choose the 6 months.",          cta:"Get Started",      href:"/" },
    { icon:"🔐", prediction:"You're serious about this — we can see it.",              msg:"Cybersecurity engineers earn PKR 150K+ per month. Your skills, your salary.",            cta:"Enroll Now",       href:"/" },
    { icon:"📊", prediction:"You want Data Science — it's the #1 skill of the decade.",msg:"Companies pay top dollar for data minds. Become one in 6 months.",                      cta:"Enroll Now",       href:"/" },
  ],
  "/aboutus": [
    { icon:"🏆", prediction:"You're checking if we're trustworthy — we are.",          msg:"10,000+ graduates. 20+ countries. 95% placement. We don't just teach — we transform.",  cta:"See Our Courses",  href:"/offeredcourses" },
    { icon:"❤️", prediction:"You're looking for a place that genuinely cares.",        msg:"Our instructors are industry professionals — not just teachers. Real mentors, real guidance.", cta:"Meet Your Future", href:"/offeredcourses" },
    { icon:"🌟", prediction:"You're almost convinced — this is your sign.",            msg:"Don't just read about us. Join us. Your success story starts with a single enrollment.", cta:"Enroll Today",     href:"/" },
  ],
  "/contactus": [
    { icon:"📞", prediction:"You have questions — we have all the answers.",           msg:"Every question you have has been asked before. We're here and ready to answer right now.", cta:null, href:null },
    { icon:"💬", prediction:"You're close to deciding — we'll make it easy.",          msg:"Tell us your goal. We'll tell you exactly which course gets you there fastest.",          cta:null, href:null },
    { icon:"🤝", prediction:"One conversation could change everything for you.",        msg:"Free 15-minute consultation. Zero pressure. Just honest advice for your career.",         cta:null, href:null },
  ],
  "/Certificate-verification": [
    { icon:"🎓", prediction:"You're verifying a graduate's certificate.",              msg:"Every CodeBuild certificate represents real skills, real training, real results.",         cta:"Our Courses",      href:"/offeredcourses" },
  ],
  "/daily-challenge": [
    { icon:"⚡", prediction:"You're here to sharpen your skills — smart move.",        msg:"Students who do daily challenges get hired 2x faster. Keep the streak going!",           cta:"Enroll Now",       href:"/" },
    { icon:"🧠", prediction:"Your brain is warming up — this is how champions start.", msg:"One challenge a day keeps unemployment away. CodeBuild graduates prove it daily.",       cta:"See Courses",      href:"/offeredcourses" },
  ],
  default: [
    { icon:"🔥", prediction:"You're one decision away from a better career.",          msg:"Stop researching. Start becoming. Enroll today and change your trajectory.",             cta:"Enroll Now",       href:"/" },
    { icon:"⚡", prediction:"Your future career is waiting for you to act.",           msg:"The best time to start was yesterday. The second best time is right now.",               cta:"Get Started",      href:"/offeredcourses" },
  ],
};

const pick    = (pool) => pool[Math.floor(Math.random() * pool.length)];
const getPool = (page) => SALES[page] || SALES.default;

/* ─── CSS ─────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Dosis:wght@600;700;800&display=swap');

  /* ══════════════════════════════
     DESKTOP  (> 768px)
     Fixed bottom-left toast
  ══════════════════════════════ */
  .bai-root {
    position: fixed;
    bottom: 22px;
    left: 22px;
    z-index: 9000;
    pointer-events: none;
    width: 310px;
  }

  .bai-card {
    pointer-events: all;
    width: 310px;
    background: #0e0e16;
    border: 1px solid rgba(255,165,0,0.25);
    border-radius: 12px;
    padding: 15px 36px 14px 15px;
    display: flex;
    align-items: flex-start;
    gap: 11px;
    box-shadow: 0 24px 52px rgba(0,0,0,0.82), inset 0 1px 0 rgba(255,255,255,0.035);
    font-family: "Dosis", sans-serif;
    position: relative;
    overflow: hidden;
    animation: bai-slide-in 0.42s cubic-bezier(0.22,1,0.36,1) forwards;
    will-change: transform, opacity;
  }
  .bai-card.bai-out {
    animation: bai-slide-out 0.3s cubic-bezier(0.4,0,1,1) forwards;
    pointer-events: none;
  }
  .bai-card::before {
    content:"";
    position:absolute; top:0; left:0; bottom:0; width:3px;
    background: linear-gradient(180deg,#ffa500,rgba(255,165,0,0.05));
    border-radius:12px 0 0 12px;
  }
  .bai-timer {
    position:absolute; bottom:0; left:0;
    height:2px;
    background: linear-gradient(90deg,#ffa500,rgba(255,165,0,0.1));
    animation: bai-shrink var(--dur) linear forwards;
    border-radius:0 0 0 12px;
    width:100%;
  }

  .bai-icon { font-size:21px; line-height:1; flex-shrink:0; margin-top:3px; }
  .bai-body { flex:1; min-width:0; }

  .bai-label {
    font-size:7px; font-weight:800; letter-spacing:2.5px;
    text-transform:uppercase; color:rgba(255,165,0,0.45);
    display:flex; align-items:center; gap:5px; margin-bottom:5px;
  }
  .bai-dot {
    width:4px; height:4px; border-radius:50%; background:#ffa500;
    animation:bai-pulse-dot 2s ease-in-out infinite;
  }
  .bai-pred {
    font-size:10.5px; font-weight:600; color:rgba(255,165,0,0.55);
    font-style:italic; display:block; margin-bottom:7px; line-height:1.4;
  }
  .bai-pred::before { content:"↳ "; }
  .bai-msg {
    font-size:12.5px; font-weight:700; color:rgba(255,255,255,0.92);
    line-height:1.54; margin-bottom:10px;
  }
  .bai-cta {
    display:inline-flex; align-items:center; gap:5px;
    font-size:9.5px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase;
    color:#09090e; background:#ffa500; text-decoration:none;
    border:1px solid #ffa500; border-radius:3px; padding:5px 13px;
    transition:background .2s,color .2s; cursor:pointer;
  }
  .bai-cta:hover { background:transparent; color:#ffa500; }

  .bai-x {
    position:absolute; top:7px; right:7px;
    background:none; border:none; color:rgba(255,255,255,0.18);
    font-size:12px; line-height:1; padding:4px 6px;
    cursor:pointer; transition:color .2s; font-family:sans-serif;
  }
  .bai-x:hover { color:rgba(255,255,255,0.55); }

  /* block button — sits below toast */
  .bai-block-btn {
    pointer-events: all;
    display: block;
    margin-top: 6px;
    background: rgba(15,15,22,0.85);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 6px;
    color: rgba(255,255,255,0.18);
    font-family: "Dosis", sans-serif;
    font-size: 8.5px; font-weight: 800;
    letter-spacing: 1.8px; text-transform: uppercase;
    padding: 5px 11px; cursor: pointer;
    transition: background .2s, border-color .2s, color .2s;
    backdrop-filter: blur(6px);
  }
  .bai-block-btn:hover {
    background: rgba(200,40,40,0.1);
    border-color: rgba(200,40,40,0.25);
    color: rgba(220,60,60,0.65);
  }

  /* standalone block button (no toast showing) */
  .bai-block-standalone {
    position: fixed;
    bottom: 22px; left: 22px;
    z-index: 8999;
    background: rgba(15,15,22,0.85);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 6px;
    color: rgba(255,255,255,0.14);
    font-family: "Dosis", sans-serif;
    font-size: 8.5px; font-weight: 800;
    letter-spacing: 1.8px; text-transform: uppercase;
    padding: 5px 11px; cursor: pointer;
    transition: background .2s, border-color .2s, color .2s;
    pointer-events: all;
  }
  .bai-block-standalone:hover {
    background: rgba(200,40,40,0.1);
    border-color: rgba(200,40,40,0.2);
    color: rgba(220,60,60,0.6);
  }

  /* blocked pill — desktop */
  .bai-blocked {
    position: fixed;
    bottom: 22px; left: 22px;
    z-index: 9000;
    pointer-events: all;
    background: rgba(15,15,22,0.92);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 8px;
    display: flex; align-items: center; gap: 10px;
    padding: 7px 10px 7px 12px;
    font-family: "Dosis", sans-serif;
    font-size: 9px; font-weight: 700;
    letter-spacing: 1px; color: rgba(255,255,255,0.22);
    animation: bai-slide-in 0.3s ease forwards;
  }
  .bai-resume {
    background: none;
    border: 1px solid rgba(255,165,0,0.22);
    border-radius: 3px;
    color: rgba(255,165,0,0.5);
    font-family: "Dosis", sans-serif;
    font-size: 8px; font-weight: 800;
    letter-spacing: 1.5px; text-transform: uppercase;
    padding: 3px 8px; cursor: pointer;
    transition: all .2s;
  }
  .bai-resume:hover { background: rgba(255,165,0,0.08); color: #ffa500; }

  /* ══════════════════════════════
     MOBILE  (≤ 768px)
     Full-width top bar below navbar
  ══════════════════════════════ */
  @media (max-width: 768px) {

    /* reposition root to top */
    .bai-root {
      position: fixed;
      top: ${NAVBAR_H}px;
      bottom: auto;
      left: 0;
      right: 0;
      width: 100%;
      z-index: 9000;
    }

    /* full-width banner card */
    .bai-card {
      width: 100%;
      border-radius: 0;
      border-left: none;
      border-right: none;
      border-top: none;
      border-bottom: 1px solid rgba(255,165,0,0.2);
      padding: 9px 38px 9px 12px;
      gap: 9px;
      align-items: center;
      box-shadow: 0 6px 24px rgba(0,0,0,0.6);
      animation: bai-drop-in 0.36s cubic-bezier(0.22,1,0.36,1) forwards;
    }
    .bai-card.bai-out {
      animation: bai-drop-out 0.26s ease forwards;
    }

    /* orange line at top instead of left */
    .bai-card::before {
      top: 0; left: 0; right: 0; bottom: auto;
      width: 100%; height: 2px;
      border-radius: 0;
    }

    .bai-icon { font-size: 16px; margin-top: 0; flex-shrink: 0; }

    /* hide AI label on mobile — saves space */
    .bai-label { display: none; }

    .bai-pred {
      font-size: 9px;
      margin-bottom: 2px;
    }
    .bai-msg {
      font-size: 11px;
      line-height: 1.4;
      margin-bottom: 5px;
    }
    .bai-cta {
      font-size: 8px;
      padding: 3px 9px;
      letter-spacing: 1px;
    }

    /* close button — centred vertically */
    .bai-x {
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
    }

    /* hide desktop block buttons on mobile */
    .bai-block-btn,
    .bai-block-standalone { display: none !important; }

    /* blocked pill — top bar on mobile */
    .bai-blocked {
      position: fixed;
      top: ${NAVBAR_H}px;
      bottom: auto;
      left: 0; right: 0;
      border-radius: 0;
      border: none;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      padding: 9px 16px;
      justify-content: space-between;
      animation: bai-drop-in 0.3s ease forwards;
    }
  }

  /* ── keyframes ── */
  @keyframes bai-slide-in {
    from { opacity:0; transform:translateX(-24px) scale(0.94); }
    to   { opacity:1; transform:translateX(0)     scale(1);    }
  }
  @keyframes bai-slide-out {
    from { opacity:1; transform:translateX(0)     scale(1);    }
    to   { opacity:0; transform:translateX(-18px) scale(0.92); }
  }
  @keyframes bai-drop-in {
    from { opacity:0; transform:translateY(-100%); }
    to   { opacity:1; transform:translateY(0);     }
  }
  @keyframes bai-drop-out {
    from { opacity:1; transform:translateY(0);     }
    to   { opacity:0; transform:translateY(-100%); }
  }
  @keyframes bai-shrink { from{width:100%} to{width:0%} }
  @keyframes bai-pulse-dot {
    0%,100%{opacity:.4;transform:scale(1);}
    50%{opacity:1;transform:scale(1.5);}
  }
`;

/* ─── TOAST COMPONENT ────────────────────────────────────────────── */
const Toast = ({ note, onClose, navigate, onBlock }) => {
  const [out, setOut] = useState(false);
  const timerRef = useRef(null);

  const dismiss = useCallback(() => {
    setOut(true);
    clearTimeout(timerRef.current);
    setTimeout(onClose, 320);
  }, [onClose]);

  useEffect(() => {
    timerRef.current = setTimeout(dismiss, DISMISS_MS);
    return () => clearTimeout(timerRef.current);
  }, [dismiss]);

  const handleCta = (e) => {
    e.preventDefault();
    dismiss();
    if (note.href) setTimeout(() => navigate(note.href), 320);
  };

  return (
    <div className={`bai-card${out ? " bai-out" : ""}`} style={{ "--dur": `${DISMISS_MS}ms` }}>
      <div className="bai-icon">{note.icon}</div>
      <div className="bai-body">
        <div className="bai-label"><span className="bai-dot" />AI Insight</div>
        {note.prediction && <span className="bai-pred">{note.prediction}</span>}
        <div className="bai-msg">{note.msg}</div>
        {note.cta && note.href && (
          <a href={note.href} className="bai-cta" onClick={handleCta}>{note.cta} →</a>
        )}
      </div>
      <button className="bai-x" onClick={dismiss} aria-label="close">✕</button>
      <div className="bai-timer" />
    </div>
  );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
const BehaviourAI = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [toast,   setToast]   = useState(null);
  const [blocked, setBlocked] = useState(
    () => localStorage.getItem("bai_blocked") === "1"
  );

  const block  = useCallback(() => {
    setBlocked(true);
    localStorage.setItem("bai_blocked", "1");
    setToast(null);
  }, []);

  const resume = useCallback(() => {
    setBlocked(false);
    localStorage.removeItem("bai_blocked");
  }, []);

  const shownRef   = useRef(new Set());
  const intervalRef = useRef(null);

  const triggerNotification = useCallback(() => {
    if (blocked) return;
    const page   = location.pathname;
    const pool   = getPool(page);
    const unseen = pool.filter(n => !shownRef.current.has(n.msg));
    const chosen = unseen.length > 0 ? pick(unseen) : pick(pool);
    shownRef.current.add(chosen.msg);
    setToast({ ...chosen, id: Date.now() + Math.random() });
  }, [blocked, location.pathname]);

  /* Reset + start interval on page change */
  useEffect(() => {
    shownRef.current.clear();
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!blocked) {
      intervalRef.current = setInterval(triggerNotification, INTERVAL_MS);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [location.pathname, blocked, triggerNotification]);

  return (
    <>
      <style>{css}</style>

      {/* Blocked state */}
      {blocked && (
        <div className="bai-blocked">
          🔕 AI paused
          <button className="bai-resume" onClick={resume}>Resume</button>
        </div>
      )}

      {/* Active toast */}
      {!blocked && toast && (
        <div className="bai-root">
          <Toast
            key={toast.id}
            note={toast}
            navigate={navigate}
            onBlock={block}
            onClose={() => setToast(null)}
          />
          <button className="bai-block-btn" onClick={block}>
            🔕 Stop notifications
          </button>
        </div>
      )}

      {/* Standalone block button (no toast showing) */}
      {!blocked && !toast && (
        <button className="bai-block-standalone" onClick={block}>
          🔕 Stop
        </button>
      )}
    </>
  );
};

export default BehaviourAI;