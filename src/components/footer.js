import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

/* ─── styles ──────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Dosis:wght@400;600;700;800&family=Bebas+Neue&display=swap');

  /* ---------- footer wrapper ---------- */
  .cbf-footer {
    background: #0a0a0f;
    color: #fff;
    font-family: "Dosis", sans-serif;
    position: relative;
    overflow: hidden;
    border-top: 1px solid rgba(255,165,0,0.15);
  }

  /* diagonal grid pattern */
  .cbf-footer::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,165,0,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,165,0,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  /* orange glow orb bottom-left */
  .cbf-footer::after {
    content: "";
    position: absolute;
    width: 400px; height: 400px;
    background: rgba(255,165,0,0.05);
    border-radius: 50%;
    filter: blur(100px);
    bottom: -120px; left: -80px;
    pointer-events: none;
    z-index: 0;
  }

  /* ---------- top orange bar ---------- */
  .cbf-footer-topbar {
    height: 3px;
    background: linear-gradient(90deg, #ffa500 0%, rgba(255,165,0,0.15) 60%, transparent 100%);
  }

  /* ---------- main content ---------- */
  .cbf-footer-body {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 56px 32px 40px;
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1.5fr;
    gap: 40px;
  }

  /* ---------- brand col ---------- */
  .cbf-footer-brand-name {
    font-family: "Bebas Neue", sans-serif;
    font-size: 36px;
    letter-spacing: 3px;
    line-height: 1;
    margin-bottom: 14px;
    color: #fff;
  }
  .cbf-footer-brand-name em {
    color: #ffa500;
    font-style: normal;
  }
  .cbf-footer-tagline {
    font-size: 13px;
    color: rgba(255,255,255,0.38);
    line-height: 1.75;
    margin-bottom: 24px;
    max-width: 220px;
  }

  /* social pills */
  .cbf-footer-socials {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .cbf-social-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 3px;
    padding: 5px 12px;
    text-decoration: none;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .cbf-social-pill:hover {
    color: #ffa500;
    border-color: rgba(255,165,0,0.35);
    background: rgba(255,165,0,0.05);
  }

  /* ---------- column headings ---------- */
  .cbf-footer-col-title {
    font-family: "Bebas Neue", sans-serif;
    font-size: 18px;
    letter-spacing: 2.5px;
    color: #fff;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .cbf-footer-col-title::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(255,165,0,0.3), transparent);
  }

  /* ---------- nav links ---------- */
  .cbf-footer-nav {
    list-style: none;
    padding: 0; margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .cbf-footer-nav li a,
  .cbf-footer-nav li span {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: rgba(255,255,255,0.42);
    text-decoration: none;
    padding: 7px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: color 0.2s, padding-left 0.2s;
    cursor: pointer;
  }
  .cbf-footer-nav li a:hover {
    color: #ffa500;
    padding-left: 6px;
  }
  .cbf-footer-nav .cbf-nav-arrow {
    color: #ffa500;
    font-size: 10px;
    opacity: 0.6;
    transition: opacity 0.2s, transform 0.2s;
    flex-shrink: 0;
  }
  .cbf-footer-nav li a:hover .cbf-nav-arrow {
    opacity: 1;
    transform: translateX(3px);
  }

  /* ---------- contact ---------- */
  .cbf-footer-contact {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .cbf-contact-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .cbf-contact-icon-wrap {
    width: 30px; height: 30px;
    border-radius: 3px;
    background: rgba(255,165,0,0.08);
    border: 1px solid rgba(255,165,0,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
    transition: background 0.2s, border-color 0.2s;
  }
  .cbf-contact-row:hover .cbf-contact-icon-wrap {
    background: rgba(255,165,0,0.15);
    border-color: rgba(255,165,0,0.35);
  }
  .cbf-contact-icon-wrap svg { color: #ffa500; }
  .cbf-contact-text {
    font-size: 13px;
    color: rgba(255,255,255,0.42);
    line-height: 1.65;
    transition: color 0.2s;
  }
  .cbf-contact-row:hover .cbf-contact-text { color: rgba(255,255,255,0.75); }
  .cbf-contact-text a {
    color: inherit;
    text-decoration: none;
  }
  .cbf-contact-text a:hover { color: #ffa500; }

  /* ---------- bottom bar ---------- */
  .cbf-footer-bottom {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 18px 32px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255,255,255,0.05);
    gap: 12px;
    flex-wrap: wrap;
  }
  .cbf-copyright {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.2);
  }
  .cbf-copyright span { color: #ffa500; }
  .cbf-bottom-links {
    display: flex;
    gap: 20px;
  }
  .cbf-bottom-links a {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.2);
    text-decoration: none;
    transition: color 0.2s;
  }
  .cbf-bottom-links a:hover { color: #ffa500; }

  /* ---------- responsive ---------- */
  @media (max-width: 991px) {
    .cbf-footer-body {
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      padding: 40px 24px 32px;
    }
  }
  @media (max-width: 576px) {
    .cbf-footer-body {
      grid-template-columns: 1fr;
      padding: 32px 20px 24px;
    }
    .cbf-footer-bottom {
      flex-direction: column;
      align-items: flex-start;
      padding: 16px 20px 24px;
    }
  }
`;

/* ─── animation variants ──────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};
const colVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 90, damping: 18 } }
};
/* ─── data ────────────────────────────────────────────────────── */
const quickLinks = [
  { label: 'Home',       path: '/' },
  { label: 'Courses',    path: '/offeredcourses' },
  { label: 'About Us',   path: '/aboutus' },
  { label: 'Contact Us', path: '/contactus' },
];
const resourceLinks = [
  { label: 'Blog',            path: '/privacy-policy' },
  { label: 'FAQs',            path: '/privacy-policy' },
  { label: 'Terms of Use',    path: '/privacy-policy' },
  { label: 'Privacy Policy',  path: '/privacy-policy' },
];

/* ─── component ───────────────────────────────────────────────── */
const Footer = () => (
  <>
    <style>{css}</style>

    <motion.footer
      className="cbf-footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="cbf-footer-topbar" />

      {/* ── main grid ── */}
      <div className="cbf-footer-body">

        {/* brand */}
        <motion.div variants={colVariants}>
          <div className="cbf-footer-brand-name">Code<em>Build</em></div>
          <p className="cbf-footer-tagline">
            An international IT training institute — turning beginners into industry-ready professionals.
          </p>
          <div className="cbf-footer-socials">
            {['Facebook', 'LinkedIn', 'YouTube', 'Instagram'].map(s => (
              <a key={s} href="#" className="cbf-social-pill">{s}</a>
            ))}
          </div>
        </motion.div>

        {/* quick links */}
        <motion.div variants={colVariants}>
          <h5 className="cbf-footer-col-title">Navigate</h5>
          <ul className="cbf-footer-nav">
            {quickLinks.map(({ label, path }) => (
              <li key={label}>
                <Link to={path}>
                  <FaArrowRight className="cbf-nav-arrow" size={9} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* resources */}
        <motion.div variants={colVariants}>
          <h5 className="cbf-footer-col-title">Resources</h5>
          <ul className="cbf-footer-nav">
            {resourceLinks.map(({ label, path }) => (
              <li key={label}>
                <Link to={path}>
                  <FaArrowRight className="cbf-nav-arrow" size={9} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* contact */}
        <motion.div variants={colVariants}>
          <h5 className="cbf-footer-col-title">Get in Touch</h5>
          <div className="cbf-footer-contact">
            <motion.div className="cbf-contact-row" whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 300 }}>
              <div className="cbf-contact-icon-wrap"><FaMapMarkerAlt size={13} /></div>
              <p className="cbf-contact-text">Ravi block iqbal town Lahore, Pakistan</p>
            </motion.div>
            <motion.div className="cbf-contact-row" whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 300 }}>
              <div className="cbf-contact-icon-wrap"><FaPhone size={13} /></div>
              <p className="cbf-contact-text">0328-4452954</p>
            </motion.div>
            <motion.div className="cbf-contact-row" whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 300 }}>
              <div className="cbf-contact-icon-wrap"><FaEnvelope size={13} /></div>
              <p className="cbf-contact-text">
                <a href="mailto:contact@codebuildacademy.com">contact@codebuildacademy.com
                  
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>

      </div>

      {/* ── bottom bar ── */}
      <div className="cbf-footer-bottom">
        <p className="cbf-copyright">
          © 2026 <span>CodeBuild Academy</span>. All rights reserved.
        </p>
        <div className="cbf-bottom-links">
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/privacy-policy">Terms</Link>
          <Link to="/privacy-policy">Cookies</Link>
        </div>
      </div>

    </motion.footer>
  </>
);

export default Footer;