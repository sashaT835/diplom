import { useState, useMemo } from "react";
import { IoSearch } from "react-icons/io5";
import ProductCard from "../ProductCard/ProductCard";
import ProductModal from "../../../../components/ProductModal/ProductModal";
import { useProducts } from "../../../../hooks/useProducts";
import { getCart } from "../../../../api/cart";
import { useAuth } from "../../../../contexts/AuthContext";
import styles from "./CatalogContent.module.css";

const categories = [
  "Бухгалтерский учет",
  "Торговый учет",
  "Кадровый учет",
  "ERP системы",
  "Делопроизводство",
  "CRM системы",
  "Услуги",
];

const priceRanges = [
  { label: "1.000 - 10.000 руб", min: 1000, max: 10000 },
  { label: "10.000 - 50.000 руб", min: 10000, max: 50000 },
  { label: "50.000 - 100.000 руб", min: 50000, max: 100000 },
  { label: "100.000 - 200.000 руб", min: 100000, max: 200000 },
];

export default function CatalogContent() {
  const { products, loading, error } = useProducts();
  const { isAuthenticated } = useAuth();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateCartCount = async () => {
    // Обновление счетчика корзины в Header
    if (isAuthenticated) {
      try {
        const data = await getCart();
        // Триггерим событие для обновления Header
        window.dispatchEvent(
          new CustomEvent("cartUpdated", { detail: data.count })
        );
      } catch (error) {
        console.error("Ошибка загрузки корзины:", error);
      }
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRanges((prev) => {
      const rangeString = `${range.min}-${range.max}`;
      return prev.includes(rangeString)
        ? prev.filter((r) => r !== rangeString)
        : [...prev, rangeString];
    });
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Фильтр по категориям
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category)
      ) {
        return false;
      }

      // Фильтр по цене
      if (selectedPriceRanges.length > 0) {
        const inPriceRange = selectedPriceRanges.some((range) => {
          const [min, max] = range.split("-").map(Number);
          return product.price >= min && product.price <= max;
        });
        if (!inPriceRange) return false;
      }

      // Фильтр по поиску
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [products, selectedCategories, selectedPriceRanges, searchQuery]);

  return (
    <div className={styles.catalogContent}>
      <div className="container">
        <div className={styles.breadcrumbs}>
          <span>Главная</span> &gt;{" "}
          <span className={styles.active}>Каталог</span>
        </div>

        <h1 className={styles.title}>Каталог</h1>

        <div className={styles.layout}>
          {/* Фильтры */}
          <aside className={styles.filters}>
            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Категории</h3>
              {categories.map((category) => (
                <label key={category} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>

            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Цена</h3>
              {priceRanges.map((range) => (
                <label key={range.label} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={selectedPriceRanges.includes(
                      `${range.min}-${range.max}`
                    )}
                    onChange={() => handlePriceRangeChange(range)}
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
          </aside>

          {/* Товары */}
          <div className={styles.productsWrapper}>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="Найти продукт"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button className={styles.searchButton}>
                <IoSearch />
              </button>
            </div>

            <p className={styles.resultsCount}>
              Отображается 1-12 из {filteredProducts.length} элементов
            </p>
            <p className={styles.subtitle}>Выберите продукты</p>

            {loading ? (
              <div className={styles.loader}>
                <p>Загрузка товаров...</p>
              </div>
            ) : error ? (
              <div className={styles.error}>
                <p>Ошибка: {error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className={styles.noResults}>
                <p>По выбранным фильтрам товары не найдены</p>
                <p className={styles.noResultsHint}>
                  Попробуйте изменить параметры фильтрации
                </p>
              </div>
            ) : (
              <div className={styles.productsGrid}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCartUpdate={updateCartCount}
      />
    </div>
  );
}
