import { useEffect, useMemo, useState } from 'react';
import { currencies, latestTable, listSources, resolve } from './rates.js';

export default function App() {
  const [sources, setSources] = useState([]);
  const [bank, setBank] = useState('ecb');
  const [table, setTable] = useState(null);
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [error, setError] = useState('');

  useEffect(() => { listSources().then(setSources).catch((e) => setError(e.message)); }, []);
  useEffect(() => {
    setTable(null);
    latestTable(bank).then(setTable).catch((e) => setError(e.message));
  }, [bank]);

  const codes = useMemo(() => (table ? currencies(table) : []), [table]);
  useEffect(() => {
    if (!codes.length) return;
    if (!codes.includes(from)) setFrom(codes[0]);
    if (!codes.includes(to)) setTo(codes[1] ?? codes[0]);
  }, [codes]);

  const result = table && codes.includes(from) && codes.includes(to) ? resolve(table, from, to) : null;
  const value = result ? Number(amount || 0) * result.rate : null;

  return (
    <main className="card">
      <h1>Currency Converter</h1>
      <p className="sub">Official central bank rates. No API key.</p>

      <label>Rate source
        <select value={bank} onChange={(e) => setBank(e.target.value)}>
          {sources.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
        </select>
      </label>

      <div className="row">
        <label>Amount<input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
        <label>From
          <select value={from} onChange={(e) => setFrom(e.target.value)}>{codes.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
        <button className="swap" onClick={() => { setFrom(to); setTo(from); }} aria-label="swap">⇄</button>
        <label>To
          <select value={to} onChange={(e) => setTo(e.target.value)}>{codes.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
      </div>

      {error && <p className="err">{error}</p>}
      {!table && !error && <p className="muted">Loading…</p>}
      {table && result && (
        <div className="result">
          <div className="big">{Number(amount || 0).toLocaleString()} {from} = <strong>{value.toLocaleString(undefined, { maximumFractionDigits: 4 })}</strong> {to}</div>
          <div className="muted">1 {from} = {result.rate.toPrecision(6)} {to} · {result.method} · {table.bank.toUpperCase()} table of {table.rate_date}</div>
        </div>
      )}
      {table && !result && <p className="err">{bank.toUpperCase()} does not publish a rate covering {from}/{to}.</p>}

      <p className="attr">Rates by <a href={table?.attribution?.url ?? 'https://allratestoday.com'} target="_blank" rel="noopener">AllRatesToday</a></p>
    </main>
  );
}
