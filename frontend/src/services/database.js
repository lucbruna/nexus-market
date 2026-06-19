export async function hashSenha(senha) {
  const encoder = new TextEncoder()
  const data = encoder.encode(senha)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}
window.hashSenha = hashSenha

export class Database {
  constructor() {
    this.db = new Dexie('NexusMarketAI')
  }

  init() {
    this.db.version(5).stores({
      empresas:         '++id, cnpj, razaoSocial, nomeFantasia',
      filiais:          '++id, empresaId, cnpj, nome',
      usuarios:         '++id, login, email, perfil, empresaId, filialId',
      permissoes:       '++id, usuarioId, modulo',
      tokens:           '++id, usuarioId, token, expiraEm',
      auditoriaLogs:    '++id, usuarioId, acao, modulo, data',
      funcionarios:     '++id, cpf, nome, cargo, setor, filialId',
      cargos:           '++id, nome, salarioBase',
      departamentos:    '++id, nome, centroCusto',
      escalas:          '++id, funcionarioId, diaSemana, entrada, saida',
      ferias:           '++id, funcionarioId, inicio, fim, status',
      folhaPagamento:   '++id, funcionarioId, mes, ano, salarioBase, inss, irrf, liquido',
      beneficios:       '++id, funcionarioId, tipo, valor',
      pontoBiometrico:  '++id, funcionarioId, data, hora, tipo',
      batidas:          '++id, funcionarioId, data, entrada, saidaAlmoco, retorno, saida',
      horasExtras:      '++id, funcionarioId, data, qtdHoras, percentual',
      bancoHoras:       '++id, funcionarioId, saldoHoras',
      contratosRH:      '++id, funcionarioId, tipo, inicio, fim, salario, status, motivo',
      rescisoes:        '++id, funcionarioId, data, tipo, avisoPrevio, saldoFerias, decimoTerceiro, multaFGTS, valorTotal, status',
      atestados:        '++id, funcionarioId, inicio, fim, cid, observacao',
      clientes:         '++id, cpf, nome, telefone, email, pontos, limiteCredito, segmento, aniversario, obs, filialId',
      enderecosClientes:'++id, clienteId, tipo, logradouro, bairro, cidade, uf, cep',
      historicoClientes:'++id, clienteId, tipo, descricao, data',
      fidelidade:       '++id, clienteId, pontos, data, tipo, vencimento',
      cobrancas:        '++id, clienteId, data, valor, vencimento, status, observacao',
      fornecedores:     '++id, cnpj, razaoSocial, fantasia, prazoEntrega, prazoPagamento, score, observacoes',
      contatosFornecedores:'++id, fornecedorId, nome, telefone, email, cargo',
      rankingFornecedores:'++id, fornecedorId, pedidos, entregasNoPrazo, qualidade, precoMedio, score',
      produtos:         '++id, codigo, ean, nome, descricao, categoriaId, marcaId, unidadeId, preco, custo, estoque, estMin, estMax, ncm, cest, cst, cfop, icms, pis, cofins, ipi, peso, volume, localizacao, loteObrigatorio, validoObrigatorio, comissao, ativo, filialId',
      categorias:       '++id, nome, descricao, tributacao, margemPadrao',
      subcategorias:    '++id, categoriaId, nome',
      marcas:           '++id, nome, fornecedorId',
      unidades:         '++id, sigla, descricao',
      estoque:          '++id, produtoId, filialId, qtd, localizacao',
      movimentacoesEstoque:'++id, produtoId, filialId, tipo, qtd, documento, data, responsavel, motivo',
      inventarios:      '++id, filialId, data, status, responsavel, tipo',
      lotes:            '++id, produtoId, lote, qtd, fabricacao, vencimento, localizacao',
      validades:        '++id, loteId, produtoId, vencimento, qtd',
      perdas:           '++id, produtoId, loteId, data, qtd, motivo, valor, responsavel',
      transferenciasEstoque:'++id, produtoId, origemFilialId, destinoFilialId, data, qtd, status, responsavel',
      curvaABC:         '++id, produtoId, periodo, qtdVendida, valorVendido, percentual, classificacao',
      solicitacoesCompra:'++id, filialId, data, status, solicitante, prioridade',
      cotacoes:         '++id, solicitacaoId, fornecedorId, data, valorTotal, prazo, itens',
      pedidosCompra:    '++id, fornecedorId, filialId, data, entrega, status, total, frete, desconto, observacoes, aprovadoPor',
      itensPedidoCompra:'++id, pedidoId, produtoId, qtd, preco, total, recebido',
      recebimentos:     '++id, pedidoId, data, nf, serie, chaveAcesso, valor, frete, responsavel, status, conferido',
      orcamentos:       '++id, clienteId, filialId, data, itens, total, status, validoAte',
      pedidosVenda:     '++id, clienteId, filialId, data, total, status, formaPagamento',
      itensVenda:       '++id, vendaId, produtoId, nome, qtd, preco, total',
      notasFiscais:     '++id, tipo, numero, serie, chaveAcesso, clienteId, valor, data, status, xml, protocolo, motivoCancelamento',
      nfeEntrada:       '++id, numero, serie, chaveAcesso, fornecedorId, dataEmissao, dataRecebimento, valor, cfop, status, xml',
      spedFiscal:       '++id, periodo, tipo, arquivo, geradoEm, status',
      caixas:           '++id, filialId, numero, saldoInicial, saldoAtual, status, operadorId, dataAbertura, dataFechamento',
      aberturasCaixa:   '++id, caixaId, data, valorInicial, operadorId',
      fechamentosCaixa: '++id, caixaId, data, valorFinal, diferenca, observacao, operadorId',
      sangrias:          '++id, caixaId, data, valor, motivo, operadorId',
      suprimentos:       '++id, caixaId, data, valor, motivo, operadorId',
      vendasPDV:        '++id, caixaId, vendaId, data, total, formaPagamento, desconto, descontoTipo, clienteNome, clienteId, num, comanda, entregar, status',
      itensPDV:         '++id, vendaPDVId, produtoId, nome, qtd, preco, total, desconto',
      pagamentosPDV:    '++id, vendaPDVId, caixaId, forma, valor, troco, parcelas, nsu, data',
      comandasPDV:      '++id, numero, mesa, clienteNome, dataAbertura, dataFechamento, status, total, garcom',
      caixa:            '++id, tipo, descricao, valor, data, formaPagamento',
      contasPagar:      '++id, descricao, fornecedorId, filialId, valor, vencimento, categoria, status, parcela, dataPagamento, juros, multa, desconto, centroCusto',
      contasReceber:    '++id, descricao, clienteId, filialId, valor, vencimento, status, parcela, dataRecebimento, juros, multa, desconto, centroCusto',
      fluxoCaixa:       '++id, filialId, data, tipo, descricao, valor, saldo, categoria',
      conciliacoes:     '++id, contaId, tipo, data, valor, status',
      centrosCusto:     '++id, nome, descricao, tipo',
      lancamentosContabeis:'++id, filialId, data, tipo, descricao, valor, centroCusto, contaContabil',
      planosContas:     '++id, codigo, nome, tipo, natureza',
      contratosConvenio:'++id, clienteId, convenioId, limite, saldo, status',
      convenios:        '++id, nome, cnpj, descontoMax, prazo, ativo',
      consumosConvenio: '++id, contratoId, data, valor, descricao',
      veiculos:         '++id, placa, modelo, marca, tipo, ano, cor, renavam, chassi, km, combustivel, status, filialId',
      manutencoes:      '++id, veiculoId, data, tipo, descricao, valor, km, fornecedor, nf',
      abastecimentos:   '++id, veiculoId, data, litros, valor, km, tipoCombustivel, posto',
      motoristas:       '++id, nome, cnh, categoria, validade, funcionarioId',
      entregas:         '++id, vendaId, clienteId, endereco, motoristaId, veiculoId, previsao, status, filialId, taxa, assinatura',
      tabelaPrecos:     '++id, produtoId, tipo, clienteId, quantidadeMin, preco, validoDe, validoAte, prioridade',
      promocoes:        '++id, descricao, tipo, valor, validoDe, validoAte, ativo, filialId',
      crmInteracoes:    '++id, clienteId, tipo, data, descricao, responsavel, status',
      crmOportunidades: '++id, clienteId, titulo, valor, data, fonte, status, responsavel, probabilidade',
      metasVendas:      '++id, vendedorId, mes, ano, metaValor, metaQtd, alcancado, comissao',
      notificacoes:     '++id, usuarioId, tipo, titulo, mensagem, lida, data, modulo, acao',
      configuracoes:    'chave',
      webhooks:         '++id, nome, url, eventos, ativo, token',
      balancas:         '++id, modelo, porta, marca, protocolo, ativo',
    })

    return this.seedIfEmpty()
  }

