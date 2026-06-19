class SMSIntegration {
  async enviar(telefone, mensagem) {
    console.log(`📱 SMS para ${telefone}: ${mensagem.substring(0, 40)}...`)
    return { sucesso: true, id: `sms_${Date.now()}` }
  }

  async enviarCodigoVerificacao(telefone, codigo) {
    return this.enviar(telefone, `Seu código de verificação NEXUS: ${codigo}`)
  }
}

module.exports = new SMSIntegration()
