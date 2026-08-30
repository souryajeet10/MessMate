import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { getDayMenu, getMealStatus } from "../utils/menuUtils";
import { DAY_ORDER, MEAL_ORDER } from "../data/menuData";
import { useMenuOverrides } from "../hooks/useMenuOverrides";
import MealCard from "./MealCard";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarView() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const { overrides } = useMenuOverrides();

  // Generate 14-day window around selected date or month
  const [startDateOffset, setStartDateOffset] = useState(-3); // Start 3 days before today

  const datesList = [];
  const baseDate = new Date(today);
  baseDate.setDate(today.getDate() + startDateOffset);

  for (let i = 0; i < 14; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    datesList.push(d);
  }

  const handlePrevDays = () => {
    setStartDateOffset((prev) => prev - 7);
  };

  const handleNextDays = () => {
    setStartDateOffset((prev) => prev + 7);
  };

  // Selected date day name
  const selectedDayName = DAY_ORDER[selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1]; // Convert Sun(0)->Sunday(6)
  const isToday =
    selectedDate.getDate() === today.getDate() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear();

  const dayMenu = getDayMenu(selectedDayName, selectedDate, overrides);

  const formattedMonthYear = `${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  return (
    <div className="weekly-page page-enter">
      {/* Month Year Header matching Messit Web */}
      <div className="messit-calendar-header">
        <h2 className="messit-month-title">{formattedMonthYear}</h2>
      </div>

      {/* Date Pill Carousel Strip */}
      <div className="messit-date-carousel">
        <button
          className="messit-nav-arrow"
          onClick={handlePrevDays}
          aria-label="Previous days"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="messit-date-pills">
          {datesList.map((dateObj) => {
            const isSelected =
              dateObj.getDate() === selectedDate.getDate() &&
              dateObj.getMonth() === selectedDate.getMonth() &&
              dateObj.getFullYear() === selectedDate.getFullYear();
            const dayName = DAY_NAMES_SHORT[dateObj.getDay()];

            return (
              <button
                key={dateObj.toISOString()}
                className={`messit-date-pill ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedDate(dateObj)}
              >
                <span className="messit-pill-day">{dayName}</span>
                <span className="messit-pill-num">{dateObj.getDate()}</span>
              </button>
            );
          })}
        </div>

        <button
          className="messit-nav-arrow"
          onClick={handleNextDays}
          aria-label="Next days"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 2x2 Grid Meal Cards */}
      <div className="messit-meals-grid-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate.toISOString()}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="messit-meals-2x2-grid"
          >
            {dayMenu &&
              MEAL_ORDER.map((mealKey, i) => {
                const mealData = dayMenu[mealKey];
                if (!mealData) return null;
                const status = isToday ? getMealStatus(mealKey, mealData) : "upcoming";
                return (
                  <MealCard
                    key={`${selectedDayName}-${mealKey}`}
                    mealKey={mealKey}
                    mealData={mealData}
                    status={status}
                    day={selectedDayName}
                    isConfirmed={dayMenu?.isConfirmed ?? false}
                    index={i}
                  />
                );
              })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
