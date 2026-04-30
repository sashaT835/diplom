import { useState, useEffect } from "react";
import {
  getAllUsers,
  changeUserRole,
  getUserPurchases,
} from "../../../api/admin";
import toast from "react-hot-toast";
import styles from "./UsersTab.module.css";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [purchasesLoading, setPurchasesLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      toast.error("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const action =
      newRole === "admin"
        ? "назначить администратором"
        : "снять роль администратора";

    if (!window.confirm(`Вы уверены, что хотите ${action}?`)) return;

    try {
      await changeUserRole(userId, newRole);
      toast.success(
        newRole === "admin"
          ? "Роль администратора назначена"
          : "Роль администратора снята",
      );
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Ошибка изменения роли");
    }
  };

  const openUserDetails = async (user) => {
    setSelectedUser(user);
    setPurchasesLoading(true);
    try {
      const data = await getUserPurchases(user.id);
      setPurchases(data);
    } catch {
      toast.error("Ошибка загрузки товаров");
      setPurchases([]);
    } finally {
      setPurchasesLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setPurchases([]);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  if (loading) {
    return <div className={styles.loading}>Загрузка пользователей...</div>;
  }

  return (
    <div className={styles.usersContainer}>
      <div className={styles.summary}>
        <span>
          Всего: <strong>{users.length}</strong>
        </span>
        <span>
          Администраторов:{" "}
          <strong>{users.filter((u) => u.role === "admin").length}</strong>
        </span>
      </div>

      <div className={styles.list}>
        {users.map((user) => (
          <div
            key={user.id}
            className={styles.card}
            onClick={() => openUserDetails(user)}
          >
            <div className={styles.userRow}>
              <div className={styles.avatar}>
                {(user.firstName || user.email)[0].toUpperCase()}
              </div>
              <div className={styles.userInfo}>
                <h3 className={styles.userName}>
                  {user.firstName || ""} {user.lastName || ""}
                  {!user.firstName && !user.lastName && user.email}
                </h3>
                <span className={styles.userEmail}>{user.email}</span>
                <div className={styles.userMeta}>
                  {user.phone && <span>{user.phone}</span>}
                  <span>Товаров: {user.purchaseCount}</span>
                  <span>Регистрация: {formatDate(user.createdAt)}</span>
                </div>
              </div>
              <div className={styles.userActions}>
                <span
                  className={`${styles.roleBadge} ${
                    user.role === "admin" ? styles.roleBadgeAdmin : ""
                  }`}
                >
                  {user.role === "admin" ? "Админ" : "Пользователь"}
                </span>
                <button
                  className={
                    user.role === "admin"
                      ? styles.demoteBtn
                      : styles.promoteBtn
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleChange(user.id, user.role);
                  }}
                >
                  {user.role === "admin"
                    ? "Снять админа"
                    : "Назначить админом"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalAvatar}>
                {(selectedUser.firstName || selectedUser.email)[0].toUpperCase()}
              </div>
              <div>
                <h2 className={styles.modalTitle}>
                  {selectedUser.firstName || ""} {selectedUser.lastName || ""}
                  {!selectedUser.firstName &&
                    !selectedUser.lastName &&
                    selectedUser.email}
                </h2>
                <span className={styles.modalEmail}>{selectedUser.email}</span>
              </div>
            </div>

            <div className={styles.modalInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Роль</span>
                <span
                  className={`${styles.roleBadge} ${
                    selectedUser.role === "admin" ? styles.roleBadgeAdmin : ""
                  }`}
                >
                  {selectedUser.role === "admin" ? "Админ" : "Пользователь"}
                </span>
              </div>
              {selectedUser.phone && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Телефон</span>
                  <span>{selectedUser.phone}</span>
                </div>
              )}
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Регистрация</span>
                <span>{formatDate(selectedUser.createdAt)}</span>
              </div>
            </div>

            <div className={styles.ordersSection}>
              <h3 className={styles.ordersTitle}>
                Товары ({purchasesLoading ? "..." : purchases.length})
              </h3>
              {purchasesLoading ? (
                <p className={styles.ordersLoading}>Загрузка...</p>
              ) : purchases.length === 0 ? (
                <p className={styles.noOrders}>Нет оформленных товаров</p>
              ) : (
                <div className={styles.ordersList}>
                  {purchases.map((p) => (
                    <div key={p.id} className={styles.orderItem}>
                      {p.product?.image && (
                        <div className={styles.orderThumb}>
                          <img src={p.product.image} alt={p.product.name} />
                        </div>
                      )}
                      <div className={styles.orderInfo}>
                        <span className={styles.orderName}>
                          {p.product?.name || "Товар удалён"}
                        </span>
                        <span className={styles.orderMeta}>
                          {p.quantity} шт. ·{" "}
                          {p.totalPrice > 0
                            ? `${p.totalPrice} ₽`
                            : `${(p.product?.price || 0) * p.quantity} ₽`}
                        </span>
                      </div>
                      <span className={styles.orderDate}>
                        {formatDate(p.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className={styles.closeBtn} onClick={closeModal}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
