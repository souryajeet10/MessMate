import { useEffect, useState } from "react";
import { SiteClockContext } from "../hooks/useSiteClock";

export default function SiteClockProvider({ children }) {
  const [realTime, setRealTime] = useState(Date.now);

  useEffect(() => {
    const timer = setInterval(() => setRealTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <SiteClockContext.Provider value={{ now: new Date(realTime) }}>
      {children}
    </SiteClockContext.Provider>
  );
}
