class PrevisaoCaixa {
  async preverSaldo(entradasPrevistas, saidasPrevistas, saldoAtual = 0) {
    let saldo = saldoAtual
    const projecao = []
    const dias = Math.max(entradasPrevistas.length, saidasPrevistas.length)

    for (let i = 0; i < dias; i++) {
      const ent = entradasPrevistas[i] || 0
      const sai = saidasPrevistas[i] || 0
      saldo = saldo + ent - sai
      projecao.push({ dia: i + 1, entradas: ent, saidas: sai, saldo: Math.round(saldo * 100) / 100 })
    }

    const alerta = projecao.some(p => p.saldo < 0)
    return { projecao, alerta, saldoMinimo: Math.min(...projecao.map(p => p.saldo)), saldoMaximo: Math.max(...projecao.map(p => p.saldo)) }
  }
}

module.exports = new PrevisaoCaixa()
