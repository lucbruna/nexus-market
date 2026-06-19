class TEF {
  async processarPagamento(valor, bandeira, tipo) {
    console.log(`💳 Processando TEF: R$ ${valor} - ${bandeira} ${tipo}`)
    return { aprovado: true, nsu: '123456', autorizacao: '987654', parcelas: tipo === 'credito' ? 1 : 0 }
  }

  async cancelarTransacao(nsu) {
    return { sucesso: true, nsuCancelamento: '654321' }
  }

  async consultarBandeiras() {
    return ['Visa', 'Mastercard', 'Elo', 'Amex', 'Hipercard', 'Diners']
  }
}

module.exports = new TEF()
