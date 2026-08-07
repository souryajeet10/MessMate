// Master Catalog of Pre-fed Mess Dishes with Unique IDs
// Used for exact matching of student favorite tracking & notifications

export const DISHES_CATALOG = [
  { id: "idli", name: "Idli", category: "Breakfast" },
  { id: "sambar", name: "Sambar", category: "Sides" },
  { id: "coconut-chutney", name: "Coconut Chutney", category: "Sides" },
  { id: "dosa", name: "Dosa", category: "Breakfast" },
  { id: "upma", name: "Upma", category: "Breakfast" },
  { id: "medu-vada", name: "Medu Vada", category: "Breakfast" },
  { id: "poha", name: "Poha", category: "Breakfast" },
  { id: "jalebi", name: "Jalebi", category: "Sweets" },
  { id: "puri-aloo", name: "Puri Aloo", category: "Breakfast" },
  { id: "aloo-paratha", name: "Aloo Paratha", category: "Breakfast" },
  { id: "chole-bhature", name: "Chole Bhature", category: "Breakfast" },
  { id: "boiled-eggs", name: "Boiled Eggs", category: "Breakfast" },

  { id: "samosa", name: "Samosa", category: "HI-TEA" },
  { id: "vada-pav", name: "Vada Pav", category: "HI-TEA" },
  { id: "pav-bhaji", name: "Pav Bhaji", category: "HI-TEA" },
  { id: "bread-pakora", name: "Bread Pakora", category: "HI-TEA" },
  { id: "aloo-tikki", name: "Aloo Tikki", category: "HI-TEA" },
  { id: "spring-roll", name: "Spring Roll", category: "HI-TEA" },
  { id: "pasta", name: "Pasta", category: "HI-TEA" },
  { id: "garlic-bread", name: "Garlic Bread", category: "HI-TEA" },

  { id: "paneer-butter-masala", name: "Paneer Butter Masala", category: "Main Course" },
  { id: "paneer-bhurji", name: "Paneer Bhurji", category: "Main Course" },
  { id: "paneer-tikka-masala", name: "Paneer Tikka Masala", category: "Main Course" },
  { id: "malai-kofta", name: "Malai Kofta", category: "Main Course" },
  { id: "dal-makhani", name: "Dal Makhani", category: "Main Course" },
  { id: "dal-fry", name: "Dal Fry", category: "Main Course" },
  { id: "dal-tadka", name: "Dal Tadka", category: "Main Course" },
  { id: "rajma-masala", name: "Rajma Masala", category: "Main Course" },
  { id: "chole", name: "Chole", category: "Main Course" },
  { id: "chana-masala", name: "Chana Masala", category: "Main Course" },
  { id: "kadhi-pakora", name: "Kadhi Pakora", category: "Main Course" },
  { id: "aloo-gobi", name: "Aloo Gobi", category: "Main Course" },
  { id: "bhindi-masala", name: "Bhindi Masala", category: "Main Course" },

  { id: "veg-biryani", name: "Veg Biryani", category: "Rice & Biryani" },
  { id: "chicken-biryani", name: "Chicken Biryani", category: "Rice & Biryani" },
  { id: "butter-chicken", name: "Butter Chicken", category: "Main Course" },
  { id: "egg-curry", name: "Egg Curry", category: "Main Course" },
  { id: "jeera-rice", name: "Jeera Rice", category: "Rice & Biryani" },
  { id: "steamed-rice", name: "Steamed Rice", category: "Rice & Biryani" },
  { id: "veg-pulao", name: "Veg Pulao", category: "Rice & Biryani" },
  { id: "gobi-manchurian", name: "Gobi Manchurian", category: "Sides" },

  { id: "roti", name: "Roti", category: "Breads" },
  { id: "chapati", name: "Chapati", category: "Breads" },
  { id: "bread-butter", name: "Bread Butter", category: "Breads" },
  { id: "bread-jam", name: "Bread Jam", category: "Breads" },

  { id: "gulab-jamun", name: "Gulab Jamun", category: "Sweets" },
  { id: "rasmalai", name: "Rasmalai", category: "Sweets" },
  { id: "ice-cream", name: "Ice Cream", category: "Sweets" },

  { id: "raita", name: "Raita / Curd", category: "Sides" },
  { id: "salad", name: "Green Salad", category: "Sides" },
  { id: "pickle", name: "Pickle", category: "Sides" },
  { id: "papad", name: "Papad", category: "Sides" },
];

export const DISH_MAP = DISHES_CATALOG.reduce((acc, dish) => {
  acc[dish.id] = dish;
  return acc;
}, {});

export function getDishName(dishId) {
  return DISH_MAP[dishId]?.name || dishId;
}
