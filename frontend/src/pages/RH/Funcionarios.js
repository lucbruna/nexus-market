import { esc, fmt, fmtNum, toast, openModal, closeModal } from '../../utils/format.js'

export class Funcionarios {
  constructor() {
    this.editandoId = null
  }

  async render() {
    const el = document.getElementById('page-funcionarios')
    el.innerHTML = `
      <div class="section-header">
        <h2>👔 Gestão de Funcionários</h2>
        <div class="gap-8">
          <input type="text" id="func-search" class="search-bar" placeholder="🔍 Buscar funcionário..." autocomplete="off"/>
          <button class="btn btn-primary" onclick="window.funcionarios.abrirForm()">+ Novo Funcionário</button>
          <button class="btn btn-secondary" onclick="window.funcionarios.gerarRelatorio()">📊 RH</button>
        </div>
      </div>
      <div class="kpi-grid" id="func-kpis"></div>
      <div class="tabs">
        <span class="tab active" data-func-tab="lista">👔 Funcionários</span>
        <span class="tab" data-func-tab="contratos">📋 Contratos</span>
        <span class="tab" data-func-tab="ferias">🏖️ Férias</span>
      </div>
      <div id="func-content"><div class="empty-state"><div class="icon">👔</div><p>Carregando...</p></div></div>
    `

    window.funcionarios = this
    this.renderModalForm()
    this.renderModalFerias()
    await this.loadLista()
    document.getElementById('func-search').addEventListener('input', () => this.loadLista())
    document.querySelectorAll('.tab[data-func-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab[data-func-tab]').forEach(t => t.classList.remove('active'))
        tab.classList.add('active')
        if (tab.dataset.funcTab === 'lista') this.loadLista()
        else if (tab.dataset.funcTab === 'contratos') this.loadContratos()
        else if (tab.dataset.funcTab === 'ferias') this.loadFerias()
      })
    })
  }

  async loadLista() {
    const db = window.db.db
    const q = (document.getElementById('func-search')?.value || '').toLowerCase()
    let lista = await db.funcionarios.toArray()
    if (q) lista = lista.filter(f => f.nome.toLowerCase().includes(q) || (f.cpf && f.cpf.includes(q)) || (f.cargo && f.cargo.toLowerCase().includes(q)))

    const contratos = await db.contratosRH.toArray()
    const ativos = contratos.filter(c => c.status === 'ativo').length

    document.getElementById('func-kpis').innerHTML = `
      <div class="kpi blue"><div class="kpi-label">👔 Total Funcionários</div><div class="kpi-value">${lista.length}</div><div class="kpi-sub">cadastrados</div></div>
      <div class="kpi green"><div class="kpi-label">✅ Contratos Ativos</div><div class="kpi-value">${ativos}</div><div class="kpi-sub">/${lista.length} funcionários</div></div>
      <div class="kpi yellow"><div class="kpi-label">💰 Folha Total</div><div class="kpi-value">${fmt(lista.reduce((a,f)=>a+(f.salarioBase||0),0))}</div><div class="kpi-sub">salários base</div></div>
    `

    const wrap = document.getElementById('func-content')
    wrap.innerHTML = lista.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>CPF</th><th>Nome</th><th>Cargo</th><th>Setor</th><th>Salário Base</th><th>Contrato</th><th>Ações</th></tr></thead>
          <tbody>${lista.map(f => {
            const contrato = contratos.find(c => c.funcionarioId === f.id && c.status === 'ativo')
            return `<tr>
              <td class="text-mono">${esc(f.cpf||'—')}</td>
              <td><strong>${esc(f.nome)}</strong></td>
              <td>${esc(f.cargo||'—')}</td>
              <td>${esc(f.setor||'—')}</td>
              <td class="text-mono text-green">${fmt(f.salarioBase||0)}</td>
              <td>${contrato ? '<span class="badge green">Ativo</span>' : '<span class="badge red">Sem contrato</span>'}</td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="window.funcionarios.editar(${f.id})">✏️</button>
                <button class="btn btn-sm btn-primary" onclick="window.funcionarios.novoContrato(${f.id})">📋</button>
                <button class="btn btn-sm btn-danger" onclick="window.funcionarios.excluir(${f.id})">🗑️</button>
              </td>
            </tr>`
          }).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><div class="icon">👔</div><p>Nenhum funcionário encontrado</p></div>'
  }

  async loadContratos() {
    const db = window.db.db
    const contratos = await db.contratosRH.toArray()
    contratos.sort((a,b) => new Date(b.inicio) - new Date(a.inicio))
    const funcMap = {}
    const funcs = await db.funcionarios.toArray()
    funcs.forEach(f => funcMap[f.id] = f)
    const wrap = document.getElementById('func-content')
    wrap.innerHTML = `
      <div style="margin-bottom:12px;">
        <button class="btn btn-primary btn-sm" onclick="window.funcionarios.novoContrato()">+ Novo Contrato</button>
      </div>
      ${contratos.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Funcionário</th><th>Tipo</th><th>Início</th><th>Término</th><th>Salário</th><th>Status</th><th></th></tr></thead>
          <tbody>${contratos.map(c => {
            const func = funcMap[c.funcionarioId]
            return `<tr>
              <td><strong>${esc(func?.nome||'—')}</strong></td>
              <td>${esc(c.tipo||'—')}</td>
              <td class="text-mono">${new Date(c.inicio).toLocaleDateString('pt-BR')}</td>
              <td class="text-mono">${c.fim?new Date(c.fim).toLocaleDateString('pt-BR'):'—'}</td>
              <td class="text-mono text-green">${fmt(c.salario||0)}</td>
              <td><span class="badge ${c.status==='ativo'?'green':c.status==='encerrado'?'red':'yellow'}">${esc(c.status||'—')}</span></td>
              <td>${c.status==='ativo'?`<button class="btn btn-sm btn-danger" onclick="window.funcionarios.encerrarContrato(${c.id})">Encerrar</button>`:''}</td>
            </tr>`
          }).join('')}</tbody>
        </table>
      </div>
      ` : '<div class="empty-state"><div class="icon">📋</div><p>Nenhum contrato registrado</p></div>'}
    `
  }

  async loadFerias() {
    const db = window.db.db
    const ferias = await db.ferias.toArray()
    ferias.sort((a,b) => new Date(b.inicio) - new Date(a.inicio))
    const funcMap = {}
    const funcs = await db.funcionarios.toArray()
    funcs.forEach(f => funcMap[f.id] = f)
    const wrap = document.getElementById('func-content')
    wrap.innerHTML = `
      <div style="margin-bottom:12px;">
        <button class="btn btn-primary btn-sm" onclick="window.funcionarios.registrarFerias()">+ Registrar Férias</button>
      </div>
      ${ferias.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Funcionário</th><th>Início</th><th>Fim</th><th>Dias</th><th>Status</th></tr></thead>
          <tbody>${ferias.map(f => {
            const func = funcMap[f.funcionarioId]
            const dias = Math.ceil((new Date(f.fim) - new Date(f.inicio)) / (1000*60*60*24)) + 1
            return `<tr>
              <td><strong>${esc(func?.nome||'—')}</strong></td>
              <td class="text-mono">${new Date(f.inicio).toLocaleDateString('pt-BR')}</td>
              <td class="text-mono">${new Date(f.fim).toLocaleDateString('pt-BR')}</td>
              <td class="text-mono">${dias}</td>
              <td><span class="badge ${f.status==='aprovado'?'green':f.status==='cancelado'?'red':'yellow'}">${esc(f.status||'pendente')}</span></td>
            </tr>`
          }).join('')}</tbody>
        </table>
      </div>
      ` : '<div class="empty-state"><div class="icon">🏖️</div><p>Nenhum período de férias registrado</p></div>'}
    `
  }

  abrirForm() {
    this.editandoId = null
    document.getElementById('modal-func-title').textContent = 'Novo Funcionário'
    document.getElementById('func-cpf').value = ''
    document.getElementById('func-nome').value = ''
    document.getElementById('func-cargo').value = ''
    document.getElementById('func-setor').value = ''
    document.getElementById('func-salario').value = ''
    document.getElementById('func-data-nasc').value = ''
    document.getElementById('func-telefone').value = ''
    document.getElementById('func-email').value = ''
    openModal('modal-funcionario')
  }

  async editar(id) {
    const db = window.db.db
    const f = await db.funcionarios.get(id)
    if (!f) return
    this.editandoId = id
    document.getElementById('modal-func-title').textContent = 'Editar Funcionário'
    document.getElementById('func-cpf').value = f.cpf||''
    document.getElementById('func-nome').value = f.nome
    document.getElementById('func-cargo').value = f.cargo||''
    document.getElementById('func-setor').value = f.setor||''
    document.getElementById('func-salario').value = f.salarioBase||''
    document.getElementById('func-data-nasc').value = f.dataNascimento||''
    document.getElementById('func-telefone').value = f.telefone||''
    document.getElementById('func-email').value = f.email||''
    openModal('modal-funcionario')
  }

  async salvar() {
    const db = window.db.db
    const data = {
      cpf: document.getElementById('func-cpf').value.trim(),
      nome: document.getElementById('func-nome').value.trim(),
      cargo: document.getElementById('func-cargo').value.trim(),
      setor: document.getElementById('func-setor').value.trim(),
      salarioBase: parseFloat(document.getElementById('func-salario').value)||0,
      dataNascimento: document.getElementById('func-data-nasc').value,
      telefone: document.getElementById('func-telefone').value.trim(),
      email: document.getElementById('func-email').value.trim(),
    }
    if (!data.nome) { toast('⚠️ Informe o nome', 'error'); return }
    if (this.editandoId) {
      await db.funcionarios.update(this.editandoId, data)
      toast('✅ Funcionário atualizado', 'success')
    } else {
      await db.funcionarios.add(data)
      toast('✅ Funcionário criado', 'success')
    }
    closeModal('modal-funcionario')
    this.loadLista()
  }

  async excluir(id) {
    if (!confirm('Excluir este funcionário?')) return
    const db = window.db.db
    await db.funcionarios.delete(id)
    toast('🗑️ Funcionário excluído', 'info')
    this.loadLista()
  }

  async novoContrato(funcionarioId) {
    const db = window.db.db
    if (funcionarioId) {
      const f = await db.funcionarios.get(funcionarioId)
      document.getElementById('ct-funcionario').value = f?.id || ''
    }
    const funcs = await db.funcionarios.toArray()
    const sel = document.getElementById('ct-funcionario')
    sel.innerHTML = '<option value="">Selecione...</option>'
    funcs.forEach(f => { const o = document.createElement('option'); o.value = f.id; o.textContent = f.nome; if (f.id === funcionarioId) o.selected = true; sel.appendChild(o) })
    document.getElementById('ct-tipo').value = 'CLT'
    document.getElementById('ct-salario').value = ''
    document.getElementById('ct-inicio').value = new Date().toISOString().split('T')[0]
    document.getElementById('ct-fim').value = ''
    document.getElementById('ct-modal-title').textContent = funcionarioId ? '📋 Novo Contrato' : '📋 Novo Contrato'
    openModal('modal-contrato')
  }

  async salvarContrato() {
    const db = window.db.db
    const data = {
      funcionarioId: parseInt(document.getElementById('ct-funcionario').value),
      tipo: document.getElementById('ct-tipo').value,
      salario: parseFloat(document.getElementById('ct-salario').value)||0,
      inicio: document.getElementById('ct-inicio').value,
      fim: document.getElementById('ct-fim').value || null,
      status: 'ativo',
    }
    if (!data.funcionarioId || !data.inicio) { toast('⚠️ Preencha os campos obrigatórios', 'error'); return }
    await db.contratosRH.add(data)
    toast('✅ Contrato registrado', 'success')
    closeModal('modal-contrato')
    this.loadContratos()
  }

  async encerrarContrato(id) {
    if (!confirm('Encerrar este contrato?')) return
    const db = window.db.db
    await db.contratosRH.update(id, { status: 'encerrado', fim: new Date().toISOString().split('T')[0] })
    toast('📋 Contrato encerrado', 'info')
    this.loadContratos()
  }

  async registrarFerias() {
    const db = window.db.db
    const funcs = await db.funcionarios.toArray()
    const sel = document.getElementById('ferias-funcionario')
    sel.innerHTML = '<option value="">Selecione...</option>'
    funcs.forEach(f => { const o = document.createElement('option'); o.value = f.id; o.textContent = f.nome; sel.appendChild(o) })
    document.getElementById('ferias-inicio').value = ''
    document.getElementById('ferias-fim').value = ''
    openModal('modal-ferias')
  }

  async salvarFerias() {
    const db = window.db.db
    const data = {
      funcionarioId: parseInt(document.getElementById('ferias-funcionario').value),
      inicio: document.getElementById('ferias-inicio').value,
      fim: document.getElementById('ferias-fim').value,
      status: 'aprovado',
    }
    if (!data.funcionarioId || !data.inicio || !data.fim) { toast('⚠️ Preencha todos os campos', 'error'); return }
    if (new Date(data.fim) < new Date(data.inicio)) { toast('⚠️ Data fim deve ser após início', 'error'); return }
    await db.ferias.add(data)
    toast('🏖️ Férias registradas', 'success')
    closeModal('modal-ferias')
    this.loadFerias()
  }

  async gerarRelatorio() {
    const db = window.db.db
    const funcs = await db.funcionarios.toArray()
    const total = funcs.length
    const folha = funcs.reduce((a,f) => a + (f.salarioBase||0), 0)
    const cargos = {}
    funcs.forEach(f => { cargos[f.cargo||'Sem cargo'] = (cargos[f.cargo||'Sem cargo']||0) + 1 })
    const topCargos = Object.entries(cargos).sort((a,b) => b[1] - a[1]).slice(0,5)
    const msg = [
      `📊 RELATÓRIO DE RH`,
      `Total de funcionários: ${total}`,
      `Folha de pagamento: ${fmt(folha)}`,
      `Média salarial: ${fmt(total ? folha/total : 0)}`,
      ``,
      `Cargos:`,
      ...topCargos.map(([c, q]) => `  ${c}: ${q} funcionário(s)`),
    ].join('\n')
    toast(msg, 'info', 8000)
  }

  renderModalForm() {
    if (document.getElementById('modal-funcionario')) return
    const div = document.createElement('div'); div.className = 'modal-overlay hidden'; div.id = 'modal-funcionario'
    div.innerHTML = `
      <div class="modal">
        <h2 id="modal-func-title">👔 Novo Funcionário</h2>
        <div class="form-grid">
          <div class="form-group"><label>CPF</label><input type="text" id="func-cpf" placeholder="000.000.000-00"/></div>
          <div class="form-group"><label>Cargo</label><input type="text" id="func-cargo" placeholder="Cargo"/></div>
          <div class="form-group"><label>Setor</label><input type="text" id="func-setor" placeholder="Setor"/></div>
          <div class="form-group"><label>Salário (R$)</label><input type="number" id="func-salario" step="0.01" min="0"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Nome</label><input type="text" id="func-nome" placeholder="Nome completo"/></div>
          <div class="form-group"><label>Data Nasc.</label><input type="date" id="func-data-nasc"/></div>
          <div class="form-group"><label>Telefone</label><input type="text" id="func-telefone" placeholder="(11) 99999-0000"/></div>
          <div class="form-group"><label>E-mail</label><input type="email" id="func-email" placeholder="email@exemplo.com"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-funcionario')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.funcionarios.salvar()">💾 Salvar</button>
        </div>
      </div>`
    document.body.appendChild(div)
  }

  renderModalFerias() {
    if (document.getElementById('modal-ferias')) return
    const div = document.createElement('div'); div.className = 'modal-overlay hidden'; div.id = 'modal-ferias'
    div.innerHTML = `
      <div class="modal">
        <h2>🏖️ Registrar Férias</h2>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Funcionário</label><select id="ferias-funcionario"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>Início</label><input type="date" id="ferias-inicio"/></div>
          <div class="form-group"><label>Fim</label><input type="date" id="ferias-fim"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-ferias')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.funcionarios.salvarFerias()">💾 Salvar</button>
        </div>
      </div>`
    document.body.appendChild(div)

    const div2 = document.createElement('div'); div2.className = 'modal-overlay hidden'; div2.id = 'modal-contrato'
    div2.innerHTML = `
      <div class="modal">
        <h2 id="ct-modal-title">📋 Novo Contrato</h2>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Funcionário</label><select id="ct-funcionario"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>Tipo</label>
            <select id="ct-tipo"><option value="CLT">CLT</option><option value="PJ">PJ</option><option value="Estágio">Estágio</option><option value="Temporário">Temporário</option><option value="Aprendiz">Aprendiz</option></select>
          </div>
          <div class="form-group"><label>Salário (R$)</label><input type="number" id="ct-salario" step="0.01" min="0"/></div>
          <div class="form-group"><label>Início</label><input type="date" id="ct-inicio"/></div>
          <div class="form-group"><label>Término</label><input type="date" id="ct-fim"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-contrato')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.funcionarios.salvarContrato()">💾 Salvar</button>
        </div>
      </div>`
    document.body.appendChild(div2)
  }
}
