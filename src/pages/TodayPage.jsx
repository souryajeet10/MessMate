import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTodayMenu, getTodayName, getMealStatus } from "../utils/menuUtils";
import { MEAL_ORDER } from "../data/menuData";
import Header from "../components/Header";
import MealCard from "../components/MealCard";

export default function TodayPage({ onMenuClick }) {
  const navigate = useNavigate();
  const todayMenu = getTodayMenu();
  const todayName = getTodayName();

  return (
    <div className="page-enter">
      <Header onMenuClick={onMenuClick} />

      {/* Section label */}
      <div className="today-label">
        <span className="today-label-text">
          Today's Menu for United Homes ▾
        </span>
        <div className="today-label-nav">
          <button
            onClick={() => navigate("/calendar")}
            aria-label="View calendar"
            id="today-calendar-btn"
          >
            <Calendar size={16} />
          </button>
          <button aria-label="Previous" id="today-prev-btn">
            <ChevronLeft size={16} />
          </button>
          <button aria-label="Next" id="today-next-btn">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Meal cards — serving meal first, then upcoming, then ended */}
      <div className="meals-container">
        {todayMenu &&
          (() => {
            const statusPriority = { serving: 0, upcoming: 1, ended: 2 };
            const meals = MEAL_ORDER.map((mealKey) => ({
              mealKey,
              mealData: todayMenu[mealKey],
              status: getMealStatus(mealKey, todayMenu[mealKey]),
            })).filter((m) => m.mealData);

            meals.sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);

            return meals.map((m, i) => (
              <MealCard
                key={m.mealKey}
                mealKey={m.mealKey}
                mealData={m.mealData}
                status={m.status}
                day={todayName}
                isConfirmed={todayMenu?.isConfirmed ?? true}
                index={i}
              />
            ));
          })()}
      </div>
    </div>
  );
}
