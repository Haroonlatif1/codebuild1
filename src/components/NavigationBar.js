import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from "react-router-dom";
import { FaChevronDown, FaUserGraduate, FaTimes } from 'react-icons/fa';
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

    handleResize(); // Initial check
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
              <button 
                as={Link} 
                to="/" 
                className="enroll-btn"
              >
                <FaUserGraduate className="me-2" />
                Enroll Now
              </button>
              <button as={Link} 
                to="/Verifycertificate" 
                className="enroll-btn ">Verify your certificate</button>
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
      </Navbar>
    </>
  );
}

export default NavigationBar;