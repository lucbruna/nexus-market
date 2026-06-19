import { renderSidebar } from './components/Sidebar.js'
import { renderTopbar } from './components/Topbar.js'
import { toast } from './utils/format.js'

import { Dashboard } from './pages/Dashboard/Dashboard.js'
import { PDV } from './pages/PDV/PDV.js'
import { Produtos } from './pages/Estoque/Produtos.js'
import { Estoque } from './pages/Estoque/Estoque.js'
import { Validade } from './pages/Estoque/Validade.js'
import { Inventario } from './pages/Estoque/Inventario.js'
import { Fornecedores } from './pages/Compras/Fornecedores.js'
import { PedidosCompra } from './pages/Compras/PedidosCompra.js'
import { Recebimento } from './pages/Compras/Recebimento.js'
import { Clientes } from './pages/CRM/Clientes.js'
import { Fidelidade } from './pages/CRM/Fidelidade.js'
import { Credito } from './pages/Financeiro/Credito.js'
import { Caixa } from './pages/Financeiro/Caixa.js'
import { ContasPagar } from './pages/Financeiro/ContasPagar.js'
import { ContasReceber } from './pages/Financeiro/ContasReceber.js'
import { DRE } from './pages/Financeiro/DRE.js'
import { FluxoCaixa } from './pages/Financeiro/FluxoCaixa.js'
import { Funcionarios } from './pages/RH/Funcionarios.js'
import { Ponto } from './pages/RH/Ponto.js'
import { Folha } from './pages/RH/Folha.js'
import { Transporte } from './pages/Frota/Transporte.js'
import { Frota } from './pages/Frota/Frota.js'
import { Delivery } from './pages/Delivery/Delivery.js'
import { Fiscal } from './pages/Fiscal/Fiscal.js'
import { Tributacao } from './pages/Fiscal/Tributacao.js'
import { Relatorios } from './pages/Relatorios/Relatorios.js'
import { VendasHist } from './pages/Vendas/VendasHist.js'
import { Configuracoes } from './pages/Configuracoes/Configuracoes.js'
import { Usuarios } from './pages/Configuracoes/Usuarios.js'
import {
  Perdas, Transferencias, CurvaABC, Cotacoes, CRM, Convenios, Conciliacao,
  ContratosRH, Ferias, Rescisao, NFeEntrada, SPED, Backup,
} from './pages/Operacional/ModulosOperacionais.js'

const PAGE_TITLES = {
  dashboard:'Dashboard', pdv:'Frente de Caixa (PDV)',
  produtos:'Cadastro de Produtos', estoque:'Controle de Estoque',
  validade:'Validade e Lotes', inventario:'Inventario / Ajustes',
  perdas:'Perdas e Quebras', transferencias:'Transferencias',
  'curva-abc':'Curva ABC',
  fornecedores:'Fornecedores', cotacoes:'Cotacoes',
  'pedidos-compra':'Pedidos de Compra', recebimento:'Recebimento',
  clientes:'Clientes', crm:'CRM / Oportunidades',
  fidelidade:'Programa Fidelidade', credito:'Crediario/Fiado',
  convenios:'Convenios',
  caixa:'Caixa Geral', 'contas-pagar':'Contas a Pagar',
  'contas-receber':'Contas a Receber', dre:'DRE / Resultados',
  fluxo:'Fluxo de Caixa', conciliacao:'Conciliacao',
  funcionarios:'Funcionarios', 'contratos-rh':'Contratos',
  ponto:'Ponto Eletronico', folha:'Folha de Pagamento',
  ferias:'Ferias', rescisao:'Rescisoes',
  transporte:'Transportes', frota:'Frota',
  entrega:'Delivery / Entregas',
  fiscal:'Emissor NF-e / NFC-e', 'nfe-entrada':'NF-e Entrada',
  sped:'SPED Fiscal', tributacao:'Tributacao',
  relatorios:'Relatorios Gerenciais', 'vendas-hist':'Historico de Vendas',
  configuracoes:'Configuracoes', usuarios:'Usuarios e Permissoes',
  backup:'Backup & Restore',
}

export class App {
  constructor() {
    this.currentPage = 'dashboard'
    this.pages = {}
    this.usuarioLogado = null
  }

  async init() {
    const root = document.getElementById('root')
    root.innerHTML = `<nav id="sidebar"></nav><div id="content"><div id="topbar"></div></div>`
    await this.carregarSessao()
    renderSidebar()
    renderTopbar()
    this.registerPages()
    await this.navigate('dashboard')
    this.updateClock()
    setInterval(() => this.updateClock(), 1000)
    this.iniciarTimeoutSessao()
    this.ouvirAtividade()
  }

