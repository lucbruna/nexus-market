import { esc, fmt, fmtNum, toast, openModal, closeModal } from '../../utils/format.js'

export class PedidosCompra {
  constructor() {
    this.itensForm = []
    this.editandoId = null
  }

  async render() {
    const el = document.getElementById('page-pedidos-compra')
    el.innerHTML = `
      <div class="section-header">
        <h2>🛍️ Pedidos de Compra</h2>
        <div class="gap-8">
          <button class="btn btn-primary" onclick="window.pedidosCompra.abrirForm()">+ Novo Pedido</button>
          <button class="btn btn-secondary" onclick="window.pedidosCompra.gerarCurvaABC()">📊 Curva ABC</button>
        </div>
      </div>
      <div class="kpi-grid" id="pc-kpis"></div>
      <div id="pedidos-table-wrap"><div class="empty-state"><div class="icon">🛍️</div><p>Carregando...</p></div></div>
    `

    window.pedidosCompra = this
    this.renderModalForm()
    this.renderModalItens()
    await this.loadData()
  }

  async loadData() {
    const db = window.db.db
    const pedidos = await db.pedidosCompra.toArray()
    pedidos.sort((a,b) => new Date(b.data) - new Date(a.data))

    const fornMap = {}
    const fornecedores = await db.fornecedores.toArray()
    fornecedores.forEach(f => fornMap[f.id] = f)

    const pendentes = pedidos.filter(p => p.status === 'pendente' || p.status === 'aprovado')
    const totalPendente = pendentes.reduce((a,p) => a + (p.total||0), 0)
    const totalGeral = pedidos.reduce((a,p) => a + (p.total||0), 0)

    document.getElementById('pc-kpis').innerHTML = `
      <div class="kpi yellow"><div class="kpi-label">📋 Pendentes</div><div class="kpi-value">${pendentes.length}</div><div class="kpi-sub">${fmt(totalPendente)} em pedidos</div></div>
      <div class="kpi green"><div class="kpi-label">✅ Recebidos</div><div class="kpi-value">${pedidos.filter(p=>p.status==='recebido').length}</div><div class="kpi-sub">pedidos concluídos</div></div>
      <div class="kpi blue"><div class="kpi-label">📊 Total Período</div><div class="kpi-value">${fmt(totalGeral)}</div><div class="kpi-sub">${pedidos.length} pedidos</div></div>
    `

    const wrap = document.getElementById('pedidos-table-wrap')
    wrap.innerHTML = pedidos.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>#</th><th>Fornecedor</th><th>Data</th><th>Entrega</th><th>Itens</th><th>Total</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>${pedidos.map(p => {
            const forn = fornMap[p.fornecedorId]
            const atrasado = p.status==='pendente' && p.entrega && new Date(p.entrega) < new Date()
            return `<tr>
              <td class="text-mono">${p.id}</td>
              <td><strong>${esc(forn?.razaoSocial||forn?.fantasia||'—')}</strong></td>
              <td class="text-mono">${new Date(p.data).toLocaleDateString('pt-BR')}</td>
              <td class="text-mono ${atrasado?'text-red':''}">${p.entrega ? new Date(p.entrega).toLocaleDateString('pt-BR') : '—'}</td>
              <td class="text-mono">${p.itens||0}</td>
              <td class="text-mono text-green">${fmt(p.total||0)}</td>
              <td><span class="badge ${p.status==='recebido'?'green':p.status==='cancelado'?'red':p.status==='aprovado'?'blue':'yellow'}">${p.status||'pendente'}</span></td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="window.pedidosCompra.verItens(${p.id})">📋</button>
                ${p.status==='pendente'?`<button class="btn btn-sm btn-primary" onclick="window.pedidosCompra.aprovar(${p.id})">✅</button>`:''}
                ${p.status==='pendente'?`<button class="btn btn-sm btn-danger" onclick="window.pedidosCompra.cancelar(${p.id})">❌</button>`:''}
              </td>
            </tr>`
          }).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><div class="icon">🛍️</div><p>Nenhum pedido de compra</p></div>'
  }

  async abrirForm() {
    this.editandoId = null
    this.itensForm = []
    const db = window.db.db
    const forn = await db.fornecedores.toArray()
    const sel = document.getElementById('ped-fornecedor')
    sel.innerHTML = '<option value="">Selecione...</option>'
    forn.forEach(f => {
      const o = document.createElement('option'); o.value = f.id
      o.textContent = `${f.razaoSocial||f.fantasia} (${f.prazoPagamento||0}d)`
      sel.appendChild(o)
    })
    const prods = await db.produtos.filter(p => p.ativo).toArray()
    const selItem = document.getElementById('ped-item-produto')
    selItem.innerHTML = '<option value="">Selecione...</option>'
    prods.forEach(p => {
      const o = document.createElement('option'); o.value = p.id
      o.textContent = `${p.nome} (${fmt(p.preco)})`
      selItem.appendChild(o)
    })
    document.getElementById('ped-data').value = new Date().toISOString().split('T')[0]
    document.getElementById('ped-entrega').value = ''
    document.getElementById('ped-total').value = ''
    document.getElementById('ped-obs').value = ''
    document.getElementById('ped-frete').value = ''
    document.getElementById('ped-desconto').value = ''
    document.getElementById('ped-item-lista').innerHTML = '<div style="color:var(--text3);padding:8px;">Nenhum item adicionado</div>'
    document.getElementById('ped-itens-total').textContent = 'R$ 0,00'
    openModal('modal-pedido')
  }

  adicionarItem() {
    const prodtId = parseInt(document.getElementById('ped-item-produto').value)
    const qtd = parseInt(document.getElementById('ped-item-qtd').value) || 1
    const preco = parseFloat(document.getElementById('ped-item-preco').value) || 0
    if (!prodtId || qtd <= 0 || preco <= 0) { toast('⚠️ Preencha produto, qtd e preço', 'error'); return }
    const db = window.db.db
    db.produtos.get(prodtId).then(prod => {
      const existente = this.itensForm.find(i => i.produtoId === prodtId)
      if (existente) {
        existente.qtd += qtd
        existente.total = existente.qtd * existente.preco
      } else {
        this.itensForm.push({ produtoId: prodtId, nome: prod.nome, qtd, preco, total: qtd * preco })
      }
      this.renderItensForm()
      document.getElementById('ped-item-qtd').value = '1'
      document.getElementById('ped-item-preco').value = prod.preco
    })
  }

  removerItemForm(idx) {
    this.itensForm.splice(idx, 1)
    this.renderItensForm()
  }

  renderItensForm() {
    const el = document.getElementById('ped-item-lista')
    const total = this.itensForm.reduce((a,i) => a + i.total, 0)
    el.innerHTML = this.itensForm.length ? this.itensForm.map((i, idx) => `
      <div style="display:flex;align-items:center;gap:8px;padding:6px;background:var(--bg3);border-radius:6px;margin-bottom:4px;">
        <span style="flex:1;font-size:12px;"><strong>${esc(i.nome)}</strong></span>
        <span class="text-mono" style="font-size:11px;">${i.qtd} x ${fmt(i.preco)}</span>
        <span class="text-mono text-green" style="font-size:12px;">${fmt(i.total)}</span>
        <button class="rm-btn" onclick="window.pedidosCompra.removerItemForm(${idx})">✕</button>
      </div>
    `).join('') : '<div style="color:var(--text3);padding:8px;font-size:12px;">Nenhum item — adicione acima</div>'
    document.getElementById('ped-itens-total').textContent = fmt(total)
    document.getElementById('ped-total').value = total.toFixed(2)
  }

  async salvar() {
    const db = window.db.db
    const total = this.itensForm.reduce((a,i) => a + i.total, 0)
    const frete = parseFloat(document.getElementById('ped-frete').value) || 0
    const desconto = parseFloat(document.getElementById('ped-desconto').value) || 0
    const data = {
      fornecedorId: parseInt(document.getElementById('ped-fornecedor').value),
      filialId: 1,
      data: document.getElementById('ped-data').value || new Date().toISOString(),
      entrega: document.getElementById('ped-entrega').value || null,
      total: total + frete - desconto,
      frete, desconto,
      observacoes: document.getElementById('ped-obs').value.trim(),
      itens: this.itensForm.length,
      status: 'pendente',
    }
    if (!data.fornecedorId) { toast('⚠️ Selecione um fornecedor', 'error'); return }
    if (!this.itensForm.length) { toast('⚠️ Adicione pelo menos um item', 'error'); return }
    const pedidoId = await db.pedidosCompra.add(data)
    for (const item of this.itensForm) {
      await db.itensPedidoCompra.add({
        pedidoId, produtoId: item.produtoId, nome: item.nome,
        qtd: item.qtd, preco: item.preco, total: item.total, recebido: 0
      })
    }
    toast('✅ Pedido criado com sucesso', 'success')
    closeModal('modal-pedido')
    this.loadData()
  }

  async verItens(id) {
    const db = window.db.db
    const ped = await db.pedidosCompra.get(id)
    const itens = await db.itensPedidoCompra.filter(i => i.pedidoId === id).toArray()
    const forn = await db.fornecedores.get(ped?.fornecedorId)
    const el = document.getElementById('modal-itens-content')
    el.innerHTML = `
      <div style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;font-size:12px;">
          <span><strong>Fornecedor:</strong> ${esc(forn?.razaoSocial||'—')}</span>
          <span><strong>Total:</strong> <span class="text-green text-mono">${fmt(ped?.total||0)}</span></span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-top:4px;color:var(--text3);">
          <span>📅 ${new Date(ped?.data).toLocaleDateString('pt-BR')}</span>
          <span>Status: ${ped?.status||'—'}</span>
        </div>
      </div>
      ${itens.length ? `
        <div class="tbl-wrap">
          <table>
            <thead><tr><th>Produto</th><th>Qtd</th><th>Preço</th><th>Total</th><th>Recebido</th></tr></thead>
            <tbody>${itens.map(i => `
              <tr>
                <td><strong>${esc(i.nome||'—')}</strong></td>
                <td class="text-mono">${i.qtd||0}</td>
                <td class="text-mono">${fmt(i.preco||0)}</td>
                <td class="text-mono text-green">${fmt(i.total||0)}</td>
                <td><span class="badge ${(i.recebido||0) >= (i.qtd||0)?'green':'yellow'}">${i.recebido||0}</span></td>
              </tr>
            `).join('')}</tbody>
          </table>
        </div>
      ` : '<div class="empty-state"><div class="icon">📦</div><p>Sem itens</p></div>'}
    `
    openModal('modal-itens-pedido')
  }

  async aprovar(id) {
    const db = window.db.db
    await db.pedidosCompra.update(id, { status: 'aprovado', aprovadoPor: 'Operador' })
    toast('✅ Pedido aprovado', 'success')
    this.loadData()
  }

  async cancelar(id) {
    if (!confirm('Cancelar este pedido?')) return
    const db = window.db.db
    await db.pedidosCompra.update(id, { status: 'cancelado' })
    toast('❌ Pedido cancelado', 'info')
    this.loadData()
  }

  async gerarCurvaABC() {
    const db = window.db.db
    const itensPDV = await db.itensPDV.toArray()
    const prodMap = {}
    const prods = await db.produtos.toArray()
    prods.forEach(p => prodMap[p.id] = p)

    const vendas = {}
    for (const it of itensPDV) {
      if (!vendas[it.produtoId]) vendas[it.produtoId] = { qtd: 0, valor: 0 }
      vendas[it.produtoId].qtd += it.qtd || 0
      vendas[it.produtoId].valor += it.total || 0
    }
    const ranked = Object.entries(vendas).sort((a,b) => b[1].valor - a[1].valor)
    const totalValor = ranked.reduce((a, [_, v]) => a + v.valor, 0)
    let acum = 0
    const sugestoes = ranked.map(([id, v]) => {
      acum += v.valor
      const pctAcum = (acum / totalValor) * 100
      const prod = prodMap[parseInt(id)]
      if (!prod || pctAcum > 80) return null
      if ((prod.estoque||0) <= (prod.estMin||5)) {
        return { nome: prod.nome, estoque: prod.estoque, estMin: prod.estMin, qtdVendida: v.qtd }
      }
      return null
    }).filter(Boolean).slice(0, 10)

    if (!sugestoes.length) { toast('📊 Nenhum produto crítico para compra', 'info'); return }
    const msg = '📊 SUGESTÕES DE COMPRA (Curva A):\n' + sugestoes.map(s =>
      `• ${s.nome}: estoque ${s.estoque} (mín ${s.estMin}), vendeu ${s.qtdVendida}un`
    ).join('\n')
    toast(msg, 'info', 10000)
  }

  renderModalForm() {
    if (document.getElementById('modal-pedido')) return
    const div = document.createElement('div'); div.className = 'modal-overlay hidden'; div.id = 'modal-pedido'
    div.innerHTML = `
      <div class="modal" style="min-width:550px;">
        <h2>🛍️ Novo Pedido de Compra</h2>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Fornecedor</label><select id="ped-fornecedor"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>Data</label><input type="date" id="ped-data"/></div>
          <div class="form-group"><label>Previsão Entrega</label><input type="date" id="ped-entrega"/></div>
        </div>
        <div style="border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:12px;">
          <div style="font-size:12px;font-weight:600;margin-bottom:8px;">📦 Itens do Pedido</div>
          <div class="form-grid" style="grid-template-columns:2fr 1fr 1fr auto;">
            <div class="form-group"><label>Produto</label><select id="ped-item-produto"><option value="">Selecione...</option></select></div>
            <div class="form-group"><label>Qtd</label><input type="number" id="ped-item-qtd" value="1" min="1"/></div>
            <div class="form-group"><label>Preço Unit.</label><input type="number" id="ped-item-preco" step="0.01" min="0"/></div>
            <div style="display:flex;align-items:flex-end;"><button class="btn btn-primary btn-sm" onclick="window.pedidosCompra.adicionarItem()">+</button></div>
          </div>
          <div id="ped-item-lista" style="margin-top:8px;"></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600;margin-top:8px;padding-top:8px;border-top:1px solid var(--border);">
            <span>Total Itens</span><span class="text-green text-mono" id="ped-itens-total">R$ 0,00</span>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group"><label>Frete (R$)</label><input type="number" id="ped-frete" step="0.01" min="0" value="0"/></div>
          <div class="form-group"><label>Desconto (R$)</label><input type="number" id="ped-desconto" step="0.01" min="0" value="0"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Observações</label><textarea id="ped-obs" rows="2"></textarea></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-pedido')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.pedidosCompra.salvar()">💾 Salvar Pedido</button>
        </div>
      </div>`
    document.body.appendChild(div)
  }

  renderModalItens() {
    if (document.getElementById('modal-itens-pedido')) return
    const div = document.createElement('div'); div.className = 'modal-overlay hidden'; div.id = 'modal-itens-pedido'
    div.innerHTML = `
      <div class="modal">
        <h2>📋 Detalhes do Pedido</h2>
        <div id="modal-itens-content"></div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-itens-pedido')">Fechar</button>
        </div>
      </div>`
    document.body.appendChild(div)
  }
}
