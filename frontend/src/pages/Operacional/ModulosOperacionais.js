import { fmt, toast } from '../../utils/format.js'

const money = value => Number(value || 0)
const today = () => new Date().toISOString().slice(0, 10)
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

const MODULES = {
  perdas: {
    title: 'Perdas e Quebras',
    store: 'perdas',
    kpiLabel: 'Valor perdido',
    fields: [
      { key: 'produtoNome', label: 'Produto', type: 'text', required: true },
      { key: 'qtd', label: 'Quantidade', type: 'number', required: true },
      { key: 'valor', label: 'Valor', type: 'money' },
      { key: 'motivo', label: 'Motivo', type: 'text', required: true },
      { key: 'data', label: 'Data', type: 'date' },
    ],
  },
  transferencias: {
    title: 'Transferencias de Estoque',
    store: 'transferenciasEstoque',
    fields: [
      { key: 'produtoNome', label: 'Produto', type: 'text', required: true },
      { key: 'origem', label: 'Origem', type: 'text', required: true },
      { key: 'destino', label: 'Destino', type: 'text', required: true },
      { key: 'qtd', label: 'Quantidade', type: 'number', required: true },
      { key: 'status', label: 'Status', type: 'select', options: ['pendente', 'enviada', 'recebida'] },
      { key: 'data', label: 'Data', type: 'date' },
    ],
  },
  'curva-abc': {
    title: 'Curva ABC',
    mode: 'abc',
  },
  cotacoes: {
    title: 'Cotacoes',
    store: 'cotacoes',
    kpiLabel: 'Valor cotado',
    fields: [
      { key: 'fornecedorNome', label: 'Fornecedor', type: 'text', required: true },
      { key: 'numero', label: 'Numero da cotacao', type: 'text' },
      { key: 'descricao', label: 'Itens cotados', type: 'text', required: true },
      { key: 'valorTotal', label: 'Valor total', type: 'money' },
      { key: 'prazoEntrega', label: 'Prazo de entrega', type: 'text' },
      { key: 'condicaoPagamento', label: 'Condicao pagamento', type: 'text' },
      { key: 'validadeProposta', label: 'Validade proposta', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['aberta', 'enviada', 'aprovada', 'recusada'] },
      { key: 'data', label: 'Data', type: 'date' },
    ],
  },
  crm: {
    title: 'CRM / Oportunidades',
    store: 'crmOportunidades',
    kpiLabel: 'Pipeline',
    fields: [
      { key: 'titulo', label: 'Oportunidade', type: 'text', required: true },
      { key: 'clienteNome', label: 'Cliente', type: 'text' },
      { key: 'valor', label: 'Valor', type: 'money' },
      { key: 'status', label: 'Status', type: 'select', options: ['novo', 'em contato', 'proposta', 'ganho', 'perdido'] },
      { key: 'data', label: 'Data', type: 'date' },
    ],
  },
  convenios: {
    title: 'Convenios',
    store: 'convenios',
    fields: [
      { key: 'nome', label: 'Convenio', type: 'text', required: true },
      { key: 'cnpj', label: 'CNPJ', type: 'text' },
      { key: 'descontoMax', label: 'Desconto max. %', type: 'number' },
      { key: 'prazo', label: 'Prazo', type: 'text' },
      { key: 'ativo', label: 'Status', type: 'select', options: ['ativo', 'inativo'] },
    ],
  },
  conciliacao: {
    title: 'Conciliacao',
    store: 'conciliacoes',
    kpiLabel: 'Conciliado',
    fields: [
      { key: 'conta', label: 'Conta', type: 'text', required: true },
      { key: 'tipo', label: 'Tipo', type: 'select', options: ['cartao', 'banco', 'pix', 'dinheiro'] },
      { key: 'valor', label: 'Valor', type: 'money' },
      { key: 'status', label: 'Status', type: 'select', options: ['pendente', 'conciliado', 'divergente'] },
      { key: 'data', label: 'Data', type: 'date' },
    ],
  },
  'contratos-rh': {
    title: 'Contratos RH',
    store: 'contratosRH',
    fields: [
      { key: 'funcionarioNome', label: 'Funcionario', type: 'text', required: true },
      { key: 'ultimoEmprego', label: 'Ultimo emprego anterior', type: 'text' },
      { key: 'tipo', label: 'Tipo', type: 'select', options: ['CLT', 'temporario', 'experiencia', 'prestador'] },
      { key: 'salario', label: 'Salario', type: 'money' },
      { key: 'status', label: 'Status', type: 'select', options: ['ativo', 'encerrado', 'suspenso'] },
      { key: 'inicio', label: 'Inicio', type: 'date' },
    ],
  },
  ferias: {
    title: 'Ferias',
    store: 'ferias',
    fields: [
      { key: 'funcionarioNome', label: 'Funcionario', type: 'text', required: true },
      { key: 'inicio', label: 'Inicio', type: 'date', required: true },
      { key: 'fim', label: 'Fim', type: 'date', required: true },
      { key: 'status', label: 'Status', type: 'select', options: ['programada', 'em andamento', 'concluida', 'cancelada'] },
      { key: 'observacao', label: 'Observacao', type: 'text' },
    ],
  },
  rescisao: {
    title: 'Rescisoes',
    store: 'rescisoes',
    kpiLabel: 'Valor previsto',
    fields: [
      { key: 'funcionarioNome', label: 'Funcionario', type: 'text', required: true },
      { key: 'tipo', label: 'Tipo', type: 'select', options: ['sem justa causa', 'justa causa', 'pedido demissao', 'acordo'] },
      { key: 'valorTotal', label: 'Valor total', type: 'money' },
      { key: 'status', label: 'Status', type: 'select', options: ['aberta', 'calculada', 'paga'] },
      { key: 'data', label: 'Data', type: 'date' },
    ],
  },
  'nfe-entrada': {
    title: 'NF-e Entrada',
    store: 'nfeEntrada',
    kpiLabel: 'Total notas',
    fields: [
      { key: 'numero', label: 'Numero', type: 'text', required: true },
      { key: 'fornecedorNome', label: 'Fornecedor', type: 'text' },
      { key: 'chaveAcesso', label: 'Chave de acesso', type: 'text' },
      { key: 'valor', label: 'Valor', type: 'money' },
      { key: 'status', label: 'Status', type: 'select', options: ['recebida', 'conferida', 'cancelada'] },
    ],
  },
  sped: {
    title: 'SPED Fiscal',
    store: 'spedFiscal',
    fields: [
      { key: 'periodo', label: 'Periodo', type: 'text', required: true },
      { key: 'tipo', label: 'Tipo', type: 'select', options: ['ICMS/IPI', 'Contribuicoes'] },
      { key: 'status', label: 'Status', type: 'select', options: ['rascunho', 'gerado', 'transmitido'] },
      { key: 'arquivo', label: 'Arquivo', type: 'text' },
      { key: 'geradoEm', label: 'Gerado em', type: 'date' },
    ],
  },
  backup: {
    title: 'Backup & Restore',
    mode: 'backup',
  },
}