  async carregarSessao() {
    const stored = localStorage.getItem('nexus_usuario_logado')
    if (stored) {
      try { this.usuarioLogado = JSON.parse(stored) } catch (e) { this.usuarioLogado = null }
    }
    if (!this.usuarioLogado) {
      await this.mostrarLogin()
    }
  }

  async mostrarLogin() {
    return new Promise(resolve => {
      const overlay = document.createElement('div')
      overlay.id = 'login-overlay'
      overlay.style.cssText = 'position:fixed;inset:0;background:var(--bg1);display:flex;align-items:center;justify-content:center;z-index:9999;'
      overlay.innerHTML = `
        <div style="background:var(--bg2);padding:40px;border-radius:16px;width:360px;box-shadow:0 8px 32px rgba(0,0,0,.3);text-align:center;">
          <div style="font-size:48px;margin-bottom:12px;">🛒</div>
          <h1 style="margin-bottom:4px;">NEXUS Market AI</h1>
          <p style="color:var(--text3);margin-bottom:24px;font-size:13px;">ERP para Supermercados</p>
          <div class="form-group"><label>Login</label><input id="login-user" style="width:100%;" autocomplete="username"/></div>
          <div class="form-group" style="margin-top:12px;"><label>Senha</label><input id="login-pass" type="password" style="width:100%;" autocomplete="current-password"/></div>
          <div id="login-error" style="color:#e74c3c;font-size:12px;margin-top:8px;display:none;"></div>
          <button id="login-btn" class="btn btn-primary" style="width:100%;margin-top:16px;">Entrar</button>
        </div>`
      document.body.appendChild(overlay)
      const btn = overlay.querySelector('#login-btn')
      const userInput = overlay.querySelector('#login-user')
      const passInput = overlay.querySelector('#login-pass')
      const errEl = overlay.querySelector('#login-error')
      const login = async () => {
        const login = userInput.value.trim()
        const senha = passInput.value
        if (!login || !senha) { errEl.textContent = 'Informe login e senha'; errEl.style.display = ''; return }
        const { hashSenha } = await import('./services/database.js')
        const hash = await hashSenha(senha)
        const db = window.db.db
        const usuario = await db.usuarios.filter(u => u.login === login && u.senha === hash).first()
        if (usuario) {
          this.usuarioLogado = usuario
          localStorage.setItem('nexus_usuario_logado', JSON.stringify(usuario))
          overlay.remove()
          resolve()
        } else {
          errEl.textContent = 'Login ou senha incorretos'
          errEl.style.display = ''
        }
      }
      btn.addEventListener('click', login)
      passInput.addEventListener('keydown', e => { if (e.key === 'Enter') login() })
      userInput.focus()
    })
  }

