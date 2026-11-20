import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, X, Download, ArrowUpRight, Share, EllipsisVertical, PlusSquare } from "lucide-react";

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
                  <>
                    <ol className="install-guide-steps">
                      <li>Open MessMate in <strong>Safari</strong>.</li>
                      <li>Tap <Share size={15} aria-hidden="true" /> <strong>Share</strong>, then <strong>Add to Home Screen</strong>.</li>
                      <li>Confirm by tapping <strong>Add</strong>.</li>
                    </ol>
                    <figure className="install-guide-figure">
                      <img src="/install-guide/ios-add-to-home-screen.png"
                        width="704" height="435"
                        alt="Safari share menu with Add to Home Screen highlighted in red." />
                      <figcaption>Look for the highlighted option in the share menu.</figcaption>
                    </figure>
                  </>
                ) : (
                  canInstall ? <p>Install MessMate for quick access to your daily menu.</p> : (
                    <>
                      <ol className="install-guide-steps">
                        <li>Open your browser’s <strong>menu ⋮ or ☰</strong>.</li>
                        <li>Look for <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
                        <li>Follow the browser’s confirmation steps.</li>
                      </ol>
                      <figure className="install-guide-figure">
                        <div className="install-guide-demo" role="img" aria-label="Example browser menu: open the three-dot menu, then look for Install app or Add to Home screen.">
                          <div className="install-guide-demo-toolbar"><span>messmate@UH</span><EllipsisVertical size={20} /></div>
                          <div className="install-guide-demo-option"><Download size={18} /><span>Install app</span></div>
                          <div className="install-guide-demo-or">or</div>
                          <div className="install-guide-demo-option"><PlusSquare size={18} /><span>Add to Home screen</span></div>
                        </div>
                        <figcaption>Example only — menu wording and availability vary by browser.</figcaption>
                      </figure>
                      <p className="install-guide-note">On desktop Chrome or Edge, also check the address bar for an install icon. If your browser has no install option, open this site in Chrome on Android or Safari on iPhone/iPad.</p>
                    </>
                  )
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
