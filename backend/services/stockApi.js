import { getCache, setCache } from './cache.js';

const BASE = 'https://finnhub.io/api/v1';

function getApiKey() {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    throw new Error('FINNHUB_API_KEY is missing. Add it to your environment variables.');
  }
  return key;
}

async function apiCall(path, params = {}) {
  const url = new URL(`${BASE}${path}`);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  url.searchParams.set('token', getApiKey());

  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Finnhub API error ${response.status}: ${body}`);
  }

  return response.json();
}

export async function getQuote(symbol) {
  const key = `quote:${symbol}`;
  const cached = getCache(key);
  if (cached) return cached;

  const data = await apiCall('/quote', { symbol });
  const normalized = {
    symbol,
    price: data.c,
    change: data.d,
    changePercent: data.dp,
    high: data.h,
    low: data.l,
    open: data.o,
    previousClose: data.pc,
    timestamp: data.t,
  };

  setCache(key, normalized, 30_000);
  return normalized;
}

export async function getProfile(symbol) {
  const key = `profile:${symbol}`;
  const cached = getCache(key);
  if (cached) return cached;

  const data = await apiCall('/stock/profile2', { symbol });
  setCache(key, data, 24 * 60 * 60 * 1000);
  return data;
}

export async function getCandles(symbol, resolution = 'D', from, to) {
  const key = `candles:${symbol}:${resolution}:${from}:${to}`;
  const cached = getCache(key);
  if (cached) return cached;

  const data = await apiCall('/stock/candle', {
    symbol,
    resolution,
    from,
    to,
  });

  setCache(key, data, 60_000);
  return data;
}

export async function getCompanyNews(symbol, from, to) {
  const key = `company-news:${symbol}:${from}:${to}`;
  const cached = getCache(key);
  if (cached) return cached;

  const data = await apiCall('/company-news', { symbol, from, to });
  setCache(key, data, 10 * 60_000);
  return data;
}

export async function getMarketNews(category = 'general') {
  const key = `market-news:${category}`;
  const cached = getCache(key);
  if (cached) return cached;

  const data = await apiCall('/news', { category });
  setCache(key, data, 10 * 60_000);
  return data;
}

export async function searchSymbols(q) {
  const key = `search:${q}`;
  const cached = getCache(key);
  if (cached) return cached;

  const data = await apiCall('/search', { q });
  setCache(key, data, 60_000);
  return data;
}
