import React, { useState } from "react";
import "./v2.css";
import { COURSE_GROUPS } from "./courses";
import { PAYMENT_ACCOUNTS, REGISTRATION_FEE, SITE } from "../../config/siteConfig";
import { JpegDrop, Tick, validateJpeg, uploadProof, sendWeb3 } from "./shared";
import { supabase } from "../supabase/SupabaseClient";

const PHOTOS = [
  ["/webdev.png", "Web development class material"],
  ["/python.jpg", "Python programming course"],
  ["/ethical.jpg", "Cyber security course"],
];

const Enrollment = ({ course, onCourseChange }) => {
  const [f, setF] = useState({ name: "", age: "", email: "", phone: "", city: "" });
  const [file, setFile] = useState(null);
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [serverErr, setServerErr] = useState("");
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const isKids = course === "AI for kids";

  const copy = (t) => navigator.clipboard?.writeText(t).catch(() => {});

  const onFile = async (fl) => {
    if (!fl) { setFile(null); return; }
    const msg = await validateJpeg(fl);
    if (msg) { setFile(null); setErrs(e => ({ ...e, file: msg })); return; }
    setErrs(e => ({ ...e, file: "" })); setFile(fl);
  };

  const validate = async () => {
    const e = {};
    if (f.name.trim().length < 3) e.name = "Please enter your full name.";
    const age = Number(f.age);
    if (!age || age < 5 || age > 80) e.age = "Enter a valid age (5–80).";
    else if (isKids && (age < 6 || age > 16)) e.age = "AI for Kids is for ages 6–16. Choose another course for adults.";
    else if (!isKids && age < 12) e.age = "For students under 12 please choose “AI for kids”.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address.";
    if (f.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid WhatsApp / phone number.";
    const fm = await validateJpeg(file);
    if (fm) e.file = fm;
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault(); setServerErr("");
    if (f.hp) return; // honeypot
    const e = await validate(); setErrs(e);
    if (Object.keys(e).length) { document.querySelector(".v2-err")?.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
    setBusy(true);
    try {
      const proofUrl = await uploadProof(file, "enrollments");
      const payload = {
        subject: `New enrollment: ${f.name} – ${course}`, from_name: "CodeBuild Enrollment",
        name: f.name, age: f.age, email: f.email, phone: f.phone, city: f.city, course,
        payment_screenshot: proofUrl || "(attached to this email)",
      };
      const data = await sendWeb3(payload, proofUrl ? null : file);
      if (!data.success) throw new Error(data.message || "Could not send your application.");
      // best-effort record in Supabase (table created by supabase_setup.sql); never blocks the user
      supabase.from("enrollments").insert([{ name: f.name, age: Number(f.age), email: f.email, phone: f.phone, city: f.city, course, payment_proof_url: proofUrl || null }]).then(() => {}, () => {});
      setDone(true);
    } catch (err) { setServerErr(err.message || "Something went wrong. Please try again or WhatsApp us."); }
    setBusy(false);
  };

  const accounts = PAYMENT_ACCOUNTS.filter(a => a.number);

  return (
    <section className="v2 enr" id="enroll" aria-labelledby="enr-h">
      <video className="enr-video" src="/media/bg-ambient-1.mp4" poster="/media/bg-ambient-1.jpg" autoPlay muted loop playsInline aria-hidden="true" />
      <div className="v2-wrap enr-grid">
        <div>
          <div className="v2-eyebrow">Admissions open · {SITE.name}</div>
          <h1 className="enr-title" id="enr-h">Learn IT skills that<br />get you <em>hired</em>.</h1>
          <p className="v2-lead">Live, instructor-led classes in web development, AI, programming, cyber security and more — for kids and adults, taught in a mix of English and Urdu.</p>
          <ul className="enr-points">
            <li><b>01</b><div><strong>Try before you commit</strong><span>Watch a free demo session and take a 3-minute skill check below.</span></div></li>
            <li><b>02</b><div><strong>Pay and upload your receipt</strong><span>JazzCash, Easypaisa or bank transfer — we verify within hours.</span></div></li>
            <li><b>03</b><div><strong>Get your batch details on WhatsApp</strong><span>We confirm your class timing, instructor and joining link.</span></div></li>
          </ul>
          <div className="enr-photos">{PHOTOS.map(([s, a]) => <img key={s} src={s} alt={a} loading="lazy" />)}</div>
        </div>

        <div className="enr-card">
          {done ? (
            <div className="enr-done" role="status">
              <Tick />
              <h3>Application received</h3>
              <p>Thank you, {f.name.split(" ")[0]}. We’ll verify your payment and message you on WhatsApp ({f.phone}) with your batch details, usually within a few hours or contact us 03284452954</p>
              <p style={{ marginTop: 18 }}><a className="v2-btn ghost" href="offeredcourses">Explore other programs too</a></p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <input className="v2-hp" name="hp" tabIndex={-1} autoComplete="off" value={f.hp || ""} onChange={e => set("hp", e.target.value)} aria-hidden="true" />
              <div className="enr-step"><i>1</i> Your details</div>
              <div className="v2-field">
                <label className="v2-label" htmlFor="e-name">Full name</label>
                <input id="e-name" className={`v2-input${errs.name ? " err" : ""}`} value={f.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Ali Hassan" autoComplete="name" />
                {errs.name && <div className="v2-err">{errs.name}</div>}
              </div>
              <div className="v2-row">
                <div className="v2-field">
                  <label className="v2-label" htmlFor="e-age">Age</label>
                  <input id="e-age" type="number" inputMode="numeric" min="5" max="80" className={`v2-input${errs.age ? " err" : ""}`} value={f.age} onChange={e => set("age", e.target.value)} placeholder="e.g. 17" />
                  {errs.age && <div className="v2-err">{errs.age}</div>}
                </div>
                <div className="v2-field">
                  <label className="v2-label" htmlFor="e-city">City <small>optional</small></label>
                  <input id="e-city" className="v2-input" value={f.city} onChange={e => set("city", e.target.value)} placeholder="e.g. Lahore" autoComplete="address-level2" />
                </div>
              </div>
              <div className="v2-row">
                <div className="v2-field">
                  <label className="v2-label" htmlFor="e-mail">Email</label>
                  <input id="e-mail" type="email" className={`v2-input${errs.email ? " err" : ""}`} value={f.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" autoComplete="email" />
                  {errs.email && <div className="v2-err">{errs.email}</div>}
                </div>
                <div className="v2-field">
                  <label className="v2-label" htmlFor="e-ph">WhatsApp number</label>
                  <input id="e-ph" type="tel" className={`v2-input${errs.phone ? " err" : ""}`} value={f.phone} onChange={e => set("phone", e.target.value)} placeholder="+92 300 0000000" autoComplete="tel" />
                  {errs.phone && <div className="v2-err">{errs.phone}</div>}
                </div>
              </div>

              <div className="enr-step"><i>2</i> Choose your course</div>
              <div className="v2-field">
                <label className="v2-label" htmlFor="e-course">Preferred course</label>
                <select id="e-course" className="v2-select" value={course} onChange={e => onCourseChange(e.target.value)}>
                  {COURSE_GROUPS.map(g => (
                    <optgroup key={g.group} label={g.group}>
                      {g.options.map(o => <option key={o.label} value={o.label}>{o.label}{o.tag ? ` — ${o.tag}` : ""}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="enr-step"><i>3</i> Payment</div>
              {REGISTRATION_FEE ? <p style={{ margin: "0 0 12px", color: "var(--cb-mute)" }}>Registration fee: <strong style={{ color: "#fff" }}>PKR {Number(REGISTRATION_FEE).toLocaleString()}</strong></p> : null}
              {accounts.length > 0 && (
                <div className="pay-box">
                  {accounts.map(a => (
                    <div className="pay-row" key={a.method}>
                      <b>{a.method}</b>
                      <span>{a.title}{a.bank ? ` · ${a.bank}` : ""} · {a.number}
                        <button type="button" className="pay-copy" onClick={() => copy(a.number)}>COPY</button></span>
                    </div>
                  ))}
                </div>
              )}
              <JpegDrop file={file} onFile={onFile} error={errs.file} id="e-proof" />

              {serverErr && <div className="v2-err" role="alert" style={{ marginTop: 14 }}>{serverErr}</div>}
              <button className="v2-btn block" type="submit" disabled={busy} style={{ marginTop: 22 }}>
                {busy ? "Submitting…" : "Submit application"}
              </button>
              <p className="enr-note">Your details are used only to process your enrollment. See our <a href="/privacy-policy" style={{ color: "var(--cb-accent)" }}>privacy policy</a>.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
export default Enrollment;
