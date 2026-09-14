import test from "node:test";
import assert from "node:assert/strict";
import { getMealPackages, applyMealPackage } from "./mealPackages.js";
import { getMenuForDate } from "../data/menuData.js";

const september = new Date(2026, 8, 14);

test("September packages include both rotations and use September food", () => {
  const packages = getMealPackages(september, "breakfast");
  assert.equal(packages.length, 14);
  const monday = packages.find((item) => item.id === "week_1_and_3_Monday_breakfast");
  assert.match(monday.label, /September.*Weeks 1 & 3.*Monday.*Breakfast/);
  assert.ok(monday.meal.food.includes("mix-veg-paratha"));
  assert.equal(getMealPackages(new Date(2026, 9, 1), "breakfast").length, 0);
  assert.equal(getMealPackages(september, "lunch").length, 12);
});

test("applying a package replaces the whole meal but preserves target times and other meals", () => {
  const target = getMenuForDate(september).Monday;
  const original = structuredClone(target);
  const source = getMealPackages(september, "breakfast").find((item) => item.id === "week_2_and_4_Sunday_breakfast").meal;
  const updated = applyMealPackage(target, "breakfast", source);
  assert.deepEqual(updated.breakfast.food, source.food);
  assert.deepEqual(updated.breakfast.beverages, source.beverages);
  assert.deepEqual(updated.breakfast.timing, target.breakfast.timing);
  assert.equal(updated.breakfast.title, "Breakfast");
  assert.equal(updated.lunch, target.lunch);
  assert.equal(updated.dinner, target.dinner);
  assert.equal(updated.isConfirmed, target.isConfirmed);
  assert.deepEqual(target, original);
  assert.notEqual(updated.breakfast.food, source.food);
  assert.doesNotMatch(JSON.stringify(updated), /undefined/);
});

test("packages cannot create an unscheduled meal", () => {
  const sunday = getMenuForDate(september).Sunday;
  const source = getMealPackages(september, "lunch")[0].meal;
  assert.equal(applyMealPackage(sunday, "lunch", source), sunday);
});
