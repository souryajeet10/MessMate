import { onValue, ref, set } from "firebase/database";
import { db } from "../services/firebase.js";

const VOTER_KEY = "messmate_meal_voter";
const MEALS = new Set(["breakfast", "lunch", "hitea", "dinner"]);

export function mealVoteKey(date, mealKey) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime()) || !MEALS.has(mealKey)) {
    throw new Error("A valid meal date and meal are required.");
  }
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}/${mealKey}`;
}

export function getVoterId() {
  let id = localStorage.getItem(VOTER_KEY);
  if (!/^[a-zA-Z0-9_-]{20,80}$/.test(id ?? "")) {
    id = crypto.randomUUID();
    localStorage.setItem(VOTER_KEY, id);
  }
  return id;
}

export function summarizeVotes(ballots, voterId) {
  const counts = { up: 0, down: 0, selected: null };
  for (const [id, vote] of Object.entries(ballots ?? {})) {
    if (vote !== "up" && vote !== "down") continue;
    counts[vote] += 1;
    if (id === voterId) counts.selected = vote;
  }
  return counts;
}

export function subscribeMealVotes(key, onVotes, onError) {
  return onValue(ref(db, `meal_votes/${key}`), (snapshot) => onVotes(snapshot.val()), onError);
}

export function subscribeVoteConnection(onConnected) {
  return onValue(ref(db, ".info/connected"), (snapshot) => onConnected(snapshot.val() === true));
}

export function saveMealVote(key, voterId, vote) {
  if (vote !== "up" && vote !== "down") {
    throw new Error("Invalid vote.");
  }
  // Replacing this browser's ballot keeps repeated votes from increasing the total.
  return set(ref(db, `meal_votes/${key}/${voterId}`), vote);
}

export function isMealServing(date, timing, now = new Date()) {
  function atTime(time, end = false) {
    const match = /^(\d{1,2}):(\d{2}) (AM|PM)$/.exec(time ?? "");
    if (!match || Number(match[1]) < 1 || Number(match[1]) > 12 || Number(match[2]) > 59) return NaN;
    const boundary = new Date(date);
    const hour = Number(match[1]) % 12 + (match[3] === "PM" ? 12 : 0);
    // Match the serving status, which includes the displayed end minute.
    return boundary.setHours(hour, Number(match[2]), end ? 59 : 0, end ? 999 : 0);
  }
  return now >= atTime(timing?.start) && now <= atTime(timing?.end, true);
}
