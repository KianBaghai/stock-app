'use client';

import { useEffect, useState } from 'react';
import { fetchPreviousClose, fetchTicker, fetchTickersPage } from '@/lib/polygon';
import StockTicker from '@/components/StockTicker';
import StockCard from '@/components/StockCard';

const tickersToCheck = ['AAPL', 'MSFT', 'NVDA', 'GOOGL'];

export default function TestData() {
  const [data, setData] = useState<any>(null);
  const [highClosers, setHighClosers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [tickers, setTickers] = useState<any[]>([]);

  useEffect(() => {
    async function getTickers() {
      const data = await fetchTickersPage();
      setTickers(data.results);
    }
    getTickers();
  }, []);


  useEffect(() => {
    async function load() {
      const res = await fetchPreviousClose('AAPL');
      setData(res);
    }
    load();
  }, []);

  useEffect(() => {
    async function fetchTickers() {
      const matching = await fetchTicker(tickersToCheck);
      setHighClosers(matching);
      setLoading(false);
    }

    fetchTickers();
  }, []);

  return (
    <div className="p-4">
      <h1>Previous Close Data for AAPL</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <h2 className="text-xl font-semibold mb-2">Tickers that close at ATH</h2>
      <ul>
        {highClosers.length > 0 ? (
          highClosers.map(ticker => <li key={ticker}>{ticker}</li>)
        ) : (
          <li>No matching tickers</li>
        )}
      </ul>
      {/* <StockTicker /> */}
      <div className="grid grid-cols-2 gap-4">
      {tickersToCheck.map((ticker) => (
        <StockCard key={ticker} ticker={ticker} />
      ))}
    </div>
      {/* <h1>Tickers (First Page)</h1>
      <ul>
        {tickers.map((ticker) => (
          <li key={ticker.ticker}>
            {ticker.ticker} — {ticker.name}: {ticker.currency}
          </li>
        ))}
      </ul> */}
    </div>
  );
}