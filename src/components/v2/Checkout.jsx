import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./v2.css";
import { supabase } from "../supabase/SupabaseClient";
import { PAYMENT_ACCOUNTS, DELIVERY, SITE } from "../../config/siteConfig";
import { JpegDrop, Tick, validateJpeg, uploadProof, sendWeb3 } from "./shared";
import { fmt, isPhysical } from "./ProductDetail";
import { useSeo } from "./seo";

const addWorkingDays = (d, n) => { const x = new Date(d); while (n > 0) { x.setDate(x.getDate() + 1); if (x.getDay() !== 0 && x.getDay() !== 6) n--; } return x; };
const dFmt = (d) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

const Checkout = () => {
  const [params] = useSearchParams();
  const pid = params.get("p");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [f, setF] = useState({ name: "", phone: "", email: "", address: "", city: "", qty: 1 });
  const [file, setFile] = useState(null);
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState(null);
  const [serverErr, setServerErr] = useState("");
  useSeo({ title: "Checkout", description: "Complete your CodeBuild Academy store order.", path: "/checkout", noindex: true });

  useEffect(() => {
    if (!pid) { setLoading(false); return; }
    supabase.from("products").select("*").eq("id", pid).eq("is_published", true).single()
      .then(({ data }) => { setProduct(data || null); setLoading(false); }, () => setLoading(false));
  }, [pid]);

  const physical = isPhysical(product);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const qty = Math.max(1, Math.min(Number(f.qty) || 1, product?.stock ? product.stock : 10));
  const total = product ? product.price * qty : 0;
  const accounts = PAYMENT_ACCOUNTS.filter(a => a.number);
  const img = product?.images?.filter(Boolean)[0];

  const onFile = async (fl) => {
    if (!fl) return setFile(null);
    const m = await validateJpeg(fl);
    if (m) { setFile(null); return setErrs(e => ({ ...e, file: m })); }
    setErrs(e => ({ ...e, file: "" })); setFile(fl);
  };

  const submit = async (ev) => {
    ev.preventDefault(); setServerErr("");
    const e = {};
    if (f.name.trim().length < 3) e.name = "Please enter your full name.";
    if (f.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid WhatsApp number.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address.";
    if (physical && f.address.trim().length < 8) e.address = "Enter your full delivery address.";
    if (physical && !f.city.trim()) e.city = "Enter your city.";
    const fm = await validateJpeg(file); if (fm) e.file = fm;
    setErrs(e); if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const ref = "CB-" + Date.now().toString(36).toUpperCase().slice(-6);
      const proofUrl = await uploadProof(file, "orders");
      const data = await sendWeb3({
        subject: `New order ${ref}: ${product.name} × ${qty}`, from_name: "CodeBuild Store",
        order_ref: ref, product: product.name, quantity: qty, total: fmt(total),
        name: f.name, whatsapp: f.phone, email: f.email, address: physical ? `${f.address}, ${f.city}` : "Digital product – no address",
        payment_screenshot: proofUrl || "(attached to this email)",
      }, proofUrl ? null : file);
      if (!data.success) throw new Error(data.message || "We could not place your order.");
      supabase.from("orders").insert([{ order_ref: ref, product_id: product.id, product_name: product.name, quantity: qty, total, customer_name: f.name, whatsapp: f.phone, email: f.email, address: physical ? `${f.address}, ${f.city}` : null, payment_proof_url: proofUrl || null, status: "pending_verification" }]).then(() => {}, () => {});
      const [lo, hi] = DELIVERY.physicalDays; const now = new Date();
      setOrder({ ref, eta: physical ? `${dFmt(addWorkingDays(now, lo))} – ${dFmt(addWorkingDays(now, hi))}` : product.delivery_type === "service" ? "We will contact you on WhatsApp to schedule" : "Within a few hours of payment verification", physical });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) { setServerErr(err.message || "Something went wrong. Please try again."); }
    setBusy(false);
  };

  if (loading) return <div className="v2 co"><div className="v2-wrap"><p>Loading…</p></div></div>;
  if (!product) return <div className="v2 co"><div className="v2-wrap"><div className="co-card"><h1 className="v2-h2">Product not found</h1><p className="v2-lead">This product is unavailable or the link is incorrect.</p><Link className="v2-btn" to="/products">Back to store</Link></div></div></div>;

  if (order) return (
    <div className="v2 co"><div className="v2-wrap" style={{ maxWidth: 720 }}>
      <div className="co-card" style={{ textAlign: "center" }} role="status">
        <Tick />
        <h1 className="v2-h2" style={{ margin: "18px 0 8px" }}>Order placed</h1>
        <p className="v2-lead" style={{ margin: "0 auto" }}>Thank you, {f.name.split(" ")[0]}. Your payment screenshot is with our team for verification.</p>
        <div style={{ margin: "22px auto 4px", display: "inline-block", padding: "10px 22px", border: "1px dashed var(--cb-accent)", borderRadius: 4 }}>Order reference <strong style={{ color: "var(--cb-accent)", letterSpacing: ".1em", marginLeft: 8 }}>{order.ref}</strong></div>
        <div style={{ margin: "18px 0 0", fontSize: 18 }}>Estimated {order.physical ? "delivery" : "access"}: <strong>{order.eta}</strong></div>
        <ul className="co-timeline">
          <li className="done"><b>Order received</b><span>{product.name} × {qty} · {fmt(total)}</span></li>
          <li><b>Payment verification</b><span>{DELIVERY.note}</span></li>
          <li><b>{order.physical ? "Packed and dispatched" : "Access sent"}</b><span>{order.physical ? `We confirm on WhatsApp (${f.phone}) with tracking details.` : DELIVERY.digital}</span></li>
        </ul>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="v2-btn" to="/products">Continue shopping</Link>
          <a className="v2-btn ghost" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hi, I placed order ${order.ref} for ${product.name}.`)}`}>Chat on WhatsApp</a>
        </div>
      </div>
    </div></div>
  );

  return (
    <div className="v2 co">
      <div className="v2-wrap">
        <nav className="co-crumbs" aria-label="Breadcrumb"><Link to="/products">Store</Link><span>/</span><span style={{ color: "#fff" }}>Checkout</span></nav>
        <div className="co-grid">
          <form className="co-card" onSubmit={submit} noValidate>
            <h1 className="v2-h2" style={{ fontSize: 44, marginBottom: 6 }}>Checkout</h1>
            <p style={{ color: "var(--cb-mute)", marginTop: 0 }}>Three steps: your details, pay, upload the screenshot.</p>

            <div className="enr-step"><i>1</i> Your details</div>
            <div className="v2-field"><label className="v2-label" htmlFor="c-n">Full name</label><input id="c-n" className={`v2-input${errs.name ? " err" : ""}`} value={f.name} onChange={e => set("name", e.target.value)} autoComplete="name" />{errs.name && <div className="v2-err">{errs.name}</div>}</div>
            <div className="v2-row">
              <div className="v2-field"><label className="v2-label" htmlFor="c-w">WhatsApp number</label><input id="c-w" type="tel" className={`v2-input${errs.phone ? " err" : ""}`} value={f.phone} onChange={e => set("phone", e.target.value)} placeholder="+92 300 0000000" autoComplete="tel" />{errs.phone && <div className="v2-err">{errs.phone}</div>}</div>
              <div className="v2-field"><label className="v2-label" htmlFor="c-e">Email</label><input id="c-e" type="email" className={`v2-input${errs.email ? " err" : ""}`} value={f.email} onChange={e => set("email", e.target.value)} autoComplete="email" />{errs.email && <div className="v2-err">{errs.email}</div>}</div>
            </div>
            {physical && <>
              <div className="v2-field"><label className="v2-label" htmlFor="c-a">Delivery address</label><input id="c-a" className={`v2-input${errs.address ? " err" : ""}`} value={f.address} onChange={e => set("address", e.target.value)} autoComplete="street-address" />{errs.address && <div className="v2-err">{errs.address}</div>}</div>
              <div className="v2-field"><label className="v2-label" htmlFor="c-c">City</label><input id="c-c" className={`v2-input${errs.city ? " err" : ""}`} value={f.city} onChange={e => set("city", e.target.value)} autoComplete="address-level2" />{errs.city && <div className="v2-err">{errs.city}</div>}</div></>}

            <div className="enr-step"><i>2</i> Pay {fmt(total)}</div>
            {accounts.length > 0 && <div className="pay-box">{accounts.map(a => <div className="pay-row" key={a.method}><b>{a.method}</b><span>{a.title}{a.bank ? ` · ${a.bank}` : ""} · {a.number}</span></div>)}</div>}

            <div className="enr-step"><i>3</i> Upload payment screenshot</div>
            <JpegDrop file={file} onFile={onFile} error={errs.file} id="c-proof" />

            {serverErr && <div className="v2-err" role="alert" style={{ marginTop: 14 }}>{serverErr}</div>}
            <button className="v2-btn block" type="submit" disabled={busy} style={{ marginTop: 24 }}>{busy ? "Placing order…" : `Place order · ${fmt(total)}`}</button>
            <p className="enr-note">We never ask for card numbers or passwords. Estimated {physical ? `delivery ${DELIVERY.physicalDays[0]}–${DELIVERY.physicalDays[1]} working days after verification` : "access within hours of verification"}.</p>
          </form>

          <aside className="co-card co-sum" aria-label="Order summary">
            <div className="co-item">{img && <img src={img} alt={product.name} />}<div><strong style={{ fontSize: 18 }}>{product.name}</strong><div style={{ color: "var(--cb-dim)", fontSize: 14 }}>{product.category}</div></div></div>
            <div className="co-line"><span>Price</span><span>{fmt(product.price)}</span></div>
            <div className="co-line"><span>Quantity</span><input aria-label="Quantity" type="number" min="1" max={product.stock || 10} value={f.qty} onChange={e => set("qty", e.target.value)} className="v2-input" style={{ width: 80, padding: "6px 10px" }} /></div>
            <div className="co-line"><span>Delivery</span><span>{physical ? "Quoted on WhatsApp" : "Digital – free"}</span></div>
            <div className="co-line total"><span>Total</span><span>{fmt(total)}</span></div>
          </aside>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
