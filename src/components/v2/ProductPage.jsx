import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./v2.css";
import { supabase } from "../supabase/SupabaseClient";
import { SITE } from "../../config/siteConfig";
import { Stars } from "./shared";
import { Gallery, DetailTabs, WhyChoose, useReviews, fmt, deliveryLabel, productPath } from "./ProductDetail";
import { useWhyChoose } from "./settings";
import { useSeo } from "./seo";

const ProductPage = () => {
  const { slug } = useParams();
  const [all, setAll] = useState(null);
  const why = useWhyChoose();

  useEffect(() => {
    supabase.from("products").select("*").eq("is_published", true).order("sort_order", { ascending: true })
      .then(({ data }) => setAll(data || []), () => setAll([]));
  }, []);

  const product = useMemo(() => all?.find(p => p.slug === slug || String(p.id) === slug), [all, slug]);
  const reviews = useReviews(product?.id);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const jsonLd = useMemo(() => product && ({
    "@context": "https://schema.org", "@type": "Product", name: product.name,
    description: product.seo_description || product.tagline || product.description,
    image: (product.images || []).filter(Boolean), category: product.category,
    brand: { "@type": "Brand", name: SITE.name },
    offers: { "@type": "Offer", priceCurrency: "PKR", price: product.price, availability: product.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock", url: `${SITE.url}${productPath(product)}` },
    ...(reviews.length ? { aggregateRating: { "@type": "AggregateRating", ratingValue: avg.toFixed(1), reviewCount: reviews.length } } : {}),
  }), [product, reviews, avg]);

  useSeo({
    title: product ? product.name : "Product",
    description: product ? (product.seo_description || product.tagline || (product.description || "").slice(0, 155)) : "CodeBuild Store product",
    path: product ? productPath(product) : "/products",
    image: product?.images?.[0]?.startsWith("/") ? product.images[0] : undefined, jsonLd, noindex: all && !product,
  });

  if (!all) return <main className="v2 pp"><div className="v2-wrap" style={{ padding: "80px 0" }}>Loading…</div></main>;
  if (!product) return <main className="v2 pp"><div className="v2-wrap" style={{ padding: "60px 0 100px" }}><h1 className="v2-h2">Product not found</h1><p className="v2-lead">It may have been removed or is not published yet.</p><Link className="v2-btn" to="/products" style={{ marginTop: 20 }}>Back to store</Link></div></main>;

  const showWhy = product.show_why ?? product.category === "Course Bundle";
  const disc = product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;
  const out = product.stock === 0;
  const related = all.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);
  const wa = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hi, I have a question about: ${product.name}`)}`;

  return (
    <main className="v2 pp">
      <div className="v2-wrap">
        <nav className="co-crumbs" aria-label="Breadcrumb"><Link to="/products">Store</Link><span>/</span><Link to={`/products?cat=${encodeURIComponent(product.category)}`}>{product.category}</Link><span>/</span><span style={{ color: "#fff" }}>{product.name}</span></nav>
        <div className="pp-top">
          <div className="pp-gal"><Gallery product={product} /></div>
          <div>
            {product.badge && <span className="sp-badge" style={{ position: "static", background: product.badge_color || "#ffa500", display: "inline-block" }}>{product.badge}</span>}
            <div className="sp-cat" style={{ marginTop: 10 }}>{product.category}</div>
            <h1 className="pp-name">{product.name}</h1>
            {product.tagline && <p className="pp-tag">{product.tagline}</p>}
            {reviews.length > 0 && <div className="sp-rate"><Stars value={avg} /><span>{avg.toFixed(1)} · {reviews.length} review{reviews.length > 1 ? "s" : ""}</span></div>}
            <div className="pp-price"><b>{fmt(product.price)}</b>{product.original_price && <s>{fmt(product.original_price)}</s>}{disc > 0 && <em>Save {disc}%</em>}</div>
            <div className="pp-chips">
              <span>{deliveryLabel(product)}</span>
              {product.stock != null && <span style={{ color: out ? "var(--cb-bad)" : product.stock < 5 ? "var(--cb-accent)" : undefined }}>{out ? "Out of stock" : product.stock < 5 ? `Only ${product.stock} left` : "In stock"}</span>}
            </div>
            <div className="pp-actions">
              {out ? <span className="v2-btn block" style={{ opacity: .5, cursor: "not-allowed" }}>Out of stock</span>
                : <Link className="v2-btn block" to={`/checkout?p=${product.id}`}>Buy now · {fmt(product.price)}</Link>}
              {product.buy_link && <a className="v2-btn ghost block" href={product.buy_link} target="_blank" rel="noopener noreferrer">Order via link</a>}
              <a className="v2-btn ghost block" href={wa} target="_blank" rel="noopener noreferrer">Ask a question on WhatsApp</a>
            </div>
            <ul className="pp-trust">
              <li>Pay by bank transfer, JazzCash or Easypaisa — no card details</li>
              <li>Order confirmation with delivery estimate right after checkout</li>
              <li>Support from a real person on WhatsApp</li>
            </ul>
          </div>
        </div>

        <div className="pp-body"><DetailTabs product={product} /></div>
        {showWhy && <WhyChoose items={why} brand={SITE.name} />}
        {related.length > 0 && (
          <section className="pp-rel"><h2 className="v2-h2">You may also like</h2>
            <div className="sp-grid" style={{ paddingBottom: 0 }}>
              {related.map(p => (
                <Link key={p.id} to={productPath(p)} className="sp-card"><div className="sp-card-img">{p.images?.[0] ? <img src={p.images[0]} alt={p.name} loading="lazy" /> : <div className="sp-noimg">{p.category}</div>}</div>
                  <div className="sp-card-body"><h3>{p.name}</h3><div className="sp-price-row"><b>{fmt(p.price)}</b></div></div></Link>))}
            </div></section>)}
      </div>
      {!out && <div className="pp-sticky"><b>{fmt(product.price)}</b><Link className="v2-btn" to={`/checkout?p=${product.id}`}>Buy now</Link></div>}
    </main>
  );
};
export default ProductPage;
