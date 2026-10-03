import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, House } from "lucide-react";
import "./WelcomeScreen.css";

const MEALS = ["Breakfast", "Lunch", "Snacks", "Dinner"];

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
        <span className="welcome-brand" aria-label="messmate at United Homes">
          <img className="welcome-brand-icon" src="/messmate-logo.png" alt="" />
          <span>messmate<span className="welcome-brand-accent">@UH</span></span>
        </span>
        <span className="welcome-location"><House size={20} fill="currentColor" aria-hidden="true" />United Homes</span>
      </header>
      <motion.div className="welcome-content"
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <section className="welcome-hero" aria-labelledby="welcome-title">
          <div className="welcome-intro">
            <p className="welcome-tagline">A little less<br />“what’s for dinner?”</p>
            <h1 className="welcome-title" id="welcome-title">Good food.<br /><span>Better planned.</span></h1>
            <p className="welcome-subtitle">Your United Homes mess menu,<br />all in one place.</p>
            <button className="welcome-cta" onClick={handleEnter} id="welcome-cta">
              See today’s menu <ArrowRight aria-hidden="true" />
            </button>
          </div>
          <img className="welcome-hero-art" src="/welcome/meal-tray.png" alt="An Indian meal tray with rice, dal, chapati and fresh salad" fetchPriority="high" />
          <span className="welcome-spark" aria-hidden="true">〃</span>
        </section>
        <section className="welcome-menu-card" aria-labelledby="welcome-card-title">
          <div className="welcome-card-heading">
            <p className="welcome-eyebrow">From the first bite to the last</p>
            <h2 id="welcome-card-title">Your day, on a plate.</h2>
          </div>
          <ul className="welcome-meals">
            {MEALS.map((label) => (
              <li key={label}>
                <button className={`welcome-meal welcome-meal-${label.toLowerCase()}`} onClick={handleEnter} aria-label={`See today’s menu for ${label.toLowerCase()}`}>
                  <span className="welcome-meal-art" aria-hidden="true" />
                  <span>{label}</span>
                  <span className="welcome-meal-arrow"><ArrowRight aria-hidden="true" /></span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </motion.div>
      <div className="welcome-closing" role="img" aria-label="Same Mess, More Clarity. Fresh tomatoes, herbs and a bowl of salad on a golden checked cloth." />
      <footer className="welcome-footer">Made for everyday life at United Homes</footer>
    </main>
  );
}
