import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from "react-router-dom";
import { FaUserGraduate, FaTimes, FaCertificate, FaBars, FaBolt } from 'react-icons/fa';
import logo from '../components/logo.png';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Dosis:wght@400;600;700;800&family=Bebas+Neue&display=swap');

  :root {
    --cbn-height: 72px;
    --cbn-bg: #0a0a0f;
    --cbn-orange: #ffa500;
    --cbn-orange-dim: rgba(255,165,0,0.12);
    --cbn-border: rgba(255,165,0,0.12);
    --cbn-text: rgba(255,255,255,0.82);
  }

  .cbn-bar {
    position: sticky;
    top: 0;
    width: 100%;
    height: var(--cbn-height);
    background: var(--cbn-bg);
    border-bottom: 1px solid var(--cbn-border);
    z-index: 1000;
    transition: box-shadow 0.3s, border-color 0.3s;
    font-family: "Dosis", sans-serif;
  }
  .cbn-bar.cbn-scrolled {
    box-shadow: 0 4px 40px rgba(0,0,0,0.7);
    border-bottom-color: rgba(255,165,0,0.22);
  }
  .cbn-bar::after {
    content: "";
    position: absolute;
    bottom: -1px; left: 0;
    height: 2px;
    width: 0;
    background: linear-gradient(90deg, #ffa500, rgba(255,165,0,0.2));
    transition: width 0.5s ease;
    pointer-events: none;
  }
  .cbn-bar.cbn-scrolled::after { width: 100%; }

  .cbn-inner {
    height: var(--cbn-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.25rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }

  .cbn-brand {
    display: flex;
    align-items: center;
    gap: 11px;
    text-decoration: none !important;
    flex-shrink: 0;
  }
  .cbn-logo-wrap {
    width: 38px; height: 38px;
    border-radius: 4px;
    border: 1px solid rgba(255,165,0,0.25);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,165,0,0.06);
  }
  .cbn-logo { width: 28px; height: 28px; object-fit: contain; }
  .cbn-brand-name {
    font-family: "Bebas Neue", sans-serif;
    font-size: 24px;
    letter-spacing: 2.5px;
    color: #fff;
    line-height: 1;
    display: flex;
    align-items: baseline;
  }
  .cbn-brand-name em { color: var(--cbn-orange); font-style: normal; }

  .cbn-links {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    justify-content: center;
  }
  .cbn-link {
    position: relative;
    color: var(--cbn-text) !important;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    text-decoration: none !important;
    padding: 6px 14px;
    border-radius: 3px;
    transition: color 0.2s;
  }
  .cbn-link::after {
    content: "";
    position: absolute;
    bottom: 0; left: 14px; right: 14px;
    height: 1px;
    background: var(--cbn-orange);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s cubic-bezier(0.22,1,0.36,1);
  }
  .cbn-link:hover,
  .cbn-link.cbn-active { color: #fff !important; }
  .cbn-link:hover::after,
  .cbn-link.cbn-active::after { transform: scaleX(1); }
  .cbn-link.cbn-active { color: var(--cbn-orange) !important; }

  /* ── daily challenge link — special pulsing badge ── */
  .cbn-challenge-link {
    position: relative;
    color: var(--cbn-text) !important;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    text-decoration: none !important;
    padding: 6px 14px;
    border-radius: 3px;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .cbn-challenge-link::after {
    content: "";
    position: absolute;
    bottom: 0; left: 14px; right: 14px;
    height: 1px;
    background: var(--cbn-orange);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s cubic-bezier(0.22,1,0.36,1);
  }
  .cbn-challenge-link:hover,
  .cbn-challenge-link.cbn-active { color: #fff !important; }
  .cbn-challenge-link:hover::after,
  .cbn-challenge-link.cbn-active::after { transform: scaleX(1); }
  .cbn-challenge-link.cbn-active { color: var(--cbn-orange) !important; }

  .cbn-new-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    background: rgba(255,165,0,0.15);
    border: 1px solid rgba(255,165,0,0.3);
    color: #ffa500;
    font-size: 7px;
    font-weight: 800;
    letter-spacing: 1.5px;
    padding: 2px 5px;
    border-radius: 3px;
    line-height: 1;
    animation: cbn-badge-pulse 2s ease-in-out infinite;
  }
  .cbn-new-badge-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: #ffa500;
    animation: cbn-dot-blink 1.5s ease-in-out infinite;
    flex-shrink: 0;
  }

  .cbn-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .cbn-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    text-decoration: none !important;
    font-family: "Dosis", sans-serif;
    font-weight: 800;
    font-size: 12px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 8px 18px;
    border-radius: 3px;
    border: 1px solid rgba(255,165,0,0.35);
    color: var(--cbn-orange) !important;
    background: transparent;
    transition: background 0.25s, border-color 0.25s, color 0.25s, box-shadow 0.25s;
    white-space: nowrap;
  }
  .cbn-btn:hover {
    background: var(--cbn-orange);
    border-color: var(--cbn-orange);
    color: #0a0a0f !important;
    box-shadow: 0 4px 18px rgba(255,165,0,0.25);
  }
  .cbn-btn--fill {
    background: var(--cbn-orange);
    border-color: var(--cbn-orange);
    color: #0a0a0f !important;
    box-shadow: 0 4px 18px rgba(255,165,0,0.2);
  }
  .cbn-btn--fill:hover {
    background: transparent;
    color: var(--cbn-orange) !important;
    box-shadow: none;
  }

  .cbn-toggle {
    display: none;
    width: 40px; height: 40px;
    align-items: center;
    justify-content: center;
    background: var(--cbn-orange-dim);
    border: 1px solid rgba(255,165,0,0.2);
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
    outline: none;
    flex-shrink: 0;
  }
  .cbn-toggle:hover { background: rgba(255,165,0,0.2); }

  .cbn-overlay {
    position: fixed;
    top: var(--cbn-height);
    left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.75);
    z-index: 998;
  }
  .cbn-drawer {
    position: absolute;
    top: 100%; left: 0; right: 0;
    background: #0d0d12;
    border-bottom: 1px solid rgba(255,165,0,0.15);
    z-index: 999;
    overflow: hidden;
  }
  .cbn-drawer-inner { padding: 8px 0 16px; }
  .cbn-mobile-link {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--cbn-text) !important;
    text-decoration: none !important;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 14px 24px;
    border-left: 3px solid transparent;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .cbn-mobile-link:hover,
  .cbn-mobile-link.cbn-active {
    color: var(--cbn-orange) !important;
    border-left-color: var(--cbn-orange);
    background: rgba(255,165,0,0.04);
  }

  /* mobile challenge row — highlighted */
  .cbn-mobile-challenge {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--cbn-text) !important;
    text-decoration: none !important;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 14px 24px;
    border-left: 3px solid transparent;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
    background: rgba(255,165,0,0.03);
  }
  .cbn-mobile-challenge:hover,
  .cbn-mobile-challenge.cbn-active {
    color: var(--cbn-orange) !important;
    border-left-color: var(--cbn-orange);
    background: rgba(255,165,0,0.07);
  }
  .cbn-mobile-challenge-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cbn-mobile-divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 8px 24px;
  }
  .cbn-mobile-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 24px 4px;
  }
  .cbn-btn--mobile {
    justify-content: center;
    width: 100%;
    padding: 12px 18px;
    font-size: 13px;
  }

  @keyframes cbn-badge-pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.7; transform: scale(0.97); }
  }
  @keyframes cbn-dot-blink {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.3; }
  }

  @media (max-width: 991px) {
    .cbn-links, .cbn-actions { display: none; }
    .cbn-toggle { display: flex; }
  }
  @media (min-width: 992px) {
    .cbn-toggle, .cbn-overlay, .cbn-drawer { display: none !important; }
  }
