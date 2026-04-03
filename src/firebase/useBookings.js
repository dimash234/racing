import { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

export function useBookings() {
  const [loading, setLoading] = useState(false);

  // Все бронирования на конкретную дату (для календаря)
  const getBookingsForDate = async (date) => {
    const q = query(collection(db, "bookings"), where("date", "==", date));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  };

  // Все бронирования конкретного пользователя (для дашборда)
  const getUserBookings = async (userId) => {
    const q = query(collection(db, "bookings"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  };

  // Создать бронирование
  const bookSlot = async (data) => {
    setLoading(true);
    try {
      await addDoc(collection(db, "bookings"), {
        ...data,
        createdAt: serverTimestamp(),
      });
    } finally {
      setLoading(false);
    }
  };

  // Отменить бронирование
  const cancelBooking = async (bookingId) => {
    await deleteDoc(doc(db, "bookings", bookingId));
  };

  return { getBookingsForDate, getUserBookings, bookSlot, cancelBooking, loading };
}