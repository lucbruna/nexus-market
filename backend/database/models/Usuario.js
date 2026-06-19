module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    nome: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(150), unique: true, allowNull: false },
    login: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    senha: { type: DataTypes.STRING(255), allowNull: false },
    perfil: { type: DataTypes.ENUM('admin', 'gerente', 'operador', 'estoquista', 'financeiro', 'consulta'), defaultValue: 'operador' },
    doisFatores: { type: DataTypes.BOOLEAN, defaultValue: false },
    secret2FA: DataTypes.STRING(100),
    ultimoAcesso: DataTypes.DATE,
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { paranoid: true, tableName: 'usuarios' })

  Usuario.associate = (models) => {
    if (models.Empresa) Usuario.belongsTo(models.Empresa, { foreignKey: 'empresaId' })
    if (models.Filial) Usuario.belongsTo(models.Filial, { foreignKey: 'filialId' })
  }

  return Usuario
}
