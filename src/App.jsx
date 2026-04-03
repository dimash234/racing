import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import { CityCar, BeamNG } from "./components/Simulators";
import Pricing from "./components/Pricing";
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
        <Hero />
        <About />
        <CityCar />
        <BeamNG />
        <Pricing />
        <BookingCalendar onAuthRequired={() => setShowAuth(true)} />
        <Contact />
        <Footer />
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>
    </LanguageProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}