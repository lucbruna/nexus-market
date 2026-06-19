class Chatbot {
  constructor() {
    this.intencoes = {
      saudacao: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hey'],
      vendas: ['venda', 'vender', 'faturamento', 'receita'],
      estoque: ['estoque', 'produto', 'falta'],
      financeiro: ['conta', 'pagar', 'receber', 'fluxo', 'caixa'],
      cliente: ['cliente', 'fidelidade', 'pontos'],
      ajuda: ['ajuda', 'help', 'comandos', 'o que faz'],
    }
  }

  async processar(mensagem, contexto = {}) {
    const msg = mensagem.toLowerCase().trim()
    let intencao = 'geral'
    let confianca = 0

    for (const [key, palavras] of Object.entries(this.intencoes)) {
      for (const p of palavras) {
        if (msg.includes(p)) {
          intencao = key
          confianca = Math.max(confianca, 0.6)
          break
        }
      }
    }

    const respostas = {
      saudacao: ['Olá! Como posso ajudar?', 'Bem-vindo ao NEXUS Assistant!', 'Oi! Em que posso ser útil?'],
      vendas: ['Para consultar vendas, acesse Dashboard > Vendas ou use o relatório específico.', 'As informações de vendas estão disponíveis no módulo Financeiro.'],
      estoque: ['Você pode verificar o estoque no módulo Estoque.', 'Produtos com estoque baixo são exibidos no Dashboard.'],
      financeiro: ['O módulo Financeiro está disponível no menu.', 'Contas a pagar/receber podem ser consultadas individualmente.'],
      cliente: ['Clientes e programa de fidelidade estão no módulo CRM.'],
      ajuda: ['Comandos disponíveis: vendas, estoque, financeiro, cliente. Ou navegue pelos menus laterais.'],
      geral: ['Entendi. Pode me perguntar sobre vendas, estoque, financeiro ou clientes!', 'Como posso ajudar? Tente perguntar sobre vendas ou estoque.'],
    }

    const resp = respostas[intencao] || respostas.geral
    return {
      intencao,
      confianca,
      resposta: resp[Math.floor(Math.random() * resp.length)],
      contexto,
    }
  }
}

module.exports = new Chatbot()
