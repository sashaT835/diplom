import api from "./axios";

// Отправить сообщение
export const sendMessage = async (receiverId, content) => {
  const response = await api.post("/messages", {
    receiverId,
    content,
  });
  return response.data;
};

// Получить чат пользователя с админом
export const getMyChat = async () => {
  const response = await api.get("/messages/my-chat");
  return response.data;
};

// Получить все чаты для админа
export const getAdminChats = async () => {
  const response = await api.get("/messages/admin/chats");
  return response.data;
};

// Получить переписку с конкретным пользователем
export const getConversation = async (userId) => {
  const response = await api.get(`/messages/conversation/${userId}`);
  return response.data;
};

// Отметить сообщения как прочитанные
export const markAsRead = async (userId) => {
  const response = await api.patch(`/messages/mark-read/${userId}`);
  return response.data;
};

// Получить количество непрочитанных сообщений
export const getUnreadCount = async () => {
  const response = await api.get("/messages/unread-count");
  return response.data;
};
