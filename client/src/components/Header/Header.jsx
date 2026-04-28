import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserCircle } from "lucide-react";
import styles from "./Header.module.css";
import AuthModal from "../AuthModal/AuthModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import CartModal from "../CartModal/CartModal";
import { useAuth } from "../../contexts/AuthContext";
import { getCart } from "../../api/cart";

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, login, register, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setIsAuthModalOpen(false);
  };

  const closeModals = () => {
    setIsAuthModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      openAuthModal();
    }
  };

  const handleCartClick = () => {
    if (isAuthenticated) {
      setIsCartModalOpen(true);
    } else {
      openAuthModal();
    }
  };

  const updateCartCount = async () => {
    if (isAuthenticated && user?.role !== "admin") {
      try {
        const data = await getCart();
        setCartCount(data.count);
      } catch (error) {
        console.error("Ошибка загрузки корзины:", error);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, [isAuthenticated]);

  useEffect(() => {
    // Слушаем событие обновления корзины
    const handleCartUpdate = (event) => {
      setCartCount(event.detail);
    };
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <div className="container">
      {isMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
      <div className={styles.header}>
        <Link to="/" className={styles.logo_section}>
          <img src="/img/logo.svg" alt="logo" />
          <h1>Титан</h1>
        </Link>

        <button
          className={styles.burgerButton}
          onClick={toggleMenu}
          aria-label="Меню"
        >
          <span className={isMenuOpen ? styles.burgerOpen : ""}></span>
          <span className={isMenuOpen ? styles.burgerOpen : ""}></span>
          <span className={isMenuOpen ? styles.burgerOpen : ""}></span>
        </button>

        <div
          className={`${styles.navbar} ${isMenuOpen ? styles.navbarOpen : ""}`}
        >
          <div className={styles.nav_section}>
            <Link to="/catalog" onClick={() => setIsMenuOpen(false)}>
              Каталог
            </Link>
            <Link to="/services" onClick={() => setIsMenuOpen(false)}>
              Услуги
            </Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>
              О нас
            </Link>
            <Link to="/contacts" onClick={() => setIsMenuOpen(false)}>
              Контакты
            </Link>
          </div>

          <div className={styles.icons_section}>
            <UserCircle
              size={32}
              color="#ffffff"
              strokeWidth={1.2}
              onClick={handleUserIconClick}
              style={{ cursor: "pointer" }}
            />
            {user?.role !== "admin" && (
              <div
                className={styles.cartWrapper}
                onClick={handleCartClick}
                style={{ cursor: "pointer" }}
              >
                <img src="/img/cart.svg" alt="cart" />
                {cartCount > 0 && (
                  <span className={styles.cartBadge}>{cartCount}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.stripe}></div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeModals}
        onSwitchToRegister={openRegisterModal}
        onLogin={login}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={closeModals}
        onSwitchToLogin={openAuthModal}
        onRegister={register}
      />
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        onCartUpdate={setCartCount}
      />
    </div>
  );
}
