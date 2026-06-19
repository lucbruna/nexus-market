class WhatsApp {
  async enviarMensagem(telefone, mensagem) {
    console.log(`📱 WhatsApp para ${telefone}: ${mensagem.substring(0, 50)}...`)
    return { sucesso: true, messageId: `wa_${Date.now()}` }
  }

  async enviarCobranca(telefone, venda) {
    const msg = `🧾 *NEXUS Market*\nVenda #${venda.num}\nTotal: R$ ${venda.total.toFixed(2)}\nForma: ${venda.formaPagamento}\nObrigado pela preferência!`
    return this.enviarMensagem(telefone, msg)
  }

  async enviarCupom(telefone, cupomBase64) {
    return this.enviarMensagem(telefone, '📄 Segue seu cupom fiscal')
  }
}

module.exports = new WhatsApp()
