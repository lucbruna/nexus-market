-- NEXUS Market AI - Database Schema
-- PostgreSQL 15+

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- EMPRESAS
CREATE TABLE IF NOT EXISTS empresas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  razao_social VARCHAR(200) NOT NULL,
  nome_fantasia VARCHAR(200),
  inscricao_estadual VARCHAR(20),
  inscricao_municipal VARCHAR(20),
  regime_tributario VARCHAR(3) DEFAULT 'SN' CHECK (regime_tributario IN ('SN','LP','LR','MEI')),
  cep VARCHAR(9),
  endereco VARCHAR(200),
  numero VARCHAR(10),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  uf VARCHAR(2),
  telefone VARCHAR(20),
  email VARCHAR(100),
  logo VARCHAR(500),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- FILIAIS
CREATE TABLE IF NOT EXISTS filiais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  nome VARCHAR(200) NOT NULL,
  cep VARCHAR(9),
  endereco VARCHAR(200),
  numero VARCHAR(10),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  uf VARCHAR(2),
  telefone VARCHAR(20),
  email VARCHAR(100),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  filial_id UUID REFERENCES filiais(id),
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE,
  login VARCHAR(50) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  perfil VARCHAR(20) DEFAULT 'operador' CHECK (perfil IN ('admin','gerente','operador','estoquista','financeiro','consulta')),
  dois_fatores BOOLEAN DEFAULT false,
  secret_2fa VARCHAR(100),
  ultimo_acesso TIMESTAMP,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- PERMISSOES
CREATE TABLE IF NOT EXISTS permissoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id),
  modulo VARCHAR(50) NOT NULL,
  permissao VARCHAR(20) DEFAULT 'visualizar' CHECK (permissao IN ('visualizar','editar','admin','negado')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- TOKENS (para refresh tokens / API tokens)
CREATE TABLE IF NOT EXISTS tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id),
  token VARCHAR(500) NOT NULL,
  tipo VARCHAR(20) DEFAULT 'bearer',
  expira_em TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AUDITORIA LOGS
CREATE TABLE IF NOT EXISTS auditoria_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id),
  empresa_id UUID REFERENCES empresas(id),
  acao VARCHAR(50) NOT NULL,
  modulo VARCHAR(50) NOT NULL,
  entidade VARCHAR(50),
  entidade_id UUID,
  dados_anteriores JSONB,
  dados_novos JSONB,
  ip VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- FUNCIONARIOS
CREATE TABLE IF NOT EXISTS funcionarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  filial_id UUID REFERENCES filiais(id),
  nome VARCHAR(150) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  rg VARCHAR(20),
  pis_pasep VARCHAR(15),
  cargo VARCHAR(100),
  departamento_id UUID,
  salario_base DECIMAL(12,2) DEFAULT 0,
  data_admissao DATE,
  data_demissao DATE,
  tipo_contrato VARCHAR(20) DEFAULT 'clt',
  cep VARCHAR(9),
  endereco VARCHAR(200),
  telefone VARCHAR(20),
  email VARCHAR(100),
  banco VARCHAR(50),
  agencia VARCHAR(10),
  conta VARCHAR(20),
  pix VARCHAR(100),
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo','inativo','ferias','afastado')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- CARGOS
CREATE TABLE IF NOT EXISTS cargos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  nome VARCHAR(100) NOT NULL,
  salario_base DECIMAL(12,2) DEFAULT 0,
  comissao DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- DEPARTAMENTOS
CREATE TABLE IF NOT EXISTS departamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  nome VARCHAR(100) NOT NULL,
  centro_custo VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ESCALAS / ESCALA DE TRABALHO
CREATE TABLE IF NOT EXISTS escalas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  funcionario_id UUID REFERENCES funcionarios(id),
  dia_semana SMALLINT CHECK (dia_semana BETWEEN 0 AND 6),
  entrada TIME NOT NULL,
  saida TIME NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- FERIAS
