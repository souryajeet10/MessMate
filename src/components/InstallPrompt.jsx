import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, X, Download, ArrowUpRight } from "lucide-react";

export default function InstallPrompt() {
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const isAdminPage = location.pathname === "/admin";
  const isWelcomePage = location.pathname === "/welcome";

  useEffect(() => {
    // Check if the user is already running the installed standalone PWA
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true ||
        document.referrer.includes("android-app://");
      
      setIsInstalled(isStandalone);
      return isStandalone;
    };

    if (checkStandalone()) return;

    // Listen for native PWA installation event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowModal(false);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    // Capture beforeinstallprompt event from browser
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isAdminPage && !isWelcomePage) {
        setShowModal(true);
      }
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If on mobile browser and not in standalone app mode, show modal on visit
    const isMobile =
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

    if (isMobile && !isAdminPage && !isWelcomePage) {
      const timer = setTimeout(() => {
        if (!checkStandalone()) {
          setShowModal(true);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isAdminPage, isWelcomePage]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        setShowModal(false);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        "Direct 1-Click Install:\n\n• On Android (Chrome): Tap the menu (⋮) -> 'Install app' or 'Add to Home screen'.\n• On iOS (Safari): Tap the Share button (⎋) -> 'Add to Home Screen'."
      );
    }
  };

  const handleDismissModal = () => {
    setShowModal(false);
  };

  // If already installed and opened from home screen, or on admin/welcome, do not show anything
  if (isInstalled || isAdminPage || isWelcomePage) return null;

  return (
    <>
      {/* 1. Modal Popup Reminder */}
      <AnimatePresence>
        {showModal && (
          <div className="install-card-backdrop" onClick={handleDismissModal}>
            <motion.div
              className="install-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 30 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <button
                className="install-card-close"
                onClick={handleDismissModal}
                aria-label="Close"
                id="install-prompt-close"
              >
                <X size={18} />
              </button>

              <div className="install-card-header">
                <div className="install-card-icon-badge">
                  <Smartphone size={24} color="#3B82F6" />
                </div>
                <div>
                  <h3 className="install-card-title">Install MessMate App</h3>
                  <p className="install-card-subtitle">Fast 1-tap mess menu access</p>
                </div>
              </div>

              <div className="install-card-body">
                <p>
                  Add <strong>MESSMATE @ UH</strong> to your home screen for quick daily meal checks, calendar schedules, and instant offline access without opening your browser!
                </p>
              </div>

              <div className="install-card-actions">
                <button
                  className="install-card-primary-btn"
                  onClick={handleInstallClick}
                  id="install-prompt-action-btn"
                >
                  <Download size={16} />
                  <span>Add to Home Screen</span>
                </button>
                <button
                  className="install-card-secondary-btn"
                  onClick={handleDismissModal}
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Persistent Floating Install Badge (Stays visible until added to homescreen) */}
      {!showModal && (
        <motion.button
          className="persistent-install-pill"
          onClick={() => setShowModal(true)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          id="floating-install-pill"
          title="Install MessMate to Home Screen"
        >
          <div className="persistent-install-icon">
            <Smartphone size={15} />
          </div>
          <span>Install App</span>
          <ArrowUpRight size={13} className="pill-arrow" />
        </motion.button>
      )}
    </>
  );
}

