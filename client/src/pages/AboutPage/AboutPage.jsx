import Footer from "../../components/Footer/Footer";
import AboutContent from "./components/AboutContent/AboutContent";
import styles from "./AboutPage.module.css";
import ContactSection from "../HomePage/components/ContactSection/ContactSection";
import MainSection from "../HomePage/components/MainSection/MainSection";

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <main>
        <MainSection
          title="Кто мы и зачем мы вам нужны"
          subtitle="С 2018 года мы помогаем компаниям расти за счет грамотной автоматизации. Мы не просто продаем софт — мы строим эффективные бизнес-системы."
          showButton={false}
        />
        <AboutContent />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
