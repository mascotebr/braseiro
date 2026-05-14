import database from 'infra/database'
import crypto from 'node:crypto'

const EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1000 // 30 Days

async function create(userId) {
  const token = crypto.randomBytes(48).toString('hex')
  const expiredAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS)
  const newSession = await runInsertQuery(token, userId, expiredAt)

  return newSession

  async function runInsertQuery(token, userId, expiredAt) {
    const result = await database.query({
      text: `
        INSERT INTO
            sessions (token, user_id, expired_at)
        VALUES  
            ($1, $2, $3)
        RETURNING
            *
        ;`,
      values: [token, userId, expiredAt],
    })

    return result.rows[0]
  }
}

const session = {
  create,
  EXPIRATION_IN_MILLISECONDS,
}

export default session
