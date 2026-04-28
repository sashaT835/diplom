import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "./AuthModal.module.css";

export default function AuthModal({
  isOpen,
  onClose,
  onSwitchToRegister,
  onLogin,
}) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setFormData({ email: "", password: "" });
      setError("");
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onLogin(formData);
      toast.success("Успешная авторизация!");
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Ошибка входа. Проверьте данные."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <div className={styles.leftSection}>
          <h2>Войти в аккаунт</h2>

          <form onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Введите email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Пароль</label>
              <input
                type="password"
                name="password"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>

          <div className={styles.footer}>
            <p>Нет аккаунта?</p>
            <button
              className={styles.switchButton}
              onClick={onSwitchToRegister}
            >
              Зарегистрироваться
            </button>
          </div>
        </div>

        <div className={styles.rightSection}>
          <img src="/img/picture_auth.png" alt="Login" />
        </div>
      </div>
    </div>
  );
}
