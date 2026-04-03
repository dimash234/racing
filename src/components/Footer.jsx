// src/components/Footer.jsx
import { Gauge } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer style={{ background: "#1A1A2E", padding: "48px 24px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40, paddingBottom: 40, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {/* Brand */}
          <div style={{ maxWidth: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, background: "#E8C547", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Gauge size={20} color="#1A1A2E" />
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 18, color: "#fff" }}>SimDrive.kz</span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
              {t.footer.tagline}
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
            <FooterCol title="Simulators" links={["City Car Driving", "BeamNG.Drive"]} hrefs={["#citycar", "#beamng"]} />
            <FooterCol title="Company" links={["About", "Pricing", "Contact"]} hrefs={["#about", "#pricing", "#contact"]} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            © {new Date().getFullYear()} SimDrive.kz — {t.footer.rights}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {["🇰🇿", "Kazakhstan", "Almaty"].map((item) => (
              <span key={item} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links, hrefs }) {
  return (
    <div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 14 }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map((link, i) => (
          <a
            key={link}
            href={hrefs[i]}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.target.style.color = "#fff")}
            onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.5)")}
          >
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}
