import axiosInstance from "./axios";
import { setCookie } from "../utils/cookies";

const API_URL = "/users";

// Получить профиль
export const getProfile = async () => {
  const response = await axiosInstance.get(`${API_URL}/profile`);
  // Обновляем данные пользователя в cookies
  setCookie("user", JSON.stringify(response.data), 7);
  return response.data;
};

// Обновить профиль
export const updateProfile = async (userData) => {
  const response = await axiosInstance.put(`${API_URL}/profile`, userData);
  // Обновляем данные пользователя в cookies
  setCookie("user", JSON.stringify(response.data), 7);
  return response.data;
};
