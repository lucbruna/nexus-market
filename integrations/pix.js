class PIX {
  async gerarCobranca(valor, chave, descricao = '') {
    const txid = `NEXUS${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    return {
      txid,
      valor,
      chave,
      qrCode: `00020101021226...${txid}...6304`,
      qrCodeBase64: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...`,
      expiracao: new Date(Date.now() + 86400000).toISOString(),
      copiaECola: `00020101021226930016BR.GOV.BCB.PIX0136${chave}5204000053039865406${(valor*100).toFixed(0)}5802BR5913NEXUS Market6008BRASILIA62070503***6304ABCD`,
    }
  }

  async consultarStatus(txid) {
    return { txid, status: 'concluida', valor: 100.00, pagador: 'Cliente', dataPagamento: new Date().toISOString() }
  }

  async receberWebhook(payload) {
    console.log('📲 Webhook PIX recebido:', payload)
    return { recebido: true }
  }
}

module.exports = new PIX()
