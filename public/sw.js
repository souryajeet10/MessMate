// MessMate Service Worker — handles push notifications via postMessage
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

// Listen for notification trigger messages from the main app
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    const { title, options } = event.data;
    event.waitUntil(
      self.registration.showNotification(title, options || {})
    );
  }
});
