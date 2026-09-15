export function shiftCalendarDate(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function dateForWeekday(date, weekdayIndex) {
  const currentIndex = (date.getDay() + 6) % 7;
  return shiftCalendarDate(date, weekdayIndex - currentIndex);
}

export function isSameCalendarDate(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}
