import { openModal, closeModal, toast, fmt } from '../../utils/format.js'

const PAYMENT_METHODS = [
  { id: 'dinheiro', label: 'Dinheiro', icon: '💵', cash: true, change: true },
  { id: 'pix', label: 'PIX', icon: '⚡' },
  { id: 'debito', label: 'Debito', icon: '💳' },
  { id: 'credito', label: 'Credito', icon: '💳', installments: true },
  { id: 'voucher', label: 'Vale Alim.', icon: '🍽️' },
  { id: 'convenio', label: 'Convenio', icon: '🏢', needsCustomer: true },
  { id: 'crediario', label: 'Crediario', icon: '📋', needsCustomer: true },
]

const labelPayment = id => PAYMENT_METHODS.find(p => p.id === id)?.label || id
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

export class PDV {
  constructor() {
    this.cart = []
    this.discount = { tipo: 'pct', valor: 0 }
    this.selectedPayment = 'dinheiro'
    this.payments = []
    this.currentClientePDV = null
    this.allProdutos = []
    this.allCategorias = []
    this.categoriaAtiva = ''
    this.numVenda = 1
    this.caixaAtivo = null
    this.comandaAtiva = null
    this.entregaFlag = false
    this.caixaBusca = ''
  }

  async render() {
    const el = document.getElementById('page-pdv')
    const db = window.db.db
    this.caixaAtivo = await db.caixas.filter(c => c.status === 'aberto').first()
    el.innerHTML = `
      <div id="pdv-layout" class="pdv-layout-pro">
        <section id="pdv-left">
          <div id="pdv-header-bar">
            <div class="pdv-header-info">
              <span class="pdv-header-title">NEXUS PDV</span>
              <span class="pdv-header-sale" id="pdv-sale-number">Venda #${this.numVenda}</span>
              <span class="pdv-header-date">${new Date().toLocaleString('pt-BR')}</span>
            </div>
            <div class="pdv-header-actions">
              <button class="pdv-hdr-btn" onclick="window.openModal('modal-cliente-pdv')" title="Cliente">
                <span class="pdv-hdr-icon">👤</span>
                <span id="pdv-cliente-label" class="pdv-hdr-text">Cliente</span>
              </button>
              <button class="pdv-hdr-btn" onclick="window.pdv.toggleComanda()" id="btn-comanda" title="Comanda">
                <span class="pdv-hdr-icon">🎫</span>
                <span class="pdv-hdr-text">Comanda</span>
              </button>
              <button class="pdv-hdr-btn" onclick="window.pdv.clearCart()" title="Limpar">
                <span class="pdv-hdr-icon">🗑️</span>
                <span class="pdv-hdr-text">Limpar</span>
              </button>
            </div>
          </div>
          <div id="pdv-search-area">
            <div class="pdv-search-box">
              <span class="pdv-search-icon">🔍</span>
              <input type="text" id="pdv-input" placeholder="Buscar produto por nome, codigo ou EAN..." autocomplete="off"/>
            </div>
            <div id="pdv-cats" class="pdv-cats"></div>
          </div>
          <div id="pdv-products"></div>
        </section>

        <aside id="pdv-right">
          <div id="pdv-cart-header-pro">
            <div>
              <span class="cart-pro-title">Carrinho</span>
              <span class="cart-pro-count"><span id="cart-count">0</span> itens</span>
            </div>
            <div class="pdv-cart-total-display">
              <span>Total:</span>
              <strong id="pdv-cart-grand-total">R$ 0,00</strong>
            </div>
          </div>
          <div id="pdv-cart-items" class="pdv-cart-scroll"></div>
          <div id="pdv-cart-summary">
            <div class="cart-summary-row"><span>Subtotal</span><span class="text-mono" id="tot-subtotal">R$ 0,00</span></div>
            <div class="cart-summary-row cart-discount"><span>Desconto</span><span class="text-mono" id="tot-desconto">- R$ 0,00</span></div>
            <div class="cart-summary-row cart-total"><span>TOTAL</span><span id="tot-total">R$ 0,00</span></div>
          </div>
          <div id="pdv-caixa-status" class="${this.caixaAtivo ? 'hidden' : ''}">
            <span>Caixa fechado —</span>
            <button class="btn btn-sm btn-primary" onclick="window.pdv.abrirCaixa()">Abrir caixa</button>
          </div>
          <div id="pdv-payment-area">
            <div class="pay-area-title">Forma de pagamento</div>
            <div class="pay-methods-pro">
              ${PAYMENT_METHODS.map(p => `
                <button type="button" class="pay-btn-pro ${p.id === this.selectedPayment ? 'active' : ''}" data-method="${p.id}">
                  <span class="pay-pro-icon">${p.icon}</span>
                  <span class="pay-pro-label">${p.label}</span>
                </button>
              `).join('')}
            </div>
            <div class="pay-pro-detail">
              <input type="number" id="pay-installments" placeholder="Parcelas" step="1" min="1" value="1"/>
              <span class="pay-pro-valor">Total: <strong id="payment-auto-total">R$ 0,00</strong></span>
            </div>
            <div id="payment-summary"></div>
            <div class="pay-pro-actions">
              <button class="pay-act-btn" onclick="window.openModal('modal-desconto')">Desconto</button>
              <button class="pay-act-btn" onclick="window.openModal('modal-sangria')">Sangria</button>
              <button class="pay-act-btn" onclick="window.openModal('modal-suprimento')">Suprimento</button>
            </div>
            <button id="btn-finalizar" onclick="window.pdv.finalizarVenda()" disabled>
              <span>Finalizar venda</span>
              <span id="btn-total">R$ 0,00</span>
            </button>
          </div>
        </aside>
      </div>
    `
    window.pdv = this
    await this.loadData()
    this.bindEvents()
  }

