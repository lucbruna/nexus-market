class RelatoriosInteligentes {
  async gerarResumoExecutivo(dados) {
    const { vendas, estoque, financeiro, rh } = dados
    const insights = []

    if (vendas?.totalHoje > 0) {
      insights.push(`📊 Vendas hoje: R$ ${vendas.totalHoje.toLocaleString('pt-BR')} (${vendas.qtdHoje} transações)`)
    }
    if (estoque?.alertas > 0) {
      insights.push(`⚠️ ${estoque.alertas} produtos com estoque baixo`)
    }
    if (financeiro?.aPagar > financeiro?.aReceber) {
      insights.push(`🔴 Contas a pagar (R$ ${financeiro.aPagar.toLocaleString('pt-BR')}) superam a receber (R$ ${financeiro.aReceber.toLocaleString('pt-BR')})`)
    }
    if (rh?.aniversariantes > 0) {
      insights.push(`🎂 ${rh.aniversariantes} funcionários fazem aniversário este mês`)
    }

    return {
      data: new Date().toISOString(),
      resumo: `Balanço do dia — ${vendas?.qtdHoje || 0} vendas realizadas`,
      insights,
      indicadores: {
        ticketMedio: vendas?.qtdHoje > 0 ? vendas.totalHoje / vendas.qtdHoje : 0,
        margem: financeiro?.margem || 0,
        eficienciaOperacional: rh?.produtividade || 0,
      },
    }
  }
}

module.exports = new RelatoriosInteligentes()
