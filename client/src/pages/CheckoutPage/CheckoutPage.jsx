import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { IoTrashOutline } from "react-icons/io5";
import { Banknote, CreditCard, Globe, Zap } from "lucide-react";
import { getCart, removeFromCart, clearCart } from "../../api/cart";
import { checkoutProducts } from "../../api/analytics";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import OrderSuccessModal from "../../components/OrderSuccessModal/OrderSuccessModal";
import styles from "./CheckoutPage.module.css";
import { API_BASE_URL, resolveAssetUrl } from "../../config/api";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [cartData, setCartData] = useState({ items: [], total: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    paymentMethod: "",
    agreeToPolicy: false,
  });
  const [orderId] = useState(Math.floor(Math.random() * 100000));
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/");
      return;
    }
    if (!isAuthenticated) {
      toast.error("Войдите в аккаунт для оформления заказа");
      navigate("/catalog");
      return;
    }
    loadCart();
  }, [isAuthenticated, navigate]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      if (data.items.length === 0) {
        toast.error("Корзина пуста");
        navigate("/catalog");
        return;
      }
      setCartData(data);
    } catch (error) {
      console.error("Ошибка загрузки корзины:", error);
      toast.error("Ошибка загрузки корзины");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      await loadCart();
      toast.success("Товар удален из заказа");
    } catch (error) {
      console.error("Ошибка удаления товара:", error);
      toast.error("Ошибка удаления товара");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    setFormData((prev) => ({ ...prev, phone: formatPhone(digits) }));
  };

  const handlePhoneKeyDown = (e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const digits = formData.phone.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, phone: formatPhone(digits.slice(0, -1)) }));
    }
  };

  function formatPhone(digits) {
    if (!digits.length) return "";
    const d = digits[0] === "8" ? "7" + digits.slice(1) : digits;
    let m = "+7";
    if (d.length > 1) m += " (" + d.slice(1, 4);
    if (d.length >= 4) m += ") " + d.slice(4, 7);
    if (d.length >= 7) m += "-" + d.slice(7, 9);
    if (d.length >= 9) m += "-" + d.slice(9, 11);
    return m;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Введите ваше имя");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Введите номер телефона");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Введите e-mail");
      return;
    }

    if (!formData.paymentMethod) {
      toast.error("Выберите способ оплаты");
      return;
    }

    if (!formData.agreeToPolicy) {
      toast.error("Необходимо согласие на обработку данных");
      return;
    }

    try {
      // Записываем покупки в аналитику перед очисткой корзины
      await checkoutProducts();

      // Отправляем заказ в Telegram
      const paymentLabels = {
        cash: "Наличными при получении",
        card_terminal: "Картой при получении (терминал)",
        online: "Онлайн-оплата (Visa, Mastercard, Мир)",
        sbp: "СБП (Система быстрых платежей)",
      };
      const itemsList = cartData.items
        .map((item) => `${item.product.name} x${item.quantity} — ${(item.product.price * item.quantity).toLocaleString("ru-RU")} ₽`)
        .join("\n");

      await fetch(`${API_BASE_URL}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          serviceName: `Заказ #${orderId}`,
          comment: `Оплата: ${paymentLabels[formData.paymentMethod]}\nСумма: ${cartData.total.toLocaleString("ru-RU")} ₽\n\nТовары:\n${itemsList}`,
        }),
      });

      // Очищаем корзину
      await clearCart();

      // Сохраняем данные заказа и показываем модалку
      setOrderData({
        orderId: orderId,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        total: cartData.total,
      });
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      toast.error("Ошибка при оформлении заказа");
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    navigate("/");
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.headerBg}>
          <Header />
        </div>
        <div className={styles.container}>
          <div className={styles.loading}>Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerBg}>
        <Header />
      </div>

      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <Link to="/">Главная</Link>
          <span> &gt; </span>
          <span className={styles.active}>Оформление заказа</span>
        </div>

        <h1 className={styles.pageTitle}>Оформление заказа #{orderId}</h1>

        <div className={styles.layout}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Состав заказа</h2>
            <p className={styles.itemsCount}>{cartData.count} товаров</p>

            <div className={styles.orderItems}>
              {cartData.items.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <img
                    src={resolveAssetUrl(item.product.image)}
                    alt={item.product.name}
                    className={styles.productImage}
                  />
                  <div className={styles.productInfo}>
                    <p className={styles.productName}>{item.product.name}</p>
                    <p className={styles.productQty}>{item.quantity} шт.</p>
                    <p className={styles.productPrice}>
                      {(item.product.price * item.quantity).toLocaleString("ru-RU")} ₽
                    </p>
                  </div>
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveItem(item.id)}
                    title="Удалить"
                  >
                    <IoTrashOutline />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.totalSection}>
              <span className={styles.totalLabel}>Итого:</span>
              <span className={styles.totalAmount}>
                {cartData.total.toLocaleString("ru-RU")} ₽
              </span>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Данные покупателя</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Имя</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ваше имя"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Телефон</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+7 (999) 123-45-67"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  onKeyDown={handlePhoneKeyDown}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>E-mail</label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Способ оплаты</label>
                <div className={styles.paymentList}>
                  {[
                    { value: "cash", label: "Наличными при получении", icon: <Banknote size={20} /> },
                    { value: "card_terminal", label: "Картой при получении (терминал)", icon: <CreditCard size={20} /> },
                    { value: "online", label: "Онлайн-оплата (Visa, Mastercard, Мир)", icon: <Globe size={20} /> },
                    { value: "sbp", label: "СБП (Система быстрых платежей)", icon: <Zap size={20} /> },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`${styles.paymentOption} ${formData.paymentMethod === method.value ? styles.paymentOptionActive : ""}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={handleInputChange}
                      />
                      <span className={styles.paymentIcon}>{method.icon}</span>
                      <span>{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  name="agreeToPolicy"
                  checked={formData.agreeToPolicy}
                  onChange={handleInputChange}
                />
                <span>
                  Я даю согласие на обработку персональных данных и соглашаюсь с{" "}
                  <a href="/privacy">Политикой конфиденциальности</a>
                </span>
              </label>

              <button type="submit" className={styles.submitButton}>
                Оформить заказ
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />

      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        orderData={orderData}
      />
    </div>
  );
}
