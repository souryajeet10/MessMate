import { Menu } from "lucide-react";
import { getGreeting, getCurrentMealLabel } from "../utils/menuUtils";
import { useSiteClock } from "../hooks/useSiteClock";

export default function Header({ onMenuClick }) {
  const { now } = useSiteClock();
  const greeting = getGreeting(now);
  const mealLabel = getCurrentMealLabel(now);

  return (
    <header className="header">
      <div className="header-top">
        <button
          className="header-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
          id="header-menu-btn"
        >
          <Menu size={24} />
        </button>
        <img src="/lgo.svg" alt="MessMate Logo" className="header-logo" />
      </div>
      <p className="header-greeting">{greeting} !</p>
      <h1 className="header-meal-label">{mealLabel}</h1>
      <p className="header-serving-label">
        Currently Serving in <span>United Homes</span>
      </p>
    </header>
  );
}
