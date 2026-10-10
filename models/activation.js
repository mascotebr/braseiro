import email from 'infra/email'

async function sendEmailToUser(user) {
  await email.send({
    from: '<contato@braseiro.com.br>',
    to: user.email,
    subject: 'Ative seu cadastro no Braseiro!',
    text: `${user.username}, click no link abaixo para ativar seu cadastro no Braseiro:

Atenciosamente, 
Equipe Braseiro`,
  })
}

const activation = {
  sendEmailToUser,
}

export default activation
