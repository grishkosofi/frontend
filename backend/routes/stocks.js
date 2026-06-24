import { Router } from 'express';
import {
  getCandles,
  getCompanyNews,
  getProfile,
  getQuote,
  searchSymbols,
} from '../services/stockApi.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const symbols = String(req.query.symbols || 'AAPL,MSFT,GOOGL,AMZN,TSLA')
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    const items = await Promise.all(symbols.map((symbol) => getQuote(symbol)));
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }

    const data = await searchSymbols(q);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/:symbol', async (req, res, next) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    const [quote, profile] = await Promise.all([getQuote(symbol), getProfile(symbol)]);

    res.json({
      symbol,
      quote,
      profile,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:symbol/history', async (req, res, next) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const resolution = String(req.query.resolution || 'D');

    const to = Math.floor(Date.now() / 1000);
    const from = Number(req.query.from || to - 60 * 60 * 24 * 30);

    const data = await getCandles(symbol, resolution, from, to);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/:symbol/news', async (req, res, next) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    const toDate = new Date();
    const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const to = toDate.toISOString().slice(0, 10);
    const from = fromDate.toISOString().slice(0, 10);

    const items = await getCompanyNews(symbol, from, to);
    res.json({ symbol, from, to, items });
  } catch (error) {
    next(error);
  }
});

export default router;
