import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getGreeting, getCurrentMealLabel } from "../utils/menuUtils";

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const greeting = getGreeting();
  const mealLabel = getCurrentMealLabel();

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
        <div
          className="header-avatar"
          id="header-avatar"
          onClick={() => navigate("/admin")}
          style={{ cursor: "pointer" }}
          title="Open Admin Panel"
        >
          🧑‍🎓
        </div>
      </div>
      <p className="header-greeting">{greeting} !</p>
      <h1 className="header-meal-label">{mealLabel}</h1>
      <p className="header-serving-label">
        Currently Serving in <span>United Homes</span>
      </p>
    </header>
  );
}
