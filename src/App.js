import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { AuthProvider }  from "./components/context/AuthContext";
import ProtectedRoute    from "./components/ProtectedRoute";

import AdminLogin        from "./components/AdminLogin";
import AdminPanel        from "./components/Adminpanel";
import ResetPassword     from "./components/ResetPassword";

import NavigationBar           from "./components/NavigationBar";
import Footer                  from "./components/footer";
import BehaviourAI             from "./components/BehaviourAi";
import Products                from "./components/Products";
import Home                    from "./components/Home";
import AboutUs                 from "./components/AboutUs";
import ContactUs               from "./components/v2/ContactPage";
import OfferedCourses          from "./components/OfferedCourses";
import CertificateVerification from "./components/Certificate_ver";
import PrivacyPolicy           from "./components/Privacypolicy";
import DailyChallenge          from "./components/DailyChallenge";
import Blog                    from "./components/Blog";
import ProductPage              from "./components/v2/ProductPage";
import Terms                   from "./components/v2/Terms";
import Checkout                from "./components/v2/Checkout";
import KidsEnroll              from "./components/v2/KidsEnroll";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

const NotFound = () => (
  <div style={{
    minHeight:"60vh", display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center",
    fontFamily:'"Dosis",sans-serif', color:"rgba(255,255,255,0.3)",
    background:"#07070f", gap:12,
  }}>
    <div style={{fontSize:64,lineHeight:1}}>404</div>
    <div style={{fontSize:13,letterSpacing:2}}>PAGE NOT FOUND</div>
    <a href="/" style={{marginTop:8,color:"#ffa500",fontSize:12,letterSpacing:1}}>← Back to home</a>
  </div>
);

const PublicLayout = ({ children }) => (
  <>
    <BehaviourAI />
    <NavigationBar />
    {children}
    <Footer />
  </>
);

const AppRoutes = () => (
  <>
    <ScrollToTop />
    <Routes>
      {/* Public */}
      <Route path="/"                         element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/aboutus"                  element={<PublicLayout><AboutUs /></PublicLayout>} />
      <Route path="/contactus"               element={<PublicLayout><ContactUs /></PublicLayout>} />
      <Route path="/offeredcourses"          element={<PublicLayout><OfferedCourses /></PublicLayout>} />
      <Route path="/ai-kids-enroll"         element={<PublicLayout><KidsEnroll /></PublicLayout>} />
      <Route path="/terms"                  element={<PublicLayout><Terms /></PublicLayout>} />
      <Route path="/checkout"               element={<PublicLayout><Checkout /></PublicLayout>} />
      <Route path="/products/:slug"         element={<PublicLayout><ProductPage /></PublicLayout>} />
      <Route path="/Products"               element={<PublicLayout><Products /></PublicLayout>} />
      <Route path="/Certificate-verification" element={<PublicLayout><CertificateVerification /></PublicLayout>} />
      <Route path="/privacy-policy"          element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
      <Route path="/practice"                element={<PublicLayout><DailyChallenge initialView="practice" /></PublicLayout>} />
      <Route path="/daily-challenge"         element={<PublicLayout><DailyChallenge /></PublicLayout>} />
      <Route path="/blog"                    element={<PublicLayout><Blog /></PublicLayout>} />

      {/* Admin auth */}
      <Route path="/cbdadmin/login"          element={<AdminLogin />} />
      <Route path="/cbdadmin/reset-password" element={<ResetPassword />} />

      {/* Protected admin */}
      <Route path="/cbdadmin"   element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      <Route path="/cbdadmin/*" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
    </Routes>
  </>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;