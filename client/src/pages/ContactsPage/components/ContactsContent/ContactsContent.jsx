import { Link } from "react-router-dom";
import Button from "../../../../components/Button/Button";
import styles from "./ContactsContent.module.css";

export default function ContactsContent() {
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2465.9901282875585!2d55.123374999999996!3d51.8246108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x417bf690e23293eb%3A0x87d6d01fd726dd82!2z0YPQuy4g0JHQtdGA0LXQt9C60LAsIDIvNSwg0J7RgNC10L3QsdGD0YDQsywg0J7RgNC10L3QsdGD0YDQs9GB0LrQsNGPINC-0LHQuy4sIDQ2MDA0NA!5e0!3m2!1sru!2sru!4v1775022946332!5m2!1sru!2sru"
            className={styles.map}
            style={{ border: 0 }}
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
              ООО "Титан" создает полезные для бизнеса решения, будучи настоящим
              партнером - мы строим честные отношения и профессионально подходим
              к каждой задаче. Стремясь быть лучшими и первыми, мы предлагаем
              индивидуальные подходы для достижения ваших амбициозных целей.
              Получите замечательное от решения результаты совместной работы.
            </p>

            <h2 className={styles.formTitle}>Обратная связь</h2>

            <form className={styles.form}>
              <div className={styles.formGrid}>
                <textarea
                  className={styles.textarea}
                  placeholder="Сообщение"
                  rows="4"
                ></textarea>
                <input type="text" className={styles.input} placeholder="Имя" />
              </div>

              <input
                type="email"
                className={styles.input}
                placeholder="Email"
              />
              <input
                type="tel"
                className={styles.input}
                placeholder="Телефон"
              />

              <div className={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  id="agreement"
                  className={styles.checkbox}
                />
                <label htmlFor="agreement" className={styles.checkboxLabel}>
                  Я даю согласие на обработку моих персональных данных и
                  соглашаюсь с{" "}
                  <a href="/privacy" style={{ color: "var(--color-accent)", textDecoration: "underline" }}>
                    Политикой конфиденциальности
                  </a>
                </label>
              </div>

              <Button type="submit">Отправить</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
