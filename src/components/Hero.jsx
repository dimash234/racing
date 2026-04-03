// src/components/Hero.jsx
import { ArrowRight, Play } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%)",
        position: "relative",
        overflow: "hidden",
        paddingTop: 80,
      }}
    >
      {/* Background grid pattern */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Accent circle */}
      <div style={{
        position: "absolute", right: "-10%", top: "10%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,197,71,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", left: "-5%", bottom: "5%",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px", width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="hero-grid">

          {/* Left: Text */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(232,197,71,0.12)", border: "1px solid rgba(232,197,71,0.3)",
              borderRadius: 100, padding: "6px 16px", marginBottom: 32,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8C547" }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#E8C547", fontWeight: 500, letterSpacing: "0.3px" }}>
                {t.hero.badge}
              </span>
            </div>

            <h1 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(40px, 5vw, 64px)",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.1,
              letterSpacing: "-1px",
              marginBottom: 24,
              whiteSpace: "pre-line",
            }}>
              {t.hero.title}
            </h1>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 18,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.7,
              marginBottom: 40,
              maxWidth: 460,
            }}>
              {t.hero.subtitle}
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a
                href="#contact"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 28px",
                  background: "#E8C547",
                  color: "#1A1A2E",
                  borderRadius: 10,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#F0D060"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#E8C547"; e.currentTarget.style.transform = "none"; }}
              >
                {t.hero.cta_primary} <ArrowRight size={16} />
              </a>
              <a
                href="#about"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 28px",
                  background: "transparent",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 10,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              >
                <Play size={14} /> {t.hero.cta_secondary}
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 40, marginTop: 60, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {[
                { value: t.hero.stat1_value, label: t.hero.stat1_label },
                { value: t.hero.stat2_value, label: t.hero.stat2_label },
                { value: t.hero.stat3_value, label: t.hero.stat3_label },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 800, color: "#E8C547" }}>{stat.value}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual cards */}
          <div style={{ position: "relative" }} className="hero-visual">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <SimCard
                title="City Car Driving"
                tag="Rules & Traffic"
                color="#3B82F6"
                icon="🏙️"
                detail="Traffic rules, road signs, urban driving"
              />
              <SimCard
                title="BeamNG.Drive"
                tag="Emergency Scenarios"
                color="#E8C547"
                icon="⚡"
                detail="Physics-based dangerous situation training"
                offset
              />
              <div style={{ gridColumn: "1 / -1", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Live session in progress</span>
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                  Student completing Scenario #14 — Emergency braking on wet road at 80 km/h
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  {["ABS", "ESP", "Wet Road", "80 km/h"].map((tag) => (
                    <span key={tag} style={{ padding: "2px 8px", background: "rgba(255,255,255,0.06)", borderRadius: 4, fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-visual { display: none; }
        }
      `}</style>
    </section>
  );
}

function SimCard({ title, tag, color, icon, detail, offset }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${color}33`,
      borderRadius: 12,
      padding: 20,
      marginTop: offset ? 28 : 0,
      transition: "transform 0.2s",
      cursor: "default",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{title}</div>
      <div style={{ display: "inline-block", padding: "2px 8px", background: `${color}22`, borderRadius: 4, marginBottom: 10 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color, fontWeight: 600 }}>{tag}</span>
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{detail}</div>
    </div>
  );
}
