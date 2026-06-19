import { esc, fmt } from '../../utils/format.js'

export class Dashboard {
  async render() {
    const el = document.getElementById('page-dashboard')
    const db = window.db.db

    const vendasHoje = await this.getVendasHoje(db)
    const produtos = await db.produtos.toArray()
    const clientes = await db.clientes.toArray()
    const fornecedores = await db.fornecedores.toArray()
    const contasPagar = await db.contasPagar.filter(c => c.status === 'pendente').toArray()
    const contasReceber = await db.contasReceber.filter(c => c.status === 'pendente').toArray()
    const caixaAberto = await db.caixas.filter(c => c.status === 'aberto').first()
    const fluxos = await db.fluxoCaixa.toArray()
    const itens = await db.itensPDV.toArray()
    const vendasPDV = await db.vendasPDV.toArray()

    const totalVendas = vendasHoje.reduce((a, v) => a + (v.total || 0), 0)
    const qtdVendas = vendasHoje.length
    const ticket = qtdVendas ? totalVendas / qtdVendas : 0
    const baixoEstoque = produtos.filter(p => p.ativo && p.estoque <= (p.estMin || 5))
    const zerados = produtos.filter(p => p.ativo && (!p.estoque || p.estoque <= 0))
    const valorEstoque = produtos.reduce((a, p) => a + ((p.estoque || 0) * (p.custo || 0)), 0)
    const lotes = await db.lotes.toArray()
    const em7 = new Date(); em7.setDate(em7.getDate() + 7)
    const validadeProx = lotes.filter(l => new Date(l.vencimento) <= em7 && new Date(l.vencimento) >= new Date()).length

    const totPagar = contasPagar.reduce((a, c) => a + c.valor, 0)
    const totReceber = contasReceber.reduce((a, c) => a + c.valor, 0)
    const totalEntradas = fluxos.filter(f => f.tipo === 'entrada').reduce((a, f) => a + f.valor, 0)
    const totalSaidas = fluxos.filter(f => f.tipo === 'saida').reduce((a, f) => a + f.valor, 0)
    const saldoFluxo = totalEntradas - totalSaidas

    const margemBruta = vendasPDV.length ? await this.calcMargemBruta(db, vendasPDV, itens) : 0

    el.innerHTML = `
      <div class="section-header">
        <h2>📊 Dashboard Executivo</h2>
        <div class="gap-8">
          <span class="badge green" style="font-size:12px;">${new Date().toLocaleDateString('pt-BR', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</span>
          ${caixaAberto ? `<span class="badge blue">💰 Caixa ${caixaAberto.numero}: ${fmt(caixaAberto.saldoAtual||0)}</span>` : `<span class="badge red">🔒 Caixa Fechado</span>`}
        </div>
      </div>
      <div class="kpi-grid">
        <div class="kpi green">
          <div class="kpi-label">💰 Vendas Hoje</div>
          <div class="kpi-value" id="kpi-vendas-dia">${fmt(totalVendas)}</div>
          <div class="kpi-sub">${qtdVendas} transações | Ticket médio ${fmt(ticket)}</div>
        </div>
        <div class="kpi blue">
          <div class="kpi-label">📦 Estoque</div>
          <div class="kpi-value" id="kpi-produtos">${produtos.filter(p=>p.ativo).length}</div>
          <div class="kpi-sub">SKUs ativos | ${fmt(valorEstoque)} em custo</div>
        </div>
        <div class="kpi yellow">
          <div class="kpi-label">⚠️ Estoque Baixo</div>
          <div class="kpi-value" id="kpi-estoque-baixo">${baixoEstoque.length}</div>
          <div class="kpi-sub">${zerados.length} zerados | ${validadeProx} vencendo</div>
        </div>
        <div class="kpi purple">
          <div class="kpi-label">📊 Margem Bruta</div>
          <div class="kpi-value" id="kpi-margem">${margemBruta.toFixed(1)}%</div>
          <div class="kpi-sub">lucro sobre vendas</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">📤 A Pagar</div>
          <div class="kpi-value text-red" id="kpi-pagar">${fmt(totPagar)}</div>
          <div class="kpi-sub">${contasPagar.length} contas pendentes</div>
        </div>
        <div class="kpi green">
          <div class="kpi-label">📩 A Receber</div>
          <div class="kpi-value" id="kpi-receber">${fmt(totReceber)}</div>
          <div class="kpi-sub">${contasReceber.length} contas a receber</div>
        </div>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-title">🕐 Últimas Vendas</div>
          <div id="dash-ultimas-vendas"></div>
        </div>
        <div class="card">
          <div class="card-title">📦 Alertas do Sistema</div>
          <div id="dash-alertas"></div>
        </div>
      </div>
      <div class="grid-3 mt-16">
        <div class="card">
          <div class="card-title">💳 Formas de Pagamento</div>
          <div id="dash-pagamentos"></div>
        </div>
        <div class="card">
          <div class="card-title">🏆 Top Produtos</div>
          <div id="dash-top-produtos"></div>
        </div>
        <div class="card">
          <div class="card-title">📊 Resumo Financeiro</div>
          <div id="dash-financeiro"></div>
        </div>
      </div>
      <div class="grid-2 mt-16">
        <div class="card">
          <div class="card-title">📅 Próximos Vencimentos</div>
          <div id="dash-vencimentos"></div>
        </div>
        <div class="card">
          <div class="card-title">📊 Fluxo de Caixa (7 dias)</div>
          <div id="dash-fluxo-grafico"></div>
        </div>
      </div>
    `

    await this.renderUltimasVendas(db, vendasHoje)
    await this.renderAlertas(db, baixoEstoque, zerados, validadeProx)
    await this.renderPagamentos(vendasHoje)
    await this.renderTopProdutos(db)
    await this.renderFinanceiro(db, totalVendas, totPagar, totReceber, saldoFluxo)
    await this.renderVencimentos(db)
    await this.renderFluxoGrafico(db)
  }

