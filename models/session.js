import database from 'infra/database'
import { UnauthorizedError } from 'infra/errors'
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

async function findOneByValidToken(sessionId) {
  const validSession = await runSelectQuery(sessionId)
  return validSession

  async function runSelectQuery(token) {
    const result = await database.query({
      text: `
          SELECT
            *
          FROM  
            sessions
          WHERE
            token = $1
            AND expired_at > NOW()
          LIMIT
            1
          ;`,
      values: [token],
    })
    if (result.rowCount === 0) {
      throw new UnauthorizedError({
        message: 'Usuário não possui sessão ativa.',
        action: 'Verifique se o usuário está logado e tente novamente.',
      })
    }
    return result.rows[0]
  }
}

async function renew(sessionId) {
  const expiredAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS)

  const updatedSession = await runUpdateQuery(sessionId, expiredAt)
  return updatedSession

  async function runUpdateQuery(sessionId, expiredAt) {
    const result = await database.query({
      text: `
        UPDATE
          sessions
        SET 
          expired_at = $2,
          updated_at = NOW()
        WHERE 
          id = $1
        RETURNING
          *
      ;`,
      values: [sessionId, expiredAt],
    })

    return result.rows[0]
  }
}

async function expireById(sessionId) {
  const updatedSession = await runUpdateQuery(sessionId)
  return updatedSession

  async function runUpdateQuery(sessionId) {
    const result = await database.query({
      text: `
        UPDATE
          sessions
        SET 
          expired_at = NOW(),
          updated_at = NOW()
        WHERE 
          id = $1
        RETURNING
          *
      ;`,
      values: [sessionId],
    })

    return result.rows[0]
  }
}

const session = {
  create,
  renew,
  findOneByValidToken,
  expireById,
  EXPIRATION_IN_MILLISECONDS,
}

export default session
