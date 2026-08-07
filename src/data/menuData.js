// MESSMATE Weekly & Monthly Menu Data for Karnavati University
// Dynamically imported from auguyst menu.json for 100% accurate notifications & favorite tracking.
import rawAugustMenu from "./auguyst menu.json" with { type: "json" };

const DAY_ORDER_LIST = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const defaultTimings = {
  breakfast: { start: "6:30 AM", end: "9:00 AM" },
  lunch: { start: "12:00 PM", end: "2:30 PM" },
  hitea: { start: "5:30 PM", end: "6:30 PM" },
  dinner: { start: "8:00 PM", end: "9:30 PM" },
};

const slugify = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

function buildWeeklyMenu(raw) {
  const menu = {};

  DAY_ORDER_LIST.forEach((day) => {
    const bfDays = raw.breakfast?.days?.[day] || [];
    const bfDaily = raw.breakfast?.daily || [];
    const bfFood = [...bfDays, ...bfDaily];

    const lunchDayObj = raw.lunch?.days?.[day] || {};
    const lunchDaily = raw.lunch?.daily || [];
    const lunchFoodValues = Object.values(lunchDayObj).filter(
      (v) => v && v !== lunchDayObj.drink
    );
    const lunchFood = [...lunchFoodValues, ...lunchDaily];
    const lunchDrink = lunchDayObj.drink || "Buttermilk";

    const snackDay = raw.evening_snacks?.days?.[day] || "";
    const snackFood = snackDay ? [snackDay] : [];

    const dinnerDayObj = raw.dinner?.days?.[day] || {};
    const dinnerFood = Object.values(dinnerDayObj).filter(Boolean);

    menu[day] = {
      isConfirmed: true,
      breakfast: {
        timing: defaultTimings.breakfast,
        food: bfFood.map(slugify),
        beverages: ["Milk", "Tea", "Coffee", "Detox Water"],
      },
      lunch: {
        timing: defaultTimings.lunch,
        food: lunchFood.length > 0 ? lunchFood.map(slugify) : ["khichdi", "choice-of-salad"],
        beverages: [lunchDrink, "Water"],
      },
      hitea: {
        timing: defaultTimings.hitea,
        food: snackFood.map(slugify),
        beverages: ["Tea", "Coffee"],
      },
      dinner: {
        timing: defaultTimings.dinner,
        food: dinnerFood.map(slugify),
        beverages: ["Milk", "Water"],
      },
    };
  });

  return menu;
}

const weeklyMenu = buildWeeklyMenu(rawAugustMenu);

export const MEAL_ORDER = ["breakfast", "lunch", "hitea", "dinner"];

export const MEAL_NAMES = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  hitea: "HI-TEA",
  dinner: "Dinner",
};

export const DAY_ORDER = DAY_ORDER_LIST;

export const MEAL_ICONS = {
  breakfast: "☀️🍳",
  lunch: "🍛🥘",
  hitea: "☕🧃",
  dinner: "🌙🌯",
};

export default weeklyMenu;
