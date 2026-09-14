import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { getDayMenu, getTodayName, getMealStatus } from "../utils/menuUtils";
import { DAY_ORDER, MEAL_ORDER } from "../data/menuData";
import { useMenuOverrides } from "../hooks/useMenuOverrides";
import MealCard from "./MealCard";
import NoMenuBanner from "./NoMenuBanner";

export default function WeeklyMenu() {
  const today = new Date();
  const todayName = getTodayName(today);
  const todayIndex = DAY_ORDER.indexOf(todayName);
  const [selectedIndex, setSelectedIndex] = useState(todayIndex);

  const selectedDay = DAY_ORDER[selectedIndex];
  const { overrides } = useMenuOverrides();

  // Compute the actual calendar date for the selected day so the rotation key
  // (week_1_and_3 vs week_2_and_4) resolves correctly even when viewing a day
  // that falls in a different week than today.
  const dayOffset = selectedIndex - todayIndex;
  const selectedDate = new Date(today);
  selectedDate.setDate(today.getDate() + dayOffset);

  const dayMenu = getDayMenu(selectedDay, selectedDate, overrides);
  const currentMonthName = selectedDate.toLocaleDateString("en-IN", { month: "long" });

  const goNext = () => {
    setSelectedIndex((prev) => (prev + 1) % 7);
  };

  const goPrev = () => {
    setSelectedIndex((prev) => (prev - 1 + 7) % 7);
  };

  return (
    <div className="weekly-page page-enter">
      <div className="weekly-header">
        <h1 className="weekly-title">Weekly Menu</h1>
        <p className="weekly-subtitle">United Homes Mess</p>
        <div className="weekly-disclaimer">
          <Info size={12} />
          Reference menu — may change on the day
        </div>
      </div>

      {/* Day tabs */}
      <div className="day-tabs" id="day-tabs">
        {DAY_ORDER.map((day, i) => (
          <button
            key={day}
            className={`day-tab ${i === selectedIndex ? "active" : ""} ${
              day === todayName ? "today" : ""
            }`}
            onClick={() => setSelectedIndex(i)}
            id={`day-tab-${day.toLowerCase()}`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Navigation bar */}
      <div className="today-label">
        <span className="today-label-text">
          {selectedDay}
          {selectedDay === todayName && " (Today)"}
        </span>
        <div className="today-label-nav">
          <button onClick={goPrev} aria-label="Previous day" id="week-nav-prev">
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setSelectedIndex(todayIndex)}
            aria-label="Go to today"
            id="week-nav-today"
          >
            <Calendar size={16} />
          </button>
          <button onClick={goNext} aria-label="Next day" id="week-nav-next">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Meal cards */}
      <div className="meals-container" style={{ paddingBottom: "100px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {!dayMenu ? (
              <NoMenuBanner month={currentMonthName} />
            ) : (
              MEAL_ORDER.map((mealKey, i) => {
                const mealData = dayMenu[mealKey];
                if (!mealData) return null;
                const status =
                  selectedDay === todayName
                    ? getMealStatus(mealKey, mealData)
                    : "upcoming";
                return (
                  <MealCard
                    key={`${selectedDay}-${mealKey}`}
                    mealKey={mealKey}
                    mealData={mealData}
                    status={status}
                    day={selectedDay}
                    index={i}
                  />
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
