/**
 * useMenuOverrides — Real-time Firebase hook for cross-device menu sync.
 *
 * Subscribes to the `menu_overrides/` node in Firebase Realtime Database.
 * Any admin change (confirmation toggle, dish edit) instantly propagates
 * to every connected device without a page refresh.
 *
 * Falls back to localStorage cache if Firebase is unavailable (offline mode).
 */
import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "../services/firebase";

const LOCAL_CACHE_KEY = "messmate_menu_overrides";

function readLocalCache() {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLocalCache(data) {
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

export function useMenuOverrides() {
  const [overrides, setOverrides] = useState(() => readLocalCache());
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    const overridesRef = ref(db, "menu_overrides");

    const unsubscribe = onValue(
      overridesRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        setOverrides(data);
        writeLocalCache(data); // keep local cache in sync for offline fallback
        setIsFirebaseReady(true);
      },
      (error) => {
        // Firebase unavailable — stay on local cache silently
        console.warn("[MessMate] Firebase offline, using local cache:", error.message);
        setOverrides(readLocalCache());
      }
    );

    // Cleanup listener on unmount
    return () => off(overridesRef, "value", unsubscribe);
  }, []);

  return { overrides, isFirebaseReady };
}
