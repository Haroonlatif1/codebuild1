import React, { useEffect, useRef, useState } from "react";
import { useSeenOnce, autoSrc, embedOf, SoundHint } from "./DemoAuto";
import { useSetting } from "./settings";
import { Link, useLocation } from "react-router-dom";
import "./v2.css";
import { KIDS_OFFER as O, SITE } from "../../config/siteConfig";

const off = Math.round(((O.originalPrice - O.price) / O.originalPrice) * 100);
const wa = (t) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t)}`;
const Pkr = ({ n }) => <>PKR {Number(n).toLocaleString()}</>;

/* ── Offer section ─────────────────────────────────────────── */
export const KidsOffer = () => (
  <section className="v2 ko" id="offer" aria-labelledby="ko-h">
    <video className="bgvid" src="/media/bg-ambient-4.mp4" poster="/media/bg-ambient-1.jpg" autoPlay muted loop playsInline aria-hidden="true" />
    <div className="v2-wrap">
      <div className="ko-top">
        <div>
          <span className="ko-tag">Limited-time offer · {off}% off</span>
          <h2 id="ko-h" className="ko-h">Make your child <em>AI ready</em> in {O.days} days</h2>
          <p className="v2-lead">A short, hands-on live course for ages {O.ages[0]}–{O.ages[1]}. Your child builds a chatbot, an AI storybook and an AI video, and finishes with a premium certificate.</p>
          <ul className="ko-facts">
            <li><b>{O.days}</b><span>days</span></li><li><b>4</b><span>modules</span></li><li><b>{O.ages[0]}–{O.ages[1]}</b><span>years old</span></li><li><b>Live</b><span>classes</span></li>
          </ul>
        </div>
        <aside className="ko-card" aria-label="Offer price">
          <div className="ko-was"><s><Pkr n={O.originalPrice} /></s><em>Save {off}%</em></div>
          <div className="ko-price"><b><Pkr n={O.price} /></b><span>one payment</span></div>
          <ul>
            <li>All 4 modules, {O.days} days of live classes</li>
            <li>Premium certificate on completion</li>
            <li>Free demo class before you pay</li>
            <li>Payment checked within {O.verifyHours} hours</li>
            <li><strong>100% refundable</strong> after {O.refundAfterClasses} classes if you don’t find it useful</li>
          </ul>
          <Link to="/ai-kids-enroll" className="v2-btn block">Enroll now</Link>
          <a className="ko-wa" href={wa("Hi CodeBuild Academy, I have a question about the 7-day AI for Kids course.")} target="_blank" rel="noopener noreferrer">Questions? Chat on WhatsApp</a>
        </aside>
      </div>

      <div className="ko-head"><div className="v2-eyebrow">What your child learns</div><h3 className="v2-h2">Four modules. Seven days. Real projects.</h3></div>
      <div className="ko-mods">
        {O.modules.map(m => (
          <article key={m.n} className="ko-mod"><b>{m.n}</b><span className="ko-days">{m.days}</span><h4>{m.title}</h4><p>{m.text}</p></article>))}
      </div>

      <div className="ko-cert">
        <div className="ko-cert-art" aria-hidden="true"><div><small>Certificate of completion</small><strong>AI for Kids</strong><span>CodeBuild Academy</span></div></div>
        <div>
          <div className="v2-eyebrow">Premium certification</div>
          <h3 className="v2-h2">A certificate worth framing</h3>
          <p className="v2-lead">Every child who completes the 7 days receives a premium certificate with a unique ID that anyone can check on our <Link to="/Certificate-verification" style={{ color: "var(--cb-accent)" }}>verification page</Link>.</p>
        </div>
      </div>
    </div>
  </section>
);

/* ── Big demo class section ────────────────────────────────── */
export const KidsDemo = () => {
  // Video comes from Admin → Site Settings → demo video (falls back to KIDS_OFFER.demoVideo in siteConfig.js)
  const saved = useSetting("demo_video", null);
  const v = saved ? (saved.enabled === false ? null : saved) : O.demoVideo;
  const media = v?.url ? embedOf(v.url) : null;
  const [clicked, setClicked] = useState(false); const [ready, setReady] = useState(false);
  const stage = useRef(null), frame = useRef(null), vid = useRef(null);
  const near = useSeenOnce(stage, 0.01, "1000px 0px");   // start loading well before it scrolls into view
  const seen = useSeenOnce(stage, 0.55);                 // start playing when mostly visible
  const want = clicked || seen;
  const mount = !!media && (media.yt || media.kind === "video" ? near : want);
  const thumb = v?.poster || media?.thumb || "/media/bg-ambient-1.jpg";

  // YouTube preloaded paused → tell it to play when wanted
  useEffect(() => {
    if (!media?.yt || !want || !ready) return;
    const w = frame.current?.contentWindow; if (!w) return;
    const send = (func) => w.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
    send("mute"); send("playVideo");
    const t = setTimeout(() => send("playVideo"), 700); return () => clearTimeout(t);
  }, [want, ready, media]);
  useEffect(() => { if (media?.kind === "video" && want && vid.current) vid.current.play().catch(() => {}); }, [want, media, mount]);

  return (
    <section className="v2 kd" id="kids-demo" data-hasvideo={media ? "true" : "false"} aria-labelledby="kd-h">
      {near && media?.yt && <link rel="preconnect" href="https://www.youtube-nocookie.com" />}
      <div className="v2-wrap">
        <div className="kd-head">
          <div className="v2-eyebrow" style={{ justifyContent: "center" }}>Free demo class</div>
          <h2 id="kd-h" className="v2-h2">See a real class before you pay</h2>
          <p className="v2-lead" style={{ margin: "10px auto 0" }}>Watch how we teach, or sit in on a live demo with your child. If it isn’t right for you, you have lost nothing.</p>
        </div>
        <div className="kd-stage" ref={stage} style={media ? { backgroundImage: `url(${thumb})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
          {media ? (<>
            {mount && (media.kind === "iframe"
              ? <iframe ref={frame} onLoad={() => setReady(true)} title={v.title || "Demo class"} src={media.yt ? media.src : autoSrc(media.src)} allow="autoplay; encrypted-media; fullscreen" allowFullScreen loading="eager" />
              : <video ref={vid} src={media.src} poster={thumb} controls muted playsInline preload="auto" />)}
            {!want && (
              <div className="kd-cover" style={{ background: "linear-gradient(rgba(7,7,15,.25),rgba(7,7,15,.55))" }}>
                <button className="kd-play" onClick={() => setClicked(true)} aria-label="Play demo class"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></button>
                <strong>{v.title || "Watch the demo class"}</strong>
              </div>)}
            {want && <SoundHint />}
          </>) : (<>
            <div className="kd-cover" style={{ backgroundImage: "url(/media/bg-ambient-1.jpg)", backgroundSize: "cover" }}>
              <strong>Join the next live demo class</strong><span>Message us on WhatsApp and we will send you the date and a joining link.</span>
              <a className="v2-btn" href={wa("Hi CodeBuild Academy, please book a free demo class of AI for Kids for my child.")} target="_blank" rel="noopener noreferrer">Book the demo on WhatsApp</a>
            </div>
          </>)}
        </div>
        <ol className="kd-steps">
          <li><b>1</b><div><strong>Watch</strong><span>A short guided example of a real lesson.</span></div></li>
          <li><b>2</b><div><strong>Try</strong><span>Your child tries a small AI task right in class.</span></div></li>
          <li><b>3</b><div><strong>Decide</strong><span>Enroll for PKR {O.price.toLocaleString()}, and it is refundable after {O.refundAfterClasses} classes.</span></div></li>
        </ol>
        <div className="kd-cta"><Link to="/ai-kids-enroll" className="v2-btn">Enroll now</Link></div>
      </div>
    </section>
  );
};

/* ── Sticky enroll button (home page) ──────────────────────── */
export const StickyEnroll = () => {
  const { pathname } = useLocation();
  if (pathname === "/ai-kids-enroll") return null;
  return (
    <div className="ko-sticky" role="complementary" aria-label="Current offer">
      <div><em className="ko-off">{off}% OFF</em><strong>AI for Kids · {O.days} days</strong><span><s><Pkr n={O.originalPrice} /></s> <b><Pkr n={O.price} /></b></span></div>
      <Link to="/ai-kids-enroll" className="v2-btn">Enroll now</Link>
    </div>
  );
};