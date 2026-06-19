const Minio = require('minio')

let client = null

function getClient() {
  if (!client) {
    client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT) || 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    })
  }
  return client
}

async function upload(bucket, key, file) {
  const c = getClient()
  const exists = await c.bucketExists(bucket)
  if (!exists) await c.makeBucket(bucket)
  await c.putObject(bucket, key, file.buffer, file.size, { 'Content-Type': file.mimetype })
  return `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucket}/${key}`
}

async function getUrl(bucket, key) {
  const c = getClient()
  return await c.presignedGetObject(bucket, key, 24 * 60 * 60)
}

module.exports = { upload, getUrl }
