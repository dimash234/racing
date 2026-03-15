// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import { CityCar, BeamNG } from "./components/Simulators";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";

function MainSite() {
  return (
    <LanguageProvider>
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar />
        <Hero />
        <About />
        <CityCar />
        <BeamNG />
        <Pricing />
        <Contact />
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
