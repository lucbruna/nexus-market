async function send(phone, message) {
  // TODO: integrate with Twilio or similar
  console.log(`SMS para ${phone}: ${message}`)
}

module.exports = { send }
