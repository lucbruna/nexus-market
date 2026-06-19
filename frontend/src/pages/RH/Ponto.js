import { toast, openModal, closeModal } from '../../utils/format.js'

export class Ponto {
  constructor() {
    this.stream = null
  }

  async render() {
    const el = document.getElementById('page-ponto')
    el.innerHTML = `
      <div class="section-header">
        <h2>Ponto Eletronico</h2>
        <button class="btn btn-primary" onclick="window.ponto.registrarBatida()">Registrar batida</button>
      </div>
      <div class="kpi-grid" id="ponto-kpis"></div>
      <div class="card"><div class="card-title">Registros do dia</div><div id="ponto-table-wrap"></div></div>
    `
    window.ponto = this
    this.renderModalBatida()
    await this.loadData()
  }

  async loadData() {
    const db = window.db.db
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
    const amanha = new Date(hoje); amanha.setDate(amanha.getDate() + 1)
    const batidas = await db.pontoBiometrico.filter(b => new Date(b.data) >= hoje && new Date(b.data) < amanha).toArray()
    batidas.sort((a, b) => new Date(b.data) - new Date(a.data))
    const funcMap = Object.fromEntries((await db.funcionarios.toArray()).map(f => [f.id, f]))
    document.getElementById('ponto-kpis').innerHTML = `
      <div class="kpi green"><div class="kpi-label">Batidas hoje</div><div class="kpi-value">${batidas.length}</div></div>
      <div class="kpi blue"><div class="kpi-label">Dedo</div><div class="kpi-value">${batidas.filter(b => b.metodo === 'biometria_digital').length}</div></div>
      <div class="kpi purple"><div class="kpi-label">Facial</div><div class="kpi-value">${batidas.filter(b => b.metodo === 'biometria_facial').length}</div></div>
      <div class="kpi yellow"><div class="kpi-label">Relogio</div><div class="kpi-value">${batidas.filter(b => b.metodo === 'relogio_tradicional').length}</div></div>
    `
    document.getElementById('ponto-table-wrap').innerHTML = batidas.length ? `
      <div class="tbl-wrap"><table><thead><tr><th>Funcionario</th><th>Data</th><th>Hora</th><th>Tipo</th><th>Metodo</th><th>Equipamento</th><th>Autenticacao</th></tr></thead>
      <tbody>${batidas.map(b => {
        const funcNome = funcMap[b.funcionarioId]?.nome || '-'
        const d = new Date(b.data)
        return `<tr><td><strong>${funcNome}</strong></td><td class="text-mono">${d.toLocaleDateString('pt-BR')}</td><td class="text-mono">${d.toLocaleTimeString('pt-BR')}</td><td><span class="badge blue">${b.tipo}</span></td><td>${this.metodoLabel(b.metodo)}</td><td>${b.equipamento || '-'}</td><td><span class="badge ${b.confianca >= 80 ? 'green' : 'yellow'}">${b.confianca || 100}%</span></td></tr>`
      }).join('')}</tbody></table></div>
    ` : '<div class="empty-state"><p>Nenhuma batida registrada hoje</p></div>'
  }

  metodoLabel(metodo) {
    return ({ biometria_digital: 'Biometrico por dedo', biometria_facial: 'Biometrico facial', relogio_tradicional: 'Relogio tradicional' })[metodo] || metodo
  }

  webAuthnDisponivel() {
    return !!window.PublicKeyCredential
  }

