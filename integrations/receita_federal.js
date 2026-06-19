class ReceitaFederal {
  async consultarCNPJ(cnpj) {
    return {
      cnpj,
      razaoSocial: 'EMPRESA EXEMPLO LTDA',
      nomeFantasia: 'Exemplo',
      situacao: 'ativa',
      cnae: '4711102',
      endereco: { cep: '01001000', logradouro: 'Rua Exemplo', numero: '100', bairro: 'Centro', cidade: 'São Paulo', uf: 'SP' },
    }
  }

  async consultarCPF(cpf) {
    return { cpf, nome: 'FULANO DE TAL', situacao: 'regular', dataNascimento: '01/01/1990' }
  }

  async consultarNCM(ncm) {
    return { ncm, descricao: 'Outras preparações alimentícias não especificadas', aliqICMS: 18, aliqIPI: 0 }
  }
}

module.exports = new ReceitaFederal()
