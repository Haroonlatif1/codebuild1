import React, { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "./supabase/SupabaseClient";

/* Admin tabs for the v2 features: Enrollments, Orders, Product Reviews.
   Re-uses the existing adm-* styles from Adminpanel.jsx. */

const ENR_STATUS = ["new", "contacted", "payment verified", "enrolled", "rejected"];
const ORD_STATUS = ["pending_verification", "verified", "dispatched", "delivered", "cancelled"];
const COLORS = { new: "#00d4ff", contacted: "#a855f7", "payment verified": "#22c55e", enrolled: "#22c55e", rejected: "#ef4444",
  pending_verification: "#ffa500", verified: "#22c55e", dispatched: "#00d4ff", delivered: "#22c55e", cancelled: "#ef4444" };
const nice = (s) => (s || "").replace(/_/g, " ");
const fmtDate = (d) => d ? new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
const waLink = (n, msg) => `https://wa.me/${String(n || "").replace(/\D/g, "").replace(/^0/, "92")}?text=${encodeURIComponent(msg)}`;

const StatusSelect = ({ value, options, onChange }) => (
  <select className="adm-input" value={value || options[0]} onChange={e => onChange(e.target.value)}
    style={{ padding: "5px 8px", fontSize: 11, width: "auto", color: COLORS[value] || "#fff", fontWeight: 700 }}>
    {options.map(o => <option key={o} value={o}>{nice(o)}</option>)}
  </select>
);

const downloadCsv = (name, rows) => {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...rows.map(r => cols.map(c => esc(r[c])).join(","))].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = name; a.click();
};

const ProofLink = ({ url }) => url
  ? <a href={url} target="_blank" rel="noopener noreferrer" title="Open payment screenshot">
      <img src={url} alt="Payment screenshot" style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(255,255,255,.12)" }} />
    </a>
  : <span style={{ color: "rgba(255,255,255,.2)", fontSize: 11 }}>in email</span>;

/* generic loader + delete confirm */
const useTable = (table, showToast, order = "created_at") => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table).select("*").order(order, { ascending: false });
    if (error) showToast(`${error.message} — run the latest supabase_setup.sql`, true); else setRows(data || []);
    setLoading(false);
  }, [table, order, showToast]);
  useEffect(() => { load(); }, [load]);
  const update = async (id, patch, msg = "Updated") => {
    const { error } = await supabase.from(table).update(patch).eq("id", id);
    if (error) showToast(error.message, true); else { showToast(msg); setRows(r => r.map(x => x.id === id ? { ...x, ...patch } : x)); }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this record permanently?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) showToast(error.message, true); else { showToast("Deleted"); setRows(r => r.filter(x => x.id !== id)); }
  };
  return { rows, loading, load, update, remove };
};

const Search = ({ value, onChange, placeholder }) => (
  <input className="adm-input" style={{ maxWidth: 260, padding: "7px 12px" }} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
);

