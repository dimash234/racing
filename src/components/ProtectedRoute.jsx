import { Navigate } from "react-router-dom";
import { useAuth } from "../firebase/useAuth";

/**
 * Защищённый маршрут.
 * requiredRole: "user" | "manager" | "admin"
 * Иерархия: admin > manager > user
 */
export default function ProtectedRoute({ children, requiredRole = "user" }) {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif",
          color: "#6B7280",
          fontSize: 15,
        }}
      >
        Загрузка...
      </div>
    );
  }

  // Не авторизован
  if (!user) return <Navigate to="/" replace />;

  // Нет нужной роли
  if (!hasRole(requiredRole)) return <Navigate to="/" replace />;

  return children;
}