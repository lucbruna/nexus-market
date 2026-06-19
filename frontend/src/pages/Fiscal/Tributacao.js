import { esc, fmt, toast, openModal, closeModal } from '../../utils/format.js'

export class Tributacao {
  async render() {
    const el = document.getElementById('page-tributacao')
    el.innerHTML = `
      <div class="section-header">
        <h2>⚖️ Tributação</h2>
        <button class="btn btn-primary" onclick="window.tributacao.abrirForm()">+ Nova Tributação</button>
      </div>
      <div class="card">
        <div class="card-title">📋 Tributações por Produto</div>
        <div id="trib-table-wrap"><div class="empty-state"><div class="icon">⚖️</div><p>Carregando...</p></div></div>
      </div>
    `

    window.tributacao = this
    this.renderModalForm()
    await this.loadData()
  }

  async loadData() {
    const db = window.db.db
    const produtos = await db.produtos.filter(p => p.ativo).toArray()

    const wrap = document.getElementById('trib-table-wrap')
    wrap.innerHTML = produtos.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Produto</th><th>NCM</th><th>CST</th><th>CFOP</th><th>ICMS %</th><th>PIS %</th><th>COFINS %</th></tr></thead>
          <tbody>${produtos.map(p => `
            <tr>
              <td><strong>${esc(p.nome)}</strong></td>
              <td class="text-mono">${p.ncm||'—'}</td>
              <td class="text-mono">${p.cst||'—'}</td>
              <td class="text-mono">${p.cfop||'—'}</td>
              <td class="text-mono">${p.icms != null ? p.icms + '%' : '—'}</td>
              <td class="text-mono">${p.pis != null ? p.pis + '%' : '—'}</td>
              <td class="text-mono">${p.cofins != null ? p.cofins + '%' : '—'}</td>
            </tr>
          `).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><div class="icon">⚖️</div><p>Nenhum produto cadastrado</p></div>'
  }

  abrirForm() {
    document.getElementById('trib-produto').value = ''
    document.getElementById('trib-ncm').value = ''
    document.getElementById('trib-cst').value = ''
    document.getElementById('trib-cfop').value = ''
    document.getElementById('trib-icms').value = ''
    document.getElementById('trib-pis').value = ''
    document.getElementById('trib-cofins').value = ''
    openModal('modal-tributacao')
  }

  async salvar() {
    const db = window.db.db
    const produtoId = parseInt(document.getElementById('trib-produto').value)
    if (!produtoId) { toast('⚠️ Selecione um produto', 'error'); return }
    await db.produtos.update(produtoId, {
      ncm: document.getElementById('trib-ncm').value.trim(),
      cst: document.getElementById('trib-cst').value.trim(),
      cfop: document.getElementById('trib-cfop').value.trim(),
      icms: parseFloat(document.getElementById('trib-icms').value)||null,
      pis: parseFloat(document.getElementById('trib-pis').value)||null,
      cofins: parseFloat(document.getElementById('trib-cofins').value)||null,
    })
    toast('✅ Tributação atualizada', 'success')
    closeModal('modal-tributacao')
    this.loadData()
  }

  renderModalForm() {
    if (document.getElementById('modal-tributacao')) return
    const db = window.db.db
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'
    div.id = 'modal-tributacao'
    div.innerHTML = `
      <div class="modal">
        <h2>⚖️ Configurar Tributação</h2>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Produto</label><select id="trib-produto"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>NCM</label><input type="text" id="trib-ncm" placeholder="Ex: 2106.90.90"/></div>
          <div class="form-group"><label>CST</label><input type="text" id="trib-cst" placeholder="Ex: 102"/></div>
          <div class="form-group"><label>CFOP</label><input type="text" id="trib-cfop" placeholder="Ex: 5102"/></div>
          <div class="form-group"><label>ICMS (%)</label><input type="number" id="trib-icms" step="0.01" min="0" max="100"/></div>
          <div class="form-group"><label>PIS (%)</label><input type="number" id="trib-pis" step="0.01" min="0" max="100"/></div>
          <div class="form-group"><label>COFINS (%)</label><input type="number" id="trib-cofins" step="0.01" min="0" max="100"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-tributacao')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.tributacao.salvar()">💾 Salvar</button>
        </div>
      </div>
    `
    document.body.appendChild(div)
    db.produtos.filter(p=>p.ativo).toArray().then(prods => {
      const sel = document.getElementById('trib-produto')
      prods.forEach(p => { const o = document.createElement('option'); o.value = p.id; o.textContent = `${p.nome} (${p.codigo||'—'})`; sel.appendChild(o) })
    })
  }
}
