import { esc, fmt, fmtNum, toast, openModal, closeModal } from '../../utils/format.js'

export class Delivery {
  async render() {
    const el = document.getElementById('page-entrega')
    el.innerHTML = `
      <div class="section-header">
        <h2>📍 Delivery</h2>
        <button class="btn btn-primary" onclick="window.delivery.abrirForm()">+ Novo Pedido Delivery</button>
      </div>
      <div class="kpi-grid" id="delivery-kpis"></div>
      <div class="card">
        <div class="card-title">📋 Pedidos Delivery</div>
        <div id="delivery-table-wrap"><div class="empty-state"><div class="icon">📍</div><p>Carregando...</p></div></div>
      </div>
    `

    window.delivery = this
    this.renderModalForm()
    await this.loadData()
  }

  async loadData() {
    const db = window.db.db
    const pedidos = await db.pedidosVenda.toArray()
    const delivery = pedidos.filter(p => p.formaPagamento === 'delivery' || p.status === 'delivery')
    delivery.sort((a,b) => new Date(b.data) - new Date(a.data))

    const pendentes = delivery.filter(p => p.status === 'pendente' || p.status === 'delivery').length
    const total = delivery.reduce((a,p) => a + (p.total||0), 0)

    document.getElementById('delivery-kpis').innerHTML = `
      <div class="kpi yellow"><div class="kpi-label">⏳ Pendentes</div><div class="kpi-value">${pendentes}</div><div class="kpi-sub">pedidos</div></div>
      <div class="kpi green"><div class="kpi-label">💰 Total Delivery</div><div class="kpi-value">${fmt(total)}</div><div class="kpi-sub">receita delivery</div></div>
      <div class="kpi blue"><div class="kpi-label">📦 Total Pedidos</div><div class="kpi-value">${delivery.length}</div><div class="kpi-sub">histórico</div></div>
    `

    const wrap = document.getElementById('delivery-table-wrap')
    wrap.innerHTML = delivery.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Data</th><th>Cliente</th><th>Total</th><th>Pagamento</th><th>Status</th></tr></thead>
          <tbody>${delivery.map(p => `
            <tr>
              <td class="text-mono">${new Date(p.data).toLocaleDateString('pt-BR')}</td>
              <td><strong>${p.clienteId||'—'}</strong></td>
              <td class="text-mono text-green">${fmt(p.total||0)}</td>
              <td>${esc(p.formaPagamento||'—')}</td>
              <td><span class="badge ${p.status==='entregue'?'green':p.status==='cancelado'?'red':'yellow'}">${esc(p.status||'pendente')}</span></td>
            </tr>
          `).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><div class="icon">📍</div><p>Nenhum pedido delivery</p></div>'
  }

  abrirForm() {
    document.getElementById('del-cliente').value = ''
    document.getElementById('del-total').value = ''
    document.getElementById('del-forma').value = 'pix'
    openModal('modal-delivery')
  }

  async salvar() {
    const db = window.db.db
    const data = {
      clienteId: parseInt(document.getElementById('del-cliente').value)||null,
      data: new Date().toISOString(),
      total: parseFloat(document.getElementById('del-total').value)||0,
      formaPagamento: document.getElementById('del-forma').value,
      status: 'pendente',
    }
    if (data.total <= 0) { toast('⚠️ Informe o total', 'error'); return }
    await db.pedidosVenda.add(data)
    toast('✅ Pedido delivery registrado', 'success')
    closeModal('modal-delivery')
    this.loadData()
  }

  renderModalForm() {
    if (document.getElementById('modal-delivery')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'
    div.id = 'modal-delivery'
    div.innerHTML = `
      <div class="modal">
        <h2>📍 Novo Pedido Delivery</h2>
        <div class="form-grid">
          <div class="form-group"><label>Cliente ID</label><input type="number" id="del-cliente" min="0" placeholder="ID do cliente"/></div>
          <div class="form-group"><label>Total (R$)</label><input type="number" id="del-total" step="0.01" min="0"/></div>
          <div class="form-group"><label>Pagamento</label><select id="del-forma"><option value="pix">PIX</option><option value="dinheiro">Dinheiro</option><option value="credito">Crédito</option><option value="debito">Débito</option></select></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-delivery')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.delivery.salvar()">💾 Salvar</button>
        </div>
      </div>
    `
    document.body.appendChild(div)
  }
}
