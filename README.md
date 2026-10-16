# Romanian Market Telegram Bot

A free hourly Telegram market summary bot for Romania using free data sources:
- Yahoo Finance for market data
- Google/Bing RSS for news
- Telegram Bot API for posting
- Cron scheduler for hourly runs

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

3. Fill in `.env` with your Telegram credentials:

```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
TZ=Europe/Bucharest
```

4. Start the bot:

```bash
npm start
```

## Notes
- This version uses free data and should be considered a lightweight market monitor.
- For higher-quality Romanian news filtering and exact official BVB data, add official APIs later.
- The bot sends one summary every hour, plus an immediate run on startup.

## Recommended improvements
- Add exact Romanian ticker mapping for major stocks
- Improve news relevance scoring
- Add chart images
- Add official BVB RSS/news source
- Add custom alerts for specific stocks or indexes
