const redis = require('redis')

let client = null

async function getClient() {
  if (!client) {
    client = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' })
    await client.connect()
  }
  return client
}

async function get(key) {
  const c = await getClient()
  const val = await c.get(key)
  return val ? JSON.parse(val) : null
}

async function set(key, value, ttl = 3600) {
  const c = await getClient()
  await c.set(key, JSON.stringify(value), { EX: ttl })
}

async function del(key) {
  const c = await getClient()
  await c.del(key)
}

module.exports = { get, set, del }
