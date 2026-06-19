const cron = require('node-cron')
const { backup } = require('./backup')
const { sendNotifications } = require('./notifications')
const { processExpiringLots } = require('./expiry')
const { reconcileAccounts } = require('./reconcile')

function start() {
  cron.schedule('0 3 * * *', () => backup()) // Daily 3am
  cron.schedule('0 6 * * *', () => sendNotifications()) // Daily 6am
  cron.schedule('0 */4 * * *', () => processExpiringLots()) // Every 4 hours
  cron.schedule('0 0 * * 0', () => reconcileAccounts()) // Weekly
  console.log('⏰ Jobs agendados iniciados')
}

module.exports = { start }
