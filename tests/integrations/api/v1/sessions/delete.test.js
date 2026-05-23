import session from 'models/session'
import orchastrador from 'tests/orchastrador.js'
import { version as uuidVersion } from 'uuid'
import setCookieParse from 'set-cookie-parser'

beforeAll(async () => {
  await orchastrador.waitForAllServices()
  await orchastrador.clearDatabase()
  await orchastrador.runPendingMigrations()
})
describe('DELETE /api/v1/sessions', () => {
  describe('Default user', () => {
    test('With expired session', async () => {
      jest.useFakeTimers({
        now: new Date(new Date() - session.EXPIRATION_IN_MILLISECONDS),
      })

      const userCreated = await orchastrador.createUser({
        username: 'UserExpiredSession',
      })

      const sessionObject = await orchastrador.createSession(userCreated.id)

      jest.useRealTimers()

      const response = await fetch('http://localhost:3000/api/v1/sessions', {
        method: 'DELETE',
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      })
      const responseBody = await response.json()
      expect(responseBody).toEqual({
        name: 'UnauthorizedError',
        status_code: 401,
        message: 'Usuário não possui sessão ativa.',
        action: 'Verifique se o usuário está logado e tente novamente.',
      })
    })

    test('With nonexitent session', async () => {
      const invalidToken =
        'bd971c7e59d76d9c42d0af4cb9113557184052eadaa1c14f95dc07ab08fc52b382e598a97e3f1cb7cf77cb6dfa0d5240'

      const response = await fetch('http://localhost:3000/api/v1/sessions', {
        method: 'DELETE',
        headers: {
          Cookie: `session_id=${invalidToken}`,
        },
      })
      expect(response.status).toBe(401)
      const responseBody = await response.json()
      expect(responseBody).toEqual({
        name: 'UnauthorizedError',
        status_code: 401,
        message: 'Usuário não possui sessão ativa.',
        action: 'Verifique se o usuário está logado e tente novamente.',
      })
    })

    test('With valid session', async () => {
      const userCreated = await orchastrador.createUser({
        username: 'UserValidSession',
      })

      const sessionObject = await orchastrador.createSession(userCreated.id)

      const response = await fetch('http://localhost:3000/api/v1/sessions', {
        method: 'DELETE',
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      })
      const responseBody = await response.json()

      expect(responseBody).toEqual({
        id: sessionObject.id,
        token: sessionObject.token,
        user_id: sessionObject.user_id,
        expired_at: responseBody.expired_at,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      })

      expect(uuidVersion(responseBody.id)).toBe(4)
      expect(Date.parse(responseBody.created_at)).not.toBeNaN()
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN()

      expect(
        responseBody.updated_at > sessionObject.updated_at.toISOString(),
      ).toBe(true)
      expect(
        responseBody.expired_at < sessionObject.expired_at.toISOString(),
      ).toBe(true)

      //Set-Cookie assertions

      const parsedSetCookie = setCookieParse(response, {
        map: true,
      })

      expect(parsedSetCookie.session_id).toEqual({
        name: 'session_id',
        value: 'invalid',
        maxAge: -1,
        path: '/',
        httpOnly: true,
      })

      //Double-Check session
      const response2 = await fetch('http://localhost:3000/api/v1/user', {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      })
      const response2Body = await response2.json()
      expect(response2Body).toEqual({
        name: 'UnauthorizedError',
        status_code: 401,
        message: 'Usuário não possui sessão ativa.',
        action: 'Verifique se o usuário está logado e tente novamente.',
      })
    })
  })
})