/* ─── ENROLLMENTS ─── */
export const EnrollmentsTab = ({ showToast }) => {
  const { rows, loading, load, update, remove } = useTable("enrollments", showToast);
  const [q, setQ] = useState(""); const [st, setSt] = useState("all");
  const list = useMemo(() => rows.filter(r =>
    (st === "all" || (r.status || "new") === st) &&
    `${r.name} ${r.email} ${r.phone} ${r.course} ${r.city}`.toLowerCase().includes(q.toLowerCase())), [rows, q, st]);
  return (
    <>
      <div className="adm-actions">
        <div className="adm-stat">{rows.length} Total</div>
        <div className="adm-stat">{rows.filter(r => (r.status || "new") === "new").length} New</div>
        <div className="adm-stat">{rows.filter(r => r.status === "enrolled").length} Enrolled</div>
        <Search value={q} onChange={setQ} placeholder="Search name, phone, course…" />
        <select className="adm-input" style={{ width: "auto", padding: "7px 10px" }} value={st} onChange={e => setSt(e.target.value)}>
          <option value="all">All statuses</option>{ENR_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className="adm-btn adm-btn-ghost" onClick={load}>Refresh</button>
          <button className="adm-btn adm-btn-primary" onClick={() => downloadCsv("enrollments.csv", list.map(({ id, payment_proof_url, ...r }) => ({ ...r, payment_proof_url })))}>Export CSV</button>
        </div>
      </div>
      <div className="adm-table-wrap">
        {loading ? <div className="adm-loader"><span /><span /><span /></div> : list.length === 0 ? <div className="adm-empty">No enrollments found.</div> : (
          <table>
            <thead><tr><th>Student</th><th>Age</th><th>Course</th><th>Contact</th><th>Proof</th><th>Status</th><th>Received</th><th>Actions</th></tr></thead>
            <tbody>{list.map(r => (
              <tr key={r.id}>
                <td><div style={{ fontWeight: 700 }}>{r.name}</div><div style={{ fontSize: 10, color: "rgba(255,255,255,.3)" }}>{r.city || ""}</div></td>
                <td>{r.age}</td>
                <td><span className="adm-tag" style={{ background: "rgba(255,165,0,.15)", color: "#ffa500" }}>{r.course}</span></td>
                <td style={{ fontSize: 12 }}>{r.phone}<br /><span style={{ color: "rgba(255,255,255,.35)" }}>{r.email}</span></td>
                <td><ProofLink url={r.payment_proof_url} /></td>
                <td><StatusSelect value={r.status || "new"} options={ENR_STATUS} onChange={v => update(r.id, { status: v })} /></td>
                <td style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>{fmtDate(r.created_at)}</td>
                <td><div className="adm-row-btns">
                  <a className="adm-btn-icon" title="WhatsApp" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", fontSize: 10, fontWeight: 800 }}
                    href={waLink(r.phone, `Assalam o Alaikum ${r.name}, this is CodeBuild Academy about your enrollment in ${r.course}.`)}>WA</a>
                  <button className="adm-btn-icon del" title="Delete" onClick={() => remove(r.id)}>✕</button>
                </div></td>
              </tr>))}</tbody>
          </table>)}
      </div>
    </>
  );
};

/* ─── ORDERS ─── */
export const OrdersTab = ({ showToast }) => {
  const { rows, loading, load, update, remove } = useTable("orders", showToast);
  const [q, setQ] = useState(""); const [st, setSt] = useState("all");
  const list = useMemo(() => rows.filter(r =>
    (st === "all" || r.status === st) &&
    `${r.order_ref} ${r.customer_name} ${r.email} ${r.whatsapp} ${r.product_name}`.toLowerCase().includes(q.toLowerCase())), [rows, q, st]);
  const revenue = rows.filter(r => ["verified", "dispatched", "delivered"].includes(r.status)).reduce((s, r) => s + Number(r.total || 0), 0);
  const onStatus = (r, v) => update(r.id, { status: v }, `Order ${r.order_ref} → ${nice(v)}`);
  return (
    <>
      <div className="adm-actions">
        <div className="adm-stat">{rows.length} Orders</div>
        <div className="adm-stat">{rows.filter(r => r.status === "pending_verification").length} Pending</div>
        <div className="adm-stat">PKR {revenue.toLocaleString()} Verified</div>
        <Search value={q} onChange={setQ} placeholder="Search ref, name, product…" />
        <select className="adm-input" style={{ width: "auto", padding: "7px 10px" }} value={st} onChange={e => setSt(e.target.value)}>
          <option value="all">All statuses</option>{ORD_STATUS.map(s => <option key={s} value={s}>{nice(s)}</option>)}
        </select>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className="adm-btn adm-btn-ghost" onClick={load}>Refresh</button>
          <button className="adm-btn adm-btn-primary" onClick={() => downloadCsv("orders.csv", list.map(({ id, ...r }) => r))}>Export CSV</button>
        </div>
      </div>
      <div className="adm-table-wrap">
        {loading ? <div className="adm-loader"><span /><span /><span /></div> : list.length === 0 ? <div className="adm-empty">No orders found.</div> : (
          <table>
            <thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Total</th><th>Proof</th><th>Status</th><th>Placed</th><th>Actions</th></tr></thead>
            <tbody>{list.map(r => (
              <tr key={r.id}>
                <td style={{ fontFamily: "monospace", fontWeight: 700, color: "#ffa500" }}>{r.order_ref}</td>
                <td><div style={{ fontWeight: 700 }}>{r.customer_name}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>{r.whatsapp}<br />{r.email}</div>
                  {r.address && <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", maxWidth: 200 }}>{r.address}</div>}</td>
                <td style={{ fontSize: 12 }}>{r.product_name} × {r.quantity}</td>
                <td style={{ fontFamily: "monospace", fontWeight: 700 }}>PKR {Number(r.total).toLocaleString()}</td>
                <td><ProofLink url={r.payment_proof_url} /></td>
                <td><StatusSelect value={r.status} options={ORD_STATUS} onChange={v => onStatus(r, v)} /></td>
                <td style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>{fmtDate(r.created_at)}</td>
                <td><div className="adm-row-btns">
                  <a className="adm-btn-icon" title="WhatsApp customer" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", fontSize: 10, fontWeight: 800 }}
                    href={waLink(r.whatsapp, `Hi ${r.customer_name}, your CodeBuild order ${r.order_ref} (${r.product_name}) is now: ${nice(r.status)}.`)}>WA</a>
                  <button className="adm-btn-icon del" title="Delete" onClick={() => remove(r.id)}>✕</button>
                </div></td>
              </tr>))}</tbody>
          </table>)}
      </div>
    </>
  );
};

/* ─── PRODUCT REVIEWS (moderation) ─── */
export const ProductReviewsTab = ({ showToast }) => {
  const { rows, loading, load, update, remove } = useTable("product_reviews", showToast);
  const [products, setProducts] = useState({});
  const [filter, setFilter] = useState("pending");
  useEffect(() => { supabase.from("products").select("id,name").then(({ data }) => setProducts(Object.fromEntries((data || []).map(p => [p.id, p.name])))); }, []);
  const list = rows.filter(r => filter === "all" || (filter === "pending" ? !r.approved : r.approved));
  return (
    <>
      <div className="adm-actions">
        <div className="adm-stat">{rows.filter(r => !r.approved).length} Pending</div>
        <div className="adm-stat">{rows.filter(r => r.approved).length} Approved</div>
        {["pending", "approved", "all"].map(f => <button key={f} className={`adm-btn ${filter === f ? "adm-btn-primary" : "adm-btn-ghost"}`} onClick={() => setFilter(f)}>{f}</button>)}
        <div style={{ marginLeft: "auto" }}><button className="adm-btn adm-btn-ghost" onClick={load}>Refresh</button></div>
      </div>
      <div className="adm-table-wrap">
        {loading ? <div className="adm-loader"><span /><span /><span /></div> : list.length === 0 ? <div className="adm-empty">No {filter} reviews.</div> : (
          <table>
            <thead><tr><th>Product</th><th>Reviewer</th><th>Rating</th><th>Comment</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{list.map(r => (
              <tr key={r.id}>
                <td style={{ fontSize: 12 }}>{products[r.product_id] || "(deleted product)"}</td>
                <td style={{ fontWeight: 700 }}>{r.name}{r.verified && <div style={{ fontSize: 9, color: "#22c55e", letterSpacing: 1 }}>VERIFIED BUYER</div>}</td>
                <td style={{ color: "#ffa500", fontWeight: 800 }}>{"★".repeat(r.rating)}<span style={{ color: "rgba(255,255,255,.15)" }}>{"★".repeat(5 - r.rating)}</span></td>
                <td style={{ maxWidth: 320, fontSize: 12, lineHeight: 1.5, whiteSpace: "normal" }}>{r.comment}</td>
                <td style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>{fmtDate(r.created_at)}</td>
                <td><span className="adm-tag" style={{ background: r.approved ? "rgba(34,197,94,.15)" : "rgba(255,165,0,.15)", color: r.approved ? "#22c55e" : "#ffa500" }}>{r.approved ? "Approved" : "Pending"}</span></td>
                <td><div className="adm-row-btns">
                  <button className="adm-btn adm-btn-ghost" style={{ padding: "4px 10px", fontSize: 10 }} onClick={() => update(r.id, { approved: !r.approved }, r.approved ? "Hidden" : "Approved & live")}>{r.approved ? "Hide" : "Approve"}</button>
                  <button className="adm-btn adm-btn-ghost" style={{ padding: "4px 10px", fontSize: 10 }} onClick={() => update(r.id, { verified: !r.verified })}>{r.verified ? "Unverify" : "Verified"}</button>
                  <button className="adm-btn-icon del" onClick={() => remove(r.id)}>✕</button>
                </div></td>
              </tr>))}</tbody>
          </table>)}
      </div>
    </>
  );
};

/* ─── Media upload button (images / videos → Supabase Storage bucket "site-media") ─── */
export const MediaUploadButton = ({ onUploaded, accept = "image/*", folder = "misc", label = "Upload", showToast, maxMb = 50 }) => {
  const [busy, setBusy] = useState(false);
  const pick = async (e) => {
    const f = e.target.files[0]; e.target.value = "";
    if (!f) return;
    if (f.size > maxMb * 1024 * 1024) return showToast?.(`File is over ${maxMb} MB. Use a YouTube link for large videos.`, true);
    setBusy(true);
    const ext = (f.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const { error } = await supabase.storage.from("site-media").upload(path, f, { contentType: f.type });
    setBusy(false);
    if (error) return showToast?.(`${error.message} — run the latest supabase_setup.sql`, true);
    onUploaded(supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl);
    showToast?.("Uploaded");
  };
  return (
    <label className="adm-btn adm-btn-ghost" style={{ fontSize: 10, padding: "5px 14px", cursor: busy ? "wait" : "pointer", whiteSpace: "nowrap", margin: 0 }}>
      {busy ? "Uploading…" : label}
      <input type="file" accept={accept} onChange={pick} hidden disabled={busy} />
    </label>
  );
};

/* ─── SITE SETTINGS: demo video + "why choose us" points ─── */

export const SiteSettingsTab = ({ showToast }) => {
  const [demo, setDemo] = useState({ enabled: true, title: "", url: "", poster: "", description: "", duration: "" });
  const [why, setWhy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");

  useEffect(() => {
    supabase.from("site_settings").select("*").then(({ data, error }) => {
      if (error) showToast(`${error.message} — run the latest supabase_setup.sql`, true);
      const m = Object.fromEntries((data || []).map(r => [r.key, r.value]));
      if (m.demo_video) setDemo(d => ({ ...d, ...m.demo_video }));
      if (Array.isArray(m.why_choose?.items)) setWhy(m.why_choose.items);
      setLoading(false);
    });
  }, [showToast]);

  const save = async (key, value, label) => {
    setBusy(key);
    const { error } = await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() });
    setBusy("");
    if (error) showToast(error.message, true); else showToast(`${label} saved — live on the site`);
  };
  const setW = (i, k, v) => setWhy(w => w.map((x, j) => j === i ? { ...x, [k]: v } : x));

  if (loading) return <div className="adm-loader"><span /><span /><span /></div>;
  return (
    <div style={{ display: "grid", gap: 28, maxWidth: 860 }}>
      <div className="adm-table-wrap" style={{ padding: 24 }}>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>Home page — Demo session video</div>
        <div style={{ color: "rgba(255,255,255,.4)", fontSize: 12, marginBottom: 18 }}>One full-width video shown under the enrollment section. Paste a YouTube / Facebook link, a direct .mp4 link, or upload an .mp4 (max 50 MB).</div>
        <div className="adm-toggle-row" style={{ marginBottom: 14 }}>
          <button type="button" className={`adm-toggle${demo.enabled ? " on" : ""}`} onClick={() => setDemo({ ...demo, enabled: !demo.enabled })} />
          <span style={{ fontSize: 12 }}>{demo.enabled ? "Visible on the home page" : "Hidden (the section shows a WhatsApp invite instead)"}</span>
        </div>
        <div className="adm-field"><label className="adm-label">Title</label><input className="adm-input" value={demo.title} onChange={e => setDemo({ ...demo, title: e.target.value })} placeholder="Free demo: build your first website" /></div>
        <div className="adm-field"><label className="adm-label">Video link</label>
          <div style={{ display: "flex", gap: 8 }}><input className="adm-input" style={{ flex: 1 }} value={demo.url} onChange={e => setDemo({ ...demo, url: e.target.value })} placeholder="https://www.youtube.com/watch?v=… or https://…/demo.mp4" />
            <MediaUploadButton accept="video/mp4,video/webm" folder="demo" label="Upload .mp4" showToast={showToast} onUploaded={u => setDemo(d => ({ ...d, url: u }))} /></div></div>
        <div className="adm-field"><label className="adm-label">Cover image (optional)</label>
          <div style={{ display: "flex", gap: 8 }}><input className="adm-input" style={{ flex: 1 }} value={demo.poster} onChange={e => setDemo({ ...demo, poster: e.target.value })} placeholder="https://…/cover.jpg" />
            <MediaUploadButton folder="demo" label="Upload image" showToast={showToast} maxMb={5} onUploaded={u => setDemo(d => ({ ...d, poster: u }))} /></div></div>
        <div className="adm-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 12 }}>
          <div className="adm-field"><label className="adm-label">Short description</label><input className="adm-input" value={demo.description} onChange={e => setDemo({ ...demo, description: e.target.value })} placeholder="What the visitor will see in this demo" /></div>
          <div className="adm-field"><label className="adm-label">Duration</label><input className="adm-input" value={demo.duration} onChange={e => setDemo({ ...demo, duration: e.target.value })} placeholder="25 min" /></div>
        </div>
        <button className="adm-btn adm-btn-primary" disabled={busy === "demo_video"} onClick={() => save("demo_video", demo, "Demo video")}>{busy === "demo_video" ? "Saving…" : "Save demo video"}</button>
      </div>

      <div className="adm-table-wrap" style={{ padding: 24 }}>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>“Why people choose us” points</div>
        <div style={{ color: "rgba(255,255,255,.4)", fontSize: 12, marginBottom: 18 }}>Shown on product pages (where enabled) and the About page. Leave the list empty to use the default wording.</div>
        {why.map((w, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: 8, marginBottom: 8 }}>
            <input className="adm-input" value={w.title} onChange={e => setW(i, "title", e.target.value)} placeholder="Heading" />
            <input className="adm-input" value={w.text} onChange={e => setW(i, "text", e.target.value)} placeholder="Explanation" />
            <button className="adm-btn-icon del" onClick={() => setWhy(why.filter((_, j) => j !== i))}>✕</button>
          </div>))}
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button className="adm-btn adm-btn-ghost" onClick={() => setWhy([...why, { title: "", text: "" }])}>+ Add point</button>
          <button className="adm-btn adm-btn-primary" disabled={busy === "why_choose"} onClick={() => save("why_choose", { items: why.filter(w => w.title.trim() && w.text.trim()) }, "Points")}>{busy === "why_choose" ? "Saving…" : "Save points"}</button>
        </div>
      </div>
    </div>
  );
};

