import React from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaChevronRight,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import "./css/footer.css";

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const socialLinks = [
    { icon: FaFacebookF, url: '#', color: '#1877f2' },
    { icon: FaTwitter, url: '#', color: '#1da1f2' },
    { icon: FaLinkedinIn, url: '#', color: '#0077b5' },
    { icon: FaInstagram, url: '#', color: '#e4405f' },
    { icon: FaYoutube, url: '#', color: '#ff0000' }
  ];

  return (
    <motion.footer
      className="cinematic-footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
    >
      <Container>
        <Row>
          {/* ABOUT */}
          <Col lg={3} md={6} className="footer-column">
            <motion.div variants={itemVariants}>
              <h5 className="footer-heading">Codebuild</h5>
              <p className="footer-text">
                Learn what matters and build amazing projects. Transform your career with cutting-edge technology skills.
              </p>

              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    className="social-icon"
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: social.color,
                      borderColor: social.color
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <social.icon />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </Col>

          {/* QUICK LINKS */}
          <Col lg={3} md={6} className="footer-column">
            <motion.div variants={itemVariants}>
              <h5 className="footer-heading">Quick Links</h5>
              <ListGroup className="footer-links">
                {[
                  { label: 'Home', path: '/' },
                  { label: 'Courses', path: '/offeredcourses' },
                  { label: 'About Us', path: '/aboutus' },
                  { label: 'Contact Us', path: '/contactus' },
                ].map((item, index) => (
                  <motion.div key={index} whileHover={{ x: 5 }}>
                    <ListGroupItem className="footer-link-item">
                      <FaChevronRight className="link-icon" />
                      <Link to={item.path}>{item.label}</Link>
                    </ListGroupItem>
                  </motion.div>
                ))}
              </ListGroup>
            </motion.div>
          </Col>

          {/* RESOURCES */}
          <Col lg={3} md={6} className="footer-column">
            <motion.div variants={itemVariants}>
              <h5 className="footer-heading">Resources</h5>
              <ListGroup className="footer-links">
                {[
                  { label: 'Blog', path: '/blog' },
                  { label: 'FAQs', path: '/faqs' },
                  { label: 'Terms', path: '/terms' },
                  { label: 'Privacy Policy', path: '/privacy-policy' },
                ].map((item, index) => (
                  <motion.div key={index} whileHover={{ x: 5 }}>
                    <ListGroupItem className="footer-link-item">
                      <FaChevronRight className="link-icon" />
                      <Link to={item.path}>{item.label}</Link>
                    </ListGroupItem>
                  </motion.div>
                ))}
              </ListGroup>
            </motion.div>
          </Col>

          {/* CONTACT */}
          <Col lg={3} md={6} className="footer-column">
            <motion.div variants={itemVariants}>
              <h5 className="footer-heading">Get in Touch</h5>
              <div className="contact-info">
                <div className="contact-item">
                  <FaMapMarkerAlt className="contact-icon" />
                  <p>40-D Gulshan-e-Ravi, Lahore, Pakistan</p>
                </div>

                <div className="contact-item">
                  <FaPhone className="contact-icon" />
                  <a href="tel:03284452954">0328-4452954</a>
                </div>

                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <a href="mailto:codecraft1122@gmail.com">codecraft1122@gmail.com</a>
                </div>
              </div>
            </motion.div>
          </Col>
        </Row>

        <div className="footer-divider"></div>

        <Row>
          <Col className="text-center copyright">
            <motion.p whileHover={{ color: '#ffa500' }}>
              © 2025 Codebuild. All rights reserved. Made with ❤️ in Pakistan
            </motion.p>
          </Col>
        </Row>
      </Container>
    </motion.footer>
  );
};

export default Footer;
