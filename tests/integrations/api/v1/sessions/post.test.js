import session from 'models/session'
import orchastrador from 'tests/orchastrador.js'
import { version as uuidVersion } from 'uuid'
import setCookieParse from 'set-cookie-parser'

beforeAll(async () => {
  await orchastrador.waitForAllServices()
  await orchastrador.clearDatabase()
  await orchastrador.runPendingMigrations()
})
describe('POST /api/v1/users', () => {
  describe('Anonymous user', () => {
    test("With incorrect 'email' but correct 'password'", async () => {
      await orchastrador.createUser({ password: 'abc123' })

      const response = await fetch('http://localhost:3000/api/v1/sessions', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          email: 'email.errado@gmail.com',
          password: 'abc123',
        }),
      })

      expect(response.status).toBe(401)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        name: 'UnauthorizedError',
        message: 'Dados não conferem.',
        action: 'Tente novamente com outras credenciais.',
        status_code: 401,
      })
    })

    test("With correct 'email' but incorrects 'pasword'", async () => {
      await orchastrador.createUser({ email: 'senha.errada@gmail.com' })

      const response = await fetch('http://localhost:3000/api/v1/sessions', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          email: 'senha.errada@gmail.com',
          password: 'senha.errada',
        }),
      })

      expect(response.status).toBe(401)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        name: 'UnauthorizedError',
        message: 'Dados não conferem.',
        action: 'Tente novamente com outras credenciais.',
        status_code: 401,
      })
    })

    test("With incorrect 'email' and incorrect'password'", async () => {
      await orchastrador.createUser({})
      const response = await fetch('http://localhost:3000/api/v1/sessions', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          email: 'email.errado@gmail.com',
          password: 'senha.errada',
        }),
      })

      expect(response.status).toBe(401)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        name: 'UnauthorizedError',
        message: 'Dados não conferem.',
        action: 'Tente novamente com outras credenciais.',
        status_code: 401,
      })
    })

    test("With correct 'email' and correct 'password'", async () => {
      const userCreated = await orchastrador.createUser({
        email: 'email.correto@gmail.com',
        password: 'senha.correta',
      })
      const response = await fetch('http://localhost:3000/api/v1/sessions', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          email: 'email.correto@gmail.com',
          password: 'senha.correta',
        }),
      })

      expect(response.status).toBe(201)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        id: responseBody.id,
        token: responseBody.token,
        user_id: userCreated.id,
        expired_at: responseBody.expired_at,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      })

      expect(uuidVersion(responseBody.id)).toBe(4)
      expect(Date.parse(responseBody.expired_at)).not.toBeNaN()
      expect(Date.parse(responseBody.created_at)).not.toBeNaN()
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN()

      const expiredAt = new Date(responseBody.expired_at)
      const createAt = new Date(responseBody.created_at)

      expiredAt.setMilliseconds(0)
      createAt.setMilliseconds(0)

      expect(expiredAt - createAt).toEqual(session.EXPIRATION_IN_MILLISECONDS)

      const parsedSetCookie = setCookieParse(response, {
        map: true,
      })

      expect(parsedSetCookie.session_id).toEqual({
        name: 'session_id',
        value: responseBody.token,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        path: '/',
        httpOnly: true,
      })
    })
  })
})
