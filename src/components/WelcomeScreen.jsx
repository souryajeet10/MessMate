import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, Clock3, Utensils } from "lucide-react";
import Brand from "./Brand";

const MEALS = [
  { label: "Breakfast", emoji: "🍳", color: "breakfast" },
  { label: "Lunch", emoji: "🍛", color: "lunch" },
  { label: "Snacks", emoji: "☕", color: "snacks" },
  { label: "Dinner", emoji: "🍲", color: "dinner" },
];

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  const handleEnter = () => {
    localStorage.setItem("messmate_welcomed", "true");
    navigate("/");
  };

  return (
    <main className="welcome-screen">
      <header className="welcome-header">
        <Brand />
        <span className="welcome-location">United Homes</span>
      </header>

      <motion.div
        className="welcome-content"
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.5 }}
      >
        <div className="welcome-intro">
          <span className="welcome-emblem" aria-hidden="true"><Utensils size={28} /></span>
          <p className="welcome-tagline">A little less “what’s for dinner?”</p>
          <h1 className="welcome-title">Good food.<br />Better planned.</h1>
          <p className="welcome-subtitle">Your United Homes mess menu, all in one place. Know what’s cooking before you head downstairs.</p>
        </div>

        <section className="welcome-menu-card" aria-labelledby="welcome-card-title">
          <div className="welcome-card-heading">
            <div>
              <p className="welcome-eyebrow">FROM THE FIRST BITE TO THE LAST</p>
              <h2 id="welcome-card-title">Your day, on a plate.</h2>
            </div>
            <Utensils size={22} aria-hidden="true" />
          </div>
          <ul className="welcome-meals">
            {MEALS.map(({ label, emoji, color }) => (
              <li className={`welcome-meal welcome-meal-${color}`} key={label}>
                <span className="welcome-meal-emoji" aria-hidden="true">{emoji}</span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
          <div className="welcome-features">
            <div className="welcome-feature">
              <span className="welcome-feature-icon"><Clock3 size={19} aria-hidden="true" /></span>
              <div><h3>Catch every serving</h3><p>Meal timings and what’s serving now.</p></div>
            </div>
            <div className="welcome-feature">
              <span className="welcome-feature-icon"><CalendarDays size={19} aria-hidden="true" /></span>
              <div><h3>A little planning goes a long way</h3><p>Browse the calendar for meals ahead.</p></div>
            </div>
          </div>
        </section>

        <div className="welcome-bottom">
          <button className="welcome-cta" onClick={handleEnter} id="welcome-cta">
            See today’s menu <ArrowRight size={20} aria-hidden="true" />
          </button>
          <p>Less guessing. More looking forward to lunch.</p>
        </div>
      </motion.div>
      <footer className="welcome-footer">Made for everyday life at United Homes</footer>
    </main>
  );
}
