import React, { useEffect, useState } from "react";
import "./v2.css";
import { HOW_IT_WORKS, WHAT_YOU_NEED, FAQS, AUDIENCES } from "../../config/content";
import { SITE } from "../../config/siteConfig";

const COURSE_IMAGES = [
  ["/webdev.png", "Full stack web development course", "Web development"],
  ["/python.jpg", "Python programming course", "Python"],
  ["/ethical.jpg", "Ethical hacking and cyber security course", "Cyber security"],
  ["/frontend.jpg", "Frontend development course", "Frontend"],
];

export const HowItWorks = () => (
  <section className="v2 hw hw-media" aria-labelledby="hw-h">
    <video className="bgvid" src="/media/bg-ambient-3.mp4" autoPlay muted loop playsInline aria-hidden="true" />
    <div className="v2-wrap">
      <div className="hw-strip" aria-label="Courses you can learn">
        {COURSE_IMAGES.map(([src, alt, label]) => <figure key={src}><img src={src} alt={alt} loading="lazy" /><figcaption>{label}</figcaption></figure>)}
      </div>
      <div className="hw-head">
        <div className="v2-eyebrow">How it works</div>
        <h2 className="v2-h2" id="hw-h">Simple by design</h2>
      </div>
      <ol className="hw-steps">
        {HOW_IT_WORKS.map(s => (
          <li key={s.n}><span className="hw-n">{s.n}</span><h3>{s.title}</h3><p>{s.text}</p></li>
        ))}
      </ol>
      <div className="hw-need">
        <div>
          <div className="v2-eyebrow">What you need</div>
          <ul>{WHAT_YOU_NEED.map(x => <li key={x}>{x}</li>)}</ul>
        </div>
        <div>
          <div className="v2-eyebrow">Built around who you are</div>
          <div className="hw-aud">{AUDIENCES.map(a => <div key={a.title}><strong>{a.title}</strong><span>{a.text}</span></div>)}</div>
        </div>
      </div>
    </div>
  </section>
);

export const Faq = ({ items = FAQS, title = "The fair questions", withSchema = true }) => {
  const [open, setOpen] = useState(0);
  useEffect(() => {
    if (!withSchema) return;
    const el = document.createElement("script"); el.type = "application/ld+json"; el.id = "ld-faq";
    el.text = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
    document.head.appendChild(el); return () => el.remove();
  }, [items, withSchema]);
  return (
    <section className="v2 faq faq-media" aria-labelledby="faq-h">
      <video className="bgvid" src="/media/bg-ambient-4.mp4" autoPlay muted loop playsInline aria-hidden="true" />
      <div className="v2-wrap faq-grid">
        <div>
          <div className="v2-eyebrow">FAQ</div>
          <h2 className="v2-h2" id="faq-h">{title}</h2>
          <p className="v2-lead" style={{ marginTop: 14 }}>Still unsure? A real person will answer on WhatsApp.</p>
          <a className="v2-btn ghost" style={{ marginTop: 22 }} target="_blank" rel="noopener noreferrer" href={`https://wa.me/${SITE.whatsapp}`}>Message us</a>
        </div>
        <div>
          {items.map((f, i) => (
            <div className={`faq-item${open === i ? " on" : ""}`} key={f.q}>
              <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}><span>{f.q}</span><i aria-hidden="true">{open === i ? "–" : "+"}</i></button>
              {open === i && <p>{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};