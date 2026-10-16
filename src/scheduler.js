const cron = require('node-cron');

function scheduleTask(task, minutes = 60) {
  // schedule at every hour at minute 0 by default
  cron.schedule(`0 */${minutes} * * *`, async () => {
    try {
      await task();
    } catch (err) {
      console.error('Scheduled task error', err.message || err);
    }
  }, {
    scheduled: true,
    timezone: 'Europe/Bucharest'
  });
}

module.exports = { scheduleTask };