import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./config";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // "user" | "manager" | "admin"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Читаем роль из Firestore
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setRole(snap.data().role ?? "user");
        } else {
          // Первый вход — создаём документ с ролью "user"
          await setDoc(ref, {
            email: u.email,
            displayName: u.displayName || "",
            role: "user",
            createdAt: new Date(),
          });
          setRole("user");
        }
        setUser(u);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const register = async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    // Документ создастся автоматически в onAuthStateChanged
    return cred.user;
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // Проверка доступа: manager видит manager и admin
  const hasRole = (required) => {
    const hierarchy = { user: 0, manager: 1, admin: 2 };
    return hierarchy[role] >= hierarchy[required];
  };

  return { user, role, loading, hasRole, register, login, logout, resetPassword };
}