  async seedIfEmpty() {
    const count = await this.db.produtos.count()
    if (count > 0) return

    const produtos = [
      { codigo:'001', ean:'7891234567890', nome:'Arroz Tio João 5kg', emoji:'🍚', categoria:'Mercearia', preco:22.90, custo:15.00, estoque:80, estMin:10, estMax:200, ncm:'1006.20.10', ativo:true },
      { codigo:'002', ean:'7890123456789', nome:'Feijão Carioca 1kg', emoji:'🫘', categoria:'Mercearia', preco:8.90, custo:5.50, estoque:60, estMin:10, estMax:150, ncm:'0713.33.99', ativo:true },
      { codigo:'003', ean:'7893789012345', nome:'Leite Integral 1L', emoji:'🥛', categoria:'Laticínios', preco:5.49, custo:3.80, estoque:120, estMin:20, estMax:300, ncm:'0401.20.10', ativo:true },
      { codigo:'004', ean:'7891000100016', nome:'Café Melitta 500g', emoji:'☕', categoria:'Mercearia', preco:16.90, custo:11.00, estoque:45, estMin:8, estMax:100, ncm:'0901.21.00', ativo:true },
      { codigo:'005', ean:'7892840801008', nome:'Óleo de Soja 900ml', emoji:'🫒', categoria:'Mercearia', preco:7.99, custo:5.20, estoque:70, estMin:10, estMax:150, ncm:'1507.10.00', ativo:true },
      { codigo:'006', ean:'7890001500028', nome:'Açúcar Cristal 1kg', emoji:'🍯', categoria:'Mercearia', preco:4.99, custo:3.00, estoque:90, estMin:15, estMax:200, ncm:'1701.99.00', ativo:true },
      { codigo:'007', ean:'7896036095038', nome:'Macarrão Espaguete 500g', emoji:'🍝', categoria:'Mercearia', preco:5.49, custo:3.20, estoque:55, estMin:10, estMax:100, ncm:'1902.19.00', ativo:true },
      { codigo:'008', ean:'7891025100004', nome:'Frango Inteiro Kg', emoji:'🍗', categoria:'Açougue', preco:14.90, custo:9.80, estoque:40, estMin:5, estMax:80, ncm:'0207.12.00', ativo:true },
      { codigo:'009', ean:'7891910000197', nome:'Refrigerante Coca 2L', emoji:'🥤', categoria:'Bebidas', preco:10.90, custo:6.50, estoque:30, estMin:6, estMax:60, ncm:'2202.10.00', ativo:true },
      { codigo:'010', ean:'7896098900023', nome:'Sabonete Dove 90g', emoji:'🧼', categoria:'Higiene', preco:3.99, custo:2.20, estoque:100, estMin:20, estMax:200, ncm:'3401.11.90', ativo:true },
      { codigo:'011', ean:'7891000055005', nome:'Picanha Bovina Kg', emoji:'🥩', categoria:'Açougue', preco:59.90, custo:42.00, estoque:20, estMin:4, estMax:40, ncm:'0201.30.00', ativo:true },
      { codigo:'012', ean:'7898357412345', nome:'Cerveja Brahma 350ml', emoji:'🍺', categoria:'Bebidas', preco:3.99, custo:2.10, estoque:200, estMin:30, estMax:500, ncm:'2203.00.00', ativo:true },
      { codigo:'013', ean:'7891234567891', nome:'Detergente Ypê 500ml', emoji:'🧴', categoria:'Limpeza', preco:2.99, custo:1.50, estoque:80, estMin:10, estMax:150, ncm:'3402.20.00', ativo:true },
      { codigo:'014', ean:'7891147000511', nome:'Papel Higiênico Neve 12un', emoji:'🧻', categoria:'Higiene', preco:18.90, custo:12.00, estoque:50, estMin:8, estMax:100, ncm:'4818.10.00', ativo:true },
      { codigo:'015', ean:'7891354000807', nome:'Requeijão Catupiry 200g', emoji:'🧀', categoria:'Laticínios', preco:11.90, custo:7.50, estoque:35, estMin:6, estMax:80, ncm:'0406.30.00', ativo:true },
      { codigo:'016', ean:'7898911290004', nome:'Suco Tang Laranja 25g', emoji:'🧃', categoria:'Bebidas', preco:1.99, custo:0.80, estoque:300, estMin:50, estMax:600, ncm:'2106.90.00', ativo:true },
      { codigo:'017', ean:'7894000250121', nome:'Coca-Cola Zero 350ml', emoji:'🥤', categoria:'Bebidas', preco:4.49, custo:2.50, estoque:100, estMin:15, estMax:250, ncm:'2202.10.00', ativo:true },
      { codigo:'018', ean:'7891516423110', nome:'Biscoito Oreo 90g', emoji:'🍪', categoria:'Mercearia', preco:5.99, custo:3.50, estoque:60, estMin:10, estMax:100, ncm:'1905.31.00', ativo:true },
      { codigo:'019', ean:'7890551000100', nome:'Margarina Qualy 500g', emoji:'🧈', categoria:'Laticínios', preco:8.90, custo:5.00, estoque:40, estMin:8, estMax:80, ncm:'1517.10.00', ativo:true },
      { codigo:'020', ean:'7894321000111', nome:'Água Sanitária Q-Boa 1L', emoji:'🧪', categoria:'Limpeza', preco:3.49, custo:1.80, estoque:70, estMin:10, estMax:120, ncm:'2828.90.11', ativo:true },
    ]
    for (const p of produtos) {
      await this.db.produtos.add({ unidade: p.unidade||'UN', ...p })
    }

    await this.db.unidades.bulkAdd([
      { sigla:'UN', descricao:'Unidade' },
      { sigla:'KG', descricao:'Quilograma' },
      { sigla:'L', descricao:'Litro' },
      { sigla:'PC', descricao:'Pacote' },
      { sigla:'CX', descricao:'Caixa' },
    ])

    await this.db.categorias.bulkAdd([
      { nome:'Mercearia', descricao:'Produtos de mercearia em geral', tributacao:'SN' },
      { nome:'Laticínios', descricao:'Leite, queijos, iogurtes', tributacao:'SN' },
      { nome:'Bebidas', descricao:'Refrigerantes, sucos, cervejas', tributacao:'SN' },
      { nome:'Açougue', descricao:'Carnes bovinas, suínas, aves', tributacao:'SN' },
      { nome:'Higiene', descricao:'Sabonetes, shampoos, papel higiênico', tributacao:'SN' },
      { nome:'Limpeza', descricao:'Detergentes, água sanitária, desinfetantes', tributacao:'SN' },
      { nome:'Padaria', descricao:'Pães, bolos, salgados', tributacao:'SN' },
      { nome:'Hortifrúti', descricao:'Frutas, verduras, legumes', tributacao:'SN' },
      { nome:'Congelados', descricao:'Produtos congelados', tributacao:'SN' },
      { nome:'PET', descricao:'Produtos para animais', tributacao:'SN' },
    ])

    await this.db.fornecedores.bulkAdd([
      { cnpj:'11.111.111/0001-01', razaoSocial:'Distribuidora Alimentos Ltda', fantasia:'DAL Alimentos', prazoEntrega:3, prazoPagamento:28, score:95 },
      { cnpj:'22.222.222/0001-02', razaoSocial:'Bebidas do Brasil S.A.', fantasia:'Brasil Bebidas', prazoEntrega:2, prazoPagamento:30, score:90 },
      { cnpj:'33.333.333/0001-03', razaoSocial:'Higiene & Limpeza Comercial', fantasia:'HLC Distribuidora', prazoEntrega:5, prazoPagamento:21, score:85 },
      { cnpj:'44.444.444/0001-04', razaoSocial:'Frigorífico Boi Gordo Ltda', fantasia:'Boi Gordo', prazoEntrega:1, prazoPagamento:14, score:98 },
      { cnpj:'55.555.555/0001-05', razaoSocial:'Laticínios da Serra Ltda', fantasia:'Serra Leite', prazoEntrega:2, prazoPagamento:21, score:92 },
    ])

    await this.db.clientes.bulkAdd([
      { cpf:'000.000.000-00', nome:'Consumidor Final', telefone:'', email:'', pontos:0, totalCompras:0, segmento:'Regular' },
      { cpf:'111.111.111-11', nome:'Maria Oliveira Silva', telefone:'(11) 99999-1111', email:'maria@email.com', pontos:150, totalCompras:2500, segmento:'Premium', aniversario:'15/03' },
      { cpf:'222.222.222-22', nome:'João Pereira Santos', telefone:'(11) 99999-2222', email:'joao@email.com', pontos:80, totalCompras:1200, segmento:'Regular', aniversario:'22/07' },
      { cpf:'333.333.333-33', nome:'Ana Cristina Lima', telefone:'(11) 99999-3333', email:'ana@email.com', pontos:320, totalCompras:5800, segmento:'Premium', aniversario:'10/11' },
      { cpf:'444.444.444-44', nome:'Carlos Eduardo Souza', telefone:'(11) 99999-4444', email:'carlos@email.com', pontos:45, totalCompras:890, segmento:'Regular', aniversario:'05/09' },
    ])

    const adminHash = await hashSenha('admin')
    await this.db.usuarios.add({ login:'admin', email:'admin@nexus.com.br', senha:adminHash, perfil:'admin', setores:['dashboard','pdv','produtos','estoque','compras','clientes','financeiro','rh','frota','fiscal','relatorios','configuracoes','vendas'] })
    await this.db.funcionarios.bulkAdd([
      { nome:'Ana Beatriz Costa', cpf:'111.111.111-00', cargo:'Atendente', setor:'PDV', salarioBase:1518.00, dataAdmissao:'2023-01-15', horasExtrasMes:8, adicionalNoturno:0, insalubridade:0, periculosidade:0, valeTransporte:91.08, valeRefeicao:220, planoSaude:89.90, dependentes:1 },
      { nome:'Carlos Eduardo Lima', cpf:'222.222.222-00', cargo:'Acougueiro', setor:'Acougue', salarioBase:1980.00, dataAdmissao:'2023-03-10', horasExtrasMes:12, adicionalNoturno:0, insalubridade:198.00, periculosidade:0, valeTransporte:118.80, valeRefeicao:220, planoSaude:89.90, dependentes:0 },
      { nome:'Daniela Oliveira Santos', cpf:'333.333.333-00', cargo:'Gerente', setor:'Administrativo', salarioBase:4200.00, dataAdmissao:'2022-06-01', horasExtrasMes:0, adicionalNoturno:0, insalubridade:0, periculosidade:0, valeTransporte:0, valeRefeicao:0, planoSaude:89.90, dependentes:2 },
      { nome:'Eduardo Almeida Neto', cpf:'444.444.444-00', cargo:'Repositor', setor:'Estoque', salarioBase:1540.00, dataAdmissao:'2023-08-20', horasExtrasMes:10, adicionalNoturno:154.00, insalubridade:0, periculosidade:0, valeTransporte:92.40, valeRefeicao:220, planoSaude:89.90, dependentes:0 },
      { nome:'Fernanda Souza Rocha', cpf:'555.555.555-00', cargo:'Atendente', setor:'PDV', salarioBase:1518.00, dataAdmissao:'2024-02-01', horasExtrasMes:6, adicionalNoturno:0, insalubridade:0, periculosidade:0, valeTransporte:91.08, valeRefeicao:220, planoSaude:89.90, dependentes:1 },
    ])
    await this.db.configuracoes.put({ chave:'loja', valor: JSON.stringify({ nome:'NEXUS Market AI', cnpj:'00.000.000/0001-00', endereco:'Rua das Tecnologias, 1000', ie:'111.111.111.111', telefone:'(11) 99999-0000', email:'contato@nexus.ai', regime:'SN', cnae:'4711301', aliquotaISS:2 }) })
    await this.db.configuracoes.put({ chave:'numVenda', valor:'1' })
    await this.db.configuracoes.put({ chave:'fiscal', valor: JSON.stringify({ ambiente:'homologacao', serieNFCe:'1', certificado:'', ultimoNumeroNF:0 }) })
    await this.db.configuracoes.put({ chave:'tef', valor: JSON.stringify({ ativo:false, ip:'192.168.1.200', porta:'7777' }) })

    // criar caixa padrão
    await this.db.caixas.add({ filialId:1, numero:'01', saldoInicial:0, saldoAtual:0, status:'fechado', operadorId:1 })
    await this.db.centrosCusto.bulkAdd([
      { nome:'Administrativo', descricao:'Despesas administrativas', tipo:'despesa' },
      { nome:'Comercial', descricao:'Custos comerciais', tipo:'despesa' },
      { nome:'Operacional', descricao:'Custos operacionais', tipo:'custo' },
      { nome:'Vendas', descricao:'Receitas de vendas', tipo:'receita' },
    ])
    await this.db.planosContas.bulkAdd([
      { codigo:'1.1', nome:'Caixa', tipo:'ativo', natureza:'devedora' },
      { codigo:'2.1', nome:'Fornecedores', tipo:'passivo', natureza:'credora' },
      { codigo:'3.1', nome:'Receita de Vendas', tipo:'receita', natureza:'credora' },
      { codigo:'4.1', nome:'Custo das Mercadorias', tipo:'despesa', natureza:'devedora' },
      { codigo:'4.2', nome:'Despesas Operacionais', tipo:'despesa', natureza:'devedora' },
    ])
  }
}
