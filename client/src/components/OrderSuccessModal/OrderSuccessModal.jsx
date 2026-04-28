import { CircleCheck } from "lucide-react";
import styles from "./OrderSuccessModal.module.css";

export default function OrderSuccessModal({ isOpen, onClose, orderData }) {
  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconWrapper}>
          <CircleCheck size={48} color="#4ade80" strokeWidth={1.5} />
        </div>

        <h1 className={styles.title}>Заказ оформлен</h1>
        <p className={styles.subtitle}>
          Спасибо за покупку! Мы свяжемся с вами для подтверждения.
        </p>

        <div className={styles.infoBlock}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Заказ</span>
            <span className={styles.value}>#{orderData.orderId}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Дата</span>
            <span className={styles.value}>{currentDate}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Покупатель</span>
            <span className={styles.value}>{orderData.name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Телефон</span>
            <span className={styles.value}>{orderData.phone}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{orderData.email}</span>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.label}>Итого</span>
            <span className={styles.totalValue}>
              {orderData.total.toLocaleString("ru-RU")} ₽
            </span>
          </div>
        </div>

        <button className={styles.closeButton} onClick={onClose}>
          На главную
        </button>
      </div>
    </div>
  );
}
