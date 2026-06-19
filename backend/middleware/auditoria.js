const fs = require('fs')
const path = require('path')

const LOG_DIR = process.env.LOG_DIR || './logs'
const LOG_FILE = path.join(LOG_DIR, 'auditoria.log')

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true })
}

function appendLog(entry) {
  const line = JSON.stringify(entry) + '\n'
  fs.appendFile(LOG_FILE, line, (err) => {
    if (err) console.error('[AUDITORIA] Erro ao escrever log:', err.message)
  })
}

const SENSITIVE_ROUTES = [
  { method: 'POST', pattern: /^\/api\/auth\/login/ },
  { method: 'POST', pattern: /^\/api\/usuarios/ },
  { method: 'DELETE', pattern: /^\/api\// },
  { method: 'PUT', pattern: /^\/api\/configuracoes/ },
  { method: 'POST', pattern: /^\/api\/backup/ },
  { method: 'POST', pattern: /^\/api\/restore/ },
]

module.exports = function auditoria(req, res, next) {
  const originalEnd = res.end
  const startTime = Date.now()

  res.end = function (...args) {
    const shouldLog = SENSITIVE_ROUTES.some(r =>
      req.method === r.method && r.pattern.test(req.originalUrl)
    )

    if (shouldLog || res.statusCode >= 400) {
      const entry = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        ip: req.ip || req.connection?.remoteAddress,
        usuario: req.usuario?.login || 'anonimo',
        duracaoMs: Date.now() - startTime,
        userAgent: req.headers['user-agent'] || '',
      }
      appendLog(entry)
    }
    return originalEnd.apply(this, args)
  }
  next()
}
