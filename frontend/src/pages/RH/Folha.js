import { fmt, toast } from '../../utils/format.js'

export class Folha {
  async render() {
    const el = document.getElementById('page-folha')
    el.innerHTML = `
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
    `
    window.folha = this
    this.renderModalAdiantamento()
    await this.loadData()
  }

  async loadData() {
    const db = window.db.db
    const folhas = await db.folhaPagamento.toArray()
    folhas.sort((a, b) => b.ano - a.ano || b.mes - a.mes)
    const funcs = Object.fromEntries((await db.funcionarios.toArray()).map(f => [f.id, f]))

    const totals = folhas.reduce((a, f) => {
      a.salario += f.salarioBase || 0
      a.horasExtras += f.horaExtraValor || 0
      a.adicionalNoturno += f.adicionalNoturno || 0
      a.insalubridade += f.insalubridade || 0
      a.periculosidade += f.periculosidade || 0
      a.comissao += f.comissao || 0
      a.bonus += f.bonus || 0
      a.valeTransporte += f.valeTransporte || 0
      a.valeRefeicao += f.valeRefeicao || 0
      a.planoSaude += f.planoSaude || 0
      a.inss += f.inss || 0
      a.irrf += f.irrf || 0
      a.outrosDescontos += f.outrosDescontos || 0
      a.liquido += f.liquido || 0
      a.bruto += (f.bruto || f.salarioBase || 0) + (f.horaExtraValor || 0) + (f.adicionalNoturno || 0) + (f.insalubridade || 0) + (f.periculosidade || 0) + (f.comissao || 0) + (f.bonus || 0)
      return a
    }, { salario: 0, horasExtras: 0, adicionalNoturno: 0, insalubridade: 0, periculosidade: 0, comissao: 0, bonus: 0, valeTransporte: 0, valeRefeicao: 0, planoSaude: 0, inss: 0, irrf: 0, outrosDescontos: 0, liquido: 0, bruto: 0 })

    document.getElementById('folha-kpis').innerHTML = `
      <div class="kpi green"><div class="kpi-label">Bruto total</div><div class="kpi-value">${fmt(totals.bruto)}</div></div>
      <div class="kpi blue"><div class="kpi-label">Horas extras</div><div class="kpi-value">${fmt(totals.horasExtras)}</div></div>
      <div class="kpi purple"><div class="kpi-label">Adicionais</div><div class="kpi-value">${fmt(totals.adicionalNoturno + totals.insalubridade + totals.periculosidade)}</div></div>
      <div class="kpi yellow"><div class="kpi-label">Comissoes/bonus</div><div class="kpi-value">${fmt(totals.comissao + totals.bonus)}</div></div>
      <div class="kpi red"><div class="kpi-label">Descontos total</div><div class="kpi-value">${fmt(totals.inss + totals.irrf + totals.valeTransporte + totals.valeRefeicao + totals.planoSaude + totals.outrosDescontos)}</div></div>
      <div class="kpi green"><div class="kpi-label">Liquido total</div><div class="kpi-value">${fmt(totals.liquido)}</div></div>
    `

    this.renderChart('folha-chart-proventos', 'bar',
      ['Salario', 'H.Extras', 'Ad.Noturno', 'Insalub.', 'Periculos.', 'Comissao', 'Bonus'],
      [[totals.salario, totals.horasExtras, totals.adicionalNoturno, totals.insalubridade, totals.periculosidade, totals.comissao, totals.bonus]],
      ['#22c55e'], ['Proventos']
    )
    this.renderChart('folha-chart-descontos', 'bar',
      ['INSS', 'IRRF', 'VT', 'VR', 'Pl.Saude', 'Outros'],
      [[totals.inss, totals.irrf, totals.valeTransporte, totals.valeRefeicao, totals.planoSaude, totals.outrosDescontos]],
      ['#ef4444'], ['Descontos']
    )

    document.getElementById('folha-table-wrap').innerHTML = folhas.length ? `
      <div class="tbl-wrap"><table>
        <thead><tr>
          <th>Funcionario</th><th>Mes/Ano</th><th>Salario</th><th>H.Extra</th><th>Ad.Noturno</th><th>Insalub.</th>
          <th>Periculos.</th><th>Comissao</th><th>Bonus</th><th>Bruto</th><th>INSS</th><th>IRRF</th>
          <th>VT</th><th>VR</th><th>Pl.Saude</th><th>Outros</th><th>Liquido</th>
        </tr></thead>
        <tbody>${folhas.map(f => {
          const func = funcs[f.funcionarioId]
          return `<tr>
            <td><strong>${func?.nome || '-'}</strong></td>
            <td class="text-mono">${String(f.mes).padStart(2, '0')}/${f.ano}</td>
            <td class="text-mono">${fmt(f.salarioBase || 0)}</td>
            <td class="text-mono">${f.horaExtraQtd || 0}h / ${fmt(f.horaExtraValor || 0)}</td>
            <td class="text-mono">${fmt(f.adicionalNoturno || 0)}</td>
            <td class="text-mono">${fmt(f.insalubridade || 0)}</td>
            <td class="text-mono">${fmt(f.periculosidade || 0)}</td>
            <td class="text-mono">${fmt(f.comissao || 0)}</td>
            <td class="text-mono">${fmt(f.bonus || 0)}</td>
            <td class="text-mono">${fmt((f.salarioBase || 0) + (f.horaExtraValor || 0) + (f.adicionalNoturno || 0) + (f.insalubridade || 0) + (f.periculosidade || 0) + (f.comissao || 0) + (f.bonus || 0))}</td>
            <td class="text-mono text-red">${fmt(f.inss || 0)}</td>
            <td class="text-mono text-red">${fmt(f.irrf || 0)}</td>
            <td class="text-mono text-red">${fmt(f.valeTransporte || 0)}</td>
            <td class="text-mono text-red">${fmt(f.valeRefeicao || 0)}</td>
            <td class="text-mono text-red">${fmt(f.planoSaude || 0)}</td>
            <td class="text-mono text-red">${fmt(f.outrosDescontos || 0)}</td>
            <td class="text-mono text-green"><strong>${fmt(f.liquido || 0)}</strong></td>
          </tr>`
        }).join('')}</tbody></table>
      </div>` : '<div class="empty-state"><p>Nenhuma folha calculada. Clique em "Calcular mes" para gerar.</p></div>'
  }