class OperationalModule {
  constructor(key) {
    this.key = key
    this.config = MODULES[key]
  }

  async render() {
    const el = document.getElementById('page-' + this.key)
    window.operationalModules = window.operationalModules || {}
    window.operationalModules[this.key] = this

    if (this.config.mode === 'abc') return this.renderABC(el)
    if (this.config.mode === 'backup') return this.renderBackup(el)

    el.innerHTML = `
      <div class="section-header">
        <h2>${this.config.title}</h2>
        <button class="btn btn-primary" onclick="window.operationalModules['${this.key}'].save()">Salvar registro</button>
      </div>
      <div class="kpi-grid" id="${this.key}-kpis"></div>
      <div class="card">
        <div class="card-title">Cadastro</div>
        <div class="form-grid">${this.config.fields.map(f => this.renderField(f)).join('')}</div>
      </div>
      <div class="card mt-16">
        <div class="card-title">Registros</div>
        <div id="${this.key}-table"></div>
      </div>
    `
    await this.load()
  }

  renderField(field) {
    if (field.type === 'select') {
      return `<div class="form-group"><label>${field.label}</label><select id="${this.key}-${field.key}">${field.options.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join('')}</select></div>`
    }
    const type = field.type === 'money' || field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'
    const step = field.type === 'money' ? ' step="0.01"' : ''
    const value = field.type === 'date' ? ` value="${today()}"` : ''
    return `<div class="form-group"><label>${field.label}</label><input id="${this.key}-${field.key}" type="${type}"${step}${value}/></div>`
  }

