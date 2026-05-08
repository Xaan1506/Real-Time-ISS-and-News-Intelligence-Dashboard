# Real-Time ISS and News Intelligence Dashboard

Production-ready full-stack style dashboard frontend built with React + Vite + Tailwind CSS, focused on live ISS telemetry, news intelligence, constrained AI chat, and interactive visual analytics.

## Tech Stack

- React + Vite
- Tailwind CSS
- Zustand (state management)
- Axios (service layer with retry interceptors)
- React Leaflet + Leaflet (live ISS map)
- Recharts (line and pie charts)
- Framer Motion (animations)
- React Toastify (toasts)

## Features

- Live ISS tracking every 15 seconds (Open Notify endpoint via HTTPS-safe proxy)
- ISS trajectory map with marker, tooltips, and last 15 positions
- ISS speed calculation (Haversine formula)
- Reverse geocoded nearest place fallback: `Over Ocean / Remote Area`
- Astronauts currently in space
- News intelligence feed with category filters, search, sort, refresh states
- localStorage cache for news (15-minute expiry)
- Floating AI chatbot constrained to dashboard ISS/news context only
- Dark/light mode with persistence
- Responsive professional dashboard UI with cards and charts
- Error boundary + toast error handling

## Environment Variables

Create a `.env` file:

```bash
VITE_NEWS_API_KEY=your_news_api_key
VITE_AI_TOKEN=your_huggingface_token
```

## Run Locally

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel
vercel --prod
```

`vercel.json` includes SPA rewrites for client-side routing compatibility.

## Notes

- Do not hardcode API keys.
- `.env` is ignored by git.
- AI assistant is intentionally prompt-constrained to dashboard data context.
