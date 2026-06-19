import { fmt, fmtNum, toast, openModal, closeModal } from '../../utils/format.js'

export class Inventario {
  async render() {
    const el = document.getElementById('page-inventario')
    el.innerHTML = `
      <div class="section-header">
        <h2>📋 Inventário Físico</h2>
        <div class="gap-8">
          <button class="btn btn-primary" onclick="window.inventario.novoInventario()">+ Novo Inventário</button>
        </div>
      </div>
      <div id="inventario-list"><div class="empty-state"><div class="icon">📋</div><p>Carregando...</p></div></div>
    `

    window.inventario = this
    this.renderModalInventario()
    await this.loadData()
  }

  async loadData() {
    const db = window.db.db
    const invs = await db.inventarios.toArray()
    invs.sort((a,b) => new Date(b.data) - new Date(a.data))

    const el = document.getElementById('inventario-list')
    el.innerHTML = invs.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Data</th><th>Status</th><th>Responsável</th><th>Ações</th></tr></thead>
          <tbody>${invs.map(i => `
            <tr>
              <td class="text-mono">${new Date(i.data).toLocaleDateString('pt-BR')}</td>
              <td><span class="badge ${i.status==='concluido'?'green':'yellow'}">${i.status||'pendente'}</span></td>
              <td>${i.responsavel||'—'}</td>
              <td><button class="btn btn-sm btn-secondary" onclick="window.inventario.verDetalhes(${i.id})">👁️</button></td>
            </tr>
          `).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><div class="icon">📋</div><p>Nenhum inventário registrado</p></div>'
  }

  async novoInventario() {
    document.getElementById('inv-responsavel').value = ''
    openModal('modal-inventario')
  }

  async criar() {
    const db = window.db.db
    const data = {
      data: new Date().toISOString(),
      status: 'pendente',
      responsavel: document.getElementById('inv-responsavel').value.trim() || 'Sistema',
    }
    await db.inventarios.add(data)
    toast('✅ Inventário criado', 'success')
    closeModal('modal-inventario')
    this.loadData()
  }

  async verDetalhes(id) {
    const db = window.db.db
    const inv = await db.inventarios.get(id)
    if (!inv) return
    toast(`📋 Inventário #${id}: ${inv.status}`, 'info')
  }

  renderModalInventario() {
    if (document.getElementById('modal-inventario')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'
    div.id = 'modal-inventario'
    div.innerHTML = `
      <div class="modal">
        <h2>📋 Novo Inventário</h2>
        <div class="form-group"><label>Responsável</label><input type="text" id="inv-responsavel" placeholder="Nome do responsável"/></div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-inventario')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.inventario.criar()">✅ Criar</button>
        </div>
      </div>
    `
    document.body.appendChild(div)
  }
}
