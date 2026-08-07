# 🍽️ MessMate — United Homes Hostel Mess Menu App

> Real-time hostel mess menu app for United Homes students. Check today's menu, track favourite dishes, and get live meal alerts — all in a beautiful PWA.

---

## ✨ Features

### 👨‍🎓 For Students
- **Today's Live Menu** — See what's being served right now, what's coming up, and what's ended
- **Calendar View** — Browse the full week's menu by date with a swipeable date strip
- **Favourite Dishes** — Select favourite dishes from a pre-fed catalog; get starred alerts when they're on the menu
- **Planned vs Confirmed Badges** — Know if today's menu is confirmed or still subject to change
- **Dark Mode** — Toggle between light and dark themes
- **PWA / Home Screen** — Install directly to your phone's home screen for instant access

### 🛠️ For Mess Manager / Owner
- **Manager Portal** (`/admin`) — Hidden from students, accessible via direct URL only
- **Instant Calendar Editor** — Pick any date, toggle Confirmed/Planned, add/remove dishes from pre-fed catalog
- **Auto-Save on Tap** — Every change saves live with zero manual save button hassle
- **Category Filters** — Filter dishes by category (Breakfast, HI-TEA, Main Course, etc.)
- **Reset to Default** — Revert any day back to the default menu in one tap

### 📱 PWA & Notifications
- **Add to Home Screen** prompt on mobile
- **Browser Notification** permission for dish reminders
- **Local Network Hosting** — View on any device on the same Wi-Fi

---

## 🗂️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19 + Vite** | UI framework & build tool |
| **React Router v7** | Client-side routing |
| **Framer Motion** | Animations & micro-interactions |
| **Lucide React** | Icons |
| **Vanilla CSS** | Custom design system & theming |
| **localStorage** | Favorites & menu override persistence |
| **Web Notifications API** | Browser dish reminders |
| **Web App Manifest** | PWA home screen installation |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server (localhost only)
npm run dev

# Start with local network access (view on mobile)
npm run dev -- --host
```

The app runs on `http://localhost:5173/`  
On local network (mobile): `http://<your-ip>:5173/`

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AdminPanel.jsx        # Manager Portal (URL: /admin)
│   ├── CalendarView.jsx      # Weekly calendar with date carousel
│   ├── FavouritesPage.jsx    # Student dish favorites
│   ├── MealCard.jsx          # Individual meal card
│   ├── PwaInstallPrompt.jsx  # Mobile add-to-home popup
│   ├── Sidebar.jsx           # Navigation drawer
│   └── WelcomeScreen.jsx     # Intro/splash screen
├── context/
│   └── ThemeContext.jsx      # Light/Dark mode
├── data/
│   ├── dishesCatalog.js      # Pre-fed master dish list with unique IDs
│   └── menuData.js           # Weekly menu data (dish ID references)
├── pages/
│   └── TodayPage.jsx         # Today's live menu page
└── utils/
    ├── favouritesUtils.js    # Favourite dish tracking logic
    ├── menuUtils.js          # Menu status & admin override logic
    └── notificationUtils.js  # Browser notification helpers
```

---

## 🍛 Mess Timings

| Meal | Time |
|---|---|
| **Breakfast** | 6:30 AM — 9:00 AM |
| **Lunch** | 12:00 PM — 2:30 PM |
| **HI-TEA** | 5:30 PM — 6:30 PM |
| **Dinner** | 8:00 PM — 9:30 PM |

---

## ⚙️ Updating the Menu (for Managers)

Visit `http://<your-ip>:5173/admin` on any device.

1. **Select a date** from the calendar strip
2. **Toggle Confirmed / Planned** status
3. **Tap any dish** from the catalog to add/remove it from a meal
4. Changes **auto-save instantly** — no save button needed

See [MENU_GUIDE.md](./MENU_GUIDE.md) for the manual JSON editing approach.

---

## 💾 Data Persistence

| Data | Storage |
|---|---|
| Student favourite dish IDs | `localStorage` (per browser/device) |
| Admin menu overrides | `localStorage` (per browser/device) |
| Theme preference | `localStorage` |

---

## 📋 Roadmap / Future Ideas

- [ ] Firebase backend for cross-device favorites sync
- [ ] Admin authentication / passcode lock for `/admin`
- [ ] Full month menu upload via CSV/Excel
- [ ] Push notifications via Service Worker
- [ ] Feedback / rating system for meals

---

## 🏠 About

Built for **United Homes Hostel** students to check mess menu faster than asking anyone.

*MessMate — Know before you go.* 🥘
