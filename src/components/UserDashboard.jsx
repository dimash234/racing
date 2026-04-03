import { useState, useEffect } from "react";
import { Calendar, Clock, Monitor, X, LogOut, User, ChevronRight, Car, Zap } from "lucide-react";
import { useAuth } from "../firebase/useAuth";
import { useBookings } from "../firebase/useBookings";
import { useNavigate } from "react-router-dom";

const SIM_COLORS = {
  "City Car Driving": { bg: "#3B82F6", icon: Car },
  "BeamNG.Drive": { bg: "#E8C547", icon: Zap },
};

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { getUserBookings, cancelBooking } = useBookings();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate("/");
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    setLoading(true);
    const data = await getUserBookings(user.uid);
    setBookings(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const now = new Date();
  const upcoming = bookings.filter(b => new Date(`${b.date}T${b.time}`) >= now);
  const past = bookings.filter(b => new Date(`${b.date}T${b.time}`) < now);

  const fmtDate = (dateStr) => new Date(dateStr).toLocaleDateString("ru-RU", {
    weekday: "short", day: "numeric", month: "long"
  });

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="user-info">
          <User size={28} />
          <div>
            <h1>Привет, {user?.displayName?.split(" ")[0] || "Водитель"}! 👋</h1>
            <p>Ваш личный кабинет • SimDrive.kz</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-header-btn">
          <LogOut size={20} /> Выйти
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">Всего занятий<br/><span>{bookings.length}</span></div>
        <div className="stat-card">Предстоящих<br/><span className="green">{upcoming.length}</span></div>
        <div className="stat-card">Прошедших<br/><span className="gray">{past.length}</span></div>
      </div>

      {/* Записаться быстро */}
      <div className="quick-book">
        <button onClick={() => navigate("/#pricing")}>
          Записаться на новое занятие
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Предстоящие занятия */}
      <Section title="Предстоящие занятия" count={upcoming.length}>
        {loading ? <p>Загрузка...</p> : upcoming.length === 0 ? (
          <Empty text="Нет предстоящих записей" />
        ) : (
          upcoming.map(b => <BookingCard key={b.id} b={b} fmtDate={fmtDate} onCancel={cancelBooking} isPast={false} />)
        )}
      </Section>

      {/* История (общий дневник) */}
      {past.length > 0 && (
        <Section title="История занятий • Общий дневник" count={past.length}>
          {past.map(b => <BookingCard key={b.id} b={b} fmtDate={fmtDate} isPast={true} />)}
        </Section>
      )}
    </div>
  );
}

/* Вспомогательные компоненты (Section, BookingCard, Empty) — оставь как в предыдущей версии или используй мои улучшенные карточки */