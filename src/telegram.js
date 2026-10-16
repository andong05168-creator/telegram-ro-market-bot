const TelegramBot = require('node-telegram-bot-api');

function createTelegramBot(botToken) {
  return new TelegramBot(botToken, { polling: false });
}

async function sendMessage(bot, chatId, text, imageUrl = '') {
  try {
    if (imageUrl) {
      await bot.sendPhoto(chatId, imageUrl, { caption: text, parse_mode: 'HTML' });
    } else {
      await bot.sendMessage(chatId, text, { parse_mode: 'HTML' });
    }
  } catch (error) {
    console.error('Telegram send failed:', error.message || error);
  }
}

module.exports = { createTelegramBot, sendMessage };