import React, { useState } from "react";
import { FaInstagram, FaFacebook, FaWhatsapp, FaLinkedin } from "react-icons/fa";
import "./v2.css";
import { SITE } from "../../config/siteConfig";
import { sendWeb3 } from "./shared";
import { useSeo } from "./seo";

const PHONES = [{ label: "0328-4452954", tel: "+923284452954" }, { label: "0324-8423974", tel: "+923248423974" }];
const EMAIL = "contact@codebuildacademy.com";
const CAMPUSES = [
  { name: "Iqbal Town campus", addr: "Ravi Block, Iqbal Town, Lahore, Pakistan" },
  { name: "Gulberg campus", addr: "58-A2 Tipu Road, Gulberg III, Lahore, Pakistan" },
];
const SOCIAL = [
  { Icon: FaWhatsapp, label: "WhatsApp", url: `https://wa.me/${SITE.whatsapp}` },
  { Icon: FaInstagram, label: "Instagram", url: "https://www.instagram.com/codebuild1" },
  { Icon: FaFacebook, label: "Facebook", url: "https://www.facebook.com/profile.php?id=61563588339796" },
  { Icon: FaLinkedin, label: "LinkedIn", url: "https://www.linkedin.com/company/codebuild-academy" },
];
const TOPICS = ["Course enrollment", "Kids course (AI for Kids)", "Store / order help", "Certificate verification", "Something else"];

const ContactPage = () => {
  useSeo({
    title: "Contact Us", description: "Contact CodeBuild Academy in Lahore: WhatsApp, phone, email and campus addresses. Ask about courses, AI for Kids, store orders or certificates.", path: "/contactus",
    jsonLd: { "@context": "https://schema.org", "@type": "ContactPage", name: "Contact CodeBuild Academy", url: `${SITE.url}/contactus` },
  });
  const [f, setF] = useState({ name: "", email: "", phone: "", topic: TOPICS[0], message: "", hp: "" });
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [err, setErr] = useState("");
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault(); if (f.hp) return;
    if (!/^\S+@\S+\.\S+$/.test(f.email) || f.name.trim().length < 2 || f.message.trim().length < 10) { setErr("Please fill in your name, a valid email and a short message."); return; }
    setErr(""); setState("sending");
    try {
      const d = await sendWeb3({ subject: `Website enquiry: ${f.topic}`, from_name: "CodeBuild Contact Form", name: f.name, email: f.email, phone: f.phone, topic: f.topic, message: f.message });
      if (!d.success) throw new Error(d.message);
      setState("done");
    } catch { setState("error"); setErr("We could not send your message. Please WhatsApp us instead."); }
  };

  return (
    <main className="v2 ct">
      <header className="ct-hero"><div className="v2-wrap">
        <div className="v2-eyebrow">Contact</div>
        <h1 className="v2-h2" style={{ fontSize: "clamp(44px,7vw,84px)" }}>Talk to a real person</h1>
        <p className="v2-lead" style={{ marginTop: 14 }}>Questions about a course, your child’s first class or a store order? Message us on WhatsApp for the quickest reply, or use the form.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
          <a className="v2-btn" href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hi CodeBuild, I have a question.")}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
          <a className="v2-btn ghost" href={`tel:${PHONES[0].tel}`}>Call {PHONES[0].label}</a>
        </div>
      </div></header>

      <div className="v2-wrap ct-grid">
        <section aria-label="Contact details">
          <div className="ct-block"><h2>Phone</h2>{PHONES.map(p => <a key={p.tel} href={`tel:${p.tel}`}>{p.label}</a>)}</div>
          <div className="ct-block"><h2>Email</h2><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
          <div className="ct-block"><h2>Campuses · Lahore</h2>
            {CAMPUSES.map(c => <p key={c.name}><strong>{c.name}</strong><br />{c.addr}<br /><a className="ct-small" target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.addr)}`}>Open in Maps</a></p>)}
          </div>
          <div className="ct-block"><h2>Follow us</h2>
            <div className="ct-social">{SOCIAL.map(({ Icon, label, url }) => <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}><Icon aria-hidden="true" /><span>{label}</span></a>)}</div></div>
        </section>

        <section className="ct-form" aria-label="Send us a message">
          {state === "done" ? (
            <div style={{ textAlign: "center", padding: "50px 10px" }} role="status">
              <svg className="tick" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" /><path d="M30 52l14 14 27-30" /></svg>
              <h2 className="v2-h2" style={{ margin: "18px 0 8px" }}>Message sent</h2>
              <p className="v2-lead" style={{ margin: "0 auto" }}>Thank you, {f.name.split(" ")[0]}. We will reply to {f.email} or on WhatsApp soon.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <h2 className="v2-h2" style={{ fontSize: 40, marginBottom: 18 }}>Send a message</h2>
              <input className="v2-hp" tabIndex={-1} autoComplete="off" value={f.hp} onChange={e => set("hp", e.target.value)} aria-hidden="true" />
              <div className="v2-row">
                <div className="v2-field"><label className="v2-label" htmlFor="ct-n">Name</label><input id="ct-n" className="v2-input" value={f.name} onChange={e => set("name", e.target.value)} autoComplete="name" /></div>
                <div className="v2-field"><label className="v2-label" htmlFor="ct-e">Email</label><input id="ct-e" type="email" className="v2-input" value={f.email} onChange={e => set("email", e.target.value)} autoComplete="email" /></div>
              </div>
              <div className="v2-row">
                <div className="v2-field"><label className="v2-label" htmlFor="ct-p">WhatsApp <small>optional</small></label><input id="ct-p" type="tel" className="v2-input" value={f.phone} onChange={e => set("phone", e.target.value)} autoComplete="tel" /></div>
                <div className="v2-field"><label className="v2-label" htmlFor="ct-t">Topic</label><select id="ct-t" className="v2-select" value={f.topic} onChange={e => set("topic", e.target.value)}>{TOPICS.map(t => <option key={t}>{t}</option>)}</select></div>
              </div>
              <div className="v2-field"><label className="v2-label" htmlFor="ct-m">Message</label><textarea id="ct-m" rows="5" className="v2-input" value={f.message} onChange={e => set("message", e.target.value)} /></div>
              {err && <div className="v2-err" role="alert" style={{ marginBottom: 12 }}>{err}</div>}
              <button className="v2-btn block" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message"}</button>
              <p className="enr-note">We reply on WhatsApp fastest. Your details are used only to answer you — see our <a href="/privacy-policy" style={{ color: "var(--cb-accent)" }}>privacy policy</a>.</p>
            </form>
          )}
        </section>
      </div>

      <div className="v2-wrap" style={{ paddingBottom: 90 }}>
        <iframe title="CodeBuild Academy location in Lahore" className="ct-map" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${encodeURIComponent("58-A2 Tipu Road Gulberg III Lahore")}&output=embed`} />
      </div>
    </main>
  );
};
export default ContactPage;
