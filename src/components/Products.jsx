import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "./supabase/SupabaseClient";
import "./v2/v2.css";
import { Stars } from "./v2/shared";
import { fmt, deliveryLabel, productPath } from "./v2/ProductDetail";
import { Faq } from "./v2/HomeExtras";
import { STORE_FAQS } from "../config/content";
import { useSeo } from "./v2/seo";

const discount = (o, p) => (o ? Math.round(((o - p) / o) * 100) : 0);

const Card = ({ p, rating }) => {
  const img = p.images?.filter(Boolean)[0];
  const d = discount(p.original_price, p.price);
  return (
    <Link to={productPath(p)} className="sp-card">
      <div className="sp-card-img">
        {img ? <img src={img} alt={p.name} loading="lazy" /> : <div className="sp-noimg">{p.category}</div>}
        {p.badge && <span className="sp-badge" style={{ background: p.badge_color || "#ffa500" }}>{p.badge}</span>}
      </div>
      <div className="sp-card-body">
        <div className="sp-cat">{p.category}</div>
        <h3>{p.name}</h3>
        {(p.tagline || p.description) && <p>{p.tagline || p.description}</p>}
        {rating && <div className="sp-rate"><Stars value={rating.avg} /><span>{rating.avg.toFixed(1)} · {rating.n} review{rating.n > 1 ? "s" : ""}</span></div>}
        <div className="sp-price-row">
          <b>{fmt(p.price)}</b>
          {p.original_price && <s>{fmt(p.original_price)}</s>}
          {d > 0 && <em>{d}% off</em>}
        </div>
        <div className="sp-deliv">{deliveryLabel(p)}</div>
      </div>
    </Link>
  );
};

const Products = () => {
  const [params] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [cat, setCat] = useState(params.get("cat") || "All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured");
  useSeo({ title: "Store – E-Books, Robotics Kits & Course Bundles", description: "Shop e-books written by CodeBuild instructors, robotics kits used in class and course bundles. Pay by JazzCash, Easypaisa or bank transfer.", path: "/products" });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("products").select("*").eq("is_published", true)
        .order("is_featured", { ascending: false }).order("sort_order", { ascending: true });
      setProducts(data || []); setLoading(false);
      const { data: rv } = await supabase.from("product_reviews").select("product_id,rating").eq("approved", true);
      const agg = {}; (rv || []).forEach(r => { const a = agg[r.product_id] || (agg[r.product_id] = { s: 0, n: 0 }); a.s += r.rating; a.n++; });
      setRatings(Object.fromEntries(Object.entries(agg).map(([k, v]) => [k, { avg: v.s / v.n, n: v.n }])));
    })();
  }, []);

  const cats = useMemo(() => ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))], [products]);
  const list = useMemo(() => {
    let l = products.filter(p => (cat === "All" || p.category === cat) && `${p.name} ${p.tagline || ""} ${p.description || ""}`.toLowerCase().includes(q.toLowerCase()));
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "rated") l = [...l].sort((a, b) => (ratings[b.id]?.avg || 0) - (ratings[a.id]?.avg || 0));
    return l;
  }, [products, cat, q, sort, ratings]);
  const spot = cat === "All" && !q && sort === "featured" ? list.find(p => p.is_featured) : null;
  const rest = spot ? list.filter(p => p.id !== spot.id) : list;

  return (
    <main className="v2 sp">
      <header className="sp-hero">
        <div className="v2-wrap sp-hero-grid">
          <div>
            <div className="v2-eyebrow">CodeBuild Store</div>
            <h1 className="sp-h1">The books, kits and bundles we teach with</h1>
            <p className="v2-lead">Written and tested by our instructors. Pay by bank transfer, JazzCash or Easypaisa, upload the screenshot, and we deliver on WhatsApp.</p>
          </div>
          <ul className="sp-trust">
            <li><strong>Reviewed by customers</strong><span>Only real, approved reviews appear.</span></li>
            <li><strong>A person on WhatsApp</strong><span>Questions answered by our team, not a bot.</span></li>
            <li><strong>Clear delivery estimate</strong><span>You see the date before you pay.</span></li>
          </ul>
        </div>
      </header>

      <div className="v2-wrap">
        <div className="sp-bar">
          <div className="sp-pills" role="tablist" aria-label="Categories">
            {cats.map(c => <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? "on" : ""} onClick={() => setCat(c)}>{c}<small>{c === "All" ? products.length : products.filter(p => p.category === c).length}</small></button>)}
          </div>
          <div className="sp-tools">
            <input className="v2-input" type="search" placeholder="Search products" aria-label="Search products" value={q} onChange={e => setQ(e.target.value)} />
            <select className="v2-select" aria-label="Sort" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="featured">Featured</option><option value="rated">Top rated</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option>
            </select>
          </div>
        </div>

        {loading ? <p style={{ padding: "60px 0", color: "var(--cb-mute)" }}>Loading products…</p>
          : list.length === 0 ? <p style={{ padding: "60px 0", color: "var(--cb-mute)" }}>No products match your search.</p> : (
            <>
              {spot && (
                <Link to={productPath(spot)} className="sp-spot">
                  <div className="sp-spot-img">{spot.images?.[0] ? <img src={spot.images[0]} alt={spot.name} /> : <div className="sp-noimg">{spot.category}</div>}</div>
                  <div className="sp-spot-body">
                    <div className="v2-eyebrow">Featured</div>
                    <h2>{spot.name}</h2>
                    <p>{spot.tagline || spot.description}</p>
                    {ratings[spot.id] && <div className="sp-rate"><Stars value={ratings[spot.id].avg} /><span>{ratings[spot.id].avg.toFixed(1)} · {ratings[spot.id].n} reviews</span></div>}
                    <div className="sp-price-row"><b>{fmt(spot.price)}</b>{spot.original_price && <s>{fmt(spot.original_price)}</s>}</div>
                    <span className="v2-btn" style={{ marginTop: 18, alignSelf: "flex-start" }}>View details</span>
                  </div>
                </Link>)}
              <div className="sp-grid">{rest.map(p => <Card key={p.id} p={p} rating={ratings[p.id]} />)}</div>
            </>)}
      </div>
      <Faq items={STORE_FAQS} title="Before you buy" withSchema={false} />
    </main>
  );
};
export default Products;
