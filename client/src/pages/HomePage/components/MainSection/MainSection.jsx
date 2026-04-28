import Header from "../../../../components/Header/Header";
import Button from "../../../../components/Button/Button";
import styles from "./MainSection.module.css";

export default function MainSection({
  title = "Готовые 1C решения для вашего бизнеса",
  subtitle = "Мы делаем бизнес клиента сильнее и создаем возможности для успешного развития с помощью IT-технологий",
  showButton = true,
}) {
  return (
    <>
      <Header />
      <div className={styles.mainSection}>
        <div className="container">
          <img className={styles.background} src="/img/logo.svg" alt="logo" />
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          {showButton && <Button>Перейти к покупкам</Button>}
        </div>
      </div>
    </>
  );
}
