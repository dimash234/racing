// src/components/Pricing.jsx
import { Check, Clock, Monitor } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { SectionBadge } from "./About";

export default function Pricing() {
  const { t } = useLanguage();

  return (
    <section id="pricing" style={{ padding: "100px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <SectionBadge label={t.pricing.badge} />
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(28px, 3.5vw, 44px)",
            fontWeight: 800, color: "#1A1A2E", lineHeight: 1.15,
            letterSpacing: "-0.5px", marginBottom: 12,
          }}>
            {t.pricing.title}
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#6B7280" }}>
            {t.pricing.subtitle}
          </p>
        </div>

        <div style={{ maxWidth: 560, margin: "0 auto", background: "#1A1A2E", borderRadius: 20, padding: "48px 48px", boxShadow: "0 24px 80px rgba(26,26,46,0.2)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,197,71,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(232,197,71,0.15)", border: "1px solid rgba(232,197,71,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8C547" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#E8C547", fontWeight: 600 }}>{t.pricing.session_label}</span>
          </div>

          <div style={{ marginBottom: 8 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 64, fontWeight: 800, color: "#E8C547", lineHeight: 1 }}>{t.pricing.session_price}</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 700, color: "#E8C547" }}> {t.pricing.currency}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 36 }}>
            <Clock size={15} color="rgba(255,255,255,0.4)" />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{t.pricing.session_duration}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
            {t.pricing.session_features.map((feature) => (
              <div key={feature} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <Check size={16} color="#E8C547" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{feature}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 36 }}>
            {["City Car Driving", "BeamNG.Drive"].map((sim) => (
              <div key={sim} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 14px" }}>
                <Monitor size={13} color="rgba(255,255,255,0.5)" />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{sim}</span>
              </div>
            ))}
          </div>

          <a href="#contact" style={{ display: "block", textAlign: "center", padding: "15px 32px", background: "#E8C547", color: "#1A1A2E", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 800, textDecoration: "none", transition: "opacity 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {t.pricing.cta}
          </a>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 16 }}>
            {t.pricing.note}
          </p>
        </div>
      </div>
    </section>
  );
}