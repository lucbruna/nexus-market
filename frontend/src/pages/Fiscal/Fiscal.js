import { fmt, toast, openModal, closeModal } from '../../utils/format.js'

const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

const TIPOS_NOTA = [
  { id: 'NFC-e', nome: 'NFC-e', desc: 'Nota Fiscal de Consumidor Eletronica (vendas no varejo)', cfop: '5102', natureza: 'Venda de mercadorias' },
  { id: 'NF-e', nome: 'NF-e', desc: 'Nota Fiscal Eletronica (vendas e remessas entre empresas)', cfop: '5102', natureza: 'Venda de mercadorias' },
  { id: 'NFS-e', nome: 'NFS-e', desc: 'Nota Fiscal de Servicos Eletronica (prestacao de servicos)', cfop: '', natureza: 'Prestacao de servicos' },
  { id: 'CT-e', nome: 'CT-e', desc: 'Conhecimento de Transporte Eletronico (fretes e transportes)', cfop: '', natureza: 'Servico de transporte' },
]

export class Fiscal {
  async render() {
    const el = document.getElementById('page-fiscal')
    el.innerHTML = `
      <div class="section-header">
        <h2>Emissao Fiscal</h2>
        <div class="gap-8">
          <button class="btn btn-secondary" onclick="window.openModal('modal-fiscal-config')">Configuracao fiscal</button>
          <button class="btn btn-primary" onclick="window.fiscal.abrirEmissao()">Preparar nota</button>
        </div>
      </div>
      <div class="kpi-grid" id="fiscal-kpis"></div>
      <div class="card"><div class="card-title">Documentos fiscais</div><div id="fiscal-table-wrap"></div></div>
    `
    window.fiscal = this
    this.renderModalConfig()
    this.renderModalEmissao()
    await this.loadData()
  }

