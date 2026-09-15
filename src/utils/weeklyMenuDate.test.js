import test from "node:test";
import assert from "node:assert/strict";
import { getMenuForDate, septWeeklyMenu1And3, septWeeklyMenu2And4 } from "../data/menuData.js";
import { dateForWeekday, shiftCalendarDate } from "./weeklyMenuDate.js";

test("arrows cross September 20–21 into the next menu rotation", () => {
  const sunday = new Date(2026, 8, 20, 12);
  const monday = shiftCalendarDate(sunday, 1);
  assert.equal(monday.getDate(), 21);
  assert.equal(monday.getDay(), 1);
  assert.equal(getMenuForDate(sunday), septWeeklyMenu1And3);
  assert.equal(getMenuForDate(monday), septWeeklyMenu2And4);
  assert.equal(getMenuForDate(shiftCalendarDate(monday, -1)), septWeeklyMenu1And3);
  assert.notDeepEqual(getMenuForDate(sunday).Sunday.breakfast.food, getMenuForDate(monday).Monday.breakfast.food);
});

test("weekday tabs select dates in the selected week", () => {
  const monday = new Date(2026, 8, 21, 12);
  const sunday = dateForWeekday(monday, 6);
  assert.equal(sunday.getDate(), 27);
  assert.equal(getMenuForDate(sunday), septWeeklyMenu2And4);
  assert.equal(dateForWeekday(sunday, 0).getDate(), 21);
  assert.equal(dateForWeekday(shiftCalendarDate(monday, -1), 0).getDate(), 14);
});
