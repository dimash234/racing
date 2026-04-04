import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useAuth } from "../firebase/useAuth";
import { useNavigate } from "react-router-dom";
import {
  LogOut, Mail, Phone, User, Clock, Trash2, RefreshCw,
  Calendar, Monitor, Search, ChevronLeft, ChevronRight,
} from "lucide-react";

const TABS = [
  { id: "bookings", label: "📅 Записи" },
  { id: "contacts", label: "📬 Заявки" },
];

const SIM_META = {
  "City Car Driving":  { color: "#3B82F6", bg: "#EFF6FF", emoji: "🚗" },
  "BeamNG.Drive":      { color: "#D97706", bg: "#FFFBEB", emoji: "⚡" },
  "Оба симулятора":    { color: "#8B5CF6", bg: "#F5F3FF", emoji: "🎮" },
};

function fmt(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function fmtDate(str) {
  if (!str) return "—";
  return new Date(str + "T12:00:00").toLocaleDateString("ru-RU", {
    weekday: "short", day: "numeric", month: "long",
  });
}

function fmtTime(t) {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  const end = new Date(); end.setHours(h, m + 30, 0, 0);
  return `${t} – ${end.getHours().toString().padStart(2,"0")}:${end.getMinutes().toString().padStart(2,"0")}`;
}

function isPastBooking(b) {
  const [h, m] = (b.time || "00:00").split(":").map(Number);
  const d = new Date((b.date || "2000-01-01") + "T00:00:00");
  d.setHours(h, m + 30, 0, 0);
  return d < new Date();
}

// ─── Главный компонент ───────────────────────────────────────────────
export default function AdminPanel() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", color: "#6B7280" }}>
      Загрузка...
    </div>
  );

  // Если не авторизован или нет роли — на главную
  if (!user || (role !== "manager" && role !== "admin")) {
    navigate("/");
    return null;
  }

  return <Dashboard user={user} role={role} />;
}

