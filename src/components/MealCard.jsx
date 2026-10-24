import { motion } from "framer-motion";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { MEAL_NAMES, MEAL_ICONS } from "../data/menuData";
import { getDishName } from "../data/dishesCatalog";
import MealVote from "./MealVote";

export default function MealCard({ mealKey, mealData, status, date, isConfirmed = true, index = 0 }) {
  const mealTitle = mealData?.title || MEAL_NAMES[mealKey] || mealKey.toUpperCase();
  const emojis = MEAL_ICONS[mealKey] || "🍽️";

  const statusLabel = status === "serving" ? "Now" : status === "upcoming" ? "Up Next" : "Ended";

  return (
    <motion.div
      className={`meal-card ${status}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      id={`meal-card-${mealKey}`}
    >
      {/* Header: Title + Status + Planned/Confirmed Tag */}
      <div className="meal-card-header">
        <div>
          <h3 className="meal-card-name">{mealTitle}</h3>
          {mealData.theme && <p className="meal-card-theme">Theme: {mealData.theme}</p>}
          <span className={`meal-confirmation-badge ${isConfirmed ? "confirmed" : "planned"}`}>
            {isConfirmed ? (
              <>
                <CheckCircle size={11} /> Confirmed Menu
              </>
            ) : (
              <>
                <AlertCircle size={11} /> Planned Menu
              </>
            )}
          </span>
          {!isConfirmed && (
            <p className="meal-card-subject-to-change">⚠️ Subject to change on the day</p>
          )}
        </div>
        <div className="meal-card-header-right">
          <div className="meal-card-illustration desktop-illustration" aria-hidden="true">
            {emojis}
          </div>
          <span className={`meal-card-status ${status}`}>{statusLabel}</span>
        </div>
      </div>

      <div className="meal-card-timing">
        <Clock size={14} />
        <span>
          {mealData.timing.start} to {mealData.timing.end}
        </span>
      </div>

      {/* Food items */}
      <div className="meal-card-body">
        <div className="meal-card-info">
          <div className="meal-card-food-items meal-card-group meal-card-food-group">
            <strong className="meal-group-label">Food : </strong>
            <div className="meal-items-wrapper">
              {mealData.food.map((dishId, idx) => {
                const dishName = getDishName(dishId);
                return (
                  <span key={idx} className="food-item-span meal-item-chip">
                    <span className="food-item-name">{dishName}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {mealData.beverages && mealData.beverages.length > 0 && (
            <div className="meal-card-beverages meal-card-group meal-card-beverages-group">
              <strong className="meal-group-label">Beverages : </strong>
              <div className="meal-items-wrapper">
                {mealData.beverages.map((bev, idx) => (
                  <span key={idx} className="food-item-span meal-item-chip">
                    <span className="food-item-name">{bev}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="meal-card-illustration mobile-illustration">{emojis}</div>
      </div>
      {date && <MealVote date={date} mealKey={mealKey} mealTitle={mealTitle} timing={mealData.timing} />}
    </motion.div>
  );
}
