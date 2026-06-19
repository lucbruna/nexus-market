import { fmt, fmtNum, toast, openModal, closeModal } from '../../utils/format.js'

export class ContasReceber {
  constructor() { this.editandoId = null }

  async render() {
    const el = document.getElementById('page-contas-receber')
    el.innerHTML = `
      <div class="section-header">
        <h2>📩 Contas a Receber</h2>
        <div class="gap-8">
          <button class="btn btn-primary" onclick="window.contasReceber.abrirForm()">+ Nova Conta</button>
          <button class="btn btn-secondary" onclick="window.contasReceber.filtrarVencidas()">⚠️ Vencidas</button>
        </div>
      </div>
      <div class="kpi-grid" id="cr-kpis"></div>
      <div class="card">
        <div class="card-title">📋 Contas</div>
        <div id="cr-table-wrap"><div class="empty-state"><div class="icon">📩</div><p>Carregando...</p></div></div>
      </div>
    `
    window.contasReceber = this
    this.renderModalForm()
    await this.loadData()
  }

  async loadData(filtroVencidas = false) {
    const db = window.db.db
    let contas = await db.contasReceber.toArray()
    contas.sort((a,b) => new Date(a.vencimento) - new Date(b.vencimento))
    if (filtroVencidas) contas = contas.filter(c => c.status === 'pendente' && new Date(c.vencimento) < new Date())

    const hoje = new Date()
    const pendentes = contas.filter(c => c.status === 'pendente')
    const vencidas = pendentes.filter(c => new Date(c.vencimento) < hoje)
    const avencer = pendentes.filter(c => new Date(c.vencimento) >= hoje && new Date(c.vencimento) <= new Date(hoje.getTime() + 7*86400000))

    const totalPendente = pendentes.reduce((a,c) => a + (c.valor||0), 0)
    const totalVencidas = vencidas.reduce((a,c) => a + (c.valor||0), 0)

    document.getElementById('cr-kpis').innerHTML = `
      <div class="kpi blue"><div class="kpi-label">💰 Total a Receber</div><div class="kpi-value">${fmt(totalPendente)}</div><div class="kpi-sub">${pendentes.length} contas</div></div>
      <div class="kpi yellow"><div class="kpi-label">📅 A Vencer (7d)</div><div class="kpi-value">${avencer.length}</div><div class="kpi-sub">${fmt(avencer.reduce((a,c)=>a+c.valor,0))}</div></div>
      <div class="kpi red"><div class="kpi-label">⚠️ Vencidas</div><div class="kpi-value">${vencidas.length}</div><div class="kpi-sub">${fmt(totalVencidas)} em atraso</div></div>
      <div class="kpi green"><div class="kpi-label">✅ Recebidas (mês)</div><div class="kpi-value">${contas.filter(c=>c.status==='recebido' && new Date(c.dataRecebimento||c.vencimento).getMonth() === hoje.getMonth()).length}</div><div class="kpi-sub">contas recebidas</div></div>
    `

    const clienteMap = {}
    const clientes = await db.clientes.toArray()
    clientes.forEach(c => clienteMap[c.id] = c)

    const wrap = document.getElementById('cr-table-wrap')
    wrap.innerHTML = contas.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Descrição</th><th>Cliente</th><th>Vencimento</th><th>Valor</th><th>Parcela</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>${contas.map(c => {
            const ven = new Date(c.vencimento)
            const vencida = c.status === 'pendente' && ven < hoje
            const diasAtraso = vencida ? Math.floor((hoje - ven) / (1000*60*60*24)) : 0
            return `<tr>
              <td><strong>${c.descricao||'—'}</strong></td>
              <td style="font-size:12px;">${clienteMap[c.clienteId]?.nome||'—'}</td>
              <td class="text-mono ${vencida?'text-red':''}">${ven.toLocaleDateString('pt-BR')}${diasAtraso?` <span class="badge red">+${diasAtraso}d</span>`:''}</td>
              <td class="text-mono text-green">${fmt(c.valor||0)}</td>
              <td class="text-mono" style="font-size:11px;">${c.parcela||'—'}</td>
              <td><span class="badge ${c.status==='recebido'?'green':'yellow'}">${c.status||'pendente'}</span></td>
              <td>${c.status==='pendente'?`
                <button class="btn btn-sm btn-primary" onclick="window.contasReceber.receber(${c.id})">✅</button>
                <button class="btn btn-sm btn-secondary" onclick="window.contasReceber.editar(${c.id})">✏️</button>
              `:''}</td>
            </tr>`
          }).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><div class="icon">📩</div><p>Nenhuma conta cadastrada</p></div>'
  }

  filtrarVencidas() {
    this.loadData(true)
    toast('⚠️ Exibindo apenas contas vencidas', 'info')
  }

  async abrirForm() {
    this.editandoId = null
    const db = window.db.db
    const clientes = await db.clientes.toArray()
    const sel = document.getElementById('cr-cliente')
    sel.innerHTML = '<option value="">Selecione...</option>'
    clientes.forEach(c => { const o = document.createElement('option'); o.value = c.id; o.textContent = c.nome; sel.appendChild(o) })
    document.getElementById('cr-descricao').value = ''
    document.getElementById('cr-valor').value = ''
    document.getElementById('cr-vencimento').value = ''
    document.getElementById('cr-parcela').value = '1'
    openModal('modal-contas-receber')
  }

  async editar(id) {
    const db = window.db.db
    const c = await db.contasReceber.get(id)
    if (!c) return
    this.editandoId = id
    document.getElementById('cr-descricao').value = c.descricao||''
    document.getElementById('cr-valor').value = c.valor||''
    document.getElementById('cr-vencimento').value = c.vencimento||''
    document.getElementById('cr-parcela').value = c.parcela||'1'
    openModal('modal-contas-receber')
  }

  async salvar() {
    const db = window.db.db
    const data = {
      descricao: document.getElementById('cr-descricao').value.trim() || 'Conta',
      clienteId: parseInt(document.getElementById('cr-cliente').value)||null,
      valor: parseFloat(document.getElementById('cr-valor').value)||0,
      vencimento: document.getElementById('cr-vencimento').value,
      parcela: document.getElementById('cr-parcela').value||'1',
      status: 'pendente',
    }
    if (!data.vencimento || data.valor <= 0) { toast('⚠️ Preencha todos os campos', 'error'); return }
    if (this.editandoId) {
      await db.contasReceber.update(this.editandoId, data)
      toast('✅ Conta atualizada', 'success')
    } else {
      const parcelas = parseInt(data.parcela) || 1
      if (parcelas > 1) {
        const valorParcela = data.valor / parcelas
        for (let i = 0; i < parcelas; i++) {
          const venc = new Date(data.vencimento)
          venc.setMonth(venc.getMonth() + i)
          await db.contasReceber.add({ ...data, valor: valorParcela, vencimento: venc.toISOString().split('T')[0], parcela: `${i+1}/${parcelas}` })
        }
        toast(`✅ ${parcelas} parcelas criadas`, 'success')
      } else {
        await db.contasReceber.add(data)
        toast('✅ Conta registrada', 'success')
      }
    }
    closeModal('modal-contas-receber')
    this.loadData()
  }

  async receber(id) {
    const db = window.db.db
    const c = await db.contasReceber.get(id)
    await db.contasReceber.update(id, { status: 'recebido', dataRecebimento: new Date().toISOString() })
    await db.caixa.add({ tipo:'entrada', descricao:`Rec: ${c.descricao||'Conta'}`, valor:c.valor, data:new Date().toISOString(), formaPagamento:'transferencia' })
    await db.fluxoCaixa.add({ filialId:1, data:new Date().toISOString(), tipo:'entrada', descricao:`Recebimento: ${c.descricao}`, valor:c.valor, saldo:0, categoria:'Recebimentos' })
    toast(`✅ ${c.descricao||'Conta'} recebida — ${fmt(c.valor)}`, 'success')
    this.loadData()
  }

  renderModalForm() {
    if (document.getElementById('modal-contas-receber')) return
    const div = document.createElement('div'); div.className = 'modal-overlay hidden'; div.id = 'modal-contas-receber'
    div.innerHTML = `
      <div class="modal">
        <h2>📩 Registrar Conta a Receber</h2>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Descrição</label><input type="text" id="cr-descricao" placeholder="Ex: Venda"/></div>
          <div class="form-group"><label>Cliente</label><select id="cr-cliente"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>Valor (R$)</label><input type="number" id="cr-valor" step="0.01" min="0"/></div>
          <div class="form-group"><label>Vencimento</label><input type="date" id="cr-vencimento"/></div>
          <div class="form-group"><label>Parcelas</label><input type="number" id="cr-parcela" value="1" min="1" max="48"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-contas-receber')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.contasReceber.salvar()">💾 Salvar</button>
        </div>
      </div>`
    document.body.appendChild(div)
  }
}
