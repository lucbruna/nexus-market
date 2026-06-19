import { esc, toast, openModal, closeModal } from '../../utils/format.js'

const SETORES = [
  { id: 'dashboard', nome: 'Dashboard' },
  { id: 'pdv', nome: 'PDV / Frente Caixa' },
  { id: 'produtos', nome: 'Cadastro Produtos' },
  { id: 'estoque', nome: 'Estoque' },
  { id: 'compras', nome: 'Compras' },
  { id: 'clientes', nome: 'Clientes / CRM' },
  { id: 'financeiro', nome: 'Financeiro' },
  { id: 'rh', nome: 'RH / Pessoal' },
  { id: 'frota', nome: 'Frota / Transporte' },
  { id: 'fiscal', nome: 'Fiscal / NFe' },
  { id: 'relatorios', nome: 'Relatorios' },
  { id: 'configuracoes', nome: 'Configuracoes' },
]

const SETORES_IDS = SETORES.map(s => s.id)

export class Usuarios {
  constructor() {
    this.editandoId = null
    this.usuarioLogado = null
  }

  async render() {
    await this.carregarSessao()
    const el = document.getElementById('page-usuarios')
    const isAdmin = this.usuarioLogado?.perfil === 'admin'
    const podeGerenciar = this.usuarioLogado?.perfil === 'admin' || this.usuarioLogado?.perfil === 'gerente'

    el.innerHTML = `
      <div class="section-header">
        <h2>Usuarios e Permissoes</h2>
        <div class="gap-8">
          <span class="badge ${this.usuarioLogado?.perfil === 'admin' ? 'red' : this.usuarioLogado?.perfil === 'gerente' ? 'yellow' : 'blue'}">
            ${this.usuarioLogado?.login || 'Nao logado'} (${this.usuarioLogado?.perfil || '-'})
          </span>
          <button class="btn btn-primary" onclick="window.usuarios.abrirForm()" ${!podeGerenciar ? 'disabled' : ''}>Novo usuario</button>
        </div>
      </div>
      <div class="card">
        <div class="card-title">Controle de acesso por perfil e setor</div>
        <div class="grid-2">
          <div class="ind-card">
            <span class="ind-label">Administrador</span>
            <span class="ind-value">Acesso total</span>
            <span class="ind-sub">Pode gerenciar todos os usuarios e modulos</span>
          </div>
          <div class="ind-card">
            <span class="ind-label">Gerente de setor</span>
            <span class="ind-value">Acesso por setor</span>
            <span class="ind-sub">Gerencia usuarios apenas dos setores autorizados</span>
          </div>
          <div class="ind-card" style="grid-column:span 2;">
            <span class="ind-label">Operador</span>
            <span class="ind-value">Acesso operacional restrito</span>
            <span class="ind-sub">Apenas visualiza e opera nos setores liberados</span>
          </div>
        </div>
        <div id="usuarios-table-wrap" class="mt-16"></div>
      </div>
    `
    window.usuarios = this
    this.renderModalForm()
    await this.loadData()
  }

  async carregarSessao() {
    const db = window.db.db
    const usuarios = await db.usuarios.toArray()
    const adminExists = usuarios.some(u => u.perfil === 'admin')
    if (!adminExists) {
      const { hashSenha } = await import('../../services/database.js')
      const hash = await hashSenha('admin')
      await db.usuarios.add({
        login: 'admin', email: 'admin@nexus.com.br',
        senha: hash, perfil: 'admin',
        setores: SETORES_IDS
      })
    }
    const stored = localStorage.getItem('nexus_usuario_logado')
    if (stored) {
      try { this.usuarioLogado = JSON.parse(stored) } catch (e) { this.usuarioLogado = null }
    }
  }

  async loadData() {
    const db = window.db.db
    const usuarios = await db.usuarios.toArray()
    const podeGerenciar = this.usuarioLogado?.perfil === 'admin'
    const setoresGerente = this.usuarioLogado?.setores || []

    let lista = usuarios
    if (this.usuarioLogado?.perfil === 'gerente') {
      lista = usuarios.filter(u => u.perfil !== 'admin')
      lista = lista.filter(u => {
        if (u.perfil === 'gerente') return true
        return (u.setores || []).some(s => setoresGerente.includes(s))
      })
    }

    document.getElementById('usuarios-table-wrap').innerHTML = lista.length ? `
      <div class="tbl-wrap"><table>
        <thead><tr><th>Login</th><th>Email</th><th>Perfil</th><th>Setores liberados</th><th>Regra de acesso</th><th>Acoes</th></tr></thead>
        <tbody>${lista.map(u => `
          <tr>
            <td><strong>${esc(u.login)}</strong></td>
            <td>${esc(u.email || '-')}</td>
            <td><span class="badge ${u.perfil === 'admin' ? 'red' : u.perfil === 'gerente' ? 'yellow' : 'blue'}">${esc(u.perfil || 'operador')}</span></td>
            <td style="font-size:11px;">${esc((u.setores || []).map(s => SETORES.find(st => st.id === s)?.nome || s).join(', ') || '-')}</td>
            <td style="font-size:11px;color:var(--text2);">
              ${u.perfil === 'admin' ? 'Acesso irrestrito a todos os modulos' :
                u.perfil === 'gerente' ? 'Gerencia setores autorizados e usuarios vinculados' :
                'Acesso operacional restrito aos setores liberados'}
            </td>
            <td>
              ${podeGerenciar ? `<button class="btn btn-sm btn-secondary" onclick="window.usuarios.editar(${u.id})">Editar</button>` : ''}
              ${podeGerenciar && u.id !== this.usuarioLogado?.id ? `<button class="btn btn-sm btn-danger" onclick="window.usuarios.excluir(${u.id})">Excluir</button>` : ''}
            </td>
          </tr>
        `).join('')}</tbody></table>
      </div>` : '<div class="empty-state"><p>Nenhum usuario cadastrado</p></div>'
  }

