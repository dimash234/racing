// src/components/About.jsx
import { Shield, Monitor, Award, Users } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  const features = [
    { key: "feature1", icon: <Shield size={22} />, color: "#3B82F6" },
    { key: "feature2", icon: <Monitor size={22} />, color: "#8B5CF6" },
    { key: "feature3", icon: <Award size={22} />, color: "#E8C547" },
    { key: "feature4", icon: <Users size={22} />, color: "#22C55E" },
  ];

  return (
    <section id="about" style={{ padding: "100px 24px", background: "#FAFAFA" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="about-grid">

          {/* Left: text */}
          <div>
            <SectionBadge label={t.about.badge} />
            <h2 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 800,
              color: "#1A1A2E",
              lineHeight: 1.15,
              letterSpacing: "-0.5px",
              marginBottom: 20,
            }}>
              {t.about.title}
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 17,
              color: "#6B7280",
              lineHeight: 1.75,
              marginBottom: 0,
            }}>
              {t.about.description}
            </p>
          </div>

          {/* Right: feature cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {features.map(({ key, icon, color }) => (
              <div
                key={key}
                style={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 14,
                  padding: "24px 20px",
                  transition: "box-shadow 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: `${color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color, marginBottom: 14,
                }}>
                  {icon}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 6 }}>
                  {t.about[`${key}_title`]}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>
                  {t.about[`${key}_desc`]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}

export function SectionBadge({ label }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "#EFF6FF", border: "1px solid #BFDBFE",
      borderRadius: 100, padding: "5px 14px", marginBottom: 20,
    }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#2563EB", fontWeight: 600, letterSpacing: "0.3px" }}>{label}</span>
    </div>
  );
}
