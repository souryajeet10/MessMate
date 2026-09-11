// MESSMATE Weekly & Monthly Menu Data for Karnavati University
// Dynamically imported from auguyst menu.json for 100% accurate notifications & favorite tracking.
import rawAugustMenu from "./auguyst menu.json" with { type: "json" };
// September 2nd & 4th week menu (flat per-day format from canteen)
import rawSep2And4Menu from "./september_menu_2_4.json" with { type: "json" };

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

const saturdayTimings = {
  breakfast: { start: "7:00 AM", end: "9:30 AM" },
  lunch: { start: "12:00 PM", end: "2:30 PM" },
  hitea: { start: "5:30 PM", end: "6:30 PM" },
  dinner: { start: "8:00 PM", end: "9:30 PM" },
};

const sundayTimings = {
  breakfast: { start: "8:00 AM", end: "2:30 PM" },
  lunch: null,
  hitea: { start: "5:30 PM", end: "6:30 PM" },
  dinner: { start: "8:00 PM", end: "9:30 PM" },
};

export const slugify = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

function extractItems(val) {
  if (!val) return [];
  if (typeof val === "string") return [val];
  if (Array.isArray(val)) return val;
  if (typeof val === "object") {
    return Object.values(val).filter((v) => typeof v === "string" && v.trim().length > 0);
  }
  return [];
}

export function buildWeeklyMenu(rawWeekData) {
  if (!rawWeekData) return {};
  const menu = {};

  DAY_ORDER_LIST.forEach((day) => {
    const dayTimings =
      day === "Sunday"
        ? sundayTimings
        : day === "Saturday"
        ? saturdayTimings
        : defaultTimings;

    // Breakfast
    const bfObj = rawWeekData.breakfast?.days?.[day];
    const bfItems = extractItems(bfObj);
    const bfDaily = rawWeekData.breakfast?.daily || [];
    const bfFoodRaw = [...bfItems, ...bfDaily];

    // Lunch
    const lunchObj = rawWeekData.lunch?.days?.[day];
    const lunchDrink = lunchObj && lunchObj.drink ? lunchObj.drink : "Buttermilk";
    let lunchFoodRaw = [];
    if (lunchObj && typeof lunchObj === "object") {
      lunchFoodRaw = Object.entries(lunchObj)
        .filter(([k, v]) => k !== "drink" && v && typeof v === "string" && v.trim().length > 0)
        .map(([_, v]) => v);
    }
    const lunchDaily = rawWeekData.lunch?.daily || [];
    lunchFoodRaw = [...lunchFoodRaw, ...lunchDaily];

    // Hi-Tea
    const snackObj = rawWeekData.hi_tea?.days?.[day] || rawWeekData.evening_snacks?.days?.[day];
    const snackFoodRaw = extractItems(snackObj);

    // Dinner
    const dinnerObj = rawWeekData.dinner?.days?.[day];
    const dinnerDrink = dinnerObj && dinnerObj.drink ? dinnerObj.drink : null;
    let dinnerFoodRaw = [];
    if (dinnerObj && typeof dinnerObj === "object") {
      dinnerFoodRaw = Object.entries(dinnerObj)
        .filter(([k, v]) => k !== "drink" && v && typeof v === "string" && v.trim().length > 0)
        .map(([_, v]) => v);
    }
    const dinnerDaily = rawWeekData.dinner?.daily || [];
    dinnerFoodRaw = [...dinnerDaily, ...dinnerFoodRaw];

    menu[day] = {
      isConfirmed: true,
      breakfast: {
        title: day === "Sunday" ? "Sunday Brunch" : "Breakfast",
        timing: dayTimings.breakfast,
        food: bfFoodRaw.map(slugify),
        beverages: ["Milk", "Tea", "Coffee", "Detox Water"],
      },
      lunch: day === "Sunday" ? null : {
        timing: dayTimings.lunch,
        food: (lunchFoodRaw.length > 0 ? lunchFoodRaw : ["Khichdi", "Choice of Salad"]).map(slugify),
        beverages: [lunchDrink].filter(Boolean),
      },
      hitea: {
        timing: dayTimings.hitea,
        food: snackFoodRaw.map(slugify),
        beverages: ["Tea", "Coffee"],
      },
      dinner: {
        timing: dayTimings.dinner,
        food: dinnerFoodRaw.map(slugify),
        beverages: [dinnerDrink].filter(Boolean),
      },
    };
  });

  return menu;
}

/**
 * Builds a weekly menu from the September flat-per-day format:
 * { days: { Monday: { breakfast: {}, lunch: {}, hi_tea: {}, dinner: {} }, ... } }
 */
