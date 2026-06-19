const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { z } = require('zod')
const models = require('../database/models')

const loginAttempts = new Map()

function checkBruteForce(login, ip) {
  const key = `${login}:${ip}`
  const now = Date.now()
  const entry = loginAttempts.get(key)
  if (entry) {
    if (entry.count >= 5 && now - entry.firstAttempt < 15 * 60 * 1000) {
      return { blocked: true, remainingSeconds: Math.ceil((15 * 60 * 1000 - (now - entry.firstAttempt)) / 1000) }
    }
    if (now - entry.firstAttempt >= 15 * 60 * 1000) {
      loginAttempts.delete(key)
    }
  }
  return { blocked: false }
}

function recordFailedAttempt(login, ip) {
  const key = `${login}:${ip}`
  const now = Date.now()
  const entry = loginAttempts.get(key)
  if (entry) {
    if (now - entry.firstAttempt < 15 * 60 * 1000) {
      entry.count++
    } else {
      loginAttempts.set(key, { count: 1, firstAttempt: now })
    }
  } else {
    loginAttempts.set(key, { count: 1, firstAttempt: now })
  }
  setTimeout(() => loginAttempts.delete(key), 15 * 60 * 1000)
}

const loginSchema = z.object({
  login: z.string().min(1).max(50),
  senha: z.string().min(1).max(255),
})

router.post('/login', async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Dados invalidos' })

    const { login, senha } = parsed.data
    const ip = req.ip || req.connection.remoteAddress

    const brute = checkBruteForce(login, ip)
    if (brute.blocked) {
      return res.status(429).json({ error: `Muitas tentativas. Aguarde ${brute.remainingSeconds}s.` })
    }

    const user = await models.Usuario.findOne({ where: { login, ativo: true } })
    if (!user || !bcrypt.compareSync(senha, user.senha)) {
      recordFailedAttempt(login, ip)
      return res.status(401).json({ error: 'Credenciais invalidas' })
    }

    await user.update({ ultimoAcesso: new Date() })

    const token = jwt.sign(
      { id: user.id, login: user.login, perfil: user.perfil, nome: user.nome },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    )
    res.json({
      token,
      usuario: { id: user.id, login: user.login, nome: user.nome, perfil: user.perfil, email: user.email },
    })
  } catch (err) {
    console.error('Erro no login:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

const registerSchema = z.object({
  nome: z.string().min(1).max(150),
  login: z.string().min(3).max(50),
  email: z.string().email().max(150),
  senha: z.string().min(6).max(255),
  perfil: z.enum(['admin', 'gerente', 'operador', 'estoquista', 'financeiro', 'consulta']).default('operador'),
})

router.post('/register', async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Dados invalidos', detalhes: parsed.error.issues })

    const { nome, login, email, senha, perfil } = parsed.data

    const existente = await models.Usuario.findOne({ where: { [require('sequelize').Op.or]: [{ login }, { email }] } })
    if (existente) {
      return res.status(409).json({ error: 'Login ou email ja cadastrado' })
    }

    const hash = bcrypt.hashSync(senha, 10)
    const user = await models.Usuario.create({ nome, login, email, senha: hash, perfil })
    res.status(201).json({ message: 'Usuario criado', id: user.id })
  } catch (err) {
    console.error('Erro no registro:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ valid: false })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await models.Usuario.findByPk(decoded.id, { attributes: ['id', 'login', 'nome', 'perfil', 'email', 'ativo'] })
    if (!user || !user.ativo) return res.status(401).json({ valid: false })
    res.json({ valid: true, usuario: user })
  } catch {
    res.status(401).json({ valid: false })
  }
})

router.post('/logout', (req, res) => {
  res.json({ message: 'Sessao encerrada' })
})

module.exports = router
