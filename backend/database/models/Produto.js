module.exports = (sequelize, DataTypes) => {
  const Produto = sequelize.define('Produto', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    empresaId: { type: DataTypes.UUID, allowNull: false },
    codigo: { type: DataTypes.STRING(50), allowNull: false },
    codigoBarras: DataTypes.STRING(20),
    nome: { type: DataTypes.STRING(200), allowNull: false },
    descricao: DataTypes.TEXT,
    ncm: DataTypes.STRING(10),
    cest: DataTypes.STRING(7),
    cfop: DataTypes.STRING(4),
    unidade: { type: DataTypes.STRING(10), defaultValue: 'UN' },
    precoCusto: { type: DataTypes.DECIMAL(15, 4), defaultValue: 0 },
    precoVenda: { type: DataTypes.DECIMAL(15, 4), defaultValue: 0 },
    precoAtacado: { type: DataTypes.DECIMAL(15, 4), defaultValue: 0 },
    quantidadeMinimaAtacado: { type: DataTypes.INTEGER, defaultValue: 1 },
    estoqueAtual: { type: DataTypes.DECIMAL(15, 4), defaultValue: 0 },
    estoqueMinimo: { type: DataTypes.DECIMAL(15, 4), defaultValue: 0 },
    estoqueMaximo: { type: DataTypes.DECIMAL(15, 4), defaultValue: 0 },
    controlaEstoque: { type: DataTypes.BOOLEAN, defaultValue: true },
    controlaValidade: { type: DataTypes.BOOLEAN, defaultValue: false },
    permiteFracionado: { type: DataTypes.BOOLEAN, defaultValue: false },
    origem: { type: DataTypes.ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8'), defaultValue: '0' },
    icmsCst: DataTypes.STRING(3),
    icmsAliquota: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
    icmsReducao: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
    pisCst: DataTypes.STRING(2),
    pisAliquota: { type: DataTypes.DECIMAL(5, 4), defaultValue: 0 },
    cofinsCst: DataTypes.STRING(2),
    cofinsAliquota: { type: DataTypes.DECIMAL(5, 4), defaultValue: 0 },
    ipiCst: DataTypes.STRING(2),
    ipiAliquota: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
    categoriaId: DataTypes.UUID,
    marcaId: DataTypes.UUID,
    fornecedorId: DataTypes.UUID,
    localizacao: DataTypes.STRING(50),
    pesoLiquido: { type: DataTypes.DECIMAL(10, 3), defaultValue: 0 },
    pesoBruto: { type: DataTypes.DECIMAL(10, 3), defaultValue: 0 },
    imagem: DataTypes.STRING(500),
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { 
    paranoid: true, 
    tableName: 'produtos',
    indexes: [
      { fields: ['empresaId', 'codigo'], unique: true },
      { fields: ['empresaId', 'codigoBarras'] },
      { fields: ['empresaId', 'nome'] },
      { fields: ['ativo'] },
    ]
  })

  Produto.associate = (models) => {
    if (models.Empresa) Produto.belongsTo(models.Empresa, { foreignKey: 'empresaId', as: 'empresa' })
    if (models.Categoria) Produto.belongsTo(models.Categoria, { foreignKey: 'categoriaId', as: 'categoria' })
    if (models.Marca) Produto.belongsTo(models.Marca, { foreignKey: 'marcaId', as: 'marca' })
    if (models.Fornecedor) Produto.belongsTo(models.Fornecedor, { foreignKey: 'fornecedorId', as: 'fornecedor' })
  }

  return Produto
}
