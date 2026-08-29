import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { registerServiceWorker } from "./utils/notificationUtils";

// Register Service Worker early so notifications work on mobile
registerServiceWorker();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
