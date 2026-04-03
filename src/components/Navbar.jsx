import { useState, useEffect } from "react";
import { Menu, X, Gauge, User, LogOut } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { useAuth } from "../firebase/useAuth";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onAuthClick }) {
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();
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
    <>
      {/* Logo */}
      <div className="logo">
        SimDrive.kz
        <span>Driving Academy</span>
      </div>

      {/* Desktop Links */}
      <div className="desktop-links">
        {links.map((link) => (
          <a key={link.key} href={link.href}>
            {t.nav[link.key]}
          </a>
        ))}
      </div>

      {/* Right side */}
      <div className="right-side">
        {LANGS.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`lang-btn ${lang === l ? "active" : ""}`}
          >
            {LANG_LABELS[l]}
          </button>
        ))}

        {user ? (
          <div className="user-menu">
            <a href="/dashboard" className="user-btn">
              <User size={18} />
              <span>{user.displayName || "Кабинет"}</span>
            </a>
            <button onClick={handleLogout} className="logout-btn" title="Выйти">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button onClick={onAuthClick} className="login-btn">
            Войти
          </button>
        )}
      </div>

      {/* Mobile menu */}
      <button onClick={() => setOpen(!open)} className="mobile-toggle">
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {open && (
        <div className="mobile-menu">
          {/* ... остальные ссылки ... */}
          {user && (
            <>
              <a href="/dashboard" className="mobile-user-link">
                <User size={20} /> Личный кабинет
              </a>
              <button onClick={handleLogout} className="mobile-logout">
                <LogOut size={20} /> Выйти из аккаунта
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}