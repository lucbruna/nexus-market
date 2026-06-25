import { esc, fmt, fmtNum } from '../../utils/format.js'

export class Relatorios {
  async render() {
    const el = document.getElementById('page-relatorios')
    el.innerHTML = `
      <div class="section-header"><h2>Relatorios Gerenciais</h2></div>
      <div class="kpi-grid" id="rel-kpis"></div>
      <div class="grid-2">
        <div class="card"><div class="card-title">Vendas x Despesas (ultimos meses)</div><div class="chart-wrapper"><canvas id="rel-chart-evolucao"></canvas></div></div>
        <div class="card"><div class="card-title">Composicao de vendas por forma pagamento</div><div class="chart-wrapper"><canvas id="rel-chart-pagamento"></canvas></div></div>
      </div>
      <div class="grid-2 mt-16">
        <div class="card"><div class="card-title">Top produtos por faturamento</div><div id="rel-top-produtos"></div></div>
        <div class="card"><div class="card-title">Indicadores de desempenho</div><div id="rel-indicadores"></div></div>
      </div>
      <div class="card mt-16"><div class="card-title">Produtos criticos (estoque baixo/zerado)</div><div id="rel-criticos"></div></div>
    `
    await this.loadData()
  }

  async loadData() {
    const db = window.db.db
    const vendas = await db.vendasPDV.toArray()
    const itens = await db.itensPDV.toArray()
    const produtos = await db.produtos.toArray()
    const contasPagar = await db.contasPagar.toArray()
    const contasReceber = await db.contasReceber.toArray()
    const pagamentos = await db.pagamentosPDV.toArray().catch(() => [])
    const clientes = await db.clientes.toArray()
    const prodMap = Object.fromEntries(produtos.map(p => [p.id, p]))

    const totalVendas = vendas.reduce((s, v) => s + (v.total || 0), 0)
    const custo = itens.reduce((s, i) => s + ((i.qtd || 0) * (prodMap[i.produtoId]?.custo || 0)), 0)
    const valorEstoque = produtos.reduce((s, p) => s + ((p.estoque || 0) * (p.custo || 0)), 0)
    const custoEstoque = produtos.reduce((s, p) => s + ((p.estoque || 0) * (p.custo || 0)), 0)
    const ticketMedio = vendas.length ? totalVendas / vendas.length : 0
    const pagar = contasPagar.filter(c => c.status !== 'pago').reduce((s, c) => s + (c.valor || 0), 0)
    const receber = contasReceber.filter(c => c.status !== 'recebido').reduce((s, c) => s + (c.valor || 0), 0)
    const lucroBruto = totalVendas - custo
    const margem = totalVendas ? (lucroBruto / totalVendas) * 100 : 0
    const clientesAtivos = clientes.filter(c => c.totalCompras > 0).length
    const qtdItens = itens.reduce((s, i) => s + (i.qtd || 0), 0)
    const itensPorCupom = vendas.length ? qtdItens / vendas.length : 0

    const top = Object.values(itens.reduce((acc, i) => {
      acc[i.produtoId] = acc[i.produtoId] || { nome: i.nome, qtd: 0, total: 0 }
      acc[i.produtoId].qtd += i.qtd || 0
      acc[i.produtoId].total += i.total || 0
      return acc
    }, {})).sort((a, b) => b.total - a.total).slice(0, 10)

    document.getElementById('rel-kpis').innerHTML = `
      <div class="kpi green"><div class="kpi-label">Faturamento</div><div class="kpi-value">${fmt(totalVendas)}</div><div class="kpi-sub">${vendas.length} vendas | Ticket ${fmt(ticketMedio)}</div></div>
      <div class="kpi blue"><div class="kpi-label">Lucro bruto</div><div class="kpi-value">${fmt(lucroBruto)}</div><div class="kpi-sub">Margem ${margem.toFixed(1)}%</div></div>
      <div class="kpi purple"><div class="kpi-label">Estoque (custo)</div><div class="kpi-value">${fmt(valorEstoque)}</div><div class="kpi-sub">${produtos.length} SKUs</div></div>
      <div class="kpi red"><div class="kpi-label">A pagar</div><div class="kpi-value">${fmt(pagar)}</div><div class="kpi-sub">${contasPagar.filter(c => c.status !== 'pago').length} contas</div></div>
      <div class="kpi green"><div class="kpi-label">A receber</div><div class="kpi-value">${fmt(receber)}</div><div class="kpi-sub">${contasReceber.filter(c => c.status !== 'recebido').length} contas</div></div>
      <div class="kpi yellow"><div class="kpi-label">Clientes ativos</div><div class="kpi-value">${clientesAtivos}</div><div class="kpi-sub">Itens/cupom: ${itensPorCupom.toFixed(1)}</div></div>
    `

    const receitasPorMes = {}
    const despesasPorMes = {}
    vendas.forEach(v => {
      const d = new Date(v.data)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      receitasPorMes[key] = (receitasPorMes[key] || 0) + (v.total || 0)
    })
    contasPagar.forEach(c => {
      const d = new Date(c.vencimento || c.data)
      if (d.getTime()) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        despesasPorMes[key] = (despesasPorMes[key] || 0) + (c.valor || 0)
      }
    })
    const meses = Object.keys({ ...receitasPorMes, ...despesasPorMes }).sort()
    this.renderChart('rel-chart-evolucao', 'bar', meses,
      [meses.map(m => receitasPorMes[m] || 0), meses.map(m => despesasPorMes[m] || 0)],
      ['#22c55e', '#ef4444'], ['Receitas', 'Despesas']
    )

