import { useState, useEffect } from "react";
import { Calendar, Clock, Monitor, X, LogOut, User, ChevronRight } from "lucide-react";
import { useAuth } from "../firebase/useAuth";
import { useBookings } from "../firebase/useBookings";
import { useNavigate } from "react-router-dom";

const SIM_COLORS = { "City Car Driving": "#3B82F6", "BeamNG.Drive": "#E8C547" };

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { getUserBookings, cancelBooking } = useBookings();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    setLoading(true);
    try { setBookings(await getUserBookings(user.uid)); }
    finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Отменить запись?")) return;
    setCancelling(id);
    try { await cancelBooking(id); setBookings((p) => p.filter((b) => b.id !== id)); }
    finally { setCancelling(null); }
  };

  const handleLogout = async () => { await logout(); navigate("/"); };

  const now = new Date();
  const upcoming = bookings.filter((b) => new Date(`${b.date}T${b.time}`) >= now);
  const past = bookings.filter((b) => new Date(`${b.date}T${b.time}`) < now);

  const fmtDate = (s) => new Date(s).toLocaleDateString("ru-RU", { weekday: "short", day: "numeric", month: "long" });

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      {/* Nav */}
      <div style={{ background: "#1A1A2E", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 34, height: 34, background: "#E8C547", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 16 }}>🏎</span>
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 800, color: "#fff" }}>SimDrive.kz</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(255,255,255,0.08)", borderRadius: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#E8C547", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={13} color="#1A1A2E" />
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
              {user?.displayName || user?.email}
            </span>
          </div>
          <button onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}>
            <LogOut size={14} /> Выйти
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>
        {/* Welcome */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 800, color: "#1A1A2E", marginBottom: 4 }}>
            Привет, {user?.displayName?.split(" ")[0] || "Водитель"} 👋
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#9CA3AF" }}>Ваши занятия и история</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Всего занятий", value: bookings.length, color: "#3B82F6", bg: "#EFF6FF" },
            { label: "Предстоящих", value: upcoming.length, color: "#22C55E", bg: "#F0FDF4" },
            { label: "Прошедших", value: past.length, color: "#9CA3AF", bg: "#F9FAFB" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} style={{ background: bg, border: `1px solid ${color}22`, borderRadius: 14, padding: "20px 22px" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 32, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a href="/#booking"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1A1A2E", borderRadius: 16, padding: "22px 28px", textDecoration: "none", marginBottom: 36, transition: "transform 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Записаться на занятие</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>30 минут · 2 500₸ · City Car Driving или BeamNG.Drive</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#E8C547", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>
            Выбрать <ChevronRight size={16} />
          </div>
        </a>

        {/* Upcoming */}
        <Section title="Предстоящие" count={upcoming.length}>
          {loading ? <Empty text="Загружаем..." /> : upcoming.length === 0 ? <Empty text="Нет предстоящих занятий" /> :
            upcoming.map((b) => <BookingCard key={b.id} b={b} fmtDate={fmtDate} onCancel={handleCancel} cancelling={cancelling} canCancel />)
          }
        </Section>

        {past.length > 0 && (
          <Section title="История" count={past.length}>
            {past.map((b) => <BookingCard key={b.id} b={b} fmtDate={fmtDate} isPast />)}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, count, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 800, color: "#1A1A2E" }}>{title}</h2>
        <span style={{ padding: "2px 10px", background: "#F3F4F6", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#9CA3AF" }}>{count}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
}

function BookingCard({ b, fmtDate, onCancel, cancelling, canCancel, isPast }) {
  const color = SIM_COLORS[b.simulator] || "#6B7280";
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, opacity: isPast ? 0.55 : 1, transition: "box-shadow 0.2s" }}
      onMouseEnter={(e) => !isPast && (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Monitor size={18} color={color} />
        </div>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 4 }}>{b.simulator}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Calendar size={11} color="#C4C9D4" />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9CA3AF" }}>{fmtDate(b.date)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={11} color="#C4C9D4" />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9CA3AF" }}>{b.time} · 30 мин</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 800, color: "#1A1A2E" }}>2 500₸</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: isPast ? "#C4C9D4" : "#22C55E", marginTop: 2 }}>
            {isPast ? "Завершено" : "✓ Подтверждено"}
          </div>
        </div>
        {canCancel && (
          <button onClick={() => onCancel(b.id)} disabled={cancelling === b.id}
            style={{ width: 36, height: 36, border: "1.5px solid #FECACA", background: "#FEF2F2", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FEE2E2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#FEF2F2")}>
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div style={{ padding: "36px", textAlign: "center", background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6" }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#C4C9D4" }}>{text}</span>
    </div>
  );
}