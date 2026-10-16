const yahooFinance = require('yahoo-finance2').default;

async function getQuote(symbol) {
  try {
    const quote = await yahooFinance.quote(symbol);
    return {
      symbol,
      price: quote.regularMarketPrice || quote.previousClose || null,
      previousClose: quote.regularMarketPreviousClose || null,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      marketState: quote.marketState || 'CLOSED',
      shortName: quote.shortName || symbol
    };
  } catch (error) {
    console.error('getQuote error', symbol, error.message || error);
    return null;
  }
}

async function getMarketSnapshot() {
  const us = [];
  const ro = [];

  const usSyms = ['^GSPC', '^IXIC', '^DJI', '^VIX'];
  const roSyms = ['BET', 'BET.TR', 'TLV', 'SNP'];

  for (const symbol of usSyms) {
    const q = await getQuote(symbol);
    if (q) us.push(q);
  }

  for (const symbol of roSyms) {
    const q = await getQuote(symbol);
    if (q) ro.push(q);
  }

  return { us, ro };
}

module.exports = { getMarketSnapshot, getQuote };
