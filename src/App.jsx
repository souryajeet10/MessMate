import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import WelcomeScreen from "./components/WelcomeScreen";
import TodayPage from "./pages/TodayPage";
import CalendarView from "./components/CalendarView";
import FavouritesPage from "./components/FavouritesPage";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import AdminPanel from "./components/AdminPanel";
import PwaInstallPrompt from "./components/PwaInstallPrompt";
import { checkTodayFavoriteDishesAndNotify } from "./utils/notificationUtils";

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(() => {
    return localStorage.getItem("messmate_welcomed") === "true";
  });
  const location = useLocation();

  // Check notification for favorite dishes on load
  useEffect(() => {
    checkTodayFavoriteDishesAndNotify();
  }, []);

  // Listen for welcome completion
  useEffect(() => {
    const checkWelcome = () => {
      setHasWelcomed(localStorage.getItem("messmate_welcomed") === "true");
    };
    window.addEventListener("storage", checkWelcome);
    checkWelcome();
    return () => window.removeEventListener("storage", checkWelcome);
  }, [location]);

  const isWelcomePage = location.pathname === "/welcome";

  return (
    <div className="app-layout">
      {!isWelcomePage && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      <Routes>
        <Route
          path="/welcome"
          element={
            hasWelcomed ? (
              <Navigate to="/" replace />
            ) : (
              <WelcomeScreen />
            )
          }
        />
        <Route
          path="/"
          element={
            !hasWelcomed ? (
              <Navigate to="/welcome" replace />
            ) : (
              <TodayPage onMenuClick={() => setSidebarOpen(true)} />
            )
          }
        />
        <Route
          path="/calendar"
          element={
            !hasWelcomed ? (
              <Navigate to="/welcome" replace />
            ) : (
              <CalendarView />
            )
          }
        />
        <Route path="/weekly" element={<Navigate to="/calendar" replace />} />
        <Route
          path="/favourites"
          element={
            !hasWelcomed ? (
              <Navigate to="/welcome" replace />
            ) : (
              <FavouritesPage />
            )
          }
        />
        <Route
          path="/admin"
          element={
            !hasWelcomed ? (
              <Navigate to="/welcome" replace />
            ) : (
              <AdminPanel />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isWelcomePage && hasWelcomed && <BottomNav />}
      {!isWelcomePage && hasWelcomed && <PwaInstallPrompt />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}
