class AssistenteExecutivo {
  async processarComando(comando, contexto) {
    const cmd = comando.toLowerCase()
    if (cmd.includes('venda') && (cmd.includes('hoje') || cmd.includes('dia'))) {
      return { acao: 'relatorio_vendas', periodo: 'hoje', resposta: 'Gerando relatório de vendas do dia...' }
    }
    if (cmd.includes('estoque') && (cmd.includes('baixo') || cmd.includes('alerta'))) {
      return { acao: 'alertas_estoque', resposta: 'Verificando produtos com estoque baixo...' }
    }
    if (cmd.includes('faturamento') && (cmd.includes('mês') || cmd.includes('mes'))) {
      return { acao: 'relatorio_faturamento', periodo: 'mensal', resposta: 'Gerando relatório de faturamento mensal...' }
    }
    if (cmd.includes('funcionario') && cmd.includes('aniversario')) {
      return { acao: 'aniversariantes', resposta: 'Buscando aniversariantes do mês...' }
    }
    if (cmd.includes('previsao') || cmd.includes('previsão')) {
      return { acao: 'previsao_vendas', resposta: 'Calculando previsão de vendas...' }
    }
    if (cmd.includes('ajuda') || cmd.includes('help') || cmd.includes('comandos')) {
      return {
        acao: 'ajuda',
        resposta: 'Comandos disponíveis: vendas hoje, estoque baixo, faturamento do mês, previsão de vendas, aniversariantes, relatório completo'
      }
    }
    return { acao: 'nao_entendido', resposta: 'Desculpe, não entendi o comando. Digite "ajuda" para ver os comandos disponíveis.' }
  }
}

module.exports = new AssistenteExecutivo()
