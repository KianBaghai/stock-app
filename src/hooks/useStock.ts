// hooks/useStock.ts
import { useEffect, useState } from 'react';

const apiKey = 'uEwDOOPbb3vqg9DF5XjWZdD1oxSiCYHb'; // Replace with env var in prod

export default function useStock(ticker: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStock = async () => {
    try {
      setLoading(true);

      // Fetch previous day OHLC data
      const prevRes = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`
      );
      const prevJson = await prevRes.json();
      const prevData = prevJson?.results?.[0];

      // Fetch last trade (delayed) data
      const lastRes = await fetch(
        `https://api.polygon.io/v2/last/trade/${ticker}?apiKey=${apiKey}`
      );
      const lastJson = await lastRes.json();
      const currentPrice = lastJson?.last?.price;
      const currentTime = lastJson?.last?.timestamp;

      // Combine into a single object
      setData({
        ...prevData,
        currentPrice,
        currentTime,
      });
    } catch (e) {
      console.error('Error fetching stock data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
    const interval = setInterval(fetchStock, 15 * 60 * 1000); // 15 minutes
    return () => clearInterval(interval);
  }, [ticker]);

  return { data, loading };
}