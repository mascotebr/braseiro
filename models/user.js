import database from 'infra/database'
import { NotFoundError, ValidatorError } from 'infra/errors'
import password from 'models/password'

async function findOneById(id) {
  const user = selectOneById(id)
  return user

  async function selectOneById(id) {
    const result = await database.query({
      text: `
      SELECT
        * 
      FROM
        users
      WHERE
        id = $1
      ;`,
      values: [id],
    })

    if (result.rowCount == 0) {
      throw new NotFoundError({
        message: 'Usuário não encontrado.',
        action: 'Tente novamente com outro username.',
      })
    }

    return result.rows[0]
  }
}

async function findOneByUsername(username) {
  const newUsers = selectOneByUsername(username)
  return newUsers

  async function selectOneByUsername(username) {
    const result = await database.query({
      text: `
      SELECT
        * 
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
      ;`,
      values: [username],
    })

    if (result.rowCount == 0) {
      throw new NotFoundError({
        message: 'Usuário não encontrado.',
        action: 'Tente novamente com outro username.',
      })
    }

    return result.rows[0]
  }
}
async function findOneByEmail(email) {
  const newUsers = selectOneByEmail(email)
  return newUsers

  async function selectOneByEmail(email) {
    const result = await database.query({
      text: `
      SELECT
        * 
      FROM
        users
      WHERE
        email = $1
      ;`,
      values: [email],
    })

    if (result.rowCount == 0) {
      throw new NotFoundError({
        message: 'Usuário não encontrado.',
        action: 'Tente novamente com outro email.',
      })
    }

    return result.rows[0]
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
      message: 'O username informado já está sendo utilizado.',
      action: 'Tente novamente com outro username.',
    })
  }
}

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
      message: 'O email informado já está sendo utilizado.',
      action: 'Tente novamente com outro email.',
    })
  }
}

async function hashPasswordInObject(userInputValues) {
  userInputValues.password = await password.hash(userInputValues.password)
}

async function create(userInputValues) {
  await verifyUsernameDuplicated(userInputValues.username)
  await verifyEmailDuplicated(userInputValues.email)
  await hashPasswordInObject(userInputValues)

  const newUsers = insertUser(userInputValues)
  return newUsers

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

async function update(username, userInputValues) {
  const userInDB = await findOneByUsername(username)

  if ('username' in userInputValues) {
    await verifyUsernameDuplicated(userInputValues.username)
  }

  if ('email' in userInputValues) {
    await verifyEmailDuplicated(userInputValues.email)
  }

  if ('password' in userInputValues) {
    await hashPasswordInObject(userInputValues)
  }

  const userWithNewValues = { ...userInDB, ...userInputValues }
  const userUpdated = await runUpdateQuery(userWithNewValues)
  return userUpdated

  async function runUpdateQuery(userValues) {
    const result = await database.query({
      text: `
      UPDATE
        users
      SET
        username = $2,
        email = $3,
        password = $4,
        updated_at = timezone('utc',now())
      WHERE
        id = $1
      RETURNING 
        *
      ;`,
      values: [
        userValues.id,
        userValues.username,
        userValues.email,
        userValues.password,
      ],
    })

    return result.rows[0]
  }
}
const user = { create, findOneById, findOneByUsername, findOneByEmail, update }

export default user
