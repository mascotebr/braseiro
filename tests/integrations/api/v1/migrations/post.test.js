import { post } from 'utils/api.js'
import database from 'infra/database.js'
import orchastrador from 'tests/orchastrador.js'
beforeAll(async () => {
  await orchastrador.waitForAllServices()
  await database.query('drop schema public cascade; create schema public; ')
})
describe('GET /api/v1/status', () => {
  describe('Anonymous user', () => {
    describe('Running pending migrations', () => {
      test('For first time', async () => {
        const response = await post('migrations')
        expect(response.status).toBe(201)
        const responseBody = await response.json()
        expect(Array.isArray(responseBody)).toBe(true)
        expect(responseBody.length).toBeGreaterThan(0)
      })
      test('For second time', async () => {
        const response = await post('migrations', {
          method: 'POST',
        })
        expect(response.status).toBe(200)
        const responseBody = await response.json()
        expect(Array.isArray(responseBody)).toBe(true)
        expect(responseBody.length).toBe(0)
      })
    })
  })
})
