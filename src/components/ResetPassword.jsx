// src/components/ResetPassword.jsx
// Supabase redirects here after the admin clicks the reset email link.
// The URL contains an access_token — Supabase JS picks it up automatically.

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase/SupabaseClient";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Dosis:wght@400;500;600;700;800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  .rp-bg {
    min-height:100vh; background:#07070f;
    display:flex; align-items:center; justify-content:center;
    padding:24px; font-family:"Dosis",sans-serif;
  }
  .rp-card {
    width:100%; max-width:400px;
    background:rgba(255,255,255,0.025);
    border:1px solid rgba(255,255,255,0.07);
    border-radius:20px; padding:40px;
    animation:rp-up .4s cubic-bezier(.22,1,.36,1) both;
  }
  .rp-logo { font-family:"Bebas Neue",sans-serif; font-size:28px; letter-spacing:4px; color:#ffa500; margin-bottom:4px; }
  .rp-sub  { font-size:9px; font-weight:800; letter-spacing:3px; text-transform:uppercase; color:rgba(255,255,255,0.18); margin-bottom:32px; }
  .rp-label { display:block; font-size:9px; font-weight:800; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,0.3); margin-bottom:7px; }
  .rp-input {
    width:100%; background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08); border-radius:10px;
    color:rgba(255,255,255,0.85); font-family:"Dosis",sans-serif;
    font-size:14px; font-weight:600; padding:12px 14px; outline:none;
    transition:border-color .2s; margin-bottom:14px;
  }
  .rp-input:focus { border-color:rgba(255,165,0,.45); }
  .rp-btn {
    width:100%; background:#ffa500; color:#07070f;
    font-family:"Dosis",sans-serif; font-size:11px; font-weight:800;
    letter-spacing:2px; text-transform:uppercase;
    border:none; border-radius:10px; padding:13px; cursor:pointer;
    transition:background .2s;
  }
  .rp-btn:hover { background:#ffb733; }
  .rp-btn:disabled { opacity:.5; cursor:not-allowed; }
  .rp-msg { font-size:12px; font-weight:600; margin-bottom:14px; padding:10px 14px; border-radius:8px; }
  .rp-err { background:rgba(255,50,50,.07); border:1px solid rgba(255,50,50,.2); color:#ff6b6b; }
  .rp-ok  { background:rgba(34,197,94,.07); border:1px solid rgba(34,197,94,.2); color:#4ade80; }
  @keyframes rp-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
`;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [pass,    setPass]    = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy,    setBusy]    = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  // Supabase auto-parses the token from the URL hash
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // token is now active — user can set new password
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (pass.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (pass !== confirm) { setError("Passwords do not match."); return; }
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password: pass });
    if (err) { setError(err.message); setBusy(false); return; }
    setSuccess(true);
    setTimeout(() => navigate("/admin/login"), 2500);
  };

  return (
    <>
      <style>{css}</style>
      <div className="rp-bg">
        <div className="rp-card">
          <div className="rp-logo">CodeBuild</div>
          <div className="rp-sub">Set New Password</div>
          {success ? (
            <div className="rp-msg rp-ok">✓ Password updated! Redirecting to login…</div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className="rp-msg rp-err">⚠ {error}</div>}
              <label className="rp-label">New Password</label>
              <input className="rp-input" type="password" value={pass}
                onChange={e => setPass(e.target.value)} placeholder="Min. 8 characters" required />
              <label className="rp-label">Confirm Password</label>
              <input className="rp-input" type="password" value={confirm}
                onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" required />
              <button className="rp-btn" disabled={busy || !pass || !confirm}>
                {busy ? "Updating…" : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;