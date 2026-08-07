import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, UtensilsCrossed, Calendar, Heart, Shield, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar({ isOpen, onClose }) {
  const { theme, toggleTheme } = useTheme();

  const links = [
    { to: "/", icon: <UtensilsCrossed size={20} />, label: "Today's Menu" },
    { to: "/calendar", icon: <Calendar size={20} />, label: "Calendar Menu" },
    { to: "/favourites", icon: <Heart size={20} />, label: "Favourites" },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sidebar-overlay open"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <nav className={`sidebar ${isOpen ? "open" : ""}`} id="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-logo">M</span>
          <span className="sidebar-brand-name">MessMate</span>
        </div>

        <div className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              onClick={onClose}
              id={`sidebar-link-${link.label.replace(/\s/g, "-").toLowerCase()}`}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-theme-toggle">
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
            <div
              className={`theme-switch ${theme === "dark" ? "dark" : ""}`}
              onClick={toggleTheme}
              role="switch"
              aria-checked={theme === "dark"}
              id="theme-toggle"
            >
              <div className="theme-switch-knob" />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
