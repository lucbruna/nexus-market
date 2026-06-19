module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define('Sale', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    empresaId: { type: DataTypes.UUID, allowNull: false },
    filialId: { type: DataTypes.UUID, allowNull: false },
    usuarioId: { type: DataTypes.UUID, allowNull: false },
    clienteId: { type: DataTypes.UUID, allowNull: true },
    numero: { type: DataTypes.INTEGER, allowNull: false },
    serie: { type: DataTypes.INTEGER, defaultValue: 1 },
    status: { type: DataTypes.ENUM('aberta', 'finalizada', 'cancelada', 'pendente'), defaultValue: 'aberta' },
    subtotal: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    desconto: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    acrescimo: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    total: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    formaPagamento: { type: DataTypes.STRING(50) },
    observacoes: DataTypes.TEXT,
    dataVenda: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    nfeChave: DataTypes.STRING(44),
    nfeProtocolo: DataTypes.STRING(50),
    nfeStatus: DataTypes.STRING(50),
  }, { 
    paranoid: true, 
    tableName: 'vendas',
    indexes: [
      { fields: ['empresaId', 'filialId', 'numero', 'serie'], unique: true },
      { fields: ['empresaId', 'filialId', 'dataVenda'] },
      { fields: ['clienteId'] },
      { fields: ['status'] },
    ]
  })

  Sale.associate = (models) => {
    if (models.Empresa) Sale.belongsTo(models.Empresa, { foreignKey: 'empresaId', as: 'empresa' })
    if (models.Filial) Sale.belongsTo(models.Filial, { foreignKey: 'filialId', as: 'filial' })
    if (models.Usuario) Sale.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario' })
    if (models.Cliente) Sale.belongsTo(models.Cliente, { foreignKey: 'clienteId', as: 'cliente' })
    if (models.SaleItem) Sale.hasMany(models.SaleItem, { foreignKey: 'saleId', as: 'itens' })
    if (models.Pagamento) Sale.hasMany(models.Pagamento, { foreignKey: 'saleId', as: 'pagamentos' })
  }

  return Sale
}
