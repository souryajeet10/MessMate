import { test, mock } from "node:test";
import assert from "node:assert/strict";

const ballots = {};
let failWrite = false;
mock.module("../services/firebase.js", { namedExports: { db: {} } });
mock.module("firebase/database", { namedExports: {
  ref: (_db, path) => path,
  set: async (path, vote) => {
    if (failWrite) throw new Error("PERMISSION_DENIED");
    if (vote === null) delete ballots[path];
    else ballots[path] = vote;
  },
  onValue: () => () => {},
} });

const { mealVoteKey, saveMealVote, summarizeVotes, isMealServing, getVoterId } = await import("./mealVotes.js");

test("votes use the local calendar date and remain separate across meals and weeks", () => {
  const sunday = mealVoteKey(new Date(2026, 8, 20, 0, 30), "breakfast");
  assert.equal(sunday, "2026-09-20/breakfast");
  assert.notEqual(sunday, mealVoteKey(new Date(2026, 8, 21), "breakfast"));
  assert.notEqual(sunday, mealVoteKey(new Date(2026, 8, 20), "dinner"));
  assert.notEqual(sunday, mealVoteKey(new Date(2027, 8, 20), "breakfast"));
  assert.throws(() => mealVoteKey(new Date("invalid"), "breakfast"));
});

test("repeat and switch preserve one ballot and votes cannot be removed", async () => {
  const key = "2026-09-15/lunch";
  const counts = () => summarizeVotes(Object.fromEntries(Object.entries(ballots).map(([path, value]) => [path.split("/").at(-1), value])), "voter-a");
  await saveMealVote(key, "voter-a", "up");
  await saveMealVote(key, "voter-a", "up");
  await saveMealVote(key, "voter-b", "up");
  assert.deepEqual(counts(), { up: 2, down: 0, selected: "up" });
  await saveMealVote(key, "voter-a", "down");
  assert.deepEqual(counts(), { up: 1, down: 1, selected: "down" });
  assert.throws(() => saveMealVote(key, "voter-a", null), /Invalid vote/);
  assert.throws(() => saveMealVote(key, "voter-a", ""), /Invalid vote/);
  assert.deepEqual(counts(), { up: 1, down: 1, selected: "down" });
  failWrite = true;
  await assert.rejects(saveMealVote(key, "voter-a", "up"), /PERMISSION_DENIED/);
  assert.deepEqual(counts(), { up: 1, down: 1, selected: "down" });
  failWrite = false;
});

test("empty and malformed ballots do not create votes", () => {
  assert.deepEqual(summarizeVotes(null, "a"), { up: 0, down: 0, selected: null });
  assert.deepEqual(summarizeVotes({ a: "other", b: 3, c: "down" }, "a"), { up: 0, down: 1, selected: null });
});

test("voting is available only within the selected meal's serving window", () => {
  const date = new Date(2026, 8, 15);
  const lunch = { start: "12:00 PM", end: "2:30 PM" };
  assert.equal(isMealServing(date, lunch, new Date(2026, 8, 15, 11, 59)), false);
  assert.equal(isMealServing(date, lunch, new Date(2026, 8, 15, 12)), true);
  assert.equal(isMealServing(date, lunch, new Date(2026, 8, 15, 14, 30, 59)), true);
  assert.equal(isMealServing(date, lunch, new Date(2026, 8, 15, 14, 31)), false);
  assert.equal(isMealServing(date, lunch, new Date(2026, 8, 14, 12, 30)), false);
  assert.equal(isMealServing(date, lunch, new Date(2026, 8, 16, 12, 30)), false);
  assert.equal(isMealServing(date, { start: "12:00 AM", end: "1:00 AM" }, date), true);
  assert.equal(isMealServing(date, undefined, date), false);
});

test("browser identity persists between visits", () => {
  const cache = new Map();
  const originalStorage = globalThis.localStorage;
  globalThis.localStorage = {
    getItem: (key) => cache.get(key) ?? null,
    setItem: (key, value) => cache.set(key, value),
  };
  try {
    const id = getVoterId();
    assert.equal(getVoterId(), id);
    assert.match(id, /^[a-zA-Z0-9_-]{20,80}$/);
  } finally {
    globalThis.localStorage = originalStorage;
  }
});
