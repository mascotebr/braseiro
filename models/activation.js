import email from 'infra/email'
import database from 'infra/database'
import webserver from 'infra/webserver'
import { NotFoundError } from 'infra/errors'
const EXPIRATION_IN_MILLISECONDS = 60 * 15 * 1000 // 15 minutes
async function create(userId) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS)

  const newToken = await runInsertQuery(userId, expiresAt)
  return newToken

  async function runInsertQuery(userId, expiresAt) {
    const result = await database.query({
      text: `
        INSERT INTO
            user_activation_tokens (user_id, expired_at)
        VALUES  
            ($1, $2)
        RETURNING
            *
        ;`,
      values: [userId, expiresAt],
    })

    return result.rows[0]
  }
}

async function findOneValidById(tokenId) {
  const token = await runSelectQuery(tokenId)
  return token

  async function runSelectQuery(tokenId) {
    const result = await database.query({
      text: `
          SELECT
            *
          FROM  
            user_activation_tokens
          WHERE
            id = $1 
            AND expired_at > NOW()
            AND used_at IS NULL
          LIMIT
            1
          ;`,
      values: [tokenId],
    })
    if (result.rowCount === 0) {
      throw new NotFoundError({
        message:
          'O token de ativação não foi encontrado no sistema ou expirou.',
        action: 'Faça um novo cadastro.',
      })
    }
    return result.rows[0]
  }
}
async function sendEmailToUser(user, activationToken) {
  await email.send({
    from: '<contato@braseiro.com.br>',
    to: user.email,
    subject: 'Ative seu cadastro no Braseiro!',
    text: `${user.username}, click no link abaixo para ativar seu cadastro no Braseiro:

${webserver.origin}/cadastro/ativar/${activationToken.id}

Atenciosamente, 
Equipe Braseiro`,
  })
}

const activation = {
  create,
  findOneValidById,
  sendEmailToUser,
}

export default activation
