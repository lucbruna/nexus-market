module.exports = (sequelize, DataTypes) => {
  const Empresa = sequelize.define('Empresa', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    cnpj: { type: DataTypes.STRING(18), allowNull: false, unique: true },
    razaoSocial: { type: DataTypes.STRING(200), allowNull: false },
    nomeFantasia: { type: DataTypes.STRING(200) },
    inscricaoEstadual: { type: DataTypes.STRING(20) },
    inscricaoMunicipal: { type: DataTypes.STRING(20) },
    regimeTributario: { type: DataTypes.ENUM('SN', 'LP', 'LR', 'MEI'), defaultValue: 'SN' },
    cep: DataTypes.STRING(9),
    endereco: DataTypes.STRING(200),
    numero: DataTypes.STRING(10),
    complemento: DataTypes.STRING(100),
    bairro: DataTypes.STRING(100),
    cidade: DataTypes.STRING(100),
    uf: DataTypes.STRING(2),
    telefone: DataTypes.STRING(20),
    email: DataTypes.STRING(100),
    logo: DataTypes.STRING(500),
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { paranoid: true, tableName: 'empresas' })

  Empresa.associate = (models) => {
    if (models.Filial) Empresa.hasMany(models.Filial, { foreignKey: 'empresaId' })
    if (models.Usuario) Empresa.hasMany(models.Usuario, { foreignKey: 'empresaId' })
  }

  return Empresa
}
