import { Router } from 'express';
import { regionByTimezone } from '../utils/region.js';

const router = Router();

router.get('/', (req, res) => {
  const tz = String(req.query.tz || 'UTC');
  const locale = String(req.query.locale || 'en-US');
  const now = new Date();

  const { region, market } = regionByTimezone(tz);

  res.json({
    timezone: tz,
    locale,
    isoTime: now.toISOString(),
    localTime: new Intl.DateTimeFormat(locale, {
      dateStyle: 'full',
      timeStyle: 'long',
      timeZone: tz,
    }).format(now),
    region,
    market,
  });
});

export default router;
