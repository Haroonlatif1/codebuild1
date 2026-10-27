import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./v2.css";
import { KIDS_OFFER as O, SITE, PAYMENT_ACCOUNTS } from "../../config/siteConfig";
import { sendWeb3, Tick } from "./shared";
import { useSeo } from "./seo";

const Pkr = ({ n }) => <>PKR {Number(n).toLocaleString()}</>;

const KidsEnroll = () => {
  useSeo({ title: "Enroll – 7-Day AI for Kids", description: "Enroll your child in the 7-day AI for Kids course for PKR 999. Build AI bots, storybooks and videos. Refundable after 2 classes.", path: "/ai-kids-enroll", noindex: true });
  const [f, setF] = useState({ kid: "", age: "", parent: "", phone: "" });
  const [err, setErr] = useState({}); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false); const [copied, setCopied] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const accounts = PAYMENT_ACCOUNTS.filter(a => a.number);

  const submit = async (e) => {
    e.preventDefault(); const er = {}; const age = Number(f.age);
    if (f.kid.trim().length < 2) er.kid = "Please enter your child’s name.";
    if (!age || age < O.ages[0] || age > O.ages[1]) er.age = `This course is for ages ${O.ages[0]}–${O.ages[1]}.`;
    if (f.phone.replace(/\D/g, "").length < 10) er.phone = "Enter the WhatsApp number we can reach you on.";
    setErr(er); if (Object.keys(er).length) return;
    setBusy(true);
    try {
      await sendWeb3({ subject: `New 7-day AI for Kids enrollment – ${f.kid}`, from_name: "CodeBuild Offer Enrollment", course: O.title, price: `PKR ${O.price}`, kid_name: f.kid, kid_age: f.age, parent_name: f.parent || "-", whatsapp: f.phone });
    } catch (_) { /* the child still sees payment details; parent will message us on WhatsApp */ }
    setBusy(false); setDone(true); window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const copy = (t, k) => { try { navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(""), 1500); } catch (_) {} };
  const msg = `Hi CodeBuild Academy, I have paid PKR ${O.price} for the 7-day AI for Kids course. Child: ${f.kid}, age ${f.age}. Sending the payment screenshot now.`;

  return (
    <main className="v2 ke">
      <video className="bgvid" src="/media/bg-ambient-3.mp4" poster="/media/bg-ambient-1.jpg" autoPlay muted loop playsInline aria-hidden="true" />
      <div className="ke-wrap">
        <aside className="ke-side">
          <div className="v2-eyebrow">Current offer</div>
          <h1 className="ke-h">{O.title}</h1>
          <div className="ko-was"><s><Pkr n={O.originalPrice} /></s></div>
          <div className="ko-price"><b><Pkr n={O.price} /></b><span>one payment</span></div>
          <ul className="ke-list">
            <li>AI bots, AI storybooks, AI videos and prompt engineering</li>
            <li>{O.days} days of live classes, with a premium certificate</li>
            <li>Payment checked within {O.verifyHours} hours</li>
            <li><strong>100% refundable</strong> after {O.refundAfterClasses} classes if you don’t find it useful</li>
          </ul>
        </aside>

        <section className="ke-card">
          <Link to="/" className="ke-x" aria-label="Close and go back to the home page">×</Link>
          {!done ? (
            <form onSubmit={submit} noValidate>
              <div className="enr-step" style={{ marginTop: 0 }}><i>1</i>Your child’s details</div>
              <div className="v2-field"><label className="v2-label" htmlFor="k-kid">Kid’s name</label>
                <input id="k-kid" className={`v2-input${err.kid ? " err" : ""}`} value={f.kid} onChange={set("kid")} autoComplete="off" autoFocus />{err.kid && <div className="v2-err">{err.kid}</div>}</div>
              <div className="v2-field"><label className="v2-label" htmlFor="k-age">Kid’s age <small>{O.ages[0]}–{O.ages[1]} years</small></label>
                <input id="k-age" type="number" inputMode="numeric" min={O.ages[0]} max={O.ages[1]} className={`v2-input${err.age ? " err" : ""}`} value={f.age} onChange={set("age")} />{err.age && <div className="v2-err">{err.age}</div>}</div>
              <div className="v2-field"><label className="v2-label" htmlFor="k-par">Parent’s name <small>optional</small></label>
                <input id="k-par" className="v2-input" value={f.parent} onChange={set("parent")} /></div>
              <div className="v2-field"><label className="v2-label" htmlFor="k-ph">WhatsApp number</label>
                <input id="k-ph" type="tel" inputMode="tel" placeholder="03XX XXXXXXX" className={`v2-input${err.phone ? " err" : ""}`} value={f.phone} onChange={set("phone")} />{err.phone && <div className="v2-err">{err.phone}</div>}</div>
              <button className="v2-btn block" disabled={busy}>{busy ? "Please wait…" : "Continue to payment"}</button>
              <p className="ke-fine">You pay in the next step. Nothing is charged here.</p>
            </form>
          ) : (
            <div role="status">
              <div style={{ textAlign: "center" }}><Tick /><h2 className="ke-done">Almost there, {f.kid.split(" ")[0]}’s seat is reserved</h2></div>
              <div className="enr-step"><i>2</i>Pay <Pkr n={O.price} /></div>
              <div className="pay-box">
                {accounts.map(a => (
                  <div className="pay-row" key={a.method}><b>{a.method}</b>
                    <span>{a.title} · {a.number}{a.bank ? ` · ${a.bank}` : ""}<button type="button" className="pay-copy" onClick={() => copy(a.number, a.method)}>{copied === a.method ? "COPIED" : "COPY"}</button></span></div>))}
              </div>
              <div className="enr-step"><i>3</i>Send the screenshot on WhatsApp</div>
              <a className="v2-btn block" href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer">Share payment screenshot on WhatsApp</a>
              <ul className="ke-list" style={{ marginTop: 20 }}>
                <li>We verify your payment within <strong>{O.verifyHours} hours</strong> and confirm your batch on WhatsApp.</li>
                <li><strong>100% refundable</strong> after {O.refundAfterClasses} classes if you don’t find the course useful.</li>
              </ul>
              <p className="ke-fine"><Link to="/">Back to home</Link></p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
export default KidsEnroll;