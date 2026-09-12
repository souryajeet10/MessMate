import weeklyMenu, { MEAL_ORDER, getMenuForDate, getMenuRotationKey } from "../data/menuData.js";
import { db } from "../services/firebase.js";
import { ref, set, remove, get } from "firebase/database";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const LOCAL_CACHE_KEY = "messmate_menu_overrides";

// ─── Local Cache Helpers (offline fallback) ───────────────────────────────────

function readLocalCache() {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLocalCache(data) {
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data ?? {}));
  } catch {
    // ignore quota errors
  }
}

// ─── Public Read (used by getDayMenu / legacy callers) ───────────────────────

/**
 * Returns current overrides from localStorage cache.
 * The cache is kept fresh by useMenuOverrides hook (Firebase onValue listener).
 */
export function getMenuOverrides() {
  return readLocalCache();
}

// ─── Firebase Write Helpers ───────────────────────────────────────────────────

/**
 * Write a single day's menu override to Firebase.
 * Also updates local cache immediately so the writing device sees the change instantly.
 */
export async function updateDayMenu(dayName, dayObj, date = new Date()) {
  const rotationKey = getMenuRotationKey(date);
  const key = `${rotationKey}_${dayName}`;

  // Update local cache instantly (writing device gets immediate feedback)
  const current = readLocalCache();
  current[key] = dayObj;
  writeLocalCache(current);

  // Push to Firebase — all other devices will update via their onValue listeners
  try {
    await set(ref(db, `menu_overrides/${key}`), dayObj);
  } catch (err) {
    console.error("[MessMate] Failed to sync to Firebase:", err);
    // Local cache is already updated — at least this device sees the change
  }
}

/**
 * Save confirmation status for a day.
 */
export async function setDayConfirmation(dayName, isConfirmed, date = new Date()) {
  const rotationKey = getMenuRotationKey(date);
  const key = `${rotationKey}_${dayName}`;
  const overrides = readLocalCache();
  const baseDay = getMenuForDate(date)[dayName];

  if (!overrides[key]) {
    overrides[key] = { ...baseDay };
  }
  overrides[key].isConfirmed = isConfirmed;
  writeLocalCache(overrides);

  try {
    await set(ref(db, `menu_overrides/${key}`), overrides[key]);
  } catch (err) {
    console.error("[MessMate] Failed to sync confirmation to Firebase:", err);
  }
}

/**
 * Reset all menu overrides back to default — deletes the entire Firebase node.
 */
export async function resetMenuOverrides() {
  // Clear local cache immediately
  localStorage.removeItem(LOCAL_CACHE_KEY);

  try {
    await remove(ref(db, "menu_overrides"));
  } catch (err) {
    console.error("[MessMate] Failed to reset Firebase overrides:", err);
  }
}

// ─── Menu Resolution (unchanged logic, reads from cache) ──────────────────────

function getCurrentMinutes(date = new Date()) {
  return date.getHours() * 60 + date.getMinutes();
}

function parseTime(timeStr) {
  if (!timeStr) return 0;
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function getTodayName(date = new Date()) {
  return DAY_NAMES[date.getDay()];
}

/**
 * Get a specific day's menu merged with overrides.
 * Accepts an optional `overrides` map — pass from useMenuOverrides hook for
 * reactive re-renders. Falls back to localStorage cache if not provided.
 */
function applyDateMenuException(dayMenu, dayName, date) {
  // One-off combined service on September 13, 2026 only.
  if (date.getFullYear() !== 2026 || date.getMonth() !== 8 ||
      date.getDate() !== 13 || dayName !== "Sunday") return dayMenu;

  return {
    ...dayMenu,
    hitea: null,
    dinner: {
      title: "HI-TEA & Dinner",
      timing: { start: "5:30 PM", end: "8:00 PM" },
      food: ["veg-puff", "pink-sauce-pasta", "hot-pot-rice"],
      beverages: ["Tea", "Coffee"],
    },
  };
}

export function getDayMenu(dayName, date = new Date(), overrides = null) {
  const dateMenu = getMenuForDate(date);
  if (!dateMenu) return null; // No menu loaded for this month
  const baseDayMenu = dateMenu[dayName] || null;
  if (!baseDayMenu) return null;

  const resolvedOverrides = overrides ?? readLocalCache();
  const rotationKey = getMenuRotationKey(date);
  // Only use rotation-scoped overrides (e.g. "week_1_and_3_Sunday")
  // The legacy plain dayName fallback is intentionally removed — it caused
  // week_2_and_4 overrides to bleed into week_1_and_3 days (and vice versa).
  const overrideDay = rotationKey
    ? resolvedOverrides[`${rotationKey}_${dayName}`]
    : null;

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

    return applyDateMenuException({
      ...baseDayMenu,
      isConfirmed: overrideDay.isConfirmed ?? baseDayMenu.isConfirmed,
      breakfast: mergeMeal("breakfast"),
      lunch: mergeMeal("lunch"),
      hitea: mergeMeal("hitea"),
      dinner: mergeMeal("dinner"),
    }, dayName, date);
  }
  return applyDateMenuException(baseDayMenu, dayName, date);
}

export function getTodayMenu(date = new Date(), overrides = null) {
  const dayName = getTodayName(date);
  return getDayMenu(dayName, date, overrides);
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function getMealStatus(meal, mealData, date = new Date()) {
  if (!mealData || !mealData.timing) return "unknown";
  const now = getCurrentMinutes(date);
  const start = parseTime(mealData.timing.start);
  const end = parseTime(mealData.timing.end);

  if (now >= start && now <= end) return "serving";
  if (now < start) return "upcoming";
  return "ended";
}

export function getCurrentMeal(date = new Date(), overrides = null) {
  const todayMenu = getTodayMenu(date, overrides);
  if (!todayMenu) return null;

  for (const mealKey of MEAL_ORDER) {
    const status = getMealStatus(mealKey, todayMenu[mealKey], date);
    if (status === "serving") {
      return { key: mealKey, data: todayMenu[mealKey], status: "serving" };
    }
  }

  for (const mealKey of MEAL_ORDER) {
    const status = getMealStatus(mealKey, todayMenu[mealKey], date);
    if (status === "upcoming") {
      return { key: mealKey, data: todayMenu[mealKey], status: "upcoming" };
    }
  }

  return { key: "dinner", data: todayMenu.dinner, status: "ended" };
}

export function getAllMealStatuses(date = new Date(), overrides = null) {
  const todayMenu = getTodayMenu(date, overrides);
  if (!todayMenu) return {};

  const statuses = {};
  for (const mealKey of MEAL_ORDER) {
    statuses[mealKey] = getMealStatus(mealKey, todayMenu[mealKey], date);
  }
  return statuses;
}

export function getCurrentMealLabel(date = new Date(), overrides = null) {
  const current = getCurrentMeal(date, overrides);
  if (!current) return "No Meals Today";

  const mealName =
    current.key === "hitea"
      ? "HI-TEA"
      : current.key.charAt(0).toUpperCase() + current.key.slice(1);

  if (current.status === "serving") return `It's ${mealName} Time`;
  if (current.status === "upcoming") return `${mealName} Coming Up`;
  return "All Meals Done";
}

export function formatCurrentTime(date = new Date()) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDate(date = new Date()) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
