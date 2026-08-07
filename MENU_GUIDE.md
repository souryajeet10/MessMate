# MESSMATE @ UH — Menu Data & Admin Guide

This guide explains how to easily edit, update, or paste full monthly/daily mess menus into MESSMATE @ UH.

---

## Menu File Location

All menu data is stored in `src/data/menuData.js`.

---

## Structure of a Day Menu

Each day object inside `weeklyMenu` has the following structure:

```js
Monday: {
  isConfirmed: true, // true = Confirmed Menu, false = Planned Menu (Subject to change)
  breakfast: {
    timing: { start: "6:30 AM", end: "9:00 AM" },
    food: ["Idli", "Sambar", "Coconut Chutney", "Bread Butter", "Boiled Eggs"],
    beverages: ["Milk", "Tea", "Coffee"],
  },
  lunch: {
    timing: { start: "12:00 PM", end: "2:30 PM" },
    food: ["Jeera Rice", "Dal Tadka", "Aloo Gobi", "Roti", "Pickle", "Papad"],
    beverages: ["Buttermilk", "Water"],
  },
  hitea: {
    timing: { start: "5:30 PM", end: "6:30 PM" },
    food: ["Samosa", "Green Chutney"],
    beverages: ["Tea", "Coffee"],
  },
  dinner: {
    timing: { start: "8:00 PM", end: "9:30 PM" },
    food: ["Chapati", "Dal Fry", "Mix Veg", "Steamed Rice", "Salad"],
    beverages: ["Milk", "Water"],
  },
}
```

---

## Timings Reference

- **Breakfast**: `6:30 AM` to `9:00 AM`
- **Lunch**: `12:00 PM` to `2:30 PM`
- **HI-TEA**: `5:30 PM` to `6:30 PM`
- **Dinner**: `8:00 PM` to `9:30 PM`

---

## Confirming vs Planning a Menu

- When a day's menu is finalised by mess management, set: `isConfirmed: true`.
- When a day's menu is tentative or advance reference, set: `isConfirmed: false`.
- The app automatically displays `Confirmed Menu` (green check) or `Planned Menu` (amber alert) badges on each meal card accordingly.
- Past meals automatically show as `ENDED`.
