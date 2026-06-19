const REQUIRED_VARS = ['JWT_SECRET', 'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS']
const WEAK_SECRETS = [
  'nexus-market-ai-super-secret-jwt-key',
  'nexus-market-ai-super-secret-jwt-key-2024',
  'change-me-to-a-secure-random-key',
  'minha-chave-super-secreta',
  'jwt_secret',
  'secret',
  'password',
  'senha',
  '123456',
  'admin',
]

module.exports = function validateEnv() {
  const missing = REQUIRED_VARS.filter(v => !process.env[v])
  if (missing.length) {
    console.error(`[SECURITY] Variaveis de ambiente obrigatorias faltando: ${missing.join(', ')}`)
    console.error('[SECURITY] Configure o arquivo .env baseado no .env.example')
    process.exit(1)
  }

  if (process.env.NODE_ENV === 'production') {
    const secret = process.env.JWT_SECRET
    if (WEAK_SECRETS.some(weak => secret.toLowerCase().includes(weak.toLowerCase()))) {
      console.error('[SECURITY] JWT_SECRET parece ser um valor padrao/fraca. Gere uma chave segura!')
      console.error('[SECURITY] Exemplo: node -e "console.log(require(\"crypto\").randomBytes(32).toString(\"hex\"))"')
      process.exit(1)
    }

    if (process.env.DB_PASS === 'postgres' || process.env.DB_PASS === 'password' || process.env.DB_PASS.length < 8) {
      console.error('[SECURITY] DB_PASS e fraca. Use uma senha forte em producao (min 8 caracteres).')
      process.exit(1)
    }
  }

  console.log('[SECURITY] Validacao de ambiente OK')
}
