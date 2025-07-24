// components/StockTicker.tsx
// won't work, free plan doesn't support WebSocket
import { useEffect, useState } from 'react';

const POLYGON_API_KEY = 'uEwDOOPbb3vqg9DF5XjWZdD1oxSiCYHb'; // Keep secure in prod

export default function StockTicker() {
  const [price, setPrice] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  useEffect(() => {
    const socket = new WebSocket('wss://socket.polygon.io/stocks');

    socket.onopen = () => {
      console.log('WebSocket connected');
      socket.send(JSON.stringify({ action: 'auth', params: POLYGON_API_KEY }));
      socket.send(JSON.stringify({ action: 'subscribe', params: 'A.AAPL' }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message:', data);
      if (Array.isArray(data)) {
        data.forEach((msg) => {
          if (msg.ev === 'A' && msg.sym === 'AAPL') {
            setPrice(msg.c);
            setLastUpdate(msg.s);
          }
        });
      }
    };

    socket.onerror = (error) => console.error('WebSocket error:', error);
    socket.onclose = () => console.log('WebSocket disconnected');

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="p-4 rounded-xl bg-white shadow-md w-fit text-black">
      <h2 className="text-xl font-bold mb-2">AAPL (Aggregate)</h2>
      {price !== null ? (
        <div>
          <p className="text-2xl">${price.toFixed(2)}</p>
          <p className="text-sm text-gray-500">
            Updated: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : ''}
          </p>
        </div>
      ) : (
        <p>Loading price...</p>
      )}
    </div>
  );
}