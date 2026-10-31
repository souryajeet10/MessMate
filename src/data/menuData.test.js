import test from "node:test";
import assert from "node:assert/strict";
import {
  getMenuForDate,
  getMenuRotationKey,
  isDiwaliHoliday,
  septWeeklyMenu1And3,
  septWeeklyMenu2And4,
  octWeeklyMenu1And3,
  octWeeklyMenu2And4,
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

test("October rotates between both week menus", () => {
  const weeks = [[1, 4], [5, 11], [12, 18], [19, 25], [26, 31]];
  weeks.forEach(([start, end], index) => {
    const odd = index % 2 === 0;
    for (let day = start; day <= end; day++) {
      const date = new Date(2026, 9, day, 12);
      assert.equal(getMenuRotationKey(date), odd ? "week_1_and_3" : "week_2_and_4", `October ${day}`);
      assert.equal(getMenuForDate(date), odd ? octWeeklyMenu1And3 : octWeeklyMenu2And4);
    }
  });
  // Oct 12 is Week 1&3
  const oct12 = new Date(2026, 9, 12, 12);
  const oct12Menu = getMenuForDate(oct12);
  assert.ok(oct12Menu.Monday.breakfast.food.includes("moonglet"));
  assert.ok(oct12Menu.Monday.lunch.food.includes("matar-paneer"));
  // Oct 5 is Week 2&4
  const oct5 = new Date(2026, 9, 5, 12);
  const oct5Menu = getMenuForDate(oct5);
  assert.ok(oct5Menu.Monday.breakfast.food.includes("masala-poha"));
  assert.ok(oct5Menu.Monday.lunch.food.includes("shahi-paneer"));
});

test("months without menu files return no menu", () => {
  assert.equal(getMenuForDate(new Date(2026, 11, 1)), null);
});

test("November 1–5 repeats October's weekday rotation only in 2026", () => {
  for (let day = 1; day <= 5; day++) {
    const date = new Date(2026, 10, day);
    assert.equal(getMenuForDate(date), day === 1 ? octWeeklyMenu1And3 : octWeeklyMenu2And4);
    assert.equal(isDiwaliHoliday(date), false);
  }
  assert.equal(getMenuForDate(new Date(2027, 10, 1)), null);
});

test("Diwali holidays cover November 6–14 inclusive without serving menus", () => {
  for (let day = 6; day <= 15; day++) {
    const date = new Date(2026, 10, day);
    assert.equal(isDiwaliHoliday(date), day <= 14);
    assert.equal(getMenuForDate(date), null);
    assert.equal(getMenuRotationKey(date), null);
  }
  assert.equal(isDiwaliHoliday(new Date(2027, 10, 6)), false);
  assert.equal(isDiwaliHoliday(new Date(2026, 9, 6)), false);
});

test("November 16–30 resumes October's menu with the existing Monday rotation", () => {
  for (let day = 16; day <= 30; day++) {
    const date = new Date(2026, 10, day);
    const secondRotation = day <= 22 || day === 30;
    assert.equal(getMenuRotationKey(date), secondRotation ? "week_2_and_4" : "week_1_and_3");
    assert.equal(getMenuForDate(date), secondRotation ? octWeeklyMenu2And4 : octWeeklyMenu1And3);
    assert.equal(isDiwaliHoliday(date), false);
  }
  assert.equal(getMenuForDate(new Date(2027, 10, 16)), null);
});
