CREATE OR REPLACE VIEW vw_dashboard_completo AS
SELECT
  (SELECT COUNT(*) FROM produtos WHERE ativo = true) AS total_produtos,
  (SELECT COUNT(*) FROM clientes WHERE ativo = true) AS total_clientes,
  (SELECT COUNT(*) FROM funcionarios WHERE status = 'ativo') AS total_funcionarios,
  (SELECT COUNT(*) FROM vendas_pdv WHERE data >= CURRENT_DATE AND cancelada = false) AS qtd_vendas_hoje,
  (SELECT COALESCE(SUM(total), 0) FROM vendas_pdv WHERE data >= CURRENT_DATE AND cancelada = false) AS valor_vendas_hoje,
  (SELECT COUNT(*) FROM produtos WHERE ativo = true AND estoque <= est_min) AS estoque_baixo,
  (SELECT COUNT(*) FROM lotes WHERE vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days') AS validade_proxima,
  (SELECT COALESCE(SUM(valor), 0) FROM contas_pagar WHERE status = 'pendente') AS total_a_pagar,
  (SELECT COALESCE(SUM(valor), 0) FROM contas_receber WHERE status = 'pendente') AS total_a_receber;
