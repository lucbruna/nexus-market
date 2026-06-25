(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}})();const ce="modulepreload",ue=function(b){return"/nexus-market/"+b},ee={},W=function(e,t,a){let i=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),s=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));i=Promise.allSettled(t.map(d=>{if(d=ue(d),d in ee)return;ee[d]=!0;const r=d.endsWith(".css"),u=r?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${u}`))return;const l=document.createElement("link");if(l.rel=r?"stylesheet":ce,r||(l.as="script"),l.crossOrigin="",l.href=d,s&&l.setAttribute("nonce",s),document.head.appendChild(l),r)return new Promise((v,m)=>{l.addEventListener("load",v),l.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${d}`)))})}))}function n(o){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=o,window.dispatchEvent(s),!s.defaultPrevented)throw o}return i.then(o=>{for(const s of o||[])s.status==="rejected"&&n(s.reason);return e().catch(n)})},pe=[{label:"Principal",items:[{page:"dashboard",icon:"📊",text:"Dashboard"},{page:"pdv",icon:"🏪",text:"Frente de Caixa (PDV)"}]},{label:"Estoque",key:"estoque",items:[{page:"produtos",icon:"📦",text:"Cadastro de Produtos"},{page:"estoque",icon:"🏭",text:"Controle de Estoque"},{page:"validade",icon:"📅",text:"Validade e Lotes"},{page:"inventario",icon:"📋",text:"Inventário / Ajustes"},{page:"perdas",icon:"🗑️",text:"Perdas e Quebras"},{page:"transferencias",icon:"🔄",text:"Transferências"},{page:"curva-abc",icon:"📈",text:"Curva ABC"}]},{label:"Compras",key:"compras",items:[{page:"fornecedores",icon:"🏢",text:"Fornecedores"},{page:"cotacoes",icon:"📊",text:"Cotações"},{page:"pedidos-compra",icon:"🛍️",text:"Pedidos de Compra"},{page:"recebimento",icon:"📥",text:"Recebimento"}]},{label:"Clientes & CRM",key:"clientes",items:[{page:"clientes",icon:"👥",text:"Clientes"},{page:"crm",icon:"🎯",text:"CRM / Oportunidades"},{page:"fidelidade",icon:"⭐",text:"Programa Fidelidade"},{page:"credito",icon:"💳",text:"Crediário / Fiado"},{page:"convenios",icon:"🏢",text:"Convênios"}]},{label:"Financeiro",key:"financeiro",items:[{page:"caixa",icon:"💰",text:"Caixa Geral"},{page:"contas-pagar",icon:"📤",text:"Contas a Pagar"},{page:"contas-receber",icon:"📩",text:"Contas a Receber"},{page:"dre",icon:"📈",text:"DRE / Resultados"},{page:"fluxo",icon:"💸",text:"Fluxo de Caixa"},{page:"conciliacao",icon:"🔄",text:"Conciliação"}]},{label:"RH & Pessoal",key:"rh",items:[{page:"funcionarios",icon:"👔",text:"Funcionários"},{page:"contratos-rh",icon:"📋",text:"Contratos"},{page:"ponto",icon:"⏰",text:"Ponto Eletrônico"},{page:"folha",icon:"📄",text:"Folha de Pagamento"},{page:"ferias",icon:"🏖️",text:"Férias"},{page:"rescisao",icon:"🚪",text:"Rescisões"}]},{label:"Logística",key:"frota",items:[{page:"transporte",icon:"🚚",text:"Transportes"},{page:"frota",icon:"🚗",text:"Frota de Veículos"},{page:"entrega",icon:"📍",text:"Delivery / Entregas"}]},{label:"Fiscal",key:"fiscal",items:[{page:"fiscal",icon:"🧾",text:"Emissor NF-e / NFC-e"},{page:"nfe-entrada",icon:"📨",text:"NF-e Entrada"},{page:"sped",icon:"📊",text:"SPED Fiscal"},{page:"tributacao",icon:"⚖️",text:"Tributação"}]},{label:"Relatórios",key:"relatorios",items:[{page:"relatorios",icon:"📊",text:"Relatórios Gerenciais"},{page:"vendas-hist",icon:"🗃️",text:"Histórico de Vendas"}]},{label:"Sistema",key:"configuracoes",items:[{page:"configuracoes",icon:"⚙️",text:"Configurações"},{page:"usuarios",icon:"🔐",text:"Usuários & Permissões"},{page:"backup",icon:"💾",text:"Backup"}]}];function me(b){const e=window.app;return!e||!e.usuarioLogado?!0:e.verificarAcesso(b)}function te(){const b=document.getElementById("sidebar");b.innerHTML=`
    <div class="sidebar-header">
      <div class="logo-icon">🛒</div>
      <div>
        <div class="logo-text">NEXUS Market AI</div>
        <div class="logo-sub">ERP Modular • v4.0</div>
      </div>
    </div>
    <div style="flex:1;overflow-y:auto;padding-bottom:12px;">
      ${pe.map(e=>{const t=e.items.filter(a=>me(a.page));return t.length?`
          <div class="nav-group">
            <div class="nav-label">${e.label}</div>
            ${t.map(a=>`
              <div class="nav-item" data-page="${a.page}">
                <span class="nav-icon">${a.icon}</span>
                <span class="nav-text">${a.text}</span>
              </div>
            `).join("")}
          </div>
        `:""}).join("")}
    </div>
  `,b.querySelectorAll(".nav-item").forEach(e=>{e.addEventListener("click",()=>window.navigate(e.dataset.page))})}function ae(){var t;const b=document.getElementById("topbar"),e=(t=window.app)==null?void 0:t.usuarioLogado;b.innerHTML=`
    <div class="topbar-left">
      <button class="tb-btn" onclick="toggleSidebar()">☰</button>
      <span class="topbar-title">📊 Dashboard</span>
    </div>
    <div class="topbar-right">
      <span class="date-badge"></span>
      <span style="font-size:12px;color:var(--text2);margin-right:8px;">${e?e.login+" ("+(e.perfil||"")+")":""}</span>
      <button class="tb-btn" onclick="window.navigate('configuracoes')">⚙️</button>
      <button class="tb-btn primary" onclick="window.navigate('pdv')">🏪 PDV</button>
      <button class="tb-btn" onclick="window.app?.logout()" title="Sair" style="color:#e74c3c;">🚪</button>
    </div>
  `}const c=b=>"R$ "+parseFloat(b||0).toFixed(2).replace(".",",").replace(/\B(?=(\d{3})+(?!\d))/g,"."),D=b=>parseFloat(b||0).toLocaleString("pt-BR");function y(b){const e=document.createElement("div");return e.textContent=b,e.innerHTML}function p(b,e="info"){const t=document.getElementById("toast-container"),a=document.createElement("div");a.className="toast "+e,a.textContent=b,t.appendChild(a),setTimeout(()=>a.remove(),4e3)}function E(b){const e=document.getElementById(b);e&&e.classList.remove("hidden")}function C(b){const e=document.getElementById(b);e&&e.classList.add("hidden")}window.fmt=c;window.esc=y;window.toast=p;window.openModal=E;window.closeModal=C;document.addEventListener("keydown",b=>{b.key==="Escape"&&document.querySelectorAll(".modal-overlay:not(.hidden)").forEach(e=>e.classList.add("hidden"))});class ve{async render(){const e=document.getElementById("page-dashboard"),t=window.db.db,a=await this.getVendasHoje(t),i=await t.produtos.toArray();await t.clientes.toArray(),await t.fornecedores.toArray();const n=await t.contasPagar.filter(x=>x.status==="pendente").toArray(),o=await t.contasReceber.filter(x=>x.status==="pendente").toArray(),s=await t.caixas.filter(x=>x.status==="aberto").first(),d=await t.fluxoCaixa.toArray(),r=await t.itensPDV.toArray(),u=await t.vendasPDV.toArray(),l=a.reduce((x,I)=>x+(I.total||0),0),v=a.length,m=v?l/v:0,g=i.filter(x=>x.ativo&&x.estoque<=(x.estMin||5)),B=i.filter(x=>x.ativo&&(!x.estoque||x.estoque<=0)),$=i.reduce((x,I)=>x+(I.estoque||0)*(I.custo||0),0),h=await t.lotes.toArray(),w=new Date;w.setDate(w.getDate()+7);const F=h.filter(x=>new Date(x.vencimento)<=w&&new Date(x.vencimento)>=new Date).length,R=n.reduce((x,I)=>x+I.valor,0),M=o.reduce((x,I)=>x+I.valor,0),P=d.filter(x=>x.tipo==="entrada").reduce((x,I)=>x+I.valor,0),L=d.filter(x=>x.tipo==="saida").reduce((x,I)=>x+I.valor,0),N=P-L,V=u.length?await this.calcMargemBruta(t,u,r):0;e.innerHTML=`
      <div class="section-header">
        <h2>📊 Dashboard Executivo</h2>
        <div class="gap-8">
          <span class="badge green" style="font-size:12px;">${new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</span>
          ${s?`<span class="badge blue">💰 Caixa ${s.numero}: ${c(s.saldoAtual||0)}</span>`:'<span class="badge red">🔒 Caixa Fechado</span>'}
        </div>
      </div>
      <div class="kpi-grid">
        <div class="kpi green">
          <div class="kpi-label">💰 Vendas Hoje</div>
          <div class="kpi-value" id="kpi-vendas-dia">${c(l)}</div>
          <div class="kpi-sub">${v} transações | Ticket médio ${c(m)}</div>
        </div>
        <div class="kpi blue">
          <div class="kpi-label">📦 Estoque</div>
          <div class="kpi-value" id="kpi-produtos">${i.filter(x=>x.ativo).length}</div>
          <div class="kpi-sub">SKUs ativos | ${c($)} em custo</div>
        </div>
        <div class="kpi yellow">
          <div class="kpi-label">⚠️ Estoque Baixo</div>
          <div class="kpi-value" id="kpi-estoque-baixo">${g.length}</div>
          <div class="kpi-sub">${B.length} zerados | ${F} vencendo</div>
        </div>
        <div class="kpi purple">
          <div class="kpi-label">📊 Margem Bruta</div>
          <div class="kpi-value" id="kpi-margem">${V.toFixed(1)}%</div>
          <div class="kpi-sub">lucro sobre vendas</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">📤 A Pagar</div>
          <div class="kpi-value text-red" id="kpi-pagar">${c(R)}</div>
          <div class="kpi-sub">${n.length} contas pendentes</div>
        </div>
        <div class="kpi green">
          <div class="kpi-label">📩 A Receber</div>
          <div class="kpi-value" id="kpi-receber">${c(M)}</div>
          <div class="kpi-sub">${o.length} contas a receber</div>
        </div>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-title">🕐 Últimas Vendas</div>
          <div id="dash-ultimas-vendas"></div>
        </div>
        <div class="card">
          <div class="card-title">📦 Alertas do Sistema</div>
          <div id="dash-alertas"></div>
        </div>
      </div>
      <div class="grid-3 mt-16">
        <div class="card">
          <div class="card-title">💳 Formas de Pagamento</div>
          <div id="dash-pagamentos"></div>
        </div>
        <div class="card">
          <div class="card-title">🏆 Top Produtos</div>
          <div id="dash-top-produtos"></div>
        </div>
        <div class="card">
          <div class="card-title">📊 Resumo Financeiro</div>
          <div id="dash-financeiro"></div>
        </div>
      </div>
      <div class="grid-2 mt-16">
        <div class="card">
          <div class="card-title">📅 Próximos Vencimentos</div>
          <div id="dash-vencimentos"></div>
        </div>
        <div class="card">
          <div class="card-title">📊 Fluxo de Caixa (7 dias)</div>
          <div id="dash-fluxo-grafico"></div>
        </div>
      </div>
    `,await this.renderUltimasVendas(t,a),await this.renderAlertas(t,g,B,F),await this.renderPagamentos(a),await this.renderTopProdutos(t),await this.renderFinanceiro(t,l,R,M,N),await this.renderVencimentos(t),await this.renderFluxoGrafico(t)}async getVendasHoje(e){const t=new Date;return t.setHours(0,0,0,0),await e.vendasPDV.filter(a=>new Date(a.data)>=t).toArray()}async calcMargemBruta(e,t,a){const i=t.reduce((d,r)=>d+(r.total||0),0);if(!i)return 0;const n=await e.produtos.toArray(),o={};n.forEach(d=>o[d.id]=d);let s=0;for(const d of a){const r=o[d.produtoId];r&&(s+=(d.qtd||0)*(r.custo||0))}return(i-s)/i*100}async renderUltimasVendas(e,t){const a=document.getElementById("dash-ultimas-vendas");if(!t.length){a.innerHTML='<div class="empty-state"><div class="icon">🛒</div><p>Nenhuma venda hoje</p></div>';return}const i=[...t].reverse().slice(0,8);a.innerHTML='<div class="tbl-wrap"><table><thead><tr><th>#</th><th>Hora</th><th>Valor</th><th>Pagamento</th></tr></thead><tbody>'+i.map(n=>`<tr>
        <td class="text-mono">${n.num||n.id}</td>
        <td class="text-mono">${new Date(n.data).toLocaleTimeString("pt-BR")}</td>
        <td class="text-green text-mono">${c(n.total)}</td>
        <td><span class="badge blue">${y(n.formaPagamento||"—")}</span></td>
      </tr>`).join("")+"</tbody></table></div>"}async renderAlertas(e,t,a,i){const n=document.getElementById("dash-alertas");let o="";a.length&&(o+=`<div class="alert-item red"><span>🚫</span><div><strong>${a.length} produtos sem estoque</strong><div style="font-size:11px;color:var(--text3);">${a.slice(0,3).map(d=>y(d.nome)).join(", ")}${a.length>3?` e +${a.length-3}`:""}</div></div></div>`),t.length&&(o+=`<div class="alert-item yellow"><span>⚠️</span><div><strong>${t.length} produtos com estoque baixo</strong><div style="font-size:11px;color:var(--text3);">${t.slice(0,3).map(d=>`${y(d.nome)} (${d.estoque})`).join(", ")}</div></div></div>`),i&&(o+=`<div class="alert-item yellow"><span>📅</span><div><strong>${i} lotes vencendo em 7 dias</strong></div></div>`);const s=await e.contasPagar.filter(d=>d.status==="pendente"&&new Date(d.vencimento)<new Date).toArray();s.length&&(o+=`<div class="alert-item red"><span>📤</span><div><strong>${s.length} contas a pagar vencidas</strong><div style="font-size:11px;color:var(--text3);">Total: ${c(s.reduce((d,r)=>d+r.valor,0))}</div></div></div>`),o||(o='<div style="color:var(--green);padding:12px;">✅ Nenhum alerta pendente</div>'),n.innerHTML=o}async renderPagamentos(e){const t=document.getElementById("dash-pagamentos"),a={};if(e.forEach(n=>{a[n.formaPagamento]=(a[n.formaPagamento]||0)+n.total}),!Object.keys(a).length){t.innerHTML='<div style="color:var(--text3);padding:12px;">Nenhuma venda hoje</div>';return}const i=Object.values(a).reduce((n,o)=>n+o,0);t.innerHTML=Object.entries(a).map(([n,o])=>`
      <div style="margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px;">
          <span>${y(n||"—")}</span><span class="text-mono text-green">${c(o)}</span>
        </div>
        <div class="progress-bar" style="height:6px;"><div class="progress-fill green" style="width:${(o/i*100).toFixed(1)}%;height:6px;"></div></div>
      </div>
    `).join("")}async renderTopProdutos(e){const t=document.getElementById("dash-top-produtos"),a=await e.itensPDV.toArray(),i={};for(const s of a)i[s.nome]=(i[s.nome]||0)+(s.qtd||0);const n=Object.entries(i).sort((s,d)=>d[1]-s[1]).slice(0,8);if(!n.length){t.innerHTML='<div style="color:var(--text3);padding:12px;">Sem dados</div>';return}const o=n[0][1];t.innerHTML=n.map(([s,d])=>`
      <div style="margin-bottom:6px;">
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px;">
          <span>${y(s)}</span><span class="badge green">${d} un</span>
        </div>
        <div class="progress-bar" style="height:4px;"><div class="progress-fill blue" style="width:${(d/o*100).toFixed(0)}%;height:4px;"></div></div>
      </div>
    `).join("")}async renderFinanceiro(e,t,a,i,n){const o=document.getElementById("dash-financeiro");o.innerHTML=`
      <div style="padding:8px 0;">
        <div class="tot-row" style="margin-bottom:8px;font-size:13px;"><span>💰 Vendas hoje</span><span class="text-mono text-green">${c(t)}</span></div>
        <div class="tot-row" style="margin-bottom:8px;font-size:13px;"><span>📤 Contas a Pagar</span><span class="text-mono text-red">${c(a)}</span></div>
        <div class="tot-row" style="margin-bottom:8px;font-size:13px;"><span>📩 Contas a Receber</span><span class="text-mono text-blue">${c(i)}</span></div>
        <hr class="divider"/>
        <div class="tot-row" style="font-size:13px;"><span>💸 Fluxo de Caixa</span><span class="text-mono ${n>=0?"text-green":"text-red"}">${c(n)}</span></div>
        <div class="tot-row" style="font-size:13px;"><span>📈 Previsão (30 dias)</span><span class="text-mono text-green">${c(i-a+n)}</span></div>
      </div>`}async renderVencimentos(e){const t=document.getElementById("dash-vencimentos"),a=await e.contasPagar.filter(o=>o.status==="pendente").toArray(),i=await e.contasReceber.filter(o=>o.status==="pendente").toArray(),n=[...a.map(o=>({...o,tipo:"pagar",data:o.vencimento})),...i.map(o=>({...o,tipo:"receber",data:o.vencimento}))].sort((o,s)=>new Date(o.data)-new Date(s.data)).slice(0,6);if(!n.length){t.innerHTML='<div style="color:var(--text3);padding:12px;">Nenhum vencimento próximo</div>';return}t.innerHTML=n.map(o=>{const s=Math.ceil((new Date(o.data)-new Date)/864e5),d=s<0;return`<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);">
        <span>${o.tipo==="pagar"?"📤":"📩"}</span>
        <div style="flex:1;"><strong style="font-size:12px;">${y(o.descricao||"—")}</strong><div style="font-size:10px;color:var(--text3);">${new Date(o.data).toLocaleDateString("pt-BR")}</div></div>
        <span class="text-mono" style="font-size:12px;">${c(o.valor)}</span>
        <span class="badge ${d?"red":s<=3?"yellow":"green"}">${d?"Vencido":`${s}d`}</span>
      </div>`}).join("")}async renderFluxoGrafico(e){const t=document.getElementById("dash-fluxo-grafico"),a=await e.fluxoCaixa.toArray(),i={},n=new Date;for(let s=6;s>=0;s--){const d=new Date(n);d.setDate(d.getDate()-s);const r=d.toLocaleDateString("pt-BR");i[r]={entradas:0,saidas:0,label:d.toLocaleDateString("pt-BR",{weekday:"short"})}}for(const s of a){const d=new Date(s.data).toLocaleDateString("pt-BR");i[d]&&(i[d][s.tipo==="entrada"?"entradas":"saidas"]+=s.valor)}const o=Math.max(...Object.values(i).map(s=>Math.max(s.entradas,s.saidas,1)));t.innerHTML='<div style="display:flex;gap:4px;align-items:flex-end;height:120px;padding:12px 0;">'+Object.entries(i).map(([s,d])=>{const r=d.entradas/o*100,u=d.saidas/o*100;return`<div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;">
          <div style="width:100%;display:flex;gap:2px;align-items:flex-end;height:100px;">
            <div style="flex:1;background:var(--green);border-radius:4px 4px 0 0;height:${Math.max(r,2)}%;min-height:4px;transition:height .3s;" title="Entradas ${c(d.entradas)}"></div>
            <div style="flex:1;background:var(--red);border-radius:4px 4px 0 0;height:${Math.max(u,2)}%;min-height:4px;transition:height .3s;" title="Saídas ${c(d.saidas)}"></div>
          </div>
          <span style="font-size:9px;color:var(--text3);margin-top:4px;">${d.label}</span>
        </div>`}).join("")+"</div>"}}const _=[{id:"dinheiro",label:"Dinheiro",icon:"💵",cash:!0,change:!0},{id:"pix",label:"PIX",icon:"⚡"},{id:"debito",label:"Debito",icon:"💳"},{id:"credito",label:"Credito",icon:"💳",installments:!0},{id:"voucher",label:"Vale Alim.",icon:"🍽️"},{id:"convenio",label:"Convenio",icon:"🏢",needsCustomer:!0},{id:"crediario",label:"Crediario",icon:"📋",needsCustomer:!0}],oe=b=>{var e;return((e=_.find(t=>t.id===b))==null?void 0:e.label)||b},A=b=>String(b??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);class be{constructor(){this.cart=[],this.discount={tipo:"pct",valor:0},this.selectedPayment="dinheiro",this.payments=[],this.currentClientePDV=null,this.allProdutos=[],this.allCategorias=[],this.categoriaAtiva="",this.numVenda=1,this.caixaAtivo=null,this.comandaAtiva=null,this.entregaFlag=!1,this.caixaBusca=""}async render(){const e=document.getElementById("page-pdv"),t=window.db.db;this.caixaAtivo=await t.caixas.filter(a=>a.status==="aberto").first(),e.innerHTML=`
      <div id="pdv-layout" class="pdv-layout-pro">
        <section id="pdv-left">
          <div id="pdv-header-bar">
            <div class="pdv-header-info">
              <span class="pdv-header-title">NEXUS PDV</span>
              <span class="pdv-header-sale" id="pdv-sale-number">Venda #${this.numVenda}</span>
              <span class="pdv-header-date">${new Date().toLocaleString("pt-BR")}</span>
            </div>
            <div class="pdv-header-actions">
              <button class="pdv-hdr-btn" onclick="window.openModal('modal-cliente-pdv')" title="Cliente">
                <span class="pdv-hdr-icon">👤</span>
                <span id="pdv-cliente-label" class="pdv-hdr-text">Cliente</span>
              </button>
              <button class="pdv-hdr-btn" onclick="window.pdv.toggleComanda()" id="btn-comanda" title="Comanda">
                <span class="pdv-hdr-icon">🎫</span>
                <span class="pdv-hdr-text">Comanda</span>
              </button>
              <button class="pdv-hdr-btn" onclick="window.pdv.clearCart()" title="Limpar">
                <span class="pdv-hdr-icon">🗑️</span>
                <span class="pdv-hdr-text">Limpar</span>
              </button>
            </div>
          </div>
          <div id="pdv-search-area">
            <div class="pdv-search-box">
              <span class="pdv-search-icon">🔍</span>
              <input type="text" id="pdv-input" placeholder="Buscar produto por nome, codigo ou EAN..." autocomplete="off"/>
            </div>
            <div id="pdv-cats" class="pdv-cats"></div>
          </div>
          <div id="pdv-products"></div>
        </section>

        <aside id="pdv-right">
          <div id="pdv-cart-header-pro">
            <div>
              <span class="cart-pro-title">Carrinho</span>
              <span class="cart-pro-count"><span id="cart-count">0</span> itens</span>
            </div>
            <div class="pdv-cart-total-display">
              <span>Total:</span>
              <strong id="pdv-cart-grand-total">R$ 0,00</strong>
            </div>
          </div>
          <div id="pdv-cart-items" class="pdv-cart-scroll"></div>
          <div id="pdv-cart-summary">
            <div class="cart-summary-row"><span>Subtotal</span><span class="text-mono" id="tot-subtotal">R$ 0,00</span></div>
            <div class="cart-summary-row cart-discount"><span>Desconto</span><span class="text-mono" id="tot-desconto">- R$ 0,00</span></div>
            <div class="cart-summary-row cart-total"><span>TOTAL</span><span id="tot-total">R$ 0,00</span></div>
          </div>
          <div id="pdv-caixa-status" class="${this.caixaAtivo?"hidden":""}">
            <span>Caixa fechado —</span>
            <button class="btn btn-sm btn-primary" onclick="window.pdv.abrirCaixa()">Abrir caixa</button>
          </div>
          <div id="pdv-payment-area">
            <div class="pay-area-title">Forma de pagamento</div>
            <div class="pay-methods-pro">
              ${_.map(a=>`
                <button type="button" class="pay-btn-pro ${a.id===this.selectedPayment?"active":""}" data-method="${a.id}">
                  <span class="pay-pro-icon">${a.icon}</span>
                  <span class="pay-pro-label">${a.label}</span>
                </button>
              `).join("")}
            </div>
            <div class="pay-pro-detail">
              <input type="number" id="pay-installments" placeholder="Parcelas" step="1" min="1" value="1"/>
              <span class="pay-pro-valor">Total: <strong id="payment-auto-total">R$ 0,00</strong></span>
            </div>
            <div id="payment-summary"></div>
            <div class="pay-pro-actions">
              <button class="pay-act-btn" onclick="window.openModal('modal-desconto')">Desconto</button>
              <button class="pay-act-btn" onclick="window.openModal('modal-sangria')">Sangria</button>
              <button class="pay-act-btn" onclick="window.openModal('modal-suprimento')">Suprimento</button>
            </div>
            <button id="btn-finalizar" onclick="window.pdv.finalizarVenda()" disabled>
              <span>Finalizar venda</span>
              <span id="btn-total">R$ 0,00</span>
            </button>
          </div>
        </aside>
      </div>
    `,window.pdv=this,await this.loadData(),this.bindEvents()}async loadData(){const e=window.db.db,t=await e.configuracoes.get("numVenda");t&&(this.numVenda=parseInt(t.valor,10)||1),document.getElementById("pdv-sale-number").textContent=`Venda #${this.numVenda}`,this.allCategorias=await e.categorias.toArray(),this.allProdutos=await e.produtos.filter(a=>a.ativo).toArray(),this.renderCategories(),this.renderProducts(this.allProdutos.slice(0,80)),this.caixaAtivo=await e.caixas.filter(a=>a.status==="aberto").first(),this.updateCart(),document.getElementById("pdv-input").focus()}bindEvents(){document.getElementById("pdv-input").addEventListener("input",()=>this.applyProductFilter()),document.getElementById("pdv-input").addEventListener("keydown",e=>this.pdvKey(e)),document.querySelectorAll(".pay-btn-pro").forEach(e=>e.addEventListener("click",()=>this.selectPay(e.dataset.method))),this.renderModalDesconto(),this.renderModalClientePDV(),this.renderModalRecibo(),this.renderModalSangria(),this.renderModalSuprimento(),this.renderModalAbrirCaixa()}renderCategories(){const e=document.getElementById("pdv-cats");e.innerHTML=`<button class="pdv-cat ${this.categoriaAtiva?"":"active"}" onclick="window.pdv.filtrarCategoria('')">Todos</button>`+this.allCategorias.map(t=>`<button class="pdv-cat ${this.categoriaAtiva===t.nome?"active":""}" onclick="window.pdv.filtrarCategoria('${A(t.nome)}')">${A(t.nome)}</button>`).join("")}renderProducts(e){const t=document.getElementById("pdv-products");t.innerHTML=e.map(a=>`
      <button class="prod-card-pro" tabindex="-1" data-prod-id="${a.id}" onclick="window.pdv.addToCart(${a.id})">
        <span class="pro-card-header">
          <span class="pro-card-cod">${A(a.codigo||a.ean||"")}</span>
          <span class="pro-card-stock ${(a.estoque||0)<=0?"out":(a.estoque||0)<=(a.estMin||5)?"low":""}">${a.estoque||0}</span>
        </span>
        <span class="pro-card-name">${A(a.nome)}</span>
        <span class="pro-card-price">${c(a.preco)}</span>
        <span class="pro-card-unit">${A(a.unidade||"UN")}</span>
      </button>
    `).join("")||'<div class="empty-state"><p>Nenhum produto encontrado</p></div>',t.addEventListener("keydown",a=>{if(a.key==="ArrowDown"||a.key==="ArrowRight"){a.preventDefault();const i=a.target.nextElementSibling;i&&i.matches(".prod-card-pro")&&i.focus()}if(a.key==="ArrowUp"||a.key==="ArrowLeft"){a.preventDefault();const i=a.target.previousElementSibling;i&&i.matches(".prod-card-pro")&&i.focus()}(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),a.target.matches(".prod-card-pro")&&a.target.click())})}filtrarCategoria(e){this.categoriaAtiva=e,this.renderCategories(),this.applyProductFilter()}applyProductFilter(){var a;const e=(((a=document.getElementById("pdv-input"))==null?void 0:a.value)||"").toLowerCase();let t=this.allProdutos;this.categoriaAtiva&&(t=t.filter(i=>i.categoria===this.categoriaAtiva)),e&&(t=t.filter(i=>String(i.nome||"").toLowerCase().includes(e)||String(i.ean||"").includes(e)||String(i.codigo||"").toLowerCase().includes(e))),this.renderProducts(t.slice(0,120))}pdvKey(e){var a;const t=e.target.value.trim();if(e.key==="Enter"){const i=this.allProdutos.find(o=>o.ean===t||o.codigo===t);if(i){this.addToCart(i.id),e.target.value="",this.applyProductFilter();return}const n=document.querySelector("#pdv-products .prod-card-pro");n&&(n.click(),e.target.value="",this.applyProductFilter());return}if(e.key==="F2"){this.clearCart(),e.preventDefault();return}if(e.key==="F8"){(a=document.getElementById("btn-finalizar"))==null||a.click(),e.preventDefault();return}if(e.key==="Escape"){e.target.value="",this.applyProductFilter(),e.target.focus();return}if(e.key==="ArrowDown"){e.preventDefault();const i=document.querySelector("#pdv-products .prod-card-pro");i&&i.focus()}}addToCart(e){const t=this.allProdutos.find(i=>i.id===e);if(!t)return;if((t.estoque||0)<=0){p(`${t.nome} sem estoque`,"error");return}const a=this.cart.find(i=>i.id===e);if(a){if(a.qtd>=(t.estoque||0)){p("Estoque insuficiente","error");return}a.qtd+=1,a.total=a.qtd*a.preco-(a.descontoItem||0)}else this.cart.push({id:e,nome:t.nome,preco:t.preco,custo:t.custo||0,qtd:1,total:t.preco,unidade:t.unidade||"UN",descontoItem:0});this.updateCart()}removeFromCart(e){this.cart=this.cart.filter(t=>t.id!==e),this.updateCart()}changeQty(e,t){const a=this.cart.find(o=>o.id===e);if(!a)return;const i=this.allProdutos.find(o=>o.id===e),n=a.qtd+t;if(n<=0){this.removeFromCart(e);return}if(i&&n>(i.estoque||0)){p(`Estoque insuficiente (${i.estoque})`,"error");return}a.qtd=n,a.total=a.qtd*a.preco-(a.descontoItem||0),this.updateCart()}clearCart(){var e;this.cart.length&&!confirm("Limpar cupom atual?")||(this.cart=[],this.payments=[],this.discount={tipo:"pct",valor:0},this.currentClientePDV=null,this.comandaAtiva=null,this.entregaFlag=!1,(e=document.getElementById("btn-comanda"))==null||e.classList.remove("active"),document.getElementById("pdv-cliente-label").textContent="Cliente",this.updateCart())}updateCart(){const e=document.getElementById("pdv-cart-items");this.cart.length?e.innerHTML=this.cart.map(s=>`
        <div class="cart-item-pro">
          <div class="cart-pro-info">
            <span class="cart-pro-name">${A(s.nome)}</span>
            <span class="cart-pro-detail">${s.qtd} x ${c(s.preco)} = ${c(s.total)}</span>
          </div>
          <div class="cart-pro-qty">
            <button class="qty-btn-pro" onclick="window.pdv.changeQty(${s.id}, -1)">−</button>
            <span class="qty-num-pro">${s.qtd}</span>
            <button class="qty-btn-pro" onclick="window.pdv.changeQty(${s.id}, 1)">+</button>
          </div>
          <button class="cart-pro-rm" onclick="window.pdv.removeFromCart(${s.id})">✕</button>
        </div>
      `).join(""):e.innerHTML='<div class="empty-state"><p>Carrinho vazio</p><p style="font-size:12px;">Selecione os produtos ao lado</p></div>';const t=this.getSubtotal(),a=this.getDiscountValue(),i=this.getTotal(),n=this.cart.reduce((s,d)=>s+d.qtd,0);document.getElementById("cart-count").textContent=n,document.getElementById("tot-subtotal").textContent=c(t),document.getElementById("tot-desconto").textContent="- "+c(a),document.getElementById("tot-total").textContent=c(i),document.getElementById("pdv-cart-grand-total").textContent=c(i),document.getElementById("btn-total").textContent=c(i);const o=document.getElementById("payment-auto-total");o&&(o.textContent=c(i)),this.applySelectedPayment(),this.renderPaymentSummary()}getSubtotal(){return this.cart.reduce((e,t)=>e+t.total,0)}getDiscountValue(){const e=this.getSubtotal();return this.discount.valor<=0?0:this.discount.tipo==="pct"?e*(this.discount.valor/100):Math.min(this.discount.valor,e)}getTotal(){return Math.max(0,this.getSubtotal()-this.getDiscountValue())}getPaidTotal(){return this.payments.reduce((e,t)=>e+t.valor,0)}getChange(){return Math.max(0,this.getPaidTotal()-this.getTotal())}selectPay(e){this.selectedPayment=e,document.querySelectorAll(".pay-btn-pro").forEach(a=>a.classList.toggle("active",a.dataset.method===e));const t=document.getElementById("pay-installments");t.style.display=e==="credito"?"block":"none",this.applySelectedPayment(),(e==="convenio"||e==="crediario")&&(E("modal-cliente-pdv"),setTimeout(()=>{const a=document.getElementById("pdv-cliente-busca");a&&(a.value="",a.focus(),this.buscarClientePDV(""))},100)),this.renderPaymentSummary()}applySelectedPayment(){var i;const e=this.getTotal();if(!this.selectedPayment||e<=0){this.payments=[];return}const t=_.find(n=>n.id===this.selectedPayment),a=t!=null&&t.installments?Math.max(1,Number(((i=document.getElementById("pay-installments"))==null?void 0:i.value)||1)):1;this.payments=[{forma:this.selectedPayment,valor:e,parcelas:a,troco:0}]}addPayment(){this.applySelectedPayment(),this.renderPaymentSummary()}removePayment(e){this.payments.splice(e,1),this.renderPaymentSummary()}renderPaymentSummary(){const e=document.getElementById("payment-summary");if(!e)return;const t=this.getTotal(),a=this.getPaidTotal(),i=Math.max(0,t-a),n=this.getChange();e.innerHTML=`
      <div class="payment-lines">${this.payments.map(r=>`
        <div class="payment-line"><span>${oe(r.forma)}${r.parcelas>1?` ${r.parcelas}x`:""}</span><strong>${c(r.valor)}</strong></div>
      `).join("")}</div>
      <div class="payment-balance ${i>0?"pending":"ok"}">
        <span>${i>0?"Restante":"Valor total pago"}</span>
        <strong>${i>0?c(i):c(a)}</strong>
      </div>
      ${n>0?`<div class="payment-change"><span>Troco</span><strong>${c(n)}</strong></div>`:""}
    `;const o=_.find(r=>r.id===this.selectedPayment),s=(o==null?void 0:o.needsCustomer)&&!this.currentClientePDV,d=this.payments.length>0&&a>=t&&!s;document.getElementById("btn-finalizar").disabled=this.cart.length===0||!this.caixaAtivo||!d}abrirCaixa(){E("modal-abrir-caixa")}async confirmarAbertura(){const e=window.db.db,t=Number(document.getElementById("abrir-caixa-valor").value||0);await e.caixas.add({filialId:1,numero:"01",saldoInicial:t,saldoAtual:t,status:"aberto",operadorId:1,dataAbertura:new Date().toISOString()}),this.caixaAtivo=await e.caixas.filter(a=>a.status==="aberto").first(),document.getElementById("pdv-caixa-status").classList.add("hidden"),C("modal-abrir-caixa"),p("Caixa aberto com sucesso","success"),this.updateCart()}toggleComanda(){var e;this.comandaAtiva=this.comandaAtiva?null:{numero:Date.now()%1e4,data:new Date().toISOString()},(e=document.getElementById("btn-comanda"))==null||e.classList.toggle("active",!!this.comandaAtiva),p(this.comandaAtiva?`Comanda #${this.comandaAtiva.numero} ativada`:"Comanda desativada","info")}async finalizarVenda(){try{this.applySelectedPayment();const e=_.find(u=>u.id===this.selectedPayment);if(e!=null&&e.needsCustomer&&!this.currentClientePDV){p("Vincule um cliente para esta forma de pagamento","error"),E("modal-cliente-pdv");return}if(!this.cart.length||!this.caixaAtivo||this.getPaidTotal()<this.getTotal())return;const t=window.db.db,a=this.getTotal(),i=this.getChange(),n=this.getDiscountValue(),o={caixaId:this.caixaAtivo.id,data:new Date().toISOString(),total:a,subtotal:this.getSubtotal(),formaPagamento:this.payments.map(u=>u.forma).join(","),clienteNome:this.currentClientePDV?this.currentClientePDV.nome:"Consumidor Final",clienteId:this.currentClientePDV?this.currentClientePDV.id:null,desconto:n,descontoTipo:this.discount.tipo,itens:this.cart.length,num:this.numVenda++,comanda:this.comandaAtiva?this.comandaAtiva.numero:null,entregar:this.entregaFlag,status:"concluida"},s=await t.vendasPDV.add(o);for(const u of this.cart){await t.itensPDV.add({vendaPDVId:s,produtoId:u.id,nome:u.nome,qtd:u.qtd,preco:u.preco,total:u.total,desconto:u.descontoItem||0});const l=this.allProdutos.find(v=>v.id===u.id);if(l){const v=Math.max(0,(l.estoque||0)-u.qtd);await t.produtos.update(u.id,{estoque:v}),l.estoque=v,await t.movimentacoesEstoque.add({produtoId:u.id,filialId:1,tipo:"saida",qtd:u.qtd,documento:`Venda #${o.num}`,data:new Date().toISOString(),motivo:"Venda PDV"})}}for(const[u,l]of this.payments.entries())await t.pagamentosPDV.add({vendaPDVId:s,caixaId:this.caixaAtivo.id,forma:l.forma,valor:l.valor,troco:u===this.payments.length-1?i:0,parcelas:l.parcelas,nsu:"",data:new Date().toISOString()});const d=a,r=(this.caixaAtivo.saldoAtual||0)+d;if(await t.caixas.update(this.caixaAtivo.id,{saldoAtual:r}),this.caixaAtivo.saldoAtual=r,await t.caixa.add({tipo:"entrada",descricao:`Venda #${o.num}`,valor:d,data:new Date().toISOString(),formaPagamento:o.formaPagamento}),await t.fluxoCaixa.add({filialId:1,data:new Date().toISOString(),tipo:"entrada",descricao:`Venda PDV #${o.num}`,valor:d,saldo:r,categoria:"Vendas"}),await t.configuracoes.put({chave:"numVenda",valor:String(this.numVenda)}),this.currentClientePDV){const u=Math.floor(a);await t.clientes.update(this.currentClientePDV.id,{pontos:(this.currentClientePDV.pontos||0)+u,totalCompras:(this.currentClientePDV.totalCompras||0)+a,ultimaCompra:new Date().toISOString()}),await t.historicoClientes.add({clienteId:this.currentClientePDV.id,tipo:"compra",descricao:`Venda #${o.num} - ${c(a)}`,data:new Date().toISOString()})}this.showRecibo(o,[...this.cart],[...this.payments],i),p("Venda finalizada","success"),this.resetSale(),this.allProdutos=await t.produtos.filter(u=>u.ativo).toArray(),this.applyProductFilter()}catch(e){p("Erro ao finalizar: "+e.message,"error")}}resetSale(){var e;this.cart=[],this.payments=[],this.discount={tipo:"pct",valor:0},this.currentClientePDV=null,this.comandaAtiva=null,this.entregaFlag=!1,(e=document.getElementById("btn-comanda"))==null||e.classList.remove("active"),document.getElementById("pdv-cliente-label").textContent="Cliente",this.updateCart()}showRecibo(e,t,a,i){const n=JSON.parse(localStorage.getItem("loja_config")||"{}"),o=document.getElementById("recibo-content");o.innerHTML=`
      <div class="receipt">
        <div class="receipt-center receipt-bold">${A(n.nome||"NEXUS Market AI")}</div>
        <div class="receipt-center">${A(n.endereco||"")}</div>
        <div class="receipt-center">CNPJ: ${A(n.cnpj||"")}</div>
        <div class="receipt-line"></div>
        <div class="receipt-center">CUPOM NAO FISCAL</div>
        <div class="receipt-center">${new Date(e.data).toLocaleString("pt-BR")} | Venda #${e.num}</div>
        <div class="receipt-line"></div>
        ${t.map(s=>`<div>${A(s.nome).substring(0,28)}</div><div class="receipt-row"><span>${s.qtd} x ${c(s.preco)}</span><span>${c(s.total)}</span></div>`).join("")}
        <div class="receipt-line"></div>
        <div class="receipt-row"><span>Subtotal</span><span>${c(e.subtotal)}</span></div>
        <div class="receipt-row"><span>Desconto</span><span>${c(e.desconto)}</span></div>
        <div class="receipt-row receipt-bold"><span>TOTAL</span><span>${c(e.total)}</span></div>
        ${a.map(s=>`<div class="receipt-row"><span>${oe(s.forma)}</span><span>${c(s.valor)}</span></div>`).join("")}
        ${i>0?`<div class="receipt-row"><span>Troco</span><span>${c(i)}</span></div>`:""}
        <div class="receipt-line"></div>
        <div class="receipt-center">Obrigado pela preferencia</div>
      </div>
    `,E("modal-recibo")}imprimirRecibo(){const e=document.getElementById("recibo-content").innerHTML,t=window.open("","_blank");t.document.write(`<html><body style="font-family:monospace;font-size:12px;padding:10px;">${e}</body></html>`),t.print(),t.close()}async buscarClientePDV(e){const t=window.db.db,a=String(e||"").toLowerCase().trim(),i=await t.clientes.toArray(),n=a?i.filter(s=>{const d=String(s.nome||"").toLowerCase(),r=String(s.cpf||"").replace(/\D/g,""),u=String(s.telefone||"").replace(/\D/g,""),l=a.replace(/\D/g,"");return!!(r&&l&&r.startsWith(l)||u&&l&&u.startsWith(l)||d.split(/\s+/).some(v=>v.startsWith(a)))}):i,o=document.getElementById("pdv-cliente-lista");if(!n.length){o.innerHTML='<div class="empty-state" style="padding:16px;"><p>Nenhum cliente encontrado</p></div>';return}o.innerHTML=n.slice(0,12).map(s=>`
      <button class="client-result" onclick="window.pdv.selecionarClientePDV(${s.id})">
        <strong>${A(s.nome)}</strong>
        <span>${A(s.cpf||"")} ${A(s.telefone||"")}</span>
        <span style="font-size:10px;color:var(--green);">Compras: ${c(s.totalCompras||0)}</span>
      </button>
    `).join("")}async selecionarClientePDV(e){const t=window.db.db;this.currentClientePDV=await t.clientes.get(e),document.getElementById("pdv-cliente-label").textContent=this.currentClientePDV.nome,C("modal-cliente-pdv"),p(`Cliente: ${this.currentClientePDV.nome}`,"info")}aplicarDesconto(){this.discount.tipo=document.getElementById("desc-tipo").value,this.discount.valor=Number(document.getElementById("desc-valor").value||0),this.payments=[],C("modal-desconto"),this.updateCart(),p("Desconto aplicado","success")}async registrarSangria(){const e=window.db.db,t=Number(document.getElementById("sangria-valor").value||0),a=document.getElementById("sangria-motivo").value.trim();if(t<=0||!a)return p("Preencha valor e motivo","error");if(!this.caixaAtivo)return p("Caixa nao esta aberto","error");await e.sangrias.add({caixaId:this.caixaAtivo.id,data:new Date().toISOString(),valor:t,motivo:a,operadorId:1});const i=(this.caixaAtivo.saldoAtual||0)-t;await e.caixas.update(this.caixaAtivo.id,{saldoAtual:i}),this.caixaAtivo.saldoAtual=i,await e.caixa.add({tipo:"saida",descricao:`Sangria: ${a}`,valor:t,data:new Date().toISOString(),formaPagamento:"dinheiro"}),C("modal-sangria"),p(`Sangria de ${c(t)} registrada`,"success")}async registrarSuprimento(){const e=window.db.db,t=Number(document.getElementById("suprimento-valor").value||0),a=document.getElementById("suprimento-motivo").value.trim();if(t<=0||!a)return p("Preencha valor e motivo","error");if(!this.caixaAtivo)return p("Caixa nao esta aberto","error");await e.suprimentos.add({caixaId:this.caixaAtivo.id,data:new Date().toISOString(),valor:t,motivo:a,operadorId:1});const i=(this.caixaAtivo.saldoAtual||0)+t;await e.caixas.update(this.caixaAtivo.id,{saldoAtual:i}),this.caixaAtivo.saldoAtual=i,await e.caixa.add({tipo:"entrada",descricao:`Suprimento: ${a}`,valor:t,data:new Date().toISOString(),formaPagamento:"dinheiro"}),C("modal-suprimento"),p(`Suprimento de ${c(t)} registrado`,"success")}renderModalDesconto(){if(document.getElementById("modal-desconto"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-desconto",e.innerHTML=`<div class="modal"><h2>Aplicar desconto</h2><div class="form-grid"><div class="form-group"><label>Tipo</label><select id="desc-tipo"><option value="pct">Percentual (%)</option><option value="val">Valor (R$)</option></select></div><div class="form-group"><label>Valor</label><input type="number" id="desc-valor" value="0" min="0" step="0.01"/></div></div><div class="modal-footer"><button class="btn btn-secondary" onclick="window.closeModal('modal-desconto')">Cancelar</button><button class="btn btn-primary" onclick="window.pdv.aplicarDesconto()">Aplicar</button></div></div>`,document.body.appendChild(e)}renderModalClientePDV(){if(document.getElementById("modal-cliente-pdv"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-cliente-pdv",e.innerHTML=`<div class="modal" style="min-width:480px;"><h2>Vincular cliente</h2><p style="font-size:12px;color:var(--text3);margin-bottom:12px;">Digite para buscar por nome, CPF ou telefone</p><div class="form-group"><input type="text" id="pdv-cliente-busca" placeholder="Digite nome, CPF ou telefone..." autocomplete="off"/></div><div id="pdv-cliente-lista"></div><div class="modal-footer"><button class="btn btn-secondary" onclick="window.closeModal('modal-cliente-pdv')">Cancelar</button></div></div>`,document.body.appendChild(e),setTimeout(()=>{const t=document.getElementById("pdv-cliente-busca");t&&(t.addEventListener("input",a=>this.buscarClientePDV(a.target.value)),t.addEventListener("keydown",a=>{if(a.key==="Enter"){const i=document.querySelector(".client-result");i&&i.click()}}))},0)}renderModalRecibo(){if(document.getElementById("modal-recibo"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-recibo",e.style.zIndex="2000",e.innerHTML=`<div class="modal" style="min-width:350px;"><h2>Recibo</h2><div id="recibo-content"></div><div class="modal-footer"><button class="btn btn-secondary" onclick="window.closeModal('modal-recibo')">Fechar</button><button class="btn btn-primary" onclick="window.pdv.imprimirRecibo()">Imprimir</button></div></div>`,document.body.appendChild(e)}renderModalSangria(){if(document.getElementById("modal-sangria"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-sangria",e.innerHTML=`<div class="modal"><h2>Sangria</h2><div class="form-grid"><div class="form-group"><label>Valor (R$)</label><input type="number" id="sangria-valor" step="0.01"/></div><div class="form-group"><label>Motivo</label><input id="sangria-motivo" placeholder="Motivo"/></div></div><div class="modal-footer"><button class="btn btn-secondary" onclick="window.closeModal('modal-sangria')">Cancelar</button><button class="btn btn-danger" onclick="window.pdv.registrarSangria()">Confirmar</button></div></div>`,document.body.appendChild(e)}renderModalSuprimento(){if(document.getElementById("modal-suprimento"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-suprimento",e.innerHTML=`<div class="modal"><h2>Suprimento</h2><div class="form-grid"><div class="form-group"><label>Valor (R$)</label><input type="number" id="suprimento-valor" step="0.01"/></div><div class="form-group"><label>Motivo</label><input id="suprimento-motivo" placeholder="Origem"/></div></div><div class="modal-footer"><button class="btn btn-secondary" onclick="window.closeModal('modal-suprimento')">Cancelar</button><button class="btn btn-primary" onclick="window.pdv.registrarSuprimento()">Confirmar</button></div></div>`,document.body.appendChild(e)}renderModalAbrirCaixa(){if(document.getElementById("modal-abrir-caixa"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-abrir-caixa",e.innerHTML=`<div class="modal"><h2>Abertura de caixa</h2><div class="form-grid"><div class="form-group"><label>Caixa</label><input type="text" value="01" disabled/></div><div class="form-group"><label>Valor inicial</label><input type="number" id="abrir-caixa-valor" value="200" step="0.01"/></div></div><div class="modal-footer"><button class="btn btn-secondary" onclick="window.closeModal('modal-abrir-caixa')">Cancelar</button><button class="btn btn-primary" onclick="window.pdv.confirmarAbertura()">Abrir</button></div></div>`,document.body.appendChild(e)}}class ge{constructor(){this.editandoId=null}async render(){const e=document.getElementById("page-produtos");window.db.db,e.innerHTML=`
      <div class="section-header">
        <h2>📦 Produtos</h2>
        <div class="gap-8">
          <input type="text" id="prod-search" class="search-bar" placeholder="🔍 Buscar produto..." autocomplete="off"/>
          <button class="btn btn-primary" onclick="window.produtos.abrirForm()">+ Novo Produto</button>
        </div>
      </div>
      <div id="prod-table-wrap"><div class="empty-state"><div class="icon">📦</div><p>Carregando...</p></div></div>
    `,window.produtos=this,this.renderModalForm(),this.loadData(),document.getElementById("prod-search").addEventListener("input",()=>this.loadData())}async loadData(){var n;const e=window.db.db,t=(((n=document.getElementById("prod-search"))==null?void 0:n.value)||"").toLowerCase();let a=await e.produtos.toArray();t&&(a=a.filter(o=>o.nome.toLowerCase().includes(t)||o.ean&&o.ean.includes(t)||o.codigo&&o.codigo.includes(t))),a.sort((o,s)=>o.nome.localeCompare(s.nome));const i=document.getElementById("prod-table-wrap");i.innerHTML=a.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Cód</th><th>EAN</th><th>Nome</th><th>Preço</th><th>Custo</th><th>Estoque</th><th>Mín</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>${a.map(o=>`
            <tr>
              <td class="text-mono">${y(o.codigo||"—")}</td>
              <td class="text-mono" style="font-size:11px;">${y(o.ean||"—")}</td>
              <td><strong>${y(o.nome)}</strong></td>
              <td class="text-mono text-green">${c(o.preco)}</td>
              <td class="text-mono">${c(o.custo||0)}</td>
              <td class="text-mono">${D(o.estoque||0)} ${y(o.unidade||"UN")}</td>
              <td class="text-mono">${D(o.estMin||5)}</td>
              <td><span class="badge ${o.ativo?"green":"red"}">${o.ativo?"Ativo":"Inativo"}</span></td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="window.produtos.editar(${o.id})">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="window.produtos.excluir(${o.id})">🗑️</button>
              </td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><div class="icon">📦</div><p>Nenhum produto encontrado</p></div>'}abrirForm(){this.editandoId=null,document.getElementById("modal-prod-title").textContent="Novo Produto",document.getElementById("prod-codigo").value="",document.getElementById("prod-ean").value="",document.getElementById("prod-nome").value="",document.getElementById("prod-preco").value="",document.getElementById("prod-custo").value="",document.getElementById("prod-estoque").value="",document.getElementById("prod-estmin").value="",document.getElementById("prod-unidade").value="UN",document.getElementById("prod-ativo").checked=!0,E("modal-produto")}async editar(e){const a=await window.db.db.produtos.get(e);a&&(this.editandoId=e,document.getElementById("modal-prod-title").textContent="Editar Produto",document.getElementById("prod-codigo").value=a.codigo||"",document.getElementById("prod-ean").value=a.ean||"",document.getElementById("prod-nome").value=a.nome,document.getElementById("prod-preco").value=a.preco,document.getElementById("prod-custo").value=a.custo||"",document.getElementById("prod-estoque").value=a.estoque||0,document.getElementById("prod-estmin").value=a.estMin||5,document.getElementById("prod-unidade").value=a.unidade||"UN",document.getElementById("prod-ativo").checked=a.ativo!==!1,E("modal-produto"))}async salvar(){const e=window.db.db,t={codigo:document.getElementById("prod-codigo").value.trim(),ean:document.getElementById("prod-ean").value.trim(),nome:document.getElementById("prod-nome").value.trim(),preco:parseFloat(document.getElementById("prod-preco").value)||0,custo:parseFloat(document.getElementById("prod-custo").value)||0,estoque:parseInt(document.getElementById("prod-estoque").value)||0,estMin:parseInt(document.getElementById("prod-estmin").value)||5,unidade:document.getElementById("prod-unidade").value,ativo:document.getElementById("prod-ativo").checked};if(!t.nome){p("⚠️ Informe o nome do produto","error");return}this.editandoId?(await e.produtos.update(this.editandoId,t),p("✅ Produto atualizado","success")):(await e.produtos.add(t),p("✅ Produto criado","success")),C("modal-produto"),this.loadData()}async excluir(e){if(!confirm("Excluir este produto?"))return;await window.db.db.produtos.delete(e),p("🗑️ Produto excluído","info"),this.loadData()}renderModalForm(){if(document.getElementById("modal-produto"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-produto",e.innerHTML=`
      <div class="modal">
        <h2 id="modal-prod-title">📦 Novo Produto</h2>
        <div class="form-grid">
          <div class="form-group"><label>Código</label><input type="text" id="prod-codigo" placeholder="Código interno"/></div>
          <div class="form-group"><label>EAN</label><input type="text" id="prod-ean" placeholder="Código de barras"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Nome</label><input type="text" id="prod-nome" placeholder="Nome do produto"/></div>
          <div class="form-group"><label>Preço Venda (R$)</label><input type="number" id="prod-preco" step="0.01" min="0"/></div>
          <div class="form-group"><label>Custo (R$)</label><input type="number" id="prod-custo" step="0.01" min="0"/></div>
          <div class="form-group"><label>Estoque</label><input type="number" id="prod-estoque" min="0"/></div>
          <div class="form-group"><label>Est. Mínimo</label><input type="number" id="prod-estmin" min="0"/></div>
          <div class="form-group"><label>Unidade</label><select id="prod-unidade"><option value="UN">UN</option><option value="KG">KG</option><option value="L">L</option><option value="PC">PC</option><option value="CX">CX</option></select></div>
          <div class="form-group"><label><input type="checkbox" id="prod-ativo" checked/> Ativo</label></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-produto')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.produtos.salvar()">💾 Salvar</button>
        </div>
      </div>
    `,document.body.appendChild(e)}}class he{async render(){const e=document.getElementById("page-estoque");e.innerHTML=`
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
    `,window.estoque=this,this.renderModalMov(),this.bindTabs(),await this.loadGeral()}bindTabs(){document.querySelectorAll(".tab[data-tab]").forEach(e=>{e.addEventListener("click",async()=>{document.querySelectorAll(".tab").forEach(a=>a.classList.remove("active")),e.classList.add("active");const t=e.dataset.tab;t==="geral"?await this.loadGeral():t==="lotes"?await this.loadLotes():t==="mov"?await this.loadMov():t==="perdas"?await this.loadPerdas():t==="curva"&&await this.loadCurvaABC()})})}async loadGeral(){const t=await window.db.db.produtos.filter(l=>l.ativo).toArray(),a=t.reduce((l,v)=>l+(v.estoque||0)*(v.custo||0),0),i=t.filter(l=>l.estoque<=(l.estMin||5)),n=t.filter(l=>!l.estoque||l.estoque<=0),o=t.reduce((l,v)=>l+(v.estoque||0)*(v.custo||0),0),s=t.reduce((l,v)=>l+(v.estoque||0)*(v.preco||0),0),d=s?((s-o)/s*100).toFixed(1):0,r=Math.max(...t.map(l=>l.estMax||l.estoque||1),1);document.getElementById("estoque-kpis").innerHTML=`
      <div class="kpi green"><div class="kpi-label">💰 Valor Estoque (custo)</div><div class="kpi-value">${c(a)}</div><div class="kpi-sub">${t.length} SKUs ativos</div></div>
      <div class="kpi blue"><div class="kpi-label">📈 Margem Média</div><div class="kpi-value">${d}%</div><div class="kpi-sub">preço vs custo</div></div>
      <div class="kpi yellow"><div class="kpi-label">⚠️ Estoque Baixo</div><div class="kpi-value">${i.length}</div><div class="kpi-sub">itens abaixo do mínimo</div></div>
      <div class="kpi red"><div class="kpi-label">🚫 Estoque Zero</div><div class="kpi-value">${n.length}</div><div class="kpi-sub">itens sem estoque</div></div>
    `;const u=document.getElementById("estoque-content");u.innerHTML=`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Produto</th><th>Local</th><th>Estoque</th><th>Mín</th><th>Máx</th><th class="text-mono">Custo</th><th>Valor Est.</th><th>%</th><th>Ações</th></tr></thead>
          <tbody>${t.map(l=>{const v=Math.min(100,(l.estoque||0)/(l.estMax||r)*100),m=v<25?"red":v<60?"yellow":"green";return`<tr>
              <td><strong>${l.emoji||"📦"} ${y(l.nome)}</strong><div style="font-size:10px;color:var(--text3);">${y(l.ean||"—")}</div></td>
              <td>${y(l.localizacao||"—")}</td>
              <td class="text-mono"><strong>${D(l.estoque||0)}</strong> ${l.unidade||"UN"}</td>
              <td class="text-mono">${D(l.estMin||5)}</td>
              <td class="text-mono">${D(l.estMax||"—")}</td>
              <td class="text-mono">${c(l.custo||0)}</td>
              <td class="text-mono">${c((l.estoque||0)*(l.custo||0))}</td>
              <td style="min-width:100px;">
                <div class="progress-bar"><div class="progress-fill ${m}" style="width:${v}%"></div></div>
                <span style="font-size:10px;color:var(--text3);">${v.toFixed(0)}%</span>
              </td>
              <td><button class="btn btn-sm btn-secondary" onclick="window.estoque.abrirMovPara(${l.id})">📦 Mov.</button></td>
            </tr>`}).join("")}</tbody>
        </table>
      </div>
    `}async loadLotes(){const e=window.db.db,t=await e.lotes.toArray(),a={};(await e.produtos.toArray()).forEach(u=>a[u.id]=u),t.sort((u,l)=>new Date(u.vencimento)-new Date(l.vencimento));const n=new Date,o=new Date;o.setDate(o.getDate()+30);const s=t.filter(u=>new Date(u.vencimento)<=o&&new Date(u.vencimento)>=n).length,d=t.filter(u=>new Date(u.vencimento)<n).length,r=document.getElementById("estoque-content");r.innerHTML=`
      <div style="display:flex;gap:12px;margin-bottom:12px;">
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;flex:1;"><span style="font-size:11px;color:var(--text3);">Total Lotes</span><div style="font-size:20px;font-weight:700;">${t.length}</div></div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;flex:1;"><span style="font-size:11px;color:var(--text3);">Vencendo (30d)</span><div style="font-size:20px;font-weight:700;color:var(--yellow);">${s}</div></div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;flex:1;"><span style="font-size:11px;color:var(--text3);">Vencidos</span><div style="font-size:20px;font-weight:700;color:var(--red);">${d}</div></div>
      </div>
      ${t.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Produto</th><th>Lote</th><th>Fabricacão</th><th>Vencimento</th><th>Qtd</th><th>Status</th><th></th></tr></thead>
          <tbody>${t.map(u=>{const l=a[u.produtoId],v=new Date(u.vencimento),m=Math.ceil((v-n)/(1e3*60*60*24)),g=m<0?"vencido":m<=7?"critico":m<=30?"alerta":"ok";return`<tr>
              <td><strong>${y((l==null?void 0:l.nome)||"—")}</strong></td>
              <td class="text-mono">${y(u.lote||"—")}</td>
              <td class="text-mono">${u.fabricacao?new Date(u.fabricacao).toLocaleDateString("pt-BR"):"—"}</td>
              <td class="text-mono ${g==="vencido"||g==="critico"?"text-red":g==="alerta"?"text-yellow":""}">${v.toLocaleDateString("pt-BR")}</td>
              <td class="text-mono">${D(u.qtd||0)}</td>
              <td><span class="badge ${g==="vencido"||g==="critico"?"red":g==="alerta"?"yellow":"green"}">${g==="vencido"?"Vencido":g==="critico"?"Crítico":g==="alerta"?"Alerta":"OK"}</span></td>
              <td><button class="btn btn-sm btn-danger" onclick="window.estoque.registrarPerdaLote(${u.id})">🗑️</button></td>
            </tr>`}).join("")}</tbody>
        </table>
      </div>
      `:'<div class="empty-state"><div class="icon">🏷️</div><p>Nenhum lote cadastrado</p></div>'}
    `}async loadMov(){const e=window.db.db,t=await e.movimentacoesEstoque.toArray();t.sort((o,s)=>new Date(s.data)-new Date(o.data));const a={};(await e.produtos.toArray()).forEach(o=>a[o.id]=o);const n=document.getElementById("estoque-content");n.innerHTML=t.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Data</th><th>Produto</th><th>Tipo</th><th>Qtd</th><th>Documento</th><th>Responsável</th><th>Motivo</th></tr></thead>
          <tbody>${t.map(o=>{const s=a[o.produtoId];return`<tr>
              <td class="text-mono">${new Date(o.data).toLocaleDateString("pt-BR")}</td>
              <td><strong>${y((s==null?void 0:s.nome)||"—")}</strong></td>
              <td><span class="badge ${o.tipo==="entrada"?"green":"red"}">${o.tipo==="entrada"?"Entrada":"Saída"}</span></td>
              <td class="text-mono">${D(o.qtd||0)}</td>
              <td class="text-mono">${y(o.documento||"—")}</td>
              <td>${y(o.responsavel||"—")}</td>
              <td style="font-size:11px;color:var(--text3);">${y(o.motivo||"—")}</td>
            </tr>`}).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><div class="icon">📋</div><p>Nenhuma movimentação registrada</p></div>'}async loadPerdas(){const e=window.db.db,t=await e.perdas.toArray();t.sort((s,d)=>new Date(d.data)-new Date(s.data));const a={};(await e.produtos.toArray()).forEach(s=>a[s.id]=s);const n=t.reduce((s,d)=>s+(d.valor||0),0),o=document.getElementById("estoque-content");o.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div><strong>Total em Perdas:</strong> <span class="text-red text-mono">${c(n)}</span> (${t.length} registros)</div>
        <button class="btn btn-primary btn-sm" onclick="window.estoque.registrarPerda()">+ Registrar Perda</button>
      </div>
      ${t.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Data</th><th>Produto</th><th>Qtd</th><th>Valor</th><th>Motivo</th><th>Responsável</th></tr></thead>
          <tbody>${t.map(s=>{const d=a[s.produtoId];return`<tr>
              <td class="text-mono">${new Date(s.data).toLocaleDateString("pt-BR")}</td>
              <td><strong>${y((d==null?void 0:d.nome)||"—")}</strong></td>
              <td class="text-mono">${D(s.qtd||0)}</td>
              <td class="text-mono text-red">${c(s.valor||0)}</td>
              <td style="font-size:11px;">${y(s.motivo||"—")}</td>
              <td>${y(s.responsavel||"—")}</td>
            </tr>`}).join("")}</tbody>
        </table>
      </div>
      `:'<div class="empty-state"><div class="icon">🗑️</div><p>Nenhuma perda registrada</p></div>'}
    `}async loadCurvaABC(){const e=window.db.db,t=await e.itensPDV.toArray(),a={};(await e.produtos.toArray()).forEach(l=>a[l.id]=l);const n={};for(const l of t)n[l.produtoId]||(n[l.produtoId]={qtd:0,valor:0}),n[l.produtoId].qtd+=l.qtd||0,n[l.produtoId].valor+=l.total||0;const o=Object.entries(n).sort((l,v)=>v[1].valor-l[1].valor),s=o.reduce((l,[v,m])=>l+m.valor,0);let d=0;const r=o.map(([l,v])=>{var $;d+=v.valor;const m=v.valor/s*100,g=d/s*100;let B="C";return g<=80?B="A":g<=95&&(B="B"),{id:parseInt(l),...v,pct:m,pctAcum:g,classe:B,nome:(($=a[parseInt(l)])==null?void 0:$.nome)||"—"}}),u=document.getElementById("estoque-content");if(!r.length){u.innerHTML='<div class="empty-state"><div class="icon">📈</div><p>Sem dados de venda para classificar</p></div>';return}u.innerHTML=`
      <div style="display:flex;gap:12px;margin-bottom:12px;">
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;flex:1;border-left:4px solid var(--green);">
          <div style="font-size:11px;color:var(--text3);">Classe A (80%)</div>
          <div style="font-size:20px;font-weight:700;color:var(--green);">${r.filter(l=>l.classe==="A").length}</div>
          <div style="font-size:10px;color:var(--text3);">${c(r.filter(l=>l.classe==="A").reduce((l,v)=>l+v.valor,0))}</div>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;flex:1;border-left:4px solid var(--yellow);">
          <div style="font-size:11px;color:var(--text3);">Classe B (15%)</div>
          <div style="font-size:20px;font-weight:700;color:var(--yellow);">${r.filter(l=>l.classe==="B").length}</div>
          <div style="font-size:10px;color:var(--text3);">${c(r.filter(l=>l.classe==="B").reduce((l,v)=>l+v.valor,0))}</div>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;flex:1;border-left:4px solid var(--red);">
          <div style="font-size:11px;color:var(--text3);">Classe C (5%)</div>
          <div style="font-size:20px;font-weight:700;color:var(--red);">${r.filter(l=>l.classe==="C").length}</div>
          <div style="font-size:10px;color:var(--text3);">${c(r.filter(l=>l.classe==="C").reduce((l,v)=>l+v.valor,0))}</div>
        </div>
      </div>
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Classe</th><th>Produto</th><th>Qtd Vendida</th><th>Valor</th><th>%</th><th>% Acum</th></tr></thead>
          <tbody>${r.map(l=>`
            <tr>
              <td><span class="badge ${l.classe==="A"?"green":l.classe==="B"?"yellow":"red"}">${l.classe}</span></td>
              <td><strong>${y(l.nome)}</strong></td>
              <td class="text-mono">${D(l.qtd)}</td>
              <td class="text-mono">${c(l.valor)}</td>
              <td class="text-mono">${l.pct.toFixed(1)}%</td>
              <td class="text-mono">${l.pctAcum.toFixed(1)}%</td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    `}abrirMov(){this.preencherSelects(),document.getElementById("mov-tipo").value="entrada",document.getElementById("mov-qtd").value="",document.getElementById("mov-doc").value="",document.getElementById("mov-motivo").value="",document.getElementById("mov-modal-title").textContent="📦 Nova Movimentação",E("modal-mov-estoque")}abrirMovPara(e){this.preencherSelects(e),document.getElementById("mov-tipo").value="saida",document.getElementById("mov-qtd").value="",document.getElementById("mov-doc").value="",document.getElementById("mov-motivo").value="",document.getElementById("mov-modal-title").textContent="📦 Movimentação",E("modal-mov-estoque")}async preencherSelects(e){const a=await window.db.db.produtos.toArray(),i=document.getElementById("mov-produto");i.innerHTML='<option value="">Selecione...</option>',a.forEach(n=>{const o=document.createElement("option");o.value=n.id,o.textContent=`${n.nome} (${n.estoque||0} ${n.unidade||"UN"})`,n.id===e&&(o.selected=!0),i.appendChild(o)})}async salvarMov(){const e=window.db.db,t=parseInt(document.getElementById("mov-produto").value),a=document.getElementById("mov-tipo").value,i=parseInt(document.getElementById("mov-qtd").value)||0,n=document.getElementById("mov-doc").value.trim(),o=document.getElementById("mov-motivo").value.trim();if(!t||i<=0){p("⚠️ Preencha todos os campos","error");return}const s=await e.produtos.get(t),d=s.estoque||0;if(a==="saida"&&i>d){p(`⚠️ Estoque insuficiente (${d})`,"error");return}const r=a==="entrada"?d+i:d-i;await e.produtos.update(t,{estoque:r}),await e.movimentacoesEstoque.add({produtoId:t,filialId:1,tipo:a,qtd:i,documento:n||"Manual",data:new Date().toISOString(),responsavel:"Operador",motivo:o}),p(`✅ ${a==="entrada"?"Entrada":"Saída"} de ${i} ${s.unidade||"UN"} registrada`,"success"),C("modal-mov-estoque"),this.loadGeral()}async registrarPerda(){const t=await window.db.db.produtos.toArray(),a=document.getElementById("perda-produto");a.innerHTML='<option value="">Selecione...</option>',t.forEach(i=>{const n=document.createElement("option");n.value=i.id,n.textContent=`${i.nome} (${i.estoque||0})`,a.appendChild(n)}),E("modal-perda")}async confirmarPerda(){const e=window.db.db,t=parseInt(document.getElementById("perda-produto").value),a=parseInt(document.getElementById("perda-qtd").value)||0,i=document.getElementById("perda-motivo").value.trim();if(!t||a<=0||!i){p("⚠️ Preencha todos os campos","error");return}const n=await e.produtos.get(t);if(a>(n.estoque||0)){p("⚠️ Estoque insuficiente","error");return}const o=a*(n.custo||0);await e.perdas.add({produtoId:t,data:new Date().toISOString(),qtd:a,valor:o,motivo:i,responsavel:"Operador"}),await e.produtos.update(t,{estoque:Math.max(0,(n.estoque||0)-a)}),await e.movimentacoesEstoque.add({produtoId:t,filialId:1,tipo:"saida",qtd:a,documento:"Perda",data:new Date().toISOString(),responsavel:"Operador",motivo:`Perda: ${i}`}),p(`🗑️ Perda de ${a} ${n.unidade||"UN"} registrada (${c(o)})`,"success"),C("modal-perda"),document.getElementById("perda-qtd").value="",document.getElementById("perda-motivo").value="",this.loadPerdas()}async registrarPerdaLote(e){const t=window.db.db,a=await t.lotes.get(e);if(!a)return;const i=await t.produtos.get(a.produtoId);if(!confirm(`Descartar lote ${a.lote} de ${i==null?void 0:i.nome} (${a.qtd} ${(i==null?void 0:i.unidade)||"UN"})?`))return;const n=a.qtd*((i==null?void 0:i.custo)||0);await t.perdas.add({produtoId:a.produtoId,loteId:e,data:new Date().toISOString(),qtd:a.qtd,valor:n,motivo:"Vencimento",responsavel:"Sistema"}),await t.produtos.update(a.produtoId,{estoque:Math.max(0,(i.estoque||0)-a.qtd)}),await t.lotes.delete(e),p(`🗑️ Lote ${a.lote} descartado`,"success"),this.loadLotes()}async gerarRelatorio(){const t=await window.db.db.produtos.filter(n=>n.ativo).toArray(),a=t.filter(n=>n.estoque<=(n.estMin||5)),i=["📊 RELATÓRIO DE ESTOQUE",`Total de SKUs: ${t.length}`,`Valor total (custo): ${c(t.reduce((n,o)=>n+(o.estoque||0)*(o.custo||0),0))}`,`Estoque baixo: ${a.length} itens`,`Estoque zero: ${t.filter(n=>!n.estoque).length} itens`,`
${a.slice(0,5).map(n=>`⚠️ ${n.nome}: ${n.estoque} ${n.unidade||"UN"}`).join(`
`)}`].join(`
`);p(i,"info")}renderModalMov(){if(document.getElementById("modal-mov-estoque"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-mov-estoque",e.innerHTML=`
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
      </div>`,document.body.appendChild(e);const t=document.createElement("div");t.className="modal-overlay hidden",t.id="modal-perda",t.innerHTML=`
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
      </div>`,document.body.appendChild(t)}}class fe{async render(){const e=document.getElementById("page-validade");e.innerHTML=`
      <div class="section-header">
        <h2>📅 Controle de Validade</h2>
        <button class="btn btn-primary" onclick="window.validade.abrirModal()">+ Registrar Lote</button>
      </div>
      <div id="validade-table-wrap"><div class="empty-state"><div class="icon">📅</div><p>Carregando...</p></div></div>
    `,window.validade=this,this.renderModalLote(),await this.loadData()}async loadData(){const e=window.db.db,t=await e.lotes.toArray(),a=await e.produtos.toArray(),i={};a.forEach(r=>i[r.id]=r);const n=new Date;n.setHours(0,0,0,0);const o=new Date(n);o.setDate(o.getDate()+7);const s=new Date(n);s.setDate(s.getDate()+30),t.sort((r,u)=>new Date(r.vencimento)-new Date(u.vencimento));const d=document.getElementById("validade-table-wrap");d.innerHTML=t.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Produto</th><th>Lote</th><th>Fabricação</th><th>Vencimento</th><th>Qtd</th><th>Status</th></tr></thead>
          <tbody>${t.map(r=>{const u=i[r.produtoId]||{nome:"—"},l=new Date(r.vencimento),v=Math.ceil((l-n)/(1e3*60*60*24));let m="green",g="OK";return v<=0?(m="red",g="Vencido"):v<=7?(m="red",g="Vence Hoje/7d"):v<=30?(m="yellow",g="Vence em 30d"):v<=60&&(m="blue",g="Vence em 60d"),`<tr>
              <td><strong>${y(u.nome)}</strong></td>
              <td class="text-mono">${y(r.lote)}</td>
              <td class="text-mono">${r.fabricacao?new Date(r.fabricacao).toLocaleDateString("pt-BR"):"—"}</td>
              <td class="text-mono">${l.toLocaleDateString("pt-BR")}</td>
              <td class="text-mono">${D(r.qtd||0)}</td>
              <td><span class="badge ${m}">${g}</span></td>
            </tr>`}).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><div class="icon">📅</div><p>Nenhum lote registrado</p></div>'}abrirModal(){document.getElementById("lote-produto").value="",document.getElementById("lote-nome").value="",document.getElementById("lote-fabricacao").value="",document.getElementById("lote-vencimento").value="",document.getElementById("lote-qtd").value="",E("modal-lote")}async salvarLote(){const e=window.db.db,t=parseInt(document.getElementById("lote-produto").value);if(!t){p("⚠️ Selecione um produto","error");return}const a={produtoId:t,lote:document.getElementById("lote-nome").value.trim()||"LOTE-"+Date.now(),fabricacao:document.getElementById("lote-fabricacao").value||null,vencimento:document.getElementById("lote-vencimento").value,qtd:parseInt(document.getElementById("lote-qtd").value)||0};if(!a.vencimento){p("⚠️ Informe a data de vencimento","error");return}await e.lotes.add(a),p("✅ Lote registrado","success"),C("modal-lote"),this.loadData()}renderModalLote(){if(document.getElementById("modal-lote"))return;const e=window.db.db,t=document.createElement("div");t.className="modal-overlay hidden",t.id="modal-lote",t.innerHTML=`
      <div class="modal">
        <h2>📅 Registrar Lote</h2>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Produto</label><select id="lote-produto"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>Lote</label><input type="text" id="lote-nome" placeholder="Identificação do lote"/></div>
          <div class="form-group"><label>Fabricação</label><input type="date" id="lote-fabricacao"/></div>
          <div class="form-group"><label>Vencimento</label><input type="date" id="lote-vencimento"/></div>
          <div class="form-group"><label>Quantidade</label><input type="number" id="lote-qtd" min="0"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-lote')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.validade.salvarLote()">💾 Salvar</button>
        </div>
      </div>
    `,document.body.appendChild(t),e.produtos.filter(a=>a.ativo).toArray().then(a=>{const i=document.getElementById("lote-produto");a.forEach(n=>{const o=document.createElement("option");o.value=n.id,o.textContent=`${n.nome} (${n.codigo||"—"})`,i.appendChild(o)})})}}class ye{async render(){const e=document.getElementById("page-inventario");e.innerHTML=`
      <div class="section-header">
        <h2>📋 Inventário Físico</h2>
        <div class="gap-8">
          <button class="btn btn-primary" onclick="window.inventario.novoInventario()">+ Novo Inventário</button>
        </div>
      </div>
      <div id="inventario-list"><div class="empty-state"><div class="icon">📋</div><p>Carregando...</p></div></div>
    `,window.inventario=this,this.renderModalInventario(),await this.loadData()}async loadData(){const t=await window.db.db.inventarios.toArray();t.sort((i,n)=>new Date(n.data)-new Date(i.data));const a=document.getElementById("inventario-list");a.innerHTML=t.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Data</th><th>Status</th><th>Responsável</th><th>Ações</th></tr></thead>
          <tbody>${t.map(i=>`
            <tr>
              <td class="text-mono">${new Date(i.data).toLocaleDateString("pt-BR")}</td>
              <td><span class="badge ${i.status==="concluido"?"green":"yellow"}">${i.status||"pendente"}</span></td>
              <td>${i.responsavel||"—"}</td>
              <td><button class="btn btn-sm btn-secondary" onclick="window.inventario.verDetalhes(${i.id})">👁️</button></td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><div class="icon">📋</div><p>Nenhum inventário registrado</p></div>'}async novoInventario(){document.getElementById("inv-responsavel").value="",E("modal-inventario")}async criar(){const e=window.db.db,t={data:new Date().toISOString(),status:"pendente",responsavel:document.getElementById("inv-responsavel").value.trim()||"Sistema"};await e.inventarios.add(t),p("✅ Inventário criado","success"),C("modal-inventario"),this.loadData()}async verDetalhes(e){const a=await window.db.db.inventarios.get(e);a&&p(`📋 Inventário #${e}: ${a.status}`,"info")}renderModalInventario(){if(document.getElementById("modal-inventario"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-inventario",e.innerHTML=`
      <div class="modal">
        <h2>📋 Novo Inventário</h2>
        <div class="form-group"><label>Responsável</label><input type="text" id="inv-responsavel" placeholder="Nome do responsável"/></div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-inventario')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.inventario.criar()">✅ Criar</button>
        </div>
      </div>
    `,document.body.appendChild(e)}}class we{constructor(){this.editandoId=null}async render(){const e=document.getElementById("page-fornecedores");e.innerHTML=`
      <div class="section-header">
        <h2>🏢 Fornecedores</h2>
        <div class="gap-8">
          <input type="text" id="forn-search" class="search-bar" placeholder="🔍 Buscar fornecedor..." autocomplete="off"/>
          <button class="btn btn-primary" onclick="window.fornecedores.abrirForm()">+ Novo Fornecedor</button>
        </div>
      </div>
      <div id="forn-table-wrap"><div class="empty-state"><div class="icon">🏢</div><p>Carregando...</p></div></div>
    `,window.fornecedores=this,this.renderModalForm(),this.loadData(),document.getElementById("forn-search").addEventListener("input",()=>this.loadData())}async loadData(){var n;const e=window.db.db,t=(((n=document.getElementById("forn-search"))==null?void 0:n.value)||"").toLowerCase();let a=await e.fornecedores.toArray();t&&(a=a.filter(o=>{var s,d;return((s=o.razaoSocial)==null?void 0:s.toLowerCase().includes(t))||((d=o.fantasia)==null?void 0:d.toLowerCase().includes(t))||o.cnpj&&o.cnpj.includes(t)}));const i=document.getElementById("forn-table-wrap");i.innerHTML=a.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>CNPJ</th><th>Razão Social</th><th>Fantasia</th><th>Prazo (dias)</th><th>Ações</th></tr></thead>
          <tbody>${a.map(o=>`
            <tr>
              <td class="text-mono">${y(o.cnpj||"—")}</td>
              <td><strong>${y(o.razaoSocial||"—")}</strong></td>
              <td>${y(o.fantasia||"—")}</td>
              <td class="text-mono">${o.prazo||0}</td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="window.fornecedores.editar(${o.id})">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="window.fornecedores.excluir(${o.id})">🗑️</button>
              </td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><div class="icon">🏢</div><p>Nenhum fornecedor encontrado</p></div>'}abrirForm(){this.editandoId=null,document.getElementById("modal-forn-title").textContent="Novo Fornecedor",document.getElementById("forn-cnpj").value="",document.getElementById("forn-razao").value="",document.getElementById("forn-fantasia").value="",document.getElementById("forn-prazo").value="",E("modal-fornecedor")}async editar(e){const a=await window.db.db.fornecedores.get(e);a&&(this.editandoId=e,document.getElementById("modal-forn-title").textContent="Editar Fornecedor",document.getElementById("forn-cnpj").value=a.cnpj||"",document.getElementById("forn-razao").value=a.razaoSocial||"",document.getElementById("forn-fantasia").value=a.fantasia||"",document.getElementById("forn-prazo").value=a.prazo||"",E("modal-fornecedor"))}async salvar(){const e=window.db.db,t={cnpj:document.getElementById("forn-cnpj").value.trim(),razaoSocial:document.getElementById("forn-razao").value.trim(),fantasia:document.getElementById("forn-fantasia").value.trim(),prazo:parseInt(document.getElementById("forn-prazo").value)||0};if(!t.razaoSocial){p("⚠️ Informe a razão social","error");return}this.editandoId?(await e.fornecedores.update(this.editandoId,t),p("✅ Fornecedor atualizado","success")):(await e.fornecedores.add(t),p("✅ Fornecedor criado","success")),C("modal-fornecedor"),this.loadData()}async excluir(e){if(!confirm("Excluir este fornecedor?"))return;await window.db.db.fornecedores.delete(e),p("🗑️ Fornecedor excluído","info"),this.loadData()}renderModalForm(){if(document.getElementById("modal-fornecedor"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-fornecedor",e.innerHTML=`
      <div class="modal">
        <h2 id="modal-forn-title">🏢 Novo Fornecedor</h2>
        <div class="form-grid">
          <div class="form-group"><label>CNPJ</label><input type="text" id="forn-cnpj" placeholder="00.000.000/0001-00"/></div>
          <div class="form-group"><label>Prazo (dias)</label><input type="number" id="forn-prazo" min="0" placeholder="30"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Razão Social</label><input type="text" id="forn-razao" placeholder="Razão social"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Nome Fantasia</label><input type="text" id="forn-fantasia" placeholder="Nome fantasia"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-fornecedor')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.fornecedores.salvar()">💾 Salvar</button>
        </div>
      </div>
    `,document.body.appendChild(e)}}class xe{constructor(){this.itensForm=[],this.editandoId=null}async render(){const e=document.getElementById("page-pedidos-compra");e.innerHTML=`
      <div class="section-header">
        <h2>🛍️ Pedidos de Compra</h2>
        <div class="gap-8">
          <button class="btn btn-primary" onclick="window.pedidosCompra.abrirForm()">+ Novo Pedido</button>
          <button class="btn btn-secondary" onclick="window.pedidosCompra.gerarCurvaABC()">📊 Curva ABC</button>
        </div>
      </div>
      <div class="kpi-grid" id="pc-kpis"></div>
      <div id="pedidos-table-wrap"><div class="empty-state"><div class="icon">🛍️</div><p>Carregando...</p></div></div>
    `,window.pedidosCompra=this,this.renderModalForm(),this.renderModalItens(),await this.loadData()}async loadData(){const e=window.db.db,t=await e.pedidosCompra.toArray();t.sort((r,u)=>new Date(u.data)-new Date(r.data));const a={};(await e.fornecedores.toArray()).forEach(r=>a[r.id]=r);const n=t.filter(r=>r.status==="pendente"||r.status==="aprovado"),o=n.reduce((r,u)=>r+(u.total||0),0),s=t.reduce((r,u)=>r+(u.total||0),0);document.getElementById("pc-kpis").innerHTML=`
      <div class="kpi yellow"><div class="kpi-label">📋 Pendentes</div><div class="kpi-value">${n.length}</div><div class="kpi-sub">${c(o)} em pedidos</div></div>
      <div class="kpi green"><div class="kpi-label">✅ Recebidos</div><div class="kpi-value">${t.filter(r=>r.status==="recebido").length}</div><div class="kpi-sub">pedidos concluídos</div></div>
      <div class="kpi blue"><div class="kpi-label">📊 Total Período</div><div class="kpi-value">${c(s)}</div><div class="kpi-sub">${t.length} pedidos</div></div>
    `;const d=document.getElementById("pedidos-table-wrap");d.innerHTML=t.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>#</th><th>Fornecedor</th><th>Data</th><th>Entrega</th><th>Itens</th><th>Total</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>${t.map(r=>{const u=a[r.fornecedorId],l=r.status==="pendente"&&r.entrega&&new Date(r.entrega)<new Date;return`<tr>
              <td class="text-mono">${r.id}</td>
              <td><strong>${y((u==null?void 0:u.razaoSocial)||(u==null?void 0:u.fantasia)||"—")}</strong></td>
              <td class="text-mono">${new Date(r.data).toLocaleDateString("pt-BR")}</td>
              <td class="text-mono ${l?"text-red":""}">${r.entrega?new Date(r.entrega).toLocaleDateString("pt-BR"):"—"}</td>
              <td class="text-mono">${r.itens||0}</td>
              <td class="text-mono text-green">${c(r.total||0)}</td>
              <td><span class="badge ${r.status==="recebido"?"green":r.status==="cancelado"?"red":r.status==="aprovado"?"blue":"yellow"}">${r.status||"pendente"}</span></td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="window.pedidosCompra.verItens(${r.id})">📋</button>
                ${r.status==="pendente"?`<button class="btn btn-sm btn-primary" onclick="window.pedidosCompra.aprovar(${r.id})">✅</button>`:""}
                ${r.status==="pendente"?`<button class="btn btn-sm btn-danger" onclick="window.pedidosCompra.cancelar(${r.id})">❌</button>`:""}
              </td>
            </tr>`}).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><div class="icon">🛍️</div><p>Nenhum pedido de compra</p></div>'}async abrirForm(){this.editandoId=null,this.itensForm=[];const e=window.db.db,t=await e.fornecedores.toArray(),a=document.getElementById("ped-fornecedor");a.innerHTML='<option value="">Selecione...</option>',t.forEach(o=>{const s=document.createElement("option");s.value=o.id,s.textContent=`${o.razaoSocial||o.fantasia} (${o.prazoPagamento||0}d)`,a.appendChild(s)});const i=await e.produtos.filter(o=>o.ativo).toArray(),n=document.getElementById("ped-item-produto");n.innerHTML='<option value="">Selecione...</option>',i.forEach(o=>{const s=document.createElement("option");s.value=o.id,s.textContent=`${o.nome} (${c(o.preco)})`,n.appendChild(s)}),document.getElementById("ped-data").value=new Date().toISOString().split("T")[0],document.getElementById("ped-entrega").value="",document.getElementById("ped-total").value="",document.getElementById("ped-obs").value="",document.getElementById("ped-frete").value="",document.getElementById("ped-desconto").value="",document.getElementById("ped-item-lista").innerHTML='<div style="color:var(--text3);padding:8px;">Nenhum item adicionado</div>',document.getElementById("ped-itens-total").textContent="R$ 0,00",E("modal-pedido")}adicionarItem(){const e=parseInt(document.getElementById("ped-item-produto").value),t=parseInt(document.getElementById("ped-item-qtd").value)||1,a=parseFloat(document.getElementById("ped-item-preco").value)||0;if(!e||t<=0||a<=0){p("⚠️ Preencha produto, qtd e preço","error");return}window.db.db.produtos.get(e).then(n=>{const o=this.itensForm.find(s=>s.produtoId===e);o?(o.qtd+=t,o.total=o.qtd*o.preco):this.itensForm.push({produtoId:e,nome:n.nome,qtd:t,preco:a,total:t*a}),this.renderItensForm(),document.getElementById("ped-item-qtd").value="1",document.getElementById("ped-item-preco").value=n.preco})}removerItemForm(e){this.itensForm.splice(e,1),this.renderItensForm()}renderItensForm(){const e=document.getElementById("ped-item-lista"),t=this.itensForm.reduce((a,i)=>a+i.total,0);e.innerHTML=this.itensForm.length?this.itensForm.map((a,i)=>`
      <div style="display:flex;align-items:center;gap:8px;padding:6px;background:var(--bg3);border-radius:6px;margin-bottom:4px;">
        <span style="flex:1;font-size:12px;"><strong>${y(a.nome)}</strong></span>
        <span class="text-mono" style="font-size:11px;">${a.qtd} x ${c(a.preco)}</span>
        <span class="text-mono text-green" style="font-size:12px;">${c(a.total)}</span>
        <button class="rm-btn" onclick="window.pedidosCompra.removerItemForm(${i})">✕</button>
      </div>
    `).join(""):'<div style="color:var(--text3);padding:8px;font-size:12px;">Nenhum item — adicione acima</div>',document.getElementById("ped-itens-total").textContent=c(t),document.getElementById("ped-total").value=t.toFixed(2)}async salvar(){const e=window.db.db,t=this.itensForm.reduce((s,d)=>s+d.total,0),a=parseFloat(document.getElementById("ped-frete").value)||0,i=parseFloat(document.getElementById("ped-desconto").value)||0,n={fornecedorId:parseInt(document.getElementById("ped-fornecedor").value),filialId:1,data:document.getElementById("ped-data").value||new Date().toISOString(),entrega:document.getElementById("ped-entrega").value||null,total:t+a-i,frete:a,desconto:i,observacoes:document.getElementById("ped-obs").value.trim(),itens:this.itensForm.length,status:"pendente"};if(!n.fornecedorId){p("⚠️ Selecione um fornecedor","error");return}if(!this.itensForm.length){p("⚠️ Adicione pelo menos um item","error");return}const o=await e.pedidosCompra.add(n);for(const s of this.itensForm)await e.itensPedidoCompra.add({pedidoId:o,produtoId:s.produtoId,nome:s.nome,qtd:s.qtd,preco:s.preco,total:s.total,recebido:0});p("✅ Pedido criado com sucesso","success"),C("modal-pedido"),this.loadData()}async verItens(e){const t=window.db.db,a=await t.pedidosCompra.get(e),i=await t.itensPedidoCompra.filter(s=>s.pedidoId===e).toArray(),n=await t.fornecedores.get(a==null?void 0:a.fornecedorId),o=document.getElementById("modal-itens-content");o.innerHTML=`
      <div style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;font-size:12px;">
          <span><strong>Fornecedor:</strong> ${y((n==null?void 0:n.razaoSocial)||"—")}</span>
          <span><strong>Total:</strong> <span class="text-green text-mono">${c((a==null?void 0:a.total)||0)}</span></span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-top:4px;color:var(--text3);">
          <span>📅 ${new Date(a==null?void 0:a.data).toLocaleDateString("pt-BR")}</span>
          <span>Status: ${(a==null?void 0:a.status)||"—"}</span>
        </div>
      </div>
      ${i.length?`
        <div class="tbl-wrap">
          <table>
            <thead><tr><th>Produto</th><th>Qtd</th><th>Preço</th><th>Total</th><th>Recebido</th></tr></thead>
            <tbody>${i.map(s=>`
              <tr>
                <td><strong>${y(s.nome||"—")}</strong></td>
                <td class="text-mono">${s.qtd||0}</td>
                <td class="text-mono">${c(s.preco||0)}</td>
                <td class="text-mono text-green">${c(s.total||0)}</td>
                <td><span class="badge ${(s.recebido||0)>=(s.qtd||0)?"green":"yellow"}">${s.recebido||0}</span></td>
              </tr>
            `).join("")}</tbody>
          </table>
        </div>
      `:'<div class="empty-state"><div class="icon">📦</div><p>Sem itens</p></div>'}
    `,E("modal-itens-pedido")}async aprovar(e){await window.db.db.pedidosCompra.update(e,{status:"aprovado",aprovadoPor:"Operador"}),p("✅ Pedido aprovado","success"),this.loadData()}async cancelar(e){if(!confirm("Cancelar este pedido?"))return;await window.db.db.pedidosCompra.update(e,{status:"cancelado"}),p("❌ Pedido cancelado","info"),this.loadData()}async gerarCurvaABC(){const e=window.db.db,t=await e.itensPDV.toArray(),a={};(await e.produtos.toArray()).forEach(l=>a[l.id]=l);const n={};for(const l of t)n[l.produtoId]||(n[l.produtoId]={qtd:0,valor:0}),n[l.produtoId].qtd+=l.qtd||0,n[l.produtoId].valor+=l.total||0;const o=Object.entries(n).sort((l,v)=>v[1].valor-l[1].valor),s=o.reduce((l,[v,m])=>l+m.valor,0);let d=0;const r=o.map(([l,v])=>{d+=v.valor;const m=d/s*100,g=a[parseInt(l)];return!g||m>80?null:(g.estoque||0)<=(g.estMin||5)?{nome:g.nome,estoque:g.estoque,estMin:g.estMin,qtdVendida:v.qtd}:null}).filter(Boolean).slice(0,10);if(!r.length){p("📊 Nenhum produto crítico para compra","info");return}const u=`📊 SUGESTÕES DE COMPRA (Curva A):
`+r.map(l=>`• ${l.nome}: estoque ${l.estoque} (mín ${l.estMin}), vendeu ${l.qtdVendida}un`).join(`
`);p(u,"info")}renderModalForm(){if(document.getElementById("modal-pedido"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-pedido",e.innerHTML=`
      <div class="modal" style="min-width:550px;">
        <h2>🛍️ Novo Pedido de Compra</h2>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Fornecedor</label><select id="ped-fornecedor"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>Data</label><input type="date" id="ped-data"/></div>
          <div class="form-group"><label>Previsão Entrega</label><input type="date" id="ped-entrega"/></div>
        </div>
        <div style="border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:12px;">
          <div style="font-size:12px;font-weight:600;margin-bottom:8px;">📦 Itens do Pedido</div>
          <div class="form-grid" style="grid-template-columns:2fr 1fr 1fr auto;">
            <div class="form-group"><label>Produto</label><select id="ped-item-produto"><option value="">Selecione...</option></select></div>
            <div class="form-group"><label>Qtd</label><input type="number" id="ped-item-qtd" value="1" min="1"/></div>
            <div class="form-group"><label>Preço Unit.</label><input type="number" id="ped-item-preco" step="0.01" min="0"/></div>
            <div style="display:flex;align-items:flex-end;"><button class="btn btn-primary btn-sm" onclick="window.pedidosCompra.adicionarItem()">+</button></div>
          </div>
          <div id="ped-item-lista" style="margin-top:8px;"></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600;margin-top:8px;padding-top:8px;border-top:1px solid var(--border);">
            <span>Total Itens</span><span class="text-green text-mono" id="ped-itens-total">R$ 0,00</span>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group"><label>Frete (R$)</label><input type="number" id="ped-frete" step="0.01" min="0" value="0"/></div>
          <div class="form-group"><label>Desconto (R$)</label><input type="number" id="ped-desconto" step="0.01" min="0" value="0"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Observações</label><textarea id="ped-obs" rows="2"></textarea></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-pedido')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.pedidosCompra.salvar()">💾 Salvar Pedido</button>
        </div>
      </div>`,document.body.appendChild(e)}renderModalItens(){if(document.getElementById("modal-itens-pedido"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-itens-pedido",e.innerHTML=`
      <div class="modal">
        <h2>📋 Detalhes do Pedido</h2>
        <div id="modal-itens-content"></div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-itens-pedido')">Fechar</button>
        </div>
      </div>`,document.body.appendChild(e)}}const H=b=>String(b??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);class Ie{async render(){const e=document.getElementById("page-recebimento");e.innerHTML=`
      <div class="section-header">
        <h2>Recebimento de Mercadorias</h2>
        <button class="btn btn-primary" onclick="window.recebimento.abrirForm()">Registrar recebimento</button>
      </div>
      <div class="kpi-grid" id="recebimento-kpis"></div>
      <div id="recebimento-table-wrap"></div>
    `,window.recebimento=this,this.renderModalForm(),await this.loadData()}async loadData(){const t=await window.db.db.recebimentos.toArray();t.sort((o,s)=>new Date(s.data)-new Date(o.data));const a=t.reduce((o,s)=>o+(s.valor||0),0),i=t.filter(o=>o.status==="conferido").length;document.getElementById("recebimento-kpis").innerHTML=`
      <div class="kpi green"><div class="kpi-label">Valor recebido</div><div class="kpi-value">${c(a)}</div></div>
      <div class="kpi blue"><div class="kpi-label">Recebimentos</div><div class="kpi-value">${t.length}</div></div>
      <div class="kpi yellow"><div class="kpi-label">Conferidos</div><div class="kpi-value">${i}</div></div>
    `;const n=document.getElementById("recebimento-table-wrap");n.innerHTML=t.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Data/Hora</th><th>NF</th><th>Fornecedor</th><th>Produto(s)</th><th>Validade</th><th>Veiculo/Placa</th><th>Valor</th><th>Responsavel</th><th>Status</th></tr></thead>
          <tbody>${t.map(o=>`
            <tr>
              <td class="text-mono">${new Date(o.data).toLocaleString("pt-BR")}</td>
              <td class="text-mono">${H(o.nf||"-")}</td>
              <td>${H(o.fornecedor||"-")}</td>
              <td>${H(o.produtos||"-")}</td>
              <td class="text-mono">${o.validade?new Date(o.validade+"T00:00:00").toLocaleDateString("pt-BR"):"-"}</td>
              <td>${H(o.veiculo||"-")} <span class="text-mono">${H(o.placa||"")}</span></td>
              <td class="text-mono text-green">${c(o.valor||0)}</td>
              <td>${H(o.responsavel||"-")}</td>
              <td><span class="badge ${o.status==="conferido"?"green":"yellow"}">${H(o.status||"pendente")}</span></td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><p>Nenhum recebimento registrado</p></div>'}abrirForm(){["rec-nf","rec-fornecedor","rec-produtos","rec-validade","rec-veiculo","rec-placa","rec-valor","rec-responsavel","rec-obs"].forEach(e=>{const t=document.getElementById(e);t&&(t.value="")}),document.getElementById("rec-status").value="pendente",E("modal-recebimento")}async salvar(){const e=window.db.db,t={data:new Date().toISOString(),nf:document.getElementById("rec-nf").value.trim(),fornecedor:document.getElementById("rec-fornecedor").value.trim(),produtos:document.getElementById("rec-produtos").value.trim(),validade:document.getElementById("rec-validade").value,veiculo:document.getElementById("rec-veiculo").value.trim(),placa:document.getElementById("rec-placa").value.trim().toUpperCase(),valor:Number(document.getElementById("rec-valor").value||0),responsavel:document.getElementById("rec-responsavel").value.trim()||"Operador",observacao:document.getElementById("rec-obs").value.trim(),status:document.getElementById("rec-status").value};if(!t.nf||!t.produtos)return p("Informe NF e produto(s)","error");await e.recebimentos.add(t),p("Recebimento registrado","success"),C("modal-recebimento"),await this.loadData()}renderModalForm(){if(document.getElementById("modal-recebimento"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-recebimento",e.innerHTML=`
      <div class="modal">
        <h2>Registrar recebimento completo</h2>
        <div class="form-grid">
          <div class="form-group"><label>NF</label><input id="rec-nf"/></div>
          <div class="form-group"><label>Fornecedor</label><input id="rec-fornecedor"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Produto ou produtos</label><input id="rec-produtos" placeholder="Ex: Arroz 5kg lote A123, Feijao 1kg lote B22"/></div>
          <div class="form-group"><label>Prazo de validade</label><input type="date" id="rec-validade"/></div>
          <div class="form-group"><label>Valor</label><input type="number" step="0.01" id="rec-valor"/></div>
          <div class="form-group"><label>Veiculo</label><input id="rec-veiculo" placeholder="Caminhao, Fiorino, Van"/></div>
          <div class="form-group"><label>Placa</label><input id="rec-placa" placeholder="ABC1D23"/></div>
          <div class="form-group"><label>Responsavel</label><input id="rec-responsavel"/></div>
          <div class="form-group"><label>Status</label><select id="rec-status"><option value="pendente">Pendente</option><option value="conferido">Conferido</option><option value="divergente">Divergente</option></select></div>
          <div class="form-group" style="grid-column:span 2"><label>Observacoes de conferencia</label><textarea id="rec-obs"></textarea></div>
        </div>
        <div class="modal-footer"><button class="btn btn-secondary" onclick="window.closeModal('modal-recebimento')">Cancelar</button><button class="btn btn-primary" onclick="window.recebimento.salvar()">Salvar</button></div>
      </div>`,document.body.appendChild(e)}}class Ee{constructor(){this.editandoId=null}async render(){const e=document.getElementById("page-clientes");e.innerHTML=`
      <div class="section-header">
        <h2>👥 Clientes</h2>
        <div class="gap-8">
          <input type="text" id="cli-search" class="search-bar" placeholder="🔍 Buscar cliente..." autocomplete="off"/>
          <button class="btn btn-primary" onclick="window.clientes.abrirForm()">+ Novo Cliente</button>
        </div>
      </div>
      <div id="cli-table-wrap"><div class="empty-state"><div class="icon">👥</div><p>Carregando...</p></div></div>
    `,window.clientes=this,this.renderModalForm(),this.loadData(),document.getElementById("cli-search").addEventListener("input",()=>this.loadData())}async loadData(){var n;const e=window.db.db,t=(((n=document.getElementById("cli-search"))==null?void 0:n.value)||"").toLowerCase();let a=await e.clientes.toArray();t&&(a=a.filter(o=>o.nome.toLowerCase().includes(t)||o.cpf&&o.cpf.includes(t)||o.telefone&&o.telefone.includes(t)));const i=document.getElementById("cli-table-wrap");i.innerHTML=a.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>CPF</th><th>Nome</th><th>Telefone</th><th>Email</th><th>Pontos</th><th>Compras</th><th>Ações</th></tr></thead>
          <tbody>${a.map(o=>`
            <tr>
              <td class="text-mono">${y(o.cpf||"—")}</td>
              <td><strong>${y(o.nome)}</strong></td>
              <td>${y(o.telefone||"—")}</td>
              <td>${y(o.email||"—")}</td>
              <td class="text-mono"><span class="badge yellow">${o.pontos||0}</span></td>
              <td class="text-mono text-green">${c(o.totalCompras||0)}</td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="window.clientes.editar(${o.id})">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="window.clientes.excluir(${o.id})">🗑️</button>
              </td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><div class="icon">👥</div><p>Nenhum cliente encontrado</p></div>'}abrirForm(){this.editandoId=null,document.getElementById("modal-cli-title").textContent="Novo Cliente",document.getElementById("cli-cpf").value="",document.getElementById("cli-nome").value="",document.getElementById("cli-telefone").value="",document.getElementById("cli-email").value="",document.getElementById("cli-limite").value="",E("modal-cliente")}async editar(e){const a=await window.db.db.clientes.get(e);a&&(this.editandoId=e,document.getElementById("modal-cli-title").textContent="Editar Cliente",document.getElementById("cli-cpf").value=a.cpf||"",document.getElementById("cli-nome").value=a.nome,document.getElementById("cli-telefone").value=a.telefone||"",document.getElementById("cli-email").value=a.email||"",document.getElementById("cli-limite").value=a.limiteCredito||"",E("modal-cliente"))}async salvar(){const e=window.db.db,t={cpf:document.getElementById("cli-cpf").value.trim(),nome:document.getElementById("cli-nome").value.trim(),telefone:document.getElementById("cli-telefone").value.trim(),email:document.getElementById("cli-email").value.trim(),limiteCredito:parseFloat(document.getElementById("cli-limite").value)||0};if(!t.nome){p("⚠️ Informe o nome do cliente","error");return}this.editandoId?(await e.clientes.update(this.editandoId,t),p("✅ Cliente atualizado","success")):(t.pontos=0,t.totalCompras=0,await e.clientes.add(t),p("✅ Cliente criado","success")),C("modal-cliente"),this.loadData()}async excluir(e){if(!confirm("Excluir este cliente?"))return;await window.db.db.clientes.delete(e),p("🗑️ Cliente excluído","info"),this.loadData()}renderModalForm(){if(document.getElementById("modal-cliente"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-cliente",e.innerHTML=`
      <div class="modal">
        <h2 id="modal-cli-title">👥 Novo Cliente</h2>
        <div class="form-grid">
          <div class="form-group"><label>CPF</label><input type="text" id="cli-cpf" placeholder="000.000.000-00"/></div>
          <div class="form-group"><label>Telefone</label><input type="text" id="cli-telefone" placeholder="(11) 99999-9999"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Nome</label><input type="text" id="cli-nome" placeholder="Nome completo"/></div>
          <div class="form-group"><label>Email</label><input type="email" id="cli-email" placeholder="email@exemplo.com"/></div>
          <div class="form-group"><label>Limite Crédito (R$)</label><input type="number" id="cli-limite" step="0.01" min="0"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-cliente')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.clientes.salvar()">💾 Salvar</button>
        </div>
      </div>
    `,document.body.appendChild(e)}}class $e{async render(){const e=document.getElementById("page-fidelidade");e.innerHTML=`
      <div class="section-header">
        <h2>⭐ Programa Fidelidade</h2>
      </div>
      <div class="kpi-grid" id="fidelidade-kpis"></div>
      <div class="card">
        <div class="card-title">🏆 Ranking de Clientes</div>
        <div id="fidelidade-table-wrap"><div class="empty-state"><div class="icon">⭐</div><p>Carregando...</p></div></div>
      </div>
    `,await this.loadData()}async loadData(){var o,s;const t=await window.db.db.clientes.toArray(),a=t.reduce((d,r)=>d+(r.pontos||0),0),i=[...t].sort((d,r)=>(r.pontos||0)-(d.pontos||0)).slice(0,50);document.getElementById("fidelidade-kpis").innerHTML=`
      <div class="kpi green"><div class="kpi-label">⭐ Total Pontos</div><div class="kpi-value">${D(a)}</div><div class="kpi-sub">pontos ativos</div></div>
      <div class="kpi blue"><div class="kpi-label">👥 Clientes com Pontos</div><div class="kpi-value">${t.filter(d=>(d.pontos||0)>0).length}</div><div class="kpi-sub">de ${t.length} total</div></div>
      <div class="kpi yellow"><div class="kpi-label">🏆 Maior Pontuação</div><div class="kpi-value">${D(((o=i[0])==null?void 0:o.pontos)||0)}</div><div class="kpi-sub">${y(((s=i[0])==null?void 0:s.nome)||"—")}</div></div>
    `;const n=document.getElementById("fidelidade-table-wrap");n.innerHTML=i.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>#</th><th>Cliente</th><th>CPF</th><th>Pontos</th><th>Total Compras</th></tr></thead>
          <tbody>${i.map((d,r)=>`
            <tr>
              <td class="text-mono">${r+1}</td>
              <td><strong>${y(d.nome)}</strong></td>
              <td class="text-mono">${y(d.cpf||"—")}</td>
              <td><span class="badge yellow">⭐ ${D(d.pontos||0)}</span></td>
              <td class="text-mono text-green">${c(d.totalCompras||0)}</td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><div class="icon">⭐</div><p>Nenhum cliente cadastrado</p></div>'}}const O=b=>String(b??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);class ke{async render(){const e=document.getElementById("page-credito");e.innerHTML=`
      <div class="section-header">
        <h2>Crediario / Fiado</h2>
        <div class="gap-8">
          <input type="text" id="cred-search" class="search-bar" placeholder="Buscar cliente..." autocomplete="off"/>
          <button class="btn btn-primary" onclick="window.credito.abrirModal()">Nova compra fiado</button>
        </div>
      </div>
      <div class="kpi-grid" id="cred-kpis"></div>
      <div id="cred-table-wrap"></div>
    `,window.credito=this,this.renderModalCredito(),await this.loadData(),document.getElementById("cred-search").addEventListener("input",()=>this.loadData())}async getLancamentos(e){const t=await e.vendasPDV.filter(i=>["crediario","fiado","convenio"].some(n=>String(i.formaPagamento||"").includes(n))).toArray(),a=await e.cobrancas.toArray();return[...t.map(i=>({clienteNome:i.clienteNome,data:i.data,descricao:`Venda #${i.num||i.id}`,valor:i.total,status:i.status||"aberto",origem:"PDV"})),...a.map(i=>({clienteNome:i.clienteNome,data:i.data,descricao:i.descricao||i.observacao||"Lancamento manual",valor:i.valor,status:i.status||"aberto",origem:"Manual"}))].sort((i,n)=>new Date(n.data)-new Date(i.data))}async loadData(){var s;const e=window.db.db,t=(((s=document.getElementById("cred-search"))==null?void 0:s.value)||"").toLowerCase();let a=await this.getLancamentos(e);t&&(a=a.filter(d=>String(d.clienteNome||"").toLowerCase().split(/\s+/).some(r=>r.startsWith(t))));const i=a.filter(d=>d.status!=="pago").reduce((d,r)=>d+(r.valor||0),0),n=a.filter(d=>d.status==="pago").reduce((d,r)=>d+(r.valor||0),0);document.getElementById("cred-kpis").innerHTML=`
      <div class="kpi yellow"><div class="kpi-label">Aberto</div><div class="kpi-value">${c(i)}</div></div>
      <div class="kpi green"><div class="kpi-label">Pago</div><div class="kpi-value">${c(n)}</div></div>
      <div class="kpi blue"><div class="kpi-label">Lancamentos</div><div class="kpi-value">${a.length}</div></div>
    `;const o=document.getElementById("cred-table-wrap");o.innerHTML=a.length?`
      <div class="tbl-wrap">
        <table><thead><tr><th>Data</th><th>Horario</th><th>Cliente</th><th>Descricao</th><th>Origem</th><th>Valor</th><th>Status</th></tr></thead>
        <tbody>${a.map(d=>{const r=new Date(d.data);return`<tr><td class="text-mono">${r.toLocaleDateString("pt-BR")}</td><td class="text-mono">${r.toLocaleTimeString("pt-BR")}</td><td><strong>${O(d.clienteNome||"Cliente")}</strong></td><td>${O(d.descricao)}</td><td>${O(d.origem)}</td><td class="text-mono text-green">${c(d.valor)}</td><td><span class="badge ${d.status==="pago"?"green":"yellow"}">${O(d.status)}</span></td></tr>`}).join("")}</tbody></table>
      </div>
    `:'<div class="empty-state"><p>Nenhuma compra fiado/crediario registrada</p></div>'}async abrirModal(){const t=await window.db.db.clientes.toArray();document.getElementById("cred-cliente").innerHTML='<option value="">Selecione...</option>'+t.map(i=>`<option value="${i.id}">${O(i.nome)} (${O(i.cpf||"-")})</option>`).join(""),document.getElementById("cred-valor").value="",document.getElementById("cred-descricao").value="";const a=new Date;document.getElementById("cred-data").value=a.toISOString().slice(0,10),document.getElementById("cred-hora").value=a.toTimeString().slice(0,5),E("modal-credito")}async salvar(){const e=window.db.db,t=Number(document.getElementById("cred-cliente").value),a=await e.clientes.get(t),i=Number(document.getElementById("cred-valor").value||0);if(!a||i<=0)return p("Informe cliente e valor","error");const n=document.getElementById("cred-data").value,o=document.getElementById("cred-hora").value||"00:00",s=new Date(`${n}T${o}:00`).toISOString();await e.cobrancas.add({clienteId:t,clienteNome:a.nome,data:s,valor:i,vencimento:new Date().toISOString(),status:"aberto",descricao:document.getElementById("cred-descricao").value.trim()||"Compra fiado"}),await e.clientes.update(t,{totalCompras:(a.totalCompras||0)+i}),p("Compra fiado registrada","success"),C("modal-credito"),await this.loadData()}renderModalCredito(){if(document.getElementById("modal-credito"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-credito",e.innerHTML=`<div class="modal"><h2>Nova compra fiado</h2><div class="form-grid"><div class="form-group" style="grid-column:span 2"><label>Cliente</label><select id="cred-cliente"></select></div><div class="form-group"><label>Valor</label><input type="number" id="cred-valor" step="0.01"/></div><div class="form-group"><label>Descricao</label><input id="cred-descricao"/></div><div class="form-group"><label>Data da compra</label><input type="date" id="cred-data"/></div><div class="form-group"><label>Horario</label><input type="time" id="cred-hora"/></div></div><div class="modal-footer"><button class="btn btn-secondary" onclick="window.closeModal('modal-credito')">Cancelar</button><button class="btn btn-primary" onclick="window.credito.salvar()">Salvar</button></div></div>`,document.body.appendChild(e)}}class Ce{async render(){const e=document.getElementById("page-caixa");e.innerHTML=`
      <div class="section-header">
        <h2>💰 Caixa Geral</h2>
        <div class="gap-8">
          <button class="btn btn-primary" onclick="window.caixa.abrirEntrada()">+ Entrada</button>
          <button class="btn btn-danger" onclick="window.caixa.abrirSaida()">− Saída</button>
        </div>
      </div>
      <div class="kpi-grid" id="caixa-kpis"></div>
      <div class="card">
        <div class="card-title">📋 Movimentações</div>
        <div id="caixa-table-wrap"><div class="empty-state"><div class="icon">💰</div><p>Carregando...</p></div></div>
      </div>
    `,window.caixa=this,this.renderModalMov(),await this.loadData()}async loadData(){const t=await window.db.db.caixa.toArray();t.sort((s,d)=>new Date(d.data)-new Date(s.data));const a=t.filter(s=>s.tipo==="entrada").reduce((s,d)=>s+(d.valor||0),0),i=t.filter(s=>s.tipo==="saida").reduce((s,d)=>s+(d.valor||0),0),n=a-i;document.getElementById("caixa-kpis").innerHTML=`
      <div class="kpi green"><div class="kpi-label">💰 Saldo Atual</div><div class="kpi-value">${c(n)}</div><div class="kpi-sub">caixa geral</div></div>
      <div class="kpi blue"><div class="kpi-label">📈 Total Entradas</div><div class="kpi-value">${c(a)}</div><div class="kpi-sub">${t.filter(s=>s.tipo==="entrada").length} mov.</div></div>
      <div class="kpi red"><div class="kpi-label">📉 Total Saídas</div><div class="kpi-value">${c(i)}</div><div class="kpi-sub">${t.filter(s=>s.tipo==="saida").length} mov.</div></div>
    `;const o=document.getElementById("caixa-table-wrap");o.innerHTML=t.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Data</th><th>Tipo</th><th>Descrição</th><th>Forma Pag.</th><th>Valor</th></tr></thead>
          <tbody>${t.map(s=>`
            <tr>
              <td class="text-mono">${new Date(s.data).toLocaleString("pt-BR")}</td>
              <td><span class="badge ${s.tipo==="entrada"?"green":"red"}">${s.tipo==="entrada"?"Entrada":"Saída"}</span></td>
              <td>${y(s.descricao||"—")}</td>
              <td>${y(s.formaPagamento||"—")}</td>
              <td class="text-mono ${s.tipo==="entrada"?"text-green":"text-red"}">${s.tipo==="entrada"?"+":"-"} ${c(s.valor||0)}</td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><div class="icon">💰</div><p>Nenhuma movimentação</p></div>'}abrirEntrada(){document.getElementById("modal-mov-title").textContent="+ Registrar Entrada",document.getElementById("mov-tipo").value="entrada",this.openMovForm()}abrirSaida(){document.getElementById("modal-mov-title").textContent="− Registrar Saída",document.getElementById("mov-tipo").value="saida",this.openMovForm()}openMovForm(){document.getElementById("mov-descricao").value="",document.getElementById("mov-valor").value="",document.getElementById("mov-forma").value="dinheiro",E("modal-mov")}async salvar(){const e=window.db.db,t={tipo:document.getElementById("mov-tipo").value,descricao:document.getElementById("mov-descricao").value.trim()||"Movimentação",valor:parseFloat(document.getElementById("mov-valor").value)||0,formaPagamento:document.getElementById("mov-forma").value,data:new Date().toISOString()};if(t.valor<=0){p("⚠️ Informe um valor positivo","error");return}await e.caixa.add(t),p(`✅ ${t.tipo==="entrada"?"Entrada":"Saída"} registrada`,"success"),C("modal-mov"),this.loadData()}renderModalMov(){if(document.getElementById("modal-mov"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-mov",e.innerHTML=`
      <div class="modal">
        <h2 id="modal-mov-title">💰 Movimentação</h2>
        <input type="hidden" id="mov-tipo"/>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Descrição</label><input type="text" id="mov-descricao" placeholder="Descrição da movimentação"/></div>
          <div class="form-group"><label>Valor (R$)</label><input type="number" id="mov-valor" step="0.01" min="0"/></div>
          <div class="form-group"><label>Forma Pagamento</label><select id="mov-forma"><option value="dinheiro">Dinheiro</option><option value="credito">Crédito</option><option value="debito">Débito</option><option value="pix">PIX</option></select></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-mov')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.caixa.salvar()">💾 Salvar</button>
        </div>
      </div>
    `,document.body.appendChild(e)}}class Be{constructor(){this.editandoId=null}async render(){const e=document.getElementById("page-contas-pagar");e.innerHTML=`
      <div class="section-header">
        <h2>📤 Contas a Pagar</h2>
        <div class="gap-8">
          <button class="btn btn-primary" onclick="window.contasPagar.abrirForm()">+ Nova Conta</button>
          <button class="btn btn-secondary" onclick="window.contasPagar.filtrarVencidas()">⚠️ Vencidas</button>
        </div>
      </div>
      <div class="kpi-grid" id="cp-kpis"></div>
      <div class="card">
        <div class="card-title">📋 Contas</div>
        <div id="cp-table-wrap"><div class="empty-state"><div class="icon">📤</div><p>Carregando...</p></div></div>
      </div>
    `,window.contasPagar=this,this.renderModalForm(),await this.loadData()}async loadData(e=!1){const t=window.db.db;let a=await t.contasPagar.toArray();a.sort((m,g)=>new Date(m.vencimento)-new Date(g.vencimento)),e&&(a=a.filter(m=>m.status==="pendente"&&new Date(m.vencimento)<new Date));const i=new Date,n=a.filter(m=>m.status==="pendente"),o=n.filter(m=>new Date(m.vencimento)<i),s=n.filter(m=>new Date(m.vencimento)>=i&&new Date(m.vencimento)<=new Date(i.getTime()+7*864e5)),d=n.reduce((m,g)=>m+(g.valor||0),0),r=o.reduce((m,g)=>m+(g.valor||0),0);document.getElementById("cp-kpis").innerHTML=`
      <div class="kpi red"><div class="kpi-label">⚠️ Total Pendente</div><div class="kpi-value">${c(d)}</div><div class="kpi-sub">${n.length} contas</div></div>
      <div class="kpi yellow"><div class="kpi-label">📅 A Vencer (7d)</div><div class="kpi-value">${s.length}</div><div class="kpi-sub">${c(s.reduce((m,g)=>m+g.valor,0))}</div></div>
      <div class="kpi red"><div class="kpi-label">❌ Vencidas</div><div class="kpi-value">${o.length}</div><div class="kpi-sub">${c(r)} em atraso</div></div>
      <div class="kpi green"><div class="kpi-label">✅ Pagas (mês)</div><div class="kpi-value">${a.filter(m=>m.status==="pago"&&new Date(m.dataPagamento||m.vencimento).getMonth()===i.getMonth()).length}</div><div class="kpi-sub">contas pagas</div></div>
    `;const u={};(await t.fornecedores.toArray()).forEach(m=>u[m.id]=m);const v=document.getElementById("cp-table-wrap");v.innerHTML=a.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Descrição</th><th>Fornecedor</th><th>Centro Custo</th><th>Vencimento</th><th>Valor</th><th>Juros</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>${a.map(m=>{var h,w;const g=new Date(m.vencimento),B=m.status==="pendente"&&g<i,$=B?Math.floor((i-g)/(1e3*60*60*24)):0;return`<tr>
              <td><strong>${y(m.descricao||"—")}</strong></td>
              <td style="font-size:12px;">${y(((h=u[m.fornecedorId])==null?void 0:h.razaoSocial)||((w=u[m.fornecedorId])==null?void 0:w.fantasia)||"—")}</td>
              <td style="font-size:11px;color:var(--text3);">${y(m.centroCusto||"—")}</td>
              <td class="text-mono ${B?"text-red":""}">${g.toLocaleDateString("pt-BR")}${$?` <span class="badge red">+${$}d</span>`:""}</td>
              <td class="text-mono text-green">${c(m.valor||0)}</td>
              <td class="text-mono text-red">${m.juros?c(m.juros):"—"}</td>
              <td><span class="badge ${m.status==="pago"?"green":"red"}">${m.status||"pendente"}</span></td>
              <td>${m.status==="pendente"?`
                <button class="btn btn-sm btn-primary" onclick="window.contasPagar.pagar(${m.id})">✅</button>
                <button class="btn btn-sm btn-secondary" onclick="window.contasPagar.editar(${m.id})">✏️</button>
              `:""}</td>
            </tr>`}).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><div class="icon">📤</div><p>Nenhuma conta cadastrada</p></div>'}filtrarVencidas(){this.loadData(!0),p("⚠️ Exibindo apenas contas vencidas","info")}async abrirForm(){this.editandoId=null;const e=window.db.db,t=await e.fornecedores.toArray(),a=document.getElementById("cp-fornecedor");a.innerHTML='<option value="">Selecione...</option>',t.forEach(o=>{const s=document.createElement("option");s.value=o.id,s.textContent=o.razaoSocial||o.fantasia,a.appendChild(s)});const i=await e.centrosCusto.toArray(),n=document.getElementById("cp-centro-custo");n.innerHTML='<option value="">Nenhum</option>',i.forEach(o=>{const s=document.createElement("option");s.value=o.nome,s.textContent=o.nome,n.appendChild(s)}),document.getElementById("cp-descricao").value="",document.getElementById("cp-valor").value="",document.getElementById("cp-vencimento").value="",document.getElementById("cp-parcela").value="1",document.getElementById("cp-juros").value="",document.getElementById("cp-multa").value="",E("modal-contas-pagar")}async editar(e){const a=await window.db.db.contasPagar.get(e);a&&(this.editandoId=e,document.getElementById("cp-descricao").value=a.descricao||"",document.getElementById("cp-valor").value=a.valor||"",document.getElementById("cp-vencimento").value=a.vencimento||"",document.getElementById("cp-parcela").value=a.parcela||"1",document.getElementById("cp-juros").value=a.juros||"",document.getElementById("cp-multa").value=a.multa||"",document.getElementById("cp-centro-custo").value=a.centroCusto||"",E("modal-contas-pagar"))}async salvar(){const e=window.db.db,t={descricao:document.getElementById("cp-descricao").value.trim()||"Conta",fornecedorId:parseInt(document.getElementById("cp-fornecedor").value)||null,centroCusto:document.getElementById("cp-centro-custo").value.trim()||null,valor:parseFloat(document.getElementById("cp-valor").value)||0,vencimento:document.getElementById("cp-vencimento").value,parcela:document.getElementById("cp-parcela").value||"1",juros:parseFloat(document.getElementById("cp-juros").value)||0,multa:parseFloat(document.getElementById("cp-multa").value)||0,status:"pendente"};if(!t.vencimento||t.valor<=0){p("⚠️ Preencha todos os campos","error");return}if(this.editandoId)await e.contasPagar.update(this.editandoId,t),p("✅ Conta atualizada","success");else{const a=parseInt(t.parcela)||1;if(a>1){const i=t.valor/a;for(let n=0;n<a;n++){const o=new Date(t.vencimento);o.setMonth(o.getMonth()+n),await e.contasPagar.add({...t,valor:i,vencimento:o.toISOString().split("T")[0],parcela:`${n+1}/${a}`})}p(`✅ ${a} parcelas criadas`,"success")}else await e.contasPagar.add(t),p("✅ Conta registrada","success")}C("modal-contas-pagar"),this.loadData()}async pagar(e){const t=window.db.db,a=await t.contasPagar.get(e),i=(a.valor||0)+(a.juros||0)+(a.multa||0)-(a.desconto||0);await t.contasPagar.update(e,{status:"pago",dataPagamento:new Date().toISOString()}),await t.caixa.add({tipo:"saida",descricao:`Pg: ${a.descricao||"Conta"}`,valor:i,data:new Date().toISOString(),formaPagamento:"transferencia"}),await t.fluxoCaixa.add({filialId:1,data:new Date().toISOString(),tipo:"saida",descricao:`Pagamento: ${a.descricao}`,valor:i,saldo:0,categoria:a.centroCusto||"Operacional"}),p(`✅ ${a.descricao||"Conta"} paga — ${c(i)}`,"success"),this.loadData()}renderModalForm(){if(document.getElementById("modal-contas-pagar"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-contas-pagar",e.innerHTML=`
      <div class="modal">
        <h2>📤 Registrar Conta a Pagar</h2>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Descrição</label><input type="text" id="cp-descricao" placeholder="Ex: Aluguel"/></div>
          <div class="form-group"><label>Fornecedor</label><select id="cp-fornecedor"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>Centro de Custo</label><select id="cp-centro-custo"><option value="">Nenhum</option></select></div>
          <div class="form-group"><label>Valor (R$)</label><input type="number" id="cp-valor" step="0.01" min="0"/></div>
          <div class="form-group"><label>Vencimento</label><input type="date" id="cp-vencimento"/></div>
          <div class="form-group"><label>Parcelas</label><input type="number" id="cp-parcela" value="1" min="1" max="48"/></div>
          <div class="form-group"><label>Juros (%)</label><input type="number" id="cp-juros" step="0.01" min="0"/></div>
          <div class="form-group"><label>Multa (%)</label><input type="number" id="cp-multa" step="0.01" min="0"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-contas-pagar')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.contasPagar.salvar()">💾 Salvar</button>
        </div>
      </div>`,document.body.appendChild(e)}}class Se{constructor(){this.editandoId=null}async render(){const e=document.getElementById("page-contas-receber");e.innerHTML=`
      <div class="section-header">
        <h2>📩 Contas a Receber</h2>
        <div class="gap-8">
          <button class="btn btn-primary" onclick="window.contasReceber.abrirForm()">+ Nova Conta</button>
          <button class="btn btn-secondary" onclick="window.contasReceber.filtrarVencidas()">⚠️ Vencidas</button>
        </div>
      </div>
      <div class="kpi-grid" id="cr-kpis"></div>
      <div class="card">
        <div class="card-title">📋 Contas</div>
        <div id="cr-table-wrap"><div class="empty-state"><div class="icon">📩</div><p>Carregando...</p></div></div>
      </div>
    `,window.contasReceber=this,this.renderModalForm(),await this.loadData()}async loadData(e=!1){const t=window.db.db;let a=await t.contasReceber.toArray();a.sort((m,g)=>new Date(m.vencimento)-new Date(g.vencimento)),e&&(a=a.filter(m=>m.status==="pendente"&&new Date(m.vencimento)<new Date));const i=new Date,n=a.filter(m=>m.status==="pendente"),o=n.filter(m=>new Date(m.vencimento)<i),s=n.filter(m=>new Date(m.vencimento)>=i&&new Date(m.vencimento)<=new Date(i.getTime()+7*864e5)),d=n.reduce((m,g)=>m+(g.valor||0),0),r=o.reduce((m,g)=>m+(g.valor||0),0);document.getElementById("cr-kpis").innerHTML=`
      <div class="kpi blue"><div class="kpi-label">💰 Total a Receber</div><div class="kpi-value">${c(d)}</div><div class="kpi-sub">${n.length} contas</div></div>
      <div class="kpi yellow"><div class="kpi-label">📅 A Vencer (7d)</div><div class="kpi-value">${s.length}</div><div class="kpi-sub">${c(s.reduce((m,g)=>m+g.valor,0))}</div></div>
      <div class="kpi red"><div class="kpi-label">⚠️ Vencidas</div><div class="kpi-value">${o.length}</div><div class="kpi-sub">${c(r)} em atraso</div></div>
      <div class="kpi green"><div class="kpi-label">✅ Recebidas (mês)</div><div class="kpi-value">${a.filter(m=>m.status==="recebido"&&new Date(m.dataRecebimento||m.vencimento).getMonth()===i.getMonth()).length}</div><div class="kpi-sub">contas recebidas</div></div>
    `;const u={};(await t.clientes.toArray()).forEach(m=>u[m.id]=m);const v=document.getElementById("cr-table-wrap");v.innerHTML=a.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Descrição</th><th>Cliente</th><th>Vencimento</th><th>Valor</th><th>Parcela</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>${a.map(m=>{var h;const g=new Date(m.vencimento),B=m.status==="pendente"&&g<i,$=B?Math.floor((i-g)/(1e3*60*60*24)):0;return`<tr>
              <td><strong>${m.descricao||"—"}</strong></td>
              <td style="font-size:12px;">${((h=u[m.clienteId])==null?void 0:h.nome)||"—"}</td>
              <td class="text-mono ${B?"text-red":""}">${g.toLocaleDateString("pt-BR")}${$?` <span class="badge red">+${$}d</span>`:""}</td>
              <td class="text-mono text-green">${c(m.valor||0)}</td>
              <td class="text-mono" style="font-size:11px;">${m.parcela||"—"}</td>
              <td><span class="badge ${m.status==="recebido"?"green":"yellow"}">${m.status||"pendente"}</span></td>
              <td>${m.status==="pendente"?`
                <button class="btn btn-sm btn-primary" onclick="window.contasReceber.receber(${m.id})">✅</button>
                <button class="btn btn-sm btn-secondary" onclick="window.contasReceber.editar(${m.id})">✏️</button>
              `:""}</td>
            </tr>`}).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><div class="icon">📩</div><p>Nenhuma conta cadastrada</p></div>'}filtrarVencidas(){this.loadData(!0),p("⚠️ Exibindo apenas contas vencidas","info")}async abrirForm(){this.editandoId=null;const t=await window.db.db.clientes.toArray(),a=document.getElementById("cr-cliente");a.innerHTML='<option value="">Selecione...</option>',t.forEach(i=>{const n=document.createElement("option");n.value=i.id,n.textContent=i.nome,a.appendChild(n)}),document.getElementById("cr-descricao").value="",document.getElementById("cr-valor").value="",document.getElementById("cr-vencimento").value="",document.getElementById("cr-parcela").value="1",E("modal-contas-receber")}async editar(e){const a=await window.db.db.contasReceber.get(e);a&&(this.editandoId=e,document.getElementById("cr-descricao").value=a.descricao||"",document.getElementById("cr-valor").value=a.valor||"",document.getElementById("cr-vencimento").value=a.vencimento||"",document.getElementById("cr-parcela").value=a.parcela||"1",E("modal-contas-receber"))}async salvar(){const e=window.db.db,t={descricao:document.getElementById("cr-descricao").value.trim()||"Conta",clienteId:parseInt(document.getElementById("cr-cliente").value)||null,valor:parseFloat(document.getElementById("cr-valor").value)||0,vencimento:document.getElementById("cr-vencimento").value,parcela:document.getElementById("cr-parcela").value||"1",status:"pendente"};if(!t.vencimento||t.valor<=0){p("⚠️ Preencha todos os campos","error");return}if(this.editandoId)await e.contasReceber.update(this.editandoId,t),p("✅ Conta atualizada","success");else{const a=parseInt(t.parcela)||1;if(a>1){const i=t.valor/a;for(let n=0;n<a;n++){const o=new Date(t.vencimento);o.setMonth(o.getMonth()+n),await e.contasReceber.add({...t,valor:i,vencimento:o.toISOString().split("T")[0],parcela:`${n+1}/${a}`})}p(`✅ ${a} parcelas criadas`,"success")}else await e.contasReceber.add(t),p("✅ Conta registrada","success")}C("modal-contas-receber"),this.loadData()}async receber(e){const t=window.db.db,a=await t.contasReceber.get(e);await t.contasReceber.update(e,{status:"recebido",dataRecebimento:new Date().toISOString()}),await t.caixa.add({tipo:"entrada",descricao:`Rec: ${a.descricao||"Conta"}`,valor:a.valor,data:new Date().toISOString(),formaPagamento:"transferencia"}),await t.fluxoCaixa.add({filialId:1,data:new Date().toISOString(),tipo:"entrada",descricao:`Recebimento: ${a.descricao}`,valor:a.valor,saldo:0,categoria:"Recebimentos"}),p(`✅ ${a.descricao||"Conta"} recebida — ${c(a.valor)}`,"success"),this.loadData()}renderModalForm(){if(document.getElementById("modal-contas-receber"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-contas-receber",e.innerHTML=`
      <div class="modal">
        <h2>📩 Registrar Conta a Receber</h2>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Descrição</label><input type="text" id="cr-descricao" placeholder="Ex: Venda"/></div>
          <div class="form-group"><label>Cliente</label><select id="cr-cliente"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>Valor (R$)</label><input type="number" id="cr-valor" step="0.01" min="0"/></div>
          <div class="form-group"><label>Vencimento</label><input type="date" id="cr-vencimento"/></div>
          <div class="form-group"><label>Parcelas</label><input type="number" id="cr-parcela" value="1" min="1" max="48"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-contas-receber')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.contasReceber.salvar()">💾 Salvar</button>
        </div>
      </div>`,document.body.appendChild(e)}}class De{async render(){const e=document.getElementById("page-dre");e.innerHTML=`
      <div class="section-header"><h2>DRE / Demonstracao de Resultados</h2></div>
      <div class="kpi-grid" id="dre-kpis-top"></div>
      <div class="grid-2">
        <div class="card"><div class="card-title">Demonstracao do Resultado</div><div id="dre-tabela"></div></div>
        <div class="card"><div class="card-title">Composicao do Resultado</div><div class="chart-wrapper"><canvas id="dre-chart-composicao"></canvas></div></div>
      </div>
      <div class="grid-2 mt-16">
        <div class="card"><div class="card-title">Evolucao Mensal</div><div class="chart-wrapper"><canvas id="dre-chart-evolucao"></canvas></div></div>
        <div class="card"><div class="card-title">Indicadores</div><div id="dre-indicadores"></div></div>
      </div>
      <div class="card mt-16"><div class="card-title">Analise Detalhada</div><div id="dre-analise"></div></div>
    `,await this.loadData()}async loadData(){const e=window.db.db,t=await e.vendasPDV.toArray(),a=await e.itensPDV.toArray(),i=await e.produtos.toArray(),n=Object.fromEntries(i.map(I=>[I.id,I])),o=await e.contasPagar.toArray(),s=await e.contasReceber.toArray(),d=await e.folhaPagamento.toArray(),r=t.reduce((I,S)=>I+(S.total||0),0),u=a.reduce((I,S)=>{var q;return I+(S.qtd||0)*(((q=n[S.produtoId])==null?void 0:q.custo)||0)},0),l=o.reduce((I,S)=>I+(S.valor||0),0),v=s.filter(I=>I.status==="recebido").reduce((I,S)=>I+(S.valor||0),0),m=d.reduce((I,S)=>I+(S.bruto||0),0),g=l+m,B=r-u,$=B-g+v,h=r?B/r*100:0,w=r?$/r*100:0;document.getElementById("dre-kpis-top").innerHTML=`
      <div class="kpi green"><div class="kpi-label">Receita bruta</div><div class="kpi-value">${c(r)}</div><div class="kpi-sub">Faturamento total do periodo</div></div>
      <div class="kpi purple"><div class="kpi-label">Lucro bruto</div><div class="kpi-value">${c(B)}</div><div class="kpi-sub">Margem: ${h.toFixed(1)}%</div></div>
      <div class="kpi ${$>=0?"green":"red"}"><div class="kpi-label">Resultado liquido</div><div class="kpi-value">${c($)}</div><div class="kpi-sub">${$>=0?"Lucro":"Prejuizo"} no periodo</div></div>
      <div class="kpi blue"><div class="kpi-label">Margem liquida</div><div class="kpi-value">${w.toFixed(1)}%</div><div class="kpi-sub">${w>=0?"Positiva":"Negativa"}</div></div>
    `,document.getElementById("dre-tabela").innerHTML=`
      <div class="dre-table">
        <div class="dre-row"><span>Receita bruta</span><span class="text-mono text-green">${c(r)}</span></div>
        <div class="dre-row dre-sub"><span>(-) Custo das mercadorias (CMV)</span><span class="text-mono text-red">${c(u)}</span></div>
        <hr class="divider"/>
        <div class="dre-row dre-highlight"><span>Lucro bruto</span><span class="text-mono">${c(B)}</span></div>
        <div class="dre-row"><span>(-) Despesas operacionais</span><span class="text-mono text-red">${c(g)}</span></div>
        <div class="dre-row dre-sub"><span>-- Folha de pagamento</span><span class="text-mono text-red">${c(m)}</span></div>
        <div class="dre-row dre-sub"><span>-- Contas a pagar</span><span class="text-mono text-red">${c(l)}</span></div>
        <div class="dre-row"><span>(+) Outras receitas</span><span class="text-mono text-green">${c(v)}</span></div>
        <hr class="divider"/>
        <div class="dre-row dre-total"><span>Resultado liquido</span><span class="${$>=0?"text-green":"text-red"}">${c($)}</span></div>
      </div>
    `;const F=["Custo CMV","Despesas operacionais","Folha pagamento","Margem liquida"],R=[r?u/r*100:0,r?l/r*100:0,r?m/r*100:0,Math.max(0,w)];this.renderChart("dre-chart-composicao","doughnut",F,R,["#ef4444","#f59e0b","#3b82f6","#22c55e"]);const M={},P={};t.forEach(I=>{const S=new Date(I.data),q=`${S.getFullYear()}-${String(S.getMonth()+1).padStart(2,"0")}`;M[q]=(M[q]||0)+(I.total||0)}),o.forEach(I=>{const S=new Date(I.vencimento||I.data);if(S.getTime()){const q=`${S.getFullYear()}-${String(S.getMonth()+1).padStart(2,"0")}`;P[q]=(P[q]||0)+(I.valor||0)}});const L=Object.keys({...M,...P}).sort();this.renderChart("dre-chart-evolucao","bar",L,[L.map(I=>M[I]||0),L.map(I=>P[I]||0)],["#22c55e","#ef4444"],["Receita","Despesas"]);const N=t.length?r/t.length:0,V=a.reduce((I,S)=>I+(S.qtd||0),0),x=t.length?V/t.length:0;document.getElementById("dre-indicadores").innerHTML=`
      <div style="display:grid;gap:12px;">
        <div class="ind-card"><span class="ind-label">Ticket medio</span><span class="ind-value">${c(N)}</span></div>
        <div class="ind-card"><span class="ind-label">Itens por cupom</span><span class="ind-value">${x.toFixed(1)}</span></div>
        <div class="ind-card"><span class="ind-label">Custo fixo total</span><span class="ind-value">${c(l)}</span></div>
        <div class="ind-card"><span class="ind-label">Custo com pessoal</span><span class="ind-value">${c(m)}</span></div>
        <div class="ind-card"><span class="ind-label">% Custo pessoal / Receita</span><span class="ind-value">${r?(m/r*100).toFixed(1):0}%</span></div>
        <div class="ind-card"><span class="ind-label">Ponto equilibrio</span><span class="ind-value">${c(g/(h/100)||0)}</span></div>
      </div>
    `,document.getElementById("dre-analise").innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">
        <div class="analise-card ${h>=30?"green":h>=15?"yellow":"red"}">
          <div class="analise-label">Saude financeira</div>
          <div class="analise-status">${h>=30?"Saudavel":h>=15?"Atencao":"Critico"}</div>
          <div class="analise-desc">Margem bruta de ${h.toFixed(1)}%</div>
        </div>
        <div class="analise-card ${$>0?"green":"red"}">
          <div class="analise-label">Resultado</div>
          <div class="analise-status">${$>0?"Lucro":"Prejuizo"}</div>
          <div class="analise-desc">${$>0?"Operacao lucrativa":"Operacao deficitara"}</div>
        </div>
        <div class="analise-card ${w>=10?"green":w>=5?"yellow":"red"}">
          <div class="analise-label">Margem liquida</div>
          <div class="analise-status">${w.toFixed(1)}%</div>
          <div class="analise-desc">${w>=10?"Excelente":w>=5?"Media":"Baixa"}</div>
        </div>
      </div>
    `}renderChart(e,t,a,i,n,o){const s=document.getElementById(e);if(!s)return;const d=s.getContext("2d");this._charts&&this._charts[e]&&this._charts[e].destroy(),Array.isArray(i[0])||(i=[i]);const r={type:t,data:{labels:a,datasets:i[0].map?i.map((u,l)=>({label:o?o[l]:"",data:u,backgroundColor:Array.isArray(n[l])?n[l]:n[l]||n[0],borderColor:"#0d1117",borderWidth:t==="doughnut"?2:0})):[{data:i,backgroundColor:n,borderColor:"#0d1117",borderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!!o,labels:{color:"#8b949e",font:{size:11}}}},scales:t!=="doughnut"?{y:{beginAtZero:!0,ticks:{color:"#6e7681",font:{size:10},callback:u=>"R$ "+u.toFixed(0)},grid:{color:"#21262d"}},x:{ticks:{color:"#6e7681",font:{size:9}},grid:{display:!1}}}:void 0}};this._charts||(this._charts={}),this._charts[e]=new Chart(d,r)}}class Me{async render(){const e=document.getElementById("page-fluxo");e.innerHTML=`
      <div class="section-header">
        <h2>💸 Fluxo de Caixa</h2>
        <div class="gap-8">
          <button class="btn btn-primary" onclick="window.fluxoCaixa.abrirForm()">+ Nova Movimentação</button>
          <button class="btn btn-secondary" onclick="window.fluxoCaixa.gerarProjecao()">📊 Projeção</button>
        </div>
      </div>
      <div class="kpi-grid" id="fluxo-kpis"></div>
      <div class="card">
        <div class="card-title" style="display:flex;justify-content:space-between;">
          <span>📋 Movimentações</span>
          <span style="font-size:11px;color:var(--text3);">Entradas - Saídas = Saldo</span>
        </div>
        <div id="fluxo-table-wrap"><div class="empty-state"><div class="icon">💸</div><p>Carregando...</p></div></div>
      </div>
    `,window.fluxoCaixa=this,this.renderModalForm(),await this.loadData()}async loadData(){const e=window.db.db,t=await e.fluxoCaixa.toArray();t.sort((h,w)=>new Date(w.data)-new Date(h.data));const a=new Date,i=t.filter(h=>new Date(h.data).getMonth()===a.getMonth()&&new Date(h.data).getFullYear()===a.getFullYear()),n=i.filter(h=>h.tipo==="entrada").reduce((h,w)=>h+(w.valor||0),0),o=i.filter(h=>h.tipo==="saida").reduce((h,w)=>h+(w.valor||0),0),s=n-o,d=await e.contasPagar.filter(h=>h.status==="pendente").toArray(),r=await e.contasReceber.filter(h=>h.status==="pendente").toArray(),u=d.reduce((h,w)=>h+w.valor,0),l=r.reduce((h,w)=>h+w.valor,0),v=s+l-u,m=t.length&&t[0].saldo||0;document.getElementById("fluxo-kpis").innerHTML=`
      <div class="kpi blue"><div class="kpi-label">💰 Saldo Atual</div><div class="kpi-value">${c(m)}</div><div class="kpi-sub">disponível</div></div>
      <div class="kpi green"><div class="kpi-label">📈 Entradas (mês)</div><div class="kpi-value">${c(n)}</div><div class="kpi-sub">recebido no período</div></div>
      <div class="kpi red"><div class="kpi-label">📉 Saídas (mês)</div><div class="kpi-value">${c(o)}</div><div class="kpi-sub">pago no período</div></div>
      <div class="kpi ${v>=0?"green":"red"}"><div class="kpi-label">🔮 Saldo Projetado</div><div class="kpi-value">${c(v)}</div><div class="kpi-sub">com contas pendentes</div></div>
    `;const g={};for(const h of t){const w=h.categoria||"Geral";g[w]||(g[w]={entradas:0,saidas:0}),g[w][h.tipo]+=h.valor||0}let B="";for(const[h,w]of Object.entries(g))(w.entradas||w.saidas)&&(B+=`<div style="display:flex;justify-content:space-between;font-size:11px;padding:4px 0;border-bottom:1px solid var(--border);">
          <span>${h}</span>
          <span>${w.entradas?`<span class="text-green text-mono">+${c(w.entradas)}</span>`:""} ${w.saidas?`<span class="text-red text-mono">-${c(w.saidas)}</span>`:""}</span>
        </div>`);const $=document.getElementById("fluxo-table-wrap");$.innerHTML=`
      <div style="display:flex;gap:16px;margin-bottom:12px;">
        <div style="flex:1;">
          <div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:4px;">📊 Por Categoria</div>
          ${B||'<div style="color:var(--text3);font-size:11px;">Sem dados</div>'}
        </div>
      </div>
      ${t.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Data</th><th>Tipo</th><th>Categoria</th><th>Descrição</th><th>Valor</th><th>Saldo</th></tr></thead>
          <tbody>${t.map(h=>`
            <tr>
              <td class="text-mono">${new Date(h.data).toLocaleDateString("pt-BR")}</td>
              <td><span class="badge ${h.tipo==="entrada"?"green":"red"}">${h.tipo==="entrada"?"Entrada":"Saída"}</span></td>
              <td style="font-size:11px;color:var(--text3);">${h.categoria||"—"}</td>
              <td>${h.descricao||"—"}</td>
              <td class="text-mono ${h.tipo==="entrada"?"text-green":"text-red"}">${h.tipo==="entrada"?"+":"-"}${c(h.valor||0)}</td>
              <td class="text-mono">${c(h.saldo||0)}</td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
      `:'<div class="empty-state"><div class="icon">💸</div><p>Nenhum registro de fluxo de caixa</p></div>'}
    `}abrirForm(){document.getElementById("fc-tipo").value="entrada",document.getElementById("fc-descricao").value="",document.getElementById("fc-valor").value="",document.getElementById("fc-categoria").value="",E("modal-fluxo-caixa")}async salvar(){const e=window.db.db,t=document.getElementById("fc-tipo").value,a={filialId:1,data:new Date().toISOString(),tipo:t,descricao:document.getElementById("fc-descricao").value.trim()||"Movimentação",valor:parseFloat(document.getElementById("fc-valor").value)||0,categoria:document.getElementById("fc-categoria").value.trim()||"Geral"};if(a.valor<=0){p("⚠️ Informe o valor","error");return}const i=await e.fluxoCaixa.orderBy("id").last();a.saldo=((i==null?void 0:i.saldo)||0)+(t==="entrada"?a.valor:-a.valor),await e.fluxoCaixa.add(a),await e.caixa.add({tipo:t,descricao:a.descricao,valor:a.valor,data:new Date().toISOString(),formaPagamento:"outro"}),p("✅ Movimentação registrada","success"),C("modal-fluxo-caixa"),this.loadData()}async gerarProjecao(){const e=window.db.db,t=await e.fluxoCaixa.orderBy("id").last(),a=(t==null?void 0:t.saldo)||0,i=await e.contasPagar.filter(u=>u.status==="pendente").toArray(),n=await e.contasReceber.filter(u=>u.status==="pendente").toArray(),o=[];i.forEach(u=>o.push({data:new Date(u.vencimento),valor:-u.valor,desc:u.descricao})),n.forEach(u=>o.push({data:new Date(u.vencimento),valor:u.valor,desc:u.descricao})),o.sort((u,l)=>u.data-l.data);let s=a;const d=o.slice(0,15).map(u=>{s+=u.valor;const l=Math.ceil((u.data-new Date)/(1e3*60*60*24));return`${u.data.toLocaleDateString("pt-BR")} (${l>0?`${l}d`:l===0?"hoje":"vencido"}): ${u.desc||"—"} ${c(Math.abs(u.valor))} → Saldo: ${c(s)}`}).join(`
`),r=`🔮 PROJEÇÃO DE CAIXA
Saldo atual: ${c(a)}

Próximos vencimentos:
${d||"Nenhum vencimento próximo"}`;p(r,"info")}renderModalForm(){if(document.getElementById("modal-fluxo-caixa"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-fluxo-caixa",e.innerHTML=`
      <div class="modal">
        <h2>💸 Nova Movimentação</h2>
        <div class="form-grid">
          <div class="form-group"><label>Tipo</label><select id="fc-tipo"><option value="entrada">Entrada</option><option value="saida">Saída</option></select></div>
          <div class="form-group"><label>Valor (R$)</label><input type="number" id="fc-valor" step="0.01" min="0"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Descrição</label><input type="text" id="fc-descricao" placeholder="Descrição da movimentação"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Categoria</label><select id="fc-categoria">
            <option value="">Selecione...</option>
            <option value="Vendas">Vendas</option>
            <option value="Compras">Compras</option>
            <option value="Folha">Folha de Pagamento</option>
            <option value="Impostos">Impostos</option>
            <option value="Operacional">Operacional</option>
            <option value="Investimento">Investimento</option>
            <option value="Financeiro">Financeiro</option>
            <option value="Outro">Outro</option>
          </select></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-fluxo-caixa')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.fluxoCaixa.salvar()">💾 Salvar</button>
        </div>
      </div>`,document.body.appendChild(e)}}class Pe{constructor(){this.editandoId=null}async render(){const e=document.getElementById("page-funcionarios");e.innerHTML=`
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
    `,window.funcionarios=this,this.renderModalForm(),this.renderModalFerias(),await this.loadLista(),document.getElementById("func-search").addEventListener("input",()=>this.loadLista()),document.querySelectorAll(".tab[data-func-tab]").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll(".tab[data-func-tab]").forEach(a=>a.classList.remove("active")),t.classList.add("active"),t.dataset.funcTab==="lista"?this.loadLista():t.dataset.funcTab==="contratos"?this.loadContratos():t.dataset.funcTab==="ferias"&&this.loadFerias()})})}async loadLista(){var s;const e=window.db.db,t=(((s=document.getElementById("func-search"))==null?void 0:s.value)||"").toLowerCase();let a=await e.funcionarios.toArray();t&&(a=a.filter(d=>d.nome.toLowerCase().includes(t)||d.cpf&&d.cpf.includes(t)||d.cargo&&d.cargo.toLowerCase().includes(t)));const i=await e.contratosRH.toArray(),n=i.filter(d=>d.status==="ativo").length;document.getElementById("func-kpis").innerHTML=`
      <div class="kpi blue"><div class="kpi-label">👔 Total Funcionários</div><div class="kpi-value">${a.length}</div><div class="kpi-sub">cadastrados</div></div>
      <div class="kpi green"><div class="kpi-label">✅ Contratos Ativos</div><div class="kpi-value">${n}</div><div class="kpi-sub">/${a.length} funcionários</div></div>
      <div class="kpi yellow"><div class="kpi-label">💰 Folha Total</div><div class="kpi-value">${c(a.reduce((d,r)=>d+(r.salarioBase||0),0))}</div><div class="kpi-sub">salários base</div></div>
    `;const o=document.getElementById("func-content");o.innerHTML=a.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>CPF</th><th>Nome</th><th>Cargo</th><th>Setor</th><th>Salário Base</th><th>Contrato</th><th>Ações</th></tr></thead>
          <tbody>${a.map(d=>{const r=i.find(u=>u.funcionarioId===d.id&&u.status==="ativo");return`<tr>
              <td class="text-mono">${y(d.cpf||"—")}</td>
              <td><strong>${y(d.nome)}</strong></td>
              <td>${y(d.cargo||"—")}</td>
              <td>${y(d.setor||"—")}</td>
              <td class="text-mono text-green">${c(d.salarioBase||0)}</td>
              <td>${r?'<span class="badge green">Ativo</span>':'<span class="badge red">Sem contrato</span>'}</td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="window.funcionarios.editar(${d.id})">✏️</button>
                <button class="btn btn-sm btn-primary" onclick="window.funcionarios.novoContrato(${d.id})">📋</button>
                <button class="btn btn-sm btn-danger" onclick="window.funcionarios.excluir(${d.id})">🗑️</button>
              </td>
            </tr>`}).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><div class="icon">👔</div><p>Nenhum funcionário encontrado</p></div>'}async loadContratos(){const e=window.db.db,t=await e.contratosRH.toArray();t.sort((o,s)=>new Date(s.inicio)-new Date(o.inicio));const a={};(await e.funcionarios.toArray()).forEach(o=>a[o.id]=o);const n=document.getElementById("func-content");n.innerHTML=`
      <div style="margin-bottom:12px;">
        <button class="btn btn-primary btn-sm" onclick="window.funcionarios.novoContrato()">+ Novo Contrato</button>
      </div>
      ${t.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Funcionário</th><th>Tipo</th><th>Início</th><th>Término</th><th>Salário</th><th>Status</th><th></th></tr></thead>
          <tbody>${t.map(o=>{const s=a[o.funcionarioId];return`<tr>
              <td><strong>${y((s==null?void 0:s.nome)||"—")}</strong></td>
              <td>${y(o.tipo||"—")}</td>
              <td class="text-mono">${new Date(o.inicio).toLocaleDateString("pt-BR")}</td>
              <td class="text-mono">${o.fim?new Date(o.fim).toLocaleDateString("pt-BR"):"—"}</td>
              <td class="text-mono text-green">${c(o.salario||0)}</td>
              <td><span class="badge ${o.status==="ativo"?"green":o.status==="encerrado"?"red":"yellow"}">${y(o.status||"—")}</span></td>
              <td>${o.status==="ativo"?`<button class="btn btn-sm btn-danger" onclick="window.funcionarios.encerrarContrato(${o.id})">Encerrar</button>`:""}</td>
            </tr>`}).join("")}</tbody>
        </table>
      </div>
      `:'<div class="empty-state"><div class="icon">📋</div><p>Nenhum contrato registrado</p></div>'}
    `}async loadFerias(){const e=window.db.db,t=await e.ferias.toArray();t.sort((o,s)=>new Date(s.inicio)-new Date(o.inicio));const a={};(await e.funcionarios.toArray()).forEach(o=>a[o.id]=o);const n=document.getElementById("func-content");n.innerHTML=`
      <div style="margin-bottom:12px;">
        <button class="btn btn-primary btn-sm" onclick="window.funcionarios.registrarFerias()">+ Registrar Férias</button>
      </div>
      ${t.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Funcionário</th><th>Início</th><th>Fim</th><th>Dias</th><th>Status</th></tr></thead>
          <tbody>${t.map(o=>{const s=a[o.funcionarioId],d=Math.ceil((new Date(o.fim)-new Date(o.inicio))/(1e3*60*60*24))+1;return`<tr>
              <td><strong>${y((s==null?void 0:s.nome)||"—")}</strong></td>
              <td class="text-mono">${new Date(o.inicio).toLocaleDateString("pt-BR")}</td>
              <td class="text-mono">${new Date(o.fim).toLocaleDateString("pt-BR")}</td>
              <td class="text-mono">${d}</td>
              <td><span class="badge ${o.status==="aprovado"?"green":o.status==="cancelado"?"red":"yellow"}">${y(o.status||"pendente")}</span></td>
            </tr>`}).join("")}</tbody>
        </table>
      </div>
      `:'<div class="empty-state"><div class="icon">🏖️</div><p>Nenhum período de férias registrado</p></div>'}
    `}abrirForm(){this.editandoId=null,document.getElementById("modal-func-title").textContent="Novo Funcionário",document.getElementById("func-cpf").value="",document.getElementById("func-nome").value="",document.getElementById("func-cargo").value="",document.getElementById("func-setor").value="",document.getElementById("func-salario").value="",document.getElementById("func-data-nasc").value="",document.getElementById("func-telefone").value="",document.getElementById("func-email").value="",E("modal-funcionario")}async editar(e){const a=await window.db.db.funcionarios.get(e);a&&(this.editandoId=e,document.getElementById("modal-func-title").textContent="Editar Funcionário",document.getElementById("func-cpf").value=a.cpf||"",document.getElementById("func-nome").value=a.nome,document.getElementById("func-cargo").value=a.cargo||"",document.getElementById("func-setor").value=a.setor||"",document.getElementById("func-salario").value=a.salarioBase||"",document.getElementById("func-data-nasc").value=a.dataNascimento||"",document.getElementById("func-telefone").value=a.telefone||"",document.getElementById("func-email").value=a.email||"",E("modal-funcionario"))}async salvar(){const e=window.db.db,t={cpf:document.getElementById("func-cpf").value.trim(),nome:document.getElementById("func-nome").value.trim(),cargo:document.getElementById("func-cargo").value.trim(),setor:document.getElementById("func-setor").value.trim(),salarioBase:parseFloat(document.getElementById("func-salario").value)||0,dataNascimento:document.getElementById("func-data-nasc").value,telefone:document.getElementById("func-telefone").value.trim(),email:document.getElementById("func-email").value.trim()};if(!t.nome){p("⚠️ Informe o nome","error");return}this.editandoId?(await e.funcionarios.update(this.editandoId,t),p("✅ Funcionário atualizado","success")):(await e.funcionarios.add(t),p("✅ Funcionário criado","success")),C("modal-funcionario"),this.loadLista()}async excluir(e){if(!confirm("Excluir este funcionário?"))return;await window.db.db.funcionarios.delete(e),p("🗑️ Funcionário excluído","info"),this.loadLista()}async novoContrato(e){const t=window.db.db;if(e){const n=await t.funcionarios.get(e);document.getElementById("ct-funcionario").value=(n==null?void 0:n.id)||""}const a=await t.funcionarios.toArray(),i=document.getElementById("ct-funcionario");i.innerHTML='<option value="">Selecione...</option>',a.forEach(n=>{const o=document.createElement("option");o.value=n.id,o.textContent=n.nome,n.id===e&&(o.selected=!0),i.appendChild(o)}),document.getElementById("ct-tipo").value="CLT",document.getElementById("ct-salario").value="",document.getElementById("ct-inicio").value=new Date().toISOString().split("T")[0],document.getElementById("ct-fim").value="",document.getElementById("ct-modal-title").textContent="📋 Novo Contrato",E("modal-contrato")}async salvarContrato(){const e=window.db.db,t={funcionarioId:parseInt(document.getElementById("ct-funcionario").value),tipo:document.getElementById("ct-tipo").value,salario:parseFloat(document.getElementById("ct-salario").value)||0,inicio:document.getElementById("ct-inicio").value,fim:document.getElementById("ct-fim").value||null,status:"ativo"};if(!t.funcionarioId||!t.inicio){p("⚠️ Preencha os campos obrigatórios","error");return}await e.contratosRH.add(t),p("✅ Contrato registrado","success"),C("modal-contrato"),this.loadContratos()}async encerrarContrato(e){if(!confirm("Encerrar este contrato?"))return;await window.db.db.contratosRH.update(e,{status:"encerrado",fim:new Date().toISOString().split("T")[0]}),p("📋 Contrato encerrado","info"),this.loadContratos()}async registrarFerias(){const t=await window.db.db.funcionarios.toArray(),a=document.getElementById("ferias-funcionario");a.innerHTML='<option value="">Selecione...</option>',t.forEach(i=>{const n=document.createElement("option");n.value=i.id,n.textContent=i.nome,a.appendChild(n)}),document.getElementById("ferias-inicio").value="",document.getElementById("ferias-fim").value="",E("modal-ferias")}async salvarFerias(){const e=window.db.db,t={funcionarioId:parseInt(document.getElementById("ferias-funcionario").value),inicio:document.getElementById("ferias-inicio").value,fim:document.getElementById("ferias-fim").value,status:"aprovado"};if(!t.funcionarioId||!t.inicio||!t.fim){p("⚠️ Preencha todos os campos","error");return}if(new Date(t.fim)<new Date(t.inicio)){p("⚠️ Data fim deve ser após início","error");return}await e.ferias.add(t),p("🏖️ Férias registradas","success"),C("modal-ferias"),this.loadFerias()}async gerarRelatorio(){const t=await window.db.db.funcionarios.toArray(),a=t.length,i=t.reduce((d,r)=>d+(r.salarioBase||0),0),n={};t.forEach(d=>{n[d.cargo||"Sem cargo"]=(n[d.cargo||"Sem cargo"]||0)+1});const o=Object.entries(n).sort((d,r)=>r[1]-d[1]).slice(0,5),s=["📊 RELATÓRIO DE RH",`Total de funcionários: ${a}`,`Folha de pagamento: ${c(i)}`,`Média salarial: ${c(a?i/a:0)}`,"","Cargos:",...o.map(([d,r])=>`  ${d}: ${r} funcionário(s)`)].join(`
`);p(s,"info")}renderModalForm(){if(document.getElementById("modal-funcionario"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-funcionario",e.innerHTML=`
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
      </div>`,document.body.appendChild(e)}renderModalFerias(){if(document.getElementById("modal-ferias"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-ferias",e.innerHTML=`
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
      </div>`,document.body.appendChild(e);const t=document.createElement("div");t.className="modal-overlay hidden",t.id="modal-contrato",t.innerHTML=`
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
      </div>`,document.body.appendChild(t)}}class Le{constructor(){this.stream=null}async render(){const e=document.getElementById("page-ponto");e.innerHTML=`
      <div class="section-header">
        <h2>Ponto Eletronico</h2>
        <button class="btn btn-primary" onclick="window.ponto.registrarBatida()">Registrar batida</button>
      </div>
      <div class="kpi-grid" id="ponto-kpis"></div>
      <div class="card"><div class="card-title">Registros do dia</div><div id="ponto-table-wrap"></div></div>
    `,window.ponto=this,this.renderModalBatida(),await this.loadData()}async loadData(){const e=window.db.db,t=new Date;t.setHours(0,0,0,0);const a=new Date(t);a.setDate(a.getDate()+1);const i=await e.pontoBiometrico.filter(o=>new Date(o.data)>=t&&new Date(o.data)<a).toArray();i.sort((o,s)=>new Date(s.data)-new Date(o.data));const n=Object.fromEntries((await e.funcionarios.toArray()).map(o=>[o.id,o]));document.getElementById("ponto-kpis").innerHTML=`
      <div class="kpi green"><div class="kpi-label">Batidas hoje</div><div class="kpi-value">${i.length}</div></div>
      <div class="kpi blue"><div class="kpi-label">Dedo</div><div class="kpi-value">${i.filter(o=>o.metodo==="biometria_digital").length}</div></div>
      <div class="kpi purple"><div class="kpi-label">Facial</div><div class="kpi-value">${i.filter(o=>o.metodo==="biometria_facial").length}</div></div>
      <div class="kpi yellow"><div class="kpi-label">Relogio</div><div class="kpi-value">${i.filter(o=>o.metodo==="relogio_tradicional").length}</div></div>
    `,document.getElementById("ponto-table-wrap").innerHTML=i.length?`
      <div class="tbl-wrap"><table><thead><tr><th>Funcionario</th><th>Data</th><th>Hora</th><th>Tipo</th><th>Metodo</th><th>Equipamento</th><th>Autenticacao</th></tr></thead>
      <tbody>${i.map(o=>{var r;const s=((r=n[o.funcionarioId])==null?void 0:r.nome)||"-",d=new Date(o.data);return`<tr><td><strong>${s}</strong></td><td class="text-mono">${d.toLocaleDateString("pt-BR")}</td><td class="text-mono">${d.toLocaleTimeString("pt-BR")}</td><td><span class="badge blue">${o.tipo}</span></td><td>${this.metodoLabel(o.metodo)}</td><td>${o.equipamento||"-"}</td><td><span class="badge ${o.confianca>=80?"green":"yellow"}">${o.confianca||100}%</span></td></tr>`}).join("")}</tbody></table></div>
    `:'<div class="empty-state"><p>Nenhuma batida registrada hoje</p></div>'}metodoLabel(e){return{biometria_digital:"Biometrico por dedo",biometria_facial:"Biometrico facial",relogio_tradicional:"Relogio tradicional"}[e]||e}webAuthnDisponivel(){return!!window.PublicKeyCredential}async registrarDigital(e,t){if(!this.webAuthnDisponivel())return p("WebAuthn nao disponivel neste navegador. Use Windows Edge/Chrome com Windows Hello.","error"),!1;try{const a=crypto.getRandomValues(new Uint8Array(32)),i=new Uint8Array(4);new DataView(i.buffer).setUint32(0,e,!0);const n=await navigator.credentials.create({publicKey:{challenge:a,rp:{id:location.hostname,name:"NEXUS Market AI"},user:{id:i,name:t,displayName:t},pubKeyCredParams:[{type:"public-key",alg:-7}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required"},timeout:3e4}});return n?(await window.db.db.funcionarios.update(e,{webauthnId:btoa(String.fromCharCode(...new Uint8Array(n.rawId)))}),p("Digital cadastrada com Windows Hello","success"),!0):!1}catch(a){return p("Erro ao cadastrar digital: "+a.message,"error"),!1}}async verificarDigital(e){if(!this.webAuthnDisponivel())return!1;const a=await window.db.db.funcionarios.get(e);if(!(a!=null&&a.webauthnId))return!1;try{const i=crypto.getRandomValues(new Uint8Array(32)),n=Uint8Array.from(atob(a.webauthnId),s=>s.charCodeAt(0));return!!await navigator.credentials.get({publicKey:{challenge:i,allowCredentials:[{id:n,type:"public-key",transports:["internal"]}],userVerification:"required",timeout:3e4}})}catch{return!1}}async registrarBatida(){const t=await window.db.db.funcionarios.toArray();if(!t.length)return p("Nenhum funcionario cadastrado","error");const a=document.getElementById("bat-funcionario");a.innerHTML='<option value="">Selecione...</option>'+t.map(o=>`<option value="${o.id}">${o.nome}${o.webauthnId?" (digital cadastrada)":""}</option>`).join(""),document.getElementById("bat-foto-preview").innerHTML="",document.getElementById("bat-camera-box").classList.add("hidden"),document.getElementById("bat-resultado").classList.add("hidden"),document.getElementById("bat-webauthn-status").classList.add("hidden"),document.getElementById("bat-metodo").value="relogio_tradicional";const i=this.webAuthnDisponivel(),n=document.querySelector('#bat-metodo option[value="biometria_digital"]');n&&(n.textContent=i?"Biometrico por dedo (Windows Hello - biometria real)":"Biometrico por dedo (indisponivel - sem WebAuthn)",n.disabled=!i),E("modal-batida")}async capturarCamera(){try{const e=document.getElementById("bat-camera-video"),t=document.getElementById("bat-camera-box"),a=document.getElementById("btn-ativar-camera"),i=document.getElementById("btn-tirar-foto");if(this.stream){this.stream.getTracks().forEach(n=>n.stop()),this.stream=null,t.classList.add("hidden"),i.classList.add("hidden"),a.textContent="Ativar camera";return}this.stream=await navigator.mediaDevices.getUserMedia({video:{width:320,height:240,facingMode:"user"}}),e.srcObject=this.stream,t.classList.remove("hidden"),i.classList.remove("hidden"),a.textContent="Desativar camera",await e.play(),document.getElementById("bat-foto-preview").innerHTML='<span style="font-size:12px;color:var(--text3);">Camera ativa. Clique em "Tirar foto" para capturar.</span>'}catch(e){p("Erro ao acessar camera: "+e.message,"error")}}tirarFoto(){const e=document.getElementById("bat-camera-video"),t=document.createElement("canvas");t.width=320,t.height=240,t.getContext("2d").drawImage(e,0,0,320,240);const i=t.toDataURL("image/jpeg",.8);this.fotoCapturada=i,document.getElementById("bat-foto-preview").innerHTML=`
      <img src="${i}" style="width:120px;height:90px;border-radius:8px;border:2px solid var(--green);object-fit:cover;"/>
      <span style="font-size:11px;color:var(--green);">Foto capturada</span>
    `,document.getElementById("bat-camera-box").classList.add("hidden"),this.stream&&(this.stream.getTracks().forEach(n=>n.stop()),this.stream=null)}async salvar(){const e=window.db.db,t=Number(document.getElementById("bat-funcionario").value);if(!t)return p("Selecione um funcionario","error");const a=document.getElementById("bat-metodo").value;let i=100,n=null;if(a==="biometria_facial"){if(!this.fotoCapturada)return p("Tire a foto do funcionario primeiro","error");n=this.fotoCapturada,i=95}if(a==="biometria_digital"){const o=await e.funcionarios.get(t);if(o!=null&&o.webauthnId){if(!await this.verificarDigital(t))return p("Falha na verificacao da digital. Tente novamente.","error");i=98}else{if(!await this.registrarDigital(t,(o==null?void 0:o.nome)||"Funcionario"))return;i=100}}await e.pontoBiometrico.add({funcionarioId:t,data:new Date().toISOString(),tipo:document.getElementById("bat-tipo").value,metodo:a,equipamento:a==="biometria_facial"?"Webcam integrada":a==="biometria_digital"?"Windows Hello (biometria real)":document.getElementById("bat-equipamento").value.trim()||"Relogio padrao",confianca:i,foto:n}),p("Batida registrada","success"),this.fotoCapturada=null,this.stream&&(this.stream.getTracks().forEach(o=>o.stop()),this.stream=null),C("modal-batida"),await this.loadData()}renderModalBatida(){if(document.getElementById("modal-batida"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-batida",e.innerHTML=`
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
      </div>`,document.body.appendChild(e)}onMetodoChange(){const e=document.getElementById("bat-metodo").value,t=document.getElementById("bat-camera-area"),a=document.getElementById("bat-equipamento-group"),i=document.getElementById("btn-ativar-camera");document.getElementById("btn-tirar-foto");const n=document.getElementById("bat-webauthn-status");e==="biometria_facial"?(t.style.display="block",a.style.display="none",i.classList.remove("hidden"),n.classList.add("hidden")):e==="biometria_digital"?(t.style.display="none",a.style.display="none",n.classList.remove("hidden"),n.innerHTML='<span>Windows Hello: ao clicar em "Registrar batida", o leitor biometrico do sistema sera acionado.</span>'):(t.style.display="none",a.style.display="block",n.classList.add("hidden"))}cancelarCamera(){this.stream&&(this.stream.getTracks().forEach(e=>e.stop()),this.stream=null),this.fotoCapturada=null}}class Ae{async render(){const e=document.getElementById("page-folha");e.innerHTML=`
      <div class="section-header">
        <h2>Folha de Pagamento</h2>
        <div class="gap-8">
          <button class="btn btn-secondary" onclick="window.folha.abrirAdiantamento()">Adiantamento</button>
          <button class="btn btn-primary" onclick="window.folha.calcular()">Calcular mes</button>
        </div>
      </div>
      <div class="kpi-grid" id="folha-kpis"></div>
      <div class="grid-2 mt-16">
        <div class="card"><div class="card-title">Proventos</div><div class="chart-wrapper"><canvas id="folha-chart-proventos"></canvas></div></div>
        <div class="card"><div class="card-title">Descontos</div><div class="chart-wrapper"><canvas id="folha-chart-descontos"></canvas></div></div>
      </div>
      <div class="card mt-16"><div class="card-title">Registros completos da folha</div><div id="folha-table-wrap"></div></div>
    `,window.folha=this,this.renderModalAdiantamento(),await this.loadData()}async loadData(){const e=window.db.db,t=await e.folhaPagamento.toArray();t.sort((n,o)=>o.ano-n.ano||o.mes-n.mes);const a=Object.fromEntries((await e.funcionarios.toArray()).map(n=>[n.id,n])),i=t.reduce((n,o)=>(n.salario+=o.salarioBase||0,n.horasExtras+=o.horaExtraValor||0,n.adicionalNoturno+=o.adicionalNoturno||0,n.insalubridade+=o.insalubridade||0,n.periculosidade+=o.periculosidade||0,n.comissao+=o.comissao||0,n.bonus+=o.bonus||0,n.valeTransporte+=o.valeTransporte||0,n.valeRefeicao+=o.valeRefeicao||0,n.planoSaude+=o.planoSaude||0,n.inss+=o.inss||0,n.irrf+=o.irrf||0,n.outrosDescontos+=o.outrosDescontos||0,n.liquido+=o.liquido||0,n.bruto+=(o.bruto||o.salarioBase||0)+(o.horaExtraValor||0)+(o.adicionalNoturno||0)+(o.insalubridade||0)+(o.periculosidade||0)+(o.comissao||0)+(o.bonus||0),n),{salario:0,horasExtras:0,adicionalNoturno:0,insalubridade:0,periculosidade:0,comissao:0,bonus:0,valeTransporte:0,valeRefeicao:0,planoSaude:0,inss:0,irrf:0,outrosDescontos:0,liquido:0,bruto:0});document.getElementById("folha-kpis").innerHTML=`
      <div class="kpi green"><div class="kpi-label">Bruto total</div><div class="kpi-value">${c(i.bruto)}</div></div>
      <div class="kpi blue"><div class="kpi-label">Horas extras</div><div class="kpi-value">${c(i.horasExtras)}</div></div>
      <div class="kpi purple"><div class="kpi-label">Adicionais</div><div class="kpi-value">${c(i.adicionalNoturno+i.insalubridade+i.periculosidade)}</div></div>
      <div class="kpi yellow"><div class="kpi-label">Comissoes/bonus</div><div class="kpi-value">${c(i.comissao+i.bonus)}</div></div>
      <div class="kpi red"><div class="kpi-label">Descontos total</div><div class="kpi-value">${c(i.inss+i.irrf+i.valeTransporte+i.valeRefeicao+i.planoSaude+i.outrosDescontos)}</div></div>
      <div class="kpi green"><div class="kpi-label">Liquido total</div><div class="kpi-value">${c(i.liquido)}</div></div>
    `,this.renderChart("folha-chart-proventos","bar",["Salario","H.Extras","Ad.Noturno","Insalub.","Periculos.","Comissao","Bonus"],[[i.salario,i.horasExtras,i.adicionalNoturno,i.insalubridade,i.periculosidade,i.comissao,i.bonus]],["#22c55e"],["Proventos"]),this.renderChart("folha-chart-descontos","bar",["INSS","IRRF","VT","VR","Pl.Saude","Outros"],[[i.inss,i.irrf,i.valeTransporte,i.valeRefeicao,i.planoSaude,i.outrosDescontos]],["#ef4444"],["Descontos"]),document.getElementById("folha-table-wrap").innerHTML=t.length?`
      <div class="tbl-wrap"><table>
        <thead><tr>
          <th>Funcionario</th><th>Mes/Ano</th><th>Salario</th><th>H.Extra</th><th>Ad.Noturno</th><th>Insalub.</th>
          <th>Periculos.</th><th>Comissao</th><th>Bonus</th><th>Bruto</th><th>INSS</th><th>IRRF</th>
          <th>VT</th><th>VR</th><th>Pl.Saude</th><th>Outros</th><th>Liquido</th>
        </tr></thead>
        <tbody>${t.map(n=>{const o=a[n.funcionarioId];return`<tr>
            <td><strong>${(o==null?void 0:o.nome)||"-"}</strong></td>
            <td class="text-mono">${String(n.mes).padStart(2,"0")}/${n.ano}</td>
            <td class="text-mono">${c(n.salarioBase||0)}</td>
            <td class="text-mono">${n.horaExtraQtd||0}h / ${c(n.horaExtraValor||0)}</td>
            <td class="text-mono">${c(n.adicionalNoturno||0)}</td>
            <td class="text-mono">${c(n.insalubridade||0)}</td>
            <td class="text-mono">${c(n.periculosidade||0)}</td>
            <td class="text-mono">${c(n.comissao||0)}</td>
            <td class="text-mono">${c(n.bonus||0)}</td>
            <td class="text-mono">${c((n.salarioBase||0)+(n.horaExtraValor||0)+(n.adicionalNoturno||0)+(n.insalubridade||0)+(n.periculosidade||0)+(n.comissao||0)+(n.bonus||0))}</td>
            <td class="text-mono text-red">${c(n.inss||0)}</td>
            <td class="text-mono text-red">${c(n.irrf||0)}</td>
            <td class="text-mono text-red">${c(n.valeTransporte||0)}</td>
            <td class="text-mono text-red">${c(n.valeRefeicao||0)}</td>
            <td class="text-mono text-red">${c(n.planoSaude||0)}</td>
            <td class="text-mono text-red">${c(n.outrosDescontos||0)}</td>
            <td class="text-mono text-green"><strong>${c(n.liquido||0)}</strong></td>
          </tr>`}).join("")}</tbody></table>
      </div>`:'<div class="empty-state"><p>Nenhuma folha calculada. Clique em "Calcular mes" para gerar.</p></div>'}async calcular(){const e=window.db.db,t=await e.funcionarios.toArray();if(!t.length)return p("Nenhum funcionario cadastrado","error");const a=new Date,i=a.getMonth()+1,n=a.getFullYear();for(const o of t){const s=o.salarioBase||o.salario||0,d=s/220,r=o.horasExtrasMes||0,u=r*d*1.5,l=o.adicionalNoturno||0,v=o.insalubridade||0,m=o.periculosidade||0,g=o.comissaoMes||0,B=o.bonus||0,$=s+u+l+v+m+g+B,h=$<=1412?$*.075:$<=2666.68?$*.09:$<=4000.03?$*.12:Math.min($*.14,908.85),w=$-h-(o.dependentes||0)*189.59,F=w>4664.68?w*.275-884.96:w>3751.05?w*.225-636.13:w>2826.65?w*.15-354.8:w>2259.2?w*.075-169.44:0,R=o.valeTransporte||s*.06,M=o.valeRefeicao||0,P=o.planoSaude||0,L=o.outrosDescontos||0,N=h+Math.max(0,F)+R+M+P+L,V=$-N,x={funcionarioId:o.id,mes:i,ano:n,salarioBase:s,horaExtraQtd:r,horaExtraValor:u,adicionalNoturno:l,insalubridade:v,periculosidade:m,comissao:g,bonus:B,bruto:$,inss:h,irrf:Math.max(0,F),valeTransporte:R,valeRefeicao:M,planoSaude:P,outrosDescontos:L,liquido:V},I=await e.folhaPagamento.filter(S=>S.funcionarioId===o.id&&S.mes===i&&S.ano===n).first();I?await e.folhaPagamento.update(I.id,x):await e.folhaPagamento.add(x)}p(`Folha ${i}/${n} calculada com todos os dados`,"success"),await this.loadData()}async abrirAdiantamento(){p("Funcionalidade de adiantamento disponivel na proxima versao","info")}renderModalAdiantamento(){if(document.getElementById("modal-adiantamento"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-adiantamento",e.innerHTML=`<div class="modal"><h2>Adiantamento Salarial</h2><p>Em desenvolvimento</p><div class="modal-footer"><button class="btn btn-secondary" onclick="window.closeModal('modal-adiantamento')">Fechar</button></div></div>`,document.body.appendChild(e)}renderChart(e,t,a,i,n,o){const s=document.getElementById(e);if(!s)return;const d=s.getContext("2d");this._charts&&this._charts[e]&&this._charts[e].destroy(),Array.isArray(i[0])||(i=[i]),this._charts||(this._charts={}),this._charts[e]=new Chart(d,{type:t,data:{labels:a,datasets:i.map((r,u)=>({label:o?o[u]:"",data:r,backgroundColor:n[u]||n[0],borderColor:"#0d1117",borderWidth:1}))},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!!o,labels:{color:"#8b949e",font:{size:10}}}},scales:{y:{beginAtZero:!0,ticks:{color:"#6e7681",font:{size:9},callback:r=>"R$ "+(r||0).toFixed(0)},grid:{color:"#21262d"}},x:{ticks:{color:"#6e7681",font:{size:9}},grid:{display:!1}}}}})}}class Te{async render(){const e=document.getElementById("page-transporte");e.innerHTML=`
      <div class="section-header">
        <h2>🚚 Transporte / Entregas</h2>
        <button class="btn btn-primary" onclick="window.transporte.abrirForm()">+ Nova Entrega</button>
      </div>
      <div class="kpi-grid" id="transp-kpis"></div>
      <div class="card">
        <div class="card-title">📋 Entregas</div>
        <div id="transp-table-wrap"><div class="empty-state"><div class="icon">🚚</div><p>Carregando...</p></div></div>
      </div>
    `,window.transporte=this,this.renderModalForm(),await this.loadData()}async loadData(){const e=window.db.db,t=await e.entregas.toArray();t.sort((l,v)=>new Date(v.previsao)-new Date(l.previsao));const a=t.filter(l=>l.status==="pendente").length,i=t.filter(l=>l.status==="transito").length,n=t.filter(l=>l.status==="entregue").length;document.getElementById("transp-kpis").innerHTML=`
      <div class="kpi yellow"><div class="kpi-label">⏳ Pendentes</div><div class="kpi-value">${a}</div><div class="kpi-sub">entregas</div></div>
      <div class="kpi blue"><div class="kpi-label">🚚 Em Trânsito</div><div class="kpi-value">${i}</div><div class="kpi-sub">entregas</div></div>
      <div class="kpi green"><div class="kpi-label">✅ Entregues</div><div class="kpi-value">${n}</div><div class="kpi-sub">entregas</div></div>
    `;const o={},s={};(await e.veiculos.toArray()).forEach(l=>o[l.id]=l),(await e.motoristas.toArray()).forEach(l=>s[l.id]=l);const u=document.getElementById("transp-table-wrap");u.innerHTML=t.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Previsão</th><th>Cliente</th><th>Motorista</th><th>Veículo</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>${t.map(l=>{const v=s[l.motoristaId],m=o[l.veiculoId];return`<tr>
              <td class="text-mono">${l.previsao?new Date(l.previsao).toLocaleDateString("pt-BR"):"—"}</td>
              <td><strong>${l.clienteId||"—"}</strong></td>
              <td>${(v==null?void 0:v.nome)||"—"}</td>
              <td>${(m==null?void 0:m.placa)||"—"}</td>
              <td><span class="badge ${l.status==="entregue"?"green":l.status==="transito"?"blue":"yellow"}">${l.status||"pendente"}</span></td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="window.transporte.mudarStatus(${l.id},'transito')">🚚</button>
                <button class="btn btn-sm btn-primary" onclick="window.transporte.mudarStatus(${l.id},'entregue')">✅</button>
              </td>
            </tr>`}).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><div class="icon">🚚</div><p>Nenhuma entrega registrada</p></div>'}async abrirForm(){const e=window.db.db,t=await e.clientes.toArray(),a=await e.motoristas.toArray(),i=await e.veiculos.toArray(),n=document.getElementById("ent-cliente");n.innerHTML='<option value="">Selecione...</option>',t.forEach(d=>{const r=document.createElement("option");r.value=d.id,r.textContent=d.nome,n.appendChild(r)});const o=document.getElementById("ent-motorista");o.innerHTML='<option value="">Selecione...</option>',a.forEach(d=>{const r=document.createElement("option");r.value=d.id,r.textContent=d.nome,o.appendChild(r)});const s=document.getElementById("ent-veiculo");s.innerHTML='<option value="">Selecione...</option>',i.forEach(d=>{const r=document.createElement("option");r.value=d.id,r.textContent=`${d.placa} - ${d.modelo}`,s.appendChild(r)}),document.getElementById("ent-endereco").value="",document.getElementById("ent-previsao").value="",E("modal-entrega")}async salvar(){const e=window.db.db,t={clienteId:parseInt(document.getElementById("ent-cliente").value)||null,motoristaId:parseInt(document.getElementById("ent-motorista").value)||null,veiculoId:parseInt(document.getElementById("ent-veiculo").value)||null,endereco:document.getElementById("ent-endereco").value.trim(),previsao:document.getElementById("ent-previsao").value,status:"pendente"};await e.entregas.add(t),p("✅ Entrega registrada","success"),C("modal-entrega"),this.loadData()}async mudarStatus(e,t){await window.db.db.entregas.update(e,{status:t}),p(`✅ Status alterado para ${t}`,"success"),this.loadData()}renderModalForm(){if(document.getElementById("modal-entrega"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-entrega",e.innerHTML=`
      <div class="modal">
        <h2>🚚 Nova Entrega</h2>
        <div class="form-grid">
          <div class="form-group"><label>Cliente</label><select id="ent-cliente"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>Motorista</label><select id="ent-motorista"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>Veículo</label><select id="ent-veiculo"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>Previsão</label><input type="date" id="ent-previsao"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Endereço</label><textarea id="ent-endereco" rows="2" placeholder="Endereço de entrega"></textarea></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-entrega')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.transporte.salvar()">💾 Salvar</button>
        </div>
      </div>
    `,document.body.appendChild(e)}}class Fe{constructor(){this.editandoId=null}async render(){const e=document.getElementById("page-frota");e.innerHTML=`
      <div class="section-header">
        <h2>🚗 Frota de Veículos</h2>
        <div class="gap-8">
          <button class="btn btn-primary" onclick="window.frota.abrirForm()">+ Novo Veículo</button>
        </div>
      </div>
      <div class="kpi-grid" id="frota-kpis"></div>
      <div class="card">
        <div class="card-title">🚗 Veículos</div>
        <div id="frota-table-wrap"><div class="empty-state"><div class="icon">🚗</div><p>Carregando...</p></div></div>
      </div>
    `,window.frota=this,this.renderModalForm(),this.renderModalAbastecimento(),await this.loadData()}async loadData(){const t=await window.db.db.veiculos.toArray(),a=t.filter(o=>o.status==="ativo").length,i=t.filter(o=>o.status==="manutencao").length;document.getElementById("frota-kpis").innerHTML=`
      <div class="kpi green"><div class="kpi-label">✅ Ativos</div><div class="kpi-value">${a}</div><div class="kpi-sub">veículos</div></div>
      <div class="kpi red"><div class="kpi-label">🔧 Manutenção</div><div class="kpi-value">${i}</div><div class="kpi-sub">veículos</div></div>
      <div class="kpi blue"><div class="kpi-label">🚗 Total Frota</div><div class="kpi-value">${t.length}</div><div class="kpi-sub">veículos</div></div>
    `;const n=document.getElementById("frota-table-wrap");n.innerHTML=t.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Placa</th><th>Modelo</th><th>Tipo</th><th>Ano</th><th>KM</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>${t.map(o=>`
            <tr>
              <td class="text-mono"><strong>${o.placa||"—"}</strong></td>
              <td>${o.modelo||"—"}</td>
              <td>${o.tipo||"—"}</td>
              <td class="text-mono">${o.ano||"—"}</td>
              <td class="text-mono">${D(o.km||0)} km</td>
              <td><span class="badge ${o.status==="ativo"?"green":o.status==="manutencao"?"red":"yellow"}">${o.status||"—"}</span></td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="window.frota.editar(${o.id})">✏️</button>
                <button class="btn btn-sm btn-secondary" onclick="window.frota.abrirAbastecimento(${o.id})">⛽</button>
              </td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><div class="icon">🚗</div><p>Nenhum veículo cadastrado</p></div>'}abrirForm(){this.editandoId=null,document.getElementById("modal-frota-title").textContent="Novo Veículo",document.getElementById("vei-placa").value="",document.getElementById("vei-modelo").value="",document.getElementById("vei-tipo").value="",document.getElementById("vei-ano").value="",document.getElementById("vei-km").value="",document.getElementById("vei-status").value="ativo",E("modal-veiculo")}async editar(e){const a=await window.db.db.veiculos.get(e);a&&(this.editandoId=e,document.getElementById("modal-frota-title").textContent="Editar Veículo",document.getElementById("vei-placa").value=a.placa||"",document.getElementById("vei-modelo").value=a.modelo||"",document.getElementById("vei-tipo").value=a.tipo||"",document.getElementById("vei-ano").value=a.ano||"",document.getElementById("vei-km").value=a.km||0,document.getElementById("vei-status").value=a.status||"ativo",E("modal-veiculo"))}async salvar(){const e=window.db.db,t={placa:document.getElementById("vei-placa").value.trim().toUpperCase(),modelo:document.getElementById("vei-modelo").value.trim(),tipo:document.getElementById("vei-tipo").value.trim(),ano:document.getElementById("vei-ano").value.trim(),km:parseFloat(document.getElementById("vei-km").value)||0,status:document.getElementById("vei-status").value};if(!t.placa){p("⚠️ Informe a placa","error");return}this.editandoId?(await e.veiculos.update(this.editandoId,t),p("✅ Veículo atualizado","success")):(await e.veiculos.add(t),p("✅ Veículo criado","success")),C("modal-veiculo"),this.loadData()}async abrirAbastecimento(e){document.getElementById("abast-veiculo").value=e,document.getElementById("abast-litros").value="",document.getElementById("abast-valor").value="",document.getElementById("abast-km").value="",E("modal-abastecimento")}async salvarAbastecimento(){const e=window.db.db,t={veiculoId:parseInt(document.getElementById("abast-veiculo").value),data:new Date().toISOString(),litros:parseFloat(document.getElementById("abast-litros").value)||0,valor:parseFloat(document.getElementById("abast-valor").value)||0,km:parseFloat(document.getElementById("abast-km").value)||0};if(!t.litros||!t.valor){p("⚠️ Preencha litros e valor","error");return}await e.abastecimentos.add(t),p("✅ Abastecimento registrado","success"),C("modal-abastecimento")}renderModalForm(){if(document.getElementById("modal-veiculo"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-veiculo",e.innerHTML=`
      <div class="modal">
        <h2 id="modal-frota-title">🚗 Novo Veículo</h2>
        <div class="form-grid">
          <div class="form-group"><label>Placa</label><input type="text" id="vei-placa" placeholder="ABC-1234" style="text-transform:uppercase"/></div>
          <div class="form-group"><label>Modelo</label><input type="text" id="vei-modelo" placeholder="Ex: Fiorino"/></div>
          <div class="form-group"><label>Tipo</label><select id="vei-tipo"><option value="">Selecione...</option><option value="carro">Carro</option><option value="moto">Moto</option><option value="caminhao">Caminhão</option><option value="van">Van</option></select></div>
          <div class="form-group"><label>Ano</label><input type="text" id="vei-ano" placeholder="2024"/></div>
          <div class="form-group"><label>KM Atual</label><input type="number" id="vei-km" min="0"/></div>
          <div class="form-group"><label>Status</label><select id="vei-status"><option value="ativo">Ativo</option><option value="manutencao">Manutenção</option><option value="inativo">Inativo</option></select></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-veiculo')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.frota.salvar()">💾 Salvar</button>
        </div>
      </div>
    `,document.body.appendChild(e)}renderModalAbastecimento(){if(document.getElementById("modal-abastecimento"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-abastecimento",e.innerHTML=`
      <div class="modal">
        <h2>⛽ Abastecimento</h2>
        <input type="hidden" id="abast-veiculo"/>
        <div class="form-grid">
          <div class="form-group"><label>Litros</label><input type="number" id="abast-litros" step="0.01" min="0"/></div>
          <div class="form-group"><label>Valor (R$)</label><input type="number" id="abast-valor" step="0.01" min="0"/></div>
          <div class="form-group"><label>KM</label><input type="number" id="abast-km" min="0"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-abastecimento')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.frota.salvarAbastecimento()">💾 Salvar</button>
        </div>
      </div>
    `,document.body.appendChild(e)}}class Ne{async render(){const e=document.getElementById("page-entrega");e.innerHTML=`
      <div class="section-header">
        <h2>📍 Delivery</h2>
        <button class="btn btn-primary" onclick="window.delivery.abrirForm()">+ Novo Pedido Delivery</button>
      </div>
      <div class="kpi-grid" id="delivery-kpis"></div>
      <div class="card">
        <div class="card-title">📋 Pedidos Delivery</div>
        <div id="delivery-table-wrap"><div class="empty-state"><div class="icon">📍</div><p>Carregando...</p></div></div>
      </div>
    `,window.delivery=this,this.renderModalForm(),await this.loadData()}async loadData(){const a=(await window.db.db.pedidosVenda.toArray()).filter(s=>s.formaPagamento==="delivery"||s.status==="delivery");a.sort((s,d)=>new Date(d.data)-new Date(s.data));const i=a.filter(s=>s.status==="pendente"||s.status==="delivery").length,n=a.reduce((s,d)=>s+(d.total||0),0);document.getElementById("delivery-kpis").innerHTML=`
      <div class="kpi yellow"><div class="kpi-label">⏳ Pendentes</div><div class="kpi-value">${i}</div><div class="kpi-sub">pedidos</div></div>
      <div class="kpi green"><div class="kpi-label">💰 Total Delivery</div><div class="kpi-value">${c(n)}</div><div class="kpi-sub">receita delivery</div></div>
      <div class="kpi blue"><div class="kpi-label">📦 Total Pedidos</div><div class="kpi-value">${a.length}</div><div class="kpi-sub">histórico</div></div>
    `;const o=document.getElementById("delivery-table-wrap");o.innerHTML=a.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Data</th><th>Cliente</th><th>Total</th><th>Pagamento</th><th>Status</th></tr></thead>
          <tbody>${a.map(s=>`
            <tr>
              <td class="text-mono">${new Date(s.data).toLocaleDateString("pt-BR")}</td>
              <td><strong>${s.clienteId||"—"}</strong></td>
              <td class="text-mono text-green">${c(s.total||0)}</td>
              <td>${y(s.formaPagamento||"—")}</td>
              <td><span class="badge ${s.status==="entregue"?"green":s.status==="cancelado"?"red":"yellow"}">${y(s.status||"pendente")}</span></td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><div class="icon">📍</div><p>Nenhum pedido delivery</p></div>'}abrirForm(){document.getElementById("del-cliente").value="",document.getElementById("del-total").value="",document.getElementById("del-forma").value="pix",E("modal-delivery")}async salvar(){const e=window.db.db,t={clienteId:parseInt(document.getElementById("del-cliente").value)||null,data:new Date().toISOString(),total:parseFloat(document.getElementById("del-total").value)||0,formaPagamento:document.getElementById("del-forma").value,status:"pendente"};if(t.total<=0){p("⚠️ Informe o total","error");return}await e.pedidosVenda.add(t),p("✅ Pedido delivery registrado","success"),C("modal-delivery"),this.loadData()}renderModalForm(){if(document.getElementById("modal-delivery"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-delivery",e.innerHTML=`
      <div class="modal">
        <h2>📍 Novo Pedido Delivery</h2>
        <div class="form-grid">
          <div class="form-group"><label>Cliente ID</label><input type="number" id="del-cliente" min="0" placeholder="ID do cliente"/></div>
          <div class="form-group"><label>Total (R$)</label><input type="number" id="del-total" step="0.01" min="0"/></div>
          <div class="form-group"><label>Pagamento</label><select id="del-forma"><option value="pix">PIX</option><option value="dinheiro">Dinheiro</option><option value="credito">Crédito</option><option value="debito">Débito</option></select></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-delivery')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.delivery.salvar()">💾 Salvar</button>
        </div>
      </div>
    `,document.body.appendChild(e)}}const z=b=>String(b??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),ie=[{id:"NFC-e",nome:"NFC-e",desc:"Nota Fiscal de Consumidor Eletronica (vendas no varejo)",cfop:"5102",natureza:"Venda de mercadorias"},{id:"NF-e",nome:"NF-e",desc:"Nota Fiscal Eletronica (vendas e remessas entre empresas)",cfop:"5102",natureza:"Venda de mercadorias"},{id:"NFS-e",nome:"NFS-e",desc:"Nota Fiscal de Servicos Eletronica (prestacao de servicos)",cfop:"",natureza:"Prestacao de servicos"},{id:"CT-e",nome:"CT-e",desc:"Conhecimento de Transporte Eletronico (fretes e transportes)",cfop:"",natureza:"Servico de transporte"}];class qe{async render(){const e=document.getElementById("page-fiscal");e.innerHTML=`
      <div class="section-header">
        <h2>Emissao Fiscal</h2>
        <div class="gap-8">
          <button class="btn btn-secondary" onclick="window.openModal('modal-fiscal-config')">Configuracao fiscal</button>
          <button class="btn btn-primary" onclick="window.fiscal.abrirEmissao()">Preparar nota</button>
        </div>
      </div>
      <div class="kpi-grid" id="fiscal-kpis"></div>
      <div class="card"><div class="card-title">Documentos fiscais</div><div id="fiscal-table-wrap"></div></div>
    `,window.fiscal=this,this.renderModalConfig(),this.renderModalEmissao(),await this.loadData()}async loadData(){const t=await window.db.db.notasFiscais.toArray();t.sort((s,d)=>new Date(d.data)-new Date(s.data));const a=t.filter(s=>s.status==="autorizada").length,i=t.filter(s=>s.status==="pronta_transmissao").length,n=t.filter(s=>s.status==="rejeitada").length;document.getElementById("fiscal-kpis").innerHTML=`
      <div class="kpi green"><div class="kpi-label">Autorizadas</div><div class="kpi-value">${a}</div></div>
      <div class="kpi yellow"><div class="kpi-label">Prontas para transmitir</div><div class="kpi-value">${i}</div></div>
      <div class="kpi red"><div class="kpi-label">Rejeitadas</div><div class="kpi-value">${n}</div></div>
      <div class="kpi blue"><div class="kpi-label">Total</div><div class="kpi-value">${t.length}</div></div>
    `;const o=document.getElementById("fiscal-table-wrap");o.innerHTML=t.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Tipo</th><th>Numero</th><th>Serie</th><th>Natureza</th><th>Destinatario</th><th>Valor</th><th>Data</th><th>Status</th><th>Acao</th></tr></thead>
          <tbody>${t.map(s=>`
            <tr>
              <td><span class="badge cyan">${z(s.tipo)}</span></td>
              <td class="text-mono">${z(s.numero||"-")}</td>
              <td class="text-mono">${z(s.serie||"-")}</td>
              <td>${z(s.naturezaOperacao||"-")}</td>
              <td>${z(s.destinatarioNome||"Consumidor final")}</td>
              <td class="text-mono text-green">${c(s.valor||0)}</td>
              <td class="text-mono">${s.data?new Date(s.data).toLocaleString("pt-BR"):"-"}</td>
              <td><span class="badge ${s.status==="autorizada"?"green":s.status==="rejeitada"?"red":"yellow"}">${z(s.status||"rascunho")}</span></td>
              <td><button class="btn btn-sm btn-secondary" onclick="window.fiscal.visualizar(${s.id})">Ver</button></td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><p>Nenhum documento fiscal preparado.</p></div>'}abrirEmissao(){document.getElementById("nf-seletor-tipos").innerHTML=ie.map(e=>`
      <button class="nf-tipo-card" data-tipo="${e.id}" onclick="window.fiscal.selecionarTipo('${e.id}')">
        <strong>${e.nome}</strong>
        <span>${e.desc}</span>
      </button>
    `).join(""),document.getElementById("nf-tipo-info").classList.add("hidden"),this.tipoSelecionado=null,E("modal-fiscal-emissao")}async selecionarTipo(e){this.tipoSelecionado=e,document.querySelectorAll(".nf-tipo-card").forEach(r=>r.classList.toggle("active",r.dataset.tipo===e));const t=ie.find(r=>r.id===e);document.getElementById("nf-tipo-info").classList.remove("hidden"),document.getElementById("nf-tipo-info").innerHTML=`<strong>${t.nome}</strong> — ${t.desc}`,document.getElementById("nf-tipo").value=e,document.getElementById("nf-natureza").value=t.natureza,document.getElementById("nf-cfop").value=t.cfop;const a=window.db.db,i=await a.vendasPDV.toArray(),n=await a.nfeEntrada.toArray(),o=document.getElementById("nf-venda");o.innerHTML='<option value="">Selecione se for NFC-e/NF-e de venda</option>'+i.slice().reverse().map(r=>`<option value="${r.id}">Venda #${r.num||r.id} - ${c(r.total)} - ${new Date(r.data).toLocaleString("pt-BR")}</option>`).join("");const s=document.getElementById("nf-entrada");s.innerHTML='<option value="">Selecione se for NF-e de entrada</option>'+n.slice().reverse().map(r=>`<option value="${r.id}">Entrada ${z(r.numero||r.nf||r.id)} - ${c(r.valor)}</option>`).join("");const d=e==="NFC-e"||e==="NF-e";document.getElementById("nf-venda-group").style.display=d?"block":"none",document.getElementById("nf-entrada-group").style.display=e==="NF-e"?"block":"none",document.getElementById("nf-destinatario-group").style.display=e==="NF-e"?"block":"none",document.getElementById("nf-cpfcnpj-group").style.display=e==="NF-e"?"block":"none"}async prepararNota(){if(!this.tipoSelecionado)return p("Selecione o tipo de nota fiscal antes de preparar","error");const e=window.db.db,t=document.getElementById("nf-tipo").value,a=Number(document.getElementById("nf-venda").value||0),i=Number(document.getElementById("nf-entrada").value||0),n=document.getElementById("nf-natureza").value.trim(),o=document.getElementById("nf-cfop").value.trim(),s=document.getElementById("nf-destinatario").value.trim(),d=document.getElementById("nf-cpfcnpj").value.trim(),r=document.getElementById("nf-serie").value.trim()||"1";if(!n||!o)return p("Informe natureza da operacao e CFOP","error");if((t==="NFC-e"||t==="NF-e")&&!a&&!i)return p("Selecione uma venda ou uma nota de entrada","error");if(t==="NF-e"&&!s)return p("NF-e exige destinatario identificado (nome/razao social)","error");let u=0,l=[],v={};if(a){const h=await e.vendasPDV.get(a);l=await e.itensPDV.filter(w=>w.vendaPDVId===a).toArray(),u=(h==null?void 0:h.total)||0,v={vendaId:a,numeroOrigem:h==null?void 0:h.num}}else if(i){const h=await e.nfeEntrada.get(i);u=(h==null?void 0:h.valor)||0,v={entradaId:i,numeroOrigem:(h==null?void 0:h.numero)||(h==null?void 0:h.nf)}}const m=await e.configuracoes.get("fiscal"),g=m?JSON.parse(m.valor):{},B=Number(g.ultimoNumeroNF||0)+1,$={tipo:t,numero:B,serie:r,ambiente:g.ambiente||"homologacao",naturezaOperacao:n,cfop:o,destinatarioNome:s||"Consumidor final",destinatarioDoc:d,valor:u,itens:l,data:new Date().toISOString(),status:g.certificado?"pronta_transmissao":"pendente_certificado",chaveAcesso:"",protocolo:"",xml:"",...v};await e.notasFiscais.add($),await e.configuracoes.put({chave:"fiscal",valor:JSON.stringify({...g,ultimoNumeroNF:B,serieNFCe:r})}),C("modal-fiscal-emissao"),p($.status==="pronta_transmissao"?"Nota preparada para transmissao":"Nota preparada. Configure certificado antes de transmitir.","success"),await this.loadData()}async visualizar(e){const a=await window.db.db.notasFiscais.get(e);a&&alert([`${a.tipo} ${a.numero}/${a.serie}`,`Status: ${a.status}`,`Natureza: ${a.naturezaOperacao}`,`CFOP: ${a.cfop}`,`Destinatario: ${a.destinatarioNome} ${a.destinatarioDoc||""}`,`Valor: ${c(a.valor)}`,`Itens: ${(a.itens||[]).length}`].join(`
`))}renderModalEmissao(){if(document.getElementById("modal-fiscal-emissao"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-fiscal-emissao",e.innerHTML=`
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
      </div>`,document.body.appendChild(e)}renderModalConfig(){if(document.getElementById("modal-fiscal-config"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-fiscal-config",e.innerHTML=`
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
      </div>`,document.body.appendChild(e)}async salvarConfigFiscal(){const e=window.db.db,t=await e.configuracoes.get("fiscal"),a=t?JSON.parse(t.valor):{};await e.configuracoes.put({chave:"fiscal",valor:JSON.stringify({...a,ambiente:document.getElementById("fisc-ambiente").value,serieNFCe:document.getElementById("fisc-serie").value,csc:document.getElementById("fisc-csc").value,idCsc:document.getElementById("fisc-idcsc").value,certificado:document.getElementById("fisc-cert").files.length?"configurado":a.certificado})}),C("modal-fiscal-config"),p("Configuracao fiscal salva","success")}}class Re{async render(){const e=document.getElementById("page-tributacao");e.innerHTML=`
      <div class="section-header">
        <h2>⚖️ Tributação</h2>
        <button class="btn btn-primary" onclick="window.tributacao.abrirForm()">+ Nova Tributação</button>
      </div>
      <div class="card">
        <div class="card-title">📋 Tributações por Produto</div>
        <div id="trib-table-wrap"><div class="empty-state"><div class="icon">⚖️</div><p>Carregando...</p></div></div>
      </div>
    `,window.tributacao=this,this.renderModalForm(),await this.loadData()}async loadData(){const t=await window.db.db.produtos.filter(i=>i.ativo).toArray(),a=document.getElementById("trib-table-wrap");a.innerHTML=t.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Produto</th><th>NCM</th><th>CST</th><th>CFOP</th><th>ICMS %</th><th>PIS %</th><th>COFINS %</th></tr></thead>
          <tbody>${t.map(i=>`
            <tr>
              <td><strong>${y(i.nome)}</strong></td>
              <td class="text-mono">${i.ncm||"—"}</td>
              <td class="text-mono">${i.cst||"—"}</td>
              <td class="text-mono">${i.cfop||"—"}</td>
              <td class="text-mono">${i.icms!=null?i.icms+"%":"—"}</td>
              <td class="text-mono">${i.pis!=null?i.pis+"%":"—"}</td>
              <td class="text-mono">${i.cofins!=null?i.cofins+"%":"—"}</td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><div class="icon">⚖️</div><p>Nenhum produto cadastrado</p></div>'}abrirForm(){document.getElementById("trib-produto").value="",document.getElementById("trib-ncm").value="",document.getElementById("trib-cst").value="",document.getElementById("trib-cfop").value="",document.getElementById("trib-icms").value="",document.getElementById("trib-pis").value="",document.getElementById("trib-cofins").value="",E("modal-tributacao")}async salvar(){const e=window.db.db,t=parseInt(document.getElementById("trib-produto").value);if(!t){p("⚠️ Selecione um produto","error");return}await e.produtos.update(t,{ncm:document.getElementById("trib-ncm").value.trim(),cst:document.getElementById("trib-cst").value.trim(),cfop:document.getElementById("trib-cfop").value.trim(),icms:parseFloat(document.getElementById("trib-icms").value)||null,pis:parseFloat(document.getElementById("trib-pis").value)||null,cofins:parseFloat(document.getElementById("trib-cofins").value)||null}),p("✅ Tributação atualizada","success"),C("modal-tributacao"),this.loadData()}renderModalForm(){if(document.getElementById("modal-tributacao"))return;const e=window.db.db,t=document.createElement("div");t.className="modal-overlay hidden",t.id="modal-tributacao",t.innerHTML=`
      <div class="modal">
        <h2>⚖️ Configurar Tributação</h2>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Produto</label><select id="trib-produto"><option value="">Selecione...</option></select></div>
          <div class="form-group"><label>NCM</label><input type="text" id="trib-ncm" placeholder="Ex: 2106.90.90"/></div>
          <div class="form-group"><label>CST</label><input type="text" id="trib-cst" placeholder="Ex: 102"/></div>
          <div class="form-group"><label>CFOP</label><input type="text" id="trib-cfop" placeholder="Ex: 5102"/></div>
          <div class="form-group"><label>ICMS (%)</label><input type="number" id="trib-icms" step="0.01" min="0" max="100"/></div>
          <div class="form-group"><label>PIS (%)</label><input type="number" id="trib-pis" step="0.01" min="0" max="100"/></div>
          <div class="form-group"><label>COFINS (%)</label><input type="number" id="trib-cofins" step="0.01" min="0" max="100"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('modal-tributacao')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.tributacao.salvar()">💾 Salvar</button>
        </div>
      </div>
    `,document.body.appendChild(t),e.produtos.filter(a=>a.ativo).toArray().then(a=>{const i=document.getElementById("trib-produto");a.forEach(n=>{const o=document.createElement("option");o.value=n.id,o.textContent=`${n.nome} (${n.codigo||"—"})`,i.appendChild(o)})})}}class Ve{async render(){const e=document.getElementById("page-relatorios");e.innerHTML=`
      <div class="section-header"><h2>Relatorios Gerenciais</h2></div>
      <div class="kpi-grid" id="rel-kpis"></div>
      <div class="grid-2">
        <div class="card"><div class="card-title">Vendas x Despesas (ultimos meses)</div><div class="chart-wrapper"><canvas id="rel-chart-evolucao"></canvas></div></div>
        <div class="card"><div class="card-title">Composicao de vendas por forma pagamento</div><div class="chart-wrapper"><canvas id="rel-chart-pagamento"></canvas></div></div>
      </div>
      <div class="grid-2 mt-16">
        <div class="card"><div class="card-title">Top produtos por faturamento</div><div id="rel-top-produtos"></div></div>
        <div class="card"><div class="card-title">Indicadores de desempenho</div><div id="rel-indicadores"></div></div>
      </div>
      <div class="card mt-16"><div class="card-title">Produtos criticos (estoque baixo/zerado)</div><div id="rel-criticos"></div></div>
    `,await this.loadData()}async loadData(){const e=window.db.db,t=await e.vendasPDV.toArray(),a=await e.itensPDV.toArray(),i=await e.produtos.toArray(),n=await e.contasPagar.toArray(),o=await e.contasReceber.toArray(),s=await e.pagamentosPDV.toArray().catch(()=>[]),d=await e.clientes.toArray(),r=Object.fromEntries(i.map(f=>[f.id,f])),u=t.reduce((f,k)=>f+(k.total||0),0),l=a.reduce((f,k)=>{var j;return f+(k.qtd||0)*(((j=r[k.produtoId])==null?void 0:j.custo)||0)},0),v=i.reduce((f,k)=>f+(k.estoque||0)*(k.custo||0),0),m=i.reduce((f,k)=>f+(k.estoque||0)*(k.custo||0),0),g=t.length?u/t.length:0,B=n.filter(f=>f.status!=="pago").reduce((f,k)=>f+(k.valor||0),0),$=o.filter(f=>f.status!=="recebido").reduce((f,k)=>f+(k.valor||0),0),h=u-l,w=u?h/u*100:0,F=d.filter(f=>f.totalCompras>0).length,R=a.reduce((f,k)=>f+(k.qtd||0),0),M=t.length?R/t.length:0,P=Object.values(a.reduce((f,k)=>(f[k.produtoId]=f[k.produtoId]||{nome:k.nome,qtd:0,total:0},f[k.produtoId].qtd+=k.qtd||0,f[k.produtoId].total+=k.total||0,f),{})).sort((f,k)=>k.total-f.total).slice(0,10);document.getElementById("rel-kpis").innerHTML=`
      <div class="kpi green"><div class="kpi-label">Faturamento</div><div class="kpi-value">${c(u)}</div><div class="kpi-sub">${t.length} vendas | Ticket ${c(g)}</div></div>
      <div class="kpi blue"><div class="kpi-label">Lucro bruto</div><div class="kpi-value">${c(h)}</div><div class="kpi-sub">Margem ${w.toFixed(1)}%</div></div>
      <div class="kpi purple"><div class="kpi-label">Estoque (custo)</div><div class="kpi-value">${c(v)}</div><div class="kpi-sub">${i.length} SKUs</div></div>
      <div class="kpi red"><div class="kpi-label">A pagar</div><div class="kpi-value">${c(B)}</div><div class="kpi-sub">${n.filter(f=>f.status!=="pago").length} contas</div></div>
      <div class="kpi green"><div class="kpi-label">A receber</div><div class="kpi-value">${c($)}</div><div class="kpi-sub">${o.filter(f=>f.status!=="recebido").length} contas</div></div>
      <div class="kpi yellow"><div class="kpi-label">Clientes ativos</div><div class="kpi-value">${F}</div><div class="kpi-sub">Itens/cupom: ${M.toFixed(1)}</div></div>
    `;const L={},N={};t.forEach(f=>{const k=new Date(f.data),j=`${k.getFullYear()}-${String(k.getMonth()+1).padStart(2,"0")}`;L[j]=(L[j]||0)+(f.total||0)}),n.forEach(f=>{const k=new Date(f.vencimento||f.data);if(k.getTime()){const j=`${k.getFullYear()}-${String(k.getMonth()+1).padStart(2,"0")}`;N[j]=(N[j]||0)+(f.valor||0)}});const V=Object.keys({...L,...N}).sort();this.renderChart("rel-chart-evolucao","bar",V,[V.map(f=>L[f]||0),V.map(f=>N[f]||0)],["#22c55e","#ef4444"],["Receitas","Despesas"]);const x={};s.forEach(f=>{x[f.forma]=(x[f.forma]||0)+(f.valor||0)}),s.length||t.forEach(f=>{x[f.formaPagamento]=(x[f.formaPagamento]||0)+(f.total||0)});const I=Object.keys(x),S=Object.values(x),q=["#22c55e","#3b82f6","#f59e0b","#a855f7","#ef4444","#06b6d4","#f97316"];this.renderChart("rel-chart-pagamento","doughnut",I.length?I:["Sem dados"],S.length?S:[1],q);const re=Math.max(...P.map(f=>f.total),1);document.getElementById("rel-top-produtos").innerHTML=P.length?`
      ${P.map(f=>`
        <div style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;font-size:12px;">
            <span><strong>${y(f.nome)}</strong></span>
            <span class="text-mono">${c(f.total)}</span>
          </div>
          <div class="progress-bar"><div class="progress-fill green" style="width:${f.total/re*100}%;"></div></div>
          <div style="font-size:10px;color:var(--text3);display:flex;justify-content:space-between;">
            <span>${D(f.qtd)} unidades</span>
            <span>${(f.total/u*100).toFixed(1)}%</span>
          </div>
        </div>
      `).join("")}
    `:'<div class="empty-state"><p>Sem dados de vendas</p></div>';const J=l>0?l/m:0,le=J>0?Math.round(30/J):0;document.getElementById("rel-indicadores").innerHTML=`
      <div style="display:grid;gap:10px;">
        <div class="ind-card"><span class="ind-label">Ticket medio</span><span class="ind-value">${c(g)}</span><span class="ind-sub">Valor medio por venda</span></div>
        <div class="ind-card"><span class="ind-label">Itens por cupom</span><span class="ind-value">${M.toFixed(1)}</span><span class="ind-sub">Produtos por venda</span></div>
        <div class="ind-card"><span class="ind-label">Giro de estoque</span><span class="ind-value">${J.toFixed(2)}x</span><span class="ind-sub">Vezes no mes</span></div>
        <div class="ind-card"><span class="ind-label">Cobertura de estoque</span><span class="ind-value">${le} dias</span><span class="ind-sub">Tempo para zerar estoque</span></div>
        <div class="ind-card"><span class="ind-label">Margem bruta</span><span class="ind-value">${w.toFixed(1)}%</span><span class="ind-sub">Lucro sobre vendas</span></div>
        <div class="ind-card"><span class="ind-label">Clientes cadastrados</span><span class="ind-value">${d.length}</span><span class="ind-sub">${F} com compras</span></div>
      </div>
    `;const Z=i.filter(f=>(f.estoque||0)<=(f.estMin||5)).slice(0,30);document.getElementById("rel-criticos").innerHTML=Z.length?`
      <div class="tbl-wrap"><table><thead><tr><th>Produto</th><th>Estoque</th><th>Minimo</th><th>Custo parado</th><th>Status</th></tr></thead>
      <tbody>${Z.map(f=>`<tr><td><strong>${y(f.nome)}</strong></td><td class="text-mono">${f.estoque||0}</td><td class="text-mono">${f.estMin||5}</td><td class="text-mono">${c((f.estoque||0)*(f.custo||0))}</td><td><span class="badge ${(f.estoque||0)<=0?"red":"yellow"}">${(f.estoque||0)<=0?"Zerado":"Baixo"}</span></td></tr>`).join("")}</tbody></table></div>
    `:'<div class="empty-state"><p>Todos os produtos com estoque adequado</p></div>'}renderChart(e,t,a,i,n,o){const s=document.getElementById(e);if(!s)return;const d=s.getContext("2d");this._charts&&this._charts[e]&&this._charts[e].destroy(),Array.isArray(i[0])||(i=[i]),this._charts||(this._charts={}),this._charts[e]=new Chart(d,{type:t,data:{labels:a,datasets:i[0].map?i.map((r,u)=>({label:o?o[u]:"",data:r,backgroundColor:n[u]||n[0],borderColor:"#0d1117",borderWidth:t==="doughnut"?2:0})):[{data:i,backgroundColor:n,borderColor:"#0d1117",borderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!!o||t==="doughnut",labels:{color:"#8b949e",font:{size:10},boxWidth:12,padding:8}}},scales:t!=="doughnut"?{y:{beginAtZero:!0,ticks:{color:"#6e7681",font:{size:9},callback:r=>"R$ "+(r||0).toFixed(0)},grid:{color:"#21262d"}},x:{ticks:{color:"#6e7681",font:{size:9}},grid:{display:!1}}}:void 0}})}}class je{async render(){const e=document.getElementById("page-vendas-hist");e.innerHTML=`
      <div class="section-header">
        <h2>🗃️ Histórico de Vendas</h2>
        <div class="gap-8">
          <input type="text" id="vendas-search" class="search-bar" placeholder="🔍 Buscar..." autocomplete="off"/>
        </div>
      </div>
      <div id="vendas-hist-wrap"><div class="empty-state"><div class="icon">🗃️</div><p>Carregando...</p></div></div>
    `,window.vendasHist=this,this.loadData(),document.getElementById("vendas-search").addEventListener("input",()=>this.loadData())}async loadData(){var n;const e=window.db.db,t=(((n=document.getElementById("vendas-search"))==null?void 0:n.value)||"").toLowerCase();let a=await e.vendasPDV.toArray();a.sort((o,s)=>new Date(s.data)-new Date(o.data)),t&&(a=a.filter(o=>o.clienteNome&&o.clienteNome.toLowerCase().includes(t)||o.formaPagamento&&o.formaPagamento.toLowerCase().includes(t)||String(o.num).includes(t)));const i=document.getElementById("vendas-hist-wrap");i.innerHTML=a.length?`
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>#</th><th>Data</th><th>Cliente</th><th>Itens</th><th>Total</th><th>Pagamento</th><th>Imprimir</th></tr></thead>
          <tbody>${a.map(o=>`
            <tr>
              <td class="text-mono">${o.num||o.id}</td>
              <td class="text-mono">${new Date(o.data).toLocaleString("pt-BR")}</td>
              <td><strong>${y(o.clienteNome||"Consumidor Final")}</strong></td>
              <td class="text-mono">${o.itens||0}</td>
              <td class="text-mono text-green">${c(o.total)}</td>
              <td><span class="badge blue">${y(o.formaPagamento||"—")}</span></td>
              <td><button class="btn btn-sm btn-secondary" onclick="window.vendasHist.reprint(${o.id})">🖨️</button></td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    `:'<div class="empty-state"><div class="icon">🗃️</div><p>Nenhuma venda encontrada</p></div>'}async reprint(e){var d;const t=window.db.db,a=await t.vendasPDV.get(e);if(!a){p("⚠️ Venda não encontrada","error");return}const i=await t.itensPDV.where("vendaPDVId").equals(e).toArray(),n=JSON.parse(localStorage.getItem("loja_config")||"{}"),o=`
      <div class="receipt">
        <div class="receipt-center receipt-bold" style="font-size:14px;">${n.nome||"SUPERMERCADO"}</div>
        <div class="receipt-center" style="font-size:10px;">${n.endereco||""}</div>
        <div class="receipt-center" style="font-size:10px;">CNPJ: ${n.cnpj||"00.000.000/0001-00"}</div>
        <div class="receipt-line"></div>
        <div class="receipt-center">CUPOM NÃO FISCAL - REIMPRESSÃO</div>
        <div class="receipt-center" style="font-size:10px;">${new Date(a.data).toLocaleString("pt-BR")} | Venda #${a.num||a.id}</div>
        <div class="receipt-line"></div>
        ${i.map(r=>{var u;return`
          <div style="margin-bottom:2px;">${y((u=r.nome)==null?void 0:u.substring(0,24))}</div>
          <div class="receipt-row"><span>${r.qtd||0} x ${c(r.preco)}</span><span>${c(r.total)}</span></div>
        `}).join("")}
        <div class="receipt-line"></div>
        <div class="receipt-row receipt-bold" style="font-size:14px;"><span>TOTAL</span><span>${c(a.total)}</span></div>
        <div class="receipt-row"><span>Pagamento</span><span>${y(((d=a.formaPagamento)==null?void 0:d.toUpperCase())||"—")}</span></div>
        ${a.clienteNome&&a.clienteNome!=="Consumidor Final"?`<div class="receipt-row"><span>Cliente</span><span>${y(a.clienteNome)}</span></div>`:""}
        <div class="receipt-line"></div>
        <div class="receipt-center" style="font-size:10px;">Obrigado pela preferência!</div>
      </div>
    `,s=window.open("","_blank");s.document.write(`<html><body style="font-family:monospace;">${o}</body></html>`),s.print(),s.close(),p("🖨️ Reimpressão enviada","info")}}class He{async render(){const e=document.getElementById("page-configuracoes");e.innerHTML=`
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
    `,window.configuracoes=this,this.bindTabs(),await this.loadTab("loja")}bindTabs(){document.querySelectorAll(".cfg-tab").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".cfg-tab").forEach(t=>t.classList.remove("active")),e.classList.add("active"),this.loadTab(e.dataset.tab)})})}async loadTab(e){const t=document.getElementById("cfg-content"),a={loja:()=>this.renderLoja(t),pdv:()=>this.renderPDV(t),fiscal:()=>this.renderFiscal(t),tef:()=>this.renderTEF(t),email:()=>this.renderEmail(t),sistema:()=>this.renderSistema(t)};a[e]&&await a[e]()}async renderLoja(e){let a=await window.db.db.configuracoes.get("loja"),i={};try{i=a?JSON.parse(a.valor):{}}catch{}e.innerHTML=`
      <div class="card"><div class="card-title">Dados da Loja / Empresa</div>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>Nome fantasia</label><input type="text" id="cfg-loja-nome" value="${i.nome||""}" placeholder="Nome da loja"/></div>
          <div class="form-group"><label>Razao social</label><input type="text" id="cfg-loja-razao" value="${i.razaoSocial||""}" placeholder="Razao social"/></div>
          <div class="form-group"><label>CNPJ</label><input type="text" id="cfg-loja-cnpj" value="${i.cnpj||""}" placeholder="00.000.000/0001-00"/></div>
          <div class="form-group"><label>Inscricao estadual</label><input type="text" id="cfg-loja-ie" value="${i.ie||""}" placeholder="IE"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Endereco</label><input type="text" id="cfg-loja-end" value="${i.endereco||""}" placeholder="Rua, n, bairro, cidade- UF"/></div>
          <div class="form-group"><label>Telefone</label><input type="text" id="cfg-loja-tel" value="${i.telefone||""}" placeholder="(11) 99999-9999"/></div>
          <div class="form-group"><label>Email</label><input type="email" id="cfg-loja-email" value="${i.email||""}" placeholder="loja@exemplo.com"/></div>
        </div>
        <button class="btn btn-primary" onclick="window.configuracoes.salvarLoja()">Salvar dados da loja</button>
      </div>
      <div class="card mt-16"><div class="card-title">Regime tributario</div>
        <div class="form-grid">
          <div class="form-group"><label>Regime</label><select id="cfg-regime"><option value="SN" ${i.regime==="SN"?"selected":""}>Simples Nacional</option><option value="LP" ${i.regime==="LP"?"selected":""}>Lucro Presumido</option><option value="LR" ${i.regime==="LR"?"selected":""}>Lucro Real</option></select></div>
          <div class="form-group"><label>CNAE</label><input type="text" id="cfg-cnae" value="${i.cnae||""}" placeholder="4711301"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Aliquota ISS (%)</label><input type="number" id="cfg-aliquota-iss" value="${i.aliquotaISS||2}" step="0.01" min="0" max="5"/></div>
        </div>
        <button class="btn btn-primary" onclick="window.configuracoes.salvarLoja()">Salvar dados fiscais</button>
      </div>
    `}async salvarLoja(){const e=window.db.db,t={nome:document.getElementById("cfg-loja-nome").value.trim(),razaoSocial:document.getElementById("cfg-loja-razao").value.trim(),cnpj:document.getElementById("cfg-loja-cnpj").value.trim(),ie:document.getElementById("cfg-loja-ie").value.trim(),endereco:document.getElementById("cfg-loja-end").value.trim(),telefone:document.getElementById("cfg-loja-tel").value.trim(),email:document.getElementById("cfg-loja-email").value.trim(),regime:document.getElementById("cfg-regime").value,cnae:document.getElementById("cfg-cnae").value.trim(),aliquotaISS:Number(document.getElementById("cfg-aliquota-iss").value||2)};await e.configuracoes.put({chave:"loja",valor:JSON.stringify(t)}),localStorage.setItem("loja_config",JSON.stringify(t)),p("Dados da loja salvos","success")}async renderPDV(e){let a=await window.db.db.configuracoes.get("pdv"),i=a?JSON.parse(a.valor):{};const n=i.formasPagamento||["dinheiro","credito","debito","pix","voucher","fiado","crediario","vale-alim","misto"];e.innerHTML=`
      <div class="card"><div class="card-title">Formas de pagamento ativas</div>
        <div class="form-group" style="margin-bottom:16px;">
          <label>Selecione as formas de pagamento disponiveis no PDV</label>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px;">
            ${["dinheiro","credito","debito","pix","voucher","fiado","crediario","vale-alim","vale-transporte","cheque","misto"].map(o=>`<label style="font-size:12px;display:flex;align-items:center;gap:6px;cursor:pointer;padding:4px 8px;background:var(--bg3);border-radius:6px;">
                <input type="checkbox" class="cfg-pag-check" value="${o}" ${n.includes(o)?"checked":""}/> ${o}
              </label>`).join("")}
          </div>
        </div>
        <button class="btn btn-primary" onclick="window.configuracoes.salvarPDV()">Salvar configuracoes PDV</button>
      </div>
      <div class="card mt-16"><div class="card-title">Configuracoes de caixa</div>
        <div class="form-grid">
          <div class="form-group"><label>Caixa padrao</label><input type="text" id="cfg-caixa-num" value="${i.caixaNumero||"01"}"/></div>
          <div class="form-group"><label>Valor inicial padrao (R$)</label><input type="number" id="cfg-caixa-inicial" value="${i.valorInicial||200}" step="0.01"/></div>
        </div>
        <button class="btn btn-primary" onclick="window.configuracoes.salvarPDV()">Salvar</button>
      </div>
    `}async salvarPDV(){var i,n;const e=window.db.db,t=document.querySelectorAll(".cfg-pag-check:checked"),a=Array.from(t).map(o=>o.value);await e.configuracoes.put({chave:"pdv",valor:JSON.stringify({formasPagamento:a,caixaNumero:((i=document.getElementById("cfg-caixa-num"))==null?void 0:i.value)||"01",valorInicial:Number(((n=document.getElementById("cfg-caixa-inicial"))==null?void 0:n.value)||200)})}),p("Configuracoes PDV salvas","success")}async renderFiscal(e){let a=await window.db.db.configuracoes.get("fiscal"),i=a?JSON.parse(a.valor):{};e.innerHTML=`
      <div class="card"><div class="card-title">Configuracao fiscal</div>
        <div class="form-grid">
          <div class="form-group"><label>Ambiente</label><select id="cfg-fisc-ambiente"><option value="homologacao" ${i.ambiente==="homologacao"?"selected":""}>Homologacao</option><option value="producao" ${i.ambiente==="producao"?"selected":""}>Producao</option></select></div>
          <div class="form-group"><label>Serie NFC-e</label><input type="text" id="cfg-fisc-serie" value="${i.serieNFCe||"1"}"/></div>
          <div class="form-group"><label>CSC / Token NFC-e</label><input type="text" id="cfg-fisc-csc" value="${i.csc||""}"/></div>
          <div class="form-group"><label>ID CSC</label><input type="text" id="cfg-fisc-idcsc" value="${i.idCsc||""}"/></div>
          <div class="form-group" style="grid-column:span 2"><label>Certificado Digital A1 (.pfx/.p12)</label>
            <div style="display:flex;gap:8px;align-items:center;">
              <input type="file" id="cfg-fisc-cert" accept=".pfx,.p12"/>
              <span class="badge ${i.certificado?"green":"red"}">${i.certificado?"Configurado":"Nao configurado"}</span>
            </div>
          </div>
          <div class="form-group"><label>Ultimo numero NF</label><input type="number" id="cfg-fisc-ultimo" value="${i.ultimoNumeroNF||0}"/></div>
          <div class="form-group"><label>Serie NF-e</label><input type="text" id="cfg-fisc-serie-nfe" value="${i.serieNFe||"1"}"/></div>
        </div>
        <button class="btn btn-primary" onclick="window.configuracoes.salvarFiscal()">Salvar configuracao fiscal</button>
      </div>
    `}async salvarFiscal(){const e=window.db.db,t=await e.configuracoes.get("fiscal"),a=t?JSON.parse(t.valor):{};await e.configuracoes.put({chave:"fiscal",valor:JSON.stringify({...a,ambiente:document.getElementById("cfg-fisc-ambiente").value,serieNFCe:document.getElementById("cfg-fisc-serie").value,serieNFe:document.getElementById("cfg-fisc-serie-nfe").value,csc:document.getElementById("cfg-fisc-csc").value,idCsc:document.getElementById("cfg-fisc-idcsc").value,certificado:document.getElementById("cfg-fisc-cert").files.length?"configurado":a.certificado,ultimoNumeroNF:Number(document.getElementById("cfg-fisc-ultimo").value||0)})}),p("Configuracao fiscal salva","success")}async renderTEF(e){let a=await window.db.db.configuracoes.get("tef"),i=a?JSON.parse(a.valor):{ativo:!1,ip:"192.168.1.200",porta:"7777",nome:"Caixa Padrao"};e.innerHTML=`
      <div class="card"><div class="card-title">TEF / Sat / Maquineta</div>
        <div class="form-grid">
          <div class="form-group"><label>Ativar TEF</label><select id="cfg-tef-ativo"><option value="true" ${i.ativo?"selected":""}>Sim</option><option value="false" ${i.ativo?"":"selected"}>Nao</option></select></div>
          <div class="form-group"><label>Nome do caixa</label><input type="text" id="cfg-tef-nome" value="${i.nome||"Caixa Padrao"}"/></div>
          <div class="form-group"><label>IP do TEF</label><input type="text" id="cfg-tef-ip" value="${i.ip||"192.168.1.200"}"/></div>
          <div class="form-group"><label>Porta</label><input type="text" id="cfg-tef-porta" value="${i.porta||"7777"}"/></div>
          <div class="form-group"><label>Tipo</label><select id="cfg-tef-tipo"><option value="tef" ${i.tipo==="tef"?"selected":""}>TEF Dial / SiTef</option><option value="sat" ${i.tipo==="sat"?"selected":""}>SAT (SP)</option><option value="pos" ${i.tipo==="pos"?"selected":""}>POS Integrado</option></select></div>
        </div>
        <button class="btn btn-primary" onclick="window.configuracoes.salvarTEF()">Salvar configuracao TEF</button>
      </div>
    `}async salvarTEF(){await window.db.db.configuracoes.put({chave:"tef",valor:JSON.stringify({ativo:document.getElementById("cfg-tef-ativo").value==="true",nome:document.getElementById("cfg-tef-nome").value.trim(),ip:document.getElementById("cfg-tef-ip").value.trim(),porta:document.getElementById("cfg-tef-porta").value.trim(),tipo:document.getElementById("cfg-tef-tipo").value})}),p("Configuracao TEF salva","success")}async renderEmail(e){let a=await window.db.db.configuracoes.get("email"),i=a?JSON.parse(a.valor):{smtp:"",porta:"587",usuario:"",senha:"",from:""};e.innerHTML=`
      <div class="card"><div class="card-title">Servidor de Email</div>
        <div class="form-grid">
          <div class="form-group" style="grid-column:span 2"><label>SMTP</label><input type="text" id="cfg-email-smtp" value="${i.smtp||""}" placeholder="smtp.gmail.com"/></div>
          <div class="form-group"><label>Porta</label><input type="text" id="cfg-email-porta" value="${i.porta||"587"}"/></div>
          <div class="form-group"><label>Seguranca</label><select id="cfg-email-tls"><option value="tls" ${i.tls!==!1?"selected":""}>TLS</option><option value="none" ${i.tls===!1?"selected":""}>Sem seguranca</option></select></div>
          <div class="form-group"><label>Email de origem</label><input type="email" id="cfg-email-from" value="${i.from||""}" placeholder="nao-responda@nexus.com.br"/></div>
          <div class="form-group"><label>Usuario</label><input type="text" id="cfg-email-user" value="${i.usuario||""}"/></div>
          <div class="form-group"><label>Senha</label><input type="password" id="cfg-email-senha" value="${i.senha||""}"/></div>
        </div>
        <button class="btn btn-primary" onclick="window.configuracoes.salvarEmail()">Salvar configuracao de email</button>
        <button class="btn btn-secondary" style="margin-left:8px;" onclick="window.configuracoes.testarEmail()">Testar envio</button>
      </div>
    `}async salvarEmail(){await window.db.db.configuracoes.put({chave:"email",valor:JSON.stringify({smtp:document.getElementById("cfg-email-smtp").value.trim(),porta:document.getElementById("cfg-email-porta").value.trim(),tls:document.getElementById("cfg-email-tls").value==="tls",from:document.getElementById("cfg-email-from").value.trim(),usuario:document.getElementById("cfg-email-user").value.trim(),senha:document.getElementById("cfg-email-senha").value})}),p("Configuracao de email salva","success")}async testarEmail(){p("Teste de email: funcao disponivel na versao completa com backend","info")}renderSistema(e){e.innerHTML=`
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
    `}async fazerBackup(){const t=window.db.db.tables,a={};for(const s of t)a[s.name]=await s.toArray();const i=new Blob([JSON.stringify(a,null,2)],{type:"application/json"}),n=URL.createObjectURL(i),o=document.createElement("a");o.href=n,o.download=`nexus-backup-${new Date().toISOString().split("T")[0]}.json`,o.click(),URL.revokeObjectURL(n),p("Backup baixado com sucesso","success")}async restaurar(e){const t=e.files[0];if(!t)return;if(t.size>50*1024*1024)return p("Arquivo muito grande (max 50MB)","error");if(!t.name.endsWith(".json"))return p("Formato invalido. Use arquivo .json","error");const a=new FileReader;a.onload=async i=>{try{const n=JSON.parse(i.target.result);if(typeof n!="object"||Array.isArray(n))throw new Error("Formato invalido");const o=window.db.db,s=o.tables.map(d=>d.name);for(const d of Object.keys(n)){if(!s.includes(d))throw new Error("Tabela desconhecida: "+d);if(!Array.isArray(n[d]))throw new Error("Registros invalidos na tabela: "+d)}for(const[d,r]of Object.entries(n)){await o[d].clear();for(const u of r)await o[d].add(u)}p("Backup restaurado com sucesso","success")}catch(n){p("Erro ao restaurar backup: "+n.message,"error")}},a.readAsText(t)}async resetarDados(){if(!confirm("TEM CERTEZA? Isso vai apagar TODOS os dados do sistema!")||!confirm("CONFIRMACAO FINAL: Digite CONFIRMAR para prosseguir."))return;const e=window.db.db;for(const t of e.tables)await t.clear();await e.seedIfEmpty(),p("Dados resetados com sucesso","info")}async limparVendas(){if(!confirm("Limpar todas as vendas e itens de venda?"))return;const e=window.db.db;await e.vendasPDV.clear(),await e.itensPDV.clear(),await e.pagamentosPDV.clear(),p("Vendas limpas","success")}}const K=[{id:"dashboard",nome:"Dashboard"},{id:"pdv",nome:"PDV / Frente Caixa"},{id:"produtos",nome:"Cadastro Produtos"},{id:"estoque",nome:"Estoque"},{id:"compras",nome:"Compras"},{id:"clientes",nome:"Clientes / CRM"},{id:"financeiro",nome:"Financeiro"},{id:"rh",nome:"RH / Pessoal"},{id:"frota",nome:"Frota / Transporte"},{id:"fiscal",nome:"Fiscal / NFe"},{id:"relatorios",nome:"Relatorios"},{id:"configuracoes",nome:"Configuracoes"}],ne=K.map(b=>b.id);class ze{constructor(){this.editandoId=null,this.usuarioLogado=null}async render(){var a,i,n,o,s,d,r;await this.carregarSessao();const e=document.getElementById("page-usuarios");(a=this.usuarioLogado)==null||a.perfil;const t=((i=this.usuarioLogado)==null?void 0:i.perfil)==="admin"||((n=this.usuarioLogado)==null?void 0:n.perfil)==="gerente";e.innerHTML=`
      <div class="section-header">
        <h2>Usuarios e Permissoes</h2>
        <div class="gap-8">
          <span class="badge ${((o=this.usuarioLogado)==null?void 0:o.perfil)==="admin"?"red":((s=this.usuarioLogado)==null?void 0:s.perfil)==="gerente"?"yellow":"blue"}">
            ${((d=this.usuarioLogado)==null?void 0:d.login)||"Nao logado"} (${((r=this.usuarioLogado)==null?void 0:r.perfil)||"-"})
          </span>
          <button class="btn btn-primary" onclick="window.usuarios.abrirForm()" ${t?"":"disabled"}>Novo usuario</button>
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
    `,window.usuarios=this,this.renderModalForm(),await this.loadData()}async carregarSessao(){const e=window.db.db;if(!(await e.usuarios.toArray()).some(n=>n.perfil==="admin")){const{hashSenha:n}=await W(async()=>{const{hashSenha:s}=await Promise.resolve().then(()=>X);return{hashSenha:s}},void 0),o=await n("admin");await e.usuarios.add({login:"admin",email:"admin@nexus.com.br",senha:o,perfil:"admin",setores:ne})}const i=localStorage.getItem("nexus_usuario_logado");if(i)try{this.usuarioLogado=JSON.parse(i)}catch{this.usuarioLogado=null}}async loadData(){var o,s,d;const t=await window.db.db.usuarios.toArray(),a=((o=this.usuarioLogado)==null?void 0:o.perfil)==="admin",i=((s=this.usuarioLogado)==null?void 0:s.setores)||[];let n=t;((d=this.usuarioLogado)==null?void 0:d.perfil)==="gerente"&&(n=t.filter(r=>r.perfil!=="admin"),n=n.filter(r=>r.perfil==="gerente"?!0:(r.setores||[]).some(u=>i.includes(u)))),document.getElementById("usuarios-table-wrap").innerHTML=n.length?`
      <div class="tbl-wrap"><table>
        <thead><tr><th>Login</th><th>Email</th><th>Perfil</th><th>Setores liberados</th><th>Regra de acesso</th><th>Acoes</th></tr></thead>
        <tbody>${n.map(r=>{var u;return`
          <tr>
            <td><strong>${y(r.login)}</strong></td>
            <td>${y(r.email||"-")}</td>
            <td><span class="badge ${r.perfil==="admin"?"red":r.perfil==="gerente"?"yellow":"blue"}">${y(r.perfil||"operador")}</span></td>
            <td style="font-size:11px;">${y((r.setores||[]).map(l=>{var v;return((v=K.find(m=>m.id===l))==null?void 0:v.nome)||l}).join(", ")||"-")}</td>
            <td style="font-size:11px;color:var(--text2);">
              ${r.perfil==="admin"?"Acesso irrestrito a todos os modulos":r.perfil==="gerente"?"Gerencia setores autorizados e usuarios vinculados":"Acesso operacional restrito aos setores liberados"}
            </td>
            <td>
              ${a?`<button class="btn btn-sm btn-secondary" onclick="window.usuarios.editar(${r.id})">Editar</button>`:""}
              ${a&&r.id!==((u=this.usuarioLogado)==null?void 0:u.id)?`<button class="btn btn-sm btn-danger" onclick="window.usuarios.excluir(${r.id})">Excluir</button>`:""}
            </td>
          </tr>
        `}).join("")}</tbody></table>
      </div>`:'<div class="empty-state"><p>Nenhum usuario cadastrado</p></div>'}abrirForm(){var a,i,n;const e=((a=this.usuarioLogado)==null?void 0:a.perfil)==="admin",t=((i=this.usuarioLogado)==null?void 0:i.perfil)==="gerente";if(this.editandoId=null,document.getElementById("modal-user-title").textContent="Novo usuario",["user-login","user-email","user-senha"].forEach(o=>document.getElementById(o).value=""),document.getElementById("user-perfil").value="operador",document.getElementById("user-perfil").querySelectorAll("option").forEach(o=>{o.disabled=!1,!e&&(o.value==="admin"||o.value==="gerente")&&(o.disabled=!0)}),!e&&t&&(document.getElementById("user-perfil").value="operador"),this.renderSetoresCheckboxes(),!e&&t){const o=((n=this.usuarioLogado)==null?void 0:n.setores)||[];document.querySelectorAll(".user-setor").forEach(s=>{o.includes(s.value)||(s.disabled=!0)})}E("modal-usuario")}renderSetoresCheckboxes(){const e=document.getElementById("user-setores-container");e&&(e.innerHTML=K.map(t=>`<label style="font-size:12px;display:flex;align-items:center;gap:4px;cursor:pointer;padding:2px 0;">
        <input class="user-setor" type="checkbox" value="${t.id}" /> ${t.nome}
      </label>`).join(""))}async editar(e){var i;const t=await window.db.db.usuarios.get(e);if(!t)return;if(!(((i=this.usuarioLogado)==null?void 0:i.perfil)==="admin")&&t.perfil==="admin")return p("Apenas admin pode editar admin","error");this.editandoId=e,document.getElementById("modal-user-title").textContent="Editar usuario",document.getElementById("user-login").value=t.login,document.getElementById("user-email").value=t.email||"",document.getElementById("user-senha").value="",document.getElementById("user-perfil").value=t.perfil||"operador",this.renderSetoresCheckboxes(),document.querySelectorAll(".user-setor").forEach(n=>n.checked=(t.setores||[]).includes(n.value)),E("modal-usuario")}setSetores(e){document.querySelectorAll(".user-setor").forEach(t=>t.checked=e.includes(t.value))}async salvar(){const e=window.db.db,t=document.getElementById("user-perfil").value,a=t==="admin"?ne:Array.from(document.querySelectorAll(".user-setor:checked")).map(o=>o.value),i={login:document.getElementById("user-login").value.trim(),email:document.getElementById("user-email").value.trim(),perfil:t,setores:a},n=document.getElementById("user-senha").value;if(!i.login)return p("Informe login","error");if(t!=="admin"&&!a.length)return p("Selecione setores autorizados","error");if(this.editandoId)n&&(i.senha=await window.hashSenha?await window.hashSenha(n):n),await e.usuarios.update(this.editandoId,i),p("Usuario atualizado","success");else{if(!n)return p("Informe senha","error");if(await e.usuarios.filter(d=>d.login===i.login).first())return p("Login ja existe","error");const{hashSenha:s}=await W(async()=>{const{hashSenha:d}=await Promise.resolve().then(()=>X);return{hashSenha:d}},void 0);await e.usuarios.add({...i,senha:await s(n)}),p("Usuario criado","success")}C("modal-usuario"),await this.loadData()}async excluir(e){var t;if(confirm("Excluir usuario?")){if(e===((t=this.usuarioLogado)==null?void 0:t.id))return p("Nao pode excluir a si mesmo","error");await window.db.db.usuarios.delete(e),p("Usuario excluido","info"),await this.loadData()}}renderModalForm(){if(document.getElementById("modal-usuario"))return;const e=document.createElement("div");e.className="modal-overlay hidden",e.id="modal-usuario",e.innerHTML=`<div class="modal"><h2 id="modal-user-title">Novo usuario</h2><div class="form-grid">
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
    </div></div>`,document.body.appendChild(e)}}const se=b=>Number(b||0),G=()=>new Date().toISOString().slice(0,10),U=b=>String(b??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),Oe={perdas:{title:"Perdas e Quebras",store:"perdas",kpiLabel:"Valor perdido",fields:[{key:"produtoNome",label:"Produto",type:"text",required:!0},{key:"qtd",label:"Quantidade",type:"number",required:!0},{key:"valor",label:"Valor",type:"money"},{key:"motivo",label:"Motivo",type:"text",required:!0},{key:"data",label:"Data",type:"date"}]},transferencias:{title:"Transferencias de Estoque",store:"transferenciasEstoque",fields:[{key:"produtoNome",label:"Produto",type:"text",required:!0},{key:"origem",label:"Origem",type:"text",required:!0},{key:"destino",label:"Destino",type:"text",required:!0},{key:"qtd",label:"Quantidade",type:"number",required:!0},{key:"status",label:"Status",type:"select",options:["pendente","enviada","recebida"]},{key:"data",label:"Data",type:"date"}]},"curva-abc":{title:"Curva ABC",mode:"abc"},cotacoes:{title:"Cotacoes",store:"cotacoes",kpiLabel:"Valor cotado",fields:[{key:"fornecedorNome",label:"Fornecedor",type:"text",required:!0},{key:"numero",label:"Numero da cotacao",type:"text"},{key:"descricao",label:"Itens cotados",type:"text",required:!0},{key:"valorTotal",label:"Valor total",type:"money"},{key:"prazoEntrega",label:"Prazo de entrega",type:"text"},{key:"condicaoPagamento",label:"Condicao pagamento",type:"text"},{key:"validadeProposta",label:"Validade proposta",type:"date"},{key:"status",label:"Status",type:"select",options:["aberta","enviada","aprovada","recusada"]},{key:"data",label:"Data",type:"date"}]},crm:{title:"CRM / Oportunidades",store:"crmOportunidades",kpiLabel:"Pipeline",fields:[{key:"titulo",label:"Oportunidade",type:"text",required:!0},{key:"clienteNome",label:"Cliente",type:"text"},{key:"valor",label:"Valor",type:"money"},{key:"status",label:"Status",type:"select",options:["novo","em contato","proposta","ganho","perdido"]},{key:"data",label:"Data",type:"date"}]},convenios:{title:"Convenios",store:"convenios",fields:[{key:"nome",label:"Convenio",type:"text",required:!0},{key:"cnpj",label:"CNPJ",type:"text"},{key:"descontoMax",label:"Desconto max. %",type:"number"},{key:"prazo",label:"Prazo",type:"text"},{key:"ativo",label:"Status",type:"select",options:["ativo","inativo"]}]},conciliacao:{title:"Conciliacao",store:"conciliacoes",kpiLabel:"Conciliado",fields:[{key:"conta",label:"Conta",type:"text",required:!0},{key:"tipo",label:"Tipo",type:"select",options:["cartao","banco","pix","dinheiro"]},{key:"valor",label:"Valor",type:"money"},{key:"status",label:"Status",type:"select",options:["pendente","conciliado","divergente"]},{key:"data",label:"Data",type:"date"}]},"contratos-rh":{title:"Contratos RH",store:"contratosRH",fields:[{key:"funcionarioNome",label:"Funcionario",type:"text",required:!0},{key:"ultimoEmprego",label:"Ultimo emprego anterior",type:"text"},{key:"tipo",label:"Tipo",type:"select",options:["CLT","temporario","experiencia","prestador"]},{key:"salario",label:"Salario",type:"money"},{key:"status",label:"Status",type:"select",options:["ativo","encerrado","suspenso"]},{key:"inicio",label:"Inicio",type:"date"}]},ferias:{title:"Ferias",store:"ferias",fields:[{key:"funcionarioNome",label:"Funcionario",type:"text",required:!0},{key:"inicio",label:"Inicio",type:"date",required:!0},{key:"fim",label:"Fim",type:"date",required:!0},{key:"status",label:"Status",type:"select",options:["programada","em andamento","concluida","cancelada"]},{key:"observacao",label:"Observacao",type:"text"}]},rescisao:{title:"Rescisoes",store:"rescisoes",kpiLabel:"Valor previsto",fields:[{key:"funcionarioNome",label:"Funcionario",type:"text",required:!0},{key:"tipo",label:"Tipo",type:"select",options:["sem justa causa","justa causa","pedido demissao","acordo"]},{key:"valorTotal",label:"Valor total",type:"money"},{key:"status",label:"Status",type:"select",options:["aberta","calculada","paga"]},{key:"data",label:"Data",type:"date"}]},"nfe-entrada":{title:"NF-e Entrada",store:"nfeEntrada",kpiLabel:"Total notas",fields:[{key:"numero",label:"Numero",type:"text",required:!0},{key:"fornecedorNome",label:"Fornecedor",type:"text"},{key:"chaveAcesso",label:"Chave de acesso",type:"text"},{key:"valor",label:"Valor",type:"money"},{key:"status",label:"Status",type:"select",options:["recebida","conferida","cancelada"]}]},sped:{title:"SPED Fiscal",store:"spedFiscal",fields:[{key:"periodo",label:"Periodo",type:"text",required:!0},{key:"tipo",label:"Tipo",type:"select",options:["ICMS/IPI","Contribuicoes"]},{key:"status",label:"Status",type:"select",options:["rascunho","gerado","transmitido"]},{key:"arquivo",label:"Arquivo",type:"text"},{key:"geradoEm",label:"Gerado em",type:"date"}]},backup:{title:"Backup & Restore",mode:"backup"}};class T{constructor(e){this.key=e,this.config=Oe[e]}async render(){const e=document.getElementById("page-"+this.key);if(window.operationalModules=window.operationalModules||{},window.operationalModules[this.key]=this,this.config.mode==="abc")return this.renderABC(e);if(this.config.mode==="backup")return this.renderBackup(e);e.innerHTML=`
      <div class="section-header">
        <h2>${this.config.title}</h2>
        <button class="btn btn-primary" onclick="window.operationalModules['${this.key}'].save()">Salvar registro</button>
      </div>
      <div class="kpi-grid" id="${this.key}-kpis"></div>
      <div class="card">
        <div class="card-title">Cadastro</div>
        <div class="form-grid">${this.config.fields.map(t=>this.renderField(t)).join("")}</div>
      </div>
      <div class="card mt-16">
        <div class="card-title">Registros</div>
        <div id="${this.key}-table"></div>
      </div>
    `,await this.load()}renderField(e){if(e.type==="select")return`<div class="form-group"><label>${e.label}</label><select id="${this.key}-${e.key}">${e.options.map(n=>`<option value="${U(n)}">${U(n)}</option>`).join("")}</select></div>`;const t=e.type==="money"||e.type==="number"?"number":e.type==="date"?"date":"text",a=e.type==="money"?' step="0.01"':"",i=e.type==="date"?` value="${G()}"`:"";return`<div class="form-group"><label>${e.label}</label><input id="${this.key}-${e.key}" type="${t}"${a}${i}/></div>`}async save(){const e=window.db.db,t={};for(const a of this.config.fields){let n=document.getElementById(`${this.key}-${a.key}`).value;if((a.type==="money"||a.type==="number")&&(n=se(n)),a.required&&!n){p(`Preencha: ${a.label}`,"error");return}t[a.key]=n}t.dataAtualizacao=new Date().toISOString(),await e[this.config.store].add(t),p("Registro salvo","success"),this.config.fields.forEach(a=>{const i=document.getElementById(`${this.key}-${a.key}`);a.type==="date"?i.value=G():a.type!=="select"&&(i.value="")}),await this.load()}async load(){const t=await window.db.db[this.config.store].toArray(),a=t.reduce((n,o)=>n+se(o.valor||o.valorTotal||o.salario),0);document.getElementById(`${this.key}-kpis`).innerHTML=`
      <div class="kpi blue"><div class="kpi-label">Registros</div><div class="kpi-value">${t.length}</div><div class="kpi-sub">${this.config.title}</div></div>
      <div class="kpi green"><div class="kpi-label">${this.config.kpiLabel||"Valor movimentado"}</div><div class="kpi-value">${c(a)}</div><div class="kpi-sub">base local</div></div>
    `;const i=document.getElementById(`${this.key}-table`);if(!t.length){i.innerHTML='<div class="empty-state"><p>Nenhum registro cadastrado</p></div>';return}i.innerHTML=`
      <div class="tbl-wrap">
        <table>
          <thead><tr>${this.config.fields.map(n=>`<th>${n.label}</th>`).join("")}</tr></thead>
          <tbody>${t.slice().reverse().map(n=>`
            <tr>${this.config.fields.map(o=>`<td>${this.formatCell(n[o.key],o)}</td>`).join("")}</tr>
          `).join("")}</tbody>
        </table>
      </div>
    `}formatCell(e,t){return t.type==="money"?`<span class="text-mono">${c(e)}</span>`:t.type==="date"&&e?`<span class="text-mono">${new Date(e+"T00:00:00").toLocaleDateString("pt-BR")}</span>`:U(e||"-")}async renderABC(e){const t=window.db.db,a=await t.itensPDV.toArray(),i=await t.produtos.toArray(),n=Object.fromEntries(i.map(l=>[l.id,l])),o={};a.forEach(l=>{o[l.produtoId]=o[l.produtoId]||{qtd:0,valor:0},o[l.produtoId].qtd+=l.qtd||0,o[l.produtoId].valor+=l.total||0});const s=Object.entries(o).sort((l,v)=>v[1].valor-l[1].valor),d=s.reduce((l,[,v])=>l+v.valor,0);let r=0;const u=s.map(([l,v])=>{r+=v.valor;const m=d?r/d*100:0;return{id:Number(l),...v,pctAcc:m,classe:m<=80?"A":m<=95?"B":"C"}});e.innerHTML=`
      <div class="section-header"><h2>Curva ABC</h2></div>
      <div class="kpi-grid">
        <div class="kpi green"><div class="kpi-label">Faturamento classificado</div><div class="kpi-value">${c(d)}</div></div>
        <div class="kpi blue"><div class="kpi-label">Itens vendidos</div><div class="kpi-value">${u.length}</div></div>
      </div>
      <div class="tbl-wrap"><table><thead><tr><th>Classe</th><th>Produto</th><th>Qtd</th><th>Valor</th><th>% acum.</th></tr></thead>
      <tbody>${u.map(l=>{var v;return`<tr><td><span class="badge ${l.classe==="A"?"green":l.classe==="B"?"yellow":"red"}">${l.classe}</span></td><td>${U(((v=n[l.id])==null?void 0:v.nome)||l.id)}</td><td class="text-mono">${l.qtd}</td><td class="text-mono">${c(l.valor)}</td><td class="text-mono">${l.pctAcc.toFixed(1)}%</td></tr>`}).join("")||'<tr><td colspan="5">Sem vendas registradas</td></tr>'}</tbody></table></div>
    `}async renderBackup(e){e.innerHTML=`
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
    `}async exportBackup(){const e=window.db.db,t={};for(const n of e.tables)t[n.name]=await n.toArray();const a=new Blob([JSON.stringify({geradoEm:new Date().toISOString(),data:t},null,2)],{type:"application/json"}),i=document.createElement("a");i.href=URL.createObjectURL(a),i.download=`nexus-backup-${G()}.json`,i.click(),URL.revokeObjectURL(i.href),document.getElementById("backup-status").textContent="Backup gerado."}async importBackup(){const e=document.getElementById("backup-file");if(!e.files.length)return p("Selecione o arquivo JSON","error");const t=JSON.parse(await e.files[0].text()),a=window.db.db;for(const[i,n]of Object.entries(t.data||{}))a[i]&&Array.isArray(n)&&(await a[i].clear(),n.length&&await a[i].bulkAdd(n));p("Backup restaurado","success"),document.getElementById("backup-status").textContent="Backup restaurado com sucesso."}}const _e=class extends T{constructor(){super("perdas")}},Ue=class extends T{constructor(){super("transferencias")}},Je=class extends T{constructor(){super("curva-abc")}},Ge=class extends T{constructor(){super("cotacoes")}},Qe=class extends T{constructor(){super("crm")}},We=class extends T{constructor(){super("convenios")}},Ke=class extends T{constructor(){super("conciliacao")}},Xe=class extends T{constructor(){super("contratos-rh")}},Ye=class extends T{constructor(){super("ferias")}},Ze=class extends T{constructor(){super("rescisao")}},et=class extends T{constructor(){super("nfe-entrada")}},tt=class extends T{constructor(){super("sped")}},at=class extends T{constructor(){super("backup")}},Q={dashboard:"Dashboard",pdv:"Frente de Caixa (PDV)",produtos:"Cadastro de Produtos",estoque:"Controle de Estoque",validade:"Validade e Lotes",inventario:"Inventario / Ajustes",perdas:"Perdas e Quebras",transferencias:"Transferencias","curva-abc":"Curva ABC",fornecedores:"Fornecedores",cotacoes:"Cotacoes","pedidos-compra":"Pedidos de Compra",recebimento:"Recebimento",clientes:"Clientes",crm:"CRM / Oportunidades",fidelidade:"Programa Fidelidade",credito:"Crediario/Fiado",convenios:"Convenios",caixa:"Caixa Geral","contas-pagar":"Contas a Pagar","contas-receber":"Contas a Receber",dre:"DRE / Resultados",fluxo:"Fluxo de Caixa",conciliacao:"Conciliacao",funcionarios:"Funcionarios","contratos-rh":"Contratos",ponto:"Ponto Eletronico",folha:"Folha de Pagamento",ferias:"Ferias",rescisao:"Rescisoes",transporte:"Transportes",frota:"Frota",entrega:"Delivery / Entregas",fiscal:"Emissor NF-e / NFC-e","nfe-entrada":"NF-e Entrada",sped:"SPED Fiscal",tributacao:"Tributacao",relatorios:"Relatorios Gerenciais","vendas-hist":"Historico de Vendas",configuracoes:"Configuracoes",usuarios:"Usuarios e Permissoes",backup:"Backup & Restore"};class ot{constructor(){this.currentPage="dashboard",this.pages={},this.usuarioLogado=null}async init(){const e=document.getElementById("root");e.innerHTML='<nav id="sidebar"></nav><div id="content"><div id="topbar"></div></div>',await this.carregarSessao(),te(),ae(),this.registerPages(),await this.navigate("dashboard"),this.updateClock(),setInterval(()=>this.updateClock(),1e3),this.iniciarTimeoutSessao(),this.ouvirAtividade()}async carregarSessao(){const e=localStorage.getItem("nexus_usuario_logado");if(e)try{this.usuarioLogado=JSON.parse(e)}catch{this.usuarioLogado=null}this.usuarioLogado||await this.mostrarLogin()}async mostrarLogin(){return new Promise(e=>{const t=document.createElement("div");t.id="login-overlay",t.style.cssText="position:fixed;inset:0;background:var(--bg1);display:flex;align-items:center;justify-content:center;z-index:9999;",t.innerHTML=`
        <div style="background:var(--bg2);padding:40px;border-radius:16px;width:360px;box-shadow:0 8px 32px rgba(0,0,0,.3);text-align:center;">
          <div style="font-size:48px;margin-bottom:12px;">🛒</div>
          <h1 style="margin-bottom:4px;">NEXUS Market AI</h1>
          <p style="color:var(--text3);margin-bottom:24px;font-size:13px;">ERP para Supermercados</p>
          <div class="form-group"><label>Login</label><input id="login-user" style="width:100%;" autocomplete="username"/></div>
          <div class="form-group" style="margin-top:12px;"><label>Senha</label><input id="login-pass" type="password" style="width:100%;" autocomplete="current-password"/></div>
          <div id="login-error" style="color:#e74c3c;font-size:12px;margin-top:8px;display:none;"></div>
          <button id="login-btn" class="btn btn-primary" style="width:100%;margin-top:16px;">Entrar</button>
        </div>`,document.body.appendChild(t);const a=t.querySelector("#login-btn"),i=t.querySelector("#login-user"),n=t.querySelector("#login-pass"),o=t.querySelector("#login-error"),s=async()=>{const d=i.value.trim(),r=n.value;if(!d||!r){o.textContent="Informe login e senha",o.style.display="";return}const{hashSenha:u}=await W(async()=>{const{hashSenha:g}=await Promise.resolve().then(()=>X);return{hashSenha:g}},void 0),l=await u(r),m=await window.db.db.usuarios.filter(g=>g.login===d&&g.senha===l).first();m?(this.usuarioLogado=m,localStorage.setItem("nexus_usuario_logado",JSON.stringify(m)),t.remove(),e()):(o.textContent="Login ou senha incorretos",o.style.display="")};a.addEventListener("click",s),n.addEventListener("keydown",d=>{d.key==="Enter"&&s()}),i.focus()})}logout(){var e;localStorage.removeItem("nexus_usuario_logado"),this.usuarioLogado=null,this._timeoutSessao&&clearTimeout(this._timeoutSessao),document.querySelectorAll(".modal-overlay:not(.hidden)").forEach(t=>t.classList.add("hidden")),(e=document.getElementById("login-overlay"))==null||e.remove(),this.mostrarLogin().then(()=>{te(),ae(),this.navigate("dashboard")})}iniciarTimeoutSessao(){this._timeoutSessao&&clearTimeout(this._timeoutSessao),this._timeoutSessao=setTimeout(()=>{p("Sessao expirada por inatividade","info"),this.logout()},30*60*1e3)}ouvirAtividade(){const e=()=>this.iniciarTimeoutSessao();document.addEventListener("click",e),document.addEventListener("keydown",e),document.addEventListener("mousemove",e),document.addEventListener("touchstart",e)}verificarAcesso(e){if(!this.usuarioLogado||this.usuarioLogado.perfil==="admin")return!0;const t=this.usuarioLogado.setores||[];if(t.includes(e))return!0;const a={dashboard:"dashboard",pdv:"pdv",produtos:"produtos",estoque:"estoque",validade:"estoque",inventario:"estoque",perdas:"estoque",transferencias:"estoque","curva-abc":"estoque",fornecedores:"compras",cotacoes:"compras","pedidos-compra":"compras",recebimento:"compras",clientes:"clientes",crm:"clientes",fidelidade:"clientes",credito:"financeiro",convenios:"financeiro",caixa:"financeiro","contas-pagar":"financeiro","contas-receber":"financeiro",dre:"financeiro",fluxo:"financeiro",conciliacao:"financeiro",funcionarios:"rh","contratos-rh":"rh",ponto:"rh",folha:"rh",ferias:"rh",rescisao:"rh",transporte:"frota",frota:"frota",entrega:"frota",fiscal:"fiscal","nfe-entrada":"fiscal",sped:"fiscal",tributacao:"fiscal",relatorios:"relatorios","vendas-hist":"relatorios",configuracoes:"configuracoes",usuarios:"configuracoes",backup:"configuracoes"};return t.includes(a[e]||e)}registerPages(){this.pages={dashboard:new ve,pdv:new be,produtos:new ge,estoque:new he,validade:new fe,inventario:new ye,perdas:new _e,transferencias:new Ue,"curva-abc":new Je,fornecedores:new we,cotacoes:new Ge,"pedidos-compra":new xe,recebimento:new Ie,clientes:new Ee,crm:new Qe,fidelidade:new $e,convenios:new We,credito:new ke,caixa:new Ce,"contas-pagar":new Be,"contas-receber":new Se,dre:new De,fluxo:new Me,conciliacao:new Ke,funcionarios:new Pe,"contratos-rh":new Xe,ponto:new Le,folha:new Ae,ferias:new Ye,rescisao:new Ze,transporte:new Te,frota:new Fe,entrega:new Ne,fiscal:new qe,"nfe-entrada":new et,sped:new tt,tributacao:new Re,relatorios:new Ve,"vendas-hist":new je,configuracoes:new He,usuarios:new ze,backup:new at}}async navigate(e){if(!this.verificarAcesso(e)){this.showSemAcesso(e);return}document.querySelectorAll('[id^="page-"]').forEach(a=>{a.classList.add("page-hidden"),a.classList.remove("page")});let t=document.getElementById("page-"+e);t||(t=document.createElement("div"),t.id="page-"+e,t.className="page page-hidden",document.getElementById("content").appendChild(t)),t.classList.remove("page-hidden"),t.classList.add("page"),document.querySelectorAll(".nav-item").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".nav-item").forEach(a=>{a.dataset.page===e&&a.classList.add("active")}),document.querySelector(".topbar-title").textContent=Q[e]||e,this.currentPage=e,this.pages[e]?await this.pages[e].render():t.innerHTML=`
        <div class="empty-state">
          <div class="icon">🚧</div>
          <p style="font-size:18px;margin-bottom:8px;"><strong>${Q[e]||e}</strong></p>
          <p>Modulo nao cadastrado no menu principal</p>
          <p style="font-size:12px;color:var(--text3);margin-top:8px;">Verifique o identificador da rota: ${e}</p>
        </div>`}showSemAcesso(e){const t=document.getElementById("page-"+e)||(()=>{const a=document.createElement("div");return a.id="page-"+e,a.className="page page-hidden",document.getElementById("content").appendChild(a),a})();document.querySelectorAll('[id^="page-"]').forEach(a=>{a.classList.add("page-hidden"),a.classList.remove("page")}),t.classList.remove("page-hidden"),t.classList.add("page"),document.querySelector(".topbar-title").textContent=Q[e]||e,t.innerHTML=`
      <div class="empty-state">
        <div class="icon">🔒</div>
        <p style="font-size:18px;margin-bottom:8px;"><strong>Acesso negado</strong></p>
        <p>Seu perfil nao tem permissao para acessar este modulo.</p>
        <p style="font-size:12px;color:var(--text3);margin-top:8px;">Entre em contato com o administrador.</p>
      </div>`}updateClock(){const e=new Date,t=document.querySelector(".date-badge");t&&(t.textContent=e.toLocaleDateString("pt-BR")+" "+e.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}))}}window.navigate=b=>{var e;return(e=window.app)==null?void 0:e.navigate(b)};window.toggleSidebar=()=>{var b;return(b=document.getElementById("sidebar"))==null?void 0:b.classList.toggle("collapsed")};async function Y(b){const t=new TextEncoder().encode(b),a=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(a)).map(i=>i.toString(16).padStart(2,"0")).join("")}window.hashSenha=Y;class de{constructor(){this.db=new Dexie("NexusMarketAI")}init(){return this.db.version(5).stores({empresas:"++id, cnpj, razaoSocial, nomeFantasia",filiais:"++id, empresaId, cnpj, nome",usuarios:"++id, login, email, perfil, empresaId, filialId",permissoes:"++id, usuarioId, modulo",tokens:"++id, usuarioId, token, expiraEm",auditoriaLogs:"++id, usuarioId, acao, modulo, data",funcionarios:"++id, cpf, nome, cargo, setor, filialId",cargos:"++id, nome, salarioBase",departamentos:"++id, nome, centroCusto",escalas:"++id, funcionarioId, diaSemana, entrada, saida",ferias:"++id, funcionarioId, inicio, fim, status",folhaPagamento:"++id, funcionarioId, mes, ano, salarioBase, inss, irrf, liquido",beneficios:"++id, funcionarioId, tipo, valor",pontoBiometrico:"++id, funcionarioId, data, hora, tipo",batidas:"++id, funcionarioId, data, entrada, saidaAlmoco, retorno, saida",horasExtras:"++id, funcionarioId, data, qtdHoras, percentual",bancoHoras:"++id, funcionarioId, saldoHoras",contratosRH:"++id, funcionarioId, tipo, inicio, fim, salario, status, motivo",rescisoes:"++id, funcionarioId, data, tipo, avisoPrevio, saldoFerias, decimoTerceiro, multaFGTS, valorTotal, status",atestados:"++id, funcionarioId, inicio, fim, cid, observacao",clientes:"++id, cpf, nome, telefone, email, pontos, limiteCredito, segmento, aniversario, obs, filialId",enderecosClientes:"++id, clienteId, tipo, logradouro, bairro, cidade, uf, cep",historicoClientes:"++id, clienteId, tipo, descricao, data",fidelidade:"++id, clienteId, pontos, data, tipo, vencimento",cobrancas:"++id, clienteId, data, valor, vencimento, status, observacao",fornecedores:"++id, cnpj, razaoSocial, fantasia, prazoEntrega, prazoPagamento, score, observacoes",contatosFornecedores:"++id, fornecedorId, nome, telefone, email, cargo",rankingFornecedores:"++id, fornecedorId, pedidos, entregasNoPrazo, qualidade, precoMedio, score",produtos:"++id, codigo, ean, nome, descricao, categoriaId, marcaId, unidadeId, preco, custo, estoque, estMin, estMax, ncm, cest, cst, cfop, icms, pis, cofins, ipi, peso, volume, localizacao, loteObrigatorio, validoObrigatorio, comissao, ativo, filialId",categorias:"++id, nome, descricao, tributacao, margemPadrao",subcategorias:"++id, categoriaId, nome",marcas:"++id, nome, fornecedorId",unidades:"++id, sigla, descricao",estoque:"++id, produtoId, filialId, qtd, localizacao",movimentacoesEstoque:"++id, produtoId, filialId, tipo, qtd, documento, data, responsavel, motivo",inventarios:"++id, filialId, data, status, responsavel, tipo",lotes:"++id, produtoId, lote, qtd, fabricacao, vencimento, localizacao",validades:"++id, loteId, produtoId, vencimento, qtd",perdas:"++id, produtoId, loteId, data, qtd, motivo, valor, responsavel",transferenciasEstoque:"++id, produtoId, origemFilialId, destinoFilialId, data, qtd, status, responsavel",curvaABC:"++id, produtoId, periodo, qtdVendida, valorVendido, percentual, classificacao",solicitacoesCompra:"++id, filialId, data, status, solicitante, prioridade",cotacoes:"++id, solicitacaoId, fornecedorId, data, valorTotal, prazo, itens",pedidosCompra:"++id, fornecedorId, filialId, data, entrega, status, total, frete, desconto, observacoes, aprovadoPor",itensPedidoCompra:"++id, pedidoId, produtoId, qtd, preco, total, recebido",recebimentos:"++id, pedidoId, data, nf, serie, chaveAcesso, valor, frete, responsavel, status, conferido",orcamentos:"++id, clienteId, filialId, data, itens, total, status, validoAte",pedidosVenda:"++id, clienteId, filialId, data, total, status, formaPagamento",itensVenda:"++id, vendaId, produtoId, nome, qtd, preco, total",notasFiscais:"++id, tipo, numero, serie, chaveAcesso, clienteId, valor, data, status, xml, protocolo, motivoCancelamento",nfeEntrada:"++id, numero, serie, chaveAcesso, fornecedorId, dataEmissao, dataRecebimento, valor, cfop, status, xml",spedFiscal:"++id, periodo, tipo, arquivo, geradoEm, status",caixas:"++id, filialId, numero, saldoInicial, saldoAtual, status, operadorId, dataAbertura, dataFechamento",aberturasCaixa:"++id, caixaId, data, valorInicial, operadorId",fechamentosCaixa:"++id, caixaId, data, valorFinal, diferenca, observacao, operadorId",sangrias:"++id, caixaId, data, valor, motivo, operadorId",suprimentos:"++id, caixaId, data, valor, motivo, operadorId",vendasPDV:"++id, caixaId, vendaId, data, total, formaPagamento, desconto, descontoTipo, clienteNome, clienteId, num, comanda, entregar, status",itensPDV:"++id, vendaPDVId, produtoId, nome, qtd, preco, total, desconto",pagamentosPDV:"++id, vendaPDVId, caixaId, forma, valor, troco, parcelas, nsu, data",comandasPDV:"++id, numero, mesa, clienteNome, dataAbertura, dataFechamento, status, total, garcom",caixa:"++id, tipo, descricao, valor, data, formaPagamento",contasPagar:"++id, descricao, fornecedorId, filialId, valor, vencimento, categoria, status, parcela, dataPagamento, juros, multa, desconto, centroCusto",contasReceber:"++id, descricao, clienteId, filialId, valor, vencimento, status, parcela, dataRecebimento, juros, multa, desconto, centroCusto",fluxoCaixa:"++id, filialId, data, tipo, descricao, valor, saldo, categoria",conciliacoes:"++id, contaId, tipo, data, valor, status",centrosCusto:"++id, nome, descricao, tipo",lancamentosContabeis:"++id, filialId, data, tipo, descricao, valor, centroCusto, contaContabil",planosContas:"++id, codigo, nome, tipo, natureza",contratosConvenio:"++id, clienteId, convenioId, limite, saldo, status",convenios:"++id, nome, cnpj, descontoMax, prazo, ativo",consumosConvenio:"++id, contratoId, data, valor, descricao",veiculos:"++id, placa, modelo, marca, tipo, ano, cor, renavam, chassi, km, combustivel, status, filialId",manutencoes:"++id, veiculoId, data, tipo, descricao, valor, km, fornecedor, nf",abastecimentos:"++id, veiculoId, data, litros, valor, km, tipoCombustivel, posto",motoristas:"++id, nome, cnh, categoria, validade, funcionarioId",entregas:"++id, vendaId, clienteId, endereco, motoristaId, veiculoId, previsao, status, filialId, taxa, assinatura",tabelaPrecos:"++id, produtoId, tipo, clienteId, quantidadeMin, preco, validoDe, validoAte, prioridade",promocoes:"++id, descricao, tipo, valor, validoDe, validoAte, ativo, filialId",crmInteracoes:"++id, clienteId, tipo, data, descricao, responsavel, status",crmOportunidades:"++id, clienteId, titulo, valor, data, fonte, status, responsavel, probabilidade",metasVendas:"++id, vendedorId, mes, ano, metaValor, metaQtd, alcancado, comissao",notificacoes:"++id, usuarioId, tipo, titulo, mensagem, lida, data, modulo, acao",configuracoes:"chave",webhooks:"++id, nome, url, eventos, ativo, token",balancas:"++id, modelo, porta, marca, protocolo, ativo"}),this.seedIfEmpty()}async seedIfEmpty(){if(await this.db.produtos.count()>0)return;const t=[{codigo:"001",ean:"7891234567890",nome:"Arroz Tio João 5kg",emoji:"🍚",categoria:"Mercearia",preco:22.9,custo:15,estoque:80,estMin:10,estMax:200,ncm:"1006.20.10",ativo:!0},{codigo:"002",ean:"7890123456789",nome:"Feijão Carioca 1kg",emoji:"🫘",categoria:"Mercearia",preco:8.9,custo:5.5,estoque:60,estMin:10,estMax:150,ncm:"0713.33.99",ativo:!0},{codigo:"003",ean:"7893789012345",nome:"Leite Integral 1L",emoji:"🥛",categoria:"Laticínios",preco:5.49,custo:3.8,estoque:120,estMin:20,estMax:300,ncm:"0401.20.10",ativo:!0},{codigo:"004",ean:"7891000100016",nome:"Café Melitta 500g",emoji:"☕",categoria:"Mercearia",preco:16.9,custo:11,estoque:45,estMin:8,estMax:100,ncm:"0901.21.00",ativo:!0},{codigo:"005",ean:"7892840801008",nome:"Óleo de Soja 900ml",emoji:"🫒",categoria:"Mercearia",preco:7.99,custo:5.2,estoque:70,estMin:10,estMax:150,ncm:"1507.10.00",ativo:!0},{codigo:"006",ean:"7890001500028",nome:"Açúcar Cristal 1kg",emoji:"🍯",categoria:"Mercearia",preco:4.99,custo:3,estoque:90,estMin:15,estMax:200,ncm:"1701.99.00",ativo:!0},{codigo:"007",ean:"7896036095038",nome:"Macarrão Espaguete 500g",emoji:"🍝",categoria:"Mercearia",preco:5.49,custo:3.2,estoque:55,estMin:10,estMax:100,ncm:"1902.19.00",ativo:!0},{codigo:"008",ean:"7891025100004",nome:"Frango Inteiro Kg",emoji:"🍗",categoria:"Açougue",preco:14.9,custo:9.8,estoque:40,estMin:5,estMax:80,ncm:"0207.12.00",ativo:!0},{codigo:"009",ean:"7891910000197",nome:"Refrigerante Coca 2L",emoji:"🥤",categoria:"Bebidas",preco:10.9,custo:6.5,estoque:30,estMin:6,estMax:60,ncm:"2202.10.00",ativo:!0},{codigo:"010",ean:"7896098900023",nome:"Sabonete Dove 90g",emoji:"🧼",categoria:"Higiene",preco:3.99,custo:2.2,estoque:100,estMin:20,estMax:200,ncm:"3401.11.90",ativo:!0},{codigo:"011",ean:"7891000055005",nome:"Picanha Bovina Kg",emoji:"🥩",categoria:"Açougue",preco:59.9,custo:42,estoque:20,estMin:4,estMax:40,ncm:"0201.30.00",ativo:!0},{codigo:"012",ean:"7898357412345",nome:"Cerveja Brahma 350ml",emoji:"🍺",categoria:"Bebidas",preco:3.99,custo:2.1,estoque:200,estMin:30,estMax:500,ncm:"2203.00.00",ativo:!0},{codigo:"013",ean:"7891234567891",nome:"Detergente Ypê 500ml",emoji:"🧴",categoria:"Limpeza",preco:2.99,custo:1.5,estoque:80,estMin:10,estMax:150,ncm:"3402.20.00",ativo:!0},{codigo:"014",ean:"7891147000511",nome:"Papel Higiênico Neve 12un",emoji:"🧻",categoria:"Higiene",preco:18.9,custo:12,estoque:50,estMin:8,estMax:100,ncm:"4818.10.00",ativo:!0},{codigo:"015",ean:"7891354000807",nome:"Requeijão Catupiry 200g",emoji:"🧀",categoria:"Laticínios",preco:11.9,custo:7.5,estoque:35,estMin:6,estMax:80,ncm:"0406.30.00",ativo:!0},{codigo:"016",ean:"7898911290004",nome:"Suco Tang Laranja 25g",emoji:"🧃",categoria:"Bebidas",preco:1.99,custo:.8,estoque:300,estMin:50,estMax:600,ncm:"2106.90.00",ativo:!0},{codigo:"017",ean:"7894000250121",nome:"Coca-Cola Zero 350ml",emoji:"🥤",categoria:"Bebidas",preco:4.49,custo:2.5,estoque:100,estMin:15,estMax:250,ncm:"2202.10.00",ativo:!0},{codigo:"018",ean:"7891516423110",nome:"Biscoito Oreo 90g",emoji:"🍪",categoria:"Mercearia",preco:5.99,custo:3.5,estoque:60,estMin:10,estMax:100,ncm:"1905.31.00",ativo:!0},{codigo:"019",ean:"7890551000100",nome:"Margarina Qualy 500g",emoji:"🧈",categoria:"Laticínios",preco:8.9,custo:5,estoque:40,estMin:8,estMax:80,ncm:"1517.10.00",ativo:!0},{codigo:"020",ean:"7894321000111",nome:"Água Sanitária Q-Boa 1L",emoji:"🧪",categoria:"Limpeza",preco:3.49,custo:1.8,estoque:70,estMin:10,estMax:120,ncm:"2828.90.11",ativo:!0}];for(const i of t)await this.db.produtos.add({unidade:i.unidade||"UN",...i});await this.db.unidades.bulkAdd([{sigla:"UN",descricao:"Unidade"},{sigla:"KG",descricao:"Quilograma"},{sigla:"L",descricao:"Litro"},{sigla:"PC",descricao:"Pacote"},{sigla:"CX",descricao:"Caixa"}]),await this.db.categorias.bulkAdd([{nome:"Mercearia",descricao:"Produtos de mercearia em geral",tributacao:"SN"},{nome:"Laticínios",descricao:"Leite, queijos, iogurtes",tributacao:"SN"},{nome:"Bebidas",descricao:"Refrigerantes, sucos, cervejas",tributacao:"SN"},{nome:"Açougue",descricao:"Carnes bovinas, suínas, aves",tributacao:"SN"},{nome:"Higiene",descricao:"Sabonetes, shampoos, papel higiênico",tributacao:"SN"},{nome:"Limpeza",descricao:"Detergentes, água sanitária, desinfetantes",tributacao:"SN"},{nome:"Padaria",descricao:"Pães, bolos, salgados",tributacao:"SN"},{nome:"Hortifrúti",descricao:"Frutas, verduras, legumes",tributacao:"SN"},{nome:"Congelados",descricao:"Produtos congelados",tributacao:"SN"},{nome:"PET",descricao:"Produtos para animais",tributacao:"SN"}]),await this.db.fornecedores.bulkAdd([{cnpj:"11.111.111/0001-01",razaoSocial:"Distribuidora Alimentos Ltda",fantasia:"DAL Alimentos",prazoEntrega:3,prazoPagamento:28,score:95},{cnpj:"22.222.222/0001-02",razaoSocial:"Bebidas do Brasil S.A.",fantasia:"Brasil Bebidas",prazoEntrega:2,prazoPagamento:30,score:90},{cnpj:"33.333.333/0001-03",razaoSocial:"Higiene & Limpeza Comercial",fantasia:"HLC Distribuidora",prazoEntrega:5,prazoPagamento:21,score:85},{cnpj:"44.444.444/0001-04",razaoSocial:"Frigorífico Boi Gordo Ltda",fantasia:"Boi Gordo",prazoEntrega:1,prazoPagamento:14,score:98},{cnpj:"55.555.555/0001-05",razaoSocial:"Laticínios da Serra Ltda",fantasia:"Serra Leite",prazoEntrega:2,prazoPagamento:21,score:92}]),await this.db.clientes.bulkAdd([{cpf:"000.000.000-00",nome:"Consumidor Final",telefone:"",email:"",pontos:0,totalCompras:0,segmento:"Regular"},{cpf:"111.111.111-11",nome:"Maria Oliveira Silva",telefone:"(11) 99999-1111",email:"maria@email.com",pontos:150,totalCompras:2500,segmento:"Premium",aniversario:"15/03"},{cpf:"222.222.222-22",nome:"João Pereira Santos",telefone:"(11) 99999-2222",email:"joao@email.com",pontos:80,totalCompras:1200,segmento:"Regular",aniversario:"22/07"},{cpf:"333.333.333-33",nome:"Ana Cristina Lima",telefone:"(11) 99999-3333",email:"ana@email.com",pontos:320,totalCompras:5800,segmento:"Premium",aniversario:"10/11"},{cpf:"444.444.444-44",nome:"Carlos Eduardo Souza",telefone:"(11) 99999-4444",email:"carlos@email.com",pontos:45,totalCompras:890,segmento:"Regular",aniversario:"05/09"}]);const a=await Y("admin");await this.db.usuarios.add({login:"admin",email:"admin@nexus.com.br",senha:a,perfil:"admin",setores:["dashboard","pdv","produtos","estoque","compras","clientes","financeiro","rh","frota","fiscal","relatorios","configuracoes","vendas"]}),await this.db.funcionarios.bulkAdd([{nome:"Ana Beatriz Costa",cpf:"111.111.111-00",cargo:"Atendente",setor:"PDV",salarioBase:1518,dataAdmissao:"2023-01-15",horasExtrasMes:8,adicionalNoturno:0,insalubridade:0,periculosidade:0,valeTransporte:91.08,valeRefeicao:220,planoSaude:89.9,dependentes:1},{nome:"Carlos Eduardo Lima",cpf:"222.222.222-00",cargo:"Acougueiro",setor:"Acougue",salarioBase:1980,dataAdmissao:"2023-03-10",horasExtrasMes:12,adicionalNoturno:0,insalubridade:198,periculosidade:0,valeTransporte:118.8,valeRefeicao:220,planoSaude:89.9,dependentes:0},{nome:"Daniela Oliveira Santos",cpf:"333.333.333-00",cargo:"Gerente",setor:"Administrativo",salarioBase:4200,dataAdmissao:"2022-06-01",horasExtrasMes:0,adicionalNoturno:0,insalubridade:0,periculosidade:0,valeTransporte:0,valeRefeicao:0,planoSaude:89.9,dependentes:2},{nome:"Eduardo Almeida Neto",cpf:"444.444.444-00",cargo:"Repositor",setor:"Estoque",salarioBase:1540,dataAdmissao:"2023-08-20",horasExtrasMes:10,adicionalNoturno:154,insalubridade:0,periculosidade:0,valeTransporte:92.4,valeRefeicao:220,planoSaude:89.9,dependentes:0},{nome:"Fernanda Souza Rocha",cpf:"555.555.555-00",cargo:"Atendente",setor:"PDV",salarioBase:1518,dataAdmissao:"2024-02-01",horasExtrasMes:6,adicionalNoturno:0,insalubridade:0,periculosidade:0,valeTransporte:91.08,valeRefeicao:220,planoSaude:89.9,dependentes:1}]),await this.db.configuracoes.put({chave:"loja",valor:JSON.stringify({nome:"NEXUS Market AI",cnpj:"00.000.000/0001-00",endereco:"Rua das Tecnologias, 1000",ie:"111.111.111.111",telefone:"(11) 99999-0000",email:"contato@nexus.ai",regime:"SN",cnae:"4711301",aliquotaISS:2})}),await this.db.configuracoes.put({chave:"numVenda",valor:"1"}),await this.db.configuracoes.put({chave:"fiscal",valor:JSON.stringify({ambiente:"homologacao",serieNFCe:"1",certificado:"",ultimoNumeroNF:0})}),await this.db.configuracoes.put({chave:"tef",valor:JSON.stringify({ativo:!1,ip:"192.168.1.200",porta:"7777"})}),await this.db.caixas.add({filialId:1,numero:"01",saldoInicial:0,saldoAtual:0,status:"fechado",operadorId:1}),await this.db.centrosCusto.bulkAdd([{nome:"Administrativo",descricao:"Despesas administrativas",tipo:"despesa"},{nome:"Comercial",descricao:"Custos comerciais",tipo:"despesa"},{nome:"Operacional",descricao:"Custos operacionais",tipo:"custo"},{nome:"Vendas",descricao:"Receitas de vendas",tipo:"receita"}]),await this.db.planosContas.bulkAdd([{codigo:"1.1",nome:"Caixa",tipo:"ativo",natureza:"devedora"},{codigo:"2.1",nome:"Fornecedores",tipo:"passivo",natureza:"credora"},{codigo:"3.1",nome:"Receita de Vendas",tipo:"receita",natureza:"credora"},{codigo:"4.1",nome:"Custo das Mercadorias",tipo:"despesa",natureza:"devedora"},{codigo:"4.2",nome:"Despesas Operacionais",tipo:"despesa",natureza:"devedora"}])}}const X=Object.freeze(Object.defineProperty({__proto__:null,Database:de,hashSenha:Y},Symbol.toStringTag,{value:"Module"}));window.db=new de;document.addEventListener("DOMContentLoaded",async()=>{await window.db.init(),window.app=new ot,await window.app.init()});
