import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "./ProductModal.module.css";
import { addToCart } from "../../api/cart";
import { incrementProductView } from "../../api/analytics";
import { useAuth } from "../../contexts/AuthContext";

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onCartUpdate,
}) {
  const { isAuthenticated } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Инкрементировать просмотры при открытии модалки
  useEffect(() => {
    if (isOpen && product?.id) {
      incrementProductView(product.id).catch(() => {
        // Ошибку просмотра игнорируем — не критично
      });
    }
  }, [isOpen, product?.id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Войдите в аккаунт для добавления товара в корзину");
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(product.id, 1);
      if (onCartUpdate) {
        onCartUpdate();
      }
      toast.success("Товар добавлен в корзину");
    } catch (error) {
      console.error("Ошибка добавления в корзину:", error);
      toast.error("Ошибка при добавлении товара в корзину");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        <div className={styles.content}>
          <div className={styles.leftSection}>
            <img
              src={product.image}
              alt={product.name}
              className={styles.productImage}
            />
          </div>

          <div className={styles.rightSection}>
            <h2 className={styles.title}>{product.name}</h2>

            {product.category && (
              <p className={styles.category}>{product.category}</p>
            )}

            <p className={styles.price}>
              {product.price.toLocaleString("ru-RU")} ₽
            </p>

            <button
              className={styles.addToCartBtn}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? "Добавление..." : "Добавить в корзину"}
            </button>

            {product.benefits && product.benefits.length > 0 && (
              <div className={styles.features}>
                {product.benefits.map((benefit, index) => (
                  <div key={index} className={styles.feature}>
                    <span className={styles.checkmark}>✓</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.bottomSection}>
          {product.description && (
            <div className={styles.description}>
              <h3>Описание</h3>
              <p>{product.description}</p>
            </div>
          )}

          {product.features && product.features.length > 0 && (
            <div className={styles.functionality}>
              <h3>Функциональные возможности</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
