import styles from "./ContactSection.module.css";

export default function ContactSection() {
  return (
    <div className={styles.contactSection}>
      <div className="container">
        <div className={styles.contentWrapper}>
          <div className={styles.contactInfo}>
            <h2>Контакты</h2>
            <div className={styles.contactBlock}>
              <p className={styles.label}>ФАКТИЧЕСКИЙ АДРЕС</p>
              <h3>+7 (3532) 37-68-37</h3>
              <p>г. Оренбург, ул. Берёзка, 2/5</p>
            </div>
            <div className={styles.contactBlock}>
              <p className={styles.label}>ЛИНИЯ КОНСУЛЬТАЦИИ</p>
              <h3>+7 (3532) 37-62-43</h3>
            </div>
          </div>
          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2465.9901282875585!2d55.123374999999996!3d51.8246108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x417bf690e23293eb%3A0x87d6d01fd726dd82!2z0YPQuy4g0JHQtdGA0LXQt9C60LAsIDIvNSwg0J7RgNC10L3QsdGD0YDQsywg0J7RgNC10L3QsdGD0YDQs9GB0LrQsNGPINC-0LHQuy4sIDQ2MDA0NA!5e0!3m2!1sru!2sru!4v1775022946332!5m2!1sru!2sru"
              className={styles.map}
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
