import axiosInstance from "./axios";
import { setCookie, getCookie, deleteCookie } from "../utils/cookies";

const API_URL = "/auth";

// Регистрация
export const register = async (userData) => {
  console.log("API register call:", userData);
  const response = await axiosInstance.post(`${API_URL}/register`, userData);
  console.log("API register response:", response.data);
  if (response.data.access_token) {
    setCookie("token", response.data.access_token, 7);
    setCookie("user", JSON.stringify(response.data.user), 7);
    console.log("Token saved to cookies");
  }
  return response.data;
};

// Вход
export const login = async (credentials) => {
  console.log("API login call:", credentials);
  const response = await axiosInstance.post(`${API_URL}/login`, credentials);
  console.log("API login response:", response.data);
  if (response.data.access_token) {
    setCookie("token", response.data.access_token, 7);
    setCookie("user", JSON.stringify(response.data.user), 7);
    console.log("Token saved to cookies");
  }
  return response.data;
};

// Выход
export const logout = () => {
  deleteCookie("token");
  deleteCookie("user");
};

// Получить текущего пользователя
export const getCurrentUser = () => {
  const userStr = getCookie("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Получить токен
export const getToken = () => {
  return getCookie("token");
};

// Проверка авторизации
export const isAuthenticated = () => {
  return !!getToken();
};
