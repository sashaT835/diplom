import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axios";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/products");
      setProducts(response.data);
    } catch (err) {
      setError(err.message || "Ошибка при загрузке продуктов");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};
