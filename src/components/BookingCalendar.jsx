import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Monitor, CheckCircle2 } from "lucide-react";
import { useBookings } from "../firebase/useBookings";
import { useAuth } from "../firebase/useAuth";

const SIMULATORS = ["City Car Driving", "BeamNG.Drive"];
const TIME_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"];

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default function BookingCalendar({ onAuthRequired }) {
  const { user } = useAuth();
  const { getBookingsForDate, bookSlot, loading } = useBookings();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSim, setSelectedSim] = useState(SIMULATORS[0]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [success, setSuccess] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate 7-day week starting from Monday
  const getWeekDays = () => {
    const days = [];
    const start = addDays(today, weekOffset * 7);
    // find monday
    const monday = new Date(start);
    monday.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    for (let i = 0; i < 7; i++) days.push(addDays(monday, i));
    return days;
  };

  const weekDays = getWeekDays();

  useEffect(() => {
    loadSlots();
  }, [selectedDate]);

  const loadSlots = async () => {
    const bookings = await getBookingsForDate(formatDate(selectedDate));
    setBookedSlots(bookings);
  };

  const isBooked = (time, sim) =>
    bookedSlots.some((b) => b.time === time && b.simulator === sim);

  const isMyBooking = (time, sim) =>
    user && bookedSlots.some((b) => b.time === time && b.simulator === sim && b.userId === user.uid);

  const isPast = (time) => {
    const [h, m] = time.split(":").map(Number);
    const slotDate = new Date(selectedDate);
    slotDate.setHours(h, m, 0, 0);
    return slotDate < new Date();
  };

  const handleBook = async () => {
    if (!user) { onAuthRequired(); return; }
    if (!selectedTime) return;
    try {
      await bookSlot({
        userId: user.uid,
        userName: user.displayName || user.email,
        userEmail: user.email,
        date: formatDate(selectedDate),
        time: selectedTime,
        simulator: selectedSim,
      });
      setSuccess(true);
      setSelectedTime(null);
      await loadSlots();
      setTimeout(() => setSuccess(false), 3000);
    } catch {}
  };

  const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

  return (
    <section id="booking" style={{ padding: "100px 24px", background: "#F9FAFB" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 100, padding: "5px 14px", marginBottom: 16 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#2563EB", fontWeight: 600 }}>Запись на занятие</span>
          </div>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.5px", marginBottom: 12 }}>
            Выберите время
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#6B7280" }}>
            Зелёные слоты — свободны. Выберите симулятор, дату и время.
          </p>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E5E7EB", overflow: "hidden" }}>
          {/* Simulator selector */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 8 }}>
              <Monitor size={16} color="#6B7280" />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6B7280", fontWeight: 500 }}>Симулятор:</span>
            </div>
            {SIMULATORS.map((sim) => (
              <button key={sim} onClick={() => setSelectedSim(sim)}
                style={{ padding: "7px 16px", borderRadius: 8, border: `1.5px solid ${selectedSim === sim ? "#1A1A2E" : "#E5E7EB"}`, background: selectedSim === sim ? "#1A1A2E" : "#fff", color: selectedSim === sim ? "#fff" : "#374151", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
                {sim}
              </button>
            ))}
          </div>

          {/* Week navigation */}
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => setWeekOffset((w) => w - 1)} disabled={weekOffset <= 0}
              style={{ width: 32, height: 32, border: "1px solid #E5E7EB", borderRadius: 8, background: "#fff", cursor: weekOffset <= 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: weekOffset <= 0 ? "#D1D5DB" : "#374151" }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, color: "#1A1A2E" }}>
              {monthNames[weekDays[0].getMonth()]} {weekDays[0].getFullYear()}
            </span>
            <button onClick={() => setWeekOffset((w) => w + 1)}
              style={{ width: 32, height: 32, border: "1px solid #E5E7EB", borderRadius: 8, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day selector */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #F3F4F6" }}>
            {weekDays.map((day, i) => {
              const isSelected = formatDate(day) === formatDate(selectedDate);
              const isPastDay = day < today;
              const isToday = formatDate(day) === formatDate(today);
              return (
                <button key={i} onClick={() => !isPastDay && setSelectedDate(day)} disabled={isPastDay}
                  style={{ padding: "14px 8px", border: "none", borderRight: i < 6 ? "1px solid #F3F4F6" : "none", background: isSelected ? "#1A1A2E" : "transparent", cursor: isPastDay ? "not-allowed" : "pointer", transition: "background 0.15s" }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: isSelected ? "rgba(255,255,255,0.6)" : isPastDay ? "#D1D5DB" : "#9CA3AF", marginBottom: 4, fontWeight: 500 }}>{dayNames[i]}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 800, color: isSelected ? "#fff" : isPastDay ? "#D1D5DB" : "#1A1A2E" }}>{day.getDate()}</div>
                  {isToday && !isSelected && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#3B82F6", margin: "4px auto 0" }} />}
                </button>
              );
            })}
          </div>

          {/* Time slots grid */}
          <div style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Clock size={15} color="#6B7280" />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6B7280", fontWeight: 500 }}>
                {selectedDate.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
              </span>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
              {[
                { color: "#22C55E", label: "Свободно" },
                { color: "#EF4444", label: "Занято" },
                { color: "#3B82F6", label: "Моя запись" },
                { color: "#D1D5DB", label: "Прошедшее" },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#6B7280" }}>{label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8 }}>
              {TIME_SLOTS.map((time) => {
                const booked = isBooked(time, selectedSim);
                const mine = isMyBooking(time, selectedSim);
                const past = isPast(time);
                const selected = selectedTime === time;

                let bg = "#F0FDF4", border = "#86EFAC", color = "#15803D";
                if (past) { bg = "#F9FAFB"; border = "#E5E7EB"; color = "#D1D5DB"; }
                else if (mine) { bg = "#EFF6FF"; border = "#93C5FD"; color = "#1D4ED8"; }
                else if (booked) { bg = "#FEF2F2"; border = "#FECACA"; color = "#DC2626"; }
                else if (selected) { bg = "#1A1A2E"; border = "#1A1A2E"; color = "#fff"; }

                return (
                  <button key={time}
                    onClick={() => !booked && !past && setSelectedTime(selected ? null : time)}
                    disabled={booked || past}
                    style={{ padding: "10px 4px", borderRadius: 8, border: `1.5px solid ${border}`, background: bg, color, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: booked || past ? "not-allowed" : "pointer", transition: "all 0.15s", textAlign: "center" }}>
                    {time}
                    {mine && <div style={{ fontSize: 9, marginTop: 2, opacity: 0.8 }}>Моя</div>}
                  </button>
                );
              })}
            </div>

            {/* Book button */}
            {selectedTime && (
              <div style={{ marginTop: 24, padding: "20px 24px", background: "#F9FAFB", borderRadius: 12, border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>
                    {selectedSim} — {selectedTime}
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                    {selectedDate.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })} · 30 минут · 2 500₸
                  </div>
                </div>
                <button onClick={handleBook} disabled={loading}
                  style={{ padding: "12px 28px", background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
                  {loading ? "..." : user ? "Записаться" : "Войти и записаться"}
                </button>
              </div>
            )}

            {success && (
              <div style={{ marginTop: 16, padding: "14px 20px", background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle2 size={18} color="#22C55E" />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#15803D", fontWeight: 600 }}>Запись подтверждена!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}