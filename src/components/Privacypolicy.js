import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiExternalLink } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';

const PrivacyPolicy = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  // Floating elements animation
  const floatingVariants = {
    initial: { y: 0, x: 0 },
    animate: {
      y: [0, -20, 0],
      x: [0, 10, 0],
      transition: {
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingVariants2 = {
    initial: { y: 0, x: 0 },
    animate: {
      y: [0, 30, 0],
      x: [0, -15, 0],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingVariants3 = {
    initial: { y: 0, x: 0 },
    animate: {
      y: [0, -40, 0],
      x: [0, 20, 0],
      transition: {
        duration: 25,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="privacy-policy-container">
      {/* Floating background elements */}
      <motion.div 
        className="floating-item item-1"
        variants={floatingVariants}
        initial="initial"
        animate="animate"
      />
      <motion.div 
        className="floating-item item-2"
        variants={floatingVariants2}
        initial="initial"
        animate="animate"
      />
      <motion.div 
        className="floating-item item-3"
        variants={floatingVariants3}
        initial="initial"
        animate="animate"
      />

      <motion.div 
        className="privacy-content"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="privacy-header" variants={itemVariants}>
          <h1>Privacy <span className="highlight">Policy</span></h1>
          <p>Last Updated: June 1, 2025</p>
        </motion.div>

        <motion.div className="privacy-body" variants={containerVariants}>
          <motion.section variants={itemVariants}>
            <h2>1. Information We Collect</h2>
            <p>
              We collect information when you register on our site, enroll in courses, 
              subscribe to our newsletter, or fill out a form. This may include:
            </p>
            <ul>
              <li>Name, email address, and contact details</li>
              <li>Payment information for course purchases</li>
              <li>Technical data like IP address and browser type</li>
              <li>Course progress and performance data</li>
            </ul>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2>2. How We Use Your Information</h2>
            <p>
              The information we collect may be used to:
            </p>
            <ul>
              <li>Personalize your learning experience</li>
              <li>Process transactions and enrollments</li>
              <li>Improve our website and course offerings</li>
              <li>Send periodic emails regarding your courses</li>
              <li>Provide customer support</li>
            </ul>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2>3. Data Protection</h2>
            <p>
              We implement security measures to maintain the safety of your personal 
              information. All sensitive/credit information is transmitted via Secure 
              Socket Layer (SSL) technology and encrypted in our payment gateway providers' 
              databases.
            </p>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2>4. Cookies</h2>
            <p>
              We use cookies to understand and save your preferences for future visits and 
              compile aggregate data about site traffic and interaction. You can choose to 
              disable cookies through your browser settings.
            </p>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2>5. Third-Party Disclosure</h2>
            <p>
              We do not sell, trade, or transfer your personally identifiable information 
              to outside parties except trusted third parties who assist us in operating our 
              website, conducting our business, or servicing you, so long as those parties 
              agree to keep this information confidential.
            </p>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2>6. Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request restriction of processing</li>
              <li>Request data portability</li>
            </ul>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2>7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of 
              any changes by posting the new Privacy Policy on this page and updating the 
              "Last Updated" date.
            </p>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="contact-info">
              <div className="contact-info-item">
                <FiMail className="info-icon" />
                <span>codebuildacademy.info</span>
              </div>
              <div className="contact-info-item">
                <FiPhone className="info-icon" />
                <span>+92 328 4452 954</span>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .privacy-policy-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          padding: 2rem;
          box-sizing: border-box;
          background: #0a0a0a;
        }

        .privacy-content {
          width: 100%;
          max-width: 1200px;
          z-index: 2;
          position: relative;
        }

        .privacy-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .privacy-header h1 {
          font-size: 4rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: #ffa500;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 20px rgba(255, 165, 0, 0.3);
        }

        .highlight {
          color: #ffa500;
        }

        .privacy-header p {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
          opacity: 0.9;
        }

        .privacy-body {
          background: rgba(30, 30, 30, 0.5);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }

        section {
          margin-bottom: 2.5rem;
        }

        h2 {
          color: #ffa500;
          margin-bottom: 1rem;
          font-size: 1.8rem;
        }

        p, li {
          line-height: 1.6;
          margin-bottom: 0.8rem;
          opacity: 0.9;
        }

        ul {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }

        li {
          margin-bottom: 0.5rem;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .contact-info-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(5px);
          padding: 1rem 1.5rem;
          border-radius: 50px;
          transition: all 0.3s ease;
          max-width: 500px;
          width: 100%;
        }

        .contact-info-item:hover {
          background: rgba(255, 165, 0, 0.1);
        }

        .info-icon {
          font-size: 1.2rem;
          color: #ffa500;
          min-width: 25px;
        }

        /* Floating Elements */
        .floating-item {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 165, 0, 0.1);
          border: 1px solid rgba(255, 165, 0, 0.3);
          pointer-events: none;
          z-index: 1;
        }

        .item-1 {
          width: 100px;
          height: 100px;
          top: 20%;
          left: 10%;
        }

        .item-2 {
          width: 150px;
          height: 150px;
          bottom: 15%;
          right: 10%;
        }

        .item-3 {
          width: 70px;
          height: 70px;
          top: 60%;
          left: 25%;
        }

        @media (max-width: 768px) {
          .privacy-header h1 {
            font-size: 3rem;
          }
          
          .privacy-body {
            padding: 1.5rem;
          }
          
          h2 {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .privacy-header h1 {
            font-size: 2.5rem;
          }
          
          .privacy-header p {
            font-size: 1rem;
          }
          
          .privacy-body {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;