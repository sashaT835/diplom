import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getMyChat,
  getAdminChats,
  getConversation,
  sendMessage,
  markAsRead,
} from "../../api/messages";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import toast from "react-hot-toast";
import styles from "./ChatPage.module.css";

export default function ChatPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatPartner, setChatPartner] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const messagesEndRef = useRef(null);

  // Загрузить чаты
  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoading(true);
        if (user.role === "admin") {
          const data = await getAdminChats();
          setChats(data);
        } else {
          const data = await getMyChat();
          setChatPartner(data.admin);
          setMessages(data.messages);
          if (data.admin) {
            await markAsRead(data.admin.id);
          }
        }
      } catch (error) {
        toast.error("Ошибка при загрузке чатов");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [user]);

  // Загрузить переписку с конкретным пользователем (для админа)
  const loadConversation = async (userId) => {
    try {
      setSelectedUserId(userId);
      const data = await getConversation(userId);
      setMessages(data);
      const selectedChat = chats.find((chat) => chat.user.id === userId);
      if (selectedChat) {
        setChatPartner(selectedChat.user);
      }
      await markAsRead(userId);
      // Обновляем счетчик непрочитанных
      setChats((prev) =>
        prev.map((chat) =>
          chat.user.id === userId ? { ...chat, unreadCount: 0 } : chat
        )
      );
    } catch (error) {
      toast.error("Ошибка при загрузке сообщений");
      console.error(error);
    }
  };

  // Отправить сообщение
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const receiverId =
        user.role === "admin" ? selectedUserId : chatPartner?.id;
      if (!receiverId) {
        toast.error("Получатель не найден");
        return;
      }

      const message = await sendMessage(receiverId, newMessage);
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    } catch (error) {
      toast.error("Ошибка при отправке сообщения");
      console.error(error);
    }
  };

  // Автообновление (polling)
  useEffect(() => {
    if (!chatPartner && user.role !== "admin") return;

    const interval = setInterval(async () => {
      try {
        if (user.role === "admin" && selectedUserId) {
          const data = await getConversation(selectedUserId);
          setMessages(data);
        } else if (user.role !== "admin" && chatPartner) {
          const data = await getMyChat();
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Ошибка автообновления:", error);
      }
    }, 3000); // Обновление каждые 3 секунды

    return () => clearInterval(interval);
  }, [chatPartner, selectedUserId, user.role]);

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className={styles.loading}>Загрузка...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.chatContainer}>
          <div className={styles.chatHeaderBar}>
            <h1>Чат с поддержкой</h1>
            <button
              className={styles.backButton}
              onClick={() => navigate("/profile")}
            >
              ← Вернуться в профиль
            </button>
          </div>

          {user.role === "admin" ? (
            // Интерфейс для админа
            <div className={styles.adminLayout}>
              <div className={styles.chatsList}>
                <h2>Чаты пользователей</h2>
                {chats.length === 0 ? (
                  <p className={styles.emptyMessage}>Нет активных чатов</p>
                ) : (
                  chats.map((chat) => (
                    <div
                      key={chat.user.id}
                      className={`${styles.chatItem} ${
                        selectedUserId === chat.user.id ? styles.active : ""
                      }`}
                      onClick={() => loadConversation(chat.user.id)}
                    >
                      <div className={styles.chatItemInfo}>
                        <strong>
                          {chat.user.firstName || chat.user.email}
                        </strong>
                        <p className={styles.lastMessage}>
                          {chat.lastMessage.content.substring(0, 50)}...
                        </p>
                      </div>
                      {chat.unreadCount > 0 && (
                        <span className={styles.unreadBadge}>
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className={styles.messagesArea}>
                {selectedUserId ? (
                  <>
                    <div className={styles.chatHeader}>
                      <h3>{chatPartner?.firstName || chatPartner?.email}</h3>
                    </div>
                    <div className={styles.messagesContainer}>
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`${styles.message} ${
                            msg.senderId === user.id
                              ? styles.myMessage
                              : styles.theirMessage
                          }`}
                        >
                          <div className={styles.messageContent}>
                            {msg.content}
                          </div>
                          <div className={styles.messageTime}>
                            {new Date(msg.createdAt).toLocaleString("ru-RU", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                    <form className={styles.inputForm} onSubmit={handleSend}>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Введите сообщение..."
                        className={styles.messageInput}
                      />
                      <button type="submit" className={styles.sendButton}>
                        Отправить
                      </button>
                    </form>
                  </>
                ) : (
                  <div className={styles.selectChatPrompt}>
                    Выберите чат для начала общения
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Интерфейс для пользователя
            <div className={styles.userChat}>
              {chatPartner && (
                <div className={styles.chatHeader}>
                  <h3>Администратор</h3>
                </div>
              )}
              <div className={styles.messagesContainer}>
                {messages.length === 0 ? (
                  <p className={styles.emptyMessage}>
                    Нет сообщений. Начните диалог!
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`${styles.message} ${
                        msg.senderId === user.id
                          ? styles.myMessage
                          : styles.theirMessage
                      }`}
                    >
                      <div className={styles.messageContent}>{msg.content}</div>
                      <div className={styles.messageTime}>
                        {new Date(msg.createdAt).toLocaleString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <form className={styles.inputForm} onSubmit={handleSend}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Введите сообщение..."
                  className={styles.messageInput}
                />
                <button type="submit" className={styles.sendButton}>
                  Отправить
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
