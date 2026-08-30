import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Heart,
  Bell,
  Calendar,
  UtensilsCrossed,
  ArrowRight,
  Construction,
  Clock,
} from "lucide-react";

export default function FavouritesPage() {
  const navigate = useNavigate();

  const upcomingFeatures = [
    {
      icon: <Heart size={20} className="feature-icon heart" />,
      title: "Dish Bookmarking",
      desc: "Save your favorite curries, biryanis & desserts with a single tap.",
    },
    {
      icon: <Bell size={20} className="feature-icon bell" />,
      title: "Smart Serving Alerts",
      desc: "Get notified the moment your favorite dish is being served in mess.",
    },
    {
      icon: <Calendar size={20} className="feature-icon calendar" />,
      title: "Weekly Favorite Forecast",
      desc: "See a customized calendar highlighting all upcoming favorite meals.",
    },
  ];

  return (
    <div className="favourites-page page-enter">
      <div className="under-dev-container">
        {/* Animated Status Pill */}
        <motion.div
          className="under-dev-pill"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Construction size={15} className="under-dev-pill-icon" />
          <span>Under Active Development</span>
        </motion.div>

        {/* Hero Visual Section: Side-by-Side Food Mascot & Animated Developer Coding Scene */}
        <motion.div
          className="under-dev-hero-row"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Left: Food Mascot Bubble */}
          <div className="under-dev-icon-bubble">
            <span className="under-dev-mascot">🥘</span>
            <motion.div
              className="under-dev-float-icon fav-heart"
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            >
              <Heart size={20} fill="#EF4444" color="#EF4444" />
            </motion.div>
            <motion.div
              className="under-dev-float-icon fav-sparkle"
              animate={{ y: [4, -4, 4], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles size={16} color="#F59E0B" fill="#F59E0B" />
            </motion.div>
          </div>

          {/* Central Animated Pulse / Synergy */}
          <motion.div
            className="under-dev-hero-connector"
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.92, 1.08, 0.92] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <span className="connector-spark">⚡</span>
          </motion.div>

          {/* Right: Custom Interactive Animated Developer Coding Scene */}
          <div className="under-dev-coding-scene">
            {/* Floating Code Bracket Badge */}
            <motion.div
              className="scene-floating-badge code-badge"
              animate={{ y: [-3, 4, -3], rotate: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            >
              <span>&lt;/&gt;</span>
            </motion.div>

            {/* Floating Coffee Badge with Animated Steam */}
            <motion.div
              className="scene-floating-badge coffee-badge"
              animate={{ y: [3, -4, 3] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            >
              <span>☕</span>
            </motion.div>

            {/* Animated SVG Developer at Desk */}
            <svg
              viewBox="0 0 150 110"
              className="developer-coding-svg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Desk */}
              <rect x="12" y="86" width="126" height="5" rx="2.5" fill="var(--border)" />
              <rect x="22" y="91" width="5" height="15" rx="2" fill="var(--border)" opacity="0.6" />
              <rect x="123" y="91" width="5" height="15" rx="2" fill="var(--border)" opacity="0.6" />

              {/* Ergonomic Chair */}
              <rect x="32" y="44" width="14" height="38" rx="5" fill="#64748B" opacity="0.35" />
              <path d="M39 82V96" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round" opacity="0.35" />

              {/* Developer Body / Hoodie */}
              <path
                d="M44 62 C44 54, 64 54, 64 62 L67 86 L41 86 Z"
                fill="url(#devHoodieGrad)"
              />

              {/* Developer Head */}
              <circle cx="54" cy="40" r="12" fill="#FBBF24" />

              {/* Hair / Cap */}
              <path
                d="M43 38 C43 28, 64 26, 66 35 C64 31, 48 30, 45 38 Z"
                fill="#1E293B"
              />

              {/* Headphones */}
              <path
                d="M42 40 C42 29, 66 29, 66 40"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="42" cy="40" r="3.5" fill="#2563EB" />
              <circle cx="66" cy="40" r="3.5" fill="#2563EB" />

              {/* Typing Arm with Motion Animation */}
              <motion.path
                d="M57 70 Q72 74 80 78"
                stroke="#FBBF24"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                animate={{
                  d: [
                    "M57 70 Q72 74 80 78",
                    "M57 70 Q72 72 80 76",
                    "M57 70 Q72 74 80 78",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
              />

              {/* Laptop Base */}
              <rect x="76" y="80" width="40" height="4" rx="2" fill="#94A3B8" />

              {/* Laptop Screen */}
              <rect
                x="82"
                y="44"
                width="34"
                height="34"
                rx="3.5"
                fill="#0F172A"
                stroke="#3B82F6"
                strokeWidth="1.2"
              />

              {/* Animated Glowing Code Syntax Lines on Screen */}
              <motion.rect
                x="86"
                y="50"
                width="16"
                height="2.2"
                rx="1"
                fill="#38BDF8"
                animate={{ width: [8, 22, 16], opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              />
              <motion.rect
                x="86"
                y="56"
                width="22"
                height="2.2"
                rx="1"
                fill="#F59E0B"
                animate={{ width: [12, 24, 14], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.1, ease: "easeInOut", delay: 0.2 }}
              />
              <motion.rect
                x="90"
                y="62"
                width="14"
                height="2.2"
                rx="1"
                fill="#10B981"
                animate={{ width: [10, 18, 10], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut", delay: 0.4 }}
              />
              <motion.rect
                x="90"
                y="68"
                width="10"
                height="2.2"
                rx="1"
                fill="#EC4899"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.7 }}
              />

              {/* Gradient Defs */}
              <defs>
                <linearGradient id="devHoodieGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>

        {/* Title & Description */}
        <motion.div
          className="under-dev-text-group"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h1 className="under-dev-title">
            Cookin' Up Something <span className="highlight-text">Special!</span>
          </h1>
          <p className="under-dev-subtitle">
            <strong>Favourites & Dish Alerts</strong> is on its way. Soon you'll be able to bookmark favorite meals and get notified whenever they're on the menu.
          </p>
        </motion.div>

        {/* Feature Roadmap Preview */}
        <motion.div
          className="under-dev-features-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="under-dev-features-header">
            <Clock size={16} />
            <span>What's coming soon</span>
          </div>

          <div className="under-dev-features-grid">
            {upcomingFeatures.map((feat, idx) => (
              <div key={idx} className="under-dev-feature-item">
                <div className="under-dev-feature-icon-box">{feat.icon}</div>
                <div className="under-dev-feature-info">
                  <h4>{feat.title}</h4>
                  <p>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="under-dev-actions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <button
            className="under-dev-primary-btn"
            onClick={() => navigate("/")}
            id="under-dev-today-btn"
          >
            <UtensilsCrossed size={18} />
            <span>Today's Menu</span>
            <ArrowRight size={16} />
          </button>

          <button
            className="under-dev-secondary-btn"
            onClick={() => navigate("/calendar")}
            id="under-dev-calendar-btn"
          >
            <Calendar size={18} />
            <span>View Calendar</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}


