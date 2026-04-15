import orchastrador from 'tests/orchastrador.js'
import { version as uuidVersion } from 'uuid'
beforeAll(async () => {
  await orchastrador.waitForAllServices()
  await orchastrador.clearDatabase()
  await orchastrador.runPendingMigrations()
})
describe('POST /api/v1/users', () => {
  describe('Anonymous user', () => {
    test('With unique valid data', async () => {
      const response = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username: 'gabrielconti',
          email: 'gabriel@gmail.com',
          password: 'abc123',
        }),
      })
      expect(response.status).toBe(201)

      const responseBody = await response.json()

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: 'gabrielconti',
        email: 'gabriel@gmail.com',
        password: 'abc123',
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      })

      expect(uuidVersion(responseBody.id)).toBe(4)
      expect(Date.parse(responseBody.created_at)).not.toBeNaN()
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN()
    })

    test("With duplicated 'email'", async () => {
      const response1 = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username: 'emailduplicado1',
          email: 'duplicado@gmail.com',
          password: 'abc123',
        }),
      })
      expect(response1.status).toBe(201)

      const response2 = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username: 'emailduplicado2',
          email: 'Duplicado@gmail.com',
          password: 'abc123',
        }),
      })
      expect(response2.status).toBe(400)

      const responseBody2 = await response2.json()

      expect(responseBody2).toEqual({
        name: 'ValidatorError',
        message: 'Email inválido.',
        action: 'Tente novamente com outro email.',
        status_code: 400,
      })
    })

    test("With duplicated 'username'", async () => {
      const response1 = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username: 'usernameduplicado',
          email: 'usernameduplicado1@gmail.com1',
          password: 'abc123',
        }),
      })
      expect(response1.status).toBe(201)

      const response2 = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username: 'UsernameDuplicado',
          email: 'usernameduplicado2@gmail.com',
          password: 'abc123',
        }),
      })
      expect(response2.status).toBe(400)

      const responseBody2 = await response2.json()

      expect(responseBody2).toEqual({
        name: 'ValidatorError',
        message: 'Username inválido.',
        action: 'Tente novamente com outro username.',
        status_code: 400,
      })
    })
  })
})
