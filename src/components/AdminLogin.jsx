// src/components/AdminLogin.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Standalone login page for /admin/login
// Features:
//  • After successful login → redirects to the originally-requested page
//    (or /admin if accessed directly)
//  • If already logged in → redirects away immediately
//  • Rate limiting feedback (Supabase returns errors after 5 failed attempts)
//  • Password visibility toggle
//  • "Forgot password" sends a reset email via Supabase
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./supabase/SupabaseClient";
import { useAuth } from "./context/AuthContext";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Dosis:wght@400;500;600;700;800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

  .al-bg {
    min-height: 100vh;
    background: #07070f;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    font-family: "Dosis", sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* ambient orbs */
  .al-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    animation: al-orb-drift 8s ease-in-out infinite alternate;
  }
  .al-orb-1 {
    width: 400px; height: 400px;
    background: rgba(255,165,0,0.06);
    top: -100px; left: -100px;
  }
  .al-orb-2 {
    width: 300px; height: 300px;
    background: rgba(100,50,255,0.04);
    bottom: -80px; right: -80px;
    animation-delay: 4s;
  }

  .al-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 420px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 44px 40px;
    backdrop-filter: blur(20px);
    animation: al-slide-up 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  .al-logo {
    font-family: "Bebas Neue", sans-serif;
    font-size: 32px; letter-spacing: 4px;
    color: #ffa500; margin-bottom: 2px;
  }
  .al-subtitle {
    font-size: 10px; font-weight: 800;
    letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,0.18); margin-bottom: 36px;
  }

  .al-divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin-bottom: 28px;
  }

  .al-field {
    margin-bottom: 16px;
  }
  .al-label {
    display: block;
    font-size: 9px; font-weight: 800;
    letter-spacing: 2px; text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    margin-bottom: 7px;
  }
  .al-input-wrap {
    position: relative;
  }
  .al-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: rgba(255,255,255,0.85);
    font-family: "Dosis", sans-serif;
    font-size: 14px; font-weight: 600;
    padding: 12px 14px;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .al-input:focus {
    border-color: rgba(255,165,0,0.45);
    background: rgba(255,165,0,0.03);
  }
  .al-input.has-toggle { padding-right: 44px; }
  .al-input.error { border-color: rgba(255,60,60,0.5); }

  .al-toggle-vis {
    position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none;
    color: rgba(255,255,255,0.25);
    cursor: pointer; font-size: 16px;
    padding: 4px; line-height: 1;
    transition: color 0.2s;
  }
  .al-toggle-vis:hover { color: rgba(255,255,255,0.6); }

  .al-error {
    background: rgba(255,50,50,0.07);
    border: 1px solid rgba(255,50,50,0.2);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12px; font-weight: 600;
    color: #ff6b6b;
    margin-bottom: 16px;
    display: flex; align-items: flex-start; gap: 8px;
    line-height: 1.4;
  }
  .al-success {
    background: rgba(34,197,94,0.07);
    border: 1px solid rgba(34,197,94,0.2);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12px; font-weight: 600;
    color: #4ade80;
    margin-bottom: 16px;
  }

  .al-btn {
    width: 100%;
    background: #ffa500;
    color: #07070f;
    font-family: "Dosis", sans-serif;
    font-size: 11px; font-weight: 800;
    letter-spacing: 2px; text-transform: uppercase;
    border: none; border-radius: 10px;
    padding: 14px;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, opacity 0.2s;
    margin-top: 8px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .al-btn:hover:not(:disabled) { background: #ffb733; }
  .al-btn:active:not(:disabled) { transform: scale(0.98); }
  .al-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .al-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(5,5,16,0.3);
    border-top-color: #050510;
    border-radius: 50%;
    animation: al-spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  .al-forgot {
    margin-top: 14px; text-align: right;
  }
  .al-forgot button {
    background: none; border: none;
    color: rgba(255,165,0,0.45);
    font-family: "Dosis", sans-serif;
    font-size: 11px; font-weight: 700;
    cursor: pointer;
    transition: color 0.2s;
    padding: 0;
  }
  .al-forgot button:hover { color: rgba(255,165,0,0.8); }

  .al-footer {
    margin-top: 28px; padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.05);
    font-size: 10.5px; color: rgba(255,255,255,0.15);
    line-height: 1.65; text-align: center;
  }

  @keyframes al-slide-up {
    from{opacity:0;transform:translateY(30px)}
    to{opacity:1;transform:translateY(0)}
  }
  @keyframes al-orb-drift {
    from{transform:translate(0,0) scale(1)}
    to{transform:translate(30px,20px) scale(1.08)}
  }
  @keyframes al-spin { to{transform:rotate(360deg)} }
`;

const AdminLogin = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { session } = useAuth();

  const [email,    setEmail]    = useState("");
  const [pass,     setPass]     = useState("");
  const [showPass, setShowPass] = useState(false);
  const [busy,     setBusy]     = useState(false);
  const [error,    setError]    = useState("");
  const [info,     setInfo]     = useState("");

  // If already authenticated, redirect away
  useEffect(() => {
    if (session) {
const from = location.state?.from?.pathname || "/cbdadmin";      navigate(from, { replace: true });
    }
  }, [session, navigate, location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setBusy(true); setError(""); setInfo("");

    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });

    if (err) {
      // Map Supabase error messages to friendlier ones
      if (err.message.includes("Invalid login credentials")) {
        setError("Incorrect email or password. Please try again.");
      } else if (err.message.includes("Email not confirmed")) {
        setError("Please confirm your email before signing in.");
      } else if (err.message.includes("rate limit") || err.message.includes("too many")) {
        setError("Too many failed attempts. Please wait a few minutes and try again.");
      } else {
        setError(err.message);
      }
    }
    // On success, onAuthStateChange fires → AuthContext updates → useEffect above redirects
    setBusy(false);
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) { setError("Enter your email address first."); return; }
    setBusy(true); setError(""); setInfo("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    if (err) setError(err.message);
    else setInfo("Password reset email sent. Check your inbox.");
    setBusy(false);
  };

  return (
    <>
      <style>{css}</style>
      <div className="al-bg">
        <div className="al-orb al-orb-1" />
        <div className="al-orb al-orb-2" />

        <div className="al-card">
          <div className="al-logo">CodeBuild</div>
          <div className="al-subtitle">Admin Panel</div>
          <div className="al-divider" />

          <form onSubmit={handleLogin} noValidate>
            {error && (
              <div className="al-error">
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}
            {info && <div className="al-success">✓ {info}</div>}

            <div className="al-field">
              <label className="al-label" htmlFor="al-email">Email address</label>
              <input
                id="al-email"
                className={`al-input${error ? " error" : ""}`}
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="admin@codebuild.com"
                required
              />
            </div>

            <div className="al-field">
              <label className="al-label" htmlFor="al-pass">Password</label>
              <div className="al-input-wrap">
                <input
                  id="al-pass"
                  className={`al-input has-toggle${error ? " error" : ""}`}
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={pass}
                  onChange={e => { setPass(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="al-toggle-vis"
                  onClick={() => setShowPass(p => !p)}
                  tabIndex={-1}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button className="al-btn" type="submit" disabled={busy || !email || !pass}>
              {busy
                ? <><div className="al-spinner" /> Signing in…</>
                : "Sign In →"
              }
            </button>

            <div className="al-forgot">
              <button type="button" onClick={handleForgotPassword} disabled={busy}>
                Forgot password?
              </button>
            </div>
          </form>

          <div className="al-footer">
            This panel is restricted to authorised CodeBuild administrators.<br/>
            Unauthorised access attempts are logged.
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;