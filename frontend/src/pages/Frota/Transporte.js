import { fmt, fmtNum, toast, openModal, closeModal } from '../../utils/format.js'

export class Transporte {
  async render() {
    const el = document.getElementById('page-transporte')
    el.innerHTML = `
      <div class="section-header">
        <h2>🚚 Transporte / Entregas</h2>
        <button class="btn btn-primary" onclick="window.transporte.abrirForm()">+ Nova Entrega</button>
      </div>
      <div class="kpi-grid" id="transp-kpis"></div>
      <div class="card">
        <div class="card-title">📋 Entregas</div>
        <div id="transp-table-wrap"><div class="empty-state"><div class="icon">🚚</div><p>Carregando...</p></div></div>
      </div>
    `

    window.transporte = this
    this.renderModalForm()
    await this.loadData()
  }

  async loadData() {
    const db = window.db.db
    const entregas = await db.entregas.toArray()
    entregas.sort((a,b) => new Date(b.previsao) - new Date(a.previsao))

    const pendentes = entregas.filter(e => e.status === 'pendente').length
    const emTransito = entregas.filter(e => e.status === 'transito').length
    const entregues = entregas.filter(e => e.status === 'entregue').length

    document.getElementById('transp-kpis').innerHTML = `
      <div class="kpi yellow"><div class="kpi-label">⏳ Pendentes</div><div class="kpi-value">${pendentes}</div><div class="kpi-sub">entregas</div></div>
      <div class="kpi blue"><div class="kpi-label">🚚 Em Trânsito</div><div class="kpi-value">${emTransito}</div><div class="kpi-sub">entregas</div></div>
      <div class="kpi green"><div class="kpi-label">✅ Entregues</div><div class="kpi-value">${entregues}</div><div class="kpi-sub">entregas</div></div>
    `

    const veicMap = {}; const motMap = {}
    const veiculos = await db.veiculos.toArray()
    veiculos.forEach(v => veicMap[v.id] = v)
    const motoristas = await db.motoristas.toArray()
    motoristas.forEach(m => motMap[m.id] = m)

    const wrap = document.getElementById('transp-table-wrap')
    wrap.innerHTML = entregas.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Previsão</th><th>Cliente</th><th>Motorista</th><th>Veículo</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>${entregas.map(e => {
            const mot = motMap[e.motoristaId]; const veic = veicMap[e.veiculoId]
            return `<tr>
              <td class="text-mono">${e.previsao ? new Date(e.previsao).toLocaleDateString('pt-BR') : '—'}</td>
              <td><strong>${e.clienteId||'—'}</strong></td>
              <td>${mot?.nome||'—'}</td>
              <td>${veic?.placa||'—'}</td>
              <td><span class="badge ${e.status==='entregue'?'green':e.status==='transito'?'blue':'yellow'}">${e.status||'pendente'}</span></td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="window.transporte.mudarStatus(${e.id},'transito')">🚚</button>
                <button class="btn btn-sm btn-primary" onclick="window.transporte.mudarStatus(${e.id},'entregue')">✅</button>
              </td>
            </tr>`
          }).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><div class="icon">🚚</div><p>Nenhuma entrega registrada</p></div>'
  }

  async abrirForm() {
    const db = window.db.db
    const clientes = await db.clientes.toArray()
    const motoristas = await db.motoristas.toArray()
    const veiculos = await db.veiculos.toArray()

    const selCli = document.getElementById('ent-cliente')
    selCli.innerHTML = '<option value="">Selecione...</option>'
    clientes.forEach(c => { const o = document.createElement('option'); o.value = c.id; o.textContent = c.nome; selCli.appendChild(o) })

    const selMot = document.getElementById('ent-motorista')
    selMot.innerHTML = '<option value="">Selecione...</option>'
    motoristas.forEach(m => { const o = document.createElement('option'); o.value = m.id; o.textContent = m.nome; selMot.appendChild(o) })

    const selVei = document.getElementById('ent-veiculo')
    selVei.innerHTML = '<option value="">Selecione...</option>'
    veiculos.forEach(v => { const o = document.createElement('option'); o.value = v.id; o.textContent = `${v.placa} - ${v.modelo}`; selVei.appendChild(o) })

    document.getElementById('ent-endereco').value = ''
    document.getElementById('ent-previsao').value = ''
    openModal('modal-entrega')
  }

  async salvar() {
    const db = window.db.db
    const data = {
      clienteId: parseInt(document.getElementById('ent-cliente').value)||null,
      motoristaId: parseInt(document.getElementById('ent-motorista').value)||null,
      veiculoId: parseInt(document.getElementById('ent-veiculo').value)||null,
      endereco: document.getElementById('ent-endereco').value.trim(),
      previsao: document.getElementById('ent-previsao').value,
      status: 'pendente',
    }
    await db.entregas.add(data)
    toast('✅ Entrega registrada', 'success')
    closeModal('modal-entrega')
    this.loadData()
  }

  async mudarStatus(id, status) {
    const db = window.db.db
    await db.entregas.update(id, { status })
    toast(`✅ Status alterado para ${status}`, 'success')
    this.loadData()
  }

  renderModalForm() {
    if (document.getElementById('modal-entrega')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'
    div.id = 'modal-entrega'
    div.innerHTML = `
      <div class="modal">
        <h2>🚚 Nova Entrega</h2>
        <div class="form-grid">
          <div class="form-group"><label>Cliente</label><select id="ent-cliente"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>Motorista</label><select id="ent-motorista"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>Veículo</label><select id="ent-veiculo"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>Previsão</label><input type="date" id="ent-previsao"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Endereço</label><textarea id="ent-endereco" rows="2" placeholder="Endereço de entrega"></textarea></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-entrega')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.transporte.salvar()">💾 Salvar</button>
        </div>
      </div>
    `
    document.body.appendChild(div)
  }
}
