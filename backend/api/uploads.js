const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, process.env.UPLOAD_DIR || './uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
})

const upload = multer({ storage })

router.post('/', upload.single('file'), (req, res) => {
  res.json({ message: 'Arquivo enviado', file: req.file })
})

router.post('/multiple', upload.array('files', 10), (req, res) => {
  res.json({ message: 'Arquivos enviados', files: req.files })
})

module.exports = router
