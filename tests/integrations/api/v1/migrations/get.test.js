import methods from 'infra/methods.js'
import orchastrador from 'tests/orchastrador.js'
beforeAll(async () => {
  await orchastrador.waitForAllServices()
  await orchastrador.clearDatabase()
})

describe('GET /api/v1/status', () => {
  describe('Anonymous user', () => {
    test('Retrieving pending migrations', async () => {
      const response = await methods.get(
        'http://localhost:3000/api/v1/migrations',
      )
      expect(response.status).toBe(200)
      const responseBody = await response.json()
      expect(Array.isArray(responseBody)).toBe(true)
      expect(responseBody.length).toBeGreaterThan(0)
    })
  })
})
