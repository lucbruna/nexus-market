async function send(userId, title, body, data) {
  // TODO: integrate with Firebase Cloud Messaging or OneSignal
  console.log(`Push para ${userId}: ${title} - ${body}`)
}

module.exports = { send }
