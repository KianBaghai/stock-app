import axios from 'axios';

const apiKey = 'uEwDOOPbb3vqg9DF5XjWZdD1oxSiCYHb';

// fetch previous close data
export async function fetchPreviousClose(ticker: string) {
  console.log('Polygon API Key:', apiKey);
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`;

  const res = await axios.get(url);
  return res.data;
}

// fetch ticker data
export async function fetchTicker(tickers: string[]) {
  const matchingTickers: string[] = [];
  for (const ticker of tickers) {
    try {
      const res = await axios.get<{ results?: any[] }>(
        `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`
      );
      
      const data = res.data?.results?.[0];

      // compare close and high
      if (data && data.c === data.h) {
        matchingTickers.push(ticker);
      }
    } catch (err) {
      console.error(`Failed to fetch ${ticker}`, err);
    }
  }
  return matchingTickers;
}

// fetch tickers page
export async function fetchTickersPage(cursor?: string): Promise<{ results: any[] }> {
  const res = await axios.get<{ results: any[] }>('https://api.polygon.io/v3/reference/tickers', {
    params: {
      apiKey,
      market: 'stocks',
      limit: 100,
      cursor,
    },
  });
  return res.data;
}