  async getVendasHoje(db) {
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
    return await db.vendasPDV.filter(v => new Date(v.data) >= hoje).toArray()
  }

  async calcMargemBruta(db, vendas, itens) {
    const totalVenda = vendas.reduce((a, v) => a + (v.total || 0), 0)
    if (!totalVenda) return 0
    const produtos = await db.produtos.toArray()
    const prodMap = {}
    produtos.forEach(p => prodMap[p.id] = p)
    let custoTotal = 0
    for (const it of itens) {
      const prod = prodMap[it.produtoId]
      if (prod) custoTotal += (it.qtd || 0) * (prod.custo || 0)
    }
    return ((totalVenda - custoTotal) / totalVenda) * 100
  }

  async renderUltimasVendas(db, vendasHoje) {
    const el = document.getElementById('dash-ultimas-vendas')
    if (!vendasHoje.length) {
      el.innerHTML = '<div class="empty-state"><div class="icon">🛒</div><p>Nenhuma venda hoje</p></div>'
      return
    }
    const recent = [...vendasHoje].reverse().slice(0, 8)
    el.innerHTML = '<div class="tbl-wrap"><table><thead><tr><th>#</th><th>Hora</th><th>Valor</th><th>Pagamento</th></tr></thead><tbody>' +
      recent.map(v => `<tr>
        <td class="text-mono">${v.num||v.id}</td>
        <td class="text-mono">${new Date(v.data).toLocaleTimeString('pt-BR')}</td>
        <td class="text-green text-mono">${fmt(v.total)}</td>
        <td><span class="badge blue">${esc(v.formaPagamento||'—')}</span></td>
      </tr>`).join('') + '</tbody></table></div>'
  }