  async loadData() {
    const db = window.db.db
    const cfg = await db.configuracoes.get('numVenda')
    if (cfg) this.numVenda = parseInt(cfg.valor, 10) || 1
    document.getElementById('pdv-sale-number').textContent = `Venda #${this.numVenda}`
    this.allCategorias = await db.categorias.toArray()
    this.allProdutos = await db.produtos.filter(p => p.ativo).toArray()
    this.renderCategories()
    this.renderProducts(this.allProdutos.slice(0, 80))
    this.caixaAtivo = await db.caixas.filter(c => c.status === 'aberto').first()
    this.updateCart()
    document.getElementById('pdv-input').focus()
  }

  bindEvents() {
    document.getElementById('pdv-input').addEventListener('input', () => this.applyProductFilter())
    document.getElementById('pdv-input').addEventListener('keydown', e => this.pdvKey(e))
    document.querySelectorAll('.pay-btn-pro').forEach(btn => btn.addEventListener('click', () => this.selectPay(btn.dataset.method)))
    this.renderModalDesconto()
    this.renderModalClientePDV()
    this.renderModalRecibo()
    this.renderModalSangria()
    this.renderModalSuprimento()
    this.renderModalAbrirCaixa()
  }

  renderCategories() {
    const catEl = document.getElementById('pdv-cats')
    catEl.innerHTML = `<button class="pdv-cat ${!this.categoriaAtiva ? 'active' : ''}" onclick="window.pdv.filtrarCategoria('')">Todos</button>`
      + this.allCategorias.map(c => `<button class="pdv-cat ${this.categoriaAtiva === c.nome ? 'active' : ''}" onclick="window.pdv.filtrarCategoria('${escapeHtml(c.nome)}')">${escapeHtml(c.nome)}</button>`).join('')
  }

