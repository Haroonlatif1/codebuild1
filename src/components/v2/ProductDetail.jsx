import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./v2.css";
import { Stars } from "./shared";
import { supabase } from "../supabase/SupabaseClient";

export const fmt = (n) => `PKR ${Number(n).toLocaleString()}`;
export const isPhysical = (p) => p?.delivery_type ? p.delivery_type === "physical" : ["Robotics Kit", "Merchandise"].includes(p?.category);
export const deliveryLabel = (p) => p?.delivery_type === "service" ? "Scheduled with you on WhatsApp" : isPhysical(p) ? "Ships in 3–5 working days" : "Digital · delivered after verification";
export const productPath = (p) => `/products/${p.slug || p.id}`;
export const parseFaqs = (t) => String(t || "").split(/\n\s*\n/).map(b => { const m = b.match(/^\s*Q:\s*([\s\S]*?)\s*\n\s*A:\s*([\s\S]*)$/i); return m ? { q: m[1].trim(), a: m[2].trim() } : null; }).filter(Boolean);

const ytId = (u = "") => (u.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/) || [])[1];

/** specs can be [{label,value}], {label:value}, or "Label: value" lines */
export const parseSpecs = (s) => {
  if (!s) return [];
  if (Array.isArray(s)) return s.map(x => typeof x === "string" ? x.split(/:(.+)/).slice(0, 2) : [x.label, x.value]).filter(r => r[0] && r[1]).map(([label, value]) => ({ label, value }));
  if (typeof s === "object") return Object.entries(s).map(([label, value]) => ({ label, value: String(value) }));
  return String(s).split("\n").map(l => l.split(/:(.+)/)).filter(r => r[0] && r[1]).map(([label, value]) => ({ label: label.trim(), value: value.trim() }));
};
export const parseList = (v) => Array.isArray(v) ? v.filter(Boolean) : String(v || "").split("\n").map(x => x.trim()).filter(Boolean);

