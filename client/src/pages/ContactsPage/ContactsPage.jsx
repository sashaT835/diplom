import Footer from "../../components/Footer/Footer";
import MainSection from "../HomePage/components/MainSection/MainSection";
import ContactsContent from "./components/ContactsContent/ContactsContent";
import styles from "./ContactsPage.module.css";

export default function ContactsPage() {
  return (
    <div className={styles.contactsPage}>
      <main>
        <MainSection
          title="Как нас найти"
          subtitle="Приезжайте знакомиться, звоните или пишите. Мы всегда открыты к диалогу и новым проектам."
          showButton={false}
        />
        <ContactsContent />
      </main>
      <Footer />
    </div>
  );
}
