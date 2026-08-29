import { getTodayMenu } from "./menuUtils";
import { getFavoriteDishes } from "./favouritesUtils";
import { getDishName } from "../data/dishesCatalog";

// ---------------------------------------------------------------------------
// Support detection
// ---------------------------------------------------------------------------

/**
 * True if the Notification API exists and we are in a secure context.
 * NOTE: On iOS Safari, Notification exists only in SW scope, not in window.
 * On Android Chrome, Notification exists in window but new Notification() is
 * deprecated in favour of ServiceWorkerRegistration.showNotification().
 * We always route through the SW to be safe on all mobile browsers.
 */
export function isNotificationSupported() {
  return "Notification" in window && window.isSecureContext;
}

/**
 * True when the user has already granted permission.
 */
export function isNotificationEnabled() {
  return isNotificationSupported() && Notification.permission === "granted";
}

// ---------------------------------------------------------------------------
// Service Worker registration (singleton)
// ---------------------------------------------------------------------------

let _swRegistration = null;

async function getSwRegistration() {
  if (!("serviceWorker" in navigator)) return null;
  if (_swRegistration) return _swRegistration;
  try {
    _swRegistration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    // Wait until the SW is active before returning
    await navigator.serviceWorker.ready;
    return _swRegistration;
  } catch (e) {
    console.warn("[MessMate] SW registration failed:", e);
    return null;
  }
}

// Register the SW as early as possible (called from main.jsx or App)
export function registerServiceWorker() {
  if ("serviceWorker" in navigator && window.isSecureContext) {
    getSwRegistration();
  }
}

// ---------------------------------------------------------------------------
// Permission
// ---------------------------------------------------------------------------

/**
 * Request notification permission. Never throws — returns false on any error.
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Safe notification dispatch — always goes through Service Worker on mobile
// ---------------------------------------------------------------------------

/**
 * Show a notification safely across all browsers (desktop + mobile).
 * On mobile, direct `new Notification()` crashes; we route via the SW instead.
 */
async function safeNotify(title, options) {
  try {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!isMobile) {
      // Desktop: direct Notification API is fine
      new Notification(title, options);
      return;
    }

    // Mobile: must use ServiceWorkerRegistration.showNotification()
    const reg = await getSwRegistration();
    if (reg) {
      await reg.showNotification(title, options);
    } else {
      // Fallback: try direct (may still work on some desktop-mode mobile browsers)
      new Notification(title, options);
    }
  } catch (e) {
    console.warn("[MessMate] Notification display failed:", e);
  }
}

// ---------------------------------------------------------------------------
// Favourite-dish alert
// ---------------------------------------------------------------------------

/**
 * Fire a notification if today's menu includes any favourite dish IDs.
 * @param {boolean} forceShow  Skip the "already shown today" localStorage guard.
 *   Pass true when the user has just granted permission so they see it immediately.
 */
export async function checkTodayFavoriteDishesAndNotify(forceShow = false) {
  if (!isNotificationEnabled()) return;

  const todayMenu = getTodayMenu();
  if (!todayMenu) return;

  const favoriteIds = getFavoriteDishes();
  if (favoriteIds.length === 0) return;

  // Date-specific guard — resets automatically each day
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const shownKey = `messmate_notif_shown_${today}`;
  if (!forceShow && localStorage.getItem(shownKey) === "true") return;

  const matchedItems = [];

  for (const [mealKey, mealData] of Object.entries(todayMenu)) {
    if (mealKey === "isConfirmed") continue;
    if (!mealData || !mealData.food) continue;

    mealData.food.forEach((dishId) => {
      if (favoriteIds.includes(dishId)) {
        const dishName = getDishName(dishId);
        const mealName =
          mealKey === "hitea"
            ? "HI-TEA"
            : mealKey.charAt(0).toUpperCase() + mealKey.slice(1);
        matchedItems.push(`${dishName} in ${mealName}`);
      }
    });
  }

  if (matchedItems.length > 0) {
    await safeNotify("⭐ Favorite Dish Alert!", {
      body: `Today's menu serves: ${matchedItems.join(", ")}. Don't miss out!`,
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      // Date-specific tag so browser deduplication doesn't suppress it
      tag: `messmate-fav-alert-${today}`,
    });
    localStorage.setItem(shownKey, "true");
  }
}
