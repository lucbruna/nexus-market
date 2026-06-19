import { esc, fmt, fmtNum, toast, openModal, closeModal } from '../../utils/format.js'

export class ContasPagar {
  constructor() { this.editandoId = null }

  async render() {
    const el = document.getElementById('page-contas-pagar')
    el.innerHTML = `
      <div class="section-header">
        <h2>📤 Contas a Pagar</h2>
        <div class="gap-8">
          <button class="btn btn-primary" onclick="window.contasPagar.abrirForm()">+ Nova Conta</button>
          <button class="btn btn-secondary" onclick="window.contasPagar.filtrarVencidas()">⚠️ Vencidas</button>
        </div>
      </div>
      <div class="kpi-grid" id="cp-kpis"></div>
      <div class="card">
        <div class="card-title">📋 Contas</div>
        <div id="cp-table-wrap"><div class="empty-state"><div class="icon">📤</div><p>Carregando...</p></div></div>
      </div>
    `
    window.contasPagar = this
    this.renderModalForm()
    await this.loadData()
  }

  async loadData(filtroVencidas = false) {
    const db = window.db.db
    let contas = await db.contasPagar.toArray()
    contas.sort((a,b) => new Date(a.vencimento) - new Date(b.vencimento))
    if (filtroVencidas) contas = contas.filter(c => c.status === 'pendente' && new Date(c.vencimento) < new Date())

    const hoje = new Date()
    const pendentes = contas.filter(c => c.status === 'pendente')
    const vencidas = pendentes.filter(c => new Date(c.vencimento) < hoje)
    const avencer = pendentes.filter(c => new Date(c.vencimento) >= hoje && new Date(c.vencimento) <= new Date(hoje.getTime() + 7*86400000))

    const totalPendente = pendentes.reduce((a,c) => a + (c.valor||0), 0)
    const totalVencidas = vencidas.reduce((a,c) => a + (c.valor||0), 0)

    document.getElementById('cp-kpis').innerHTML = `
      <div class="kpi red"><div class="kpi-label">⚠️ Total Pendente</div><div class="kpi-value">${fmt(totalPendente)}</div><div class="kpi-sub">${pendentes.length} contas</div></div>
      <div class="kpi yellow"><div class="kpi-label">📅 A Vencer (7d)</div><div class="kpi-value">${avencer.length}</div><div class="kpi-sub">${fmt(avencer.reduce((a,c)=>a+c.valor,0))}</div></div>
      <div class="kpi red"><div class="kpi-label">❌ Vencidas</div><div class="kpi-value">${vencidas.length}</div><div class="kpi-sub">${fmt(totalVencidas)} em atraso</div></div>
      <div class="kpi green"><div class="kpi-label">✅ Pagas (mês)</div><div class="kpi-value">${contas.filter(c=>c.status==='pago' && new Date(c.dataPagamento||c.vencimento).getMonth() === hoje.getMonth()).length}</div><div class="kpi-sub">contas pagas</div></div>
    `

    const fornMap = {}
    const fornecedores = await db.fornecedores.toArray()
    fornecedores.forEach(f => fornMap[f.id] = f)

    const wrap = document.getElementById('cp-table-wrap')
    wrap.innerHTML = contas.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Descrição</th><th>Fornecedor</th><th>Centro Custo</th><th>Vencimento</th><th>Valor</th><th>Juros</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>${contas.map(c => {
            const ven = new Date(c.vencimento)
            const vencida = c.status === 'pendente' && ven < hoje
            const diasAtraso = vencida ? Math.floor((hoje - ven) / (1000*60*60*24)) : 0
            return `<tr>
              <td><strong>${esc(c.descricao||'—')}</strong></td>
              <td style="font-size:12px;">${esc(fornMap[c.fornecedorId]?.razaoSocial||fornMap[c.fornecedorId]?.fantasia||'—')}</td>
              <td style="font-size:11px;color:var(--text3);">${esc(c.centroCusto||'—')}</td>
              <td class="text-mono ${vencida?'text-red':''}">${ven.toLocaleDateString('pt-BR')}${diasAtraso?` <span class="badge red">+${diasAtraso}d</span>`:''}</td>
              <td class="text-mono text-green">${fmt(c.valor||0)}</td>
              <td class="text-mono text-red">${c.juros?fmt(c.juros):'—'}</td>
              <td><span class="badge ${c.status==='pago'?'green':'red'}">${c.status||'pendente'}</span></td>
              <td>${c.status==='pendente'?`
                <button class="btn btn-sm btn-primary" onclick="window.contasPagar.pagar(${c.id})">✅</button>
                <button class="btn btn-sm btn-secondary" onclick="window.contasPagar.editar(${c.id})">✏️</button>
              `:''}</td>
            </tr>`
          }).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><div class="icon">📤</div><p>Nenhuma conta cadastrada</p></div>'
  }

  filtrarVencidas() {
    this.loadData(true)
    toast('⚠️ Exibindo apenas contas vencidas', 'info')
  }

  async abrirForm() {
    this.editandoId = null
    const db = window.db.db
    const forn = await db.fornecedores.toArray()
    const sel = document.getElementById('cp-fornecedor')
    sel.innerHTML = '<option value="">Selecione...</option>'
    forn.forEach(f => {
      const o = document.createElement('option'); o.value = f.id; o.textContent = f.razaoSocial||f.fantasia; sel.appendChild(o)
    })
    const cc = await db.centrosCusto.toArray()
    const selCC = document.getElementById('cp-centro-custo')
    selCC.innerHTML = '<option value="">Nenhum</option>'
    cc.forEach(c => { const o = document.createElement('option'); o.value = c.nome; o.textContent = c.nome; selCC.appendChild(o) })
    document.getElementById('cp-descricao').value = ''
    document.getElementById('cp-valor').value = ''
    document.getElementById('cp-vencimento').value = ''
    document.getElementById('cp-parcela').value = '1'
    document.getElementById('cp-juros').value = ''
    document.getElementById('cp-multa').value = ''
    openModal('modal-contas-pagar')
  }

  async editar(id) {
    const db = window.db.db
    const c = await db.contasPagar.get(id)
    if (!c) return
    this.editandoId = id
    document.getElementById('cp-descricao').value = c.descricao||''
    document.getElementById('cp-valor').value = c.valor||''
    document.getElementById('cp-vencimento').value = c.vencimento||''
    document.getElementById('cp-parcela').value = c.parcela||'1'
    document.getElementById('cp-juros').value = c.juros||''
    document.getElementById('cp-multa').value = c.multa||''
    document.getElementById('cp-centro-custo').value = c.centroCusto||''
    openModal('modal-contas-pagar')
  }

  async salvar() {
    const db = window.db.db
    const data = {
      descricao: document.getElementById('cp-descricao').value.trim() || 'Conta',
      fornecedorId: parseInt(document.getElementById('cp-fornecedor').value)||null,
      centroCusto: document.getElementById('cp-centro-custo').value.trim()||null,
      valor: parseFloat(document.getElementById('cp-valor').value)||0,
      vencimento: document.getElementById('cp-vencimento').value,
      parcela: document.getElementById('cp-parcela').value||'1',
      juros: parseFloat(document.getElementById('cp-juros').value)||0,
      multa: parseFloat(document.getElementById('cp-multa').value)||0,
      status: 'pendente',
    }
    if (!data.vencimento || data.valor <= 0) { toast('⚠️ Preencha todos os campos', 'error'); return }
    if (this.editandoId) {
      await db.contasPagar.update(this.editandoId, data)
      toast('✅ Conta atualizada', 'success')
    } else {
      // Se tiver parcelas
      const parcelas = parseInt(data.parcela) || 1
      if (parcelas > 1) {
        const valorParcela = data.valor / parcelas
        for (let i = 0; i < parcelas; i++) {
          const venc = new Date(data.vencimento)
          venc.setMonth(venc.getMonth() + i)
          await db.contasPagar.add({ ...data, valor: valorParcela, vencimento: venc.toISOString().split('T')[0], parcela: `${i+1}/${parcelas}` })
        }
        toast(`✅ ${parcelas} parcelas criadas`, 'success')
      } else {
        await db.contasPagar.add(data)
        toast('✅ Conta registrada', 'success')
      }
    }
    closeModal('modal-contas-pagar')
    this.loadData()
  }

  async pagar(id) {
    const db = window.db.db
    const c = await db.contasPagar.get(id)
    const valorPago = (c.valor||0) + (c.juros||0) + (c.multa||0) - (c.desconto||0)
    await db.contasPagar.update(id, { status: 'pago', dataPagamento: new Date().toISOString() })
    await db.caixa.add({ tipo:'saida', descricao:`Pg: ${c.descricao||'Conta'}`, valor:valorPago, data:new Date().toISOString(), formaPagamento:'transferencia' })
    await db.fluxoCaixa.add({ filialId:1, data:new Date().toISOString(), tipo:'saida', descricao:`Pagamento: ${c.descricao}`, valor:valorPago, saldo:0, categoria: c.centroCusto||'Operacional' })
    toast(`✅ ${c.descricao||'Conta'} paga — ${fmt(valorPago)}`, 'success')
    this.loadData()
  }

  renderModalForm() {
    if (document.getElementById('modal-contas-pagar')) return
    const div = document.createElement('div'); div.className = 'modal-overlay hidden'; div.id = 'modal-contas-pagar'
    div.innerHTML = `
      <div class="modal">
        <h2>📤 Registrar Conta a Pagar</h2>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Descrição</label><input type="text" id="cp-descricao" placeholder="Ex: Aluguel"/></div>
          <div class="form-group"><label>Fornecedor</label><select id="cp-fornecedor"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>Centro de Custo</label><select id="cp-centro-custo"><option value="">Nenhum</option></select></div>
          <div class="form-group"><label>Valor (R$)</label><input type="number" id="cp-valor" step="0.01" min="0"/></div>
          <div class="form-group"><label>Vencimento</label><input type="date" id="cp-vencimento"/></div>
          <div class="form-group"><label>Parcelas</label><input type="number" id="cp-parcela" value="1" min="1" max="48"/></div>
          <div class="form-group"><label>Juros (%)</label><input type="number" id="cp-juros" step="0.01" min="0"/></div>
          <div class="form-group"><label>Multa (%)</label><input type="number" id="cp-multa" step="0.01" min="0"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-contas-pagar')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.contasPagar.salvar()">💾 Salvar</button>
        </div>
      </div>`
    document.body.appendChild(div)
  }
}
