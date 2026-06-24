# Tradix Backend

This folder contains a simple Node.js + Express backend for the stock market web app.

## Run locally

1. Copy `.env.example` to `.env`
2. Add your Finnhub API key
3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm run dev
```

## API routes

- `GET /api/health`
- `GET /api/market/overview?region=US`
- `GET /api/stocks`
- `GET /api/stocks/:symbol`
- `GET /api/stocks/:symbol/history?range=1d`
- `GET /api/stocks/:symbol/news`
- `GET /api/location?lat=...&lng=...`
