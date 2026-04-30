import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./RequestModal.module.css";

export default function RequestModal({ isOpen, onClose, serviceName }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    comment: "",
    agree: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setFormData({
        name: "",
        phone: "",
        email: "",
        comment: "",
        agree: false,
      });
      setSubmitStatus(null);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    setFormData((prev) => ({ ...prev, phone: formatPhone(digits) }));
  };

  const handlePhoneKeyDown = (e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const digits = formData.phone.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, phone: formatPhone(digits.slice(0, -1)) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agree) {
      toast.error("Необходимо согласие на обработку персональных данных");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { agree, ...requestPayload } = formData;
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...requestPayload,
          serviceName,
        }),
      });

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Заявка успешно отправлена!",
        });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setSubmitStatus({ type: "error", message: "Ошибка отправки заявки" });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Не удалось отправить заявку. Попробуйте позже.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  function formatPhone(digits) {
    if (!digits.length) return "";
    const d = digits[0] === "8" ? `7${digits.slice(1)}` : digits;
    let m = "+7";
    if (d.length > 1) m += ` (${d.slice(1, 4)}`;
    if (d.length >= 4) m += `) ${d.slice(4, 7)}`;
    if (d.length >= 7) m += `-${d.slice(7, 9)}`;
    if (d.length >= 9) m += `-${d.slice(9, 11)}`;
    return m;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <h2 className={styles.title}>Заявка на услугу</h2>
        <p className={styles.serviceName}>{serviceName}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Ваше имя <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Иван Иванов"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              Телефон <span className={styles.required}>*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              onKeyDown={handlePhoneKeyDown}
              className={styles.input}
              placeholder="+7 (999) 123-45-67"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="example@mail.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="comment" className={styles.label}>
              Комментарий
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Дополнительная информация..."
              rows="4"
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="request-agreement"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
            />
            <label htmlFor="request-agreement">
              Я даю согласие на обработку моих персональных данных и соглашаюсь с{" "}
              <Link to="/privacy">Политикой конфиденциальности</Link>
            </label>
          </div>

          {submitStatus && (
            <div
              className={`${styles.status} ${
                submitStatus.type === "success"
                  ? styles.statusSuccess
                  : styles.statusError
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Отправка..." : "Отправить заявку"}
          </button>
        </form>
      </div>
    </div>
  );
}
