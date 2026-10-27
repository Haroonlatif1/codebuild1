import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiAlertTriangle, FiCheckCircle, FiXCircle, FiCalendar, FiUser, FiBook, FiAward } from 'react-icons/fi';
import { supabase } from './supabase/SupabaseClient';

/* ═══════════════════════════════════════════════════════════════════
   CERTIFICATE VERIFICATION — CodeBuild Academy
   ✦ Live Supabase lookup by cert_id
   ✦ Shows full certificate details on match
   ✦ Handles revoked, expired, not found states
   ✦ Original design preserved
════════════════════════════════════════════════════════════════════ */

const CertificateVerification = () => {
  const [serialNumber,   setSerialNumber]   = useState('');
  const [isLoading,      setIsLoading]      = useState(false);
  const [result,         setResult]         = useState(null); // null | { status, cert? }
  const [showModal,      setShowModal]      = useState(false);
  const [isButtonClicked,setIsButtonClicked]= useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serialNumber.trim()) return;

    setIsButtonClicked(true);
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('cert_id', serialNumber.trim().toUpperCase())
        .single();

      if (error || !data) {
        setResult({ status: 'not_found' });
      } else if (!data.is_active) {
        setResult({ status: 'revoked', cert: data });
      } else if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
        setResult({ status: 'expired', cert: data });
      } else {
        setResult({ status: 'valid', cert: data });
      }
    } catch {
      setResult({ status: 'error' });
    }

    setIsLoading(false);
    setTimeout(() => setShowModal(true), 500);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setIsButtonClicked(false);
      setResult(null);
    }, 300);
  };

  const fmtDate = (d) => d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : null;

  // Status configs
  const STATUS = {
    valid: {
      icon: <FiCheckCircle style={{fontSize:40, color:'#22c55e'}}/>,
      title: 'Certificate Verified',
      titleColor: '#22c55e',
      badge: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)', color: '#22c55e', text: '✓ VALID' },
    },
    revoked: {
      icon: <FiXCircle style={{fontSize:40, color:'#ef4444'}}/>,
      title: 'Certificate Revoked',
      titleColor: '#ef4444',
      badge: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', color: '#ef4444', text: '✕ REVOKED' },
    },
    expired: {
      icon: <FiAlertTriangle style={{fontSize:40, color:'#f59e0b'}}/>,
      title: 'Certificate Expired',
      titleColor: '#f59e0b',
      badge: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', color: '#f59e0b', text: '⚠ EXPIRED' },
    },
    not_found: {
      icon: <FiAlertTriangle style={{fontSize:40, color:'#ffa500'}}/>,
      title: 'Certificate Not Found',
      titleColor: '#ffa500',
      badge: null,
    },
    error: {
      icon: <FiAlertTriangle style={{fontSize:40, color:'#ef4444'}}/>,
      title: 'Verification Error',
      titleColor: '#ef4444',
      badge: null,
    },
  };

  const containerVariants = {
    hidden:    { opacity: 0, y: 20 },
    visible:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    minimized: { y: -100, scale: 0.8, opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } },
  };

  const modalVariants = {
    hidden:  { opacity: 0, y: 50, scale: 0.96 },
    visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
  };

  const s = result ? STATUS[result.status] : null;

  return (
    <div className="verification-container">
      {/* Floating ambient orbs */}
      <motion.div className="floating-item item-1"
        animate={{ y:[0,-20,0], x:[0,10,0] }}
        transition={{ duration:15, repeat:Infinity, ease:'easeInOut' }}
      />
      <motion.div className="floating-item item-2"
        animate={{ y:[0,30,0], x:[0,-15,0] }}
        transition={{ duration:20, repeat:Infinity, ease:'easeInOut' }}
      />
      <motion.div className="floating-item item-3"
        animate={{ y:[0,-15,0], x:[0,8,0] }}
        transition={{ duration:12, repeat:Infinity, ease:'easeInOut' }}
      />

      {/* Main form card */}
      <motion.div
        className="verification-content"
        initial="hidden"
        animate={isButtonClicked ? 'minimized' : 'visible'}
        variants={containerVariants}
      >
        <motion.form onSubmit={handleSubmit} className="glass-card verification-form">
          <div className="form-logo">
            <span className="form-logo-cbd">CBD</span>
            <span className="form-logo-dot">●</span>
          </div>

          <h2 className="form-title">
            Certificate <span className="highlight">Verification</span>
          </h2>
          <p className="form-desc">
            Enter the Certificate ID printed on your CodeBuild Academy certificate to verify its authenticity.
          </p>

          <div className="input-group">
            <label htmlFor="serial">Certificate ID</label>
            <div className="input-wrap">
              <FiSearch className="input-icon"/>
              <input
                id="serial"
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
                placeholder="e.g. CBD-2025-001"
                required
                autoComplete="off"
                spellCheck="false"
              />
            </div>
            <span className="input-hint">Certificate IDs are printed on the top of the certificate valid for certificates generated after 2025.</span>
          </div>

          <motion.button
            type="submit"
            className="verify-button"
            disabled={isButtonClicked || !serialNumber.trim()}
            whileHover={!isButtonClicked ? { scale: 1.02, y: -2 } : {}}
            whileTap={!isButtonClicked ? { scale: 0.98 } : {}}
          >
            {isButtonClicked ? (
              <><div className="btn-spinner"/> Verifying…</>
            ) : (
              <><FiSearch className="btn-icon"/> Verify Certificate</>
            )}
          </motion.button>
        </motion.form>
      </motion.div>

      {/* Result Modal */}
      <AnimatePresence>
        {showModal && s && (
          <motion.div
            className="modal-overlay"
            onClick={closeModal}
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            exit={{ opacity:0 }}
          >
            <motion.div
              className={`modal-content glass-card${result.status === 'valid' ? ' modal-valid' : ''}`}
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Close button */}
              <button className="modal-x" onClick={closeModal}><FiX/></button>

              {/* Status icon */}
              <div className="modal-icon-wrap">{s.icon}</div>

              {/* Title */}
              <h3 className="modal-title" style={{color: s.titleColor}}>{s.title}</h3>

              {/* Not found / Error */}
              {(result.status === 'not_found' || result.status === 'error') && (
                <p className="modal-message">
                  {result.status === 'not_found'
                    ? `No certificate found with ID "${serialNumber}". Please check the ID and try again.`
                    : 'An error occurred while verifying. Please try again.'}
                </p>
              )}

              {/* Certificate details */}
              {result.cert && (
                <>
                  {/* Status badge */}
                  {s.badge && (
                    <div className="cert-badge" style={{
                      background: s.badge.bg,
                      border: `1px solid ${s.badge.border}`,
                      color: s.badge.color,
                    }}>
                      {s.badge.text}
                    </div>
                  )}

                  {/* Cert ID pill */}
                  <div className="cert-id-pill">
                    <span className="cert-id-label">Certificate ID</span>
                    <code className="cert-id-value">{result.cert.cert_id}</code>
                  </div>

                  {/* Details grid */}
                  <div className="cert-details">
                    <div className="cert-detail-row">
                      <FiUser className="cert-detail-icon"/>
                      <div>
                        <div className="cert-detail-label">Student Name</div>
                        <div className="cert-detail-value">{result.cert.student_name}</div>
                      </div>
                    </div>
                    <div className="cert-detail-row">
                      <FiBook className="cert-detail-icon"/>
                      <div>
                        <div className="cert-detail-label">Course</div>
                        <div className="cert-detail-value">{result.cert.course}</div>
                      </div>
                    </div>
                    {result.cert.grade && (
                      <div className="cert-detail-row">
                        <FiAward className="cert-detail-icon"/>
                        <div>
                          <div className="cert-detail-label">Grade</div>
                          <div className="cert-detail-value">{result.cert.grade}</div>
                        </div>
                      </div>
                    )}
                    {result.cert.instructor && (
                      <div className="cert-detail-row">
                        <FiUser className="cert-detail-icon"/>
                        <div>
                          <div className="cert-detail-label">Instructor</div>
                          <div className="cert-detail-value">{result.cert.instructor}</div>
                        </div>
                      </div>
                    )}
                    <div className="cert-detail-row">
                      <FiCalendar className="cert-detail-icon"/>
                      <div>
                        <div className="cert-detail-label">Issue Date</div>
                        <div className="cert-detail-value">{fmtDate(result.cert.issue_date)}</div>
                      </div>
                    </div>
                    {result.cert.expiry_date && (
                      <div className="cert-detail-row">
                        <FiCalendar className="cert-detail-icon"
                          style={{color: new Date(result.cert.expiry_date) < new Date() ? '#ef4444' : 'inherit'}}/>
                        <div>
                          <div className="cert-detail-label">Expiry Date</div>
                          <div className="cert-detail-value"
                            style={{color: new Date(result.cert.expiry_date) < new Date() ? '#ef4444' : 'inherit'}}>
                            {fmtDate(result.cert.expiry_date)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Revoked / Expired message */}
                  {result.status === 'revoked' && (
                    <p className="modal-warning">This certificate has been revoked by CodeBuild Academy and is no longer valid.</p>
                  )}
                  {result.status === 'expired' && (
                    <p className="modal-warning" style={{color:'#f59e0b'}}>This certificate expired on {fmtDate(result.cert.expiry_date)}.</p>
                  )}
                </>
              )}

              <button className="modal-close-button" onClick={closeModal}>
                <FiX className="icon"/> {result.status === 'valid' ? 'Close' : 'Try Again'}
              </button>

              {result.status === 'valid' && (
                <p className="modal-footer-note">
                  This certificate was issued by CodeBuild Academy and has been verified as authentic.
                </p>
              )}
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
          max-width: 540px;
          z-index: 2;
          position: relative;
          display: flex;
          justify-content: center;
        }
        .glass-card {
          background: rgba(30,30,30,0.55);
          backdrop-filter: blur(14px);
          border-radius: 22px;
          padding: 2.8rem;
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: 0 20px 50px rgba(0,0,0,0.35);
        }
        .verification-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
        }
        .form-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-bottom: 4px;
        }
        .form-logo-cbd {
          font-family: 'Bebas Neue', 'Impact', sans-serif;
          font-size: 22px;
          letter-spacing: 4px;
          color: #ffa500;
        }
        .form-logo-dot {
          font-size: 8px;
          color: rgba(255,165,0,0.4);
        }
        .form-title {
          text-align: center;
          font-size: 2.2rem;
          font-weight: 800;
          margin: 0;
          color: #fff;
        }
        .highlight { color: #ffa500; }
        .form-desc {
          text-align: center;
          font-size: 12.5px;
          color: rgba(255,255,255,0.35);
          line-height: 1.6;
          margin: 0;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .input-group label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }
        .input-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.25);
          font-size: 15px;
          pointer-events: none;
        }
        .input-group input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1px;
          transition: all 0.25s ease;
          box-sizing: border-box;
          font-family: monospace;
        }
        .input-group input:focus {
          background: rgba(255,165,0,0.04);
          border-color: rgba(255,165,0,0.45);
          box-shadow: 0 0 0 3px rgba(255,165,0,0.08);
          outline: none;
        }
        .input-group input::placeholder { color: rgba(255,255,255,0.2); font-family: sans-serif; letter-spacing: 0; }
        .input-hint {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
        }
        .verify-button {
          width: 100%;
          padding: 14px;
          background: #ffa500;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #0a0a0a;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 4px;
          transition: background 0.2s;
        }
        .verify-button:hover:not(:disabled) { background: #ffb733; }
        .verify-button:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-icon { font-size: 15px; }
        .btn-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(10,10,10,0.25);
          border-top-color: #0a0a0a;
          border-radius: 50%;
          animation: cv-spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(8px);
          padding: 20px;
        }
        .modal-content {
          width: 100%;
          max-width: 480px;
          padding: 2.2rem 2rem;
          text-align: center;
          position: relative;
        }
        .modal-valid {
          border-color: rgba(34,197,94,0.2) !important;
          box-shadow: 0 0 0 1px rgba(34,197,94,0.08), 0 30px 80px rgba(0,0,0,0.6) !important;
        }
        .modal-x {
          position: absolute;
          top: 14px; right: 14px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%;
          width: 30px; height: 30px;
          color: rgba(255,255,255,0.4);
          font-size: 14px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background .2s;
        }
        .modal-x:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .modal-icon-wrap { margin-bottom: 14px; }
        .modal-title {
          font-size: 1.6rem;
          font-weight: 800;
          margin: 0 0 16px;
        }
        .modal-message {
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          line-height: 1.65;
          margin-bottom: 24px;
        }
        .modal-warning {
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.15);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 12px;
          color: #fca5a5;
          margin: 12px 0;
          line-height: 1.5;
        }

        /* Cert ID pill */
        .cert-badge {
          display: inline-block;
          border-radius: 6px;
          padding: 4px 14px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 14px;
        }
        .cert-id-pill {
          background: rgba(255,165,0,0.06);
          border: 1px solid rgba(255,165,0,0.15);
          border-radius: 10px;
          padding: 10px 16px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .cert-id-label {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,165,0,0.6);
        }
        .cert-id-value {
          font-family: monospace;
          font-size: 15px;
          font-weight: 700;
          color: #ffa500;
          letter-spacing: 1px;
        }

        /* Details grid */
        .cert-details {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 14px 16px;
        }
        .cert-detail-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .cert-detail-icon {
          color: rgba(255,165,0,0.5);
          font-size: 14px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .cert-detail-label {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 2px;
        }
        .cert-detail-value {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
        }

        .modal-close-button {
          padding: 10px 28px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .modal-close-button:hover {
          background: rgba(255,165,0,0.12);
          border-color: rgba(255,165,0,0.3);
        }
        .modal-footer-note {
          margin-top: 14px;
          font-size: 10.5px;
          color: rgba(255,255,255,0.2);
          line-height: 1.6;
        }

        /* Floating items */
        .floating-item {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,165,0,0.06);
          border: 1px solid rgba(255,165,0,0.15);
          pointer-events: none;
          z-index: 1;
        }
        .item-1 { width:110px; height:110px; top:18%; left:8%; }
        .item-2 { width:160px; height:160px; bottom:12%; right:8%; }
        .item-3 { width:70px;  height:70px;  top:55%; left:15%; opacity:0.5; }

        @keyframes cv-spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .form-title { font-size: 1.8rem; }
          .glass-card { padding: 1.8rem; }
          .cert-id-pill { flex-direction: column; align-items: flex-start; gap: 4px; }
        }
        @media (max-width: 480px) {
          .verification-container { padding: 1rem; }
          .form-title { font-size: 1.6rem; }
          .glass-card { padding: 1.4rem; border-radius: 16px; }
        }
      `}</style>
    </div>
  );
};

export default CertificateVerification;