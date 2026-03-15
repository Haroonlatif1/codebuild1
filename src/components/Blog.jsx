import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase/SupabaseClient";

const CATEGORIES = ["All","News","University Visit","Social","Event","Achievement","Behind the Scenes"];
const CAT_COLORS = {
  "News":"#ffa500","University Visit":"#00d4ff","Social":"#22c55e",
  "Event":"#a855f7","Achievement":"#ffd700","Behind the Scenes":"#ff6b35",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Dosis:wght@400;500;600;700;800&display=swap');

.cb-blog {
  background: #07070f; min-height: 100vh;
  font-family: "Dosis", sans-serif;
  padding: 80px 24px 120px; position: relative;
}
.cb-blog::before {
  content:""; position:fixed; top:-200px; right:-200px;
  width:600px; height:600px; border-radius:50%;
  background:radial-gradient(circle,rgba(255,165,0,0.04),transparent 70%);
  pointer-events:none; z-index:0;
}
.cb-blog-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }

.cb-blog-header { text-align: center; margin-bottom: 56px; }
.cb-blog-eyebrow {
  font-size:10px; font-weight:800; letter-spacing:5px; text-transform:uppercase;
  color:#ffa500; margin-bottom:14px;
  display:flex; align-items:center; justify-content:center; gap:10px;
}
.cb-blog-eyebrow::before,.cb-blog-eyebrow::after { content:""; width:40px; height:1px; }
.cb-blog-eyebrow::before { background:linear-gradient(90deg,transparent,#ffa500); }
.cb-blog-eyebrow::after  { background:linear-gradient(90deg,#ffa500,transparent); }
.cb-blog-title {
  font-family:"Bebas Neue",sans-serif;
  font-size:clamp(52px,8vw,100px); line-height:0.88; letter-spacing:3px;
  background:linear-gradient(135deg,#fff 40%,rgba(255,165,0,0.6));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  margin-bottom:14px;
}
.cb-blog-sub {
  font-size:14px; font-weight:500; color:rgba(255,255,255,0.3);
  max-width:480px; margin:0 auto; line-height:1.65;
}

/* ── filter pills ── */
.cb-filters { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin-bottom:48px; }
.cb-filter {
  font-family:"Dosis",sans-serif; font-size:10px; font-weight:800;
  letter-spacing:1.5px; text-transform:uppercase;
  background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
  border-radius:20px; color:rgba(255,255,255,0.4); padding:7px 18px;
  cursor:pointer; transition:all .22s;
}
.cb-filter:hover { border-color:rgba(255,165,0,0.25); color:rgba(255,255,255,0.75); }
.cb-filter.active { background:rgba(255,165,0,0.1); border-color:rgba(255,165,0,0.3); color:#ffa500; }

/* ── masonry grid ── */
.cb-grid { columns:3; column-gap:20px; }
.cb-grid-item { break-inside:avoid; margin-bottom:20px; animation:cb-fade-up 0.5s ease both; }

/* ── post card — compact ── */
.cb-post {
  background:#0d0d1a; border:1px solid rgba(255,255,255,0.06);
  border-radius:16px; overflow:hidden;
  transition:transform .3s ease, border-color .3s ease, box-shadow .3s ease;
  cursor:pointer;
}
.cb-post:hover {
  transform:translateY(-5px);
  border-color:rgba(255,165,0,0.25);
  box-shadow:0 20px 60px rgba(0,0,0,0.6);
}
.cb-post.featured { border-color:rgba(255,165,0,0.15); }

/* card image — always square-ish, single cover */
.cb-card-cover {
  position:relative; width:100%; height:200px; overflow:hidden;
}
.cb-card-cover img {
  width:100%; height:100%; object-fit:cover; display:block;
  transition:transform .5s ease;
}
.cb-post:hover .cb-card-cover img { transform:scale(1.05); }
.cb-card-cover-overlay {
  position:absolute; inset:0;
  background:linear-gradient(to top,rgba(7,7,15,0.7) 0%,transparent 60%);
}
.cb-img-count-badge {
  position:absolute; bottom:10px; right:10px;
  background:rgba(0,0,0,0.7); backdrop-filter:blur(6px);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:5px; padding:3px 9px;
  font-size:9px; font-weight:800; letter-spacing:1px; color:rgba(255,255,255,0.7);
  display:flex; align-items:center; gap:4px;
}
.cb-featured-badge {
  position:absolute; top:10px; right:10px;
  background:rgba(255,165,0,0.9); color:#07070f;
  font-size:7px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase;
  padding:3px 9px; border-radius:3px;
}

/* card body */
.cb-post-body { padding:14px 16px 16px; }
.cb-post-meta { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.cb-cat-badge { font-size:8px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; padding:3px 9px; border-radius:3px; color:#07070f; }
.cb-post-date { font-size:10px; font-weight:600; color:rgba(255,255,255,0.2); }
.cb-post-title { font-size:14px; font-weight:800; color:rgba(255,255,255,0.92); line-height:1.35; margin-bottom:7px; }
.cb-post-caption-short {
  font-size:12px; font-weight:500; color:rgba(255,255,255,0.38);
  line-height:1.6;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
  margin-bottom:10px;
}
.cb-post-tags { display:flex; gap:5px; flex-wrap:wrap; }
.cb-tag {
  font-size:9px; font-weight:700;
  background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.07);
  color:rgba(255,255,255,0.3); padding:2px 8px; border-radius:3px;
}
.cb-read-more {
  font-size:9.5px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase;
  color:rgba(255,165,0,0.5); margin-top:10px; display:inline-flex; align-items:center; gap:4px;
  transition:color .2s;
}
.cb-post:hover .cb-read-more { color:#ffa500; }

/* ═══════════════════════════════════════════
   POST DETAIL MODAL
═══════════════════════════════════════════ */
.cb-modal-overlay {
  position:fixed; inset:0;
  background:rgba(0,0,0,0.88);
  backdrop-filter:blur(14px);
  z-index:9990;
  display:flex; align-items:center; justify-content:center;
  padding:20px;
  animation:cb-fade .22s ease;
  overflow-y:auto;
}
.cb-modal {
  background:#0d0d1a;
  border:1px solid rgba(255,255,255,0.08);
  border-radius:20px;
  width:100%; max-width:780px;
  position:relative;
  animation:cb-modal-in .32s cubic-bezier(0.22,1,0.36,1);
  overflow:hidden;
  margin:auto;
}
.cb-modal-close {
  position:absolute; top:14px; right:14px;
  width:36px; height:36px; border-radius:50%;
  background:rgba(0,0,0,0.7);
  border:1px solid rgba(255,255,255,0.12);
  color:rgba(255,255,255,0.65); font-size:16px;
  cursor:pointer; display:flex; align-items:center; justify-content:center;
  z-index:2; transition:background .2s; font-family:sans-serif; line-height:1;
}
.cb-modal-close:hover { background:rgba(220,40,40,0.6); color:#fff; }

/* modal image gallery */
.cb-modal-gallery { width:100%; }
.cb-modal-main-img {
  width:100%; height:420px; object-fit:cover; display:block;
  cursor:zoom-in;
}
.cb-modal-thumbs {
  display:flex; gap:3px; padding:3px; background:#050510;
}
.cb-modal-thumb {
  flex:1; height:70px; object-fit:cover;
  cursor:pointer; opacity:0.55; transition:opacity .2s;
  border-radius:3px;
}
.cb-modal-thumb:hover,.cb-modal-thumb.active { opacity:1; }
.cb-modal-thumb.active { outline:2px solid #ffa500; }

/* modal body */
.cb-modal-body { padding:24px 28px 28px; }
.cb-modal-meta { display:flex; align-items:center; gap:10px; margin-bottom:12px; flex-wrap:wrap; }
.cb-modal-date { font-size:11px; font-weight:600; color:rgba(255,255,255,0.25); }
.cb-modal-title {
  font-family:"Bebas Neue",sans-serif;
  font-size:clamp(24px,4vw,36px); letter-spacing:1.5px; color:#fff;
  line-height:1; margin-bottom:14px;
}
.cb-modal-caption {
  font-size:13.5px; font-weight:500; color:rgba(255,255,255,0.6);
  line-height:1.75; margin-bottom:18px; white-space:pre-wrap;
}
.cb-modal-tags { display:flex; gap:6px; flex-wrap:wrap; }
.cb-modal-tag {
  font-size:10px; font-weight:700;
  background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
  color:rgba(255,255,255,0.35); padding:3px 10px; border-radius:4px;
}

/* ── Full lightbox (inside modal zoom) ── */
.cb-lightbox {
  position:fixed; inset:0;
  background:rgba(0,0,0,0.97);
  z-index:9999;
  display:flex; align-items:center; justify-content:center;
  padding:20px; animation:cb-fade .2s ease;
}
.cb-lightbox-img {
  max-width:92vw; max-height:88vh; object-fit:contain;
  border-radius:6px; animation:cb-zoom .22s cubic-bezier(0.22,1,0.36,1);
}
.cb-lightbox-close {
  position:absolute; top:16px; right:16px;
  width:40px; height:40px; border-radius:50%;
  background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.15);
  color:rgba(255,255,255,0.7); font-size:18px; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  transition:background .2s; font-family:sans-serif; line-height:1;
}
.cb-lightbox-close:hover { background:rgba(220,40,40,0.5); color:#fff; }
.cb-lightbox-nav {
  position:absolute; top:50%; transform:translateY(-50%);
  width:46px; height:46px; border-radius:50%;
  background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12);
  color:rgba(255,255,255,0.7); font-size:22px; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  transition:background .2s; font-family:sans-serif; line-height:1;
}
.cb-lightbox-nav:hover { background:rgba(255,165,0,0.2); color:#ffa500; }
.cb-lightbox-prev { left:16px; }
.cb-lightbox-next { right:16px; }
.cb-lightbox-counter {
  position:absolute; bottom:18px; left:50%; transform:translateX(-50%);
  font-family:"Dosis",sans-serif; font-size:12px; font-weight:700;
  color:rgba(255,255,255,0.4); letter-spacing:1px;
}

/* ── loading / empty ── */
.cb-loading { display:flex; align-items:center; justify-content:center; gap:8px; padding:100px 24px; }
.cb-loading span { width:9px;height:9px;border-radius:50%;background:#ffa500;animation:cb-bounce 1.2s ease-in-out infinite; }
.cb-loading span:nth-child(2){animation-delay:.2s;} .cb-loading span:nth-child(3){animation-delay:.4s;}
.cb-empty { text-align:center; padding:80px 24px; color:rgba(255,255,255,0.2); font-size:13px; }
.cb-empty-icon { font-size:40px; margin-bottom:12px; }

@keyframes cb-fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes cb-fade    { from{opacity:0} to{opacity:1} }
@keyframes cb-zoom    { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
@keyframes cb-modal-in{ from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
@keyframes cb-bounce  { 0%,80%,100%{transform:scale(.4);opacity:.3} 40%{transform:scale(1);opacity:1} }

@media(max-width:900px){ .cb-grid{ columns:2; } }
@media(max-width:540px){
  .cb-grid{ columns:1; }
  .cb-modal-main-img{ height:260px; }
  .cb-modal-body{ padding:16px 18px 20px; }
  .cb-lightbox-nav{ display:none; }
}
`;

/* ── Full Lightbox (zoom inside modal) ── */
const Lightbox = ({ images, startIdx, onClose }) => {
  const [idx, setIdx] = useState(startIdx);
  const prev = () => setIdx(i=>(i-1+images.length)%images.length);
  const next = () => setIdx(i=>(i+1)%images.length);
  useEffect(()=>{
    const fn=(e)=>{if(e.key==="Escape")onClose();if(e.key==="ArrowLeft")prev();if(e.key==="ArrowRight")next();};
    window.addEventListener("keydown",fn);
    return()=>window.removeEventListener("keydown",fn);
  },[onClose]);
  return (
    <div className="cb-lightbox" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <img className="cb-lightbox-img" src={images[idx]} alt="" key={idx}/>
      <button className="cb-lightbox-close" onClick={onClose}>✕</button>
      {images.length>1&&<>
        <button className="cb-lightbox-nav cb-lightbox-prev" onClick={prev}>‹</button>
        <button className="cb-lightbox-nav cb-lightbox-next" onClick={next}>›</button>
        <div className="cb-lightbox-counter">{idx+1} / {images.length}</div>
      </>}
    </div>
  );
};

/* ── Post Detail Modal ── */
const PostModal = ({ post, onClose }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox,  setLightbox]  = useState(null);
  const catColor = CAT_COLORS[post.category] || "#ffa500";
  const date = new Date(post.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
  const images = post.images?.filter(Boolean) || [];

  useEffect(()=>{
    const fn=(e)=>{if(e.key==="Escape")onClose();};
    window.addEventListener("keydown",fn);
    document.body.style.overflow="hidden";
    return()=>{window.removeEventListener("keydown",fn);document.body.style.overflow="";};
  },[onClose]);

  return (
    <>
      <div className="cb-modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
        <div className="cb-modal">
          <button className="cb-modal-close" onClick={onClose}>✕</button>

          {/* Image gallery */}
          {images.length > 0 && (
            <div className="cb-modal-gallery">
              <img
                className="cb-modal-main-img"
                src={images[activeImg]}
                alt=""
                onClick={()=>setLightbox(activeImg)}
                title="Click to zoom"
              />
              {images.length > 1 && (
                <div className="cb-modal-thumbs">
                  {images.map((img,i)=>(
                    <img
                      key={i}
                      className={`cb-modal-thumb${activeImg===i?" active":""}`}
                      src={img} alt=""
                      onClick={()=>setActiveImg(i)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="cb-modal-body">
            <div className="cb-modal-meta">
              <span className="cb-cat-badge" style={{background:catColor}}>{post.category}</span>
              <span className="cb-modal-date">{date}</span>
              {post.is_featured && (
                <span style={{fontSize:8,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",
                  background:"rgba(255,165,0,0.12)",border:"1px solid rgba(255,165,0,0.25)",
                  color:"#ffa500",padding:"3px 9px",borderRadius:3}}>⭐ Featured</span>
              )}
            </div>
            <div className="cb-modal-title">{post.title}</div>
            {post.caption && <div className="cb-modal-caption">{post.caption}</div>}
            {post.tags?.length > 0 && (
              <div className="cb-modal-tags">
                {post.tags.map((t,i)=><span key={i} className="cb-modal-tag">#{t}</span>)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zoom lightbox on top of modal */}
      {lightbox !== null && (
        <Lightbox images={images} startIdx={lightbox} onClose={()=>setLightbox(null)}/>
      )}
    </>
  );
};

/* ── Post Card (compact — click to open modal) ── */
const PostCard = ({ post, onClick }) => {
  const catColor = CAT_COLORS[post.category] || "#ffa500";
  const date = new Date(post.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
  const images = post.images?.filter(Boolean) || [];

  return (
    <div className={`cb-post${post.is_featured?" featured":""}`} onClick={onClick}>
      {/* Single cover image */}
      {images.length > 0 && (
        <div className="cb-card-cover">
          <img src={images[0]} alt="" loading="lazy"/>
          <div className="cb-card-cover-overlay"/>
          {images.length > 1 && (
            <div className="cb-img-count-badge">
              <span>🖼</span> {images.length}
            </div>
          )}
          {post.is_featured && <div className="cb-featured-badge">Featured</div>}
        </div>
      )}

      <div className="cb-post-body">
        <div className="cb-post-meta">
          <span className="cb-cat-badge" style={{background:catColor}}>{post.category}</span>
          <span className="cb-post-date">{date}</span>
        </div>
        <div className="cb-post-title">{post.title}</div>
        {post.caption && <div className="cb-post-caption-short">{post.caption}</div>}
        {post.tags?.length > 0 && (
          <div className="cb-post-tags">
            {post.tags.slice(0,3).map((t,i)=><span key={i} className="cb-tag">#{t}</span>)}
            {post.tags.length > 3 && <span className="cb-tag">+{post.tags.length-3}</span>}
          </div>
        )}
        <div className="cb-read-more">Read more →</div>
      </div>
    </div>
  );
};

/* ═══ MAIN ══════════════════════════════════════════════════════════ */
const Blog = () => {
  const [posts,    setPosts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("All");
  const [selected, setSelected] = useState(null); // post open in modal

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("posts").select("*")
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .order("created_at",  { ascending: false });
    setPosts(data || []);
    setLoading(false);
  }, []);

  useEffect(()=>{ fetchPosts(); },[fetchPosts]);

  const filtered = filter === "All" ? posts : posts.filter(p=>p.category===filter);

  return (
    <>
      <style>{css}</style>
      <div className="cb-blog">
        <div className="cb-blog-inner">

          <div className="cb-blog-header">
            <div className="cb-blog-eyebrow">CodeBuild Academy</div>
            <h1 className="cb-blog-title">Our<br/>Story</h1>
            <p className="cb-blog-sub">
              Campus visits, student achievements, behind-the-scenes moments
              and everything in between. This is CodeBuild — unfiltered.
            </p>
          </div>

          <div className="cb-filters">
            {CATEGORIES.map(cat=>(
              <button
                key={cat}
                className={`cb-filter${filter===cat?" active":""}`}
                onClick={()=>setFilter(cat)}
              >{cat}</button>
            ))}
          </div>

          {loading ? (
            <div className="cb-loading"><span/><span/><span/></div>
          ) : filtered.length === 0 ? (
            <div className="cb-empty">
              <div className="cb-empty-icon">📭</div>
              No posts in this category yet.
            </div>
          ) : (
            <div className="cb-grid">
              {filtered.map((post,i)=>(
                <div key={post.id} className="cb-grid-item" style={{animationDelay:`${i*0.05}s`}}>
                  <PostCard post={post} onClick={()=>setSelected(post)}/>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post detail modal */}
      {selected && <PostModal post={selected} onClose={()=>setSelected(null)}/>}
    </>
  );
};

export default Blog;