// Official central bank tables from the keyless AllRatesToday open endpoint.
// Edge-cached, CORS-open, changes once a day. No key, no quota.
// For real-time mid-market rates, call /api/v1/rates from a server with a free
// key (never ship a key in browser code) — see the Next.js starter:
// https://github.com/AllRates-Today/nextjs-currency-starter
const OPEN = 'https://allratestoday.com/api/open';

export async function listSources() {
  const r = await fetch(`${OPEN}/central-banks`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return (await r.json()).sources;
}

export async function latestTable(bank = 'ecb') {
  const r = await fetch(`${OPEN}/central-bank/${bank}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

// Resolve source→target from a published table: direct, inverse, or cross via
// the bank's home currency. Returns the method so the UI can say which.
export function resolve(table, source, target) {
  if (source === target) return { rate: 1, method: 'identity' };
  const map = new Map(table.rates.map((r) => [`${r.base}/${r.quote}`, r.value]));
  const get = (a, b) => map.get(`${a}/${b}`) ?? (map.has(`${b}/${a}`) ? 1 / map.get(`${b}/${a}`) : undefined);
  const direct = map.get(`${source}/${target}`);
  if (direct) return { rate: direct, method: 'published' };
  const inv = map.get(`${target}/${source}`);
  if (inv) return { rate: 1 / inv, method: 'inverse' };
  const homes = new Set(table.rates.flatMap((r) => [r.base, r.quote]));
  for (const home of homes) {
    const a = get(home, source), b = get(home, target);
    if (a && b) return { rate: b / a, method: `cross via ${home}` };
  }
  return null;
}

export function currencies(table) {
  return [...new Set(table.rates.flatMap((r) => [r.base, r.quote]))].sort();
}
