import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { getDayMenu, getTodayName, getMealStatus } from "../utils/menuUtils";
import { DAY_ORDER, MEAL_ORDER } from "../data/menuData";
import { useMenuOverrides } from "../hooks/useMenuOverrides";
import MealCard from "./MealCard";
import NoMenuBanner from "./NoMenuBanner";
import { useSiteClock } from "../hooks/useSiteClock";
import { dateForWeekday, isSameCalendarDate, shiftCalendarDate } from "../utils/weeklyMenuDate";

export default function WeeklyMenu() {
  const { now: today } = useSiteClock();
  const todayName = getTodayName(today);
  const [selectedDate, setSelectedDate] = useState(() => new Date(today));
  const selectedIndex = (selectedDate.getDay() + 6) % 7;
  const selectedDay = DAY_ORDER[selectedIndex];
  const isToday = isSameCalendarDate(selectedDate, today);
  const { overrides } = useMenuOverrides();

  const dayMenu = getDayMenu(selectedDay, selectedDate, overrides);
  const currentMonthName = selectedDate.toLocaleDateString("en-IN", { month: "long" });

  const goNext = () => {
    setSelectedDate((prev) => shiftCalendarDate(prev, 1));
  };

  const goPrev = () => {
    setSelectedDate((prev) => shiftCalendarDate(prev, -1));
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
              day === todayName && isSameCalendarDate(dateForWeekday(selectedDate, i), today) ? "today" : ""
            }`}
            onClick={() => setSelectedDate((prev) => dateForWeekday(prev, i))}
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
          {isToday && " (Today)"}
        </span>
        <div className="today-label-nav">
          <button onClick={goPrev} aria-label="Previous day" id="week-nav-prev">
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setSelectedDate(new Date(today))}
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
            key={selectedDate.toDateString()}
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
                  isToday
                    ? getMealStatus(mealKey, mealData, today)
                    : "upcoming";
                return (
                  <MealCard
                    key={`${selectedDay}-${mealKey}`}
                    mealKey={mealKey}
                    mealData={mealData}
                    status={status}
                    date={selectedDate}
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
