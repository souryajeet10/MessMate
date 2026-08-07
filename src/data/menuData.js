// MESSMATE Weekly & Monthly Menu Data for United Homes
// Food items reference exact dish IDs from dishesCatalog.js for 100% accurate notifications & favorite tracking.

const weeklyMenu = {
  Monday: {
    isConfirmed: true,
    breakfast: {
      timing: { start: "6:30 AM", end: "9:00 AM" },
      food: ["idli", "sambar", "coconut-chutney", "bread-butter", "boiled-eggs"],
      beverages: ["Milk", "Tea", "Coffee"],
    },
    lunch: {
      timing: { start: "12:00 PM", end: "2:30 PM" },
      food: ["jeera-rice", "dal-tadka", "aloo-gobi", "roti", "pickle", "papad"],
      beverages: ["Buttermilk", "Water"],
    },
    hitea: {
      timing: { start: "5:30 PM", end: "6:30 PM" },
      food: ["samosa"],
      beverages: ["Tea", "Coffee"],
    },
    dinner: {
      timing: { start: "8:00 PM", end: "9:30 PM" },
      food: ["chapati", "dal-fry", "paneer-butter-masala", "steamed-rice", "salad"],
      beverages: ["Milk", "Water"],
    },
  },
  Tuesday: {
    isConfirmed: true,
    breakfast: {
      timing: { start: "6:30 AM", end: "9:00 AM" },
      food: ["poha", "jalebi", "bread-jam", "boiled-eggs"],
      beverages: ["Milk", "Tea", "Coffee"],
    },
    lunch: {
      timing: { start: "12:00 PM", end: "2:30 PM" },
      food: ["steamed-rice", "rajma-masala", "roti", "pickle", "raita"],
      beverages: ["Lemonade", "Water"],
    },
    hitea: {
      timing: { start: "5:30 PM", end: "6:30 PM" },
      food: ["bread-pakora"],
      beverages: ["Tea", "Coffee"],
    },
    dinner: {
      timing: { start: "8:00 PM", end: "9:30 PM" },
      food: ["chapati", "chana-masala", "jeera-rice", "salad"],
      beverages: ["Milk", "Water"],
    },
  },
  Wednesday: {
    isConfirmed: true,
    breakfast: {
      timing: { start: "6:30 AM", end: "9:00 AM" },
      food: ["puri-aloo", "bread-butter", "boiled-eggs"],
      beverages: ["Milk", "Tea", "Coffee"],
    },
    lunch: {
      timing: { start: "12:00 PM", end: "2:30 PM" },
      food: ["veg-biryani", "raita", "roti", "pickle", "papad"],
      beverages: ["Jaljeera", "Water"],
    },
    hitea: {
      timing: { start: "5:30 PM", end: "6:30 PM" },
      food: ["vada-pav"],
      beverages: ["Tea", "Coffee"],
    },
    dinner: {
      timing: { start: "8:00 PM", end: "9:30 PM" },
      food: ["chapati", "paneer-bhurji", "steamed-rice", "salad", "gulab-jamun"],
      beverages: ["Milk", "Water"],
    },
  },
  Thursday: {
    isConfirmed: true,
    breakfast: {
      timing: { start: "6:30 AM", end: "9:00 AM" },
      food: ["upma", "medu-vada", "coconut-chutney", "bread-jam", "boiled-eggs"],
      beverages: ["Milk", "Tea", "Coffee"],
    },
    lunch: {
      timing: { start: "12:00 PM", end: "2:30 PM" },
      food: ["steamed-rice", "kadhi-pakora", "bhindi-masala", "roti", "pickle", "papad"],
      beverages: ["Chaas", "Water"],
    },
    hitea: {
      timing: { start: "5:30 PM", end: "6:30 PM" },
      food: ["pav-bhaji"],
      beverages: ["Tea", "Coffee"],
    },
    dinner: {
      timing: { start: "8:00 PM", end: "9:30 PM" },
      food: ["chapati", "egg-curry", "jeera-rice", "salad"],
      beverages: ["Milk", "Water"],
    },
  },
  Friday: {
    isConfirmed: true,
    breakfast: {
      timing: { start: "6:30 AM", end: "9:00 AM" },
      food: ["dosa", "sambar", "coconut-chutney", "bread-butter", "boiled-eggs"],
      beverages: ["Milk", "Tea", "Coffee"],
    },
    lunch: {
      timing: { start: "12:00 PM", end: "2:30 PM" },
      food: ["steamed-rice", "chole", "paneer-tikka-masala", "roti", "pickle", "raita"],
      beverages: ["Mango Lassi", "Water"],
    },
    hitea: {
      timing: { start: "5:30 PM", end: "6:30 PM" },
      food: ["aloo-tikki"],
      beverages: ["Tea", "Coffee"],
    },
    dinner: {
      timing: { start: "8:00 PM", end: "9:30 PM" },
      food: ["chapati", "malai-kofta", "dal-makhani", "steamed-rice", "salad", "rasmalai"],
      beverages: ["Milk", "Water"],
    },
  },
  Saturday: {
    isConfirmed: true,
    breakfast: {
      timing: { start: "6:30 AM", end: "9:00 AM" },
      food: ["chole-bhature", "pickle", "boiled-eggs"],
      beverages: ["Milk", "Tea", "Coffee"],
    },
    lunch: {
      timing: { start: "12:00 PM", end: "2:30 PM" },
      food: ["veg-pulao", "dal-tadka", "gobi-manchurian", "roti", "pickle", "papad"],
      beverages: ["Sweet Lassi", "Water"],
    },
    hitea: {
      timing: { start: "5:30 PM", end: "6:30 PM" },
      food: ["spring-roll"],
      beverages: ["Tea", "Coffee"],
    },
    dinner: {
      timing: { start: "8:00 PM", end: "9:30 PM" },
      food: ["chapati", "butter-chicken", "dal-fry", "jeera-rice", "salad", "ice-cream"],
      beverages: ["Milk", "Water"],
    },
  },
  Sunday: {
    isConfirmed: false,
    breakfast: {
      timing: { start: "6:30 AM", end: "9:00 AM" },
      food: ["aloo-paratha", "raita", "pickle"],
      beverages: ["Milk", "Tea", "Coffee"],
    },
    lunch: {
      timing: { start: "12:00 PM", end: "2:30 PM" },
      food: ["chicken-biryani", "veg-biryani", "raita", "roti", "pickle", "gulab-jamun"],
      beverages: ["Cold Drink", "Water"],
    },
    hitea: {
      timing: { start: "5:30 PM", end: "6:30 PM" },
      food: ["pasta", "garlic-bread"],
      beverages: ["Tea", "Coffee", "Cold Coffee"],
    },
    dinner: {
      timing: { start: "8:00 PM", end: "9:30 PM" },
      food: ["chapati", "paneer-butter-masala", "dal-fry", "steamed-rice", "salad"],
      beverages: ["Milk", "Water"],
    },
  },
};

export const MEAL_ORDER = ["breakfast", "lunch", "hitea", "dinner"];

export const MEAL_NAMES = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  hitea: "HI-TEA",
  dinner: "Dinner",
};

export const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const MEAL_ICONS = {
  breakfast: "☀️🍳",
  lunch: "🍛🥘",
  hitea: "☕🧃",
  dinner: "🌙🌯",
};

export default weeklyMenu;
