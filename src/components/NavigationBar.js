import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from "react-router-dom";
import { FaChevronDown, FaUserGraduate, FaTimes, FaCertificate } from 'react-icons/fa';
import logo from '../components/logo.png';
import './css/Navbar.css';

function NavigationBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (!isMobile) setMobileOpen(false);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  const navLinks = [
    { path: "/offeredcourses", text: "Offered Courses" },
    { path: "/aboutus", text: "About Us" },
    { path: "/contactus", text: "Contact Us" }
  ];

  return (
    <>
      {/* Blur Overlay */}
      <AnimatePresence>
        {mobileOpen && isMobile && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Navbar */}
      <Navbar 
        expand="lg" 
        className={`sticky-navbar ${scrolled ? 'scrolled' : ''}`}
        sticky="top"
      >
        <Container>
          {/* Brand Logo */}
          <Navbar.Brand as={Link} to="/">
            <motion.div whileHover={{ rotate: 10 }}>
              <img src={logo} alt="Logo" className="navbar-logo" />
            </motion.div>
            <span className="brand-text">Codebuild</span>
          </Navbar.Brand>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              <Nav className="me-auto">
                {navLinks.map((link, index) => (
                  <Nav.Link 
                    as={Link} 
                    to={link.path} 
                    key={index}
                    className="nav-link-item"
                  >
                    {link.text}
                  </Nav.Link>
                ))}
              </Nav>
              <Link to="/" className="enroll-btn">
                <FaUserGraduate className="me-2" />
                Enroll Now
              </Link>
              <Link to="/certificate-verification" className="enroll-btn">
                <FaCertificate className="me-2" />
                Verify Certificate
              </Link>
            </>
          )}

          {/* Mobile Toggle */}
          {isMobile && (
            <button 
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <FaTimes color="#ffa500" size={24} />
              ) : (
                <FaChevronDown color="#ffa500" size={24} />
              )}
            </button>
          )}
        </Container>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && isMobile && (
            <motion.div 
              className="mobile-menu-container"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mobile-menu">
                {navLinks.map((link, index) => (
                  <Link 
                    to={link.path} 
                    key={index}
                    className="mobile-nav-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.text}
                  </Link>
                ))}
                <div className="mobile-buttons">
                  <Link to="/" className="enroll-btn mobile-btn" onClick={() => setMobileOpen(false)}>
                    <FaUserGraduate className="me-2" />
                    Enroll Now
                  </Link>
                  <Link to="/certificate-verification" className="enroll-btn mobile-btn" onClick={() => setMobileOpen(false)}>
                    <FaCertificate className="me-2" />
                    Verify Certificate
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Navbar>
    </>
  );
}

export default NavigationBar;