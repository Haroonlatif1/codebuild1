import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AboutExtras from './v2/AboutExtras';
import { useSeo } from './v2/seo';

/* ─── data ────────────────────────────────────────────────────── */

const missionItems = [
  'Providing high-quality education that meets industry standards',
  'Fostering a supportive learning environment that encourages growth',
  'Empowering students to succeed in their chosen careers',
  'Bridging the gap between academia and industry needs',
];

const values = [
  { icon: '★', title: 'Excellence',       desc: 'In education and outcomes' },
  { icon: '◈', title: 'Innovation',       desc: 'Creative problem solving' },
  { icon: '◎', title: 'Critical Thinking',desc: 'Analytical approach' },
  { icon: '⬡', title: 'Collaboration',    desc: 'Teamwork makes the dream work' },
  { icon: '◉', title: 'Focus',            desc: 'Student-centered approach' },
  { icon: '♦', title: 'Passion',          desc: 'For teaching and learning' },
];

const galleryImages = [
  { url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80', caption: 'Our Lab' },
  { url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80', caption: 'Live Lectures' },
  { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', caption: 'Team Work' },
  { url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80', caption: 'Coding Sessions' },
  { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80', caption: 'Our Campus' },
  { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80', caption: 'Workshops' },
];

const flags = [
  { code: 'pk', name: 'Pakistan' },
  { code: 'bd', name: 'Bangladesh' },
  { code: 'kw', name: 'Kuwait' },
  { code: 'ca', name: 'Canada' },
];

/* ─── CSS ─────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Dosis:wght@400;600;700;800&family=Bebas+Neue&display=swap');

  .cau-page {
    background: #09090e;
    min-height: 100vh;
    font-family: "Dosis", sans-serif;
    color: #fff;
    overflow-x: hidden;
    width: 100%;
    box-sizing: border-box;
  }
  .cau-page *, .cau-page *::before, .cau-page *::after { box-sizing: border-box; }

  /* ── hero ── */
  .cau-hero {
    position: relative;
    height: 88vh;
    min-height: 520px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .cau-hero-bg {
    position: absolute;
    inset: 0;
    background-image: url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80');
    background-size: cover;
    background-position: center;
    filter: brightness(0.28) saturate(0.5);
    transform-origin: center;
    will-change: transform;
  }
  .cau-hero-vignette {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at center, transparent 30%, rgba(9,9,14,0.7) 100%),
      linear-gradient(to bottom, transparent 50%, #09090e 100%);
    z-index: 1;
  }
  .cau-hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,165,0,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,165,0,0.04) 1px, transparent 1px);
    background-size: 52px 52px;
    z-index: 1;
  }
  .cau-hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 0 24px;
    max-width: 800px;
  }
  .cau-hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3.5px;
    text-transform: uppercase;
    color: #ffa500;
    border: 1px solid rgba(255,165,0,0.25);
    background: rgba(255,165,0,0.06);
    padding: 7px 20px;
    border-radius: 20px;
    margin-bottom: 22px;
  }
  .cau-hero-eyebrow img {
    border-radius: 2px;
    object-fit: cover;
    display: inline-block;
    vertical-align: middle;
    box-shadow: 0 1px 3px rgba(0,0,0,0.4);
  }
  .cau-hero-eyebrow-divider {
    width: 1px;
    height: 12px;
    background: rgba(255,165,0,0.3);
    flex-shrink: 0;
  }
  .cau-hero-title {
    font-family: "Bebas Neue", sans-serif;
    font-size: clamp(48px, 8vw, 96px);
    letter-spacing: 3px;
    line-height: 0.93;
    color: #fff;
    margin-bottom: 22px;
  }
  .cau-hero-title em {
    font-style: normal;
    display: block;
    color: transparent;
    -webkit-text-stroke: 1.5px #ffa500;
  }
  .cau-hero-sub {
    font-size: 15px;
    color: rgba(255,255,255,0.45);
    line-height: 1.75;
    max-width: 520px;
    margin: 0 auto 36px;
  }
  .cau-hero-scroll {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
  }
  .cau-hero-scroll-line {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, rgba(255,165,0,0.6), transparent);
    animation: cau-pulse 2s ease-in-out infinite;
  }
  @keyframes cau-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  /* ── section wrapper ── */
  .cau-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 28px;
    width: 100%;
  }
  .cau-section-sm {
    max-width: 780px;
    margin: 0 auto;
    padding: 80px 28px;
  }

  /* section label */
  .cau-label {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 40px;
  }
  .cau-label-text {
    font-family: "Bebas Neue", sans-serif;
    font-size: 11px;
    letter-spacing: 4px;
    color: rgba(255,255,255,0.2);
    white-space: nowrap;
  }
  .cau-label-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.06);
  }
  .cau-label-accent {
    width: 24px;
    height: 2px;
    background: #ffa500;
    flex-shrink: 0;
  }

  /* ── about block ── */
  .cau-about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: center;
  }
  .cau-about-img-wrap {
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    height: 360px;
  }
  .cau-about-img {
    width: 100%; height: 100%;
    object-fit: cover;
    filter: brightness(0.75) saturate(0.7);
    transition: filter 0.5s;
  }
  .cau-about-img-wrap:hover .cau-about-img { filter: brightness(0.88) saturate(0.9); }
  .cau-about-img-border {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(255,165,0,0.18);
    border-radius: 6px;
    pointer-events: none;
  }
  .cau-about-img-wrap::before {
    content: "";
    position: absolute;
    bottom: -1px; right: -1px;
    width: 60px; height: 60px;
    border-bottom: 3px solid #ffa500;
    border-right: 3px solid #ffa500;
    z-index: 2;
    border-radius: 0 0 6px 0;
  }
  .cau-about-h {
    font-family: "Bebas Neue", sans-serif;
    font-size: clamp(36px, 5vw, 56px);
    letter-spacing: 2px;
    line-height: 1;
    color: #fff;
    margin-bottom: 20px;
  }
  .cau-about-h em { color: #ffa500; font-style: normal; }
  .cau-about-p {
    font-size: 14px;
    color: rgba(255,255,255,0.42);
    line-height: 1.85;
    margin-bottom: 28px;
  }
  .cau-about-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #ffa500;
    border-left: 3px solid #ffa500;
    padding-left: 12px;
  }

  /* ── stats ── */
  .cau-stats {
    background: #0d0d12;
    border-top: 1px solid rgba(255,255,255,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .cau-stats-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
  .cau-stat {
    padding: 40px 28px;
    text-align: center;
    border-right: 1px solid rgba(255,255,255,0.06);
    position: relative;
    transition: background 0.3s;
  }
  .cau-stat:last-child { border-right: none; }
  .cau-stat:hover { background: rgba(255,165,0,0.03); }
  .cau-stat-n {
    font-family: "Bebas Neue", sans-serif;
    font-size: 52px;
    color: #ffa500;
    letter-spacing: 2px;
    line-height: 1;
    display: block;
  }
  .cau-stat-l {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    margin-top: 6px;
    display: block;
  }
  .cau-stat::after {
    content: "";
    position: absolute;
    bottom: 0; left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: #ffa500;
    transition: width 0.35s;
  }
  .cau-stat:hover::after { width: 60%; }

  /* ── mission ── */
  .cau-mission-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .cau-mission-item {
    background: #0f0f15;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 6px;
    padding: 20px 22px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .cau-mission-item:hover {
    border-color: rgba(255,165,0,0.25);
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .cau-mission-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #ffa500;
    flex-shrink: 0;
    margin-top: 6px;
  }
  .cau-mission-text {
    font-size: 13px;
    color: rgba(255,255,255,0.5);
    line-height: 1.65;
  }

  /* ── values ── */
  .cau-values-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }
  .cau-value-card {
    background: #0f0f15;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 6px;
    padding: 24px 22px;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .cau-value-card:hover {
    border-color: rgba(255,165,0,0.25);
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.5);
  }
  .cau-value-icon {
    font-size: 20px;
    color: #ffa500;
    margin-bottom: 12px;
    display: block;
    font-style: normal;
  }
  .cau-value-title {
    font-family: "Bebas Neue", sans-serif;
    font-size: 18px;
    letter-spacing: 1.5px;
    color: #fff;
    margin-bottom: 6px;
  }
  .cau-value-desc {
    font-size: 12px;
    color: rgba(255,255,255,0.35);
    line-height: 1.6;
  }

  /* ── gallery ── */
  .cau-gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .cau-gallery-item {
    position: relative;
    height: 200px;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .cau-gallery-item:first-child {
    grid-column: span 2;
    height: 240px;
  }
  .cau-gallery-img {
    width: 100%; height: 100%;
    object-fit: cover;
    filter: brightness(0.7) saturate(0.6);
    transition: filter 0.5s, transform 0.6s cubic-bezier(0.22,1,0.36,1);
  }
  .cau-gallery-item:hover .cau-gallery-img {
    filter: brightness(0.88) saturate(0.85);
    transform: scale(1.05);
  }
  .cau-gallery-cap {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 14px 16px 12px;
    background: linear-gradient(to top, rgba(9,9,14,0.9), transparent);
    font-family: "Bebas Neue", sans-serif;
    font-size: 14px;
    letter-spacing: 2px;
    color: rgba(255,255,255,0.7);
    transition: color 0.25s;
  }
  .cau-gallery-item:hover .cau-gallery-cap { color: #ffa500; }
  .cau-gallery-item::after {
    content: "";
    position: absolute;
    inset: 0;
    border: 1px solid transparent;
    border-radius: 6px;
    transition: border-color 0.25s;
    pointer-events: none;
  }
  .cau-gallery-item:hover::after { border-color: rgba(255,165,0,0.3); }

  /* ── section h2 ── */
  .cau-h2 {
    font-family: "Bebas Neue", sans-serif;
    font-size: clamp(32px, 4vw, 52px);
    letter-spacing: 3px;
    color: #fff;
    margin-bottom: 8px;
    line-height: 1;
  }
  .cau-h2 em { color: #ffa500; font-style: normal; }
  .cau-h2-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.3);
    margin-bottom: 36px;
    letter-spacing: 0.3px;
  }

  /* ── divider ── */
  .cau-divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 0;
  }

  /* ── CTA ── */
  .cau-cta {
    background: #0d0d12;
    border-top: 1px solid rgba(255,165,0,0.1);
    border-bottom: 1px solid rgba(255,165,0,0.1);
    text-align: center;
    padding: 80px 24px;
    position: relative;
    overflow: hidden;
  }
  .cau-cta::before {
    content: "";
    position: absolute;
    width: 600px; height: 300px;
    background: radial-gradient(ellipse, rgba(255,165,0,0.07), transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .cau-cta-h {
    font-family: "Bebas Neue", sans-serif;
    font-size: clamp(32px, 5vw, 58px);
    letter-spacing: 3px;
    color: #fff;
    margin-bottom: 10px;
    position: relative;
    z-index: 1;
  }
  .cau-cta-h em { color: #ffa500; font-style: normal; }
  .cau-cta-p {
    font-size: 14px;
    color: rgba(255,255,255,0.3);
    margin-bottom: 32px;
    position: relative;
    z-index: 1;
  }
  .cau-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: "Bebas Neue", sans-serif;
    font-size: 18px;
    letter-spacing: 2.5px;
    background: #ffa500;
    color: #09090e;
    border: 1px solid #ffa500;
    border-radius: 3px;
    padding: 13px 40px;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.25s, color 0.25s, box-shadow 0.25s;
    box-shadow: 0 4px 24px rgba(255,165,0,0.22);
    position: relative;
    z-index: 1;
  }
  .cau-cta-btn:hover {
    background: transparent;
    color: #ffa500;
    box-shadow: none;
  }

  /* ── responsive ── */
  @media (max-width: 1024px) {
    .cau-values-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .cau-about-grid { grid-template-columns: 1fr; }
    .cau-about-img-wrap { height: 240px; }
    .cau-stats-inner { grid-template-columns: repeat(2, 1fr); }
    .cau-stat { border-bottom: 1px solid rgba(255,255,255,0.06); }
    .cau-mission-grid { grid-template-columns: 1fr; }
    .cau-gallery-grid { grid-template-columns: repeat(2, 1fr); }
    .cau-gallery-item:first-child { grid-column: span 2; }
    .cau-section { padding: 60px 20px; }
    .cau-section-sm { padding: 60px 20px; }
  }
  @media (max-width: 480px) {
    .cau-hero-title { font-size: 46px; }
    .cau-values-grid { grid-template-columns: 1fr; }
    .cau-gallery-grid { grid-template-columns: 1fr; }
    .cau-gallery-item:first-child { grid-column: span 1; }
    .cau-stats-inner { grid-template-columns: 1fr 1fr; }
  }
`;

/* ─── counter hook ────────────────────────────────────────────── */
const useCounter = (target, duration = 2000, trigger) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = p * (2 - p);
      setVal(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);
  return val;
};

/* ─── stats section ───────────────────────────────────────────── */
const Stats = () => {
  const [fired, setFired] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setFired(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const c1 = useCounter(20,   2000, fired);
  const c2 = useCounter(7,    2000, fired);
  const c3 = useCounter(1200, 2000, fired);
  const c4 = useCounter(95,   2000, fired);
  const stats = [
    { val: c1, suffix: '+', label: 'Courses Offered' },
    { val: c2, suffix: '+', label: 'Departments' },
    { val: c3, suffix: '+', label: 'Alumni Students' },
    { val: c4, suffix: '%', label: 'Success Rate' },
  ];
  return (
    <div className="cau-stats" ref={ref}>
      <div className="cau-stats-inner">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            className="cau-stat"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <span className="cau-stat-n">{s.val}{s.suffix}</span>
            <span className="cau-stat-l">{s.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ─── component ───────────────────────────────────────────────── */
function AboutUs() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ['0%', '20%']);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  });

  useSeo({ title: 'About Us', description: 'CodeBuild Academy is a Lahore-based IT academy teaching web development, AI, programming and cyber security to kids, students and professionals.', path: '/aboutus' });
  return (
    <>
      <style>{css}</style>
      <div className="cau-page">

        {/* ── hero ── */}
        <section className="cau-hero" ref={heroRef}>
          <motion.div className="cau-hero-bg" style={{ y: bgY }} />
          <div className="cau-hero-grid" />
          <div className="cau-hero-vignette" />
          <motion.div
            className="cau-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="cau-hero-eyebrow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {flags.map(({ code, name }, i) => (
                <React.Fragment key={code}>
                  <img
                    src={`https://flagcdn.com/w40/${code}.png`}
                    srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
                    width="22"
                    height="15"
                    alt={name}
                  />
                  {i < flags.length - 1 && <span className="cau-hero-eyebrow-divider" />}
                </React.Fragment>
              ))}
              <span className="cau-hero-eyebrow-divider" />
              International Institute
            </motion.div>

            <h1 className="cau-hero-title">
              Building the<em>Future.</em>
            </h1>
            <p className="cau-hero-sub">
              Empowering minds through innovative learning experiences — where technology meets ambition.
            </p>
            <div className="cau-hero-scroll">
              <div className="cau-hero-scroll-line" />
              <span>Scroll</span>
            </div>
          </motion.div>
        </section>

        {/* ── about ── */}
        <section className="cau-section">
          <div className="cau-label">
            <span className="cau-label-text">Who We Are</span>
            <div className="cau-label-line" />
            <div className="cau-label-accent" />
          </div>
          <div className="cau-about-grid">
            <motion.div className="cau-about-img-wrap" {...fadeUp(0)}>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80"
                alt="Students collaborating"
                className="cau-about-img"
              />
              <div className="cau-about-img-border" />
            </motion.div>
            <motion.div className="cau-about-text" {...fadeUp(0.12)}>
              <h2 className="cau-about-h">
                Premier<em>IT Training</em>
              </h2>
              <p className="cau-about-p">
                Welcome to CodeBuild Academy — a premier educational institution dedicated to empowering students with the knowledge and skills to succeed in their chosen careers. With a strong commitment to excellence, we offer a wide range of courses designed to meet the evolving needs of the global tech industry.
              </p>
              <p className="cau-about-p">
                Founded in Lahore, Pakistan, we've grown into an internationally recognized institute with alumni working at leading technology firms across 20+ countries.
              </p>
              <div className="cau-about-tag">
                International IT Training Institute
              </div>
            </motion.div>
          </div>
        </section>

        <div className="cau-divider" />

        {/* ── stats ── */}
        <Stats />

        <div className="cau-divider" />

        {/* ── gallery ── */}
        <section className="cau-section">
          <div className="cau-label">
            <span className="cau-label-text">Our Campus</span>
            <div className="cau-label-line" />
            <div className="cau-label-accent" />
          </div>
          <motion.h2 className="cau-h2" {...fadeUp(0)}>
            Life at <em>CodeBuild</em>
          </motion.h2>
          <p className="cau-h2-sub">Where innovation happens every day</p>
          <motion.div className="cau-gallery-grid" {...fadeUp(0.1)}>
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                className="cau-gallery-item"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22,1,0.36,1] }}
              >
                <img src={img.url} alt={img.caption} className="cau-gallery-img" />
                <div className="cau-gallery-cap">{img.caption}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <div className="cau-divider" />

        {/* ── mission ── */}
        <section className="cau-section">
          <div className="cau-label">
            <span className="cau-label-text">Our Mission</span>
            <div className="cau-label-line" />
            <div className="cau-label-accent" />
          </div>
          <motion.h2 className="cau-h2" {...fadeUp(0)}>
            Why We <em>Exist</em>
          </motion.h2>
          <p className="cau-h2-sub">Four pillars that define everything we do</p>
          <div className="cau-mission-grid">
            {missionItems.map((item, i) => (
              <motion.div
                key={i}
                className="cau-mission-item"
                initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="cau-mission-dot" />
                <span className="cau-mission-text">{item}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="cau-divider" />

        {/* ── values ── */}
        <section className="cau-section">
          <div className="cau-label">
            <span className="cau-label-text">Our Values</span>
            <div className="cau-label-line" />
            <div className="cau-label-accent" />
          </div>
          <motion.h2 className="cau-h2" {...fadeUp(0)}>
            What We <em>Stand For</em>
          </motion.h2>
          <p className="cau-h2-sub">The principles that guide every decision we make</p>
          <div className="cau-values-grid">
            {values.map((v, i) => (
              <motion.div
                key={i}
                className="cau-value-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                whileHover={{ y: -4 }}
              >
                <span className="cau-value-icon">{v.icon}</span>
                <div className="cau-value-title">{v.title}</div>
                <div className="cau-value-desc">{v.desc}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <AboutExtras />

        <div className="cau-cta">
          <motion.div {...fadeUp(0)}>
            <h3 className="cau-cta-h">Ready to Start Your <em>Journey?</em></h3>
            <p className="cau-cta-p">Join CodeBuild Academy today — your career transformation starts here.</p>
            <button className="cau-cta-btn" onClick={() => navigate('/')}>
              Join CodeBuild Today →
            </button>
          </motion.div>
        </div>

      </div>
    </>
  );
}

export default AboutUs;