/* ── slideshow of images + videos ── */
export const Gallery = ({ product }) => {
  const media = useMemo(() => [
    ...(product.images || []).filter(Boolean).map(src => ({ t: "img", src })),
    ...parseList(product.videos).map(src => ({ t: ytId(src) ? "yt" : "vid", src })),
  ], [product]);
  const [i, setI] = useState(0);
  useEffect(() => setI(0), [product.id]);
  useEffect(() => { // auto-advance on images only
    if (media.length < 2 || media[i]?.t !== "img") return;
    const t = setTimeout(() => setI(x => (x + 1) % media.length), 5000);
    return () => clearTimeout(t);
  }, [i, media]);
  if (!media.length) return <div className="sh-gal" aria-hidden="true" />;
  const go = (d) => setI(x => (x + d + media.length) % media.length);
  const m = media[i];
  return (
    <div>
      <div className="sh-gal">
        {m.t === "img" && <img src={m.src} alt={`${product.name} view ${i + 1}`} />}
        {m.t === "vid" && <video key={m.src} src={m.src} controls playsInline />}
        {m.t === "yt" && <iframe key={m.src} title={`${product.name} video`} src={`https://www.youtube-nocookie.com/embed/${ytId(m.src)}?rel=0`} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen />}
        {media.length > 1 && <>
          <button className="sh-gal-nav l" onClick={() => go(-1)} aria-label="Previous">‹</button>
          <button className="sh-gal-nav r" onClick={() => go(1)} aria-label="Next">›</button>
          <div className="sh-gal-count">{i + 1} / {media.length}</div></>}
      </div>
      {media.length > 1 && (
        <div className="sh-thumbs">
          {media.map((x, k) => (
            <button key={k} className={`sh-thumb${k === i ? " on" : ""}`} onClick={() => setI(k)} aria-label={`Show ${x.t === "img" ? "image" : "video"} ${k + 1}`}>
              {x.t === "img" ? <img src={x.src} alt="" loading="lazy" /> : x.t === "yt" ? <><img src={`https://img.youtube.com/vi/${ytId(x.src)}/default.jpg`} alt="" /><span>VIDEO</span></> : <span>VIDEO</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── reviews ── */
export const useReviews = (productId) => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    let live = true;
    supabase.from("product_reviews").select("*").eq("product_id", productId).eq("approved", true).order("created_at", { ascending: false })
      .then(({ data }) => live && setRows(data || []), () => {});
    return () => { live = false; };
  }, [productId]);
  return rows;
};

const ReviewsTab = ({ product }) => {
  const rows = useReviews(product.id);
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [state, setState] = useState("");
  const avg = rows.length ? rows.reduce((s, r) => s + r.rating, 0) / rows.length : 0;
  const submit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2 || form.comment.trim().length < 10) return setState("Please add your name and at least a short sentence.");
    setState("Sending…");
    const { error } = await supabase.from("product_reviews").insert([{ product_id: product.id, name: form.name.trim(), rating: form.rating, comment: form.comment.trim(), approved: false }]);
    setState(error ? "Could not submit your review right now. Please try again later." : "Thank you! Your review will appear after our team approves it.");
    if (!error) setForm({ name: "", rating: 5, comment: "" });
  };
  return (
    <div>
      {rows.length > 0 ? (
        <>
          <div className="sh-rev-sum">
            <div><div className="sh-rev-big">{avg.toFixed(1)}</div><div style={{ textAlign: "center" }}><Stars value={avg} /></div><div style={{ textAlign: "center", color: "var(--cb-dim)", fontSize: 13 }}>{rows.length} review{rows.length > 1 ? "s" : ""}</div></div>
            <div>{[5, 4, 3, 2, 1].map(n => { const c = rows.filter(r => r.rating === n).length; return <div className="sh-bar" key={n}><span>{n}★</span><i><b style={{ width: `${(c / rows.length) * 100}%` }} /></i><span>{c}</span></div>; })}</div>
          </div>
          {rows.map(r => (
            <article className="sh-rev" key={r.id}>
              <header><span><strong>{r.name}</strong>{r.verified && <span className="sh-ver">Verified buyer</span>}</span><time dateTime={r.created_at}>{new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time></header>
              <Stars value={r.rating} /><p>{r.comment}</p>
            </article>
          ))}
        </>
      ) : <p style={{ color: "var(--cb-mute)" }}>No reviews yet — be the first to review this product.</p>}
      <form className="sh-review-form" onSubmit={submit}>
        <div className="v2-label">Write a review</div>
        <div className="sh-star-pick" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map(n => (
            <button type="button" key={n} role="radio" aria-checked={form.rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setForm({ ...form, rating: n })}>
              <svg viewBox="0 0 20 20"><path d="M10 1.5l2.6 5.6 6 .7-4.5 4.1 1.3 6L10 14.9 4.6 17.9l1.3-6L1.4 7.8l6-.7z" fill={form.rating >= n ? "#ffa500" : "none"} stroke="#ffa500" strokeWidth="1.2" /></svg>
            </button>
          ))}
        </div>
        <div className="v2-field"><input className="v2-input" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} aria-label="Your name" /></div>
        <div className="v2-field"><textarea className="v2-input" rows="3" placeholder="What did you think of it?" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} aria-label="Your review" /></div>
        <button className="v2-btn" type="submit">Submit review</button>
        {state && <div style={{ marginTop: 10, fontSize: 14, color: "var(--cb-mute)" }} role="status">{state}</div>}
      </form>
    </div>
  );
};

/* ── details panel with tabs ── */
export const DetailTabs = ({ product }) => {
  const [tab, setTab] = useState("overview");
  const specs = parseSpecs(product.specs);
  const faqs = parseFaqs(product.faqs);
  const needs = parseList(product.requirements);
  const tabs = [["overview", "Overview"], ...(specs.length ? [["specs", "Specifications"]] : []), ["reviews", "Reviews"], ...(faqs.length ? [["faq", "FAQ"]] : [])];
  return (
    <div>
      <div className="sh-tabs" role="tablist">{tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={`sh-tab${tab === k ? " on" : ""}`} onClick={() => setTab(k)}>{l}</button>)}</div>
      {tab === "overview" && (
        <div>
          {product.description && <p style={{ color: "var(--cb-mute)", fontSize: 16, lineHeight: 1.7, marginTop: 0, whiteSpace: "pre-line" }}>{product.description}</p>}
          {product.features?.length > 0 && <>
            <div className="v2-label" style={{ marginTop: 18 }}>What’s included</div>
            <ul className="sp-ticks">{product.features.map((f, i) => <li key={i}>{f}</li>)}</ul></>}
          {needs.length > 0 && <>
            <div className="v2-label" style={{ marginTop: 22 }}>What you need</div>
            <ul className="sp-ticks">{needs.map((f, i) => <li key={i}>{f}</li>)}</ul></>}
        </div>
      )}
      {tab === "specs" && <table className="sh-spec"><tbody>{specs.map((s, i) => <tr key={i}><th scope="row">{s.label}</th><td>{s.value}</td></tr>)}</tbody></table>}
      {tab === "reviews" && <ReviewsTab product={product} />}
      {tab === "faq" && <div>{faqs.map((f, i) => <details key={i} className="sp-faq"><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>}
    </div>
  );
};

export const BuyLink = ({ product, className = "pr-modal-buy", onClick }) => (
  <Link to={`/checkout?p=${product.id}`} className={className} onClick={onClick}>Buy now · {fmt(product.price)}</Link>
);

export const WhyChoose = ({ items, brand }) => (
  <section className="sp-why" aria-labelledby="why-h">
    <div className="v2-eyebrow">The difference</div>
    <h2 className="v2-h2" id="why-h">Why people choose {brand}</h2>
    <div className="sp-why-grid">
      {items.map((w, i) => (
        <div key={w.title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{w.title}</h3><p>{w.text}</p></div>
      ))}
    </div>
  </section>
);
