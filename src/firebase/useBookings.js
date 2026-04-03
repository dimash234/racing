import { useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./config";

export function useBookings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all bookings for a specific date
  const getBookingsForDate = async (date) => {
    const q = query(
      collection(db, "bookings"),
      where("date", "==", date)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  };

  // Get bookings for a specific user
  const getUserBookings = async (uid) => {
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", uid),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  };

  // Get ALL bookings (admin)
  const getAllBookings = async () => {
    const q = query(collection(db, "bookings"), orderBy("date", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  };

  // Book a slot
  const bookSlot = async ({ userId, userName, userEmail, date, time, simulator }) => {
    setLoading(true);
    setError(null);
    try {
      await addDoc(collection(db, "bookings"), {
        userId,
        userName,
        userEmail,
        date,
        time,
        simulator,
        status: "confirmed",
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId) => {
    await deleteDoc(doc(db, "bookings", bookingId));
  };

  return { loading, error, getBookingsForDate, getUserBookings, getAllBookings, bookSlot, cancelBooking };
}