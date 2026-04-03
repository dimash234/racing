import { useState, useEffect } from "react";
import { Calendar, Clock, X, LogOut, User, ChevronRight, Car, Zap, Plus } from "lucide-react";
import { useAuth } from "../firebase/useAuth";
import { useBookings } from "../firebase/useBookings";
import { useNavigate } from "react-router-dom";

const SIM_META = {
  "City Car Driving": { color: "#3B82F6", bg: "#EFF6FF", icon: "🚗" },
  "BeamNG.Drive":     { color: "#D97706", bg: "#FFFBEB", icon: "⚡" },
};

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("ru-RU", {
    weekday: "long", day: "numeric", month: "long",
  });
}

function formatTime(timeStr) {
  const [h, m] = timeStr.split(":");
  const end = new Date();
  end.setHours(Number(h), Number(m) + 30, 0, 0);
  return `${timeStr} – ${end.getHours().toString().padStart(2,"0")}:${end.getMinutes().toString().padStart(2,"0")}`;
}

function isPast(b) {
  const [h, m] = b.time.split(":").map(Number);
  const dt = new Date(b.date + "T00:00:00");
  dt.setHours(h, m + 30, 0, 0);
  return dt < new Date();
}

export default function UserDashboard() {
  const { user, role, logout } = useAuth();
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
    try {
      const data = await getUserBookings(user.uid);
      // Сортируем по дате + времени
      data.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Отменить запись?")) return;
    setCancelling(bookingId);
    try {
      await cancelBooking(bookingId);
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    } finally {
      setCancelling(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const upcoming = bookings.filter(b => !isPast(b));
  const past     = bookings.filter(b => isPast(b)).reverse();

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ background: "#1A1A2E", padding: "0 28px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "#E8C547", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏎</div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>SimDrive.kz</span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {(role === "manager" || role === "admin") && (
              <a href="/admin" style={{ padding: "6px 14px", background: "rgba(232,197,71,0.15)", border: "1px solid rgba(232,197,71,0.3)", borderRadius: 8, color: "#E8C547", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                Admin →
              </a>
            )}
            <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 13 }}>
              <LogOut size={14} /> Выйти
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "36px 24px" }}>

        {/* ── Welcome ── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={24} color="#E8C547" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1A1A2E" }}>
                Привет, {user?.displayName?.split(" ")[0] || "Водитель"} 👋
              </h1>
              <p style={{ margin: 0, fontSize: 14, color: "#9CA3AF", marginTop: 2 }}>
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Всего занятий",    value: bookings.length, color: "#1A1A2E" },
            { label: "Предстоящих",      value: upcoming.length, color: "#22C55E" },
            { label: "Прошедших",        value: past.length,     color: "#9CA3AF" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── Кнопка записаться ── */}
        <a href="/#booking" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#1A1A2E", borderRadius: 14, textDecoration: "none", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Plus size={18} color="#E8C547" />
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Записаться на новое занятие</span>
          </div>
          <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
        </a>

        {/* ── Предстоящие ── */}
        <Section title="Предстоящие занятия" count={upcoming.length} accent="#22C55E">
          {loading ? (
            <Skeleton />
          ) : upcoming.length === 0 ? (
            <Empty text="Нет предстоящих записей — запишитесь выше!" />
          ) : (
            upcoming.map(b => (
              <BookingCard key={b.id} b={b} onCancel={handleCancel} cancelling={cancelling} />
            ))
          )}
        </Section>

        {/* ── История ── */}
        {!loading && past.length > 0 && (
          <Section title="История занятий" count={past.length} accent="#9CA3AF">
            {past.map(b => (
              <BookingCard key={b.id} b={b} isPast />
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

/* ─── Section ─── */
function Section({ title, count, accent, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1A1A2E" }}>{title}</h2>
        <span style={{ padding: "2px 10px", background: accent + "20", color: accent, borderRadius: 100, fontSize: 12, fontWeight: 700 }}>{count}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

/* ─── BookingCard ─── */
function BookingCard({ b, onCancel, cancelling, isPast = false }) {
  const meta = SIM_META[b.simulator] || { color: "#6B7280", bg: "#F3F4F6", icon: "🎮" };

  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${isPast ? "#F3F4F6" : "#E5E7EB"}`,
      borderRadius: 14,
      padding: "18px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      opacity: isPast ? 0.6 : 1,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Иконка симулятора */}
        <div style={{ width: 44, height: 44, borderRadius: 12, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
          {meta.icon}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A2E", marginBottom: 3 }}>
            {b.simulator}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6B7280" }}>
              <Calendar size={12} />
              {formatDate(b.date)}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6B7280" }}>
              <Clock size={12} />
              {formatTime(b.time)}
            </span>
          </div>
        </div>
      </div>

      {/* Действия */}
      {!isPast && onCancel && (
        <button
          onClick={() => onCancel(b.id)}
          disabled={cancelling === b.id}
          title="Отменить запись"
          style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, cursor: "pointer", color: "#EF4444", flexShrink: 0 }}
        >
          <X size={15} />
        </button>
      )}
      {isPast && (
        <span style={{ fontSize: 11, color: "#9CA3AF", background: "#F3F4F6", padding: "3px 10px", borderRadius: 100, whiteSpace: "nowrap" }}>Завершено</span>
      )}
    </div>
  );
}

function Empty({ text }) {
  return (
    <div style={{ padding: "32px 24px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
      {text}
    </div>
  );
}

function Skeleton() {
  return [1, 2].map(i => (
    <div key={i} style={{ height: 80, background: "#F3F4F6", borderRadius: 14, animation: "pulse 1.5s infinite" }} />
  ));
}