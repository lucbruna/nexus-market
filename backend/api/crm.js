const express = require('express')
const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Rota funcionando', module: 'crm' }))
router.get('/:id', (req, res) => res.json({ message: 'Rota funcionando', module: 'crm', id: req.params.id }))
router.post('/', (req, res) => res.json({ message: 'Rota funcionando', module: 'crm' }))
router.put('/:id', (req, res) => res.json({ message: 'Rota funcionando', module: 'crm', id: req.params.id }))
router.delete('/:id', (req, res) => res.json({ message: 'Rota funcionando', module: 'crm', id: req.params.id }))

module.exports = router
