import orchastrador from 'tests/orchastrador.js'
import { version as uuidVersion } from 'uuid'
import user from 'models/user'
import password from 'models/password'

beforeAll(async () => {
  await orchastrador.waitForAllServices()
  await orchastrador.clearDatabase()
  await orchastrador.runPendingMigrations()
})

describe('PATCH /api/v1/[username]', () => {
  describe('Anonymous user', () => {
    test("With nonexistent 'username'", async () => {
      const response = await fetch(
        'http://localhost:3000/api/v1/users/UsuarioNaoExistente',
        {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            username: 'UsuarioNaoExistente2',
          }),
        },
      )
      expect(response.status).toBe(404)

      const responseBody = await response.json()
      expect(responseBody).toEqual({
        name: 'NotFoundError',
        message: 'Usuário não encontrado.',
        action: 'Tente novamente com outro username.',
        status_code: 404,
      })
    })

    test("With duplicated 'username'", async () => {
      await orchastrador.createUser({
        username: 'usernameduplicado1',
      })

      await orchastrador.createUser({
        username: 'usernameduplicado2',
      })

      const response = await fetch(
        'http://localhost:3000/api/v1/users/usernameduplicado2',
        {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            username: 'usernameduplicado1',
          }),
        },
      )
      expect(response.status).toBe(400)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        name: 'ValidatorError',
        message: 'O username informado já está sendo utilizado.',
        action: 'Tente novamente com outro username.',
        status_code: 400,
      })
    })

    test("With duplicated 'email'", async () => {
      await orchastrador.createUser({
        email: 'emailduplicado1@gmail.com',
      })

      const user2 = await orchastrador.createUser({
        email: 'emailduplicado2@gmail',
      })

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${user2.username}`,
        {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            email: 'emailduplicado1@gmail.com',
          }),
        },
      )
      expect(response.status).toBe(400)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        name: 'ValidatorError',
        message: 'O email informado já está sendo utilizado.',
        action: 'Tente novamente com outro email.',
        status_code: 400,
      })
    })

    test("With unique 'username'", async () => {
      await orchastrador.createUser({
        username: 'uniqueUser',
      })

      const response2 = await fetch(
        'http://localhost:3000/api/v1/users/uniqueUser',
        {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            username: 'uniqueUser2',
          }),
        },
      )
      expect(response2.status).toBe(200)
      const responseBody2 = await response2.json()

      expect(responseBody2).toEqual({
        id: responseBody2.id,
        username: 'uniqueUser2',
        email: responseBody2.email,
        password: responseBody2.password,
        created_at: responseBody2.created_at,
        updated_at: responseBody2.updated_at,
      })

      expect(uuidVersion(responseBody2.id)).toBe(4)
      expect(Date.parse(responseBody2.created_at)).not.toBeNaN()
      expect(Date.parse(responseBody2.updated_at)).not.toBeNaN()

      expect(responseBody2.updated_at > responseBody2.created_at).toBe(true)
    })

    test("With unique 'email'", async () => {
      const userCreated = await orchastrador.createUser({
        email: 'uniqueEmail@gmail.com',
      })

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${userCreated.username}`,
        {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            email: 'uniqueEmail2@gmail.com',
          }),
        },
      )
      expect(response.status).toBe(200)
      const responseBody = await response.json()

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: responseBody.username,
        email: 'uniqueEmail2@gmail.com',
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      })

      expect(uuidVersion(responseBody.id)).toBe(4)
      expect(Date.parse(responseBody.created_at)).not.toBeNaN()
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN()

      expect(responseBody.updated_at > responseBody.created_at).toBe(true)
    })

    test("With new 'password'", async () => {
      const userCreated = await orchastrador.createUser({
        password: 'abc123',
      })
      const response = await fetch(
        `http://localhost:3000/api/v1/users/${userCreated.username}`,
        {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            password: 'newPassword',
          }),
        },
      )
      expect(response.status).toBe(200)

      const userInDB = await user.findOneByUsername(userCreated.username)

      const passwordCorrectMatch = await password.compare(
        'newPassword',
        userInDB.password,
      )

      const passwordIncorrectMatch = await password.compare(
        'SenhaErrada',
        userInDB.password,
      )

      expect(passwordCorrectMatch).toBe(true)
      expect(passwordIncorrectMatch).toBe(false)
    })
  })
})
