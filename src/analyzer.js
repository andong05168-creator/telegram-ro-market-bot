function getImpactSummary(newsTitle, marketSnapshot) {
  const text = (newsTitle || '').toLowerCase();

  let impact = '中性';
  if (text.includes('bank') || text.includes('finance') || text.includes('rate') || text.includes('inflation')) {
    impact = '银行/金融与利率敏感型';
  }
  if (text.includes('energy') || text.includes('oil') || text.includes('gas') || text.includes('power')) {
    impact = '能源/大宗商品';
  }
  if (text.includes('election') || text.includes('government') || text.includes('budget')) {
    impact = '政策/宏观';
  }
  if (text.includes('merger') || text.includes('acquisition') || text.includes('takeover')) {
    impact = '公司事件/并购';
  }

  const usAvg = (marketSnapshot.us || []).reduce((sum, item) => sum + (item.changePercent || 0), 0) / (marketSnapshot.us.length || 1);
  const roAvg = (marketSnapshot.ro || []).reduce((sum, item) => sum + (item.changePercent || 0), 0) / (marketSnapshot.ro.length || 1);

  const direction = usAvg > 0 ? '美股偏强，风险偏好回升' : '美股偏弱，风险偏压';
  const roDirection = roAvg > 0 ? '罗马尼亚市场短线偏强' : '罗马尼亚市场短线偏弱';

  return {
    impact,
    direction,
    roDirection,
    summary:
      `该新闻更偏向“${impact}”方向，${direction}。` +
      `结合罗市当前整体表现，${roDirection}，若消息持续发酵，相关板块容易出现资金重新分化。`
  };
}

module.exports = { getImpactSummary };