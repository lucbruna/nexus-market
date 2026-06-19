const ALLOWED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
  'text/csv': ['.csv'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/json': ['.json'],
  'application/x-pkcs12': ['.pfx', '.p12'],
}

const MAX_SIZE = 10 * 1024 * 1024

function validateFile(file) {
  if (!file) return { valid: false, error: 'Nenhum arquivo enviado' }

  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'Arquivo muito grande. Maximo 10MB.' }
  }

  const ext = file.originalname?.toLowerCase().slice(file.originalname.lastIndexOf('.'))
  const allowed = ALLOWED_TYPES[file.mimetype]

  if (!allowed || !allowed.includes(ext)) {
    return { valid: false, error: `Tipo de arquivo nao permitido: ${file.mimetype}. Tipos aceitos: ${Object.keys(ALLOWED_TYPES).join(', ')}` }
  }

  return { valid: true }
}

module.exports = function validateUpload(req, res, next) {
  if (req.file) {
    const result = validateFile(req.file)
    if (!result.valid) {
      return res.status(400).json({ error: result.error })
    }
  }

  if (req.files) {
    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat()
    for (const file of files) {
      const result = validateFile(file)
      if (!result.valid) {
        return res.status(400).json({ error: result.error })
      }
    }
  }

  next()
}
