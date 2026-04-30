import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useProducts } from "../../hooks/useProducts";
import { useServices } from "../../hooks/useServices";
import { useAuth } from "../../contexts/AuthContext";
import { getCookie } from "../../utils/cookies";
import AnalyticsTab from "./components/AnalyticsTab";
import UsersTab from "./components/UsersTab";
import toast from "react-hot-toast";
import styles from "./AdminPage.module.css";
import {API_BASE_URL, BACKEND_BASE_URL} from "../../config/api.js";

export default function AdminPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, refetch: refetchProducts } = useProducts();
  const { services, refetch: refetchServices } = useServices();
  const [activeTab, setActiveTab] = useState("products");
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const parseMultilineList = (value) =>
    value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

  const formatMultilineList = (items) =>
    Array.isArray(items) ? items.join("\n") : "";

  useEffect(() => {
    // Проверка роли пользователя
    if (!user || user.role !== "admin") {
      toast.error("Доступ запрещен");
      navigate("/profile");
    }
  }, [navigate, user]);

  const handleDelete = async (id, type) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот элемент?")) return;

    try {
      const token = getCookie("token");
      const endpoint = type === "product" ? "/products" : "/services";

      const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Удалено успешно");
        type === "product" ? refetchProducts() : refetchServices();
      } else {
        throw new Error("Ошибка при удалении");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (item, type) => {
    setEditingItem({
      ...item,
      type,
      benefits: Array.isArray(item.benefits) ? item.benefits : [],
      features: Array.isArray(item.features) ? item.features : [],
    });
    setIsCreating(false);
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleCreate = (type) => {
    setEditingItem({
      type,
      name: "",
      price: 0,
      description: "",
      category: "",
      benefits: [],
      features: [],
      image: type === "product" ? "" : undefined
    });
    setIsCreating(true);
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      toast.error("Пожалуйста, выберите изображение");
      return;
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Размер файла не должен превышать 5MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      // Очищаем поле URL при загрузке файла
      setEditingItem({ ...editingItem, image: "" });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setIsUploading(true);
      const token = getCookie("token");
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        throw new Error('Ошибка при загрузке файла');
      }
    } catch (error) {
      toast.error(error.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Общая валидация
      if (!editingItem.name.trim()) {
        toast.error("Название не может быть пустым");
        return;
      }

      if (!editingItem.price || editingItem.price <= 0) {
        toast.error("Цена должна быть больше 0");
        return;
      }

      // Валидация для товаров - изображение обязательно
      if (editingItem.type === "product") {
        if (!selectedFile && !editingItem.image) {
          toast.error("Изображение обязательно для товаров");
          return;
        }

        if (!editingItem.category?.trim()) {
          toast.error("Категория обязательна для товаров");
          return;
        }
      }

      let imageUrl = editingItem.image;

      // Если выбран новый файл, загружаем его
      if (selectedFile) {
        const uploadedUrl = await uploadFile();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          return; // Прерываем если загрузка не удалась
        }
      }

      const token = getCookie("token");
      const endpoint =
        editingItem.type === "product" ? "/products" : "/services";
      const method = isCreating ? "POST" : "PATCH";
      const url = isCreating
        ? `${API_BASE_URL}${endpoint}`
        : `${API_BASE_URL}${endpoint}/${editingItem.id}`;

      // Prepare data without id and type fields
      const { id, type, ...itemData } = editingItem;

      // Convert price to number and update image URL
      const dataToSend = {
        ...itemData,
        price: Number(itemData.price) || 0,
        benefits:
          editingItem.type === "product"
            ? parseMultilineList(formatMultilineList(itemData.benefits))
            : undefined,
        features:
          editingItem.type === "product"
            ? parseMultilineList(formatMultilineList(itemData.features))
            : undefined,
        ...(editingItem.type === "product" && { image: imageUrl }),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });
      if (response.ok) {
        toast.success(isCreating ? "Создано успешно" : "Обновлено успешно");
        setEditingItem(null);
        setIsCreating(false);
        setSelectedFile(null);
        setPreviewUrl("");
        editingItem.type === "product" ? refetchProducts() : refetchServices();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при сохранении");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerBg}>
        <Header />
      </div>
      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <a onClick={() => navigate('/profile')}>Профиль</a>
          <span>/</span>
          <span className={styles.active}>Админ-панель</span>
        </div>

        <h1 className={styles.pageTitle}>Админ-панель</h1>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "products" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Товары
          </button>
          <button
            className={`${styles.tab} ${activeTab === "services" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("services")}
          >
            Услуги
          </button>
          <button
            className={`${styles.tab} ${activeTab === "users" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Пользователи
          </button>
          <button
            className={`${styles.tab} ${activeTab === "analytics" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            Аналитика
          </button>
        </div>

        {activeTab === "analytics" ? (
          <AnalyticsTab />
        ) : activeTab === "users" ? (
          <UsersTab />
        ) : (
          <>
            <button
              className={styles.createBtn}
              onClick={() =>
                handleCreate(activeTab === "products" ? "product" : "service")
              }
            >
              + Создать {activeTab === "products" ? "товар" : "услугу"}
            </button>

            <div className={styles.list}>
              {(activeTab === "products" ? products : services).map((item) => (
                <div key={item.id} className={styles.card}>
                  <div className={styles.itemRow}>
                    {activeTab === "products" && item.image && (
                      <div className={styles.itemThumb}>
                        <img src={item.image} alt={item.name} />
                      </div>
                    )}
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <span className={styles.itemPrice}>{item.price} ₽</span>
                      {item.category && (
                        <span className={styles.itemCategory}>{item.category}</span>
                      )}
                    </div>
                    <div className={styles.itemActions}>
                      <button
                        className={styles.editBtn}
                        onClick={() =>
                          handleEdit(item, activeTab === "products" ? "product" : "service")
                        }
                      >
                        Редактировать
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() =>
                          handleDelete(item.id, activeTab === "products" ? "product" : "service")
                        }
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {editingItem && (
              <div className={styles.overlay} onClick={() => { setEditingItem(null); setIsCreating(false); setSelectedFile(null); setPreviewUrl(""); }}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <h2 className={styles.modalTitle}>
                    {isCreating ? "Создание" : "Редактирование"}
                  </h2>

                  <div className={styles.formGroup}>
                    <label>Название *</label>
                    <input
                      type="text"
                      placeholder="Введите название"
                      value={editingItem.name}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, name: e.target.value })
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Цена (₽) *</label>
                    <input
                      type="number"
                      placeholder="Введите цену"
                      value={editingItem.price}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          price: parseFloat(e.target.value),
                        })
                      }
                      min="0.01"
                      step="0.01"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Описание</label>
                    <textarea
                      placeholder="Описание (необязательно)"
                      value={editingItem.description || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  {editingItem.type === "product" && (
                    <>
                      <div className={styles.formGroup}>
                        <label>Категория *</label>
                        <input
                          type="text"
                          placeholder="Введите категорию"
                          value={editingItem.category || ""}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              category: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Преимущества</label>
                        <textarea
                          placeholder="Каждое преимущество с новой строки"
                          value={formatMultilineList(editingItem.benefits)}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              benefits: parseMultilineList(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Функциональные возможности</label>
                        <textarea
                          placeholder="Каждую возможность с новой строки"
                          value={formatMultilineList(editingItem.features)}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              features: parseMultilineList(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Изображение товара *</label>
                        {(previewUrl || editingItem.image) ? (
                          <div className={styles.imagePreview}>
                            <img
                              src={previewUrl || editingItem.image}
                              alt="Preview"
                              className={styles.previewImage}
                            />
                            <div className={styles.imageActions}>
                              <label htmlFor="file-input" className={styles.changeImageBtn}>
                                Изменить
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedFile(null);
                                  setPreviewUrl("");
                                  setEditingItem({ ...editingItem, image: "" });
                                }}
                                className={styles.removeImageBtn}
                              >
                                Удалить
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={styles.uploadArea}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                          >
                            <label htmlFor="file-input" className={styles.uploadLabel}>
                              <div className={styles.uploadContent}>
                                <span className={styles.uploadIcon}>📁</span>
                                <span>Нажмите или перетащите изображение</span>
                                <span className={styles.uploadHint}>
                                  JPG, PNG, GIF до 5MB
                                </span>
                              </div>
                            </label>
                          </div>
                        )}
                        <input
                          id="file-input"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                      </div>
                    </>
                  )}

                  <div className={styles.modalActions}>
                    <button
                      className={styles.saveBtn}
                      onClick={handleSave}
                      disabled={isUploading}
                    >
                      {isUploading ? "Загрузка..." : "Сохранить"}
                    </button>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => {
                        setEditingItem(null);
                        setIsCreating(false);
                        setSelectedFile(null);
                        setPreviewUrl("");
                      }}
                      disabled={isUploading}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
