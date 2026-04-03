<<<<<<< HEAD
=======
// src/App.jsx
>>>>>>> eb1a0fc8915520adfdca9b949e0094becb30c7df
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import { CityCar, BeamNG } from "./components/Simulators";
import Pricing from "./components/Pricing";
<<<<<<< HEAD
import BookingCalendar from "./components/BookingCalendar";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import UserDashboard from "./components/UserDashboard";
import { useState } from "react";
import AuthModal from "./components/AuthModal";

function MainSite() {
  const [showAuth, setShowAuth] = useState(false);
  return (
    <LanguageProvider>
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar onAuthClick={() => setShowAuth(true)} />
=======
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";

function MainSite() {
  return (
    <LanguageProvider>
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar />
>>>>>>> eb1a0fc8915520adfdca9b949e0094becb30c7df
        <Hero />
        <About />
        <CityCar />
        <BeamNG />
        <Pricing />
<<<<<<< HEAD
        <BookingCalendar onAuthRequired={() => setShowAuth(true)} />
        <Contact />
        <Footer />
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
=======
        <Contact />
        <Footer />
>>>>>>> eb1a0fc8915520adfdca9b949e0094becb30c7df
      </div>
    </LanguageProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSite />} />
<<<<<<< HEAD
        <Route path="/dashboard" element={<UserDashboard />} />
=======
>>>>>>> eb1a0fc8915520adfdca9b949e0094becb30c7df
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> eb1a0fc8915520adfdca9b949e0094becb30c7df
