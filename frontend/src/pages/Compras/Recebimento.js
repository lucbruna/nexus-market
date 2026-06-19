import { fmt, toast, openModal, closeModal } from '../../utils/format.js'

const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

export class Recebimento {
  async render() {
    const el = document.getElementById('page-recebimento')
    el.innerHTML = `
      <div class="section-header">
        <h2>Recebimento de Mercadorias</h2>
        <button class="btn btn-primary" onclick="window.recebimento.abrirForm()">Registrar recebimento</button>
      </div>
      <div class="kpi-grid" id="recebimento-kpis"></div>
      <div id="recebimento-table-wrap"></div>
    `
    window.recebimento = this
    this.renderModalForm()
    await this.loadData()
  }

  async loadData() {
    const db = window.db.db
    const recs = await db.recebimentos.toArray()
    recs.sort((a, b) => new Date(b.data) - new Date(a.data))
    const total = recs.reduce((s, r) => s + (r.valor || 0), 0)
    const conferidos = recs.filter(r => r.status === 'conferido').length
    document.getElementById('recebimento-kpis').innerHTML = `
      <div class="kpi green"><div class="kpi-label">Valor recebido</div><div class="kpi-value">${fmt(total)}</div></div>
      <div class="kpi blue"><div class="kpi-label">Recebimentos</div><div class="kpi-value">${recs.length}</div></div>
      <div class="kpi yellow"><div class="kpi-label">Conferidos</div><div class="kpi-value">${conferidos}</div></div>
    `
    const wrap = document.getElementById('recebimento-table-wrap')
    wrap.innerHTML = recs.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Data/Hora</th><th>NF</th><th>Fornecedor</th><th>Produto(s)</th><th>Validade</th><th>Veiculo/Placa</th><th>Valor</th><th>Responsavel</th><th>Status</th></tr></thead>
          <tbody>${recs.map(r => `
            <tr>
              <td class="text-mono">${new Date(r.data).toLocaleString('pt-BR')}</td>
              <td class="text-mono">${esc(r.nf || '-')}</td>
              <td>${esc(r.fornecedor || '-')}</td>
              <td>${esc(r.produtos || '-')}</td>
              <td class="text-mono">${r.validade ? new Date(r.validade + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}</td>
              <td>${esc(r.veiculo || '-')} <span class="text-mono">${esc(r.placa || '')}</span></td>
              <td class="text-mono text-green">${fmt(r.valor || 0)}</td>
              <td>${esc(r.responsavel || '-')}</td>
              <td><span class="badge ${r.status === 'conferido' ? 'green' : 'yellow'}">${esc(r.status || 'pendente')}</span></td>
            </tr>
          `).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><p>Nenhum recebimento registrado</p></div>'
  }

  abrirForm() {
    ;['rec-nf','rec-fornecedor','rec-produtos','rec-validade','rec-veiculo','rec-placa','rec-valor','rec-responsavel','rec-obs'].forEach(id => {
      const el = document.getElementById(id)
      if (el) el.value = ''
    })
    document.getElementById('rec-status').value = 'pendente'
    openModal('modal-recebimento')
  }

  async salvar() {
    const db = window.db.db
    const data = {
      data: new Date().toISOString(),
      nf: document.getElementById('rec-nf').value.trim(),
      fornecedor: document.getElementById('rec-fornecedor').value.trim(),
      produtos: document.getElementById('rec-produtos').value.trim(),
      validade: document.getElementById('rec-validade').value,
      veiculo: document.getElementById('rec-veiculo').value.trim(),
      placa: document.getElementById('rec-placa').value.trim().toUpperCase(),
      valor: Number(document.getElementById('rec-valor').value || 0),
      responsavel: document.getElementById('rec-responsavel').value.trim() || 'Operador',
      observacao: document.getElementById('rec-obs').value.trim(),
      status: document.getElementById('rec-status').value,
    }
    if (!data.nf || !data.produtos) return toast('Informe NF e produto(s)', 'error')
    await db.recebimentos.add(data)
    toast('Recebimento registrado', 'success')
    closeModal('modal-recebimento')
    await this.loadData()
  }

  renderModalForm() {
    if (document.getElementById('modal-recebimento')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'
    div.id = 'modal-recebimento'
    div.innerHTML = `
      <div class="modal">
        <h2>Registrar recebimento completo</h2>
        <div class="form-grid">
          <div class="form-group"><label>NF</label><input id="rec-nf"/></div>
          <div class="form-group"><label>Fornecedor</label><input id="rec-fornecedor"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Produto ou produtos</label><input id="rec-produtos" placeholder="Ex: Arroz 5kg lote A123, Feijao 1kg lote B22"/></div>
          <div class="form-group"><label>Prazo de validade</label><input type="date" id="rec-validade"/></div>
          <div class="form-group"><label>Valor</label><input type="number" step="0.01" id="rec-valor"/></div>
          <div class="form-group"><label>Veiculo</label><input id="rec-veiculo" placeholder="Caminhao, Fiorino, Van"/></div>
          <div class="form-group"><label>Placa</label><input id="rec-placa" placeholder="ABC1D23"/></div>
          <div class="form-group"><label>Responsavel</label><input id="rec-responsavel"/></div>
          <div class="form-group"><label>Status</label><select id="rec-status"><option value="pendente">Pendente</option><option value="conferido">Conferido</option><option value="divergente">Divergente</option></select></div>
          <div class="form-group" style="grid-column:span 2"><label>Observacoes de conferencia</label><textarea id="rec-obs"></textarea></div>
        </div>
        <div class="modal-footer"><button class="btn btn-secondary" onclick="window.closeModal('modal-recebimento')">Cancelar</button><button class="btn btn-primary" onclick="window.recebimento.salvar()">Salvar</button></div>
      </div>`
    document.body.appendChild(div)
  }
}
