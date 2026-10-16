require('dotenv').config();

module.exports = {
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID
  },
  marketSymbols: {
    us: ['^GSPC', '^IXIC', '^DJI', '^VIX'],
    ro: ['BET', 'BET.TR', 'TLV', 'SNP']
  },
  newsQueries: [
    'Romania stock market',
    'Romania finance',
    'Bucharest stock exchange',
    'Romanian banks',
    'Romanian energy market',
    'Romania economy',
    'BET index'
  ],
  fetchIntervalMinutes: 60,
  enabled: true
};
