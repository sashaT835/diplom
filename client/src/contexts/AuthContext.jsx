import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../api/auth";
import realtimeService from "../services/realtimeService";
import { RealtimeTopics } from "../services/realtimeTopics";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionBlockedMessage, setSessionBlockedMessage] = useState("");

  useEffect(() => {
    // Проверяем, есть ли сохраненный пользователь
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    console.log("Login attempt:", credentials);
    const data = await authService.login(credentials);
    console.log("Login response:", data);
    setUser(data.user);
    setIsAuthenticated(true);
    setSessionBlockedMessage("");
    return data;
  };

  const register = async (userData) => {
    console.log("Register attempt:", userData);
    const data = await authService.register(userData);
    console.log("Register response:", data);
    setUser(data.user);
    setIsAuthenticated(true);
    setSessionBlockedMessage("");
    return data;
  };

  const logout = () => {
    authService.logout();
    realtimeService.disconnect();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return undefined;
    }

    const token = authService.getToken();
    if (!token) {
      return undefined;
    }

    realtimeService.connect(token);

    const unsubscribeRoleChanged = realtimeService.subscribe(
      RealtimeTopics.USER_ROLE_CHANGED,
      (payload) => {
        if (payload?.userId && payload.userId !== user.id) {
          return;
        }

        authService.logout();
        realtimeService.disconnect();
        setUser(null);
        setIsAuthenticated(false);
        setSessionBlockedMessage(
          payload?.reason ||
            "Ваша роль была изменена. Для продолжения войдите заново."
        );
      }
    );

    return () => {
      unsubscribeRoleChanged();
    };
  }, [isAuthenticated, user?.id]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateUser,
        sessionBlockedMessage,
      }}
    >
      {children}
      {sessionBlockedMessage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              borderRadius: "14px",
              background: "#fff",
              padding: "28px 24px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
              textAlign: "center",
            }}
          >
            <h2 style={{ margin: "0 0 12px", color: "#222" }}>
              Сессия завершена
            </h2>
            <p style={{ margin: "0 0 18px", color: "#333", lineHeight: 1.5 }}>
              {sessionBlockedMessage}
            </p>
            <button
              type="button"
              onClick={() => {
                window.location.href = "/";
              }}
              style={{
                border: "none",
                borderRadius: "10px",
                background: "#484283",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                padding: "12px 20px",
                width: "100%",
              }}
            >
              Войти заново
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  return context;
}