  async calcular() {
    const db = window.db.db
    const funcs = await db.funcionarios.toArray()
    if (!funcs.length) return toast('Nenhum funcionario cadastrado', 'error')
    const now = new Date()
    const mes = now.getMonth() + 1
    const ano = now.getFullYear()
    for (const f of funcs) {
      const salario = f.salarioBase || f.salario || 0
      const valorHora = salario / 220
      const horaExtraQtd = f.horasExtrasMes || 0
      const horaExtraValor = horaExtraQtd * valorHora * 1.5
      const adicionalNoturno = f.adicionalNoturno || 0
      const insalubridade = f.insalubridade || 0
      const periculosidade = f.periculosidade || 0
      const comissao = f.comissaoMes || 0
      const bonus = f.bonus || 0
      const bruto = salario + horaExtraValor + adicionalNoturno + insalubridade + periculosidade + comissao + bonus

      const inss = bruto <= 1412 ? bruto * 0.075 : bruto <= 2666.68 ? bruto * 0.09 : bruto <= 4000.03 ? bruto * 0.12 : Math.min(bruto * 0.14, 908.85)
      const baseIrrf = bruto - inss - (f.dependentes || 0) * 189.59
      const irrf = baseIrrf > 4664.68 ? baseIrrf * 0.275 - 884.96 : baseIrrf > 3751.05 ? baseIrrf * 0.225 - 636.13 : baseIrrf > 2826.65 ? baseIrrf * 0.15 - 354.80 : baseIrrf > 2259.20 ? baseIrrf * 0.075 - 169.44 : 0
      const valeTransporte = f.valeTransporte || (salario * 0.06)
      const valeRefeicao = f.valeRefeicao || 0
      const planoSaude = f.planoSaude || 0
      const outrosDescontos = f.outrosDescontos || 0
      const totalDescontos = inss + Math.max(0, irrf) + valeTransporte + valeRefeicao + planoSaude + outrosDescontos
      const liquido = bruto - totalDescontos

      const data = {
        funcionarioId: f.id, mes, ano,
        salarioBase: salario,
        horaExtraQtd, horaExtraValor,
        adicionalNoturno, insalubridade, periculosidade,
        comissao, bonus,
        bruto, inss, irrf: Math.max(0, irrf),
        valeTransporte, valeRefeicao, planoSaude,
        outrosDescontos, liquido
      }

      const existing = await db.folhaPagamento.filter(fp => fp.funcionarioId === f.id && fp.mes === mes && fp.ano === ano).first()
      if (existing) await db.folhaPagamento.update(existing.id, data)
      else await db.folhaPagamento.add(data)
    }
    toast(`Folha ${mes}/${ano} calculada com todos os dados`, 'success')
    await this.loadData()
  }

  async abrirAdiantamento() {
    toast('Funcionalidade de adiantamento disponivel na proxima versao', 'info')
  }

  renderModalAdiantamento() {
    if (document.getElementById('modal-adiantamento')) return
    const div = document.createElement('div')
    div.className = 'modal-overlay hidden'
    div.id = 'modal-adiantamento'
    div.innerHTML = `<div class="modal"><h2>Adiantamento Salarial</h2><p>Em desenvolvimento</p><div class="modal-footer"><button class="btn btn-secondary" onclick="window.closeModal('modal-adiantamento')">Fechar</button></div></div>`
    document.body.appendChild(div)
  }

  renderChart(canvasId, type, labels, datasets, colors, legends) {
    const canvas = document.getElementById(canvasId)
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (this._charts && this._charts[canvasId]) this._charts[canvasId].destroy()

    if (!Array.isArray(datasets[0])) datasets = [datasets]
    if (!this._charts) this._charts = {}
    this._charts[canvasId] = new Chart(ctx, {
      type,
      data: {
        labels,
        datasets: datasets.map((data, i) => ({
          label: legends ? legends[i] : '',
          data,
          backgroundColor: colors[i] || colors[0],
          borderColor: '#0d1117',
          borderWidth: 1,
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: !!legends, labels: { color: '#8b949e', font: { size: 10 } } } },
        scales: {
          y: { beginAtZero: true, ticks: { color: '#6e7681', font: { size: 9 }, callback: v => 'R$ ' + (v || 0).toFixed(0) }, grid: { color: '#21262d' } },
          x: { ticks: { color: '#6e7681', font: { size: 9 } }, grid: { display: false } }
        }
      }
    })
  }
}
