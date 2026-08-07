import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Bell, Calendar, Search, CheckCircle, AlertCircle } from "lucide-react";
import {
  getFavoriteDishes,
  toggleFavoriteDish,
  getUpcomingFavoritesSchedule,
} from "../utils/favouritesUtils";
import { DISHES_CATALOG } from "../data/dishesCatalog";
import { requestNotificationPermission, isNotificationEnabled } from "../utils/notificationUtils";
import { MEAL_NAMES } from "../data/menuData";

export default function FavouritesPage() {
  const [favoriteIds, setFavoriteIds] = useState(getFavoriteDishes());
  const [filterQuery, setFilterQuery] = useState("");
  const [notifEnabled, setNotifEnabled] = useState(isNotificationEnabled());

  const schedule = getUpcomingFavoritesSchedule();

  const handleToggleDish = (dishId) => {
    const updated = toggleFavoriteDish(dishId);
    setFavoriteIds(updated);
  };

  const handleToggleNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotifEnabled(granted);
  };

  const filteredDishes = DISHES_CATALOG.filter((dish) =>
    dish.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    dish.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="favourites-page page-enter">
      <div className="favourites-header">
        <span className="favourites-mascot">⭐🥘🍕</span>
        <h1 className="favourites-title">Favorite Dishes</h1>
        <p className="favourites-subtitle">
          Tap any dish below to mark it as a favorite & get served alerts!
        </p>

        <button
          className={`notif-toggle-btn ${notifEnabled ? "active" : ""}`}
          onClick={handleToggleNotifications}
        >
          <Bell size={16} />
          {notifEnabled ? "Notifications On" : "Turn On Dish Notifications"}
        </button>
      </div>

      {/* Selectable Master Dishes Catalog */}
      <div className="prefed-dishes-card">
        <div className="prefed-search-bar">
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            className="prefed-search-input"
            placeholder="Search mess dishes..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
        </div>

        <div className="prefed-dishes-grid">
          {filteredDishes.map((dish) => {
            const isFav = favoriteIds.includes(dish.id);

            return (
              <button
                key={dish.id}
                className={`prefed-dish-btn ${isFav ? "selected" : ""}`}
                onClick={() => handleToggleDish(dish.id)}
                type="button"
              >
                <Star
                  size={15}
                  fill={isFav ? "#F59E0B" : "none"}
                  color={isFav ? "#F59E0B" : "var(--text-muted)"}
                />
                <span>{dish.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upcoming Dish Schedule Section */}
      <div className="fav-schedule-section">
        <h2 className="fav-schedule-title">
          <Calendar size={18} /> Favorite Dishes on Menu ({favoriteIds.length} selected)
        </h2>

        {schedule.length > 0 ? (
          <div className="fav-schedule-grid">
            {schedule.map((item, idx) => {
              const mealTitle = MEAL_NAMES[item.mealType] || item.mealType;
              return (
                <div key={idx} className="fav-schedule-card">
                  <div className="fav-schedule-header">
                    <span className="fav-schedule-day">{item.day}</span>
                    <span className={`meal-confirmation-badge ${item.isConfirmed ? "confirmed" : "planned"}`}>
                      {item.isConfirmed ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                      {item.isConfirmed ? "Confirmed" : "Planned"}
                    </span>
                  </div>
                  <div className="fav-schedule-meal">
                    <strong>{mealTitle}</strong> ({item.timing.start} - {item.timing.end})
                  </div>
                  <div className="fav-schedule-dishes">
                    {item.dishes.map((d, i) => (
                      <span key={i} className="fav-dish-pill">
                        ⭐ {d}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="favourites-empty">
            <p>Select favorite dishes above to view when they appear on the menu.</p>
          </div>
        )}
      </div>
    </div>
  );
}
