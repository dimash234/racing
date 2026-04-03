import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Monitor, CheckCircle2, X } from "lucide-react";
import { useBookings } from "../firebase/useBookings";
import { useAuth } from "../firebase/useAuth";

const TIME_SLOTS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30",
  "18:00","18:30","19:00","19:30",
];

const SIM_COLORS = { "City Car Driving": "#3B82F6", "BeamNG.Drive": "#E8C547" };

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export default function BookingCalendar({ onAuthRequired }) {
  const { user } = useAuth();
  const { getBookingsForDate, bookSlot, cancelBooking, loading } = useBookings();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSim, setSelectedSim] = useState("City Car Driving");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [success, setSuccess] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [cancelling, setCancelling] = useState(null);

  const getWeekDays = () => {
    const start = addDays(today, weekOffset * 7);
    const monday = new Date(start);
    monday.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  };

  const weekDays = getWeekDays();

  useEffect(() => { loadSlots(); }, [selectedDate]);

  const loadSlots = async () => {
    const data = await getBookingsForDate(formatDate(selectedDate));
    setBookedSlots(data);
  };

  const getSlotBooking = (time, sim) =>
    bookedSlots.find((b) => b.time === time && b.simulator === sim);

  const isPast = (time) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(selectedDate);
    d.setHours(h, m, 0, 0);
    return d < new Date();
  };

  const handleBook = async () => {
    if (!user) { onAuthRequired(); return; }
    if (!selectedTime) return;
    try {
      await bookSlot({ userId: user.uid, userName: user.displayName || user.email, userEmail: user.email, date: formatDate(selectedDate), time: selectedTime, simulator: selectedSim });
      setSuccess(true);
      setSelectedTime(null);
      await loadSlots();
      setTimeout(() => setSuccess(false), 4000);
    } catch {}
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Отменить запись?")) return;
    setCancelling(bookingId);
    try {
      await cancelBooking(bookingId);
      await loadSlots();
      setSelectedTime(null);
    } finally {
      setCancelling(null);
    }
  };

  const dayNames = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
  const monthNames = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];

  const selectedBooking = selectedTime ? getSlotBooking(selectedTime, selectedSim) : null;
  const isMySelectedBooking = selectedBooking && user && selectedBooking.userId === user.uid;

  return (
    <section id="booking" style={{ padding: "100px 24px", background: "#F9FAFB" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 100, padding: "5px 14px", marginBottom: 16 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#2563EB", fontWeight: 600 }}>Запись на занятие</span>
          </div>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.5px", marginBottom: 12 }}>
            Выберите время
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#6B7280", maxWidth: 440, margin: "0 auto" }}>
            Выберите симулятор, дату и свободный слот. Занятие 30 минут — 2 500₸.
          </p>
        </div>

        <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

          {/* Simulator tabs */}
          <div style={{ padding: "20px 28px", borderBottom: "1px solid #F3F4F6", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9CA3AF", fontWeight: 500, marginRight: 4 }}>Симулятор:</span>
            {Object.entries(SIM_COLORS).map(([sim, color]) => (
              <button key={sim} onClick={() => { setSelectedSim(sim); setSelectedTime(null); }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 10, border: `2px solid ${selectedSim === sim ? color : "#E5E7EB"}`, background: selectedSim === sim ? `${color}12` : "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: selectedSim === sim ? color : "#6B7280", transition: "all 0.2s" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                {sim}
              </button>
            ))}
          </div>

          {/* Week nav */}
          <div style={{ padding: "14px 28px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => setWeekOffset((w) => w - 1)} disabled={weekOffset <= 0}
              style={{ width: 34, height: 34, border: "1.5px solid #E5E7EB", borderRadius: 10, background: weekOffset <= 0 ? "#F9FAFB" : "#fff", cursor: weekOffset <= 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: weekOffset <= 0 ? "#D1D5DB" : "#374151", transition: "all 0.2s" }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, color: "#1A1A2E" }}>
              {monthNames[weekDays[0].getMonth()]} {weekDays[0].getFullYear()}
            </span>
            <button onClick={() => setWeekOffset((w) => w + 1)}
              style={{ width: 34, height: 34, border: "1.5px solid #E5E7EB", borderRadius: 10, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151", transition: "all 0.2s" }}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day picker */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #F3F4F6" }}>
            {weekDays.map((day, i) => {
              const isSelected = formatDate(day) === formatDate(selectedDate);
              const isPastDay = day < today;
              const isToday = formatDate(day) === formatDate(today);
              return (
                <button key={i} onClick={() => !isPastDay && (setSelectedDate(day), setSelectedTime(null))} disabled={isPastDay}
                  style={{ padding: "16px 8px", border: "none", borderRight: i < 6 ? "1px solid #F3F4F6" : "none", background: isSelected ? "#1A1A2E" : "transparent", cursor: isPastDay ? "not-allowed" : "pointer", transition: "background 0.15s" }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: isSelected ? "rgba(255,255,255,0.5)" : isPastDay ? "#E5E7EB" : "#9CA3AF", marginBottom: 6, letterSpacing: "0.3px" }}>{dayNames[i]}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 800, color: isSelected ? "#fff" : isPastDay ? "#D1D5DB" : "#1A1A2E" }}>{day.getDate()}</div>
                  {isToday && !isSelected && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3B82F6", margin: "6px auto 0" }} />}
                </button>
              );
            })}
          </div>

          {/* Slots */}
          <div style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Clock size={15} color="#6B7280" />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#374151" }}>
                  {selectedDate.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
                </span>
              </div>
              {/* Legend */}
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {[
                  { color: "#22C55E", bg: "#F0FDF4", label: "Свободно" },
                  { color: "#DC2626", bg: "#FEF2F2", label: "Занято" },
                  { color: "#1D4ED8", bg: "#EFF6FF", label: "Моя запись" },
                ].map(({ color, bg, label }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: bg, border: `1.5px solid ${color}` }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9CA3AF" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))", gap: 8 }}>
              {TIME_SLOTS.map((time) => {
                const booking = getSlotBooking(time, selectedSim);
                const mine = booking && user && booking.userId === user.uid;
                const past = isPast(time);
                const selected = selectedTime === time;

                let bg, border, color, cursor = "pointer";
                if (past) { bg = "#F9FAFB"; border = "#F3F4F6"; color = "#D1D5DB"; cursor = "not-allowed"; }
                else if (mine) { bg = "#EFF6FF"; border = "#93C5FD"; color = "#1D4ED8"; }
                else if (booking) { bg = "#FEF2F2"; border = "#FECACA"; color = "#DC2626"; cursor = "not-allowed"; }
                else if (selected) { bg = "#1A1A2E"; border = "#1A1A2E"; color = "#fff"; }
                else { bg = "#F0FDF4"; border = "#86EFAC"; color = "#15803D"; }

                return (
                  <button key={time}
                    onClick={() => { if (!past && (!booking || mine)) setSelectedTime(selected ? null : time); }}
                    disabled={past || (booking && !mine)}
                    style={{ padding: "10px 4px", borderRadius: 10, border: `1.5px solid ${border}`, background: bg, color, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, cursor, transition: "all 0.15s", textAlign: "center", lineHeight: 1 }}>
                    {time}
                    {mine && <div style={{ fontSize: 9, marginTop: 3, opacity: 0.75, fontWeight: 500 }}>моя</div>}
                  </button>
                );
              })}
            </div>

            {/* Action panel */}
            {selectedTime && (
              <div style={{ marginTop: 24, padding: "20px 24px", background: "#F9FAFB", borderRadius: 16, border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: SIM_COLORS[selectedSim] }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, color: "#1A1A2E" }}>{selectedSim} — {selectedTime}</span>
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9CA3AF" }}>
                    {selectedDate.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })} · 30 мин · 2 500₸
                  </div>
                </div>

                {isMySelectedBooking ? (
                  <button onClick={() => handleCancel(selectedBooking.id)} disabled={cancelling === selectedBooking.id}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "#FEF2F2", color: "#DC2626", border: "1.5px solid #FECACA", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                    <X size={15} />
                    {cancelling ? "Отменяем..." : "Отменить запись"}
                  </button>
                ) : (
                  <button onClick={handleBook} disabled={loading}
                    style={{ padding: "12px 28px", background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", transition: "opacity 0.2s" }}>
                    {loading ? "..." : user ? "Записаться" : "Войти и записаться"}
                  </button>
                )}
              </div>
            )}

            {success && (
              <div style={{ marginTop: 16, padding: "14px 20px", background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle2 size={18} color="#22C55E" />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#15803D", fontWeight: 600 }}>Запись подтверждена! Ждём вас.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}