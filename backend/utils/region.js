export function regionByTimezone(tz = '') {
  const z = String(tz).toLowerCase();

  if (
    z.includes('new_york') ||
    z.includes('chicago') ||
    z.includes('denver') ||
    z.includes('los_angeles')
  ) {
    return { region: 'US', market: 'US' };
  }

  if (z.includes('london')) return { region: 'UK', market: 'UK' };

  if (
    z.includes('berlin') ||
    z.includes('paris') ||
    z.includes('rome') ||
    z.includes('madrid')
  ) {
    return { region: 'EU', market: 'EU' };
  }

  if (z.includes('tokyo')) return { region: 'JP', market: 'JP' };

  if (
    z.includes('hong_kong') ||
    z.includes('shanghai') ||
    z.includes('singapore') ||
    z.includes('seoul')
  ) {
    return { region: 'APAC', market: 'APAC' };
  }

  return { region: 'GLOBAL', market: 'US' };
}
