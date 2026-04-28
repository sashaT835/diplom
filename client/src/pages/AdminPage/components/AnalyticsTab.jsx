import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { FaBox, FaEye, FaShoppingCart, FaChartLine, FaTrophy, FaChartBar, FaClipboardList, FaSyncAlt } from "react-icons/fa";
import { getAnalytics } from "../../../api/analytics";
import toast from "react-hot-toast";
import styles from "./AnalyticsTab.module.css";

const COLORS = [
  "#484283",
  "#6c63ff",
  "#4caf50",
  "#ff9800",
  "#f44336",
  "#2196f3",
  "#9c27b0",
  "#00bcd4",
];

export default function AnalyticsTab() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Ошибка загрузки аналитики:", error);
      toast.error("Ошибка загрузки аналитики");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка аналитики...</div>;
  }

  if (!analytics) {
    return <div className={styles.error}>Не удалось загрузить аналитику</div>;
  }

  return (
    <div className={styles.analyticsContainer}>
      {/* Сводные карточки */}
      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <div className={styles.cardIcon}><FaBox /></div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>{analytics.totalProducts}</span>
            <span className={styles.cardLabel}>Всего товаров</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}><FaEye /></div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>{analytics.totalViews}</span>
            <span className={styles.cardLabel}>Всего просмотров</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}><FaShoppingCart /></div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>{analytics.totalPurchases}</span>
            <span className={styles.cardLabel}>Всего покупок</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}><FaChartLine /></div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>
              {analytics.totalProducts > 0
                ? (analytics.totalViews / analytics.totalProducts).toFixed(1)
                : 0}
            </span>
            <span className={styles.cardLabel}>Ср. просмотров/товар</span>
          </div>
        </div>
      </div>

      {/* Переключатель секций */}
      <div className={styles.sectionTabs}>
        <button
          className={activeSection === "overview" ? styles.activeSection : ""}
          onClick={() => setActiveSection("overview")}
        >
          Обзор
        </button>
        <button
          className={activeSection === "purchases" ? styles.activeSection : ""}
          onClick={() => setActiveSection("purchases")}
        >
          Покупки
        </button>
        <button
          className={activeSection === "views" ? styles.activeSection : ""}
          onClick={() => setActiveSection("views")}
        >
          Просмотры
        </button>
        <button
          className={activeSection === "table" ? styles.activeSection : ""}
          onClick={() => setActiveSection("table")}
        >
          Таблица
        </button>
      </div>

      {/* Секция: Обзор */}
      {activeSection === "overview" && (
        <div className={styles.chartsGrid}>
          {/* Топ-5 по покупкам — Bar Chart */}
          <div className={styles.chartBlock}>
            <h3><FaTrophy /> Топ-5 по покупкам</h3>
            {analytics.topByPurchases.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={analytics.topByPurchases.map((p) => ({
                    name:
                      p.name.length > 20
                        ? p.name.substring(0, 20) + "..."
                        : p.name,
                    Покупки: p.purchaseCount,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Покупки" fill="#484283" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className={styles.noData}>Нет данных о покупках</p>
            )}
          </div>

          {/* Топ-5 по просмотрам — Bar Chart */}
          <div className={styles.chartBlock}>
            <h3><FaEye /> Топ-5 по просмотрам</h3>
            {analytics.topByViews.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={analytics.topByViews.map((p) => ({
                    name:
                      p.name.length > 20
                        ? p.name.substring(0, 20) + "..."
                        : p.name,
                    Просмотры: p.viewCount,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="Просмотры"
                    fill="#6c63ff"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className={styles.noData}>Нет данных о просмотрах</p>
            )}
          </div>
        </div>
      )}

      {/* Секция: Покупки — Pie Chart + Timeline */}
      {activeSection === "purchases" && (
        <div className={styles.chartsGrid}>
          <div className={styles.chartBlock}>
            <h3><FaChartBar /> Распределение покупок по товарам</h3>
            {analytics.products.filter((p) => p.purchaseCount > 0).length >
            0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={analytics.products
                      .filter((p) => p.purchaseCount > 0)
                      .slice(0, 8)
                      .map((p) => ({
                        name: p.name,
                        value: p.purchaseCount,
                      }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name.substring(0, 15)}${name.length > 15 ? "..." : ""} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.products
                      .filter((p) => p.purchaseCount > 0)
                      .slice(0, 8)
                      .map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className={styles.noData}>Нет данных о покупках</p>
            )}
          </div>

          <div className={styles.chartBlock}>
            <h3><FaChartLine /> Динамика продаж (30 дней)</h3>
            {analytics.salesTimeline.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={analytics.salesTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    fontSize={11}
                    tickFormatter={(d) => {
                      const date = new Date(d);
                      return `${date.getDate()}.${(date.getMonth() + 1).toString().padStart(2, "0")}`;
                    }}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(d) => {
                      const date = new Date(d);
                      return date.toLocaleDateString("ru-RU");
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="quantity"
                    name="Кол-во товаров"
                    stroke="#484283"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Выручка (₽)"
                    stroke="#4caf50"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className={styles.noData}>Нет данных за последние 30 дней</p>
            )}
          </div>
        </div>
      )}

      {/* Секция: Просмотры — Bar Chart всех товаров */}
      {activeSection === "views" && (
        <div className={styles.chartBlockFull}>
          <h3><FaEye /> Просмотры всех товаров</h3>
          {analytics.products.filter((p) => p.viewCount > 0).length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={analytics.products
                  .filter((p) => p.viewCount > 0)
                  .sort((a, b) => b.viewCount - a.viewCount)
                  .map((p) => ({
                    name:
                      p.name.length > 25
                        ? p.name.substring(0, 25) + "..."
                        : p.name,
                    Просмотры: p.viewCount,
                    Покупки: p.purchaseCount,
                  }))}
                layout="vertical"
                margin={{ left: 150 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  fontSize={12}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="Просмотры"
                  fill="#6c63ff"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="Покупки"
                  fill="#484283"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className={styles.noData}>Нет данных о просмотрах</p>
          )}
        </div>
      )}

      {/* Секция: Таблица */}
      {activeSection === "table" && (
        <div className={styles.tableContainer}>
          <h3><FaClipboardList /> Полная статистика по товарам</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.analyticsTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Категория</th>
                  <th>Цена (₽)</th>
                  <th>Просмотры</th>
                  <th>Покупки</th>
                  <th>Конверсия</th>
                </tr>
              </thead>
              <tbody>
                {analytics.products
                  .sort((a, b) => b.purchaseCount - a.purchaseCount)
                  .map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.category || "—"}</td>
                      <td>{product.price.toLocaleString("ru-RU")}</td>
                      <td>{product.viewCount}</td>
                      <td>{product.purchaseCount}</td>
                      <td>
                        {product.viewCount > 0
                          ? (
                              (product.purchaseCount / product.viewCount) *
                              100
                            ).toFixed(1) + "%"
                          : "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <button className={styles.refreshBtn} onClick={loadAnalytics}>
        <FaSyncAlt /> Обновить данные
      </button>
    </div>
  );
}
