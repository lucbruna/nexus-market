-- Empresa Padrão
INSERT INTO empresas (id, cnpj, razao_social, nome_fantasia, regime_tributario, cidade, uf, ativo)
VALUES (uuid_generate_v4(), '00.000.000/0001-00', 'NEXUS Market AI Ltda', 'NEXUS Market', 'SN', 'São Paulo', 'SP', true);

-- Filial Matriz
INSERT INTO filiais (empresa_id, cnpj, nome, cidade, uf, ativo)
SELECT id, '00.000.000/0001-00', 'Matriz', 'São Paulo', 'SP', true FROM empresas LIMIT 1;

-- Usuário Admin
INSERT INTO usuarios (empresa_id, filial_id, nome, email, login, senha, perfil, ativo)
SELECT e.id, f.id, 'Administrador', 'admin@nexusmarket.ai', 'admin', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfAjkMBcGmFxvHmSrF3JIzbKROyK', 'admin', true
FROM empresas e CROSS JOIN filiais f LIMIT 1;
-- Senha: admin123

-- Categorias Padrão
INSERT INTO categorias (empresa_id, nome) SELECT id, nome FROM empresas CROSS JOIN (
  VALUES ('Hortifrúti'), ('Açougue / Carnes'), ('Padaria / Confeitaria'), ('Laticínios'),
  ('Bebidas'), ('Mercearia'), ('Higiene Pessoal'), ('Limpeza'), ('Congelados'), ('Pets'), ('Bazar')
) AS cat(nome);

-- Cliente Padrão
INSERT INTO clientes (empresa_id, cpf_cnpj, nome, segmento)
SELECT id, '000.000.000-00', 'Consumidor Final', 'regular' FROM empresas LIMIT 1;

-- Unidades
INSERT INTO unidades (sigla, descricao) VALUES
('UN', 'Unidade'), ('KG', 'Quilograma'), ('GR', 'Grama'), ('LT', 'Litro'),
('ML', 'Mililitro'), ('MT', 'Metro'), ('CX', 'Caixa'), ('PC', 'Peça'), ('DZ', 'Dúzia');
