import { useEffect, useRef, useState } from "react";
import { Check, ThumbsUp, ThumbsDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSiteClock } from "../hooks/useSiteClock";
import {
  getVoterId, isMealServing, mealVoteKey, saveMealVote,
  subscribeMealVotes, subscribeVoteConnection, summarizeVotes,
} from "../utils/mealVotes.js";

export default function MealVote({ date, mealKey, mealTitle, timing }) {
  const { now } = useSiteClock();
  if (!isMealServing(date, timing, now)) return null;
  const key = mealVoteKey(date, mealKey);
  // A date change must reset subscription, pending state, and errors together.
  return <MealVoteControls key={key} voteKey={key} mealTitle={mealTitle} />;
}

function MealVoteControls({ voteKey, mealTitle }) {
  const [voterId] = useState(() => {
    try { return getVoterId(); } catch { return null; }
  });
  const [votes, setVotes] = useState(null);
  const [connected, setConnected] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [readFailed, setReadFailed] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const reduceMotion = useReducedMotion();
  const saving = useRef(false);

  useEffect(() => {
    const stopVotes = subscribeMealVotes(voteKey, (ballots) => {
      setVotes(summarizeVotes(ballots, voterId));
      setReadFailed(false);
    }, (error) => {
      console.warn("[MessMate] Meal voting unavailable:", error.code);
      setReadFailed(true);
    });
    const stopConnection = subscribeVoteConnection(setConnected);
    return () => {
      stopVotes();
      stopConnection();
    };
  }, [voteKey, voterId]);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setDismissed(true), 1000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const disabled = !voterId || !connected || !votes || readFailed || pending || !!feedback;
  // Wait for loaded ballots so previously voted meals never flash the controls.
  // Keep a newly saved vote visible briefly for its success animation.
  const hidden = dismissed || (!votes && !readFailed) || (!!votes?.selected && !pending && !error && !feedback);
  const showCounts = !readFailed && votes && votes.up + votes.down >= 10;

  async function vote(choice) {
    if (disabled || saving.current || votes.selected === choice) return;
    saving.current = true;
    setPending(true);
    setError("");
    try {
      await saveMealVote(voteKey, voterId, choice);
      setFeedback((previous) => ({ choice, sequence: (previous?.sequence ?? 0) + 1 }));
    } catch {
      setError("Couldn't save your vote. Please try again.");
    } finally {
      saving.current = false;
      setPending(false);
    }
  }

  const message = !voterId ? "Enable browser storage to vote."
    : readFailed ? "Voting is unavailable right now."
    : !connected ? "Connect to the internet to vote."
    : !votes ? "Loading votes…"
    : pending ? "Saving your vote…"
    : error || (feedback ? "Thanks! Your vote is saved." : "Did the food served match this menu?");

  return (
    <AnimatePresence initial={false}>
    {!hidden && <motion.div className={`meal-vote ${votes?.selected ? `has-vote-${votes.selected}` : ""}`} role="group" aria-label={`${mealTitle} menu accuracy`}
      initial={{ opacity: 0 }} animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0, borderTopWidth: 0, overflow: "hidden" }}
      transition={{ duration: reduceMotion ? 0 : 0.25 }}>
      <div className="meal-vote-row">
        <span className="meal-vote-question">Was this menu correct?</span>
        <div className="meal-vote-buttons">
          {[["up", "Yes", ThumbsUp], ["down", "No", ThumbsDown]].map(([choice, label, Icon]) => (
            <motion.button
              key={choice}
              type="button"
              className={`meal-vote-button ${choice}`}
              aria-label={`${label}, ${mealTitle} menu was ${choice === "up" ? "correct" : "incorrect"}`}
              aria-pressed={votes?.selected === choice}
              aria-disabled={disabled || votes?.selected === choice}
              disabled={disabled}
              onClick={() => vote(choice)}
              whileTap={!reduceMotion && !disabled && votes?.selected !== choice ? { scale: 0.94 } : undefined}
            >
              <motion.span
                className="meal-vote-icon"
                key={feedback?.choice === choice ? feedback.sequence : "idle"}
                animate={feedback?.choice === choice && !reduceMotion
                  ? { scale: [1, 1.5, 0.9, 1.12, 1], rotate: [0, choice === "up" ? -18 : 18, 8, 0] }
                  : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.55 }}
              >
                <Icon size={16} aria-hidden="true" />
              </motion.span>
              <span>{label}</span>
              {showCounts && votes[choice] > 0 && <motion.span
                className="meal-vote-count"
                key={`count-${votes?.[choice]}`}
                initial={reduceMotion ? false : { y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >{votes[choice]}</motion.span>}
              {feedback?.choice === choice && !reduceMotion && (
                <span className="meal-vote-burst" key={`burst-${feedback.sequence}`} aria-hidden="true">
                  {Array.from({ length: 8 }, (_, index) => {
                    const angle = (index / 8) * Math.PI * 2;
                    return <motion.i key={index}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{ x: Math.cos(angle) * 32, y: Math.sin(angle) * 28, opacity: 0, scale: 0.2 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />;
                  })}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
      <p className="meal-vote-hint" role="status">
        {feedback && !pending && !error && !readFailed && connected && (
          <motion.span key={feedback?.sequence ?? "saved"} className="meal-vote-saved-icon"
            initial={reduceMotion ? false : { scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }} aria-hidden="true">
            <Check size={13} />
          </motion.span>
        )}
        {message}
      </p>
    </motion.div>}
    </AnimatePresence>
  );
}
