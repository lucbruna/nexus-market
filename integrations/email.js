class EmailIntegration {
  async enviar(destinatario, assunto, corpo) {
    console.log(`📧 Email para ${destinatario}: ${assunto}`)
    return { sucesso: true, messageId: `em_${Date.now()}` }
  }

  async enviarNF(destinatario, chaveAcesso, xml) {
    return this.enviar(destinatario, `NF-e ${chaveAcesso}`, `Segue em anexo a NF-e ${chaveAcesso}`)
  }

  async enviarRelatorio(destinatario, tipo, data) {
    return this.enviar(destinatario, `Relatório ${tipo} - ${data}`, `Segue relatório anexo.`)
  }
}

module.exports = new EmailIntegration()
