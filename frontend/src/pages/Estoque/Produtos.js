import { esc, fmt, fmtNum, toast, openModal, closeModal } from '../../utils/format.js'

export class Produtos {
  constructor() {
    this.editandoId = null
  }

  async render() {
    const el = document.getElementById('page-produtos')
    const db = window.db.db

    el.innerHTML = `
      <div class="section-header">
        <h2>📦 Produtos</h2>
        <div class="gap-8">
          <input type="text" id="prod-search" class="search-bar" placeholder="🔍 Buscar produto..." autocomplete="off"/>
          <button class="btn btn-primary" onclick="window.produtos.abrirForm()">+ Novo Produto</button>
        </div>
      </div>
      <div id="prod-table-wrap"><div class="empty-state"><div class="icon">📦</div><p>Carregando...</p></div></div>
    `

    window.produtos = this
    this.renderModalForm()
    this.loadData()

    document.getElementById('prod-search').addEventListener('input', () => this.loadData())
  }

  async loadData() {
    const db = window.db.db
    const q = (document.getElementById('prod-search')?.value || '').toLowerCase()
    let lista = await db.produtos.toArray()
    if (q) lista = lista.filter(p => p.nome.toLowerCase().includes(q) || (p.ean && p.ean.includes(q)) || (p.codigo && p.codigo.includes(q)))
    lista.sort((a,b) => a.nome.localeCompare(b.nome))

    const wrap = document.getElementById('prod-table-wrap')
    wrap.innerHTML = lista.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Cód</th><th>EAN</th><th>Nome</th><th>Preço</th><th>Custo</th><th>Estoque</th><th>Mín</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>${lista.map(p => `
            <tr>
              <td class="text-mono">${esc(p.codigo||'—')}</td>
              <td class="text-mono" style="font-size:11px;">${esc(p.ean||'—')}</td>
              <td><strong>${esc(p.nome)}</strong></td>
              <td class="text-mono text-green">${fmt(p.preco)}</td>
              <td class="text-mono">${fmt(p.custo||0)}</td>
              <td class="text-mono">${fmtNum(p.estoque||0)} ${esc(p.unidade||'UN')}</td>
              <td class="text-mono">${fmtNum(p.estMin||5)}</td>
              <td><span class="badge ${p.ativo?'green':'red'}">${p.ativo?'Ativo':'Inativo'}</span></td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="window.produtos.editar(${p.id})">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="window.produtos.excluir(${p.id})">🗑️</button>
              </td>
            </tr>
          `).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><div class="icon">📦</div><p>Nenhum produto encontrado</p></div>'
  }

  abrirForm() {
    this.editandoId = null
    document.getElementById('modal-prod-title').textContent = 'Novo Produto'
    document.getElementById('prod-codigo').value = ''
    document.getElementById('prod-ean').value = ''
    document.getElementById('prod-nome').value = ''
    document.getElementById('prod-preco').value = ''
    document.getElementById('prod-custo').value = ''
    document.getElementById('prod-estoque').value = ''
    document.getElementById('prod-estmin').value = ''
    document.getElementById('prod-unidade').value = 'UN'
    document.getElementById('prod-ativo').checked = true
    openModal('modal-produto')
  }

  async editar(id) {
    const db = window.db.db
    const p = await db.produtos.get(id)
    if (!p) return
    this.editandoId = id
    document.getElementById('modal-prod-title').textContent = 'Editar Produto'
    document.getElementById('prod-codigo').value = p.codigo||''
    document.getElementById('prod-ean').value = p.ean||''
    document.getElementById('prod-nome').value = p.nome
    document.getElementById('prod-preco').value = p.preco
    document.getElementById('prod-custo').value = p.custo||''
    document.getElementById('prod-estoque').value = p.estoque||0
    document.getElementById('prod-estmin').value = p.estMin||5
    document.getElementById('prod-unidade').value = p.unidade||'UN'
    document.getElementById('prod-ativo').checked = p.ativo!==false
    openModal('modal-produto')
  }

  async salvar() {
    const db = window.db.db
    const data = {
      codigo: document.getElementById('prod-codigo').value.trim(),
      ean: document.getElementById('prod-ean').value.trim(),
      nome: document.getElementById('prod-nome').value.trim(),
      preco: parseFloat(document.getElementById('prod-preco').value)||0,
      custo: parseFloat(document.getElementById('prod-custo').value)||0,
      estoque: parseInt(document.getElementById('prod-estoque').value)||0,
      estMin: parseInt(document.getElementById('prod-estmin').value)||5,
      unidade: document.getElementById('prod-unidade').value,
      ativo: document.getElementById('prod-ativo').checked,
    }
    if (!data.nome) { toast('⚠️ Informe o nome do produto', 'error'); return }

    if (this.editandoId) {
      await db.produtos.update(this.editandoId, data)
      toast('✅ Produto atualizado', 'success')
    } else {
      await db.produtos.add(data)
      toast('✅ Produto criado', 'success')
    }
    closeModal('modal-produto')
    this.loadData()
  }

  async excluir(id) {
    if (!confirm('Excluir este produto?')) return
    const db = window.db.db
    await db.produtos.delete(id)
    toast('🗑️ Produto excluído', 'info')
    this.loadData()
  }

  renderModalForm() {
    if (document.getElementById('modal-produto')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'
    div.id = 'modal-produto'
    div.innerHTML = `
      <div class="modal">
        <h2 id="modal-prod-title">📦 Novo Produto</h2>
        <div class="form-grid">
          <div class="form-group"><label>Código</label><input type="text" id="prod-codigo" placeholder="Código interno"/></div>
          <div class="form-group"><label>EAN</label><input type="text" id="prod-ean" placeholder="Código de barras"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Nome</label><input type="text" id="prod-nome" placeholder="Nome do produto"/></div>
          <div class="form-group"><label>Preço Venda (R$)</label><input type="number" id="prod-preco" step="0.01" min="0"/></div>
          <div class="form-group"><label>Custo (R$)</label><input type="number" id="prod-custo" step="0.01" min="0"/></div>
          <div class="form-group"><label>Estoque</label><input type="number" id="prod-estoque" min="0"/></div>
          <div class="form-group"><label>Est. Mínimo</label><input type="number" id="prod-estmin" min="0"/></div>
          <div class="form-group"><label>Unidade</label><select id="prod-unidade"><option value="UN">UN</option><option value="KG">KG</option><option value="L">L</option><option value="PC">PC</option><option value="CX">CX</option></select></div>
          <div class="form-group"><label><input type="checkbox" id="prod-ativo" checked/> Ativo</label></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-produto')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.produtos.salvar()">💾 Salvar</button>
        </div>
      </div>
    `
    document.body.appendChild(div)
  }
}
