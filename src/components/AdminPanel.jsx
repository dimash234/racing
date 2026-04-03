// src/components/AdminPanel.jsx
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { LogOut, Mail, Phone, User, Clock, Trash2, RefreshCw, Lock, Eye, EyeOff } from "lucide-react";

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
    return unsub;
  }, []);
  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B7280" }}>Loading...</span></div>;
  return user ? <Dashboard user={user} /> : <LoginForm />;
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch { setError("Неверный email или пароль"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 380, background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: "40px 36px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, background: "#1A1A2E", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Lock size={20} color="#E8C547" />
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 800, color: "#1A1A2E" }}>Admin Panel</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>SimDrive.kz</div>
        </div>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              style={{ width: "100%", padding: "10px 14px", border: "1px solid #D1D5DB", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
              onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")} />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Пароль</label>
            <div style={{ position: "relative" }}>
              <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                style={{ width: "100%", padding: "10px 40px 10px 14px", border: "1px solid #D1D5DB", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
                onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && <div style={{ padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#EF4444" }}>{error}</div>}
          <button type="submit" disabled={loading}
            style={{ padding: "12px", background: loading ? "#9CA3AF" : "#1A1A2E", color: "#fff", border: "none", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginTop: 4 }}>
            {loading ? "Входим..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ user }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setContacts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить заявку?")) return;
    setDeleting(id);
    try { await deleteDoc(doc(db, "contacts", id)); setContacts((prev) => prev.filter((c) => c.id !== id)); }
    finally { setDeleting(null); }
  };

  const filtered = contacts.filter((c) =>
    [c.name, c.email, c.phone, c.message].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const langLabel = { ru: "🇷🇺 Рус", kz: "🇰🇿 Қаз", en: "🇬🇧 Eng" };
  const formatDate = (ts) => {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <div style={{ background: "#1A1A2E", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: "#E8C547", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14 }}>🏎</span>
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>SimDrive.kz — Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{user.email}</span>
          <button onClick={() => signOut(auth)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
            <LogOut size={14} /> Выйти
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Всего заявок", value: contacts.length, color: "#3B82F6" },
            { label: "За сегодня", value: contacts.filter(c => { if (!c.createdAt) return false; const d = c.createdAt.toDate ? c.createdAt.toDate() : new Date(c.createdAt); return d.toDateString() === new Date().toDateString(); }).length, color: "#22C55E" },
            { label: "Без ответа", value: contacts.length, color: "#F59E0B" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: "#1A1A2E" }}>Заявки ({filtered.length})</h2>
          <div style={{ display: "flex", gap: 10 }}>
            <input placeholder="Поиск..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ padding: "8px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none", width: 220 }} />
            <button onClick={fetchContacts}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#374151" }}>
              <RefreshCw size={14} /> Обновить
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, fontFamily: "'DM Sans', sans-serif", color: "#9CA3AF" }}>Загружаем заявки...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, fontFamily: "'DM Sans', sans-serif", color: "#9CA3AF" }}>{search ? "Ничего не найдено" : "Заявок пока нет"}</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((c) => (
              <div key={c.id} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 20, alignItems: "start" }} className="contact-card">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <User size={16} color="#3B82F6" />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>{c.name || "—"}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9CA3AF" }}>{langLabel[c.preferredLang] || "—"}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Mail size={13} color="#9CA3AF" />
                    <a href={`mailto:${c.email}`} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#3B82F6", textDecoration: "none" }}>{c.email || "—"}</a>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Phone size={13} color="#9CA3AF" />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#374151" }}>{c.phone || "—"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Clock size={13} color="#9CA3AF" />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9CA3AF" }}>{formatDate(c.createdAt)}</span>
                  </div>
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6B7280", lineHeight: 1.6, background: "#F9FAFB", borderRadius: 8, padding: "10px 12px", maxHeight: 80, overflow: "hidden" }}>
                  {c.message || <span style={{ color: "#D1D5DB" }}>Сообщение не указано</span>}
                </div>
                <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                  style={{ padding: "8px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, cursor: "pointer", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@media (max-width: 768px) { .contact-card { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}