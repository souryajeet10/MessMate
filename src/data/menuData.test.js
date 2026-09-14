import test from "node:test";
import assert from "node:assert/strict";
import {
  getMenuForDate,
  getMenuRotationKey,
  septWeeklyMenu1And3,
  septWeeklyMenu2And4,
} from "./menuData.js";

test("September menu changes on Mondays, including September 14", () => {
  const weeks = [[1, 6], [7, 13], [14, 20], [21, 27], [28, 30]];
  weeks.forEach(([start, end], index) => {
    const odd = index % 2 === 0;
    for (let day = start; day <= end; day++) {
      const date = new Date(2026, 8, day, 12);
      assert.equal(getMenuRotationKey(date), odd ? "week_1_and_3" : "week_2_and_4", `September ${day}`);
      assert.equal(getMenuForDate(date), odd ? septWeeklyMenu1And3 : septWeeklyMenu2And4);
    }
  });
  assert.ok(getMenuForDate(new Date(2026, 8, 14)).Monday.breakfast.food.includes("mix-veg-paratha"));
});

test("August also rotates Monday after its initial partial week", () => {
  assert.equal(getMenuRotationKey(new Date(2026, 7, 2)), "week_1_and_3");
  assert.equal(getMenuRotationKey(new Date(2026, 7, 3)), "week_2_and_4");
  assert.equal(getMenuRotationKey(new Date(2026, 7, 9)), "week_2_and_4");
  assert.equal(getMenuRotationKey(new Date(2026, 7, 10)), "week_1_and_3");
});

test("months without menu files return no menu", () => {
  assert.equal(getMenuForDate(new Date(2026, 9, 1)), null);
});
