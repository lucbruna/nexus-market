module.exports = (...permissoes) => {
  return (req, res, next) => {
    const { perfil } = req.usuario || {}
    const niveis = { admin: 5, gerente: 4, financeiro: 3, operador: 2, estoquista: 2, consulta: 1 }
    const required = Math.max(...permissoes.map(p => niveis[p] || 0))
    if ((niveis[perfil] || 0) < required) {
      return res.status(403).json({ error: 'Acesso negado' })
    }
    next()
  }
}
