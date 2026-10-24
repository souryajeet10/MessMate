import { NavLink } from "react-router-dom";
import { UtensilsCrossed, Calendar, Menu, Sun, Moon } from "lucide-react";
import Brand from "./Brand";
import { useTheme } from "../context/ThemeContext";

export default function DesktopNav({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="desktop-nav" aria-label="Desktop primary navigation">
      <div className="desktop-nav-inner">
        <NavLink to="/" className="desktop-brand-link" aria-label="MessMate home">
          <Brand />
        </NavLink>

        <div className="desktop-nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `desktop-nav-link ${isActive ? "active" : ""}`}
            id="desktop-nav-today"
          >
            <UtensilsCrossed size={18} />
            <span>Today</span>
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) => `desktop-nav-link ${isActive ? "active" : ""}`}
            id="desktop-nav-calendar"
          >
            <Calendar size={18} />
            <span>Calendar</span>
          </NavLink>
        </div>

        <div className="desktop-nav-actions">
          <button
            type="button"
            onClick={toggleTheme}
            className="desktop-nav-action-btn theme-toggle-btn"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            id="desktop-theme-toggle"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            onClick={onMenuClick}
            className="desktop-nav-action-btn menu-toggle-btn"
            aria-label="Open menu"
            title="Open menu"
            id="desktop-menu-btn"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