  async save() {
    const db = window.db.db
    const data = {}
    for (const field of this.config.fields) {
      const el = document.getElementById(`${this.key}-${field.key}`)
      let value = el.value
      if (field.type === 'money' || field.type === 'number') value = money(value)
      if (field.required && !value) {
        toast(`Preencha: ${field.label}`, 'error')
        return
      }
      data[field.key] = value
    }
    data.dataAtualizacao = new Date().toISOString()
    await db[this.config.store].add(data)
    toast('Registro salvo', 'success')
    this.config.fields.forEach(field => {
      const el = document.getElementById(`${this.key}-${field.key}`)
      if (field.type === 'date') el.value = today()
      else if (field.type !== 'select') el.value = ''
    })
    await this.load()
  }

  async load() {
    const db = window.db.db
    const rows = await db[this.config.store].toArray()
    const total = rows.reduce((sum, row) => sum + money(row.valor || row.valorTotal || row.salario), 0)
    document.getElementById(`${this.key}-kpis`).innerHTML = `
      <div class="kpi blue"><div class="kpi-label">Registros</div><div class="kpi-value">${rows.length}</div><div class="kpi-sub">${this.config.title}</div></div>
      <div class="kpi green"><div class="kpi-label">${this.config.kpiLabel || 'Valor movimentado'}</div><div class="kpi-value">${fmt(total)}</div><div class="kpi-sub">base local</div></div>
    `
    const table = document.getElementById(`${this.key}-table`)
    if (!rows.length) {
      table.innerHTML = '<div class="empty-state"><p>Nenhum registro cadastrado</p></div>'
      return
    }
    table.innerHTML = `
      <div class="tbl-wrap">
        <table>
          <thead><tr>${this.config.fields.map(f => `<th>${f.label}</th>`).join('')}</tr></thead>
          <tbody>${rows.slice().reverse().map(row => `
            <tr>${this.config.fields.map(f => `<td>${this.formatCell(row[f.key], f)}</td>`).join('')}</tr>
          `).join('')}</tbody>
        </table>
      </div>
    `
  }

  formatCell(value, field) {
    if (field.type === 'money') return `<span class="text-mono">${fmt(value)}</span>`
    if (field.type === 'date' && value) return `<span class="text-mono">${new Date(value + 'T00:00:00').toLocaleDateString('pt-BR')}</span>`
    return escapeHtml(value || '-')
  }

