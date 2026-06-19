CREATE OR REPLACE VIEW vw_curva_abc AS
WITH vendas_produto AS (
  SELECT
    p.id AS produto_id,
    p.nome AS produto_nome,
    SUM(i.total) AS valor_total,
    SUM(i.qtd) AS qtd_total,
    COUNT(DISTINCT v.id) AS qtd_vendas
  FROM itens_pdv i
  JOIN vendas_pdv v ON v.id = i.venda_id AND v.cancelada = false
  JOIN produtos p ON p.id = i.produto_id
  GROUP BY p.id, p.nome
),
total_geral AS (
  SELECT SUM(valor_total) AS total FROM vendas_produto
)
SELECT
  vp.*,
  (vp.valor_total / tg.total * 100) AS participacao_pct,
  SUM(vp.valor_total / tg.total * 100) OVER (ORDER BY vp.valor_total DESC) AS acumulado_pct,
  CASE
    WHEN SUM(vp.valor_total / tg.total * 100) OVER (ORDER BY vp.valor_total DESC) <= 70 THEN 'A'
    WHEN SUM(vp.valor_total / tg.total * 100) OVER (ORDER BY vp.valor_total DESC) <= 90 THEN 'B'
    ELSE 'C'
  END AS classe
FROM vendas_produto vp, total_geral tg
ORDER BY vp.valor_total DESC;
