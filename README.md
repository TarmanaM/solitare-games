# ♠️ Klondike Solitaire — Web Card Game

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Material UI](https://img.shields.io/badge/Material--UI-v6-007FFF?style=for-the-badge&logo=mui)](https://mui.com/)
[![Zustand](https://img.shields.io/badge/Zustand-State-orange?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery)](https://tanstack.com/query)
[![Prisma](https://img.shields.io/badge/Prisma-SQLite-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

A modern, responsive, and elegant implementation of the classic **Klondike Solitaire** card game. Designed with a rich casino green felt aesthetic, fluid HTML5 Drag-and-Drop mechanics, intelligent auto-moves, and a local leaderboard powered by Prisma & SQLite.

---

## 🌟 Key Features

### 🃏 Gameplay Mechanics
- **Full Klondike Solitaire Logic**: Standard 52-card deck with 7 Tableau cascades, 4 Foundation piles, Stock, and Waste piles.
- **Draw 1 & Draw 3 Modes**: Seamless toggle between casual (Draw 1) and challenging (Draw 3) play styles.
- **HTML5 Drag & Drop**:
  - Drag single cards or cascade stacks of cards across Tableau columns.
  - Drop targets with glowing visual feedback and anti-flicker protection.
- **Multi-Input Controls**:
  - **Drag and Drop**: Natural physical card movement.
  - **Click to Move**: Tap source card, then tap destination.
  - **Smart Move (Double-Click)**: Instantly sends eligible cards to the Foundation or optimal Tableau slot.
- **Unlimited Undo**: Snapshot-based history stack allowing players to revert previous moves and scores safely.
- **Scoring & Metrics**: Real-time timer, step-by-step move counter, and standard Klondike score calculation.
- **Auto-Complete Detection**: Detects when all remaining cards are face-up and provides a one-click auto-solve animation.
- **Victory Celebration**: Dynamic confetti animation and a victory dialog to submit record times and high scores.

### 🏆 Backend & Database
- **SQLite with Prisma ORM**: Persists game records, winning times, move counts, and player high scores.
- **TanStack Query (React Query)**: Smooth data fetching, caching, and cache invalidation for leaderboards and player stats.
- **Server-Sent Events (SSE)**: Real-time broadcast channel streaming victory notifications from the server to connected clients.

### 🎨 Design & Aesthetic
- **Casino Felt Surface**: Deep radial gradients, soft felt texture patterns, and gold metallic accents.
- **Pure Vector & Typography Cards**: Lightweight, crisp, and high-performance card presentation using SVG/Unicode suit glyphs without heavy external image assets.
- **Fully Responsive**: Adapts seamlessly from mobile screens to ultrawide desktop monitors.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router, React 19) | Server and Client rendering, API route endpoints |
| **Language** | Modern JavaScript (ES6+) | Clean, standardized code base |
| **UI Framework** | [Material UI (MUI)](https://mui.com/) | Theme tokens, dialogs, buttons, and layout grids |
| **Client State** | [Zustand](https://github.com/pmndrs/zustand) | Highly performant game state, deck dealing, and undo snapshots |
| **Server State** | [TanStack Query](https://tanstack.com/query) | Asynchronous data management for leaderboard APIs |
| **Database & ORM** | [Prisma](https://www.prisma.io/) + SQLite | Local storage for match history and leaderboard rankings |
| **Realtime** | Server-Sent Events (SSE) | Server-to-client notifications |
| **Visual Effects** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) | Particle animations upon completing games |

---

## 📁 Project Structure

```text
solitare/
├── README.md                      # Project documentation (this file)
└── solitare-ui/                   # Application directory
    ├── app/
    │   ├── api/game/
    │   │   ├── leaderboard/       # Leaderboard and statistics API
    │   │   ├── save/              # Game record persistence API
    │   │   └── sse/               # Server-Sent Events notification stream
    │   ├── layout.js              # Root layout & providers wrapper
    │   ├── page.js                # Server-rendered entry shell
    │   └── globals.css            # Base stylesheet & scrollbar resets
    ├── components/
    │   ├── game/                  # Game components (Board, Card, Tableau, Foundations, StockWaste)
    │   ├── providers/             # React Query & MUI Theme providers
    │   ├── theme/                 # Custom dark casino theme definition
    │   └── ui/                    # Header, LeaderboardModal, WinModal, NotificationSnackbar
    ├── lib/
    │   ├── prisma.js              # Prisma Client singleton
    │   ├── sse.js                 # SSE client connection registry
    │   └── solitaire/             # Pure game engine, deck generator, and move validation
    ├── prisma/
    │   ├── schema.prisma          # Database schema (GameRecord model)
    │   └── dev.db                 # SQLite database file
    └── store/
        └── useSolitaireStore.js   # Zustand store managing game flow, moves, and undo
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.18 or higher recommended)
- `npm` or `yarn`

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/solitaire-webapp.git
cd solitaire-webapp/solitare-ui
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize the Database
Generate the Prisma Client and synchronize the SQLite database:
```bash
npx prisma db push
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start playing.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🎮 Game Rules & Scoring

- **Foundations**: Must be built up from **Ace to King** by matching suit (♠, ♥, ♦, ♣).
- **Tableau**: Cards must alternate in colors (Red on Black, Black on Red) and descend in numerical order (King down to Ace).
- **Empty Spaces**: Only a **King** (or a sequence starting with a King) can occupy an empty Tableau column.
- **Scoring System**:
  - Waste to Tableau: `+5 points`
  - Waste to Foundation: `+10 points`
  - Tableau to Foundation: `+10 points`
  - Turning over a face-down Tableau card: `+5 points`
  - Foundation back to Tableau: `-15 points`
  - Recycling the Waste pile: `-20 points` (minimum 0)

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