CREATE TABLE IF NOT EXISTS ferias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  funcionario_id UUID REFERENCES funcionarios(id),
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  dias INT NOT NULL,
  periodo_aquisitivo VARCHAR(20),
  status VARCHAR(20) DEFAULT 'agendado',
  created_at TIMESTAMP DEFAULT NOW()
);

-- FOLHA PAGAMENTO
CREATE TABLE IF NOT EXISTS folha_pagamento (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  funcionario_id UUID REFERENCES funcionarios(id),
  mes INT NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano INT NOT NULL,
  salario_base DECIMAL(12,2) NOT NULL,
  horas_extras DECIMAL(12,2) DEFAULT 0,
  adicionais DECIMAL(12,2) DEFAULT 0,
  comissao DECIMAL(12,2) DEFAULT 0,
  inss DECIMAL(12,2) DEFAULT 0,
  irrf DECIMAL(12,2) DEFAULT 0,
  fgts DECIMAL(12,2) DEFAULT 0,
  outros_descontos DECIMAL(12,2) DEFAULT 0,
  vale_transporte DECIMAL(12,2) DEFAULT 0,
  vale_refeicao DECIMAL(12,2) DEFAULT 0,
  total_descontos DECIMAL(12,2) DEFAULT 0,
  liquido DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'calculado',
  pago_em TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- BENEFICIOS
CREATE TABLE IF NOT EXISTS beneficios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  funcionario_id UUID REFERENCES funcionarios(id),
  tipo VARCHAR(50) NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PONTO BIOMETRICO
CREATE TABLE IF NOT EXISTS ponto_biometrico (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  funcionario_id UUID REFERENCES funcionarios(id),
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  hora TIME NOT NULL,
  tipo VARCHAR(20) CHECK (tipo IN ('entrada','saida_almoco','retorno_almoco','saida')),
  origem VARCHAR(20) DEFAULT 'biometria',
  created_at TIMESTAMP DEFAULT NOW()
);

-- BATIDAS (consolidadas)
CREATE TABLE IF NOT EXISTS batidas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  funcionario_id UUID REFERENCES funcionarios(id),
  data DATE NOT NULL,
  entrada TIME,
  saida_almoco TIME,
  retorno TIME,
  saida TIME,
  horas_trabalhadas DECIMAL(5,2) DEFAULT 0,
  horas_extras DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(funcionario_id, data)
);

-- CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  filial_id UUID REFERENCES filiais(id),
  cpf_cnpj VARCHAR(18) UNIQUE,
  nome VARCHAR(200) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(100),
  data_nascimento DATE,
  sexo VARCHAR(10),
  cep VARCHAR(9),
  endereco VARCHAR(200),
  numero VARCHAR(10),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  uf VARCHAR(2),
  limite_credito DECIMAL(12,2) DEFAULT 0,
  pontos INT DEFAULT 0,
  total_compras DECIMAL(14,2) DEFAULT 0,
  data_ultima_compra TIMESTAMP,
  segmento VARCHAR(20) DEFAULT 'regular' CHECK (segmento IN ('regular','vip','atacado','funcionario')),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- ENDERECOS CLIENTES
CREATE TABLE IF NOT EXISTS enderecos_clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID REFERENCES clientes(id),
  tipo VARCHAR(20) DEFAULT 'entrega' CHECK (tipo IN ('cobranca','entrega','residencial')),
  logradouro VARCHAR(200) NOT NULL,
  numero VARCHAR(10),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  uf VARCHAR(2),
  cep VARCHAR(9),
  created_at TIMESTAMP DEFAULT NOW()
);

-- HISTORICO CLIENTES
CREATE TABLE IF NOT EXISTS historico_clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID REFERENCES clientes(id),
  tipo VARCHAR(50),
  descricao TEXT,
  referencia_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- FIDELIDADE
