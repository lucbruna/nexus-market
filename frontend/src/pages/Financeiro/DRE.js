import { fmt } from '../../utils/format.js'

export class DRE {
  async render() {
    const el = document.getElementById('page-dre')
    el.innerHTML = `
      <div class="section-header"><h2>DRE / Demonstracao de Resultados</h2></div>
      <div class="kpi-grid" id="dre-kpis-top"></div>
      <div class="grid-2">
        <div class="card"><div class="card-title">Demonstracao do Resultado</div><div id="dre-tabela"></div></div>
        <div class="card"><div class="card-title">Composicao do Resultado</div><canvas id="dre-chart-composicao" height="250"></canvas></div>
      </div>
      <div class="grid-2 mt-16">
        <div class="card"><div class="card-title">Evolucao Mensal</div><canvas id="dre-chart-evolucao" height="250"></canvas></div>
        <div class="card"><div class="card-title">Indicadores</div><div id="dre-indicadores"></div></div>
      </div>
      <div class="card mt-16"><div class="card-title">Analise Detalhada</div><div id="dre-analise"></div></div>
    `
    await this.loadData()
  }

  async loadData() {
    const db = window.db.db
    const vendas = await db.vendasPDV.toArray()
    const itens = await db.itensPDV.toArray()
    const produtos = await db.produtos.toArray()
    const prodMap = Object.fromEntries(produtos.map(p => [p.id, p]))
    const cp = await db.contasPagar.toArray()
    const cr = await db.contasReceber.toArray()
    const folhas = await db.folhaPagamento.toArray()

    const receitaBruta = vendas.reduce((a, v) => a + (v.total || 0), 0)
    const custoTotal = itens.reduce((a, it) => a + ((it.qtd || 0) * (prodMap[it.produtoId]?.custo || 0)), 0)
    const despesas = cp.reduce((a, c) => a + (c.valor || 0), 0)
    const outrasRec = cr.filter(c => c.status === 'recebido').reduce((a, c) => a + (c.valor || 0), 0)
    const folhaTotal = folhas.reduce((a, f) => a + (f.bruto || 0), 0)
    const despesasOperacionais = despesas + folhaTotal
    const lucroBruto = receitaBruta - custoTotal
    const resultado = lucroBruto - despesasOperacionais + outrasRec
    const margemBruta = receitaBruta ? (lucroBruto / receitaBruta) * 100 : 0
    const margemLiquida = receitaBruta ? (resultado / receitaBruta) * 100 : 0

    document.getElementById('dre-kpis-top').innerHTML = `
      <div class="kpi green"><div class="kpi-label">Receita bruta</div><div class="kpi-value">${fmt(receitaBruta)}</div><div class="kpi-sub">Faturamento total do periodo</div></div>
      <div class="kpi purple"><div class="kpi-label">Lucro bruto</div><div class="kpi-value">${fmt(lucroBruto)}</div><div class="kpi-sub">Margem: ${margemBruta.toFixed(1)}%</div></div>
      <div class="kpi ${resultado >= 0 ? 'green' : 'red'}"><div class="kpi-label">Resultado liquido</div><div class="kpi-value">${fmt(resultado)}</div><div class="kpi-sub">${resultado >= 0 ? 'Lucro' : 'Prejuizo'} no periodo</div></div>
      <div class="kpi blue"><div class="kpi-label">Margem liquida</div><div class="kpi-value">${margemLiquida.toFixed(1)}%</div><div class="kpi-sub">${margemLiquida >= 0 ? 'Positiva' : 'Negativa'}</div></div>
    `

    document.getElementById('dre-tabela').innerHTML = `
      <div class="dre-table">
        <div class="dre-row"><span>Receita bruta</span><span class="text-mono text-green">${fmt(receitaBruta)}</span></div>
        <div class="dre-row dre-sub"><span>(-) Custo das mercadorias (CMV)</span><span class="text-mono text-red">${fmt(custoTotal)}</span></div>
        <hr class="divider"/>
        <div class="dre-row dre-highlight"><span>Lucro bruto</span><span class="text-mono">${fmt(lucroBruto)}</span></div>
        <div class="dre-row"><span>(-) Despesas operacionais</span><span class="text-mono text-red">${fmt(despesasOperacionais)}</span></div>
        <div class="dre-row dre-sub"><span>-- Folha de pagamento</span><span class="text-mono text-red">${fmt(folhaTotal)}</span></div>
        <div class="dre-row dre-sub"><span>-- Contas a pagar</span><span class="text-mono text-red">${fmt(despesas)}</span></div>
        <div class="dre-row"><span>(+) Outras receitas</span><span class="text-mono text-green">${fmt(outrasRec)}</span></div>
        <hr class="divider"/>
        <div class="dre-row dre-total"><span>Resultado liquido</span><span class="${resultado >= 0 ? 'text-green' : 'text-red'}">${fmt(resultado)}</span></div>
      </div>
    `

    const composicaoLabels = ['Custo CMV', 'Despesas operacionais', 'Folha pagamento', 'Margem liquida']
    const composicaoData = [
      receitaBruta ? (custoTotal / receitaBruta) * 100 : 0,
      receitaBruta ? (despesas / receitaBruta) * 100 : 0,
      receitaBruta ? (folhaTotal / receitaBruta) * 100 : 0,
      Math.max(0, margemLiquida)
    ]
    this.renderChart('dre-chart-composicao', 'doughnut', composicaoLabels, composicaoData, ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e'])

    const receitasPorMes = {}
    const despesasPorMes = {}
    vendas.forEach(v => {
      const d = new Date(v.data)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      receitasPorMes[key] = (receitasPorMes[key] || 0) + (v.total || 0)
    })
    cp.forEach(c => {
      const d = new Date(c.vencimento || c.data)
      if (d.getTime()) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        despesasPorMes[key] = (despesasPorMes[key] || 0) + (c.valor || 0)
      }
    })
    const meses = Object.keys({ ...receitasPorMes, ...despesasPorMes }).sort()
    this.renderChart('dre-chart-evolucao', 'bar', meses,
      [meses.map(m => receitasPorMes[m] || 0), meses.map(m => despesasPorMes[m] || 0)],
      ['#22c55e', '#ef4444'], ['Receita', 'Despesas']
    )

    const ticketMedio = vendas.length ? receitaBruta / vendas.length : 0
    const qtdItens = itens.reduce((a, i) => a + (i.qtd || 0), 0)
    const itensPorCupom = vendas.length ? qtdItens / vendas.length : 0
    document.getElementById('dre-indicadores').innerHTML = `
      <div style="display:grid;gap:12px;">
        <div class="ind-card"><span class="ind-label">Ticket medio</span><span class="ind-value">${fmt(ticketMedio)}</span></div>
        <div class="ind-card"><span class="ind-label">Itens por cupom</span><span class="ind-value">${itensPorCupom.toFixed(1)}</span></div>
        <div class="ind-card"><span class="ind-label">Custo fixo total</span><span class="ind-value">${fmt(despesas)}</span></div>
        <div class="ind-card"><span class="ind-label">Custo com pessoal</span><span class="ind-value">${fmt(folhaTotal)}</span></div>
        <div class="ind-card"><span class="ind-label">% Custo pessoal / Receita</span><span class="ind-value">${receitaBruta ? (folhaTotal / receitaBruta * 100).toFixed(1) : 0}%</span></div>
        <div class="ind-card"><span class="ind-label">Ponto equilibrio</span><span class="ind-value">${fmt(despesasOperacionais / (margemBruta / 100) || 0)}</span></div>
      </div>
    `

    document.getElementById('dre-analise').innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">
        <div class="analise-card ${margemBruta >= 30 ? 'green' : margemBruta >= 15 ? 'yellow' : 'red'}">
          <div class="analise-label">Saude financeira</div>
          <div class="analise-status">${margemBruta >= 30 ? 'Saudavel' : margemBruta >= 15 ? 'Atencao' : 'Critico'}</div>
          <div class="analise-desc">Margem bruta de ${margemBruta.toFixed(1)}%</div>
        </div>
        <div class="analise-card ${resultado > 0 ? 'green' : 'red'}">
          <div class="analise-label">Resultado</div>
          <div class="analise-status">${resultado > 0 ? 'Lucro' : 'Prejuizo'}</div>
          <div class="analise-desc">${resultado > 0 ? 'Operacao lucrativa' : 'Operacao deficitara'}</div>
        </div>
        <div class="analise-card ${margemLiquida >= 10 ? 'green' : margemLiquida >= 5 ? 'yellow' : 'red'}">
          <div class="analise-label">Margem liquida</div>
          <div class="analise-status">${margemLiquida.toFixed(1)}%</div>
          <div class="analise-desc">${margemLiquida >= 10 ? 'Excelente' : margemLiquida >= 5 ? 'Media' : 'Baixa'}</div>
        </div>
      </div>
    `
  }

  renderChart(canvasId, type, labels, datasets, colors, legends) {
    const canvas = document.getElementById(canvasId)
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (this._charts && this._charts[canvasId]) this._charts[canvasId].destroy()

    if (!Array.isArray(datasets[0])) datasets = [datasets]

    const config = {
      type,
      data: {
        labels,
        datasets: datasets[0].map ? datasets.map((data, i) => ({
          label: legends ? legends[i] : '',
          data,
          backgroundColor: Array.isArray(colors[i]) ? colors[i] : colors[i] || colors[0],
          borderColor: '#0d1117',
          borderWidth: type === 'doughnut' ? 2 : 0,
        })) : [{
          data: datasets,
          backgroundColor: colors,
          borderColor: '#0d1117',
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: !!legends, labels: { color: '#8b949e', font: { size: 11 } } },
        },
        scales: type !== 'doughnut' ? {
          y: { beginAtZero: true, ticks: { color: '#6e7681', font: { size: 10 }, callback: v => 'R$ ' + v.toFixed(0) }, grid: { color: '#21262d' } },
          x: { ticks: { color: '#6e7681', font: { size: 9 } }, grid: { display: false } }
        } : undefined,
      }
    }

    if (!this._charts) this._charts = {}
    this._charts[canvasId] = new Chart(ctx, config)
  }
}
