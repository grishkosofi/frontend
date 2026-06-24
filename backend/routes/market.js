import { Router } from 'express';
import { getMarketNews, getQuote } from '../services/stockApi.js';

const router = Router();

router.get('/overview', async (req, res, next) => {
  try {
    const watchlist = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'TSLA'];
    const top = await Promise.all(watchlist.map((symbol) => getQuote(symbol)));

    const movers = [...top]
      .sort((a, b) => Math.abs((b.changePercent || 0)) - Math.abs((a.changePercent || 0)))
      .slice(0, 3);

    const news = await getMarketNews('general');

    res.json({
      top,
      movers,
      news: Array.isArray(news) ? news.slice(0, 10) : [],
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
