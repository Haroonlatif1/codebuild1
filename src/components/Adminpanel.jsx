import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "./context/AuthContext";
import { supabase } from "./supabase/SupabaseClient";

/* ═══════════════════════════════════════════════════════════════════
   CODEBUILD ACADEMY — ADMIN PANEL
   ✦ Supabase auth (email + password)
   ✦ Full CRUD: add / edit / delete lectures
   ✦ Drag-and-drop reorder
   ✦ Toggle publish/unpublish
   ✦ Dark theme matching site design
   Route: /cbdadmin  (add to App.jsx)
════════════════════════════════════════════════════════════════════ */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Dosis:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .adm-wrap {
    min-height: 100vh;
    background: #07070f;
    font-family: "Dosis", sans-serif;
    color: rgba(255,255,255,0.85);
  }

  /* ── LOGIN ── */
  .adm-login {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #07070f;
    padding: 24px;
  }
  .adm-login-box {
    width: 100%;
    max-width: 400px;
    background: #0e0e18;
    border: 1px solid rgba(255,165,0,0.15);
    border-radius: 16px;
    padding: 40px;
  }
  .adm-login-logo {
    font-family: "Bebas Neue", sans-serif;
    font-size: 28px;
    letter-spacing: 3px;
    color: #ffa500;
    margin-bottom: 8px;
  }
  .adm-login-sub {
    font-size: 12px;
    color: rgba(255,255,255,0.3);
    letter-spacing: 1px;
    margin-bottom: 32px;
  }

  /* ── TOPBAR ── */
  .adm-top {
    background: #0a0a14;
    border-bottom: 1px solid rgba(255,165,0,0.1);
    padding: 0 32px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .adm-top-logo {
    font-family: "Bebas Neue", sans-serif;
    font-size: 22px;
    letter-spacing: 3px;
    color: #ffa500;
  }
  .adm-top-right {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 12px;
    color: rgba(255,255,255,0.35);
  }

  /* ── BODY ── */
  .adm-body {
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* ── PAGE TITLE ── */
  .adm-page-title {
    font-family: "Bebas Neue", sans-serif;
    font-size: 38px;
    letter-spacing: 2px;
    color: #fff;
    margin-bottom: 4px;
  }
  .adm-page-sub {
    font-size: 12px;
    color: rgba(255,255,255,0.3);
    margin-bottom: 28px;
  }

  /* ── ACTION BAR ── */
  .adm-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .adm-stat {
    background: rgba(255,165,0,0.06);
    border: 1px solid rgba(255,165,0,0.12);
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 11px;
    font-weight: 700;
    color: rgba(255,165,0,0.7);
    letter-spacing: 1px;
  }

  /* ── TABLE ── */
  .adm-table-wrap {
    background: #0d0d18;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    overflow: hidden;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th {
    padding: 13px 16px;
    text-align: left;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    background: rgba(255,255,255,0.02);
  }
  td {
    padding: 14px 16px;
    font-size: 12.5px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    vertical-align: middle;
  }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.02); }

  .adm-row-dragging { opacity: 0.4; }
  .adm-row-over td { background: rgba(255,165,0,0.04) !important; }

  .adm-thumb-cell img {
    width: 64px;
    height: 40px;
    object-fit: cover;
    border-radius: 6px;
    display: block;
  }
  .adm-thumb-placeholder {
    width: 64px; height: 40px;
    background: rgba(255,255,255,0.05);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  .adm-tag {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 3px;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #07070f;
  }
  .adm-published {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 700;
  }
  .adm-pub-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .adm-drag-handle {
    cursor: grab;
    color: rgba(255,255,255,0.15);
    font-size: 16px;
    padding: 0 4px;
    user-select: none;
  }
  .adm-drag-handle:active { cursor: grabbing; }

  /* ── ROW ACTIONS ── */
  .adm-row-btns {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .adm-btn-icon {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 6px;
    color: rgba(255,255,255,0.5);
    font-size: 13px;
    padding: 6px 9px;
    cursor: pointer;
    transition: all .2s;
    font-family: sans-serif;
    line-height: 1;
  }
  .adm-btn-icon:hover { background: rgba(255,165,0,0.08); border-color: rgba(255,165,0,0.2); color: #ffa500; }
  .adm-btn-icon.del:hover { background: rgba(255,50,50,0.08); border-color: rgba(255,50,50,0.2); color: #ff4444; }

  /* ── MODAL ── */
  .adm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(4px);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .adm-modal {
    background: #0e0e18;
    border: 1px solid rgba(255,165,0,0.15);
    border-radius: 16px;
    width: 100%;
    max-width: 680px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 32px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,165,0,0.2) transparent;
  }
  .adm-modal-title {
    font-family: "Bebas Neue", sans-serif;
    font-size: 28px;
    letter-spacing: 2px;
    color: #fff;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* ── FORM ── */
  .adm-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .adm-form-full { grid-column: 1 / -1; }
  .adm-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .adm-label {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
  }
  .adm-input, .adm-textarea, .adm-select {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: rgba(255,255,255,0.85);
    font-family: "Dosis", sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 10px 13px;
    transition: border-color .2s;
    outline: none;
    width: 100%;
  }
  .adm-input:focus, .adm-textarea:focus, .adm-select:focus {
    border-color: rgba(255,165,0,0.4);
  }
  .adm-textarea { resize: vertical; min-height: 80px; }
  .adm-select option { background: #0e0e18; }

  .adm-color-row {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }
  .adm-color-swatch {
    width: 28px; height: 28px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: transform .2s;
  }
  .adm-color-swatch:hover { transform: scale(1.15); }
  .adm-color-swatch.selected { border-color: white; transform: scale(1.15); }

  .adm-toggle-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255,255,255,0.5);
  }
  .adm-toggle {
    width: 40px; height: 22px;
    background: rgba(255,255,255,0.1);
    border-radius: 11px;
    position: relative;
    cursor: pointer;
    transition: background .3s;
    border: none;
    flex-shrink: 0;
  }
  .adm-toggle.on { background: #ffa500; }
  .adm-toggle::after {
    content: "";
    position: absolute;
    top: 3px; left: 3px;
    width: 16px; height: 16px;
    border-radius: 50%;
    background: white;
    transition: transform .3s;
  }
  .adm-toggle.on::after { transform: translateX(18px); }

  /* ── BUTTONS ── */
  .adm-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-family: "Dosis", sans-serif;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    border-radius: 8px;
    padding: 10px 20px;
    cursor: pointer;
    transition: all .2s;
    border: none;
  }
  .adm-btn-primary { background: #ffa500; color: #07070f; }
  .adm-btn-primary:hover { background: #ffb733; }
  .adm-btn-primary:disabled { opacity: .5; cursor: not-allowed; }
  .adm-btn-ghost {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.5);
  }
  .adm-btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,.8); }
  .adm-btn-danger { background: rgba(255,50,50,0.1); border: 1px solid rgba(255,50,50,0.2); color: #ff5555; }
  .adm-btn-danger:hover { background: rgba(255,50,50,0.2); }

  .adm-form-footer {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  /* ── TOAST ── */
  .adm-toast {
    position: fixed;
    top: 74px;
    right: 24px;
    background: #0e0e18;
    border: 1px solid rgba(255,165,0,0.25);
    border-radius: 8px;
    padding: 12px 20px;
    font-size: 12px;
    font-weight: 700;
    color: rgba(255,255,255,0.85);
    z-index: 300;
    animation: adm-slide-in 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .adm-toast.err { border-color: rgba(255,50,50,0.3); }

  /* ── EMPTY ── */
  .adm-empty {
    text-align: center;
    padding: 60px 24px;
    color: rgba(255,255,255,0.2);
    font-size: 13px;
  }
  .adm-empty-icon { font-size: 40px; margin-bottom: 12px; }

  /* ── LOADER ── */
  .adm-loader {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px;
    gap: 8px;
  }
  .adm-loader span {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #ffa500;
    animation: adm-bounce 1.2s ease-in-out infinite;
  }
  .adm-loader span:nth-child(2) { animation-delay: .2s; }
  .adm-loader span:nth-child(3) { animation-delay: .4s; }

  @keyframes adm-slide-in {
    from { opacity:0; transform: translateX(20px); }
    to   { opacity:1; transform: translateX(0); }
  }
  @keyframes adm-bounce {
    0%,80%,100% { transform: scale(.5); opacity:.4; }
    40% { transform: scale(1); opacity:1; }
  }

  @media (max-width: 768px) {
    .adm-body { padding: 16px; }
    .adm-form-grid { grid-template-columns: 1fr; }
    table { font-size: 11px; }
    th, td { padding: 10px 10px; }
  }

  /* ── TABS ── */
  .adm-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 28px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: 4px;
    width: fit-content;
  }
  .adm-tab {
    font-family: "Dosis", sans-serif;
    font-size: 11px; font-weight: 800;
    letter-spacing: 1.5px; text-transform: uppercase;
    background: transparent;
    border: none; border-radius: 7px;
    color: rgba(255,255,255,0.35);
    padding: 8px 20px; cursor: pointer;
    transition: all .2s;
    display: flex; align-items: center; gap: 7px;
  }
  .adm-tab:hover { color: rgba(255,255,255,0.65); background: rgba(255,255,255,0.04); }
  .adm-tab.active {
    background: rgba(255,165,0,0.12);
    color: #ffa500;
    border: 1px solid rgba(255,165,0,0.2);
  }
  .adm-tab-badge {
    background: rgba(255,165,0,0.2);
    color: #ffa500;
    font-size: 9px; font-weight: 800;
    padding: 1px 6px; border-radius: 10px;
    min-width: 18px; text-align: center;
  }
  .adm-tab.active .adm-tab-badge { background: rgba(255,165,0,0.35); }

  /* ── CERT STATUS ── */
  .adm-cert-active {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 700; cursor: pointer;
  }
  .adm-cert-revoked {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 700; cursor: pointer;
    color: #ff5555;
  }

  /* ── SEARCH BAR ── */
  .adm-search {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: rgba(255,255,255,0.8);
    font-family: "Dosis", sans-serif;
    font-size: 13px; font-weight: 600;
    padding: 9px 14px;
    outline: none;
    transition: border-color .2s;
    width: 240px;
  }
  .adm-search:focus { border-color: rgba(255,165,0,0.35); }
  .adm-search::placeholder { color: rgba(255,255,255,0.2); }

  @media (max-width: 768px) {
    .adm-body { padding: 16px; }
    .adm-form-grid { grid-template-columns: 1fr; }
    table { font-size: 11px; }
    th, td { padding: 10px 10px; }
    .adm-tabs { width: 100%; }
    .adm-tab { flex: 1; justify-content: center; }
    .adm-search { width: 100%; }
  }
`;
/* ─── TOAST HELPER ──────────────────────────────────────────────── */
const LectureModal = ({ lecture, onSave, onClose }) => {
  const [form, setForm] = useState(lecture ? { ...lecture } : { ...EMPTY_LECTURE });
  const [busy, setBusy] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title || !form.video_url) return;
    setBusy(true);
    const payload = { ...form };
    delete payload.id; delete payload.created_at; delete payload.updated_at;

    let err;
    if (lecture?.id) {
      ({ error: err } = await supabase.from("lectures").update(payload).eq("id", lecture.id));
    } else {
      ({ error: err } = await supabase.from("lectures").insert([payload]));
    }
    setBusy(false);
    if (!err) onSave();
  };

  return (
    <div className="adm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal">
        <div className="adm-modal-title">
          {lecture ? "Edit Lecture" : "Add Lecture"}
          <button className="adm-btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="adm-form-grid">
          {/* Title */}
          <div className="adm-field adm-form-full">
            <label className="adm-label">Lecture Title *</label>
            <input className="adm-input" value={form.title}
              onChange={e => set("title", e.target.value)} placeholder="e.g. Building REST APIs with Node.js" />
          </div>

          {/* Course */}
          <div className="adm-field">
            <label className="adm-label">Course *</label>
            <select className="adm-select" value={form.course} onChange={e => set("course", e.target.value)}>
              {COURSES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Instructor */}
          <div className="adm-field">
            <label className="adm-label">Instructor *</label>
            <input className="adm-input" value={form.instructor}
              onChange={e => set("instructor", e.target.value)} placeholder="Sir / Ma'am Name" />
          </div>

          {/* Video URL */}
          <div className="adm-field adm-form-full">
            <label className="adm-label">Video URL * (YouTube embed or .mp4)</label>
            <input className="adm-input" value={form.video_url}
              onChange={e => set("video_url", e.target.value)}
              placeholder="https://www.youtube.com/embed/VIDEOID  or  https://…/video.mp4" />
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.2)", marginTop:4 }}>
              YouTube: paste the /embed/ URL from Share → Embed → copy src="…"
            </span>
          </div>

          {/* Thumbnail */}
          <div className="adm-field adm-form-full">
            <label className="adm-label">Thumbnail URL</label>
            <input className="adm-input" value={form.thumb_url}
              onChange={e => set("thumb_url", e.target.value)}
              placeholder="https://… (Unsplash, Supabase Storage, etc.)" />
          </div>

          {/* Description */}
          <div className="adm-field adm-form-full">
            <label className="adm-label">Description</label>
            <textarea className="adm-textarea" value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Short description of what students will learn…" />
          </div>

          {/* Tag */}
          <div className="adm-field">
            <label className="adm-label">Tag</label>
            <select className="adm-select" value={form.tag} onChange={e => set("tag", e.target.value)}>
              {TAGS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Duration */}
          <div className="adm-field">
            <label className="adm-label">Duration (mm:ss)</label>
            <input className="adm-input" value={form.duration}
              onChange={e => set("duration", e.target.value)} placeholder="12:34" />
          </div>

          {/* Students */}
          <div className="adm-field">
            <label className="adm-label">Viewer Count (display)</label>
            <input className="adm-input" value={form.students}
              onChange={e => set("students", e.target.value)} placeholder="2.4k" />
          </div>

          {/* Sort order */}
          <div className="adm-field">
            <label className="adm-label">Sort Order</label>
            <input className="adm-input" type="number" value={form.sort_order}
              onChange={e => set("sort_order", +e.target.value)} />
          </div>

          {/* Color */}
          <div className="adm-field adm-form-full">
            <label className="adm-label">Accent Color</label>
            <div className="adm-color-row">
              {COLORS.map(c => (
                <div key={c} className={`adm-color-swatch${form.color===c?" selected":""}`}
                  style={{ background:c }}
                  onClick={() => set("color", c)} />
              ))}
              <input className="adm-input" type="color" value={form.color}
                onChange={e => set("color", e.target.value)}
                style={{ width:36, height:36, padding:2, border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, cursor:"pointer" }} />
            </div>
          </div>

          {/* Published */}
          <div className="adm-field adm-form-full">
            <div className="adm-toggle-row">
              <button className={`adm-toggle${form.is_published?" on":""}`}
                onClick={() => set("is_published", !form.is_published)} type="button" />
              <span>{form.is_published ? "Published — visible on website" : "Draft — hidden from website"}</span>
            </div>
          </div>
        </div>

        <div className="adm-form-footer">
          <button className="adm-btn adm-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn-primary" disabled={busy || !form.title || !form.video_url} onClick={save}>
            {busy ? "Saving…" : (lecture ? "Save Changes" : "Add Lecture")}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── DELETE CONFIRM ────────────────────────────────────────────── */
const DeleteConfirm = ({ lecture, onConfirm, onClose }) => (
  <div className="adm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="adm-modal" style={{ maxWidth:400, textAlign:"center" }}>
      <div style={{ fontSize:40, marginBottom:16 }}>🗑️</div>
      <div style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>Delete Lecture?</div>
      <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:28 }}>
        "{lecture.title}" will be permanently removed.
      </div>
      <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
        <button className="adm-btn adm-btn-ghost" onClick={onClose}>Cancel</button>
        <button className="adm-btn adm-btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);
const COLORS  = ["#ffa500","#ff6b35","#00d4ff","#ff3366","#a855f7","#22d3ee","#fbbf24","#10b981"];
const TAGS    = ["Backend","Frontend","AI/ML","Security","Web3","React","Hardware","Python","Data","Mobile","Office","Blockchain"];
const COURSES = [
  "Full Stack Web Dev","Data Science","Full Stack with AI","Machine Learning",
  "Business Development","Mobile App Dev","MS Office","Cybersecurity & Ethical Hacking",
  "Frontend with React","Python Bootcamp","Blockchain Dev","Robotics & Automation",
];
const GRADES  = ["A+","A","A-","B+","B","B-","C","Pass","Distinction","Merit","Fail"];

const EMPTY_LECTURE = {
  title:"", course:COURSES[0], instructor:"", description:"",
  video_url:"", thumb_url:"", duration:"", tag:"Backend",
  color:"#ffa500", students:"0", is_published:true, sort_order:0,
};

const EMPTY_CERT = {
  cert_id:"", student_name:"", course:COURSES[0],
  issue_date:"", expiry_date:"", grade:"A+",
  instructor:"", is_active:true, notes:"",
};

/* ─── TOAST ─────────────────────────────────────────────────────── */
const Toast = ({ msg, err, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return <div className={`adm-toast${err?" err":""}`}>{err?"❌":"✅"} {msg}</div>;
};

/* ─── CERT FORM MODAL ────────────────────────────────────────────── */
const CertModal = ({ cert, onSave, onClose }) => {
  const [form, setForm] = useState(cert ? { ...cert } : { ...EMPTY_CERT });
  const [busy, setBusy] = useState(false);
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));

  // Auto-generate cert_id if new
  useEffect(() => {
    if (!cert && !form.cert_id) {
      const year = new Date().getFullYear();
      const rand = Math.floor(Math.random()*900+100);
      set("cert_id", `CBD-${year}-${rand}`);
    }
  }, []);

  const save = async () => {
    if (!form.cert_id || !form.student_name || !form.course || !form.issue_date) return;
    setBusy(true);
    const payload = { ...form };
    if (!payload.expiry_date) payload.expiry_date = null;
    if (!payload.notes) payload.notes = null;
    delete payload.id; delete payload.created_at; delete payload.updated_at;

    let err;
    if (cert?.id) {
      ({ error: err } = await supabase.from("certificates").update(payload).eq("id", cert.id));
    } else {
      ({ error: err } = await supabase.from("certificates").insert([payload]));
    }
    setBusy(false);
    if (err) alert(err.message);
    else onSave();
  };

  return (
    <div className="adm-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="adm-modal">
        <div className="adm-modal-title">
          {cert ? "Edit Certificate" : "Add Certificate"}
          <button className="adm-btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="adm-form-grid">
          {/* Cert ID */}
          <div className="adm-field">
            <label className="adm-label">Certificate ID * (unique)</label>
            <input className="adm-input" value={form.cert_id}
              onChange={e => set("cert_id", e.target.value.toUpperCase())}
              placeholder="CBD-2025-001" />
            <span style={{fontSize:10,color:"rgba(255,255,255,0.2)",marginTop:4}}>
              This is what students enter to verify their certificate
            </span>
          </div>

          {/* Student name */}
          <div className="adm-field">
            <label className="adm-label">Student Name *</label>
            <input className="adm-input" value={form.student_name}
              onChange={e => set("student_name", e.target.value)}
              placeholder="Full name as on certificate" />
          </div>

          {/* Course */}
          <div className="adm-field">
            <label className="adm-label">Course *</label>
            <select className="adm-select" value={form.course} onChange={e => set("course", e.target.value)}>
              {COURSES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Instructor */}
          <div className="adm-field">
            <label className="adm-label">Instructor</label>
            <input className="adm-input" value={form.instructor}
              onChange={e => set("instructor", e.target.value)}
              placeholder="Sir / Ma'am Name" />
          </div>

          {/* Issue Date */}
          <div className="adm-field">
            <label className="adm-label">Issue Date *</label>
            <input className="adm-input" type="date" value={form.issue_date}
              onChange={e => set("issue_date", e.target.value)} />
          </div>

          {/* Expiry Date */}
          <div className="adm-field">
            <label className="adm-label">Expiry Date (leave blank = never)</label>
            <input className="adm-input" type="date" value={form.expiry_date||""}
              onChange={e => set("expiry_date", e.target.value)} />
          </div>

          {/* Grade */}
          <div className="adm-field">
            <label className="adm-label">Grade</label>
            <select className="adm-select" value={form.grade} onChange={e => set("grade", e.target.value)}>
              {GRADES.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>

          {/* Notes */}
          <div className="adm-field">
            <label className="adm-label">Internal Notes</label>
            <input className="adm-input" value={form.notes||""}
              onChange={e => set("notes", e.target.value)}
              placeholder="Admin-only notes (not shown publicly)" />
          </div>

          {/* Active toggle */}
          <div className="adm-field adm-form-full">
            <div className="adm-toggle-row">
              <button className={`adm-toggle${form.is_active?" on":""}`}
                onClick={() => set("is_active", !form.is_active)} type="button" />
              <span>{form.is_active ? "Active — certificate is valid" : "Revoked — verification will show as invalid"}</span>
            </div>
          </div>
        </div>

        <div className="adm-form-footer">
          <button className="adm-btn adm-btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="adm-btn adm-btn-primary"
            disabled={busy || !form.cert_id || !form.student_name || !form.issue_date}
            onClick={save}
          >
            {busy ? "Saving…" : (cert ? "Save Changes" : "Issue Certificate")}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── CERT DELETE CONFIRM ────────────────────────────────────────── */
const CertDeleteConfirm = ({ cert, onConfirm, onClose }) => (
  <div className="adm-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
    <div className="adm-modal" style={{ maxWidth:400, textAlign:"center" }}>
      <div style={{ fontSize:40, marginBottom:16 }}>🗑️</div>
      <div style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>Delete Certificate?</div>
      <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:6 }}>
        Certificate ID: <strong style={{color:"#ffa500"}}>{cert.cert_id}</strong>
      </div>
      <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:24 }}>
        Issued to: {cert.student_name}
      </div>
      <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
        <button className="adm-btn adm-btn-ghost" onClick={onClose}>Cancel</button>
        <button className="adm-btn adm-btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);

/* ─── CERTIFICATES TAB ───────────────────────────────────────────── */
const CertificatesTab = ({ showToast }) => {
  const [certs,    setCerts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null);
  const [search,   setSearch]   = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) showToast(error.message, true);
    else setCerts(data || []);
    setLoading(false);
  }, [showToast]);

  useEffect(() => { fetch(); }, [fetch]);

  const toggleActive = async (cert) => {
    const { error } = await supabase
      .from("certificates")
      .update({ is_active: !cert.is_active })
      .eq("id", cert.id);
    if (error) showToast(error.message, true);
    else { showToast(cert.is_active ? "Certificate revoked" : "Certificate reactivated"); fetch(); }
  };

  const deleteCert = async () => {
    const { error } = await supabase.from("certificates").delete().eq("id", modal.cert.id);
    if (error) showToast(error.message, true);
    else { showToast("Certificate deleted"); fetch(); }
    setModal(null);
  };

  const filtered = certs.filter(c =>
    !search ||
    c.cert_id.toLowerCase().includes(search.toLowerCase()) ||
    c.student_name.toLowerCase().includes(search.toLowerCase()) ||
    c.course.toLowerCase().includes(search.toLowerCase())
  );

  const active   = certs.filter(c => c.is_active).length;
  const revoked  = certs.filter(c => !c.is_active).length;

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "—";

  return (
    <>
      <div className="adm-actions">
        <div className="adm-stat">🎓 {certs.length} Total</div>
        <div className="adm-stat">✅ {active} Active</div>
        <div className="adm-stat" style={{color:"rgba(255,80,80,0.7)"}}>🚫 {revoked} Revoked</div>
        <input
          className="adm-search"
          placeholder="Search ID / student / course…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ marginLeft:"auto" }}>
          <button className="adm-btn adm-btn-primary" onClick={() => setModal({ mode:"add" })}>
            + Issue Certificate
          </button>
        </div>
      </div>

      <div className="adm-table-wrap">
        {loading ? (
          <div className="adm-loader"><span/><span/><span/></div>
        ) : filtered.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">🎓</div>
            {search ? "No certificates match your search." : "No certificates yet. Click 'Issue Certificate' to add one."}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Certificate ID</th>
                <th>Student</th>
                <th>Course</th>
                <th>Grade</th>
                <th>Issued</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(cert => (
                <tr key={cert.id}>
                  <td>
                    <code style={{
                      background:"rgba(255,165,0,0.08)", border:"1px solid rgba(255,165,0,0.15)",
                      borderRadius:4, padding:"2px 7px", fontSize:11, fontFamily:"monospace",
                      color:"#ffa500", letterSpacing:0.5,
                    }}>
                      {cert.cert_id}
                    </code>
                  </td>
                  <td>
                    <div style={{fontWeight:700, marginBottom:2}}>{cert.student_name}</div>
                    {cert.instructor && <div style={{fontSize:10.5, color:"rgba(255,255,255,0.3)"}}>{cert.instructor}</div>}
                  </td>
                  <td style={{color:"rgba(255,255,255,0.45)", fontSize:11.5, maxWidth:160}}>{cert.course}</td>
                  <td>
                    {cert.grade && (
                      <span style={{
                        background:"rgba(255,165,0,0.1)", border:"1px solid rgba(255,165,0,0.2)",
                        borderRadius:4, padding:"2px 8px", fontSize:10, fontWeight:800,
                        color:"#ffa500",
                      }}>
                        {cert.grade}
                      </span>
                    )}
                  </td>
                  <td style={{color:"rgba(255,255,255,0.5)", fontSize:11.5, whiteSpace:"nowrap"}}>{fmtDate(cert.issue_date)}</td>
                  <td style={{color: cert.expiry_date && new Date(cert.expiry_date) < new Date() ? "#ff5555" : "rgba(255,255,255,0.5)", fontSize:11.5, whiteSpace:"nowrap"}}>
                    {cert.expiry_date ? fmtDate(cert.expiry_date) : <span style={{color:"rgba(255,255,255,0.2)"}}>Never</span>}
                  </td>
                  <td>
                    <div
                      className={cert.is_active ? "adm-cert-active" : "adm-cert-revoked"}
                      onClick={() => toggleActive(cert)}
                      title="Click to toggle"
                    >
                      <div className="adm-pub-dot" style={{background: cert.is_active ? "#22c55e" : "#ff5555"}}/>
                      <span style={{color: cert.is_active ? "#22c55e" : "#ff5555"}}>
                        {cert.is_active ? "Active" : "Revoked"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="adm-row-btns">
                      <button className="adm-btn-icon" title="Edit"
                        onClick={() => setModal({ mode:"edit", cert })}>✏️</button>
                      <button className="adm-btn-icon del" title="Delete"
                        onClick={() => setModal({ mode:"delete", cert })}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal?.mode === "add" && (
        <CertModal onSave={() => { showToast("Certificate issued!"); fetch(); setModal(null); }} onClose={() => setModal(null)} />
      )}
      {modal?.mode === "edit" && (
        <CertModal cert={modal.cert} onSave={() => { showToast("Saved!"); fetch(); setModal(null); }} onClose={() => setModal(null)} />
      )}
      {modal?.mode === "delete" && (
        <CertDeleteConfirm cert={modal.cert} onConfirm={deleteCert} onClose={() => setModal(null)} />
      )}
    </>
  );
};

/* ─── LECTURES TAB ───────────────────────────────────────────────── */
const LecturesTab = ({ showToast }) => {
  const [lectures, setLectures] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("lectures").select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) showToast(error.message, true);
    else setLectures(data || []);
    setLoading(false);
  }, [showToast]);

  useEffect(() => { fetch(); }, [fetch]);

  const togglePublish = async (lec) => {
    const { error } = await supabase.from("lectures").update({ is_published: !lec.is_published }).eq("id", lec.id);
    if (error) showToast(error.message, true);
    else { showToast(lec.is_published ? "Unpublished" : "Published"); fetch(); }
  };

  const deleteLecture = async () => {
    const { error } = await supabase.from("lectures").delete().eq("id", modal.lecture.id);
    if (error) showToast(error.message, true);
    else { showToast("Lecture deleted"); fetch(); }
    setModal(null);
  };

  const onDragEnd = async () => {
    if (dragging === null || dragOver === null || dragging === dragOver) {
      setDragging(null); setDragOver(null); return;
    }
    const reordered = [...lectures];
    const [moved] = reordered.splice(dragging, 1);
    reordered.splice(dragOver, 0, moved);
    const updated = reordered.map((l, i) => ({ ...l, sort_order: i + 1 }));
    setLectures(updated); setDragging(null); setDragOver(null);
    await Promise.all(updated.map(l => supabase.from("lectures").update({ sort_order: l.sort_order }).eq("id", l.id)));
    showToast("Order saved");
  };

  const published = lectures.filter(l => l.is_published).length;

  return (
    <>
      <div className="adm-actions">
        <div className="adm-stat">📹 {lectures.length} Total</div>
        <div className="adm-stat">🟢 {published} Published</div>
        <div className="adm-stat">📝 {lectures.length - published} Drafts</div>
        <div style={{ marginLeft:"auto" }}>
          <button className="adm-btn adm-btn-primary" onClick={() => setModal({ mode:"add" })}>
            + Add Lecture
          </button>
        </div>
      </div>

      <div className="adm-table-wrap">
        {loading ? (
          <div className="adm-loader"><span/><span/><span/></div>
        ) : lectures.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">📭</div>
            No lectures yet. Click "Add Lecture" to get started.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{width:32}}></th>
                <th style={{width:80}}>Thumb</th>
                <th>Title</th>
                <th>Course</th>
                <th>Tag</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lectures.map((lec, i) => (
                <tr key={lec.id} draggable
                  onDragStart={() => setDragging(i)}
                  onDragOver={e => { e.preventDefault(); setDragOver(i); }}
                  onDragEnd={onDragEnd}
                  className={dragging===i?"adm-row-dragging":dragOver===i?"adm-row-over":""}
                >
                  <td><span className="adm-drag-handle" title="Drag to reorder">⠿</span></td>
                  <td className="adm-thumb-cell">
                    {lec.thumb_url ? <img src={lec.thumb_url} alt=""/> : <div className="adm-thumb-placeholder">🎬</div>}
                  </td>
                  <td>
                    <div style={{fontWeight:700, marginBottom:2}}>{lec.title}</div>
                    <div style={{fontSize:10.5, color:"rgba(255,255,255,0.3)"}}>{lec.instructor}</div>
                  </td>
                  <td style={{color:"rgba(255,255,255,0.45)", fontSize:11.5}}>{lec.course}</td>
                  <td><span className="adm-tag" style={{background:lec.color}}>{lec.tag}</span></td>
                  <td style={{color:"rgba(255,255,255,0.45)", fontVariantNumeric:"tabular-nums"}}>{lec.duration||"—"}</td>
                  <td>
                    <div className="adm-published" style={{cursor:"pointer"}} onClick={() => togglePublish(lec)} title="Click to toggle">
                      <div className="adm-pub-dot" style={{background: lec.is_published ? "#22c55e" : "#555"}}/>
                      <span style={{color: lec.is_published ? "#22c55e" : "rgba(255,255,255,0.3)"}}>
                        {lec.is_published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="adm-row-btns">
                      <button className="adm-btn-icon" title="Edit" onClick={() => setModal({ mode:"edit", lecture:lec })}>✏️</button>
                      <button className="adm-btn-icon del" title="Delete" onClick={() => setModal({ mode:"delete", lecture:lec })}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal?.mode === "add" && (
        <LectureModal onSave={() => { showToast("Lecture added!"); fetch(); setModal(null); }} onClose={() => setModal(null)} />
      )}
      {modal?.mode === "edit" && (
        <LectureModal lecture={modal.lecture} onSave={() => { showToast("Saved!"); fetch(); setModal(null); }} onClose={() => setModal(null)} />
      )}
      {modal?.mode === "delete" && (
        <DeleteConfirm lecture={modal.lecture} onConfirm={deleteLecture} onClose={() => setModal(null)} />
      )}
    </>
  );
};


const CHALLENGE_TAGS = ["Python","JavaScript","SQL","CSS","Git","Logic","Web Dev","React","General"];
const CHALLENGE_DIFFS = ["Easy","Medium","Hard"];
const EMPTY_CHALLENGE = {
  title:"", description:"", difficulty:"Medium", tag:"Python",
  answer:"", hint:"", explanation:"", active_date:"", is_published:true,
};

/* ─── CHALLENGE FORM MODAL ───────────────────────────────────────── */
const ChallengeModal = ({ challenge, onSave, onClose }) => {
  const [form, setForm] = useState(challenge ? { ...challenge } : { ...EMPTY_CHALLENGE });
  const [busy, setBusy] = useState(false);
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));

  const save = async () => {
    if (!form.title || !form.description || !form.answer || !form.active_date) return;
    setBusy(true);
    const payload = { ...form };
    delete payload.id; delete payload.created_at;
    let err;
    if (challenge?.id) {
      ({ error: err } = await supabase.from("challenges").update(payload).eq("id", challenge.id));
    } else {
      ({ error: err } = await supabase.from("challenges").insert([payload]));
    }
    setBusy(false);
    if (err) alert(err.message);
    else onSave();
  };

  return (
    <div className="adm-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="adm-modal" style={{maxWidth:720}}>
        <div className="adm-modal-title">
          {challenge ? "Edit Challenge" : "Add Challenge"}
          <button className="adm-btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="adm-form-grid">
          <div className="adm-field adm-form-full">
            <label className="adm-label">Challenge Title *</label>
            <input className="adm-input" value={form.title}
              onChange={e=>set("title",e.target.value)} placeholder="e.g. Reverse a string" />
          </div>
          <div className="adm-field adm-form-full">
            <label className="adm-label">Problem Description * (use two blank lines to separate code blocks)</label>
            <textarea className="adm-textarea" rows={5} value={form.description}
              onChange={e=>set("description",e.target.value)}
              placeholder={"What does this print?\n\nmy_list = [1, 2, 3]\nprint(my_list[0])"}
              style={{fontFamily:"monospace",fontSize:12}} />
          </div>
          <div className="adm-field">
            <label className="adm-label">Correct Answer * (case-insensitive)</label>
            <input className="adm-input" value={form.answer}
              onChange={e=>set("answer",e.target.value)} placeholder="1"
              style={{fontFamily:"monospace"}} />
          </div>
          <div className="adm-field">
            <label className="adm-label">Active Date * (when this challenge shows)</label>
            <input className="adm-input" type="date" value={form.active_date}
              onChange={e=>set("active_date",e.target.value)} />
          </div>
          <div className="adm-field">
            <label className="adm-label">Difficulty</label>
            <select className="adm-select" value={form.difficulty} onChange={e=>set("difficulty",e.target.value)}>
              {CHALLENGE_DIFFS.map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="adm-field">
            <label className="adm-label">Tag / Category</label>
            <select className="adm-select" value={form.tag} onChange={e=>set("tag",e.target.value)}>
              {CHALLENGE_TAGS.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="adm-field adm-form-full">
            <label className="adm-label">Hint (shown after 2 wrong attempts)</label>
            <input className="adm-input" value={form.hint||""}
              onChange={e=>set("hint",e.target.value)} placeholder="Optional nudge without giving it away..." />
          </div>
          <div className="adm-field adm-form-full">
            <label className="adm-label">Explanation (shown after correct answer)</label>
            <textarea className="adm-textarea" rows={2} value={form.explanation||""}
              onChange={e=>set("explanation",e.target.value)}
              placeholder="Full explanation of why this is the answer..." />
          </div>
          <div className="adm-field adm-form-full">
            <div className="adm-toggle-row">
              <button className={`adm-toggle${form.is_published?" on":""}`}
                onClick={()=>set("is_published",!form.is_published)} type="button"/>
              <span>{form.is_published ? "Published — visible on website on active date" : "Draft — hidden"}</span>
            </div>
          </div>
        </div>
        <div className="adm-form-footer">
          <button className="adm-btn adm-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn-primary"
            disabled={busy || !form.title || !form.answer || !form.active_date}
            onClick={save}>
            {busy ? "Saving…" : (challenge ? "Save Changes" : "Add Challenge")}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── CHALLENGES TAB ─────────────────────────────────────────────── */
const ChallengesTab = ({ showToast }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("challenges").select("*")
      .order("active_date", { ascending: true });
    if (error) showToast(error.message, true);
    else setChallenges(data || []);
    setLoading(false);
  }, [showToast]);

  useEffect(() => { fetch(); }, [fetch]);

  const deleteChallenge = async () => {
    const { error } = await supabase.from("challenges").delete().eq("id", modal.challenge.id);
    if (error) showToast(error.message, true);
    else { showToast("Challenge deleted"); fetch(); }
    setModal(null);
  };

  const today = new Date().toISOString().split("T")[0];
  const fmtDate = d => d ? new Date(d+"T00:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) : "—";
  const diffColor = { Easy:"#22c55e", Medium:"#ffa500", Hard:"#ef4444" };

  return (
    <>
      <div className="adm-actions">
        <div className="adm-stat">⚡ {challenges.length} Total</div>
        <div className="adm-stat">✅ {challenges.filter(c=>c.is_published).length} Published</div>
        <div className="adm-stat">📅 {challenges.filter(c=>c.active_date >= today).length} Upcoming</div>
        <div style={{marginLeft:"auto"}}>
          <button className="adm-btn adm-btn-primary" onClick={()=>setModal({mode:"add"})}>
            + Add Challenge
          </button>
        </div>
      </div>

      <div className="adm-table-wrap">
        {loading ? (
          <div className="adm-loader"><span/><span/><span/></div>
        ) : challenges.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">⚡</div>
            No challenges yet. Add your first one.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Tag</th>
                <th>Difficulty</th>
                <th>Answer</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map(ch => (
                <tr key={ch.id} style={ch.active_date===today?{background:"rgba(255,165,0,0.03)"}:{}}>
                  <td style={{whiteSpace:"nowrap"}}>
                    <div style={{fontFamily:"monospace",fontSize:11.5,color:"rgba(255,255,255,0.5)"}}>{fmtDate(ch.active_date)}</div>
                    {ch.active_date===today && (
                      <div style={{fontSize:8,fontWeight:800,letterSpacing:1,color:"#ffa500",marginTop:2}}>TODAY</div>
                    )}
                  </td>
                  <td>
                    <div style={{fontWeight:700,marginBottom:2}}>{ch.title}</div>
                    <div style={{fontSize:10.5,color:"rgba(255,255,255,0.3)",maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {ch.description.split("\n")[0]}
                    </div>
                  </td>
                  <td><span className="adm-tag" style={{background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.5)"}}>{ch.tag}</span></td>
                  <td>
                    <span style={{fontSize:10,fontWeight:800,color:diffColor[ch.difficulty]||"#ffa500"}}>{ch.difficulty}</span>
                  </td>
                  <td>
                    <code style={{fontFamily:"monospace",fontSize:11,background:"rgba(255,165,0,0.08)",
                      border:"1px solid rgba(255,165,0,0.15)",borderRadius:4,padding:"2px 7px",color:"#ffa500"}}>
                      {ch.answer}
                    </code>
                  </td>
                  <td>
                    <div className="adm-published">
                      <div className="adm-pub-dot" style={{background:ch.is_published?"#22c55e":"#555"}}/>
                      <span style={{color:ch.is_published?"#22c55e":"rgba(255,255,255,0.3)"}}>
                        {ch.is_published?"Published":"Draft"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="adm-row-btns">
                      <button className="adm-btn-icon" onClick={()=>setModal({mode:"edit",challenge:ch})}>✏️</button>
                      <button className="adm-btn-icon del" onClick={()=>setModal({mode:"delete",challenge:ch})}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal?.mode==="add" && (
        <ChallengeModal onSave={()=>{showToast("Challenge added!");fetch();setModal(null);}} onClose={()=>setModal(null)}/>
      )}
      {modal?.mode==="edit" && (
        <ChallengeModal challenge={modal.challenge} onSave={()=>{showToast("Saved!");fetch();setModal(null);}} onClose={()=>setModal(null)}/>
      )}
      {modal?.mode==="delete" && (
        <div className="adm-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="adm-modal" style={{maxWidth:400,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>🗑️</div>
            <div style={{fontSize:16,fontWeight:700,marginBottom:8}}>Delete challenge?</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:22}}>"{modal.challenge.title}"</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button className="adm-btn adm-btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
              <button className="adm-btn adm-btn-danger" onClick={deleteChallenge}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ─── MAIN ADMIN PANEL ───────────────────────────────────────────── */

const POST_CATS = ["News","University Visit","Social","Event","Achievement","Behind the Scenes"];
const EMPTY_POST = {
  title:"", caption:"", category:"News",
  images:[""], tags:[], is_published:true, is_featured:false,
};

/* ─── POST FORM MODAL ────────────────────────────────────────────── */
const PostModal = ({ post, onSave, onClose }) => {
  const [form, setForm] = useState(post ? { ...post, images: post.images?.length ? post.images : [""], tags: post.tags || [] } : { ...EMPTY_POST });
  const [busy, setBusy] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const addImage  = () => set("images", [...form.images, ""]);
  const setImg    = (i,v) => { const imgs=[...form.images]; imgs[i]=v; set("images",imgs); };
  const removeImg = (i)   => set("images", form.images.filter((_,idx)=>idx!==i));
  const addTag    = () => { const t=tagInput.trim(); if(t&&!form.tags.includes(t)){set("tags",[...form.tags,t]);} setTagInput(""); };
  const removeTag = (t)   => set("tags", form.tags.filter(x=>x!==t));

  const save = async () => {
    if (!form.title) return;
    setBusy(true);
    const payload = {
      ...form,
      images: form.images.filter(u=>u.trim()),
    };
    delete payload.id; delete payload.created_at; delete payload.updated_at;
    let err;
    if (post?.id) {
      ({error:err} = await supabase.from("posts").update(payload).eq("id",post.id));
    } else {
      ({error:err} = await supabase.from("posts").insert([payload]));
    }
    setBusy(false);
    if (err) alert(err.message); else onSave();
  };

  return (
    <div className="adm-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="adm-modal" style={{maxWidth:720}}>
        <div className="adm-modal-title">
          {post?"Edit Post":"New Post"}
          <button className="adm-btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="adm-form-grid">
          {/* Title */}
          <div className="adm-field adm-form-full">
            <label className="adm-label">Title *</label>
            <input className="adm-input" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. University of Lahore Campus Visit 🎓"/>
          </div>
          {/* Category */}
          <div className="adm-field">
            <label className="adm-label">Category</label>
            <select className="adm-select" value={form.category} onChange={e=>set("category",e.target.value)}>
              {POST_CATS.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          {/* Featured toggle */}
          <div className="adm-field" style={{display:"flex",alignItems:"center",gap:10,paddingTop:22}}>
            <div className="adm-toggle-row">
              <button className={`adm-toggle${form.is_featured?" on":""}`} onClick={()=>set("is_featured",!form.is_featured)} type="button"/>
              <span style={{fontSize:12}}>{form.is_featured?"Featured — shown prominently":"Regular post"}</span>
            </div>
          </div>
          {/* Caption */}
          <div className="adm-field adm-form-full">
            <label className="adm-label">Caption / Post Text</label>
            <textarea className="adm-textarea" rows={4} value={form.caption||""} onChange={e=>set("caption",e.target.value)} placeholder="Write what happened, the story behind the photos..."/>
          </div>
          {/* Images */}
          <div className="adm-field adm-form-full">
            <label className="adm-label">Image URLs (paste image links — Supabase Storage, Unsplash, etc.)</label>
            {form.images.map((url,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
                <input className="adm-input" value={url} onChange={e=>setImg(i,e.target.value)} placeholder={`Image ${i+1} URL`} style={{flex:1}}/>
                {url && <img src={url} alt="" style={{width:48,height:36,objectFit:"cover",borderRadius:6,flexShrink:0}} onError={e=>e.target.style.display="none"}/>}
                {form.images.length>1 && <button className="adm-btn-icon del" onClick={()=>removeImg(i)} title="Remove">✕</button>}
              </div>
            ))}
            {form.images.length < 6 && (
              <button className="adm-btn adm-btn-ghost" style={{fontSize:10,padding:"6px 14px",marginTop:4}} onClick={addImage}>
                + Add Image
              </button>
            )}
          </div>
          {/* Tags */}
          <div className="adm-field adm-form-full">
            <label className="adm-label">Tags</label>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <input className="adm-input" value={tagInput} onChange={e=>setTagInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addTag();}}}
                placeholder="Type tag and press Enter" style={{flex:1}}/>
              <button className="adm-btn adm-btn-ghost" style={{fontSize:10,padding:"6px 14px",flexShrink:0}} onClick={addTag}>Add</button>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {form.tags.map(t=>(
                <span key={t} style={{background:"rgba(255,165,0,0.1)",border:"1px solid rgba(255,165,0,0.2)",borderRadius:4,fontSize:10,fontWeight:700,color:"#ffa500",padding:"2px 10px",display:"flex",alignItems:"center",gap:6}}>
                  #{t}
                  <button onClick={()=>removeTag(t)} style={{background:"none",border:"none",color:"rgba(255,165,0,0.5)",cursor:"pointer",fontSize:11,lineHeight:1,padding:0}}>✕</button>
                </span>
              ))}
            </div>
          </div>
          {/* Published */}
          <div className="adm-field adm-form-full">
            <div className="adm-toggle-row">
              <button className={`adm-toggle${form.is_published?" on":""}`} onClick={()=>set("is_published",!form.is_published)} type="button"/>
              <span>{form.is_published?"Published — visible on website":"Draft — hidden"}</span>
            </div>
          </div>
        </div>
        <div className="adm-form-footer">
          <button className="adm-btn adm-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn-primary" disabled={busy||!form.title} onClick={save}>
            {busy?"Saving…":(post?"Save Changes":"Publish Post")}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── BLOG TAB ───────────────────────────────────────────────────── */
const BlogTab = ({ showToast }) => {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);
  const [filter,  setFilter]  = useState("All");

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("posts").select("*")
      .order("created_at", { ascending: false });
    if (error) showToast(error.message, true);
    else setPosts(data||[]);
    setLoading(false);
  }, [showToast]);

  useEffect(()=>{ fetch(); },[fetch]);

  const deletePost = async () => {
    const {error} = await supabase.from("posts").delete().eq("id",modal.post.id);
    if (error) showToast(error.message,true);
    else { showToast("Post deleted"); fetch(); }
    setModal(null);
  };

  const togglePublish = async (post) => {
    const {error} = await supabase.from("posts").update({is_published:!post.is_published}).eq("id",post.id);
    if (error) showToast(error.message,true);
    else { showToast(post.is_published?"Unpublished":"Published"); fetch(); }
  };

  const cats = ["All",...new Set(posts.map(p=>p.category))];
  const filtered = filter==="All" ? posts : posts.filter(p=>p.category===filter);
  const fmtDate  = d => new Date(d).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
  const CAT_COLORS_ADM = {"News":"#ffa500","University Visit":"#00d4ff","Social":"#22c55e","Event":"#a855f7","Achievement":"#ffd700","Behind the Scenes":"#ff6b35"};

  return (
    <>
      <div className="adm-actions" style={{flexWrap:"wrap"}}>
        <div className="adm-stat">📝 {posts.length} Total</div>
        <div className="adm-stat">✅ {posts.filter(p=>p.is_published).length} Published</div>
        <div className="adm-stat">⭐ {posts.filter(p=>p.is_featured).length} Featured</div>
        {cats.map(cat=>(
          <button key={cat}
            onClick={()=>setFilter(cat)}
            style={{
              background: filter===cat?"rgba(255,165,0,0.1)":"rgba(255,255,255,0.03)",
              border: `1px solid ${filter===cat?"rgba(255,165,0,0.25)":"rgba(255,255,255,0.06)"}`,
              borderRadius:6, color:filter===cat?"#ffa500":"rgba(255,255,255,0.35)",
              fontFamily:'"Dosis",sans-serif', fontSize:10, fontWeight:800,
              letterSpacing:"1.2px", textTransform:"uppercase", padding:"5px 12px", cursor:"pointer",
            }}
          >{cat}</button>
        ))}
        <div style={{marginLeft:"auto"}}>
          <button className="adm-btn adm-btn-primary" onClick={()=>setModal({mode:"add"})}>
            + New Post
          </button>
        </div>
      </div>

      <div className="adm-table-wrap">
        {loading ? (
          <div className="adm-loader"><span/><span/><span/></div>
        ) : filtered.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">📝</div>
            No posts yet. Click "New Post" to create your first.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{width:70}}>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Date</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(post=>(
                <tr key={post.id}>
                  <td className="adm-thumb-cell">
                    {post.images?.[0]
                      ? <img src={post.images[0]} alt="" style={{width:64,height:40,objectFit:"cover",borderRadius:6}}/>
                      : <div className="adm-thumb-placeholder">📸</div>
                    }
                  </td>
                  <td>
                    <div style={{fontWeight:700,marginBottom:2}}>{post.title}</div>
                    {post.images?.length>1 && <div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{post.images.length} images</div>}
                  </td>
                  <td>
                    <span className="adm-tag" style={{background:CAT_COLORS_ADM[post.category]||"#ffa500"}}>{post.category}</span>
                  </td>
                  <td style={{maxWidth:160}}>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {post.tags?.slice(0,3).map(t=>(
                        <span key={t} style={{fontSize:9,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:3,padding:"1px 6px",color:"rgba(255,255,255,0.35)"}}>{t}</span>
                      ))}
                      {post.tags?.length>3 && <span style={{fontSize:9,color:"rgba(255,255,255,0.2)"}}>+{post.tags.length-3}</span>}
                    </div>
                  </td>
                  <td style={{color:"rgba(255,255,255,0.4)",fontSize:11,whiteSpace:"nowrap"}}>{fmtDate(post.created_at)}</td>
                  <td style={{textAlign:"center"}}>
                    {post.is_featured ? <span style={{color:"#ffd700",fontSize:14}}>⭐</span> : <span style={{color:"rgba(255,255,255,0.1)"}}>—</span>}
                  </td>
                  <td>
                    <div className="adm-published" style={{cursor:"pointer"}} onClick={()=>togglePublish(post)} title="Click to toggle">
                      <div className="adm-pub-dot" style={{background:post.is_published?"#22c55e":"#555"}}/>
                      <span style={{color:post.is_published?"#22c55e":"rgba(255,255,255,0.3)"}}>
                        {post.is_published?"Published":"Draft"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="adm-row-btns">
                      <button className="adm-btn-icon" onClick={()=>setModal({mode:"edit",post})}>✏️</button>
                      <button className="adm-btn-icon del" onClick={()=>setModal({mode:"delete",post})}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal?.mode==="add"    && <PostModal onSave={()=>{showToast("Post published!");fetch();setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.mode==="edit"   && <PostModal post={modal.post} onSave={()=>{showToast("Saved!");fetch();setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.mode==="delete" && (
        <div className="adm-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="adm-modal" style={{maxWidth:400,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>🗑️</div>
            <div style={{fontSize:16,fontWeight:700,marginBottom:8}}>Delete post?</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:22}}>"{modal.post.title}"</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button className="adm-btn adm-btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
              <button className="adm-btn adm-btn-danger" onClick={deletePost}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


const REVIEW_COURSES = [
  "Full Stack Web Dev","Data Science","Full Stack with AI","Machine Learning",
  "Business Development","Mobile App Dev","MS Office","Cybersecurity & Ethical Hacking",
  "Frontend with React","Python Bootcamp","Blockchain Dev","Robotics & Automation",
];

const EMPTY_REVIEW = {
  student_name:"", course:REVIEW_COURSES[0], video_url:"",
  thumb_url:"", rating:5, short_quote:"", is_published:true, sort_order:0,
};

/* ─── VIDEO REVIEW FORM MODAL ────────────────────────────────────── */
const ReviewModal = ({ review, onSave, onClose }) => {
  const [form, setForm] = useState(review ? { ...review } : { ...EMPTY_REVIEW });
  const [busy, setBusy] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const save = async () => {
    if (!form.student_name || !form.video_url) return;
    setBusy(true);
    const payload = { ...form };
    delete payload.id; delete payload.created_at;
    let err;
    if (review?.id) {
      ({error:err} = await supabase.from("video_reviews").update(payload).eq("id",review.id));
    } else {
      ({error:err} = await supabase.from("video_reviews").insert([payload]));
    }
    setBusy(false);
    if (err) alert(err.message); else onSave();
  };

  return (
    <div className="adm-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="adm-modal" style={{maxWidth:640}}>
        <div className="adm-modal-title">
          {review?"Edit Review":"Add Video Review"}
          <button className="adm-btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="adm-form-grid">
          <div className="adm-field">
            <label className="adm-label">Student Name *</label>
            <input className="adm-input" value={form.student_name}
              onChange={e=>set("student_name",e.target.value)} placeholder="e.g. Ali Khan"/>
          </div>
          <div className="adm-field">
            <label className="adm-label">Course *</label>
            <select className="adm-select" value={form.course} onChange={e=>set("course",e.target.value)}>
              {REVIEW_COURSES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="adm-field adm-form-full">
            <label className="adm-label">Video URL * (YouTube embed or .mp4)</label>
            <input className="adm-input" value={form.video_url}
              onChange={e=>set("video_url",e.target.value)}
              placeholder="https://www.youtube.com/embed/VIDEO_ID"/>
            <span style={{fontSize:10,color:"rgba(255,255,255,0.2)",marginTop:4,display:"block"}}>
              YouTube: Share → Embed → copy the src="…" URL
            </span>
          </div>
          <div className="adm-field adm-form-full">
            <label className="adm-label">Thumbnail URL (leave blank to auto-use YouTube thumbnail)</label>
            <input className="adm-input" value={form.thumb_url||""}
              onChange={e=>set("thumb_url",e.target.value)}
              placeholder="https://… (optional — auto-generated for YouTube)"/>
          </div>
          <div className="adm-field adm-form-full">
            <label className="adm-label">Short Quote (shown on card)</label>
            <input className="adm-input" value={form.short_quote||""}
              onChange={e=>set("short_quote",e.target.value)}
              placeholder='e.g. "Got hired 3 weeks after graduating!"'/>
          </div>
          <div className="adm-field">
            <label className="adm-label">Rating (1–5)</label>
            <div style={{display:"flex",gap:8,alignItems:"center",paddingTop:6}}>
              {[1,2,3,4,5].map(n=>(
                <span key={n} onClick={()=>set("rating",n)}
                  style={{fontSize:22,cursor:"pointer",color:n<=form.rating?"#ffa500":"rgba(255,255,255,0.12)",transition:"color .15s"}}>
                  ★
                </span>
              ))}
              <span style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginLeft:4}}>{form.rating}/5</span>
            </div>
          </div>
          <div className="adm-field">
            <label className="adm-label">Sort Order</label>
            <input className="adm-input" type="number" value={form.sort_order}
              onChange={e=>set("sort_order",+e.target.value)}/>
          </div>
          <div className="adm-field adm-form-full">
            <div className="adm-toggle-row">
              <button className={`adm-toggle${form.is_published?" on":""}`}
                onClick={()=>set("is_published",!form.is_published)} type="button"/>
              <span>{form.is_published?"Published — visible on website":"Draft — hidden"}</span>
            </div>
          </div>
        </div>
        <div className="adm-form-footer">
          <button className="adm-btn adm-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn-primary"
            disabled={busy||!form.student_name||!form.video_url} onClick={save}>
            {busy?"Saving…":(review?"Save Changes":"Add Review")}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── VIDEO REVIEWS TAB ──────────────────────────────────────────── */
const VideoReviewsTab = ({ showToast }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("video_reviews").select("*")
      .order("sort_order",{ascending:true})
      .order("created_at",{ascending:false});
    if (error) showToast(error.message,true);
    else setReviews(data||[]);
    setLoading(false);
  },[showToast]);

  useEffect(()=>{ fetch(); },[fetch]);

  const deleteReview = async () => {
    const {error} = await supabase.from("video_reviews").delete().eq("id",modal.review.id);
    if (error) showToast(error.message,true);
    else { showToast("Review deleted"); fetch(); }
    setModal(null);
  };

  const togglePublish = async (r) => {
    const {error} = await supabase.from("video_reviews").update({is_published:!r.is_published}).eq("id",r.id);
    if (error) showToast(error.message,true);
    else { showToast(r.is_published?"Unpublished":"Published"); fetch(); }
  };

  const getYTThumb = (url) => {
    const m = url?.match(/embed\/([a-zA-Z0-9_-]+)/);
    return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
  };

  return (
    <>
      <div className="adm-actions">
        <div className="adm-stat">🎬 {reviews.length} Total</div>
        <div className="adm-stat">✅ {reviews.filter(r=>r.is_published).length} Published</div>
        <div style={{marginLeft:"auto"}}>
          <button className="adm-btn adm-btn-primary" onClick={()=>setModal({mode:"add"})}>
            + Add Review
          </button>
        </div>
      </div>

      <div className="adm-table-wrap">
        {loading ? (
          <div className="adm-loader"><span/><span/><span/></div>
        ) : reviews.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">🎬</div>
            No video reviews yet. Add your first student review.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{width:80}}>Thumb</th>
                <th>Student</th>
                <th>Course</th>
                <th>Quote</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => {
                const thumb = r.thumb_url || getYTThumb(r.video_url);
                return (
                  <tr key={r.id}>
                    <td className="adm-thumb-cell">
                      {thumb
                        ? <img src={thumb} alt="" style={{width:64,height:40,objectFit:"cover",borderRadius:6}}/>
                        : <div className="adm-thumb-placeholder">🎬</div>
                      }
                    </td>
                    <td style={{fontWeight:700}}>{r.student_name}</td>
                    <td style={{color:"rgba(255,255,255,0.45)",fontSize:11.5}}>{r.course}</td>
                    <td style={{color:"rgba(255,255,255,0.38)",fontSize:11.5,fontStyle:"italic",maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {r.short_quote ? `"${r.short_quote}"` : "—"}
                    </td>
                    <td>
                      <div style={{display:"flex",gap:2}}>
                        {[1,2,3,4,5].map(n=>(
                          <span key={n} style={{fontSize:13,color:n<=r.rating?"#ffa500":"rgba(255,255,255,0.12)"}}>★</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="adm-published" style={{cursor:"pointer"}} onClick={()=>togglePublish(r)}>
                        <div className="adm-pub-dot" style={{background:r.is_published?"#22c55e":"#555"}}/>
                        <span style={{color:r.is_published?"#22c55e":"rgba(255,255,255,0.3)"}}>
                          {r.is_published?"Published":"Draft"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="adm-row-btns">
                        <button className="adm-btn-icon" onClick={()=>setModal({mode:"edit",review:r})}>✏️</button>
                        <button className="adm-btn-icon del" onClick={()=>setModal({mode:"delete",review:r})}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {modal?.mode==="add"    && <ReviewModal onSave={()=>{showToast("Review added!");fetch();setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.mode==="edit"   && <ReviewModal review={modal.review} onSave={()=>{showToast("Saved!");fetch();setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.mode==="delete" && (
        <div className="adm-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="adm-modal" style={{maxWidth:400,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>🗑️</div>
            <div style={{fontSize:16,fontWeight:700,marginBottom:8}}>Delete review?</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:22}}>{modal.review.student_name}</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button className="adm-btn adm-btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
              <button className="adm-btn adm-btn-danger" onClick={deleteReview}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


const PROD_CATS = ["E-Book","Robotics Kit","Course Bundle","Merchandise"];
const BADGE_COLORS = ["#ffa500","#22c55e","#00d4ff","#ef4444","#a855f7","#ffd700","#ff6b35"];
const EMPTY_PROD = {
  name:"", description:"", price:"", original_price:"", category:"E-Book",
  images:[""], features:[""], badge:"", badge_color:"#ffa500",
  buy_link:"", is_published:true, is_featured:false, stock:"", sort_order:0,
};

/* ─── PRODUCT FORM MODAL ─────────────────────────────────────────── */
const ProductModal = ({ product, onSave, onClose }) => {
  const [form, setForm] = useState(product
    ? { ...product, images: product.images?.length ? product.images : [""], features: product.features?.length ? product.features : [""] }
    : { ...EMPTY_PROD }
  );
  const [busy, setBusy] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const setImg = (i,v) => { const a=[...form.images]; a[i]=v; set("images",a); };
  const addImg = () => set("images",[...form.images,""]);
  const delImg = (i) => set("images",form.images.filter((_,idx)=>idx!==i));
  const setFeat = (i,v) => { const a=[...form.features]; a[i]=v; set("features",a); };
  const addFeat = () => set("features",[...form.features,""]);
  const delFeat = (i) => set("features",form.features.filter((_,idx)=>idx!==i));

  const save = async () => {
    if (!form.name || !form.price) return;
    setBusy(true);
    const payload = {
      ...form,
      price: parseFloat(form.price)||0,
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      stock: form.stock !== "" ? parseInt(form.stock) : null,
      images:   form.images.filter(u=>u.trim()),
      features: form.features.filter(f=>f.trim()),
      badge:    form.badge.trim() || null,
    };
    delete payload.id; delete payload.created_at; delete payload.updated_at;
    let err;
    if (product?.id) {
      ({error:err} = await supabase.from("products").update(payload).eq("id",product.id));
    } else {
      ({error:err} = await supabase.from("products").insert([payload]));
    }
    setBusy(false);
    if (err) alert(err.message); else onSave();
  };

  return (
    <div className="adm-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="adm-modal" style={{maxWidth:740}}>
        <div className="adm-modal-title">
          {product?"Edit Product":"New Product"}
          <button className="adm-btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="adm-form-grid">
          {/* Name */}
          <div className="adm-field adm-form-full">
            <label className="adm-label">Product Name *</label>
            <input className="adm-input" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Python Programming E-Book"/>
          </div>
          {/* Category + Sort */}
          <div className="adm-field">
            <label className="adm-label">Category</label>
            <select className="adm-select" value={form.category} onChange={e=>set("category",e.target.value)}>
              {PROD_CATS.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="adm-field">
            <label className="adm-label">Sort Order</label>
            <input className="adm-input" type="number" value={form.sort_order} onChange={e=>set("sort_order",+e.target.value)}/>
          </div>
          {/* Price */}
          <div className="adm-field">
            <label className="adm-label">Price (PKR) *</label>
            <input className="adm-input" type="number" value={form.price} onChange={e=>set("price",e.target.value)} placeholder="999"/>
          </div>
          <div className="adm-field">
            <label className="adm-label">Original Price (for discount — optional)</label>
            <input className="adm-input" type="number" value={form.original_price||""} onChange={e=>set("original_price",e.target.value)} placeholder="1500"/>
          </div>
          {/* Stock */}
          <div className="adm-field">
            <label className="adm-label">Stock (leave blank = unlimited)</label>
            <input className="adm-input" type="number" value={form.stock||""} onChange={e=>set("stock",e.target.value)} placeholder="Unlimited"/>
          </div>
          {/* Badge */}
          <div className="adm-field">
            <label className="adm-label">Badge Text (optional)</label>
            <input className="adm-input" value={form.badge||""} onChange={e=>set("badge",e.target.value)} placeholder="Best Seller, New, Limited Stock…"/>
          </div>
          {/* Badge color */}
          <div className="adm-field adm-form-full">
            <label className="adm-label">Badge Color</label>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",paddingTop:4}}>
              {BADGE_COLORS.map(col=>(
                <div key={col} onClick={()=>set("badge_color",col)}
                  style={{width:26,height:26,borderRadius:"50%",background:col,cursor:"pointer",
                    border:`2px solid ${form.badge_color===col?"#fff":"transparent"}`,
                    transform:form.badge_color===col?"scale(1.2)":"scale(1)",transition:"all .15s"}}/>
              ))}
              <input type="color" value={form.badge_color} onChange={e=>set("badge_color",e.target.value)}
                style={{width:32,height:32,padding:2,border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,cursor:"pointer"}}/>
            </div>
          </div>
          {/* Description */}
          <div className="adm-field adm-form-full">
            <label className="adm-label">Description</label>
            <textarea className="adm-textarea" rows={3} value={form.description||""} onChange={e=>set("description",e.target.value)} placeholder="What is this product? Who is it for?"/>
          </div>
          {/* Images */}
          <div className="adm-field adm-form-full">
            <label className="adm-label">Image URLs</label>
            {form.images.map((url,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
                <input className="adm-input" value={url} onChange={e=>setImg(i,e.target.value)} placeholder={`Image ${i+1} URL`} style={{flex:1}}/>
                {url && <img src={url} alt="" style={{width:48,height:36,objectFit:"cover",borderRadius:6,flexShrink:0}} onError={e=>e.target.style.display="none"}/>}
                {form.images.length>1 && <button className="adm-btn-icon del" onClick={()=>delImg(i)}>✕</button>}
              </div>
            ))}
            {form.images.length<6 && (
              <button className="adm-btn adm-btn-ghost" style={{fontSize:10,padding:"5px 14px"}} onClick={addImg}>+ Add Image</button>
            )}
          </div>
          {/* Features */}
          <div className="adm-field adm-form-full">
            <label className="adm-label">Features / What's Included (bullet points)</label>
            {form.features.map((feat,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
                <input className="adm-input" value={feat} onChange={e=>setFeat(i,e.target.value)} placeholder={`Feature ${i+1}`} style={{flex:1}}/>
                {form.features.length>1 && <button className="adm-btn-icon del" onClick={()=>delFeat(i)}>✕</button>}
              </div>
            ))}
            <button className="adm-btn adm-btn-ghost" style={{fontSize:10,padding:"5px 14px"}} onClick={addFeat}>+ Add Feature</button>
          </div>
          {/* Buy link */}
          <div className="adm-field adm-form-full">
            <label className="adm-label">Buy Link (WhatsApp link or checkout URL)</label>
            <input className="adm-input" value={form.buy_link||""} onChange={e=>set("buy_link",e.target.value)}
              placeholder="https://wa.me/923001234567?text=I want to buy..."/>
          </div>
          {/* Toggles */}
          <div className="adm-field">
            <div className="adm-toggle-row">
              <button className={`adm-toggle${form.is_featured?" on":""}`} onClick={()=>set("is_featured",!form.is_featured)} type="button"/>
              <span style={{fontSize:12}}>{form.is_featured?"Featured — shown at top":"Regular product"}</span>
            </div>
          </div>
          <div className="adm-field">
            <div className="adm-toggle-row">
              <button className={`adm-toggle${form.is_published?" on":""}`} onClick={()=>set("is_published",!form.is_published)} type="button"/>
              <span style={{fontSize:12}}>{form.is_published?"Published":"Draft"}</span>
            </div>
          </div>
        </div>
        <div className="adm-form-footer">
          <button className="adm-btn adm-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn-primary" disabled={busy||!form.name||!form.price} onClick={save}>
            {busy?"Saving…":(product?"Save Changes":"Add Product")}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── PRODUCTS TAB ───────────────────────────────────────────────── */
const ProductsTab = ({ showToast }) => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*")
      .order("sort_order",{ascending:true}).order("created_at",{ascending:false});
    if (error) showToast(error.message,true); else setProducts(data||[]);
    setLoading(false);
  },[showToast]);

  useEffect(()=>{ fetch(); },[fetch]);

  const del = async () => {
    const {error} = await supabase.from("products").delete().eq("id",modal.product.id);
    if (error) showToast(error.message,true); else { showToast("Product deleted"); fetch(); }
    setModal(null);
  };

  const togglePub = async (p) => {
    const {error} = await supabase.from("products").update({is_published:!p.is_published}).eq("id",p.id);
    if (error) showToast(error.message,true); else { showToast(p.is_published?"Unpublished":"Published"); fetch(); }
  };

  const fmt = (n) => `PKR ${Number(n).toLocaleString()}`;

  return (
    <>
      <div className="adm-actions">
        <div className="adm-stat">🛒 {products.length} Total</div>
        <div className="adm-stat">✅ {products.filter(p=>p.is_published).length} Published</div>
        <div className="adm-stat">⭐ {products.filter(p=>p.is_featured).length} Featured</div>
        <div style={{marginLeft:"auto"}}>
          <button className="adm-btn adm-btn-primary" onClick={()=>setModal({mode:"add"})}>+ Add Product</button>
        </div>
      </div>

      <div className="adm-table-wrap">
        {loading ? <div className="adm-loader"><span/><span/><span/></div>
        : products.length===0 ? (
          <div className="adm-empty"><div className="adm-empty-icon">🛒</div>No products yet.</div>
        ) : (
          <table>
            <thead><tr>
              <th style={{width:80}}>Image</th><th>Name</th><th>Category</th>
              <th>Price</th><th>Badge</th><th>Stock</th><th>Featured</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {products.map(p=>(
                <tr key={p.id}>
                  <td className="adm-thumb-cell">
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt="" style={{width:64,height:40,objectFit:"cover",borderRadius:6}}/>
                      : <div className="adm-thumb-placeholder">📦</div>
                    }
                  </td>
                  <td>
                    <div style={{fontWeight:700,marginBottom:2}}>{p.name}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{fmt(p.price)}{p.original_price?` · was ${fmt(p.original_price)}`:""}</div>
                  </td>
                  <td><span className="adm-tag" style={{background:"rgba(255,165,0,0.15)",color:"#ffa500"}}>{p.category}</span></td>
                  <td style={{fontFamily:"monospace",fontWeight:700,color:"#ffa500",fontSize:13}}>{fmt(p.price)}</td>
                  <td>
                    {p.badge
                      ? <span className="adm-tag" style={{background:p.badge_color||"#ffa500",color:"#07070f"}}>{p.badge}</span>
                      : <span style={{color:"rgba(255,255,255,0.15)"}}>—</span>
                    }
                  </td>
                  <td style={{color:"rgba(255,255,255,0.4)",fontSize:11.5}}>{p.stock==null?"∞":p.stock}</td>
                  <td style={{textAlign:"center"}}>{p.is_featured?<span style={{color:"#ffd700",fontSize:14}}>⭐</span>:<span style={{color:"rgba(255,255,255,0.1)"}}>—</span>}</td>
                  <td>
                    <div className="adm-published" style={{cursor:"pointer"}} onClick={()=>togglePub(p)}>
                      <div className="adm-pub-dot" style={{background:p.is_published?"#22c55e":"#555"}}/>
                      <span style={{color:p.is_published?"#22c55e":"rgba(255,255,255,0.3)"}}>{p.is_published?"Published":"Draft"}</span>
                    </div>
                  </td>
                  <td>
                    <div className="adm-row-btns">
                      <button className="adm-btn-icon" onClick={()=>setModal({mode:"edit",product:p})}>✏️</button>
                      <button className="adm-btn-icon del" onClick={()=>setModal({mode:"delete",product:p})}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal?.mode==="add"    && <ProductModal onSave={()=>{showToast("Product added!");fetch();setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.mode==="edit"   && <ProductModal product={modal.product} onSave={()=>{showToast("Saved!");fetch();setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.mode==="delete" && (
        <div className="adm-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="adm-modal" style={{maxWidth:400,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>🗑️</div>
            <div style={{fontSize:16,fontWeight:700,marginBottom:8}}>Delete product?</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:22}}>{modal.product.name}</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button className="adm-btn adm-btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
              <button className="adm-btn adm-btn-danger" onClick={del}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const AdminPanel = () => {
  const { session, signOut } = useAuth();
  const [tab,   setTab]   = useState("lectures");
  const [toast, setToast] = useState(null);
  const [counts, setCounts] = useState({ lec:null, cert:null, chal:null, blog:null, vr:null, prod:null });

  const showToast = useCallback((msg, err=false) => setToast({ msg, err }), []);

  useEffect(() => {
    Promise.all([
      supabase.from("lectures").select("id",{count:"exact",head:true}),
      supabase.from("certificates").select("id",{count:"exact",head:true}),
      supabase.from("challenges").select("id",{count:"exact",head:true}),
      supabase.from("posts").select("id",{count:"exact",head:true}),
      supabase.from("video_reviews").select("id",{count:"exact",head:true}),
      supabase.from("products").select("id",{count:"exact",head:true}),
    ]).then(([l,c,ch,b,vr,pr]) => setCounts({ lec:l.count, cert:c.count, chal:ch.count, blog:b.count, vr:vr.count, prod:pr.count }));
  }, [toast]);

  return (
    <>
      <style>{css}</style>
      <div className="adm-wrap">
        <div className="adm-top">
          <div className="adm-top-logo">CodeBuild Admin</div>
          <div className="adm-top-right">
            <span style={{fontSize:11,color:"rgba(255,255,255,0.28)"}}>{session?.user?.email}</span>
            <a href="/" style={{fontSize:10,color:"rgba(255,255,255,0.28)",textDecoration:"none",
              padding:"6px 10px",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6}}>
              ← Site
            </a>
            <button className="adm-btn adm-btn-ghost" style={{padding:"6px 14px",fontSize:10}} onClick={signOut}>
              Sign Out
            </button>
          </div>
        </div>

        <div className="adm-body">
          <div className="adm-page-title">Dashboard</div>
          <div className="adm-page-sub">Manage lectures, certificates, challenges, blog posts and video reviews</div>

          <div className="adm-tabs">
            <button className={`adm-tab${tab==="lectures"?" active":""}`} onClick={()=>setTab("lectures")}>
              📹 Lectures {counts.lec!==null&&<span className="adm-tab-badge">{counts.lec}</span>}
            </button>
            <button className={`adm-tab${tab==="certificates"?" active":""}`} onClick={()=>setTab("certificates")}>
              🎓 Certificates {counts.cert!==null&&<span className="adm-tab-badge">{counts.cert}</span>}
            </button>
            <button className={`adm-tab${tab==="challenges"?" active":""}`} onClick={()=>setTab("challenges")}>
              ⚡ Challenges {counts.chal!==null&&<span className="adm-tab-badge">{counts.chal}</span>}
            </button>
            <button className={`adm-tab${tab==="blog"?" active":""}`} onClick={()=>setTab("blog")}>
              📸 Blog {counts.blog!==null&&<span className="adm-tab-badge">{counts.blog}</span>}
            </button>
            <button className={`adm-tab${tab==="reviews"?" active":""}`} onClick={()=>setTab("reviews")}>
              🎬 Reviews {counts.vr!==null&&<span className="adm-tab-badge">{counts.vr}</span>}
            </button>
            <button className={`adm-tab${tab==="products"?" active":""}`} onClick={()=>setTab("products")}>
              🛒 Products {counts.prod!==null&&<span className="adm-tab-badge">{counts.prod}</span>}
            </button>
          </div>

          {tab==="lectures"     && <LecturesTab     showToast={showToast}/>}
          {tab==="certificates" && <CertificatesTab showToast={showToast}/>}
          {tab==="challenges"   && <ChallengesTab   showToast={showToast}/>}
          {tab==="blog"          && <BlogTab          showToast={showToast}/>}
          {tab==="reviews"       && <VideoReviewsTab  showToast={showToast}/>}
          {tab==="products"      && <ProductsTab      showToast={showToast}/>}
        </div>

        {toast && <Toast msg={toast.msg} err={toast.err} onDone={()=>setToast(null)}/>}
      </div>
    </>
  );
};

export default AdminPanel;