export function buildFlatDayMenu(rawData) {
  if (!rawData || !rawData.days) return {};
  const menu = {};

  DAY_ORDER_LIST.forEach((day) => {
    const dayTimings =
      day === "Sunday"
        ? sundayTimings
        : day === "Saturday"
        ? saturdayTimings
        : defaultTimings;

    const dayData = rawData.days[day] || {};

    // Breakfast
    const bf = dayData.breakfast || {};
    const bfFoodRaw = [
      bf.mains,
      bf.sides,
      bf.fruits,
      bf.extras,
      ...(Array.isArray(bf.cereals) ? bf.cereals : bf.cereals ? [bf.cereals] : []),
      bf.boiled_sprouts,
      bf.beverages,
      bf.milk,
    ].filter((v) => v && typeof v === "string" && v.trim().length > 0);

    // Lunch
    const lunch = dayData.lunch || {};
    const lunchDrink = lunch.beverage || "Buttermilk";
    const lunchFoodRaw = [
      lunch.salad,
      lunch.dry_veg,
      lunch.curry,
      lunch.dal,
      lunch.rice,
      lunch.breads,
    ].filter((v) => v && typeof v === "string" && v.trim().length > 0);

    // Hi-Tea
    const hiTea = dayData.hi_tea || {};
    const snackFoodRaw = [hiTea.snacks].filter(
      (v) => v && typeof v === "string" && v.trim().length > 0
    );

    // Dinner
    const dinner = dayData.dinner || {};
    const dinnerDrink = dinner.beverage || null;
    const dinnerFoodRaw = [
      dinner.theme ? `Theme: ${dinner.theme}` : null,
      dinner.soup,
      dinner.salad_sauces_dips,
      dinner.starters,
      dinner.maincourse,
      dinner.optional_dish,
      dinner.rice_noodles,
      dinner.breads,
      dinner.dessert,
    ].filter((v) => v && typeof v === "string" && v.trim().length > 0);

    menu[day] = {
      isConfirmed: true,
      breakfast: {
        title: day === "Sunday" ? "Sunday Brunch" : "Breakfast",
        timing: dayTimings.breakfast,
        food: bfFoodRaw.map(slugify),
        beverages: ["Milk", "Tea", "Coffee", "Detox Water"],
      },
      lunch: day === "Sunday" ? null : {
        timing: dayTimings.lunch,
        food: (lunchFoodRaw.length > 0 ? lunchFoodRaw : ["Khichdi", "Choice of Salad"]).map(slugify),
        beverages: [lunchDrink].filter(Boolean),
      },
      hitea: {
        timing: dayTimings.hitea,
        food: snackFoodRaw.map(slugify),
        beverages: ["Tea", "Coffee"],
      },
      dinner: {
        timing: dayTimings.dinner,
        food: dinnerFoodRaw.map(slugify),
        beverages: [dinnerDrink].filter(Boolean),
      },
    };
  });

  return menu;
}

// ── August menus (week rotation) ──────────────────────────────────────────────
export const weeklyMenu1And3 = buildWeeklyMenu(rawAugustMenu.week_1_and_3 || rawAugustMenu);
export const weeklyMenu2And4 = buildWeeklyMenu(rawAugustMenu.week_2_and_4 || rawAugustMenu);

// ── September menus ───────────────────────────────────────────────────────────
// Sep 2nd & 4th week menu built from new flat-per-day format
export const septWeeklyMenu2And4 = buildFlatDayMenu(rawSep2And4Menu);
// Sep 1st & 3rd week — no data available yet

export function getMenuRotationKey(date = new Date()) {
  const month = date.getMonth(); // 0-indexed, August = 7, September = 8
  const dayOfMonth = date.getDate();

  // August 2026 rotation schedule (Aug 1 = Saturday):
  // Week 1: Aug 1–8  (Sat–Sat) -> week_1_and_3
  // Week 2: Aug 9–15 (Sun–Sat) -> week_2_and_4
  // Week 3: Aug 16–22 (Sun–Sat) -> week_1_and_3
  // Week 4: Aug 23–29 (Sun–Sat) -> week_2_and_4
  // Week 5: Aug 30–31 (Sun–Mon) -> week_1_and_3
  if (month === 7) {
    if (dayOfMonth <= 8) return "week_1_and_3";
    if (dayOfMonth <= 15) return "week_2_and_4";
    if (dayOfMonth <= 22) return "week_1_and_3";
    if (dayOfMonth <= 29) return "week_2_and_4";
    return "week_1_and_3";
  }

  // September 2026 rotation schedule (continuing from August, Sep 1 = Tuesday):
  // Week 1: Sep 1–7  (Tue–Sun) -> week_1_and_3  (same week as Aug 30–31, ends on Sunday)
  // Week 2: Sep 8–14 (Mon–Sun) -> week_2_and_4
  // Week 3: Sep 15–21 (Mon–Sun) -> week_1_and_3
  // Week 4: Sep 22–28 (Mon–Sun) -> week_2_and_4
  // Week 5: Sep 29–30 (Mon–Tue) -> week_1_and_3
  if (month === 8) {
    if (dayOfMonth <= 7) return "week_1_and_3";
    if (dayOfMonth <= 14) return "week_2_and_4";
    if (dayOfMonth <= 21) return "week_1_and_3";
    if (dayOfMonth <= 28) return "week_2_and_4";
    return "week_1_and_3";
  }

  // No menu loaded for other months — return null so NoMenuBanner is shown
  return null;
}

export function getMenuForDate(date = new Date()) {
  const month = date.getMonth();
  const rotationKey = getMenuRotationKey(date);
  if (!rotationKey) return null; // No menu data for this month

  // September: only 2nd & 4th week has data; 1st & 3rd shows NO DATA
  if (month === 8) {
    return rotationKey === "week_2_and_4" ? septWeeklyMenu2And4 : null;
  }

  // August (and fallback): serve the August menus
  return rotationKey === "week_1_and_3" ? weeklyMenu1And3 : weeklyMenu2And4;
}

const weeklyMenu = getMenuForDate(new Date());

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
