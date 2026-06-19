import { fmt, toast, openModal, closeModal } from '../../utils/format.js'

export class Configuracoes {
  async render() {
    const el = document.getElementById('page-configuracoes')
    el.innerHTML = `
      <div class="section-header">
        <h2>Configuracoes do Sistema</h2>
        <span class="badge red" id="cfg-admin-badge">Apenas administrador</span>
      </div>
      <div class="cfg-tabs">
        <button class="cfg-tab active" data-tab="loja">Dados da Loja</button>
        <button class="cfg-tab" data-tab="pdv">PDV / Pagamento</button>
        <button class="cfg-tab" data-tab="fiscal">Fiscal / NFe</button>
        <button class="cfg-tab" data-tab="tef">TEF / Sat</button>
        <button class="cfg-tab" data-tab="email">Email / Notificacoes</button>
        <button class="cfg-tab" data-tab="sistema">Sistema / Backup</button>
      </div>
      <div id="cfg-content"></div>
    `
    window.configuracoes = this
    this.bindTabs()
    await this.loadTab('loja')
  }

  bindTabs() {
    document.querySelectorAll('.cfg-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.cfg-tab').forEach(t => t.classList.remove('active'))
        tab.classList.add('active')
        this.loadTab(tab.dataset.tab)
      })
    })
  }

  async loadTab(tab) {
    const el = document.getElementById('cfg-content')
    const metodos = {
      loja: () => this.renderLoja(el),
      pdv: () => this.renderPDV(el),
      fiscal: () => this.renderFiscal(el),
      tef: () => this.renderTEF(el),
      email: () => this.renderEmail(el),
      sistema: () => this.renderSistema(el),
    }
    if (metodos[tab]) await metodos[tab]()
  }

  async renderLoja(el) {
    const db = window.db.db
    let lojaCfg = await db.configuracoes.get('loja')
    let loja = {}
    try { loja = lojaCfg ? JSON.parse(lojaCfg.valor) : {} } catch (e) {}
    el.innerHTML = `
      <div class="card"><div class="card-title">Dados da Loja / Empresa</div>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Nome fantasia</label><input type="text" id="cfg-loja-nome" value="${loja.nome || ''}" placeholder="Nome da loja"/></div>
          <div class="form-group"><label>Razao social</label><input type="text" id="cfg-loja-razao" value="${loja.razaoSocial || ''}" placeholder="Razao social"/></div>
          <div class="form-group"><label>CNPJ</label><input type="text" id="cfg-loja-cnpj" value="${loja.cnpj || ''}" placeholder="00.000.000/0001-00"/></div>
          <div class="form-group"><label>Inscricao estadual</label><input type="text" id="cfg-loja-ie" value="${loja.ie || ''}" placeholder="IE"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Endereco</label><input type="text" id="cfg-loja-end" value="${loja.endereco || ''}" placeholder="Rua, n, bairro, cidade- UF"/></div>
          <div class="form-group"><label>Telefone</label><input type="text" id="cfg-loja-tel" value="${loja.telefone || ''}" placeholder="(11) 99999-9999"/></div>
          <div class="form-group"><label>Email</label><input type="email" id="cfg-loja-email" value="${loja.email || ''}" placeholder="loja@exemplo.com"/></div>
        </div>
        <button class="btn btn-primary" onclick="window.configuracoes.salvarLoja()">Salvar dados da loja</button>
      </div>
      <div class="card mt-16"><div class="card-title">Regime tributario</div>
        <div class="form-grid">
          <div class="form-group"><label>Regime</label><select id="cfg-regime"><option value="SN" ${loja.regime === 'SN' ? 'selected' : ''}>Simples Nacional</option><option value="LP" ${loja.regime === 'LP' ? 'selected' : ''}>Lucro Presumido</option><option value="LR" ${loja.regime === 'LR' ? 'selected' : ''}>Lucro Real</option></select></div>
          <div class="form-group"><label>CNAE</label><input type="text" id="cfg-cnae" value="${loja.cnae || ''}" placeholder="4711301"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Aliquota ISS (%)</label><input type="number" id="cfg-aliquota-iss" value="${loja.aliquotaISS || 2}" step="0.01" min="0" max="5"/></div>
        </div>
        <button class="btn btn-primary" onclick="window.configuracoes.salvarLoja()">Salvar dados fiscais</button>
      </div>
    `
  }

  async salvarLoja() {
    const db = window.db.db
    const loja = {
      nome: document.getElementById('cfg-loja-nome').value.trim(),
      razaoSocial: document.getElementById('cfg-loja-razao').value.trim(),
      cnpj: document.getElementById('cfg-loja-cnpj').value.trim(),
      ie: document.getElementById('cfg-loja-ie').value.trim(),
      endereco: document.getElementById('cfg-loja-end').value.trim(),
      telefone: document.getElementById('cfg-loja-tel').value.trim(),
      email: document.getElementById('cfg-loja-email').value.trim(),
      regime: document.getElementById('cfg-regime').value,
      cnae: document.getElementById('cfg-cnae').value.trim(),
      aliquotaISS: Number(document.getElementById('cfg-aliquota-iss').value || 2),
    }
    await db.configuracoes.put({ chave: 'loja', valor: JSON.stringify(loja) })
    localStorage.setItem('loja_config', JSON.stringify(loja))
    toast('Dados da loja salvos', 'success')
  }

  async renderPDV(el) {
    const db = window.db.db
    let pdvCfg = await db.configuracoes.get('pdv')
    let cfg = pdvCfg ? JSON.parse(pdvCfg.valor) : {}
    const formas = cfg.formasPagamento || ['dinheiro', 'credito', 'debito', 'pix', 'voucher', 'fiado', 'crediario', 'vale-alim', 'misto']
    el.innerHTML = `
      <div class="card"><div class="card-title">Formas de pagamento ativas</div>
        <div class="form-group" style="margin-bottom:16px;">
          <label>Selecione as formas de pagamento disponiveis no PDV</label>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px;">
            ${['dinheiro', 'credito', 'debito', 'pix', 'voucher', 'fiado', 'crediario', 'vale-alim', 'vale-transporte', 'cheque', 'misto'].map(f =>
              `<label style="font-size:12px;display:flex;align-items:center;gap:6px;cursor:pointer;padding:4px 8px;background:var(--bg3);border-radius:6px;">
                <input type="checkbox" class="cfg-pag-check" value="${f}" ${formas.includes(f) ? 'checked' : ''}/> ${f}
              </label>`
            ).join('')}
          </div>
        </div>
        <button class="btn btn-primary" onclick="window.configuracoes.salvarPDV()">Salvar configuracoes PDV</button>
      </div>
      <div class="card mt-16"><div class="card-title">Configuracoes de caixa</div>
        <div class="form-grid">
          <div class="form-group"><label>Caixa padrao</label><input type="text" id="cfg-caixa-num" value="${cfg.caixaNumero || '01'}"/></div>
          <div class="form-group"><label>Valor inicial padrao (R$)</label><input type="number" id="cfg-caixa-inicial" value="${cfg.valorInicial || 200}" step="0.01"/></div>
        </div>
        <button class="btn btn-primary" onclick="window.configuracoes.salvarPDV()">Salvar</button>
      </div>
    `
  }

  async salvarPDV() {
    const db = window.db.db
    const checks = document.querySelectorAll('.cfg-pag-check:checked')
    const formas = Array.from(checks).map(c => c.value)
    await db.configuracoes.put({ chave: 'pdv', valor: JSON.stringify({
      formasPagamento: formas,
      caixaNumero: document.getElementById('cfg-caixa-num')?.value || '01',
      valorInicial: Number(document.getElementById('cfg-caixa-inicial')?.value || 200),
    }) })
    toast('Configuracoes PDV salvas', 'success')
  }

  async renderFiscal(el) {
    const db = window.db.db
    let cfg = await db.configuracoes.get('fiscal')
    let fiscal = cfg ? JSON.parse(cfg.valor) : {}
    el.innerHTML = `
      <div class="card"><div class="card-title">Configuracao fiscal</div>
        <div class="form-grid">
          <div class="form-group"><label>Ambiente</label><select id="cfg-fisc-ambiente"><option value="homologacao" ${fiscal.ambiente === 'homologacao' ? 'selected' : ''}>Homologacao</option><option value="producao" ${fiscal.ambiente === 'producao' ? 'selected' : ''}>Producao</option></select></div>
          <div class="form-group"><label>Serie NFC-e</label><input type="text" id="cfg-fisc-serie" value="${fiscal.serieNFCe || '1'}"/></div>
          <div class="form-group"><label>CSC / Token NFC-e</label><input type="text" id="cfg-fisc-csc" value="${fiscal.csc || ''}"/></div>
          <div class="form-group"><label>ID CSC</label><input type="text" id="cfg-fisc-idcsc" value="${fiscal.idCsc || ''}"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Certificado Digital A1 (.pfx/.p12)</label>
            <div style="display:flex;gap:8px;align-items:center;">
              <input type="file" id="cfg-fisc-cert" accept=".pfx,.p12"/>
              <span class="badge ${fiscal.certificado ? 'green' : 'red'}">${fiscal.certificado ? 'Configurado' : 'Nao configurado'}</span>
            </div>
          </div>
          <div class="form-group"><label>Ultimo numero NF</label><input type="number" id="cfg-fisc-ultimo" value="${fiscal.ultimoNumeroNF || 0}"/></div>
          <div class="form-group"><label>Serie NF-e</label><input type="text" id="cfg-fisc-serie-nfe" value="${fiscal.serieNFe || '1'}"/></div>
        </div>
        <button class="btn btn-primary" onclick="window.configuracoes.salvarFiscal()">Salvar configuracao fiscal</button>
      </div>
    `
  }

  async salvarFiscal() {
    const db = window.db.db
    const atual = await db.configuracoes.get('fiscal')
    const cfg = atual ? JSON.parse(atual.valor) : {}
    await db.configuracoes.put({
      chave: 'fiscal',
      valor: JSON.stringify({
        ...cfg,
        ambiente: document.getElementById('cfg-fisc-ambiente').value,
        serieNFCe: document.getElementById('cfg-fisc-serie').value,
        serieNFe: document.getElementById('cfg-fisc-serie-nfe').value,
        csc: document.getElementById('cfg-fisc-csc').value,
        idCsc: document.getElementById('cfg-fisc-idcsc').value,
        certificado: document.getElementById('cfg-fisc-cert').files.length ? 'configurado' : cfg.certificado,
        ultimoNumeroNF: Number(document.getElementById('cfg-fisc-ultimo').value || 0),
      }),
    })
    toast('Configuracao fiscal salva', 'success')
  }

  async renderTEF(el) {
    const db = window.db.db
    let cfg = await db.configuracoes.get('tef')
    let tef = cfg ? JSON.parse(cfg.valor) : { ativo: false, ip: '192.168.1.200', porta: '7777', nome: 'Caixa Padrao' }
    el.innerHTML = `
      <div class="card"><div class="card-title">TEF / Sat / Maquineta</div>
        <div class="form-grid">
          <div class="form-group"><label>Ativar TEF</label><select id="cfg-tef-ativo"><option value="true" ${tef.ativo ? 'selected' : ''}>Sim</option><option value="false" ${!tef.ativo ? 'selected' : ''}>Nao</option></select></div>
          <div class="form-group"><label>Nome do caixa</label><input type="text" id="cfg-tef-nome" value="${tef.nome || 'Caixa Padrao'}"/></div>
          <div class="form-group"><label>IP do TEF</label><input type="text" id="cfg-tef-ip" value="${tef.ip || '192.168.1.200'}"/></div>
          <div class="form-group"><label>Porta</label><input type="text" id="cfg-tef-porta" value="${tef.porta || '7777'}"/></div>
          <div class="form-group"><label>Tipo</label><select id="cfg-tef-tipo"><option value="tef" ${tef.tipo === 'tef' ? 'selected' : ''}>TEF Dial / SiTef</option><option value="sat" ${tef.tipo === 'sat' ? 'selected' : ''}>SAT (SP)</option><option value="pos" ${tef.tipo === 'pos' ? 'selected' : ''}>POS Integrado</option></select></div>
        </div>
        <button class="btn btn-primary" onclick="window.configuracoes.salvarTEF()">Salvar configuracao TEF</button>
      </div>
    `
  }

  async salvarTEF() {
    const db = window.db.db
    await db.configuracoes.put({
      chave: 'tef',
      valor: JSON.stringify({
        ativo: document.getElementById('cfg-tef-ativo').value === 'true',
        nome: document.getElementById('cfg-tef-nome').value.trim(),
        ip: document.getElementById('cfg-tef-ip').value.trim(),
        porta: document.getElementById('cfg-tef-porta').value.trim(),
        tipo: document.getElementById('cfg-tef-tipo').value,
      }),
    })
    toast('Configuracao TEF salva', 'success')
  }

  async renderEmail(el) {
    const db = window.db.db
    let cfg = await db.configuracoes.get('email')
    let email = cfg ? JSON.parse(cfg.valor) : { smtp: '', porta: '587', usuario: '', senha: '', from: '' }
    el.innerHTML = `
      <div class="card"><div class="card-title">Servidor de Email</div>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>SMTP</label><input type="text" id="cfg-email-smtp" value="${email.smtp || ''}" placeholder="smtp.gmail.com"/></div>
          <div class="form-group"><label>Porta</label><input type="text" id="cfg-email-porta" value="${email.porta || '587'}"/></div>
          <div class="form-group"><label>Seguranca</label><select id="cfg-email-tls"><option value="tls" ${email.tls !== false ? 'selected' : ''}>TLS</option><option value="none" ${email.tls === false ? 'selected' : ''}>Sem seguranca</option></select></div>
          <div class="form-group"><label>Email de origem</label><input type="email" id="cfg-email-from" value="${email.from || ''}" placeholder="nao-responda@nexus.com.br"/></div>
          <div class="form-group"><label>Usuario</label><input type="text" id="cfg-email-user" value="${email.usuario || ''}"/></div>
          <div class="form-group"><label>Senha</label><input type="password" id="cfg-email-senha" value="${email.senha || ''}"/></div>
        </div>
        <button class="btn btn-primary" onclick="window.configuracoes.salvarEmail()">Salvar configuracao de email</button>
        <button class="btn btn-secondary" style="margin-left:8px;" onclick="window.configuracoes.testarEmail()">Testar envio</button>
      </div>
    `
  }

  async salvarEmail() {
    const db = window.db.db
    await db.configuracoes.put({
      chave: 'email',
      valor: JSON.stringify({
        smtp: document.getElementById('cfg-email-smtp').value.trim(),
        porta: document.getElementById('cfg-email-porta').value.trim(),
        tls: document.getElementById('cfg-email-tls').value === 'tls',
        from: document.getElementById('cfg-email-from').value.trim(),
        usuario: document.getElementById('cfg-email-user').value.trim(),
        senha: document.getElementById('cfg-email-senha').value,
      }),
    })
    toast('Configuracao de email salva', 'success')
  }

  async testarEmail() {
    toast('Teste de email: funcao disponivel na versao completa com backend', 'info')
  }

  renderSistema(el) {
    el.innerHTML = `
      <div class="card"><div class="card-title">Informacoes do sistema</div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div class="cfg-info-row"><span>Versao</span><span class="badge blue">4.0.0</span></div>
          <div class="cfg-info-row"><span>Banco de dados</span><span class="badge green">IndexedDB (Dexie.js)</span></div>
          <div class="cfg-info-row"><span>Total de tabelas</span><span class="badge cyan">${window.db.db.tables.length}</span></div>
          <div class="cfg-info-row"><span>Framework frontend</span><span class="badge purple">Vanilla JS + Vite</span></div>
          <div class="cfg-info-row"><span>Backend</span><span class="badge purple">Node.js + Express</span></div>
        </div>
      </div>
      <div class="card mt-16"><div class="card-title">Backup e restauracao</div>
        <p style="color:var(--text3);font-size:13px;margin-bottom:12px;">Exporte todos os dados do sistema ou restaure de um backup anterior.</p>
        <div class="gap-8" style="flex-wrap:wrap;">
          <button class="btn btn-secondary" onclick="window.configuracoes.fazerBackup()">Fazer backup completo</button>
          <button class="btn btn-secondary" onclick="document.getElementById('cfg-restore-file').click()">Restaurar backup</button>
          <input type="file" id="cfg-restore-file" accept=".json" style="display:none" onchange="window.configuracoes.restaurar(this)"/>
        </div>
      </div>
      <div class="card mt-16"><div class="card-title">Zona de risco</div>
        <p style="color:var(--text3);font-size:13px;margin-bottom:12px;">As acoes abaixo sao irreversiveis e apagam dados permanentemente.</p>
        <div class="gap-8">
          <button class="btn btn-danger" onclick="window.configuracoes.resetarDados()">Resetar todos os dados</button>
          <button class="btn btn-danger" onclick="window.configuracoes.limparVendas()">Limpar apenas vendas</button>
        </div>
      </div>
    `
  }

  async fazerBackup() {
    const db = window.db.db
    const tables = db.tables
    const backup = {}
    for (const table of tables) {
      backup[table.name] = await table.toArray()
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nexus-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast('Backup baixado com sucesso', 'success')
  }

  async restaurar(input) {
    const file = input.files[0]
    if (!file) return
    if (file.size > 50 * 1024 * 1024) return toast('Arquivo muito grande (max 50MB)', 'error')
    if (!file.name.endsWith('.json')) return toast('Formato invalido. Use arquivo .json', 'error')
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (typeof data !== 'object' || Array.isArray(data)) throw new Error('Formato invalido')
        const db = window.db.db
        const nomesValidos = db.tables.map(t => t.name)
        for (const tableName of Object.keys(data)) {
          if (!nomesValidos.includes(tableName)) throw new Error('Tabela desconhecida: ' + tableName)
          if (!Array.isArray(data[tableName])) throw new Error('Registros invalidos na tabela: ' + tableName)
        }
        for (const [tableName, records] of Object.entries(data)) {
          await db[tableName].clear()
          for (const rec of records) await db[tableName].add(rec)
        }
        toast('Backup restaurado com sucesso', 'success')
      } catch (err) {
        toast('Erro ao restaurar backup: ' + err.message, 'error')
      }
    }
    reader.readAsText(file)
  }

  async resetarDados() {
    if (!confirm('TEM CERTEZA? Isso vai apagar TODOS os dados do sistema!')) return
    if (!confirm('CONFIRMACAO FINAL: Digite CONFIRMAR para prosseguir.')) return
    const db = window.db.db
    for (const table of db.tables) await table.clear()
    await db.seedIfEmpty()
    toast('Dados resetados com sucesso', 'info')
  }

  async limparVendas() {
    if (!confirm('Limpar todas as vendas e itens de venda?')) return
    const db = window.db.db
    await db.vendasPDV.clear()
    await db.itensPDV.clear()
    await db.pagamentosPDV.clear()
    toast('Vendas limpas', 'success')
  }
}
