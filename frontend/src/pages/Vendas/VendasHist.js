import { esc, fmt, fmtNum, toast } from '../../utils/format.js'

export class VendasHist {
  async render() {
    const el = document.getElementById('page-vendas-hist')
    el.innerHTML = `
      <div class="section-header">
        <h2>🗃️ Histórico de Vendas</h2>
        <div class="gap-8">
          <input type="text" id="vendas-search" class="search-bar" placeholder="🔍 Buscar..." autocomplete="off"/>
        </div>
      </div>
      <div id="vendas-hist-wrap"><div class="empty-state"><div class="icon">🗃️</div><p>Carregando...</p></div></div>
    `

    window.vendasHist = this
    this.loadData()
    document.getElementById('vendas-search').addEventListener('input', () => this.loadData())
  }

  async loadData() {
    const db = window.db.db
    const q = (document.getElementById('vendas-search')?.value || '').toLowerCase()
    let vendas = await db.vendasPDV.toArray()
    vendas.sort((a,b) => new Date(b.data) - new Date(a.data))

    if (q) vendas = vendas.filter(v => (v.clienteNome && v.clienteNome.toLowerCase().includes(q)) || (v.formaPagamento && v.formaPagamento.toLowerCase().includes(q)) || String(v.num).includes(q))

    const wrap = document.getElementById('vendas-hist-wrap')
    wrap.innerHTML = vendas.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>#</th><th>Data</th><th>Cliente</th><th>Itens</th><th>Total</th><th>Pagamento</th><th>Imprimir</th></tr></thead>
          <tbody>${vendas.map(v => `
            <tr>
              <td class="text-mono">${v.num||v.id}</td>
              <td class="text-mono">${new Date(v.data).toLocaleString('pt-BR')}</td>
              <td><strong>${esc(v.clienteNome||'Consumidor Final')}</strong></td>
              <td class="text-mono">${v.itens||0}</td>
              <td class="text-mono text-green">${fmt(v.total)}</td>
              <td><span class="badge blue">${esc(v.formaPagamento||'—')}</span></td>
              <td><button class="btn btn-sm btn-secondary" onclick="window.vendasHist.reprint(${v.id})">🖨️</button></td>
            </tr>
          `).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><div class="icon">🗃️</div><p>Nenhuma venda encontrada</p></div>'
  }

  async reprint(id) {
    const db = window.db.db
    const venda = await db.vendasPDV.get(id)
    if (!venda) { toast('⚠️ Venda não encontrada', 'error'); return }
    const itens = await db.itensPDV.where('vendaPDVId').equals(id).toArray()

    const loja = JSON.parse(localStorage.getItem('loja_config')||'{}')
    const content = `
      <div class="receipt">
        <div class="receipt-center receipt-bold" style="font-size:14px;">${loja.nome||'SUPERMERCADO'}</div>
        <div class="receipt-center" style="font-size:10px;">${loja.endereco||''}</div>
        <div class="receipt-center" style="font-size:10px;">CNPJ: ${loja.cnpj||'00.000.000/0001-00'}</div>
        <div class="receipt-line"></div>
        <div class="receipt-center">CUPOM NÃO FISCAL - REIMPRESSÃO</div>
        <div class="receipt-center" style="font-size:10px;">${new Date(venda.data).toLocaleString('pt-BR')} | Venda #${venda.num||venda.id}</div>
        <div class="receipt-line"></div>
        ${itens.map(i => `
          <div style="margin-bottom:2px;">${esc(i.nome?.substring(0,24))}</div>
          <div class="receipt-row"><span>${i.qtd||0} x ${fmt(i.preco)}</span><span>${fmt(i.total)}</span></div>
        `).join('')}
        <div class="receipt-line"></div>
        <div class="receipt-row receipt-bold" style="font-size:14px;"><span>TOTAL</span><span>${fmt(venda.total)}</span></div>
        <div class="receipt-row"><span>Pagamento</span><span>${esc(venda.formaPagamento?.toUpperCase()||'—')}</span></div>
        ${venda.clienteNome && venda.clienteNome !== 'Consumidor Final' ? `<div class="receipt-row"><span>Cliente</span><span>${esc(venda.clienteNome)}</span></div>` : ''}
        <div class="receipt-line"></div>
        <div class="receipt-center" style="font-size:10px;">Obrigado pela preferência!</div>
      </div>
    `

    const w = window.open('', '_blank')
    w.document.write(`<html><body style="font-family:monospace;">${content}</body></html>`)
    w.print()
    w.close()
    toast('🖨️ Reimpressão enviada', 'info')
  }
}
