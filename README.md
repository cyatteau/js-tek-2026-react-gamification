# React and the Art of Gamification

Slides and demos for my JS Tek 2026 talk, **React and the Art of Gamification**.

This talk explores how gamification patterns can make React apps feel more motivating, responsive, and engaging without turning every app into a game. The focus is on practical React concepts like state, feedback loops, optimistic UI, rendering behavior, modern optimization, and social interaction.

## Slides

- [React and the Art of Gamification PDF](https://github.com/cyatteau/js-tek-2026-react-gamification/blob/main/slides.pdf)

## Demos

### 1. Instant XP

A tiny intro demo showing one feedback loop:

```txt
click → feedback → save → confirm
```

This demo starts with a delayed reward and then shows how React can make the reward feel instant with optimistic UI and pending feedback.

```bash
cd demos/instant-xp
npm install
npm run dev
```

### 2. Quest Map App

The main demo for the talk.

This app shows a fuller gamified experience with:

- location-based exploration
- local demographic-data badges
- nearby landmark quests
- quest progress
- profile achievements
- basemap style unlocks
- badge sharing
- a simulated top players list
- React rendering and optimization patterns

```bash
cd demos/quest-map-app
npm install
npm run dev
```

### 3. Final Instant XP Demo

A callback demo that revisits the original Instant XP idea and maps it to the G.A.M.E.S. framework.

```bash
cd demos/instant-xp-final
npm install
npm run dev
```

## G.A.M.E.S. Framework

The talk uses **G.A.M.E.S.** as a way to organize gamification patterns for React developers:

| Letter | Focus | React connection |
|---|---|---|
| G | Gamified UI Elements | State becomes visible feedback |
| A | Advanced State Control | Context, reducers, and rule-driven state |
| M | Memoization / Modern Optimization | Component boundaries, render behavior, React Compiler |
| E | Efficient Rendering | Lazy loading, Suspense, refs, effects, conditional rendering |
| S | Social Interaction | Sharing, leaderboards, and multiplayer-style patterns |

## Repo Structure

```txt
.
├── README.md
├── slides.pdf
└── demos
    ├── instant-xp
    ├── instant-xp-final
    └── quest-map-app
```

## Running the Demos

Each demo is a separate app. Open the demo folder you want to run, install dependencies, and start the dev server.

```bash
cd demos/name-of-demo
npm install
npm run dev
```

## Notes

These demos are built for teaching and conference presentation purposes. They are intentionally small and focused on showing React patterns in the context of gamified user experiences.

If you use the demos as a starting point, make sure to add your own API keys, environment variables, and production-ready error handling where needed.
