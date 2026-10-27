// src/components/Competition.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from './supabase/SupabaseClient';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Dosis:wght@400;500;600;700;800&display=swap');

  .comp-wrap {
    background: #07070f;
    min-height: 100vh;
    font-family: "Dosis", sans-serif;
    color: #fff;
    padding: 80px 24px 120px;
    position: relative;
    overflow: hidden;
  }
  .comp-wrap::before {
    content: "";
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
    pointer-events: none;
    z-index: 0;
  }
  .comp-inner {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .comp-header { text-align: center; margin-bottom: 48px; }
  .comp-eyebrow {
    font-size: 10px; font-weight: 800; letter-spacing: 5px; text-transform: uppercase;
    color: #ffa500; margin-bottom: 12px;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .comp-eyebrow::before, .comp-eyebrow::after {
    content: ""; width: 40px; height: 1px;
  }
  .comp-eyebrow::before { background: linear-gradient(90deg, transparent, #ffa500); }
  .comp-eyebrow::after  { background: linear-gradient(90deg, #ffa500, transparent); }
  .comp-title {
    font-family: "Bebas Neue", sans-serif;
    font-size: clamp(48px, 8vw, 96px);
    line-height: 0.88;
    color: #fff;
    letter-spacing: 3px;
    background: linear-gradient(135deg, #fff 40%, rgba(255,165,0,0.65));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 12px;
  }
  .comp-sub {
    font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.32);
    max-width: 440px; margin: 0 auto; line-height: 1.65;
  }

  /* Countdown / Timer */
  .comp-clock {
    display: flex; justify-content: center; gap: 20px;
    margin: 40px 0 50px;
    flex-wrap: wrap;
  }
  .comp-clock-item {
    background: #0c0c1a;
    border: 1px solid rgba(255,165,0,0.15);
    border-radius: 16px;
    padding: 18px 28px;
    min-width: 80px;
    text-align: center;
    transition: border-color 0.5s ease;
  }
  .comp-clock-item.danger {
    border-color: #ef4444;
    animation: comp-pulse 1s ease-in-out infinite;
  }
  .comp-clock-num {
    font-family: "Bebas Neue", sans-serif;
    font-size: 48px;
    line-height: 1;
    color: #ffa500;
    letter-spacing: 2px;
    transition: color 0.5s ease;
  }
  .comp-clock-num.danger {
    color: #ef4444;
  }
  .comp-clock-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    margin-top: 4px;
  }
  .comp-clock-label.danger {
    color: #ef4444;
  }
  .comp-status {
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    color: #ffa500;
    margin-bottom: 30px;
  }
  .comp-status.danger {
    color: #ef4444;
    animation: comp-pulse 1.5s ease-in-out infinite;
  }

  /* Form */
  .comp-form {
    background: #0c0c1a;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px;
    padding: 32px;
    max-width: 600px;
    margin: 0 auto 40px;
  }
  .comp-form.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
  .comp-form-group {
    margin-bottom: 18px;
  }
  .comp-label {
    display: block;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    margin-bottom: 6px;
  }
  .comp-input, .comp-file {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: #fff;
    font-family: "Dosis", sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 12px 16px;
    outline: none;
    transition: border-color .2s;
    box-sizing: border-box;
  }
  .comp-input:focus {
    border-color: rgba(255,165,0,0.4);
  }
  .comp-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .comp-file {
    padding: 10px 12px;
    cursor: pointer;
  }
  .comp-file:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .comp-file::-webkit-file-upload-button {
    background: rgba(255,165,0,0.15);
    border: 1px solid rgba(255,165,0,0.2);
    border-radius: 6px;
    color: #ffa500;
    padding: 6px 14px;
    font-family: "Dosis", sans-serif;
    font-weight: 700;
    font-size: 12px;
    cursor: pointer;
    margin-right: 12px;
    transition: background .2s;
  }
  .comp-file::-webkit-file-upload-button:hover {
    background: rgba(255,165,0,0.25);
  }
  .comp-file-name {
    font-size: 12px;
    color: rgba(255,255,255,0.3);
    margin-top: 4px;
    display: block;
  }
  .comp-submit {
    width: 100%;
    background: #ffa500;
    color: #07070f;
    font-family: "Dosis", sans-serif;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    border: none;
    border-radius: 10px;
    padding: 14px;
    cursor: pointer;
    transition: background .2s, transform .15s;
    margin-top: 6px;
  }
  .comp-submit:hover:not(:disabled) { background: #ffb733; }
  .comp-submit:disabled { 
    opacity: 0.5; 
    cursor: not-allowed;
  }

  /* Success Message */
  .comp-success {
    max-width: 600px;
    margin: 0 auto 40px;
    padding: 40px 32px;
    background: rgba(34,197,94,0.06);
    border: 2px solid rgba(34,197,94,0.2);
    border-radius: 18px;
    text-align: center;
    animation: comp-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .comp-success-icon {
    font-size: 64px;
    margin-bottom: 16px;
    display: block;
  }
  .comp-success h2 {
    font-family: "Bebas Neue", sans-serif;
    font-size: 36px;
    color: #4ade80;
    margin-bottom: 8px;
  }
  .comp-success p {
    color: rgba(255,255,255,0.5);
    font-size: 15px;
    line-height: 1.7;
    margin-bottom: 6px;
  }

  .comp-error {
    max-width: 600px;
    margin: 0 auto 40px;
    padding: 24px 32px;
    background: rgba(239,68,68,0.06);
    border: 2px solid rgba(239,68,68,0.2);
    border-radius: 18px;
    text-align: center;
  }
  .comp-error h3 {
    color: #f87171;
    font-size: 20px;
    margin-bottom: 6px;
  }
  .comp-error p {
    color: rgba(255,255,255,0.4);
    font-size: 14px;
  }

  /* Confirmation Modal */
  .comp-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(12px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: comp-fade 0.25s ease;
  }
  .comp-modal {
    background: #0c0c1a;
    border: 1px solid rgba(255,165,0,0.2);
    border-radius: 20px;
    max-width: 560px;
    width: 100%;
    padding: 36px 32px 32px;
    animation: comp-modal-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .comp-modal-title {
    font-family: "Bebas Neue", sans-serif;
    font-size: 32px;
    color: #ffa500;
    text-align: center;
    margin-bottom: 20px;
  }
  .comp-modal-details {
    background: rgba(255,255,255,0.03);
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 24px;
  }
  .comp-modal-detail {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    font-size: 13px;
  }
  .comp-modal-detail:last-child {
    border-bottom: none;
  }
  .comp-modal-label {
    color: rgba(255,255,255,0.4);
    font-weight: 600;
  }
  .comp-modal-value {
    color: #fff;
    font-weight: 700;
    text-align: right;
    max-width: 60%;
    word-break: break-word;
  }
  .comp-modal-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }
  .comp-modal-btn {
    padding: 12px 32px;
    border-radius: 10px;
    font-family: "Dosis", sans-serif;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    transition: all .2s;
  }
  .comp-modal-btn.confirm {
    background: #ffa500;
    color: #07070f;
  }
  .comp-modal-btn.confirm:hover {
    background: #ffb733;
    transform: scale(1.02);
  }
  .comp-modal-btn.cancel {
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.5);
    border: 1px solid rgba(255,255,255,0.08);
  }
  .comp-modal-btn.cancel:hover {
    background: rgba(255,255,255,0.1);
  }
  .comp-modal-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Debug Panel */
  .comp-debug {
    background: rgba(255,165,0,0.05);
    border: 1px solid rgba(255,165,0,0.15);
    border-radius: 12px;
    padding: 16px 20px;
    margin: 20px auto;
    max-width: 600px;
    font-family: "Dosis", sans-serif;
  }
  .comp-debug-title {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,165,0,0.5);
    margin-bottom: 8px;
  }
  .comp-debug-item {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    font-size: 12px;
    color: rgba(255,255,255,0.6);
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .comp-debug-item:last-child { border-bottom: none; }
  .comp-debug-value {
    color: #ffa500;
    font-weight: 700;
  }
  .comp-debug-badge {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1px;
  }
  .comp-debug-badge.success { background: rgba(34,197,94,0.2); color: #4ade80; }
  .comp-debug-badge.error { background: rgba(239,68,68,0.2); color: #f87171; }
  .comp-debug-badge.warning { background: rgba(255,165,0,0.2); color: #ffa500; }

  .comp-test-banner {
    background: rgba(255,165,0,0.1);
    border: 2px dashed rgba(255,165,0,0.3);
    border-radius: 12px;
    padding: 12px 20px;
    margin-bottom: 30px;
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    color: #ffa500;
    letter-spacing: 1px;
  }

  .comp-ended {
    text-align: center;
    padding: 60px 20px;
    max-width: 500px;
    margin: 0 auto;
  }
  .comp-ended-icon { font-size: 56px; display: block; margin-bottom: 16px; }
  .comp-ended h2 {
    font-family: "Bebas Neue", sans-serif;
    font-size: 36px;
    color: rgba(255,255,255,0.5);
    margin-bottom: 8px;
  }
  .comp-ended p {
    color: rgba(255,255,255,0.25);
    font-size: 14px;
    line-height: 1.7;
  }

  /* Loading spinner */
  .comp-spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid rgba(7,7,15,0.2);
    border-top-color: #07070f;
    border-radius: 50%;
    animation: comp-spin 0.7s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }

  @keyframes comp-pop {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes comp-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes comp-spin {
    to { transform: rotate(360deg); }
  }

  @keyframes comp-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes comp-modal-in {
    from { opacity: 0; transform: scale(0.9) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  @media(max-width: 600px) {
    .comp-clock-item { min-width: 60px; padding: 12px 16px; }
    .comp-clock-num { font-size: 32px; }
    .comp-modal { padding: 24px 16px; }
    .comp-modal-detail { flex-direction: column; align-items: flex-start; gap: 2px; }
    .comp-modal-value { max-width: 100%; text-align: left; }
    .comp-modal-actions { flex-direction: column; }
  }
`;

const Competition = () => {
  // ─── CONFIG ──────────────────────────────────────────────────
  const TEST_MODE = false; // ← Set to false for production
  
  const START_TIME = TEST_MODE 
    ? Date.now() - 10000 // Start 10 seconds ago
    : new Date('2026-07-31T16:00:00+05:00').getTime();
  
  const DURATION_MS = TEST_MODE 
    ? 5 * 60 * 1000 // 5 minutes for testing
    : 30 * 60 * 1000; // 30 minutes for real

  // ─── STATE ──────────────────────────────────────────────────
  const [status, setStatus] = useState('waiting');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [timer, setTimer] = useState(0);
  const [isDanger, setIsDanger] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [batch, setBatch] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [projectCodeFile, setProjectCodeFile] = useState(null);
  const [screenRecording, setScreenRecording] = useState(null);
  
  // UI states
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [ipAddress, setIpAddress] = useState('');
  const [isCheckingIP, setIsCheckingIP] = useState(false);
  
  // Confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // ─── DEBUG STATE ────────────────────────────────────────────
  const [debug, setDebug] = useState({
    supabaseConnected: false,
    tableExists: false,
    storageExists: false,
    lastError: null,
  });

  // ─── GET IP ADDRESS ─────────────────────────────────────────
  useEffect(() => {
    const getIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (err) {
        console.error('Failed to get IP:', err);
        setIpAddress(`unknown-${Date.now()}`);
      }
    };
    getIP();
  }, []);

  // ─── CHECK SUPABASE CONNECTION ─────────────────────────────
  useEffect(() => {
    const checkSupabase = async () => {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        );
        
        const queryPromise = supabase
          .from('competition_submissions')
          .select('count', { count: 'exact', head: true });
        
        const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
        
        if (error) {
          setDebug(prev => ({ 
            ...prev, 
            supabaseConnected: false, 
            tableExists: false,
            lastError: error.message 
          }));
        } else {
          setDebug(prev => ({ 
            ...prev, 
            supabaseConnected: true, 
            tableExists: true,
            lastError: null 
          }));
        }

        try {
          const { data: buckets } = await supabase.storage.listBuckets();
          const bucketExists = buckets?.some(b => b.id === 'competition');
          setDebug(prev => ({ ...prev, storageExists: bucketExists }));
        } catch (storageErr) {
          setDebug(prev => ({ ...prev, storageExists: false }));
        }

      } catch (err) {
        setDebug(prev => ({ 
          ...prev, 
          supabaseConnected: false,
          lastError: err.message 
        }));
      }
    };

    checkSupabase();
  }, []);

  // ─── Check localStorage and IP for existing submission ──
  useEffect(() => {
    const saved = localStorage.getItem('comp_submitted');
    if (saved === 'true') {
      setSubmitted(true);
      return;
    }

    const checkIP = async () => {
      if (!ipAddress || isCheckingIP) return;
      
      setIsCheckingIP(true);
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        );
        
        const queryPromise = supabase
          .from('competition_submissions')
          .select('id')
          .eq('ip_address', ipAddress)
          .limit(1);

        const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

        if (!error && data && data.length > 0) {
          setSubmitted(true);
          localStorage.setItem('comp_submitted', 'true');
        }
      } catch (err) {
        console.error('IP check failed:', err);
      } finally {
        setIsCheckingIP(false);
      }
    };

    if (ipAddress && !submitted) {
      checkIP();
    }
  }, [ipAddress, submitted]);

  // ─── Countdown to start ──────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = START_TIME - now;
      if (diff <= 0) {
        setStatus('live');
        setTimer(DURATION_MS);
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ─── Competition timer ──────────────────────────────────
  useEffect(() => {
    if (status !== 'live') return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1000) {
          setStatus('ended');
          clearInterval(interval);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  // ─── Check for danger zone (last 2 minutes) ─────────────
  useEffect(() => {
    if (status === 'live' && timer <= 120000) {
      setIsDanger(true);
    } else {
      setIsDanger(false);
    }
  }, [timer, status]);

  // ─── Helpers ──────────────────────────────────────────────
  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const mins = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // ─── Upload file to Supabase Storage with retry ──────────
  const uploadFile = async (file, folder, retries = 2) => {
    let lastError;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Upload timeout')), 30000)
        );
        
        const uploadPromise = supabase.storage
          .from('competition')
          .upload(`${folder}/${fileName}`, file);

        const { data, error } = await Promise.race([uploadPromise, timeoutPromise]);

        if (error) throw error;
        const { publicURL } = supabase.storage.from('competition').getPublicUrl(`${folder}/${fileName}`);
        return publicURL;
      } catch (err) {
        lastError = err;
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
      }
    }
    throw lastError || new Error('Upload failed after retries');
  };

  // ─── Open confirmation modal ─────────────────────────────
  const openConfirmation = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!name || !batch || !phone) {
      setSubmitError('Please fill in your name, phone number, and batch.');
      return;
    }

    if (!projectCodeFile) {
      setSubmitError('Please upload your project code.');
      return;
    }

    // Clear any previous errors
    setSubmitError(null);
    
    // Show confirmation modal
    setShowConfirmModal(true);
  };

  // ─── Confirm and submit ──────────────────────────────────
  const confirmSubmit = async () => {
    setConfirming(true);
    setSubmitError(null);

    // Check if competition is still live
    if (status !== 'live') {
      setSubmitError('The competition is no longer accepting submissions.');
      setShowConfirmModal(false);
      setConfirming(false);
      return;
    }

    // Double-check IP
    if (ipAddress) {
      try {
        const { data, error } = await supabase
          .from('competition_submissions')
          .select('id')
          .eq('ip_address', ipAddress)
          .limit(1);

        if (!error && data && data.length > 0) {
          setSubmitError('This IP address has already submitted.');
          setSubmitted(true);
          localStorage.setItem('comp_submitted', 'true');
          setShowConfirmModal(false);
          setConfirming(false);
          return;
        }
      } catch (err) {
        // Continue anyway
      }
    }

    let recordingUrl = '';
    let codeUrl = '';

    try {
      if (screenRecording) {
        recordingUrl = await uploadFile(screenRecording, 'screen_recordings');
      }
      codeUrl = await uploadFile(projectCodeFile, 'project_code');
    } catch (err) {
      setSubmitError('Failed to upload file: ' + err.message);
      setShowConfirmModal(false);
      setConfirming(false);
      return;
    }

    const certId = `CBD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    try {
      const { error } = await supabase.from('competition_submissions').insert({
        name,
        phone,
        batch,
        project_link: projectLink || null,
        project_code_url: codeUrl || null,
        screen_recording_url: recordingUrl || null,
        certificate_id: certId,
        ip_address: ipAddress || null,
      });

      if (error) {
        if (error.code === '23505') {
          setSubmitError('A submission with this IP already exists.');
          setSubmitted(true);
          localStorage.setItem('comp_submitted', 'true');
        } else {
          setSubmitError('Database error: ' + error.message);
        }
        setShowConfirmModal(false);
        setConfirming(false);
        return;
      }
    } catch (err) {
      setSubmitError('Submission failed: ' + err.message);
      setShowConfirmModal(false);
      setConfirming(false);
      return;
    }

    setShowConfirmModal(false);
    setConfirming(false);
    setSubmitted(true);
    localStorage.setItem('comp_submitted', 'true');

    // Clear form
    setName('');
    setPhone('');
    setBatch('');
    setProjectLink('');
    setProjectCodeFile(null);
    setScreenRecording(null);
    document.getElementById('screenRecordingInput').value = '';
    document.getElementById('projectCodeInput').value = '';
  };

  // ─── Cancel confirmation ─────────────────────────────────
  const cancelConfirmation = () => {
    setShowConfirmModal(false);
    setConfirming(false);
  };

  // ─── Render debug panel ────────────────────────────────────
  const renderDebug = () => {
    if (!TEST_MODE) return null;
    
    return (
      <div className="comp-debug">
        <div className="comp-debug-title">🔧 Debug Status</div>
        <div className="comp-debug-item">
          <span>Supabase Connection</span>
          <span className={`comp-debug-badge ${debug.supabaseConnected ? 'success' : 'error'}`}>
            {debug.supabaseConnected ? '✅ Connected' : '❌ Disconnected'}
          </span>
        </div>
        <div className="comp-debug-item">
          <span>Table: competition_submissions</span>
          <span className={`comp-debug-badge ${debug.tableExists ? 'success' : 'error'}`}>
            {debug.tableExists ? '✅ Exists' : '❌ Missing'}
          </span>
        </div>
        <div className="comp-debug-item">
          <span>Storage Bucket: competition</span>
          <span className={`comp-debug-badge ${debug.storageExists ? 'success' : 'warning'}`}>
            {debug.storageExists ? '✅ Exists' : '⚠️ Missing'}
          </span>
        </div>
        <div className="comp-debug-item">
          <span>Your IP Address</span>
          <span className="comp-debug-value">{ipAddress || 'Fetching...'}</span>
        </div>
        <div className="comp-debug-item">
          <span>Current Status</span>
          <span className="comp-debug-value">{status.toUpperCase()}</span>
        </div>
        <div className="comp-debug-item">
          <span>Submitted</span>
          <span className="comp-debug-value">{submitted ? '✅ Yes' : '❌ No'}</span>
        </div>
        {debug.lastError && (
          <div className="comp-debug-item" style={{ color: '#f87171' }}>
            <span>Last Error</span>
            <span style={{ fontSize: '11px' }}>{debug.lastError}</span>
          </div>
        )}
        <div className="comp-debug-item" style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
          <span>Test Mode</span>
          <span className="comp-debug-badge warning">⚡ ACTIVE</span>
        </div>
      </div>
    );
  };

  // ─── Render clock ─────────────────────────────────────────
  const renderClock = () => {
    if (status === 'waiting') {
      const { days, hours, minutes, seconds } = timeLeft;
      return (
        <div className="comp-clock">
          <div className="comp-clock-item"><div className="comp-clock-num">{String(days).padStart(2,'0')}</div><div className="comp-clock-label">Days</div></div>
          <div className="comp-clock-item"><div className="comp-clock-num">{String(hours).padStart(2,'0')}</div><div className="comp-clock-label">Hours</div></div>
          <div className="comp-clock-item"><div className="comp-clock-num">{String(minutes).padStart(2,'0')}</div><div className="comp-clock-label">Mins</div></div>
          <div className="comp-clock-item"><div className="comp-clock-num">{String(seconds).padStart(2,'0')}</div><div className="comp-clock-label">Secs</div></div>
        </div>
      );
    }
    if (status === 'live') {
      const isLastTwoMins = timer <= 120000;
      return (
        <div className="comp-clock">
          <div className={`comp-clock-item ${isLastTwoMins ? 'danger' : ''}`}>
            <div className={`comp-clock-num ${isLastTwoMins ? 'danger' : ''}`}>
              {formatTime(timer)}
            </div>
            <div className={`comp-clock-label ${isLastTwoMins ? 'danger' : ''}`}>
              {isLastTwoMins ? '⚠️ HURRY!' : 'Time Remaining'}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // ─── Render confirmation modal ────────────────────────────
  const renderConfirmationModal = () => {
    if (!showConfirmModal) return null;

    const fileNames = {
      project: projectCodeFile ? projectCodeFile.name : 'Not uploaded',
      recording: screenRecording ? screenRecording.name : 'Not uploaded'
    };

    return (
      <div className="comp-modal-overlay" onClick={cancelConfirmation}>
        <div className="comp-modal" onClick={(e) => e.stopPropagation()}>
          <div className="comp-modal-title">📋 Confirm Submission</div>
          
          <div className="comp-modal-details">
            <div className="comp-modal-detail">
              <span className="comp-modal-label">Name</span>
              <span className="comp-modal-value">{name}</span>
            </div>
            <div className="comp-modal-detail">
              <span className="comp-modal-label">Phone</span>
              <span className="comp-modal-value">{phone}</span>
            </div>
            <div className="comp-modal-detail">
              <span className="comp-modal-label">Batch</span>
              <span className="comp-modal-value">{batch}</span>
            </div>
            {projectLink && (
              <div className="comp-modal-detail">
                <span className="comp-modal-label">Project Link</span>
                <span className="comp-modal-value" style={{ fontSize: '12px' }}>{projectLink}</span>
              </div>
            )}
            <div className="comp-modal-detail">
              <span className="comp-modal-label">Project Code</span>
              <span className="comp-modal-value" style={{ fontSize: '12px' }}>{fileNames.project}</span>
            </div>
            <div className="comp-modal-detail">
              <span className="comp-modal-label">Screen Recording</span>
              <span className="comp-modal-value" style={{ fontSize: '12px' }}>{fileNames.recording}</span>
            </div>
          </div>

          <p style={{ 
            textAlign: 'center', 
            color: 'rgba(255,255,255,0.3)', 
            fontSize: '12px',
            marginBottom: '20px'
          }}>
            ⚠️ Once submitted, you cannot edit or resubmit.
          </p>

          <div className="comp-modal-actions">
            <button 
              className="comp-modal-btn cancel" 
              onClick={cancelConfirmation}
              disabled={confirming}
            >
              Cancel
            </button>
            <button 
              className="comp-modal-btn confirm" 
              onClick={confirmSubmit}
              disabled={confirming}
            >
              {confirming ? (
                <>
                  <span className="comp-spinner"></span> Submitting...
                </>
              ) : (
                '✅ Yes, Submit'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Render form ──────────────────────────────────────────
  const renderForm = () => {
    if (status !== 'live') return null;

    if (submitted) {
      return (
        <div className="comp-success">
          <span className="comp-success-icon">🎉</span>
          <h2>Congratulations!</h2>
          <p>You have successfully completed the competition.</p>
          <p>Your submission has been recorded and will be reviewed by our team.</p>
          <p style={{ marginTop: '12px', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
            We'll announce the results soon. Good luck! 🍀
          </p>
        </div>
      );
    }

    if (submitError) {
      return (
        <div className="comp-error">
          <h3>⚠️ {submitError}</h3>
          {submitError.includes('already submitted') && (
            <p>You can only submit once. If you think this is a mistake, please contact support.</p>
          )}
        </div>
      );
    }

    const isDisabled = submitted || status !== 'live';

    return (
      <>
        <form className={`comp-form ${isDisabled ? 'disabled' : ''}`} onSubmit={openConfirmation}>
          <div className="comp-form-group">
            <label className="comp-label">Full Name *</label>
            <input 
              className="comp-input" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Enter your full name"
              disabled={isDisabled}
              required 
            />
          </div>

          <div className="comp-form-group">
            <label className="comp-label">Phone Number *</label>
            <input 
              className="comp-input" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="e.g. 03XX-XXXXXXX"
              disabled={isDisabled}
              required 
            />
          </div>

          <div className="comp-form-group">
            <label className="comp-label">Batch Number *</label>
            <input 
              className="comp-input" 
              value={batch} 
              onChange={e => setBatch(e.target.value)} 
              placeholder="e.g. Batch 2026"
              disabled={isDisabled}
              required 
            />
          </div>

          <div className="comp-form-group">
            <label className="comp-label">Project Link (optional)</label>
            <input 
              className="comp-input" 
              value={projectLink} 
              onChange={e => setProjectLink(e.target.value)} 
              placeholder="GitHub / Google Drive / Live Demo URL"
              disabled={isDisabled}
            />
          </div>

          <div className="comp-form-group">
            <label className="comp-label">Screen Recording (optional)</label>
            <input 
              className="comp-file" 
              id="screenRecordingInput"
              type="file" 
              accept="video/*"
              onChange={e => setScreenRecording(e.target.files[0])} 
              disabled={isDisabled}
            />
            {screenRecording && (
              <span className="comp-file-name">📹 {screenRecording.name} ({formatFileSize(screenRecording.size)})</span>
            )}
          </div>

          <div className="comp-form-group">
            <label className="comp-label">Project Code (any file) *</label>
            <input 
              className="comp-file" 
              id="projectCodeInput"
              type="file" 
              accept="*/*"
              onChange={e => setProjectCodeFile(e.target.files[0])} 
              disabled={isDisabled}
              required
            />
            {projectCodeFile && (
              <span className="comp-file-name">📦 {projectCodeFile.name} ({formatFileSize(projectCodeFile.size)})</span>
            )}
          </div>

          <button 
            className="comp-submit" 
            type="submit" 
            disabled={isDisabled || !name || !phone || !batch || !projectCodeFile}
          >
            Review & Submit
          </button>

          {isDanger && !isDisabled && (
            <p style={{ 
              textAlign: 'center', 
              color: '#ef4444', 
              marginTop: '12px', 
              fontSize: '14px',
              fontWeight: '700',
              animation: 'comp-pulse 1.5s ease-in-out infinite'
            }}>
              ⚠️ HURRY! Less than 2 minutes remaining!
            </p>
          )}
        </form>

        {renderConfirmationModal()}
      </>
    );
  };

  // ─── Render ended state ────────────────────────────────────
  const renderEnded = () => {
    if (status !== 'ended') return null;
    return (
      <div className="comp-ended">
        <span className="comp-ended-icon">🏁</span>
        <h2>Competition Ended</h2>
        <p>Thank you to all participants for your amazing submissions!</p>
        <p style={{ marginTop: '12px', color: 'rgba(255,165,0,0.4)', fontSize: '13px' }}>
          Results will be announced soon. Stay tuned!
        </p>
      </div>
    );
  };

  return (
    <>
      <style>{css}</style>
      <div className="comp-wrap">
        <div className="comp-inner">
          <div className="comp-header">
            <div className="comp-eyebrow">CodeBuild Academy</div>
            <h1 className="comp-title">Competition<br/>2026</h1>
            <p className="comp-sub">
              Showcase your skills, compete with peers, and win recognition.
            </p>
          </div>

          {TEST_MODE && (
            <div className="comp-test-banner">
              ⚡ TEST MODE ACTIVE — Competition starts immediately, lasts 5 minutes
            </div>
          )}

          {renderDebug()}
          {renderClock()}

          <div className={`comp-status ${isDanger ? 'danger' : ''}`}>
            {status === 'waiting' && '⏳ Waiting for the competition to start...'}
            {status === 'live' && isDanger ? '⚠️ LESS THAN 2 MINUTES LEFT!' : '🚀 Competition is LIVE! Submit your entry.'}
            {status === 'ended' && '🏁 Competition ended. Thank you for participating!'}
          </div>

          {renderEnded()}
          {renderForm()}
        </div>
      </div>
    </>
  );
};

export default Competition;