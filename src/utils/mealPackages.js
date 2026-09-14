import { DAY_ORDER, MEAL_NAMES, getMenuForDate, getMenuRotationKey } from "../data/menuData.js";

// Source packages always come from the published monthly files, never overrides.
export function getMealPackages(date, mealKey) {
  const monthName = date.toLocaleDateString("en-IN", { month: "long" });
  const rotations = new Map();
  for (let day = 1; day <= 14; day++) {
    const sourceDate = new Date(date.getFullYear(), date.getMonth(), day);
    const rotation = getMenuRotationKey(sourceDate);
    if (!rotation || rotations.has(rotation)) continue;
    rotations.set(rotation, getMenuForDate(sourceDate));
  }
  return [...rotations].flatMap(([rotation, menu]) =>
    DAY_ORDER.flatMap((day) => {
      const meal = menu?.[day]?.[mealKey];
      if (!meal) return [];
      const weekLabel = rotation === "week_1_and_3" ? "Weeks 1 & 3" : "Weeks 2 & 4";
      return [{
        id: `${rotation}_${day}_${mealKey}`,
        label: `${monthName} · ${weekLabel} · ${day} · ${meal.title || MEAL_NAMES[mealKey]}`,
        meal,
      }];
    })
  );
}

export function applyMealPackage(dayMenu, mealKey, sourceMeal) {
  const targetMeal = dayMenu?.[mealKey];
  if (!targetMeal || !sourceMeal) return dayMenu;
  return {
    ...dayMenu,
    [mealKey]: {
      ...sourceMeal,
      title: targetMeal.title || MEAL_NAMES[mealKey],
      timing: targetMeal.timing,
      food: [...sourceMeal.food],
      beverages: [...(sourceMeal.beverages || [])],
    },
  };
}
