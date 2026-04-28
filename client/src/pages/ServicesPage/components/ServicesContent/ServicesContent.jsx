import { useState } from "react";
import { useServices } from "../../../../hooks/useServices";
import RequestModal from "../../../../components/RequestModal/RequestModal";
import styles from "./ServicesContent.module.css";

export default function ServicesContent() {
  const { services, loading, error } = useServices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleLeaveRequest = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className="container">
          <p className={styles.loading}>Загрузка услуг...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className="container">
          <p className={styles.error}>Ошибка загрузки услуг: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className="container">
        <div className={styles.breadcrumbs}>
          <span>Главная</span> &gt;{" "}
          <span className={styles.active}>Услуги</span>
        </div>

        <h1 className={styles.title}>Услуги</h1>

        <div className={styles.servicesGrid}>
          {services.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              <div className={styles.imageWrapper}>
                <img
                  src="/img/1papka.png"
                  alt={service.name}
                  className={styles.serviceImage}
                />
              </div>

              <div className={styles.content}>
                <h2 className={styles.serviceName}>{service.name}</h2>
                <p className={styles.price}>
                  ~ {service.price.toLocaleString("ru-RU")} ₽
                </p>
                <p className={styles.description}>{service.description}</p>
                <button
                  className={styles.requestButton}
                  onClick={() => handleLeaveRequest(service)}
                >
                  Оставить заявку
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RequestModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        serviceName={selectedService?.name}
      />
    </div>
  );
}
