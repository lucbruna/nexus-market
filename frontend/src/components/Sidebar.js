const MENU_GROUPS = [
  { label: 'Principal', items: [
    { page: 'dashboard', icon: '📊', text: 'Dashboard' },
    { page: 'pdv', icon: '🏪', text: 'Frente de Caixa (PDV)' },
  ]},
  { label: 'Estoque', key: 'estoque', items: [
    { page: 'produtos', icon: '📦', text: 'Cadastro de Produtos' },
    { page: 'estoque', icon: '🏭', text: 'Controle de Estoque' },
    { page: 'validade', icon: '📅', text: 'Validade e Lotes' },
    { page: 'inventario', icon: '📋', text: 'Inventário / Ajustes' },
    { page: 'perdas', icon: '🗑️', text: 'Perdas e Quebras' },
    { page: 'transferencias', icon: '🔄', text: 'Transferências' },
    { page: 'curva-abc', icon: '📈', text: 'Curva ABC' },
  ]},
  { label: 'Compras', key: 'compras', items: [
    { page: 'fornecedores', icon: '🏢', text: 'Fornecedores' },
    { page: 'cotacoes', icon: '📊', text: 'Cotações' },
    { page: 'pedidos-compra', icon: '🛍️', text: 'Pedidos de Compra' },
    { page: 'recebimento', icon: '📥', text: 'Recebimento' },
  ]},
  { label: 'Clientes & CRM', key: 'clientes', items: [
    { page: 'clientes', icon: '👥', text: 'Clientes' },
    { page: 'crm', icon: '🎯', text: 'CRM / Oportunidades' },
    { page: 'fidelidade', icon: '⭐', text: 'Programa Fidelidade' },
    { page: 'credito', icon: '💳', text: 'Crediário / Fiado' },
    { page: 'convenios', icon: '🏢', text: 'Convênios' },
  ]},
  { label: 'Financeiro', key: 'financeiro', items: [
    { page: 'caixa', icon: '💰', text: 'Caixa Geral' },
    { page: 'contas-pagar', icon: '📤', text: 'Contas a Pagar' },
    { page: 'contas-receber', icon: '📩', text: 'Contas a Receber' },
    { page: 'dre', icon: '📈', text: 'DRE / Resultados' },
    { page: 'fluxo', icon: '💸', text: 'Fluxo de Caixa' },
    { page: 'conciliacao', icon: '🔄', text: 'Conciliação' },
  ]},
  { label: 'RH & Pessoal', key: 'rh', items: [
    { page: 'funcionarios', icon: '👔', text: 'Funcionários' },
    { page: 'contratos-rh', icon: '📋', text: 'Contratos' },
    { page: 'ponto', icon: '⏰', text: 'Ponto Eletrônico' },
    { page: 'folha', icon: '📄', text: 'Folha de Pagamento' },
    { page: 'ferias', icon: '🏖️', text: 'Férias' },
    { page: 'rescisao', icon: '🚪', text: 'Rescisões' },
  ]},
  { label: 'Logística', key: 'frota', items: [
    { page: 'transporte', icon: '🚚', text: 'Transportes' },
    { page: 'frota', icon: '🚗', text: 'Frota de Veículos' },
    { page: 'entrega', icon: '📍', text: 'Delivery / Entregas' },
  ]},
  { label: 'Fiscal', key: 'fiscal', items: [
    { page: 'fiscal', icon: '🧾', text: 'Emissor NF-e / NFC-e' },
    { page: 'nfe-entrada', icon: '📨', text: 'NF-e Entrada' },
    { page: 'sped', icon: '📊', text: 'SPED Fiscal' },
    { page: 'tributacao', icon: '⚖️', text: 'Tributação' },
  ]},
  { label: 'Relatórios', key: 'relatorios', items: [
    { page: 'relatorios', icon: '📊', text: 'Relatórios Gerenciais' },
    { page: 'vendas-hist', icon: '🗃️', text: 'Histórico de Vendas' },
  ]},
  { label: 'Sistema', key: 'configuracoes', items: [
    { page: 'configuracoes', icon: '⚙️', text: 'Configurações' },
    { page: 'usuarios', icon: '🔐', text: 'Usuários & Permissões' },
    { page: 'backup', icon: '💾', text: 'Backup' },
  ]},
]

function usuarioTemAcesso(page) {
  const app = window.app
  if (!app || !app.usuarioLogado) return true
  return app.verificarAcesso(page)
}

export function renderSidebar() {
  const el = document.getElementById('sidebar')
  el.innerHTML = `
    <div class="sidebar-header">
      <div class="logo-icon">🛒</div>
      <div>
        <div class="logo-text">NEXUS Market AI</div>
        <div class="logo-sub">ERP Modular • v4.0</div>
      </div>
    </div>
    <div style="flex:1;overflow-y:auto;padding-bottom:12px;">
      ${MENU_GROUPS.map(group => {
        const visiveis = group.items.filter(item => usuarioTemAcesso(item.page))
        if (!visiveis.length) return ''
        return `
          <div class="nav-group">
            <div class="nav-label">${group.label}</div>
            ${visiveis.map(item => `
              <div class="nav-item" data-page="${item.page}">
                <span class="nav-icon">${item.icon}</span>
                <span class="nav-text">${item.text}</span>
              </div>
            `).join('')}
          </div>
        `
      }).join('')}
    </div>
  `
  el.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => window.navigate(item.dataset.page))
  })
}
