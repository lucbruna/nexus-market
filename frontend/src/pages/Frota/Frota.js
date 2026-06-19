import { fmt, fmtNum, toast, openModal, closeModal } from '../../utils/format.js'

export class Frota {
  constructor() {
    this.editandoId = null
  }

  async render() {
    const el = document.getElementById('page-frota')
    el.innerHTML = `
      <div class="section-header">
        <h2>🚗 Frota de Veículos</h2>
        <div class="gap-8">
          <button class="btn btn-primary" onclick="window.frota.abrirForm()">+ Novo Veículo</button>
        </div>
      </div>
      <div class="kpi-grid" id="frota-kpis"></div>
      <div class="card">
        <div class="card-title">🚗 Veículos</div>
        <div id="frota-table-wrap"><div class="empty-state"><div class="icon">🚗</div><p>Carregando...</p></div></div>
      </div>
    `

    window.frota = this
    this.renderModalForm()
    this.renderModalAbastecimento()
    await this.loadData()
  }

  async loadData() {
    const db = window.db.db
    const veiculos = await db.veiculos.toArray()

    const ativos = veiculos.filter(v => v.status === 'ativo').length
    const manutencao = veiculos.filter(v => v.status === 'manutencao').length

    document.getElementById('frota-kpis').innerHTML = `
      <div class="kpi green"><div class="kpi-label">✅ Ativos</div><div class="kpi-value">${ativos}</div><div class="kpi-sub">veículos</div></div>
      <div class="kpi red"><div class="kpi-label">🔧 Manutenção</div><div class="kpi-value">${manutencao}</div><div class="kpi-sub">veículos</div></div>
      <div class="kpi blue"><div class="kpi-label">🚗 Total Frota</div><div class="kpi-value">${veiculos.length}</div><div class="kpi-sub">veículos</div></div>
    `

    const wrap = document.getElementById('frota-table-wrap')
    wrap.innerHTML = veiculos.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Placa</th><th>Modelo</th><th>Tipo</th><th>Ano</th><th>KM</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>${veiculos.map(v => `
            <tr>
              <td class="text-mono"><strong>${v.placa||'—'}</strong></td>
              <td>${v.modelo||'—'}</td>
              <td>${v.tipo||'—'}</td>
              <td class="text-mono">${v.ano||'—'}</td>
              <td class="text-mono">${fmtNum(v.km||0)} km</td>
              <td><span class="badge ${v.status==='ativo'?'green':v.status==='manutencao'?'red':'yellow'}">${v.status||'—'}</span></td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="window.frota.editar(${v.id})">✏️</button>
                <button class="btn btn-sm btn-secondary" onclick="window.frota.abrirAbastecimento(${v.id})">⛽</button>
              </td>
            </tr>
          `).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><div class="icon">🚗</div><p>Nenhum veículo cadastrado</p></div>'
  }

  abrirForm() {
    this.editandoId = null
    document.getElementById('modal-frota-title').textContent = 'Novo Veículo'
    document.getElementById('vei-placa').value = ''
    document.getElementById('vei-modelo').value = ''
    document.getElementById('vei-tipo').value = ''
    document.getElementById('vei-ano').value = ''
    document.getElementById('vei-km').value = ''
    document.getElementById('vei-status').value = 'ativo'
    openModal('modal-veiculo')
  }

  async editar(id) {
    const db = window.db.db
    const v = await db.veiculos.get(id)
    if (!v) return
    this.editandoId = id
    document.getElementById('modal-frota-title').textContent = 'Editar Veículo'
    document.getElementById('vei-placa').value = v.placa||''
    document.getElementById('vei-modelo').value = v.modelo||''
    document.getElementById('vei-tipo').value = v.tipo||''
    document.getElementById('vei-ano').value = v.ano||''
    document.getElementById('vei-km').value = v.km||0
    document.getElementById('vei-status').value = v.status||'ativo'
    openModal('modal-veiculo')
  }

  async salvar() {
    const db = window.db.db
    const data = {
      placa: document.getElementById('vei-placa').value.trim().toUpperCase(),
      modelo: document.getElementById('vei-modelo').value.trim(),
      tipo: document.getElementById('vei-tipo').value.trim(),
      ano: document.getElementById('vei-ano').value.trim(),
      km: parseFloat(document.getElementById('vei-km').value)||0,
      status: document.getElementById('vei-status').value,
    }
    if (!data.placa) { toast('⚠️ Informe a placa', 'error'); return }
    if (this.editandoId) {
      await db.veiculos.update(this.editandoId, data)
      toast('✅ Veículo atualizado', 'success')
    } else {
      await db.veiculos.add(data)
      toast('✅ Veículo criado', 'success')
    }
    closeModal('modal-veiculo')
    this.loadData()
  }

  async abrirAbastecimento(veiculoId) {
    document.getElementById('abast-veiculo').value = veiculoId
    document.getElementById('abast-litros').value = ''
    document.getElementById('abast-valor').value = ''
    document.getElementById('abast-km').value = ''
    openModal('modal-abastecimento')
  }

  async salvarAbastecimento() {
    const db = window.db.db
    const data = {
      veiculoId: parseInt(document.getElementById('abast-veiculo').value),
      data: new Date().toISOString(),
      litros: parseFloat(document.getElementById('abast-litros').value)||0,
      valor: parseFloat(document.getElementById('abast-valor').value)||0,
      km: parseFloat(document.getElementById('abast-km').value)||0,
    }
    if (!data.litros || !data.valor) { toast('⚠️ Preencha litros e valor', 'error'); return }
    await db.abastecimentos.add(data)
    toast('✅ Abastecimento registrado', 'success')
    closeModal('modal-abastecimento')
  }

  renderModalForm() {
    if (document.getElementById('modal-veiculo')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'
    div.id = 'modal-veiculo'
    div.innerHTML = `
      <div class="modal">
        <h2 id="modal-frota-title">🚗 Novo Veículo</h2>
        <div class="form-grid">
          <div class="form-group"><label>Placa</label><input type="text" id="vei-placa" placeholder="ABC-1234" style="text-transform:uppercase"/></div>
          <div class="form-group"><label>Modelo</label><input type="text" id="vei-modelo" placeholder="Ex: Fiorino"/></div>
          <div class="form-group"><label>Tipo</label><select id="vei-tipo"><option value="">Selecione...</option><option value="carro">Carro</option><option value="moto">Moto</option><option value="caminhao">Caminhão</option><option value="van">Van</option></select></div>
          <div class="form-group"><label>Ano</label><input type="text" id="vei-ano" placeholder="2024"/></div>
          <div class="form-group"><label>KM Atual</label><input type="number" id="vei-km" min="0"/></div>
          <div class="form-group"><label>Status</label><select id="vei-status"><option value="ativo">Ativo</option><option value="manutencao">Manutenção</option><option value="inativo">Inativo</option></select></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-veiculo')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.frota.salvar()">💾 Salvar</button>
        </div>
      </div>
    `
    document.body.appendChild(div)
  }

  renderModalAbastecimento() {
    if (document.getElementById('modal-abastecimento')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'
    div.id = 'modal-abastecimento'
    div.innerHTML = `
      <div class="modal">
        <h2>⛽ Abastecimento</h2>
        <input type="hidden" id="abast-veiculo"/>
        <div class="form-grid">
          <div class="form-group"><label>Litros</label><input type="number" id="abast-litros" step="0.01" min="0"/></div>
          <div class="form-group"><label>Valor (R$)</label><input type="number" id="abast-valor" step="0.01" min="0"/></div>
          <div class="form-group"><label>KM</label><input type="number" id="abast-km" min="0"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-abastecimento')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.frota.salvarAbastecimento()">💾 Salvar</button>
        </div>
      </div>
    `
    document.body.appendChild(div)
  }
}
