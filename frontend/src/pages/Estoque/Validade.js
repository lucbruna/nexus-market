import { esc, fmt, fmtNum, toast, openModal, closeModal } from '../../utils/format.js'

export class Validade {
  async render() {
    const el = document.getElementById('page-validade')
    el.innerHTML = `
      <div class="section-header">
        <h2>📅 Controle de Validade</h2>
        <button class="btn btn-primary" onclick="window.validade.abrirModal()">+ Registrar Lote</button>
      </div>
      <div id="validade-table-wrap"><div class="empty-state"><div class="icon">📅</div><p>Carregando...</p></div></div>
    `

    window.validade = this
    this.renderModalLote()
    await this.loadData()
  }

  async loadData() {
    const db = window.db.db
    const lotes = await db.lotes.toArray()
    const produtos = await db.produtos.toArray()
    const prodMap = {}
    produtos.forEach(p => prodMap[p.id] = p)

    const hoje = new Date()
    hoje.setHours(0,0,0,0)
    const em7 = new Date(hoje); em7.setDate(em7.getDate()+7)
    const em30 = new Date(hoje); em30.setDate(em30.getDate()+30)

    lotes.sort((a,b) => new Date(a.vencimento) - new Date(b.vencimento))

    const wrap = document.getElementById('validade-table-wrap')
    wrap.innerHTML = lotes.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Produto</th><th>Lote</th><th>Fabricação</th><th>Vencimento</th><th>Qtd</th><th>Status</th></tr></thead>
          <tbody>${lotes.map(l => {
            const prod = prodMap[l.produtoId] || { nome: '—' }
            const ven = new Date(l.vencimento)
            const diff = Math.ceil((ven - hoje) / (1000*60*60*24))
            let badge = 'green', label = 'OK'
            if (diff <= 0) { badge = 'red'; label = 'Vencido' }
            else if (diff <= 7) { badge = 'red'; label = 'Vence Hoje/7d' }
            else if (diff <= 30) { badge = 'yellow'; label = 'Vence em 30d' }
            else if (diff <= 60) { badge = 'blue'; label = 'Vence em 60d' }
            return `<tr>
              <td><strong>${esc(prod.nome)}</strong></td>
              <td class="text-mono">${esc(l.lote)}</td>
              <td class="text-mono">${l.fabricacao ? new Date(l.fabricacao).toLocaleDateString('pt-BR') : '—'}</td>
              <td class="text-mono">${ven.toLocaleDateString('pt-BR')}</td>
              <td class="text-mono">${fmtNum(l.qtd||0)}</td>
              <td><span class="badge ${badge}">${label}</span></td>
            </tr>`
          }).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><div class="icon">📅</div><p>Nenhum lote registrado</p></div>'
  }

  abrirModal() {
    document.getElementById('lote-produto').value = ''
    document.getElementById('lote-nome').value = ''
    document.getElementById('lote-fabricacao').value = ''
    document.getElementById('lote-vencimento').value = ''
    document.getElementById('lote-qtd').value = ''
    openModal('modal-lote')
  }

  async salvarLote() {
    const db = window.db.db
    const produtoId = parseInt(document.getElementById('lote-produto').value)
    if (!produtoId) { toast('⚠️ Selecione um produto', 'error'); return }
    const data = {
      produtoId,
      lote: document.getElementById('lote-nome').value.trim() || 'LOTE-' + Date.now(),
      fabricacao: document.getElementById('lote-fabricacao').value || null,
      vencimento: document.getElementById('lote-vencimento').value,
      qtd: parseInt(document.getElementById('lote-qtd').value) || 0,
    }
    if (!data.vencimento) { toast('⚠️ Informe a data de vencimento', 'error'); return }
    await db.lotes.add(data)
    toast('✅ Lote registrado', 'success')
    closeModal('modal-lote')
    this.loadData()
  }

  renderModalLote() {
    if (document.getElementById('modal-lote')) return
    const db = window.db.db
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'
    div.id = 'modal-lote'
    div.innerHTML = `
      <div class="modal">
        <h2>📅 Registrar Lote</h2>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Produto</label><select id="lote-produto"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>Lote</label><input type="text" id="lote-nome" placeholder="Identificação do lote"/></div>
          <div class="form-group"><label>Fabricação</label><input type="date" id="lote-fabricacao"/></div>
          <div class="form-group"><label>Vencimento</label><input type="date" id="lote-vencimento"/></div>
          <div class="form-group"><label>Quantidade</label><input type="number" id="lote-qtd" min="0"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-lote')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.validade.salvarLote()">💾 Salvar</button>
        </div>
      </div>
    `
    document.body.appendChild(div)
    db.produtos.filter(p=>p.ativo).toArray().then(prods => {
      const sel = document.getElementById('lote-produto')
      prods.forEach(p => { const o = document.createElement('option'); o.value = p.id; o.textContent = `${p.nome} (${p.codigo||'—'})`; sel.appendChild(o) })
    })
  }
}
