const { getMarketSnapshot } = require('./src/market');
const { getRelevantNews } = require('./src/news');
const { getImpactSummary } = require('./src/analyzer');
const { createTelegramBot, sendMessage } = require('./src/telegram');
const { telegram } = require('./src/config');
const { scheduleTask } = require('./src/scheduler');

async function buildAndSendBrief() {
  console.log('[INFO] Building market brief...');
  const market = await getMarketSnapshot();
  const news = await getRelevantNews();

  if (!market) {
    console.log('[WARN] Market data unavailable');
    return;
  }

  const impact = getImpactSummary(news ? news.title : 'Market data update', market);

  const usText = (market.us || []).map(item => {
    const sym = (item.symbol || '').replace('^', '');
    return `${sym}: ${item.price ? item.price.toFixed(2) : 'N/A'} ${item.changePercent ? `${item.changePercent >= 0 ? '+' : ''}${item.changePercent.toFixed(2)}%` : ''}`;
  }).join(' | ');

  const roText = (market.ro || []).map(item => {
    const sym = item.symbol;
    return `${sym}: ${item.price ? item.price.toFixed(2) : 'N/A'} ${item.changePercent ? `${item.changePercent >= 0 ? '+' : ''}${item.changePercent.toFixed(2)}%` : ''}`;
  }).join(' | ');

  const time = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Bucharest' });

  const text = [
    `<b>[罗马尼亚市场快报]</b>`,
    `<b>时间:</b> ${time}`,
    '',
    `<b>美股:</b> ${usText}`,
    '',
    `<b>罗马尼亚市场:</b> ${roText}`,
    '',
    news ? `<b>热点新闻:</b> ${news.title}` : '<b>热点新闻:</b> 暂无有效新闻',
    news ? `<b>来源:</b> ${news.source}` : '',
    news ? `<b>链接:</b> ${news.link}` : '',
    '',
    news ? `<b>影响分析:</b> ${impact.summary}` : '',
    '',
    news ? `<b>后续观点:</b> 参考当前市场风险偏好，继续关注欧洲央行、能源价格、银行股和大宗商品动向；若消息与政策/银行/能源高度相关，短线波动可能扩大。</b>` : '',
    ''
  ].filter(Boolean).join('\n');

  const bot = createTelegramBot(telegram.botToken);
  await sendMessage(bot, telegram.chatId, text, news ? news.image : '');
}

(async () => {
  if (!telegram.botToken || !telegram.chatId) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in .env');
    process.exit(1);
  }

  // run once immediately
  await buildAndSendBrief();

  // hourly schedule
  scheduleTask(buildAndSendBrief, 60);
  console.log('Bot started. Running hourly updates in Europe/Bucharest timezone.');
})();
