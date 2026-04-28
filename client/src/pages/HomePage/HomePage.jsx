import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import InfoSection from "./components/InfoSection/InfoSection";
import MainSection from "./components/MainSection/MainSection";
import PopularProduct from "./components/PopularProduct/PopularProduct";
import VideoBlock from "./components/VideoBlock/VideoBlock";
import ContactSection from "./components/ContactSection/ContactSection";

import styles from "./HomePage.module.css";
export default function HomePage() {
  return (
    <div className={styles.homePage}>
      <MainSection />
      <PopularProduct />
      <InfoSection />
      <VideoBlock />
      <ContactSection />
      <Footer />
    </div>
  );
}
