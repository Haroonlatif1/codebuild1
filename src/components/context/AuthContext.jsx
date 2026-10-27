// src/context/AuthContext.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Global auth state via React Context + Supabase onAuthStateChange listener.
// Wraps the entire app — any component can call useAuth() to get session info.
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/SupabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session,  setSession]  = useState(undefined); // undefined = still loading
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    // 1. Get the current session immediately (handles page refresh)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });

    // 2. Listen for future auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook — use anywhere: const { session, loading, signOut } = useAuth();
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};