  renderProducts(lista) {
    const el = document.getElementById('pdv-products')
    el.innerHTML = lista.map(p => `
      <button class="prod-card-pro" tabindex="-1" data-prod-id="${p.id}" onclick="window.pdv.addToCart(${p.id})">
        <span class="pro-card-header">
          <span class="pro-card-cod">${escapeHtml(p.codigo || p.ean || '')}</span>
          <span class="pro-card-stock ${(p.estoque || 0) <= 0 ? 'out' : (p.estoque || 0) <= (p.estMin || 5) ? 'low' : ''}">${p.estoque || 0}</span>
        </span>
        <span class="pro-card-name">${escapeHtml(p.nome)}</span>
        <span class="pro-card-price">${fmt(p.preco)}</span>
        <span class="pro-card-unit">${escapeHtml(p.unidade || 'UN')}</span>
      </button>
    `).join('') || '<div class="empty-state"><p>Nenhum produto encontrado</p></div>'
    el.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        const next = e.target.nextElementSibling
        if (next && next.matches('.prod-card-pro')) next.focus()
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        const prev = e.target.previousElementSibling
        if (prev && prev.matches('.prod-card-pro')) prev.focus()
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (e.target.matches('.prod-card-pro')) e.target.click()
      }
    })
  }

  filtrarCategoria(cat) {
    this.categoriaAtiva = cat
    this.renderCategories()
    this.applyProductFilter()
  }

  applyProductFilter() {
    const q = (document.getElementById('pdv-input')?.value || '').toLowerCase()
    let lista = this.allProdutos
    if (this.categoriaAtiva) lista = lista.filter(p => p.categoria === this.categoriaAtiva)
    if (q) {
      lista = lista.filter(p =>
        String(p.nome || '').toLowerCase().includes(q) ||
        String(p.ean || '').includes(q) ||
        String(p.codigo || '').toLowerCase().includes(q)
      )
    }
    this.renderProducts(lista.slice(0, 120))
  }

  pdvKey(e) {
    const q = e.target.value.trim()
    if (e.key === 'Enter') {
      const found = this.allProdutos.find(p => p.ean === q || p.codigo === q)
      if (found) {
        this.addToCart(found.id)
        e.target.value = ''
        this.applyProductFilter()
        return
      }
      const firstBtn = document.querySelector('#pdv-products .prod-card-pro')
      if (firstBtn) { firstBtn.click(); e.target.value = ''; this.applyProductFilter() }
      return
    }
    if (e.key === 'F2') { this.clearCart(); e.preventDefault(); return }
    if (e.key === 'F8') { document.getElementById('btn-finalizar')?.click(); e.preventDefault(); return }
    if (e.key === 'Escape') { e.target.value = ''; this.applyProductFilter(); e.target.focus(); return }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const first = document.querySelector('#pdv-products .prod-card-pro')
      if (first) first.focus()
    }
  }

  addToCart(id) {
    const prod = this.allProdutos.find(p => p.id === id)
    if (!prod) return
    if ((prod.estoque || 0) <= 0) {
      toast(`${prod.nome} sem estoque`, 'error')
      return
    }
    const existing = this.cart.find(c => c.id === id)
    if (existing) {
      if (existing.qtd >= (prod.estoque || 0)) {
        toast('Estoque insuficiente', 'error')
        return
      }
      existing.qtd += 1
      existing.total = existing.qtd * existing.preco - (existing.descontoItem || 0)
    } else {
      this.cart.push({ id, nome: prod.nome, preco: prod.preco, custo: prod.custo || 0, qtd: 1, total: prod.preco, unidade: prod.unidade || 'UN', descontoItem: 0 })
    }
    this.updateCart()
  }

  removeFromCart(id) {
    this.cart = this.cart.filter(c => c.id !== id)
    this.updateCart()
  }

  changeQty(id, delta) {
    const item = this.cart.find(c => c.id === id)
    if (!item) return
    const prod = this.allProdutos.find(p => p.id === id)
    const novaQtd = item.qtd + delta
    if (novaQtd <= 0) {
      this.removeFromCart(id)
      return
    }
    if (prod && novaQtd > (prod.estoque || 0)) {
      toast(`Estoque insuficiente (${prod.estoque})`, 'error')
      return
    }
    item.qtd = novaQtd
    item.total = item.qtd * item.preco - (item.descontoItem || 0)
    this.updateCart()
  }

  clearCart() {
    if (this.cart.length && !confirm('Limpar cupom atual?')) return
    this.cart = []
    this.payments = []
    this.discount = { tipo: 'pct', valor: 0 }
    this.currentClientePDV = null
    this.comandaAtiva = null
    this.entregaFlag = false
    document.getElementById('btn-comanda')?.classList.remove('active')
    document.getElementById('pdv-cliente-label').textContent = 'Cliente'
    this.updateCart()
  }

  updateCart() {
    const el = document.getElementById('pdv-cart-items')
    if (!this.cart.length) {
      el.innerHTML = '<div class="empty-state"><p>Carrinho vazio</p><p style="font-size:12px;">Selecione os produtos ao lado</p></div>'
    } else {
      el.innerHTML = this.cart.map(c => `
        <div class="cart-item-pro">
          <div class="cart-pro-info">
            <span class="cart-pro-name">${escapeHtml(c.nome)}</span>
            <span class="cart-pro-detail">${c.qtd} x ${fmt(c.preco)} = ${fmt(c.total)}</span>
          </div>
          <div class="cart-pro-qty">
            <button class="qty-btn-pro" onclick="window.pdv.changeQty(${c.id}, -1)">−</button>
            <span class="qty-num-pro">${c.qtd}</span>
            <button class="qty-btn-pro" onclick="window.pdv.changeQty(${c.id}, 1)">+</button>
          </div>
          <button class="cart-pro-rm" onclick="window.pdv.removeFromCart(${c.id})">✕</button>
        </div>
      `).join('')
    }
    const subtotal = this.getSubtotal()
    const desc = this.getDiscountValue()
    const total = this.getTotal()
    const qtdTotal = this.cart.reduce((a, c) => a + c.qtd, 0)
    document.getElementById('cart-count').textContent = qtdTotal
    document.getElementById('tot-subtotal').textContent = fmt(subtotal)
    document.getElementById('tot-desconto').textContent = '- ' + fmt(desc)
    document.getElementById('tot-total').textContent = fmt(total)
    document.getElementById('pdv-cart-grand-total').textContent = fmt(total)
    document.getElementById('btn-total').textContent = fmt(total)
    const autoTotal = document.getElementById('payment-auto-total')
    if (autoTotal) autoTotal.textContent = fmt(total)
    this.applySelectedPayment()
    this.renderPaymentSummary()
  }

  getSubtotal() { return this.cart.reduce((a, c) => a + c.total, 0) }

  getDiscountValue() {
    const subtotal = this.getSubtotal()
    if (this.discount.valor <= 0) return 0
    return this.discount.tipo === 'pct' ? subtotal * (this.discount.valor / 100) : Math.min(this.discount.valor, subtotal)
  }

  getTotal() { return Math.max(0, this.getSubtotal() - this.getDiscountValue()) }
  getPaidTotal() { return this.payments.reduce((sum, p) => sum + p.valor, 0) }
  getChange() { return Math.max(0, this.getPaidTotal() - this.getTotal()) }

  selectPay(method) {
    this.selectedPayment = method
    document.querySelectorAll('.pay-btn-pro').forEach(b => b.classList.toggle('active', b.dataset.method === method))
    const installments = document.getElementById('pay-installments')
    installments.style.display = method === 'credito' ? 'block' : 'none'
    this.applySelectedPayment()
    if (method === 'convenio' || method === 'crediario') {
      openModal('modal-cliente-pdv')
      setTimeout(() => {
        const input = document.getElementById('pdv-cliente-busca')
        if (input) { input.value = ''; input.focus(); this.buscarClientePDV('') }
      }, 100)
    }
    this.renderPaymentSummary()
  }

  applySelectedPayment() {
    const total = this.getTotal()
    if (!this.selectedPayment || total <= 0) { this.payments = []; return }
    const method = PAYMENT_METHODS.find(p => p.id === this.selectedPayment)
    const parcelas = method?.installments ? Math.max(1, Number(document.getElementById('pay-installments')?.value || 1)) : 1
    this.payments = [{ forma: this.selectedPayment, valor: total, parcelas, troco: 0 }]
  }

  addPayment() { this.applySelectedPayment(); this.renderPaymentSummary() }
  removePayment(index) { this.payments.splice(index, 1); this.renderPaymentSummary() }

  renderPaymentSummary() {
    const el = document.getElementById('payment-summary')
    if (!el) return
    const total = this.getTotal()
    const paid = this.getPaidTotal()
    const remaining = Math.max(0, total - paid)
    const change = this.getChange()
    el.innerHTML = `
      <div class="payment-lines">${this.payments.map(p => `
        <div class="payment-line"><span>${labelPayment(p.forma)}${p.parcelas > 1 ? ` ${p.parcelas}x` : ''}</span><strong>${fmt(p.valor)}</strong></div>
      `).join('')}</div>
      <div class="payment-balance ${remaining > 0 ? 'pending' : 'ok'}">
        <span>${remaining > 0 ? 'Restante' : 'Valor total pago'}</span>
        <strong>${remaining > 0 ? fmt(remaining) : fmt(paid)}</strong>
      </div>
      ${change > 0 ? `<div class="payment-change"><span>Troco</span><strong>${fmt(change)}</strong></div>` : ''}
    `
    const method = PAYMENT_METHODS.find(p => p.id === this.selectedPayment)
    const needsCustomer = method?.needsCustomer && !this.currentClientePDV
    const hasValidPayment = this.payments.length > 0 && paid >= total && !needsCustomer
    document.getElementById('btn-finalizar').disabled = this.cart.length === 0 || !this.caixaAtivo || !hasValidPayment
  }

  abrirCaixa() { openModal('modal-abrir-caixa') }

  async confirmarAbertura() {
    const db = window.db.db
    const valor = Number(document.getElementById('abrir-caixa-valor').value || 0)
    await db.caixas.add({
      filialId: 1, numero: '01', saldoInicial: valor, saldoAtual: valor,
      status: 'aberto', operadorId: 1, dataAbertura: new Date().toISOString(),
    })
    this.caixaAtivo = await db.caixas.filter(c => c.status === 'aberto').first()
    document.getElementById('pdv-caixa-status').classList.add('hidden')
    closeModal('modal-abrir-caixa')
    toast('Caixa aberto com sucesso', 'success')
    this.updateCart()
  }

  toggleComanda() {
    this.comandaAtiva = this.comandaAtiva ? null : { numero: Date.now() % 10000, data: new Date().toISOString() }
    document.getElementById('btn-comanda')?.classList.toggle('active', !!this.comandaAtiva)
    toast(this.comandaAtiva ? `Comanda #${this.comandaAtiva.numero} ativada` : 'Comanda desativada', 'info')
  }

  async finalizarVenda() {
    try {
      this.applySelectedPayment()
      const method = PAYMENT_METHODS.find(p => p.id === this.selectedPayment)
      if (method?.needsCustomer && !this.currentClientePDV) {
        toast('Vincule um cliente para esta forma de pagamento', 'error')
        openModal('modal-cliente-pdv')
        return
      }
      if (!this.cart.length || !this.caixaAtivo || this.getPaidTotal() < this.getTotal()) return
      const db = window.db.db
      const total = this.getTotal()
      const troco = this.getChange()
      const discountValue = this.getDiscountValue()
      const venda = {
        caixaId: this.caixaAtivo.id, data: new Date().toISOString(), total,
        subtotal: this.getSubtotal(),
        formaPagamento: this.payments.map(p => p.forma).join(','),
        clienteNome: this.currentClientePDV ? this.currentClientePDV.nome : 'Consumidor Final',
        clienteId: this.currentClientePDV ? this.currentClientePDV.id : null,
        desconto: discountValue, descontoTipo: this.discount.tipo,
        itens: this.cart.length, num: this.numVenda++,
        comanda: this.comandaAtiva ? this.comandaAtiva.numero : null,
        entregar: this.entregaFlag, status: 'concluida',
      }
      const vendaId = await db.vendasPDV.add(venda)
      for (const c of this.cart) {
        await db.itensPDV.add({ vendaPDVId: vendaId, produtoId: c.id, nome: c.nome, qtd: c.qtd, preco: c.preco, total: c.total, desconto: c.descontoItem || 0 })
        const prod = this.allProdutos.find(p => p.id === c.id)
        if (prod) {
          const newStock = Math.max(0, (prod.estoque || 0) - c.qtd)
          await db.produtos.update(c.id, { estoque: newStock })
          prod.estoque = newStock
          await db.movimentacoesEstoque.add({ produtoId: c.id, filialId: 1, tipo: 'saida', qtd: c.qtd, documento: `Venda #${venda.num}`, data: new Date().toISOString(), motivo: 'Venda PDV' })
        }
      }
      for (const [index, p] of this.payments.entries()) {
        await db.pagamentosPDV.add({ vendaPDVId: vendaId, caixaId: this.caixaAtivo.id, forma: p.forma, valor: p.valor, troco: index === this.payments.length - 1 ? troco : 0, parcelas: p.parcelas, nsu: '', data: new Date().toISOString() })
      }
      const entradaCaixa = total
      const saldoAtual = (this.caixaAtivo.saldoAtual || 0) + entradaCaixa
      await db.caixas.update(this.caixaAtivo.id, { saldoAtual })
      this.caixaAtivo.saldoAtual = saldoAtual
      await db.caixa.add({ tipo: 'entrada', descricao: `Venda #${venda.num}`, valor: entradaCaixa, data: new Date().toISOString(), formaPagamento: venda.formaPagamento })
      await db.fluxoCaixa.add({ filialId: 1, data: new Date().toISOString(), tipo: 'entrada', descricao: `Venda PDV #${venda.num}`, valor: entradaCaixa, saldo: saldoAtual, categoria: 'Vendas' })
      await db.configuracoes.put({ chave: 'numVenda', valor: String(this.numVenda) })
      if (this.currentClientePDV) {
        const pts = Math.floor(total)
        await db.clientes.update(this.currentClientePDV.id, {
          pontos: (this.currentClientePDV.pontos || 0) + pts, totalCompras: (this.currentClientePDV.totalCompras || 0) + total, ultimaCompra: new Date().toISOString(),
        })
        await db.historicoClientes.add({ clienteId: this.currentClientePDV.id, tipo: 'compra', descricao: `Venda #${venda.num} - ${fmt(total)}`, data: new Date().toISOString() })
      }
      this.showRecibo(venda, [...this.cart], [...this.payments], troco)
      toast('Venda finalizada', 'success')
      this.resetSale()
      this.allProdutos = await db.produtos.filter(p => p.ativo).toArray()
      this.applyProductFilter()
    } catch (err) {
      toast('Erro ao finalizar: ' + err.message, 'error')
    }
  }

  resetSale() {
    this.cart = []; this.payments = []; this.discount = { tipo: 'pct', valor: 0 }
    this.currentClientePDV = null; this.comandaAtiva = null; this.entregaFlag = false
    document.getElementById('btn-comanda')?.classList.remove('active')
    document.getElementById('pdv-cliente-label').textContent = 'Cliente'
    this.updateCart()
  }

  showRecibo(venda, items, payments, troco) {
    const loja = JSON.parse(localStorage.getItem('loja_config') || '{}')
    const el = document.getElementById('recibo-content')
    el.innerHTML = `
      <div class="receipt">
        <div class="receipt-center receipt-bold">${escapeHtml(loja.nome || 'NEXUS Market AI')}</div>
        <div class="receipt-center">${escapeHtml(loja.endereco || '')}</div>
        <div class="receipt-center">CNPJ: ${escapeHtml(loja.cnpj || '')}</div>
        <div class="receipt-line"></div>
        <div class="receipt-center">CUPOM NAO FISCAL</div>
        <div class="receipt-center">${new Date(venda.data).toLocaleString('pt-BR')} | Venda #${venda.num}</div>
        <div class="receipt-line"></div>
        ${items.map(i => `<div>${escapeHtml(i.nome).substring(0, 28)}</div><div class="receipt-row"><span>${i.qtd} x ${fmt(i.preco)}</span><span>${fmt(i.total)}</span></div>`).join('')}
        <div class="receipt-line"></div>
        <div class="receipt-row"><span>Subtotal</span><span>${fmt(venda.subtotal)}</span></div>
        <div class="receipt-row"><span>Desconto</span><span>${fmt(venda.desconto)}</span></div>
        <div class="receipt-row receipt-bold"><span>TOTAL</span><span>${fmt(venda.total)}</span></div>
        ${payments.map(p => `<div class="receipt-row"><span>${labelPayment(p.forma)}</span><span>${fmt(p.valor)}</span></div>`).join('')}
        ${troco > 0 ? `<div class="receipt-row"><span>Troco</span><span>${fmt(troco)}</span></div>` : ''}
        <div class="receipt-line"></div>
        <div class="receipt-center">Obrigado pela preferencia</div>
      </div>
    `
    openModal('modal-recibo')
  }

  imprimirRecibo() {
    const conteudo = document.getElementById('recibo-content').innerHTML
    const w = window.open('', '_blank')
    w.document.write(`<html><body style="font-family:monospace;font-size:12px;padding:10px;">${conteudo}</body></html>`)
    w.print(); w.close()
  }

  async buscarClientePDV(q) {
    const db = window.db.db
    const termo = String(q || '').toLowerCase().trim()
    const todos = await db.clientes.toArray()
    const lista = termo
      ? todos.filter(c => {
          const nome = String(c.nome || '').toLowerCase()
          const cpf = String(c.cpf || '').replace(/\D/g, '')
          const tel = String(c.telefone || '').replace(/\D/g, '')
          const busca = termo.replace(/\D/g, '')
          if (cpf && busca && cpf.startsWith(busca)) return true
          if (tel && busca && tel.startsWith(busca)) return true
          if (nome.split(/\s+/).some(palavra => palavra.startsWith(termo))) return true
          return false
        })
      : todos
    const el = document.getElementById('pdv-cliente-lista')
    if (!lista.length) {
      el.innerHTML = '<div class="empty-state" style="padding:16px;"><p>Nenhum cliente encontrado</p></div>'
      return
    }
    el.innerHTML = lista.slice(0, 12).map(c => `
      <button class="client-result" onclick="window.pdv.selecionarClientePDV(${c.id})">
        <strong>${escapeHtml(c.nome)}</strong>
        <span>${escapeHtml(c.cpf || '')} ${escapeHtml(c.telefone || '')}</span>
        <span style="font-size:10px;color:var(--green);">Compras: ${fmt(c.totalCompras || 0)}</span>
      </button>
    `).join('')
  }

  async selecionarClientePDV(id) {
    const db = window.db.db
    this.currentClientePDV = await db.clientes.get(id)
    document.getElementById('pdv-cliente-label').textContent = this.currentClientePDV.nome
    closeModal('modal-cliente-pdv')
    toast(`Cliente: ${this.currentClientePDV.nome}`, 'info')
  }

  aplicarDesconto() {
    this.discount.tipo = document.getElementById('desc-tipo').value
    this.discount.valor = Number(document.getElementById('desc-valor').value || 0)
    this.payments = []
    closeModal('modal-desconto')
    this.updateCart()
    toast('Desconto aplicado', 'success')
  }

  async registrarSangria() {
    const db = window.db.db
    const valor = Number(document.getElementById('sangria-valor').value || 0)
    const motivo = document.getElementById('sangria-motivo').value.trim()
    if (valor <= 0 || !motivo) return toast('Preencha valor e motivo', 'error')
    if (!this.caixaAtivo) return toast('Caixa nao esta aberto', 'error')
    await db.sangrias.add({ caixaId: this.caixaAtivo.id, data: new Date().toISOString(), valor, motivo, operadorId: 1 })
    const saldoAtual = (this.caixaAtivo.saldoAtual || 0) - valor
    await db.caixas.update(this.caixaAtivo.id, { saldoAtual })
    this.caixaAtivo.saldoAtual = saldoAtual
    await db.caixa.add({ tipo: 'saida', descricao: `Sangria: ${motivo}`, valor, data: new Date().toISOString(), formaPagamento: 'dinheiro' })
    closeModal('modal-sangria')
    toast(`Sangria de ${fmt(valor)} registrada`, 'success')
  }

  async registrarSuprimento() {
    const db = window.db.db
    const valor = Number(document.getElementById('suprimento-valor').value || 0)
    const motivo = document.getElementById('suprimento-motivo').value.trim()
    if (valor <= 0 || !motivo) return toast('Preencha valor e motivo', 'error')
    if (!this.caixaAtivo) return toast('Caixa nao esta aberto', 'error')
    await db.suprimentos.add({ caixaId: this.caixaAtivo.id, data: new Date().toISOString(), valor, motivo, operadorId: 1 })
    const saldoAtual = (this.caixaAtivo.saldoAtual || 0) + valor
    await db.caixas.update(this.caixaAtivo.id, { saldoAtual })
    this.caixaAtivo.saldoAtual = saldoAtual
    await db.caixa.add({ tipo: 'entrada', descricao: `Suprimento: ${motivo}`, valor, data: new Date().toISOString(), formaPagamento: 'dinheiro' })
    closeModal('modal-suprimento')
    toast(`Suprimento de ${fmt(valor)} registrado`, 'success')
  }

  renderModalDesconto() {
    if (document.getElementById('modal-desconto')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'; div.id = 'modal-desconto'
    div.innerHTML = `<div class="modal"><h2>Aplicar desconto</h2><div class="form-grid"><div class="form-group"><label>Tipo</label><select id="desc-tipo"><option value="pct">Percentual (%)</option><option value="val">Valor (R$)</option></select></div><div class="form-group"><label>Valor</label><input type="number" id="desc-valor" value="0" min="0" step="0.01"/></div></div><div class="modal-footer"><button class="btn btn-secondary" onclick="window.closeModal('modal-desconto')">Cancelar</button><button class="btn btn-primary" onclick="window.pdv.aplicarDesconto()">Aplicar</button></div></div>`
    document.body.appendChild(div)
  }

  renderModalClientePDV() {
    if (document.getElementById('modal-cliente-pdv')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'; div.id = 'modal-cliente-pdv'
    div.innerHTML = `<div class="modal" style="min-width:480px;"><h2>Vincular cliente</h2><p style="font-size:12px;color:var(--text3);margin-bottom:12px;">Digite para buscar por nome, CPF ou telefone</p><div class="form-group"><input type="text" id="pdv-cliente-busca" placeholder="Digite nome, CPF ou telefone..." autocomplete="off"/></div><div id="pdv-cliente-lista"></div><div class="modal-footer"><button class="btn btn-secondary" onclick="window.closeModal('modal-cliente-pdv')">Cancelar</button></div></div>`
    document.body.appendChild(div)
    setTimeout(() => {
      const input = document.getElementById('pdv-cliente-busca')
      if (input) {
        input.addEventListener('input', e => this.buscarClientePDV(e.target.value))
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter') {
            const first = document.querySelector('.client-result')
            if (first) first.click()
          }
        })
      }
    }, 0)
  }

  renderModalRecibo() {
    if (document.getElementById('modal-recibo')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'; div.id = 'modal-recibo'; div.style.zIndex = '2000'
    div.innerHTML = `<div class="modal" style="min-width:350px;"><h2>Recibo</h2><div id="recibo-content"></div><div class="modal-footer"><button class="btn btn-secondary" onclick="window.closeModal('modal-recibo')">Fechar</button><button class="btn btn-primary" onclick="window.pdv.imprimirRecibo()">Imprimir</button></div></div>`
    document.body.appendChild(div)
  }

  renderModalSangria() {
    if (document.getElementById('modal-sangria')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'; div.id = 'modal-sangria'
    div.innerHTML = `<div class="modal"><h2>Sangria</h2><div class="form-grid"><div class="form-group"><label>Valor (R$)</label><input type="number" id="sangria-valor" step="0.01"/></div><div class="form-group"><label>Motivo</label><input id="sangria-motivo" placeholder="Motivo"/></div></div><div class="modal-footer"><button class="btn btn-secondary" onclick="window.closeModal('modal-sangria')">Cancelar</button><button class="btn btn-danger" onclick="window.pdv.registrarSangria()">Confirmar</button></div></div>`
    document.body.appendChild(div)
  }

  renderModalSuprimento() {
    if (document.getElementById('modal-suprimento')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'; div.id = 'modal-suprimento'
    div.innerHTML = `<div class="modal"><h2>Suprimento</h2><div class="form-grid"><div class="form-group"><label>Valor (R$)</label><input type="number" id="suprimento-valor" step="0.01"/></div><div class="form-group"><label>Motivo</label><input id="suprimento-motivo" placeholder="Origem"/></div></div><div class="modal-footer"><button class="btn btn-secondary" onclick="window.closeModal('modal-suprimento')">Cancelar</button><button class="btn btn-primary" onclick="window.pdv.registrarSuprimento()">Confirmar</button></div></div>`
    document.body.appendChild(div)
  }

  renderModalAbrirCaixa() {
    if (document.getElementById('modal-abrir-caixa')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'; div.id = 'modal-abrir-caixa'
    div.innerHTML = `<div class="modal"><h2>Abertura de caixa</h2><div class="form-grid"><div class="form-group"><label>Caixa</label><input type="text" value="01" disabled/></div><div class="form-group"><label>Valor inicial</label><input type="number" id="abrir-caixa-valor" value="200" step="0.01"/></div></div><div class="modal-footer"><button class="btn btn-secondary" onclick="window.closeModal('modal-abrir-caixa')">Cancelar</button><button class="btn btn-primary" onclick="window.pdv.confirmarAbertura()">Abrir</button></div></div>`
    document.body.appendChild(div)
  }
}
