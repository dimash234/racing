// src/components/Pricing.jsx
import { Check } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { SectionBadge } from "./About";

export default function Pricing() {
  const { t } = useLanguage();

  const plans = [
    {
      nameKey: "plan1_name",
      priceKey: "plan1_price",
      descKey: "plan1_desc",
      featuresKey: "plan1_features",
      featured: false,
      accentColor: "#6B7280",
    },
    {
      nameKey: "plan2_name",
      priceKey: "plan2_price",
      descKey: "plan2_desc",
      featuresKey: "plan2_features",
      featured: true,
      accentColor: "#1A1A2E",
    },
    {
      nameKey: "plan3_name",
      priceKey: "plan3_price",
      descKey: "plan3_desc",
      featuresKey: "plan3_features",
      featured: false,
      accentColor: "#E8C547",
    },
  ];

  return (
    <section id="pricing" style={{ padding: "100px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <SectionBadge label={t.pricing.badge} />
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(28px, 3.5vw, 44px)",
            fontWeight: 800,
            color: "#1A1A2E",
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            marginBottom: 16,
          }}>
            {t.pricing.title}
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#6B7280", maxWidth: 500, margin: "0 auto" }}>
            {t.pricing.subtitle}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, alignItems: "start" }} className="pricing-grid">
          {plans.map((plan) => (
            <PriceCard key={plan.nameKey} plan={plan} t={t} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pricing-grid { grid-template-columns: 1fr !important; max-width: 400px; margin: 0 auto; }
        }
        @media (max-width: 600px) {
          .pricing-grid { max-width: 100%; }
        }
      `}</style>
    </section>
  );
}

function PriceCard({ plan, t }) {
  const features = t.pricing[plan.featuresKey];

  return (
    <div style={{
      background: plan.featured ? "#1A1A2E" : "#fff",
      border: plan.featured ? "none" : "1px solid #E5E7EB",
      borderRadius: 16,
      padding: "32px 28px",
      position: "relative",
      transform: plan.featured ? "scale(1.04)" : "none",
      boxShadow: plan.featured ? "0 20px 60px rgba(26,26,46,0.25)" : "none",
      transition: "box-shadow 0.2s, transform 0.2s",
    }}
      onMouseEnter={(e) => { if (!plan.featured) { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
      onMouseLeave={(e) => { if (!plan.featured) { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; } }}
    >
      {plan.featured && (
        <div style={{
          position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
          background: "#E8C547", color: "#1A1A2E", fontFamily: "'DM Sans', sans-serif",
          fontSize: 11, fontWeight: 800, padding: "4px 16px", borderRadius: 100, letterSpacing: "0.5px",
          whiteSpace: "nowrap",
        }}>
          {t.pricing.popular}
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, color: plan.featured ? "#fff" : "#1A1A2E", marginBottom: 4 }}>
          {t.pricing[plan.nameKey]}
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: plan.featured ? "rgba(255,255,255,0.5)" : "#9CA3AF" }}>
          {t.pricing[plan.descKey]}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 40, fontWeight: 800, color: plan.featured ? "#E8C547" : "#1A1A2E" }}>
          ₸{t.pricing[plan.priceKey]}
        </span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: plan.featured ? "rgba(255,255,255,0.4)" : "#9CA3AF", marginLeft: 6 }}>
          / {t.pricing.currency.split("/ ")[1] || "мес"}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {features.map((feature) => (
          <div key={feature} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <Check size={15} color={plan.featured ? "#E8C547" : "#22C55E"} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: plan.featured ? "rgba(255,255,255,0.75)" : "#374151", lineHeight: 1.5 }}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      <a
        href="#contact"
        style={{
          display: "block",
          textAlign: "center",
          padding: "13px 24px",
          background: plan.featured ? "#E8C547" : "#1A1A2E",
          color: plan.featured ? "#1A1A2E" : "#fff",
          borderRadius: 10,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          textDecoration: "none",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        {t.pricing.cta}
      </a>
    </div>
  );
}
