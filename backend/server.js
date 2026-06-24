import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import stocksRouter from './routes/stocks.js';
import marketRouter from './routes/market.js';
import locationRouter from './routes/location.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/health', (_, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.use('/api/stocks', stocksRouter);
app.use('/api/market', marketRouter);
app.use('/api/location', locationRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');

app.use(express.static(frontendDir));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: 'Server error',
    details: err.message,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
