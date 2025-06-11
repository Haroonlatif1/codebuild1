import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiAlertTriangle } from 'react-icons/fi';

const CertificateVerification = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsButtonClicked(true);
    
    // Show modal after animation completes
    setTimeout(() => setShowModal(true), 1000);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setIsButtonClicked(false), 300);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    minimized: {
      y: -100,
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeIn"
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    loading: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="verification-container">
      {/* Floating background elements */}
      <motion.div 
        className="floating-item item-1"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="floating-item item-2"
        animate={{
          y: [0, 30, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="verification-content"
        initial="hidden"
        animate={isButtonClicked ? "minimized" : "visible"}
        variants={containerVariants}
      >
        <motion.form 
          onSubmit={handleSubmit}
          className="glass-card verification-form"
        >
          <h2 className="form-title">
            Certificate <span className="highlight">Verification</span>
          </h2>
          
          <div className="input-group">
            <label htmlFor="serial">Serial Number</label>
            <input
              id="serial"
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="Enter certificate serial number"
              required
            />
          </div>
          
          <motion.button 
            type="submit"
            className="verify-button"
            disabled={isButtonClicked}
            variants={buttonVariants}
            animate={isButtonClicked ? "loading" : "initial"}
          >
            {isButtonClicked ? (
              <>
                <FiSearch className="btn-icon" />
                Verifying...
              </>
            ) : (
              <>
                <FiSearch className="btn-icon" />
                Verify Now
              </>
            )}
          </motion.button>
        </motion.form>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="modal-overlay"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content glass-card"
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="maintenance-animation">
                <div className="gear"></div>
                <div className="gear reverse"></div>
                <div className="gear small"></div>
              </div>
              
              <h3 className="modal-title">
                <FiAlertTriangle className="icon" />
                Service Unavailable
              </h3>
              <p className="modal-message">
                Our certificate verification system is currently undergoing maintenance.
                Please try again later.
              </p>
              
              <button 
                className="modal-close-button"
                onClick={closeModal}
              >
                <FiX className="icon" />
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .verification-container {
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

        .verification-content {
          width: 100%;
          max-width: 600px;
          z-index: 2;
          position: relative;
          display: flex;
          justify-content: center;
        }

        .glass-card {
          background: rgba(30, 30, 30, 0.5);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }

        .verification-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-title {
          text-align: center;
          font-size: 2.5rem;
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

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-weight: 500;
          opacity: 0.9;
        }

        .input-group input {
          width: 100%;
          padding: 0.8rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          color: #fff;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .input-group input:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: #ffa500;
          box-shadow: 0 0 0 0.2rem rgba(255, 165, 0, 0.25);
          outline: none;
        }

        .input-group input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .verify-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(45deg, #ff8c00, #ffa500);
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1.1rem;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .verify-button:hover:not(:disabled) {
          background: linear-gradient(45deg, #ff7900, #ff8c00);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 165, 0, 0.3);
        }

        .verify-button:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .btn-icon {
          font-size: 1rem;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }

        .modal-content {
          width: 90%;
          max-width: 500px;
          padding: 2rem;
          text-align: center;
          position: relative;
        }

        .modal-title {
          font-size: 1.8rem;
          margin: 1.5rem 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #ffa500;
        }

        .modal-title .icon {
          font-size: 1.5rem;
        }

        .modal-message {
          margin-bottom: 2rem;
          line-height: 1.6;
          opacity: 0.9;
        }

        .modal-close-button {
          padding: 0.8rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50px;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin: 0 auto;
        }

        .modal-close-button:hover {
          background: rgba(255, 165, 0, 0.2);
        }

        /* Maintenance Animation */
        .maintenance-animation {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto;
        }

        .gear {
          position: absolute;
          width: 80px;
          height: 80px;
          background: rgba(255, 165, 0, 0.1);
          border-radius: 50%;
          border: 2px dashed #ffa500;
          animation: spin 4s linear infinite;
        }

        .gear.reverse {
          width: 60px;
          height: 60px;
          top: 30px;
          left: 30px;
          animation: spin-reverse 3s linear infinite;
        }

        .gear.small {
          width: 40px;
          height: 40px;
          top: 40px;
          left: 40px;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
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

        @media (max-width: 768px) {
          .form-title {
            font-size: 2rem;
          }
          
          .glass-card {
            padding: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .form-title {
            font-size: 1.8rem;
          }
          
          .verification-container {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CertificateVerification;