import React, { useEffect, useState } from "react";

/** true once the element has been at least `ratio` visible (stays true afterwards) */
export const useSeenOnce = (ref, ratio = 0.55, margin = "0px") => {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el || seen) return;
    if (!("IntersectionObserver" in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: ratio, rootMargin: margin });
    io.observe(el); return () => io.disconnect();
  }, [ref, seen, ratio, margin]);
  return seen;
};

/** Browsers only allow autoplay when muted, so add mute=1 to YouTube embeds */
export const autoSrc = (src) => (src.includes("youtube") ? `${src}${src.includes("?") ? "&" : "?"}mute=1&playsinline=1` : src);

export const SoundHint = () => {
  const [on, setOn] = useState(true);
  useEffect(() => { const t = setTimeout(() => setOn(false), 5000); return () => clearTimeout(t); }, []);
  return on ? <div className="da-hint" aria-hidden="true">Playing without sound · use the player to unmute</div> : null;
};

const ytId = (u = "") => (u.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/) || [])[1];
/** YouTube / Facebook link or direct video file → how to embed it */
export const embedOf = (url) => {
  const id = ytId(url);
  if (id) return { kind: "iframe", yt: true, thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, src: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&mute=1&enablejsapi=1` };
  if (/facebook\.com|fb\.watch/.test(url)) return { kind: "iframe", src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=true&mute=1` };
  return { kind: "video", src: url };
};

/** Smooth-scrolls so the demo video sits in the middle of the screen; re-checks once in case the layout shifted. */
export const scrollToDemo = () => {
  const aim = () => { const el = document.querySelector("#kids-demo .kd-stage") || document.getElementById("kids-demo"); if (!el) return null; const r = el.getBoundingClientRect(); return Math.max(0, r.top + window.scrollY - Math.max(84, (window.innerHeight - r.height) / 2)); };
  const t = aim(); if (t == null) return; window.scrollTo({ top: t, behavior: "smooth" });
  setTimeout(() => { const t2 = aim(); if (t2 != null && Math.abs(t2 - window.scrollY) > 40) window.scrollTo({ top: t2, behavior: "smooth" }); }, 900);
};

/** Centered "Do you want to see a demo class?" modal, shown once per visit a few seconds after the page opens. */
// Shown only on a visitor's first visit (remembered in this browser).
const KEY = "cb_demo_modal_seen";
const seenBefore = () => { try { return localStorage.getItem(KEY) === "1"; } catch (_) { return false; } };
const markSeen = () => { try { localStorage.setItem(KEY, "1"); } catch (_) {} };
let dismissed = false;
export const DemoPopup = ({ delay = 5000 }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (dismissed || seenBefore()) return;
    const t = setTimeout(() => {
      const el = document.getElementById("kids-demo");
      if (el) { const r = el.getBoundingClientRect(); if (r.top < window.innerHeight * 0.3 && r.bottom > window.innerHeight * 0.7) return; }
      markSeen(); setShow(true);
    }, delay);
    return () => clearTimeout(t);
  }, [delay]);
  const close = () => { dismissed = true; setShow(false); };
  useEffect(() => {
    if (!show) return; const k = (e) => e.key === "Escape" && close(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [show]);
  const go = () => { close(); scrollToDemo(); };
  if (!show) return null;
  return (
    <div className="da-back" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="da-modal" role="dialog" aria-modal="true" aria-labelledby="da-t">
        <button className="da-mx" onClick={close} aria-label="Close">×</button>
        <div className="da-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div>
        <h2 id="da-t">Do you want to see a demo class of 7 days Ai course for kids?</h2>
        <p>Watch a real class before you decide. It takes a minute and costs nothing.</p>
        <div className="da-act">
          <button className="v2-btn" autoFocus onClick={go}>Yes, show me</button>
          <button className="v2-btn ghost" onClick={close}>Maybe later</button>
        </div>
      </div>
    </div>
  );
};