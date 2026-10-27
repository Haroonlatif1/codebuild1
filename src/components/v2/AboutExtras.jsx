import React from "react";
import "./v2.css";
import { AUDIENCES, HOW_IT_WORKS } from "../../config/content";
import { SITE } from "../../config/siteConfig";
import { WhyChoose } from "./ProductDetail";
import { useWhyChoose } from "./settings";

/** Extra About-page sections rendered above the page's closing call-to-action. */
const AboutExtras = () => {
  const why = useWhyChoose();
  return (
    <div className="v2" style={{ background: "#07070f" }}>
      <section className="hw" style={{ borderTop: 0 }}>
        <div className="v2-wrap">
          <div className="hw-head"><div className="v2-eyebrow">Who we teach</div><h2 className="v2-h2">Built around who you are</h2></div>
          <div className="hw-aud" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            {AUDIENCES.map(a => <div key={a.title}><strong>{a.title}</strong><span>{a.text}</span></div>)}
          </div>
        </div>
      </section>
      <div className="v2-wrap"><WhyChoose items={why} brand={SITE.name} /></div>
      <section className="hw" style={{ paddingTop: 20 }}>
        <div className="v2-wrap">
          <div className="hw-head"><div className="v2-eyebrow">How it works</div><h2 className="v2-h2">From application to first class</h2></div>
          <ol className="hw-steps">{HOW_IT_WORKS.map(s => <li key={s.n}><span className="hw-n">{s.n}</span><h3>{s.title}</h3><p>{s.text}</p></li>)}</ol>
        </div>
      </section>
    </div>
  );
};
export default AboutExtras;
