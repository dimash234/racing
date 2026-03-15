// src/App.jsx
import { LanguageProvider } from "./i18n/LanguageContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import { CityCar, BeamNG } from "./components/Simulators";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
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