/* ─── PRACTICE BANK: extra MCQs / tasks shown on the Practice page (alongside the built-in ones) ─── */
const EMPTY_PRACTICE = { language: "python", level: "easy", kind: "mcq", question: "", code: "", options: ["", "", "", ""], answer: 0, explanation: "",
  title: "", statement: "", starter: "", expected: "", hint: "", solution: "", is_published: true };

const PracticeForm = ({ item, onSave, onClose, showToast }) => {
  const [f, setF] = useState(item ? { ...EMPTY_PRACTICE, ...item, options: item.options?.length === 4 ? item.options : ["", "", "", ""] } : { ...EMPTY_PRACTICE });
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const mcq = f.kind === "mcq";
  const valid = mcq ? f.question.trim() && f.options.every(o => o.trim()) && f.explanation.trim() : f.title.trim() && f.statement.trim();

  const save = async () => {
    if (!valid) return showToast(mcq ? "Fill the question, all 4 options and the explanation" : "Fill the title and the problem statement", true);
    setBusy(true);
    const payload = { language: f.language, level: f.level, kind: f.kind, is_published: f.is_published,
      question: mcq ? f.question : null, code: mcq ? (f.code || null) : null, options: mcq ? f.options : null, answer: mcq ? Number(f.answer) : null, explanation: mcq ? f.explanation : null,
      title: mcq ? null : f.title, statement: mcq ? null : f.statement, starter: mcq ? null : (f.starter || null), expected: mcq ? null : (f.expected || null),
      hint: mcq ? null : (f.hint || null), solution: mcq ? null : (f.solution || null) };
    const { error } = item?.id ? await supabase.from("practice_items").update(payload).eq("id", item.id) : await supabase.from("practice_items").insert([payload]);
    setBusy(false);
    if (error) showToast(`${error.message} — run the latest supabase_setup.sql`, true); else onSave();
  };
  const area = (k, label, rows, ph, mono) => (
    <div className="adm-field adm-form-full"><label className="adm-label">{label}</label>
      <textarea className="adm-input" rows={rows} value={f[k] || ""} onChange={e => set(k, e.target.value)} placeholder={ph} style={mono ? { fontFamily: "monospace" } : null} /></div>);

  return (
    <div className="adm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal" style={{ maxWidth: 720 }}>
        <div className="adm-modal-title">{item ? "Edit practice item" : "New practice item"}<button className="adm-btn-icon" onClick={onClose}>✕</button></div>
        <div className="adm-form-grid">
          <div className="adm-field"><label className="adm-label">Language</label>
            <select className="adm-select" value={f.language} onChange={e => set("language", e.target.value)}><option value="python">Python</option><option value="cpp">C++</option><option value="javascript">JavaScript</option></select></div>
          <div className="adm-field"><label className="adm-label">Level</label>
            <select className="adm-select" value={f.level} onChange={e => set("level", e.target.value)}><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
          <div className="adm-field adm-form-full"><label className="adm-label">Type</label>
            <select className="adm-select" value={f.kind} onChange={e => set("kind", e.target.value)}><option value="mcq">Multiple-choice question</option><option value="task">Coding task (student self-checks)</option></select></div>
          {mcq ? <>
            <div className="adm-field adm-form-full"><label className="adm-label">Question *</label><input className="adm-input" value={f.question} onChange={e => set("question", e.target.value)} placeholder="What does this print?" /></div>
            {area("code", "Code snippet (optional)", 5, "print(type(3.0))", true)}
            <div className="adm-field adm-form-full"><label className="adm-label">Options * — tick the correct one</label>
              {f.options.map((o, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                  <input type="radio" name="correct" checked={Number(f.answer) === i} onChange={() => set("answer", i)} aria-label={`Option ${i + 1} is correct`} />
                  <input className="adm-input" style={{ flex: 1 }} value={o} onChange={e => set("options", f.options.map((x, j) => j === i ? e.target.value : x))} placeholder={`Option ${"ABCD"[i]}`} />
                </div>))}
            </div>
            {area("explanation", "Explanation shown after answering *", 3, "Why the correct answer is right")}
          </> : <>
            <div className="adm-field adm-form-full"><label className="adm-label">Title *</label><input className="adm-input" value={f.title} onChange={e => set("title", e.target.value)} placeholder="Reverse a string" /></div>
            {area("statement", "Problem statement *", 4, "Describe the task, inputs and outputs")}
            {area("starter", "Starter code (optional)", 5, "def solve(x):\n    pass", true)}
            {area("expected", "Expected output / example (optional)", 3, "Input: 3 4\nOutput: 7", true)}
            {area("hint", "Hint (optional)", 2, "")}
            {area("solution", "Reference solution (optional)", 6, "", true)}
          </>}
          <div className="adm-field adm-form-full"><div className="adm-toggle-row"><button type="button" className={`adm-toggle${f.is_published ? " on" : ""}`} onClick={() => set("is_published", !f.is_published)} /><span style={{ fontSize: 12 }}>{f.is_published ? "Published — visible to students" : "Draft"}</span></div></div>
        </div>
        <div className="adm-form-footer"><button className="adm-btn adm-btn-ghost" onClick={onClose}>Cancel</button><button className="adm-btn adm-btn-primary" disabled={busy} onClick={save}>{busy ? "Saving…" : "Save"}</button></div>
      </div>
    </div>
  );
};

