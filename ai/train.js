const ai = require('./index')

async function trainAll() {
  console.log('🔄 Iniciando treinamento dos modelos de IA...')

  const dadosVendas = Array.from({ length: 90 }, () => Math.random() * 10000 + 5000)
  const previsao = await ai.previsaoVendas.prever(dadosVendas, 30)
  console.log(`✅ Previsão de vendas: ${previsao.length} dias gerados`)

  const fraudes = await ai.deteccaoFraudes.analisarTransacao(
    { total: 5000, itens: 10, desconto: 100, clienteId: 1 },
    [{ total: 100, clienteId: 1 }, { total: 150, clienteId: 1 }]
  )
  console.log(`✅ Análise de fraudes: score ${fraudes.score}`)

  const testeChat = await ai.chatbot.processar('qual foi o faturamento hoje?')
  console.log(`✅ Chatbot: intenção "${testeChat.intencao}" (confiança: ${testeChat.confianca})`)

  console.log('🎯 Treinamento concluído!')
}

trainAll().catch(console.error)
