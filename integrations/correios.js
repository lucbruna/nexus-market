class Correios {
  async calcularFrete(cepOrigem, cepDestino, peso, comprimento, altura, largura) {
    return {
      servicos: [
        { codigo: '04014', nome: 'SEDEX', prazo: 1, valor: 25.90 },
        { codigo: '04510', nome: 'PAC', prazo: 5, valor: 15.50 },
      ],
    }
  }

  async rastrear(codigo) {
    return { codigo, eventos: [{ data: new Date().toISOString(), descricao: 'Objeto postado', cidade: 'São Paulo', uf: 'SP' }] }
  }

  async solicitarColeta(endereco) {
    return { sucesso: true, codigoColeta: `COL${Date.now()}` }
  }
}

module.exports = new Correios()
