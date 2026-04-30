import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../../../components/Button/Button";
import styles from "./ContactsContent.module.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function ContactsContent() {
  const [formData, setFormData] = useState({
    message: "",
    name: "",
    email: "",
    phone: "",
    agree: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setStatusMessage("");
  };

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    setFormData((prev) => ({ ...prev, phone: formatPhone(digits) }));
    setStatusMessage("");
  };

  const handlePhoneKeyDown = (e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const digits = formData.phone.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        phone: formatPhone(digits.slice(0, -1)),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agree) {
      toast.error("Необходимо согласие на обработку персональных данных");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          serviceName: "Обратная связь",
          comment: formData.message || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка отправки");
      }

      setFormData({
        message: "",
        name: "",
        email: "",
        phone: "",
        agree: false,
      });
      setStatusMessage("Сообщение успешно отправлено.");
      toast.success("Сообщение отправлено");
    } catch {
      setStatusMessage("Не удалось отправить сообщение. Попробуйте позже.");
      toast.error("Ошибка отправки сообщения");
    } finally {
      setIsSubmitting(false);
    }
  };

  function formatPhone(digits) {
    if (!digits.length) return "";
    const normalized = digits[0] === "8" ? `7${digits.slice(1)}` : digits;
    let result = "+7";
    if (normalized.length > 1) result += ` (${normalized.slice(1, 4)}`;
    if (normalized.length >= 4) result += `) ${normalized.slice(4, 7)}`;
    if (normalized.length >= 7) result += `-${normalized.slice(7, 9)}`;
    if (normalized.length >= 9) result += `-${normalized.slice(9, 11)}`;
    return result;
  }

  return (
    <div className={styles.contactsContent}>
      <div className="container">
        <div className={styles.breadcrumbs}>
          <Link to="/">Главная</Link>
          <span> &gt; </span>
          <span className={styles.active}>Контакты</span>
        </div>

        <h1 className={styles.title}>Контакты</h1>

        <div className={styles.mapWrapper}>
          <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1232.9767201854572!2d55.13544679873487!3d51.82528099373864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNTHCsDQ5JzMxLjAiTiA1NcKwMDgnMTIuMCJF!5e0!3m2!1sru!2sru!4v1777544121999!5m2!1sru!2sru"
              className={styles.map}
              style={{border: 0}}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.contactInfo}>
            <div className={styles.infoBlock}>
              <p className={styles.label}>ФАКТИЧЕСКИЙ АДРЕС</p>
              <p className={styles.text}>г. Оренбург, ул. Берёзка, 2/5</p>
            </div>

            <div className={styles.infoBlock}>
              <p className={styles.label}>ТЕЛЕФОНЫ</p>
              <p className={styles.text}>+7 (3532) 37-62-43</p>
              <p className={styles.text}>+7 (3532) 37-68-37</p>
            </div>

            <div className={styles.infoBlock}>
              <p className={styles.label}>EMAIL</p>
              <p className={styles.text}>info@titan.ru</p>
            </div>

            <div className={styles.infoBlock}>
              <p className={styles.label}>РЕЖИМ РАБОТЫ</p>
              <p className={styles.text}>Пн-пт: с 9:00 до 19:00</p>
              <p className={styles.text}>Сб-вс: выходной</p>
            </div>
          </div>

          <div className={styles.formSection}>
            <p className={styles.description}>
              ООО "Титан" создаёт полезные для бизнеса решения, будучи настоящим
              партнёром: мы строим честные отношения и профессионально подходим
              к каждой задаче. Стремясь быть лучшими и первыми, мы предлагаем
              индивидуальные подходы для достижения ваших амбициозных целей.
            </p>

            <h2 className={styles.formTitle}>Обратная связь</h2>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <textarea
                  className={styles.textarea}
                  name="message"
                  placeholder="Сообщение"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                <input
                  type="text"
                  className={styles.input}
                  name="name"
                  placeholder="Имя"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                type="email"
                className={styles.input}
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="tel"
                className={styles.input}
                name="phone"
                placeholder="Телефон"
                value={formData.phone}
                onChange={handlePhoneChange}
                onKeyDown={handlePhoneKeyDown}
                required
              />

              <div className={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  id="agreement"
                  name="agree"
                  className={styles.checkbox}
                  checked={formData.agree}
                  onChange={handleChange}
                />
                <label htmlFor="agreement" className={styles.checkboxLabel}>
                  Я даю согласие на обработку моих персональных данных и соглашаюсь с{" "}
                  <Link to="/privacy">Политикой конфиденциальности</Link>
                </label>
              </div>

              {statusMessage && (
                <p className={styles.statusMessage}>{statusMessage}</p>
              )}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Отправка..." : "Отправить"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