CREATE TABLE IF NOT EXISTS fidelidade (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID REFERENCES clientes(id),
  pontos INT NOT NULL DEFAULT 0,
  tipo VARCHAR(20) CHECK (tipo IN ('ganho','resgate','ajuste')),
  descricao VARCHAR(200),
  referencia_id UUID,
  expira_em TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- FORNECEDORES
CREATE TABLE IF NOT EXISTS fornecedores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  cnpj_cpf VARCHAR(18) UNIQUE NOT NULL,
  razao_social VARCHAR(200) NOT NULL,
  nome_fantasia VARCHAR(200),
  inscricao_estadual VARCHAR(20),
  telefone VARCHAR(20),
  whatsapp VARCHAR(20),
  email VARCHAR(100),
  website VARCHAR(200),
  contato_principal VARCHAR(100),
  cep VARCHAR(9),
  endereco VARCHAR(200),
  cidade VARCHAR(100),
  uf VARCHAR(2),
  prazo_pagamento INT DEFAULT 30,
  banco VARCHAR(50),
  dados_bancarios VARCHAR(200),
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- CONTATOS FORNECEDORES
CREATE TABLE IF NOT EXISTS contatos_fornecedores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fornecedor_id UUID REFERENCES fornecedores(id),
  nome VARCHAR(100),
  cargo VARCHAR(50),
  telefone VARCHAR(20),
  email VARCHAR(100),
  principal BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PRODUTOS
CREATE TABLE IF NOT EXISTS produtos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  codigo VARCHAR(50),
  ean VARCHAR(14) UNIQUE,
  nome VARCHAR(200) NOT NULL,
  categoria_id UUID,
  subcategoria_id UUID,
  marca_id UUID,
  unidade VARCHAR(5) DEFAULT 'UN',
  descricao TEXT,
  peso_bruto DECIMAL(10,3) DEFAULT 0,
  peso_liquido DECIMAL(10,3) DEFAULT 0,
  ncm VARCHAR(8),
  cst VARCHAR(4) DEFAULT '102',
  cfop VARCHAR(4) DEFAULT '5102',
  icms DECIMAL(5,2) DEFAULT 0,
  pis DECIMAL(5,2) DEFAULT 0.65,
  cofins DECIMAL(5,2) DEFAULT 3.00,
  custo_medio DECIMAL(12,2) DEFAULT 0,
  preco_venda DECIMAL(12,2) NOT NULL DEFAULT 0,
  preco_atacado DECIMAL(12,2) DEFAULT 0,
  qtd_atacado INT DEFAULT 6,
  preco_promocional DECIMAL(12,2) DEFAULT 0,
  promocao_ate DATE,
  markup DECIMAL(5,2) DEFAULT 30,
  estoque DECIMAL(10,2) DEFAULT 0,
  est_min DECIMAL(10,2) DEFAULT 5,
  est_max DECIMAL(10,2) DEFAULT 100,
  localizacao VARCHAR(20),
  emoji VARCHAR(2),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- CATEGORIAS
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  cst_padrao VARCHAR(4) DEFAULT '102',
  cfop_padrao VARCHAR(4) DEFAULT '5102',
  icms_padrao DECIMAL(5,2) DEFAULT 0,
  pis_padrao DECIMAL(5,2) DEFAULT 0.65,
  cofins_padrao DECIMAL(5,2) DEFAULT 3.00,
  ncm_padrao VARCHAR(8),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- SUBCATEGORIAS
CREATE TABLE IF NOT EXISTS subcategorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  categoria_id UUID REFERENCES categorias(id),
  nome VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- MARCAS
CREATE TABLE IF NOT EXISTS marcas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  fornecedor_id UUID REFERENCES fornecedores(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- UNIDADES
CREATE TABLE IF NOT EXISTS unidades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sigla VARCHAR(5) NOT NULL UNIQUE,
  descricao VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ESTOQUE (por filial)
CREATE TABLE IF NOT EXISTS estoque (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  produto_id UUID REFERENCES produtos(id),
  filial_id UUID REFERENCES filiais(id),
  qtd DECIMAL(10,2) DEFAULT 0,
  reservado DECIMAL(10,2) DEFAULT 0,
  localizacao VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(produto_id, filial_id)
);

-- MOVIMENTACOES ESTOQUE
CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  produto_id UUID REFERENCES produtos(id),
  filial_id UUID REFERENCES filiais(id),
  tipo VARCHAR(10) CHECK (tipo IN ('entrada','saida','ajuste','transferencia')),
  qtd DECIMAL(10,2) NOT NULL,
  saldo_anterior DECIMAL(10,2),
  saldo_posterior DECIMAL(10,2),
  documento VARCHAR(50),
  documento_id UUID,
  responsavel VARCHAR(100),
  motivo TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- INVENTARIOS
CREATE TABLE IF NOT EXISTS inventarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filial_id UUID REFERENCES filiais(id),
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'aberto' CHECK (status IN ('aberto','contagem','conferencia','fechado')),
  responsavel VARCHAR(100),
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- LOTES
CREATE TABLE IF NOT EXISTS lotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  produto_id UUID REFERENCES produtos(id),
  filial_id UUID REFERENCES filiais(id),
  lote VARCHAR(50) NOT NULL,
  qtd DECIMAL(10,2) DEFAULT 0,
  fabricacao DATE,
  vencimento DATE NOT NULL,
  localizacao VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- SOLICITACOES COMPRA
CREATE TABLE IF NOT EXISTS solicitacoes_compra (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filial_id UUID REFERENCES filiais(id),
  numero VARCHAR(20) UNIQUE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho','aprovado','cotacao','encerrado','cancelado')),
  solicitante VARCHAR(100),
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- COTACOES
CREATE TABLE IF NOT EXISTS cotacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitacao_id UUID REFERENCES solicitacoes_compra(id),
  fornecedor_id UUID REFERENCES fornecedores(id),
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  valor_total DECIMAL(14,2) DEFAULT 0,
  prazo_entrega INT,
  condicoes_pagamento VARCHAR(100),
  selecionada BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PEDIDOS COMPRA
CREATE TABLE IF NOT EXISTS pedidos_compra (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  filial_id UUID REFERENCES filiais(id),
  fornecedor_id UUID REFERENCES fornecedores(id),
  numero VARCHAR(20) UNIQUE,
  data_emissao DATE NOT NULL DEFAULT CURRENT_DATE,
  data_entrega DATE,
  status VARCHAR(20) DEFAULT 'aberto' CHECK (status IN ('aberto','enviado','parcial','recebido','cancelado')),
  valor_total DECIMAL(14,2) DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ITENS PEDIDO COMPRA
CREATE TABLE IF NOT EXISTS itens_pedido_compra (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id UUID REFERENCES pedidos_compra(id),
  produto_id UUID REFERENCES produtos(id),
  qtd DECIMAL(10,2) NOT NULL,
  custo_unitario DECIMAL(12,2) NOT NULL,
  total DECIMAL(14,2) NOT NULL,
  qtd_recebida DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RECEBIMENTOS
CREATE TABLE IF NOT EXISTS recebimentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id UUID REFERENCES pedidos_compra(id),
  filial_id UUID REFERENCES filiais(id),
  data_recebimento DATE NOT NULL DEFAULT CURRENT_DATE,
  nf_fornecedor VARCHAR(50),
  serie_nf VARCHAR(10),
  chave_acesso VARCHAR(44),
  valor_nota DECIMAL(14,2),
  responsavel VARCHAR(100),
  observacoes TEXT,
  status VARCHAR(20) DEFAULT 'conferencia' CHECK (status IN ('conferencia','conferido','divergente')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ORCAMENTOS
CREATE TABLE IF NOT EXISTS orcamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  filial_id UUID REFERENCES filiais(id),
  cliente_id UUID REFERENCES clientes(id),
  numero VARCHAR(20) UNIQUE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  valido_ate DATE,
  status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho','aprovado','convertido','cancelado','expirado')),
  valor_total DECIMAL(14,2) DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PEDIDOS VENDA
CREATE TABLE IF NOT EXISTS pedidos_venda (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  filial_id UUID REFERENCES filiais(id),
  cliente_id UUID REFERENCES clientes(id),
  numero VARCHAR(20) UNIQUE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho','confirmado','faturado','entregue','cancelado')),
  valor_total DECIMAL(14,2) DEFAULT 0,
  desconto DECIMAL(12,2) DEFAULT 0,
  forma_pagamento VARCHAR(30),
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ITENS VENDA
CREATE TABLE IF NOT EXISTS itens_venda (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id UUID REFERENCES pedidos_venda(id),
  produto_id UUID REFERENCES produtos(id),
  nome VARCHAR(200) NOT NULL,
  qtd DECIMAL(10,2) NOT NULL,
  preco_unitario DECIMAL(12,2) NOT NULL,
  total DECIMAL(14,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PDV / CAIXAS
CREATE TABLE IF NOT EXISTS caixas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filial_id UUID REFERENCES filiais(id),
  numero INT NOT NULL,
  nome VARCHAR(50),
  saldo_inicial DECIMAL(12,2) DEFAULT 0,
  saldo_atual DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'fechado' CHECK (status IN ('aberto','fechado','bloqueado')),
  operador_id UUID REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ABERTURAS CAIXA
CREATE TABLE IF NOT EXISTS aberturas_caixa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  caixa_id UUID REFERENCES caixas(id),
  data_abertura TIMESTAMP NOT NULL DEFAULT NOW(),
  valor_inicial DECIMAL(12,2) NOT NULL,
  observacao TEXT,
  operador_id UUID REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- FECHAMENTOS CAIXA
CREATE TABLE IF NOT EXISTS fechamentos_caixa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  caixa_id UUID REFERENCES caixas(id),
  data_fechamento TIMESTAMP NOT NULL DEFAULT NOW(),
  valor_final DECIMAL(12,2) NOT NULL,
  diferenca DECIMAL(12,2) DEFAULT 0,
  observacao TEXT,
  operador_id UUID REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- VENDAS PDV
CREATE TABLE IF NOT EXISTS vendas_pdv (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  caixa_id UUID REFERENCES caixas(id),
  empresa_id UUID REFERENCES empresas(id),
  filial_id UUID REFERENCES filiais(id),
  cliente_id UUID REFERENCES clientes(id),
  cliente_nome VARCHAR(200) DEFAULT 'Consumidor Final',
  data TIMESTAMP NOT NULL DEFAULT NOW(),
  subtotal DECIMAL(14,2) DEFAULT 0,
  desconto DECIMAL(12,2) DEFAULT 0,
  desconto_tipo VARCHAR(5) DEFAULT 'pct' CHECK (desconto_tipo IN ('pct','val')),
  total DECIMAL(14,2) NOT NULL,
  forma_pagamento VARCHAR(30) NOT NULL,
  valor_recebido DECIMAL(14,2) DEFAULT 0,
  troco DECIMAL(14,2) DEFAULT 0,
  num INT NOT NULL,
  observacao TEXT,
  nfce_chave VARCHAR(44),
  cancelada BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ITENS PDV
CREATE TABLE IF NOT EXISTS itens_pdv (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venda_id UUID REFERENCES vendas_pdv(id),
  produto_id UUID REFERENCES produtos(id),
  nome VARCHAR(200) NOT NULL,
  qtd DECIMAL(10,2) NOT NULL,
  preco DECIMAL(12,2) NOT NULL,
  total DECIMAL(14,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- SANGRIA / SUPRIMENTO
CREATE TABLE IF NOT EXISTS movimentos_caixa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  caixa_id UUID REFERENCES caixas(id),
  tipo VARCHAR(10) CHECK (tipo IN ('entrada','saida')),
  descricao VARCHAR(200) NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  forma_pagamento VARCHAR(30),
  created_at TIMESTAMP DEFAULT NOW()
);

-- CONTAS PAGAR
CREATE TABLE IF NOT EXISTS contas_pagar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  filial_id UUID REFERENCES filiais(id),
  fornecedor_id UUID REFERENCES fornecedores(id),
  descricao VARCHAR(200) NOT NULL,
  categoria VARCHAR(50),
  valor DECIMAL(14,2) NOT NULL,
  valor_pago DECIMAL(14,2) DEFAULT 0,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  parcela INT DEFAULT 1,
  total_parcelas INT DEFAULT 1,
  forma_pagamento VARCHAR(30),
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente','pago','vencido','cancelado')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CONTAS RECEBER
CREATE TABLE IF NOT EXISTS contas_receber (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  filial_id UUID REFERENCES filiais(id),
  cliente_id UUID REFERENCES clientes(id),
  descricao VARCHAR(200) NOT NULL,
  valor DECIMAL(14,2) NOT NULL,
  valor_recebido DECIMAL(14,2) DEFAULT 0,
  data_vencimento DATE NOT NULL,
  data_recebimento DATE,
  parcela INT DEFAULT 1,
  total_parcelas INT DEFAULT 1,
  forma_pagamento VARCHAR(30),
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente','recebido','vencido','cancelado')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- FLUXO CAIXA
CREATE TABLE IF NOT EXISTS fluxo_caixa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  filial_id UUID REFERENCES filiais(id),
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo VARCHAR(10) CHECK (tipo IN ('entrada','saida')),
  descricao VARCHAR(200) NOT NULL,
  valor DECIMAL(14,2) NOT NULL,
  categoria VARCHAR(50),
  saldo_anterior DECIMAL(14,2),
  saldo_posterior DECIMAL(14,2),
  referencia_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- CONCILIACOES
CREATE TABLE IF NOT EXISTS conciliacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  saldo_extrato DECIMAL(14,2),
  saldo_sistema DECIMAL(14,2),
  diferenca DECIMAL(14,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente','conciliado','divergente')),
  responsavel VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- NOTAS FISCAIS
CREATE TABLE IF NOT EXISTS notas_fiscais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  tipo VARCHAR(5) CHECK (tipo IN ('NF-e','NFC-e','NFSe','SAT')),
  modelo VARCHAR(10),
  serie VARCHAR(5) NOT NULL,
  numero INT NOT NULL,
  chave_acesso VARCHAR(44) UNIQUE,
  cliente_id UUID REFERENCES clientes(id),
  cliente_nome VARCHAR(200),
  cliente_cpf_cnpj VARCHAR(18),
  valor_total DECIMAL(14,2) NOT NULL,
  valor_produtos DECIMAL(14,2) DEFAULT 0,
  valor_desconto DECIMAL(12,2) DEFAULT 0,
  base_calculo_icms DECIMAL(14,2) DEFAULT 0,
  valor_icms DECIMAL(12,2) DEFAULT 0,
  valor_pis DECIMAL(12,2) DEFAULT 0,
  valor_cofins DECIMAL(12,2) DEFAULT 0,
  xml TEXT,
  protocolo VARCHAR(50),
  status VARCHAR(20) DEFAULT 'digitada' CHECK (status IN ('digitada','autorizada','denegada','cancelada','inutilizada')),
  data_emissao TIMESTAMP NOT NULL DEFAULT NOW(),
  data_autorizacao TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- EVENTOS FISCAIS
CREATE TABLE IF NOT EXISTS eventos_fiscais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nota_id UUID REFERENCES notas_fiscais(id),
  evento VARCHAR(50) NOT NULL,
  protocolo VARCHAR(50),
  xml TEXT,
  data_evento TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- VEICULOS
CREATE TABLE IF NOT EXISTS veiculos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  filial_id UUID REFERENCES filiais(id),
  placa VARCHAR(8) UNIQUE NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  marca VARCHAR(50),
  tipo VARCHAR(30) DEFAULT 'carro',
  cor VARCHAR(30),
  ano INT,
  km_atual INT DEFAULT 0,
  km_revisao INT DEFAULT 0,
  combustivel VARCHAR(20) DEFAULT 'flex',
  renavam VARCHAR(15),
  chassi VARCHAR(20),
  seguro_validade DATE,
  ipva_validade DATE,
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo','manutencao','inativo','vendido')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- MANUTENCOES
CREATE TABLE IF NOT EXISTS manutencoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  veiculo_id UUID REFERENCES veiculos(id),
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo VARCHAR(50) DEFAULT 'preventiva',
  descricao TEXT NOT NULL,
  valor DECIMAL(12,2) DEFAULT 0,
  km INT,
  oficina VARCHAR(100),
  status VARCHAR(20) DEFAULT 'agendado' CHECK (status IN ('agendado','executado','cancelado')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ABASTECIMENTOS
CREATE TABLE IF NOT EXISTS abastecimentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  veiculo_id UUID REFERENCES veiculos(id),
  data TIMESTAMP NOT NULL DEFAULT NOW(),
  litros DECIMAL(8,2) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  km INT,
  tipo_combustivel VARCHAR(20),
  posto VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- MOTORISTAS
CREATE TABLE IF NOT EXISTS motoristas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  funcionario_id UUID REFERENCES funcionarios(id),
  nome VARCHAR(150) NOT NULL,
  cnh VARCHAR(15) UNIQUE NOT NULL,
  categoria_cnh VARCHAR(5) DEFAULT 'B',
  validade_cnh DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- CONVENIOS
CREATE TABLE IF NOT EXISTS convenios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  nome VARCHAR(100) NOT NULL,
  cnpj VARCHAR(18),
  desconto_padrao DECIMAL(5,2) DEFAULT 0,
  prazo_pagamento INT DEFAULT 30,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- LIMITES CONVENIO
CREATE TABLE IF NOT EXISTS limites_convenio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  convenio_id UUID REFERENCES convenios(id),
  cliente_id UUID REFERENCES clientes(id),
  limite DECIMAL(12,2) NOT NULL DEFAULT 0,
  saldo_utilizado DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo','bloqueado','cancelado')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- CONSUMOS CONVENIO
CREATE TABLE IF NOT EXISTS consumos_convenio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  limite_id UUID REFERENCES limites_convenio(id),
  venda_id UUID REFERENCES vendas_pdv(id),
  valor DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- CONFIGURACOES EMPRESA
CREATE TABLE IF NOT EXISTS configuracoes_empresa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  chave VARCHAR(50) NOT NULL,
  valor TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(empresa_id, chave)
);

-- NOTIFICACOES
CREATE TABLE IF NOT EXISTS notificacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  usuario_id UUID REFERENCES usuarios(id),
  titulo VARCHAR(200) NOT NULL,
  mensagem TEXT,
  tipo VARCHAR(20) DEFAULT 'info' CHECK (tipo IN ('info','sucesso','alerta','erro')),
  lida BOOLEAN DEFAULT false,
  link VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- INDICES
CREATE INDEX idx_produtos_ean ON produtos(ean);
CREATE INDEX idx_produtos_nome ON produtos(nome);
CREATE INDEX idx_vendas_pdv_data ON vendas_pdv(data);
CREATE INDEX idx_vendas_pdv_caixa ON vendas_pdv(caixa_id);
CREATE INDEX idx_movimentacoes_estoque_produto ON movimentacoes_estoque(produto_id);
CREATE INDEX idx_movimentacoes_estoque_data ON movimentacoes_estoque(created_at);
CREATE INDEX idx_notas_fiscais_chave ON notas_fiscais(chave_acesso);
CREATE INDEX idx_auditoria_logs_modulo ON auditoria_logs(modulo);
CREATE INDEX idx_auditoria_logs_data ON auditoria_logs(created_at);
CREATE INDEX idx_lotes_vencimento ON lotes(vencimento);
CREATE INDEX idx_contas_pagar_vencimento ON contas_pagar(data_vencimento);
CREATE INDEX idx_contas_receber_vencimento ON contas_receber(data_vencimento);
CREATE INDEX idx_funcionarios_cpf ON funcionarios(cpf);

-- FUNCAO ATUALIZACAO TIMESTAMP
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS
CREATE TRIGGER trg_update_empresas BEFORE UPDATE ON empresas FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_update_filiais BEFORE UPDATE ON filiais FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_update_usuarios BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_update_produtos BEFORE UPDATE ON produtos FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_update_clientes BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_update_fornecedores BEFORE UPDATE ON fornecedores FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_update_funcionarios BEFORE UPDATE ON funcionarios FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_update_caixas BEFORE UPDATE ON caixas FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_update_estoque BEFORE UPDATE ON estoque FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_update_configuracoes BEFORE UPDATE ON configuracoes_empresa FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- VIEW: Dashboard Financeiro Resumido
CREATE OR REPLACE VIEW vw_dashboard_financeiro AS
SELECT
  COALESCE((SELECT SUM(total) FROM vendas_pdv WHERE data >= CURRENT_DATE AND cancelada = false), 0) AS vendas_hoje,
  COALESCE((SELECT COUNT(*) FROM vendas_pdv WHERE data >= CURRENT_DATE AND cancelada = false), 0) AS qtd_vendas_hoje,
  COALESCE((SELECT SUM(valor) FROM contas_pagar WHERE status = 'pendente'), 0) AS total_a_pagar,
  COALESCE((SELECT SUM(valor) FROM contas_receber WHERE status = 'pendente'), 0) AS total_a_receber,
  COALESCE((SELECT SUM(valor) FROM fluxo_caixa WHERE data = CURRENT_DATE AND tipo = 'entrada'), 0) AS entradas_hoje,
  COALESCE((SELECT SUM(valor) FROM fluxo_caixa WHERE data = CURRENT_DATE AND tipo = 'saida'), 0) AS saidas_hoje;

-- VIEW: Alertas Estoque
CREATE OR REPLACE VIEW vw_alertas_estoque AS
SELECT p.id, p.nome, p.estoque, p.est_min, p.localizacao, p.ean
FROM produtos p WHERE p.ativo = true AND p.estoque <= p.est_min
ORDER BY p.estoque ASC;

-- VIEW: Produtos Proximo Vencimento
CREATE OR REPLACE VIEW vw_proximos_vencimentos AS
SELECT l.*, p.nome AS produto_nome,
  EXTRACT(DAY FROM (l.vencimento - CURRENT_DATE)) AS dias_restantes
FROM lotes l JOIN produtos p ON p.id = l.produto_id
WHERE l.vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
ORDER BY l.vencimento ASC;

-- PROCEDURE: Fechamento de Caixa
CREATE OR REPLACE PROCEDURE sp_fechar_caixa(p_caixa_id UUID, p_operador_id UUID)
LANGUAGE plpgsql AS $$
DECLARE
  v_saldo_atual DECIMAL(12,2);
  v_total_vendas DECIMAL(14,2);
  v_total_sangrias DECIMAL(14,2);
  v_total_suprimentos DECIMAL(14,2);
BEGIN
  SELECT saldo_atual INTO v_saldo_atual FROM caixas WHERE id = p_caixa_id;
  SELECT COALESCE(SUM(total), 0) INTO v_total_vendas FROM vendas_pdv WHERE caixa_id = p_caixa_id AND cancelada = false;
  SELECT COALESCE(SUM(valor), 0) INTO v_total_saidas FROM movimentos_caixa WHERE caixa_id = p_caixa_id AND tipo = 'saida';
  SELECT COALESCE(SUM(valor), 0) INTO v_total_entradas FROM movimentos_caixa WHERE caixa_id = p_caixa_id AND tipo = 'entrada';

  INSERT INTO fechamentos_caixa (caixa_id, valor_final, diferenca, operador_id)
  VALUES (p_caixa_id, v_saldo_atual, v_saldo_atual - (v_total_suprimentos - v_total_sangrias), p_operador_id);

  UPDATE caixas SET status = 'fechado', saldo_atual = 0, updated_at = NOW() WHERE id = p_caixa_id;
END;
$$;