`;

function NavigationBar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [isMobile,    setIsMobile]    = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    const onScroll = () => setScrolled(window.scrollY > 10);
    onResize();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const navLinks = [
    { path: "/offeredcourses", text: "Courses" },
    { path: "/aboutus",        text: "About Us" },
    { path: "/contactus",      text: "Contact"  },
    { path: "/blog",          text: "Blog"     },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{css}</style>

      <AnimatePresence>
        {mobileOpen && isMobile && (
          <motion.div
            className="cbn-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <nav className={`cbn-bar${scrolled ? ' cbn-scrolled' : ''}`}>
        <div className="cbn-inner">

          {/* Brand */}
          <Link to="/" className="cbn-brand">
            <motion.div
              className="cbn-logo-wrap"
              whileHover={{ rotate: 8, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <img src={logo} alt="CodeBuild Logo" className="cbn-logo" />
            </motion.div>
            <span className="cbn-brand-name">Code<em>Build</em></span>
          </Link>

          {/* Desktop nav links */}
          {!isMobile && (
            <nav className="cbn-links">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`cbn-link${isActive(link.path) ? ' cbn-active' : ''}`}
                >
                  {link.text}
                </Link>
              ))}

              {/* Daily Challenge — special link */}
              <Link
                to="/daily-challenge"
                className={`cbn-challenge-link${isActive('/daily-challenge') ? ' cbn-active' : ''}`}
              >
                <FaBolt size={10} style={{ color: '#ffa500', flexShrink: 0 }} />
                Daily Challenge
                <span className="cbn-new-badge">
                  <span className="cbn-new-badge-dot" />
                  LIVE
                </span>
              </Link>
            </nav>
          )}

          {/* Desktop action buttons */}
          {!isMobile && (
            <div className="cbn-actions">
              <Link
                to="/Certificate-verification"
                className="cbn-btn"
              >
                <FaCertificate size={12} />
                Verify Certificate
              </Link>
              <Link to="/" className="cbn-btn cbn-btn--fill">
                <FaUserGraduate size={12} />
                Enroll Now
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          {isMobile && (
            <button
              className="cbn-toggle"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Menu"
            >
              {mobileOpen
                ? <FaTimes color="#ffa500" size={18} />
                : <FaBars  color="#ffa500" size={18} />
              }
            </button>
          )}
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && isMobile && (
            <motion.div
              className="cbn-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="cbn-drawer-inner">

                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 + 0.05 }}
                  >
                    <Link
                      to={link.path}
                      className={`cbn-mobile-link${isActive(link.path) ? ' cbn-active' : ''}`}
                    >
                      {link.text}
                    </Link>
                  </motion.div>
                ))}

                {/* Daily Challenge row in mobile */}
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.06 + 0.05 }}
                >
                  <Link
                    to="/daily-challenge"
                    className={`cbn-mobile-challenge${isActive('/daily-challenge') ? ' cbn-active' : ''}`}
                  >
                    <div className="cbn-mobile-challenge-left">
                      <FaBolt size={11} color="#ffa500" />
                      Daily Challenge
                    </div>
                    <span className="cbn-new-badge">
                      <span className="cbn-new-badge-dot" />
                      LIVE
                    </span>
                  </Link>
                </motion.div>

                <div className="cbn-mobile-divider" />

                <motion.div
                  className="cbn-mobile-actions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <Link
                    to="/Certificate-verification"
                    className="cbn-btn cbn-btn--mobile"
                  >
                    <FaCertificate size={12} />
                    Verify Certificate
                  </Link>
                  <Link to="/" className="cbn-btn cbn-btn--fill cbn-btn--mobile">
                    <FaUserGraduate size={12} />
                    Enroll Now
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

export default NavigationBar;