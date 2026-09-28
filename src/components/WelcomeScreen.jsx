import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Brand from "./Brand";

const FOOD_CHARACTERS = ["🍕", "🍩", "🥦", "🍔", "🧁", "🥕", "🍎", "🌮", "🍳"];

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  const handleEnter = () => {
    localStorage.setItem("messmate_welcomed", "true");
    navigate("/");
  };

  return (
    <div className="welcome-screen">
      <motion.div
        className="welcome-top"
        initial={reducedMotion ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <p className="welcome-tagline">Look, they're here!</p>
        <h1 className="welcome-title">Welcome to</h1>
        <div className="welcome-brand">
          <Brand />
        </div>
        <p className="welcome-subtitle">Your next meal, a little less mystery.</p>
      </motion.div>

      <div className="welcome-characters" aria-hidden="true">
        <div className="welcome-characters-grid">
          {FOOD_CHARACTERS.map((char, i) => (
            <motion.span
              key={i}
              className="welcome-character"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.5 + i * 0.08,
                type: "spring",
                stiffness: 200,
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      </div>

      <motion.div
        className="welcome-bottom"
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        <button className="welcome-cta" onClick={handleEnter} id="welcome-cta">
          Let’s dive in <ArrowRight size={20} aria-hidden="true" />
        </button>
      </motion.div>
    </div>
  );
}
