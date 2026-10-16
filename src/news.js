const axios = require('axios');
const cheerio = require('cheerio');
const Parser = require('rss-parser');

async function fetchGoogleNews(query) {
  const endpoint = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
  try {
    const parser = new Parser();
    const feed = await parser.parseURL(endpoint);
    return (feed.items || []).slice(0, 8).map(item => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || '',
      source: item.source || ''
    }));
  } catch (error) {
    console.error('fetchGoogleNews error', error.message || error);
    return [];
  }
}

async function fetchBingNews(query) {
  const url = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&format=rss`;
  try {
    const parser = new Parser();
    const feed = await parser.parseURL(url);
    return (feed.items || []).slice(0, 8).map(item => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || '',
      source: item.creator || 'Bing News'
    }));
  } catch (error) {
    console.error('fetchBingNews error', error.message || error);
    return [];
  }
}

async function extractOgImage(url) {
  try {
    const res = await axios.get(url, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(res.data);
    return $('meta[property="og:image"]').attr('content') ||
           $('meta[name="twitter:image"]').attr('content') || '';
  } catch (error) {
    // console.error('extractOgImage error', error.message || error);
    return '';
  }
}

async function getRelevantNews() {
  const all = [];
  const queries = [
    'Romania stock market',
    'Romania finance',
    'Bucharest stock exchange',
    'Romanian banks',
    'Romanian energy market',
    'Bucharest BET index',
    'Romania economy'
  ];

  for (const q of queries) {
    const google = await fetchGoogleNews(q);
    const bing = await fetchBingNews(q);
    all.push(...google, ...bing);
  }

  const dedup = [];
  const seen = new Set();

  for (const item of all) {
    if (!item.title || !item.link) continue;
    const key = item.link;
    if (!seen.has(key)) {
      seen.add(key);
      dedup.push(item);
    }
  }

  const ranked = dedup
    .map(item => {
      const t = (item.title || '').toLowerCase();
      const score = (
        (t.includes('romania') ? 4 : 0) +
        (t.includes('bucharest') ? 3 : 0) +
        (t.includes('bet') ? 3 : 0) +
        (t.includes('bank') ? 2 : 0) +
        (t.includes('energy') ? 2 : 0) +
        (t.includes('inflation') ? 2 : 0) +
        (t.includes('euro') ? 1 : 0) +
        (t.includes('market') ? 2 : 0)
      );
      return { ...item, score };
    })
    .sort((a, b) => b.score - a.score || new Date(b.pubDate || 0) - new Date(a.pubDate || 0));

  const best = ranked[0];
  if (!best) return null;

  const image = await extractOgImage(best.link);

  return {
    title: best.title,
    link: best.link,
    source: best.source || 'News',
    pubDate: best.pubDate || new Date().toISOString(),
    image
  };
}

module.exports = { getRelevantNews, extractOgImage };
