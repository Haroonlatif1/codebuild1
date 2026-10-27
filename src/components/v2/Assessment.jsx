import React, { useEffect, useMemo, useRef, useState } from "react";
import "./v2.css";
import { GENERAL_ADULT, BY_CAT, KIDS, QUALIFICATIONS, KIDS_EXPERIENCE, KIDS_DEVICE, KIDS_INTERNET, KIDS_TYPING } from "./assessmentData";
import { courseCat } from "./courses";
import { sendWeb3 } from "./shared";
import { SITE } from "../../config/siteConfig";

const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const LETTERS = ["A", "B", "C", "D"];
const Chips = ({ label, opts, value, onChange }) => (
  <div className="v2-field" role="radiogroup" aria-label={label}>
    <div className="v2-label">{label}</div>
    <div className="asm-chips">{opts.map(o => <button type="button" key={o} role="radio" aria-checked={value === o} className={`asm-chip${value === o ? " on" : ""}`} onClick={() => onChange(o)}>{o}</button>)}</div>
  </div>
);

const Assessment = ({ course, onEnroll }) => {
  const [mode, setMode] = useState("kids"); // AI for Kids is the default tab
  const [stage, setStage] = useState("profile"); // profile | quiz | result
  const [p, setP] = useState({ age: "", qual: QUALIFICATIONS[1], know: 10, kidExp: KIDS_EXPERIENCE[0], parent: "", device: KIDS_DEVICE[0], internet: KIDS_INTERNET[0], typing: KIDS_TYPING[0] });
  const [err, setErr] = useState("");
  const [qs, setQs] = useState([]);
  const [i, setI] = useState(0);
  const [ans, setAns] = useState([]);
  const [sent, setSent] = useState(false);

  // keep the audience tab in sync when the course is changed in the enrollment form
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; } // don't override the kids default on first load
    setMode(courseCat(course) === "kids" ? "kids" : "adult"); setStage("profile");
  }, [course]);
  const switchMode = (m) => { setMode(m); setStage("profile"); setErr(""); };
  const kids = mode === "kids";
  const label = kids ? "AI for kids" : course === "AI for kids" ? "Full Stack Web Development" : course;

  const start = () => {
    const age = Number(p.age);
    if (kids && (age < 6 || age > 16)) return setErr(age > 16 ? "AI for Kids is for ages 6–16. Please use the Adults & teens tab." : "AI for Kids is for ages 6–16. Message us on WhatsApp and we will suggest the best starting point.");
    if (!kids && (age < 16 || age > 80)) return setErr(age && age < 16 ? "The Adults tab is for ages 16 and above. Please use the Kids tab for ages 6–16." : "Please enter a valid age.");
    setErr("");
    if (kids) { setSent(false); setStage("result"); return; } // kids: profile only, no quiz
    const picked = kids ? shuffle(KIDS).slice(0, 6) : [...shuffle(GENERAL_ADULT).slice(0, 4), ...shuffle(BY_CAT[courseCat(label)] || BY_CAT.general)];
    setQs(picked.map(q => { const idxs = shuffle([0, 1, 2, 3]); return { q: q.q, o: idxs.map(k => q.o[k]), a: idxs.indexOf(q.a), gen: GENERAL_ADULT.includes(q) }; }));
    setAns([]); setI(0); setStage("quiz");
  };

  const choose = (k) => setAns(a => { const c = [...a]; c[i] = k; return c; });
  const finish = () => { setStage("result"); setSent(false); };

  const result = useMemo(() => {
    if (stage !== "result") return null;
    if (kids) {
      const noDevice = p.device === KIDS_DEVICE[3], noNet = p.internet === KIDS_INTERNET[2], phoneOnly = p.device === KIDS_DEVICE[2];
      const start = p.kidExp === KIDS_EXPERIENCE[2] ? "Beginner+ (has tried coding)" : p.kidExp === KIDS_EXPERIENCE[1] ? "Beginner" : "Beginner (starting from scratch)";
      return { kid: true, ready: !(noDevice || noNet), noDevice, noNet, phoneOnly, level: start };
    }
    const total = qs.length;
    const right = qs.filter((q, k) => ans[k] === q.a).length;
    const quizPct = Math.round((right / total) * 100);
    const selfPct = kids ? ({ [KIDS_EXPERIENCE[0]]: 10, [KIDS_EXPERIENCE[1]]: 40, [KIDS_EXPERIENCE[2]]: 75 })[p.kidExp] : Number(p.know);
    const blended = Math.round(quizPct * 0.75 + selfPct * 0.25);
    const level = blended >= 70 ? "Intermediate" : blended >= 40 ? "Beginner+" : "Absolute Beginner";
    const gen = qs.filter(q => q.gen), gr = gen.filter(q => ans[qs.indexOf(q)] === q.a).length;
    const noDevice = kids && p.device === KIDS_DEVICE[3];
    const noNet = kids && p.internet === KIDS_INTERNET[2];
    const ready = !(noDevice || noNet);
    const phoneOnly = kids && p.device === KIDS_DEVICE[2];
    return { right, total, quizPct, selfPct, blended, level, gr, gt: gen.length, ready, noDevice, noNet, phoneOnly };
  }, [stage, qs, ans, p, kids]);

  const advice = result && !result.kid && (result.level === "Intermediate"
    ? "You already have a solid base, so we’ll place you in the fast-track batch and start with hands-on projects."
    : result.level === "Beginner+"
      ? "You know some of the basics. The standard batch is a perfect fit — we begin from fundamentals and move quickly."
      : "You’re starting from scratch, and that’s completely fine. Our beginner batch covers everything step by step with no prior knowledge needed.");

  const report = async () => {
    try {
      await sendWeb3({
        subject: `Skill check result – ${label} (${kids ? "Kids" : "Adult"})`, from_name: "CodeBuild Skill Check",
        course: label, audience: kids ? "Kids" : "Adult", age: p.age, qualification: kids ? "-" : p.qual, parent_or_guardian: p.parent || "-", device: kids ? p.device : "-", internet: kids ? p.internet : "-", keyboard: kids ? p.typing : "-",
        ...(result.kid ? { eligible: result.ready ? "Yes" : "Almost (needs device/internet)", experience: p.kidExp, recommended_level: result.level }
          : { self_rated_knowledge: `${result.selfPct}%`, quiz_score: `${result.right}/${result.total}`, blended: `${result.blended}%`, recommended_level: result.level }),
      });
      setSent(true);
    } catch { setErr("Could not send right now — you can still enroll below."); }
  };

  return (
    <section className="v2 asm" id="skill-check" aria-labelledby="asm-h">
      <video className="asm-video" src="/media/bg-ambient-2.mp4" autoPlay muted loop playsInline aria-hidden="true" />
      <div className="v2-wrap">
        <div className="asm-head">
          <div className="v2-eyebrow">Quick skill check · {kids ? "1 minute" : "3 minutes"}</div>
          <h2 className="v2-h2" id="asm-h">Find out if you’re ready</h2>
          <p className="v2-lead">{kids ? "Four quick questions for parents and kids. There’s no test — we just check your child is ready to join." : "A few simple questions about computers and your chosen course. There’s no pass or fail — we use it to place you in the right batch."}</p>
        </div>
        <div className="asm-card">
          <div className="asm-tabs" role="tablist">
            <button role="tab" aria-selected={kids} className={`asm-tab${kids ? " on" : ""}`} onClick={() => switchMode("kids")}>AI for Kids<small>Age 6 – 16</small></button>
            <button role="tab" aria-selected={!kids} className={`asm-tab${!kids ? " on" : ""}`} onClick={() => switchMode("adult")}>Adults &amp; teens<small>Age 16 and above</small></button>
          </div>
          <div className="asm-body">
            {stage === "profile" && (
              <div>
                <p style={{ marginTop: 0, color: "var(--cb-mute)", fontSize: 17 }}>Course: <strong style={{ color: "#fff" }}>{label}</strong> {!kids && <span style={{ color: "var(--cb-dim)" }}>(change it in the enrollment form above)</span>}</p>
                <div className="v2-row">
                  <div className="v2-field"><label className="v2-label" htmlFor="a-age">{kids ? "Child’s age (6–16)" : "Your age"}</label>
                    <input id="a-age" type="number" className="v2-input" value={p.age} onChange={e => setP({ ...p, age: e.target.value })} placeholder={kids ? "e.g. 9" : "e.g. 20"} /></div>
                  {kids
                    ? <div className="v2-field"><label className="v2-label" htmlFor="a-par">Parent / guardian name <small>optional</small></label><input id="a-par" className="v2-input" value={p.parent} onChange={e => setP({ ...p, parent: e.target.value })} /></div>
                    : <div className="v2-field"><label className="v2-label" htmlFor="a-q">Qualification</label>
                      <select id="a-q" className="v2-select" value={p.qual} onChange={e => setP({ ...p, qual: e.target.value })}>{QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}</select></div>}
                </div>
                {kids ? (
                  <>
                    <Chips id="a-dev" label="Do you have a laptop, computer, tablet or phone at home?" opts={KIDS_DEVICE} value={p.device} onChange={v => setP({ ...p, device: v })} />
                    <Chips id="a-net" label="Is there internet (Wi-Fi or mobile data) at home?" opts={KIDS_INTERNET} value={p.internet} onChange={v => setP({ ...p, internet: v })} />
                    <Chips id="a-typ" label="Can you use a keyboard?" opts={KIDS_TYPING} value={p.typing} onChange={v => setP({ ...p, typing: v })} />
                    <Chips id="a-ke" label="Which sentence describes you best?" opts={KIDS_EXPERIENCE} value={p.kidExp} onChange={v => setP({ ...p, kidExp: v })} />
                  </>
                ) : (
                  <div className="v2-field"><label className="v2-label" htmlFor="a-k">How much do you already know about “{label}”?</label>
                    <div className="asm-pct">{p.know}%</div>
                    <input id="a-k" type="range" min="0" max="100" step="5" className="asm-range" value={p.know} onChange={e => setP({ ...p, know: e.target.value })} />
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--cb-dim)", fontSize: 13 }}><span>Nothing yet</span><span>Quite a lot</span></div></div>
                )}
                {err && <div className="v2-err" role="alert">{err}</div>}
                <button className="v2-btn block" style={{ marginTop: 14 }} onClick={start} disabled={!p.age}>{kids ? "Check if my child is eligible" : "Start the questions"}</button>
              </div>
            )}

            {stage === "quiz" && qs[i] && (
              <div>
                <div className="asm-prog"><i style={{ width: `${((i + 1) / qs.length) * 100}%` }} /></div>
                <div className="asm-meta"><span>Question {i + 1} of {qs.length}</span><span>{kids ? "AI for Kids" : qs[i].gen ? "Computer basics" : label}</span></div>
                <div className="asm-q">{qs[i].q}</div>
                {qs[i].o.map((o, k) => (
                  <button key={k} className={`asm-opt${ans[i] === k ? " on" : ""}`} onClick={() => choose(k)}><b>{LETTERS[k]}</b><span>{o}</span></button>
                ))}
                <div className="asm-nav">
                  <button className="v2-btn ghost" onClick={() => i === 0 ? setStage("profile") : setI(i - 1)}>Back</button>
                  {i < qs.length - 1
                    ? <button className="v2-btn" disabled={ans[i] === undefined} onClick={() => setI(i + 1)}>Next</button>
                    : <button className="v2-btn" disabled={ans[i] === undefined} onClick={finish}>See my result</button>}
                </div>
              </div>
            )}

            {stage === "result" && result && result.kid && (
              <div className="asm-result" role="status">
                <svg className="asm-face" viewBox="0 0 120 120" role="img" aria-label="Happy face">
                  <circle cx="60" cy="60" r="54" fill="#ffc83d" stroke="#e59a00" strokeWidth="3" />
                  <ellipse cx="42" cy="48" rx="6" ry="9" fill="#3b2a00" /><ellipse cx="78" cy="48" rx="6" ry="9" fill="#3b2a00" />
                  <circle cx="30" cy="70" r="7" fill="#ff9b6a" opacity=".55" /><circle cx="90" cy="70" r="7" fill="#ff9b6a" opacity=".55" />
                  <path d="M34 70 Q60 100 86 70" fill="none" stroke="#3b2a00" strokeWidth="6" strokeLinecap="round" />
                </svg>
                <h3>Your kid is 100% eligible!</h3>
                <div className="asm-actions">
                  <button className="v2-btn" onClick={() => onEnroll(label)}>Enroll now</button>
                  <a className="v2-btn ghost" href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hi CodeBuild Academy, I just completed the skill check and my child is eligible for AI for Kids.")}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
                </div>
                {err && <div className="v2-err">{err}</div>}
              </div>
            )}

            {stage === "result" && result && !result.kid && (
              <div className="asm-result" role="status">
                <span className={`asm-badge${result.level === "Absolute Beginner" ? " warn" : ""}`}>You are eligible</span>
                <div className="asm-score">{result.right}<small>/{result.total}</small></div>
                <h3>{`You’re eligible for ${label}`}</h3>
                <p>Recommended starting level: <strong style={{ color: "#fff" }}>{result.level}</strong>. {advice}</p>
                <div className="asm-break">
                  <div><b>{result.quizPct}%</b><span>Quiz score</span></div>
                  <div><b>{result.selfPct}%</b><span>Self-rated</span></div>
                  <div><b>{result.blended}%</b><span>Overall</span></div>
                </div>
                <div className="asm-actions">
                  <button className="v2-btn" onClick={() => onEnroll(label)}>Enroll in this course</button>
                  <button className="v2-btn ghost" onClick={report} disabled={sent}>{sent ? "Sent to our team" : "Send my result to the academy"}</button>
                  <button className="v2-btn ghost" onClick={() => { setStage("profile"); setErr(""); }}>Retake</button>
                </div>
                {err && <div className="v2-err">{err}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Assessment;