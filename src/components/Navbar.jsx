import { useState, useEffect } from "react";
import { Menu, X, Gauge, User, LogOut, ShieldCheck } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { useAuth } from "../firebase/useAuth";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onAuthClick }) {
  const { lang, setLang, t } = useLanguage();
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setOpen(false);
  };

  const isManager = role === "manager" || role === "admin";

  const links = [
    { key: "home", href: "#hero" },
    { key: "about", href: "#about" },
    { key: "citycar", href: "#citycar" },
    { key: "beamng", href: "#beamng" },
    { key: "pricing", href: "#pricing" },
    { key: "contact", href: "#contact" },
  ];

  const LANGS = ["ru", "kz", "en"];
  const LANG_LABELS = { ru: "РУС", kz: "ҚАЗ", en: "ENG" };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #E5E7EB" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "#1A1A2E",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Gauge size={20} color="#E8C547" />
          </div>
          <div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: "#1A1A2E",
                letterSpacing: "-0.3px",
              }}
            >
              SimDrive.kz
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#6B7280",
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Driving Academy
            </div>
          </div>
        </a>

        {/* Desktop Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {links.map((link) => (
            <a
              key={link.key}
              href={link.href}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "#374151",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#1A1A2E")}
              onMouseLeave={(e) => (e.target.style.color = "#374151")}
            >
              {t.nav[link.key]}
            </a>
          ))}
        </div>

        {/* Right side - Desktop */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Language switcher */}
          <div
            style={{
              display: "flex",
              background: "#F3F4F6",
              borderRadius: 8,
              padding: 3,
              gap: 2,
            }}
          >
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.5px",
                  background: lang === l ? "#1A1A2E" : "transparent",
                  color: lang === l ? "#fff" : "#6B7280",
                  transition: "all 0.2s",
                }}
              >
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Кнопка Admin Panel — только для manager/admin */}
              {isManager && (
                <a
                  href="/admin"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "7px 14px",
                    background: "#1A1A2E",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#E8C547",
                  }}
                >
                  <ShieldCheck size={14} />
                  Admin
                </a>
              )}

              {/* Кнопка в кабинет */}
              <a
                href="/dashboard"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "7px 16px",
                  background: "#F3F4F6",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1A1A2E",
                }}
              >
                <User size={14} />
                {user.displayName || "Кабинет"}
              </a>

              {/* Кнопка Выйти */}
              <button
                onClick={handleLogout}
                title="Выйти из аккаунта"
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#F3F4F6",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  color: "#EF4444",
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              style={{
                padding: "8px 20px",
                background: "#1A1A2E",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Войти
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
          }}
        >
          {open ? <X size={24} color="#1A1A2E" /> : <Menu size={24} color="#1A1A2E" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            background: "#fff",
            borderTop: "1px solid #E5E7EB",
            padding: "16px 24px 24px",
          }}
        >
          {links.map((link) => (
            <a
              key={link.key}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                padding: "12px 0",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                color: "#374151",
                textDecoration: "none",
                borderBottom: "1px solid #F3F4F6",
              }}
            >
              {t.nav[link.key]}
            </a>
          ))}

          {/* Language in mobile */}
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLang(l);
                  setOpen(false);
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "1px solid #E5E7EB",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  background: lang === l ? "#1A1A2E" : "#fff",
                  color: lang === l ? "#fff" : "#374151",
                }}
              >
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>

          {user && (
            <div style={{ marginTop: 20 }}>
              {/* Admin в мобильном меню */}
              {isManager && (
                <a
                  href="/admin"
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 14px",
                    marginBottom: 8,
                    background: "#1A1A2E",
                    borderRadius: 10,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#E8C547",
                    textDecoration: "none",
                  }}
                >
                  <ShieldCheck size={18} />
                  Admin Panel
                </a>
              )}

              <a
                href="/dashboard"
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 0",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1A1A2E",
                  textDecoration: "none",
                }}
              >
                <User size={18} />
                Личный кабинет
              </a>

              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: "12px",
                  background: "#EF4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <LogOut size={18} />
                Выйти из аккаунта
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}