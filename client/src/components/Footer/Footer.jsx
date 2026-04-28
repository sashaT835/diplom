import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
import styles from "./Footer.module.css";

export default function Footer() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.logoSection}>
            <div className={styles.logoBlock}>
              <img src="/img/logo.svg" alt="logo" />
              <h2>ТИТАН</h2>
            </div>
            <div className={styles.contactInfo}>
              <p className={styles.label}>Адрес:</p>
              <p>г. Оренбург</p>
              <p>ул. Берёзка 2/5, 2 этаж</p>
              <p className={styles.phone}>Тел: +7 (3532) 37-68-37</p>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.helpSection}>
            <h3>Нужна помощь?</h3>
            <p>
              Мы здесь, чтобы ответить на ваши вопросы.
              <br />
              Свяжитесь с нами удобным для вас способом,
              <br />и мы постараемся ответить как можно скорее.
            </p>
            <div className={styles.form}>
              <Button type="button" onClick={() => setIsFeedbackOpen(true)}>
                Написать
              </Button>
            </div>
          </div>
          <div className={styles.divider}></div>

          <div className={styles.navSection}>
            <Link to="/catalog">Каталог</Link>
            <Link to="/services">Услуги</Link>
            <Link to="/about">О нас</Link>
            <Link to="/contacts">Контакты</Link>
            <Link to="/privacy">Политика конфиденциальности</Link>
          </div>
        </div>

        <div className={styles.copyright}>
          © ООО «Титан» ОГРН 1165835070983 ИНН 5836679828
        </div>
      </div>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </footer>
  );
}
