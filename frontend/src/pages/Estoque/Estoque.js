import { esc, fmt, fmtNum, toast, openModal, closeModal } from '../../utils/format.js'

export class Estoque {
  async render() {
    const el = document.getElementById('page-estoque')
    el.innerHTML = `
      <div class="section-header">
        <h2>🏭 Controle de Estoque Avançado</h2>
        <div class="gap-8">
          <button class="btn btn-primary" onclick="window.estoque.abrirMov()">+ Nova Movimentação</button>
          <button class="btn btn-secondary" onclick="window.estoque.gerarRelatorio()">📊 Relatório</button>
        </div>
      </div>
      <div class="kpi-grid" id="estoque-kpis"></div>
      <div class="tabs">
        <span class="tab active" data-tab="geral">📦 Geral</span>
        <span class="tab" data-tab="lotes">🏷️ Lotes</span>
        <span class="tab" data-tab="mov">📋 Movimentações</span>
        <span class="tab" data-tab="perdas">🗑️ Perdas</span>
        <span class="tab" data-tab="curva">📈 Curva ABC</span>
      </div>
      <div id="estoque-content"><div class="empty-state"><div class="icon">📦</div><p>Carregando...</p></div></div>
    `
    window.estoque = this
    this.renderModalMov()
    this.bindTabs()
    await this.loadGeral()
  }

