const ai = require('./index')

async function predict() {
  const args = process.argv.slice(2)
  const comando = args[0] || 'resumo'

  switch (comando) {
    case 'vendas': {
      const dados = Array.from({ length: 30 }, () => Math.random() * 8000 + 3000)
      const result = await ai.previsaoVendas.prever(dados, 7)
      console.log('📊 Previsão de vendas (próximos 7 dias):')
      result.forEach((v, i) => console.log(`   Dia ${i + 1}: R$ ${v.toFixed(2)}`))
      break
    }
    case 'resumo': {
      const resumo = await ai.relatoriosInteligentes.gerarResumoExecutivo({
        vendas: { totalHoje: 45230, qtdHoje: 89 },
        estoque: { alertas: 5 },
        financeiro: { aPagar: 15000, aReceber: 28000, margem: 22.5 },
        rh: { aniversariantes: 3, produtividade: 87 },
      })
      console.log('📋 Resumo Executivo:')
      resumo.insights.forEach(i => console.log(`   ${i}`))
      break
    }
    default:
      console.log('Comandos: vendas, resumo')
  }
}

predict().catch(console.error)