export const PracticeBankTab = ({ showToast }) => {
  const { rows, loading, load, update, remove } = useTable("practice_items", showToast);
  const [modal, setModal] = useState(null);
  const [lang, setLang] = useState("all");
  const list = rows.filter(r => lang === "all" || r.language === lang);
  return (
    <>
      <div className="adm-actions">
        <div className="adm-stat">{rows.length} custom items</div>
        <div className="adm-stat">{rows.filter(r => r.is_published).length} published</div>
        <select className="adm-input" style={{ width: "auto", padding: "7px 10px" }} value={lang} onChange={e => setLang(e.target.value)}>
          <option value="all">All languages</option><option value="python">Python</option><option value="cpp">C++</option><option value="javascript">JavaScript</option></select>
        <div style={{ marginLeft: "auto" }}><button className="adm-btn adm-btn-primary" onClick={() => setModal({})}>+ Add practice item</button></div>
      </div>
      <p style={{ color: "rgba(255,255,255,.35)", fontSize: 12, margin: "0 0 14px" }}>The 72 built-in quiz questions and 27 coding tasks are always available. Items you add here appear alongside them on the Practice page.</p>
      <div className="adm-table-wrap">
        {loading ? <div className="adm-loader"><span /><span /><span /></div> : list.length === 0 ? <div className="adm-empty">No custom practice items yet.</div> : (
          <table>
            <thead><tr><th>Language</th><th>Level</th><th>Type</th><th>Content</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{list.map(r => (
              <tr key={r.id}>
                <td><span className="adm-tag" style={{ background: "rgba(255,165,0,.15)", color: "#ffa500" }}>{r.language}</span></td>
                <td style={{ textTransform: "capitalize" }}>{r.level}</td>
                <td>{r.kind === "mcq" ? "Quiz" : "Task"}</td>
                <td style={{ maxWidth: 380, fontSize: 12.5, whiteSpace: "normal" }}>{r.kind === "mcq" ? r.question : r.title}</td>
                <td><div className="adm-published" style={{ cursor: "pointer" }} onClick={() => update(r.id, { is_published: !r.is_published }, r.is_published ? "Unpublished" : "Published")}>
                  <div className="adm-pub-dot" style={{ background: r.is_published ? "#22c55e" : "#555" }} /><span style={{ color: r.is_published ? "#22c55e" : "rgba(255,255,255,.3)" }}>{r.is_published ? "Published" : "Draft"}</span></div></td>
                <td><div className="adm-row-btns"><button className="adm-btn-icon" onClick={() => setModal(r)}>✏️</button><button className="adm-btn-icon del" onClick={() => remove(r.id)}>✕</button></div></td>
              </tr>))}</tbody>
          </table>)}
      </div>
      {modal && <PracticeForm item={modal.id ? modal : null} showToast={showToast} onClose={() => setModal(null)} onSave={() => { showToast("Saved"); setModal(null); load(); }} />}
    </>
  );
};
