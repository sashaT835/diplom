import {useState, useEffect, useRef} from "react";
import {useAuth} from "../../contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import {
    getMyChat, getAdminChats, getConversation, sendMessage, markAsRead,
} from "../../api/messages";
import {getToken} from "../../api/auth";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import realtimeService from "../../services/realtimeService";
import {RealtimeTopics} from "../../services/realtimeTopics";
import toast from "react-hot-toast";
import styles from "./ChatPage.module.css";

const appendUniqueMessage = (messages, message) => {
    if (!message?.id) {
        return messages;
    }

    if (messages.some((item) => item.id === message.id)) {
        return messages;
    }

    return [...messages, message];
};

export default function ChatPage() {
    const {user} = useAuth();
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
            setChats((prev) => prev.map((chat) => chat.user.id === userId ? {...chat, unreadCount: 0} : chat));
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
            const receiverId = user.role === "admin" ? selectedUserId : chatPartner?.id;
            if (!receiverId) {
                toast.error("Получатель не найден");
                return;
            }

            const message = await sendMessage(receiverId, newMessage);
            setMessages((prev) => appendUniqueMessage(prev, message));
            setNewMessage("");
        } catch (error) {
            toast.error("Ошибка при отправке сообщения");
            console.error(error);
        }
    };

    // Realtime подписки
    useEffect(() => {
        const token = getToken();
        if (!token || !user) {
            return undefined;
        }

        realtimeService.connect(token);

        const unsubMessage = realtimeService.subscribe(RealtimeTopics.CHAT_MESSAGE_CREATED, async (message) => {
            if (!message || !message.senderId || !message.receiverId) {
                return;
            }

            if (user.role === "admin") {
                setChats((prev) => prev.map((chat) => {
                    const isRelated = chat.user.id === message.senderId || chat.user.id === message.receiverId;

                    if (!isRelated) {
                        return chat;
                    }

                    const shouldIncreaseUnread = message.receiverId === user.id && chat.user.id === message.senderId && selectedUserId !== chat.user.id;

                    return {
                        ...chat,
                        lastMessage: message,
                        unreadCount: shouldIncreaseUnread ? chat.unreadCount + 1 : chat.unreadCount,
                    };
                }));

                const isForOpenedConversation = selectedUserId && ((message.senderId === selectedUserId && message.receiverId === user.id) || (message.senderId === user.id && message.receiverId === selectedUserId));

                if (isForOpenedConversation) {
                    setMessages((prev) => appendUniqueMessage(prev, message));

                    if (message.senderId === selectedUserId) {
                        await markAsRead(selectedUserId);
                    }
                }
                return;
            }

            const partnerId = chatPartner?.id;
            if (!partnerId) {
                return;
            }

            const isForCurrentConversation = (message.senderId === user.id && message.receiverId === partnerId) || (message.senderId === partnerId && message.receiverId === user.id);

            if (isForCurrentConversation) {
                setMessages((prev) => appendUniqueMessage(prev, message));
                if (message.senderId === partnerId) {
                    await markAsRead(partnerId);
                }
            }
        });

        const unsubConversationChanged = realtimeService.subscribe(RealtimeTopics.CHAT_CONVERSATION_UPDATED, async () => {
            if (user.role === "admin") {
                try {
                    const data = await getAdminChats();
                    setChats(data);
                } catch (error) {
                    console.error("Ошибка обновления списка чатов:", error);
                }
            }
        });

        return () => {
            unsubMessage();
            unsubConversationChanged();
        };
    }, [chatPartner?.id, selectedUserId, user]);

    if (loading) {
        return (<div className={styles.container}>
                <Header/>
                <main className={styles.main}>
                    <div className={styles.loading}>Загрузка...</div>
                </main>
                <Footer/>
            </div>);
    }

    return (<div className={styles.page}>
            <div className={styles.headerBg}>
                <Header/>
            </div>
            <div className={styles.container}>
                <div className={styles.breadcrumbs}>
                    <a href="/profile">Профиль</a>
                    <span>/</span>
                    <span className={styles.active}>Чат с поддержкой</span>
                </div>
            </div>
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

                    {user.role === "admin" ? (// Интерфейс для админа
                        <div className={styles.adminLayout}>
                            <div className={styles.chatsList}>
                                <h2>Чаты пользователей</h2>
                                {chats.length === 0 ? (
                                    <p className={styles.emptyMessage}>Нет активных чатов</p>) : (chats.map((chat) => (
                                        <div
                                            key={chat.user.id}
                                            className={`${styles.chatItem} ${selectedUserId === chat.user.id ? styles.active : ""}`}
                                            onClick={() => loadConversation(chat.user.id)}
                                        >
                                            <div className={styles.chatItemInfo}>
                                                <strong>
                                                    {chat.user.firstName.substring(0, 50) || chat.user.email.substring(0, 50)}
                                                </strong>
                                                <p className={styles.lastMessage}>
                                                    {chat.lastMessage.content.substring(0, 50)}...
                                                </p>
                                            </div>
                                            {chat.unreadCount > 0 && (<span className={styles.unreadBadge}>
                          {chat.unreadCount}
                        </span>)}
                                        </div>)))}
                            </div>

                            <div className={styles.messagesArea}>
                                {selectedUserId ? (<>
                                        <div className={styles.chatHeader}>
                                            <h3>{chatPartner?.firstName || chatPartner?.email}</h3>
                                        </div>
                                        <div className={styles.messagesContainer}>
                                            {messages.map((msg) => (<div
                                                    key={msg.id}
                                                    className={`${styles.message} ${msg.senderId === user.id ? styles.myMessage : styles.theirMessage}`}
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
                                                </div>))}
                                            <div ref={messagesEndRef}/>
                                        </div>
                                        <form className={styles.inputForm} onSubmit={handleSend}>
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Введите сообщение..."
                                                className={styles.messageInput}
                                            />
                                            <button type="submit" className={styles.sendButton} aria-label="Отправить">
                                                <span className={styles.sendButtonText}>Отправить</span>
                                                <span className={styles.sendButtonIcon} aria-hidden="true">➤</span>
                                            </button>
                                        </form>
                                    </>) : (<div className={styles.selectChatPrompt}>
                                        Выберите чат для начала общения
                                    </div>)}
                            </div>
                        </div>) : (// Интерфейс для пользователя
                        <div className={styles.userChat}>
                            {chatPartner && (<div className={styles.chatHeader}>
                                    <h3>Администратор</h3>
                                </div>)}
                            <div className={styles.messagesContainer}>
                                {messages.length === 0 ? (<p className={styles.emptyMessage}>
                                        Нет сообщений. Начните диалог!
                                    </p>) : (messages.map((msg) => (<div
                                            key={msg.id}
                                            className={`${styles.message} ${msg.senderId === user.id ? styles.myMessage : styles.theirMessage}`}
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
                                        </div>)))}
                                <div ref={messagesEndRef}/>
                            </div>
                            <form className={styles.inputForm} onSubmit={handleSend}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Введите сообщение..."
                                    className={styles.messageInput}
                                />
                                <button type="submit" className={styles.sendButton} aria-label="Отправить">
                                    <span className={styles.sendButtonText}>Отправить</span>
                                    <span className={styles.sendButtonIcon} aria-hidden="true">➤</span>
                                </button>
                            </form>
                        </div>)}
                </div>
            </main>
            <Footer/>
        </div>);
}
