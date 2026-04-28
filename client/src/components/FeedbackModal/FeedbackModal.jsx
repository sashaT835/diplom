import { useState } from "react";
import Button from "../Button/Button";
import styles from "./FeedbackModal.module.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function FeedbackModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    message: "",
    name: "",
    email: "",
    phone: "",
    agree: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    setForm((prev) => ({ ...prev, phone: formatPhone(digits) }));
  };

  const handlePhoneKeyDown = (e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const digits = form.phone.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, phone: formatPhone(digits.slice(0, -1)) }));
    }
  };

  function formatPhone(digits) {
    if (!digits.length) return "";
    const d = digits[0] === "8" ? "7" + digits.slice(1) : digits;
    let m = "+7";
    if (d.length > 1) m += " (" + d.slice(1, 4);
    if (d.length >= 4) m += ") " + d.slice(4, 7);
    if (d.length >= 7) m += "-" + d.slice(7, 9);
    if (d.length >= 9) m += "-" + d.slice(9, 11);
    return m;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email || undefined,
          serviceName: "Обратная связь",
          comment: form.message || undefined,
        }),
      });

      if (response.ok) {
        setStatus({ type: "success", message: "Сообщение успешно отправлено!" });
        setTimeout(() => {
          onClose();
          setForm({ message: "", name: "", email: "", phone: "", agree: false });
          setStatus(null);
        }, 2000);
      } else {
        setStatus({ type: "error", message: "Ошибка отправки. Попробуйте позже." });
      }
    } catch {
      setStatus({ type: "error", message: "Не удалось отправить. Проверьте соединение." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <h2 className={styles.title}>Обратная связь</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <textarea
              className={styles.textarea}
              name="message"
              placeholder="Сообщение"
              rows="4"
              value={form.message}
              onChange={handleChange}
            />
            <input
              type="text"
              className={styles.input}
              name="name"
              placeholder="Имя"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <input
            type="email"
            className={styles.input}
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="tel"
            className={styles.input}
            name="phone"
            placeholder="+7 (999) 123-45-67"
            value={form.phone}
            onChange={handlePhoneChange}
            onKeyDown={handlePhoneKeyDown}
          />

          <div className={styles.checkboxWrapper}>
            <input
              type="checkbox"
              id="fb-agreement"
              name="agree"
              className={styles.checkbox}
              checked={form.agree}
              onChange={handleChange}
            />
            <label htmlFor="fb-agreement" className={styles.checkboxLabel}>
              Я даю согласие на обработку моих персональных данных и соглашаюсь с
              Политикой конфиденциальности
            </label>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Отправка..." : "Отправить"}
          </Button>

          {status && (
            <p style={{ color: status.type === "success" ? "#4ade80" : "#f14f4f", margin: 0, fontSize: 14 }}>
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
