// src/components/SimulatorSection.jsx
import { CheckCircle2 } from "lucide-react";
import { SectionBadge } from "./About";

export default function SimulatorSection({
  id,
  badge,
  title,
  description,
  highlights,
  sessions,
  sessionsLabel,
  accentColor,
  bgColor,
  imageSide = "right",
  visual,
}) {
  const isRight = imageSide === "right";

  return (
    <section id={id} style={{ padding: "100px 24px", background: bgColor || "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 72,
            alignItems: "center",
            direction: isRight ? "ltr" : "rtl",
          }}
          className="sim-grid"
        >
          {/* Text side */}
          <div style={{ direction: "ltr" }}>
            <SectionBadge label={badge} />
            <h2
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 800,
                color: "#1A1A2E",
                lineHeight: 1.15,
                letterSpacing: "-0.5px",
                marginBottom: 20,
              }}
            >
              {title}
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
                color: "#6B7280",
                lineHeight: 1.75,
                marginBottom: 32,
              }}
            >
              {description}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {highlights.map((h) => (
                <div key={h} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <CheckCircle2 size={18} color={accentColor} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#374151" }}>{h}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: `${accentColor}0F`,
                border: `1px solid ${accentColor}33`,
                borderRadius: 10,
                padding: "12px 20px",
              }}
            >
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 800, color: accentColor }}>{sessions}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9CA3AF" }}>{sessionsLabel}</div>
              </div>
            </div>
          </div>

          {/* Visual side */}
          <div style={{ direction: "ltr" }}>{visual}</div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .sim-grid { grid-template-columns: 1fr !important; direction: ltr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
