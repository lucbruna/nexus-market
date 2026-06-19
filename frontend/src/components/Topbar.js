export function renderTopbar() {
  const el = document.getElementById('topbar')
  const user = window.app?.usuarioLogado
  el.innerHTML = `
    <div class="topbar-left">
      <button class="tb-btn" onclick="toggleSidebar()">☰</button>
      <span class="topbar-title">📊 Dashboard</span>
    </div>
    <div class="topbar-right">
      <span class="date-badge"></span>
      <span style="font-size:12px;color:var(--text2);margin-right:8px;">${user ? user.login + ' (' + (user.perfil||'') + ')' : ''}</span>
      <button class="tb-btn" onclick="window.navigate('configuracoes')">⚙️</button>
      <button class="tb-btn primary" onclick="window.navigate('pdv')">🏪 PDV</button>
      <button class="tb-btn" onclick="window.app?.logout()" title="Sair" style="color:#e74c3c;">🚪</button>
    </div>
  `
}
