import Footer from "../../components/Footer/Footer";
import HeroSection from "./components/HeroSection/HeroSection";
import ServicesContent from "./components/ServicesContent/ServicesContent";
import ServicesInfo from "./components/ServicesInfo/ServicesInfo";
import styles from "./ServicesPage.module.css";

export default function ServicesPage() {
  return (
    <div className={styles.servicesPage}>
      <main>
        <HeroSection />
        <ServicesContent />
        <ServicesInfo />
      </main>
      <Footer />
    </div>
  );
}
