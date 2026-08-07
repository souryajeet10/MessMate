import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Bell, X, Download, CheckCircle } from "lucide-react";
import { requestNotificationPermission, isNotificationEnabled } from "../utils/notificationUtils";

export default function PwaInstallPrompt() {
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(isNotificationEnabled());

  const isAdminPage = location.pathname === "/admin";
  const isWelcomePage = location.pathname === "/welcome";

  useEffect(() => {
    if (isAdminPage || isWelcomePage) return;

    const isMobile =
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

    // Capture native PWA install prompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (isMobile && !isStandalone) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // On mobile devices, show prompt popup on visit
    if (isMobile && !isStandalone) {
      const timer = setTimeout(() => setShowPrompt(true), 600);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [isAdminPage, isWelcomePage]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        "Direct 1-Click Install:\n\nIf prompt doesn't open automatically:\n• On Android (Chrome): Tap browser menu (⋮) -> 'Add to Home screen' or 'Install App'.\n• On iOS (Safari): Tap Share button (⎋) -> 'Add to Home Screen'."
      );
    }
  };

  const handleEnableNotifications = async () => {
    try {
      const granted = await requestNotificationPermission();
      setNotifEnabled(granted);
      if (granted) {
        alert("Notifications Enabled! You will receive live alerts when your favorite dishes are served.");
      } else {
        alert(
          "Notification Note:\nBrowsers require an HTTPS secure connection or 'localhost' to enable system push notifications. On local IP (HTTP), in-app ⭐ dish highlights remain active!"
        );
      }
    } catch {
      alert("Please allow notification permission in your browser site settings.");
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (isAdminPage || isWelcomePage || !showPrompt) return null;

  return (
    <AnimatePresence>
      <div className="popup-card-backdrop">
        <motion.div
          className="popup-card"
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 30 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <button className="popup-card-close" onClick={handleDismiss} aria-label="Close">
            <X size={18} />
          </button>

          <div className="popup-card-header">
            <div className="popup-card-icon-badge">
              <Smartphone size={24} color="#0284C7" />
            </div>
            <div>
              <h3 className="popup-card-title">Install MESSMATE App</h3>
              <p className="popup-card-subtitle">Fast mess menu & dish alerts</p>
            </div>
          </div>

          <div className="popup-card-body-text">
            <p>Add MESSMATE directly to your home screen for 1-tap menu access & dish reminders!</p>
          </div>

          <div className="popup-card-actions">
            {!notifEnabled ? (
              <button className="popup-card-btn secondary" onClick={handleEnableNotifications}>
                <Bell size={16} /> Allow Dish Reminders
              </button>
            ) : (
              <div className="popup-card-status-badge">
                <CheckCircle size={15} color="#10B981" /> Reminders Active
              </div>
            )}
            <button className="popup-card-btn primary" onClick={handleInstallClick}>
              <Download size={16} /> Add to Home Screen
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
