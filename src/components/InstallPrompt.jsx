import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, X, Download, ArrowUpRight } from "lucide-react";

// ─── localStorage key ────────────────────────────────────────────────────────
// KEY_DISMISSED is intentionally removed — dismiss only hides the popup for
// the current session so it re-appears on every new visit until installed.
const KEY_INSTALLED = "messmate_app_installed";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns true when the app is genuinely running as an installed PWA. */
function detectStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true ||
    document.referrer.includes("android-app://")
  );
}

/** True on iOS/iPadOS where beforeinstallprompt is not available. */
function detectIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function InstallPrompt() {
  const location = useLocation();

  // The deferred browser prompt — stored in a ref so it survives re-renders
  // without triggering them, and is never stale inside async callbacks.
  const deferredPromptRef = useRef(null);

  // Three separate, independent state concepts:
  const [isInstalled, setIsInstalled] = useState(false);   // standalone OR appinstalled fired
  const [showModal, setShowModal] = useState(false);        // modal card visibility
  const [isIOS, setIsIOS] = useState(false);                // iOS/Safari fallback mode

  const isAdminPage = location.pathname === "/admin";
  const isWelcomePage = location.pathname === "/welcome";

  // ── Initialise on mount ───────────────────────────────────────────────────
  useEffect(() => {
    // Strongest signal: app is already running as a PWA — hide everything.
    if (detectStandalone()) {
      setIsInstalled(true);
      return;
    }

    // Soft signal: we previously recorded a confirmed install via appinstalled.
    // Only use this when standalone mode is NOT active (e.g. browser tab after install).
    if (localStorage.getItem(KEY_INSTALLED) === "true") {
      setIsInstalled(true);
      return;
    }

    setIsIOS(detectIOS());
  }, []);

  // ── Listen for browser events ─────────────────────────────────────────────
  useEffect(() => {
    // Already installed — no need to set up listeners.
    if (isInstalled) return;

    // ── beforeinstallprompt ──────────────────────────────────────────────────
    // Fired by Chrome/Android when the site is installable.
    // Calling e.preventDefault() is required to suppress the mini-infobar and
    // take full control of when to trigger the native prompt.
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPromptRef.current = e;

      // Always show the modal on every visit if not on a suppressed page.
      // No dismissed flag — popup reappears each visit until app is installed.
      if (!isAdminPage && !isWelcomePage) {
        setShowModal(true);
      }
    };

    // ── appinstalled ─────────────────────────────────────────────────────────
    // Fired by the browser after the user confirms installation through the
    // native prompt or via the browser menu. This is the authoritative signal.
    const handleAppInstalled = () => {
      localStorage.setItem(KEY_INSTALLED, "true");
      deferredPromptRef.current = null;
      setIsInstalled(true);
      setShowModal(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Always clean up both listeners — fixes the previous cleanup bug where
    // the mobile branch returned only clearTimeout, leaking these handlers.
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isInstalled, isAdminPage, isWelcomePage]);

  // ── Show popup on first tap/click anywhere on the page ───────────────────
  // As soon as the user interacts with the page for the first time, if the
  // browser's deferred install prompt is ready, we show the install modal.
  // This gives a seamless "tap anywhere → install popup" experience on mobile.
  useEffect(() => {
    if (isInstalled || isAdminPage || isWelcomePage) return;

    let triggered = false;

    const handleFirstInteraction = () => {
      if (triggered) return;
      triggered = true;

      // Remove listeners immediately — we only want to trigger once.
      window.removeEventListener("touchstart", handleFirstInteraction, { capture: true });
      window.removeEventListener("click", handleFirstInteraction, { capture: true });

      if (deferredPromptRef.current) {
        // Native prompt is ready — show the modal.
        setShowModal(true);
      } else if (isIOS) {
        // iOS: show manual instructions on first tap.
        setShowModal(true);
      }
      // If no prompt and not iOS, the floating pill remains as a fallback.
    };

    window.addEventListener("touchstart", handleFirstInteraction, { capture: true, once: true });
    window.addEventListener("click", handleFirstInteraction, { capture: true, once: true });

    return () => {
      window.removeEventListener("touchstart", handleFirstInteraction, { capture: true });
      window.removeEventListener("click", handleFirstInteraction, { capture: true });
    };
  }, [isInstalled, isAdminPage, isWelcomePage, isIOS]);

  // ── Install button handler ────────────────────────────────────────────────
  const handleInstallClick = async () => {
    const prompt = deferredPromptRef.current;

    if (prompt) {
      // Native prompt path — Android/Chrome and other supporting browsers.
      // The browser shows its own confirmation dialog; we must not bypass it.
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      deferredPromptRef.current = null;

      if (outcome === "accepted") {
        // appinstalled will fire shortly and update state — no need to
        // setIsInstalled(true) here; that would be redundant and could race.
        setShowModal(false);
      }
      // If dismissed in the native dialog, leave the modal open so the user
      // can try again or close it themselves.
    } else if (isIOS) {
      // iOS/Safari manual path — shown only when the user explicitly taps the pill.
      // The modal content already explains the Share → Add to Home Screen flow.
      // Nothing extra needed here; the modal is already open at this point.
    } else {
      // Fallback for browsers without beforeinstallprompt that are not iOS.
      // Show a concise browser-agnostic instruction.
      alert(
        "To install this app:\n\n" +
        "• Android (Chrome): Tap ⋮ menu → 'Install app' or 'Add to Home screen'.\n" +
        "• iOS (Safari): Tap the Share button → 'Add to Home Screen'.\n" +
        "• Desktop (Chrome/Edge): Click the install icon in the address bar."
      );
    }
  };

  // ── Dismiss handler ───────────────────────────────────────────────────────
  // "Maybe Later" closes the modal for this session only — no localStorage.
  // On the next visit the popup will appear again automatically.
  const handleDismissModal = () => {
    setShowModal(false);
  };

  // ── Pill click ────────────────────────────────────────────────────────────
  // Opens the modal when the user taps the floating pill.
  const handlePillClick = () => {
    setShowModal(true);
  };

  // ── Render guards ─────────────────────────────────────────────────────────
  // Hide everything when: genuinely installed, on admin page, on welcome page.
  if (isInstalled || isAdminPage || isWelcomePage) return null;

  // Decide what the primary action button should say and do.
  // On iOS with no native prompt, "Add to Home Screen" opens the instructions.
  const primaryButtonLabel = deferredPromptRef.current
    ? "Add to Home Screen"
    : isIOS
    ? "How to Install on iOS"
    : "Add to Home Screen";

  return (
    <>
      {/* ── 1. Modal card ─────────────────────────────────────────────── */}
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
                    Add <strong>MESSMATE @ UH</strong> to your home screen for
                    quick daily meal checks, calendar schedules, and instant
                    offline access without opening your browser!
                  </p>
                )}
              </div>

              <div className="install-card-actions">
                {/* On iOS this button is informational; on Android it triggers the native prompt */}
                {!isIOS && (
                  <button
                    className="install-card-primary-btn"
                    onClick={handleInstallClick}
                    id="install-prompt-action-btn"
                  >
                    <Download size={16} />
                    <span>{primaryButtonLabel}</span>
                  </button>
                )}
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

      {/* ── 2. Persistent floating install pill ───────────────────────── */}
      {/* Stays visible until the app is confirmed installed/standalone.    */}
      {!showModal && (
        <motion.button
          className="persistent-install-pill"
          onClick={handlePillClick}
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