  logout() {
    localStorage.removeItem('nexus_usuario_logado')
    this.usuarioLogado = null
    if (this._timeoutSessao) clearTimeout(this._timeoutSessao)
    document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => m.classList.add('hidden'))
    document.getElementById('login-overlay')?.remove()
    this.mostrarLogin().then(() => {
      renderSidebar()
      renderTopbar()
      this.navigate('dashboard')
    })
  }

  iniciarTimeoutSessao() {
    if (this._timeoutSessao) clearTimeout(this._timeoutSessao)
    this._timeoutSessao = setTimeout(() => {
      toast('Sessao expirada por inatividade', 'info')
      this.logout()
    }, 30 * 60 * 1000)
  }

  ouvirAtividade() {
    const reset = () => this.iniciarTimeoutSessao()
    document.addEventListener('click', reset)
    document.addEventListener('keydown', reset)
    document.addEventListener('mousemove', reset)
    document.addEventListener('touchstart', reset)
  }

  verificarAcesso(page) {
    if (!this.usuarioLogado) return true
    if (this.usuarioLogado.perfil === 'admin') return true
    const setores = this.usuarioLogado.setores || []
    if (setores.includes(page)) return true
    const map = {
      dashboard: 'dashboard', pdv: 'pdv',
      produtos: 'produtos', estoque: 'estoque', validade: 'estoque', inventario: 'estoque',
      perdas: 'estoque', transferencias: 'estoque', 'curva-abc': 'estoque',
      fornecedores: 'compras', cotacoes: 'compras', 'pedidos-compra': 'compras', recebimento: 'compras',
      clientes: 'clientes', crm: 'clientes', fidelidade: 'clientes',
      credito: 'financeiro', convenios: 'financeiro',
      caixa: 'financeiro', 'contas-pagar': 'financeiro', 'contas-receber': 'financeiro',
      dre: 'financeiro', fluxo: 'financeiro', conciliacao: 'financeiro',
      funcionarios: 'rh', 'contratos-rh': 'rh', ponto: 'rh', folha: 'rh',
      ferias: 'rh', rescisao: 'rh',
      transporte: 'frota', frota: 'frota', entrega: 'frota',
      fiscal: 'fiscal', 'nfe-entrada': 'fiscal', sped: 'fiscal', tributacao: 'fiscal',
      relatorios: 'relatorios', 'vendas-hist': 'relatorios',
      configuracoes: 'configuracoes', usuarios: 'configuracoes', backup: 'configuracoes',
    }
    return setores.includes(map[page] || page)
  }

  registerPages() {
    this.pages = {
      dashboard:       new Dashboard(),
      pdv:             new PDV(),
      produtos:        new Produtos(),
      estoque:         new Estoque(),
      validade:        new Validade(),
      inventario:      new Inventario(),
      perdas:          new Perdas(),
      transferencias:  new Transferencias(),
      'curva-abc':     new CurvaABC(),
      fornecedores:    new Fornecedores(),
      cotacoes:        new Cotacoes(),
      'pedidos-compra':new PedidosCompra(),
      recebimento:     new Recebimento(),
      clientes:        new Clientes(),
      crm:             new CRM(),
      fidelidade:      new Fidelidade(),
      convenios:       new Convenios(),
      credito:         new Credito(),
      caixa:           new Caixa(),
      'contas-pagar':  new ContasPagar(),
      'contas-receber':new ContasReceber(),
      dre:             new DRE(),
      fluxo:           new FluxoCaixa(),
      conciliacao:     new Conciliacao(),
      funcionarios:    new Funcionarios(),
      'contratos-rh':  new ContratosRH(),
      ponto:           new Ponto(),
      folha:           new Folha(),
      ferias:          new Ferias(),
      rescisao:        new Rescisao(),
      transporte:      new Transporte(),
      frota:           new Frota(),
      entrega:         new Delivery(),
      fiscal:          new Fiscal(),
      'nfe-entrada':   new NFeEntrada(),
      sped:            new SPED(),
      tributacao:      new Tributacao(),
      relatorios:      new Relatorios(),
      'vendas-hist':   new VendasHist(),
      configuracoes:   new Configuracoes(),
      usuarios:        new Usuarios(),
      backup:          new Backup(),
    }
  }

  async navigate(page) {
    if (!this.verificarAcesso(page)) {
      this.showSemAcesso(page)
      return
    }

    document.querySelectorAll('[id^="page-"]').forEach(el => {
      el.classList.add('page-hidden')
      el.classList.remove('page')
    })
    let el = document.getElementById('page-' + page)
    if (!el) {
      el = document.createElement('div')
      el.id = 'page-' + page
      el.className = 'page page-hidden'
      document.getElementById('content').appendChild(el)
    }
    el.classList.remove('page-hidden')
    el.classList.add('page')

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'))
    document.querySelectorAll('.nav-item').forEach(n => {
      if (n.dataset.page === page) n.classList.add('active')
    })
    document.querySelector('.topbar-title').textContent = PAGE_TITLES[page] || page
    this.currentPage = page

    if (this.pages[page]) {
      await this.pages[page].render()
    } else {
      el.innerHTML = `
        <div class="empty-state">
          <div class="icon">🚧</div>
          <p style="font-size:18px;margin-bottom:8px;"><strong>${PAGE_TITLES[page]||page}</strong></p>
          <p>Modulo nao cadastrado no menu principal</p>
          <p style="font-size:12px;color:var(--text3);margin-top:8px;">Verifique o identificador da rota: ${page}</p>
        </div>`
    }
  }

  showSemAcesso(page) {
    const el = document.getElementById('page-' + page) || (() => {
      const e = document.createElement('div')
      e.id = 'page-' + page
      e.className = 'page page-hidden'
      document.getElementById('content').appendChild(e)
      return e
    })()
    document.querySelectorAll('[id^="page-"]').forEach(p => { p.classList.add('page-hidden'); p.classList.remove('page') })
    el.classList.remove('page-hidden'); el.classList.add('page')
    document.querySelector('.topbar-title').textContent = PAGE_TITLES[page] || page
    el.innerHTML = `
      <div class="empty-state">
        <div class="icon">🔒</div>
        <p style="font-size:18px;margin-bottom:8px;"><strong>Acesso negado</strong></p>
        <p>Seu perfil nao tem permissao para acessar este modulo.</p>
        <p style="font-size:12px;color:var(--text3);margin-top:8px;">Entre em contato com o administrador.</p>
      </div>`
  }

  updateClock() {
    const now = new Date()
    const el = document.querySelector('.date-badge')
    if (el) el.textContent = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }
}

window.navigate = (page) => window.app?.navigate(page)
window.toggleSidebar = () => document.getElementById('sidebar')?.classList.toggle('collapsed')
