import { NotFoundError, UnauthorizedError } from 'infra/errors'
import user from 'models/user'
import password from './password'
async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const userInDB = await findUserByEmail(providedEmail)
    await validatePassword(providedPassword, userInDB.password)

    return userInDB
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: 'Dados não conferem.',
        action: 'Tente novamente com outras credenciais.',
      })
    }

    throw error
  }

  async function findUserByEmail(providedEmail) {
    let userInDB
    try {
      userInDB = await user.findOneByEmail(providedEmail)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: 'Email incorreto.',
          action: 'Tente novamente com outras credenciais.',
        })
      }

      throw error
    }

    return userInDB
  }

  async function validatePassword(providedPassword, hashPassword) {
    const passwordMatch = await password.compare(providedPassword, hashPassword)

    if (!passwordMatch) {
      throw new UnauthorizedError({
        message: 'Senha incorreta.',
        action: 'Tente novamente com outras credenciais.',
      })
    }
  }
}

const authenticator = {
  getAuthenticatedUser,
}

export default authenticator
