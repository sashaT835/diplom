import { useState } from "react";
import styles from "./PopularProduct.module.css";
import ProductCard from "./ProductCard";
import ProductModal from "../../../../components/ProductModal/ProductModal";
import { useProducts } from "../../../../hooks/useProducts";

export default function PopularProduct() {
  const { products, loading, error } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className={styles.popularProduct}>
      <div className="container">
        <h2 className={styles.title}>Популярные продукты</h2>

        {loading ? (
          <div className={styles.loader}>
            <p>Загрузка товаров...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>Ошибка: {error}</p>
          </div>
        ) : (
          <div className={styles.card_container}>
            {products.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                image={product.image}
                title={product.name}
                price={`${product.price.toLocaleString("ru-RU")} ₽`}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        )}
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
