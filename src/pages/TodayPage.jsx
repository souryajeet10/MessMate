import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDayMenu, getTodayName, getMealStatus, formatDate } from "../utils/menuUtils";
import { MEAL_ORDER, DAY_ORDER } from "../data/menuData";
import Header from "../components/Header";
import MealCard from "../components/MealCard";

export default function TodayPage({ onMenuClick }) {
  const navigate = useNavigate();
  const today = new Date();
  const todayName = getTodayName(today);

  const [dayOffset, setDayOffset] = useState(0);

  // Compute the selected date based on offset
  const selectedDate = new Date(today);
  selectedDate.setDate(today.getDate() + dayOffset);

  const selectedDayName = getTodayName(selectedDate);
  const dayMenu = getDayMenu(selectedDayName, selectedDate);
  const isToday = dayOffset === 0;

  const formattedDate = selectedDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const goPrev = () => setDayOffset((prev) => prev - 1);
  const goNext = () => setDayOffset((prev) => prev + 1);
  const goToday = () => setDayOffset(0);

  // Separate serving meal from the rest
  const allMeals = dayMenu
    ? MEAL_ORDER.map((mealKey) => {
        const mealData = dayMenu[mealKey];
        const status = isToday ? getMealStatus(mealKey, mealData) : "upcoming";
        return { mealKey, mealData, status };
      }).filter((m) => m.mealData)
    : [];

  const servingMeal = isToday ? allMeals.find((m) => m.status === "serving") : null;
  const otherMeals = isToday
    ? allMeals.filter((m) => m.status !== "serving")
    : allMeals;

  // Sort other meals: upcoming first, then ended
  const statusPriority = { upcoming: 0, ended: 1 };
  if (isToday) {
    otherMeals.sort((a, b) => (statusPriority[a.status] ?? 2) - (statusPriority[b.status] ?? 2));
  }

  return (
    <div className="page-enter">
      <Header onMenuClick={onMenuClick} />

      {/* Date display */}
      <div className="today-date-strip">
        <span className="today-date-text">{formattedDate}</span>
      </div>

      {/* Currently Serving — Hero Card (Above Today's Menu label) */}
      {servingMeal && (
        <div className="serving-hero-container">
          <div className="serving-hero-section">
            <p className="serving-hero-label">🟢 Currently Serving</p>
            <MealCard
              mealKey={servingMeal.mealKey}
              mealData={servingMeal.mealData}
              status={servingMeal.status}
              day={selectedDayName}
              isConfirmed={dayMenu?.isConfirmed ?? true}
              index={0}
            />
          </div>
        </div>
      )}

      {/* Section label */}
      <div className="today-label">
        <span className="today-label-text">
          {isToday ? "Today's" : selectedDayName + "'s"} Menu for United Homes
        </span>
        <div className="today-label-nav">
          <button
            onClick={() => navigate("/calendar")}
            aria-label="View calendar"
            id="today-calendar-btn"
            title="Calendar view"
          >
            <Calendar size={16} />
          </button>
          <button onClick={goPrev} aria-label="Previous day" id="today-prev-btn" title="Previous day">
            <ChevronLeft size={16} />
          </button>
          {!isToday && (
            <button onClick={goToday} aria-label="Back to today" id="today-today-btn" title="Back to today">
              Today
            </button>
          )}
          <button onClick={goNext} aria-label="Next day" id="today-next-btn" title="Next day">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Remaining Meal cards Grid */}
      <div className="meals-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate.toDateString()}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {otherMeals.length > 0 && (
              <div className="meals-grid">
                {otherMeals.map((m, i) => (
                  <MealCard
                    key={m.mealKey}
                    mealKey={m.mealKey}
                    mealData={m.mealData}
                    status={m.status}
                    day={selectedDayName}
                    isConfirmed={dayMenu?.isConfirmed ?? true}
                    index={i}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
