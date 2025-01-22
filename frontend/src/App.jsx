import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import UserMatters from "./components/UserMatters";
import Matter from "./pages/Matter";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <NavBar className="navbar"/>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user-matters" element={<UserMatters />} />
          <Route path="/matters/:id" element={<Matter />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
