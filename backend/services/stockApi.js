const baseStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'Nvidia Corp.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  { symbol: 'BAC', name: 'Bank of America Corp.' },
  { symbol: 'JNJ', name: 'Johnson & Johnson' }
];

const cache = new Map();
const CACHE_TTL = 60 * 1000;

function setCache(key, value) {
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL });
}

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function makeQuote(symbol, index = 0) {
  const priceBase = [189.3, 378.92, 213.17, 413.17, 713.17, 153.51, 489.2, 196.44, 34.72, 153.9][index % 10];
  const changePercent = [1.2, 0.8, 2.7, -2.7, -2.7, -1.1, 3.2, 0.4, -0.9, 0.2][index % 10];
  return {
    symbol,
    price: priceBase,
    changePercent,
    change: +(priceBase * changePercent / 100).toFixed(2),
    open: +(priceBase * 0.99).toFixed(2),
    high: +(priceBase * 1.02).toFixed(2),
    low: +(priceBase * 0.98).toFixed(2),
    previousClose: +(priceBase * (1 - changePercent / 100)).toFixed(2)
  };
}

export async function getOverview(region = 'US') {
  const key = `overview:${region}`;
  const cached = getCache(key);
  if (cached) return cached;

  const payload = {
    region,
    updatedAt: new Date().toISOString(),
    indices: [
      { symbol: 'S&P 500', value: 5480.12, changePercent: 0.62 },
      { symbol: 'NASDAQ', value: 17895.31, changePercent: 0.91 },
      { symbol: 'DOW', value: 39021.18, changePercent: -0.14 }
    ],
    movers: baseStocks.slice(0, 5).map((stock, index) => ({
      ...stock,
      ...makeQuote(stock.symbol, index)
    }))
  };

  setCache(key, payload);
  return payload;
}

export async function searchStocks() {
  const key = 'stocks:list';
  const cached = getCache(key);
  if (cached) return cached;

  const payload = baseStocks.map((stock, index) => ({
    ...stock,
    ...makeQuote(stock.symbol, index)
  }));

  setCache(key, payload);
  return payload;
}

export async function getStockQuote(symbol) {
  const key = `quote:${symbol}`;
  const cached = getCache(key);
  if (cached) return cached;

  const index = baseStocks.findIndex(s => s.symbol === symbol);
  const payload = {
    symbol,
    name: baseStocks[index]?.name || `${symbol} Corp.`,
    ...makeQuote(symbol, Math.max(index, 0)),
    marketCap: '$2.89T',
    peRatio: 29.34,
    volume: '58.4M',
    updatedAt: new Date().toISOString()
  };

  setCache(key, payload);
  return payload;
}

export async function getStockHistory(symbol, range = '1d') {
  const key = `history:${symbol}:${range}`;
  const cached = getCache(key);
  if (cached) return cached;

  const points = Array.from({ length: 24 }, (_, i) => ({
    time: i,
    value: +(180 + Math.sin(i / 2) * 6 + i * 0.8).toFixed(2)
  }));

  const payload = { symbol, range, points };
  setCache(key, payload);
  return payload;
}

export async function getStockNews(symbol) {
  const key = `news:${symbol}`;
  const cached = getCache(key);
  if (cached) return cached;

  const payload = [
    { title: `${symbol} releases new product lineup`, summary: 'The company announced new features and services.', time: '2 hours ago' },
    { title: `Q2 Earnings Beat Expectations`, summary: 'Results came in above estimates despite market headwinds.', time: '5 hours ago' },
    { title: `Analysts Raise Price Target`, summary: 'Several firms raised their target after the latest update.', time: '1 day ago' }
  ];

  setCache(key, payload);
  return payload;
}

export async function getLocationMarket(lat, lng) {
  return {
    lat: lat ?? null,
    lng: lng ?? null,
    region: 'US',
    market: 'NASDAQ',
    timezone: 'America/New_York',
    localTime: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  };
}
