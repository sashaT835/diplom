import { useState } from "react";
import Header from "../../../../components/Header/Header";
import Button from "../../../../components/Button/Button";
import RequestModal from "../../../../components/RequestModal/RequestModal";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerWrapper}>
        <Header />
      </div>
      <div className={styles.heroSection}>
        <div className="container">
          <div className={styles.content}>
            <h1 className={styles.title}>
              Не можете настроить или скачать программу 1С? Оставьте заявку,
              быстро подберем нужное решение.
            </h1>
            <p className={styles.subtitle}>
              Наш эксперт проконсультирует Вас в течение 15 мин в рабочее время.
            </p>
            <div className={styles.buttonWrapper}>
              <Button onClick={() => setIsModalOpen(true)}>Оставить заявку</Button>
            </div>
          </div>
        </div>
      </div>

      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceName="Оставить заявку"
      />
    </div>
  );
}
