import { esc, fmt, fmtNum, toast, openModal, closeModal } from '../../utils/format.js'

export class Clientes {
  constructor() {
    this.editandoId = null
  }

  async render() {
    const el = document.getElementById('page-clientes')
    el.innerHTML = `
      <div class="section-header">
        <h2>👥 Clientes</h2>
        <div class="gap-8">
          <input type="text" id="cli-search" class="search-bar" placeholder="🔍 Buscar cliente..." autocomplete="off"/>
          <button class="btn btn-primary" onclick="window.clientes.abrirForm()">+ Novo Cliente</button>
        </div>
      </div>
      <div id="cli-table-wrap"><div class="empty-state"><div class="icon">👥</div><p>Carregando...</p></div></div>
    `

    window.clientes = this
    this.renderModalForm()
    this.loadData()
    document.getElementById('cli-search').addEventListener('input', () => this.loadData())
  }

  async loadData() {
    const db = window.db.db
    const q = (document.getElementById('cli-search')?.value || '').toLowerCase()
    let lista = await db.clientes.toArray()
    if (q) lista = lista.filter(c => c.nome.toLowerCase().includes(q) || (c.cpf && c.cpf.includes(q)) || (c.telefone && c.telefone.includes(q)))

    const wrap = document.getElementById('cli-table-wrap')
    wrap.innerHTML = lista.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>CPF</th><th>Nome</th><th>Telefone</th><th>Email</th><th>Pontos</th><th>Compras</th><th>Ações</th></tr></thead>
          <tbody>${lista.map(c => `
            <tr>
              <td class="text-mono">${esc(c.cpf||'—')}</td>
              <td><strong>${esc(c.nome)}</strong></td>
              <td>${esc(c.telefone||'—')}</td>
              <td>${esc(c.email||'—')}</td>
              <td class="text-mono"><span class="badge yellow">${c.pontos||0}</span></td>
              <td class="text-mono text-green">${fmt(c.totalCompras||0)}</td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="window.clientes.editar(${c.id})">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="window.clientes.excluir(${c.id})">🗑️</button>
              </td>
            </tr>
          `).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><div class="icon">👥</div><p>Nenhum cliente encontrado</p></div>'
  }

  abrirForm() {
    this.editandoId = null
    document.getElementById('modal-cli-title').textContent = 'Novo Cliente'
    document.getElementById('cli-cpf').value = ''
    document.getElementById('cli-nome').value = ''
    document.getElementById('cli-telefone').value = ''
    document.getElementById('cli-email').value = ''
    document.getElementById('cli-limite').value = ''
    openModal('modal-cliente')
  }

  async editar(id) {
    const db = window.db.db
    const c = await db.clientes.get(id)
    if (!c) return
    this.editandoId = id
    document.getElementById('modal-cli-title').textContent = 'Editar Cliente'
    document.getElementById('cli-cpf').value = c.cpf||''
    document.getElementById('cli-nome').value = c.nome
    document.getElementById('cli-telefone').value = c.telefone||''
    document.getElementById('cli-email').value = c.email||''
    document.getElementById('cli-limite').value = c.limiteCredito||''
    openModal('modal-cliente')
  }

  async salvar() {
    const db = window.db.db
    const data = {
      cpf: document.getElementById('cli-cpf').value.trim(),
      nome: document.getElementById('cli-nome').value.trim(),
      telefone: document.getElementById('cli-telefone').value.trim(),
      email: document.getElementById('cli-email').value.trim(),
      limiteCredito: parseFloat(document.getElementById('cli-limite').value)||0,
    }
    if (!data.nome) { toast('⚠️ Informe o nome do cliente', 'error'); return }
    if (this.editandoId) {
      await db.clientes.update(this.editandoId, data)
      toast('✅ Cliente atualizado', 'success')
    } else {
      data.pontos = 0; data.totalCompras = 0
      await db.clientes.add(data)
      toast('✅ Cliente criado', 'success')
    }
    closeModal('modal-cliente')
    this.loadData()
  }

  async excluir(id) {
    if (!confirm('Excluir este cliente?')) return
    const db = window.db.db
    await db.clientes.delete(id)
    toast('🗑️ Cliente excluído', 'info')
    this.loadData()
  }

  renderModalForm() {
    if (document.getElementById('modal-cliente')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'
    div.id = 'modal-cliente'
    div.innerHTML = `
      <div class="modal">
        <h2 id="modal-cli-title">👥 Novo Cliente</h2>
        <div class="form-grid">
          <div class="form-group"><label>CPF</label><input type="text" id="cli-cpf" placeholder="000.000.000-00"/></div>
          <div class="form-group"><label>Telefone</label><input type="text" id="cli-telefone" placeholder="(11) 99999-9999"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Nome</label><input type="text" id="cli-nome" placeholder="Nome completo"/></div>
          <div class="form-group"><label>Email</label><input type="email" id="cli-email" placeholder="email@exemplo.com"/></div>
          <div class="form-group"><label>Limite Crédito (R$)</label><input type="number" id="cli-limite" step="0.01" min="0"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-cliente')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.clientes.salvar()">💾 Salvar</button>
        </div>
      </div>
    `
    document.body.appendChild(div)
  }
}