  abrirForm() {
    const isAdmin = this.usuarioLogado?.perfil === 'admin'
    const isGerente = this.usuarioLogado?.perfil === 'gerente'
    this.editandoId = null
    document.getElementById('modal-user-title').textContent = 'Novo usuario'
    ;['user-login', 'user-email', 'user-senha'].forEach(id => document.getElementById(id).value = '')
    document.getElementById('user-perfil').value = 'operador'
    document.getElementById('user-perfil').querySelectorAll('option').forEach(o => {
      o.disabled = false
      if (!isAdmin && (o.value === 'admin' || o.value === 'gerente')) o.disabled = true
    })
    if (!isAdmin && isGerente) {
      document.getElementById('user-perfil').value = 'operador'
    }
    this.renderSetoresCheckboxes()
    if (!isAdmin && isGerente) {
      const setoresGerente = this.usuarioLogado?.setores || []
      document.querySelectorAll('.user-setor').forEach(c => {
        if (!setoresGerente.includes(c.value)) c.disabled = true
      })
    }
    openModal('modal-usuario')
  }

  renderSetoresCheckboxes() {
    const container = document.getElementById('user-setores-container')
    if (!container) return
    container.innerHTML = SETORES.map(s =>
      `<label style="font-size:12px;display:flex;align-items:center;gap:4px;cursor:pointer;padding:2px 0;">
        <input class="user-setor" type="checkbox" value="${s.id}" /> ${s.nome}
      </label>`
    ).join('')
  }

  async editar(id) {
    const u = await window.db.db.usuarios.get(id)
    if (!u) return
    const isAdmin = this.usuarioLogado?.perfil === 'admin'
    if (!isAdmin && u.perfil === 'admin') return toast('Apenas admin pode editar admin', 'error')
    this.editandoId = id
    document.getElementById('modal-user-title').textContent = 'Editar usuario'
    document.getElementById('user-login').value = u.login
    document.getElementById('user-email').value = u.email || ''
    document.getElementById('user-senha').value = ''
    document.getElementById('user-perfil').value = u.perfil || 'operador'
    this.renderSetoresCheckboxes()
    document.querySelectorAll('.user-setor').forEach(c => c.checked = (u.setores || []).includes(c.value))
    openModal('modal-usuario')
  }

  setSetores(setores) {
    document.querySelectorAll('.user-setor').forEach(c => c.checked = setores.includes(c.value))
  }

  async salvar() {
    const db = window.db.db
    const perfil = document.getElementById('user-perfil').value
    const setores = perfil === 'admin' ? SETORES_IDS : Array.from(document.querySelectorAll('.user-setor:checked')).map(c => c.value)
    const data = { login: document.getElementById('user-login').value.trim(), email: document.getElementById('user-email').value.trim(), perfil, setores }
    const senha = document.getElementById('user-senha').value
    if (!data.login) return toast('Informe login', 'error')
    if (perfil !== 'admin' && !setores.length) return toast('Selecione setores autorizados', 'error')
    if (this.editandoId) {
      if (senha) data.senha = await window.hashSenha ? await window.hashSenha(senha) : senha
      await db.usuarios.update(this.editandoId, data)
      toast('Usuario atualizado', 'success')
    } else {
      if (!senha) return toast('Informe senha', 'error')
      const existing = await db.usuarios.filter(u => u.login === data.login).first()
      if (existing) return toast('Login ja existe', 'error')
      const { hashSenha } = await import('../../services/database.js')
      await db.usuarios.add({ ...data, senha: await hashSenha(senha) })
      toast('Usuario criado', 'success')
    }
    closeModal('modal-usuario')
    await this.loadData()
  }

  async excluir(id) {
    if (!confirm('Excluir usuario?')) return
    if (id === this.usuarioLogado?.id) return toast('Nao pode excluir a si mesmo', 'error')
    await window.db.db.usuarios.delete(id)
    toast('Usuario excluido', 'info')
    await this.loadData()
  }

  renderModalForm() {
    if (document.getElementById('modal-usuario')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'
    div.id = 'modal-usuario'
    div.innerHTML = `<div class="modal"><h2 id="modal-user-title">Novo usuario</h2><div class="form-grid">
      <div class="form-group"><label>Login</label><input id="user-login"/></div>
      <div class="form-group"><label>Perfil</label><select id="user-perfil">
        <option value="operador">Operador (acesso restrito)</option>
        <option value="gerente">Gerente de setor</option>
        <option value="admin">Administrador (acesso total)</option>
      </select></div>
      <div class="form-group"><label>Email</label><input id="user-email" type="email"/></div>
      <div class="form-group"><label>Senha</label><input id="user-senha" type="password"/></div>
      <div class="form-group" style="grid-column:span 2"><label>Setores autorizados</label>
        <div id="user-setores-container" style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-top:4px;"></div>
      </div>
    </div><div class="modal-footer">
      <button class="btn btn-secondary" onclick="window.closeModal('modal-usuario')">Cancelar</button>
      <button class="btn btn-primary" onclick="window.usuarios.salvar()">Salvar</button>
    </div></div>`
    document.body.appendChild(div)
  }
}
