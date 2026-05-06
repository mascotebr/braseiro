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
      const response1 = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username: 'UsuarioParaUpdate',
          email: 'usuarioparaupdate@gmail.com',
          password: 'abc123',
        }),
      })
      expect(response1.status).toBe(201)

      const response2 = await fetch(
        'http://localhost:3000/api/v1/users/UsuarioNaoExistente',
        {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            username: 'UsuarioNaoExistente2',
          }),
        },
      )
      expect(response2.status).toBe(404)

      const responseBody2 = await response2.json()
      expect(responseBody2).toEqual({
        name: 'NotFoundError',
        message: 'Usuário não encontrado.',
        action: 'Tente novamente com outro username.',
        status_code: 404,
      })
    })

    test("With duplicated 'username'", async () => {
      const response1 = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username: 'usernameduplicado1',
          email: 'usernameduplicado1@gmail.com',
          password: 'abc123',
        }),
      })
      expect(response1.status).toBe(201)

      const response2 = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username: 'usernameduplicado2',
          email: 'usernameduplicado2@gmail.com',
          password: 'abc123',
        }),
      })
      expect(response2.status).toBe(201)

      const response3 = await fetch(
        'http://localhost:3000/api/v1/users/usernameduplicado2',
        {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            username: 'usernameduplicado1',
          }),
        },
      )
      expect(response3.status).toBe(400)

      const responseBody3 = await response3.json()

      expect(responseBody3).toEqual({
        name: 'ValidatorError',
        message: 'O username informado já está sendo utilizado.',
        action: 'Tente novamente com outro username.',
        status_code: 400,
      })
    })

    test("With duplicated 'email'", async () => {
      const response1 = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username: 'emailduplicado1',
          email: 'emailduplicado1@gmail.com',
          password: 'abc123',
        }),
      })
      expect(response1.status).toBe(201)

      const response2 = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username: 'emailduplicado2',
          email: 'emailduplicado2@gmail.com',
          password: 'abc123',
        }),
      })
      expect(response2.status).toBe(201)

      const response3 = await fetch(
        'http://localhost:3000/api/v1/users/emailduplicado2',
        {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            email: 'emailduplicado1@gmail.com',
          }),
        },
      )
      expect(response3.status).toBe(400)

      const responseBody3 = await response3.json()

      expect(responseBody3).toEqual({
        name: 'ValidatorError',
        message: 'O email informado já está sendo utilizado.',
        action: 'Tente novamente com outro email.',
        status_code: 400,
      })
    })

    test("With unique 'username'", async () => {
      const response = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username: 'uniqueUser',
          email: 'uniqueUser@gmail.com',
          password: 'abc123',
        }),
      })
      expect(response.status).toBe(201)
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
        email: 'uniqueUser@gmail.com',
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
      const response = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username: 'uniqueEmail',
          email: 'uniqueEmail@gmail.com',
          password: 'abc123',
        }),
      })
      expect(response.status).toBe(201)
      const response2 = await fetch(
        'http://localhost:3000/api/v1/users/uniqueEmail',
        {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            email: 'uniqueEmail2@gmail.com',
          }),
        },
      )
      expect(response2.status).toBe(200)
      const responseBody2 = await response2.json()

      expect(responseBody2).toEqual({
        id: responseBody2.id,
        username: 'uniqueEmail',
        email: 'uniqueEmail2@gmail.com',
        password: responseBody2.password,
        created_at: responseBody2.created_at,
        updated_at: responseBody2.updated_at,
      })

      expect(uuidVersion(responseBody2.id)).toBe(4)
      expect(Date.parse(responseBody2.created_at)).not.toBeNaN()
      expect(Date.parse(responseBody2.updated_at)).not.toBeNaN()

      expect(responseBody2.updated_at > responseBody2.created_at).toBe(true)
    })

    test("With hashed 'password'", async () => {
      const response = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username: 'uniqueUser',
          email: 'uniqueEmail@gmail.com',
          password: 'abc123',
        }),
      })
      expect(response.status).toBe(201)
      const response2 = await fetch(
        'http://localhost:3000/api/v1/users/uniqueUser',
        {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            password: 'newPassword',
          }),
        },
      )
      expect(response2.status).toBe(200)
      const responseBody2 = await response2.json()

      expect(responseBody2).toEqual({
        id: responseBody2.id,
        username: 'uniqueUser',
        email: 'uniqueEmail@gmail.com',
        password: responseBody2.password,
        created_at: responseBody2.created_at,
        updated_at: responseBody2.updated_at,
      })

      expect(uuidVersion(responseBody2.id)).toBe(4)
      expect(Date.parse(responseBody2.created_at)).not.toBeNaN()
      expect(Date.parse(responseBody2.updated_at)).not.toBeNaN()

      expect(responseBody2.updated_at > responseBody2.created_at).toBe(true)

      const userInDB = await user.findOneByUsername('uniqueUser')

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
