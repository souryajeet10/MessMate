import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, X, Download, ArrowUpRight } from "lucide-react";

/** Chrome owns automatic install UI; our button offers an explicit shortcut. */
function detectStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
}

function detectIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export default function InstallPrompt() {
  const location = useLocation();
  const deferredPromptRef = useRef(null);
  const [isInstalled, setIsInstalled] = useState(detectStandalone);
  const [showModal, setShowModal] = useState(false);
  const [isIOS] = useState(detectIOS);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      // Do not preventDefault: allow Chrome's own install promotion.
      deferredPromptRef.current = event;
      setCanInstall(true);
      setIsInstalled(false);
    };
    const handleAppInstalled = () => {
      deferredPromptRef.current = null;
      setCanInstall(false);
      setIsInstalled(true);
      setShowModal(false);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => { setShowModal(false); }, [location.pathname]);

  const handleInstallClick = async () => {
    const prompt = deferredPromptRef.current;
    if (!prompt) {
      setShowModal(true);
      return;
    }
    // Each event can be used once. Consume it before awaiting the browser.
    deferredPromptRef.current = null;
    setCanInstall(false);
    setIsInstalling(true);
    setShowModal(false);
    try {
      await prompt.prompt();
      await prompt.userChoice;
    } catch {
      // The browser may already have used the event through its own UI.
      setShowModal(true);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismissModal = () => setShowModal(false);
  const handlePillClick = () => {
    if (deferredPromptRef.current) handleInstallClick();
    else setShowModal(true);
  };

  if (isInstalled || location.pathname === "/admin" || location.pathname === "/welcome") return null;

  return (
    <>
      {/* ── 1. Modal card ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <div className="install-card-backdrop" onClick={handleDismissModal}>
            <motion.div
              className="install-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="install-card-title"
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
                  <h3 id="install-card-title" className="install-card-title">Install MessMate App</h3>
                  <p className="install-card-subtitle">Fast 1-tap mess menu access</p>
                </div>
              </div>

              <div className="install-card-body">
                {isIOS ? (
                  /* iOS manual instructions */
                  <p>
                    Tap the <strong>Share</strong> button (
                    <span aria-label="share icon">⎋</span>) at the bottom of
                    Safari, then select <strong>&quot;Add to Home Screen&quot;</strong> to
                    install <strong>MESSMATE @ UH</strong>.
                  </p>
                ) : (
                  <p>
                    {canInstall ? "Install MessMate for quick access to your daily menu." :
                      "Open your browser menu and choose Install app or Add to Home screen. On desktop Chrome or Edge, look for the install icon in the address bar. If the option is missing, try opening this site in Chrome or Safari."}
                  </p>
                )}
              </div>

              <div className="install-card-actions">
                {/* On iOS this button is informational; on Android it triggers the native prompt */}
                {!isIOS && canInstall && (
                  <button
                    className="install-card-primary-btn"
                    onClick={handleInstallClick}
                    id="install-prompt-action-btn"
                  >
                    <Download size={16} />
                    <span>Install App</span>
                  </button>
                )}
                <button
                  className="install-card-secondary-btn"
                  onClick={handleDismissModal}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 2. Persistent floating install pill ───────────────────────── */}
      {/* Stays visible until the app is confirmed installed/standalone.    */}
      {!showModal && (
        <motion.button
          className="persistent-install-pill"
          onClick={handlePillClick}
          disabled={isInstalling}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          id="floating-install-pill"
          title="Install MessMate to Home Screen"
        >
          <div className="persistent-install-icon">
            <Smartphone size={15} />
          </div>
          <span>{isInstalling ? "Opening installer…" : "Install App"}</span>
          <ArrowUpRight size={13} className="pill-arrow" />
        </motion.button>
      )}
    </>
  );
}
