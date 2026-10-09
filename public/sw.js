// MessMate Service Worker v2 (2026-10-09) — for offline and PWA caching
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
