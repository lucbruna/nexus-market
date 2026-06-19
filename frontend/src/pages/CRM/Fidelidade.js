import { esc, fmt, fmtNum, toast } from '../../utils/format.js'

export class Fidelidade {
  async render() {
    const el = document.getElementById('page-fidelidade')
    el.innerHTML = `
      <div class="section-header">
        <h2>⭐ Programa Fidelidade</h2>
      </div>
      <div class="kpi-grid" id="fidelidade-kpis"></div>
      <div class="card">
        <div class="card-title">🏆 Ranking de Clientes</div>
        <div id="fidelidade-table-wrap"><div class="empty-state"><div class="icon">⭐</div><p>Carregando...</p></div></div>
      </div>
    `
    await this.loadData()
  }

  async loadData() {
    const db = window.db.db
    const clientes = await db.clientes.toArray()
    const totalPts = clientes.reduce((a,c) => a + (c.pontos||0), 0)
    const topCli = [...clientes].sort((a,b) => (b.pontos||0) - (a.pontos||0)).slice(0,50)

    document.getElementById('fidelidade-kpis').innerHTML = `
      <div class="kpi green"><div class="kpi-label">⭐ Total Pontos</div><div class="kpi-value">${fmtNum(totalPts)}</div><div class="kpi-sub">pontos ativos</div></div>
      <div class="kpi blue"><div class="kpi-label">👥 Clientes com Pontos</div><div class="kpi-value">${clientes.filter(c => (c.pontos||0) > 0).length}</div><div class="kpi-sub">de ${clientes.length} total</div></div>
      <div class="kpi yellow"><div class="kpi-label">🏆 Maior Pontuação</div><div class="kpi-value">${fmtNum(topCli[0]?.pontos||0)}</div><div class="kpi-sub">${esc(topCli[0]?.nome||'—')}</div></div>
    `

    const wrap = document.getElementById('fidelidade-table-wrap')
    wrap.innerHTML = topCli.length ? `
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>#</th><th>Cliente</th><th>CPF</th><th>Pontos</th><th>Total Compras</th></tr></thead>
          <tbody>${topCli.map((c,i) => `
            <tr>
              <td class="text-mono">${i+1}</td>
              <td><strong>${esc(c.nome)}</strong></td>
              <td class="text-mono">${esc(c.cpf||'—')}</td>
              <td><span class="badge yellow">⭐ ${fmtNum(c.pontos||0)}</span></td>
              <td class="text-mono text-green">${fmt(c.totalCompras||0)}</td>
            </tr>
          `).join('')}</tbody>
        </table>
      </div>
    ` : '<div class="empty-state"><div class="icon">⭐</div><p>Nenhum cliente cadastrado</p></div>'
  }
}
