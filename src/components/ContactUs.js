import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaInstagram, 
  FaFacebook, 
  FaWhatsapp, 
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaPaperPlane
} from 'react-icons/fa';
import { Form, Button } from 'react-bootstrap';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import "../components/css/ContactUs.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef(null);

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  const socialLinks = [
    { icon: FaInstagram, color: "#E1306C", url: "https://www.instagram.com/codebuild1" },
    { icon: FaFacebook, color: "#4267B2", url: "https://www.facebook.com/profile.php?id=61563588339796" },
    { icon: FaWhatsapp, color: "#25D366", url: "https://wa.me/+923284452954" },
    { icon: FaLinkedin, color: "#2867B2", url: "https://www.linkedin.com/company/codebuild-academy" }
  ];

  const contactInfo = [
    { icon: FaPhone, text: "0328-4452954" },
    { icon: FaEnvelope, text: "contact@codebuildacademy.com" },
    { icon: FaMapMarkerAlt, text: "Ravi block, iqbal town lahore Pakistan" }
  ];

  return (
    <div className="contact-us-container">
      {/* Animated Particles Background */}
      <Particles
        id="contact-particles"
        init={particlesInit}
        options={{
          background: {
            color: "#0a0a0a",
          },
          particles: {
            number: {
              value: 60,
              density: {
                enable: true,
                area: 800
              }
            },
            color: {
              value: "#ffa500"
            },
            shape: {
              type: "circle"
            },
            opacity: {
              value: 0.5
            },
            size: {
              value: { min: 1, max: 3 }
            },
            links: {
              color: "#ffa500",
              distance: 150,
              enable: true,
              opacity: 0.4,
              width: 1
            },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              random: false,
              straight: false,
              outModes: "bounce"
            }
          },
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse"
              },
              onClick: {
                enable: true,
                mode: "push"
              }
            }
          }
        }}
      />

      <motion.div 
        className="contact-us-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Header Section */}
        <motion.div 
          className="contact-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            Let's <span className="highlight">Connect</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            We'd love to hear from you! Reach out through any channel below.
          </motion.p>
        </motion.div>

        {/* Social Links */}
        <motion.div 
          className="social-links-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          {socialLinks.map(({ icon: Icon, color, url }, index) => (
            <motion.a
              key={index}
              href={url}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -5, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            >
              <Icon 
                size={32}
                color={color} 
                className="social-icon"
              />
            </motion.a>
          ))}
        </motion.div>

        {/* Contact Info */}
        <motion.div 
          className="contact-info-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          {contactInfo.map(({ icon: Icon, text }, index) => (
            <motion.div
              key={index}
              className="contact-info-item"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
              whileHover={{ x: 5 }}
            >
              <Icon 
                size={20}
                color="#ffa500"
                className="info-icon"
              />
              <span>{text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="form-container"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <Form 
            ref={formRef} 
            onSubmit={handleSubmit}
            className="contact-form glass-card"
          >
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.8 }}
            >
              Send Us a Message
            </motion.h3>

            <Form.Group controlId="formBasicName" className="form-group">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name" 
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail" className="form-group">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email" 
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicMessage" className="form-group">
              <Form.Label>Message</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message here..." 
                required
              />
            </Form.Group>

            <motion.div
              className="submit-btn-container"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="submit-btn"
              >
                <FaPaperPlane className="btn-icon" />
                Send Message
              </Button>
            </motion.div>
          </Form>

          {/* Submission Confirmation */}
          <AnimatePresence>
            {isSubmitted && (
              <motion.div
                className="success-message"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  ✓
                </motion.div>
                <p>Your message has been sent successfully!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Floating Contact Elements */}
        <motion.div 
          className="floating-contact"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              className={`floating-item item-${item}`}
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 3 + item,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactUs;