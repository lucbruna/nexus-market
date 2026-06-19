class AnaliseRH {
  async calcularProdutividade(funcionarios, vendas, periodo) {
    return funcionarios.map(f => {
      const vendasFunc = vendas.filter(v => v.operadorId === f.id)
      return {
        funcionario: f.nome,
        cargo: f.cargo,
        totalVendas: vendasFunc.reduce((a, v) => a + v.total, 0),
        qtdVendas: vendasFunc.length,
        ticketMedio: vendasFunc.length ? vendasFunc.reduce((a, v) => a + v.total, 0) / vendasFunc.length : 0,
      }
    }).sort((a, b) => b.totalVendas - a.totalVendas)
  }

  async turnover(funcionarios, periodo) {
    const ativos = funcionarios.filter(f => f.status === 'ativo').length
    const desligados = funcionarios.filter(f => f.status === 'inativo').length
    return { ativos, desligados, turnoverPercentual: ativos > 0 ? (desligados / ativos) * 100 : 0 }
  }
}

module.exports = new AnaliseRH()
