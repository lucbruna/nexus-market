class RecomendacaoCompras {
  async recomendar(produtos, vendas, fornecedores) {
    const vendasPorProduto = {}
    vendas.forEach(v => {
      vendasPorProduto[v.produtoId] = (vendasPorProduto[v.produtoId] || 0) + v.qtd
    })

    return produtos
      .filter(p => p.ativo && p.estoque <= p.estMin * 1.5)
      .map(p => {
        const vendaMedia = (vendasPorProduto[p.id] || 0) / 30
        const diasEstoque = vendaMedia > 0 ? p.estoque / vendaMedia : 999
        const melhorFornecedor = fornecedores.find(f => f.id === p.fornecedorId)
        return {
          produto: p.nome,
          estoque: p.estoque,
          estMin: p.estMin,
          vendaMediaDia: Math.round(vendaMedia * 10) / 10,
          diasEstoque: Math.round(diasEstoque),
          prioridade: diasEstoque <= 3 ? 'alta' : diasEstoque <= 7 ? 'media' : 'baixa',
          fornecedor: melhorFornecedor?.razaoSocial || 'N/A',
          qtdSugerida: Math.max(p.estMax - p.estoque, p.estMin * 2),
        }
      })
      .sort((a, b) => a.diasEstoque - b.diasEstoque)
  }
}

module.exports = new RecomendacaoCompras()
