# Weather Now — Microservice on Vercel (no database)

A tiny **Next.js** app that exposes an `/api/weather` microservice which fetches **free** weather data from **Open‑Meteo** (no API key) and renders a public dashboard. Designed for easy deploy to **Vercel**.

> ✅ No MongoDB. ✅ Free public weather API. ✅ Works on Vercel. ✅ Anyone can open the URL.

---

## What you get

- `GET /api/weather?lat=13.7563&lon=100.5018&tz=Asia/Bangkok`  
  A serverless API that retrieves **current** and **hourly** forecast from Open‑Meteo and caches responses for 10 minutes.

- A simple responsive web UI that lets you pick a city (or enter coordinates) and shows **current** conditions plus the **next hours** forecast.

- Clean code structure using the **Next.js App Router**.

Data Source: Open‑Meteo Free Weather API (no key required). See docs: https://open-meteo.com/en/docs

---

## Deploy (Vercel)

### Option A — GitHub + Vercel
1. Create a new GitHub repo and push this folder.
2. In **Vercel → Add New… → Project**, import the repo and **Deploy**.

### Option C — Vercel CLI (optional)
```bash
npm i -g vercel
vercel  # follow prompts
```

---

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000
```

---

## How the “automatic retrieve” works

- The API route `/api/weather` calls Open‑Meteo on-demand and returns JSON.
- Responses are cached for **10 minutes** (`s-maxage=600`) by Vercel for efficiency.
- The UI reuses the same route; you can also call it from external clients (it’s your small **microservice**).

> Want a fixed schedule? Add **Vercel Cron** to ping your API (e.g., every hour).  
> See docs: https://vercel.com/docs/cron-jobs

Example `vercel.json` (optional):
```json
{ "crons": [ { "path": "/api/weather", "schedule": "0 * * * *" } ] }
```

---

## Change default city

Edit `app/page.js`, the `PRESETS` array. Bangkok is the default.

---

## License & Attribution

- This starter is MIT.  
- Weather data © Open‑Meteo — free for **non‑commercial** use, **no API key** required. Please review their terms and attribution requirements.

---

## Notes

- If you need Thai labels or a custom design, just edit the JSX/CSS in `app/`.
- You can pass `lat`, `lon`, and `tz` in the querystring to the API and UI reads them.

```
/api/weather?lat=18.7877&lon=98.9931&tz=Asia/Bangkok
```
