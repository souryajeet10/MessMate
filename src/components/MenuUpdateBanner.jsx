import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChevronRight, Calendar, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Menu Update Banner ────────────────────────────────────────────────────────
const UPDATE_STORAGE_KEY = "messmate_sep_update_dismissed_v2";
const UPDATE_FIRST_SHOWN_KEY = "messmate_sep_update_first_shown_v2";
const UPDATE_EXPIRY_DAYS = 5;

function isUpdateExpired() {
  try {
    const firstShown = localStorage.getItem(UPDATE_FIRST_SHOWN_KEY);
    if (!firstShown) return false; // hasn't been shown yet, not expired
    const elapsed = Date.now() - parseInt(firstShown, 10);
    return elapsed > UPDATE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function initUpdateVisible() {
  try {
    if (isUpdateExpired()) return false;
    if (localStorage.getItem(UPDATE_STORAGE_KEY) === "true") return false;
    // Record first-shown timestamp if not already set
    if (!localStorage.getItem(UPDATE_FIRST_SHOWN_KEY)) {
      localStorage.setItem(UPDATE_FIRST_SHOWN_KEY, String(Date.now()));
    }
    return true;
  } catch {
    return true;
  }
}

// ── Special Day Notice ────────────────────────────────────────────────────────
// Show only on Sept 12 (i.e. "tomorrow" is Sept 13 — the special day)
const SPECIAL_DAY_STORAGE_KEY = "messmate_sept13_notice_dismissed";
const SPECIAL_DAY_DATE = "2026-09-13"; // the day the special schedule applies

function shouldShowSpecialNotice() {
  try {
    if (localStorage.getItem(SPECIAL_DAY_STORAGE_KEY) === "true") return false;
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);
    // Show only on the day before the special day, or on the special day itself
    return todayStr === SPECIAL_DAY_DATE || tomorrowStr === SPECIAL_DAY_DATE;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export default function MenuUpdateBanner({ currentView = "today" }) {
  const [updateVisible, setUpdateVisible] = useState(initUpdateVisible);
  const [specialVisible, setSpecialVisible] = useState(shouldShowSpecialNotice);
  const navigate = useNavigate();

  const handleDismissUpdate = (e) => {
    e.stopPropagation();
    setUpdateVisible(false);
    try {
      localStorage.setItem(UPDATE_STORAGE_KEY, "true");
    } catch {
      // ignore
    }
  };

  const handleDismissSpecial = (e) => {
    e.stopPropagation();
    setSpecialVisible(false);
    try {
      localStorage.setItem(SPECIAL_DAY_STORAGE_KEY, "true");
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* ── Menu Update Banner ── */}
      <AnimatePresence>
        {updateVisible && (
          <motion.div
            className="menu-update-banner"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, height: 0, margin: 0, padding: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            role="status"
            aria-live="polite"
          >
            <div className="menu-update-icon-wrap" aria-hidden="true">
              <Sparkles size={20} />
            </div>

            <div className="menu-update-content">
              <div className="menu-update-header">
                <span className="menu-update-badge">Menu Updated ✨</span>
                <h3 className="menu-update-title">Full September Menu Live!</h3>
              </div>
              <p className="menu-update-desc">
                September menu has been updated. Check out this week's meals!
              </p>

              {currentView === "today" && (
                <button
                  type="button"
                  className="menu-update-action-btn"
                  onClick={() => navigate("/calendar")}
                  aria-label="View September menu in calendar"
                >
                  <Calendar size={13} />
                  <span>View Full Schedule</span>
                  <ChevronRight size={13} />
                </button>
              )}
            </div>

            <button
              type="button"
              className="menu-update-dismiss-btn"
              onClick={handleDismissUpdate}
              aria-label="Dismiss menu update notice"
              title="Dismiss notice"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Special Day Notice (Sept 13) ── */}
      <AnimatePresence>
        {specialVisible && (
          <motion.div
            className="menu-update-banner special-day-banner"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, height: 0, margin: 0, padding: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.35, ease: "easeOut", delay: updateVisible ? 0.1 : 0 }}
            role="status"
            aria-live="polite"
          >
            <div className="menu-update-icon-wrap special-day-icon" aria-hidden="true">
              <Coffee size={20} />
            </div>

            <div className="menu-update-content">
              <div className="menu-update-header">
                <span className="menu-update-badge special-day-badge">Tomorrow · 13 Sep</span>
                <h3 className="menu-update-title">Special Schedule for Saturday</h3>
              </div>
              <p className="menu-update-desc">
                To facilitate routine deep cleaning of the mess facilities and to give our staff some
                well-deserved respite, there will be a wholesome <strong>Brunch</strong> service and
                an extended <strong>High Tea till 8 PM</strong> tomorrow.{" "}
                <em>There will be no separate Dinner service.</em>
              </p>
            </div>

            <button
              type="button"
              className="menu-update-dismiss-btn"
              onClick={handleDismissSpecial}
              aria-label="Dismiss special day notice"
              title="Dismiss notice"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
