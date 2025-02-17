import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import UserMatters from "./components/UserMatters";
import Matter from "./pages/Matter";
import Profile from "./pages/Profile";
import Price from "./pages/Price";
import Contact from "./pages/Contact";
import About from "./pages/About";
import VerifyEmail from "./pages/VerifyEmail";
// Payment components
import PaymentList from "./pages/PaymentList";
import AdminCreatePayment from "./pages/AdminCreatePayment";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
// Cookie Banner & Policy Page
import CookieBanner from "./components/CookieBanner";
import CookiePolicy from "./pages/CookiePolicy";
// Privacy Policy
import PrivacyPolicy from "./pages/PrivacyPolicy";
// Terms & Conditions
import TermsAndConditions from "./pages/TermsAndConditions";

function App() {
  return (
    <Router>
      <NavBar className="navbar" />
      <ScrollToTop />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:key" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user-matters" element={<UserMatters />} />
          <Route path="/matters/:id" element={<Matter />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/prices" element={<Price />} />
          <Route path="/payments" element={<PaymentList />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/admin-create-payment"
            element={<AdminCreatePayment />}
          />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
        </Routes>
      </div>
      <CookieBanner />
      <Footer />
    </Router>
  );
}

export default App;
