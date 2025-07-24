import useStock from '@/hooks/useStock';

export default function StockCard({ ticker }: { ticker: string }) {
  const { data, loading } = useStock(ticker);

  if (loading) return <div>Loading {ticker}...</div>;
  if (!data) return <div>Error loading {ticker}</div>;

  return (
    <div className="p-4 bg-white rounded-xl shadow text-black w-64">
      <h2 className="text-xl font-bold">{ticker}</h2>
      <p>Open: ${data.o.toFixed(2)}</p>
      <p>Close: ${data.c.toFixed(2)}</p>
      <p>High: ${data.h.toFixed(2)}</p>
      <p>Low: ${data.l.toFixed(2)}</p>
       Current Price: {data?.currentPrice ? `$${data.currentPrice.toFixed(2)}` : 'N/A'}
      <p>Updated: {new Date(data.currentTime).toLocaleTimeString()}</p>
    </div>
  );
}