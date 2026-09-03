import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import WelcomeScreen from "./components/WelcomeScreen";
import TodayPage from "./pages/TodayPage";
import CalendarView from "./components/CalendarView";

import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";
import InstallPrompt from "./components/InstallPrompt";
import { Analytics } from "@vercel/analytics/react";

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(() => {
    return localStorage.getItem("messmate_welcomed") === "true";
  });
  const location = useLocation();

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

        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isWelcomePage && <Footer />}
      {!isWelcomePage && hasWelcomed && <BottomNav />}
      {!isWelcomePage && hasWelcomed && <InstallPrompt />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
      <Analytics />
    </ThemeProvider>
  );
}
