import React, { useState } from "react";
import "./v2.css";
import { DEMO_VIDEO, SITE } from "../../config/siteConfig";
import { useSetting } from "./settings";

const ytId = (u = "") => (u.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/) || [])[1];
const embed = (url) => {
  const id = ytId(url);
  if (id) return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`, poster: `https://img.youtube.com/vi/${id}/maxresdefault.jpg` };
  if (/facebook\.com|fb\.watch/.test(url)) return { kind: "iframe", src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=true`, poster: "" };
  return { kind: "video", src: url, poster: "" };
};
const PlayIcon = () => (
  <svg viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="48" r="46" fill="rgba(0,0,0,.45)" stroke="#ffa500" strokeWidth="2.5" /><path d="M39 30l30 18-30 18z" fill="#ffa500" /></svg>
);

/** One full-width demo video. Controlled from Admin → Site Settings (falls back to DEMO_VIDEO in siteConfig.js). */
const DemoSession = () => {
  const saved = useSetting("demo_video", null);
  const v = saved ? (saved.enabled === false ? null : saved) : DEMO_VIDEO;
  const [playing, setPlaying] = useState(false);
  const media = v?.url ? embed(v.url) : null;

  return (
    <section className="v2 demo" id="demo" aria-labelledby="demo-h">
      <div className="v2-wrap demo-head">
        <div>
          <div className="v2-eyebrow">Free demo session of 3 months course</div>
          <h2 className="v2-h2" id="demo-h">Sit in on a class<br />before you enroll</h2>
        </div>
        <p className="v2-lead" style={{ margin: 0 }}>Watch how our instructors teach — the pace, the projects, the way questions are handled. No sign-up needed.</p>
      </div>
      <div className="demo-stage">
        {media ? (playing ? (
          media.kind === "iframe"
            ? <iframe src={media.src} title={v.title || "Demo session"} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
            : <video src={media.src} controls autoPlay playsInline poster={v.poster || undefined} />
        ) : (
          <div className="demo-poster" role="button" tabIndex={0} aria-label={`Play ${v.title || "demo session"}`}
            style={{ backgroundImage: `url(${v.poster || media.poster || "/media/bg-ambient-1.jpg"})` }}
            onClick={() => setPlaying(true)} onKeyDown={e => (e.key === "Enter" || e.key === " ") && setPlaying(true)}>
            <div className="demo-play"><PlayIcon /><h3>{v.title || "Watch the demo session"}</h3>
              {(v.description || v.duration) && <p>{v.description}{v.duration ? ` · ${v.duration}` : ""}</p>}</div>
          </div>
        )) : (
          <>
            <video src="/media/bg-ambient-2.mp4" poster="/media/bg-ambient-1.jpg" autoPlay muted loop playsInline aria-hidden="true" style={{ opacity: .6 }} />
            <div className="demo-empty"><div>
              <h3 className="v2-h2" style={{ fontSize: "clamp(32px,5vw,56px)", color: "#fff", marginBottom: 12 }}>Next live demo class</h3>
              <p style={{ maxWidth: "46ch", margin: "0 auto 22px", fontSize: 17 }}>Message us and we’ll invite you to the next live demo session.</p>
              <a className="v2-btn" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hi, I would like to join the next free demo class.")}`}>Request a demo on WhatsApp</a>
            </div></div>
          </>
        )}
      </div>
    </section>
  );
};
export default DemoSession;
