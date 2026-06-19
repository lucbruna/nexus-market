const amqp = require('amqplib')

let connection = null
let channel = null

async function connect() {
  if (channel) return channel
  connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672')
  channel = await connection.createChannel()
  return channel
}

async function publish(queue, message) {
  const ch = await connect()
  await ch.assertQueue(queue, { durable: true })
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
}

async function consume(queue, callback) {
  const ch = await connect()
  await ch.assertQueue(queue, { durable: true })
  ch.consume(queue, (msg) => {
    if (msg) {
      callback(JSON.parse(msg.content.toString()))
      ch.ack(msg)
    }
  })
}

module.exports = { connect, publish, consume }
