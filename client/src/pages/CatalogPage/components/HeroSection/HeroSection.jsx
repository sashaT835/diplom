import Header from "../../../../components/Header/Header";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerWrapper}>
        <Header />
      </div>
      <div className={styles.heroSection}>
        <div className="container">
          <div className={styles.content}>
            <h1 className={styles.title}>
              Подберите программу 1С для ваших задач
            </h1>
            <p className={styles.subtitle}>
              Полные версии, отраслевые и стандартные решения – в одном
              каталоге.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
