import { motion } from "framer-motion";

export default function NoMenuBanner({ month = "this month" }) {
  return (
    <motion.div
      className="no-menu-banner"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="no-menu-illustration">
        <span className="no-menu-emoji" role="img" aria-label="chef">👨‍🍳</span>
        <div className="no-menu-sparkles">
          <span>✨</span><span>🍽️</span><span>✨</span>
        </div>
      </div>

      <div className="no-menu-content">
        <h2 className="no-menu-title">Menu Not Yet Announced</h2>
        <p className="no-menu-subtitle">
          The mess team is still cooking up the <strong>{month}</strong> menu.
          Check back soon — something delicious is on its way! 🥘
        </p>
      </div>

      <div className="no-menu-footer">
        <span className="no-menu-pill">📋 Expected soon</span>
        <span className="no-menu-pill">🔔 Stay tuned</span>
      </div>
    </motion.div>
  );
}