  async renderAlertas(db, baixoEstoque, zerados, validadeProx) {
    const el = document.getElementById('dash-alertas')
    let alertas = ''
    if (zerados.length) alertas += `<div class="alert-item red"><span>🚫</span><div><strong>${zerados.length} produtos sem estoque</strong><div style="font-size:11px;color:var(--text3);">${zerados.slice(0,3).map(p=>esc(p.nome)).join(', ')}${zerados.length>3?` e +${zerados.length-3}`:''}</div></div></div>`
    if (baixoEstoque.length) alertas += `<div class="alert-item yellow"><span>⚠️</span><div><strong>${baixoEstoque.length} produtos com estoque baixo</strong><div style="font-size:11px;color:var(--text3);">${baixoEstoque.slice(0,3).map(p=>`${esc(p.nome)} (${p.estoque})`).join(', ')}</div></div></div>`
    if (validadeProx) alertas += `<div class="alert-item yellow"><span>📅</span><div><strong>${validadeProx} lotes vencendo em 7 dias</strong></div></div>`
    const cp = await db.contasPagar.filter(c => c.status==='pendente' && new Date(c.vencimento) < new Date()).toArray()
    if (cp.length) alertas += `<div class="alert-item red"><span>📤</span><div><strong>${cp.length} contas a pagar vencidas</strong><div style="font-size:11px;color:var(--text3);">Total: ${fmt(cp.reduce((a,c)=>a+c.valor,0))}</div></div></div>`
    if (!alertas) alertas = '<div style="color:var(--green);padding:12px;">✅ Nenhum alerta pendente</div>'
    el.innerHTML = alertas
  }

  async renderPagamentos(vendasHoje) {
    const el = document.getElementById('dash-pagamentos')
    const pags = {}
    vendasHoje.forEach(v => { pags[v.formaPagamento] = (pags[v.formaPagamento]||0) + v.total })
    if (!Object.keys(pags).length) { el.innerHTML = '<div style="color:var(--text3);padding:12px;">Nenhuma venda hoje</div>'; return }
    const total = Object.values(pags).reduce((a,v)=>a+v,0)
    el.innerHTML = Object.entries(pags).map(([k, v]) => `
      <div style="margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px;">
          <span>${esc(k||'—')}</span><span class="text-mono text-green">${fmt(v)}</span>
        </div>
        <div class="progress-bar" style="height:6px;"><div class="progress-fill green" style="width:${(v/total*100).toFixed(1)}%;height:6px;"></div></div>
      </div>
    `).join('')
  }

  async renderTopProdutos(db) {
    const el = document.getElementById('dash-top-produtos')
    const itens = await db.itensPDV.toArray()
    const topMap = {}
    for (const it of itens) { topMap[it.nome] = (topMap[it.nome]||0) + (it.qtd||0) }
    const top = Object.entries(topMap).sort((a,b)=>b[1]-a[1]).slice(0,8)
    if (!top.length) { el.innerHTML = '<div style="color:var(--text3);padding:12px;">Sem dados</div>'; return }
    const max = top[0][1]
    el.innerHTML = top.map(([n, q]) => `
      <div style="margin-bottom:6px;">
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px;">
          <span>${esc(n)}</span><span class="badge green">${q} un</span>
        </div>
        <div class="progress-bar" style="height:4px;"><div class="progress-fill blue" style="width:${(q/max*100).toFixed(0)}%;height:4px;"></div></div>
      </div>
    `).join('')
  }

