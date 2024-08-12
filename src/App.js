import React from "react";
import NavigationBar from "./components/NavigationBar";
import AboutUs from "./components/AboutUs";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ContactUs from "./components/ContactUs";
import OfferedCourses from "./components/OfferedCourses";

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/offeredcourses" element={<OfferedCourses />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
