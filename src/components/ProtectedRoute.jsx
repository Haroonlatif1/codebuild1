// src/components/ProtectedRoute.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Production-grade route guard:
//
//  • Shows a full-screen loader while Supabase resolves the session
//    (prevents the "flash of login page" on hard refresh)
//  • If no session → redirects to /admin/login, preserving the
//    originally-requested URL in `state.from` so we can redirect back
//    after successful login
//  • If session exists → renders children normally
//  • All redirect logic lives HERE — AdminPanel stays clean
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

/* ── Full-screen auth loader ── */
const AuthLoader = () => (
  <div style={{
    minHeight: "100vh",
    background: "#07070f",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    fontFamily: '"Dosis", sans-serif',
  }}>
    <div style={{ display: "flex", gap: 8 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 10, height: 10, borderRadius: "50%",
          background: "#ffa500",
          animation: "pr-bounce 1.2s ease-in-out infinite",
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
    <span style={{ fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
      Authenticating
    </span>
    <style>{`
      @keyframes pr-bounce {
        0%,80%,100%{transform:scale(.4);opacity:.3}
        40%{transform:scale(1);opacity:1}
      }
    `}</style>
  </div>
);

/* ── Guard component ── */
const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();
  const location = useLocation();

  // Still resolving — don't flash login page
  if (loading) return <AuthLoader />;

  // Not logged in → go to login, remember where they were headed
  if (!session) {
    return (
      <Navigate
        to="/cbdadmin/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Authenticated ✓
  return children;
};

export default ProtectedRoute;