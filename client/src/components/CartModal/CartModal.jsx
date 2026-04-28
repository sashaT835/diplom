import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./CartModal.module.css";
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from "../../api/cart";

function CartModal({ isOpen, onClose, onCartUpdate }) {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState({ items: [], total: 0, count: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCartData(data);
      if (onCartUpdate) {
        onCartUpdate(data.count);
      }
    } catch (error) {
      console.error("Ошибка загрузки корзины:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      await updateCartItemQuantity(itemId, newQuantity);
      await loadCart();
    } catch (error) {
      console.error("Ошибка обновления количества:", error);
      toast.error("Ошибка обновления количества");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      await loadCart();
      toast.success("Товар удален из корзины");
    } catch (error) {
      console.error("Ошибка удаления товара:", error);
      toast.error("Ошибка удаления товара");
    }
  };

  const handleClearCart = async () => {
    toast(
      (t) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span>Вы уверены, что хотите очистить корзину?</span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await clearCart();
                  await loadCart();
                  toast.success("Корзина очищена");
                } catch (error) {
                  console.error("Ошибка очистки корзины:", error);
                  toast.error("Ошибка очистки корзины");
                }
              }}
              style={{
                padding: "8px 16px",
                background: "#f14f4f",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontFamily: "Intro, sans-serif",
              }}
            >
              Да
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                padding: "8px 16px",
                background: "#6b5eb5",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontFamily: "Intro, sans-serif",
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
      }
    );
  };

  const handleCheckout = () => {
    if (cartData.items.length === 0) {
      toast.error("Корзина пуста");
      return;
    }
    onClose();
    navigate("/checkout");
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Корзина</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.emptyCart}>Загрузка...</div>
          ) : cartData.items.length === 0 ? (
            <div className={styles.emptyCart}>Корзина пуста</div>
          ) : (
            <div className={styles.cartItems}>
              {cartData.items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <img
                    src={`http://localhost:3001${item.product.image}`}
                    alt={item.product.name}
                    className={styles.productImage}
                  />
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{item.product.name}</h3>
                    <p className={styles.productPrice}>
                      {(item.product.price * item.quantity).toLocaleString(
                        "ru-RU"
                      )}{" "}
                      ₽
                    </p>
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.quantityButton}
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveItem(item.id)}
                    title="Удалить"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartData.items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalSection}>
              <span className={styles.totalLabel}>Итого:</span>
              <span className={styles.totalAmount}>
                {cartData.total.toLocaleString("ru-RU")} ₽
              </span>
            </div>
            <button className={styles.checkoutButton} onClick={handleCheckout}>
              Оформить заказ
            </button>
            <button className={styles.clearButton} onClick={handleClearCart}>
              Очистить корзину
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartModal;
