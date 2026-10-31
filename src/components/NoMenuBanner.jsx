import { motion } from "framer-motion";
import { isDiwaliHoliday } from "../data/menuData";

export default function NoMenuBanner({ month = "this month", title = "Menu Not Available", date }) {
  const holiday = date && isDiwaliHoliday(date);
  return (
    <motion.div
      className="no-menu-banner"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="no-menu-illustration">
        <span className="no-menu-emoji" role="img" aria-label={holiday ? "Diwali lamp" : "chef"}>{holiday ? "🪔" : "👨‍🍳"}</span>
        <div className="no-menu-sparkles">
          <span>✨</span><span>🍽️</span><span>✨</span>
        </div>
      </div>

      <div className="no-menu-content">
        <h2 className="no-menu-title">{holiday ? "Diwali Holidays" : title}</h2>
        <p className="no-menu-subtitle">
          {holiday ? <>Happy Diwali! Wishing you and your family a festival filled with light, joy, and delicious moments. Enjoy the holidays!</> : <>The mess team has not released the menu for this week yet. Check back soon for <strong>{month}</strong> updates!</>}
        </p>
      </div>

      <div className="no-menu-footer">
        {holiday ? <span className="no-menu-pill">🪔 6–14 November 2026</span> : <>
          <span className="no-menu-pill">📋 Expected soon</span>
          <span className="no-menu-pill">🔔 Stay tuned</span>
        </>}
      </div>
    </motion.div>
  );
}
