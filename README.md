# react-currency-converter

A currency converter in React + Vite that works the moment you clone it. Rates are the **official tables published by 121 central banks and 3 tax authorities** (ECB, Fed, Bank of England, RBI, HMRC and more), fetched from a keyless, CORS-open endpoint. No API key, no backend, nothing to configure.

## Use this template

Click **Use this template** on GitHub, or:

```sh
npm install
npm run dev
```

## How it works

`src/rates.js` fetches `https://allratestoday.com/api/open/central-bank/<bank>` and resolves any pair from the published table: directly, by inverse, or as a cross via the bank's home currency. The UI shows which, because that distinction matters on invoices and tax filings.

Want the same data as static files? [central-bank-exchange-rates](https://github.com/AllRates-Today/central-bank-exchange-rates) publishes every table daily as JSON and CSV on jsDelivr.

## Real-time rates

Official tables are once-a-day fixings. For live mid-market rates across 160+ currencies you need a [free API key](https://allratestoday.com/register), and the call must be made from a server so the key is never shipped to the browser. The [Next.js starter](https://github.com/AllRates-Today/nextjs-currency-starter) shows that pattern.

## License

MIT. Rate data is free to use with attribution to [AllRatesToday](https://allratestoday.com).

## 🔗 Links

- **AI agents:** Claude Code plugin `/plugin marketplace add AllRates-Today/claude-code-plugin` · hosted MCP endpoint `https://allratestoday.com/api/mcp` (keyless)
