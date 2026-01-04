import { post } from 'utils/api.js'
import orchastrador from 'tests/orchastrador.js'
beforeAll(async () => {
  await orchastrador.waitForAllServices()
  await orchastrador.clearDatabase()
})
describe('GET /api/v1/status', () => {
  describe('Anonymous user', () => {
    describe('Running pending migrations', () => {
      test('For first time', async () => {
        const response = await post('http://localhost:3000/api/v1/migrations')
        expect(response.status).toBe(201)
        const responseBody = await response.json()
        expect(Array.isArray(responseBody)).toBe(true)
        expect(responseBody.length).toBeGreaterThan(0)
      })
      test('For second time', async () => {
        const response = await post('http://localhost:3000/api/v1/migrations')
        expect(response.status).toBe(200)
        const responseBody = await response.json()
        expect(Array.isArray(responseBody)).toBe(true)
        expect(responseBody.length).toBe(0)
      })
    })
  })
})
