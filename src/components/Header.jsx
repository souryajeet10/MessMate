import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Brand from "./Brand";
import { getGreeting, getCurrentMealLabel } from "../utils/menuUtils";
import { useSiteClock } from "../hooks/useSiteClock";

export default function Header({ onMenuClick }) {
  const { now } = useSiteClock();
  const greeting = getGreeting(now);
  const mealLabel = getCurrentMealLabel(now);
  const reducedMotion = useReducedMotion();
  const [showIntro, setShowIntro] = useState(() => !headerIntroPlayed);

  useEffect(() => {
    headerIntroPlayed = true;
    const timer = window.setTimeout(() => setShowIntro(false), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-brand-slot">
          {!showIntro && (
            <motion.div layoutId="header-brand" transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}>
              <Brand />
            </motion.div>
          )}
        </div>
        {createPortal(<AnimatePresence>
          {showIntro && (
            <motion.div className="brand-intro" key="brand-intro" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.65 }} aria-hidden="true">
              <motion.div layoutId="header-brand" className="brand-intro-logo" transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}>
                <Brand />
              </motion.div>
              <div className="brand-intro-progress">
                <motion.div
                  className="brand-intro-progress-fill"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.5, ease: "linear" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>, document.body)}
        <button
          className="header-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
          id="header-menu-btn"
        >
          <Menu size={24} />
        </button>
      </div>
      <p className="header-greeting">{greeting} !</p>
      <h1 className="header-meal-label">{mealLabel}</h1>
      <p className="header-serving-label">
        Currently Serving in <span>United Homes</span>
      </p>
    </header>
  );
}

let headerIntroPlayed = false;
