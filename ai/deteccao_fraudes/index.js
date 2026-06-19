class DeteccaoFraudes {
  async analisarTransacao(venda, historico) {
    const alertas = []
    const mediaCliente = historico.filter(h => h.clienteId === venda.clienteId)
    const mediaTicket = mediaCliente.length ? mediaCliente.reduce((a, v) => a + v.total, 0) / mediaCliente.length : 0

    if (venda.total > mediaTicket * 5 && mediaTicket > 0) {
      alertas.push({ tipo: 'valor_atipico', descricao: `Valor ${venda.total} muito acima da média ${mediaTicket}` })
    }
    if (venda.itens > 50) {
      alertas.push({ tipo: 'qtd_itens', descricao: 'Quantidade excessiva de itens' })
    }
    if (venda.desconto > venda.total * 0.5) {
      alertas.push({ tipo: 'desconto_excessivo', descricao: 'Desconto superior a 50%' })
    }

    return { score: alertas.length * 0.2, alertas, aprovada: alertas.length < 2 }
  }
}

module.exports = new DeteccaoFraudes()
