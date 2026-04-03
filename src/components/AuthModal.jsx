import { useState } from "react";
import { X, Eye, EyeOff, User, Mail, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "../firebase/useAuth";

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState("login"); // login | register | reset
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register, resetPassword } = useAuth();

  const errorMessages = {
    "auth/email-already-in-use": "Этот email уже зарегистрирован",
    "auth/invalid-email": "Неверный формат email",
    "auth/weak-password": "Пароль минимум 6 символов",
    "auth/invalid-credential": "Неверный email или пароль",
    "auth/user-not-found": "Пользователь не найден",
    "auth/too-many-requests": "Слишком много попыток. Попробуйте позже",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "reset") {
        await resetPassword(email);
        setResetSent(true);
      } else if (mode === "login") {
        await login(email, password);
        onClose();
      } else {
        await register(email, password, name);
        onClose();
      }
    } catch (err) {
      setError(errorMessages[err.code] || "Ошибка. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setResetSent(false);
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(15,15,26,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(4px)" }}
    >
      <div style={{ background: "#fff", borderRadius: 24, padding: "40px 36px", width: "100%", maxWidth: 420, position: "relative", boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}>
        <button onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 8, background: "#F3F4F6", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280" }}>
          <X size={16} />
        </button>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, background: "#1A1A2E", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <span style={{ fontSize: 24 }}>🏎</span>
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 800, color: "#1A1A2E" }}>
            {mode === "reset" ? "Восстановление" : mode === "login" ? "Войти" : "Регистрация"}
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>SimDrive.kz</div>
        </div>

        {/* Tabs (only for login/register) */}
        {mode !== "reset" && (
          <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 12, padding: 4, marginBottom: 24, gap: 4 }}>
            {[{ key: "login", label: "Войти" }, { key: "register", label: "Регистрация" }].map((tab) => (
              <button key={tab.key} onClick={() => switchMode(tab.key)}
                style={{ flex: 1, padding: "9px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, background: mode === tab.key ? "#fff" : "transparent", color: mode === tab.key ? "#1A1A2E" : "#9CA3AF", boxShadow: mode === tab.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s" }}>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Reset success */}
        {resetSent ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <CheckCircle2 size={48} color="#22C55E" style={{ margin: "0 auto 16px" }} />
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, color: "#1A1A2E", marginBottom: 8 }}>Письмо отправлено!</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6B7280", marginBottom: 24 }}>
              Проверьте {email} и перейдите по ссылке для сброса пароля.
            </div>
            <button onClick={() => switchMode("login")}
              style={{ padding: "12px 28px", background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Вернуться к входу
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "reset" && (
              <div style={{ padding: "12px 16px", background: "#EFF6FF", borderRadius: 10, marginBottom: 4 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#2563EB", margin: 0 }}>
                  Введите email — пришлём ссылку для сброса пароля.
                </p>
              </div>
            )}

            {mode === "register" && (
              <InputField icon={<User size={15} />} label="Имя" type="text" value={name} onChange={setName} placeholder="Ваше имя" required />
            )}

            <InputField icon={<Mail size={15} />} label="Email" type="email" value={email} onChange={setEmail} placeholder="email@example.com" required />

            {mode !== "reset" && (
              <div>
                <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Пароль</label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}><Lock size={15} /></div>
                  <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                    style={{ width: "100%", padding: "11px 40px 11px 36px", border: "1.5px solid #E5E7EB", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                    onFocus={(e) => (e.target.style.borderColor = "#1A1A2E")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {mode === "login" && (
                  <button type="button" onClick={() => switchMode("reset")}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#3B82F6", marginTop: 6, padding: 0 }}>
                    Забыли пароль?
                  </button>
                )}
              </div>
            )}

            {error && (
              <div style={{ padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#EF4444" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ marginTop: 4, padding: "14px", background: loading ? "#9CA3AF" : "#1A1A2E", color: "#fff", border: "none", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
              {loading ? "..." : mode === "login" ? "Войти" : mode === "register" ? "Создать аккаунт" : "Отправить письмо"}
            </button>

            {mode === "reset" && (
              <button type="button" onClick={() => switchMode("login")}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6B7280", padding: 0 }}>
                <ArrowLeft size={14} /> Вернуться к входу
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

function InputField({ icon, label, type, value, onChange, placeholder, required }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>{icon}</div>
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder}
          style={{ width: "100%", padding: "11px 14px 11px 36px", border: "1.5px solid #E5E7EB", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
          onFocus={(e) => (e.target.style.borderColor = "#1A1A2E")}
          onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
      </div>
    </div>
  );
}