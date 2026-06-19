CREATE OR REPLACE VIEW vw_vendas_por_periodo AS
SELECT
  DATE(data) AS data,
  COUNT(*) AS qtd_vendas,
  SUM(total) AS valor_total,
  SUM(desconto) AS total_desconto,
  AVG(total) AS ticket_medio,
  COUNT(DISTINCT cliente_id) AS clientes_atendidos
FROM vendas_pdv
WHERE cancelada = false
GROUP BY DATE(data)
ORDER BY DATE(data) DESC;
