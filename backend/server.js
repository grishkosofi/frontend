import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getOverview, getStockQuote, getStockHistory, getStockNews, searchStocks, getLocationMarket } from './services/stockApi.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'tradix-backend' });
});

app.get('/api/market/overview', async (req, res) => {
  try {
    const region = req.query.region || 'US';
    const data = await getOverview(region);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load market overview' });
  }
});

app.get('/api/stocks', async (req, res) => {
  try {
    const region = req.query.region || 'US';
    const data = await searchStocks(region);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load stocks' });
  }
});

app.get('/api/stocks/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await getStockQuote(symbol.toUpperCase());
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load stock quote' });
  }
});

app.get('/api/stocks/:symbol/history', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { range = '1d' } = req.query;
    const data = await getStockHistory(symbol.toUpperCase(), range);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load stock history' });
  }
});

app.get('/api/stocks/:symbol/news', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await getStockNews(symbol.toUpperCase());
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load stock news' });
  }
});

app.get('/api/location', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const data = await getLocationMarket(lat, lng);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to detect location market' });
  }
});

app.listen(PORT, () => {
  console.log(`Tradix backend running on port ${PORT}`);
});
