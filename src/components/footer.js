import React from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaChevronRight } from 'react-icons/fa';
import "./css/footer.css";
import { Link } from 'react-router-dom';
const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

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
          <Col md={3} className="footer-column">
            <motion.div variants={itemVariants}>
              <h5 className="footer-heading">Codebuild</h5>
              <motion.p 
                className="footer-text"
                whileHover={{ color: '#ffa500' }}
              >
                Learn what matters and build amazing projects
              </motion.p>
            </motion.div>
          </Col>

        <Col md={3} className="footer-column">
  <motion.div variants={itemVariants}>
    <h5 className="footer-heading">Quick Links</h5>
    <ListGroup className="footer-links">
      {[
        { label: 'Home', path: '/' },
        { label: 'Courses', path: '/offeredcourses' },
        { label: 'About Us', path: '/aboutus' },
        { label: 'Contact Us', path: '/contactus' },
      ].map((item, index) => (
        <motion.div
          key={index}
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ListGroupItem className="footer-link-item">
            <FaChevronRight className="link-icon" />
            <a href={item.path}>{item.label}</a>
          </ListGroupItem>
        </motion.div>
      ))}
    </ListGroup>
  </motion.div>
</Col>


          <Col md={3} className="footer-column">
            <motion.div variants={itemVariants}>
              <h5 className="footer-heading">Resources</h5>
              <ListGroup className="footer-links">
                {['Blog', 'FAQs', 'Terms', 'Privacy'].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ListGroupItem className="footer-link-item">
                      <FaChevronRight className="link-icon" />
                      <Link to="/privacy-policy">{item}</Link>
                    </ListGroupItem>
                  </motion.div>
                ))}
              </ListGroup>
            </motion.div>
          </Col>

          <Col md={3} className="footer-column">
            <motion.div variants={itemVariants}>
              <h5 className="footer-heading">Get in Touch</h5>
              <div className="contact-info">
                <motion.div 
                  className="contact-item"
                  whileHover={{ scale: 1.02 }}
                >
                  <FaMapMarkerAlt className="contact-icon" />
                  <p>40-D gulshan-e-ravi near furqan Surgical Hospital, Lahore, Pakistan</p>
                </motion.div>
                <motion.div 
                  className="contact-item"
                  whileHover={{ scale: 1.02 }}
                >
                  <FaPhone className="contact-icon" />
                  <p>0328-4452954</p>
                </motion.div>
                <motion.div 
                  className="contact-item"
                  whileHover={{ scale: 1.02 }}
                >
                  <FaEnvelope className="contact-icon" />
                  <a href="mailto:codecraft1122@gmail.com">codecraft1122@gmail.com</a>
                </motion.div>
              </div>
            </motion.div>
          </Col>
        </Row>

        <Row>
          <Col md={12} className="text-center copyright">
            <motion.p
              whileHover={{ color: '#ffa500' }}
              transition={{ duration: 0.3 }}
            >
              Copyright © 2025 Codebuild. All rights reserved.
            </motion.p>
          </Col>
        </Row>
      </Container>
    </motion.footer>
  );
};

export default Footer;