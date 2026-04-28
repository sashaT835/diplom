import axiosInstance from "./axios";

export const getAllUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

export const changeUserRole = async (userId, role) => {
  const response = await axiosInstance.patch(`/users/${userId}/role`, { role });
  return response.data;
};

export const getUserPurchases = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}/purchases`);
  return response.data;
};
