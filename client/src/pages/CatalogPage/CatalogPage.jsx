import Footer from "../../components/Footer/Footer";
import HeroSection from "./components/HeroSection/HeroSection";
import CatalogContent from "./components/CatalogContent/CatalogContent";
import styles from "./CatalogPage.module.css";

export default function CatalogPage() {
  return (
    <div className={styles.catalogPage}>
      <main>
        <HeroSection />
        <CatalogContent />
      </main>
      <Footer />
    </div>
  );
}