  async loadData() {
    const db = window.db.db
    const nfs = await db.notasFiscais.toArray()
    nfs.sort((a, b) => new Date(b.data) - new Date(a.data))
    const autorizadas = nfs.filter(n => n.status === 'autorizada').length
    const prontas = nfs.filter(n => n.status === 'pronta_transmissao').length
    const rejeitadas = nfs.filter(n => n.status === 'rejeitada').length
    document.getElementById('fiscal-kpis').innerHTML = `
      <div class="kpi green"><div class="kpi-label">Autorizadas</div><div class="kpi-value">${autorizadas}</div></div>
      <div class="kpi yellow"><div class="kpi-label">Prontas para transmitir</div><div class="kpi-value">${prontas}</div></div>
      <div class="kpi red"><div class="kpi-label">Rejeitadas</div><div class="kpi-value">${rejeitadas}</div></div>
      <div class="kpi blue"><div class="kpi-label">Total</div><div class="kpi-value">${nfs.length}</div></div>
    `
    const wrap = document.getElementById('fiscal-table-wrap')
    wrap.innerHTML = nfs.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Tipo</th><th>Numero</th><th>Serie</th><th>Natureza</th><th>Destinatario</th><th>Valor</th><th>Data</th><th>Status</th><th>Acao</th></tr></thead>
          <tbody>${nfs.map(n => `
            <tr>
              <td><span class="badge cyan">${esc(n.tipo)}</span></td>
              <td class="text-mono">${esc(n.numero || '-')}</td>
              <td class="text-mono">${esc(n.serie || '-')}</td>
              <td>${esc(n.naturezaOperacao || '-')}</td>
              <td>${esc(n.destinatarioNome || 'Consumidor final')}</td>
              <td class="text-mono text-green">${fmt(n.valor || 0)}</td>
              <td class="text-mono">${n.data ? new Date(n.data).toLocaleString('pt-BR') : '-'}</td>
              <td><span class="badge ${n.status === 'autorizada' ? 'green' : n.status === 'rejeitada' ? 'red' : 'yellow'}">${esc(n.status || 'rascunho')}</span></td>
              <td><button class="btn btn-sm btn-secondary" onclick="window.fiscal.visualizar(${n.id})">Ver</button></td>
            </tr>
          `).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><p>Nenhum documento fiscal preparado.</p></div>'
  }

  abrirEmissao() {
    document.getElementById('nf-seletor-tipos').innerHTML = TIPOS_NOTA.map(t => `
      <button class="nf-tipo-card" data-tipo="${t.id}" onclick="window.fiscal.selecionarTipo('${t.id}')">
        <strong>${t.nome}</strong>
        <span>${t.desc}</span>
      </button>
    `).join('')
    document.getElementById('nf-tipo-info').classList.add('hidden')
    this.tipoSelecionado = null
    openModal('modal-fiscal-emissao')
  }

  async selecionarTipo(tipoId) {
    this.tipoSelecionado = tipoId
    document.querySelectorAll('.nf-tipo-card').forEach(c => c.classList.toggle('active', c.dataset.tipo === tipoId))
    const tipo = TIPOS_NOTA.find(t => t.id === tipoId)
    document.getElementById('nf-tipo-info').classList.remove('hidden')
    document.getElementById('nf-tipo-info').innerHTML = `<strong>${tipo.nome}</strong> — ${tipo.desc}`
    document.getElementById('nf-tipo').value = tipoId
    document.getElementById('nf-natureza').value = tipo.natureza
    document.getElementById('nf-cfop').value = tipo.cfop

    const db = window.db.db
    const vendas = await db.vendasPDV.toArray()
    const entradas = await db.nfeEntrada.toArray()
    const vendaSel = document.getElementById('nf-venda')
    vendaSel.innerHTML = '<option value="">Selecione se for NFC-e/NF-e de venda</option>' + vendas.slice().reverse().map(v => `<option value="${v.id}">Venda #${v.num || v.id} - ${fmt(v.total)} - ${new Date(v.data).toLocaleString('pt-BR')}</option>`).join('')
    const entradaSel = document.getElementById('nf-entrada')
    entradaSel.innerHTML = '<option value="">Selecione se for NF-e de entrada</option>' + entradas.slice().reverse().map(n => `<option value="${n.id}">Entrada ${esc(n.numero || n.nf || n.id)} - ${fmt(n.valor)}</option>`).join('')

    const showVenda = tipoId === 'NFC-e' || tipoId === 'NF-e'
    document.getElementById('nf-venda-group').style.display = showVenda ? 'block' : 'none'
    document.getElementById('nf-entrada-group').style.display = tipoId === 'NF-e' ? 'block' : 'none'
    document.getElementById('nf-destinatario-group').style.display = tipoId === 'NF-e' ? 'block' : 'none'
    document.getElementById('nf-cpfcnpj-group').style.display = tipoId === 'NF-e' ? 'block' : 'none'
  }

  async prepararNota() {
    if (!this.tipoSelecionado) return toast('Selecione o tipo de nota fiscal antes de preparar', 'error')
    const db = window.db.db
    const tipo = document.getElementById('nf-tipo').value
    const vendaId = Number(document.getElementById('nf-venda').value || 0)
    const entradaId = Number(document.getElementById('nf-entrada').value || 0)
    const naturezaOperacao = document.getElementById('nf-natureza').value.trim()
    const cfop = document.getElementById('nf-cfop').value.trim()
    const destinatarioNome = document.getElementById('nf-destinatario').value.trim()
    const destinatarioDoc = document.getElementById('nf-cpfcnpj').value.trim()
    const serie = document.getElementById('nf-serie').value.trim() || '1'

    if (!naturezaOperacao || !cfop) return toast('Informe natureza da operacao e CFOP', 'error')
    if ((tipo === 'NFC-e' || tipo === 'NF-e') && !vendaId && !entradaId) return toast('Selecione uma venda ou uma nota de entrada', 'error')
    if (tipo === 'NF-e' && !destinatarioNome) return toast('NF-e exige destinatario identificado (nome/razao social)', 'error')

    let valor = 0
    let itens = []
    let origem = {}
    if (vendaId) {
      const venda = await db.vendasPDV.get(vendaId)
      itens = await db.itensPDV.filter(i => i.vendaPDVId === vendaId).toArray()
      valor = venda?.total || 0
      origem = { vendaId, numeroOrigem: venda?.num }
    } else if (entradaId) {
      const entrada = await db.nfeEntrada.get(entradaId)
      valor = entrada?.valor || 0
      origem = { entradaId, numeroOrigem: entrada?.numero || entrada?.nf }
    }

    const cfg = await db.configuracoes.get('fiscal')
    const fiscalCfg = cfg ? JSON.parse(cfg.valor) : {}
    const numero = Number(fiscalCfg.ultimoNumeroNF || 0) + 1
    const nota = {
      tipo, numero, serie,
      ambiente: fiscalCfg.ambiente || 'homologacao',
      naturezaOperacao, cfop,
      destinatarioNome: destinatarioNome || 'Consumidor final',
      destinatarioDoc, valor, itens,
      data: new Date().toISOString(),
      status: fiscalCfg.certificado ? 'pronta_transmissao' : 'pendente_certificado',
      chaveAcesso: '', protocolo: '', xml: '',
      ...origem,
    }
    await db.notasFiscais.add(nota)
    await db.configuracoes.put({ chave: 'fiscal', valor: JSON.stringify({ ...fiscalCfg, ultimoNumeroNF: numero, serieNFCe: serie }) })
    closeModal('modal-fiscal-emissao')
    toast(nota.status === 'pronta_transmissao' ? 'Nota preparada para transmissao' : 'Nota preparada. Configure certificado antes de transmitir.', 'success')
    await this.loadData()
  }

  async visualizar(id) {
    const db = window.db.db
    const n = await db.notasFiscais.get(id)
    if (!n) return
    alert([
      `${n.tipo} ${n.numero}/${n.serie}`,
      `Status: ${n.status}`,
      `Natureza: ${n.naturezaOperacao}`,
      `CFOP: ${n.cfop}`,
      `Destinatario: ${n.destinatarioNome} ${n.destinatarioDoc || ''}`,
      `Valor: ${fmt(n.valor)}`,
      `Itens: ${(n.itens || []).length}`,
    ].join('\n'))
  }

  renderModalEmissao() {
    if (document.getElementById('modal-fiscal-emissao')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'
    div.id = 'modal-fiscal-emissao'
    div.innerHTML = `
      <div class="modal" style="min-width:600px;">
        <h2>Preparar documento fiscal</h2>
        <div class="nf-aviso">
          <strong>Selecione o tipo de nota fiscal desejado:</strong>
        </div>
        <div class="nf-tipo-grid" id="nf-seletor-tipos"></div>
        <div id="nf-tipo-info" class="nf-status hidden"></div>
        <div class="form-grid mt-16">
          <div class="form-group" style="display:none"><label>Tipo</label><select id="nf-tipo"><option>NFC-e</option><option>NF-e</option><option>NFS-e</option><option>CT-e</option></select></div>
          <div class="form-group"><label>Serie</label><input id="nf-serie" value="1"/></div>
          <div class="form-group" id="nf-venda-group" style="display:none;grid-column:span 2"><label>Venda origem (para NFC-e / NF-e)</label><select id="nf-venda"></select></div>
          <div class="form-group" id="nf-entrada-group" style="display:none;grid-column:span 2"><label>NF-e entrada origem</label><select id="nf-entrada"></select></div>
          <div class="form-group"><label>Natureza da operacao</label><input id="nf-natureza"/></div>
          <div class="form-group"><label>CFOP</label><input id="nf-cfop"/></div>
          <div class="form-group" id="nf-destinatario-group" style="display:none"><label>Destinatario (NF-e)</label><input id="nf-destinatario" placeholder="Nome/razao social"/></div>
          <div class="form-group" id="nf-cpfcnpj-group" style="display:none"><label>CPF/CNPJ (NF-e)</label><input id="nf-cpfcnpj"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-fiscal-emissao')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.fiscal.prepararNota()">Preparar nota</button>
        </div>
      </div>`
    document.body.appendChild(div)
  }

  renderModalConfig() {
    if (document.getElementById('modal-fiscal-config')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'
    div.id = 'modal-fiscal-config'
    div.innerHTML = `
      <div class="modal">
        <h2>Configuracao fiscal</h2>
        <div class="form-grid">
          <div class="form-group"><label>Ambiente</label><select id="fisc-ambiente"><option value="homologacao">Homologacao</option><option value="producao">Producao</option></select></div>
          <div class="form-group"><label>Serie padrao</label><input type="text" id="fisc-serie" value="1"/></div>
          <div class="form-group"><label>CSC / Token NFC-e</label><input id="fisc-csc" placeholder="Token do contribuinte"/></div>
          <div class="form-group"><label>ID CSC</label><input id="fisc-idcsc"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Certificado Digital A1 (.pfx/.p12)</label><input type="file" id="fisc-cert" accept=".pfx,.p12"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-fiscal-config')">Fechar</button>
          <button class="btn btn-primary" onclick="window.fiscal.salvarConfigFiscal()">Salvar</button>
        </div>
      </div>`
    document.body.appendChild(div)
  }

  async salvarConfigFiscal() {
    const db = window.db.db
    const atual = await db.configuracoes.get('fiscal')
    const cfg = atual ? JSON.parse(atual.valor) : {}
    await db.configuracoes.put({
      chave: 'fiscal',
      valor: JSON.stringify({
        ...cfg,
        ambiente: document.getElementById('fisc-ambiente').value,
        serieNFCe: document.getElementById('fisc-serie').value,
        csc: document.getElementById('fisc-csc').value,
        idCsc: document.getElementById('fisc-idcsc').value,
        certificado: document.getElementById('fisc-cert').files.length ? 'configurado' : cfg.certificado,
      }),
    })
    closeModal('modal-fiscal-config')
    toast('Configuracao fiscal salva', 'success')
  }
}
