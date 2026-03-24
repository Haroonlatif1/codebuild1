import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase/SupabaseClient";

/* ═══════════════════════════════════════════════════════════════════
   PRODUCTS PAGE — CodeBuild Academy Store
   ✦ E-Books, Robotics Kits, Bundles
   ✦ Category filter + featured section
   ✦ Product detail modal with image gallery
   ✦ Buy via WhatsApp / external link
════════════════════════════════════════════════════════════════════ */

const CATEGORIES = ["All", "E-Book", "Robotics Kit", "Course Bundle", "Merchandise"];

const CAT_ICONS = {
  "E-Book": "📘", "Robotics Kit": "🤖",
  "Course Bundle": "🎓", "Merchandise": "👕", "All": "🛍️",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Dosis:wght@400;500;600;700;800&display=swap');

.pr-page {
  background: #07070f; min-height: 100vh;
  font-family: "Dosis", sans-serif;
  padding: 80px 24px 120px; position: relative;
}
.pr-page::before {
  content:""; position:fixed; top:-100px; left:50%; transform:translateX(-50%);
  width:900px; height:500px; border-radius:50%;
  background:radial-gradient(ellipse,rgba(255,165,0,0.04),transparent 65%);
  pointer-events:none; z-index:0;
}
.pr-inner { max-width:1140px; margin:0 auto; position:relative; z-index:1; }

/* ── header ── */
.pr-header { text-align:center; margin-bottom:52px; }
.pr-eyebrow {
  font-size:10px; font-weight:800; letter-spacing:5px; text-transform:uppercase;
  color:#ffa500; margin-bottom:14px;
  display:flex; align-items:center; justify-content:center; gap:10px;
}
.pr-eyebrow::before,.pr-eyebrow::after { content:""; width:40px; height:1px; }
.pr-eyebrow::before { background:linear-gradient(90deg,transparent,#ffa500); }
.pr-eyebrow::after  { background:linear-gradient(90deg,#ffa500,transparent); }
.pr-title {
  font-family:"Bebas Neue",sans-serif;
  font-size:clamp(52px,8vw,104px); line-height:0.88; letter-spacing:3px;
  background:linear-gradient(135deg,#fff 40%,rgba(255,165,0,0.6));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  margin-bottom:14px;
}
.pr-sub {
  font-size:14px; font-weight:500; color:rgba(255,255,255,0.3);
  max-width:500px; margin:0 auto; line-height:1.65;
}

/* ── filters ── */
.pr-filters { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin-bottom:52px; }
.pr-filter {
  display:flex; align-items:center; gap:6px;
  font-family:"Dosis",sans-serif; font-size:11px; font-weight:800;
  letter-spacing:1.5px; text-transform:uppercase;
  background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
  border-radius:20px; color:rgba(255,255,255,0.4); padding:8px 20px;
  cursor:pointer; transition:all .22s;
}
.pr-filter:hover { border-color:rgba(255,165,0,0.25); color:rgba(255,255,255,0.75); }
.pr-filter.active { background:rgba(255,165,0,0.1); border-color:rgba(255,165,0,0.3); color:#ffa500; }

/* ── featured strip ── */
.pr-featured-label {
  font-size:9px; font-weight:800; letter-spacing:3px; text-transform:uppercase;
  color:rgba(255,165,0,0.4); margin-bottom:18px;
}
.pr-featured-grid {
  display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
  gap:22px; margin-bottom:52px;
}

/* ── regular grid ── */
.pr-section-label {
  font-size:9px; font-weight:800; letter-spacing:3px; text-transform:uppercase;
  color:rgba(255,255,255,0.2); margin-bottom:18px;
}
.pr-grid {
  display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
  gap:20px;
}

/* ── product card ── */
.pr-card {
  background:#0d0d1a; border:1px solid rgba(255,255,255,0.06);
  border-radius:18px; overflow:hidden; cursor:pointer;
  transition:transform .3s ease, border-color .3s ease, box-shadow .3s ease;
  display:flex; flex-direction:column;
}
.pr-card:hover {
  transform:translateY(-6px);
  border-color:rgba(255,165,0,0.25);
  box-shadow:0 28px 70px rgba(0,0,0,0.65);
}
.pr-card.featured { border-color:rgba(255,165,0,0.14); }

/* image */
.pr-card-img { position:relative; width:100%; height:200px; overflow:hidden; }
.pr-card-img img {
  width:100%; height:100%; object-fit:cover; display:block;
  transition:transform .5s ease; filter:brightness(0.75);
}
.pr-card:hover .pr-card-img img { transform:scale(1.06); filter:brightness(0.9); }
.pr-card-img-overlay {
  position:absolute; inset:0;
  background:linear-gradient(to top,rgba(7,7,15,0.8) 0%,transparent 55%);
}
.pr-badge {
  position:absolute; top:12px; left:12px;
  font-size:8px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase;
  padding:4px 10px; border-radius:4px; color:#07070f; z-index:2;
}
.pr-cat-icon {
  position:absolute; top:12px; right:12px;
  font-size:20px; z-index:2;
  filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));
}

/* card body */
.pr-card-body { padding:16px 18px 20px; flex:1; display:flex; flex-direction:column; }
.pr-card-cat {
  font-size:8px; font-weight:800; letter-spacing:2px; text-transform:uppercase;
  color:rgba(255,165,0,0.55); margin-bottom:6px;
}
.pr-card-name {
  font-size:16px; font-weight:800; color:rgba(255,255,255,0.92);
  line-height:1.3; margin-bottom:8px;
}
.pr-card-desc {
  font-size:12px; font-weight:500; color:rgba(255,255,255,0.38);
  line-height:1.6; margin-bottom:12px;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
  flex:1;
}
.pr-card-price-row {
  display:flex; align-items:center; gap:10px; margin-bottom:14px;
}
.pr-price {
  font-family:"Bebas Neue",sans-serif; font-size:28px; letter-spacing:1px;
  color:#ffa500; line-height:1;
}
.pr-price-orig {
  font-size:14px; font-weight:600; color:rgba(255,255,255,0.22);
  text-decoration:line-through;
}
.pr-discount {
  font-size:9px; font-weight:800; letter-spacing:1px;
  background:rgba(34,197,94,0.12); border:1px solid rgba(34,197,94,0.25);
  color:#4ade80; padding:2px 7px; border-radius:3px;
}
.pr-card-btn {
  width:100%; background:#ffa500; color:#07070f;
  font-family:"Dosis",sans-serif; font-size:10px; font-weight:800;
  letter-spacing:2px; text-transform:uppercase;
  border:none; border-radius:8px; padding:11px;
  cursor:pointer; transition:background .2s, transform .15s;
  display:flex; align-items:center; justify-content:center; gap:7px;
}
.pr-card-btn:hover { background:#ffb733; }
.pr-card-btn:active { transform:scale(0.98); }

/* ── PRODUCT DETAIL MODAL ── */
.pr-modal-overlay {
  position:fixed; inset:0;
  background:rgba(0,0,0,0.88); backdrop-filter:blur(14px);
  z-index:9990; display:flex; align-items:center; justify-content:center;
  padding:20px; animation:pr-fade .22s ease; overflow-y:auto;
}
.pr-modal {
  background:#0d0d1a; border:1px solid rgba(255,255,255,0.08);
  border-radius:22px; width:100%; max-width:900px;
  animation:pr-modal-in .32s cubic-bezier(0.22,1,0.36,1);
  overflow:hidden; display:grid;
  grid-template-columns:1fr 1fr;
  margin:auto;
}
.pr-modal-left { position:relative; }
.pr-modal-main-img {
  width:100%; height:360px; object-fit:cover; display:block; cursor:zoom-in;
}
.pr-modal-thumbs {
  display:flex; gap:3px; padding:3px; background:#050510;
}
.pr-modal-thumb {
  flex:1; height:64px; object-fit:cover; cursor:pointer;
  opacity:0.5; transition:opacity .2s; border-radius:3px;
}
.pr-modal-thumb.active,.pr-modal-thumb:hover { opacity:1; }
.pr-modal-thumb.active { outline:2px solid #ffa500; }
.pr-modal-right { padding:28px 28px 28px; overflow-y:auto; max-height:560px; }
.pr-modal-close {
  position:absolute; top:12px; right:12px; width:34px; height:34px;
  border-radius:50%; background:rgba(0,0,0,0.7);
  border:1px solid rgba(255,255,255,0.12);
  color:rgba(255,255,255,0.65); font-size:15px; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  z-index:2; transition:background .2s; font-family:sans-serif; line-height:1;
}
.pr-modal-close:hover { background:rgba(220,40,40,0.6); color:#fff; }
.pr-modal-cat {
  font-size:9px; font-weight:800; letter-spacing:2px; text-transform:uppercase;
  color:#ffa500; margin-bottom:8px;
}
.pr-modal-name {
  font-family:"Bebas Neue",sans-serif;
  font-size:clamp(26px,4vw,38px); letter-spacing:1.5px; color:#fff;
  line-height:1; margin-bottom:14px;
}
.pr-modal-price-row { display:flex; align-items:center; gap:12px; margin-bottom:18px; }
.pr-modal-price { font-family:"Bebas Neue",sans-serif; font-size:40px; color:#ffa500; letter-spacing:1px; line-height:1; }
.pr-modal-orig  { font-size:18px; font-weight:600; color:rgba(255,255,255,0.22); text-decoration:line-through; }
.pr-modal-save  { font-size:10px; font-weight:800; letter-spacing:1px;
  background:rgba(34,197,94,0.12); border:1px solid rgba(34,197,94,0.25);
  color:#4ade80; padding:3px 9px; border-radius:4px; }
.pr-modal-desc {
  font-size:13px; font-weight:500; color:rgba(255,255,255,0.5);
  line-height:1.7; margin-bottom:20px;
}
.pr-modal-features { margin-bottom:22px; }
.pr-modal-features-title {
  font-size:9px; font-weight:800; letter-spacing:2px; text-transform:uppercase;
  color:rgba(255,255,255,0.25); margin-bottom:10px;
}
.pr-feature-row {
  display:flex; align-items:flex-start; gap:10px;
  padding:6px 0;
  border-bottom:1px solid rgba(255,255,255,0.04);
  font-size:12.5px; font-weight:600; color:rgba(255,255,255,0.7);
  line-height:1.4;
}
.pr-feature-row:last-child { border-bottom:none; }
.pr-feature-check { color:#ffa500; flex-shrink:0; font-size:13px; margin-top:1px; }
.pr-modal-stock {
  font-size:11px; font-weight:700;
  color:rgba(255,255,255,0.3); margin-bottom:18px;
  display:flex; align-items:center; gap:6px;
}
.pr-modal-buy {
  width:100%; background:#ffa500; color:#07070f;
  font-family:"Dosis",sans-serif; font-size:11px; font-weight:800;
  letter-spacing:2px; text-transform:uppercase;
  border:none; border-radius:10px; padding:14px;
  cursor:pointer; transition:background .2s; text-decoration:none;
  display:flex; align-items:center; justify-content:center; gap:8px;
  font-size:12px;
}
.pr-modal-buy:hover { background:#ffb733; }

/* loading/empty */
.pr-loading { display:flex; align-items:center; justify-content:center; gap:8px; padding:100px 24px; }
.pr-loading span { width:9px;height:9px;border-radius:50%;background:#ffa500;animation:pr-bounce 1.2s ease-in-out infinite; }
.pr-loading span:nth-child(2){animation-delay:.2s;} .pr-loading span:nth-child(3){animation-delay:.4s;}
.pr-empty { text-align:center; padding:80px 24px; color:rgba(255,255,255,0.2); font-size:13px; }
.pr-empty-icon { font-size:40px; margin-bottom:12px; }

@keyframes pr-fade    { from{opacity:0} to{opacity:1} }
@keyframes pr-modal-in{ from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
@keyframes pr-bounce  { 0%,80%,100%{transform:scale(.4);opacity:.3} 40%{transform:scale(1);opacity:1} }

@media(max-width:768px){
  .pr-modal { grid-template-columns:1fr; }
  .pr-modal-main-img { height:240px; }
  .pr-modal-right { padding:18px 18px 22px; max-height:none; }
  .pr-featured-grid { grid-template-columns:1fr; }
}
@media(max-width:480px){
  .pr-grid { grid-template-columns:1fr; }
}
`;

/* ── helpers ── */
const fmt = (n) => `PKR ${Number(n).toLocaleString()}`;
const discount = (orig, price) => orig ? Math.round(((orig-price)/orig)*100) : 0;

/* ── Product Detail Modal ── */
const ProductModal = ({ product, onClose }) => {
  const [activeImg, setActiveImg] = useState(0);
  const images = product.images?.filter(Boolean) || [];

  useEffect(() => {
    const fn = (e) => { if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown",fn); document.body.style.overflow=""; };
  }, [onClose]);

  const disc = discount(product.original_price, product.price);
  const savings = product.original_price ? product.original_price - product.price : 0;

  return (
    <div className="pr-modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="pr-modal">
        {/* Left — images */}
        <div className="pr-modal-left">
          {images.length > 0 ? (
            <>
              <img className="pr-modal-main-img" src={images[activeImg]} alt={product.name} key={activeImg}/>
              {images.length > 1 && (
                <div className="pr-modal-thumbs">
                  {images.map((img,i)=>(
                    <img key={i} className={`pr-modal-thumb${activeImg===i?" active":""}`}
                      src={img} alt="" onClick={()=>setActiveImg(i)}/>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{height:360,background:"rgba(255,255,255,0.03)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48}}>
             
            </div>
          )}
          <button className="pr-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Right — details */}
        <div className="pr-modal-right">
          <div className="pr-modal-cat">{product.category}</div>
          <div className="pr-modal-name">{product.name}</div>

          <div className="pr-modal-price-row">
            <div className="pr-modal-price">{fmt(product.price)}</div>
            {product.original_price && <>
              <div className="pr-modal-orig">{fmt(product.original_price)}</div>
              <div className="pr-modal-save">Save {fmt(savings)}</div>
            </>}
          </div>

          {product.description && (
            <div className="pr-modal-desc">{product.description}</div>
          )}

          {product.features?.length > 0 && (
            <div className="pr-modal-features">
              <div className="pr-modal-features-title">What's Included</div>
              {product.features.map((f,i)=>(
                <div key={i} className="pr-feature-row">
                  <span className="pr-feature-check">✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          )}

          {product.stock !== null && product.stock !== undefined && (
            <div className="pr-modal-stock">
              <span style={{color: product.stock < 5 ? "#ef4444" : "#22c55e"}}>●</span>
              {product.stock > 0
                ? product.stock < 5 ? `Only ${product.stock} left in stock!` : `${product.stock} in stock`
                : "Out of stock"
              }
            </div>
          )}

          <a
            href={product.buy_link || `https://wa.me/923001234567?text=I want to buy: ${encodeURIComponent(product.name)}`}
            target="_blank" rel="noopener noreferrer"
            className="pr-modal-buy"
          >
            🛒 Buy Now — {fmt(product.price)}
          </a>
        </div>
      </div>
    </div>
  );
};

/* ── Product Card ── */
const ProductCard = ({ product, onClick }) => {
  const images = product.images?.filter(Boolean) || [];
  const disc = discount(product.original_price, product.price);

  return (
    <div className={`pr-card${product.is_featured?" featured":""}`} onClick={onClick}>
      <div className="pr-card-img">
        {images[0]
          ? <><img src={images[0]} alt={product.name} loading="lazy"/><div className="pr-card-img-overlay"/></>
          : <div style={{height:200,background:"rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40}}></div>
        }
        {product.badge && (
          <div className="pr-badge" style={{background:product.badge_color||"#ffa500"}}>{product.badge}</div>
        )}
        <div className="pr-cat-icon"></div>
      </div>

      <div className="pr-card-body">
        <div className="pr-card-cat">{product.category}</div>
        <div className="pr-card-name">{product.name}</div>
        {product.description && <div className="pr-card-desc">{product.description}</div>}

        <div className="pr-card-price-row">
          <div className="pr-price">{fmt(product.price)}</div>
          {product.original_price && <div className="pr-price-orig">{fmt(product.original_price)}</div>}
          {disc > 0 && <div className="pr-discount">{disc}% OFF</div>}
        </div>

        <button className="pr-card-btn" onClick={e=>{e.stopPropagation();onClick();}}>
          🛒 View & Buy
        </button>
      </div>
    </div>
  );
};

/* ═══ MAIN ══════════════════════════════════════════════════════════ */
const Products = () => {
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState("All");
  const [selected,  setSelected]  = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("products").select("*")
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("sort_order",  { ascending: true });
      setProducts(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered  = filter === "All" ? products : products.filter(p=>p.category===filter);
  const featured  = filtered.filter(p=>p.is_featured);
  const regular   = filtered.filter(p=>!p.is_featured);

  return (
    <>
      <style>{css}</style>
      <div className="pr-page">
        <div className="pr-inner">

          <div className="pr-header">
            <div className="pr-eyebrow">CodeBuild Store</div>
            <h1 className="pr-title">Shop<br/>& Learn</h1>
            <p className="pr-sub">
              E-Books written by our instructors, robotics kits used in class,
              and bundles to supercharge your learning.
            </p>
          </div>

          <div className="pr-filters">
            {CATEGORIES.map(cat=>(
              <button key={cat} className={`pr-filter${filter===cat?" active":""}`} onClick={()=>setFilter(cat)}>
             {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="pr-loading"><span/><span/><span/></div>
          ) : filtered.length === 0 ? (
            <div className="pr-empty">
              <div className="pr-empty-icon">📭</div>
              No products in this category yet.
            </div>
          ) : (
            <>
              {featured.length > 0 && (
                <>
                  <div className="pr-featured-label">⭐ Featured Products</div>
                  <div className="pr-featured-grid">
                    {featured.map(p=>(
                      <ProductCard key={p.id} product={p} onClick={()=>setSelected(p)}/>
                    ))}
                  </div>
                </>
              )}
              {regular.length > 0 && (
                <>
                  {featured.length > 0 && <div className="pr-section-label">All Products</div>}
                  <div className="pr-grid">
                    {regular.map(p=>(
                      <ProductCard key={p.id} product={p} onClick={()=>setSelected(p)}/>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {selected && <ProductModal product={selected} onClose={()=>setSelected(null)}/>}
    </>
  );
};

export default Products;