  bindTabs() {
    document.querySelectorAll('.tab[data-tab]').forEach(tab => {
      tab.addEventListener('click', async () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'))
        tab.classList.add('active')
        const aba = tab.dataset.tab
        if (aba === 'geral') await this.loadGeral()
        else if (aba === 'lotes') await this.loadLotes()
        else if (aba === 'mov') await this.loadMov()
        else if (aba === 'perdas') await this.loadPerdas()
        else if (aba === 'curva') await this.loadCurvaABC()
      })
    })
  }

  async loadGeral() {
    const db = window.db.db
    const produtos = await db.produtos.filter(p => p.ativo).toArray()
    const totalValue = produtos.reduce((a,p) => a + ((p.estoque||0) * (p.custo||0)), 0)
    const baixo = produtos.filter(p => p.estoque <= (p.estMin||5))
    const zerados = produtos.filter(p => !p.estoque || p.estoque <= 0)
    const custoTotal = produtos.reduce((a,p) => a + ((p.estoque||0) * (p.custo||0)), 0)
    const precoTotal = produtos.reduce((a,p) => a + ((p.estoque||0) * (p.preco||0)), 0)
    const margem = precoTotal ? ((precoTotal - custoTotal) / precoTotal * 100).toFixed(1) : 0
    const maxEst = Math.max(...produtos.map(p => p.estMax||p.estoque||1), 1)

    document.getElementById('estoque-kpis').innerHTML = `
      <div class="kpi green"><div class="kpi-label">💰 Valor Estoque (custo)</div><div class="kpi-value">${fmt(totalValue)}</div><div class="kpi-sub">${produtos.length} SKUs ativos</div></div>
      <div class="kpi blue"><div class="kpi-label">📈 Margem Média</div><div class="kpi-value">${margem}%</div><div class="kpi-sub">preço vs custo</div></div>
      <div class="kpi yellow"><div class="kpi-label">⚠️ Estoque Baixo</div><div class="kpi-value">${baixo.length}</div><div class="kpi-sub">itens abaixo do mínimo</div></div>
      <div class="kpi red"><div class="kpi-label">🚫 Estoque Zero</div><div class="kpi-value">${zerados.length}</div><div class="kpi-sub">itens sem estoque</div></div>
    `

    const wrap = document.getElementById('estoque-content')
    wrap.innerHTML = `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Produto</th><th>Local</th><th>Estoque</th><th>Mín</th><th>Máx</th><th class="text-mono">Custo</th><th>Valor Est.</th><th>%</th><th>Ações</th></tr></thead>
          <tbody>${produtos.map(p => {
            const pct = Math.min(100, ((p.estoque||0) / (p.estMax||maxEst)) * 100)
            const cor = pct < 25 ? 'red' : pct < 60 ? 'yellow' : 'green'
            return `<tr>
              <td><strong>${p.emoji||'📦'} ${esc(p.nome)}</strong><div style="font-size:10px;color:var(--text3);">${esc(p.ean||'—')}</div></td>
              <td>${esc(p.localizacao||'—')}</td>
              <td class="text-mono"><strong>${fmtNum(p.estoque||0)}</strong> ${p.unidade||'UN'}</td>
              <td class="text-mono">${fmtNum(p.estMin||5)}</td>
              <td class="text-mono">${fmtNum(p.estMax||'—')}</td>
              <td class="text-mono">${fmt(p.custo||0)}</td>
              <td class="text-mono">${fmt((p.estoque||0)*(p.custo||0))}</td>
              <td style="min-width:100px;">
                <div class="progress-bar"><div class="progress-fill ${cor}" style="width:${pct}%"></div></div>
                <span style="font-size:10px;color:var(--text3);">${pct.toFixed(0)}%</span>
              </td>
              <td><button class="btn btn-sm btn-secondary" onclick="window.estoque.abrirMovPara(${p.id})">📦 Mov.</button></td>
            </tr>`
          }).join('')}</tbody>
        </table>
      </div>
    `
  }

  async loadLotes() {
    const db = window.db.db
    const lotes = await db.lotes.toArray()
    const prodMap = {}
    const prods = await db.produtos.toArray()
    prods.forEach(p => prodMap[p.id] = p)

    lotes.sort((a,b) => new Date(a.vencimento) - new Date(b.vencimento))

    const hoje = new Date()
    const em30 = new Date(); em30.setDate(em30.getDate() + 30)
    const vencendo = lotes.filter(l => new Date(l.vencimento) <= em30 && new Date(l.vencimento) >= hoje).length
    const vencidos = lotes.filter(l => new Date(l.vencimento) < hoje).length

    const wrap = document.getElementById('estoque-content')
    wrap.innerHTML = `
      <div style="display:flex;gap:12px;margin-bottom:12px;">
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;flex:1;"><span style="font-size:11px;color:var(--text3);">Total Lotes</span><div style="font-size:20px;font-weight:700;">${lotes.length}</div></div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;flex:1;"><span style="font-size:11px;color:var(--text3);">Vencendo (30d)</span><div style="font-size:20px;font-weight:700;color:var(--yellow);">${vencendo}</div></div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;flex:1;"><span style="font-size:11px;color:var(--text3);">Vencidos</span><div style="font-size:20px;font-weight:700;color:var(--red);">${vencidos}</div></div>
      </div>
      ${lotes.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Produto</th><th>Lote</th><th>Fabricacão</th><th>Vencimento</th><th>Qtd</th><th>Status</th><th></th></tr></thead>
          <tbody>${lotes.map(l => {
            const prod = prodMap[l.produtoId]
            const ven = new Date(l.vencimento)
            const diff = Math.ceil((ven - hoje) / (1000*60*60*24))
            const status = diff < 0 ? 'vencido' : diff <= 7 ? 'critico' : diff <= 30 ? 'alerta' : 'ok'
            return `<tr>
              <td><strong>${esc(prod?.nome||'—')}</strong></td>
              <td class="text-mono">${esc(l.lote||'—')}</td>
              <td class="text-mono">${l.fabricacao ? new Date(l.fabricacao).toLocaleDateString('pt-BR') : '—'}</td>
              <td class="text-mono ${status==='vencido'?'text-red':status==='critico'?'text-red':status==='alerta'?'text-yellow':''}">${ven.toLocaleDateString('pt-BR')}</td>
              <td class="text-mono">${fmtNum(l.qtd||0)}</td>
              <td><span class="badge ${status==='vencido'?'red':status==='critico'?'red':status==='alerta'?'yellow':'green'}">${status==='vencido'?'Vencido':status==='critico'?'Crítico':status==='alerta'?'Alerta':'OK'}</span></td>
              <td><button class="btn btn-sm btn-danger" onclick="window.estoque.registrarPerdaLote(${l.id})">🗑️</button></td>
            </tr>`
          }).join('')}</tbody>
        </table>
      </div>
      ` : '<div class="empty-state"><div class="icon">🏷️</div><p>Nenhum lote cadastrado</p></div>'}
    `
  }

  async loadMov() {
    const db = window.db.db
    const movs = await db.movimentacoesEstoque.toArray()
    movs.sort((a,b) => new Date(b.data) - new Date(a.data))
    const prodMap = {}
    const prods = await db.produtos.toArray()
    prods.forEach(p => prodMap[p.id] = p)
    const wrap = document.getElementById('estoque-content')
    wrap.innerHTML = movs.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Data</th><th>Produto</th><th>Tipo</th><th>Qtd</th><th>Documento</th><th>Responsável</th><th>Motivo</th></tr></thead>
          <tbody>${movs.map(m => {
            const prod = prodMap[m.produtoId]
            return `<tr>
              <td class="text-mono">${new Date(m.data).toLocaleDateString('pt-BR')}</td>
              <td><strong>${esc(prod?.nome||'—')}</strong></td>
              <td><span class="badge ${m.tipo==='entrada'?'green':'red'}">${m.tipo==='entrada'?'Entrada':'Saída'}</span></td>
              <td class="text-mono">${fmtNum(m.qtd||0)}</td>
              <td class="text-mono">${esc(m.documento||'—')}</td>
              <td>${esc(m.responsavel||'—')}</td>
              <td style="font-size:11px;color:var(--text3);">${esc(m.motivo||'—')}</td>
            </tr>`
          }).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><div class="icon">📋</div><p>Nenhuma movimentação registrada</p></div>'
  }

  async loadPerdas() {
    const db = window.db.db
    const perdas = await db.perdas.toArray()
    perdas.sort((a,b) => new Date(b.data) - new Date(a.data))
    const prodMap = {}
    const prods = await db.produtos.toArray()
    prods.forEach(p => prodMap[p.id] = p)
    const totalPerdas = perdas.reduce((a,p) => a + (p.valor||0), 0)
    const wrap = document.getElementById('estoque-content')
    wrap.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div><strong>Total em Perdas:</strong> <span class="text-red text-mono">${fmt(totalPerdas)}</span> (${perdas.length} registros)</div>
        <button class="btn btn-primary btn-sm" onclick="window.estoque.registrarPerda()">+ Registrar Perda</button>
      </div>
      ${perdas.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Data</th><th>Produto</th><th>Qtd</th><th>Valor</th><th>Motivo</th><th>Responsável</th></tr></thead>
          <tbody>${perdas.map(p => {
            const prod = prodMap[p.produtoId]
            return `<tr>
              <td class="text-mono">${new Date(p.data).toLocaleDateString('pt-BR')}</td>
              <td><strong>${esc(prod?.nome||'—')}</strong></td>
              <td class="text-mono">${fmtNum(p.qtd||0)}</td>
              <td class="text-mono text-red">${fmt(p.valor||0)}</td>
              <td style="font-size:11px;">${esc(p.motivo||'—')}</td>
              <td>${esc(p.responsavel||'—')}</td>
            </tr>`
          }).join('')}</tbody>
        </table>
      </div>
      ` : '<div class="empty-state"><div class="icon">🗑️</div><p>Nenhuma perda registrada</p></div>'}
    `
  }

  async loadCurvaABC() {
    const db = window.db.db
    const itens = await db.itensPDV.toArray()
    const prodMap = {}
    const prods = await db.produtos.toArray()
    prods.forEach(p => prodMap[p.id] = p)

    const vendas = {}
    for (const it of itens) {
      if (!vendas[it.produtoId]) vendas[it.produtoId] = { qtd: 0, valor: 0 }
      vendas[it.produtoId].qtd += it.qtd || 0
      vendas[it.produtoId].valor += it.total || 0
    }

    const ranked = Object.entries(vendas).sort((a,b) => b[1].valor - a[1].valor)
    const totalValor = ranked.reduce((a, [_, v]) => a + v.valor, 0)
    let acum = 0
    const classified = ranked.map(([id, v]) => {
      acum += v.valor
      const pct = (v.valor / totalValor) * 100
      const pctAcum = (acum / totalValor) * 100
      let classe = 'C'
      if (pctAcum <= 80) classe = 'A'
      else if (pctAcum <= 95) classe = 'B'
      return { id: parseInt(id), ...v, pct, pctAcum, classe, nome: prodMap[parseInt(id)]?.nome||'—' }
    })

    const wrap = document.getElementById('estoque-content')
    if (!classified.length) {
      wrap.innerHTML = '<div class="empty-state"><div class="icon">📈</div><p>Sem dados de venda para classificar</p></div>'
      return
    }
    wrap.innerHTML = `
      <div style="display:flex;gap:12px;margin-bottom:12px;">
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;flex:1;border-left:4px solid var(--green);">
          <div style="font-size:11px;color:var(--text3);">Classe A (80%)</div>
          <div style="font-size:20px;font-weight:700;color:var(--green);">${classified.filter(c=>c.classe==='A').length}</div>
          <div style="font-size:10px;color:var(--text3);">${fmt(classified.filter(c=>c.classe==='A').reduce((a,c)=>a+c.valor,0))}</div>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;flex:1;border-left:4px solid var(--yellow);">
          <div style="font-size:11px;color:var(--text3);">Classe B (15%)</div>
          <div style="font-size:20px;font-weight:700;color:var(--yellow);">${classified.filter(c=>c.classe==='B').length}</div>
          <div style="font-size:10px;color:var(--text3);">${fmt(classified.filter(c=>c.classe==='B').reduce((a,c)=>a+c.valor,0))}</div>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;flex:1;border-left:4px solid var(--red);">
          <div style="font-size:11px;color:var(--text3);">Classe C (5%)</div>
          <div style="font-size:20px;font-weight:700;color:var(--red);">${classified.filter(c=>c.classe==='C').length}</div>
          <div style="font-size:10px;color:var(--text3);">${fmt(classified.filter(c=>c.classe==='C').reduce((a,c)=>a+c.valor,0))}</div>
        </div>
      </div>
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Classe</th><th>Produto</th><th>Qtd Vendida</th><th>Valor</th><th>%</th><th>% Acum</th></tr></thead>
          <tbody>${classified.map(c => `
            <tr>
              <td><span class="badge ${c.classe==='A'?'green':c.classe==='B'?'yellow':'red'}">${c.classe}</span></td>
              <td><strong>${esc(c.nome)}</strong></td>
              <td class="text-mono">${fmtNum(c.qtd)}</td>
              <td class="text-mono">${fmt(c.valor)}</td>
              <td class="text-mono">${c.pct.toFixed(1)}%</td>
              <td class="text-mono">${c.pctAcum.toFixed(1)}%</td>
            </tr>
          `).join('')}</tbody>
        </table>
      </div>
    `
  }

  abrirMov() {
    this.preencherSelects()
    document.getElementById('mov-tipo').value = 'entrada'
    document.getElementById('mov-qtd').value = ''
    document.getElementById('mov-doc').value = ''
    document.getElementById('mov-motivo').value = ''
    document.getElementById('mov-modal-title').textContent = '📦 Nova Movimentação'
    openModal('modal-mov-estoque')
  }

  abrirMovPara(produtoId) {
    this.preencherSelects(produtoId)
    document.getElementById('mov-tipo').value = 'saida'
    document.getElementById('mov-qtd').value = ''
    document.getElementById('mov-doc').value = ''
    document.getElementById('mov-motivo').value = ''
    document.getElementById('mov-modal-title').textContent = '📦 Movimentação'
    openModal('modal-mov-estoque')
  }

  async preencherSelects(selectedId) {
    const db = window.db.db
    const prods = await db.produtos.toArray()
    const sel = document.getElementById('mov-produto')
    sel.innerHTML = '<option value="">Selecione...</option>'
    prods.forEach(p => {
      const o = document.createElement('option')
      o.value = p.id; o.textContent = `${p.nome} (${p.estoque||0} ${p.unidade||'UN'})`
      if (p.id === selectedId) o.selected = true
      sel.appendChild(o)
    })
  }

  async salvarMov() {
    const db = window.db.db
    const produtoId = parseInt(document.getElementById('mov-produto').value)
    const tipo = document.getElementById('mov-tipo').value
    const qtd = parseInt(document.getElementById('mov-qtd').value) || 0
    const doc = document.getElementById('mov-doc').value.trim()
    const motivo = document.getElementById('mov-motivo').value.trim()
    if (!produtoId || qtd <= 0) { toast('⚠️ Preencha todos os campos', 'error'); return }
    const prod = await db.produtos.get(produtoId)
    const estoqueAtual = prod.estoque || 0
    if (tipo === 'saida' && qtd > estoqueAtual) { toast(`⚠️ Estoque insuficiente (${estoqueAtual})`, 'error'); return }
    const novoEstoque = tipo === 'entrada' ? estoqueAtual + qtd : estoqueAtual - qtd
    await db.produtos.update(produtoId, { estoque: novoEstoque })
    await db.movimentacoesEstoque.add({
      produtoId, filialId: 1, tipo, qtd, documento: doc || 'Manual',
      data: new Date().toISOString(), responsavel: 'Operador', motivo
    })
    toast(`✅ ${tipo==='entrada'?'Entrada':'Saída'} de ${qtd} ${prod.unidade||'UN'} registrada`, 'success')
    closeModal('modal-mov-estoque')
    this.loadGeral()
  }

  async registrarPerda() {
    const db = window.db.db
    const prods = await db.produtos.toArray()
    const sel = document.getElementById('perda-produto')
    sel.innerHTML = '<option value="">Selecione...</option>'
    prods.forEach(p => {
      const o = document.createElement('option')
      o.value = p.id; o.textContent = `${p.nome} (${p.estoque||0})`
      sel.appendChild(o)
    })
    openModal('modal-perda')
  }

  async confirmarPerda() {
    const db = window.db.db
    const produtoId = parseInt(document.getElementById('perda-produto').value)
    const qtd = parseInt(document.getElementById('perda-qtd').value) || 0
    const motivo = document.getElementById('perda-motivo').value.trim()
    if (!produtoId || qtd <= 0 || !motivo) { toast('⚠️ Preencha todos os campos', 'error'); return }
    const prod = await db.produtos.get(produtoId)
    if (qtd > (prod.estoque||0)) { toast('⚠️ Estoque insuficiente', 'error'); return }
    const valor = qtd * (prod.custo||0)
    await db.perdas.add({ produtoId, data: new Date().toISOString(), qtd, valor, motivo, responsavel: 'Operador' })
    await db.produtos.update(produtoId, { estoque: Math.max(0, (prod.estoque||0) - qtd) })
    await db.movimentacoesEstoque.add({
      produtoId, filialId: 1, tipo: 'saida', qtd, documento: 'Perda',
      data: new Date().toISOString(), responsavel: 'Operador', motivo: `Perda: ${motivo}`
    })
    toast(`🗑️ Perda de ${qtd} ${prod.unidade||'UN'} registrada (${fmt(valor)})`, 'success')
    closeModal('modal-perda')
    document.getElementById('perda-qtd').value = ''
    document.getElementById('perda-motivo').value = ''
    this.loadPerdas()
  }

  async registrarPerdaLote(loteId) {
    const db = window.db.db
    const lote = await db.lotes.get(loteId)
    if (!lote) return
    const prod = await db.produtos.get(lote.produtoId)
    if (!confirm(`Descartar lote ${lote.lote} de ${prod?.nome} (${lote.qtd} ${prod?.unidade||'UN'})?`)) return
    const valor = lote.qtd * (prod?.custo||0)
    await db.perdas.add({ produtoId: lote.produtoId, loteId, data: new Date().toISOString(), qtd: lote.qtd, valor, motivo: 'Vencimento', responsavel: 'Sistema' })
    await db.produtos.update(lote.produtoId, { estoque: Math.max(0, (prod.estoque||0) - lote.qtd) })
    await db.lotes.delete(loteId)
    toast(`🗑️ Lote ${lote.lote} descartado`, 'success')
    this.loadLotes()
  }

  async gerarRelatorio() {
    const db = window.db.db
    const produtos = await db.produtos.filter(p => p.ativo).toArray()
    const baixo = produtos.filter(p => p.estoque <= (p.estMin||5))
    const msg = [
      `📊 RELATÓRIO DE ESTOQUE`,
      `Total de SKUs: ${produtos.length}`,
      `Valor total (custo): ${fmt(produtos.reduce((a,p)=>a+((p.estoque||0)*(p.custo||0)),0))}`,
      `Estoque baixo: ${baixo.length} itens`,
      `Estoque zero: ${produtos.filter(p=>!p.estoque).length} itens`,
      `\n${baixo.slice(0,5).map(p=>`⚠️ ${p.nome}: ${p.estoque} ${p.unidade||'UN'}`).join('\n')}`,
    ].join('\n')
    toast(msg, 'info', 8000)
  }

  renderModalMov() {
    if (document.getElementById('modal-mov-estoque')) return
    const div = document.createElement('div'); div.className = 'modal-overlay hidden'; div.id = 'modal-mov-estoque'
    div.innerHTML = `
      <div class="modal">
        <h2 id="mov-modal-title">📦 Nova Movimentação</h2>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Produto</label><select id="mov-produto"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>Tipo</label><select id="mov-tipo"><option value="entrada">Entrada</option><option value="saida">Saída</option></select></div>
          <div class="form-group"><label>Quantidade</label><input type="number" id="mov-qtd" min="0"/></div>
          <div class="form-group"><label>Documento</label><input type="text" id="mov-doc" placeholder="NF/Nota"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Motivo</label><input type="text" id="mov-motivo" placeholder="Ex: Ajuste manual"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-mov-estoque')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.estoque.salvarMov()">💾 Salvar</button>
        </div>
      </div>`
    document.body.appendChild(div)

    const div2 = document.createElement('div'); div2.className = 'modal-overlay hidden'; div2.id = 'modal-perda'
    div2.innerHTML = `
      <div class="modal">
        <h2>🗑️ Registrar Perda</h2>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Produto</label><select id="perda-produto"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>Quantidade</label><input type="number" id="perda-qtd" min="0"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Motivo</label>
            <select id="perda-motivo">
              <option value="">Selecione...</option>
              <option value="Vencimento">Vencimento</option>
              <option value="Avaria">Avaria</option>
              <option value="Roubo">Roubo/Furto</option>
              <option value="Quebra">Quebra operacional</option>
              <option value="Devolucao">Devolução cliente</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-perda')">Cancelar</button>
          <button class="btn btn-danger" onclick="window.estoque.confirmarPerda()">🗑️ Confirmar Perda</button>
        </div>
      </div>`
    document.body.appendChild(div2)
  }
}
