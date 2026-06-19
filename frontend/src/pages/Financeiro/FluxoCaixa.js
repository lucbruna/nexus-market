import { fmt, fmtNum, toast, openModal, closeModal } from '../../utils/format.js'

export class FluxoCaixa {
  async render() {
    const el = document.getElementById('page-fluxo')
    el.innerHTML = `
      <div class="section-header">
        <h2>💸 Fluxo de Caixa</h2>
        <div class="gap-8">
          <button class="btn btn-primary" onclick="window.fluxoCaixa.abrirForm()">+ Nova Movimentação</button>
          <button class="btn btn-secondary" onclick="window.fluxoCaixa.gerarProjecao()">📊 Projeção</button>
        </div>
      </div>
      <div class="kpi-grid" id="fluxo-kpis"></div>
      <div class="card">
        <div class="card-title" style="display:flex;justify-content:space-between;">
          <span>📋 Movimentações</span>
          <span style="font-size:11px;color:var(--text3);">Entradas - Saídas = Saldo</span>
        </div>
        <div id="fluxo-table-wrap"><div class="empty-state"><div class="icon">💸</div><p>Carregando...</p></div></div>
      </div>
    `
    window.fluxoCaixa = this
    this.renderModalForm()
    await this.loadData()
  }

  async loadData() {
    const db = window.db.db
    const fluxos = await db.fluxoCaixa.toArray()
    fluxos.sort((a,b) => new Date(b.data) - new Date(a.data))

    const hoje = new Date()
    const mesAtual = fluxos.filter(f => new Date(f.data).getMonth() === hoje.getMonth() && new Date(f.data).getFullYear() === hoje.getFullYear())
    const entradas = mesAtual.filter(f => f.tipo === 'entrada').reduce((a,f) => a + (f.valor||0), 0)
    const saidas = mesAtual.filter(f => f.tipo === 'saida').reduce((a,f) => a + (f.valor||0), 0)
    const saldoMes = entradas - saidas

    const cp = await db.contasPagar.filter(c => c.status === 'pendente').toArray()
    const cr = await db.contasReceber.filter(c => c.status === 'pendente').toArray()
    const totPagar = cp.reduce((a,c) => a + c.valor, 0)
    const totReceber = cr.reduce((a,c) => a + c.valor, 0)
    const saldoProjetado = saldoMes + totReceber - totPagar

    const saldoAtual = fluxos.length ? fluxos[0].saldo||0 : 0

    document.getElementById('fluxo-kpis').innerHTML = `
      <div class="kpi blue"><div class="kpi-label">💰 Saldo Atual</div><div class="kpi-value">${fmt(saldoAtual)}</div><div class="kpi-sub">disponível</div></div>
      <div class="kpi green"><div class="kpi-label">📈 Entradas (mês)</div><div class="kpi-value">${fmt(entradas)}</div><div class="kpi-sub">recebido no período</div></div>
      <div class="kpi red"><div class="kpi-label">📉 Saídas (mês)</div><div class="kpi-value">${fmt(saidas)}</div><div class="kpi-sub">pago no período</div></div>
      <div class="kpi ${saldoProjetado>=0?'green':'red'}"><div class="kpi-label">🔮 Saldo Projetado</div><div class="kpi-value">${fmt(saldoProjetado)}</div><div class="kpi-sub">com contas pendentes</div></div>
    `

    const cats = {}
    for (const f of fluxos) {
      const cat = f.categoria || 'Geral'
      if (!cats[cat]) cats[cat] = { entradas: 0, saidas: 0 }
      cats[cat][f.tipo] += f.valor || 0
    }

    let resumoCat = ''
    for (const [cat, v] of Object.entries(cats)) {
      if (v.entradas || v.saidas) {
        resumoCat += `<div style="display:flex;justify-content:space-between;font-size:11px;padding:4px 0;border-bottom:1px solid var(--border);">
          <span>${cat}</span>
          <span>${v.entradas?`<span class="text-green text-mono">+${fmt(v.entradas)}</span>`:''} ${v.saidas?`<span class="text-red text-mono">-${fmt(v.saidas)}</span>`:''}</span>
        </div>`
      }
    }

    const wrap = document.getElementById('fluxo-table-wrap')
    wrap.innerHTML = `
      <div style="display:flex;gap:16px;margin-bottom:12px;">
        <div style="flex:1;">
          <div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:4px;">📊 Por Categoria</div>
          ${resumoCat||'<div style="color:var(--text3);font-size:11px;">Sem dados</div>'}
        </div>
      </div>
      ${fluxos.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Data</th><th>Tipo</th><th>Categoria</th><th>Descrição</th><th>Valor</th><th>Saldo</th></tr></thead>
          <tbody>${fluxos.map(f => `
            <tr>
              <td class="text-mono">${new Date(f.data).toLocaleDateString('pt-BR')}</td>
              <td><span class="badge ${f.tipo==='entrada'?'green':'red'}">${f.tipo==='entrada'?'Entrada':'Saída'}</span></td>
              <td style="font-size:11px;color:var(--text3);">${f.categoria||'—'}</td>
              <td>${f.descricao||'—'}</td>
              <td class="text-mono ${f.tipo==='entrada'?'text-green':'text-red'}">${f.tipo==='entrada'?'+':'-'}${fmt(f.valor||0)}</td>
              <td class="text-mono">${fmt(f.saldo||0)}</td>
            </tr>
          `).join('')}</tbody>
        </table>
      </div>
      ` : '<div class="empty-state"><div class="icon">💸</div><p>Nenhum registro de fluxo de caixa</p></div>'}
    `
  }

  abrirForm() {
    document.getElementById('fc-tipo').value = 'entrada'
    document.getElementById('fc-descricao').value = ''
    document.getElementById('fc-valor').value = ''
    document.getElementById('fc-categoria').value = ''
    openModal('modal-fluxo-caixa')
  }

  async salvar() {
    const db = window.db.db
    const tipo = document.getElementById('fc-tipo').value
    const data = {
      filialId: 1,
      data: new Date().toISOString(),
      tipo,
      descricao: document.getElementById('fc-descricao').value.trim() || 'Movimentação',
      valor: parseFloat(document.getElementById('fc-valor').value) || 0,
      categoria: document.getElementById('fc-categoria').value.trim() || 'Geral',
    }
    if (data.valor <= 0) { toast('⚠️ Informe o valor', 'error'); return }

    const ultimo = await db.fluxoCaixa.orderBy('id').last()
    data.saldo = (ultimo?.saldo||0) + (tipo === 'entrada' ? data.valor : -data.valor)
    await db.fluxoCaixa.add(data)
    await db.caixa.add({ tipo, descricao: data.descricao, valor: data.valor, data: new Date().toISOString(), formaPagamento: 'outro' })
    toast(`✅ Movimentação registrada`, 'success')
    closeModal('modal-fluxo-caixa')
    this.loadData()
  }

  async gerarProjecao() {
    const db = window.db.db
    const ultimo = await db.fluxoCaixa.orderBy('id').last()
    const saldoAtual = ultimo?.saldo || 0
    const cp = await db.contasPagar.filter(c => c.status === 'pendente').toArray()
    const cr = await db.contasReceber.filter(c => c.status === 'pendente').toArray()

    const vencimentos = []
    cp.forEach(c => vencimentos.push({ data: new Date(c.vencimento), valor: -c.valor, desc: c.descricao }))
    cr.forEach(c => vencimentos.push({ data: new Date(c.vencimento), valor: c.valor, desc: c.descricao }))
    vencimentos.sort((a,b) => a.data - b.data)

    let saldo = saldoAtual
    const linhas = vencimentos.slice(0, 15).map(v => {
      saldo += v.valor
      const dias = Math.ceil((v.data - new Date()) / (1000*60*60*24))
      return `${v.data.toLocaleDateString('pt-BR')} (${dias>0?`${dias}d`:dias===0?'hoje':'vencido'}): ${v.desc||'—'} ${fmt(Math.abs(v.valor))} → Saldo: ${fmt(saldo)}`
    }).join('\n')

    const msg = `🔮 PROJEÇÃO DE CAIXA\nSaldo atual: ${fmt(saldoAtual)}\n\nPróximos vencimentos:\n${linhas||'Nenhum vencimento próximo'}`
    toast(msg, 'info', 10000)
  }

  renderModalForm() {
    if (document.getElementById('modal-fluxo-caixa')) return
    const div = document.createElement('div'); div.className = 'modal-overlay hidden'; div.id = 'modal-fluxo-caixa'
    div.innerHTML = `
      <div class="modal">
        <h2>💸 Nova Movimentação</h2>
        <div class="form-grid">
          <div class="form-group"><label>Tipo</label><select id="fc-tipo"><option value="entrada">Entrada</option><option value="saida">Saída</option></select></div>
          <div class="form-group"><label>Valor (R$)</label><input type="number" id="fc-valor" step="0.01" min="0"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Descrição</label><input type="text" id="fc-descricao" placeholder="Descrição da movimentação"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Categoria</label><select id="fc-categoria">
            <option value="">Selecione...</option>
            <option value="Vendas">Vendas</option>
            <option value="Compras">Compras</option>
            <option value="Folha">Folha de Pagamento</option>
            <option value="Impostos">Impostos</option>
            <option value="Operacional">Operacional</option>
            <option value="Investimento">Investimento</option>
            <option value="Financeiro">Financeiro</option>
            <option value="Outro">Outro</option>
          </select></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-fluxo-caixa')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.fluxoCaixa.salvar()">💾 Salvar</button>
        </div>
      </div>`
    document.body.appendChild(div)
  }
}
