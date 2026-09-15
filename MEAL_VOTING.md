# Meal accuracy voting

Each meal card asks “Was this menu correct?” with Yes/No thumbs buttons and live totals only during that meal's serving window. A successful write triggers a thumb pop, particle burst, and saved checkmark; the voting section then collapses after one second. Previously saved votes stay hidden when revisiting or reloading the meal. Failed writes remain visible for retry. Reduced-motion preferences disable the movement. Votes cannot be removed; the database API still supports replacement, but the completed voting controls are hidden.

Today, Calendar, and Weekly Menu pass the selected calendar date to the card. Ballots are stored separately for every date and meal:

Counts remain hidden until the meal has at least 10 real votes. Zero-count answers never display a number. No votes or counts are fabricated.

```
meal_votes/2026-09-15/lunch/<browser-id>: "up" or "down"
```

The browser ID is saved in localStorage. This provides one changeable ballot per browser, not verified one-person voting. Clearing browser storage or using another browser creates another identity. There is no authenticated ownership enforcement in this initial implementation.

## Firebase setup status

After the user published the rules in Firebase Console, a live read of `meal_votes/2026-09-15/lunch` returned HTTP 200 with one existing ballot. No live test vote was submitted. The UI shows voting as unavailable if access is denied rather than treating an unreadable count as zero.

`database.rules.json` contains the complete rules update prepared from the supplied screenshot. It preserves the supplied menu rules, allows reading each date/meal's ballots, and permits only `up` or `down` writes at a valid voter path. Delete requests and writes to entire vote collections are denied. The user reported publishing the update; live read access has been verified, but the deployed rules themselves have not been retrieved for comparison.

The no-delete check belongs in `.write`: Firebase skips `.validate` rules for deleted data. See [Firebase rule conditions](https://firebase.google.com/docs/database/security/rules-conditions).

These rules match the current browser-ID implementation. They allow public ballot writes and do not authenticate ballot ownership. The existing screenshot also allows public menu edits. For verified ownership, use Firebase Authentication IDs and enforce `auth.uid` in the vote rules before enabling public use.

## Validation

Run the isolated voting regression tests:

```
node --experimental-test-module-mocks --test --test-isolation=none src/utils/mealVotes.test.js
```

These use a fake database and cover date/meal separation, replacement without duplicate counts, rejection of removal, write rejection, opening times, and persistent browser identity. They do not cast votes in the live database.

After configuring database access, verify that only a currently serving meal shows voting. Submit a vote, observe the success animation and collapse, then reload: the controls must stay hidden. Failed writes should leave the controls available to retry. In Firebase Rules Playground, allow an `up`/`down` write at a valid ballot path and reject `null`, other values, invalid meal names, and collection-level writes.
