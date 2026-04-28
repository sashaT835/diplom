import api from "./axios";

// Инкрементировать счётчик просмотров товара
export const incrementProductView = async (productId) => {
  const response = await api.post(`/products/${productId}/view`);
  return response.data;
};

// Получить топ популярных товаров
export const getPopularProducts = async (limit = 10) => {
  const response = await api.get(`/products/popular?limit=${limit}`);
  return response.data;
};

// Получить статистику конкретного товара (только для админа)
export const getProductStats = async (productId) => {
  const response = await api.get(`/products/${productId}/stats`);
  return response.data;
};

// Получить полную аналитику (только для админа)
export const getAnalytics = async () => {
  const response = await api.get("/products/analytics");
  return response.data;
};

// Записать покупки из корзины при оформлении заказа
export const checkoutProducts = async () => {
  const response = await api.post("/products/checkout");
  return response.data;
};
