import { motion } from "framer-motion";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { MEAL_NAMES, MEAL_ICONS } from "../data/menuData";
import { getDishName } from "../data/dishesCatalog";

export default function MealCard({ mealKey, mealData, status, day, isConfirmed = true, index = 0 }) {
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
        <span className={`meal-card-status ${status}`}>{statusLabel}</span>
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
          <div className="meal-card-food-items">
            <strong>Food : </strong>
            {mealData.food.map((dishId, idx) => {
              const dishName = getDishName(dishId);
              return (
                <span key={idx} className="food-item-span">
                  {dishName}
                  {idx < mealData.food.length - 1 ? " , " : ""}
                </span>
              );
            })}
          </div>

          {mealData.beverages && mealData.beverages.length > 0 && (
            <p className="meal-card-beverages">
              <strong>Beverages : </strong>
              {mealData.beverages.join(" , ")}
            </p>
          )}
        </div>
        <div className="meal-card-illustration">{emojis}</div>
      </div>
    </motion.div>
  );
}
