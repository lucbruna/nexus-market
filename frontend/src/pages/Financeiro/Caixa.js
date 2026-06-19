import { esc, fmt, fmtNum, toast, openModal, closeModal } from '../../utils/format.js'

export class Caixa {
  async render() {
    const el = document.getElementById('page-caixa')
    el.innerHTML = `
      <div class="section-header">
        <h2>💰 Caixa Geral</h2>
        <div class="gap-8">
          <button class="btn btn-primary" onclick="window.caixa.abrirEntrada()">+ Entrada</button>
          <button class="btn btn-danger" onclick="window.caixa.abrirSaida()">− Saída</button>
        </div>
      </div>
      <div class="kpi-grid" id="caixa-kpis"></div>
      <div class="card">
        <div class="card-title">📋 Movimentações</div>
        <div id="caixa-table-wrap"><div class="empty-state"><div class="icon">💰</div><p>Carregando...</p></div></div>
      </div>
    `

    window.caixa = this
    this.renderModalMov()
    await this.loadData()
  }

  async loadData() {
    const db = window.db.db
    const movs = await db.caixa.toArray()
    movs.sort((a,b) => new Date(b.data) - new Date(a.data))

    const entradas = movs.filter(m => m.tipo === 'entrada').reduce((a,m) => a + (m.valor||0), 0)
    const saidas = movs.filter(m => m.tipo === 'saida').reduce((a,m) => a + (m.valor||0), 0)
    const saldo = entradas - saidas

    document.getElementById('caixa-kpis').innerHTML = `
      <div class="kpi green"><div class="kpi-label">💰 Saldo Atual</div><div class="kpi-value">${fmt(saldo)}</div><div class="kpi-sub">caixa geral</div></div>
      <div class="kpi blue"><div class="kpi-label">📈 Total Entradas</div><div class="kpi-value">${fmt(entradas)}</div><div class="kpi-sub">${movs.filter(m=>m.tipo==='entrada').length} mov.</div></div>
      <div class="kpi red"><div class="kpi-label">📉 Total Saídas</div><div class="kpi-value">${fmt(saidas)}</div><div class="kpi-sub">${movs.filter(m=>m.tipo==='saida').length} mov.</div></div>
    `

    const wrap = document.getElementById('caixa-table-wrap')
    wrap.innerHTML = movs.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Data</th><th>Tipo</th><th>Descrição</th><th>Forma Pag.</th><th>Valor</th></tr></thead>
          <tbody>${movs.map(m => `
            <tr>
              <td class="text-mono">${new Date(m.data).toLocaleString('pt-BR')}</td>
              <td><span class="badge ${m.tipo==='entrada'?'green':'red'}">${m.tipo==='entrada'?'Entrada':'Saída'}</span></td>
              <td>${esc(m.descricao||'—')}</td>
              <td>${esc(m.formaPagamento||'—')}</td>
              <td class="text-mono ${m.tipo==='entrada'?'text-green':'text-red'}">${m.tipo==='entrada'?'+':'-'} ${fmt(m.valor||0)}</td>
            </tr>
          `).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><div class="icon">💰</div><p>Nenhuma movimentação</p></div>'
  }

  abrirEntrada() {
    document.getElementById('modal-mov-title').textContent = '+ Registrar Entrada'
    document.getElementById('mov-tipo').value = 'entrada'
    this.openMovForm()
  }

  abrirSaida() {
    document.getElementById('modal-mov-title').textContent = '− Registrar Saída'
    document.getElementById('mov-tipo').value = 'saida'
    this.openMovForm()
  }

  openMovForm() {
    document.getElementById('mov-descricao').value = ''
    document.getElementById('mov-valor').value = ''
    document.getElementById('mov-forma').value = 'dinheiro'
    openModal('modal-mov')
  }

  async salvar() {
    const db = window.db.db
    const data = {
      tipo: document.getElementById('mov-tipo').value,
      descricao: document.getElementById('mov-descricao').value.trim() || 'Movimentação',
      valor: parseFloat(document.getElementById('mov-valor').value)||0,
      formaPagamento: document.getElementById('mov-forma').value,
      data: new Date().toISOString(),
    }
    if (data.valor <= 0) { toast('⚠️ Informe um valor positivo', 'error'); return }
    await db.caixa.add(data)
    toast(`✅ ${data.tipo==='entrada'?'Entrada':'Saída'} registrada`, 'success')
    closeModal('modal-mov')
    this.loadData()
  }

  renderModalMov() {
    if (document.getElementById('modal-mov')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'
    div.id = 'modal-mov'
    div.innerHTML = `
      <div class="modal">
        <h2 id="modal-mov-title">💰 Movimentação</h2>
        <input type="hidden" id="mov-tipo"/>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Descrição</label><input type="text" id="mov-descricao" placeholder="Descrição da movimentação"/></div>
          <div class="form-group"><label>Valor (R$)</label><input type="number" id="mov-valor" step="0.01" min="0"/></div>
          <div class="form-group"><label>Forma Pagamento</label><select id="mov-forma"><option value="dinheiro">Dinheiro</option><option value="credito">Crédito</option><option value="debito">Débito</option><option value="pix">PIX</option></select></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-mov')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.caixa.salvar()">💾 Salvar</button>
        </div>
      </div>
    `
    document.body.appendChild(div)
  }
}
