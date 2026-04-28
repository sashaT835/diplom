import styles from "./ProductCard.module.css";

export default function ProductCard({ image, title, price, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>
      <img src={image} alt={title} />
      <p>{title}</p>
      <h2>{price}</h2>
    </div>
  );
}
