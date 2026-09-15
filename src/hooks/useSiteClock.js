import { createContext, useContext } from "react";

export const SiteClockContext = createContext(null);

export function useSiteClock() {
  return useContext(SiteClockContext);
}
