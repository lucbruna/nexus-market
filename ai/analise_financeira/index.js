class AnaliseFinanceira {
  async indicadores(contasPagar, contasReceber, vendas, periodo) {
    const receitaTotal = vendas.reduce((a, v) => a + v.total, 0)
    const despesasTotal = contasPagar.filter(c => c.status === 'pago').reduce((a, c) => a + c.valor, 0)
    const aReceber = contasReceber.filter(c => c.status === 'pendente').reduce((a, c) => a + c.valor, 0)
    const aPagar = contasPagar.filter(c => c.status === 'pendente').reduce((a, c) => a + c.valor, 0)

    return {
      receitaTotal,
      despesasTotal,
      lucroBruto: receitaTotal - despesasTotal,
      margemLiquida: receitaTotal > 0 ? ((receitaTotal - despesasTotal) / receitaTotal) * 100 : 0,
      liquidez: aPagar > 0 ? aReceber / aPagar : 1,
      saldoDisponivel: receitaTotal - despesasTotal,
    }
  }
}

module.exports = new AnaliseFinanceira()
