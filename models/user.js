import database from 'infra/database'
import { ValidatorError } from 'infra/errors'

async function create(userInputValues) {
  await verifyEmailDuplicated(userInputValues.email)
  await verifyUsernameDuplicated(userInputValues.username)

  const newUsers = insertUser(userInputValues)
  return newUsers

  async function verifyEmailDuplicated(email) {
    const result = await database.query({
      text: `
      SELECT
        email 
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
      ;`,
      values: [email],
    })

    if (result.rowCount > 0) {
      throw new ValidatorError({
        message: 'Email inválido.',
        action: 'Tente novamente com outro email.',
      })
    }
  }

  async function verifyUsernameDuplicated(username) {
    const result = await database.query({
      text: `
      SELECT
        username 
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
      ;`,
      values: [username],
    })

    if (result.rowCount > 0) {
      throw new ValidatorError({
        message: 'Username inválido.',
        action: 'Tente novamente com outro username.',
      })
    }
  }

  async function insertUser(userInputValues) {
    const result = await database.query({
      text: `
      INSERT INTO 
        users (username, email, password) 
      VALUES 
        ($1, $2, $3)
      RETURNING 
        *
      ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    })

    return result.rows[0]
  }
}

const user = { create }

export default user
