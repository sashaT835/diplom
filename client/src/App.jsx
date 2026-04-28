import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import HomePage from "./pages/HomePage/HomePage";
import CatalogPage from "./pages/CatalogPage/CatalogPage";
import ServicesPage from "./pages/ServicesPage/ServicesPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import ContactsPage from "./pages/ContactsPage/ContactsPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import ChatPage from "./pages/ChatPage/ChatPage";
import PrivacyPage from "./pages/PrivacyPage/PrivacyPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#484283",
              color: "#fff",
              fontFamily: "Intro, sans-serif",
            },
            success: {
              iconTheme: {
                primary: "#4ade80",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#f14f4f",
                secondary: "#fff",
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
