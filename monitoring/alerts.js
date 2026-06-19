class AlertSystem {
  constructor() {
    this.rules = []
    this.history = []
  }

  addRule(rule) {
    this.rules.push({
      id: `rule_${Date.now()}`,
      nome: rule.nome,
      condicao: rule.condicao, // function that returns boolean
      mensagem: rule.mensagem,
      gravidade: rule.gravidade || 'info',
      ativo: true,
      createdAt: new Date().toISOString(),
    })
  }

  async evaluate(metrics) {
    for (const rule of this.rules) {
      if (!rule.ativo) continue
      try {
        if (rule.condicao(metrics)) {
          this.trigger(rule, metrics)
        }
      } catch (err) {
        console.error(`Erro avaliando regra ${rule.nome}:`, err)
      }
    }
  }

  trigger(rule, metrics) {
    const alert = {
      id: `alert_${Date.now()}`,
      ruleId: rule.id,
      nome: rule.nome,
      mensagem: typeof rule.mensagem === 'function' ? rule.mensagem(metrics) : rule.mensagem,
      gravidade: rule.gravidade,
      timestamp: new Date().toISOString(),
    }
    this.history.push(alert)
    console.log(`🚨 Alerta: ${alert.mensagem}`)
    return alert
  }

  getHistory(hours = 24) {
    const since = Date.now() - hours * 3600000
    return this.history.filter(a => new Date(a.timestamp).getTime() >= since)
  }
}

// Default rules
const alerts = new AlertSystem()
alerts.addRule({
  nome: 'Memória Alta',
  condicao: (m) => parseFloat(m?.memory?.percentUsed || 0) > 85,
  mensagem: (m) => `⚠️ Uso de memória em ${m.memory.percentUsed}%`,
  gravidade: 'warning',
})
alerts.addRule({
  nome: 'CPU Alta',
  condicao: (m) => parseFloat(m?.cpu?.percent || 0) > 80,
  mensagem: (m) => `⚠️ CPU em ${m.cpu.percent}%`,
  gravidade: 'warning',
})
alerts.addRule({
  nome: 'Disco Quase Cheio',
  condicao: (m) => parseFloat(m?.os?.memPercent || 0) > 90,
  mensagem: (m) => `🔴 Uso de disco em ${m.os.memPercent}%`,
  gravidade: 'critical',
})

module.exports = alerts
