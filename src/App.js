import React from "react";
import NavigationBar from "./components/NavigationBar";
import AboutUs from "./components/AboutUs";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ContactUs from "./components/ContactUs";
import Footer from "./components/footer";
import CertificateVerification from "./components/Certificate_ver";
import OfferedCourses from "./components/OfferedCourses";
import PrivacyPolicy from "./components/Privacypolicy";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function App() {



function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

  return (
    
    <BrowserRouter>
          <ScrollToTop />

      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/offeredcourses" element={<OfferedCourses />} />
        <Route path="/Certificate-verification" element={<CertificateVerification/>} />
                <Route path="/privacy-policy" element={<PrivacyPolicy/>} />



      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
