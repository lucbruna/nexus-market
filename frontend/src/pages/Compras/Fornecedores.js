import { esc, fmt, toast, openModal, closeModal } from '../../utils/format.js'

export class Fornecedores {
  constructor() {
    this.editandoId = null
  }

  async render() {
    const el = document.getElementById('page-fornecedores')
    el.innerHTML = `
      <div class="section-header">
        <h2>🏢 Fornecedores</h2>
        <div class="gap-8">
          <input type="text" id="forn-search" class="search-bar" placeholder="🔍 Buscar fornecedor..." autocomplete="off"/>
          <button class="btn btn-primary" onclick="window.fornecedores.abrirForm()">+ Novo Fornecedor</button>
        </div>
      </div>
      <div id="forn-table-wrap"><div class="empty-state"><div class="icon">🏢</div><p>Carregando...</p></div></div>
    `

    window.fornecedores = this
    this.renderModalForm()
    this.loadData()
    document.getElementById('forn-search').addEventListener('input', () => this.loadData())
  }

  async loadData() {
    const db = window.db.db
    const q = (document.getElementById('forn-search')?.value || '').toLowerCase()
    let lista = await db.fornecedores.toArray()
    if (q) lista = lista.filter(f => f.razaoSocial?.toLowerCase().includes(q) || f.fantasia?.toLowerCase().includes(q) || (f.cnpj && f.cnpj.includes(q)))

    const wrap = document.getElementById('forn-table-wrap')
    wrap.innerHTML = lista.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>CNPJ</th><th>Razão Social</th><th>Fantasia</th><th>Prazo (dias)</th><th>Ações</th></tr></thead>
          <tbody>${lista.map(f => `
            <tr>
              <td class="text-mono">${esc(f.cnpj||'—')}</td>
              <td><strong>${esc(f.razaoSocial||'—')}</strong></td>
              <td>${esc(f.fantasia||'—')}</td>
              <td class="text-mono">${f.prazo||0}</td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="window.fornecedores.editar(${f.id})">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="window.fornecedores.excluir(${f.id})">🗑️</button>
              </td>
            </tr>
          `).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><div class="icon">🏢</div><p>Nenhum fornecedor encontrado</p></div>'
  }

  abrirForm() {
    this.editandoId = null
    document.getElementById('modal-forn-title').textContent = 'Novo Fornecedor'
    document.getElementById('forn-cnpj').value = ''
    document.getElementById('forn-razao').value = ''
    document.getElementById('forn-fantasia').value = ''
    document.getElementById('forn-prazo').value = ''
    openModal('modal-fornecedor')
  }

  async editar(id) {
    const db = window.db.db
    const f = await db.fornecedores.get(id)
    if (!f) return
    this.editandoId = id
    document.getElementById('modal-forn-title').textContent = 'Editar Fornecedor'
    document.getElementById('forn-cnpj').value = f.cnpj||''
    document.getElementById('forn-razao').value = f.razaoSocial||''
    document.getElementById('forn-fantasia').value = f.fantasia||''
    document.getElementById('forn-prazo').value = f.prazo||''
    openModal('modal-fornecedor')
  }

  async salvar() {
    const db = window.db.db
    const data = {
      cnpj: document.getElementById('forn-cnpj').value.trim(),
      razaoSocial: document.getElementById('forn-razao').value.trim(),
      fantasia: document.getElementById('forn-fantasia').value.trim(),
      prazo: parseInt(document.getElementById('forn-prazo').value)||0,
    }
    if (!data.razaoSocial) { toast('⚠️ Informe a razão social', 'error'); return }
    if (this.editandoId) {
      await db.fornecedores.update(this.editandoId, data)
      toast('✅ Fornecedor atualizado', 'success')
    } else {
      await db.fornecedores.add(data)
      toast('✅ Fornecedor criado', 'success')
    }
    closeModal('modal-fornecedor')
    this.loadData()
  }

  async excluir(id) {
    if (!confirm('Excluir este fornecedor?')) return
    const db = window.db.db
    await db.fornecedores.delete(id)
    toast('🗑️ Fornecedor excluído', 'info')
    this.loadData()
  }

  renderModalForm() {
    if (document.getElementById('modal-fornecedor')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'
    div.id = 'modal-fornecedor'
    div.innerHTML = `
      <div class="modal">
        <h2 id="modal-forn-title">🏢 Novo Fornecedor</h2>
        <div class="form-grid">
          <div class="form-group"><label>CNPJ</label><input type="text" id="forn-cnpj" placeholder="00.000.000/0001-00"/></div>
          <div class="form-group"><label>Prazo (dias)</label><input type="number" id="forn-prazo" min="0" placeholder="30"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Razão Social</label><input type="text" id="forn-razao" placeholder="Razão social"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Nome Fantasia</label><input type="text" id="forn-fantasia" placeholder="Nome fantasia"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-fornecedor')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.fornecedores.salvar()">💾 Salvar</button>
        </div>
      </div>
    `
    document.body.appendChild(div)
  }
}
