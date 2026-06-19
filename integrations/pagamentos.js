class Pagamentos {
  constructor() {
    this.provedores = {
      mercado_pago: { nome: 'Mercado Pago', taxa: 3.99 },
      pagseguro: { nome: 'PagSeguro', taxa: 3.99 },
      stone: { nome: 'Stone', taxa: 2.99 },
      cielo: { nome: 'Cielo', taxa: 3.5 },
      rede: { nome: 'Rede', taxa: 3.2 },
      getnet: { nome: 'GetNet', taxa: 3.0 },
    }
  }

  async processar(provedor, valor, dados) {
    if (!this.provedores[provedor]) throw new Error(`Provedor ${provedor} não suportado`)
    console.log(`💳 Processando R$ ${valor} via ${this.provedores[provedor].nome}...`)
    return {
      aprovado: true,
      idTransacao: `${provedor}_${Date.now()}`,
      provedor,
      valor,
      taxa: valor * (this.provedores[provedor].taxa / 100),
      liquido: valor - (valor * (this.provedores[provedor].taxa / 100)),
      parcelas: dados.parcelas || 1,
    }
  }

  async estornar(provedor, idTransacao) {
    return { sucesso: true, idTransacao, provedor }
  }

  listarProvedores() {
    return Object.entries(this.provedores).map(([key, p]) => ({ key, ...p }))
  }
}

module.exports = new Pagamentos()
