import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle, AlertCircle, RotateCcw, Check, ChevronLeft, ChevronRight, Plus, X, Search, Zap, Filter } from "lucide-react";
import { getDayMenu, updateDayMenu, resetMenuOverrides } from "../utils/menuUtils";
import { DAY_ORDER, MEAL_ORDER, MEAL_NAMES } from "../data/menuData";
import { DISHES_CATALOG, getDishName } from "../data/dishesCatalog";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DISH_CATEGORIES = ["All", "Breakfast", "HI-TEA", "Main Course", "Rice & Biryani", "Breads", "Sweets", "Sides"];

export default function AdminPanel() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [startDateOffset, setStartDateOffset] = useState(-3);

  // Selected day name
  const selectedDayName = DAY_ORDER[selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1]; // Convert Sun(0)->Sunday(6)
  
  // State for the selected day's menu
  const [dayMenu, setDayMenu] = useState(() => getDayMenu(selectedDayName, today));
  const [activeMealEdit, setActiveMealEdit] = useState("breakfast");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dishSearchQuery, setDishSearchQuery] = useState("");
  const [autoSaveToast, setAutoSaveToast] = useState(false);

  // Generate 14-day date window for calendar carousel
  const datesList = [];
  const baseDate = new Date(today);
  baseDate.setDate(today.getDate() + startDateOffset);

  for (let i = 0; i < 14; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    datesList.push(d);
  }

  const handleDateSelect = (dateObj) => {
    setSelectedDate(dateObj);
    const dayName = DAY_ORDER[dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1];
    setDayMenu(getDayMenu(dayName, dateObj));
    setAutoSaveToast(false);
  };

  const handlePrevDays = () => setStartDateOffset((prev) => prev - 7);
  const handleNextDays = () => setStartDateOffset((prev) => prev + 7);

  // Instant Auto-Save on Confirmation Status Toggle
  const handleConfirmationToggle = () => {
    const current = dayMenu || { isConfirmed: false };
    const newStatus = !current.isConfirmed;
    const updatedDay = { ...current, isConfirmed: newStatus };
    setDayMenu(updatedDay);
    updateDayMenu(selectedDayName, updatedDay, selectedDate);
    triggerAutoSaveToast();
  };

  // Instant Auto-Save on Dish Tap
  const handleToggleDishInMeal = (mealKey, dishId) => {
    const current = dayMenu || { isConfirmed: true };
    const meal = current[mealKey] || { food: [], beverages: [] };
    const currentFood = meal.food || [];
    let updatedFood;
    if (currentFood.includes(dishId)) {
      updatedFood = currentFood.filter((id) => id !== dishId);
    } else {
      updatedFood = [...currentFood, dishId];
    }

    const updatedDay = {
      ...current,
      [mealKey]: {
        ...meal,
        food: updatedFood,
      },
    };
    setDayMenu(updatedDay);
    updateDayMenu(selectedDayName, updatedDay, selectedDate);
    triggerAutoSaveToast();
  };

  const handleReset = () => {
    if (confirm("Reset all custom menu edits back to default?")) {
      resetMenuOverrides();
      setDayMenu(getDayMenu(selectedDayName, selectedDate));
      triggerAutoSaveToast();
    }
  };

  const triggerAutoSaveToast = () => {
    setAutoSaveToast(true);
    setTimeout(() => setAutoSaveToast(false), 1800);
  };

  const formattedMonthYear = `${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
  const formattedSelectedDate = selectedDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const filteredCatalog = DISHES_CATALOG.filter((dish) => {
    const matchesSearch =
      dish.name.toLowerCase().includes(dishSearchQuery.toLowerCase()) ||
      dish.category.toLowerCase().includes(dishSearchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || dish.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const safeDayMenu = dayMenu || { isConfirmed: false };

  return (
    <div className="admin-page page-enter">
      {/* Floating Instant Auto-Save Toast */}
      <AnimatePresence>
        {autoSaveToast && (
          <motion.div
            className="admin-autosave-toast"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Zap size={15} fill="#10B981" color="#10B981" />
            <span>Auto-saved Live!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="admin-header">
        <div className="admin-badge">
          <Shield size={15} /> Mess Manager Portal
        </div>
        <h1 className="admin-title">Manager Menu Editor</h1>
        <p className="admin-subtitle">
          Tap any date on calendar to toggle Confirmed/Planned & pick pre-fed dishes (Auto-saved live).
        </p>
      </div>

      {/* Month Title */}
      <div className="messit-calendar-header" style={{ margin: "10px 0 14px" }}>
        <h2 className="messit-month-title">{formattedMonthYear}</h2>
      </div>

      {/* Calendar Date Strip */}
      <div className="messit-date-carousel" style={{ marginBottom: "20px" }}>
        <button className="messit-nav-arrow" onClick={handlePrevDays} aria-label="Previous">
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
                onClick={() => handleDateSelect(dateObj)}
              >
                <span className="messit-pill-day">{dayName}</span>
                <span className="messit-pill-num">{dateObj.getDate()}</span>
              </button>
            );
          })}
        </div>

        <button className="messit-nav-arrow" onClick={handleNextDays} aria-label="Next">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Selected Date & Confirmation Status Card */}
      <div className="admin-card">
        <div className="admin-card-row">
          <div>
            <h3 className="admin-card-day">{formattedSelectedDate} ({selectedDayName})</h3>
            <p className="admin-card-sub">
              Menu Status:{" "}
              <strong style={{ color: safeDayMenu.isConfirmed ? "#10B981" : "#F59E0B" }}>
                {safeDayMenu.isConfirmed ? "Confirmed Menu" : "Planned Menu (Subject to change)"}
              </strong>
            </p>
          </div>

          <button
            className={`admin-toggle-switch ${safeDayMenu.isConfirmed ? "confirmed" : "planned"}`}
            onClick={handleConfirmationToggle}
          >
            {safeDayMenu.isConfirmed ? (
              <>
                <CheckCircle size={14} /> Confirmed
              </>
            ) : (
              <>
                <AlertCircle size={14} /> Planned
              </>
            )}
          </button>
        </div>
      </div>

      {/* Meal Slot Tabs for Editing */}
      <div className="admin-meal-tabs">
        {MEAL_ORDER.map((mealKey) => {
          const mealTitle = MEAL_NAMES[mealKey] || mealKey;
          const count = safeDayMenu[mealKey]?.food?.length || 0;

          return (
            <button
              key={mealKey}
              className={`admin-meal-tab ${activeMealEdit === mealKey ? "active" : ""}`}
              onClick={() => setActiveMealEdit(mealKey)}
            >
              <span>{mealTitle}</span>
              <span className="admin-meal-tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Meal Pre-fed Dish Selector */}
      <div className="admin-dish-picker-card">
        <div className="admin-dish-picker-header">
          <div>
            <strong>Editing {MEAL_NAMES[activeMealEdit]} Dishes</strong>
            <p className="admin-dish-picker-sub">
              Tap any dish from pre-fed list below to instantly add or remove it.
            </p>
          </div>
        </div>

        {/* Selected Dishes Chips */}
        <div className="admin-selected-dishes-chips">
          {(safeDayMenu[activeMealEdit]?.food || []).map((dishId) => (
            <span key={dishId} className="admin-selected-chip">
              <span>{getDishName(dishId)}</span>
              <button
                type="button"
                onClick={() => handleToggleDishInMeal(activeMealEdit, dishId)}
                aria-label="Remove dish"
              >
                <X size={13} />
              </button>
            </span>
          ))}
          {(safeDayMenu[activeMealEdit]?.food || []).length === 0 && (
            <p className="no-dishes-text">No dishes selected for {MEAL_NAMES[activeMealEdit]}. Tap below to add.</p>
          )}
        </div>

        {/* Master Catalog Category Filters & Search */}
        <div className="admin-category-filter-strip">
          {DISH_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`admin-cat-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="prefed-search-bar" style={{ margin: "12px 0" }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            className="prefed-search-input"
            placeholder="Search dishes to tap..."
            value={dishSearchQuery}
            onChange={(e) => setDishSearchQuery(e.target.value)}
          />
        </div>

        <div className="prefed-dishes-grid" style={{ maxHeight: "220px" }}>
          {filteredCatalog.map((dish) => {
            const isSelected = (safeDayMenu[activeMealEdit]?.food || []).includes(dish.id);

            return (
              <button
                key={dish.id}
                className={`prefed-dish-btn ${isSelected ? "selected" : ""}`}
                onClick={() => handleToggleDishInMeal(activeMealEdit, dish.id)}
                type="button"
              >
                {isSelected ? <Check size={14} color="#0284C7" /> : <Plus size={14} color="var(--text-muted)" />}
                <span>{dish.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Action */}
      <div className="admin-actions" style={{ marginTop: "20px", justifyContent: "center" }}>
        <button className="admin-reset-btn" onClick={handleReset}>
          <RotateCcw size={16} /> Reset Menu to Default
        </button>
      </div>
    </div>
  );
}
