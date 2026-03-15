// src/components/Contact.jsx
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { useContact } from "../firebase/useContact";
import { SectionBadge } from "./About";

export default function Contact() {
  const { t } = useLanguage();
  const { submitContact, loading, success, error, setSuccess } = useContact();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredLang: "ru",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitContact(form);
    if (!error) {
      setForm({ name: "", email: "", phone: "", message: "", preferredLang: "ru" });
    }
  };

  const infoItems = [
    { icon: <MapPin size={18} />, label: t.contact.address },
    { icon: <Phone size={18} />, label: t.contact.phone },
    { icon: <Mail size={18} />, label: t.contact.email },
    { icon: <Clock size={18} />, label: t.contact.hours },
  ];

  return (
    <section id="contact" style={{ padding: "100px 24px", background: "#FAFAFA" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <SectionBadge label={t.contact.badge} />
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(28px, 3.5vw, 44px)",
            fontWeight: 800,
            color: "#1A1A2E",
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            marginBottom: 12,
          }}>
            {t.contact.title}
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#6B7280" }}>{t.contact.subtitle}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 40, alignItems: "start" }} className="contact-grid">
          {/* Info sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {infoItems.map(({ icon, label }) => (
              <div key={label} style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "16px 20px",
              }}>
                <div style={{ color: "#3B82F6", flexShrink: 0, marginTop: 1 }}>{icon}</div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{label}</span>
              </div>
            ))}

            {/* Map embed placeholder */}
            <div style={{
              background: "#1A1A2E", borderRadius: 12, padding: 20, marginTop: 8,
            }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                🇰🇿 Serving all of Kazakhstan.<br />
                Main campus in Almaty with online consultation available.
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "36px 32px" }}>
            {success ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", gap: 16 }}>
                <CheckCircle2 size={48} color="#22C55E" />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#374151", textAlign: "center", fontWeight: 600 }}>
                  {t.contact.form_success}
                </p>
                <button onClick={() => setSuccess(false)} style={{ padding: "8px 20px", background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="form-row">
                  <Field label={t.contact.form_name} name="name" value={form.name} onChange={handleChange} required />
                  <Field label={t.contact.form_phone} name="phone" type="tel" value={form.phone} onChange={handleChange} />
                </div>
                <Field label={t.contact.form_email} name="email" type="email" value={form.email} onChange={handleChange} required />

                {/* Language select */}
                <div>
                  <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                    {t.contact.form_lang}
                  </label>
                  <select
                    name="preferredLang"
                    value={form.preferredLang}
                    onChange={handleChange}
                    style={{
                      width: "100%", padding: "10px 14px", border: "1px solid #D1D5DB", borderRadius: 8,
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#374151",
                      background: "#fff", outline: "none",
                    }}
                  >
                    <option value="kz">{t.contact.lang_kz}</option>
                    <option value="ru">{t.contact.lang_ru}</option>
                    <option value="en">{t.contact.lang_en}</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                    {t.contact.form_message}
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    style={{
                      width: "100%", padding: "10px 14px", border: "1px solid #D1D5DB", borderRadius: 8,
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#374151",
                      resize: "vertical", outline: "none", boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
                    onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                  />
                </div>

                {error && (
                  <div style={{ padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#EF4444" }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "13px 28px",
                    background: loading ? "#9CA3AF" : "#1A1A2E",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "background 0.2s",
                    alignSelf: "flex-start",
                  }}
                >
                  {loading ? "..." : t.contact.form_submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function Field({ label, name, type = "text", value, onChange, required }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
        {label}{required && <span style={{ color: "#EF4444", marginLeft: 2 }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: "100%", padding: "10px 14px", border: "1px solid #D1D5DB", borderRadius: 8,
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#374151",
          outline: "none", boxSizing: "border-box", background: "#fff",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
        onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
      />
    </div>
  );
}
