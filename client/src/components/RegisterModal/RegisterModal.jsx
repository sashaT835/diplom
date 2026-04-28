import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "./RegisterModal.module.css";

export default function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  onRegister,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
    privacy: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setFormData({ firstName: "", email: "", password: "", privacy: false });
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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.privacy) {
      setError("Необходимо согласие на обработку персональных данных");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { privacy: _privacy, ...userData } = formData;
      await onRegister(userData);
      toast.success("Успешная регистрация!");
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Ошибка регистрации. Попробуйте снова."
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
          <h2>Регистрация аккаунта</h2>

          <form onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <label>Имя</label>
              <input
                type="text"
                name="firstName"
                placeholder="Введите имя"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

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

            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="privacy"
                name="privacy"
                checked={formData.privacy}
                onChange={handleChange}
                required
              />
              <label htmlFor="privacy">
                Я даю согласие на обработку моих персональных данных и
                согласился с Политикой конфиденциальности
              </label>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
          </form>

          <div className={styles.footer}>
            <p>Есть аккаунт?</p>
            <button className={styles.switchButton} onClick={onSwitchToLogin}>
              Войти
            </button>
          </div>
        </div>

        <div className={styles.rightSection}>
          <img src="/img/picture_reg.png" alt="Register" />
        </div>
      </div>
    </div>
  );
}