    const pagMap = {}
    pagamentos.forEach(p => { pagMap[p.forma] = (pagMap[p.forma] || 0) + (p.valor || 0) })
    if (!pagamentos.length) vendas.forEach(v => { pagMap[v.formaPagamento] = (pagMap[v.formaPagamento] || 0) + (v.total || 0) })
    const pagLabels = Object.keys(pagMap)
    const pagData = Object.values(pagMap)
    const pagColors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4', '#f97316']
    this.renderChart('rel-chart-pagamento', 'doughnut',
      pagLabels.length ? pagLabels : ['Sem dados'],
      pagData.length ? pagData : [1],
      pagColors
    )

    const maxTop = Math.max(...top.map(t => t.total), 1)
    document.getElementById('rel-top-produtos').innerHTML = top.length ? `
      ${top.map(t => `
        <div style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;font-size:12px;">
            <span><strong>${esc(t.nome)}</strong></span>
            <span class="text-mono">${fmt(t.total)}</span>
          </div>
          <div class="progress-bar"><div class="progress-fill green" style="width:${(t.total / maxTop * 100)}%;"></div></div>
          <div style="font-size:10px;color:var(--text3);display:flex;justify-content:space-between;">
            <span>${fmtNum(t.qtd)} unidades</span>
            <span>${((t.total / totalVendas) * 100).toFixed(1)}%</span>
          </div>
        </div>
      `).join('')}
    ` : '<div class="empty-state"><p>Sem dados de vendas</p></div>'

    const giroEstoque = custo > 0 ? (custo / custoEstoque) : 0
    const coberturaEstoque = custo > 0 ? (custosEstoque => custosEstoque > 0 ? 30 / giroEstoque : 0)(custoEstoque) : 0
    const diasCobertura = giroEstoque > 0 ? Math.round(30 / giroEstoque) : 0

    document.getElementById('rel-indicadores').innerHTML = `
      <div style="display:grid;gap:10px;">
        <div class="ind-card"><span class="ind-label">Ticket medio</span><span class="ind-value">${fmt(ticketMedio)}</span><span class="ind-sub">Valor medio por venda</span></div>
        <div class="ind-card"><span class="ind-label">Itens por cupom</span><span class="ind-value">${itensPorCupom.toFixed(1)}</span><span class="ind-sub">Produtos por venda</span></div>
        <div class="ind-card"><span class="ind-label">Giro de estoque</span><span class="ind-value">${giroEstoque.toFixed(2)}x</span><span class="ind-sub">Vezes no mes</span></div>
        <div class="ind-card"><span class="ind-label">Cobertura de estoque</span><span class="ind-value">${diasCobertura} dias</span><span class="ind-sub">Tempo para zerar estoque</span></div>
        <div class="ind-card"><span class="ind-label">Margem bruta</span><span class="ind-value">${margem.toFixed(1)}%</span><span class="ind-sub">Lucro sobre vendas</span></div>
        <div class="ind-card"><span class="ind-label">Clientes cadastrados</span><span class="ind-value">${clientes.length}</span><span class="ind-sub">${clientesAtivos} com compras</span></div>
      </div>
    `

    const criticos = produtos.filter(p => (p.estoque || 0) <= (p.estMin || 5)).slice(0, 30)
    document.getElementById('rel-criticos').innerHTML = criticos.length ? `
      <div class="tbl-wrap"><table><thead><tr><th>Produto</th><th>Estoque</th><th>Minimo</th><th>Custo parado</th><th>Status</th></tr></thead>
      <tbody>${criticos.map(p => `<tr><td><strong>${esc(p.nome)}</strong></td><td class="text-mono">${p.estoque || 0}</td><td class="text-mono">${p.estMin || 5}</td><td class="text-mono">${fmt((p.estoque || 0) * (p.custo || 0))}</td><td><span class="badge ${(p.estoque || 0) <= 0 ? 'red' : 'yellow'}">${(p.estoque || 0) <= 0 ? 'Zerado' : 'Baixo'}</span></td></tr>`).join('')}</tbody></table></div>
    ` : '<div class="empty-state"><p>Todos os produtos com estoque adequado</p></div>'
  }

  renderChart(canvasId, type, labels, datasets, colors, legends) {
    const canvas = document.getElementById(canvasId)
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (this._charts && this._charts[canvasId]) this._charts[canvasId].destroy()

    if (!Array.isArray(datasets[0])) datasets = [datasets]
    if (!this._charts) this._charts = {}
    this._charts[canvasId] = new Chart(ctx, {
      type,
      data: {
        labels,
        datasets: datasets[0].map ? datasets.map((data, i) => ({
          label: legends ? legends[i] : '',
          data,
          backgroundColor: colors[i] || colors[0],
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
          legend: { display: !!legends || type === 'doughnut', labels: { color: '#8b949e', font: { size: 10 }, boxWidth: 12, padding: 8 } },
        },
        scales: type !== 'doughnut' ? {
          y: { beginAtZero: true, ticks: { color: '#6e7681', font: { size: 9 }, callback: v => 'R$ ' + (v || 0).toFixed(0) }, grid: { color: '#21262d' } },
          x: { ticks: { color: '#6e7681', font: { size: 9 } }, grid: { display: false } }
        } : undefined,
      }
    })
  }
}
