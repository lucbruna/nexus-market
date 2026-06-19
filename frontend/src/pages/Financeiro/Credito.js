import { fmt, toast, openModal, closeModal } from '../../utils/format.js'

const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

export class Credito {
  async render() {
    const el = document.getElementById('page-credito')
    el.innerHTML = `
      <div class="section-header">
        <h2>Crediario / Fiado</h2>
        <div class="gap-8">
          <input type="text" id="cred-search" class="search-bar" placeholder="Buscar cliente..." autocomplete="off"/>
          <button class="btn btn-primary" onclick="window.credito.abrirModal()">Nova compra fiado</button>
        </div>
      </div>
      <div class="kpi-grid" id="cred-kpis"></div>
      <div id="cred-table-wrap"></div>
    `
    window.credito = this
    this.renderModalCredito()
    await this.loadData()
    document.getElementById('cred-search').addEventListener('input', () => this.loadData())
  }

  async getLancamentos(db) {
    const vendas = await db.vendasPDV.filter(v => ['crediario', 'fiado', 'convenio'].some(f => String(v.formaPagamento || '').includes(f))).toArray()
    const manuais = await db.cobrancas.toArray()
    return [
      ...vendas.map(v => ({ clienteNome: v.clienteNome, data: v.data, descricao: `Venda #${v.num || v.id}`, valor: v.total, status: v.status || 'aberto', origem: 'PDV' })),
      ...manuais.map(c => ({ clienteNome: c.clienteNome, data: c.data, descricao: c.descricao || c.observacao || 'Lancamento manual', valor: c.valor, status: c.status || 'aberto', origem: 'Manual' })),
    ].sort((a, b) => new Date(b.data) - new Date(a.data))
  }

  async loadData() {
    const db = window.db.db
    const q = (document.getElementById('cred-search')?.value || '').toLowerCase()
    let lista = await this.getLancamentos(db)
    if (q) lista = lista.filter(c => String(c.clienteNome || '').toLowerCase().split(/\s+/).some(p => p.startsWith(q)))
    const aberto = lista.filter(l => l.status !== 'pago').reduce((s, l) => s + (l.valor || 0), 0)
    const pago = lista.filter(l => l.status === 'pago').reduce((s, l) => s + (l.valor || 0), 0)
    document.getElementById('cred-kpis').innerHTML = `
      <div class="kpi yellow"><div class="kpi-label">Aberto</div><div class="kpi-value">${fmt(aberto)}</div></div>
      <div class="kpi green"><div class="kpi-label">Pago</div><div class="kpi-value">${fmt(pago)}</div></div>
      <div class="kpi blue"><div class="kpi-label">Lancamentos</div><div class="kpi-value">${lista.length}</div></div>
    `
    const wrap = document.getElementById('cred-table-wrap')
    wrap.innerHTML = lista.length ? `
      <div class="tbl-wrap">
        <table><thead><tr><th>Data</th><th>Horario</th><th>Cliente</th><th>Descricao</th><th>Origem</th><th>Valor</th><th>Status</th></tr></thead>
        <tbody>${lista.map(l => {
          const d = new Date(l.data)
          return `<tr><td class="text-mono">${d.toLocaleDateString('pt-BR')}</td><td class="text-mono">${d.toLocaleTimeString('pt-BR')}</td><td><strong>${esc(l.clienteNome || 'Cliente')}</strong></td><td>${esc(l.descricao)}</td><td>${esc(l.origem)}</td><td class="text-mono text-green">${fmt(l.valor)}</td><td><span class="badge ${l.status === 'pago' ? 'green' : 'yellow'}">${esc(l.status)}</span></td></tr>`
        }).join('')}</tbody></table>
      </div>
    ` : '<div class="empty-state"><p>Nenhuma compra fiado/crediario registrada</p></div>'
  }

  async abrirModal() {
    const db = window.db.db
    const clientes = await db.clientes.toArray()
    document.getElementById('cred-cliente').innerHTML = '<option value="">Selecione...</option>' + clientes.map(c => `<option value="${c.id}">${esc(c.nome)} (${esc(c.cpf || '-')})</option>`).join('')
    document.getElementById('cred-valor').value = ''
    document.getElementById('cred-descricao').value = ''
    const now = new Date()
    document.getElementById('cred-data').value = now.toISOString().slice(0, 10)
    document.getElementById('cred-hora').value = now.toTimeString().slice(0, 5)
    openModal('modal-credito')
  }

  async salvar() {
    const db = window.db.db
    const clienteId = Number(document.getElementById('cred-cliente').value)
    const cliente = await db.clientes.get(clienteId)
    const valor = Number(document.getElementById('cred-valor').value || 0)
    if (!cliente || valor <= 0) return toast('Informe cliente e valor', 'error')
    const dataStr = document.getElementById('cred-data').value
    const horaStr = document.getElementById('cred-hora').value || '00:00'
    const dataCompra = new Date(`${dataStr}T${horaStr}:00`).toISOString()
    await db.cobrancas.add({
      clienteId, clienteNome: cliente.nome,
      data: dataCompra,
      valor, vencimento: new Date().toISOString(),
      status: 'aberto',
      descricao: document.getElementById('cred-descricao').value.trim() || 'Compra fiado'
    })
    await db.clientes.update(clienteId, { totalCompras: (cliente.totalCompras || 0) + valor })
    toast('Compra fiado registrada', 'success')
    closeModal('modal-credito')
    await this.loadData()
  }

  renderModalCredito() {
    if (document.getElementById('modal-credito')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'
    div.id = 'modal-credito'
    div.innerHTML = `<div class="modal"><h2>Nova compra fiado</h2><div class="form-grid"><div class="form-group" style="grid-column:span 2"><label>Cliente</label><select id="cred-cliente"></select></div><div class="form-group"><label>Valor</label><input type="number" id="cred-valor" step="0.01"/></div><div class="form-group"><label>Descricao</label><input id="cred-descricao"/></div><div class="form-group"><label>Data da compra</label><input type="date" id="cred-data"/></div><div class="form-group"><label>Horario</label><input type="time" id="cred-hora"/></div></div><div class="modal-footer"><button class="btn btn-secondary" onclick="window.closeModal('modal-credito')">Cancelar</button><button class="btn btn-primary" onclick="window.credito.salvar()">Salvar</button></div></div>`
    document.body.appendChild(div)
  }
}
