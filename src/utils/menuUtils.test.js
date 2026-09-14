import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { getMenuOverrideKey, getMenuForDate } from "../data/menuData.js";

const writes = [];
mock.module("../services/firebase.js", { namedExports: { db: {} } });
mock.module("firebase/database", { namedExports: {
  ref: (_db, path) => path,
  set: async (path, data) => { writes.push({ path, data }); },
  remove: async () => {},
} });
const cache = new Map();
globalThis.localStorage = {
  getItem: (key) => cache.get(key) ?? null,
  setItem: (key, value) => cache.set(key, value),
  removeItem: (key) => cache.delete(key),
};
const { getDayMenu, updateDayMenu, setDayConfirmation } = await import("./menuUtils.js");
const date = new Date(2026, 8, 14);

test("September 14 ignores legacy August overrides and shows the published lunch", () => {
  const oldMenu = getMenuForDate(new Date(2026, 7, 10)).Monday;
  const result = getDayMenu("Monday", date, { week_1_and_3_Monday: oldMenu });
  assert.deepEqual(result.lunch.food, ["green-salad", "palak-corn", "paneer-kali-mirch-not-sweet-white-gravy", "masoor-dal-tadka", "jeera-rice", "roti"]);
});

test("manager edits and confirmations use the same month-scoped read/write key", async () => {
  const key = getMenuOverrideKey("Monday", date);
  assert.equal(key, "2026_09_week_1_and_3_Monday");
  const day = structuredClone(getMenuForDate(date).Monday);
  day.lunch.food = ["test-dish"];
  await updateDayMenu("Monday", day, date);
  assert.equal(writes.at(-1).path, `menu_overrides/${key}`);
  assert.deepEqual(getDayMenu("Monday", date).lunch.food, ["test-dish"]);
  await setDayConfirmation("Monday", false, date);
  assert.equal(getDayMenu("Monday", date).isConfirmed, false);
  assert.equal(writes.at(-1).path, `menu_overrides/${key}`);
  assert.notEqual(getMenuOverrideKey("Monday", new Date(2026, 7, 10)), key);
  assert.notEqual(getMenuOverrideKey("Monday", new Date(2027, 8, 14)), key);
  assert.equal(getMenuOverrideKey("Monday", new Date(2026, 9, 5)), null);
});

test("dinner keeps the published theme when a saved edit only changes dishes", () => {
  const key = getMenuOverrideKey("Monday", date);
  const result = getDayMenu("Monday", date, {
    [key]: { dinner: { food: ["test-dish"] } },
  });
  assert.equal(result.dinner.theme, "Chatkara");
  assert.deepEqual(result.dinner.food, ["test-dish"]);
});

test("a selected package can supply its own dinner theme", () => {
  const key = getMenuOverrideKey("Monday", date);
  const source = getMenuForDate(new Date(2026, 8, 21)).Monday.dinner;
  const result = getDayMenu("Monday", date, { [key]: { dinner: source } });
  assert.equal(result.dinner.theme, source.theme);
});