  async renderFinanceiro(db, totalVendas, totPagar, totReceber, saldoFluxo) {
    const el = document.getElementById('dash-financeiro')
    el.innerHTML = `
      <div style="padding:8px 0;">
        <div class="tot-row" style="margin-bottom:8px;font-size:13px;"><span>💰 Vendas hoje</span><span class="text-mono text-green">${fmt(totalVendas)}</span></div>
        <div class="tot-row" style="margin-bottom:8px;font-size:13px;"><span>📤 Contas a Pagar</span><span class="text-mono text-red">${fmt(totPagar)}</span></div>
        <div class="tot-row" style="margin-bottom:8px;font-size:13px;"><span>📩 Contas a Receber</span><span class="text-mono text-blue">${fmt(totReceber)}</span></div>
        <hr class="divider"/>
        <div class="tot-row" style="font-size:13px;"><span>💸 Fluxo de Caixa</span><span class="text-mono ${saldoFluxo>=0?'text-green':'text-red'}">${fmt(saldoFluxo)}</span></div>
        <div class="tot-row" style="font-size:13px;"><span>📈 Previsão (30 dias)</span><span class="text-mono text-green">${fmt(totReceber - totPagar + saldoFluxo)}</span></div>
      </div>`
  }

  async renderVencimentos(db) {
    const el = document.getElementById('dash-vencimentos')
    const cp = await db.contasPagar.filter(c => c.status==='pendente').toArray()
    const cr = await db.contasReceber.filter(c => c.status==='pendente').toArray()
    const todos = [
      ...cp.map(c => ({...c, tipo:'pagar', data:c.vencimento})),
      ...cr.map(c => ({...c, tipo:'receber', data:c.vencimento})),
    ].sort((a,b) => new Date(a.data) - new Date(b.data)).slice(0, 6)
    if (!todos.length) { el.innerHTML = '<div style="color:var(--text3);padding:12px;">Nenhum vencimento próximo</div>'; return }
    el.innerHTML = todos.map(t => {
      const dias = Math.ceil((new Date(t.data) - new Date()) / (1000*60*60*24))
      const vencido = dias < 0
      return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);">
        <span>${t.tipo==='pagar'?'📤':'📩'}</span>
        <div style="flex:1;"><strong style="font-size:12px;">${esc(t.descricao||'—')}</strong><div style="font-size:10px;color:var(--text3);">${new Date(t.data).toLocaleDateString('pt-BR')}</div></div>
        <span class="text-mono" style="font-size:12px;">${fmt(t.valor)}</span>
        <span class="badge ${vencido?'red':dias<=3?'yellow':'green'}">${vencido?`Vencido`:`${dias}d`}</span>
      </div>`
    }).join('')
  }

  async renderFluxoGrafico(db) {
    const el = document.getElementById('dash-fluxo-grafico')
    const fluxos = await db.fluxoCaixa.toArray()
    const dias = {}
    const hoje = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoje); d.setDate(d.getDate() - i)
      const key = d.toLocaleDateString('pt-BR')
      dias[key] = { entradas: 0, saidas: 0, label: d.toLocaleDateString('pt-BR', {weekday:'short'}) }
    }
    for (const f of fluxos) {
      const key = new Date(f.data).toLocaleDateString('pt-BR')
      if (dias[key]) dias[key][f.tipo === 'entrada' ? 'entradas' : 'saidas'] += f.valor
    }
    const max = Math.max(...Object.values(dias).map(d => Math.max(d.entradas, d.saidas, 1)))
    el.innerHTML = '<div style="display:flex;gap:4px;align-items:flex-end;height:120px;padding:12px 0;">' +
      Object.entries(dias).map(([k, d]) => {
        const eH = (d.entradas / max) * 100
        const sH = (d.saidas / max) * 100
        return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;">
          <div style="width:100%;display:flex;gap:2px;align-items:flex-end;height:100px;">
            <div style="flex:1;background:var(--green);border-radius:4px 4px 0 0;height:${Math.max(eH, 2)}%;min-height:4px;transition:height .3s;" title="Entradas ${fmt(d.entradas)}"></div>
            <div style="flex:1;background:var(--red);border-radius:4px 4px 0 0;height:${Math.max(sH, 2)}%;min-height:4px;transition:height .3s;" title="Saídas ${fmt(d.saidas)}"></div>
          </div>
          <span style="font-size:9px;color:var(--text3);margin-top:4px;">${d.label}</span>
        </div>`
      }).join('') + '</div>'
  }
}
