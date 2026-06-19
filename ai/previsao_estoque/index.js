class PrevisaoEstoque {
  async calcularPontoRessuprimento(consumoMedio, leadTime, estoqueSeguranca) {
    return (consumoMedio * leadTime) + estoqueSeguranca
  }

  async sugerirReposicao(produtos, vendas) {
    return produtos.map(p => {
      const vendaMedia = vendas.filter(v => v.produtoId === p.id).reduce((a, v) => a + v.qtd, 0) / 30
      const diasEstoque = vendaMedia > 0 ? p.estoque / vendaMedia : 999
      return {
        produtoId: p.id,
        nome: p.nome,
        estoqueAtual: p.estoque,
        vendaMediaDia: vendaMedia,
        diasEstoque: Math.round(diasEstoque),
        sugerirCompra: diasEstoque < 7,
        qtdSugerida: Math.ceil((p.estMax || 100) - p.estoque),
      }
    })
  }
}

module.exports = new PrevisaoEstoque()
