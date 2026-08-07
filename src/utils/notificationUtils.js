import { getTodayMenu } from "./menuUtils";
import { getFavoriteDishes } from "./favouritesUtils";
import { getDishName } from "../data/dishesCatalog";

/**
 * Request notification permission from browser
 */
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("Notifications are not supported in this browser.");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

/**
 * Check if notifications are currently enabled
 */
export function isNotificationEnabled() {
  return "Notification" in window && Notification.permission === "granted";
}

/**
 * Trigger notification if today's menu contains favorite dish IDs
 */
export function checkTodayFavoriteDishesAndNotify() {
  if (!isNotificationEnabled()) return;

  const todayMenu = getTodayMenu();
  if (!todayMenu) return;

  const favoriteIds = getFavoriteDishes();
  if (favoriteIds.length === 0) return;

  const matchedItems = [];

  for (const [mealKey, mealData] of Object.entries(todayMenu)) {
    if (mealKey === "isConfirmed") continue;
    if (!mealData || !mealData.food) continue;

    mealData.food.forEach((dishId) => {
      if (favoriteIds.includes(dishId)) {
        const dishName = getDishName(dishId);
        const mealName = mealKey === "hitea" ? "HI-TEA" : mealKey.charAt(0).toUpperCase() + mealKey.slice(1);
        matchedItems.push(`${dishName} in ${mealName}`);
      }
    });
  }

  if (matchedItems.length > 0) {
    const title = "⭐ Favorite Dish Alert!";
    const options = {
      body: `Today's menu serves: ${matchedItems.join(", ")}. Don't miss out!`,
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      tag: "messmate-fav-alert",
    };

    new Notification(title, options);
  }
}
