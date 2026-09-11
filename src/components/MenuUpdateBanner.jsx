import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChevronRight, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "messmate_sep_update_dismissed_v1";

export default function MenuUpdateBanner({ currentView = "today" }) {
  const [isVisible, setIsVisible] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "true";
    } catch {
      return true;
    }
  });

  const navigate = useNavigate();

  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
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
              <span className="menu-update-badge">Updated Menu</span>
              <h3 className="menu-update-title">September Menu Live</h3>
            </div>
            <p className="menu-update-desc">
              Menu is updated for <strong>2nd &amp; 4th Week</strong> (Sep 8–14 &amp; Sep 22–28). Remaining days are being updated soon!
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
            onClick={handleDismiss}
            aria-label="Dismiss menu update notice"
            title="Dismiss notice"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
