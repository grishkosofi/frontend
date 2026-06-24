# Tradix App (Frontend + Backend)

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set your key:

```bash
cp .env.example .env
# then edit FINNHUB_API_KEY
```

3. Start server:

```bash
npm run dev
```

Server: `http://localhost:3000`

## API endpoints

- `GET /api/health`
- `GET /api/location?tz=America/New_York&locale=en-US`
- `GET /api/market/overview`
- `GET /api/stocks?symbols=AAPL,MSFT,NVDA`
- `GET /api/stocks/:symbol`
- `GET /api/stocks/:symbol/history?resolution=D`
- `GET /api/stocks/:symbol/news`
- `GET /api/stocks/search?q=apple`

## Notes

- API key is stored only on backend (`FINNHUB_API_KEY`).
- Basic in-memory caching is enabled to reduce external API calls.
