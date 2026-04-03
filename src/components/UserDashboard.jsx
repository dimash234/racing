import { useState, useEffect } from "react";
import { Calendar, Clock, Monitor, Trash2, LogOut, User } from "lucide-react";
import { useAuth } from "../firebase/useAuth";
import { useBookings } from "../firebase/useBookings";
import { useNavigate } from "react-router-dom";

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
    try {
      const data = await getUserBookings(user.uid);
      setBookings(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Отменить запись?")) return;
    setCancelling(id);
    try {
      await cancelBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } finally {
      setCancelling(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const now = new Date();
  const upcoming = bookings.filter((b) => new Date(`${b.date}T${b.time}`) >= now);
  const past = bookings.filter((b) => new Date(`${b.date}T${b.time}`) < now);

  const simColor = { "City Car Driving": "#3B82F6", "BeamNG.Drive": "#E8C547" };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ru-RU", { weekday: "short", day: "numeric", month: "long" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      {/* Topbar */}
      <div style={{ background: "#1A1A2E", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, background: "#E8C547", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14 }}>🏎</span>
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>SimDrive.kz</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#E8C547", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={14} color="#1A1A2E" />
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{user?.displayName || user?.email}</span>
          </div>
          <button onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
            <LogOut size={14} /> Выйти
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Всего занятий", value: bookings.length, color: "#3B82F6" },
            { label: "Предстоящих", value: upcoming.length, color: "#22C55E" },
            { label: "Прошедших", value: past.length, color: "#9CA3AF" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* CTA to book more */}
        <a href="/#booking" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1A1A2E", borderRadius: 14, padding: "20px 24px", textDecoration: "none", marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>Записаться ещё</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>30 минут · 2 500₸</div>
          </div>
          <div style={{ padding: "10px 20px", background: "#E8C547", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>
            Выбрать время →
          </div>
        </a>

        {/* Upcoming */}
        <Section title="Предстоящие занятия" count={upcoming.length}>
          {loading ? (
            <Empty text="Загружаем..." />
          ) : upcoming.length === 0 ? (
            <Empty text="Нет предстоящих занятий" />
          ) : (
            upcoming.map((b) => (
              <BookingCard key={b.id} booking={b} simColor={simColor} formatDate={formatDate} onCancel={handleCancel} cancelling={cancelling} showCancel />
            ))
          )}
        </Section>

        {/* Past */}
        {past.length > 0 && (
          <Section title="История занятий" count={past.length}>
            {past.map((b) => (
              <BookingCard key={b.id} booking={b} simColor={simColor} formatDate={formatDate} isPast />
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, count, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: "#1A1A2E" }}>{title}</h2>
        <span style={{ padding: "2px 10px", background: "#F3F4F6", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#6B7280" }}>{count}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
}

function BookingCard({ booking, simColor, formatDate, onCancel, cancelling, showCancel, isPast }) {
  const color = simColor[booking.simulator] || "#6B7280";
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, opacity: isPast ? 0.6 : 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Monitor size={18} color={color} />
        </div>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>{booking.simulator}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 3 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Calendar size={12} color="#9CA3AF" />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9CA3AF" }}>{formatDate(booking.date)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={12} color="#9CA3AF" />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9CA3AF" }}>{booking.time} · 30 мин</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>2 500₸</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: isPast ? "#9CA3AF" : "#22C55E", fontWeight: 600 }}>{isPast ? "Завершено" : "Подтверждено"}</div>
        </div>
        {showCancel && (
          <button onClick={() => onCancel(booking.id)} disabled={cancelling === booking.id}
            style={{ width: 34, height: 34, border: "1px solid #FECACA", background: "#FEF2F2", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444" }}>
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div style={{ padding: "32px", textAlign: "center", background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB" }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#9CA3AF" }}>{text}</span>
    </div>
  );
}