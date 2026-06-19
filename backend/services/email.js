const nodemailer = require('nodemailer')

let transporter = null

function getTransport() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: process.env.SMTP_PORT || 2525,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    })
  }
  return transporter
}

async function send(to, subject, html) {
  const info = await getTransport().sendMail({
    from: `"NEXUS Market AI" <${process.env.SMTP_FROM || 'noreply@nexusmarket.ai'}>`,
    to, subject, html
  })
  console.log(`Email enviado: ${info.messageId}`)
  return info
}

module.exports = { send }
