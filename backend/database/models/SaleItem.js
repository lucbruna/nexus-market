module.exports = (sequelize, DataTypes) => {
  const SaleItem = sequelize.define('SaleItem', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    saleId: { type: DataTypes.UUID, allowNull: false },
    produtoId: { type: DataTypes.UUID, allowNull: false },
    quantidade: { type: DataTypes.DECIMAL(15, 4), allowNull: false },
    precoUnitario: { type: DataTypes.DECIMAL(15, 4), allowNull: false },
    precoTotal: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    desconto: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    custoUnitario: { type: DataTypes.DECIMAL(15, 4), defaultValue: 0 },
    ncm: DataTypes.STRING(10),
    cfop: DataTypes.STRING(4),
    unidade: DataTypes.STRING(10),
  }, { 
    paranoid: true, 
    tableName: 'venda_itens',
    indexes: [
      { fields: ['saleId'] },
      { fields: ['produtoId'] },
    ]
  })

  SaleItem.associate = (models) => {
    SaleItem.belongsTo(models.Sale, { foreignKey: 'saleId', as: 'venda' })
    SaleItem.belongsTo(models.Produto, { foreignKey: 'produtoId', as: 'produto' })
  }

  return SaleItem
}