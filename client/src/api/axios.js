import axios from "axios";
import { getToken } from "./auth";
import { API_BASE_URL } from "../config/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Добавляем токен к каждому запросу
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Обработка ошибок авторизации
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Если токен невалидный, удаляем его
      const { deleteCookie } = require("../utils/cookies");
      deleteCookie("token");
      deleteCookie("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