// ─── Dashboard ───────────────────────────────────────────────────────
function Dashboard({ user, role }) {
  const [tab, setTab] = useState("bookings");

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#1A1A2E", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: "#E8C547", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🏎</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>SimDrive.kz — Admin</span>
          <span style={{ fontSize: 11, padding: "2px 8px", background: "rgba(232,197,71,0.15)", color: "#E8C547", border: "1px solid rgba(232,197,71,0.3)", borderRadius: 100, fontWeight: 700 }}>
            {role}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{user.email}</span>
          <button onClick={() => signOut(auth)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", cursor: "pointer", fontSize: 13 }}>
            <LogOut size={14} /> Выйти
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 28px", display: "flex", gap: 4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: "14px 20px", border: "none", borderBottom: `2px solid ${tab === t.id ? "#1A1A2E" : "transparent"}`, background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? "#1A1A2E" : "#9CA3AF", transition: "all 0.15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        {tab === "bookings" ? <BookingsTab /> : <ContactsTab />}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .booking-card { grid-template-columns: 1fr !important; }
          .contact-card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Вкладка: Записи ─────────────────────────────────────────────────
function BookingsTab() {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleting, setDeleting]   = useState(null);
  const [search, setSearch]       = useState("");
  const [filterSim, setFilterSim] = useState("all");
  const [filterDay, setFilterDay] = useState("all"); // all | upcoming | past

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "bookings"), orderBy("date", "asc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Доп. сортировка по времени внутри дня
      data.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
      setBookings(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Отменить эту запись?")) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "bookings", id));
      setBookings(prev => prev.filter(b => b.id !== id));
    } finally { setDeleting(null); }
  };

  // Фильтрация
  const filtered = bookings.filter(b => {
    const matchSearch = [b.userName, b.userEmail, b.simulator, b.date, b.time]
      .join(" ").toLowerCase().includes(search.toLowerCase());
    const matchSim = filterSim === "all" || b.simulator === filterSim;
    const past = isPastBooking(b);
    const matchDay = filterDay === "all" || (filterDay === "upcoming" && !past) || (filterDay === "past" && past);
    return matchSearch && matchSim && matchDay;
  });

  const upcoming = bookings.filter(b => !isPastBooking(b));
  const today    = bookings.filter(b => b.date === new Date().toISOString().split("T")[0]);
  const allSims  = [...new Set(bookings.map(b => b.simulator))];

  return (
    <>
      {/* Статистика */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Всего записей",    value: bookings.length,  color: "#1A1A2E" },
          { label: "Предстоящих",      value: upcoming.length,  color: "#22C55E" },
          { label: "Сегодня",          value: today.length,     color: "#3B82F6" },
          { label: "Прошедших",        value: bookings.length - upcoming.length, color: "#9CA3AF" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Фильтры */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {/* Поиск */}
          <div style={{ position: "relative" }}>
            <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input placeholder="Имя, email, симулятор..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, outline: "none", width: 220 }} />
          </div>

          {/* Фильтр симулятора */}
          <select value={filterSim} onChange={e => setFilterSim(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, outline: "none", background: "#fff", color: "#374151" }}>
            <option value="all">Все симуляторы</option>
            {allSims.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Фильтр времени */}
          {["all","upcoming","past"].map(f => (
            <button key={f} onClick={() => setFilterDay(f)}
              style={{ padding: "8px 14px", border: `1px solid ${filterDay === f ? "#1A1A2E" : "#E5E7EB"}`, borderRadius: 8, background: filterDay === f ? "#1A1A2E" : "#fff", color: filterDay === f ? "#fff" : "#6B7280", fontSize: 13, fontWeight: filterDay === f ? 700 : 400, cursor: "pointer" }}>
              {f === "all" ? "Все" : f === "upcoming" ? "Предстоящие" : "Прошедшие"}
            </button>
          ))}
        </div>

        <button onClick={fetchBookings}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#374151" }}>
          <RefreshCw size={14} /> Обновить
        </button>
      </div>

      <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 12 }}>
        Показано: {filtered.length} из {bookings.length}
      </div>

      {/* Список */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>Загружаем записи...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>Записей не найдено</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(b => {
            const meta = SIM_META[b.simulator] || { color: "#6B7280", bg: "#F3F4F6", emoji: "🎮" };
            const past = isPastBooking(b);
            return (
              <div key={b.id} className="booking-card"
                style={{ background: "#fff", border: `1px solid ${past ? "#F3F4F6" : "#E5E7EB"}`, borderRadius: 14, padding: "18px 22px", display: "grid", gridTemplateColumns: "2fr 2fr 2fr auto", gap: 20, alignItems: "center", opacity: past ? 0.65 : 1 }}>

                {/* Пользователь */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <User size={16} color="#6B7280" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>{b.userName || "—"}</div>
                    <a href={`mailto:${b.userEmail}`} style={{ fontSize: 12, color: "#3B82F6", textDecoration: "none" }}>{b.userEmail || "—"}</a>
                  </div>
                </div>

                {/* Симулятор */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {meta.emoji}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: meta.color }}>{b.simulator}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>
                      {b.simulator === "Оба симулятора" ? "4 500₸" : "2 500₸"}
                    </div>
                  </div>
                </div>

                {/* Дата и время */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <Calendar size={13} color="#9CA3AF" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{fmtDate(b.date)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Clock size={13} color="#9CA3AF" />
                    <span style={{ fontSize: 13, color: "#6B7280" }}>{fmtTime(b.time)}</span>
                  </div>
                  {past && (
                    <span style={{ display: "inline-block", marginTop: 4, fontSize: 10, padding: "2px 8px", background: "#F3F4F6", color: "#9CA3AF", borderRadius: 100 }}>Завершено</span>
                  )}
                </div>

                {/* Удалить */}
                <button onClick={() => handleCancel(b.id)} disabled={deleting === b.id}
                  title="Отменить запись"
                  style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, cursor: deleting === b.id ? "not-allowed" : "pointer", color: "#EF4444", flexShrink: 0 }}>
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── Вкладка: Заявки (контакты) ──────────────────────────────────────
function ContactsTab() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch]     = useState("");

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить заявку?")) return;
    setDeleting(id);
    try { await deleteDoc(doc(db, "contacts", id)); setContacts(prev => prev.filter(c => c.id !== id)); }
    finally { setDeleting(null); }
  };

  const filtered = contacts.filter(c =>
    [c.name, c.email, c.phone, c.message].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const langLabel = { ru: "🇷🇺 Рус", kz: "🇰🇿 Қаз", en: "🇬🇧 Eng" };
  const todayCount = contacts.filter(c => {
    if (!c.createdAt) return false;
    const d = c.createdAt.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
    return d.toDateString() === new Date().toDateString();
  }).length;

  return (
    <>
      {/* Статистика */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Всего заявок",  value: contacts.length, color: "#3B82F6" },
          { label: "За сегодня",    value: todayCount,       color: "#22C55E" },
          { label: "Без ответа",    value: contacts.length,  color: "#F59E0B" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Тулбар */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1A1A2E" }}>Заявки ({filtered.length})</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, outline: "none", width: 220 }} />
          </div>
          <button onClick={fetchContacts}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#374151" }}>
            <RefreshCw size={14} /> Обновить
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>Загружаем заявки...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>{search ? "Ничего не найдено" : "Заявок пока нет"}</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(c => (
            <div key={c.id} className="contact-card"
              style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "18px 22px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 20, alignItems: "start" }}>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <User size={16} color="#3B82F6" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>{c.name || "—"}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{langLabel[c.preferredLang] || "—"}</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Mail size={12} color="#9CA3AF" />
                  <a href={`mailto:${c.email}`} style={{ fontSize: 13, color: "#3B82F6", textDecoration: "none" }}>{c.email || "—"}</a>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Phone size={12} color="#9CA3AF" />
                  <span style={{ fontSize: 13, color: "#374151" }}>{c.phone || "—"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Clock size={12} color="#9CA3AF" />
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}>{fmt(c.createdAt)}</span>
                </div>
              </div>

              <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, background: "#F9FAFB", borderRadius: 8, padding: "10px 12px", maxHeight: 80, overflow: "hidden" }}>
                {c.message || <span style={{ color: "#D1D5DB" }}>Без сообщения</span>}
              </div>

              <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, cursor: "pointer", color: "#EF4444", flexShrink: 0 }}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}