import weeklyMenu, { MEAL_ORDER, getMenuForDate, getMenuRotationKey } from "../data/menuData.js";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MENU_OVERRIDES_KEY = "messmate_menu_overrides";

/**
 * Get menu overrides from localStorage
 */
export function getMenuOverrides() {
  try {
    const raw = localStorage.getItem(MENU_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save confirmation status for a day
 */
export function setDayConfirmation(dayName, isConfirmed, date = new Date()) {
  const rotationKey = getMenuRotationKey(date);
  const key = `${rotationKey}_${dayName}`;
  const overrides = getMenuOverrides();
  const baseDay = getMenuForDate(date)[dayName];
  if (!overrides[key]) {
    overrides[key] = { ...baseDay };
  }
  overrides[key].isConfirmed = isConfirmed;
  localStorage.setItem(MENU_OVERRIDES_KEY, JSON.stringify(overrides));
  return overrides;
}

/**
 * Update full day menu
 */
export function updateDayMenu(dayName, dayObj, date = new Date()) {
  const rotationKey = getMenuRotationKey(date);
  const key = `${rotationKey}_${dayName}`;
  const overrides = getMenuOverrides();
  overrides[key] = dayObj;
  localStorage.setItem(MENU_OVERRIDES_KEY, JSON.stringify(overrides));
  return overrides;
}

/**
 * Reset all menu overrides back to default
 */
export function resetMenuOverrides() {
  localStorage.removeItem(MENU_OVERRIDES_KEY);
}

/**
 * Get current minutes since midnight
 */
function getCurrentMinutes(date = new Date()) {
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * Parse a time string like "6:30 AM" into minutes since midnight
 */
function parseTime(timeStr) {
  if (!timeStr) return 0;
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

/**
 * Get today's day name
 */
export function getTodayName(date = new Date()) {
  return DAY_NAMES[date.getDay()];
}

/**
 * Get a specific day's menu (merged with admin overrides and date rotation)
 */
export function getDayMenu(dayName, date = new Date()) {
  const dateMenu = getMenuForDate(date);
  const baseDayMenu = dateMenu[dayName] || null;
  if (!baseDayMenu) return null;

  const rotationKey = getMenuRotationKey(date);
  const overrides = getMenuOverrides();
  const overrideDay = overrides[`${rotationKey}_${dayName}`] || overrides[dayName];

  if (overrideDay) {
    const mergeMeal = (mealKey) => {
      const baseMeal = baseDayMenu[mealKey];
      const overMeal = overrideDay[mealKey];
      if (!overMeal) return baseMeal;
      if (!baseMeal) return overMeal;
      return {
        ...overMeal,
        timing: baseMeal.timing || overMeal.timing,
      };
    };

    return {
      ...baseDayMenu,
      isConfirmed: overrideDay.isConfirmed ?? baseDayMenu.isConfirmed,
      breakfast: mergeMeal("breakfast"),
      lunch: mergeMeal("lunch"),
      hitea: mergeMeal("hitea"),
      dinner: mergeMeal("dinner"),
    };
  }
  return baseDayMenu;
}

/**
 * Get today's full menu (merged with admin overrides)
 */
export function getTodayMenu(date = new Date()) {
  const dayName = getTodayName(date);
  return getDayMenu(dayName, date);
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

/**
 * Get status of a specific meal: "serving", "upcoming", "ended"
 */
export function getMealStatus(meal, mealData, date = new Date()) {
  if (!mealData || !mealData.timing) return "unknown";
  const now = getCurrentMinutes(date);
  const start = parseTime(mealData.timing.start);
  const end = parseTime(mealData.timing.end);

  if (now >= start && now <= end) return "serving";
  if (now < start) return "upcoming";
  return "ended";
}

/**
 * Get the currently serving or next upcoming meal
 */
export function getCurrentMeal(date = new Date()) {
  const todayMenu = getTodayMenu(date);
  if (!todayMenu) return null;

  // Check if any meal is currently serving
  for (const mealKey of MEAL_ORDER) {
    const status = getMealStatus(mealKey, todayMenu[mealKey], date);
    if (status === "serving") {
      return { key: mealKey, data: todayMenu[mealKey], status: "serving" };
    }
  }

  // Find next upcoming meal
  for (const mealKey of MEAL_ORDER) {
    const status = getMealStatus(mealKey, todayMenu[mealKey], date);
    if (status === "upcoming") {
      return { key: mealKey, data: todayMenu[mealKey], status: "upcoming" };
    }
  }

  // All meals ended
  return { key: "dinner", data: todayMenu.dinner, status: "ended" };
}

/**
 * Get status for all meals today
 */
export function getAllMealStatuses(date = new Date()) {
  const todayMenu = getTodayMenu(date);
  if (!todayMenu) return {};

  const statuses = {};
  for (const mealKey of MEAL_ORDER) {
    statuses[mealKey] = getMealStatus(mealKey, todayMenu[mealKey], date);
  }
  return statuses;
}

/**
 * Get the current meal time label
 */
export function getCurrentMealLabel(date = new Date()) {
  const current = getCurrentMeal(date);
  if (!current) return "No Meals Today";

  const mealName = current.key === "hitea" ? "HI-TEA" : current.key.charAt(0).toUpperCase() + current.key.slice(1);

  if (current.status === "serving") {
    return `It's ${mealName} Time`;
  }
  if (current.status === "upcoming") {
    return `${mealName} Coming Up`;
  }
  return "All Meals Done";
}

/**
 * Format time for display
 */
export function formatCurrentTime(date = new Date()) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format date for display
 */
export function formatDate(date = new Date()) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