  async registrarDigital(funcionarioId, funcionarioNome) {
    if (!this.webAuthnDisponivel()) {
      toast('WebAuthn nao disponivel neste navegador. Use Windows Edge/Chrome com Windows Hello.', 'error')
      return false
    }
    try {
      const challenge = crypto.getRandomValues(new Uint8Array(32))
      const userId = new Uint8Array(4)
      new DataView(userId.buffer).setUint32(0, funcionarioId, true)

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { id: location.hostname, name: 'NEXUS Market AI' },
          user: { id: userId, name: funcionarioNome, displayName: funcionarioNome },
          pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          timeout: 30000,
        },
      })
      if (!credential) return false
      const db = window.db.db
      await db.funcionarios.update(funcionarioId, {
        webauthnId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
      })
      toast('Digital cadastrada com Windows Hello', 'success')
      return true
    } catch (err) {
      toast('Erro ao cadastrar digital: ' + err.message, 'error')
      return false
    }
  }

  async verificarDigital(funcionarioId) {
    if (!this.webAuthnDisponivel()) return false
    const db = window.db.db
    const func = await db.funcionarios.get(funcionarioId)
    if (!func?.webauthnId) return false
    try {
      const challenge = crypto.getRandomValues(new Uint8Array(32))
      const rawId = Uint8Array.from(atob(func.webauthnId), c => c.charCodeAt(0))
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [{ id: rawId, type: 'public-key', transports: ['internal'] }],
          userVerification: 'required',
          timeout: 30000,
        },
      })
      return !!assertion
    } catch (err) {
      return false
    }
  }

  async registrarBatida() {
    const db = window.db.db
    const funcs = await db.funcionarios.toArray()
    if (!funcs.length) return toast('Nenhum funcionario cadastrado', 'error')

    const sel = document.getElementById('bat-funcionario')
    sel.innerHTML = '<option value="">Selecione...</option>' + funcs.map(f => `<option value="${f.id}">${f.nome}${f.webauthnId ? ' (digital cadastrada)' : ''}</option>`).join('')

    document.getElementById('bat-foto-preview').innerHTML = ''
    document.getElementById('bat-camera-box').classList.add('hidden')
    document.getElementById('bat-resultado').classList.add('hidden')
    document.getElementById('bat-webauthn-status').classList.add('hidden')
    document.getElementById('bat-metodo').value = 'relogio_tradicional'

    const hasWebAuthn = this.webAuthnDisponivel()
    const optDigital = document.querySelector('#bat-metodo option[value="biometria_digital"]')
    if (optDigital) {
      optDigital.textContent = hasWebAuthn
        ? 'Biometrico por dedo (Windows Hello - biometria real)'
        : 'Biometrico por dedo (indisponivel - sem WebAuthn)'
      optDigital.disabled = !hasWebAuthn
    }

    openModal('modal-batida')
  }

  async capturarCamera() {
    try {
      const video = document.getElementById('bat-camera-video')
      const box = document.getElementById('bat-camera-box')
      const btnAtivar = document.getElementById('btn-ativar-camera')
      const btnFoto = document.getElementById('btn-tirar-foto')

      if (this.stream) {
        this.stream.getTracks().forEach(t => t.stop())
        this.stream = null
        box.classList.add('hidden')
        btnFoto.classList.add('hidden')
        btnAtivar.textContent = 'Ativar camera'
        return
      }

      this.stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' } })
      video.srcObject = this.stream
      box.classList.remove('hidden')
      btnFoto.classList.remove('hidden')
      btnAtivar.textContent = 'Desativar camera'
      await video.play()

      document.getElementById('bat-foto-preview').innerHTML = '<span style="font-size:12px;color:var(--text3);">Camera ativa. Clique em "Tirar foto" para capturar.</span>'
    } catch (err) {
      toast('Erro ao acessar camera: ' + err.message, 'error')
    }
  }

  tirarFoto() {
    const video = document.getElementById('bat-camera-video')
    const canvas = document.createElement('canvas')
    canvas.width = 320; canvas.height = 240
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, 320, 240)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)

    this.fotoCapturada = dataUrl
    document.getElementById('bat-foto-preview').innerHTML = `
      <img src="${dataUrl}" style="width:120px;height:90px;border-radius:8px;border:2px solid var(--green);object-fit:cover;"/>
      <span style="font-size:11px;color:var(--green);">Foto capturada</span>
    `

    document.getElementById('bat-camera-box').classList.add('hidden')
    if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); this.stream = null }
  }

  async salvar() {
    const db = window.db.db
    const funcionarioId = Number(document.getElementById('bat-funcionario').value)
    if (!funcionarioId) return toast('Selecione um funcionario', 'error')

    const metodo = document.getElementById('bat-metodo').value
    let confianca = 100
    let foto = null

    if (metodo === 'biometria_facial') {
      if (!this.fotoCapturada) return toast('Tire a foto do funcionario primeiro', 'error')
      foto = this.fotoCapturada
      confianca = 95
    }

    if (metodo === 'biometria_digital') {
      const func = await db.funcionarios.get(funcionarioId)
      if (func?.webauthnId) {
        const ok = await this.verificarDigital(funcionarioId)
        if (!ok) return toast('Falha na verificacao da digital. Tente novamente.', 'error')
        confianca = 98
      } else {
        const cadastrou = await this.registrarDigital(funcionarioId, func?.nome || 'Funcionario')
        if (!cadastrou) return
        confianca = 100
      }
    }

    await db.pontoBiometrico.add({
      funcionarioId,
      data: new Date().toISOString(),
      tipo: document.getElementById('bat-tipo').value,
      metodo,
      equipamento: metodo === 'biometria_facial'
        ? 'Webcam integrada'
        : metodo === 'biometria_digital'
          ? 'Windows Hello (biometria real)'
          : document.getElementById('bat-equipamento').value.trim() || 'Relogio padrao',
      confianca,
      foto,
    })
    toast('Batida registrada', 'success')
    this.fotoCapturada = null
    if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); this.stream = null }
    closeModal('modal-batida')
    await this.loadData()
  }

  renderModalBatida() {
    if (document.getElementById('modal-batida')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'
    div.id = 'modal-batida'
    div.innerHTML = `
      <div class="modal" style="min-width:520px;">
        <h2>Registrar batida de ponto</h2>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Funcionario</label><select id="bat-funcionario"></select></div>
          <div class="form-group"><label>Tipo</label><select id="bat-tipo"><option value="entrada">Entrada</option><option value="saida_almoco">Saida almoco</option><option value="retorno_almoco">Retorno almoco</option><option value="saida">Saida</option></select></div>
          <div class="form-group"><label>Metodo biometrico</label><select id="bat-metodo" onchange="window.ponto.onMetodoChange()">
            <option value="relogio_tradicional">Relogio tradicional (manual)</option>
            <option value="biometria_digital">Biometrico por dedo</option>
            <option value="biometria_facial">Biometrico facial (webcam)</option>
          </select></div>
          <div class="form-group" id="bat-equipamento-group"><label>Equipamento</label><input id="bat-equipamento" placeholder="Relogio REP, tablet, leitor..."/></div>
        </div>
        <div id="bat-webauthn-status" class="bat-webauthn-status hidden">
          <span>Status: aguardando leitor biometrico...</span>
        </div>
        <div class="bat-camera-area" id="bat-camera-area">
          <div class="bat-camera-buttons">
            <button type="button" class="btn btn-secondary" onclick="window.ponto.capturarCamera()" id="btn-ativar-camera">Ativar camera</button>
            <button type="button" class="btn btn-primary hidden" onclick="window.ponto.tirarFoto()" id="btn-tirar-foto">Tirar foto</button>
          </div>
          <div id="bat-camera-box" class="bat-camera-box hidden">
            <video id="bat-camera-video" autoplay playsinline></video>
          </div>
          <div id="bat-foto-preview" class="bat-foto-preview"></div>
          <div id="bat-resultado" class="hidden"></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.ponto.cancelarCamera(); window.closeModal('modal-batida')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.ponto.salvar()">Registrar batida</button>
        </div>
      </div>`
    document.body.appendChild(div)
  }

  onMetodoChange() {
    const metodo = document.getElementById('bat-metodo').value
    const camArea = document.getElementById('bat-camera-area')
    const eqGroup = document.getElementById('bat-equipamento-group')
    const btnCamera = document.getElementById('btn-ativar-camera')
    const btnFoto = document.getElementById('btn-tirar-foto')
    const waStatus = document.getElementById('bat-webauthn-status')

    if (metodo === 'biometria_facial') {
      camArea.style.display = 'block'
      eqGroup.style.display = 'none'
      btnCamera.classList.remove('hidden')
      waStatus.classList.add('hidden')
    } else if (metodo === 'biometria_digital') {
      camArea.style.display = 'none'
      eqGroup.style.display = 'none'
      waStatus.classList.remove('hidden')
      waStatus.innerHTML = '<span>Windows Hello: ao clicar em "Registrar batida", o leitor biometrico do sistema sera acionado.</span>'
    } else {
      camArea.style.display = 'none'
      eqGroup.style.display = 'block'
      waStatus.classList.add('hidden')
    }
  }

  cancelarCamera() {
    if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); this.stream = null }
    this.fotoCapturada = null
  }
}
