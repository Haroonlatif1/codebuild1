import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase/SupabaseClient";

/* ═══════════════════════════════════════════════════════════════════
   VIDEO REVIEWS — CodeBuild Academy
   ✦ Horizontal scrolling row of student review cards
   ✦ Click play → modal with embedded video
   ✦ Star ratings + short quote on each card
   ✦ Live data from Supabase video_reviews table
════════════════════════════════════════════════════════════════════ */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Dosis:wght@400;500;600;700;800&display=swap');

.vr-section {
  background: #07070f;
  padding: 90px 0 100px;
  overflow: hidden;
  position: relative;
  font-family: "Dosis", sans-serif;
}

/* ambient glow */
.vr-section::before {
  content:""; position:absolute;
  bottom:-200px; left:50%; transform:translateX(-50%);
  width:800px; height:400px; border-radius:50%;
  background:radial-gradient(ellipse,rgba(255,165,0,0.05),transparent 70%);
  pointer-events:none;
}

/* ── header ── */
.vr-header {
  text-align:center; padding:0 24px; margin-bottom:52px;
}
.vr-eyebrow {
  font-size:10px; font-weight:800; letter-spacing:5px; text-transform:uppercase;
  color:#ffa500; margin-bottom:12px;
  display:flex; align-items:center; justify-content:center; gap:10px;
}
.vr-eyebrow::before,.vr-eyebrow::after { content:""; width:40px; height:1px; }
.vr-eyebrow::before { background:linear-gradient(90deg,transparent,#ffa500); }
.vr-eyebrow::after  { background:linear-gradient(90deg,#ffa500,transparent); }
.vr-title {
  font-family:"Bebas Neue",sans-serif;
  font-size:clamp(48px,7vw,88px); line-height:0.88; letter-spacing:3px;
  background:linear-gradient(135deg,#fff 40%,rgba(255,165,0,0.6));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  margin-bottom:12px;
}
.vr-sub {
  font-size:14px; font-weight:500; color:rgba(255,255,255,0.3);
  max-width:440px; margin:0 auto; line-height:1.65;
}

/* ── scrolling track ── */
.vr-track-wrap {
  position:relative;
  padding:20px 0 30px;
}
/* fade edges */
.vr-track-wrap::before,
.vr-track-wrap::after {
  content:""; position:absolute; top:0; bottom:0; width:80px; z-index:2; pointer-events:none;
}
.vr-track-wrap::before { left:0;  background:linear-gradient(90deg,#07070f,transparent); }
.vr-track-wrap::after  { right:0; background:linear-gradient(270deg,#07070f,transparent); }

.vr-track {
  display:flex; gap:20px;
  padding:10px 60px;
  overflow-x:auto; scroll-snap-type:x mandatory; scroll-behavior:smooth;
  -webkit-overflow-scrolling:touch;
  scrollbar-width:none;
}
.vr-track::-webkit-scrollbar { display:none; }

/* ── review card ── */
.vr-card {
  flex-shrink:0; width:240px;
  background:#0d0d1a;
  border:1px solid rgba(255,255,255,0.07);
  border-radius:16px; overflow:hidden;
  cursor:pointer; scroll-snap-align:start;
  transition:transform .3s ease, border-color .3s ease, box-shadow .3s ease;
  position:relative;
}
.vr-card:hover {
  transform:translateY(-6px);
  border-color:rgba(255,165,0,0.28);
  box-shadow:0 24px 60px rgba(0,0,0,0.7);
}

/* thumbnail */
.vr-thumb {
  position:relative; width:100%; height:160px; overflow:hidden;
}
.vr-thumb img {
  width:100%; height:100%; object-fit:cover; display:block;
  transition:transform .5s ease; filter:brightness(0.7);
}
.vr-card:hover .vr-thumb img { transform:scale(1.06); filter:brightness(0.85); }
.vr-thumb-overlay {
  position:absolute; inset:0;
  background:linear-gradient(to top,rgba(7,7,15,0.75),transparent 50%);
}

/* play button */
.vr-play {
  position:absolute; inset:0;
  display:flex; align-items:center; justify-content:center; z-index:2;
}
.vr-play-btn {
  width:50px; height:50px; border-radius:50%;
  background:rgba(255,165,0,0.9);
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 0 0 6px rgba(255,165,0,0.2);
  transform:scale(0.88); transition:transform .25s, box-shadow .25s;
}
.vr-card:hover .vr-play-btn {
  transform:scale(1);
  box-shadow:0 0 0 10px rgba(255,165,0,0.15);
}
.vr-play-btn svg { width:18px; height:18px; fill:#07070f; margin-left:3px; }

/* stars on thumb */
.vr-stars-overlay {
  position:absolute; bottom:10px; left:12px; z-index:3;
  display:flex; gap:2px;
}
.vr-star { font-size:11px; }

/* card body */
.vr-card-body { padding:13px 14px 15px; }
.vr-card-course {
  font-size:8px; font-weight:800; letter-spacing:2px; text-transform:uppercase;
  color:#ffa500; margin-bottom:5px;
}
.vr-card-name {
  font-size:13px; font-weight:800; color:rgba(255,255,255,0.9);
  margin-bottom:6px;
}
.vr-card-quote {
  font-size:11.5px; font-weight:500; color:rgba(255,255,255,0.4);
  line-height:1.5; font-style:italic;
}
.vr-card-quote::before { content:'"'; color:rgba(255,165,0,0.4); }
.vr-card-quote::after  { content:'"'; color:rgba(255,165,0,0.4); }

/* ── scroll buttons ── */
.vr-nav {
  display:flex; justify-content:center; gap:10px; margin-top:8px; padding:0 24px;
}
.vr-nav-btn {
  width:40px; height:40px; border-radius:50%;
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.08);
  color:rgba(255,255,255,0.45); font-size:18px;
  cursor:pointer; display:flex; align-items:center; justify-content:center;
  transition:all .2s; font-family:sans-serif; line-height:1;
}
.vr-nav-btn:hover { background:rgba(255,165,0,0.1); border-color:rgba(255,165,0,0.3); color:#ffa500; }

/* ── VIDEO MODAL ── */
.vr-modal-overlay {
  position:fixed; inset:0;
  background:rgba(0,0,0,0.92); backdrop-filter:blur(14px);
  z-index:9999;
  display:flex; align-items:center; justify-content:center;
  padding:20px; animation:vr-fade .22s ease;
}
.vr-modal {
  background:#0a0a15;
  border:1px solid rgba(255,165,0,0.15);
  border-radius:18px; width:100%; max-width:860px;
  overflow:hidden;
  box-shadow:0 40px 100px rgba(0,0,0,0.95);
  animation:vr-modal-in .32s cubic-bezier(0.22,1,0.36,1);
}
.vr-modal-video {
  position:relative; width:100%; aspect-ratio:16/9; background:#000;
}
.vr-modal-video iframe,
.vr-modal-video video { width:100%; height:100%; border:none; display:block; }
.vr-modal-close {
  position:absolute; top:12px; right:12px;
  width:36px; height:36px; border-radius:50%;
  background:rgba(0,0,0,0.75); border:1px solid rgba(255,255,255,0.12);
  color:rgba(255,255,255,0.65); font-size:16px; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  z-index:2; transition:background .2s; font-family:sans-serif; line-height:1;
}
.vr-modal-close:hover { background:rgba(220,40,40,0.6); color:#fff; }
.vr-modal-info {
  padding:16px 22px 20px;
  display:flex; align-items:flex-start; gap:14px;
  border-top:1px solid rgba(255,255,255,0.04);
}
.vr-modal-avatar {
  width:44px; height:44px; border-radius:50%; flex-shrink:0;
  background:linear-gradient(135deg,#ffa500,rgba(255,165,0,0.3));
  display:flex; align-items:center; justify-content:center;
  font-size:16px; font-weight:800; color:#07070f;
}
.vr-modal-course {
  font-size:9px; font-weight:800; letter-spacing:2px; text-transform:uppercase;
  color:#ffa500; margin-bottom:3px;
}
.vr-modal-name { font-size:16px; font-weight:800; color:rgba(255,255,255,0.9); margin-bottom:4px; }
.vr-modal-stars { display:flex; gap:3px; }
.vr-modal-quote {
  font-size:12.5px; font-weight:500; color:rgba(255,255,255,0.4);
  line-height:1.6; margin-top:6px; font-style:italic;
}

/* loading */
.vr-loading { display:flex; align-items:center; justify-content:center; gap:8px; padding:60px 24px; }
.vr-loading span { width:9px;height:9px;border-radius:50%;background:#ffa500;animation:vr-bounce 1.2s ease-in-out infinite; }
.vr-loading span:nth-child(2){animation-delay:.2s;} .vr-loading span:nth-child(3){animation-delay:.4s;}

@keyframes vr-fade    { from{opacity:0} to{opacity:1} }
@keyframes vr-modal-in{ from{opacity:0;transform:scale(0.95) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
@keyframes vr-bounce  { 0%,80%,100%{transform:scale(.4);opacity:.3} 40%{transform:scale(1);opacity:1} }

@media(max-width:600px){
  .vr-track{ padding:10px 20px; gap:14px; }
  .vr-card{ width:200px; }
  .vr-thumb{ height:130px; }
  .vr-modal{ border-radius:12px; }
}
`;

/* ── helpers ── */
const Stars = ({ rating, size = 12 }) => (
  <div style={{ display:"flex", gap:2 }}>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ fontSize:size, color: i<=rating ? "#ffa500" : "rgba(255,255,255,0.12)" }}>★</span>
    ))}
  </div>
);

const getYTThumb = (url) => {
  const m = url.match(/embed\/([a-zA-Z0-9_-]+)/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
};

/* ── Video Modal ── */
const VideoModal = ({ review, onClose }) => {
  const isYT = review.video_url?.includes("youtube.com");
  const src  = isYT
    ? `${review.video_url}?autoplay=1&rel=0&modestbranding=1`
    : review.video_url;
  const initials = review.student_name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);

  useEffect(() => {
    const fn = (e) => { if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown",fn); document.body.style.overflow=""; };
  }, [onClose]);

  return (
    <div className="vr-modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="vr-modal">
        <div className="vr-modal-video">
          {isYT
            ? <iframe src={src} title={review.student_name} allow="autoplay;encrypted-media;fullscreen" allowFullScreen/>
            : <video src={src} controls autoPlay style={{width:"100%",height:"100%"}}/>
          }
          <button className="vr-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="vr-modal-info">
          <div className="vr-modal-avatar">{initials}</div>
          <div>
            <div className="vr-modal-course">{review.course}</div>
            <div className="vr-modal-name">{review.student_name}</div>
            <div className="vr-modal-stars"><Stars rating={review.rating} size={13}/></div>
            {review.short_quote && <div className="vr-modal-quote">"{review.short_quote}"</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══ MAIN COMPONENT ════════════════════════════════════════════════ */
const VideoReviews = () => {
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [playing,  setPlaying]  = useState(null);
  const trackRef = React.useRef(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("video_reviews").select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      setReviews(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const scroll = (dir) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
    }
  };

  if (!loading && reviews.length === 0) return null; // hide section if no reviews

  return (
    <>
      <style>{css}</style>
      <section className="vr-section">

        <div className="vr-header">
          <div className="vr-eyebrow">Student Stories</div>
          <h2 className="vr-title">Real Reviews<br/>Real Results</h2>
          <p className="vr-sub">
            Don't take our word for it. Hear directly from students
            who changed their careers with CodeBuild.
          </p>
        </div>

        {loading ? (
          <div className="vr-loading"><span/><span/><span/></div>
        ) : (
          <>
            <div className="vr-track-wrap">
              <div className="vr-track" ref={trackRef}>
                {reviews.map(review => {
                  const thumb = review.thumb_url || getYTThumb(review.video_url) || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80";
                  return (
                    <div key={review.id} className="vr-card" onClick={() => setPlaying(review)}>
                      <div className="vr-thumb">
                        <img src={thumb} alt={review.student_name} loading="lazy"/>
                        <div className="vr-thumb-overlay"/>
                        <div className="vr-play">
                          <div className="vr-play-btn">
                            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        </div>
                        <div className="vr-stars-overlay">
                          <Stars rating={review.rating} size={11}/>
                        </div>
                      </div>
                      <div className="vr-card-body">
                        <div className="vr-card-course">{review.course}</div>
                        <div className="vr-card-name">{review.student_name}</div>
                        {review.short_quote && (
                          <div className="vr-card-quote">{review.short_quote}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="vr-nav">
              <button className="vr-nav-btn" onClick={() => scroll(-1)}>‹</button>
              <button className="vr-nav-btn" onClick={() => scroll(1)}>›</button>
            </div>
          </>
        )}
      </section>

      {playing && <VideoModal review={playing} onClose={() => setPlaying(null)}/>}
    </>
  );
};

export default VideoReviews;