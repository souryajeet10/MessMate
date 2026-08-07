import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const FOOD_CHARACTERS = ["🍕", "🍩", "🥦", "🍔", "🧁", "🥕", "🍎", "🌮", "🍳"];

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleEnter = () => {
    localStorage.setItem("messmate_welcomed", "true");
    navigate("/");
  };

  return (
    <div className="welcome-screen">
      <motion.div
        className="welcome-top"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <p className="welcome-tagline">Look, they're here!</p>
        <h1 className="welcome-title">Welcome To</h1>
        <div className="welcome-brand">
          <span className="welcome-logo">M</span>
          <span className="welcome-brand-name">MessMate</span>
        </div>
      </motion.div>

      <div className="welcome-characters">
        <div className="welcome-characters-grid">
          {FOOD_CHARACTERS.map((char, i) => (
            <motion.span
              key={i}
              className="welcome-character"
              initial={{ opacity: 0, scale: 0 }}
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <button className="welcome-cta" onClick={handleEnter} id="welcome-cta">
          Lets Dive In <ArrowRight size={20} />
        </button>
      </motion.div>
    </div>
  );
}
