import weeklyMenu from "../data/menuData";
import { getDishName } from "../data/dishesCatalog";

const FAVORITE_DISH_IDS_KEY = "messmate_favorite_dish_ids";

/**
 * Get saved favorite dish IDs from localStorage
 */
export function getFavoriteDishes() {
  try {
    const raw = localStorage.getItem(FAVORITE_DISH_IDS_KEY);
    if (!raw) {
      const initial = ["paneer-lababdar", "hakka-noodles", "pani-puri", "chole"];
      localStorage.setItem(FAVORITE_DISH_IDS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return ["paneer-lababdar", "hakka-noodles"];
  }
}

/**
 * Toggle a dish ID in favorite dishes list
 */
export function toggleFavoriteDish(dishId) {
  const favorites = getFavoriteDishes();
  const exists = favorites.includes(dishId);

  let updated;
  if (exists) {
    updated = favorites.filter((id) => id !== dishId);
  } else {
    updated = [dishId, ...favorites];
  }

  localStorage.setItem(FAVORITE_DISH_IDS_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Check if a dish ID is a favorite
 */
export function isFavoriteDish(dishId) {
  const favorites = getFavoriteDishes();
  return favorites.includes(dishId);
}

/**
 * Find all upcoming occurrences of saved favorite dish IDs across the weekly menu
 */
export function getUpcomingFavoritesSchedule() {
  const favorites = getFavoriteDishes();
  if (favorites.length === 0) return [];

  const matches = [];

  for (const [day, meals] of Object.entries(weeklyMenu)) {
    for (const [mealKey, mealData] of Object.entries(meals)) {
      if (mealKey === "isConfirmed") continue;
      if (!mealData || !mealData.food) continue;

      const foundDishIds = mealData.food.filter((dishId) => favorites.includes(dishId));

      if (foundDishIds.length > 0) {
        matches.push({
          day,
          mealType: mealKey,
          dishes: foundDishIds.map((id) => getDishName(id)),
          timing: mealData.timing,
          isConfirmed: meals.isConfirmed,
        });
      }
    }
  }

  return matches;
}