  async renderABC(el) {
    const db = window.db.db
    const itens = await db.itensPDV.toArray()
    const produtos = await db.produtos.toArray()
    const prodMap = Object.fromEntries(produtos.map(p => [p.id, p]))
    const vendas = {}
    itens.forEach(item => {
      vendas[item.produtoId] = vendas[item.produtoId] || { qtd: 0, valor: 0 }
      vendas[item.produtoId].qtd += item.qtd || 0
      vendas[item.produtoId].valor += item.total || 0
    })
    const ranked = Object.entries(vendas).sort((a, b) => b[1].valor - a[1].valor)
    const total = ranked.reduce((sum, [, row]) => sum + row.valor, 0)
    let acc = 0
    const rows = ranked.map(([id, row]) => {
      acc += row.valor
      const pctAcc = total ? acc / total * 100 : 0
      return { id: Number(id), ...row, pctAcc, classe: pctAcc <= 80 ? 'A' : pctAcc <= 95 ? 'B' : 'C' }
    })
    el.innerHTML = `
      <div class="section-header"><h2>Curva ABC</h2></div>
      <div class="kpi-grid">
        <div class="kpi green"><div class="kpi-label">Faturamento classificado</div><div class="kpi-value">${fmt(total)}</div></div>
        <div class="kpi blue"><div class="kpi-label">Itens vendidos</div><div class="kpi-value">${rows.length}</div></div>
      </div>
      <div class="tbl-wrap"><table><thead><tr><th>Classe</th><th>Produto</th><th>Qtd</th><th>Valor</th><th>% acum.</th></tr></thead>
      <tbody>${rows.map(row => `<tr><td><span class="badge ${row.classe === 'A' ? 'green' : row.classe === 'B' ? 'yellow' : 'red'}">${row.classe}</span></td><td>${escapeHtml(prodMap[row.id]?.nome || row.id)}</td><td class="text-mono">${row.qtd}</td><td class="text-mono">${fmt(row.valor)}</td><td class="text-mono">${row.pctAcc.toFixed(1)}%</td></tr>`).join('') || '<tr><td colspan="5">Sem vendas registradas</td></tr>'}</tbody></table></div>
    `
  }

  async renderBackup(el) {
    el.innerHTML = `
      <div class="section-header">
        <h2>Backup & Restore</h2>
        <button class="btn btn-primary" onclick="window.operationalModules.backup.exportBackup()">Gerar backup JSON</button>
      </div>
      <div class="card">
        <div class="card-title">Restaurar backup</div>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Arquivo JSON</label><input type="file" id="backup-file" accept="application/json"/></div>
        </div>
        <button class="btn btn-secondary" onclick="window.operationalModules.backup.importBackup()">Restaurar</button>
      </div>
      <div class="card mt-16"><div class="card-title">Status</div><div id="backup-status">Pronto para exportar ou restaurar dados locais.</div></div>
    `
  }

  async exportBackup() {
    const db = window.db.db
    const data = {}
    for (const table of db.tables) data[table.name] = await table.toArray()
    const blob = new Blob([JSON.stringify({ geradoEm: new Date().toISOString(), data }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `nexus-backup-${today()}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    document.getElementById('backup-status').textContent = 'Backup gerado.'
  }

  async importBackup() {
    const input = document.getElementById('backup-file')
    if (!input.files.length) return toast('Selecione o arquivo JSON', 'error')
    const payload = JSON.parse(await input.files[0].text())
    const db = window.db.db
    for (const [name, rows] of Object.entries(payload.data || {})) {
      if (db[name] && Array.isArray(rows)) {
        await db[name].clear()
        if (rows.length) await db[name].bulkAdd(rows)
      }
    }
    toast('Backup restaurado', 'success')
    document.getElementById('backup-status').textContent = 'Backup restaurado com sucesso.'
  }
}

export const Perdas = class extends OperationalModule { constructor() { super('perdas') } }
export const Transferencias = class extends OperationalModule { constructor() { super('transferencias') } }
export const CurvaABC = class extends OperationalModule { constructor() { super('curva-abc') } }
export const Cotacoes = class extends OperationalModule { constructor() { super('cotacoes') } }
export const CRM = class extends OperationalModule { constructor() { super('crm') } }
export const Convenios = class extends OperationalModule { constructor() { super('convenios') } }
export const Conciliacao = class extends OperationalModule { constructor() { super('conciliacao') } }
export const ContratosRH = class extends OperationalModule { constructor() { super('contratos-rh') } }
export const Ferias = class extends OperationalModule { constructor() { super('ferias') } }
export const Rescisao = class extends OperationalModule { constructor() { super('rescisao') } }
export const NFeEntrada = class extends OperationalModule { constructor() { super('nfe-entrada') } }
export const SPED = class extends OperationalModule { constructor() { super('sped') } }
export const Backup = class extends OperationalModule { constructor() { super('backup') } }
