import { NavLink, useLocation } from "react-router-dom";
import { UtensilsCrossed, Calendar } from "lucide-react";

export default function BottomNav() {
  const location = useLocation();

  // Hide on welcome screen
  if (location.pathname === "/welcome") return null;

  const tabs = [
    { to: "/", icon: <UtensilsCrossed size={22} />, label: "Today" },
    { to: "/calendar", icon: <Calendar size={22} />, label: "Calendar" },
  ];

  return (
    <nav className="bottom-nav" id="bottom-nav">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === "/"}
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? "active" : ""}`
          }
          id={`nav-${tab.label.toLowerCase()}`}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
