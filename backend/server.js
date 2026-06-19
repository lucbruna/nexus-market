require('dotenv').config()
require('./middleware/envcheck')()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const { createServer } = require('http')
const { Server } = require('socket.io')
const path = require('path')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: process.env.CORS_ORIGIN } })

const authenticate = require('./middleware/auth')
const auditoria = require('./middleware/auditoria')

// Trust proxy for rate limiting behind nginx
app.set('trust proxy', 1)

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", 'ws:', 'wss:'],
      fontSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  frameguard: { action: 'deny' },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}))

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.use(morgan('combined'))
app.use(auditoria)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 200 : 1000,
  message: { error: 'Muitas requisicoes. Tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Muitas tentativas de login. Aguarde 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api/', apiLimiter)

// HTTPS redirect (production only)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https' && req.headers['x-forwarded-proto'] !== 'https, http/1.1') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`)
    }
    next()
  })
}

// Static
app.use('/uploads', express.static('uploads'))
app.use('/exports', express.static('exports'))

// API Routes (auth and health are public)
app.use('/api/auth', authLimiter, require('./api/auth'))
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '4.0.0' }))

// Protected routes
const protectedRouter = express.Router()
protectedRouter.use(authenticate)

protectedRouter.use('/empresas', require('./api/empresas'))
protectedRouter.use('/filiais', require('./api/filiais'))
protectedRouter.use('/usuarios', require('./api/usuarios'))
protectedRouter.use('/clientes', require('./api/clientes'))
protectedRouter.use('/fornecedores', require('./api/fornecedores'))
protectedRouter.use('/funcionarios', require('./api/funcionarios'))
protectedRouter.use('/produtos', require('./api/produtos'))
protectedRouter.use('/categorias', require('./api/categorias'))
protectedRouter.use('/estoque', require('./api/estoque'))
protectedRouter.use('/compras', require('./api/compras'))
protectedRouter.use('/vendas', require('./api/vendas'))
protectedRouter.use('/pdv', require('./api/pdv'))
protectedRouter.use('/financeiro', require('./api/financeiro'))
protectedRouter.use('/fiscal', require('./api/fiscal'))
protectedRouter.use('/rh', require('./api/rh'))
protectedRouter.use('/biometria', require('./api/biometria'))
protectedRouter.use('/frota', require('./api/frota'))
protectedRouter.use('/crm', require('./api/crm'))
protectedRouter.use('/convenios', require('./api/convenios'))
protectedRouter.use('/delivery', require('./api/delivery'))
protectedRouter.use('/ecommerce', require('./api/ecommerce'))
protectedRouter.use('/relatorios', require('./api/relatorios'))
protectedRouter.use('/auditoria', require('./api/auditoria'))
protectedRouter.use('/dashboard', require('./api/dashboard'))
protectedRouter.use('/configuracoes', require('./api/configuracoes'))
protectedRouter.use('/notificacoes', require('./api/notificacoes'))
protectedRouter.use('/uploads', require('./api/uploads'))

app.use('/api', protectedRouter)

// WebSocket with auth
io.use((socket, next) => {
  const token = socket.handshake.auth?.token
  if (!token) return next(new Error('Token nao fornecido'))
  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET)
    socket.usuario = decoded
    next()
  } catch {
    next(new Error('Token invalido'))
  }
})

io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.usuario?.login || socket.id}`)
  socket.on('join-company', (empresaId) => socket.join(`empresa:${empresaId}`))
  socket.on('join-branch', (filialId) => socket.join(`filial:${filialId}`))
  socket.on('disconnect', () => console.log(`Cliente desconectado: ${socket.id}`))
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  const status = err.status || 500
  const message = process.env.NODE_ENV === 'production' && status === 500
    ? 'Erro interno do servidor'
    : err.message || 'Erro interno do servidor'
  res.status(status).json({ error: message })
})

const PORT = process.env.PORT || 8000
httpServer.listen(PORT, () => {
  console.log(`🚀 NEXUS Market AI Backend rodando na porta ${PORT}`)
  console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`)
})
